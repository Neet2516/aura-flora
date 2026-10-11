import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Waves, Disc, Compass, ArrowRight, Activity } from 'lucide-react';
import { ScrollRevealText } from './motion/ScrollRevealText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const CinematicScrollSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const panels = [
    {
      num: '01',
      tag: 'SIGNAL EMERGENCE',
      headline: 'Every place has a soundscape.',
      desc: 'Before human intervention or digital notification, the atmosphere is alive with mechanical wind, moving leaves, avian biophony, and terrestrial acoustic vibrations.',
      metricLabel: 'FREQUENCY SPECTRUM',
      metricVal: '20 Hz – 20,000 Hz',
      icon: Waves,
      accentNote: 'RAW AMBIENT INPUT',
    },
    {
      num: '02',
      tag: 'SPECTRAL PERCEPTION',
      headline: 'Not every signal comes from a screen.',
      desc: 'Computational bioacoustics decodes the environment into discrete acoustic features: spectral centroid, temporal centroid, RMS energy, and biophonic harmony index.',
      metricLabel: 'SPECTRAL CENTROID',
      metricVal: '3,240 Hz [BIOPHONY PEAK]',
      icon: Disc,
      accentNote: 'RUST FFT ANALYSIS',
    },
    {
      num: '03',
      tag: 'ACOUSTIC ECOLOGY',
      headline: 'Distinguish nature from machine noise.',
      desc: 'Normalized Difference Soundscape Index (NDSI) separates avian and insect biophony from anthropogenic engine rumble, isolating vital environmental moments.',
      metricLabel: 'BIOPHONY TARGET',
      metricVal: '88% NATURAL BIOPHONY',
      icon: Activity,
      accentNote: 'TABPFN CLASSIFICATION',
    },
    {
      num: '04',
      tag: 'SENSORY RECONNECTION',
      headline: 'Notice what is already around you.',
      desc: 'A single outdoor grounding instruction anchors conscious attention to physical reality. The screen ceases to exist, returning human senses to the living world.',
      metricLabel: 'SENSORY TARGET',
      metricVal: 'TACTILE GROUNDING · 100%',
      icon: Compass,
      accentNote: 'AMOLED ZERO EMISSION LOCK',
    },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

      const tween = gsap.to(track, {
        x: getScrollAmount,
        ease: 'none',
      });

      ScrollTrigger.create({
        trigger: section,
        animation: tween,
        start: 'top top',
        end: () => `+=${track.scrollWidth - window.innerWidth + 400}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setScrollProgress(Math.round(self.progress * 100));
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${self.progress * 100}%`;
          }
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="signal" ref={sectionRef} style={styles.pinnedSection}>
      {/* Background Topographic Contour Video */}
      <div style={styles.backgroundCanvas}>
        <video
          src="/background-video.mp4"
          poster="/contour-poster.svg"
          autoPlay
          loop
          muted
          playsInline
          style={styles.ambientVideo}
          aria-hidden="true"
        />
        <div style={styles.ambientOverlay} />
      </div>

      {/* Top Scrub Progress HUD */}
      <div style={styles.hudBar}>
        <div style={styles.hudLeft}>
          <div className="status-dot-amber" />
          <span className="font-mono" style={styles.hudTitle}>
            HORIZONTAL CINEMATIC SCRUB · [SCROLL DOWN TO ADVANCE]
          </span>
        </div>
        <div style={styles.hudRight}>
          <span className="meta-label">PROGRESS: {scrollProgress}%</span>
          <div style={styles.progressTrack}>
            <div ref={progressBarRef} style={styles.progressBar} />
          </div>
        </div>
      </div>

      {/* Pinned Horizontal Track Moving Left-to-Right / Right-to-Left on Scroll */}
      <div ref={trackRef} style={styles.horizontalTrack}>
        {panels.map((panel) => {
          const Icon = panel.icon;
          return (
            <div key={panel.num} style={styles.panelCard}>
              {/* Corner Instrumentation Marks */}
              <div className="crosshair-corner crosshair-tl" />
              <div className="crosshair-corner crosshair-tr" />
              <div className="crosshair-corner crosshair-bl" />
              <div className="crosshair-corner crosshair-br" />

              {/* Panel Header */}
              <div style={styles.panelHeader}>
                <div style={styles.panelTagWrap}>
                  <div className="tech-eyebrow">
                    <span>PHASE {panel.num}</span>
                  </div>
                  <span className="meta-label" style={{ color: 'var(--color-muted-olive)' }}>{panel.tag}</span>
                </div>
                <div style={styles.iconWrap}>
                  <Icon size={20} color="#F2C46A" />
                </div>
              </div>

              {/* Word-by-Word Scroll Reveal Headline */}
              <div style={styles.headlineWrap}>
                <ScrollRevealText
                  text={panel.headline}
                  tag="h2"
                  style={styles.panelHeadline}
                  delay={0.1}
                />
              </div>

              {/* Descriptive Body Copy */}
              <p style={styles.panelDesc}>{panel.desc}</p>

              {/* Technical Measurement Spec Box */}
              <div style={styles.panelFooter}>
                <div style={styles.metricBlock}>
                  <span className="meta-label">{panel.metricLabel}</span>
                  <span style={styles.metricValue} className="font-mono">
                    {panel.metricVal}
                  </span>
                </div>
                <div style={styles.accentBadge} className="font-mono">
                  {panel.accentNote}
                </div>
              </div>
            </div>
          );
        })}

        {/* Final Panel 05: Transition CTA Card */}
        <div style={{ ...styles.panelCard, ...styles.finalCtaCard }}>
          <div className="crosshair-corner crosshair-tl" />
          <div className="crosshair-corner crosshair-tr" />
          <div className="crosshair-corner crosshair-bl" />
          <div className="crosshair-corner crosshair-br" />

          <div className="tech-eyebrow">
            <span>SEQUENCE COMPLETE</span>
          </div>

          <h2 style={styles.finalHeadline}>
            Ready to explore the 15-second protocol?
          </h2>

          <p style={styles.finalDesc}>
            Continue scrolling downward to examine the 5-stage bioacoustic pipeline from initial audio recording to complete blackout.
          </p>

          <a href="#protocol" className="btn-amber-primary" style={{ textDecoration: 'none' }}>
            <span>EXPLORE 5-STAGE PROTOCOL</span>
            <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  pinnedSection: {
    position: 'relative',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#171614',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  backgroundCanvas: {
    position: 'absolute',
    inset: 0,
    zIndex: 1,
  },
  ambientVideo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: 0.38,
  },
  ambientOverlay: {
    position: 'absolute',
    inset: 0,
    background:
      'radial-gradient(circle at 50% 50%, rgba(23, 22, 20, 0.7) 0%, rgba(23, 22, 20, 0.94) 80%, #171614 100%)',
  },
  hudBar: {
    position: 'absolute',
    top: '20px',
    left: '32px',
    right: '32px',
    zIndex: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    backgroundColor: 'rgba(30, 29, 26, 0.88)',
    border: '1px solid var(--color-border-subtle)',
    backdropFilter: 'blur(12px)',
    flexWrap: 'wrap',
    gap: '12px',
  },
  hudLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  hudTitle: {
    fontSize: '11px',
    color: '#F7F5EF',
    letterSpacing: '0.08em',
  },
  hudRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  progressTrack: {
    width: '120px',
    height: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  progressBar: {
    width: '0%',
    height: '100%',
    backgroundColor: 'var(--color-golden-amber)',
    transition: 'width 0.1s linear',
  },
  horizontalTrack: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '6vw',
    paddingRight: '12vw',
    gap: '48px',
    height: 'auto',
    width: 'max-content',
    willChange: 'transform',
  },
  panelCard: {
    width: 'clamp(340px, 48vw, 680px)',
    minHeight: '460px',
    backgroundColor: 'rgba(30, 29, 26, 0.94)',
    border: '1px solid var(--color-border-subtle)',
    padding: '44px 36px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '24px',
    backdropFilter: 'blur(16px)',
    position: 'relative',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  panelTagWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  iconWrap: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(242, 196, 106, 0.12)',
    border: '1px solid rgba(242, 196, 106, 0.3)',
  },
  headlineWrap: {
    maxWidth: '560px',
  },
  panelHeadline: {
    fontSize: 'clamp(1.8rem, 3vw, 2.75rem)',
    lineHeight: 1.15,
    letterSpacing: '-0.03em',
    color: '#F7F5EF',
    fontWeight: 700,
  },
  panelDesc: {
    fontSize: 'clamp(1rem, 1.2vw, 1.125rem)',
    lineHeight: 1.65,
    color: 'var(--color-text-secondary)',
  },
  panelFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '20px',
    borderTop: '1px solid var(--color-grid-line)',
    flexWrap: 'wrap',
    gap: '12px',
  },
  metricBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  metricValue: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--color-golden-amber)',
    letterSpacing: '0.04em',
  },
  accentBadge: {
    fontSize: '10px',
    color: 'var(--color-text-muted)',
    border: '1px solid var(--color-grid-line)',
    padding: '4px 8px',
  },
  finalCtaCard: {
    backgroundColor: 'rgba(38, 36, 32, 0.96)',
    border: '1px solid var(--color-golden-amber)',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: '24px',
  },
  finalHeadline: {
    fontSize: 'clamp(1.8rem, 2.8vw, 2.6rem)',
    lineHeight: 1.2,
    letterSpacing: '-0.03em',
    color: '#F1F2EC',
    fontWeight: 700,
  },
  finalDesc: {
    fontSize: '1.05rem',
    lineHeight: 1.6,
    color: 'var(--color-text-secondary)',
  },
};
