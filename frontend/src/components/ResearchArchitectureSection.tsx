import React from 'react';
import { Terminal, GitBranch, Cpu, Radio, Shield, Code, ExternalLink } from 'lucide-react';

export const ResearchArchitectureSection: React.FC = () => {
  return (
    <section id="research" style={styles.section}>
      <div className="section-container" style={styles.container}>
        {/* Section Header */}
        <div style={styles.header}>
          <div>
            <div className="tech-eyebrow">
              <Terminal size={12} />
              <span>SYSTEM ARCHITECTURE / 007</span>
            </div>
            <h2 style={styles.title}>Research & Engineering Stack</h2>
          </div>
          <p style={styles.subtitle}>
            A hybrid edge-and-cloud architecture engineered for deterministic low-latency audio processing and zero data persistence.
          </p>
        </div>

        {/* Technical Architecture Stack Columns */}
        <div style={styles.stackGrid}>
          {/* Card 1: Rust Backend */}
          <div style={styles.stackCard}>
            <div style={styles.cardHeader}>
              <Cpu size={18} color="#B5E48C" />
              <span className="font-mono" style={styles.cardTag}>RUST 1.75+ · AXUM · TOKIO</span>
            </div>
            <h3 style={styles.cardTitle}>Computational Audio Engine</h3>
            <p style={styles.cardText}>
              High-throughput async server handling 16kHz WAV streaming. Executes Fast Fourier Transform (FFT) windows via <code>rustfft</code>, computing spectral centroid and energy distribution in under 42ms.
            </p>
            <div style={styles.specList} className="font-mono">
              <div style={styles.specRow}>
                <span>FFT Window:</span>
                <span style={{ color: '#F1F2EC' }}>512 bins / Hanning</span>
              </div>
              <div style={styles.specRow}>
                <span>Throughput:</span>
                <span style={{ color: '#F1F2EC' }}>&lt; 50ms P99 Latency</span>
              </div>
            </div>
          </div>

          {/* Card 2: Acoustic Classifier */}
          <div style={styles.stackCard}>
            <div style={styles.cardHeader}>
              <Radio size={18} color="#B5E48C" />
              <span className="font-mono" style={styles.cardTag}>TABPFN · HEURISTIC FALLBACK</span>
            </div>
            <h3 style={styles.cardTitle}>Soundscape Classifier</h3>
            <p style={styles.cardText}>
              Evaluates environmental characteristics into biophonic, geophonic, and anthrophonic tiers. Offline-capable heuristic fallback guarantees classification during poor cellular reception.
            </p>
            <div style={styles.specList} className="font-mono">
              <div style={styles.specRow}>
                <span>Inference:</span>
                <span style={{ color: '#F1F2EC' }}>Prior-Data Fitted Net</span>
              </div>
              <div style={styles.specRow}>
                <span>Offline:</span>
                <span style={{ color: '#F1F2EC' }}>Local Spectral Rule Engine</span>
              </div>
            </div>
          </div>

          {/* Card 3: AI Orchestration */}
          <div style={styles.stackCard}>
            <div style={styles.cardHeader}>
              <Shield size={18} color="#B5E48C" />
              <span className="font-mono" style={styles.cardTag}>GEMMA · ELEVENLABS TTS</span>
            </div>
            <h3 style={styles.cardTitle}>Grounding Model Orchestration</h3>
            <p style={styles.cardText}>
              Google Gemma generates concise, non-hallucinatory physical grounding prompts. ElevenLabs synthesizes calm voice guidance, streamed as compact MP3 audio to mobile endpoints.
            </p>
            <div style={styles.specList} className="font-mono">
              <div style={styles.specRow}>
                <span>Voice Profile:</span>
                <span style={{ color: '#F1F2EC' }}>Whisper / Low Cadence</span>
              </div>
              <div style={styles.specRow}>
                <span>Prompt Length:</span>
                <span style={{ color: '#F1F2EC' }}>15–25 words strictly</span>
              </div>
            </div>
          </div>

          {/* Card 4: Flutter Mobile & PWA Client */}
          <div style={styles.stackCard}>
            <div style={styles.cardHeader}>
              <Code size={18} color="#B5E48C" />
              <span className="font-mono" style={styles.cardTag}>FLUTTER 3.19+ · REACT 19 PWA</span>
            </div>
            <h3 style={styles.cardTitle}>Anti-Screen Mobile Client</h3>
            <p style={styles.cardText}>
              Native Flutter client with Riverpod state management, plus an offline-capable Progressive Web App with Workbox service worker precaching, Web Audio API synthesis, and AMOLED screen lock.
            </p>
            <div style={styles.specList} className="font-mono">
              <div style={styles.specRow}>
                <span>Screen Time:</span>
                <span style={{ color: '#B5E48C' }}>≤ 15s Hard Cutoff</span>
              </div>
              <div style={styles.specRow}>
                <span>Display Lock:</span>
                <span style={{ color: '#F1F2EC' }}>#000000 True Blackout</span>
              </div>
            </div>
          </div>
        </div>

        {/* Open Source Project Repository & Challenge Details */}
        <div style={styles.openSourceBanner}>
          <div style={styles.bannerLeft}>
            <GitBranch size={24} color="#B5E48C" />
            <div>
              <span className="font-mono" style={styles.challengeTag}>
                HACKTOBERFEST 2026 · "TOUCH GRASS" CHALLENGE ENTRY
              </span>
              <h4 style={styles.bannerTitle}>Open Source Bioacoustic Ecology</h4>
              <p style={styles.bannerDesc}>
                Licensed under MIT. Zero tracking, zero advertisements, and zero persistent user audio retention.
              </p>
            </div>
          </div>

          <a
            href="https://github.com/Neet2516/aura-flora"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-botanical-secondary"
            style={{ textDecoration: 'none' }}
          >
            <span>VIEW GITHUB REPOSITORY</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  section: {
    padding: '90px 0',
    backgroundColor: 'var(--color-bg-secondary)',
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
    flexDirection: 'column',
    gap: '12px',
    maxWidth: '800px',
  },
  title: {
    fontSize: 'clamp(2.2rem, 4vw, 3.8rem)',
    letterSpacing: '-0.03em',
    color: '#F1F2EC',
    lineHeight: 1.1,
    marginTop: '8px',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.6,
  },
  stackGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
  },
  stackCard: {
    backgroundColor: 'var(--color-bg-elevated)',
    border: '1px solid var(--color-border-subtle)',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  cardTag: {
    fontSize: '11px',
    color: 'var(--color-botanical)',
    letterSpacing: '0.06em',
  },
  cardTitle: {
    fontSize: '17px',
    fontWeight: 600,
    color: '#F1F2EC',
  },
  cardText: {
    fontSize: '13px',
    lineHeight: 1.6,
    color: 'var(--color-text-secondary)',
    flex: 1,
  },
  specList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    paddingTop: '12px',
    borderTop: '1px solid var(--color-grid-line)',
    fontSize: '11px',
  },
  specRow: {
    display: 'flex',
    justifyContent: 'space-between',
    color: 'var(--color-text-muted)',
  },
  openSourceBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '24px',
    padding: '28px',
    backgroundColor: '#080A09',
    border: '1px solid var(--color-border-subtle)',
  },
  bannerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
  },
  challengeTag: {
    fontSize: '11px',
    color: 'var(--color-botanical)',
    letterSpacing: '0.08em',
  },
  bannerTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#F1F2EC',
    marginTop: '2px',
  },
  bannerDesc: {
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
    marginTop: '2px',
  },
};
