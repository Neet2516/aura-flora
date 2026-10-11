import React, { useEffect, useState } from 'react';
import { ApiService } from '../services/api';
import { Leaf, Sparkles, Smartphone } from 'lucide-react';

interface NavbarProps {
  onStartGrounding: () => void;
  onToggleSimulator: () => void;
  showSimulator: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onStartGrounding,
  onToggleSimulator,
  showSimulator,
}) => {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const check = async () => {
      const res = await ApiService.checkHealth();
      setBackendStatus(res.isOnline ? 'online' : 'offline');
    };
    check();
    const interval = setInterval(check, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        {/* Brand */}
        <a href="#hero" style={styles.brand}>
          <div style={styles.logoIconWrapper}>
            <Leaf size={18} color="#81C784" />
            <span style={styles.logoPulseDot} />
          </div>
          <div>
            <div style={styles.brandTitle}>AURAFLORA</div>
            <div style={styles.brandSubtitle}>BIOACOUSTIC COMPANION</div>
          </div>
        </a>

        {/* Center Nav Links */}
        <nav style={styles.navLinks}>
          <a href="#grounding-lab" style={styles.navLink}>Live Lab</a>
          <a href="#dsp-science" style={styles.navLink}>BioAcoustic DSP</a>
          <a href="#pipeline" style={styles.navLink}>AI Pipeline</a>
          <a href="#field-notes" style={styles.navLink}>Field Notes</a>
          <a href="#manifesto" style={styles.navLink}>Manifesto</a>
        </nav>

        {/* Actions & Status */}
        <div style={styles.actions}>
          {/* Backend Status Pill */}
          <div
            className={`badge-pill ${backendStatus === 'online' ? 'status-online' : 'status-offline'}`}
            title={backendStatus === 'online' ? 'Axum DSP server responding on port 8080' : 'Local standalone browser DSP simulator active'}
            style={styles.statusPill}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: backendStatus === 'online' ? '#4ADE80' : '#FBBF24',
                boxShadow: backendStatus === 'online' ? '0 0 8px #4ADE80' : '0 0 8px #FBBF24',
              }}
            />
            {backendStatus === 'checking' && 'Pinging...'}
            {backendStatus === 'online' && 'Rust Engine Online'}
            {backendStatus === 'offline' && 'DSP Simulator'}
          </div>

          {/* Toggle Simulator */}
          <button
            onClick={onToggleSimulator}
            style={{
              ...styles.simButton,
              backgroundColor: showSimulator ? 'rgba(129, 199, 132, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              borderColor: showSimulator ? '#81C784' : 'rgba(129, 199, 132, 0.2)',
            }}
            title="Preview AuraFlora AMOLED Mobile Device UI"
          >
            <Smartphone size={15} color={showSimulator ? '#81C784' : '#E8DFD8'} />
            <span style={styles.simButtonText}>{showSimulator ? 'Close Phone' : 'Phone Mode'}</span>
          </button>

          {/* Direct Ground Button */}
          <button onClick={onStartGrounding} style={styles.ctaButton}>
            <Sparkles size={14} />
            <span>Ground Now</span>
          </button>
        </div>
      </div>
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backgroundColor: 'rgba(10, 15, 13, 0.85)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(129, 199, 132, 0.12)',
    padding: '12px 24px',
  },
  container: {
    maxWidth: 1240,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  logoIconWrapper: {
    position: 'relative',
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(78, 135, 82, 0.2)',
    border: '1px solid rgba(129, 199, 132, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPulseDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: '#81C784',
    boxShadow: '0 0 10px #81C784',
  },
  brandTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '1rem',
    letterSpacing: '0.18em',
    color: '#E8DFD8',
    lineHeight: 1.1,
  },
  brandSubtitle: {
    fontSize: '0.62rem',
    letterSpacing: '0.12em',
    color: '#81C784',
    fontWeight: 600,
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: 24,
  },
  navLink: {
    fontSize: '0.85rem',
    fontWeight: 500,
    color: '#9E9590',
    transition: 'color 0.2s ease',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  statusPill: {
    cursor: 'default',
  },
  simButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '7px 12px',
    borderRadius: 8,
    border: '1px solid',
    color: '#E8DFD8',
    fontSize: '0.8rem',
    fontWeight: 500,
    transition: 'all 0.2s',
  },
  simButtonText: {
    display: 'inline',
  },
  ctaButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 16px',
    borderRadius: 8,
    backgroundColor: '#4E8752',
    color: '#E8DFD8',
    fontSize: '0.85rem',
    fontWeight: 600,
    letterSpacing: '0.02em',
    boxShadow: '0 0 20px rgba(78, 135, 82, 0.4)',
    transition: 'all 0.2s',
  },
};
