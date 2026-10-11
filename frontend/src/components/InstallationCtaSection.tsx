import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Smartphone,
  Compass,
  CheckCircle2,
  Share,
  Moon,
  Clock,
  Cpu,
  ShieldCheck,
  Pin,
  Activity,
  Sparkles,
  ArrowUpRight,
  Radio,
} from 'lucide-react';
import { ScrollRevealText } from './motion/ScrollRevealText';
import { FadeInWhenVisible } from './motion/FadeInWhenVisible';

interface InstallationCtaSectionProps {
  onTriggerInstall: () => void;
  canInstall: boolean;
}

type FilterCategory = 'all' | 'install' | 'amoled' | 'offline' | 'journal';

export const InstallationCtaSection: React.FC<InstallationCtaSectionProps> = ({
  onTriggerInstall,
  canInstall,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [activeGuidePlatform, setActiveGuidePlatform] = useState<'ios' | 'android'>('ios');
  const [savedPins, setSavedPins] = useState<Record<string, boolean>>({});

  const toggleSavePin = (pinId: string) => {
    setSavedPins((prev) => ({
      ...prev,
      [pinId]: !prev[pinId],
    }));
  };

  const filterTabs: { id: FilterCategory; label: string; count: number }[] = [
    { id: 'all', label: 'ALL PINS', count: 7 },
    { id: 'install', label: 'INSTALLATION', count: 3 },
    { id: 'amoled', label: 'AMOLED & SCREEN', count: 2 },
    { id: 'offline', label: 'OFFLINE DSP', count: 2 },
    { id: 'journal', label: 'FIELD JOURNAL', count: 2 },
  ];

  const shouldShow = (category: FilterCategory) => {
    if (activeFilter === 'all') return true;
    return activeFilter === category;
  };

  return (
    <section id="install" style={styles.section}>
      <div className="section-container" style={styles.container}>
        {/* Section Header */}
        <div style={styles.headerArea}>
          <FadeInWhenVisible delay={0.1}>
            <div className="tech-eyebrow" style={{ marginBottom: '16px' }}>
              <Compass size={12} />
              <span>PINBOARD ARCHIVE // FIELD SPECIMENS & PWA INSTALL</span>
            </div>
          </FadeInWhenVisible>

          <div style={styles.headlineWrap}>
            <ScrollRevealText
              text='"Go outside. The world is already playing."'
              tag="h2"
              style={styles.headline}
              delay={0.15}
              stagger={0.035}
            />
          </div>

          <FadeInWhenVisible delay={0.25} yOffset={16}>
            <p style={styles.subhead}>
              A curated Pinterest-style board of offline capabilities, AMOLED blackout mechanics, 
              strict screen-time budgets, and direct Progressive Web App deployment.
            </p>
          </FadeInWhenVisible>

          {/* Filter Bar */}
          <FadeInWhenVisible delay={0.35} yOffset={16}>
            <div style={styles.filterBar}>
              {filterTabs.map((tab) => {
                const isActive = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    style={{
                      ...styles.filterBtn,
                      backgroundColor: isActive ? 'var(--color-golden-amber)' : 'rgba(30, 29, 26, 0.7)',
                      color: isActive ? 'var(--color-dark-canvas)' : 'var(--color-text-secondary)',
                      borderColor: isActive ? 'var(--color-golden-amber)' : 'var(--color-border-subtle)',
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    <span>{tab.label}</span>
                    <span
                      style={{
                        ...styles.filterBadge,
                        backgroundColor: isActive ? 'rgba(23, 22, 20, 0.2)' : 'rgba(174, 172, 120, 0.15)',
                        color: isActive ? 'var(--color-dark-canvas)' : 'var(--color-muted-olive)',
                      }}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </FadeInWhenVisible>
        </div>

        {/* Pinterest Masonry Board */}
        <div className="pinterest-board" style={{ marginTop: '48px' }}>
          <AnimatePresence mode="popLayout">
            {/* PIN 01: Direct PWA Install Pin (Amber Accent Hero Pin) */}
            {shouldShow('install') && (
              <motion.div
                key="pin-01"
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="pinterest-pin"
                style={{ borderColor: 'rgba(242, 196, 106, 0.3)' }}
              >
                {/* Pin Header */}
                <div style={styles.pinHeader}>
                  <div style={styles.pinTagGroup}>
                    <Pin size={13} color="var(--color-golden-amber)" />
                    <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-golden-amber)' }}>
                      PIN // 01
                    </span>
                    <span style={styles.categoryPill}>PWA · STANDALONE</span>
                  </div>
                  <button
                    onClick={() => toggleSavePin('pin-01')}
                    style={styles.savePinBtn}
                    title="Save Pin"
                  >
                    <span style={{ fontSize: '11px', color: savedPins['pin-01'] ? 'var(--color-golden-amber)' : 'var(--color-text-muted)' }}>
                      {savedPins['pin-01'] ? '★ PINNED' : '+ PIN'}
                    </span>
                  </button>
                </div>

                {/* Pin Visual Media: Simulated App Icon & Pulse */}
                <div style={styles.pinMediaBox}>
                  <div style={styles.appIconContainer}>
                    <div style={styles.appIconPulse} />
                    <div style={styles.appIcon}>
                      <span className="font-display" style={{ fontSize: '24px', fontWeight: 700, color: '#FCF0DA' }}>
                        AF
                      </span>
                    </div>
                  </div>
                  <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={styles.onlineDot} />
                    <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-golden-amber)' }}>
                      STANDALONE PWA READY · BUILD 2026.10
                    </span>
                  </div>
                </div>

                {/* Pin Body Content */}
                <div style={styles.pinContent}>
                  <h3 style={styles.pinTitle}>Instant Home Screen Access</h3>
                  <p style={styles.pinBody}>
                    Carry the bioacoustic grounding companion directly on your phone without app store
                    gatekeepers, bloated updates, or ad trackers. Launches instantly in full-screen.
                  </p>

                  <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {canInstall ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onTriggerInstall}
                        className="btn-amber-primary"
                        style={{ width: '100%', fontSize: '13px' }}
                      >
                        <Download size={16} />
                        <span>INSTALL AURAFLORA APP</span>
                      </motion.button>
                    ) : (
                      <button
                        onClick={() => setActiveGuidePlatform(activeGuidePlatform === 'ios' ? 'android' : 'ios')}
                        className="btn-amber-primary"
                        style={{ width: '100%', fontSize: '13px' }}
                      >
                        <Smartphone size={16} />
                        <span>HOW TO INSTALL ON MOBILE</span>
                      </button>
                    )}
                  </div>

                  <div style={styles.pinFooterPills}>
                    <span className="meta-label">✓ ZERO STORE TAX</span>
                    <span className="meta-label">✓ 1.4 MB PAYLOAD</span>
                    <span className="meta-label">✓ OFFLINE READY</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PIN 02: AMOLED 0% Emission Blackout Pin */}
            {(shouldShow('amoled') || shouldShow('install')) && (
              <motion.div
                key="pin-02"
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="pinterest-pin pinterest-pin-amoled"
              >
                <div style={styles.pinHeader}>
                  <div style={styles.pinTagGroup}>
                    <Moon size={13} color="var(--color-muted-olive)" />
                    <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-muted-olive)' }}>
                      PIN // 02
                    </span>
                    <span style={styles.categoryPill}>AMOLED PURITY</span>
                  </div>
                  <button
                    onClick={() => toggleSavePin('pin-02')}
                    style={styles.savePinBtn}
                    title="Save Pin"
                  >
                    <span style={{ fontSize: '11px', color: savedPins['pin-02'] ? 'var(--color-golden-amber)' : 'var(--color-text-muted)' }}>
                      {savedPins['pin-02'] ? '★ PINNED' : '+ PIN'}
                    </span>
                  </button>
                </div>

                {/* Pure AMOLED Demonstration Graphic */}
                <div style={styles.amoledMockup}>
                  <div style={styles.amoledPhone}>
                    <div style={styles.amoledBezel}>
                      <div style={styles.amoledDotGlow} />
                      <span className="font-mono" style={{ fontSize: '10px', color: '#AEAC78' }}>
                        0.000 NITS · AMOLED SLEEP
                      </span>
                    </div>
                  </div>
                </div>

                <div style={styles.pinContent}>
                  <h3 style={{ ...styles.pinTitle, color: 'var(--color-soft-offwhite)' }}>
                    Zero Photons Emitted
                  </h3>
                  <p style={styles.pinBody}>
                    Once the grounding bioacoustic cue is computed, the screen enters absolute blackout.
                    Every individual OLED pixel powers down, directing your visual attention back to sunlight,
                    canopy shadows, and the physical earth.
                  </p>

                  <div style={styles.pinSpecsGrid}>
                    <div style={styles.specBox}>
                      <span className="font-mono" style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
                        DISPLAY FLUX
                      </span>
                      <span className="font-mono" style={{ fontSize: '14px', color: 'var(--color-golden-amber)', fontWeight: 600 }}>
                        0.00 LUX
                      </span>
                    </div>
                    <div style={styles.specBox}>
                      <span className="font-mono" style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
                        SUBPIXEL STATE
                      </span>
                      <span className="font-mono" style={{ fontSize: '14px', color: 'var(--color-muted-olive)', fontWeight: 600 }}>
                        OFF (100%)
                      </span>
                    </div>
                  </div>

                  <div style={styles.pinFooterPills}>
                    <span className="meta-label">#AMOLED_BLACKOUT</span>
                    <span className="meta-label">#EYES_ON_CANOPY</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PIN 03: Field Installation Guide Pin (Interactive Switcher) */}
            {shouldShow('install') && (
              <motion.div
                key="pin-03"
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="pinterest-pin"
              >
                <div style={styles.pinHeader}>
                  <div style={styles.pinTagGroup}>
                    <Smartphone size={13} color="var(--color-muted-olive)" />
                    <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-muted-olive)' }}>
                      PIN // 03
                    </span>
                    <span style={styles.categoryPill}>FIELD SETUP</span>
                  </div>
                  <button
                    onClick={() => toggleSavePin('pin-03')}
                    style={styles.savePinBtn}
                    title="Save Pin"
                  >
                    <span style={{ fontSize: '11px', color: savedPins['pin-03'] ? 'var(--color-golden-amber)' : 'var(--color-text-muted)' }}>
                      {savedPins['pin-03'] ? '★ PINNED' : '+ PIN'}
                    </span>
                  </button>
                </div>

                <div style={styles.pinContent}>
                  <h3 style={styles.pinTitle}>Field Installation Guide</h3>
                  <p style={{ ...styles.pinBody, marginBottom: '16px' }}>
                    Select your mobile operating system to view exact step-by-step installation instructions:
                  </p>

                  {/* Device Switcher Tabs */}
                  <div style={styles.platformSwitcher}>
                    <button
                      onClick={() => setActiveGuidePlatform('ios')}
                      style={{
                        ...styles.platformBtn,
                        backgroundColor: activeGuidePlatform === 'ios' ? 'var(--color-golden-amber)' : 'rgba(23, 22, 20, 0.6)',
                        color: activeGuidePlatform === 'ios' ? 'var(--color-dark-canvas)' : 'var(--color-text-secondary)',
                        fontWeight: activeGuidePlatform === 'ios' ? 700 : 400,
                      }}
                    >
                      <Share size={13} />
                      <span>iOS (Safari)</span>
                    </button>
                    <button
                      onClick={() => setActiveGuidePlatform('android')}
                      style={{
                        ...styles.platformBtn,
                        backgroundColor: activeGuidePlatform === 'android' ? 'var(--color-golden-amber)' : 'rgba(23, 22, 20, 0.6)',
                        color: activeGuidePlatform === 'android' ? 'var(--color-dark-canvas)' : 'var(--color-text-secondary)',
                        fontWeight: activeGuidePlatform === 'android' ? 700 : 400,
                      }}
                    >
                      <CheckCircle2 size={13} />
                      <span>Android (Chrome)</span>
                    </button>
                  </div>

                  {/* Step Sequence */}
                  <div style={styles.stepSequence}>
                    {activeGuidePlatform === 'ios' ? (
                      <>
                        <div style={styles.stepCard}>
                          <span style={styles.stepNum}>01</span>
                          <div>
                            <strong style={{ color: 'var(--color-soft-offwhite)', fontSize: '13px' }}>Tap Share Button</strong>
                            <p style={styles.stepDesc}>Open Safari and tap the Share icon at the bottom toolbar.</p>
                          </div>
                        </div>
                        <div style={styles.stepCard}>
                          <span style={styles.stepNum}>02</span>
                          <div>
                            <strong style={{ color: 'var(--color-soft-offwhite)', fontSize: '13px' }}>Add to Home Screen</strong>
                            <p style={styles.stepDesc}>Scroll through the share sheet and tap &ldquo;Add to Home Screen&rdquo;.</p>
                          </div>
                        </div>
                        <div style={styles.stepCard}>
                          <span style={styles.stepNum}>03</span>
                          <div>
                            <strong style={{ color: 'var(--color-soft-offwhite)', fontSize: '13px' }}>Launch Offline</strong>
                            <p style={styles.stepDesc}>Tap the newly created AuraFlora icon. Works 100% without signal.</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={styles.stepCard}>
                          <span style={styles.stepNum}>01</span>
                          <div>
                            <strong style={{ color: 'var(--color-soft-offwhite)', fontSize: '13px' }}>Open Chrome Menu</strong>
                            <p style={styles.stepDesc}>Tap the three dots (⋮) in the top right corner of Chrome.</p>
                          </div>
                        </div>
                        <div style={styles.stepCard}>
                          <span style={styles.stepNum}>02</span>
                          <div>
                            <strong style={{ color: 'var(--color-soft-offwhite)', fontSize: '13px' }}>Select Install App</strong>
                            <p style={styles.stepDesc}>Tap &ldquo;Install app&rdquo; or click the browser install banner.</p>
                          </div>
                        </div>
                        <div style={styles.stepCard}>
                          <span style={styles.stepNum}>03</span>
                          <div>
                            <strong style={{ color: 'var(--color-soft-offwhite)', fontSize: '13px' }}>Standalone Window</strong>
                            <p style={styles.stepDesc}>AuraFlora installs as a standalone borderless mobile PWA.</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div style={styles.pinFooterPills}>
                    <span className="meta-label">#SERVICE_WORKER_CACHED</span>
                    <span className="meta-label">#MANIFEST_V2</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PIN 04: The 15-Second Screen Budget Pin */}
            {(shouldShow('amoled') || shouldShow('journal')) && (
              <motion.div
                key="pin-04"
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="pinterest-pin"
              >
                <div style={styles.pinHeader}>
                  <div style={styles.pinTagGroup}>
                    <Clock size={13} color="var(--color-golden-amber)" />
                    <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-golden-amber)' }}>
                      PIN // 04
                    </span>
                    <span style={styles.categoryPill}>SCREEN BUDGET</span>
                  </div>
                  <button
                    onClick={() => toggleSavePin('pin-04')}
                    style={styles.savePinBtn}
                    title="Save Pin"
                  >
                    <span style={{ fontSize: '11px', color: savedPins['pin-04'] ? 'var(--color-golden-amber)' : 'var(--color-text-muted)' }}>
                      {savedPins['pin-04'] ? '★ PINNED' : '+ PIN'}
                    </span>
                  </button>
                </div>

                {/* Dial Graphic */}
                <div style={styles.dialBox}>
                  <div style={styles.dialCircle}>
                    <div style={styles.dialInner}>
                      <span className="font-display" style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-golden-amber)', lineHeight: 1 }}>
                        ≤ 15s
                      </span>
                      <span className="font-mono" style={{ fontSize: '9px', color: 'var(--color-muted-olive)', letterSpacing: '0.08em', marginTop: '4px' }}>
                        SESSION BUDGET
                      </span>
                    </div>
                  </div>
                </div>

                <div style={styles.pinContent}>
                  <h3 style={styles.pinTitle}>The 15-Second Budget</h3>
                  <p style={styles.pinBody}>
                    Modern applications optimize for 4.5 hours of continuous daily retention. AuraFlora
                    enforces a mathematical ceiling: one tactile gesture, one grounding cue, then total blackout.
                  </p>

                  {/* Contrast Bar */}
                  <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={styles.contrastRow}>
                      <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        Avg Phone Use:
                      </span>
                      <span className="font-mono" style={{ fontSize: '11px', color: '#9E9A8E' }}>
                        270 min / day
                      </span>
                    </div>
                    <div style={styles.contrastBarBg}>
                      <div style={{ ...styles.contrastBarFill, width: '90%', backgroundColor: 'rgba(174, 172, 120, 0.3)' }} />
                    </div>

                    <div style={styles.contrastRow}>
                      <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-golden-amber)' }}>
                        AuraFlora Target:
                      </span>
                      <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-golden-amber)', fontWeight: 600 }}>
                        ≤ 0.25 min / day
                      </span>
                    </div>
                    <div style={styles.contrastBarBg}>
                      <div style={{ ...styles.contrastBarFill, width: '4%', backgroundColor: 'var(--color-golden-amber)' }} />
                    </div>
                  </div>

                  <div style={styles.pinFooterPills}>
                    <span className="meta-label">#TOUCH_GRASS_2026</span>
                    <span className="meta-label">#ANTI_ALGORITHM</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PIN 05: Offline Rust DSP Audio Engine Pin */}
            {shouldShow('offline') && (
              <motion.div
                key="pin-05"
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="pinterest-pin"
              >
                <div style={styles.pinHeader}>
                  <div style={styles.pinTagGroup}>
                    <Cpu size={13} color="var(--color-muted-olive)" />
                    <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-muted-olive)' }}>
                      PIN // 05
                    </span>
                    <span style={styles.categoryPill}>EDGE COMPUTE</span>
                  </div>
                  <button
                    onClick={() => toggleSavePin('pin-05')}
                    style={styles.savePinBtn}
                    title="Save Pin"
                  >
                    <span style={{ fontSize: '11px', color: savedPins['pin-05'] ? 'var(--color-golden-amber)' : 'var(--color-text-muted)' }}>
                      {savedPins['pin-05'] ? '★ PINNED' : '+ PIN'}
                    </span>
                  </button>
                </div>

                {/* Animated Spectrum Analyzer Graphic */}
                <div style={styles.dspSpectrogramBox}>
                  <div style={styles.spectrogramBars}>
                    {[45, 65, 30, 85, 95, 60, 40, 75, 50, 90, 70, 35, 55, 80].map((h, i) => (
                      <div
                        key={i}
                        style={{
                          ...styles.spectrumBar,
                          height: `${h}%`,
                          backgroundColor: i % 2 === 0 ? 'var(--color-golden-amber)' : 'var(--color-muted-olive)',
                        }}
                      />
                    ))}
                  </div>
                  <div style={styles.spectrogramLabel}>
                    <span className="font-mono" style={{ fontSize: '10px', color: 'var(--color-golden-amber)' }}>
                      16kHz WAV · 512-pt FFT
                    </span>
                    <span className="font-mono" style={{ fontSize: '10px', color: 'var(--color-muted-olive)' }}>
                      BIOPHONY RATIO 0.88
                    </span>
                  </div>
                </div>

                <div style={styles.pinContent}>
                  <h3 style={styles.pinTitle}>Wilderness Offline DSP</h3>
                  <p style={styles.pinBody}>
                    Cellular reception drops to zero in old-growth pine forests and river canyons. AuraFlora
                    extracts spectral centroids, RMS acoustic energy, and biophony ratios entirely on-device
                    using local WebAssembly and cached heuristics.
                  </p>

                  <div style={styles.statusIndicator}>
                    <Activity size={14} color="var(--color-golden-amber)" />
                    <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-golden-amber)' }}>
                      LOCAL DSP CACHED · 0KB NETWORK REQD
                    </span>
                  </div>

                  <div style={styles.pinFooterPills}>
                    <span className="meta-label">#WASM_DSP</span>
                    <span className="meta-label">#RUST_AXUM_ENGINE</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PIN 06: Botanical Field Journal Swatch Pin (Warm Cream Surface) */}
            {shouldShow('journal') && (
              <motion.div
                key="pin-06"
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="pinterest-pin pinterest-pin-cream"
              >
                <div style={{ ...styles.pinHeader, borderBottomColor: 'rgba(76, 69, 65, 0.15)' }}>
                  <div style={styles.pinTagGroup}>
                    <Sparkles size={13} color="var(--color-earthy-charcoal)" />
                    <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-earthy-charcoal)', fontWeight: 600 }}>
                      PIN // 06
                    </span>
                    <span style={{ ...styles.categoryPill, backgroundColor: 'rgba(76, 69, 65, 0.1)', color: 'var(--color-earthy-charcoal)' }}>
                      FIELD SPECIMEN
                    </span>
                  </div>
                  <button
                    onClick={() => toggleSavePin('pin-06')}
                    style={styles.savePinBtn}
                    title="Save Pin"
                  >
                    <span style={{ fontSize: '11px', color: savedPins['pin-06'] ? 'var(--color-deep-charcoal)' : '#726A64', fontWeight: 600 }}>
                      {savedPins['pin-06'] ? '★ PINNED' : '+ PIN'}
                    </span>
                  </button>
                </div>

                {/* Tactile Stamp */}
                <div style={styles.creamStampArea}>
                  <div style={styles.stampBadge}>
                    <span className="font-mono" style={{ fontSize: '10px', color: 'var(--color-earthy-charcoal)', letterSpacing: '0.1em' }}>
                      EXPEDITION JOURNAL · STATION 04
                    </span>
                  </div>
                  <div style={{ marginTop: '12px' }}>
                    <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-deep-charcoal)', fontWeight: 600 }}>
                      37°46&prime;28&Prime;N 122°25&prime;10&Prime;W · CANOPY LEVEL
                    </span>
                  </div>
                </div>

                <div style={styles.pinContent}>
                  <h3 style={{ ...styles.pinTitle, color: 'var(--color-deep-charcoal)' }}>
                    Tactile Bio-Grounding
                  </h3>
                  <p style={{ ...styles.pinBody, color: 'var(--color-earthy-charcoal)', fontStyle: 'italic' }}>
                    &ldquo;Press your bare palms against the cool morning bark of the old oak. Feel the moisture
                    in the lichen and notice the wind direction across your neck.&rdquo;
                  </p>

                  <div style={{ marginTop: '20px' }}>
                    <a
                      href="#protocol"
                      style={{
                        ...styles.creamActionBtn,
                        textDecoration: 'none',
                      }}
                    >
                      <span>EXPLORE 5-STEP PROTOCOL</span>
                      <ArrowUpRight size={15} />
                    </a>
                  </div>

                  <div style={{ ...styles.pinFooterPills, borderTopColor: 'rgba(76, 69, 65, 0.15)' }}>
                    <span className="meta-label-cream">#SOMATIC_PROMPT</span>
                    <span className="meta-label-cream">#NATURE_RECONNECT</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PIN 07: Open Web Manifesto Pin */}
            {(shouldShow('install') || shouldShow('offline')) && (
              <motion.div
                key="pin-07"
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="pinterest-pin"
              >
                <div style={styles.pinHeader}>
                  <div style={styles.pinTagGroup}>
                    <ShieldCheck size={13} color="var(--color-golden-amber)" />
                    <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-golden-amber)' }}>
                      PIN // 07
                    </span>
                    <span style={styles.categoryPill}>OPEN STANDARD</span>
                  </div>
                  <button
                    onClick={() => toggleSavePin('pin-07')}
                    style={styles.savePinBtn}
                    title="Save Pin"
                  >
                    <span style={{ fontSize: '11px', color: savedPins['pin-07'] ? 'var(--color-golden-amber)' : 'var(--color-text-muted)' }}>
                      {savedPins['pin-07'] ? '★ PINNED' : '+ PIN'}
                    </span>
                  </button>
                </div>

                <div style={styles.pinContent}>
                  <h3 style={styles.pinTitle}>No Walled Gardens</h3>
                  <p style={styles.pinBody}>
                    AuraFlora rejects the closed surveillance model of traditional application stores.
                    Zero algorithm tracking, zero advertising SDKs, and zero forced account log-ins.
                  </p>

                  {/* Comparison Matrix */}
                  <div style={styles.matrixBox}>
                    <div style={styles.matrixRow}>
                      <span className="font-mono" style={{ fontSize: '11px', color: '#9E9A8E' }}>
                        Store Cut:
                      </span>
                      <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-golden-amber)', fontWeight: 600 }}>
                        0% (Free & Open Source)
                      </span>
                    </div>
                    <div style={styles.matrixRow}>
                      <span className="font-mono" style={{ fontSize: '11px', color: '#9E9A8E' }}>
                        Bundle Size:
                      </span>
                      <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-muted-olive)', fontWeight: 600 }}>
                        1.4 MB vs 180 MB Native
                      </span>
                    </div>
                    <div style={styles.matrixRow}>
                      <span className="font-mono" style={{ fontSize: '11px', color: '#9E9A8E' }}>
                        Licensing:
                      </span>
                      <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-soft-offwhite)', fontWeight: 600 }}>
                        MIT · Hacktoberfest 2026
                      </span>
                    </div>
                  </div>

                  <div style={styles.pinFooterPills}>
                    <span className="meta-label">#OPEN_SOURCE</span>
                    <span className="meta-label">#WEB_STANDARDS</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Banner Pin: Direct Action Anchor */}
        <FadeInWhenVisible delay={0.2} yOffset={24}>
          <div style={styles.bottomBanner}>
            <div style={styles.bottomBannerInner}>
              <div>
                <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-golden-amber)', letterSpacing: '0.1em' }}>
                  READY FOR FIELD DEPLOYMENT
                </span>
                <h4 style={styles.bottomBannerHeading}>
                  Mount AuraFlora directly to your pocket companion.
                </h4>
              </div>

              <div style={styles.bottomBannerActions}>
                {canInstall ? (
                  <button
                    onClick={onTriggerInstall}
                    className="btn-amber-primary"
                    style={{ fontSize: '13px', padding: '14px 28px' }}
                  >
                    <Download size={16} />
                    <span>INSTALL AURAFLORA APP</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveGuidePlatform(activeGuidePlatform === 'ios' ? 'android' : 'ios')}
                    className="btn-amber-primary"
                    style={{ fontSize: '13px', padding: '14px 28px' }}
                  >
                    <Smartphone size={16} />
                    <span>MOBILE INSTALL GUIDE</span>
                  </button>
                )}

                <a
                  href="#protocol"
                  className="btn-olive-secondary"
                  style={{ fontSize: '13px', padding: '14px 24px', textDecoration: 'none' }}
                >
                  <Radio size={14} />
                  <span>REVIEW PROTOCOL</span>
                </a>
              </div>
            </div>
          </div>
        </FadeInWhenVisible>
      </div>
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  section: {
    padding: '120px 0',
    backgroundColor: 'var(--color-dark-canvas)',
    position: 'relative',
  },
  container: {
    maxWidth: '1320px',
    margin: '0 auto',
    position: 'relative',
  },
  headerArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '20px',
  },
  headlineWrap: {
    maxWidth: '920px',
  },
  headline: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(2.25rem, 4.5vw, 4rem)',
    letterSpacing: '-0.04em',
    lineHeight: 1.05,
    color: 'var(--color-soft-offwhite)',
    fontWeight: 600,
    justifyContent: 'center',
  },
  subhead: {
    maxWidth: '680px',
    marginTop: '16px',
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(1rem, 1.25vw, 1.15rem)',
    lineHeight: 1.65,
    letterSpacing: 'var(--tracking-body)',
    color: 'var(--color-text-secondary)',
    fontWeight: 400,
  },
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '28px',
  },
  filterBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '24px',
    border: '1px solid',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    letterSpacing: '0.06em',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  filterBadge: {
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '12px',
    fontWeight: 700,
  },
  pinHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid var(--color-grid-line)',
  },
  pinTagGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  categoryPill: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    letterSpacing: '0.06em',
    color: 'var(--color-muted-olive)',
    backgroundColor: 'rgba(174, 172, 120, 0.12)',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  savePinBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--font-mono)',
    padding: '4px',
  },
  pinMediaBox: {
    padding: '28px 20px',
    backgroundColor: '#151412',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: '1px solid var(--color-grid-line)',
  },
  appIconContainer: {
    position: 'relative',
    width: '76px',
    height: '76px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appIconPulse: {
    position: 'absolute',
    inset: '-8px',
    borderRadius: '24px',
    backgroundColor: 'rgba(242, 196, 106, 0.15)',
    animation: 'pulseGlow 2.5s ease-in-out infinite',
  },
  appIcon: {
    width: '76px',
    height: '76px',
    borderRadius: '20px',
    backgroundColor: '#262420',
    border: '2px solid var(--color-golden-amber)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
    zIndex: 1,
  },
  onlineDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-golden-amber)',
    boxShadow: '0 0 8px var(--color-golden-amber)',
  },
  pinContent: {
    padding: '24px 20px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  pinTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.25rem',
    fontWeight: 600,
    letterSpacing: '-0.02em',
    color: 'var(--color-soft-offwhite)',
    marginBottom: '8px',
    lineHeight: 1.2,
  },
  pinBody: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.925rem',
    lineHeight: 1.6,
    color: 'var(--color-text-secondary)',
    fontWeight: 400,
  },
  pinFooterPills: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '1px solid var(--color-grid-line)',
  },
  amoledMockup: {
    padding: '32px 20px',
    backgroundColor: '#000000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  amoledPhone: {
    width: '160px',
    height: '90px',
    border: '1px solid rgba(174, 172, 120, 0.3)',
    borderRadius: '12px',
    backgroundColor: '#000000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amoledBezel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  amoledDotGlow: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#AEAC78',
    boxShadow: '0 0 10px #AEAC78',
    animation: 'pulseGlow 3s ease-in-out infinite',
  },
  pinSpecsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginTop: '16px',
  },
  specBox: {
    backgroundColor: 'rgba(23, 22, 20, 0.7)',
    border: '1px solid var(--color-grid-line)',
    padding: '10px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  platformSwitcher: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    marginBottom: '16px',
  },
  platformBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '9px 12px',
    borderRadius: '6px',
    border: '1px solid var(--color-border-subtle)',
    cursor: 'pointer',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    transition: 'all 0.2s ease',
  },
  stepSequence: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  stepCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    backgroundColor: 'rgba(23, 22, 20, 0.6)',
    border: '1px solid var(--color-grid-line)',
    padding: '10px 12px',
    borderRadius: '6px',
  },
  stepNum: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    fontWeight: 700,
    color: 'var(--color-golden-amber)',
    backgroundColor: 'rgba(242, 196, 106, 0.12)',
    padding: '2px 6px',
    borderRadius: '3px',
    marginTop: '2px',
  },
  stepDesc: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.45,
    marginTop: '2px',
  },
  dialBox: {
    padding: '28px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#151412',
    borderBottom: '1px solid var(--color-grid-line)',
  },
  dialCircle: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    border: '2px solid rgba(242, 196, 106, 0.4)',
    borderTopColor: 'var(--color-golden-amber)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 20px rgba(242, 196, 106, 0.1)',
  },
  dialInner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  contrastRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contrastBarBg: {
    height: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: '3px',
    overflow: 'hidden',
    marginBottom: '6px',
  },
  contrastBarFill: {
    height: '100%',
    borderRadius: '3px',
  },
  dspSpectrogramBox: {
    padding: '24px 20px',
    backgroundColor: '#141311',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    borderBottom: '1px solid var(--color-grid-line)',
  },
  spectrogramBars: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '56px',
    gap: '4px',
    padding: '4px 0',
  },
  spectrumBar: {
    flex: 1,
    borderRadius: '2px 2px 0 0',
    transition: 'height 0.3s ease',
  },
  spectrogramLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(242, 196, 106, 0.08)',
    border: '1px solid rgba(242, 196, 106, 0.25)',
    padding: '8px 12px',
    marginTop: '16px',
  },
  creamStampArea: {
    padding: '28px 20px',
    borderBottom: '1px solid rgba(76, 69, 65, 0.15)',
    backgroundColor: '#F5E5C9',
  },
  stampBadge: {
    display: 'inline-block',
    padding: '4px 8px',
    border: '1px dashed var(--color-earthy-charcoal)',
  },
  creamActionBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    padding: '12px 20px',
    backgroundColor: '#2A2624',
    color: '#FCF0DA',
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.06em',
    border: '1px solid #2A2624',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  matrixBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    backgroundColor: 'rgba(23, 22, 20, 0.7)',
    border: '1px solid var(--color-grid-line)',
    padding: '12px 14px',
    marginTop: '16px',
  },
  matrixRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomBanner: {
    marginTop: '56px',
    backgroundColor: '#1E1D1A',
    border: '1px solid var(--color-border-subtle)',
    padding: '36px 32px',
  },
  bottomBannerInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '24px',
  },
  bottomBannerHeading: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(1.25rem, 2vw, 1.75rem)',
    fontWeight: 600,
    color: 'var(--color-soft-offwhite)',
    marginTop: '4px',
    lineHeight: 1.25,
  },
  bottomBannerActions: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '14px',
  },
};
