//! AuraFlora Backend Library
//!
//! Exposes core DSP modules, configuration, HTTP handlers, and services.

pub mod config;
pub mod dsp;
pub mod handlers;
pub mod services;

use axum::{
    extract::Path,
    http::{HeaderValue, Method, StatusCode},
    response::{IntoResponse, Response},
    routing::{get, post},
    Json, Router,
};
use serde_json::json;
use std::sync::Arc;
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;

use crate::config::AppConfig;
use crate::handlers::ground::{ground_handler, AppState};

/// Assemble the complete application router with state and middleware.
pub fn create_app(config: AppConfig) -> Router {
    let state: AppState = Arc::new(config);

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST, Method::OPTIONS])
        .allow_headers(Any);

    Router::new()
        .route("/health", get(health_handler))
        .route("/api/v1/ground", post(ground_handler))
        .route("/audio/:filename", get(audio_file_handler))
        .with_state(state)
        .layer(cors)
        .layer(TraceLayer::new_for_http())
}

/// GET /health — liveness check handler.
pub async fn health_handler() -> Json<serde_json::Value> {
    Json(json!({
        "status": "ok",
        "version": env!("CARGO_PKG_VERSION"),
        "service": "aura-flora-backend"
    }))
}

/// GET /audio/:filename — serve synthesized MP3 files.
pub async fn audio_file_handler(
    axum::extract::State(config): axum::extract::State<AppState>,
    Path(filename): Path<String>,
) -> Response {
    // Sanitize: only allow UUID-named .mp3 files without directory traversal
    if !filename.ends_with(".mp3")
        || filename.contains('/')
        || filename.contains('\\')
        || filename.contains("..")
    {
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
