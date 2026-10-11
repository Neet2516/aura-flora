import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Menu, X, Download, Radio, Key } from 'lucide-react';

interface HeaderProps {
  onNavigate: (sectionId: string) => void;
  onOpenContact: () => void;
  onOpenLab: () => void;
  onTriggerInstall?: () => void;
  canInstall?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  onOpenContact,
  onOpenLab,
  onTriggerInstall,
  canInstall,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      const formatted = new Intl.DateTimeFormat('en-US', options).format(now);
      setTimeStr(`NYC ${formatted} EST`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMobileNav = (sectionId: string) => {
    setMobileMenuOpen(false);
    onNavigate(sectionId);
  };

  const handleMobileContact = () => {
    setMobileMenuOpen(false);
    onOpenContact();
  };

  const handleMobileLab = () => {
    setMobileMenuOpen(false);
    onOpenLab();
  };

  return (
    <>
      <header style={styles.header}>
        {/* Zone 1: Brand Identifier */}
        <div style={styles.brandZone} onClick={() => onNavigate('top')}>
          <span style={styles.brandText}>j.mr</span>
          <span className="status-dot" title="System Online & Active" />
          <span style={styles.brandSub}>ATELIER</span>
        </div>

        {/* Zone 2: Primary Navigation Items (Desktop) */}
        <nav className="desktop-only" style={styles.navZone}>
          <button
            style={styles.navItem}
            onClick={() => onNavigate('work')}
            className="editorial-link"
          >
            [ 01 · WORK ]
          </button>
          <button
            style={styles.navItem}
            onClick={() => onNavigate('about')}
            className="editorial-link"
          >
            [ 02 · ABOUT ]
          </button>
          <button
            style={{ ...styles.navItem, color: '#FFFFFF' }}
            onClick={onOpenLab}
            className="editorial-link"
          >
            [ 03 · LAB / DSP ]
          </button>
          <button
            style={styles.navItem}
            onClick={() => onNavigate('keys')}
            className="editorial-link"
          >
            [ 04 · API KEYS ]
          </button>
        </nav>

        {/* Zone 3: Live Status Indicator (Desktop) */}
        <div className="desktop-only" style={styles.statusZone}>
          <span style={styles.statusPulse} />
          <span style={styles.statusText}>{timeStr || 'NYC 14:32:00 EST'}</span>
        </div>

        {/* Zone 4: CTA Action Button + Install (Desktop) */}
        <div className="desktop-only" style={styles.actionZone}>
          {canInstall && onTriggerInstall && (
            <button
              style={styles.installHeaderBtn}
              onClick={onTriggerInstall}
              title="Install progressive web app"
            >
              <Download size={12} />
              <span>INSTALL</span>
            </button>
          )}

          <button
            style={styles.contactBtn}
            onClick={onOpenContact}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ECECE8';
              e.currentTarget.style.color = '#1A1A1A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#ECECE8';
            }}
          >
            <span>CONTACT</span>
            <ArrowUpRight size={13} />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="mobile-only" style={styles.mobileBurgerZone}>
          {canInstall && onTriggerInstall && (
            <button
              style={styles.mobileInstallIconBtn}
              onClick={onTriggerInstall}
              aria-label="Install app"
              title="Install app"
            >
              <Download size={15} color="#4ADE80" />
            </button>
          )}

          <button
            style={styles.burgerBtn}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div style={styles.mobileDrawer} onClick={() => setMobileMenuOpen(false)}>
          <div style={styles.drawerCard} onClick={(e) => e.stopPropagation()}>
            <div style={styles.drawerHeader}>
              <div style={styles.drawerBrand}>
                <span style={styles.brandText}>j.mr · ATELIER</span>
                <span style={styles.drawerTime}>{timeStr}</span>
              </div>
              <button
                style={styles.drawerCloseBtn}
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close Navigation"
              >
                <X size={18} />
              </button>
            </div>

            <nav style={styles.drawerNav}>
              <button
                style={styles.drawerItem}
                onClick={() => handleMobileNav('work')}
              >
                <span>[ 01 · WORK INDEX ]</span>
                <ArrowUpRight size={14} color="#8C8C8C" />
              </button>

              <button
                style={styles.drawerItem}
                onClick={() => handleMobileNav('about')}
              >
                <span>[ 02 · ABOUT ATELIER ]</span>
                <ArrowUpRight size={14} color="#8C8C8C" />
              </button>

              <button
                style={{ ...styles.drawerItem, color: '#4ADE80' }}
                onClick={handleMobileLab}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Radio size={14} color="#4ADE80" />
                  <span>[ 03 · AURAFLORA LAB ]</span>
                </div>
                <ArrowUpRight size={14} color="#4ADE80" />
              </button>

              <button
                style={styles.drawerItem}
                onClick={() => handleMobileNav('keys')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Key size={14} color="#8C8C8C" />
                  <span>[ 04 · API KEYS & ENGINE ]</span>
                </div>
                <ArrowUpRight size={14} color="#8C8C8C" />
              </button>

              <button
                style={{ ...styles.drawerItem, borderBottom: 'none' }}
                onClick={handleMobileContact}
              >
                <span>[ 05 · TRANSMIT INQUIRY ]</span>
                <ArrowUpRight size={14} color="#8C8C8C" />
              </button>
            </nav>

            {onTriggerInstall && (
              <div style={styles.drawerFooter}>
                <button
                  style={styles.drawerInstallBtn}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onTriggerInstall();
                  }}
                >
                  <Download size={14} />
                  <span>INSTALL PWA ON HOME SCREEN</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(26, 26, 26, 0.92)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderBottom: '1px solid var(--color-grid-line)',
    padding: '0 20px',
    height: '60px',
  },
  brandZone: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    paddingRight: '24px',
    height: '100%',
  },
  brandText: {
    fontFamily: 'var(--font-sans)',
    fontSize: '18px',
    fontWeight: 700,
    color: '#FFFFFF',
    letterSpacing: '-0.03em',
  },
  brandSub: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: 'var(--color-text-secondary)',
    letterSpacing: '0.12em',
  },
  navZone: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    paddingLeft: '24px',
    borderLeft: '1px solid var(--color-grid-line)',
    height: '100%',
  },
  navItem: {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    letterSpacing: '0.08em',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: '4px 0',
  },
  statusZone: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0 20px',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    letterSpacing: '0.06em',
    color: 'var(--color-text-secondary)',
    borderLeft: '1px solid var(--color-grid-line)',
    height: '100%',
  },
  statusPulse: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#4ADE80',
    boxShadow: '0 0 8px rgba(74, 222, 128, 0.6)',
  },
  statusText: {
    whiteSpace: 'nowrap',
  },
  actionZone: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderLeft: '1px solid var(--color-grid-line)',
    paddingLeft: '20px',
    height: '100%',
  },
  installHeaderBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '6px 10px',
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    letterSpacing: '0.06em',
    color: '#4ADE80',
    backgroundColor: 'rgba(74, 222, 128, 0.08)',
    border: '1px solid rgba(74, 222, 128, 0.3)',
    cursor: 'pointer',
  },
  contactBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    letterSpacing: '0.08em',
    color: 'var(--color-text-primary)',
    backgroundColor: 'transparent',
    border: '1px solid var(--color-grid-active)',
    borderRadius: '2px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  mobileBurgerZone: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  mobileInstallIconBtn: {
    width: '38px',
    height: '38px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    border: '1px solid rgba(74, 222, 128, 0.3)',
    cursor: 'pointer',
  },
  burgerBtn: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    border: '1px solid var(--color-grid-line)',
    color: '#ECECE8',
    cursor: 'pointer',
  },
  mobileDrawer: {
    position: 'fixed',
    inset: 0,
    zIndex: 999,
    backgroundColor: 'rgba(10, 10, 10, 0.85)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    display: 'flex',
    flexDirection: 'column',
    animation: 'fadeIn 0.2s ease-out',
  },
  drawerCard: {
    width: '100%',
    backgroundColor: 'var(--color-bg-primary)',
    borderBottom: '1px solid var(--color-grid-active)',
    padding: '24px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '16px',
    borderBottom: '1px solid var(--color-grid-line)',
  },
  drawerBrand: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  drawerTime: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--color-text-secondary)',
  },
  drawerCloseBtn: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    border: '1px solid var(--color-grid-line)',
    color: '#ECECE8',
    cursor: 'pointer',
  },
  drawerNav: {
    display: 'flex',
    flexDirection: 'column',
  },
  drawerItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 4px',
    borderBottom: '1px solid var(--color-grid-subtle)',
    fontFamily: 'var(--font-mono)',
    fontSize: '13px',
    letterSpacing: '0.06em',
    color: 'var(--color-text-primary)',
    backgroundColor: 'transparent',
    borderLeft: 'none',
    borderRight: 'none',
    borderTop: 'none',
    cursor: 'pointer',
    textAlign: 'left',
  },
  drawerFooter: {
    paddingTop: '8px',
  },
  drawerInstallBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px',
    backgroundColor: '#ECECE8',
    color: '#1A1A1A',
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.06em',
    border: 'none',
    cursor: 'pointer',
  },
};
