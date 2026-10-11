import { useState, useRef, useEffect, useCallback } from 'react';
import { soundEngine, type RecordedAudioResult } from '../services/soundEngine';
import { ApiService } from '../services/api';
import type { GroundResponse, GroundingStatus, SoundscapePreset } from '../types';

export interface UseGroundingSessionOptions {
  recordingDurationSeconds?: number;
  autoBlackoutOnSpeechEnd?: boolean;
}

export interface UseGroundingSessionReturn {
  status: GroundingStatus;
  countdown: number;
  groundResult: GroundResponse | null;
  errorMessage: string;
  isBlackout: boolean;
  liveFrequencies: number[];
  startGrounding: (preset?: SoundscapePreset) => Promise<void>;
  enterBlackout: () => void;
  handleDoubleTapToWake: (e?: React.PointerEvent | React.MouseEvent) => void;
  resetSession: () => void;
}

const DEFAULT_FREQUENCIES = [30, 45, 60, 40, 75, 50, 85, 65, 45, 55, 35];

/**
 * Encapsulates the entire AuraFlora Grounding Lifecycle:
 * Idle → Mic Sampling (16 kHz PCM) → Rust DSP & AI Analysis → Spoken Whisper → AMOLED Blackout → Double-tap Wake.
 *
 * Enforces race-condition protection via session tokens and ensures all Web Audio,
 * MediaStream hardware tracks, timers, and animation frames are reliably cleaned up.
 */
export function useGroundingSession(
  options: UseGroundingSessionOptions = {}
): UseGroundingSessionReturn {
  const { recordingDurationSeconds = 6, autoBlackoutOnSpeechEnd = true } = options;

  const [status, setStatus] = useState<GroundingStatus>('idle');
  const [countdown, setCountdown] = useState<number>(recordingDurationSeconds);
  const [groundResult, setGroundResult] = useState<GroundResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [liveFrequencies, setLiveFrequencies] = useState<number[]>(DEFAULT_FREQUENCIES);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const blackoutTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTapRef = useRef<number>(0);
  const currentSessionIdRef = useRef<string>('');
  const sessionCounterRef = useRef<number>(0);

  // Clean up all resources when unmounting
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (blackoutTimeoutRef.current) clearTimeout(blackoutTimeoutRef.current);
      soundEngine.cancelMicRecording();
      soundEngine.stopSpeaking();
    };
  }, []);

  // Live frequency updates from Web Audio Analyser during active recording
  useEffect(() => {
    if (status !== 'recording') {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      return;
    }

    let analyser: AnalyserNode | null = null;
    try {
      analyser = soundEngine.getAnalyser();
    } catch {
      return;
    }

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const updateVisualizer = () => {
      if (!analyser) return;
      analyser.getByteFrequencyData(dataArray);

      const step = Math.floor(dataArray.length / 14);
      const sampled: number[] = [];
      for (let i = 0; i < 11; i++) {
        const val = dataArray[i * step] || 0;
        // Normalize to 15% - 95%
        const normalized = Math.max(15, Math.min(95, Math.round((val / 255) * 100)));
        sampled.push(normalized);
      }
      setLiveFrequencies(sampled);
      animFrameRef.current = requestAnimationFrame(updateVisualizer);
    };

    animFrameRef.current = requestAnimationFrame(updateVisualizer);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [status]);

  /**
   * Reset the current grounding session and release resources.
   */
  const resetSession = useCallback(() => {
    currentSessionIdRef.current = '';
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (blackoutTimeoutRef.current) {
      clearTimeout(blackoutTimeoutRef.current);
      blackoutTimeoutRef.current = null;
    }
    soundEngine.cancelMicRecording();
    soundEngine.stopSpeaking();
    setStatus('idle');
    setErrorMessage('');
    setGroundResult(null);
    setCountdown(recordingDurationSeconds);
    setLiveFrequencies(DEFAULT_FREQUENCIES);
  }, [recordingDurationSeconds]);

  /**
   * Complete recording and submit audio to the Rust backend.
   */
  const handleFinishRecording = useCallback(
    async (sessionId: string, preset?: SoundscapePreset) => {
      if (currentSessionIdRef.current !== sessionId) return;

      setStatus('analyzing');

      try {
        let audioB64 = '';
        let samples: Float32Array | undefined;

        try {
          const recorded: RecordedAudioResult = await soundEngine.stopMicRecording();
          audioB64 = recorded.audioB64;
          samples = recorded.samples;
        } catch {
          // If mic buffer was empty, allow fallback processing
        }

        if (currentSessionIdRef.current !== sessionId) return;

        const response = await ApiService.groundMe(audioB64, samples, preset);

        if (currentSessionIdRef.current !== sessionId) return;

        setGroundResult(response);
        setStatus('speaking');

        let hasTransitioned = false;
        const transitionToBlackout = () => {
          if (hasTransitioned) return;
          hasTransitioned = true;
          if (blackoutTimeoutRef.current) {
            clearTimeout(blackoutTimeoutRef.current);
            blackoutTimeoutRef.current = null;
          }
          if (currentSessionIdRef.current === sessionId && autoBlackoutOnSpeechEnd) {
            setStatus('blackout');
          }
        };

        // Guarantee transition to blackout within 3.5s (≤15s screen-time protocol)
        blackoutTimeoutRef.current = setTimeout(transitionToBlackout, 3500);

        soundEngine.speakPrompt(
          response.prompt,
          response.audio_url,
          () => {
            transitionToBlackout();
          },
          sessionId
        );
      } catch (err: unknown) {
        if (currentSessionIdRef.current === sessionId) {
          const msg = err instanceof Error ? err.message : 'Failed to analyze acoustic soundscape.';
          setErrorMessage(msg);
          setStatus('error');
        }
      }
    },
    [autoBlackoutOnSpeechEnd]
  );

  /**
   * Start a new bioacoustic grounding session.
   */
  const startGrounding = useCallback(
    async (preset?: SoundscapePreset) => {
      soundEngine.playHaptic();
      sessionCounterRef.current += 1;
      const sessionId = `grounding-session-${sessionCounterRef.current}`;
      currentSessionIdRef.current = sessionId;
      setErrorMessage('');
      setGroundResult(null);

      try {
        setStatus('requestingPermission');
        await soundEngine.requestMicPermission();

        if (currentSessionIdRef.current !== sessionId) return;

        await soundEngine.startMicRecording();
        setStatus('recording');
        setCountdown(recordingDurationSeconds);

        let sec = recordingDurationSeconds;
        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(async () => {
          sec -= 1;
          setCountdown(sec);

          if (sec <= 0) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            await handleFinishRecording(sessionId, preset);
          }
        }, 1000);
      } catch (err: unknown) {
        soundEngine.cancelMicRecording();
        if (currentSessionIdRef.current === sessionId) {
          const msg = err instanceof Error ? err.message : 'Microphone access is required to capture ambient soundscapes.';
          setErrorMessage(msg);
          setStatus('error');
        }
      }
    },
    [recordingDurationSeconds, handleFinishRecording]
  );

  /**
   * Enter blackout mode manually.
   */
  const enterBlackout = useCallback(() => {
    soundEngine.playHaptic();
    setStatus('blackout');
  }, []);

  /**
   * Double-tap gesture (within 450ms) to dismiss terminal AMOLED blackout screen.
   */
  const handleDoubleTapToWake = useCallback(
    (e?: React.PointerEvent | React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      const now = Date.now();
      soundEngine.playHaptic();

      if (now - lastTapRef.current < 450) {
        // Double-tap confirmed: wake device and reset cleanly
        soundEngine.stopSpeaking();
        setStatus('idle');
        setGroundResult(null);
        lastTapRef.current = 0;
      } else {
        lastTapRef.current = now;
      }
    },
    []
  );

  return {
    status,
    countdown,
    groundResult,
    errorMessage,
    isBlackout: status === 'blackout',
    liveFrequencies,
    startGrounding,
    enterBlackout,
    handleDoubleTapToWake,
    resetSession,
  };
}
