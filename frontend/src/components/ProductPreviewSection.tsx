import React, { useState, useRef, useEffect } from 'react';
import { Mic, ShieldCheck, RotateCcw, AlertCircle, Volume2 } from 'lucide-react';
import { soundEngine, type RecordedAudioResult } from '../services/soundEngine';
import { ApiService } from '../services/api';
import type { GroundResponse } from '../types';
import { ScrollRevealText } from './motion/ScrollRevealText';
import { FadeInWhenVisible } from './motion/FadeInWhenVisible';

type GroundingState =
  | 'idle'
  | 'requestingPermission'
  | 'recording'
  | 'analyzing'
  | 'speaking'
  | 'blackout'
  | 'error';

export const ProductPreviewSection: React.FC = () => {
  const [screen, setScreen] = useState<GroundingState>('idle');
  const [countdown, setCountdown] = useState<number>(6);
  const [groundResult, setGroundResult] = useState<GroundResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [liveFrequencies, setLiveFrequencies] = useState<number[]>([30, 45, 60, 40, 75, 50, 85, 65, 45, 55, 35]);

  const timerRef = useRef<any>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTapRef = useRef<number>(0);
  const currentSessionIdRef = useRef<string>('');
  const sessionCounterRef = useRef<number>(0);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      soundEngine.cancelMicRecording();
      soundEngine.stopSpeaking();
    };
  }, []);

  // Live frequency updates from Web Audio Analyser during recording
  useEffect(() => {
    if (screen !== 'recording') {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const analyser = soundEngine.getAnalyser();
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const updateVisualizer = () => {
      analyser.getByteFrequencyData(dataArray);
      // Sample 11 distinct frequency points
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
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [screen]);

  /**
   * STAGE 1: Explicit user click initiates microphone request & recording
   */
  const handleStartCapture = async () => {
    soundEngine.playHaptic();
    sessionCounterRef.current += 1;
    const sessionId = `session-${sessionCounterRef.current}`;
    currentSessionIdRef.current = sessionId;
    setErrorMessage('');

    try {
      setScreen('requestingPermission');
      // Request explicit microphone access
      await soundEngine.requestMicPermission();

      // Begin real 16 kHz mono PCM recording
      await soundEngine.startMicRecording();
      setScreen('recording');
      setCountdown(6);

      let sec = 6;
      timerRef.current = setInterval(async () => {
        sec -= 1;
        setCountdown(sec);

        if (sec <= 0) {
          clearInterval(timerRef.current);
          await handleFinishRecording(sessionId);
        }
      }, 1000);
    } catch (err: any) {
      console.warn('Microphone permission or hardware error:', err);
      soundEngine.cancelMicRecording();
      setErrorMessage(err.message || 'Microphone access is required to capture ambient soundscapes.');
      setScreen('error');
    }
  };

  /**
   * STAGE 2: Finish recording, submit 16 kHz PCM to Rust backend, and receive tailored grounding
   */
  const handleFinishRecording = async (sessionId: string) => {
    if (currentSessionIdRef.current !== sessionId) return;

    setScreen('analyzing');

    try {
      // Encode captured PCM Float32 buffer to 16-bit signed PCM Base64
      const recorded: RecordedAudioResult = await soundEngine.stopMicRecording();

      // Submit to Rust Axum backend POST /api/v1/ground
      const response = await ApiService.groundMe(recorded.audioB64, recorded.samples);

      if (currentSessionIdRef.current !== sessionId) return;

      setGroundResult(response);
      setScreen('speaking');

      // Play synthesized whisper instruction (targeting ~6 seconds)
      soundEngine.speakPrompt(
        response.prompt,
        response.audio_url,
        () => {
          // Transition to pure AMOLED blackout once spoken instruction finishes
          if (currentSessionIdRef.current === sessionId) {
            setScreen('blackout');
          }
        },
        sessionId
      );
    } catch (err: any) {
      console.error('Grounding pipeline error:', err);
      if (currentSessionIdRef.current === sessionId) {
        setErrorMessage(err.message || 'Failed to analyze acoustic soundscape.');
        setScreen('error');
      }
    }
  };

  /**
   * STAGE 3: Double-tap / double-click gesture to exit AMOLED blackout
   */
  const handleDoubleTapToWake = (e: React.PointerEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const now = Date.now();
    soundEngine.playHaptic();

    if (now - lastTapRef.current < 450) {
      // Double-tap confirmed: wake device and reset cleanly
      soundEngine.stopSpeaking();
      setScreen('idle');
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  };

  /**
   * Reset session
   */
  const handleReset = () => {
    currentSessionIdRef.current = '';
    if (timerRef.current) clearInterval(timerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    soundEngine.cancelMicRecording();
    soundEngine.stopSpeaking();
    setScreen('idle');
    setErrorMessage('');
  };

  return (
    <section id="preview" style={styles.section}>
      <div className="section-container" style={styles.container}>
        {/* Section Header */}
        <div style={styles.header}>
          <div>
            <div className="tech-eyebrow">
              <ShieldCheck size={12} />
              <span>EXPERIENCE ENGINE / 005</span>
            </div>
            <ScrollRevealText
              text="The Grounding Experience"
              tag="h2"
              style={styles.title}
              delay={0.1}
            />
          </div>
          <FadeInWhenVisible delay={0.2}>
            <p style={styles.subtitle}>
              Test the real bioacoustic grounding loop right now in your browser. One tactile press captures 6 seconds of ambient sound, classifies your acoustic ecology, and terminates screen emission into pure blackout.
            </p>
          </FadeInWhenVisible>
        </div>

        {/* Simulator Device Grid */}
        <div style={styles.simulationGrid}>
          {/* Left Column: Flow Explanations */}
          <FadeInWhenVisible delay={0.25} yOffset={24} style={styles.flowExplainer}>
            <div style={styles.flowStep}>
              <span className="font-mono" style={styles.flowNum}>STAGE 01</span>
              <h3 style={styles.flowTitle}>16 kHz Ambient Microphone Sampling</h3>
              <p style={styles.flowDesc}>
                A single tap records 6 seconds of real ambient acoustic pressure without algorithms, feeds, or infinite notifications.
              </p>
            </div>

            <div style={styles.flowStep}>
              <span className="font-mono" style={styles.flowNum}>STAGE 02</span>
              <h3 style={styles.flowTitle}>Rust DSP & Acoustic Classification</h3>
              <p style={styles.flowDesc}>
                Computes spectral centroid and biophony ratio to distinguish avian calls and wind from anthropogenic motor hum.
              </p>
            </div>

            <div style={styles.flowStep}>
              <span className="font-mono" style={styles.flowNum}>STAGE 03</span>
              <h3 style={styles.flowTitle}>AMOLED Blackout Lock</h3>
              <p style={styles.flowDesc}>
                The display turns completely black (#000000). Spoken guidance plays for ~6 seconds while screen pixels power off.
              </p>
            </div>

            <div style={styles.interactionTip} className="font-mono">
              <span>TIP: IN BLACKOUT MODE, DOUBLE-TAP OR DOUBLE-CLICK THE SCREEN TO WAKE UP.</span>
            </div>
          </FadeInWhenVisible>

          {/* Right Column: Physical Phone Hardware Mockup */}
          <FadeInWhenVisible delay={0.4} yOffset={32} style={styles.phoneStage}>
            <div
              style={styles.phoneChassis}
              onPointerDown={screen === 'blackout' ? handleDoubleTapToWake : undefined}
            >
              {/* Dynamic Island / Hardware Sensors */}
              <div style={styles.dynamicIsland}>
                <div style={styles.lensDot} />
                <div style={styles.speakerPill} />
              </div>

              {/* Screen Content Viewport */}
              <div style={styles.screenViewport}>
                {/* 1. IDLE STATE */}
                {screen === 'idle' && (
                  <div style={styles.screenHome}>
                    <div style={styles.screenTopBar}>
                      <span className="font-mono" style={{ fontSize: '10px', color: 'var(--color-golden-amber)' }}>
                        AURAFLORA
                      </span>
                      <span className="font-mono" style={{ fontSize: '10px', color: 'var(--color-muted-olive)' }}>
                        16 kHz MIC READY
                      </span>
                    </div>

                    <div style={styles.pulseArea}>
                      <button
                        onClick={handleStartCapture}
                        style={styles.pulseTriggerButton}
                        title="Start Bioacoustic Grounding Recording"
                        aria-label="Start Bioacoustic Grounding"
                      >
                        <Mic size={32} color="#171614" />
                      </button>
                      <span className="font-mono" style={styles.pulseLabel}>
                        PRESS TO LISTEN
                      </span>
                      <span style={styles.pulseSub}>Capture 6s Ambient Sound</span>
                    </div>

                    <div style={styles.screenBottomBar}>
                      <span className="font-mono" style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
                        ≤ 15S TOTAL BUDGET
                      </span>
                    </div>
                  </div>
                )}

                {/* 2. REQUESTING PERMISSION STATE */}
                {screen === 'requestingPermission' && (
                  <div style={styles.screenActive}>
                    <span className="tech-eyebrow">REQUESTING MICROPHONE</span>
                    <p style={styles.analyzingText} className="font-mono">
                      ALLOW MICROPHONE ACCESS
                      <br />
                      TO RECORD AMBIENT AUDIO...
                    </p>
                  </div>
                )}

                {/* 3. RECORDING STATE */}
                {screen === 'recording' && (
                  <div style={styles.screenActive}>
                    <span className="tech-eyebrow">CAPTURING AMBIENT AIR</span>
                    <div style={styles.countdownNumber} className="font-mono">
                      {countdown}s
                    </div>
                    {/* Live Reactive Waveform from Real AnalyserNode */}
                    <div style={styles.waveformWave}>
                      {liveFrequencies.map((h, i) => (
                        <div
                          key={i}
                          style={{
                            ...styles.waveBar,
                            height: `${h}%`,
                            backgroundColor: i % 2 === 0 ? 'var(--color-golden-amber)' : 'var(--color-muted-olive)',
                          }}
                        />
                      ))}
                    </div>
                    <span className="meta-label">RECORDING REAL 16 kHz MONO PCM...</span>
                  </div>
                )}

                {/* 4. ANALYZING STATE */}
                {screen === 'analyzing' && (
                  <div style={styles.screenActive}>
                    <div className="status-dot-amber" style={{ width: 8, height: 8 }} />
                    <span className="tech-eyebrow">RUST DSP PROCESSING</span>
                    <p style={styles.analyzingText} className="font-mono">
                      COMPUTING SPECTRAL CENTROID...
                      <br />
                      CLASSIFYING ACOUSTIC BIOPHONY...
                    </p>
                  </div>
                )}

                {/* 5. SPEAKING STATE */}
                {screen === 'speaking' && groundResult && (
                  <div style={styles.screenActive}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <Volume2 size={13} color="var(--color-golden-amber)" />
                      <span className="font-mono" style={{ fontSize: '10px', color: 'var(--color-golden-amber)' }}>
                        [{groundResult.classification.environment_tag.toUpperCase()}] · BIOPHONY {Math.round(groundResult.classification.biophony_score * 100)}%
                      </span>
                    </div>
                    <p style={styles.promptDisplay}>&ldquo;{groundResult.prompt}&rdquo;</p>
                    <span className="meta-label" style={{ marginTop: 12 }}>
                      PLAYING GUIDANCE · PREPARING BLACKOUT...
                    </span>
                  </div>
                )}

                {/* 6. BLACKOUT STATE (#000000) */}
                {screen === 'blackout' && (
                  <div style={styles.screenBlackout}>
                    <div style={styles.blackoutInstruction}>
                      <span className="font-mono" style={styles.blackoutNotice}>
                        AMOLED BLACKOUT ACTIVE
                      </span>
                      <p style={styles.blackoutText}>
                        Zero backlight emission.
                        <br />
                        Look up at your surroundings.
                      </p>
                      <span className="font-mono" style={styles.doubleTapNotice}>
                        [DOUBLE-TAP TO WAKE]
                      </span>
                    </div>
                  </div>
                )}

                {/* 7. ERROR STATE */}
                {screen === 'error' && (
                  <div style={styles.screenActive}>
                    <AlertCircle size={28} color="#F87171" style={{ marginBottom: 8 }} />
                    <span className="font-mono" style={{ fontSize: '11px', color: '#F87171', fontWeight: 600 }}>
                      RECORDING ERROR
                    </span>
                    <p style={{ ...styles.flowDesc, fontSize: '12px', textAlign: 'center', marginTop: 8, color: 'var(--color-text-secondary)' }}>
                      {errorMessage}
                    </p>
                    <button
                      onClick={handleStartCapture}
                      className="btn-amber-primary"
                      style={{ fontSize: '11px', padding: '8px 16px', marginTop: 16 }}
                    >
                      TRY AGAIN
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Reset Button Below Device */}
            {screen !== 'idle' && (
              <button onClick={handleReset} style={styles.resetBtn} className="font-mono">
                <RotateCcw size={12} />
                <span>RESET SESSION</span>
              </button>
            )}
          </FadeInWhenVisible>
        </div>
      </div>
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  section: {
    padding: '90px 0',
    backgroundColor: 'var(--color-dark-canvas)',
    position: 'relative',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxWidth: '800px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(2.25rem, 4.5vw, 4rem)',
    letterSpacing: '-0.035em',
    color: 'var(--color-soft-offwhite)',
    lineHeight: 1.08,
    fontWeight: 600,
    marginTop: '8px',
  },
  subtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(1rem, 1.25vw, 1.15rem)',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.65,
    letterSpacing: 'var(--tracking-body)',
    fontWeight: 400,
  },
  simulationGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
    gap: '40px',
    alignItems: 'center',
  },
  flowExplainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  flowStep: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '20px',
    backgroundColor: '#1E1D1A',
    border: '1px solid var(--color-border-subtle)',
  },
  flowNum: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--color-golden-amber)',
    letterSpacing: '0.1em',
    fontWeight: 600,
  },
  flowTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '17px',
    fontWeight: 500,
    letterSpacing: '-0.02em',
    color: 'var(--color-soft-offwhite)',
  },
  flowDesc: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.875rem',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.6,
    letterSpacing: 'var(--tracking-body)',
    fontWeight: 400,
  },
  interactionTip: {
    fontSize: '11px',
    color: 'var(--color-text-muted)',
    padding: '12px 16px',
    border: '1px solid var(--color-grid-line)',
    backgroundColor: 'rgba(23, 22, 20, 0.6)',
  },
  phoneStage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  phoneChassis: {
    width: 'min(320px, calc(100vw - 32px))',
    height: 'min(620px, calc(100dvh - 120px))',
    minHeight: '520px',
    backgroundColor: '#000000',
    border: '3px solid #36332E',
    borderRadius: '44px',
    boxShadow: '0 25px 70px rgba(0, 0, 0, 0.95), 0 0 25px rgba(242, 196, 106, 0.12)',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    userSelect: 'none',
  },
  dynamicIsland: {
    position: 'absolute',
    top: '12px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100px',
    height: '24px',
    backgroundColor: '#121212',
    borderRadius: '12px',
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 10px',
  },
  lensDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#050505',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  speakerPill: {
    width: '32px',
    height: '4px',
    borderRadius: '2px',
    backgroundColor: '#1A1A1A',
  },
  screenViewport: {
    flex: 1,
    paddingTop: '48px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#171614',
    position: 'relative',
  },
  screenHome: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '20px 24px 28px',
    textAlign: 'center',
  },
  screenTopBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pulseArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    margin: 'auto 0',
  },
  pulseTriggerButton: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-golden-amber)',
    border: '4px solid rgba(242, 196, 106, 0.4)',
    boxShadow: '0 0 35px rgba(242, 196, 106, 0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  pulseLabel: {
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: 'var(--color-soft-offwhite)',
  },
  pulseSub: {
    fontSize: '11px',
    color: 'var(--color-text-secondary)',
  },
  screenBottomBar: {
    display: 'flex',
    justifyContent: 'center',
  },
  screenActive: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 20px',
    textAlign: 'center',
    gap: '14px',
  },
  countdownNumber: {
    fontSize: '3.5rem',
    fontWeight: 700,
    color: 'var(--color-golden-amber)',
    lineHeight: 1,
  },
  waveformWave: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: '4px',
    height: '48px',
    width: '140px',
  },
  waveBar: {
    flex: 1,
    borderRadius: '2px',
    transition: 'height 0.1s ease',
  },
  analyzingText: {
    fontSize: '11px',
    letterSpacing: '0.08em',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.6,
  },
  promptDisplay: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.05rem',
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '-0.02em',
    color: 'var(--color-soft-offwhite)',
    padding: '16px',
    backgroundColor: '#1E1D1A',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: '8px',
  },
  screenBlackout: {
    flex: 1,
    backgroundColor: '#000000',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    cursor: 'pointer',
  },
  blackoutInstruction: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '16px',
  },
  blackoutNotice: {
    fontSize: '10px',
    letterSpacing: '0.12em',
    color: 'rgba(174, 172, 120, 0.45)',
  },
  blackoutText: {
    fontFamily: 'var(--font-display)',
    fontSize: '15px',
    color: 'rgba(247, 245, 239, 0.25)',
    lineHeight: 1.6,
    letterSpacing: '-0.01em',
  },
  doubleTapNotice: {
    fontSize: '10px',
    letterSpacing: '0.08em',
    color: 'rgba(242, 196, 106, 0.5)',
  },
  resetBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    backgroundColor: 'rgba(30, 29, 26, 0.8)',
    border: '1px solid var(--color-border-subtle)',
    color: 'var(--color-text-secondary)',
    fontSize: '11px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};
