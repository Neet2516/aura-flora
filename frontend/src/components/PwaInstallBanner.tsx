import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PwaInstallBannerProps {
  onInstallStateChange?: (canInstall: boolean) => void;
}

export const PwaInstallBanner: React.FC<PwaInstallBannerProps> = ({ onInstallStateChange }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('aura_flora_pwa_dismissed') === 'true';
    } catch {
      return false;
    }
  });
  const [isIOS] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
  });
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in window.navigator &&
        (window.navigator as unknown as { standalone: boolean }).standalone === true)
    );
  });

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      if (onInstallStateChange) onInstallStateChange(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
      if (onInstallStateChange) onInstallStateChange(false);
      console.info('[PWA] Application successfully installed.');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [onInstallStateChange]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem('aura_flora_pwa_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  // If already running inside installed standalone PWA, hide banner
  if (isStandalone) return null;

  // If dismissed or cannot install on current device, don't show floating bar
  if (isDismissed || (!deferredPrompt && !isIOS)) return null;

  return (
    <>
      <aside style={styles.banner} aria-label="Install AuraFlora App">
        <div style={styles.content}>
          <div style={styles.iconBox}>
            <Smartphone size={14} color="#ECECE8" />
          </div>
          <div style={styles.textBox}>
            <span style={styles.title}>INSTALL AURAFLORA PWA</span>
            <span style={styles.desc}>
              Fast offline access, native launch, and zero-latency audio synthesizer
            </span>
          </div>
        </div>

        <div style={styles.actions}>
          <button style={styles.installBtn} onClick={handleInstallClick}>
            <Download size={13} />
            <span>INSTALL APP</span>
          </button>
          <button style={styles.dismissBtn} onClick={handleDismiss} title="Dismiss prompt">
            <X size={14} />
          </button>
        </div>
      </aside>

      {/* iOS Manual Installation Guide Modal */}
      {showIOSGuide && (
        <div style={styles.modalOverlay} onClick={() => setShowIOSGuide(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <span className="meta-label">INSTALL ON IOS / SAFARI</span>
              <button style={styles.dismissBtn} onClick={() => setShowIOSGuide(false)}>
                <X size={15} />
              </button>
            </div>
            <div style={styles.modalBody}>
              <p style={styles.modalText}>
                Apple iOS does not support one-click web prompts. Follow these quick steps to install AuraFlora on your home screen:
              </p>
              <div style={styles.stepRow}>
                <div style={styles.stepNum}>1</div>
                <div style={styles.stepText}>
                  Tap the <Share size={14} style={{ display: 'inline', verticalAlign: 'middle', margin: '0 4px' }} /> <strong>Share</strong> button at the bottom of Safari.
                </div>
              </div>
              <div style={styles.stepRow}>
                <div style={styles.stepNum}>2</div>
                <div style={styles.stepText}>
                  Scroll down and select <strong>&quot;Add to Home Screen&quot; [+]</strong>.
                </div>
              </div>
              <div style={styles.stepRow}>
                <div style={styles.stepNum}>3</div>
                <div style={styles.stepText}>
                  Tap <strong>Add</strong> in the top right corner. The app will launch standalone with offline caching.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const styles: Record<string, React.CSSProperties> = {
  banner: {
    position: 'fixed',
    top: '64px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 9980,
    width: 'calc(100% - 32px)',
    maxWidth: '720px',
    backgroundColor: 'rgba(26, 26, 26, 0.96)',
    border: '1px solid var(--color-grid-active)',
    padding: '12px 18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    boxShadow: '0 12px 36px rgba(0, 0, 0, 0.7)',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  iconBox: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--color-grid-line)',
    backgroundColor: 'var(--color-bg-secondary)',
  },
  textBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  title: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    letterSpacing: '0.08em',
    color: '#ECECE8',
    fontWeight: 600,
  },
  desc: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.3,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  installBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    backgroundColor: '#ECECE8',
    color: '#1A1A1A',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.06em',
    cursor: 'pointer',
    border: 'none',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
  },
  dismissBtn: {
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    color: 'var(--color-text-secondary)',
    border: '1px solid var(--color-grid-line)',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 10000,
    backgroundColor: 'rgba(10, 10, 10, 0.85)',
    backdropFilter: 'blur(12px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  modalContent: {
    width: '100%',
    maxWidth: '480px',
    backgroundColor: 'var(--color-bg-primary)',
    border: '1px solid var(--color-grid-active)',
    padding: '24px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '14px',
    borderBottom: '1px solid var(--color-grid-line)',
  },
  modalBody: {
    paddingTop: '18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  modalText: {
    fontSize: '13px',
    lineHeight: 1.5,
    color: 'var(--color-text-secondary)',
  },
  stepRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '10px 14px',
    backgroundColor: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-grid-line)',
  },
  stepNum: {
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECECE8',
    color: '#1A1A1A',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    fontWeight: 700,
    flexShrink: 0,
  },
  stepText: {
    fontSize: '12px',
    color: 'var(--color-text-primary)',
    lineHeight: 1.4,
  },
};
