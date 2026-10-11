import React from 'react';
import { Mic, TreePine } from 'lucide-react';
import { useGroundingSession } from '../hooks/useGroundingSession';

export const MobileSimulator: React.FC = () => {
  const {
    status,
    countdown,
    startGrounding: handlePhonePulsePress,
    handleDoubleTapToWake: handlePhoneDoubleTap,
  } = useGroundingSession({ recordingDurationSeconds: 5 });

  const screen = status === 'blackout' ? 'blackout' : 'home';
  const phoneState =
    status === 'recording'
      ? 'recording'
      : status === 'analyzing'
      ? 'processing'
      : status === 'speaking' || status === 'ready'
      ? 'ready'
      : 'idle';

  return (
    <div style={styles.simulatorWrapper}>
      {/* Phone Hardware Shell */}
      <div style={styles.phoneDevice}>
        {/* Top Notch / Camera Pill */}
        <div style={styles.dynamicIsland}>
          <div style={styles.cameraLens} />
          <div style={styles.sensorDot} />
        </div>

        {/* AMOLED Screen Content */}
        <div style={styles.screenInner}>
          {screen === 'home' ? (
            <div style={styles.homeLayout}>
              {/* Top Header */}
              <div style={styles.appHeader}>
                <div style={styles.appTitle}>AURAFLORA</div>
                <div style={styles.appSub}>PRESS · LISTEN · GO</div>
              </div>

              {/* Center Recording CTA */}
              <div style={styles.appCenter}>
                <div style={styles.phonePulseWrap}>
                  {phoneState === 'recording' && (
                    <div style={styles.phoneRingPulse} />
                  )}

                  <button
                    onClick={() => void handlePhonePulsePress()}
                    style={{
                      ...styles.phoneRecordBtn,
                      backgroundColor:
                        phoneState === 'recording'
                          ? '#2E5E35'
                          : phoneState === 'processing'
                          ? '#1F2E23'
                          : '#4E8752',
                    }}
                  >
                    <Mic
                      size={32}
                      color="#E8DFD8"
                      style={{
                        transform: phoneState === 'recording' ? 'scale(1.15)' : 'scale(1)',
                        transition: 'transform 0.2s',
                      }}
                    />
                  </button>
                </div>

                {/* State Label */}
                <div style={styles.phoneStatusLabel}>
                  {phoneState === 'idle' && 'Tap to Ground'}
                  {phoneState === 'recording' && `Listening... ${countdown}s`}
                  {phoneState === 'processing' && 'reading the air...'}
                  {phoneState === 'ready' && 'grounded.'}
                </div>
              </div>

              {/* Bottom Sensory Badge */}
              <div style={styles.badgeFooter}>
                {phoneState === 'ready' ? (
                  <div style={styles.sensoryBadge}>
                    <TreePine size={14} color="#81C784" />
                    <span>FOREST CANOPY</span>
                  </div>
                ) : (
                  <span style={styles.screenTimeNotice}>Target screen time: ≤ 15s</span>
                )}
              </div>
            </div>
          ) : (
            /* AMOLED Pure Blackout Screen */
            <div onClick={handlePhoneDoubleTap} style={styles.blackoutScreen}>
              <div style={styles.blackoutFaintHint}>
                <div style={styles.faintMain}>Screen locked. Look up.</div>
                <div style={styles.faintSub}>Double-tap to return</div>
              </div>
            </div>
          )}
        </div>

        {/* Home Indicator Bar */}
        <div style={styles.homeIndicator} />
      </div>

      <div style={styles.simCaption}>
        <strong>AMOLED Mobile Companion</strong>
        <p>Interactive simulation of the Flutter native companion. Screen goes pure #000000 upon grounding.</p>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  simulatorWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    width: '100%',
    maxWidth: '100%',
  },
  phoneDevice: {
    position: 'relative',
    width: 'min(290px, calc(100vw - 32px))',
    height: 'min(580px, calc(100dvh - 180px))',
    minHeight: 460,
    borderRadius: 44,
    backgroundColor: '#000000',
    border: '8px solid #232D26',
    boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 30px rgba(78, 135, 82, 0.15)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  dynamicIsland: {
    position: 'absolute',
    top: 10,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 90,
    height: 22,
    backgroundColor: '#000000',
    borderRadius: 14,
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 12,
    gap: 6,
  },
  cameraLens: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: '#0a0f0d',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  sensorDot: {
    width: 4,
    height: 4,
    borderRadius: '50%',
    backgroundColor: '#16281c',
  },
  screenInner: {
    flex: 1,
    backgroundColor: '#0A0F0D',
    display: 'flex',
    flexDirection: 'column',
  },
  homeLayout: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '40px 20px 24px',
    textAlign: 'center',
  },
  appHeader: {
    marginTop: 10,
  },
  appTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '1.05rem',
    letterSpacing: '0.22em',
    color: '#E8DFD8',
  },
  appSub: {
    fontSize: '0.62rem',
    color: '#9E9590',
    letterSpacing: '0.14em',
    marginTop: 4,
  },
  appCenter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
  phonePulseWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneRingPulse: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: '50%',
    border: '2px solid rgba(129, 199, 132, 0.4)',
    animation: 'rippleWave 2s infinite linear',
  },
  phoneRecordBtn: {
    width: 100,
    height: 100,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: '2px solid rgba(129, 199, 132, 0.4)',
    boxShadow: '0 0 25px rgba(78, 135, 82, 0.45)',
  },
  phoneStatusLabel: {
    fontSize: '0.75rem',
    letterSpacing: '0.08em',
    color: '#81C784',
    fontWeight: 600,
    minHeight: 20,
  },
  badgeFooter: {
    minHeight: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sensoryBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '5px 12px',
    borderRadius: 16,
    backgroundColor: '#1F2E23',
    border: '1px solid rgba(129, 199, 132, 0.3)',
    color: '#81C784',
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
  },
  screenTimeNotice: {
    fontSize: '0.68rem',
    color: '#5A5652',
    letterSpacing: '0.04em',
  },
  blackoutScreen: {
    flex: 1,
    backgroundColor: '#000000',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: 24,
  },
  blackoutFaintHint: {
    textAlign: 'center',
  },
  faintMain: {
    color: 'rgba(255, 255, 255, 0.12)',
    fontSize: '0.85rem',
    letterSpacing: '0.12em',
    marginBottom: 8,
  },
  faintSub: {
    color: 'rgba(255, 255, 255, 0.08)',
    fontSize: '0.7rem',
    letterSpacing: '0.08em',
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 8,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 100,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 2,
  },
  simCaption: {
    textAlign: 'center',
    fontSize: '0.8rem',
    color: '#9E9590',
    maxWidth: 270,
  },
};
