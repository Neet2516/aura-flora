import React from 'react';

export const PhilosophySection: React.FC = () => {
  return (
    <section id="philosophy" style={styles.section}>
      <div className="section-container" style={styles.container}>
        <div className="crosshair-corner crosshair-tl" />
        <div className="crosshair-corner crosshair-tr" />
        <div className="crosshair-corner crosshair-bl" />
        <div className="crosshair-corner crosshair-br" />

        {/* Small Technical Label */}
        <div style={styles.eyebrowRow}>
          <span className="tech-eyebrow">DESIGN PHILOSOPHY / 006</span>
          <span className="meta-label">ANTI-SCREEN TIME COMPUTING</span>
        </div>

        {/* Dominant Statement */}
        <h2 style={styles.headline}>
          "Technology that knows
          <br />
          when to step back."
        </h2>

        {/* Editorial Body */}
        <div style={styles.bodyGrid}>
          <p style={styles.bodyLead}>
            Most software is engineered to capture, prolong, and monetize human attention. AuraFlora is built on the inverse premise: software that accomplishes its purpose in under fifteen seconds and actively dismisses the user.
          </p>

          <p style={styles.bodyDetail}>
            By capturing environmental audio rather than personal data, and returning an outdoor somatic prompt rather than algorithmic media, the device becomes an intentional bridge between digital cognition and the physical earth.
          </p>
        </div>

        {/* Principles Matrix */}
        <div style={styles.principlesRow}>
          <div style={styles.principleItem}>
            <span className="font-mono" style={styles.principleNum}>01</span>
            <span style={styles.principleTitle}>BOUNDED DURATION</span>
            <span style={styles.principleText}>Zero infinite feeds or notification loops. Absolute 15-second cap.</span>
          </div>

          <div style={styles.principleItem}>
            <span className="font-mono" style={styles.principleNum}>02</span>
            <span style={styles.principleTitle}>TACTILE GROUNDING</span>
            <span style={styles.principleText}>Guidance that engages hands, breath, skin, and surrounding air.</span>
          </div>

          <div style={styles.principleItem}>
            <span className="font-mono" style={styles.principleNum}>03</span>
            <span style={styles.principleTitle}>PURE BLACKOUT</span>
            <span style={styles.principleText}>#000000 AMOLED lock emits zero photons, turning glass into stone.</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  section: {
    padding: '120px 0',
    backgroundColor: '#080A09',
    position: 'relative',
    borderTop: '1px solid var(--color-border-subtle)',
    borderBottom: '1px solid var(--color-border-subtle)',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '48px',
    maxWidth: '1080px',
    position: 'relative',
    padding: '48px 32px',
    backgroundColor: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border-subtle)',
  },
  eyebrowRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
  },
  headline: {
    fontSize: 'clamp(2.4rem, 4.6vw, 4.2rem)',
    letterSpacing: '-0.035em',
    lineHeight: 1.08,
    color: '#F1F2EC',
    fontWeight: 600,
  },
  bodyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '32px',
  },
  bodyLead: {
    fontSize: '1.2rem',
    lineHeight: 1.6,
    color: '#F1F2EC',
    fontWeight: 400,
  },
  bodyDetail: {
    fontSize: '1.05rem',
    lineHeight: 1.65,
    color: 'var(--color-text-secondary)',
  },
  principlesRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    paddingTop: '32px',
    borderTop: '1px solid var(--color-grid-line)',
  },
  principleItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  principleNum: {
    fontSize: '11px',
    color: 'var(--color-botanical)',
    letterSpacing: '0.1em',
  },
  principleTitle: {
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '0.06em',
    color: '#F1F2EC',
  },
  principleText: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.5,
  },
};
