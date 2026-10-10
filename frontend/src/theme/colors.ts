/**
 * AuraFlora AMOLED Color Tokens
 * Strict adherence to zero-screen-time AMOLED design specifications.
 */
export const Colors = {
  // Primary Backgrounds
  forestDeep: '#0A0F0D', // Primary AMOLED black/dark
  mossMuted: '#1F2E23',   // Card / surface background

  // Accents
  herbal: '#4E8752',      // Primary accent / record button CTA
  herbalLight: '#81C784', // Highlights & glows
  herbalDark: '#2E5E35',  // Pressed / active state

  // Typography & Icons
  sand: '#E8DFD8',        // Primary text
  sandMuted: '#9E9590',   // Subtitles & muted labels
  sandFaint: '#5A5652',   // Faint status labels

  // Special States
  blackout: '#000000',    // Pure AMOLED blackout
  errorMuted: '#8B4A4A',  // Subtle error outline/pill

  // Opacity Helpers
  hintWhite: 'rgba(255, 255, 255, 0.10)',      // 10% opacity blackout hint
  hintWhiteFaint: 'rgba(255, 255, 255, 0.08)', // 8% opacity sub-hint
  herbalGlow: 'rgba(78, 135, 82, 0.45)',       // Button breathing pulse glow
} as const;
