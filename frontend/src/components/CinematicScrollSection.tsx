import React, { useState, useEffect, useRef } from 'react';
import { Waves, Disc, Compass, ArrowRight } from 'lucide-react';

export const CinematicScrollSection: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const stages = [
    {
      num: '01',
      tag: 'SIGNAL',
      title: 'Every place has a soundscape.',
      desc: 'Before human intervention or digital notification, the atmosphere is alive with mechanical wind, moving leaves, avian biophony, and terrestrial acoustic vibrations.',
      metricLabel: 'FREQUENCY SPECTRUM',
      metricVal: '20 Hz – 20,000 Hz',
      icon: Waves,
    },
    {
      num: '02',
      tag: 'PERCEPTION',
      title: 'Not every signal comes from a screen.',
      desc: 'Computational bioacoustics decodes the environment into discrete acoustic features: spectral centroid, temporal centroid, RMS energy, and biophonic harmony index.',
      metricLabel: 'SPECTRAL CENTROID',
      metricVal: '3,240 Hz [BIOPHONY PEAK]',
      icon: Disc,
    },
    {
      num: '03',
      tag: 'RECONNECTION',
      title: 'Notice what is already around you.',
      desc: 'A single outdoor grounding instruction anchors conscious attention to physical reality. The screen ceases to exist, returning the senses to the living world.',
      metricLabel: 'SENSORY TARGET',
      metricVal: 'TACTILE GROUNDING · 100%',
      icon: Compass,
    },
  ];

  // Scroll listener to update active stage based on scroll position within section
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate progress through section (0 to 1)
      const totalDist = rect.height - windowHeight;
      if (totalDist <= 0) return;
      
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalDist));
      
      if (progress < 0.33) {
        setActiveStage(0);
      } else if (progress < 0.66) {
        setActiveStage(1);
      } else {
        setActiveStage(2);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="signal" ref={sectionRef} style={styles.section}>
      <div className="section-container" style={styles.container}>
        {/* Section Header */}
        <div style={styles.header}>
          <div className="tech-eyebrow">
            <span>SCENIC PROGRESSION / 002</span>
          </div>
          <span className="meta-label">CINEMATIC BIOACOUSTIC TIMELINE</span>
        </div>

        {/* Narrative Interactive Stage Navigator */}
        <div style={styles.timelineTabs}>
          {stages.map((stg, idx) => (
            <button
              key={stg.num}
              onClick={() => setActiveStage(idx)}
              style={{
                ...styles.tabBtn,
                borderColor: activeStage === idx ? 'var(--color-botanical)' : 'var(--color-border-subtle)',
                backgroundColor: activeStage === idx ? 'rgba(32, 61, 42, 0.25)' : 'rgba(16, 20, 17, 0.6)',
                color: activeStage === idx ? '#F1F2EC' : 'var(--color-text-secondary)',
              }}
              aria-label={`View stage ${stg.tag}`}
            >
              <span style={styles.tabNum} className="font-mono">{stg.num}</span>
              <span style={styles.tabTag} className="font-mono">{stg.tag}</span>
            </button>
          ))}
        </div>

        {/* Main Cinema Viewport */}
        <div style={styles.cinemaStage}>
          {/* Subtle Ambient Video / Contour Background */}
          <div style={styles.canvasBackground}>
            <video
              src="/background-video.mp4"
              poster="/contour-poster.svg"
              autoPlay
              loop
              muted
              playsInline
              style={{
                ...styles.stageVideo,
                filter: activeStage === 0 ? 'contrast(1.1) brightness(0.6)' : activeStage === 1 ? 'hue-rotate(20deg) brightness(0.7)' : 'brightness(0.5)',
              }}
              aria-hidden="true"
            />
            <div style={styles.canvasOverlay} />
          </div>

          {/* Current Stage Editorial Content */}
          <div style={styles.stageContent}>
            <div style={styles.stageEyebrow}>
              <span className="tech-eyebrow">
                PHASE {stages[activeStage].num} · {stages[activeStage].tag}
              </span>
              <span style={styles.stageMetric} className="font-mono">
                {stages[activeStage].metricLabel}: <strong style={{ color: 'var(--color-botanical)' }}>{stages[activeStage].metricVal}</strong>
              </span>
            </div>

            <h2 style={styles.stageTitle}>
              "{stages[activeStage].title}"
            </h2>

            <p style={styles.stageDesc}>
              {stages[activeStage].desc}
            </p>

            {/* Stage Progress Dots & Next Step CTA */}
            <div style={styles.stageFooter}>
              <div style={styles.stageDots}>
                {stages.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveStage(i)}
                    style={{
                      ...styles.dot,
                      backgroundColor: activeStage === i ? 'var(--color-botanical)' : 'var(--color-text-muted)',
                      width: activeStage === i ? '24px' : '8px',
                    }}
                  />
                ))}
              </div>

              {activeStage < 2 ? (
                <button
                  onClick={() => setActiveStage((prev) => Math.min(2, prev + 1))}
                  style={styles.nextStageBtn}
                  className="font-mono"
                >
                  <span>NEXT: {stages[activeStage + 1].tag}</span>
                  <ArrowRight size={13} />
                </button>
              ) : (
                <a href="#protocol" style={styles.nextStageBtn} className="font-mono">
                  <span>DISCOVER THE 15-SECOND PROTOCOL</span>
                  <ArrowRight size={13} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  section: {
    padding: '80px 0 100px',
    backgroundColor: 'var(--color-bg-secondary)',
    borderTop: '1px solid var(--color-border-subtle)',
    borderBottom: '1px solid var(--color-border-subtle)',
    position: 'relative',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
  },
  timelineTabs: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
  },
  tabBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 18px',
    border: '1px solid',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.25s ease',
  },
  tabNum: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--color-botanical)',
  },
  tabTag: {
    fontSize: '12px',
    letterSpacing: '0.08em',
    fontWeight: 500,
  },
  cinemaStage: {
    position: 'relative',
    minHeight: '440px',
    border: '1px solid var(--color-border-subtle)',
    backgroundColor: '#080A09',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    padding: '48px',
  },
  canvasBackground: {
    position: 'absolute',
    inset: 0,
    zIndex: 1,
  },
  stageVideo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: 0.35,
    transition: 'filter 0.5s ease',
  },
  canvasOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to right, rgba(8, 10, 9, 0.95) 0%, rgba(8, 10, 9, 0.75) 60%, rgba(8, 10, 9, 0.4) 100%)',
  },
  stageContent: {
    position: 'relative',
    zIndex: 10,
    maxWidth: '720px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  stageEyebrow: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
  },
  stageMetric: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
  },
  stageTitle: {
    fontSize: 'clamp(1.8rem, 3.4vw, 3rem)',
    lineHeight: 1.15,
    letterSpacing: '-0.03em',
    color: '#F1F2EC',
    fontWeight: 600,
  },
  stageDesc: {
    fontSize: 'clamp(1rem, 1.2vw, 1.15rem)',
    lineHeight: 1.65,
    color: 'var(--color-text-secondary)',
  },
  stageFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '20px',
    paddingTop: '20px',
    borderTop: '1px solid rgba(220, 235, 220, 0.1)',
  },
  stageDots: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  dot: {
    height: '6px',
    borderRadius: '3px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  nextStageBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'none',
    border: 'none',
    color: 'var(--color-botanical)',
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.06em',
    cursor: 'pointer',
    textDecoration: 'none',
  },
};
