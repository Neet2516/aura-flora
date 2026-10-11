import React, { useState, useEffect } from 'react';
import { OfflineSyncService } from '../services/offlineSync';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

export const OfflineStatusIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(() => OfflineSyncService.isOnline());
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      OfflineSyncService.notify(true);
      const syncedCount = await OfflineSyncService.syncQueuedInquiries();
      if (syncedCount > 0) {
        setSyncMessage(`Reconnected: ${syncedCount} queued inquiry dispatched`);
        setTimeout(() => setSyncMessage(null), 4000);
      } else {
        setSyncMessage('Network restored: Online pipelines ready');
        setTimeout(() => setSyncMessage(null), 3000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      OfflineSyncService.notify(false);
      setSyncMessage('Offline: Local bioacoustic DSP & cached storage active');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !syncMessage) {
    return null;
  }

  return (
    <div
      style={{
        ...styles.container,
        backgroundColor: isOnline ? 'rgba(20, 35, 25, 0.95)' : 'rgba(35, 20, 20, 0.95)',
        borderColor: isOnline ? 'rgba(74, 222, 128, 0.4)' : 'rgba(239, 68, 68, 0.4)',
      }}
      role="status"
      aria-live="polite"
    >
      <div style={styles.badgeContent}>
        {isOnline ? (
          <Wifi size={13} color="#4ADE80" />
        ) : (
          <WifiOff size={13} color="#F87171" />
        )}
        <span style={styles.badgeText}>
          {syncMessage || (isOnline ? 'ONLINE' : 'OFFLINE MODE — LOCAL DSP ENGINE ACTIVE')}
        </span>
      </div>

      {!isOnline && (
        <span style={styles.subNote}>
          <RefreshCw size={11} className="spin-slow" />
          <span>APP SHELL & DSP CACHED</span>
        </span>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 9990,
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '8px 16px',
    border: '1px solid',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  badgeContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  badgeText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    letterSpacing: '0.06em',
    color: '#ECECE8',
    fontWeight: 500,
  },
  subNote: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'var(--font-mono)',
    fontSize: '9px',
    color: 'var(--color-text-secondary)',
    letterSpacing: '0.08em',
    borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
    paddingLeft: '10px',
  },
};
