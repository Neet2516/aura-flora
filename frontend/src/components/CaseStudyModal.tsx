import type { ProjectItem } from '../constants/projects';
import { ProjectVisual } from './ProjectVisual';
import { X, ShieldCheck } from 'lucide-react';

interface CaseStudyModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onOpenLab?: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ project, onClose, onOpenLab }) => {
  if (!project) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Bar */}
        <div style={styles.topBar}>
          <div style={styles.topBarLeft}>
            <span className="meta-label">ARTIFACT SPECIFICATION [{project.index}]</span>
            <span style={styles.topBarCategory}>{project.category}</span>
          </div>
          <button style={styles.closeBtn} onClick={onClose} title="Close Artifact">
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={styles.body}>
          {/* Visual Canvas Display */}
          <div style={styles.visualFrame}>
            <ProjectVisual type={project.visualType} isHovered={true} />
            <div style={styles.visualCaption}>
              <span className="meta-label">{project.discipline}</span>
              <span style={styles.yearTag}>{project.year} ARCHIVE</span>
            </div>
          </div>

          {/* Details & Specs */}
          <div style={styles.infoGrid}>
            <div style={styles.mainInfo}>
              <h2 style={styles.title}>{project.title}</h2>
              <p style={styles.headline}>{project.headline}</p>
              <p style={styles.description}>{project.description}</p>

              {/* Tags */}
              <div style={styles.tagsContainer}>
                {project.tags.map((tag, i) => (
                  <span key={i} style={styles.tagPill}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div style={styles.specSidebar}>
              <div style={styles.sidebarSection}>
                <span className="meta-label">CLIENT / COMMISSION</span>
                <span style={styles.sidebarVal}>{project.client}</span>
              </div>
              <div style={styles.sidebarSection}>
                <span className="meta-label">DISCIPLINE</span>
                <span style={styles.sidebarVal}>{project.discipline}</span>
              </div>
              <div style={styles.sidebarSection}>
                <span className="meta-label">MEASURED METRICS</span>
                <div style={styles.metricsBox}>
                  {project.metrics.map((m, i) => (
                    <div key={i} style={styles.metricRow}>
                      <span style={styles.metricKey}>{m.label}</span>
                      <span style={styles.metricVal}>{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {project.isLabExperiment && onOpenLab && (
                <button
                  style={styles.labCtaBtn}
                  onClick={() => {
                    onClose();
                    onOpenLab();
                  }}
                >
                  <ShieldCheck size={14} color="#4ADE80" />
                  <span>LAUNCH INTERACTIVE LAB</span>
                </button>
              )}
            </div>
          </div>
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
    backgroundColor: 'rgba(10, 10, 10, 0.85)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  modalContent: {
    width: '100%',
    maxWidth: '960px',
    maxHeight: '90vh',
    overflowY: 'auto',
    backgroundColor: 'var(--color-bg-primary)',
    border: '1px solid var(--color-grid-active)',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8)',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    backgroundColor: 'var(--color-bg-secondary)',
    borderBottom: '1px solid var(--color-grid-line)',
  },
  topBarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  topBarCategory: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--color-text-secondary)',
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
    transition: 'all 0.2s',
  },
  body: {
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  visualFrame: {
    width: '100%',
    height: '340px',
    border: '1px solid var(--color-grid-line)',
    backgroundColor: '#121212',
    position: 'relative',
    overflow: 'hidden',
  },
  visualCaption: {
    position: 'absolute',
    bottom: '12px',
    left: '16px',
    right: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 12px',
    backgroundColor: 'rgba(20, 20, 20, 0.9)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(8px)',
  },
  yearTag: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: 'var(--color-text-muted)',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 1fr',
    gap: '40px',
  },
  mainInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 600,
    letterSpacing: '-0.03em',
    color: 'var(--color-text-primary)',
  },
  headline: {
    fontSize: '16px',
    lineHeight: 1.5,
    color: '#ECECE8',
    fontWeight: 500,
  },
  description: {
    fontSize: '14px',
    lineHeight: 1.6,
    color: 'var(--color-text-secondary)',
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '12px',
  },
  tagPill: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    letterSpacing: '0.06em',
    padding: '4px 10px',
    backgroundColor: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-grid-line)',
    color: 'var(--color-text-secondary)',
  },
  specSidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    paddingLeft: '32px',
    borderLeft: '1px solid var(--color-grid-line)',
  },
  sidebarSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  sidebarVal: {
    fontFamily: 'var(--font-mono)',
    fontSize: '13px',
    color: 'var(--color-text-primary)',
  },
  metricsBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '6px',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
  },
  metricRow: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '4px',
    borderBottom: '1px solid var(--color-grid-subtle)',
  },
  metricKey: {
    color: 'var(--color-text-muted)',
  },
  metricVal: {
    color: 'var(--color-text-primary)',
  },
  labCtaBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 18px',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    letterSpacing: '0.08em',
    backgroundColor: 'transparent',
    color: '#4ADE80',
    border: '1px solid rgba(74, 222, 128, 0.4)',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
};
