//! Acoustic feature extraction from raw PCM audio samples.
//!
//! Computes bioacoustic spectral ratios used to classify environments
//! as biophonic (natural) vs anthrophonic (human/machine noise).

use rustfft::{num_complex::Complex, FftPlanner};
use serde::{Deserialize, Serialize};

/// Extracted acoustic features from a single audio segment.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AcousticFeatures {
    /// Weighted mean frequency of the power spectrum (Hz).
    pub spectral_centroid: f32,

    /// Shannon entropy of the normalized power spectrum.
    /// Higher = more complex, diffuse energy distribution.
    pub spectral_entropy: f32,

    /// Ratio of energy in the 2–8 kHz band to total energy.
    /// Biophony zone: birdsong, insects, wind leaves.
    pub biophony_ratio: f32,

    /// Root mean square amplitude in dBFS (decibels full-scale).
    pub rms_db: f32,

    /// Zero-crossing rate — proxy for noise vs tonal content.
    pub zero_crossing_rate: f32,
}

/// Extract acoustic features from raw 16-bit PCM samples (as f32, normalized to [-1.0, 1.0]).
///
/// # Parameters
/// - `pcm_samples`: Raw mono audio samples normalized to [-1.0, 1.0].
/// - `sample_rate`: Sample rate in Hz (expected: 16000).
///
/// # Panics
/// Does not panic — returns zeros on empty input.
pub fn extract_features(pcm_samples: &[f32], sample_rate: u32) -> AcousticFeatures {
    if pcm_samples.is_empty() {
        return AcousticFeatures {
            spectral_centroid: 0.0,
            spectral_entropy: 0.0,
            biophony_ratio: 0.0,
            rms_db: -96.0,
            zero_crossing_rate: 0.0,
        };
    }

    let n = pcm_samples.len();

    // --- RMS dBFS ---
    let rms = compute_rms(pcm_samples);
    let rms_db = if rms > 1e-9 {
        20.0 * rms.log10()
    } else {
        -96.0
    };

    // --- Zero-Crossing Rate ---
    let zero_crossing_rate = compute_zcr(pcm_samples);

    // --- FFT Power Spectrum ---
    let power_spectrum = compute_power_spectrum(pcm_samples);
    let num_bins = power_spectrum.len();

    // Frequency resolution (Hz per bin)
    let hz_per_bin = sample_rate as f32 / (n as f32);

    // --- Spectral Centroid ---
    let spectral_centroid = compute_spectral_centroid(&power_spectrum, hz_per_bin);

    // --- Spectral Entropy ---
    let spectral_entropy = compute_spectral_entropy(&power_spectrum);

    // --- Biophony Ratio (2 kHz – 8 kHz band energy / total energy) ---
    let biophony_ratio = compute_biophony_ratio(&power_spectrum, hz_per_bin, num_bins, 2000.0, 8000.0);

    AcousticFeatures {
        spectral_centroid,
        spectral_entropy,
        biophony_ratio,
        rms_db,
        zero_crossing_rate,
    }
}

/// Compute RMS amplitude of samples.
fn compute_rms(samples: &[f32]) -> f32 {
    let sum_sq: f32 = samples.iter().map(|&s| s * s).sum();
    (sum_sq / samples.len() as f32).sqrt()
}

/// Compute zero-crossing rate (crossings per sample).
fn compute_zcr(samples: &[f32]) -> f32 {
    if samples.len() < 2 {
        return 0.0;
    }
    let crossings = samples
        .windows(2)
        .filter(|w| (w[0] >= 0.0) != (w[1] >= 0.0))
        .count();
    crossings as f32 / (samples.len() - 1) as f32
}

/// Compute one-sided power spectrum via FFT.
fn compute_power_spectrum(samples: &[f32]) -> Vec<f32> {
    let n = samples.len();
    let mut planner = FftPlanner::<f32>::new();
    let fft = planner.plan_fft_forward(n);

    // Apply Hann window to reduce spectral leakage
    let mut buffer: Vec<Complex<f32>> = samples
        .iter()
        .enumerate()
        .map(|(i, &s)| {
            let window = 0.5 * (1.0 - (2.0 * std::f32::consts::PI * i as f32 / (n - 1) as f32).cos());
            Complex::new(s * window, 0.0)
        })
        .collect();

    fft.process(&mut buffer);

    // One-sided power spectrum (DC to Nyquist)
    let half_n = n / 2 + 1;
    buffer[..half_n]
        .iter()
        .map(|c| c.norm_sqr() / n as f32)
        .collect()
}

/// Compute spectral centroid (Hz) from power spectrum.
fn compute_spectral_centroid(power: &[f32], hz_per_bin: f32) -> f32 {
    let total_power: f32 = power.iter().sum();
    if total_power < 1e-12 {
        return 0.0;
    }
    let weighted_sum: f32 = power
        .iter()
        .enumerate()
        .map(|(i, &p)| i as f32 * hz_per_bin * p)
        .sum();
    weighted_sum / total_power
}

/// Compute Shannon entropy of normalized power spectrum.
fn compute_spectral_entropy(power: &[f32]) -> f32 {
    let total: f32 = power.iter().sum();
    if total < 1e-12 {
        return 0.0;
    }
    power
        .iter()
        .map(|&p| {
            let prob = p / total;
            if prob > 1e-10 {
                -prob * prob.log2()
            } else {
                0.0
            }
        })
        .sum()
}

/// Compute biophony ratio: energy in [low_hz, high_hz] / total energy.
fn compute_biophony_ratio(
    power: &[f32],
    hz_per_bin: f32,
    _num_bins: usize,
    low_hz: f32,
    high_hz: f32,
) -> f32 {
    let total: f32 = power.iter().sum();
    if total < 1e-12 {
        return 0.0;
    }

    let band_energy: f32 = power
        .iter()
        .enumerate()
        .filter(|&(i, _)| {
            let freq = i as f32 * hz_per_bin;
            freq >= low_hz && freq <= high_hz
        })
        .map(|(_, &p)| p)
        .sum();

    (band_energy / total).min(1.0)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn sine_wave(freq_hz: f32, sample_rate: u32, duration_secs: f32, amplitude: f32) -> Vec<f32> {
        let num_samples = (sample_rate as f32 * duration_secs) as usize;
        (0..num_samples)
            .map(|i| {
                amplitude
                    * (2.0 * std::f32::consts::PI * freq_hz * i as f32 / sample_rate as f32).sin()
            })
            .collect()
    }

    #[test]
    fn test_empty_input_returns_zeros() {
        let features = extract_features(&[], 16000);
        assert_eq!(features.spectral_centroid, 0.0);
        assert_eq!(features.rms_db, -96.0);
        assert_eq!(features.biophony_ratio, 0.0);
    }

    #[test]
    fn test_rms_db_of_full_scale_sine() {
        // 0 dBFS sine at 1 kHz
        let samples = sine_wave(1000.0, 16000, 0.5, 1.0);
        let features = extract_features(&samples, 16000);
        // RMS of a full-scale sine is 1/sqrt(2) ≈ -3.01 dBFS
        assert!(
            features.rms_db > -4.0 && features.rms_db < -2.0,
            "Expected ~-3 dBFS, got {}",
            features.rms_db
        );
    }

    #[test]
    fn test_spectral_centroid_approximates_sine_frequency() {
        let freq = 4000.0_f32;
        let samples = sine_wave(freq, 16000, 1.0, 0.8);
        let features = extract_features(&samples, 16000);
        // Centroid should be close to 4000 Hz (within ±500 Hz due to windowing)
        let diff = (features.spectral_centroid - freq).abs();
        assert!(diff < 500.0, "Centroid {} too far from {} Hz", features.spectral_centroid, freq);
    }

    #[test]
    fn test_biophony_ratio_high_for_birdsong_frequency() {
        // 4 kHz tone falls in biophony band (2–8 kHz)
        let samples = sine_wave(4000.0, 16000, 1.0, 0.5);
        let features = extract_features(&samples, 16000);
        assert!(
            features.biophony_ratio > 0.5,
            "Expected high biophony ratio for 4 kHz, got {}",
            features.biophony_ratio
        );
    }

    #[test]
    fn test_biophony_ratio_low_for_bass_frequency() {
        // 200 Hz tone falls below biophony band
        let samples = sine_wave(200.0, 16000, 1.0, 0.5);
        let features = extract_features(&samples, 16000);
        assert!(
            features.biophony_ratio < 0.2,
            "Expected low biophony ratio for 200 Hz, got {}",
            features.biophony_ratio
        );
    }

    #[test]
    fn test_zcr_is_normalized() {
        let samples = sine_wave(440.0, 16000, 0.5, 0.5);
        let features = extract_features(&samples, 16000);
        assert!(
            features.zero_crossing_rate >= 0.0 && features.zero_crossing_rate <= 1.0,
            "ZCR must be in [0, 1]"
        );
    }
}
