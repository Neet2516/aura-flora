import React, { useState } from 'react';
import { Download, Menu, X, Radio, Activity } from 'lucide-react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  onOpenLab: () => void;
  onTriggerInstall: () => void;
  canInstall: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  onOpenLab,
  onTriggerInstall,
  canInstall,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'hero', label: '01 · EXPERIENCE' },
    { id: 'signal', label: '02 · SIGNAL' },
    { id: 'protocol', label: '03 · PROTOCOL' },
    { id: 'lab', label: '04 · LAB' },
    { id: 'preview', label: '05 · PREVIEW' },
    { id: 'research', label: '06 · RESEARCH' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header style={styles.header}>
      <div style={styles.navInner}>
        {/* Left: Brand Identity */}
        <div style={styles.brandGroup} onClick={() => onNavigate('hero')} role="button" tabIndex={0}>
          <div style={styles.brandLogo}>
            <div className="status-dot-amber" />
            <span style={styles.brandTitle}>AURAFLORA</span>
          </div>
          <span style={styles.brandBadge}>FIELD EXP 001</span>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav style={styles.centerNav} className="desktop-only" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              style={styles.navBtn}
              className="font-mono"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right: Actions */}
        <div style={styles.rightGroup}>
          <button
            onClick={onOpenLab}
            style={styles.labTriggerBtn}
            className="desktop-only"
            title="Launch Real-Time DSP Audio Lab"
          >
            <Activity size={13} color="#F2C46A" />
            <span>LIVE LAB</span>
          </button>

          {canInstall && (
            <button
              onClick={onTriggerInstall}
              style={styles.installBtn}
              title="Install AuraFlora PWA to Home Screen"
            >
              <Download size={13} />
              <span className="desktop-only">INSTALL APP</span>
            </button>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            style={styles.mobileToggle}
            className="mobile-only"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} color="#F1F2EC" /> : <Menu size={20} color="#F1F2EC" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={styles.mobileDrawer} className="mobile-only">
          <div style={styles.mobileDrawerLinks}>
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                style={styles.mobileNavBtn}
                className="font-mono"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => {
                onOpenLab();
                setMobileMenuOpen(false);
              }}
              style={styles.mobileLabBtn}
              className="font-mono"
            >
              <Radio size={14} color="var(--color-golden-amber)" />
              <span>LAUNCH LIVE DSP LAB</span>
            </button>
            {canInstall && (
              <button
                onClick={() => {
                  onTriggerInstall();
                  setMobileMenuOpen(false);
                }}
                style={styles.mobileInstallBtn}
                className="font-mono"
              >
                <Download size={14} />
                <span>INSTALL AURAFLORA APP</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 900,
    width: '100%',
    backgroundColor: 'rgba(23, 22, 20, 0.92)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderBottom: '1px solid var(--color-border-subtle)',
    transition: 'all 0.3s ease',
  },
  navInner: {
    maxWidth: 'var(--container-max)',
    margin: '0 auto',
    padding: '0 24px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    userSelect: 'none',
  },
  brandLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  brandTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '15px',
    letterSpacing: '-0.025em',
    color: 'var(--color-text-primary)',
  },
  brandBadge: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    fontWeight: 500,
    letterSpacing: '0.1em',
    color: 'var(--color-muted-olive)',
    backgroundColor: 'rgba(174, 172, 120, 0.12)',
    border: '1px solid rgba(174, 172, 120, 0.28)',
    padding: '2px 8px',
  },
  centerNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  navBtn: {
    background: 'none',
    border: 'none',
    padding: '8px 12px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-text-secondary)',
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.06em',
    cursor: 'pointer',
    transition: 'color var(--duration-micro) ease',
  },
  rightGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  labTriggerBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: 'rgba(38, 36, 32, 0.8)',
    border: '1px solid rgba(174, 172, 120, 0.3)',
    color: 'var(--color-muted-olive)',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.08em',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  installBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: 'var(--color-golden-amber)',
    border: '1px solid var(--color-golden-amber)',
    color: 'var(--color-dark-canvas)',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.06em',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  mobileToggle: {
    background: 'transparent',
    border: '1px solid var(--color-border-subtle)',
    color: 'var(--color-text-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    cursor: 'pointer',
  },
  mobileDrawer: {
    backgroundColor: '#171614',
    borderBottom: '1px solid var(--color-border-subtle)',
    padding: '20px 24px 28px',
  },
  mobileDrawerLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  mobileNavBtn: {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid var(--color-grid-line)',
    color: 'var(--color-text-primary)',
    padding: '12px 0',
    textAlign: 'left',
    fontSize: '13px',
    letterSpacing: '0.06em',
    cursor: 'pointer',
  },
  mobileLabBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '12px',
    padding: '12px 16px',
    backgroundColor: 'rgba(38, 36, 32, 0.9)',
    border: '1px solid rgba(174, 172, 120, 0.35)',
    color: 'var(--color-muted-olive)',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  mobileInstallBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    backgroundColor: 'var(--color-golden-amber)',
    border: 'none',
    color: 'var(--color-dark-canvas)',
    fontSize: '12px',
    fontWeight: 700,
    cursor: 'pointer',
  },
};
