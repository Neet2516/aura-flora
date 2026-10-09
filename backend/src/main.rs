//! AuraFlora Rust Backend — Axum HTTP Server
//!
//! Entry point: sets up tracing, loads config, assembles the Axum router,
//! and binds the TCP listener.

mod config;
mod dsp;
mod handlers;
mod services;

use std::sync::Arc;

use axum::{
    extract::Path,
    http::{HeaderValue, Method, StatusCode},
    response::{IntoResponse, Response},
    routing::{get, post},
    Json, Router,
};
use serde_json::json;
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;
use tracing::{error, info};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt, EnvFilter};

use crate::config::AppConfig;
use crate::handlers::ground::{ground_handler, AppState};

#[tokio::main]
async fn main() {
    // Initialize structured logging
    tracing_subscriber::registry()
        .with(EnvFilter::try_from_default_env().unwrap_or_else(|_| "info".into()))
        .with(tracing_subscriber::fmt::layer().compact())
        .init();

    // Load configuration
    let config = match AppConfig::from_env() {
        Ok(cfg) => {
            info!(
                port = cfg.port,
                integration = cfg.is_full_integration(),
                "AuraFlora backend starting"
            );
            cfg
        }
        Err(e) => {
            error!("Configuration error: {}", e);
            std::process::exit(1);
        }
    };

    let port = config.port;
    let audio_dir = config.audio_temp_dir.clone();

    // Create audio temp directory
    if let Err(e) = std::fs::create_dir_all(&audio_dir) {
        error!("Cannot create audio temp dir {}: {}", audio_dir, e);
        std::process::exit(1);
    }

    let state: AppState = Arc::new(config);

    // CORS — allow Flutter dev origins
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST, Method::OPTIONS])
        .allow_headers(Any);

    // Build router
    let app = Router::new()
        .route("/health", get(health_handler))
        .route("/api/v1/ground", post(ground_handler))
        .route("/audio/:filename", get(audio_file_handler))
        .with_state(state)
        .layer(cors)
        .layer(TraceLayer::new_for_http());

    let bind_addr = format!("0.0.0.0:{}", port);
    let listener = match tokio::net::TcpListener::bind(&bind_addr).await {
        Ok(l) => {
            info!("Listening on {}", bind_addr);
            l
        }
        Err(e) => {
            error!("Failed to bind {}: {}", bind_addr, e);
            std::process::exit(1);
        }
    };

    if let Err(e) = axum::serve(listener, app).await {
        error!("Server error: {}", e);
    }
}

/// GET /health — liveness check.
async fn health_handler() -> Json<serde_json::Value> {
    Json(json!({
        "status": "ok",
        "version": env!("CARGO_PKG_VERSION"),
        "service": "aura-flora-backend"
    }))
}

/// GET /audio/:filename — serve temporary synthesized MP3 files.
async fn audio_file_handler(
    axum::extract::State(config): axum::extract::State<AppState>,
    Path(filename): Path<String>,
) -> Response {
    // Sanitize: only allow UUID-named .mp3 files
    if !filename.ends_with(".mp3") || filename.contains('/') || filename.contains("..") {
        return (StatusCode::BAD_REQUEST, "Invalid filename").into_response();
    }

    let path = std::path::Path::new(&config.audio_temp_dir).join(&filename);

    match tokio::fs::read(&path).await {
        Ok(bytes) => {
            let mut response = (StatusCode::OK, bytes).into_response();
            response.headers_mut().insert(
                axum::http::header::CONTENT_TYPE,
                HeaderValue::from_static("audio/mpeg"),
            );
            response.headers_mut().insert(
                axum::http::header::CACHE_CONTROL,
                HeaderValue::from_static("no-cache, no-store"),
            );
            response
        }
        Err(_) => (StatusCode::NOT_FOUND, "Audio file not found").into_response(),
    }
}
