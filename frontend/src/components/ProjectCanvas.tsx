import React, { useState } from 'react';
import type { ProjectItem } from '../constants/projects';
import { PROJECTS } from '../constants/projects';
import { ProjectVisual } from './ProjectVisual';
import { ChevronLeft, ChevronRight, ArrowUpRight, Radio } from 'lucide-react';

interface ProjectCanvasProps {
  onSelectProject: (project: ProjectItem) => void;
  onActiveIndexChange: (index: string) => void;
  onOpenLab: () => void;
}

export const ProjectCanvas: React.FC<ProjectCanvasProps> = ({
  onSelectProject,
  onActiveIndexChange,
  onOpenLab,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => {
      const next = prev === 0 ? PROJECTS.length - 1 : prev - 1;
      onActiveIndexChange(PROJECTS[next].index);
      return next;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const next = prev === PROJECTS.length - 1 ? 0 : prev + 1;
      onActiveIndexChange(PROJECTS[next].index);
      return next;
    });
  };

  const activeProject = PROJECTS[currentIndex];

  return (
    <section style={styles.sectionRoot} id="work">
      {/* Top Section Header Bar */}
      <div style={styles.sectionHeader}>
        <div style={styles.headerTitleZone}>
          <span className="meta-label">INDEX OF WORK</span>
          <h2 style={styles.headerHeading}>SELECTED COMMISSIONS & ARTIFACTS</h2>
        </div>
        <div style={styles.headerControls}>
          <span style={styles.counterText}>
            {activeProject.index} — {activeProject.title.toUpperCase()}
          </span>
          <div style={styles.navButtons}>
            <button
              onClick={handlePrev}
              style={styles.arrowBtn}
              aria-label="Previous Project"
              title="Previous Project"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              style={styles.arrowBtn}
              aria-label="Next Project"
              title="Next Project"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div style={styles.stageViewport}>
        <div style={styles.cardsRow}>
          {PROJECTS.map((project, idx) => {
            const isHovered = hoveredId === project.id;
            const isCurrent = idx === currentIndex;

            return (
              <div
                key={project.id}
                style={{
                  ...styles.projectCard,
                  borderColor: isHovered
                    ? 'var(--color-grid-active)'
                    : isCurrent
                    ? 'rgba(255, 255, 255, 0.16)'
                    : 'var(--color-grid-line)',
                  transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                }}
                onMouseEnter={() => {
                  setHoveredId(project.id);
                  onActiveIndexChange(project.index);
                  setCurrentIndex(idx);
                }}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => {
                  if (project.isLabExperiment) {
                    onOpenLab();
                  } else {
                    onSelectProject(project);
                  }
                }}
              >
                {/* Visual Stage Container */}
                <div style={styles.visualContainer}>
                  <ProjectVisual type={project.visualType} isHovered={isHovered} />

                  {/* Top-Right Badge on Card */}
                  <div style={styles.cardVisualBadge}>
                    {project.isLabExperiment ? (
                      <span style={styles.labPill}>
                        <Radio size={10} color="#4ADE80" />
                        <span>LIVE DSP LAB</span>
                      </span>
                    ) : (
                      <span style={styles.categoryPill}>{project.category}</span>
                    )}
                  </div>

                  {/* Interactive Hover Pill Center */}
                  {isHovered && (
                    <div style={styles.hoverActionPill}>
                      <span>{project.isLabExperiment ? 'LAUNCH LAB [→]' : 'VIEW CASE STUDY [→]'}</span>
                    </div>
                  )}
                </div>

                {/* Card Caption Bar */}
                <div style={styles.captionBar}>
                  <div style={styles.captionLeft}>
                    <span className="meta-label">[{project.index}]</span>
                    <h3 style={styles.cardTitle}>{project.title}</h3>
                  </div>
                  <div style={styles.captionRight}>
                    <span style={styles.cardYear}>{project.year}</span>
                    <ArrowUpRight
                      size={16}
                      color={isHovered ? '#FFFFFF' : 'var(--color-text-secondary)'}
                    />
                  </div>
                </div>

                {/* Card Metadata Footer */}
                <div style={styles.cardMetaFooter}>
                  <p style={styles.cardHeadline}>{project.headline}</p>
                  <div style={styles.metricsList}>
                    {project.metrics.map((m, mIdx) => (
                      <div key={mIdx} style={styles.metricItem}>
                        <span style={styles.metricLabel}>{m.label}:</span>
                        <span style={styles.metricVal}>{m.value}</span>
                      </div>
                    ))}
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
  sectionRoot: {
    width: '100%',
    backgroundColor: 'var(--color-bg-primary)',
    borderTop: '1px solid var(--color-grid-line)',
    borderBottom: '1px solid var(--color-grid-line)',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '28px 36px',
    borderBottom: '1px solid var(--color-grid-line)',
    backgroundColor: 'var(--color-bg-secondary)',
  },
  headerTitleZone: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  headerHeading: {
    fontSize: '20px',
    fontWeight: 600,
    letterSpacing: '-0.02em',
    color: 'var(--color-text-primary)',
  },
  headerControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  counterText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    letterSpacing: '0.06em',
  },
  navButtons: {
    display: 'flex',
    border: '1px solid var(--color-grid-line)',
  },
  arrowBtn: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-bg-primary)',
    color: 'var(--color-text-primary)',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    border: 'none',
    borderRight: '1px solid var(--color-grid-line)',
  },
  stageViewport: {
    width: '100%',
    overflowX: 'auto',
    padding: '36px',
    scrollbarWidth: 'thin',
  },
  cardsRow: {
    display: 'grid',
    gridAutoFlow: 'column',
    gridAutoColumns: 'minmax(380px, 440px)',
    gap: '28px',
  },
  projectCard: {
    border: '1px solid var(--color-grid-line)',
    backgroundColor: 'var(--color-bg-secondary)',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    transition: 'all 0.4s var(--ease-out-expo)',
  },
  visualContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: '16 / 10',
    backgroundColor: '#121212',
    overflow: 'hidden',
  },
  cardVisualBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    zIndex: 10,
  },
  categoryPill: {
    fontFamily: 'var(--font-mono)',
    fontSize: '9px',
    letterSpacing: '0.08em',
    padding: '3px 8px',
    backgroundColor: 'rgba(20, 20, 20, 0.85)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'var(--color-text-secondary)',
    backdropFilter: 'blur(8px)',
  },
  labPill: {
    fontFamily: 'var(--font-mono)',
    fontSize: '9px',
    letterSpacing: '0.08em',
    padding: '3px 8px',
    backgroundColor: 'rgba(20, 20, 20, 0.9)',
    border: '1px solid rgba(74, 222, 128, 0.4)',
    color: '#4ADE80',
    backdropFilter: 'blur(8px)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
  },
  hoverActionPill: {
    position: 'absolute',
    bottom: '16px',
    left: '16px',
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    letterSpacing: '0.08em',
    padding: '5px 12px',
    backgroundColor: '#FFFFFF',
    color: '#1A1A1A',
    fontWeight: 600,
    borderRadius: '2px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
  },
  captionBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderTop: '1px solid var(--color-grid-line)',
    borderBottom: '1px solid var(--color-grid-line)',
    backgroundColor: 'var(--color-bg-primary)',
  },
  captionLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  cardTitle: {
    fontSize: '17px',
    fontWeight: 600,
    letterSpacing: '-0.02em',
    color: 'var(--color-text-primary)',
  },
  captionRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  cardYear: {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
  },
  cardMetaFooter: {
    padding: '18px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    backgroundColor: 'var(--color-bg-primary)',
  },
  cardHeadline: {
    fontSize: '13px',
    lineHeight: 1.5,
    color: 'var(--color-text-secondary)',
    margin: 0,
  },
  metricsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    borderTop: '1px solid var(--color-grid-subtle)',
    paddingTop: '10px',
  },
  metricItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
  },
  metricLabel: {
    color: 'var(--color-text-muted)',
  },
  metricVal: {
    color: 'var(--color-text-primary)',
  },
};
