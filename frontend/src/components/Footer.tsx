import React from 'react';
import { Leaf } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.topRow}>
          <div style={styles.brandCol}>
            <div style={styles.logoRow}>
              <div style={styles.logoIcon}>
                <Leaf size={16} color="#81C784" />
              </div>
              <span style={styles.brandTitle}>AURAFLORA</span>
            </div>
            <p style={styles.tagline}>
              BioAcoustic Grounding Companion · Hacktoberfest 2026 "Touch Grass" Challenge
            </p>
          </div>

          <div style={styles.techPills}>
            <span className="badge-pill">Rust 1.75+</span>
            <span className="badge-pill">Axum + Tokio</span>
            <span className="badge-pill">rustfft DSP</span>
            <span className="badge-pill">Google Gemma 2B-IT</span>
            <span className="badge-pill">ElevenLabs TTS</span>
            <span className="badge-pill">React 19 + Vite</span>
          </div>
        </div>

        <div style={styles.bottomRow}>
          <div style={styles.copyText}>
            © 2026 AuraFlora. Released under the MIT Open Source License. Pure AMOLED & Zero Tracking.
          </div>
          <div style={styles.quickCommands}>
            <code>docker compose up --build</code>
          </div>
        </div>
      </div>
    </footer>
  );
};

const styles: Record<string, React.CSSProperties> = {
  footer: {
    backgroundColor: '#050806',
    borderTop: '1px solid rgba(129, 199, 132, 0.12)',
    padding: '48px 24px 36px',
  },
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 32,
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 24,
  },
  brandCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(78, 135, 82, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '0.95rem',
    letterSpacing: '0.15em',
    color: '#E8DFD8',
  },
  tagline: {
    fontSize: '0.8rem',
    color: '#9E9590',
    maxWidth: 380,
  },
  techPills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  bottomRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
    paddingTop: 24,
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  },
  copyText: {
    fontSize: '0.75rem',
    color: '#5A5652',
  },
  quickCommands: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    color: '#81C784',
    backgroundColor: '#0A0F0D',
    padding: '4px 10px',
    borderRadius: 6,
    border: '1px solid rgba(129, 199, 132, 0.15)',
  },
};
