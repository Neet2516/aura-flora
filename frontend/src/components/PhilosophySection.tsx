import React from 'react';
import { motion } from 'framer-motion';
import { ScrollRevealText } from './motion/ScrollRevealText';
import { FadeInWhenVisible } from './motion/FadeInWhenVisible';

export const PhilosophySection: React.FC = () => {
  return (
    <section id="philosophy" style={styles.section}>
      <div className="section-container" style={styles.container}>
        <div className="crosshair-corner crosshair-tl" />
        <div className="crosshair-corner crosshair-tr" />
        <div className="crosshair-corner crosshair-bl" />
        <div className="crosshair-corner crosshair-br" />

        {/* Small Technical Label */}
        <FadeInWhenVisible delay={0.1}>
          <div style={styles.eyebrowRow}>
            <span className="tech-eyebrow" style={{ color: '#6A6844' }}>DESIGN PHILOSOPHY / 006</span>
            <span className="meta-label" style={{ color: '#4C4541' }}>ANTI-SCREEN TIME COMPUTING</span>
          </div>
        </FadeInWhenVisible>

        {/* Dominant Statement with Masked Word-by-Word Reveal */}
        <div style={styles.headlineWrap}>
          <ScrollRevealText
            text="Technology that knows when to step back."
            tag="h2"
            style={styles.headline}
            delay={0.15}
            stagger={0.045}
          />
        </div>

        {/* Editorial Body */}
        <FadeInWhenVisible delay={0.3} yOffset={24}>
          <div style={styles.bodyGrid}>
            <p style={styles.bodyLead}>
              Most software is engineered to capture, prolong, and monetize human attention. AuraFlora is built on the inverse premise: software that accomplishes its purpose in under fifteen seconds and actively dismisses the user.
            </p>

            <p style={styles.bodyDetail}>
              By capturing environmental audio rather than personal data, and returning an outdoor somatic prompt rather than algorithmic media, the device becomes an intentional bridge between digital cognition and the physical earth.
            </p>
          </div>
        </FadeInWhenVisible>

        {/* Principles Matrix with Staggered Cards */}
        <div style={styles.principlesRow}>
          {[
            {
              num: '01',
              title: 'BOUNDED DURATION',
              text: 'Zero infinite feeds or notification loops. Absolute 15-second cap.',
            },
            {
              num: '02',
              title: 'TACTILE GROUNDING',
              text: 'Guidance that engages hands, breath, skin, and surrounding air.',
            },
            {
              num: '03',
              title: 'PURE BLACKOUT',
              text: '#000000 AMOLED lock emits zero photons, turning glass into stone.',
            },
          ].map((pr, idx) => (
            <motion.div
              key={pr.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.4 + idx * 0.12 }}
              style={styles.principleItem}
            >
              <span className="font-mono" style={styles.principleNum}>
                {pr.num}
              </span>
              <span style={styles.principleTitle}>{pr.title}</span>
              <span style={styles.principleText}>{pr.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  section: {
    padding: '120px 0',
    backgroundColor: 'var(--color-warm-cream)',
    position: 'relative',
    borderTop: '1px solid rgba(76, 69, 65, 0.15)',
    borderBottom: '1px solid rgba(76, 69, 65, 0.15)',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '48px',
    maxWidth: '1080px',
    position: 'relative',
    padding: '48px 32px',
    backgroundColor: '#FFF8ED',
    border: '1px solid rgba(76, 69, 65, 0.22)',
    boxShadow: '0 8px 32px rgba(76, 69, 65, 0.06)',
  },
  eyebrowRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
  },
  headlineWrap: {
    maxWidth: '920px',
  },
  headline: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(2.25rem, 4.5vw, 4rem)',
    letterSpacing: '-0.035em',
    lineHeight: 1.08,
    color: '#2A2624',
    fontWeight: 500,
  },
  bodyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '32px',
  },
  bodyLead: {
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(1.1rem, 1.4vw, 1.25rem)',
    lineHeight: 1.65,
    letterSpacing: 'var(--tracking-body)',
    color: '#2A2624',
    fontWeight: 400,
  },
  bodyDetail: {
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(0.95rem, 1.2vw, 1.05rem)',
    lineHeight: 1.65,
    letterSpacing: 'var(--tracking-body)',
    color: '#4C4541',
    fontWeight: 400,
  },
  principlesRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    paddingTop: '32px',
    borderTop: '1px solid rgba(76, 69, 65, 0.16)',
  },
  principleItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  principleNum: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: '#6A6844',
    letterSpacing: '0.1em',
    fontWeight: 600,
  },
  principleTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '13px',
    fontWeight: 600,
    letterSpacing: '0.04em',
    color: '#2A2624',
  },
  principleText: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.8125rem',
    color: '#4C4541',
    lineHeight: 1.6,
    letterSpacing: 'var(--tracking-body)',
  },
};
