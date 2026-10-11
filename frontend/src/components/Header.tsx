import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  onNavigate: (sectionId: string) => void;
  onOpenContact: () => void;
  onOpenLab: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, onOpenContact, onOpenLab }) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format as NYC EST (UTC-4 / UTC-5)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      const formatted = new Intl.DateTimeFormat('en-US', options).format(now);
      setTimeStr(`NYC ${formatted} EST · AVAIL Q4/26`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header style={styles.header}>
      {/* Zone 1: Brand Identifier */}
      <div style={styles.brandZone} onClick={() => onNavigate('top')}>
        <span style={styles.brandText}>j.mr</span>
        <span className="status-dot" title="System Online & Active" />
        <span style={styles.brandSub}>ATELIER</span>
      </div>

      {/* Zone 2: Primary Navigation Items */}
      <nav style={styles.navZone}>
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

      {/* Zone 3: Live Status Indicator */}
      <div style={styles.statusZone}>
        <span style={styles.statusPulse} />
        <span style={styles.statusText}>{timeStr || 'NYC 14:32:00 EST · AVAIL Q4/26'}</span>
      </div>

      {/* Zone 4: CTA Action Button */}
      <div style={styles.actionZone}>
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
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto auto',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 26, 0.88)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderBottom: '1px solid var(--color-grid-line)',
    padding: '0 24px',
    height: '60px',
  },
  brandZone: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    paddingRight: '32px',
    borderRight: '1px solid var(--color-grid-line)',
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
    gap: '28px',
    paddingLeft: '32px',
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
    paddingRight: '24px',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    letterSpacing: '0.06em',
    color: 'var(--color-text-secondary)',
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
    borderLeft: '1px solid var(--color-grid-line)',
    paddingLeft: '24px',
    height: '100%',
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
};
