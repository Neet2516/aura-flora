//! AuraFlora Rust Backend — Binary Entrypoint
//!
//! Entry point: sets up tracing, loads configuration, instantiates the Axum router,
//! and binds the TCP listener.

use tracing::{error, info};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt, EnvFilter};

use aura_flora_backend::{config::AppConfig, create_app};

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

    // Ensure audio temp directory exists
    if let Err(e) = std::fs::create_dir_all(&audio_dir) {
        error!("Cannot create audio temp dir {}: {}", audio_dir, e);
        std::process::exit(1);
    }

    // Assemble router from library
    let app = create_app(config);

    let bind_addr = format!("0.0.0.0:{}", port);
    let listener = match tokio::net::TcpListener::bind(&bind_addr).await {
        Ok(l) => {
            info!("AuraFlora backend listening on {}", bind_addr);
            l
        }
        Err(e) => {
            error!("Failed to bind {}: {}", bind_addr, e);
            std::process::exit(1);
        }
    };

    if let Err(e) = axum::serve(listener, app).await {
        error!("Server runtime error: {}", e);
    }
}
