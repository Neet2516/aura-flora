import React from 'react';
import { EyeOff } from 'lucide-react';

export const PhilosophySection: React.FC = () => {
  return (
    <section id="manifesto" style={styles.section}>
      <div style={styles.container}>
        <div style={styles.manifestoCard} className="glass-panel">
          <div style={styles.badgeWrap}>
            <span className="badge-pill">
              <EyeOff size={12} color="#81C784" />
              <span>The Anti-Screen Manifesto</span>
            </span>
          </div>

          <h2 style={styles.quoteTitle}>
            "The greatest danger of software is not that it is buggy, but that it successfully holds human attention captive."
          </h2>

          <div style={styles.contentGrid}>
            <div style={styles.col}>
              <h3 style={styles.colTitle}>The Doomloop of Wellness Apps</h3>
              <p style={styles.colText}>
                Traditional meditation and outdoor apps keep you staring at radiant OLED displays: scrolling lists, checking daily streaks, collecting badges, and logging minutes. You end up spending 20 minutes staring into a backlit rectangle to practice 5 minutes of mindfulness.
              </p>
            </div>

            <div style={styles.col}>
              <h3 style={styles.colTitle}>The AuraFlora Inversion</h3>
              <p style={styles.colText}>
                AuraFlora inverts modern app incentives. Our success metric is <strong>session brevity</strong>. If your screen is illuminated for more than 15 seconds, we have failed. We sample the acoustic frequencies of your reality, give you one direct physical instruction, and lock the screen black.
              </p>
            </div>
          </div>

          {/* Three Pillars */}
          <div style={styles.pillarsRow}>
            <div style={styles.pillar}>
              <span style={styles.pillarNum}>I</span>
              <h4>Zero Gamification</h4>
              <p>No streaks, no XP, no notifications, no push alerts.</p>
            </div>
            <div style={styles.pillar}>
              <span style={styles.pillarNum}>II</span>
              <h4>Pure AMOLED #000000</h4>
              <p>Pixels emit zero photons. Look upward, not downward.</p>
            </div>
            <div style={styles.pillar}>
              <span style={styles.pillarNum}>III</span>
              <h4>Tactile Reality</h4>
              <p>Touch rough bark, cold creeks, and damp grass.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  section: {
    padding: '80px 24px',
    backgroundColor: '#0A0F0D',
  },
  container: {
    maxWidth: 1080,
    margin: '0 auto',
  },
  manifestoCard: {
    padding: '48px 36px',
    textAlign: 'center',
  },
  badgeWrap: {
    marginBottom: 20,
  },
  quoteTitle: {
    fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)',
    fontWeight: 600,
    lineHeight: 1.35,
    color: '#E8DFD8',
    maxWidth: 820,
    margin: '0 auto 40px',
    fontStyle: 'italic',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 32,
    textAlign: 'left',
    marginBottom: 44,
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  colTitle: {
    fontSize: '1.1rem',
    color: '#81C784',
    fontWeight: 700,
  },
  colText: {
    fontSize: '0.9rem',
    lineHeight: 1.6,
    color: '#9E9590',
  },
  pillarsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 20,
    paddingTop: 32,
    borderTop: '1px solid rgba(129, 199, 132, 0.15)',
    textAlign: 'left',
  },
  pillar: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  pillarNum: {
    fontFamily: 'var(--font-mono)',
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#81C784',
  },
};
