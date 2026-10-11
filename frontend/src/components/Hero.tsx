import React from 'react';
import { Mic, ArrowDown } from 'lucide-react';

interface HeroProps {
  onStartGrounding: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartGrounding }) => {
  return (
    <section id="hero" style={styles.section}>
      <div className="bg-grid-pattern" />

      {/* Decorative ambient blurred aura */}
      <div style={styles.ambientAura} />

      <div style={styles.container}>
        {/* Eyebrow */}
        <div style={styles.eyebrowContainer}>
          <span className="badge-pill">
            <span style={styles.greenDot} />
            Hacktoberfest 2026 · "Touch Grass" Challenge
          </span>
        </div>

        {/* Main Heading */}
        <h1 style={styles.title}>
          Stop Looking at Glass. <br />
          <span style={styles.gradientText}>Listen to the Air.</span>
        </h1>

        {/* Subtitle */}
        <p style={styles.subtitle}>
          AuraFlora is an anti-screen sensory grounding companion that gets you off your device in under 15 seconds. Tap once, capture ambient sound, receive one tactile outdoor instruction, and watch your display fade into pure AMOLED blackout.
        </p>

        {/* Hero Interactive Pulse Trigger */}
        <div style={styles.pulseHeroWrapper}>
          <div style={styles.pulseOuterRings}>
            <div style={{ ...styles.ring, ...styles.ring1 }} />
            <div style={{ ...styles.ring, ...styles.ring2 }} />
          </div>

          <button
            onClick={onStartGrounding}
            style={styles.heroPulseButton}
            title="Start Ambient BioAcoustic Grounding"
          >
            <div style={styles.pulseIconWrap}>
              <Mic size={32} color="#E8DFD8" />
            </div>
            <span style={styles.pulseBtnLabel}>PRESS · LISTEN · GO</span>
            <span style={styles.pulseBtnSub}>10s Acoustic Capture</span>
          </button>
        </div>

        {/* Metrics Row */}
        <div style={styles.metricsRow}>
          <div className="glass-panel" style={styles.metricCard}>
            <div style={styles.metricValue}>≤ 15s</div>
            <div style={styles.metricLabel}>Max Screen Time</div>
            <div style={styles.metricDesc}>Designed to be shut off immediately</div>
          </div>

          <div className="glass-panel" style={styles.metricCard}>
            <div style={styles.metricValue}>88%</div>
            <div style={styles.metricLabel}>Biophony Target</div>
            <div style={styles.metricDesc}>Distinguishes birds & wind from noise</div>
          </div>

          <div className="glass-panel" style={styles.metricCard}>
            <div style={styles.metricValue}>#000000</div>
            <div style={styles.metricLabel}>AMOLED Blackout</div>
            <div style={styles.metricDesc}>Zero backlight emission lock</div>
          </div>

          <div className="glass-panel" style={styles.metricCard}>
            <div style={styles.metricValue}>1 Tactile</div>
            <div style={styles.metricLabel}>Physical Prompt</div>
            <div style={styles.metricDesc}>Google Gemma 2B-IT grounded AI</div>
          </div>
        </div>

        {/* Scroll indicator */}
        <a href="#grounding-lab" style={styles.scrollLink}>
          <span>Explore Interactive Grounding Lab</span>
          <ArrowDown size={14} />
        </a>
      </div>
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  section: {
    position: 'relative',
    minHeight: '88vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 24px 60px',
    overflow: 'hidden',
  },
  ambientAura: {
    position: 'absolute',
    top: '20%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(78, 135, 82, 0.22) 0%, rgba(129, 199, 132, 0.05) 50%, transparent 70%)',
    filter: 'blur(70px)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  container: {
    position: 'relative',
    zIndex: 1,
    maxWidth: 960,
    margin: '0 auto',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  eyebrowContainer: {
    marginBottom: 24,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: '#81C784',
    boxShadow: '0 0 8px #81C784',
  },
  title: {
    fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
    lineHeight: 1.1,
    fontWeight: 800,
    letterSpacing: '-0.03em',
    marginBottom: 20,
  },
  gradientText: {
    background: 'linear-gradient(135deg, #81C784 0%, #E8DFD8 70%, #4E8752 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
    lineHeight: 1.6,
    color: '#9E9590',
    maxWidth: 720,
    margin: '0 auto 40px',
  },
  pulseHeroWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '10px 0 60px',
  },
  pulseOuterRings: {
    position: 'absolute',
    inset: -30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  ring: {
    position: 'absolute',
    borderRadius: '50%',
    border: '1px solid rgba(129, 199, 132, 0.25)',
  },
  ring1: {
    width: '220px',
    height: '220px',
    animation: 'rippleWave 3.5s infinite linear',
  },
  ring2: {
    width: '260px',
    height: '260px',
    animation: 'rippleWave 3.5s infinite linear',
    animationDelay: '1.75s',
  },
  heroPulseButton: {
    position: 'relative',
    zIndex: 2,
    width: 170,
    height: 170,
    borderRadius: '50%',
    backgroundColor: '#16281C',
    border: '2px solid rgba(129, 199, 132, 0.6)',
    boxShadow: '0 0 50px rgba(78, 135, 82, 0.5), inset 0 0 25px rgba(129, 199, 132, 0.25)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  pulseIconWrap: {
    width: 54,
    height: 54,
    borderRadius: '50%',
    backgroundColor: 'rgba(78, 135, 82, 0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseBtnLabel: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '0.78rem',
    letterSpacing: '0.12em',
    color: '#E8DFD8',
  },
  pulseBtnSub: {
    fontSize: '0.68rem',
    color: '#81C784',
    fontWeight: 500,
    letterSpacing: '0.04em',
  },
  metricsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 16,
    width: '100%',
    maxWidth: 920,
    marginBottom: 40,
  },
  metricCard: {
    padding: '20px 16px',
    textAlign: 'center',
  },
  metricValue: {
    fontFamily: 'var(--font-mono)',
    fontSize: '1.65rem',
    fontWeight: 700,
    color: '#81C784',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#E8DFD8',
    marginBottom: 4,
  },
  metricDesc: {
    fontSize: '0.72rem',
    color: '#9E9590',
    lineHeight: 1.3,
  },
  scrollLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: '0.82rem',
    color: '#9E9590',
    letterSpacing: '0.04em',
    transition: 'color 0.2s',
  },
};
