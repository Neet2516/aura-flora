import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, GitBranch, Cpu, Radio, Shield, Code, ExternalLink } from 'lucide-react';
import { ScrollRevealText } from './motion/ScrollRevealText';
import { FadeInWhenVisible } from './motion/FadeInWhenVisible';

export const ResearchArchitectureSection: React.FC = () => {
  const cards = [
    {
      icon: Cpu,
      tag: 'RUST 1.75+ · AXUM · TOKIO',
      title: 'Computational Audio Engine',
      text: 'High-throughput async server handling 16kHz WAV streaming. Executes Fast Fourier Transform (FFT) windows via rustfft, computing spectral centroid and energy distribution in under 42ms.',
      specs: [
        { label: 'FFT Window:', val: '512 bins / Hanning' },
        { label: 'Throughput:', val: '< 50ms P99 Latency' },
      ],
    },
    {
      icon: Radio,
      tag: 'TABPFN · HEURISTIC FALLBACK',
      title: 'Soundscape Classifier',
      text: 'Evaluates environmental characteristics into biophonic, geophonic, and anthrophonic tiers. Offline-capable heuristic fallback guarantees classification during poor cellular reception.',
      specs: [
        { label: 'Inference:', val: 'Prior-Data Fitted Net' },
        { label: 'Offline:', val: 'Local Spectral Rule Engine' },
      ],
    },
    {
      icon: Shield,
      tag: 'GEMMA · ELEVENLABS TTS',
      title: 'Grounding Model Orchestration',
      text: 'Google Gemma generates concise, non-hallucinatory physical grounding prompts. ElevenLabs synthesizes calm voice guidance, streamed as compact MP3 audio to mobile endpoints.',
      specs: [
        { label: 'Voice Profile:', val: 'Whisper / Low Cadence' },
        { label: 'Prompt Length:', val: '15–25 words strictly' },
      ],
    },
    {
      icon: Code,
      tag: 'REACT 19 · TYPESCRIPT · VITE PWA',
      title: 'Anti-Screen Mobile Client',
      text: 'Offline-capable Progressive Web App with Workbox service worker precaching, Web Audio API synthesis, 16 kHz PCM microphone capture, and AMOLED screen lock.',
      specs: [
        { label: 'Screen Time:', val: '≤ 15s Hard Cutoff' },
        { label: 'Display Lock:', val: '#000000 True Blackout' },
      ],
    },
  ];

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
            <ScrollRevealText
              text="Research & Engineering Stack"
              tag="h2"
              style={styles.title}
              delay={0.1}
            />
          </div>
          <FadeInWhenVisible delay={0.2}>
            <p style={styles.subtitle}>
              A hybrid edge-and-cloud architecture engineered for deterministic low-latency audio processing and zero data persistence.
            </p>
          </FadeInWhenVisible>
        </div>

        {/* Technical Architecture Stack Columns with Motion */}
        <div style={styles.stackGrid}>
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.tag}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: 0.15 + i * 0.1 }}
                whileHover={{ y: -4, borderColor: 'var(--color-golden-amber)', transition: { duration: 0.2 } }}
                style={styles.stackCard}
              >
                <div style={styles.cardHeader}>
                  <Icon size={18} color="var(--color-golden-amber)" />
                  <span className="font-mono" style={styles.cardTag}>
                    {card.tag}
                  </span>
                </div>
                <h3 style={styles.cardTitle}>{card.title}</h3>
                <p style={styles.cardText}>{card.text}</p>
                <div style={styles.specList} className="font-mono">
                  {card.specs.map((sp) => (
                    <div key={sp.label} style={styles.specRow}>
                      <span>{sp.label}</span>
                      <span style={{ color: '#F7F5EF' }}>{sp.val}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Open Source Project Repository & Challenge Details */}
        <FadeInWhenVisible delay={0.35} yOffset={24}>
          <div style={styles.openSourceBanner}>
            <div style={styles.bannerLeft}>
              <GitBranch size={24} color="var(--color-golden-amber)" />
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
              className="btn-olive-secondary"
              style={{ textDecoration: 'none' }}
            >
              <span>VIEW GITHUB REPOSITORY</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </FadeInWhenVisible>
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
  stackGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
  },
  stackCard: {
    backgroundColor: '#1E1D1A',
    border: '1px solid var(--color-border-subtle)',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    willChange: 'transform',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  cardTag: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--color-golden-amber)',
    letterSpacing: '0.06em',
    fontWeight: 500,
  },
  cardTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '18px',
    fontWeight: 500,
    letterSpacing: '-0.02em',
    color: 'var(--color-soft-offwhite)',
  },
  cardText: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.9375rem',
    lineHeight: 1.65,
    letterSpacing: 'var(--tracking-body)',
    color: 'var(--color-text-secondary)',
    fontWeight: 400,
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
    backgroundColor: '#1E1D1A',
    border: '1px solid var(--color-border-subtle)',
  },
  bannerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
  },
  challengeTag: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--color-golden-amber)',
    letterSpacing: '0.08em',
    fontWeight: 500,
  },
  bannerTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '18px',
    fontWeight: 600,
    letterSpacing: '-0.02em',
    color: 'var(--color-soft-offwhite)',
    marginTop: '2px',
  },
  bannerDesc: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.9375rem',
    lineHeight: 1.65,
    letterSpacing: 'var(--tracking-body)',
    color: 'var(--color-text-secondary)',
    fontWeight: 400,
    marginTop: '2px',
  },
};
