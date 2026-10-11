import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CinematicScrollSection } from './components/CinematicScrollSection';
import { ProtocolSection } from './components/ProtocolSection';
import { BioacousticLabSection } from './components/BioacousticLabSection';
import { ProductPreviewSection } from './components/ProductPreviewSection';
import { PhilosophySection } from './components/PhilosophySection';
import { ResearchArchitectureSection } from './components/ResearchArchitectureSection';
import { InstallationCtaSection } from './components/InstallationCtaSection';
import { ApiKeySection } from './components/ApiKeySection';
import { Footer } from './components/Footer';
import { InteractiveLabModal } from './components/InteractiveLabModal';
import { ContactModal } from './components/ContactModal';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import { OfflineStatusIndicator } from './components/OfflineStatusIndicator';

export function App() {
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isLabOpen, setIsLabOpen] = useState<boolean>(false);
  const [canInstall, setCanInstall] = useState<boolean>(false);

  const installPromptEventRef = useRef<any>(null);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      installPromptEventRef.current = e;
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const triggerInstallPrompt = async () => {
    if (installPromptEventRef.current) {
      await installPromptEventRef.current.prompt();
      const choice = await installPromptEventRef.current.userChoice;
      if (choice.outcome === 'accepted') {
        installPromptEventRef.current = null;
        setCanInstall(false);
      }
    } else {
      const el = document.getElementById('install');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'top' || sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Keyboard navigation shortcuts ([L] Lab, [P] Protocol, [T] Top, [K] Keys, [Esc] Close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const key = e.key.toLowerCase();
      if (key === 'l') {
        setIsLabOpen((prev) => !prev);
      } else if (key === 'p') {
        scrollToSection('protocol');
      } else if (key === 's') {
        scrollToSection('signal');
      } else if (key === 'r') {
        scrollToSection('research');
      } else if (key === 'k') {
        scrollToSection('keys');
      } else if (key === 't') {
        scrollToSection('hero');
      } else if (key === 'c') {
        setIsContactOpen(true);
      } else if (e.key === 'Escape') {
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

      {/* Connectivity & Offline Status Bar */}
      <OfflineStatusIndicator />

      {/* PWA Floating Install Banner */}
      <PwaInstallBanner onInstallStateChange={setCanInstall} />

      {/* Top Architectural Navigation Bar */}
      <Header
        onNavigate={scrollToSection}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenLab={() => setIsLabOpen(true)}
        onTriggerInstall={triggerInstallPrompt}
        canInstall={canInstall}
      />

      <main style={styles.mainContent}>
        {/* Section 01: Hero / The Listening Field */}
        <HeroSection
          onExploreProtocol={() => scrollToSection('protocol')}
          onLaunchLab={() => setIsLabOpen(true)}
          onTriggerInstall={triggerInstallPrompt}
          canInstall={canInstall}
        />

        {/* Section 02: The Signal / Cinematic Scroll Timeline */}
        <CinematicScrollSection />

        {/* Section 03: The Protocol / 15-Second How It Works */}
        <ProtocolSection onOpenSimulator={() => scrollToSection('preview')} />

        {/* Section 04: Bioacoustic Intelligence / The Lab */}
        <BioacousticLabSection onOpenFullLab={() => setIsLabOpen(true)} />

        {/* Section 05: The Grounding Experience / Mobile Simulator */}
        <ProductPreviewSection />

        {/* Section 06: Design Principle / Why Less Screen */}
        <PhilosophySection />

        {/* Section 07: Research / System Architecture */}
        <ResearchArchitectureSection />

        {/* Section 08: Installation / Final Call to Action */}
        <InstallationCtaSection
          onTriggerInstall={triggerInstallPrompt}
          canInstall={canInstall}
        />

        {/* Credentials & Inference Access Settings */}
        <ApiKeySection />
      </main>

      {/* Section 09: Technical Footer */}
      <Footer
        onNavigate={scrollToSection}
        onOpenLab={() => setIsLabOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Interactive Fullscreen Lab Modal */}
      <InteractiveLabModal
        isOpen={isLabOpen}
        onClose={() => setIsLabOpen(false)}
      />

      {/* Contact & Inquiries Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  appContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#080A09',
    color: '#F1F2EC',
    position: 'relative',
    maxWidth: '100vw',
    overflowX: 'hidden',
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
};

export default App;
