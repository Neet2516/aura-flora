import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApiService } from '../api';

describe('ApiService', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe('checkHealth', () => {
    it('returns online true when health endpoint responds with 200', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ status: 'ok', service: 'aura-flora-backend' }),
      } as Response);

      const health = await ApiService.checkHealth();
      expect(health.isOnline).toBe(true);
      expect(health.service).toBe('aura-flora-backend');
    });

    it('returns online false when network request fails', async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const health = await ApiService.checkHealth();
      expect(health.isOnline).toBe(false);
    });
  });

  describe('groundMe', () => {
    it('returns parsed backend response when API succeeds', async () => {
      const mockResponse = {
        prompt: 'Listen to the rustling leaves.',
        audio_url: '/audio/session-123.mp3',
        features: {
          spectral_centroid: 2400,
          spectral_entropy: 1.2,
          biophony_ratio: 0.8,
          rms_db: -28.0,
          zero_crossing_rate: 0.15,
        },
        classification: {
          biophony_score: 0.8,
          anthrophony_score: 0.2,
          environment_tag: 'forest',
        },
        provider_status: {
          gemma_live: true,
          tabpfn_live: false,
          elevenlabs_live: true,
        },
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await ApiService.groundMe('dGVzdA==');
      expect(result.prompt).toBe('Listen to the rustling leaves.');
      expect(result.isOfflineHeuristic).toBe(false);
      expect(result.features.spectral_centroid).toBe(2400);
      expect(result.classification.environment_tag).toBe('forest');
    });

    it('falls back to local sample analysis when backend is unavailable', async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new Error('Connection refused'));

      // 400 samples oscillating to generate zero crossings
      const samples = new Float32Array(400);
      for (let i = 0; i < samples.length; i++) {
        samples[i] = i % 2 === 0 ? 0.5 : -0.5;
      }

      const result = await ApiService.groundMe('dGVzdA==', samples);
      expect(result.isOfflineHeuristic).toBe(true);
      expect(result.prompt).toBeDefined();
      expect(result.features.rms_db).toBeGreaterThan(-30.0);
      expect(result.classification.biophony_score).toBeGreaterThan(0);
    });
  });
});
