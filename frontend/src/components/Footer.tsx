import React from 'react';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenLab: () => void;
  onOpenContact?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenLab }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={styles.footer}>
      <div className="section-container" style={styles.container}>
        {/* Top Footer Row */}
        <div style={styles.topRow}>
          <div style={styles.brandBlock}>
            <div style={styles.brandHead}>
              <div className="status-dot-amber" />
              <span style={styles.brandTitle}>AURAFLORA</span>
            </div>
            <p style={styles.brandTagline}>
              Experimental BioAcoustic Lab & Anti-Screen Grounding Companion.
              <br />
              Created for Hacktoberfest 2026's "Touch Grass" Challenge.
            </p>
          </div>

          <div style={styles.linksGrid}>
            <div style={styles.linkCol}>
              <span className="meta-label">SECTIONS</span>
              <button onClick={() => onNavigate('hero')} style={styles.footerLink} className="font-mono">
                01 · EXPERIENCE
              </button>
              <button onClick={() => onNavigate('signal')} style={styles.footerLink} className="font-mono">
                02 · SIGNAL
              </button>
              <button onClick={() => onNavigate('protocol')} style={styles.footerLink} className="font-mono">
                03 · PROTOCOL
              </button>
            </div>

            <div style={styles.linkCol}>
              <span className="meta-label">RESEARCH</span>
              <button onClick={() => onNavigate('lab')} style={styles.footerLink} className="font-mono">
                04 · BIOACOUSTIC LAB
              </button>
              <button onClick={() => onNavigate('preview')} style={styles.footerLink} className="font-mono">
                05 · PHONE PREVIEW
              </button>
              <button onClick={() => onNavigate('research')} style={styles.footerLink} className="font-mono">
                06 · ARCHITECTURE
              </button>
            </div>

            <div style={styles.linkCol}>
              <span className="meta-label">OPEN SOURCE</span>
              <a
                href="https://github.com/Neet2516/aura-flora"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.footerLink}
                className="font-mono"
              >
                GITHUB REPOSITORY
              </a>
              <button onClick={onOpenLab} style={styles.footerLink} className="font-mono">
                LIVE DSP LAB
              </button>
              <span style={{ ...styles.footerLink, color: 'var(--color-golden-amber)' }} className="font-mono">
                MIT LICENSE · 2026
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Footer Bar */}
        <div style={styles.bottomBar}>
          <div style={styles.bottomLeft}>
            <span className="meta-label">© 2026 AURAFLORA ECOSYSTEM</span>
            <span className="meta-label desktop-only">·</span>
            <span className="meta-label desktop-only">ZERO DATA RETENTION</span>
            <span className="meta-label desktop-only">·</span>
            <span className="meta-label desktop-only">PURE AMOLED BLACKOUT</span>
          </div>

          <button onClick={scrollToTop} style={styles.backToTopBtn} className="font-mono" title="Scroll to top of page">
            <span>BACK TO TOP</span>
            <ArrowUp size={12} />
          </button>
        </div>
      </div>
    </footer>
  );
};

const styles: Record<string, React.CSSProperties> = {
  footer: {
    backgroundColor: '#12110F',
    borderTop: '1px solid var(--color-border-subtle)',
    padding: '60px 0 36px',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '40px',
  },
  brandBlock: {
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  brandHead: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  brandTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '16px',
    letterSpacing: '-0.025em',
    color: 'var(--color-soft-offwhite)',
  },
  brandTagline: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.875rem',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.65,
    letterSpacing: 'var(--tracking-body)',
  },
  linksGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '48px',
  },
  linkCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  footerLink: {
    background: 'none',
    border: 'none',
    padding: '2px 0',
    color: 'var(--color-text-secondary)',
    fontSize: '11px',
    letterSpacing: '0.05em',
    textAlign: 'left',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  },
  bottomBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px',
    paddingTop: '24px',
    borderTop: '1px solid var(--color-grid-line)',
  },
  bottomLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  backToTopBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'none',
    border: '1px solid var(--color-grid-line)',
    color: 'var(--color-text-secondary)',
    padding: '6px 12px',
    fontSize: '10px',
    cursor: 'pointer',
  },
};
