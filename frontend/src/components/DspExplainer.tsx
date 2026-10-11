import React, { useState } from 'react';
import { Cpu, Activity, Binary, Waves, BarChart2 } from 'lucide-react';

export const DspExplainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'centroid' | 'ratio' | 'entropy' | 'tabpfn'>('centroid');

  return (
    <section id="dsp-science" style={styles.section}>
      <div style={styles.container}>
        {/* Eyebrow & Title */}
        <div style={styles.header}>
          <div className="badge-pill">
            <Cpu size={12} color="#81C784" />
            <span>Digital Signal Processing (DSP) Architecture</span>
          </div>
          <h2 style={styles.title}>The Acoustic Math of "Touching Grass"</h2>
          <p style={styles.subtitle}>
            AuraFlora does not use passive timers. It computes rigorous mathematical signatures of your physical soundscape in Rust using fast Fourier transforms (`rustfft`) to distinguish machine noise from biological soundscapes.
          </p>
        </div>

        {/* Tab Buttons */}
        <div style={styles.tabNav}>
          <button
            onClick={() => setActiveTab('centroid')}
            style={{
              ...styles.tabBtn,
              backgroundColor: activeTab === 'centroid' ? 'rgba(78, 135, 82, 0.3)' : 'transparent',
              borderColor: activeTab === 'centroid' ? '#81C784' : 'rgba(129, 199, 132, 0.15)',
              color: activeTab === 'centroid' ? '#E8DFD8' : '#9E9590',
            }}
          >
            <Activity size={15} />
            <span>Spectral Centroid</span>
          </button>

          <button
            onClick={() => setActiveTab('ratio')}
            style={{
              ...styles.tabBtn,
              backgroundColor: activeTab === 'ratio' ? 'rgba(78, 135, 82, 0.3)' : 'transparent',
              borderColor: activeTab === 'ratio' ? '#81C784' : 'rgba(129, 199, 132, 0.15)',
              color: activeTab === 'ratio' ? '#E8DFD8' : '#9E9590',
            }}
          >
            <Waves size={15} />
            <span>Biophony vs Anthrophony</span>
          </button>

          <button
            onClick={() => setActiveTab('entropy')}
            style={{
              ...styles.tabBtn,
              backgroundColor: activeTab === 'entropy' ? 'rgba(78, 135, 82, 0.3)' : 'transparent',
              borderColor: activeTab === 'entropy' ? '#81C784' : 'rgba(129, 199, 132, 0.15)',
              color: activeTab === 'entropy' ? '#E8DFD8' : '#9E9590',
            }}
          >
            <Binary size={15} />
            <span>Spectral Entropy</span>
          </button>

          <button
            onClick={() => setActiveTab('tabpfn')}
            style={{
              ...styles.tabBtn,
              backgroundColor: activeTab === 'tabpfn' ? 'rgba(78, 135, 82, 0.3)' : 'transparent',
              borderColor: activeTab === 'tabpfn' ? '#81C784' : 'rgba(129, 199, 132, 0.15)',
              color: activeTab === 'tabpfn' ? '#E8DFD8' : '#9E9590',
            }}
          >
            <BarChart2 size={15} />
            <span>TabPFN Classification</span>
          </button>
        </div>

        {/* Tab Detail Cards */}
        <div className="glass-panel" style={styles.cardContent}>
          {activeTab === 'centroid' && (
            <div style={styles.detailGrid}>
              <div>
                <h3 style={styles.detailHeading}>Spectral Centroid (Acoustic Center of Mass)</h3>
                <p style={styles.detailText}>
                  The spectral centroid indicates the "brightness" and center of mass of the audio spectrum. Natural soundscapes (birdsong, rustling dry leaves, droplets) concentrate power above <strong>2,000 Hz – 4,500 Hz</strong>, whereas human machinery, tires, and indoor AC compressors drone below <strong>600 Hz</strong>.
                </p>

                <div style={styles.formulaBox}>
                  <code>f_c = Σ (f_k · S(f_k)) / Σ S(f_k)</code>
                </div>

                <div style={styles.comparisonList}>
                  <div style={styles.compItem}>
                    <span style={styles.compLabel}>Indoor HVAC / Highway:</span>
                    <span style={styles.compValLow}>240 – 680 Hz</span>
                  </div>
                  <div style={styles.compItem}>
                    <span style={styles.compLabel}>Deciduous Forest Canopy:</span>
                    <span style={styles.compValHigh}>2,450 – 3,800 Hz</span>
                  </div>
                  <div style={styles.compItem}>
                    <span style={styles.compLabel}>High Prairie Insect Chorus:</span>
                    <span style={styles.compValHigh}>4,100 – 5,200 Hz</span>
                  </div>
                </div>
              </div>

              <div style={styles.rustCodeBlock}>
                <div style={styles.codeHeader}>
                  <span style={styles.codeDot} />
                  <span>backend/src/dsp/features.rs</span>
                </div>
                <pre style={styles.codeSnippet}>
{`pub fn calculate_spectral_centroid(
    frequencies: &[f32],
    magnitudes: &[f32]
) -> f32 {
    let mut weighted_sum = 0.0;
    let mut total_magnitude = 0.0;

    for (f, m) in frequencies.iter().zip(magnitudes) {
        weighted_sum += f * m;
        total_magnitude += m;
    }

    if total_magnitude > 1e-6 {
        weighted_sum / total_magnitude
    } else {
        0.0
    }
}`}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'ratio' && (
            <div style={styles.detailGrid}>
              <div>
                <h3 style={styles.detailHeading}>Bernie Krause's Biophony vs Anthrophony</h3>
                <p style={styles.detailText}>
                  Soundscape ecology partitions acoustic energy into:
                </p>
                <ul style={styles.bulletList}>
                  <li><strong>Biophony (2 kHz – 8 kHz):</strong> Biological vocalizations of non-human organisms.</li>
                  <li><strong>Anthrophony (20 Hz – 2 kHz):</strong> Man-made mechanical rumble, construction, and traffic.</li>
                  <li><strong>Geophony:</strong> Wind, rain, thunder, and water flow across geological features.</li>
                </ul>
                <p style={styles.detailText}>
                  AuraFlora's Rust pipeline partitions FFT energy bins into these frequency boundaries to calculate the <em>Biophony Ratio</em> before passing the feature vector to Gemma AI.
                </p>
              </div>

              <div style={styles.visualDiagram}>
                <div style={styles.bandBarContainer}>
                  <div style={{ ...styles.bandBar, width: '35%', backgroundColor: '#8B4A4A' }}>
                    <span>Anthrophony (&lt;2 kHz)</span>
                  </div>
                  <div style={{ ...styles.bandBar, width: '65%', backgroundColor: '#4E8752' }}>
                    <span>Biophony (2 – 8 kHz)</span>
                  </div>
                </div>
                <div style={styles.diagramLegend}>
                  <div style={styles.legendItem}>
                    <span style={{ ...styles.legendDot, backgroundColor: '#8B4A4A' }} />
                    <span>Machine Noise Threshold</span>
                  </div>
                  <div style={styles.legendItem}>
                    <span style={{ ...styles.legendDot, backgroundColor: '#4E8752' }} />
                    <span>Biological Grounding Target (&gt;75%)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'entropy' && (
            <div style={styles.detailGrid}>
              <div>
                <h3 style={styles.detailHeading}>Spectral Entropy (Acoustic Complexity)</h3>
                <p style={styles.detailText}>
                  Spectral entropy measures the uniformity of the spectral distribution. A pure monotone electronic buzz has zero entropy ($H \approx 0$). In contrast, a rich ecosystem with layered birdsong, rushing water, and foliage rustle produces high entropy ($H &gt; 0.70$).
                </p>
                <div style={styles.formulaBox}>
                  <code>H = - Σ (p_k · log2(p_k)) / log2(N)</code>
                </div>
                <p style={styles.detailText}>
                  This ensures that someone playing an artificial ringtone or single drone cannot fool the grounding companion into hallucinating biodiversity.
                </p>
              </div>

              <div style={styles.rustCodeBlock}>
                <div style={styles.codeHeader}>
                  <span style={styles.codeDot} />
                  <span>Shannon Entropy Normalization</span>
                </div>
                <pre style={styles.codeSnippet}>
{`let norm_factor = (magnitudes.len() as f32).log2();
let entropy: f32 = probabilities
    .iter()
    .filter(|&&p| p > 1e-12)
    .map(|&p| -p * p.log2())
    .sum::<f32>() / norm_factor;

debug!("Soundscape entropy calculated: {:.3}", entropy);`}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'tabpfn' && (
            <div style={styles.detailGrid}>
              <div>
                <h3 style={styles.detailHeading}>Prior-Data Fitted Classification (TabPFN)</h3>
                <p style={styles.detailText}>
                  Instead of running heavy convolutional neural nets on raw audio waveforms, AuraFlora extracts an ultra-compact 5-dimensional acoustic feature vector and classifies it via TabPFN (Prior-Data Fitted Network).
                </p>
                <div style={styles.vectorPills}>
                  <span className="badge-pill">Spectral Centroid</span>
                  <span className="badge-pill">Biophony Ratio</span>
                  <span className="badge-pill">Spectral Entropy</span>
                  <span className="badge-pill">RMS Energy (dB)</span>
                  <span className="badge-pill">Zero Crossing Rate</span>
                </div>
                <p style={styles.detailText}>
                  The classification resolves in <strong>&lt; 12 milliseconds</strong>, providing instant biological classification tags to feed Google Gemma 2B-IT.
                </p>
              </div>

              <div style={styles.featureScoreCard}>
                <div style={styles.scoreRow}>
                  <span>Inference Latency:</span>
                  <strong style={{ color: '#81C784' }}>11.4 ms</strong>
                </div>
                <div style={styles.scoreRow}>
                  <span>Feature Extraction:</span>
                  <strong style={{ color: '#81C784' }}>rustfft (Tokio async)</strong>
                </div>
                <div style={styles.scoreRow}>
                  <span>Fallback Mode:</span>
                  <strong style={{ color: '#E8DFD8' }}>Rule-Based Heuristic Matrix</strong>
                </div>
                <div style={styles.scoreRow}>
                  <span>Memory Footprint:</span>
                  <strong style={{ color: '#81C784' }}>&lt; 14 MB RAM</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  section: {
    padding: '80px 24px',
    backgroundColor: '#070B09',
    position: 'relative',
  },
  container: {
    maxWidth: 1200,
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)',
    marginTop: 14,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: '1rem',
    color: '#9E9590',
    maxWidth: 700,
    margin: '0 auto',
    lineHeight: 1.6,
  },
  tabNav: {
    display: 'flex',
    gap: 10,
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  tabBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 18px',
    borderRadius: 10,
    border: '1px solid',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  cardContent: {
    padding: 32,
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 32,
    alignItems: 'center',
  },
  detailHeading: {
    fontSize: '1.35rem',
    marginBottom: 14,
    color: '#81C784',
  },
  detailText: {
    fontSize: '0.92rem',
    lineHeight: 1.6,
    color: '#9E9590',
    marginBottom: 16,
  },
  formulaBox: {
    backgroundColor: '#0A0F0D',
    border: '1px solid rgba(129, 199, 132, 0.25)',
    borderRadius: 8,
    padding: '12px 16px',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.9rem',
    color: '#E8DFD8',
    marginBottom: 18,
    overflowX: 'auto',
  },
  comparisonList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  compItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 12px',
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    fontSize: '0.82rem',
  },
  compLabel: {
    color: '#9E9590',
  },
  compValLow: {
    fontFamily: 'var(--font-mono)',
    color: '#F87171',
    fontWeight: 600,
  },
  compValHigh: {
    fontFamily: 'var(--font-mono)',
    color: '#81C784',
    fontWeight: 600,
  },
  rustCodeBlock: {
    backgroundColor: '#050806',
    border: '1px solid rgba(129, 199, 132, 0.2)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  codeHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 14px',
    backgroundColor: '#0A0F0D',
    borderBottom: '1px solid rgba(129, 199, 132, 0.1)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.72rem',
    color: '#81C784',
  },
  codeDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: '#81C784',
  },
  codeSnippet: {
    padding: 16,
    margin: 0,
    fontFamily: 'var(--font-mono)',
    fontSize: '0.78rem',
    lineHeight: 1.5,
    color: '#E8DFD8',
    overflowX: 'auto',
  },
  bulletList: {
    paddingLeft: 20,
    fontSize: '0.9rem',
    lineHeight: 1.6,
    color: '#9E9590',
    marginBottom: 16,
  },
  visualDiagram: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    backgroundColor: '#0A0F0D',
    padding: 24,
    borderRadius: 12,
    border: '1px solid rgba(129, 199, 132, 0.2)',
  },
  bandBarContainer: {
    display: 'flex',
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
    fontWeight: 600,
    fontSize: '0.78rem',
  },
  bandBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    letterSpacing: '0.04em',
  },
  diagramLegend: {
    display: 'flex',
    gap: 20,
    justifyContent: 'center',
    fontSize: '0.78rem',
    color: '#9E9590',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
  },
  vectorPills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  featureScoreCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    backgroundColor: '#0A0F0D',
    padding: 24,
    borderRadius: 12,
    border: '1px solid rgba(129, 199, 132, 0.2)',
  },
  scoreRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.88rem',
    color: '#9E9590',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
    paddingBottom: 8,
  },
};
