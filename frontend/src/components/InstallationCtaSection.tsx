import React, { useState } from 'react';
import { Download, Smartphone, Compass, CheckCircle2, Share } from 'lucide-react';

interface InstallationCtaSectionProps {
  onTriggerInstall: () => void;
  canInstall: boolean;
}

export const InstallationCtaSection: React.FC<InstallationCtaSectionProps> = ({
  onTriggerInstall,
  canInstall,
}) => {
  const [showIosGuide, setShowIosGuide] = useState(false);

  return (
    <section id="install" style={styles.section}>
      <div className="section-container" style={styles.container}>
        <div className="crosshair-corner crosshair-tl" />
        <div className="crosshair-corner crosshair-tr" />
        <div className="crosshair-corner crosshair-bl" />
        <div className="crosshair-corner crosshair-br" />

        <div style={styles.innerContent}>
          {/* Eyebrow */}
          <div className="tech-eyebrow">
            <Compass size={12} />
            <span>PROGRESSIVE WEB APP / 008</span>
          </div>

          {/* Editorial Headline */}
          <h2 style={styles.headline}>
            "Go outside.
            <br />
            The world is already playing."
          </h2>

          <p style={styles.subtitle}>
            Listen for a moment. Carry the experience with you, not your attention. Install AuraFlora directly to your mobile home screen for instantaneous, offline-capable grounding.
          </p>

          {/* Action Row */}
          <div style={styles.actionRow}>
            {canInstall ? (
              <button
                onClick={onTriggerInstall}
                className="btn-botanical-primary"
                style={{ fontSize: '13px', padding: '14px 28px' }}
                title="Install AuraFlora PWA to device"
              >
                <Download size={16} />
                <span>INSTALL AURAFLORA APP</span>
              </button>
            ) : (
              <button
                onClick={() => setShowIosGuide(!showIosGuide)}
                className="btn-botanical-secondary"
                style={{ fontSize: '13px', padding: '14px 28px' }}
                title="View mobile installation guide"
              >
                <Smartphone size={16} />
                <span>HOW TO INSTALL ON MOBILE</span>
              </button>
            )}

            <a
              href="#protocol"
              className="btn-botanical-secondary"
              style={{ fontSize: '13px', padding: '14px 24px', textDecoration: 'none' }}
            >
              <span>REVIEW PROTOCOL</span>
            </a>
          </div>

          {/* iOS / Mobile Step Guide */}
          {showIosGuide && (
            <div style={styles.guideBox}>
              <div style={styles.guideHeader}>
                <span className="font-mono" style={{ fontSize: '12px', color: 'var(--color-botanical)' }}>
                  INSTALLATION ON IOS & ANDROID
                </span>
                <button
                  onClick={() => setShowIosGuide(false)}
                  style={styles.closeGuideBtn}
                  className="font-mono"
                >
                  [DISMISS]
                </button>
              </div>

              <div style={styles.guideSteps}>
                <div style={styles.stepItem}>
                  <Share size={16} color="#B5E48C" />
                  <span>
                    <strong>iOS Safari:</strong> Tap the <em>Share</em> button at the bottom of Safari, scroll down, and select <em>Add to Home Screen</em>.
                  </span>
                </div>
                <div style={styles.stepItem}>
                  <CheckCircle2 size={16} color="#B5E48C" />
                  <span>
                    <strong>Android Chrome:</strong> Tap the three-dot menu and select <em>Install App</em> or tap the prompt banner.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Features Pill Row */}
          <div style={styles.pillRow}>
            <span className="meta-label">✓ OFFLINE DSP ENGINE</span>
            <span className="meta-label">✓ ZERO BACKLIGHT BLACKOUT</span>
            <span className="meta-label">✓ NO APP STORE DOWNLOAD</span>
            <span className="meta-label">✓ TOTAL SCREEN BUDGET ≤ 15S</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  section: {
    padding: '110px 0',
    backgroundColor: '#080A09',
    position: 'relative',
  },
  container: {
    maxWidth: '960px',
    backgroundColor: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border-subtle)',
    padding: '56px 40px',
    position: 'relative',
    textAlign: 'center',
  },
  innerContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
  },
  headline: {
    fontSize: 'clamp(2.4rem, 4.8vw, 4.4rem)',
    letterSpacing: '-0.035em',
    lineHeight: 1.08,
    color: '#F1F2EC',
    fontWeight: 700,
  },
  subtitle: {
    maxWidth: '680px',
    fontSize: '1.15rem',
    lineHeight: 1.6,
    color: 'var(--color-text-secondary)',
  },
  actionRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    marginTop: '8px',
  },
  guideBox: {
    width: '100%',
    maxWidth: '640px',
    backgroundColor: '#080A09',
    border: '1px solid var(--color-border-subtle)',
    padding: '20px',
    marginTop: '16px',
    textAlign: 'left',
  },
  guideHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    borderBottom: '1px solid var(--color-grid-line)',
    paddingBottom: '8px',
  },
  closeGuideBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-text-muted)',
    fontSize: '11px',
    cursor: 'pointer',
  },
  guideSteps: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
  },
  stepItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
  },
  pillRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '20px',
    paddingTop: '24px',
    borderTop: '1px solid var(--color-grid-line)',
    width: '100%',
  },
};
