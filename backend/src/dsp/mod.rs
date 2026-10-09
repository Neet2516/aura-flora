//! Digital Signal Processing module.
//!
//! Provides acoustic feature extraction from raw PCM audio data.
//! This module has **no** HTTP, AI, or external I/O dependencies.

pub mod acoustic_features;

pub use acoustic_features::{extract_features, AcousticFeatures};
