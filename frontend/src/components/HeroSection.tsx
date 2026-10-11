import React from 'react';
import { ArrowDown, Activity, Download } from 'lucide-react';

interface HeroSectionProps {
  onExploreProtocol: () => void;
  onLaunchLab: () => void;
  onTriggerInstall: () => void;
  canInstall: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreProtocol,
  onLaunchLab,
  onTriggerInstall,
  canInstall,
}) => {
  return (
    <section id="hero" style={styles.heroSection}>
      {/* Background Topographic Contour Video Loop */}
      <div style={styles.videoWrapper}>
        <video
          src="/background-video.mp4"
          poster="/contour-poster.svg"
          autoPlay
          loop
          muted
          playsInline
          style={styles.backgroundVideo}
          aria-hidden="true"
        />
        {/* Poster Fallback for Reduced Motion or Slow Networks */}
        <img
          src="/contour-poster.svg"
          alt="Topographic contours"
          style={styles.reducedMotionPoster}
          className="video-reduced-motion-fallback"
          aria-hidden="true"
        />
        {/* Subtle Dark Vignette & Readability Gradient Overlay */}
        <div style={styles.videoOverlay} />
      </div>

      {/* Hero Content Container */}
      <div className="section-container" style={styles.contentContainer}>
        {/* Corner Crosshair Instrumentation Marks */}
        <div className="crosshair-corner crosshair-tl" />
        <div className="crosshair-corner crosshair-tr" />
        <div className="crosshair-corner crosshair-bl" />
        <div className="crosshair-corner crosshair-br" />

        {/* Top Eyebrow */}
        <div style={styles.eyebrowRow}>
          <div className="tech-eyebrow">
            <span className="status-dot-active" />
            <span>AURAFLORA / FIELD EXPERIMENT 001</span>
          </div>
          <span className="meta-label desktop-only">HACKTOBERFEST 2026 · "TOUCH GRASS" CHALLENGE</span>
        </div>

        {/* Dominant Editorial Headline */}
        <div style={styles.headlineBlock}>
          <h1 style={styles.headline}>
            Listen to the world.
            <br />
            <span style={styles.headlineMuted}>Leave the screen.</span>
          </h1>
        </div>

        {/* Supporting Statement & Philosophy */}
        <p style={styles.supportingCopy}>
          An ambient bioacoustic companion that turns the raw sounds around you into a compelling reason to step outside. One intentional press, ten seconds of ambient listening, and a seamless blackout.
        </p>

        {/* Action Controls */}
        <div style={styles.actionGroup}>
          <button
            onClick={onExploreProtocol}
            className="btn-botanical-primary"
            title="Explore 5-Stage Bioacoustic Protocol"
          >
            <span>EXPLORE THE PROTOCOL</span>
            <ArrowDown size={14} />
          </button>

          <button
            onClick={onLaunchLab}
            className="btn-botanical-secondary"
            title="Open Interactive Bioacoustic DSP Lab"
          >
            <Activity size={14} color="#B5E48C" />
            <span>LAUNCH LIVE LAB</span>
          </button>

          {canInstall && (
            <button
              onClick={onTriggerInstall}
              className="btn-botanical-secondary"
              title="Install AuraFlora PWA to device"
            >
              <Download size={14} />
              <span>INSTALL PWA</span>
            </button>
          )}
        </div>

        {/* Bottom Technical Specifications & Measurement Grid */}
        <div style={styles.specGrid}>
          <div style={styles.specItem}>
            <span className="meta-label">INPUT SAMPLING</span>
            <span style={styles.specVal}>16 kHz WAV · MIC FFT</span>
          </div>
          <div style={styles.specItem}>
            <span className="meta-label">MAX SCREEN TIME</span>
            <span style={styles.specVal}>≤ 15 SECONDS</span>
          </div>
          <div style={styles.specItem}>
            <span className="meta-label">BIOACOUSTIC ENGINE</span>
            <span style={styles.specVal}>RUST AXUM · TOKIO DSP</span>
          </div>
          <div style={styles.specItem}>
            <span className="meta-label">FINAL STATE</span>
            <span style={styles.specVal}>AMOLED #000000 LOCK</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  heroSection: {
    position: 'relative',
    minHeight: 'calc(100vh - 60px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 0 40px',
    overflow: 'hidden',
    backgroundColor: '#080A09',
  },
  videoWrapper: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
  },
  backgroundVideo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    opacity: 0.55,
  },
  reducedMotionPoster: {
    display: 'none',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: 0.45,
  },
  videoOverlay: {
    position: 'absolute',
    inset: 0,
    background:
      'radial-gradient(circle at 50% 40%, rgba(8, 10, 9, 0.45) 0%, rgba(8, 10, 9, 0.88) 75%, #080A09 100%)',
    mixBlendMode: 'multiply',
  },
  contentContainer: {
    position: 'relative',
    zIndex: 10,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    paddingTop: '32px',
    paddingBottom: '32px',
  },
  eyebrowRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
  },
  headlineBlock: {
    maxWidth: '1040px',
  },
  headline: {
    fontSize: 'clamp(2.75rem, 6.2vw, 5.6rem)',
    lineHeight: 1.02,
    letterSpacing: '-0.035em',
    color: '#F1F2EC',
    fontWeight: 700,
  },
  headlineMuted: {
    color: 'var(--color-text-secondary)',
    fontWeight: 500,
  },
  supportingCopy: {
    maxWidth: '680px',
    fontSize: 'clamp(1.05rem, 1.4vw, 1.25rem)',
    lineHeight: 1.6,
    color: 'var(--color-text-secondary)',
  },
  actionGroup: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    paddingTop: '8px',
  },
  specGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    paddingTop: '36px',
    borderTop: '1px solid var(--color-grid-line)',
  },
  specItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  specVal: {
    fontFamily: 'var(--font-mono)',
    fontSize: '13px',
    fontWeight: 600,
    letterSpacing: '0.04em',
    color: 'var(--color-text-primary)',
  },
};
