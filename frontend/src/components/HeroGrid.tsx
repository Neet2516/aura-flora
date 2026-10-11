import React, { useState } from 'react';
import { ArrowDownRight, Radio, Send } from 'lucide-react';

interface HeroGridProps {
  activeProjectIndex: string;
  onExploreWork: () => void;
  onLaunchLab: () => void;
  onContact: () => void;
}

export const HeroGrid: React.FC<HeroGridProps> = ({
  activeProjectIndex,
  onExploreWork,
  onLaunchLab,
  onContact,
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section style={styles.heroRoot} id="about">
      <div className="grid-container hero-grid-matrix">
        {/* Left Column: Portrait, Meta & Project Counter (~38%) */}
        <div className="grid-cell hero-left-col" style={styles.leftCol}>
          {/* Cell A1: Identity / Portrait Frame */}
          <div
            style={{
              ...styles.portraitContainer,
              transform: `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div style={styles.portraitFrame}>
              {/* Architectural Wireframe Avatar */}
              <div style={styles.avatarGraphic}>
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="100" cy="100" r="80" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  <circle cx="100" cy="100" r="50" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="20" y1="100" x2="180" y2="100" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                  <line x1="100" y1="20" x2="100" y2="180" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                  <rect x="70" y="70" width="60" height="60" stroke="#FFFFFF" strokeWidth="1.5" />
                  <text
                    x="100"
                    y="105"
                    fill="#ECECE8"
                    fontSize="10"
                    fontFamily="JetBrains Mono"
                    textAnchor="middle"
                    letterSpacing="0.1em"
                  >
                    J.MR
                  </text>
                  <text
                    x="100"
                    y="125"
                    fill="#8C8C8C"
                    fontSize="7"
                    fontFamily="JetBrains Mono"
                    textAnchor="middle"
                  >
                    40.7128° N, 74.0060° W
                  </text>
                </svg>
              </div>
              <div style={styles.portraitBadge}>
                <span className="status-dot" />
                <span style={styles.badgeText}>ARCHITECTURAL ATELIER</span>
              </div>
            </div>
          </div>

          {/* Cell A2: Metadata Block */}
          <div style={styles.metaBlock}>
            <div style={styles.metaRow}>
              <span className="meta-label">PRACTICE</span>
              <span style={styles.metaVal}>CREATIVE DIRECTION & SPATIAL SYSTEMS</span>
            </div>
            <div style={styles.metaRow}>
              <span className="meta-label">LOCATION</span>
              <span style={styles.metaVal}>NEW YORK · 40.7128° N, 74.0060° W</span>
            </div>
            <div style={styles.metaRow}>
              <span className="meta-label">AVAILABILITY</span>
              <span style={styles.metaValHighlight}>COMMISSIONS OPEN · Q4 2026</span>
            </div>
            <div style={styles.metaRow}>
              <span className="meta-label">BIOACOUSTICS</span>
              <span style={styles.metaVal}>AURAFLORA RESEARCH LAB (AXUM + DSP)</span>
            </div>
          </div>

          {/* Cell A3: Active Project Counter */}
          <div style={styles.counterBlock}>
            <div>
              <span className="meta-label">ACTIVE SELECTION</span>
              <div style={styles.counterNumber}>{activeProjectIndex}</div>
            </div>
            <div style={styles.counterMeta}>
              <span style={styles.counterSub}>CURATED PORTFOLIO</span>
              <span style={styles.counterStatus}>SWIPE / DRAG STAGE →</span>
            </div>
          </div>
        </div>

        {/* Right Column: Large Bold Editorial Statement (~62%) */}
        <div className="grid-cell hero-right-col" style={styles.rightCol}>
          {/* Cell B1: Editorial Headline Block */}
          <div style={styles.headlineBlock}>
            <div style={styles.disciplinePills}>
              <span style={styles.pill}>SPATIAL COMPUTATION</span>
              <span style={styles.pill}>BIOACOUSTIC SYSTEMS</span>
              <span style={styles.pill}>SWISS EDITORIAL</span>
              <span style={styles.pill}>HIGH-SPEED AERODYNAMICS</span>
            </div>

            <h1 style={styles.heroHeadline}>
              Designing spatial digital architectures for autonomous intelligence & tactile human experiences.
            </h1>
          </div>

          {/* Cell B2: Sub-Editorial Abstract & Manifesto */}
          <div style={styles.abstractBlock}>
            <p style={styles.abstractParagraph}>
              We operate at the convergence of architectural minimalism, high-frequency digital signal processing,
              and tactile graphic art. Every artifact is governed by strict 1-pixel geometric discipline,
              calibrated motion physics, and typography that demands quiet authority.
            </p>
            <p style={styles.abstractParagraph}>
              Our research division develops <em>AuraFlora</em>—an anti-screen ambient acoustic companion that analyzes
              environmental biophony in 16kHz WAV format, generates grounding protocols via Gemma AI, and enforces
              AMOLED screen blackouts to reconnect human cognition with the living world.
            </p>
          </div>

          {/* Cell B3: Quick Action Anchors */}
          <div style={styles.actionsBar}>
            <button onClick={onExploreWork} className="editorial-link" style={styles.actionLink}>
              <span>[ 01 · EXPLORE CURATED WORK ]</span>
              <ArrowDownRight size={14} />
            </button>

            <button onClick={onLaunchLab} className="editorial-link" style={{ ...styles.actionLink, color: '#FFFFFF' }}>
              <span>[ 02 · LAUNCH AURAFLORA LAB ]</span>
              <Radio size={14} color="#4ADE80" />
            </button>

            <button onClick={onContact} className="editorial-link" style={styles.actionLink}>
              <span>[ 03 · INQUIRE / TRANSMIT ]</span>
              <Send size={13} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  heroRoot: {
    width: '100%',
    backgroundColor: 'var(--color-bg-primary)',
  },
  gridMatrix: {
    gridTemplateColumns: 'minmax(340px, 38%) 1fr',
    minHeight: 'calc(100vh - 60px)',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '36px',
    backgroundColor: 'var(--color-bg-primary)',
  },
  portraitContainer: {
    width: '100%',
    aspectRatio: '1 / 1',
    maxHeight: '320px',
    marginBottom: '28px',
    transition: 'transform 0.4s var(--ease-out-expo)',
  },
  portraitFrame: {
    width: '100%',
    height: '100%',
    border: '1px solid var(--color-grid-line)',
    backgroundColor: 'var(--color-bg-secondary)',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarGraphic: {
    width: '100%',
    height: '100%',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  portraitBadge: {
    position: 'absolute',
    bottom: '12px',
    left: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 10px',
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    border: '1px solid var(--color-grid-line)',
    backdropFilter: 'blur(8px)',
  },
  badgeText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '9px',
    letterSpacing: '0.1em',
    color: 'var(--color-text-primary)',
  },
  metaBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '24px 0',
    borderTop: '1px solid var(--color-grid-line)',
    borderBottom: '1px solid var(--color-grid-line)',
  },
  metaRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  metaVal: {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    color: 'var(--color-text-primary)',
    letterSpacing: '0.02em',
  },
  metaValHighlight: {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    color: '#FFFFFF',
    fontWeight: 600,
  },
  counterBlock: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: '24px',
  },
  counterNumber: {
    fontFamily: 'var(--font-sans)',
    fontSize: '48px',
    fontWeight: 700,
    lineHeight: 1,
    letterSpacing: '-0.04em',
    color: 'var(--color-text-primary)',
    marginTop: '6px',
  },
  counterMeta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px',
  },
  counterSub: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: 'var(--color-text-muted)',
    letterSpacing: '0.08em',
  },
  counterStatus: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--color-text-secondary)',
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '48px 56px',
    backgroundColor: 'var(--color-bg-primary)',
  },
  headlineBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  disciplinePills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  pill: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    letterSpacing: '0.08em',
    padding: '4px 10px',
    border: '1px solid var(--color-grid-line)',
    color: 'var(--color-text-secondary)',
    backgroundColor: 'var(--color-bg-secondary)',
  },
  heroHeadline: {
    fontSize: 'clamp(2.5rem, 5.2vw, 5.25rem)',
    lineHeight: 1.04,
    letterSpacing: '-0.035em',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    maxWidth: '1200px',
  },
  abstractBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '820px',
    margin: '36px 0',
  },
  abstractParagraph: {
    fontSize: '16px',
    lineHeight: 1.6,
    color: 'var(--color-text-secondary)',
  },
  actionsBar: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '36px',
    paddingTop: '28px',
    borderTop: '1px solid var(--color-grid-line)',
  },
  actionLink: {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    letterSpacing: '0.06em',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: '4px 0',
  },
};
