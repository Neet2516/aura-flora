//! TabPFN acoustic classification service.
//!
//! Classifies acoustic features into environment categories using
//! a TabPFN-backed tabular classification endpoint. Falls back to
//! heuristic scoring when the API is unavailable.

use serde::{Deserialize, Serialize};
use tracing::{info, warn};

use crate::config::AppConfig;
use crate::dsp::AcousticFeatures;
use crate::handlers::AppError;

/// Classification result from the bioacoustic environment model.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ClassificationResult {
    /// Probability that the soundscape is biophonic (natural). [0.0, 1.0]
    pub biophony_score: f32,

    /// Probability that the soundscape is anthrophonic (human/machine). [0.0, 1.0]
    pub anthrophony_score: f32,

    /// Predicted environment label.
    pub environment_tag: String,
}

/// Request payload sent to the TabPFN inference endpoint.
#[derive(Debug, Serialize)]
struct TabPfnRequest {
    features: Vec<f32>,
    labels: Vec<String>,
}

/// Raw response from the TabPFN endpoint.
#[derive(Debug, Deserialize)]
struct TabPfnResponse {
    probabilities: Vec<f32>,
    predicted_class: usize,
}

/// Known environment class labels (ordered, must match TabPFN training).
const ENVIRONMENT_LABELS: &[&str] = &[
    "forest",
    "urban_park",
    "busy_street",
    "coastal",
    "meadow",
    "indoor",
];

/// Output of classification with model mode transparency.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ClassificationOutput {
    /// Environment classification outcome.
    pub classification: ClassificationResult,
    /// True if classified by remote TabPFN model, false if heuristic was used.
    pub is_live_model: bool,
}

/// Classify acoustic features into an environment category.
///
/// Uses TabPFN API when `config.tabpfn_api_key` is non-empty,
/// otherwise falls back to a heuristic biophony-ratio classifier.
pub async fn classify(
    features: &AcousticFeatures,
    config: &AppConfig,
) -> Result<ClassificationOutput, AppError> {
    if config.tabpfn_api_key.trim().is_empty() {
        info!("TabPFN API key not set — using heuristic classifier");
        return Ok(ClassificationOutput {
            classification: heuristic_classify(features),
            is_live_model: false,
        });
    }

    match call_tabpfn_api(features, config).await {
        Ok(classification) => {
            info!(
                environment = %classification.environment_tag,
                biophony = %classification.biophony_score,
                "TabPFN classification complete"
            );
            Ok(ClassificationOutput {
                classification,
                is_live_model: true,
            })
        }
        Err(e) => {
            warn!("TabPFN API failed ({}), falling back to heuristic", e);
            Ok(ClassificationOutput {
                classification: heuristic_classify(features),
                is_live_model: false,
            })
        }
    }
}

/// Call the remote TabPFN inference endpoint.
async fn call_tabpfn_api(
    features: &AcousticFeatures,
    config: &AppConfig,
) -> Result<ClassificationResult, anyhow::Error> {
    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(5))
        .build()?;

    let feature_vec = vec![
        features.spectral_centroid,
        features.spectral_entropy,
        features.biophony_ratio,
        features.rms_db,
        features.zero_crossing_rate,
    ];

    let labels: Vec<String> = ENVIRONMENT_LABELS.iter().map(|s| s.to_string()).collect();

    let request = TabPfnRequest {
        features: feature_vec,
        labels,
    };

    let response = client
        .post(&config.tabpfn_endpoint)
        .bearer_auth(&config.tabpfn_api_key)
        .json(&request)
        .send()
        .await?
        .error_for_status()?
        .json::<TabPfnResponse>()
        .await?;

    let predicted_label = ENVIRONMENT_LABELS
        .get(response.predicted_class)
        .unwrap_or(&"urban_park")
        .to_string();

    // Biophony score = sum of probabilities for natural environments
    let natural_indices = [0usize, 1, 3, 4]; // forest, urban_park, coastal, meadow
    let biophony_score: f32 = natural_indices
        .iter()
        .filter_map(|&i| response.probabilities.get(i))
        .sum::<f32>()
        .min(1.0);

    let anthrophony_score = (1.0 - biophony_score).max(0.0);

    Ok(ClassificationResult {
        biophony_score,
        anthrophony_score,
        environment_tag: predicted_label,
    })
}

/// Heuristic fallback: derive environment from biophony ratio and spectral centroid.
fn heuristic_classify(features: &AcousticFeatures) -> ClassificationResult {
    let tag = if features.biophony_ratio > 0.55 && features.spectral_centroid > 2000.0 {
        "forest"
    } else if features.biophony_ratio > 0.40 {
        "meadow"
    } else if features.rms_db > -20.0 && features.biophony_ratio < 0.20 {
        "busy_street"
    } else if features.spectral_centroid < 1000.0 && features.rms_db < -35.0 {
        "indoor"
    } else {
        "urban_park"
    };

    let biophony_score = features.biophony_ratio;
    let anthrophony_score = (1.0 - biophony_score).max(0.0);

    ClassificationResult {
        biophony_score,
        anthrophony_score,
        environment_tag: tag.to_string(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::dsp::AcousticFeatures;

    fn make_features(biophony_ratio: f32, spectral_centroid: f32, rms_db: f32) -> AcousticFeatures {
        AcousticFeatures {
            spectral_centroid,
            spectral_entropy: 5.0,
            biophony_ratio,
            rms_db,
            zero_crossing_rate: 0.05,
        }
    }

    #[test]
    fn test_heuristic_forest() {
        let f = make_features(0.7, 3500.0, -30.0);
        let result = heuristic_classify(&f);
        assert_eq!(result.environment_tag, "forest");
        assert!(result.biophony_score > 0.5);
    }

    #[test]
    fn test_heuristic_busy_street() {
        let f = make_features(0.1, 1500.0, -15.0);
        let result = heuristic_classify(&f);
        assert_eq!(result.environment_tag, "busy_street");
        assert!(result.anthrophony_score > 0.7);
    }

    #[test]
    fn test_heuristic_indoor() {
        let f = make_features(0.05, 500.0, -40.0);
        let result = heuristic_classify(&f);
        assert_eq!(result.environment_tag, "indoor");
    }

    #[test]
    fn test_scores_sum_to_one() {
        let f = make_features(0.45, 2000.0, -28.0);
        let result = heuristic_classify(&f);
        let sum = result.biophony_score + result.anthrophony_score;
        assert!(
            (sum - 1.0).abs() < 0.001,
            "Scores must sum to 1.0, got {}",
            sum
        );
    }
}
