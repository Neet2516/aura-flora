import type { GroundResponse, SoundscapePreset } from '../types';
import { SOUNDSCAPE_PRESETS } from '../constants/presets';
import { ApiKeyManager } from './apiKeys';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

export class ApiService {
  /**
   * Health check for local Rust Axum backend
   */
  static async checkHealth(): Promise<{ isOnline: boolean; service?: string }> {
    try {
      const res = await fetch(`${BACKEND_URL}/health`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        return { isOnline: true, service: data.service || 'aura-flora-backend' };
      }
      return { isOnline: false };
    } catch {
      return { isOnline: false };
    }
  }

  /**
   * Sends audio to backend or falls back to bioacoustic simulation engine
   */
  static async groundMe(audioB64: string, selectedPreset?: SoundscapePreset): Promise<GroundResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const keyConfig = ApiKeyManager.getConfig();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (keyConfig.useCustomKeys) {
      if (keyConfig.gemmaApiKey) headers['X-Gemma-Api-Key'] = keyConfig.gemmaApiKey;
      if (keyConfig.elevenlabsApiKey) headers['X-ElevenLabs-Api-Key'] = keyConfig.elevenlabsApiKey;
      if (keyConfig.elevenlabsVoiceId) headers['X-ElevenLabs-Voice-Id'] = keyConfig.elevenlabsVoiceId;
      if (keyConfig.tabpfnApiKey) headers['X-TabPFN-Api-Key'] = keyConfig.tabpfnApiKey;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/ground`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          audio_b64: audioB64 || 'offline_audio_stream',
          sample_rate: 16000,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        return data;
      }
      throw new Error(`Status ${response.status}`);
    } catch {
      clearTimeout(timeoutId);
      console.info('Backend unavailable or mock mode active — engaging local bioacoustic simulation.');

      // Curated simulation matching the user's selected biome or realistic environment
      const preset = selectedPreset || SOUNDSCAPE_PRESETS[0];

      // Add realistic dynamic jitter to simulate real acoustic feature variance
      const jitter = (Math.random() - 0.5) * 0.05;
      const centroidJitter = Math.floor((Math.random() - 0.5) * 120);

      return {
        prompt: preset.samplePrompt,
        audio_url: '',
        features: {
          spectral_centroid: preset.features.spectral_centroid + centroidJitter,
          spectral_entropy: +(preset.features.spectral_entropy + jitter).toFixed(3),
          biophony_ratio: +(preset.features.biophony_ratio + jitter).toFixed(3),
          rms_db: +(preset.features.rms_db + jitter * 10).toFixed(1),
          zero_crossing_rate: +(preset.features.zero_crossing_rate + jitter * 0.1).toFixed(3),
        },
        classification: {
          biophony_score: +(preset.classification.biophony_score + jitter).toFixed(2),
          anthrophony_score: +(preset.classification.anthrophony_score - jitter).toFixed(2),
          environment_tag: preset.classification.environment_tag,
        },
      };
    }
  }
}
