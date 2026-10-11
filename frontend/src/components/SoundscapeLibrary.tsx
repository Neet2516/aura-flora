import React, { useState } from 'react';
import { Volume2, VolumeX, Compass, MapPin } from 'lucide-react';
import { SOUNDSCAPE_PRESETS } from '../constants/presets';
import { soundEngine } from '../services/soundEngine';
import type { SoundscapePreset } from '../types';

export const SoundscapeLibrary: React.FC = () => {
  const [playingId, setPlayingId] = useState<string | null>(null);

  const toggleAmbiance = (preset: SoundscapePreset) => {
    soundEngine.playHaptic();
    if (playingId === preset.id) {
      soundEngine.stopAmbient();
      setPlayingId(null);
    } else {
      soundEngine.playAmbient(preset.audioToneType);
      setPlayingId(preset.id);
    }
  };

  return (
    <section id="field-notes" style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div className="badge-pill">
            <Compass size={12} color="#81C784" />
            <span>Ecological Soundscape Index</span>
          </div>
          <h2 style={styles.title}>Field Biome Acoustic Profiles</h2>
          <p style={styles.subtitle}>
            Explore the biological signatures classified by AuraFlora. Click "Listen" to synthesize the living acoustic ambiance directly in your browser.
          </p>
        </div>

        <div style={styles.cardsGrid}>
          {SOUNDSCAPE_PRESETS.map((preset) => {
            const isPlaying = playingId === preset.id;
            return (
              <div key={preset.id} className="glass-panel" style={styles.biomeCard}>
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.biomeTitle}>{preset.title}</h3>
                    <div style={styles.biomeLocation}>
                      <MapPin size={12} color="#81C784" />
                      <span>{preset.location}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleAmbiance(preset)}
                    style={{
                      ...styles.listenBtn,
                      backgroundColor: isPlaying ? '#4E8752' : 'rgba(255, 255, 255, 0.05)',
                      color: isPlaying ? '#FFFFFF' : '#81C784',
                    }}
                  >
                    {isPlaying ? <Volume2 size={15} /> : <VolumeX size={15} />}
                    <span>{isPlaying ? 'Playing' : 'Listen'}</span>
                  </button>
                </div>

                <p style={styles.biomeDesc}>{preset.description}</p>

                {/* Tactile instruction prompt */}
                <div style={styles.tactileBox}>
                  <div style={styles.tactileLabel}>GENERATED GEMMA TACTILE PROMPT</div>
                  <div style={styles.tactileQuote}>"{preset.samplePrompt}"</div>
                </div>

                {/* Metrics Footer */}
                <div style={styles.metricsFooter}>
                  <div style={styles.metric}>
                    <span>Centroid</span>
                    <strong>{preset.features.spectral_centroid} Hz</strong>
                  </div>
                  <div style={styles.metric}>
                    <span>Biophony</span>
                    <strong>{Math.round(preset.classification.biophony_score * 100)}%</strong>
                  </div>
                  <div style={styles.metric}>
                    <span>Entropy</span>
                    <strong>{preset.features.spectral_entropy}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  section: {
    padding: 'clamp(32px, 5vw, 80px) clamp(12px, 3vw, 24px)',
    backgroundColor: 'var(--color-dark-canvas)',
  },
  container: {
    maxWidth: 1200,
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: 44,
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(1.85rem, 3.2vw, 2.75rem)',
    letterSpacing: '-0.035em',
    lineHeight: 1.1,
    fontWeight: 600,
    color: 'var(--color-soft-offwhite)',
    marginTop: 14,
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(0.95rem, 1.2vw, 1.05rem)',
    letterSpacing: 'var(--tracking-body)',
    color: 'var(--color-text-secondary)',
    maxWidth: 680,
    margin: '0 auto',
    lineHeight: 1.65,
    fontWeight: 400,
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
    gap: 20,
  },
  biomeCard: {
    padding: 'clamp(16px, 3vw, 24px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 16,
    textAlign: 'left',
    backgroundColor: '#1E1D1A',
    border: '1px solid var(--color-border-subtle)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  biomeTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '17px',
    fontWeight: 500,
    letterSpacing: '-0.02em',
    color: 'var(--color-soft-offwhite)',
    marginBottom: 4,
  },
  biomeLocation: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    color: 'var(--color-muted-olive)',
  },
  listenBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 12px',
    borderRadius: 2,
    border: '1px solid rgba(174, 172, 120, 0.3)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.78rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  biomeDesc: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.875rem',
    lineHeight: 1.6,
    letterSpacing: 'var(--tracking-body)',
    color: 'var(--color-text-secondary)',
    fontWeight: 400,
  },
  tactileBox: {
    backgroundColor: '#12110F',
    border: '1px solid var(--color-grid-line)',
    borderRadius: 2,
    padding: '12px 14px',
  },
  tactileLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.6875rem',
    fontWeight: 600,
    color: 'var(--color-golden-amber)',
    letterSpacing: '0.08em',
    marginBottom: 6,
  },
  tactileQuote: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.875rem',
    color: 'var(--color-soft-offwhite)',
    fontStyle: 'italic',
    lineHeight: 1.5,
  },
  metricsFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTop: '1px solid var(--color-grid-line)',
  },
  metric: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    color: 'var(--color-text-muted)',
  },
};
