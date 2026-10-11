import React, { useState } from 'react';
import { GroundingLab } from './GroundingLab';
import { DspExplainer } from './DspExplainer';
import { ArchitecturePipeline } from './ArchitecturePipeline';
import { SoundscapeLibrary } from './SoundscapeLibrary';
import { MobileSimulator } from './MobileSimulator';
import { X, Radio, Activity, Smartphone, BookOpen, Layers } from 'lucide-react';

interface InteractiveLabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'grounding' | 'dsp' | 'pipeline' | 'library' | 'mobile';

export const InteractiveLabModal: React.FC<InteractiveLabModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('grounding');

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} className="modal-overlay-mobile" onClick={onClose}>
      <div style={styles.modalContent} className="modal-content-mobile" onClick={(e) => e.stopPropagation()}>
        {/* Top Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.badgeLive}>
              <Radio size={12} color="var(--color-golden-amber)" />
              <span>LIVE LAB</span>
            </div>
            <span style={styles.headerTitle}>AURAFLORA · COMPUTATIONAL BIOACOUSTIC ENGINE</span>
          </div>

          <div style={styles.headerRight}>
            <span className="meta-label">16kHz WAV · GEMMA AI · AXUM</span>
            <button style={styles.closeBtn} onClick={onClose} title="Exit Lab">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={styles.tabBar}>
          <button
            style={{
              ...styles.tabBtn,
              borderBottomColor: activeTab === 'grounding' ? 'var(--color-golden-amber)' : 'transparent',
              color: activeTab === 'grounding' ? 'var(--color-golden-amber)' : 'var(--color-text-secondary)',
            }}
            onClick={() => setActiveTab('grounding')}
          >
            <Activity size={13} />
            <span>01 · SENSORY GROUNDING LAB</span>
          </button>

          <button
            style={{
              ...styles.tabBtn,
              borderBottomColor: activeTab === 'dsp' ? 'var(--color-golden-amber)' : 'transparent',
              color: activeTab === 'dsp' ? 'var(--color-golden-amber)' : 'var(--color-text-secondary)',
            }}
            onClick={() => setActiveTab('dsp')}
          >
            <BookOpen size={13} />
            <span>02 · DSP MATHEMATICS</span>
          </button>

          <button
            style={{
              ...styles.tabBtn,
              borderBottomColor: activeTab === 'pipeline' ? 'var(--color-golden-amber)' : 'transparent',
              color: activeTab === 'pipeline' ? 'var(--color-golden-amber)' : 'var(--color-text-secondary)',
            }}
            onClick={() => setActiveTab('pipeline')}
          >
            <Layers size={13} />
            <span>03 · SYSTEM ARCHITECTURE</span>
          </button>

          <button
            style={{
              ...styles.tabBtn,
              borderBottomColor: activeTab === 'library' ? 'var(--color-golden-amber)' : 'transparent',
              color: activeTab === 'library' ? 'var(--color-golden-amber)' : 'var(--color-text-secondary)',
            }}
            onClick={() => setActiveTab('library')}
          >
            <Radio size={13} />
            <span>04 · BIOME SOUNDSCAPES</span>
          </button>

          <button
            style={{
              ...styles.tabBtn,
              borderBottomColor: activeTab === 'mobile' ? 'var(--color-golden-amber)' : 'transparent',
              color: activeTab === 'mobile' ? 'var(--color-golden-amber)' : 'var(--color-text-secondary)',
            }}
            onClick={() => setActiveTab('mobile')}
          >
            <Smartphone size={13} />
            <span>05 · AMOLED SIMULATOR</span>
          </button>
        </div>

        {/* Tab Content Viewport */}
        <div style={styles.viewport}>
          {activeTab === 'grounding' && <GroundingLab />}
          {activeTab === 'dsp' && <DspExplainer />}
          {activeTab === 'pipeline' && <ArchitecturePipeline />}
          {activeTab === 'library' && <SoundscapeLibrary />}
          {activeTab === 'mobile' && (
            <div style={styles.mobileSimulatorContainer}>
              <MobileSimulator />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(10, 10, 10, 0.88)',
    backdropFilter: 'blur(16px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
  },
  modalContent: {
    width: '100%',
    maxWidth: '1240px',
    height: '92vh',
    backgroundColor: 'var(--color-dark-canvas)',
    border: '1px solid var(--color-border-subtle)',
    boxShadow: '0 30px 90px rgba(0, 0, 0, 0.9)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 24px',
    backgroundColor: '#1E1D1A',
    borderBottom: '1px solid var(--color-grid-line)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  badgeLive: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '3px 8px',
    backgroundColor: 'rgba(242, 196, 106, 0.12)',
    border: '1px solid rgba(242, 196, 106, 0.3)',
    color: 'var(--color-golden-amber)',
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.08em',
  },
  headerTitle: {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    letterSpacing: '0.06em',
    color: 'var(--color-soft-offwhite)',
    fontWeight: 600,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
  },
  closeBtn: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    color: 'var(--color-text-secondary)',
    border: '1px solid var(--color-grid-line)',
    cursor: 'pointer',
  },
  tabBar: {
    display: 'flex',
    overflowX: 'auto',
    backgroundColor: '#1E1D1A',
    borderBottom: '1px solid var(--color-grid-line)',
    padding: '0 24px',
    gap: '12px',
  },
  tabBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 14px',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    letterSpacing: '0.06em',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
  },
  viewport: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
    backgroundColor: 'var(--color-dark-canvas)',
  },
  mobileSimulatorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px 0',
  },
};
