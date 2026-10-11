export interface ProjectItem {
  id: string;
  index: string;
  number: string;
  title: string;
  category: string;
  year: string;
  client: string;
  discipline: string;
  headline: string;
  description: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  visualType: 'aviation' | 'bioacoustic' | 'typography' | 'webgl' | 'archival';
  isLabExperiment?: boolean;
}

export const PROJECTS: ProjectItem[] = [
  {
    id: 'aerospacial',
    index: '01/05',
    number: '01',
    title: 'AeroSpacial Dynamics',
    category: 'AVIATION / COMPUTATION',
    year: "'26",
    client: 'Nordic Supersonic Research',
    discipline: 'Computational Aerodynamics & WebGL',
    headline: 'High-speed aerodynamic boundary layer visualization and kinetic wing deflection analysis.',
    description:
      'An architectural spatial visualizer rendering supersonic shockwave geometry and computational wind-tunnel turbulence models in real-time WebGL, calibrated for precision aeronautic instrumentation.',
    tags: ['Aviation', 'WebGL', 'Simulation', 'GLSL Shaders', 'Aerodynamics'],
    metrics: [
      { label: 'Reynolds Number', value: 'Re 2.4×10⁶' },
      { label: 'Render Latency', value: '4.2ms / 120fps' },
      { label: 'Surface Pressure', value: '98.4 kPa' },
    ],
    visualType: 'aviation',
  },
  {
    id: 'auraflora',
    index: '02/05',
    number: '02',
    title: 'AuraFlora BioAcoustics',
    category: 'BIOACOUSTIC / HARDWARE',
    year: "'26",
    client: 'Self-Initiated · Touch Grass Challenge',
    discipline: 'Real-Time DSP & Anti-Screen Sensory',
    headline: 'Real-time bioacoustic DSP analysis and tactile grounding companion in under 15 seconds.',
    description:
      'Anti-screen sensory architecture combining 16kHz fast Fourier transform spectral analysis, biophony ratio quantification, and Gemma AI outdoor prompt synthesis with pure AMOLED screen blackout.',
    tags: ['Rust Axum', 'Bioacoustics', 'DSP Engine', 'Gemma AI', 'ElevenLabs'],
    metrics: [
      { label: 'Sample Frequency', value: '16.0 kHz WAV' },
      { label: 'Spectral FFT', value: '4096-pt Centroid' },
      { label: 'Screen Blackout', value: '#000000 (15s)' },
    ],
    visualType: 'bioacoustic',
    isLabExperiment: true,
  },
  {
    id: 'chronos',
    index: '03/05',
    number: '03',
    title: 'Chronos Monochrome',
    category: 'EDITORIAL / HOROLOGY',
    year: "'25",
    client: 'Atelier Vaneux Geneva',
    discipline: 'Brutalist Typography & Interaction',
    headline: 'Brutalist mechanical timepiece interface and high-contrast digital chronometer.',
    description:
      'Monolithic horological timepiece built on a rigid 1px coordinate grid. Featuring microsecond precision escapement emulation, tactile ticking haptics, and custom Neo-Grotesque numeral engravings.',
    tags: ['Horology', 'Brutalism', 'Typography', 'Grid Matrix', 'Haptics'],
    metrics: [
      { label: 'Escapement Rate', value: '28,800 vph (4Hz)' },
      { label: 'Contrast Ratio', value: '14.2:1 (AAA)' },
      { label: 'Grid Precision', value: '1px Boundary' },
    ],
    visualType: 'typography',
  },
  {
    id: 'vapour',
    index: '04/05',
    number: '04',
    title: 'Vapour Matrix',
    category: 'WEBGL / SPATIAL',
    year: "'26",
    client: 'Koto Spatial Systems',
    discipline: 'Volumetric Particles & Sound Design',
    headline: 'Volumetric particle field generator coupled with procedural binaural acoustics.',
    description:
      'Interactive spatial particle simulation computing 250,000 vector nodes in compute shaders. Every particle collision modulates a procedural sine wave oscillator for tactile audio-visual resonance.',
    tags: ['Three.js', 'WebAudio API', 'Particle Field', 'Spatial Audio'],
    metrics: [
      { label: 'Active Particles', value: '250,000 Nodes' },
      { label: 'Oscillator Voices', value: '16 Polyphonic' },
      { label: 'Compute Engine', value: 'GLSL GPGPU' },
    ],
    visualType: 'webgl',
  },
  {
    id: 'kestrel',
    index: '05/05',
    number: '05',
    title: 'Kestrel Atelier',
    category: 'BRAND / ARCHIVAL',
    year: "'25",
    client: 'Kestrel Editions Zurich',
    discipline: 'Archival Publishing & Design System',
    headline: 'Monograph publishing system and tactile archival artifact index.',
    description:
      'Editorial design system for a limited-run architectural press in Zurich. Combines deep charcoal cloth bindings, embossed hot-stamp foil details, and a high-speed digital catalog with instant search.',
    tags: ['Identity', 'Editorial', 'Archival', 'Swiss Grid', 'Typography'],
    metrics: [
      { label: 'Limited Edition', value: '500 Hardbound' },
      { label: 'Paper Stock', value: '170gsm Fedrigoni' },
      { label: 'Type Specimen', value: 'Neue Montreal' },
    ],
    visualType: 'archival',
  },
];
