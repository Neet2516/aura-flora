import React from 'react';
import { Mic, Server, Cpu, Sparkles, Volume2, Moon, GitFork } from 'lucide-react';

export const ArchitecturePipeline: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Acoustic Capture',
      tool: 'Client Device',
      icon: <Mic size={20} color="var(--color-golden-amber)" />,
      detail: 'Samples 5-10s of ambient sound at 16kHz mono PCM. Encodes to Base64 WAV buffer.',
      badge: '≤ 10 sec',
    },
    {
      num: '02',
      title: 'Rust Axum Server',
      tool: 'Tokio Async',
      icon: <Server size={20} color="var(--color-muted-olive)" />,
      detail: 'Ingests request at POST /api/v1/ground with memory-safe Zero-Copy decoding.',
      badge: '< 5 ms',
    },
    {
      num: '03',
      title: 'FFT Feature Engine',
      tool: 'rustfft DSP',
      icon: <Cpu size={20} color="var(--color-golden-amber)" />,
      detail: 'Extracts spectral centroid, Shannon entropy, RMS dB, and biophony/anthrophony ratio.',
      badge: '< 8 ms',
    },
    {
      num: '04',
      title: 'Ecosystem Classifier',
      tool: 'TabPFN Network',
      icon: <GitFork size={20} color="var(--color-muted-olive)" />,
      detail: 'Classifies acoustic environment (forest, meadow, creek, rain, urban edge).',
      badge: '< 15 ms',
    },
    {
      num: '05',
      title: 'Tactile Prompt Gen',
      tool: 'Google Gemma 2B-IT',
      icon: <Sparkles size={20} color="var(--color-golden-amber)" />,
      detail: 'Synthesizes exactly one physical outdoor tactile command grounded in the detected acoustic biome.',
      badge: '~ 350 ms',
    },
    {
      num: '06',
      title: 'Whisper Synthesis',
      tool: 'ElevenLabs TTS',
      icon: <Volume2 size={20} color="var(--color-muted-olive)" />,
      detail: 'Generates calm, low-amplitude whisper audio file served back to client as MP3.',
      badge: '~ 400 ms',
    },
    {
      num: '07',
      title: 'AMOLED Blackout',
      tool: 'Pure #000000',
      icon: <Moon size={20} color="var(--color-soft-offwhite)" />,
      detail: 'Client screen dims to absolute zero pixels. Screen time ends. User touches grass.',
      badge: 'Target: ≤ 15s',
    },
  ];

  return (
    <section id="pipeline" style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div className="tech-eyebrow" style={{ display: 'inline-flex', marginBottom: 12 }}>
            <Server size={12} color="var(--color-golden-amber)" />
            <span>End-to-End Execution Graph</span>
          </div>
          <h2 style={styles.title}>The 15-Second Pipeline</h2>
          <p style={styles.subtitle}>
            From the instant you tap the record pulse to total screen blackout, the pipeline executes in sub-second latency across asynchronous Rust and Google AI.
          </p>
        </div>

        {/* Pipeline Cards Grid */}
        <div style={styles.stepsGrid}>
          {steps.map((step, idx) => (
            <div key={idx} style={styles.stepCard}>
              <div style={styles.stepTop}>
                <span style={styles.stepNum}>{step.num}</span>
                <span style={styles.stepBadge}>{step.badge}</span>
              </div>

              <div style={styles.stepIconWrap}>{step.icon}</div>
              <h3 style={styles.stepTitle}>{step.title}</h3>
              <div style={styles.stepTool}>{step.tool}</div>
              <p style={styles.stepDetail}>{step.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  section: {
    padding: 'clamp(32px, 5vw, 80px) clamp(12px, 3vw, 24px)',
    backgroundColor: 'var(--color-dark-canvas)',
  },
  container: {
    maxWidth: 1200,
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: 48,
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(1.85rem, 3.2vw, 2.75rem)',
    letterSpacing: '-0.035em',
    lineHeight: 1.1,
    fontWeight: 600,
    color: 'var(--color-soft-offwhite)',
    marginTop: 14,
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(0.95rem, 1.2vw, 1.05rem)',
    letterSpacing: 'var(--tracking-body)',
    color: 'var(--color-text-secondary)',
    maxWidth: 680,
    margin: '0 auto',
    lineHeight: 1.65,
    fontWeight: 400,
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
    gap: 16,
  },
  stepCard: {
    padding: '24px 20px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    textAlign: 'left',
    backgroundColor: '#1E1D1A',
    border: '1px solid var(--color-border-subtle)',
  },
  stepTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  stepNum: {
    fontFamily: 'var(--font-mono)',
    fontSize: '1.1rem',
    fontWeight: 700,
    color: 'var(--color-golden-amber)',
  },
  stepBadge: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    padding: '2px 8px',
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: 'var(--color-text-muted)',
    border: '1px solid var(--color-grid-line)',
  },
  stepIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(174, 172, 120, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  stepTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '17px',
    fontWeight: 500,
    letterSpacing: '-0.02em',
    color: 'var(--color-soft-offwhite)',
    marginBottom: 4,
  },
  stepTool: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    color: 'var(--color-muted-olive)',
    fontWeight: 600,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  stepDetail: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.8125rem',
    lineHeight: 1.6,
    letterSpacing: 'var(--tracking-body)',
    color: 'var(--color-text-secondary)',
    fontWeight: 400,
  },
};
