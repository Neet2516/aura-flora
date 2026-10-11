import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Activity, ArrowUpRight, Cpu, Radio, Shield } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import { ScrollRevealText } from './motion/ScrollRevealText';
import { FadeInWhenVisible } from './motion/FadeInWhenVisible';

interface BioacousticLabSectionProps {
  onOpenFullLab: () => void;
}

export const BioacousticLabSection: React.FC<BioacousticLabSectionProps> = ({ onOpenFullLab }) => {
  const [activeBiome, setActiveBiome] = useState<'forest' | 'creek' | 'rain' | 'meadow' | 'urban_park'>('forest');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [liveCentroid, setLiveCentroid] = useState<number>(3150);
  const [liveRms, setLiveRms] = useState<number>(0.42);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const biomes = [
    { id: 'forest' as const, label: '01 · FOREST CANOPY', centroid: '3,450 Hz', biophony: '92%' },
    { id: 'creek' as const, label: '02 · ALPINE CREEK', centroid: '1,820 Hz', biophony: '88%' },
    { id: 'rain' as const, label: '03 · CANOPY RAIN', centroid: '2,240 Hz', biophony: '85%' },
    { id: 'meadow' as const, label: '04 · MEADOW BREEZE', centroid: '4,100 Hz', biophony: '95%' },
    { id: 'urban_park' as const, label: '05 · URBAN GARDEN', centroid: '1,280 Hz', biophony: '68%' },
  ];

  const handleToggleAudio = (biomeId: 'forest' | 'creek' | 'rain' | 'meadow' | 'urban_park') => {
    if (isPlaying && activeBiome === biomeId) {
      soundEngine.stopAmbient();
      setIsPlaying(false);
    } else {
      soundEngine.playAmbient(biomeId);
      setActiveBiome(biomeId);
      setIsPlaying(true);
    }
  };

  // Canvas visualizer loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let analyser: AnalyserNode | null = null;
    try {
      analyser = soundEngine.getAnalyser();
    } catch {
      // AudioContext not yet resumed by gesture
    }

    const bufferLength = analyser ? analyser.frequencyBinCount : 64;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animFrameRef.current = requestAnimationFrame(render);
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      if (isPlaying && analyser) {
        analyser.getByteFrequencyData(dataArray);

        // Compute simulated centroid & RMS
        let sum = 0;
        let weightedSum = 0;
        let squareSum = 0;
        for (let i = 0; i < bufferLength; i++) {
          const val = dataArray[i];
          sum += val;
          weightedSum += val * i;
          squareSum += val * val;
        }
        if (sum > 0) {
          const c = (weightedSum / sum) * 45;
          setLiveCentroid(Math.round(2000 + c * 20));
          setLiveRms(Number((Math.sqrt(squareSum / bufferLength) / 255).toFixed(2)));
        }

        const barWidth = (width / bufferLength) * 2.2;
        let x = 0;

        for (let i = 0; i < bufferLength / 2; i++) {
          const barHeight = (dataArray[i] / 255) * (height * 0.85);

          ctx.fillStyle = i % 4 === 0 ? '#F2C46A' : 'rgba(174, 172, 120, 0.55)';
          ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);

          x += barWidth;
        }
      } else {
        // Subtle resting sine wave pattern when idle
        ctx.strokeStyle = 'rgba(174, 172, 120, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        const t = Date.now() / 1000;
        for (let x = 0; x < width; x += 4) {
          const y = height / 2 + Math.sin(x * 0.03 + t) * 12 + Math.sin(x * 0.08 - t * 0.8) * 6;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  return (
    <section id="lab" style={styles.section}>
      <div className="section-container" style={styles.container}>
        {/* Section Header */}
        <div style={styles.header}>
          <div>
            <div className="tech-eyebrow">
              <Activity size={12} />
              <span>RESEARCH INSTRUMENTATION / 004</span>
            </div>
            <ScrollRevealText
              text="Bioacoustic Intelligence"
              tag="h2"
              style={styles.title}
              delay={0.1}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenFullLab}
            className="btn-amber-primary"
            title="Launch Full Lab Modal"
          >
            <span>OPEN FULL LAB</span>
            <ArrowUpRight size={14} />
          </motion.button>
        </div>

        {/* Live Audio Spectrum Canvas Console */}
        <FadeInWhenVisible delay={0.2} yOffset={24}>
          <div style={styles.consoleBox}>
          {/* Console Header */}
          <div style={styles.consoleBar}>
            <div style={styles.consoleBarLeft}>
              <div className="status-dot-amber" />
              <span className="font-mono" style={styles.consoleTitle}>
                LIVE FFT SPECTRAL ANALYZER [{activeBiome.toUpperCase()}]
              </span>
            </div>
            <div style={styles.consoleMetrics}>
              <span className="meta-label">CENTROID: {liveCentroid} Hz</span>
              <span className="meta-label">RMS: {liveRms}</span>
              <span className="meta-label">STATUS: {isPlaying ? 'SYNTHESIZING' : 'MUTED'}</span>
            </div>
          </div>

          {/* Canvas Spectrum Display */}
          <div style={styles.canvasContainer}>
            <canvas ref={canvasRef} width={1200} height={160} style={styles.canvas} />
          </div>

          {/* Biome Soundscape Switcher */}
          <div style={styles.biomeControls}>
            <span className="meta-label" style={{ alignSelf: 'center', marginRight: '8px' }}>
              PROCEDURAL BIOMES:
            </span>
            {biomes.map((b) => (
              <button
                key={b.id}
                onClick={() => handleToggleAudio(b.id)}
                style={{
                  ...styles.biomeBtn,
                  borderColor: activeBiome === b.id && isPlaying ? 'var(--color-golden-amber)' : 'var(--color-border-subtle)',
                  backgroundColor: activeBiome === b.id && isPlaying ? 'rgba(242, 196, 106, 0.15)' : 'rgba(23, 22, 20, 0.7)',
                  color: activeBiome === b.id && isPlaying ? 'var(--color-golden-amber)' : 'var(--color-text-secondary)',
                }}
                className="font-mono"
              >
                {activeBiome === b.id && isPlaying ? <Volume2 size={13} /> : <VolumeX size={13} />}
                <span>{b.label}</span>
              </button>
            ))}
          </div>
        </div>
      </FadeInWhenVisible>

        {/* 4 Research Architecture Modules */}
        <div style={styles.modulesGrid}>
          {/* Module 1 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: 0.1 }}
            whileHover={{ y: -4, borderColor: 'var(--color-muted-olive)', transition: { duration: 0.2 } }}
            style={styles.moduleCard}
          >
            <div style={styles.moduleTop}>
              <Cpu size={16} color="var(--color-muted-olive)" />
              <span className="meta-label">MODULE 01 · DSP EXTRACTION</span>
            </div>
            <h3 style={styles.moduleTitle}>Spectral Centroid & RMS</h3>
            <p style={styles.moduleDesc}>
              Continuous computation of the audio center-of-mass frequency. Higher centroids denote avian calls (biophony), while low-frequency dominance identifies traffic and HVAC rumble.
            </p>
            <div style={styles.formulaBox} className="font-mono">
              Centroid = Σ(f · M[f]) / Σ(M[f])
            </div>
          </motion.div>

          {/* Module 2 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: 0.2 }}
            whileHover={{ y: -4, borderColor: 'var(--color-muted-olive)', transition: { duration: 0.2 } }}
            style={styles.moduleCard}
          >
            <div style={styles.moduleTop}>
              <Radio size={16} color="var(--color-muted-olive)" />
              <span className="meta-label">MODULE 02 · CLASSIFICATION</span>
            </div>
            <h3 style={styles.moduleTitle}>Biophony vs. Anthrophony</h3>
            <p style={styles.moduleDesc}>
              Distinguishes natural acoustic organisms (biophony) from weather effects (geophony) and human machine noise (anthrophony) to gauge environmental vitality.
            </p>
            <div style={styles.formulaBox} className="font-mono">
              NDSI = (Biophony - Anthrophony) / (Biophony + Anthrophony)
            </div>
          </motion.div>

          {/* Module 3 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: 0.3 }}
            whileHover={{ y: -4, borderColor: 'var(--color-muted-olive)', transition: { duration: 0.2 } }}
            style={styles.moduleCard}
          >
            <div style={styles.moduleTop}>
              <Shield size={16} color="var(--color-muted-olive)" />
              <span className="meta-label">MODULE 03 · GROUNDING LLM</span>
            </div>
            <h3 style={styles.moduleTitle}>Gemma Instruction Synthesis</h3>
            <p style={styles.moduleDesc}>
              Constrained parameter model transforms classified acoustic characteristics into a single, concrete somatic command (e.g., "Find the tree where the sparrow is calling and touch its bark").
            </p>
            <div style={styles.formulaBox} className="font-mono">
              Prompt: "≤ 1 sentence · tactile outdoor action"
            </div>
          </motion.div>

          {/* Module 4 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: 0.4 }}
            whileHover={{ y: -4, borderColor: 'var(--color-muted-olive)', transition: { duration: 0.2 } }}
            style={styles.moduleCard}
          >
            <div style={styles.moduleTop}>
              <Activity size={16} color="var(--color-muted-olive)" />
              <span className="meta-label">MODULE 04 · TTS & BLACKOUT</span>
            </div>
            <h3 style={styles.moduleTitle}>ElevenLabs & AMOLED Lock</h3>
            <p style={styles.moduleDesc}>
              ElevenLabs neural voice delivers calm guidance via headphones, while the OLED display shuts off all pixels (#000000). Total phone illumination drops to zero lux.
            </p>
            <div style={styles.formulaBox} className="font-mono">
              Display: #000000 · 0% Backlight Emission
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  section: {
    padding: '90px 0',
    backgroundColor: 'var(--color-dark-canvas)',
    borderTop: '1px solid var(--color-border-subtle)',
    borderBottom: '1px solid var(--color-border-subtle)',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '36px',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '20px',
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
  consoleBox: {
    backgroundColor: '#1E1D1A',
    border: '1px solid var(--color-border-subtle)',
    display: 'flex',
    flexDirection: 'column',
  },
  consoleBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    padding: '12px 20px',
    borderBottom: '1px solid var(--color-grid-line)',
    backgroundColor: 'rgba(32, 30, 26, 0.95)',
    gap: '12px',
  },
  consoleBarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  consoleTitle: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.06em',
    color: 'var(--color-soft-offwhite)',
  },
  consoleMetrics: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  canvasContainer: {
    width: '100%',
    height: '160px',
    backgroundColor: '#12110F',
    padding: '12px 20px',
  },
  canvas: {
    width: '100%',
    height: '100%',
    display: 'block',
  },
  biomeControls: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
    padding: '12px clamp(12px, 3vw, 20px)',
    borderTop: '1px solid var(--color-grid-line)',
    backgroundColor: 'rgba(26, 25, 22, 0.85)',
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
  biomeBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '7px 12px',
    border: '1px solid',
    cursor: 'pointer',
    fontSize: '11px',
    letterSpacing: '0.05em',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    minHeight: '36px',
  },
  modulesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
    gap: '16px',
  },
  moduleCard: {
    backgroundColor: '#1E1D1A',
    border: '1px solid var(--color-border-subtle)',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  moduleTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  moduleTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '18px',
    fontWeight: 500,
    letterSpacing: '-0.02em',
    color: 'var(--color-soft-offwhite)',
  },
  moduleDesc: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.9375rem',
    lineHeight: 1.65,
    letterSpacing: 'var(--tracking-body)',
    color: 'var(--color-text-secondary)',
    fontWeight: 400,
    flex: 1,
  },
  formulaBox: {
    fontSize: '11px',
    padding: '8px 12px',
    backgroundColor: '#12110F',
    border: '1px solid var(--color-grid-line)',
    color: 'var(--color-muted-olive)',
  },
};
