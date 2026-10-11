import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroGrid } from './components/HeroGrid';
import { ProjectCanvas } from './components/ProjectCanvas';
import { Footer } from './components/Footer';
import { CaseStudyModal } from './components/CaseStudyModal';
import { ContactModal } from './components/ContactModal';
import { InteractiveLabModal } from './components/InteractiveLabModal';
import { ApiKeySection } from './components/ApiKeySection';
import type { ProjectItem } from './constants/projects';

export function App() {
  const [activeProjectIndex, setActiveProjectIndex] = useState<string>('01/05');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isLabOpen, setIsLabOpen] = useState<boolean>(false);

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Keyboard navigation shortcuts ([G] Work, [A] About, [L] Lab, [T] Top, [C] Contact)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const key = e.key.toLowerCase();
      if (key === 'g' || key === 'w') {
        scrollToSection('work');
      } else if (key === 'a') {
        scrollToSection('about');
      } else if (key === 'l') {
        setIsLabOpen((prev) => !prev);
      } else if (key === 'k') {
        scrollToSection('keys');
      } else if (key === 't') {
        scrollToSection('top');
      } else if (key === 'c') {
        setIsContactOpen(true);
      } else if (e.key === 'Escape') {
        setSelectedProject(null);
        setIsContactOpen(false);
        setIsLabOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div style={styles.appContainer} id="top">
      {/* Persistent SVG Noise Filter Overlay */}
      <div className="noise-overlay" />

      {/* Top Architectural Navigation Bar */}
      <Header
        onNavigate={scrollToSection}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenLab={() => setIsLabOpen(true)}
      />

      <main style={styles.mainContent}>
        {/* Hero Section Grid (2-Column Asymmetric) */}
        <HeroGrid
          activeProjectIndex={activeProjectIndex}
          onExploreWork={() => scrollToSection('work')}
          onLaunchLab={() => setIsLabOpen(true)}
          onContact={() => setIsContactOpen(true)}
        />

        {/* Project Canvas / Carousel Stage */}
        <ProjectCanvas
          onSelectProject={(project) => setSelectedProject(project)}
          onActiveIndexChange={(idx) => setActiveProjectIndex(idx)}
          onOpenLab={() => setIsLabOpen(true)}
        />

        {/* API Credentials & Inference Access Section */}
        <ApiKeySection />
      </main>

      {/* Systematic Architectural Footer */}
      <Footer
        onNavigate={scrollToSection}
        onOpenLab={() => setIsLabOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Modals & Drawers */}
      <CaseStudyModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenLab={() => setIsLabOpen(true)}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <InteractiveLabModal
        isOpen={isLabOpen}
        onClose={() => setIsLabOpen(false)}
      />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  appContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--color-bg-primary)',
    color: 'var(--color-text-primary)',
    position: 'relative',
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
};

export default App;
