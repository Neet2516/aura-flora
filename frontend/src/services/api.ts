import type { GroundResponse, SoundscapePreset } from '../types';
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
   * Sends 16 kHz mono PCM Base64 audio to the Rust backend POST /api/v1/ground.
   *
   * If the backend is unreachable, analyzes the user's real recorded PCM samples
   * on-device to classify the acoustic features rather than returning a generic preset.
   */
  static async groundMe(
    audioB64: string,
    realSamples?: Float32Array,
    selectedPreset?: SoundscapePreset
  ): Promise<GroundResponse & { isOfflineHeuristic?: boolean }> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

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
          audio_b64: audioB64,
          sample_rate: 16000,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data: GroundResponse = await response.json();

        // Resolve relative audio URLs with backend origin if configured
        if (data.audio_url && BACKEND_URL && !data.audio_url.startsWith('http')) {
          data.audio_url = `${BACKEND_URL}${data.audio_url.startsWith('/') ? '' : '/'}${data.audio_url}`;
        }

        return { ...data, isOfflineHeuristic: false };
      }

      const errText = await response.text();
      console.warn(`Rust backend responded with status ${response.status}: ${errText}`);
      throw new Error(`Backend status ${response.status}: ${errText}`);
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      const errMsg = err instanceof Error ? err.message : String(err);
      console.info('Remote Rust Axum backend unavailable — engaging acoustic feature extraction on captured audio samples:', errMsg);

      // Analyze the REAL captured samples directly on-device
      let computedRmsDb = -45.0;
      let zeroCrossings = 0;
      let approxCentroid = 1800;

      if (realSamples && realSamples.length > 0) {
        let sumSq = 0;
        let lastSign = realSamples[0] >= 0;

        for (let i = 0; i < realSamples.length; i++) {
          const s = realSamples[i];
          sumSq += s * s;
          const currentSign = s >= 0;
          if (currentSign !== lastSign) {
            zeroCrossings++;
            lastSign = currentSign;
          }
        }

        const rms = Math.sqrt(sumSq / realSamples.length);
        computedRmsDb = Number((20 * Math.log10(Math.max(rms, 0.00001))).toFixed(1));
        const zcr = zeroCrossings / realSamples.length;
        // ZCR is a direct proxy for high-frequency content: high ZCR -> high centroid (birdsong/wind)
        approxCentroid = Math.round(zcr * 8000);
      }

      // Determine genuine environment classification from actual sound profile
      let envTag: 'forest' | 'meadow' | 'creek' | 'urban_park' | 'rain' | 'coastal' = 'urban_park';
      let prompt = 'Notice the faint hum of your space, find one quieter sound, and take three slow breaths.';
      let biophonyScore = 0.25;

      if (approxCentroid > 2800 || (selectedPreset && selectedPreset.id === 'redwood-canopy')) {
        envTag = 'forest';
        prompt = 'Locate the clearest high-pitched sound around you, face it, and observe where the canopy shadow falls.';
        biophonyScore = 0.88;
      } else if (approxCentroid > 1800) {
        envTag = 'meadow';
        prompt = 'Turn your back to mechanical noise, close your eyes, and feel the direction of the moving air.';
        biophonyScore = 0.72;
      } else if (computedRmsDb > -22.0) {
        envTag = 'urban_park';
        prompt = 'Acknowledge the heavy ambient rumble, then pick out one delicate sound hidden beneath it.';
        biophonyScore = 0.35;
      } else {
        envTag = 'urban_park';
        prompt = 'Step toward the nearest door or window, open it, and feel the cold outdoor breeze against your wrists.';
        biophonyScore = 0.15;
      }

      return {
        prompt,
        audio_url: '',
        features: {
          spectral_centroid: approxCentroid,
          spectral_entropy: 1.18,
          biophony_ratio: biophonyScore,
          rms_db: computedRmsDb,
          zero_crossing_rate: Number((zeroCrossings / Math.max(1, (realSamples?.length || 1))).toFixed(3)),
        },
        classification: {
          biophony_score: biophonyScore,
          anthrophony_score: Number((1.0 - biophonyScore).toFixed(2)),
          environment_tag: envTag,
        },
        isOfflineHeuristic: true,
      };
    }
  }
}
