import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { GroundingLab } from './components/GroundingLab';
import { DspExplainer } from './components/DspExplainer';
import { ArchitecturePipeline } from './components/ArchitecturePipeline';
import { SoundscapeLibrary } from './components/SoundscapeLibrary';
import { PhilosophySection } from './components/PhilosophySection';
import { MobileSimulator } from './components/MobileSimulator';
import { Footer } from './components/Footer';
import { X, Smartphone } from 'lucide-react';
import { soundEngine } from './services/soundEngine';

export function App() {
  const [showSimulator, setShowSimulator] = useState(false);

  const scrollToGroundingLab = () => {
    soundEngine.playHaptic();
    const el = document.getElementById('grounding-lab');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleSimulator = () => {
    soundEngine.playHaptic();
    setShowSimulator((prev) => !prev);
  };

  return (
    <div style={styles.appRoot}>
      {/* Navigation */}
      <Navbar
        onStartGrounding={scrollToGroundingLab}
        onToggleSimulator={toggleSimulator}
        showSimulator={showSimulator}
      />

      {/* Hero Section */}
      <Hero onStartGrounding={scrollToGroundingLab} />

      {/* Core Interactive BioAcoustic Lab */}
      <GroundingLab />

      {/* DSP Mathematics & Science */}
      <DspExplainer />

      {/* End-to-End Pipeline */}
      <ArchitecturePipeline />

      {/* Soundscape Biome Library */}
      <SoundscapeLibrary />

      {/* Touch Grass Manifesto */}
      <PhilosophySection />

      {/* Footer */}
      <Footer />

      {/* Mobile Simulator Modal / Drawer */}
      {showSimulator && (
        <div style={styles.simModalOverlay} onClick={toggleSimulator}>
          <div
            style={styles.simModalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.simModalHeader}>
              <div style={styles.simModalTitle}>
                <Smartphone size={16} color="#81C784" />
                <span>AuraFlora AMOLED Mobile Experience</span>
              </div>
              <button
                onClick={toggleSimulator}
                style={styles.simCloseBtn}
                title="Close Phone Simulator"
              >
                <X size={18} color="#9E9590" />
              </button>
            </div>

            <MobileSimulator />
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  appRoot: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#0A0F0D',
  },
  simModalOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  simModalContent: {
    backgroundColor: '#121A15',
    border: '1px solid rgba(129, 199, 132, 0.3)',
    borderRadius: 24,
    padding: '24px 28px 32px',
    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 18,
    maxHeight: '94vh',
    overflowY: 'auto',
  },
  simModalHeader: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottom: '1px solid rgba(129, 199, 132, 0.15)',
  },
  simModalTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#E8DFD8',
    letterSpacing: '0.04em',
  },
  simCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
  },
};

export default App;
