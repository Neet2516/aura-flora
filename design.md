# DESIGN SPECIFICATION: ARCHITECTURAL DARK-MODE EDITORIAL PLATFORM
**Document Version:** 1.0.0  
**Role:** Principal UI/UX Designer & Creative Technologist  
**Status:** Approved for Engineering Implementation  
**Target Environments:** Modern Desktop (1440px+), Tablet (768px - 1199px), Mobile (<768px)

---

## 1. Executive Summary & Design Philosophy

This design system establishes an **Editorial Dark-Mode Minimalist** aesthetic inspired by elite architectural ateliers and Swiss modernist grid doctrine. 

### Core Tenets
1. **Architectural Rigor**: Every element is bound to an uncompromising 1px structural grid matrix (`border-collapse` philosophy). No free-floating elements without explicit grid alignment.
2. **Quiet Luxury & Restraint**: Zero decorative clutter, synthetic drop shadows, or frivolous neon gradients. Value is conveyed through typographic contrast, micro-textures, and organic motion physics.
3. **Tactile Digital Materiality**: Pure dark backgrounds are augmented with micro-grain noise textures, mimicking matte archival stock and eliminating 8-bit banding on high-gamut displays.
4. **Cinematic Spatial Motion**: Fluid inertia physics (`cubic-bezier(0.16, 1, 0.3, 1)`) governed by unified spring dynamics, inertia scrolling, and interactive WebGL canvas stages.

---

## 2. Design System Tokens

### 2.1 Color Tokens

| Token Name | Hex / Value | CSS Variable | Semantic Usage |
| :--- | :--- | :--- | :--- |
| `bg-primary` | `#1A1A1A` | `--color-bg-primary` | Base viewport canvas background |
| `bg-secondary` | `#161616` | `--color-bg-secondary` | Recessed zones, card viewports, footer baseline |
| `bg-elevated` | `#1B1B1B` | `--color-bg-elevated` | Hover fills, interactive surface shifts |
| `grid-line` | `#282828` | `--color-grid-line` | Structural 1px cell borders, dividers |
| `grid-line-subtle` | `rgba(255, 255, 255, 0.06)` | `--color-grid-subtle` | Secondary internal card dividers |
| `grid-line-active` | `rgba(255, 255, 255, 0.22)` | `--color-grid-active` | Hover and active border highlights |
| `text-primary` | `#ECECE8` | `--color-text-primary` | Main titles, headlines, primary copy (eye-strain reducing cream) |
| `text-secondary` | `#8C8C8C` | `--color-text-secondary` | Section markers, metadata labels, dates, secondary text |
| `text-muted` | `#5A5A5A` | `--color-text-muted` | Inactive pagination, copyright, disabled triggers |
| `accent-white` | `#FFFFFF` | `--color-accent-white` | High-emphasis hover targets, key accent nodes |
| `accent-warm` | `#F5F3EC` | `--color-accent-warm` | Secondary micro-highlights |

### 2.2 Typography System

The typographic landscape uses a paired hierarchy: **Neo-Grotesque Sans-Serif** for humanistic authority and **Technical Monospace** for precision metadata.

#### Font Families
- **Primary Headings & Body:** `PP Neue Montreal`, `Inter`, `Helvetica Now`, or `Söhne`, `-apple-system`, `sans-serif`
- **Technical Monospace:** `JetBrains Mono`, `Space Mono`, `SF Mono`, `monospace`

#### Type Hierarchy Scale

| Role | Font Family | Size | Weight | Line Height | Tracking |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Headline** | Sans-Serif | `clamp(2.5rem, 5.2vw, 5.25rem)` | 600 (SemiBold) | `1.04` | `-0.035em` |
| **Display Title (H1)** | Sans-Serif | `clamp(2rem, 3.8vw, 3.5rem)` | 500 (Medium) | `1.10` | `-0.025em` |
| **Section Title (H2)** | Sans-Serif | `clamp(1.5rem, 2.4vw, 2.25rem)` | 500 (Medium) | `1.18` | `-0.02em` |
| **Project Title (H3)** | Sans-Serif | `1.25rem` (20px) | 500 (Medium) | `1.25` | `-0.015em` |
| **Body Large** | Sans-Serif | `1.125rem` (18px) | 400 (Regular) | `1.45` | `-0.01em` |
| **Body Standard** | Sans-Serif | `0.9375rem` (15px) | 400 (Regular) | `1.50` | `-0.01em` |
| **Meta / Label** | Monospace | `0.8125rem` (13px) | 400 (Regular) | `1.30` | `+0.06em` (Caps) |
| **Micro Caption** | Monospace | `0.6875rem` (11px) | 400 (Regular) | `1.20` | `+0.08em` (Caps) |

### 2.3 Grid & Spatial Tokens
- **Base Grid Unit:** `8px`
- **Grid Border Width:** `1px solid var(--color-grid-line)`
- **Container Max-Width:** `1800px` (or 100% full bleed with outer border margins)
- **Grid Cell Padding:**
  - Compact: `16px 20px`
  - Standard: `24px 32px`
  - Hero / Spacious: `48px 48px`

### 2.4 CSS Custom Properties Implementation (`:root`)

```css
:root {
  /* Color Tokens */
  --color-bg-primary: #1A1A1A;
  --color-bg-secondary: #161616;
  --color-bg-elevated: #1B1B1B;
  --color-grid-line: #282828;
  --color-grid-subtle: rgba(255, 255, 255, 0.06);
  --color-grid-active: rgba(255, 255, 255, 0.22);
  --color-text-primary: #ECECE8;
  --color-text-secondary: #8C8C8C;
  --color-text-muted: #5A5A5A;
  --color-accent-white: #FFFFFF;
  --color-accent-warm: #F5F3EC;

  /* Typography */
  --font-sans: 'PP Neue Montreal', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Space Mono', SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Timing & Easing Curves */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out-expo: cubic-bezier(0.87, 0, 0.13, 1);
  --duration-micro: 200ms;
  --duration-standard: 400ms;
  --duration-spatial: 700ms;

  /* Spatial */
  --border-grid: 1px solid var(--color-grid-line);
}
```

### 2.5 Tailwind CSS v3/v4 Theme Configuration

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#1A1A1A',
          secondary: '#161616',
          elevated: '#1B1B1B',
        },
        grid: {
          line: '#282828',
          subtle: 'rgba(255, 255, 255, 0.06)',
          active: 'rgba(255, 255, 255, 0.22)',
        },
        text: {
          primary: '#ECECE8',
          secondary: '#8C8C8C',
          muted: '#5A5A5A',
        },
        accent: {
          white: '#FFFFFF',
          warm: '#F5F3EC',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
      },
      borderWidth: {
        DEFAULT: '1px',
      },
    },
  },
};
```

### 2.6 Tactile Noise Overlay Implementation

To eliminate color banding and impart a tactile, archival quality, an invisible SVG noise texture is superimposed across the viewport using CSS:

```css
/* Persistent Noise Filter Layer */
.noise-overlay {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  content: "";
  opacity: 0.038;
  pointer-events: none;
  z-index: 9999;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  mix-blend-mode: overlay;
}
```

---

## 3. Component Architecture Breakdown

The entire platform is constructed as a monolithic 1px grid container. Rows and columns abut seamlessly without gaps, mimicking tabular architectural blueprints.

```
┌────────────────────────────────────────────────────────────────────────┐
│ TOP NAVIGATION BAR [Brand: j.mr] [Work] [About] [Lab] [CTA: Contact]  │
├───────────────────────────────────┬────────────────────────────────────┤
│ HERO: LEFT META COLUMN            │ HERO: RIGHT EDITORIAL STATEMENT    │
│  - Portrait / Avatar Stage        │  - Large clamp() typography        │
│  - Practice & Services Tags       │  - Tight tracking (-0.035em)       │
│  - Project Counter (01/05)        │  - Manifesto & Disciplines         │
├───────────────────────────────────┴────────────────────────────────────┤
│ PROJECT STAGE: Interactive Horizontal WebGL / Canvas Carousel          │
│  [Card 01: Aviation Study] [Card 02: Brand Collateral] [Card 03: ... ] │
├───────────────────────────────────┬────────────────────────────────────┤
│ TECHNICAL SPECIFICATIONS LEDGER   │ CAPABILITIES & DISCIPLINE MATRIX   │
├───────────────────────────────────┴────────────────────────────────────┤
│ FOOTER: Systematic Index, Timezone Status, Legal & Back-To-Top Trigger │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 3.1 Header / Top Navigation Bar
- **Positioning:** Sticky top (`top: 0`, `z-index: 50`), backdrop blur (`backdrop-filter: blur(12px)`), solid bottom 1px grid border.
- **Grid Layout:** 4-column or 3-zone flex container locked to page grid lines:
  1. **Zone 1 (Col 1-2):** Brand Identifier `j.mr` (bold sans-serif, lowercase, tracking `-0.02em`) with active dot indicator (`bg-accent-white`, pulse animation).
  2. **Zone 2 (Col 3-8):** Primary Navigation items (`Work`, `About`, `Lab`). Monospace or clean Sans uppercase (`12px`, tracking `0.08em`).
  3. **Zone 3 (Col 9-10):** Live Status indicator (e.g., `NYC 14:32 EST · AVAIL Q4/26`).
  4. **Zone 4 (Col 11-12):** Interactive Action Button (`Contact` / `Inquire`). Monospace label enclosed in a 1px border pill or rect button with background color inversion on hover (`#1A1A1A` ➔ `#ECECE8`, text `#ECECE8` ➔ `#1A1A1A`).

---

### 3.2 Hero Section Grid
The Hero is a rigorous 2-column split with an asymmetric visual cadence:

#### Left Column (Ratio: ~35% - 40% width)
- **Cell A1 — Identity Frame:** Square portrait/avatar card with monochrome grain treatment, hover parallax tilt.
- **Cell A2 — Metadata Block:** Monospace metadata table:
  - `LOCATION: NEW YORK, NY`
  - `DISCIPLINE: CREATIVE DIRECTION & SYSTEMS`
  - `AVAILABILITY: ACCEPTING COMMISSIONS`
- **Cell A3 — Active Index:** Large stylized project counter `01 / 05` with animated ticker roll when navigating projects.

#### Right Column (Ratio: ~60% - 65% width)
- **Cell B1 — Editorial Headline Block:**
  - Headline copy: Large bold statement tightly wrapped, zero line-gap wastage (`leading-[1.04]`).
  - Example copy: *"Designing spatial digital architectures for autonomous intelligence & tactile human experiences."*
- **Cell B2 — Sub-Editorial Copy & Abstract:**
  - 15px body copy set in neutral gray `#8C8C8C`, elaborating on creative philosophy.
- **Cell B3 — Quick Action Anchors:**
  - Monospace interactive links with underline slide-in animations.

---

### 3.3 Project Canvas / Carousel Stage
The centerpiece visual viewport presenting selected works.

- **Layout Structure:** Full-width container flanked by 1px top and bottom borders.
- **Interaction Model:**
  - Horizontal drag & swipe with momentum inertia physics.
  - Optional mousewheel-to-horizontal-scroll mapping with smooth delta interpolation.
- **Card Anatomy:**
  - **Media Frame:** Fixed aspect ratios (`16:10` or `4:5`) containing high-resolution photography, textured graphic renders, or WebGL shaders.
  - **Image Processing:** Subtle desaturation baseline (`saturate(0.9)`) shifting to full vibrance on hover (`saturate(1.05)`).
  - **Card Caption Bar:** Direct 1px bottom border bar displaying:
    - Left: Monospace index `[PROJECT_01]` and Title (18px Medium).
    - Right: Category tag `[AUTOMOTIVE / IDENTITY]` and Release Year `'26`.
- **Hover Micro-Interaction:**
  - Card scales smoothly to `scale(1.025)`.
  - Border highlights to `rgba(255, 255, 255, 0.22)`.
  - Custom cursor shifts to a minimal floating pill badge reading `VIEW [→]`.

---

### 3.4 Meta Grid / Technical Data Ledger
A structured 4-column data grid showcasing capabilities, client archives, and runtime metrics.

- **Column 1 — Practice Disciplines:**
  - List of competencies: `Digital Art Direction`, `Design Systems (Figma/Code)`, `Creative Computation`, `Audio-Visual Synthesis`.
- **Column 2 — Technology Stack:**
  - Monospace listing: `Rust`, `TypeScript`, `Next.js / Vite`, `WebGL / Three.js`, `Tailwind CSS`, `GLSL Shaders`.
- **Column 3 — Recognitions & Honors:**
  - Table of awards, publications, and exhibitions.
- **Column 4 — System Status & Environmental Metrics:**
  - Live local time, active server latency, audio synthesis engine state.

---

### 3.5 Systematic Footer
- **Architecture:** 1px top border with full-span multi-column breakdown:
  - **Left Section:** Brand manifesto summary & newsletter/RSS technical subscription.
  - **Center Section:** Quick jump links with keyboard shortcut hints (`[G] Global Work`, `[A] About`, `[T] Top`).
  - **Right Section:** Copyright notice `© 2026 J.MR STUDIO. ALL RIGHTS RESERVED.` and Back-to-Top trigger button with smooth scroll easing.

---

## 4. Responsive Breakpoint Guidelines

The rigid 1px grid adapts gracefully across viewports without breaking visual cohesion or causing double borders.

```
Desktop (≥ 1440px)       Tablet (768px – 1199px)        Mobile (< 768px)
┌───────────┬───────────┐  ┌───────────────────────────┐  ┌───────────────────────────┐
│ Left Col  │ Right Col │  │ Full-Width Hero Title     │  │ Brand Mark + Menu Drawer  │
│ (38%)     │ (62%)     │  ├─────────────┬─────────────┤  ├───────────────────────────┤
├───────────┴───────────┤  │ Left Meta   │ Right Meta  │  │ Hero Statement (Clamp)    │
│ Carousel (Horizontal) │  ├─────────────┴─────────────┤  ├───────────────────────────┤
├───────────┬───────────┤  │ Carousel (Touch Drag)     │  │ Portrait Frame (Full W)   │
│ Col 1│Col2│Col 3│Col 4│  ├─────────────┬─────────────┤  ├───────────────────────────┤
└───────────┴───────────┘  │ Meta Col 1  │ Meta Col 2  │  │ Vertical Project Stack    │
                           └─────────────┴─────────────┘  ├───────────────────────────┤
                                                          │ Meta Ledger (Single Col)  │
                                                          └───────────────────────────┘
```

### 4.1 Detailed Breakpoint Matrix

| Viewport Breakpoint | Column Count | Outer Margins | Behavior & Transformation Rules |
| :--- | :--- | :--- | :--- |
| **Wide Desktop (≥ 1440px)** | 12 Columns | 32px or 48px | Full spatial fidelity. Hero is 2-column asymmetric (5 col / 7 col). Multi-item canvas carousel with inertia dragging. |
| **Standard Desktop (1200px – 1439px)** | 12 Columns | 24px | Proportionally scaled typography clamps. Preserves 2-column hero and horizontal carousel. |
| **Tablet Landscape (992px – 1199px)** | 8 Columns | 24px | Hero headline moves to top full-width band; portrait and meta collapse beneath into dual columns. Carousel cards shrink to 380px width. |
| **Tablet Portrait (768px – 991px)** | 6 Columns | 16px | Navigation condenses into condensed pills; project cards support native touch swipes; 4-column meta ledger wraps into 2x2 grid. |
| **Mobile (< 768px)** | 4 Columns / 1 Col Stack | 12px | Grid collapses to a single vertical column. Border lines use `:not(:last-child)` bottom dividers to prevent duplicate 2px borders. Carousel converts to native momentum scroll or vertical media feed. |

### 4.2 CSS Border Collapsing Rule for Responsive Layouts

```css
/* Eliminates duplicate 2px border stacking on mobile */
.grid-container {
  display: grid;
  border-top: 1px solid var(--color-grid-line);
  border-left: 1px solid var(--color-grid-line);
}

.grid-cell {
  border-right: 1px solid var(--color-grid-line);
  border-bottom: 1px solid var(--color-grid-line);
  background-color: var(--color-bg-primary);
  transition: border-color var(--duration-standard) var(--ease-out-expo),
              background-color var(--duration-standard) var(--ease-out-expo);
}

.grid-cell:hover {
  border-color: var(--color-grid-active);
  background-color: var(--color-bg-elevated);
}
```

---

## 5. Animation, Motion & State Engine Rules

Motion is calibrated for high-precision tactile responsiveness. Every animation curve adheres strictly to an ultra-smooth exponential ease-out curve.

### 5.1 Primary Timing Physics

- **Default Ease Curve:** `cubic-bezier(0.16, 1, 0.3, 1)` (Out-Expo)
- **Spring Physics (Framer Motion):**
  - Smooth Elastic Drag: `{ stiffness: 260, damping: 28, mass: 0.8 }`
  - Snappy Micro Hover: `{ stiffness: 400, damping: 30 }`
- **Smooth Inertia Scroll (Lenis):**
  ```typescript
  const lenis = new Lenis({
    lerp: 0.085,
    duration: 1.2,
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.5,
  });
  ```

---

### 5.2 Framer Motion Variants

#### Component Entry Transitions
```typescript
export const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.15,
    },
  },
};

export const gridCellVariants = {
  hidden: { 
    opacity: 0, 
    y: 16,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};
```

#### Interactive Project Card (Hover & Drag)
```typescript
export const projectCardVariants = {
  initial: { 
    scale: 1, 
    filter: 'saturate(0.92)',
  },
  hover: { 
    scale: 1.025, 
    filter: 'saturate(1.05)',
    transition: { 
      duration: 0.4, 
      ease: [0.16, 1, 0.3, 1],
    },
  },
  tap: { 
    scale: 0.99,
  },
};
```

---

### 5.3 GSAP & WebGL Kinetic Interactions

#### Magnetic Anchor Hover (GSAP)
```typescript
import gsap from 'gsap';

export function attachMagneticEffect(element: HTMLElement) {
  const bounding = element.getBoundingClientRect();
  
  const handleMouseMove = (e: MouseEvent) => {
    const x = (e.clientX - bounding.left - bounding.width / 2) * 0.28;
    const y = (e.clientY - bounding.top - bounding.height / 2) * 0.28;
    
    gsap.to(element, {
      x,
      y,
      duration: 0.45,
      ease: 'power3.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.65,
      ease: 'elastic.out(1, 0.3)',
    });
  };

  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);
}
```

#### Underline Slide-In Micro Interaction
```css
.editorial-link {
  position: relative;
  display: inline-flex;
  color: var(--color-text-primary);
  text-decoration: none;
}

.editorial-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: var(--color-accent-white);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.4s var(--ease-out-expo);
}

.editorial-link:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}
```

---

## 6. Accessibility & Performance Governance

1. **Contrast Compliance:**
   - Text Primary (`#ECECE8`) against Background Primary (`#1A1A1A`) achieves a contrast ratio of **13.8:1** (AAA Compliant).
   - Text Secondary (`#8C8C8C`) against Background Primary (`#1A1A1A`) achieves **4.6:1** (AA Compliant for UI labels).
2. **Motion Preference:**
   - Any animation or canvas inertia effect is suspended if `window.matchMedia('(prefers-reduced-motion: reduce)')` is active.
   ```css
   @media (prefers-reduced-motion: reduce) {
     *, ::before, ::after {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
       transition-duration: 0.01ms !important;
       scroll-behavior: auto !important;
     }
   }
   ```
3. **Hardware Acceleration:**
   - Interactive carousel cards and floating cursor layers utilize `will-change: transform` and `transform: translateZ(0)` during active manipulation to maintain 120fps refresh rates on ProMotion displays.
4. **Image & Media Optimization:**
   - High-fidelity visual cards must serve next-gen AVIF/WebP formats with explicit `aspect-ratio` definitions to prevent Cumulative Layout Shift (CLS).

---

## 7. Developer Implementation Checklist

- [ ] **CSS Setup:** Declare CSS variables in `index.css` and configure Tailwind theme tokens in `tailwind.config.js`.
- [ ] **Noise Texture:** Inject `.noise-overlay` component into top-level root layout.
- [ ] **Grid Container:** Enforce 1px grid border-collapse structure on top navigation, hero, carousel, and ledger.
- [ ] **Typography Scale:** Ensure headings use `clamp(2.5rem, 5.2vw, 5.25rem)` with tracking `-0.035em` and line-height `1.04`.
- [ ] **Inertia Scrolling:** Initialize Lenis or custom spring physics for smooth viewport gliding.
- [ ] **Responsive Test:** Verify grid collapse at `1200px`, `992px`, and `<768px` breakpoints to guarantee no double-width border artifacts.
