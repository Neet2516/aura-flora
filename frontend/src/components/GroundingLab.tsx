import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Maximize2,
  CheckCircle2,
  TreePine,
  CloudRain,
  Waves,
  Sun,
  Building2,
} from 'lucide-react';
import { SOUNDSCAPE_PRESETS } from '../constants/presets';
import type { SoundscapePreset, GroundResponse, GroundingStatus } from '../types';
import { soundEngine } from '../services/soundEngine';
import { ApiService } from '../services/api';

interface GroundingLabProps {
  onOpenBlackoutDirectly?: () => void;
}

export const GroundingLab: React.FC<GroundingLabProps> = () => {
  const [status, setStatus] = useState<GroundingStatus>('idle');
  const [inputMode, setInputMode] = useState<'mic' | 'preset'>('preset');
  const [selectedPreset, setSelectedPreset] = useState<SoundscapePreset>(SOUNDSCAPE_PRESETS[0]);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [countdown, setCountdown] = useState(8);
  const [groundResult, setGroundResult] = useState<GroundResponse | null>(null);
  const [isBlackoutActive, setIsBlackoutActive] = useState(false);
  const [blackoutDoubleTapMsg, setBlackoutDoubleTapMsg] = useState('Screen locked. Look up.');
  const [lastTapTime, setLastTapTime] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timerRef = useRef<any>(null);

  // Handle Canvas Audio Visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;
    const analyser = soundEngine.getAnalyser();
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      if (!running) return;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      analyser.getByteFrequencyData(dataArray);

      // Draw frequency spectrum bars
      const barWidth = (width / bufferLength) * 2.8;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        // Boost mid frequencies where biophony lives (2kHz - 6kHz)
        let barHeight = (dataArray[i] / 255) * height * 0.9;
        if (status === 'idle' && !isAmbientPlaying) {
          // Gentle idle breathing wave
          barHeight = (Math.sin(i * 0.1 + Date.now() * 0.003) * 0.5 + 0.5) * 12 + 4;
        }

        const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
        gradient.addColorStop(0, '#81C784');
        gradient.addColorStop(0.5, '#4E8752');
        gradient.addColorStop(1, 'rgba(10, 15, 13, 0.2)');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);

        x += barWidth;
      }

      // Draw center organic wave line
      ctx.beginPath();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = status === 'recording' ? '#81C784' : 'rgba(129, 199, 132, 0.4)';
      analyser.getByteTimeDomainData(dataArray);

      const sliceWidth = width / bufferLength;
      let lx = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const ly = (v * height) / 2;
        if (i === 0) ctx.moveTo(lx, ly);
        else ctx.lineTo(lx, ly);
        lx += sliceWidth;
      }
      ctx.stroke();

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [status, isAmbientPlaying]);

  // Toggle ambient sound generation for preset
  const handleToggleAmbient = () => {
    soundEngine.playHaptic();
    if (isAmbientPlaying) {
      soundEngine.stopAmbient();
      setIsAmbientPlaying(false);
    } else {
      soundEngine.playAmbient(selectedPreset.audioToneType);
      setIsAmbientPlaying(true);
    }
  };

  // Switch Preset
  const handleSelectPreset = (preset: SoundscapePreset) => {
    soundEngine.playHaptic();
    setSelectedPreset(preset);
    if (isAmbientPlaying) {
      soundEngine.playAmbient(preset.audioToneType);
    }
  };

  // Start Grounding Cycle
  const handleStartGrounding = async () => {
    soundEngine.playHaptic();
    setStatus('recording');
    setCountdown(8);

    if (inputMode === 'mic') {
      try {
        await soundEngine.startMicRecording();
      } catch (err) {
        console.warn('Microphone access denied or unsupported, using bioacoustic simulator:', err);
        setInputMode('preset');
        soundEngine.playAmbient(selectedPreset.audioToneType);
        setIsAmbientPlaying(true);
      }
    } else {
      soundEngine.playAmbient(selectedPreset.audioToneType);
      setIsAmbientPlaying(true);
    }

    // Start 8-second countdown
    let remaining = 8;
    timerRef.current = setInterval(async () => {
      remaining -= 1;
      setCountdown(remaining);

      if (remaining <= 0) {
        clearInterval(timerRef.current);
        await handleFinishRecording();
      }
    }, 1000);
  };

  const handleFinishRecording = async () => {
    setStatus('analyzing');

    let audioB64 = '';
    if (inputMode === 'mic') {
      audioB64 = await soundEngine.stopMicRecording();
    } else {
      soundEngine.stopAmbient();
      setIsAmbientPlaying(false);
    }

    // Call API / local simulation
    const result = await ApiService.groundMe(audioB64, selectedPreset);
    setGroundResult(result);
    setStatus('ready');
  };

  const handleEnterBlackout = () => {
    soundEngine.playHaptic();
    setIsBlackoutActive(true);

    if (groundResult) {
      soundEngine.speakPrompt(
        groundResult.prompt,
        groundResult.audio_url,
        () => {
          setBlackoutDoubleTapMsg('Look up. Double-click or tap anywhere to return.');
        }
      );
    }
  };

  const handleExitBlackout = () => {
    // Allow instant exit or double-tap feel
    soundEngine.playHaptic();
    soundEngine.stopSpeaking();
    setIsBlackoutActive(false);
    setStatus('idle');
  };

  const handleBlackoutScreenClick = () => {
    const now = Date.now();
    if (now - lastTapTime < 450) {
      handleExitBlackout();
    } else {
      setLastTapTime(now);
      setBlackoutDoubleTapMsg('Double-tap or double-click to exit.');
    }
  };

  return (
    <section id="grounding-lab" style={styles.section}>
      <div className="bg-grid-pattern" />

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div className="badge-pill">
            <Sparkles size={12} color="#81C784" />
            <span>Interactive BioAcoustic Lab</span>
          </div>
          <h2 style={styles.title}>Experience the 15-Second Flow</h2>
          <p style={styles.subtitle}>
            Test the complete AuraFlora experience right now in your browser. Choose your input mode, let the DSP classify your soundscape, and trigger the pure AMOLED blackout.
          </p>
        </div>

        {/* Lab Grid */}
        <div className="grounding-lab-grid">
          {/* Main Visualizer & Controller */}
          <div className="glass-panel" style={styles.mainCard}>
            {/* Top Toolbar */}
            <div style={styles.topToolbar}>
              <div style={styles.inputModeToggle}>
                <button
                  onClick={() => {
                    soundEngine.playHaptic();
                    setInputMode('preset');
                  }}
                  style={{
                    ...styles.modeBtn,
                    backgroundColor: inputMode === 'preset' ? '#4E8752' : 'transparent',
                    color: inputMode === 'preset' ? '#E8DFD8' : '#9E9590',
                  }}
                >
                  <TreePine size={14} />
                  <span>Preset Soundscapes</span>
                </button>
                <button
                  onClick={() => {
                    soundEngine.playHaptic();
                    setInputMode('mic');
                  }}
                  style={{
                    ...styles.modeBtn,
                    backgroundColor: inputMode === 'mic' ? '#4E8752' : 'transparent',
                    color: inputMode === 'mic' ? '#E8DFD8' : '#9E9590',
                  }}
                >
                  <Mic size={14} />
                  <span>Live 16kHz Mic</span>
                </button>
              </div>

              {inputMode === 'preset' && (
                <button
                  onClick={handleToggleAmbient}
                  style={styles.ambientAudioBtn}
                  title={isAmbientPlaying ? 'Mute synthesized ambiance' : 'Listen to procedural nature ambiance'}
                >
                  {isAmbientPlaying ? (
                    <>
                      <Volume2 size={15} color="#81C784" />
                      <span style={{ color: '#81C784' }}>Ambiance Playing</span>
                    </>
                  ) : (
                    <>
                      <VolumeX size={15} color="#9E9590" />
                      <span>Preview Soundscape</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Canvas Spectrogram & Waveform */}
            <div style={styles.canvasWrapper}>
              <canvas
                ref={canvasRef}
                width={700}
                height={200}
                style={styles.canvas}
              />

              <div style={styles.canvasOverlay}>
                <div style={styles.canvasTag}>
                  <span style={styles.livePulseDot} />
                  {status === 'recording'
                    ? `CAPTURING AMBIENT FREQUENCIES (${countdown}s)`
                    : status === 'analyzing'
                    ? 'RUNNING FFT SPECTRAL ANALYSIS & GEMMA INFERENCE...'
                    : 'SPECTRUM ANALYZER (20 Hz - 8 kHz)'}
                </div>
              </div>
            </div>

            {/* Center State & Interactive Pulse Button */}
            <div style={styles.actionCenter}>
              {status === 'idle' && (
                <div style={styles.actionPromptGroup}>
                  <button
                    onClick={handleStartGrounding}
                    style={styles.startPulseBtn}
                  >
                    <div style={styles.startIconInner}>
                      <Mic size={28} color="#E8DFD8" />
                    </div>
                    <span style={styles.startBtnText}>START GROUNDING</span>
                    <span style={styles.startBtnSub}>Capture & Analyze Sound</span>
                  </button>
                  <p style={styles.startHint}>
                    {inputMode === 'mic'
                      ? 'Microphone stream will sample for 8 seconds'
                      : `Using: ${selectedPreset.title} (${selectedPreset.location})`}
                  </p>
                </div>
              )}

              {status === 'recording' && (
                <div style={styles.recordingGroup}>
                  <div style={styles.countdownRing}>
                    <span style={styles.countdownNum}>{countdown}</span>
                    <span style={styles.countdownSec}>sec</span>
                  </div>
                  <div style={styles.recordingText}>Listening to ambient acoustic textures...</div>
                  <div style={styles.soundBarGroup}>
                    <span className="sound-bar" style={{ animationDelay: '0.1s' }} />
                    <span className="sound-bar" style={{ animationDelay: '0.3s' }} />
                    <span className="sound-bar" style={{ animationDelay: '0.5s' }} />
                    <span className="sound-bar" style={{ animationDelay: '0.2s' }} />
                    <span className="sound-bar" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}

              {status === 'analyzing' && (
                <div style={styles.analyzingGroup}>
                  <div style={styles.spinner} />
                  <div style={styles.analyzingTitle}>Rust DSP · Spectral Decomposition</div>
                  <div style={styles.analyzingSub}>
                    Extracting spectral centroid, biophony ratio, and generating Gemma prompt...
                  </div>
                </div>
              )}

              {status === 'ready' && groundResult && (
                <div style={styles.resultGroup}>
                  <div style={styles.resultHeader}>
                    <div style={styles.resultBadge}>
                      <CheckCircle2 size={16} color="#81C784" />
                      <span>Soundscape Grounded: {groundResult.classification.environment_tag.toUpperCase()}</span>
                    </div>
                    <div style={styles.biophonyScorePill}>
                      Biophony Index: {Math.round(groundResult.classification.biophony_score * 100)}%
                    </div>
                  </div>

                  {/* Grounding Tactile Instruction Preview */}
                  <div style={styles.promptBox}>
                    <div style={styles.promptLabel}>TACTILE OUTDOOR INSTRUCTION</div>
                    <div style={styles.promptText}>"{groundResult.prompt}"</div>
                  </div>

                  {/* Blackout Trigger Button */}
                  <div style={styles.blackoutTriggerWrap}>
                    <button
                      onClick={handleEnterBlackout}
                      style={styles.blackoutCtaBtn}
                    >
                      <Maximize2 size={18} />
                      <span>Enter AMOLED Blackout Mode (Pure Screen Detox)</span>
                    </button>
                    <button
                      onClick={() => {
                        soundEngine.playHaptic();
                        setStatus('idle');
                      }}
                      style={styles.resetBtn}
                    >
                      <RotateCcw size={15} />
                      <span>Test Again</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Acoustic Telemetry Metrics */}
            <div className="grounding-telemetry-grid">
              <div style={styles.telemetryItem}>
                <span style={styles.telLabel}>Spectral Centroid</span>
                <span style={styles.telVal}>
                  {groundResult ? `${groundResult.features.spectral_centroid} Hz` : `${selectedPreset.features.spectral_centroid} Hz`}
                </span>
              </div>
              <div style={styles.telemetryItem}>
                <span style={styles.telLabel}>Biophony Ratio</span>
                <span style={styles.telVal}>
                  {groundResult ? `${Math.round(groundResult.features.biophony_ratio * 100)}%` : `${Math.round(selectedPreset.features.biophony_ratio * 100)}%`}
                </span>
              </div>
              <div style={styles.telemetryItem}>
                <span style={styles.telLabel}>Spectral Entropy</span>
                <span style={styles.telVal}>
                  {groundResult ? groundResult.features.spectral_entropy : selectedPreset.features.spectral_entropy}
                </span>
              </div>
              <div style={styles.telemetryItem}>
                <span style={styles.telLabel}>Ambient RMS</span>
                <span style={styles.telVal}>
                  {groundResult ? `${groundResult.features.rms_db} dB` : `${selectedPreset.features.rms_db} dB`}
                </span>
              </div>
            </div>
          </div>

          {/* Preset Selector Panel */}
          <div className="grounding-presets-container">
            <div style={styles.presetSideTitle}>Soundscape Environments</div>
            <div style={styles.presetList}>
              {SOUNDSCAPE_PRESETS.map((p) => {
                const isSelected = selectedPreset.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectPreset(p)}
                    className="glass-panel"
                    style={{
                      ...styles.presetCard,
                      borderColor: isSelected ? '#81C784' : 'rgba(129, 199, 132, 0.12)',
                      backgroundColor: isSelected ? 'rgba(30, 47, 36, 0.85)' : 'rgba(22, 33, 26, 0.5)',
                    }}
                  >
                    <div style={styles.presetCardTop}>
                      <div style={styles.presetTitleRow}>
                        {p.audioToneType === 'forest' && <TreePine size={16} color="#81C784" />}
                        {p.audioToneType === 'creek' && <Waves size={16} color="#60A5FA" />}
                        {p.audioToneType === 'meadow' && <Sun size={16} color="#FBBF24" />}
                        {p.audioToneType === 'rain' && <CloudRain size={16} color="#A78BFA" />}
                        {p.audioToneType === 'urban_park' && <Building2 size={16} color="#F87171" />}
                        <span style={styles.presetName}>{p.title}</span>
                      </div>
                      <span style={styles.presetRatio}>
                        {Math.round(p.classification.biophony_score * 100)}% Bio
                      </span>
                    </div>

                    <div style={styles.presetLoc}>{p.location}</div>
                    <div style={styles.presetDesc}>{p.description}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen AMOLED Blackout Experience Modal */}
      {isBlackoutActive && (
        <div
          onClick={handleBlackoutScreenClick}
          style={styles.blackoutModal}
        >
          <div style={styles.blackoutContent}>
            <div style={styles.blackoutInstruction}>
              {groundResult ? groundResult.prompt : selectedPreset.samplePrompt}
            </div>
            <div style={styles.blackoutHint}>{blackoutDoubleTapMsg}</div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleExitBlackout();
              }}
              style={styles.blackoutExitBtn}
            >
              Exit Blackout
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  section: {
    position: 'relative',
    padding: 'clamp(32px, 5vw, 80px) clamp(12px, 3vw, 24px)',
    backgroundColor: '#0A0F0D',
  },
  container: {
    maxWidth: 1240,
    margin: '0 auto',
    position: 'relative',
    zIndex: 1,
  },
  header: {
    textAlign: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
    marginTop: 14,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: '1rem',
    color: '#9E9590',
    maxWidth: 680,
    margin: '0 auto',
    lineHeight: 1.6,
  },
  labGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) 360px',
    gap: 24,
    alignItems: 'start',
  },
  mainCard: {
    padding: 24,
    overflow: 'hidden',
  },
  topToolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    flexWrap: 'wrap',
    gap: 12,
  },
  inputModeToggle: {
    display: 'flex',
    backgroundColor: 'rgba(10, 15, 13, 0.7)',
    borderRadius: 10,
    padding: 3,
    border: '1px solid rgba(129, 199, 132, 0.2)',
  },
  modeBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '7px 14px',
    borderRadius: 8,
    fontSize: '0.8rem',
    fontWeight: 600,
    transition: 'all 0.2s',
  },
  ambientAudioBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 14px',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(129, 199, 132, 0.2)',
    fontSize: '0.8rem',
    fontWeight: 500,
    color: '#E8DFD8',
    transition: 'all 0.2s',
  },
  canvasWrapper: {
    position: 'relative',
    width: '100%',
    height: 200,
    backgroundColor: '#070B09',
    borderRadius: 14,
    overflow: 'hidden',
    border: '1px solid rgba(129, 199, 132, 0.18)',
    marginBottom: 28,
  },
  canvas: {
    width: '100%',
    height: '100%',
    display: 'block',
  },
  canvasOverlay: {
    position: 'absolute',
    top: 12,
    left: 14,
  },
  canvasTag: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontFamily: 'var(--font-mono)',
    fontSize: '0.72rem',
    color: '#81C784',
    letterSpacing: '0.05em',
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: '#4ADE80',
    boxShadow: '0 0 8px #4ADE80',
  },
  actionCenter: {
    minHeight: 180,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 0 24px',
  },
  actionPromptGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 14,
  },
  startPulseBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 150,
    borderRadius: '50%',
    backgroundColor: '#16281C',
    border: '2px solid rgba(129, 199, 132, 0.5)',
    boxShadow: '0 0 40px rgba(78, 135, 82, 0.45)',
    cursor: 'pointer',
    transition: 'all 0.25s',
  },
  startIconInner: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    backgroundColor: 'rgba(78, 135, 82, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  startBtnText: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '0.75rem',
    letterSpacing: '0.08em',
    color: '#E8DFD8',
  },
  startBtnSub: {
    fontSize: '0.62rem',
    color: '#81C784',
  },
  startHint: {
    fontSize: '0.8rem',
    color: '#9E9590',
  },
  recordingGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
  countdownRing: {
    width: 90,
    height: 90,
    borderRadius: '50%',
    border: '3px solid #81C784',
    boxShadow: '0 0 25px rgba(129, 199, 132, 0.6)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownNum: {
    fontFamily: 'var(--font-mono)',
    fontSize: '2rem',
    fontWeight: 700,
    color: '#81C784',
    lineHeight: 1,
  },
  countdownSec: {
    fontSize: '0.65rem',
    color: '#9E9590',
    textTransform: 'uppercase',
  },
  recordingText: {
    fontSize: '0.9rem',
    color: '#E8DFD8',
    letterSpacing: '0.04em',
  },
  soundBarGroup: {
    display: 'flex',
    gap: 6,
    alignItems: 'center',
    marginTop: 6,
  },
  analyzingGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    textAlign: 'center',
  },
  spinner: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    border: '3px solid rgba(129, 199, 132, 0.2)',
    borderTopColor: '#81C784',
    animation: 'pulseGlow 1.2s infinite linear',
  },
  analyzingTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '1.05rem',
    color: '#E8DFD8',
  },
  analyzingSub: {
    fontSize: '0.82rem',
    color: '#9E9590',
    maxWidth: 380,
  },
  resultGroup: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  resultHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  resultBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#81C784',
  },
  biophonyScorePill: {
    fontSize: '0.78rem',
    fontWeight: 600,
    padding: '3px 10px',
    borderRadius: 20,
    backgroundColor: 'rgba(78, 135, 82, 0.3)',
    color: '#81C784',
    border: '1px solid rgba(129, 199, 132, 0.3)',
  },
  promptBox: {
    backgroundColor: '#0F1712',
    border: '1px solid rgba(129, 199, 132, 0.3)',
    borderRadius: 14,
    padding: '18px 20px',
    textAlign: 'left',
  },
  promptLabel: {
    fontSize: '0.68rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    color: '#81C784',
    marginBottom: 8,
  },
  promptText: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.15rem',
    lineHeight: 1.5,
    color: '#E8DFD8',
    fontStyle: 'italic',
  },
  blackoutTriggerWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  blackoutCtaBtn: {
    flex: '1 1 200px',
    minWidth: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: '14px 20px',
    backgroundColor: '#000000',
    color: '#E8DFD8',
    borderRadius: 10,
    border: '1px solid rgba(129, 199, 132, 0.6)',
    boxShadow: '0 0 25px rgba(78, 135, 82, 0.35)',
    fontWeight: 600,
    fontSize: '0.9rem',
    transition: 'all 0.2s',
  },
  resetBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '12px 18px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#9E9590',
    borderRadius: 10,
    fontSize: '0.82rem',
    fontWeight: 500,
  },
  telemetryBar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: 12,
    paddingTop: 18,
    borderTop: '1px solid rgba(129, 199, 132, 0.12)',
  },
  telemetryItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  telLabel: {
    fontSize: '0.68rem',
    color: '#9E9590',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  telVal: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.95rem',
    fontWeight: 700,
    color: '#81C784',
  },
  presetsSidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  presetSideTitle: {
    fontSize: '0.82rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: '#9E9590',
    textTransform: 'uppercase',
    paddingLeft: 4,
  },
  presetList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  presetCard: {
    padding: '14px 16px',
    cursor: 'pointer',
    textAlign: 'left',
  },
  presetCardTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  presetTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  presetName: {
    fontWeight: 600,
    fontSize: '0.88rem',
    color: '#E8DFD8',
  },
  presetRatio: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.72rem',
    color: '#81C784',
  },
  presetLoc: {
    fontSize: '0.72rem',
    color: '#9E9590',
    marginBottom: 6,
  },
  presetDesc: {
    fontSize: '0.74rem',
    color: '#706B66',
    lineHeight: 1.3,
  },
  blackoutModal: {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    backgroundColor: '#000000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: 32,
  },
  blackoutContent: {
    maxWidth: 720,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 28,
  },
  blackoutInstruction: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)',
    lineHeight: 1.4,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: 400,
    letterSpacing: '0.02em',
  },
  blackoutHint: {
    fontSize: '0.85rem',
    letterSpacing: '0.12em',
    color: 'rgba(255, 255, 255, 0.25)',
    textTransform: 'uppercase',
  },
  blackoutExitBtn: {
    marginTop: 20,
    padding: '8px 20px',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '0.75rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
};
