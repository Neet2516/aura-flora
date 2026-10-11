//! End-to-end integration tests for AuraFlora Axum HTTP API.

use axum::{
    body::Body,
    http::{Request, StatusCode},
};
use base64::{engine::general_purpose::STANDARD, Engine};
use serde_json::{json, Value};
use tower::ServiceExt;

use aura_flora_backend::{config::AppConfig, create_app};

fn test_config() -> AppConfig {
    AppConfig {
        port: 8080,
        gemma_api_key: String::new(),
        gemma_model: "gemma-2b-it".to_string(),
        elevenlabs_api_key: String::new(),
        elevenlabs_voice_id: "EXAVITQu4vr4xnSDxMaL".to_string(),
        tabpfn_api_key: String::new(),
        tabpfn_endpoint: "https://api.priorlabs.ai/v1/tabpfn".to_string(),
        audio_temp_dir: std::env::temp_dir()
            .join("aura-flora-test-audio")
            .to_string_lossy()
            .to_string(),
    }
}

#[tokio::test]
async fn test_health_check_endpoint() {
    let app = create_app(test_config());

    let response = app
        .oneshot(
            Request::builder()
                .uri("/health")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);

    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let json: Value = serde_json::from_slice(&body).unwrap();

    assert_eq!(json["status"], "ok");
    assert_eq!(json["service"], "aura-flora-backend");
}

#[tokio::test]
async fn test_audio_endpoint_rejects_directory_traversal() {
    let app = create_app(test_config());

    let response = app
        .oneshot(
            Request::builder()
                .uri("/audio/..%2Fsecret.mp3")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::BAD_REQUEST);
}

#[tokio::test]
async fn test_audio_endpoint_returns_404_for_missing_file() {
    let app = create_app(test_config());

    let response = app
        .oneshot(
            Request::builder()
                .uri("/audio/00000000-0000-0000-0000-000000000000.mp3")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::NOT_FOUND);
}

#[tokio::test]
async fn test_ground_endpoint_rejects_invalid_sample_rate() {
    let app = create_app(test_config());

    let payload = json!({
        "audio_b64": "AAAA",
        "sample_rate": 4000 // below supported min of 8000
    });

    let response = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/api/v1/ground")
                .header("Content-Type", "application/json")
                .body(Body::from(serde_json::to_vec(&payload).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::BAD_REQUEST);

    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let json: Value = serde_json::from_slice(&body).unwrap();
    assert_eq!(json["code"], "INVALID_SAMPLE_RATE");
}

#[tokio::test]
async fn test_ground_endpoint_rejects_invalid_base64() {
    let app = create_app(test_config());

    let payload = json!({
        "audio_b64": "!!!not_valid_base64!!!",
        "sample_rate": 16000
    });

    let response = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/api/v1/ground")
                .header("Content-Type", "application/json")
                .body(Body::from(serde_json::to_vec(&payload).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::BAD_REQUEST);

    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let json: Value = serde_json::from_slice(&body).unwrap();
    assert_eq!(json["code"], "INVALID_BASE64");
}

#[tokio::test]
async fn test_ground_endpoint_rejects_too_short_audio() {
    let app = create_app(test_config());

    // 100 bytes is less than the 512-byte minimum
    let tiny_audio = vec![0u8; 100];
    let payload = json!({
        "audio_b64": STANDARD.encode(&tiny_audio),
        "sample_rate": 16000
    });

    let response = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/api/v1/ground")
                .header("Content-Type", "application/json")
                .body(Body::from(serde_json::to_vec(&payload).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::BAD_REQUEST);

    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let json: Value = serde_json::from_slice(&body).unwrap();
    assert_eq!(json["code"], "AUDIO_TOO_SHORT");
}

#[tokio::test]
async fn test_ground_endpoint_processes_valid_audio_cleanly() {
    let app = create_app(test_config());

    // Generate 1 second of 16 kHz 16-bit PCM (16000 samples = 32000 bytes)
    // Sine wave at 3000 Hz (typical birdsong biophony frequency)
    let sample_rate = 16000.0f32;
    let freq = 3000.0f32;
    let mut pcm_bytes = Vec::with_capacity(32000);

    for i in 0..16000 {
        let t = i as f32 / sample_rate;
        let sample = (2.0 * std::f32::consts::PI * freq * t).sin();
        let i16_val = (sample * 16384.0) as i16;
        pcm_bytes.extend_from_slice(&i16_val.to_le_bytes());
    }

    let payload = json!({
        "audio_b64": STANDARD.encode(&pcm_bytes),
        "sample_rate": 16000
    });

    let response = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/api/v1/ground")
                .header("Content-Type", "application/json")
                .body(Body::from(serde_json::to_vec(&payload).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);

    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    let json: Value = serde_json::from_slice(&body).unwrap();

    // Verify response structure
    assert!(json["prompt"].is_string());
    assert!(!json["prompt"].as_str().unwrap().is_empty());

    assert!(json["features"]["spectral_centroid"].is_number());
    assert!(json["features"]["biophony_ratio"].is_number());
    assert!(json["classification"]["environment_tag"].is_string());

    // In test_config without API keys, live provider flags must be false
    assert_eq!(json["provider_status"]["gemma_live"], false);
    assert_eq!(json["provider_status"]["tabpfn_live"], false);
    assert_eq!(json["provider_status"]["elevenlabs_live"], false);
}
