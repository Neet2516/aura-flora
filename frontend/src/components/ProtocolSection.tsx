import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Radio, Cpu, Sparkles, Moon, ArrowRight } from 'lucide-react';
import { ScrollRevealText } from './motion/ScrollRevealText';
import { FadeInWhenVisible } from './motion/FadeInWhenVisible';

interface ProtocolSectionProps {
  onOpenSimulator: () => void;
}

export const ProtocolSection: React.FC<ProtocolSectionProps> = ({ onOpenSimulator }) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      num: '01',
      title: 'PRESS',
      duration: '1 SEC',
      summary: 'One intentional trigger action.',
      detail:
        'No feed, no endless options, and zero infinite scroll. The user initiates a single acoustic session with one tactile tap.',
      icon: Mic,
      cue: 'Haptic trigger pulse · Session initiated',
    },
    {
      num: '02',
      title: 'LISTEN',
      duration: '5–10 SEC',
      summary: 'Capture ambient environmental sound.',
      detail:
        'The mobile microphone samples continuous 16kHz audio. The user pauses in silence while surrounding air and acoustic ecology enter the sensor.',
      icon: Radio,
      cue: '16kHz WAV buffer · 512-point FFT window',
    },
    {
      num: '03',
      title: 'ANALYZE',
      duration: '1.2 SEC',
      summary: 'Extract acoustic features & biophony ratio.',
      detail:
        'The Rust Axum DSP engine evaluates spectral centroid, RMS energy, and acoustic complexity, differentiating biological sounds from anthropogenic noise.',
      icon: Cpu,
      cue: 'TabPFN heuristic · Biophony/Anthrophony ratio',
    },
    {
      num: '04',
      title: 'GROUND',
      duration: '1.5 SEC',
      summary: 'Synthesize one tactile outdoor prompt.',
      detail:
        'Gemma AI models generate a single outdoor grounding action tailored to the current soundscape: touching bark, noticing wind direction, or tracking birdsong.',
      icon: Sparkles,
      cue: 'Zero hallucination guardrail · Single outdoor prompt',
    },
    {
      num: '05',
      title: 'DISCONNECT',
      duration: 'INSTANT',
      summary: 'Spoken guidance & AMOLED blackout.',
      detail:
        'ElevenLabs whispers the instruction, while the display fades into pure #000000 blackout. Zero light emission encourages the user to pocket the device.',
      icon: Moon,
      cue: '#000000 AMOLED lock · ≤ 15s total interaction',
    },
  ];

  return (
    <section id="protocol" style={styles.section}>
      <div className="section-container" style={styles.container}>
        {/* Section Header */}
        <div style={styles.header}>
          <div>
            <div className="tech-eyebrow">
              <span>HOW IT WORKS / 003</span>
            </div>
            <ScrollRevealText
              text="The 15-Second Protocol"
              tag="h2"
              style={styles.title}
              delay={0.1}
            />
          </div>
          <FadeInWhenVisible delay={0.25}>
            <p style={styles.subtitle}>
              A strictly bounded interaction engineered to terminate screen time and anchor attention in the physical environment.
            </p>
          </FadeInWhenVisible>
        </div>

        {/* 5-Step Process Timeline with Staggered Framer Motion Appearance */}
        <div style={styles.stepsGrid}>
          {steps.map((st, i) => {
            const Icon = st.icon;
            const isSelected = activeStep === i;
            return (
              <motion.div
                key={st.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                onClick={() => setActiveStep(i)}
                style={{
                  ...styles.stepCard,
                  borderColor: isSelected ? 'var(--color-botanical)' : 'var(--color-border-subtle)',
                  backgroundColor: isSelected ? 'rgba(23, 28, 24, 0.95)' : 'rgba(16, 20, 17, 0.7)',
                }}
                role="button"
                tabIndex={0}
              >
                {/* Step Header */}
                <div style={styles.stepTop}>
                  <span style={styles.stepNum} className="font-mono">
                    {st.num}
                  </span>
                  <span style={styles.stepDuration} className="font-mono">
                    {st.duration}
                  </span>
                </div>

                {/* Step Icon & Title */}
                <div style={styles.stepIdentity}>
                  <div
                    style={{
                      ...styles.iconWrap,
                      backgroundColor: isSelected ? 'rgba(181, 228, 140, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                      color: isSelected ? 'var(--color-botanical)' : 'var(--color-text-secondary)',
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <h3 style={styles.stepTitle}>{st.title}</h3>
                </div>

                <p style={styles.stepSummary}>{st.summary}</p>
                <p style={styles.stepDetail}>{st.detail}</p>

                {/* Visual Technical Cue */}
                <div style={styles.cueBox}>
                  <span className="meta-label">SIGNAL CUE</span>
                  <span style={styles.cueText} className="font-mono">
                    {st.cue}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Protocol Interactive Preview Trigger */}
        <FadeInWhenVisible delay={0.35}>
          <div style={styles.protocolFooter}>
            <div style={styles.footerInfo}>
              <span className="tech-eyebrow">TOTAL SCREEN BUDGET</span>
              <span style={styles.budgetValue} className="font-mono">
                MAXIMUM 15 SECONDS · GUARANTEED BLACKOUT
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenSimulator}
              className="btn-botanical-primary"
              title="Launch Phone Simulator to test protocol"
            >
              <span>TEST PROTOCOL IN PHONE SIMULATOR</span>
              <ArrowRight size={14} />
            </motion.button>
          </div>
        </FadeInWhenVisible>
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
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
  },
  stepCard: {
    border: '1px solid',
    padding: '24px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    cursor: 'pointer',
    position: 'relative',
    willChange: 'transform',
  },
  stepTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepNum: {
    fontSize: '15px',
    fontWeight: 700,
    color: 'var(--color-botanical)',
  },
  stepDuration: {
    fontSize: '11px',
    color: 'var(--color-text-muted)',
    border: '1px solid var(--color-grid-line)',
    padding: '2px 6px',
  },
  stepIdentity: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  iconWrap: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: '2px',
  },
  stepTitle: {
    fontSize: '18px',
    fontWeight: 600,
    letterSpacing: '0.04em',
    color: '#F1F2EC',
  },
  stepSummary: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#F1F2EC',
    lineHeight: 1.45,
  },
  stepDetail: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.55,
    flex: 1,
  },
  cueBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    paddingTop: '12px',
    borderTop: '1px solid var(--color-grid-line)',
  },
  cueText: {
    fontSize: '11px',
    color: 'var(--color-botanical)',
    lineHeight: 1.4,
  },
  protocolFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '20px',
    padding: '28px',
    backgroundColor: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border-subtle)',
  },
  footerInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  budgetValue: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#F1F2EC',
    letterSpacing: '0.05em',
  },
};
