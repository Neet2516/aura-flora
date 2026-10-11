import React from 'react';
import { ArrowUp, Terminal } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenLab: () => void;
  onOpenContact: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenLab, onOpenContact }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={styles.footerRoot}>
      {/* 4-Zone Footer Grid */}
      <div className="grid-container" style={styles.gridMatrix}>
        {/* Zone 1: Manifesto */}
        <div className="grid-cell" style={styles.cellManifesto}>
          <div style={styles.brandTitle}>j.mr · ATELIER</div>
          <p style={styles.manifestoText}>
            Architectural digital systems, real-time bioacoustic computation, and editorial typography
            crafted under 1-pixel geometric discipline.
          </p>
          <div style={styles.coordinates}>
            <span className="meta-label">COORDINATES</span>
            <span style={styles.monoText}>40.7128° N, 74.0060° W · NYC</span>
          </div>
        </div>

        {/* Zone 2: Navigation Shortcuts */}
        <div className="grid-cell" style={styles.cellSection}>
          <span className="meta-label">SITE INDEX & JUMPS</span>
          <ul style={styles.linkList}>
            <li>
              <button
                onClick={() => onNavigate('work')}
                className="editorial-link"
                style={styles.footerLink}
              >
                <span>[ 01 · WORK INDEX ]</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('about')}
                className="editorial-link"
                style={styles.footerLink}
              >
                <span>[ 02 · ATELIER ABOUT ]</span>
              </button>
            </li>
            <li>
              <button
                onClick={onOpenLab}
                className="editorial-link"
                style={{ ...styles.footerLink, color: '#4ADE80' }}
              >
                <span>[ 03 · AURAFLORA LAB ]</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('keys')}
                className="editorial-link"
                style={styles.footerLink}
              >
                <span>[ 04 · API KEYS & ENGINE ]</span>
              </button>
            </li>
            <li>
              <button
                onClick={onOpenContact}
                className="editorial-link"
                style={styles.footerLink}
              >
                <span>[ 05 · TRANSMIT INQUIRY ]</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Zone 3: Direct Inquiry */}
        <div className="grid-cell" style={styles.cellSection}>
          <span className="meta-label">DIRECT DISPATCH</span>
          <p style={styles.dispatchText}>
            Open for bespoke commissions, algorithmic sound engines, and design systems.
          </p>
          <button onClick={onOpenContact} style={styles.inquireBtn}>
            <span>INQUIRE / TRANSMIT</span>
            <Terminal size={12} />
          </button>
        </div>

        {/* Zone 4: Back to Top & Legal */}
        <div className="grid-cell" style={styles.cellAction}>
          <button onClick={scrollToTop} style={styles.backToTopBtn}>
            <span>BACK TO TOP</span>
            <ArrowUp size={14} />
          </button>

          <div style={styles.legalBlock}>
            <span style={styles.copyright}>© 2026 J.MR STUDIO. ALL RIGHTS RESERVED.</span>
            <span style={styles.buildTag}>REV 1.0.0 · BUILT WITH RUST & REACT 19</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const styles: Record<string, React.CSSProperties> = {
  footerRoot: {
    width: '100%',
    backgroundColor: 'var(--color-bg-primary)',
    borderTop: '1px solid var(--color-grid-line)',
  },
  gridMatrix: {
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  },
  cellManifesto: {
    padding: '36px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  brandTitle: {
    fontFamily: 'var(--font-sans)',
    fontSize: '18px',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    color: '#FFFFFF',
  },
  manifestoText: {
    fontSize: '13px',
    lineHeight: 1.6,
    color: 'var(--color-text-secondary)',
  },
  coordinates: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginTop: '8px',
  },
  monoText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--color-text-primary)',
  },
  cellSection: {
    padding: '36px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  linkList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  footerLink: {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    letterSpacing: '0.06em',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  },
  dispatchText: {
    fontSize: '13px',
    lineHeight: 1.5,
    color: 'var(--color-text-secondary)',
  },
  inquireBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-grid-active)',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    letterSpacing: '0.08em',
    cursor: 'pointer',
    alignSelf: 'flex-start',
    transition: 'all 0.3s',
  },
  cellAction: {
    padding: '36px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '24px',
  },
  backToTopBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 20px',
    border: '1px solid var(--color-grid-line)',
    backgroundColor: 'var(--color-bg-secondary)',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    letterSpacing: '0.08em',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  legalBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: 'var(--color-text-muted)',
  },
  copyright: {
    letterSpacing: '0.04em',
  },
  buildTag: {
    letterSpacing: '0.06em',
  },
};
