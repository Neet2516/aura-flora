import { describe, it, expect } from 'vitest';
import {
  resampleTo16k,
  floatTo16BitPCM,
  arrayBufferToBase64,
} from '../soundEngine';

describe('soundEngine audio utilities', () => {
  describe('resampleTo16k', () => {
    it('returns the same array when sample rate matches target', () => {
      const input = new Float32Array([0.1, 0.2, 0.3]);
      const result = resampleTo16k(input, 16000, 16000);
      expect(result).toBe(input);
    });

    it('handles empty input gracefully', () => {
      const input = new Float32Array([]);
      const result = resampleTo16k(input, 48000, 16000);
      expect(result.length).toBe(0);
    });

    it('downsamples from 48 kHz to 16 kHz with accurate length ratio', () => {
      const samplesCount = 4800; // 0.1s at 48kHz
      const input = new Float32Array(samplesCount);
      for (let i = 0; i < samplesCount; i++) {
        input[i] = Math.sin((2 * Math.PI * 440 * i) / 48000);
      }

      const resampled = resampleTo16k(input, 48000, 16000);
      expect(resampled.length).toBe(1600); // 0.1s at 16kHz
    });

    it('interpolates intermediate sample values linearly', () => {
      const input = new Float32Array([0.0, 1.0]);
      // Downsample 2 samples at 32kHz to 16kHz -> 1 sample
      const resampled = resampleTo16k(input, 32000, 16000);
      expect(resampled.length).toBe(1);
      expect(resampled[0]).toBeCloseTo(0.0, 3);
    });
  });

  describe('floatTo16BitPCM', () => {
    it('converts normalized float samples to 16-bit little-endian PCM', () => {
      const input = new Float32Array([0.0, 1.0, -1.0]);
      const buffer = floatTo16BitPCM(input);
      expect(buffer.byteLength).toBe(6);

      const view = new DataView(buffer);
      expect(view.getInt16(0, true)).toBe(0);
      expect(view.getInt16(2, true)).toBe(32767);
      expect(view.getInt16(4, true)).toBe(-32768);
    });

    it('clamps values exceeding normalized range [-1.0, 1.0]', () => {
      const input = new Float32Array([1.5, -2.0]);
      const buffer = floatTo16BitPCM(input);
      const view = new DataView(buffer);

      expect(view.getInt16(0, true)).toBe(32767);
      expect(view.getInt16(2, true)).toBe(-32768);
    });
  });

  describe('arrayBufferToBase64', () => {
    it('encodes empty buffer to empty string', () => {
      const buffer = new ArrayBuffer(0);
      expect(arrayBufferToBase64(buffer)).toBe('');
    });

    it('encodes ASCII bytes correctly to standard base64', () => {
      const uint8 = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
      expect(arrayBufferToBase64(uint8.buffer)).toBe(btoa('Hello'));
    });

    it('handles buffers larger than single chunk safely', () => {
      const size = 70000; // Exceeds 32768 chunk size
      const uint8 = new Uint8Array(size);
      for (let i = 0; i < size; i++) {
        uint8[i] = i % 256;
      }
      const b64 = arrayBufferToBase64(uint8.buffer);
      expect(typeof b64).toBe('string');
      expect(b64.length).toBeGreaterThan(0);
    });
  });
});
