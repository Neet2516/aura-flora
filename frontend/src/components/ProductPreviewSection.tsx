import React, { useState, useRef } from 'react';
import { Mic, ShieldCheck, RotateCcw } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import { ScrollRevealText } from './motion/ScrollRevealText';
import { FadeInWhenVisible } from './motion/FadeInWhenVisible';

export const ProductPreviewSection: React.FC = () => {
  const [screen, setScreen] = useState<'home' | 'recording' | 'analyzing' | 'prompt' | 'blackout'>('home');
  const [countdown, setCountdown] = useState<number>(5);
  const [lastTap, setLastTap] = useState<number>(0);
  const [currentPrompt, setCurrentPrompt] = useState<string>(
    'Step outside. Notice the nearest sound without naming it. Feel the ground beneath your feet.'
  );

  const samplePrompts = [
    'Step outside. Notice the nearest sound without naming it. Feel the ground beneath your feet.',
    'Walk toward the rustling foliage. Touch the bark of the nearest oak and inhale the damp morning air.',
    'Locate the high-frequency chirp above you. Look up into the branches for ten steady heartbeats.',
    'Close your eyes. Identify which ear hears the wind first. Let your shoulders drop away from your ears.',
  ];

  const timerRef = useRef<any>(null);

  const handleStartCapture = () => {
    soundEngine.playHaptic();
    soundEngine.playAmbient('forest');
    setScreen('recording');
    setCountdown(5);

    let sec = 5;
    timerRef.current = setInterval(() => {
      sec -= 1;
      setCountdown(sec);
      if (sec <= 0) {
        clearInterval(timerRef.current);
        setScreen('analyzing');

        // Transition to prompt and then blackout
        setTimeout(() => {
          const randomPrompt = samplePrompts[Math.floor(Math.random() * samplePrompts.length)];
          setCurrentPrompt(randomPrompt);
          setScreen('prompt');

          setTimeout(() => {
            setScreen('blackout');
            soundEngine.stopAmbient();
            soundEngine.speakPrompt(randomPrompt);
          }, 3200);
        }, 1600);
      }
    }, 1000);
  };

  const handleDoubleTapToWake = () => {
    const now = Date.now();
    soundEngine.playHaptic();
    if (now - lastTap < 450) {
      soundEngine.stopSpeaking();
      soundEngine.stopAmbient();
      setScreen('home');
    } else {
      setLastTap(now);
    }
  };

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    soundEngine.stopSpeaking();
    soundEngine.stopAmbient();
    setScreen('home');
  };

  return (
    <section id="preview" style={styles.section}>
      <div className="section-container" style={styles.container}>
        {/* Section Header */}
        <div style={styles.header}>
          <div>
            <div className="tech-eyebrow">
              <ShieldCheck size={12} />
              <span>EXPERIENCE SIMULATION / 005</span>
            </div>
            <ScrollRevealText
              text="The Grounding Experience"
              tag="h2"
              style={styles.title}
              delay={0.1}
            />
          </div>
          <FadeInWhenVisible delay={0.2}>
            <p style={styles.subtitle}>
              A tactile simulation of the mobile application. Press the central pulse button to experience the 15-second acoustic sequence culminating in zero backlight emission.
            </p>
          </FadeInWhenVisible>
        </div>

        {/* Simulator Device Grid */}
        <div style={styles.simulationGrid}>
          {/* Left Column: Flow Explanations */}
          <FadeInWhenVisible delay={0.25} yOffset={24} style={styles.flowExplainer}>
            <div style={styles.flowStep}>
              <span className="font-mono" style={styles.flowNum}>STAGE 01</span>
              <h3 style={styles.flowTitle}>Single Press Audio Sampling</h3>
              <p style={styles.flowDesc}>
                A single tap initiates 5 seconds of ambient bioacoustic listening. Zero menus or notifications.
              </p>
            </div>

            <div style={styles.flowStep}>
              <span className="font-mono" style={styles.flowNum}>STAGE 02</span>
              <h3 style={styles.flowTitle}>Neural Instruction Synthesis</h3>
              <p style={styles.flowDesc}>
                Gemma AI analyzes the frequency distribution and returns a single grounding outdoor sensory prompt.
              </p>
            </div>

            <div style={styles.flowStep}>
              <span className="font-mono" style={styles.flowNum}>STAGE 03</span>
              <h3 style={styles.flowTitle}>AMOLED Blackout Lock</h3>
              <p style={styles.flowDesc}>
                The display turns completely black (#000000). Spoken guidance plays while all screen pixels turn off.
              </p>
            </div>

            <div style={styles.interactionTip} className="font-mono">
              <span>TIP: IN BLACKOUT MODE, DOUBLE TAP THE PHONE SCREEN TO WAKE UP.</span>
            </div>
          </FadeInWhenVisible>

          {/* Right Column: Physical Phone Hardware Mockup */}
          <FadeInWhenVisible delay={0.4} yOffset={32} style={styles.phoneStage}>
            <div style={styles.phoneChassis} onClick={screen === 'blackout' ? handleDoubleTapToWake : undefined}>
              {/* Dynamic Island / Hardware Sensors */}
              <div style={styles.dynamicIsland}>
                <div style={styles.lensDot} />
                <div style={styles.speakerPill} />
              </div>

              {/* Screen Content Viewport */}
              <div style={styles.screenViewport}>
                {screen === 'home' && (
                  <div style={styles.screenHome}>
                    <div style={styles.screenTopBar}>
                      <span className="font-mono" style={{ fontSize: '10px', color: '#B5E48C' }}>
                        AURAFLORA
                      </span>
                      <span className="font-mono" style={{ fontSize: '10px', color: '#707A70' }}>
                        16 kHz READY
                      </span>
                    </div>

                    <div style={styles.pulseArea}>
                      <button
                        onClick={handleStartCapture}
                        style={styles.pulseTriggerButton}
                        title="Start Bioacoustic Grounding"
                      >
                        <Mic size={32} color="#080A09" />
                      </button>
                      <span className="font-mono" style={styles.pulseLabel}>
                        PRESS TO LISTEN
                      </span>
                      <span style={styles.pulseSub}>5-Second Ambient Capture</span>
                    </div>

                    <div style={styles.screenBottomBar}>
                      <span className="font-mono" style={{ fontSize: '10px', color: '#707A70' }}>
                        ≤ 15S INTERACTION
                      </span>
                    </div>
                  </div>
                )}

                {screen === 'recording' && (
                  <div style={styles.screenActive}>
                    <span className="tech-eyebrow">CAPTURING AMBIENT AIR</span>
                    <div style={styles.countdownNumber} className="font-mono">
                      {countdown}s
                    </div>
                    <div style={styles.waveformWave}>
                      {[40, 75, 50, 90, 60, 30, 80, 45, 95, 65, 35].map((h, i) => (
                        <div
                          key={i}
                          style={{
                            ...styles.waveBar,
                            height: `${h}%`,
                            animation: `pulseBotanical 0.8s infinite ${i * 0.08}s ease-in-out`,
                          }}
                        />
                      ))}
                    </div>
                    <span className="meta-label">LISTENING FOR BIOPHONY FREQUENCIES...</span>
                  </div>
                )}

                {screen === 'analyzing' && (
                  <div style={styles.screenActive}>
                    <div className="status-dot-active" />
                    <span className="tech-eyebrow">EVALUATING SOUNDSCAPE</span>
                    <p style={styles.analyzingText} className="font-mono">
                      EXTRACTING SPECTRAL CENTROID...
                      <br />
                      GEMMA SYNTHESIZING SOMATIC ACTION...
                    </p>
                  </div>
                )}

                {screen === 'prompt' && (
                  <div style={styles.screenActive}>
                    <span className="tech-eyebrow">OUTDOOR GROUNDING INSTRUCTION</span>
                    <p style={styles.promptDisplay}>"{currentPrompt}"</p>
                    <span className="meta-label">TRANSITIONING TO BLACKOUT...</span>
                  </div>
                )}

                {screen === 'blackout' && (
                  <div style={styles.screenBlackout}>
                    <div style={styles.blackoutInstruction}>
                      <span className="font-mono" style={styles.blackoutNotice}>
                        AMOLED BLACKOUT ACTIVE
                      </span>
                      <p style={styles.blackoutText}>
                        Zero backlight emission.
                        <br />
                        Put down your device.
                      </p>
                      <span className="font-mono" style={styles.doubleTapNotice}>
                        [DOUBLE-TAP SCREEN TO WAKE]
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reset Button Below Device */}
            {screen !== 'home' && (
              <button onClick={handleReset} style={styles.resetBtn} className="font-mono">
                <RotateCcw size={12} />
                <span>RESET SIMULATOR</span>
              </button>
            )}
          </FadeInWhenVisible>
        </div>
      </div>
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  section: {
    padding: '90px 0',
    backgroundColor: '#080A09',
    position: 'relative',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxWidth: '800px',
  },
  title: {
    fontSize: 'clamp(2.2rem, 4vw, 3.8rem)',
    letterSpacing: '-0.03em',
    color: '#F1F2EC',
    lineHeight: 1.1,
    marginTop: '8px',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.6,
  },
  simulationGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '40px',
    alignItems: 'center',
  },
  flowExplainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  flowStep: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '20px',
    backgroundColor: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border-subtle)',
  },
  flowNum: {
    fontSize: '11px',
    color: 'var(--color-botanical)',
    letterSpacing: '0.1em',
  },
  flowTitle: {
    fontSize: '17px',
    fontWeight: 600,
    color: '#F1F2EC',
  },
  flowDesc: {
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.55,
  },
  interactionTip: {
    fontSize: '11px',
    color: 'var(--color-text-muted)',
    padding: '12px 16px',
    border: '1px solid var(--color-grid-line)',
    backgroundColor: 'rgba(16, 20, 17, 0.4)',
  },
  phoneStage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  phoneChassis: {
    width: '320px',
    height: '620px',
    backgroundColor: '#000000',
    border: '3px solid #203D2A',
    borderRadius: '44px',
    boxShadow: '0 25px 70px rgba(0, 0, 0, 0.95), 0 0 20px rgba(181, 228, 140, 0.1)',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
  },
  dynamicIsland: {
    position: 'absolute',
    top: '12px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100px',
    height: '24px',
    backgroundColor: '#121212',
    borderRadius: '12px',
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  lensDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#0a0a0a',
    border: '1px solid #1a1a1a',
  },
  speakerPill: {
    width: '30px',
    height: '3px',
    backgroundColor: '#222222',
    borderRadius: '2px',
  },
  screenViewport: {
    flex: 1,
    paddingTop: '48px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#080A09',
  },
  screenHome: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '24px',
    textAlign: 'center',
  },
  screenTopBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pulseArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    margin: 'auto 0',
  },
  pulseTriggerButton: {
    width: '84px',
    height: '84px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-botanical)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 0 30px rgba(181, 228, 140, 0.5)',
    transition: 'transform 0.2s ease',
  },
  pulseLabel: {
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: '#F1F2EC',
  },
  pulseSub: {
    fontSize: '11px',
    color: 'var(--color-text-secondary)',
  },
  screenBottomBar: {
    display: 'flex',
    justifyContent: 'center',
  },
  screenActive: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    textAlign: 'center',
    gap: '20px',
  },
  countdownNumber: {
    fontSize: '52px',
    fontWeight: 700,
    color: 'var(--color-botanical)',
  },
  waveformWave: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    height: '60px',
    width: '100%',
  },
  waveBar: {
    width: '4px',
    backgroundColor: 'var(--color-botanical)',
    borderRadius: '2px',
  },
  analyzingText: {
    fontSize: '11px',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.6,
  },
  promptDisplay: {
    fontSize: '16px',
    lineHeight: 1.5,
    color: '#F1F2EC',
    fontWeight: 500,
    fontStyle: 'italic',
  },
  screenBlackout: {
    flex: 1,
    backgroundColor: '#000000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    textAlign: 'center',
  },
  blackoutInstruction: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    alignItems: 'center',
  },
  blackoutNotice: {
    fontSize: '11px',
    color: '#303030',
    letterSpacing: '0.1em',
  },
  blackoutText: {
    fontSize: '13px',
    color: '#222222',
    lineHeight: 1.5,
  },
  doubleTapNotice: {
    fontSize: '10px',
    color: '#404040',
    marginTop: '16px',
  },
  resetBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'none',
    border: '1px solid var(--color-border-subtle)',
    color: 'var(--color-text-secondary)',
    padding: '6px 12px',
    fontSize: '11px',
    cursor: 'pointer',
  },
};
