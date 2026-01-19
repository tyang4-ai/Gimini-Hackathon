# Sir Reginald - Aristocratic Manor Theme Plan

**Version:** 1.0
**Created:** 2026-01-19
**Product Manager:** Claude (PM Agent)

---

## Executive Summary

Transform Sir Reginald from a functional safety app into a **delightful, memorable experience** that feels like stepping into a British gentleman's private study. The theme should make users genuinely excited to use the app - not because they have to, but because it's genuinely FUN.

**Core Metaphor:** You're entering Sir Reginald's private workshop study in his manor house. He's invited you into his world to watch over your work.

---

## 1. Color Palette - "The Manor"

### Primary Palette

```css
:root {
  /* Manor Core Colors */
  --manor-burgundy: #722F37;          /* Rich burgundy - primary actions */
  --manor-burgundy-light: #8B3A42;    /* Hover states */
  --manor-burgundy-dark: #5A252C;     /* Active/pressed states */

  --manor-mahogany: #4A2C2A;          /* Dark wood tones */
  --manor-walnut: #5D3A3A;            /* Mid wood tones */
  --manor-oak: #8B6914;               /* Light wood accents */

  /* Background - Warm Parchment */
  --parchment: #F5ECD7;               /* Main background - aged paper */
  --parchment-dark: #EDE0C8;          /* Cards, surfaces */
  --parchment-light: #FAF6EB;         /* Highlights */

  /* Brass & Gold Accents */
  --brass: #B8860B;                    /* Primary brass - icons, borders */
  --brass-light: #DAA520;              /* Hover brass */
  --brass-polish: #FFD700;             /* Accent highlights */
  --brass-aged: #8B7355;               /* Subtle brass, muted */

  /* Library Colors */
  --library-green: #2D4A3E;            /* Deep forest green */
  --library-navy: #1C2841;             /* Rich navy blue */
  --library-green-light: #3D5A4E;      /* Green hover */

  /* Safety Colors - Mantained but "Manor-ified" */
  --safe-manor: #2E7D32;               /* Safe green - more muted, dignified */
  --warning-manor: #C9A227;            /* Warning gold - brass-like */
  --danger-manor: #B71C1C;             /* Danger - deeper, more serious red */

  /* Text Colors */
  --ink: #2C1810;                       /* Primary text - aged ink */
  --ink-faded: #5D4E37;                 /* Secondary text */
  --ink-light: #8B7355;                 /* Muted text */

  /* Borders */
  --frame-gold: #B8860B;                /* Ornate frame borders */
  --frame-wood: #654321;                /* Wooden frame borders */
}
```

### Dark Mode - "The Evening Study"

```css
.dark {
  /* Evening Study - Candlelit atmosphere */
  --background: #1A1512;                /* Deep mahogany darkness */
  --surface: #2A211B;                   /* Warm surface */
  --surface-light: #3A3028;             /* Elevated surfaces */

  --foreground: #E8DCC8;                /* Warm parchment text */
  --muted-foreground: #A89880;          /* Muted text */

  --border: #4A3D30;                    /* Wood-toned borders */
  --brass: #D4A76A;                     /* Warmer brass in candlelight */
}
```

### CSS Variables Update

```css
:root {
  /* Theme Tokens */
  --background: var(--parchment);
  --foreground: var(--ink);
  --surface: var(--parchment-dark);
  --surface-light: var(--parchment-light);
  --border: var(--frame-wood);

  --primary: var(--manor-burgundy);
  --primary-foreground: var(--parchment-light);

  --accent: var(--brass);
  --accent-foreground: var(--ink);

  --safe: var(--safe-manor);
  --warning: var(--warning-manor);
  --danger: var(--danger-manor);

  --muted-foreground: var(--ink-faded);
}
```

---

## 2. Typography - "The Study"

### Font Stack

```css
/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');

:root {
  /* Typography */
  --font-heading: 'Playfair Display', Georgia, serif;
  --font-body: 'Crimson Pro', Georgia, serif;
  --font-accent: 'Cormorant Garamond', Georgia, serif;
  --font-mono: 'Courier Prime', 'Courier New', monospace;
}
```

### Typography Classes

```css
/* Headings - Bold, Serif, Distinguished */
h1, h2, h3, .heading {
  font-family: var(--font-heading);
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--ink);
}

/* Body Text - Readable Serif */
body, p, .body-text {
  font-family: var(--font-body);
  font-weight: 400;
  line-height: 1.7;
  color: var(--ink);
}

/* Sir Reginald's Quotes - Elegant, Italic */
.quote, .reginald-speaks {
  font-family: var(--font-accent);
  font-style: italic;
  font-weight: 500;
  color: var(--ink-faded);
  position: relative;
  padding-left: 1.5rem;
}

.quote::before {
  content: '"';
  position: absolute;
  left: 0;
  top: -0.25rem;
  font-size: 2rem;
  color: var(--brass);
  font-family: var(--font-heading);
}

/* Small Labels */
.label {
  font-family: var(--font-body);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-light);
}
```

### Font Loading Strategy

Add to `layout.tsx`:
```tsx
import { Playfair_Display, Crimson_Pro, Cormorant_Garamond } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

const crimson = Crimson_Pro({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-accent',
  display: 'swap',
  weight: ['400', '500', '600'],
})
```

---

## 3. Visual Elements - "The Estate"

### Card Styling - Framed Portraits

```css
/* Base Card - Wooden Panel Look */
.manor-card {
  background: linear-gradient(135deg, var(--parchment-dark) 0%, var(--parchment) 100%);
  border: 2px solid var(--frame-wood);
  border-radius: 4px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1),
    0 4px 12px rgba(44, 24, 16, 0.15),
    0 1px 3px rgba(44, 24, 16, 0.1);
  position: relative;
}

/* Ornate Frame - For Important Elements */
.manor-frame {
  background: var(--parchment);
  border: 3px solid var(--brass);
  border-radius: 6px;
  box-shadow:
    0 0 0 4px var(--frame-wood),
    0 0 0 6px var(--brass-aged),
    0 8px 24px rgba(44, 24, 16, 0.2);
  padding: 1.5rem;
}

/* Corner Ornaments for Fancy Frames */
.manor-frame-ornate::before,
.manor-frame-ornate::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid var(--brass);
}

.manor-frame-ornate::before {
  top: 8px;
  left: 8px;
  border-right: none;
  border-bottom: none;
}

.manor-frame-ornate::after {
  bottom: 8px;
  right: 8px;
  border-left: none;
  border-top: none;
}
```

### Shadows - Candlelight Feel

```css
/* Soft, Warm Shadows */
.shadow-candle-sm {
  box-shadow: 0 2px 8px rgba(139, 69, 19, 0.12);
}

.shadow-candle {
  box-shadow: 0 4px 16px rgba(139, 69, 19, 0.15);
}

.shadow-candle-lg {
  box-shadow:
    0 8px 32px rgba(139, 69, 19, 0.2),
    0 2px 8px rgba(139, 69, 19, 0.1);
}

/* Brass Glow - For Interactive Elements */
.glow-brass {
  box-shadow: 0 0 20px rgba(184, 134, 11, 0.3);
}
```

### Textures - Subtle Paper/Leather Patterns

```css
/* Paper Texture Overlay */
.texture-paper {
  background-image:
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-blend-mode: multiply;
  opacity: 0.03;
}

/* Leather Texture - For Headers */
.texture-leather {
  background:
    linear-gradient(
      180deg,
      var(--manor-mahogany) 0%,
      var(--manor-walnut) 100%
    );
  position: relative;
}

.texture-leather::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E");
  opacity: 0.05;
  mix-blend-mode: overlay;
}
```

### Decorative Elements

```css
/* Horizontal Rule - Brass Flourish */
.divider-brass {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--brass) 20%,
    var(--brass-light) 50%,
    var(--brass) 80%,
    transparent 100%
  );
  margin: 1.5rem 0;
}

/* Section Divider with Ornament */
.divider-ornate {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
}

.divider-ornate::before,
.divider-ornate::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--brass-aged);
}

.divider-ornate-icon {
  color: var(--brass);
  font-size: 1.25rem;
}
```

---

## 4. Animations - "The Grand Entrance"

### Page Transitions - Sliding Doors

```css
/* Page Enter - Like Opening Manor Doors */
@keyframes manor-doors-open {
  0% {
    clip-path: inset(0 50% 0 50%);
    opacity: 0;
  }
  50% {
    clip-path: inset(0 10% 0 10%);
    opacity: 0.7;
  }
  100% {
    clip-path: inset(0 0 0 0);
    opacity: 1;
  }
}

.animate-doors-open {
  animation: manor-doors-open 0.6s ease-out forwards;
}

/* Page Exit - Doors Closing */
@keyframes manor-doors-close {
  0% {
    clip-path: inset(0 0 0 0);
    opacity: 1;
  }
  100% {
    clip-path: inset(0 50% 0 50%);
    opacity: 0;
  }
}
```

### Module Entrance - Sliding Panels

```css
/* Slide In From Left - Like Opening a Cabinet Drawer */
@keyframes slide-in-left {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  60% {
    transform: translateX(5%);
    opacity: 1;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Slide In From Right */
@keyframes slide-in-right {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  60% {
    transform: translateX(-5%);
    opacity: 1;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Staggered Module Entrance */
.module-stagger:nth-child(1) { animation-delay: 0ms; }
.module-stagger:nth-child(2) { animation-delay: 100ms; }
.module-stagger:nth-child(3) { animation-delay: 200ms; }
.module-stagger:nth-child(4) { animation-delay: 300ms; }

.animate-slide-left {
  animation: slide-in-left 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.animate-slide-right {
  animation: slide-in-right 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
```

### Button Interactions - Brass Handle Feel

```css
/* Button Press - Satisfying Click */
@keyframes brass-press {
  0% {
    transform: translateY(0);
    box-shadow: 0 4px 8px rgba(139, 69, 19, 0.2);
  }
  50% {
    transform: translateY(2px);
    box-shadow: 0 2px 4px rgba(139, 69, 19, 0.15);
  }
  100% {
    transform: translateY(0);
    box-shadow: 0 4px 8px rgba(139, 69, 19, 0.2);
  }
}

.btn-brass {
  background: linear-gradient(180deg, var(--brass-light) 0%, var(--brass) 100%);
  border: 2px solid var(--brass);
  color: var(--ink);
  font-family: var(--font-heading);
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    0 4px 8px rgba(139, 69, 19, 0.2);
  transition: all 0.2s ease;
}

.btn-brass:hover {
  background: linear-gradient(180deg, var(--brass-polish) 0%, var(--brass-light) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    0 6px 12px rgba(184, 134, 11, 0.3);
  transform: translateY(-1px);
}

.btn-brass:active {
  animation: brass-press 0.2s ease;
}
```

### Hover States - Brass Glow

```css
/* Hover Glow for Interactive Elements */
.hover-brass-glow {
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.hover-brass-glow:hover {
  box-shadow: 0 0 0 3px rgba(184, 134, 11, 0.2);
  border-color: var(--brass);
}
```

### Loading Animations - Monocle & Pocket Watch

```css
/* Monocle Spinning */
@keyframes monocle-examine {
  0% {
    transform: rotate(0deg) scale(1);
  }
  25% {
    transform: rotate(-10deg) scale(1.05);
  }
  50% {
    transform: rotate(10deg) scale(1);
  }
  75% {
    transform: rotate(-5deg) scale(1.05);
  }
  100% {
    transform: rotate(0deg) scale(1);
  }
}

.animate-monocle {
  animation: monocle-examine 2s ease-in-out infinite;
}

/* Pocket Watch Tick */
@keyframes pocket-watch {
  0%, 100% {
    transform: rotate(-5deg);
  }
  50% {
    transform: rotate(5deg);
  }
}

.animate-pocket-watch {
  animation: pocket-watch 1s ease-in-out infinite;
}

/* Progress Bar - Like Pouring Tea */
@keyframes pour-progress {
  0% {
    width: 0%;
    background-position: 0% 50%;
  }
  100% {
    width: 100%;
    background-position: 100% 50%;
  }
}

.progress-tea {
  background: linear-gradient(
    90deg,
    var(--brass-aged) 0%,
    var(--brass) 50%,
    var(--brass-light) 100%
  );
  background-size: 200% 100%;
  animation: pour-progress 2s ease-out forwards;
}
```

---

## 5. Component Redesigns

### 5.1 Onboarding Screen - "Welcome to the Manor"

**Theme:** Grand entrance hall, invitation cards

```tsx
// Key Visual Changes:
// - Full-screen parchment background with subtle texture
// - Large Sir Reginald coat of arms or crest at top
// - Permission cards styled like formal invitations
// - Buttons as brass door handles

/* File: src/components/onboarding-screen.tsx */

// New classes to add:
const welcomeStyles = `
  /* Background: Like entering through manor doors */
  .welcome-backdrop {
    background:
      radial-gradient(ellipse at top, var(--parchment-light) 0%, var(--parchment) 50%),
      var(--parchment);
    min-height: 100vh;
    position: relative;
    overflow: hidden;
  }

  /* Decorative columns on sides */
  .welcome-backdrop::before,
  .welcome-backdrop::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 60px;
    background: linear-gradient(90deg, var(--manor-mahogany), transparent);
    opacity: 0.1;
  }

  .welcome-backdrop::before { left: 0; }
  .welcome-backdrop::after { right: 0; transform: scaleX(-1); }

  /* Crest/Logo */
  .manor-crest {
    width: 120px;
    height: 120px;
    background: var(--parchment-dark);
    border: 4px solid var(--brass);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow:
      0 0 0 8px var(--parchment),
      0 0 0 12px var(--brass-aged);
  }

  /* Invitation Cards */
  .invitation-card {
    background: var(--parchment-light);
    border: 2px solid var(--brass-aged);
    border-radius: 4px;
    padding: 1.5rem;
    position: relative;
    box-shadow: 0 4px 16px rgba(139, 69, 19, 0.1);
  }

  /* Wax seal effect for granted permissions */
  .wax-seal {
    position: absolute;
    top: -10px;
    right: -10px;
    width: 40px;
    height: 40px;
    background: radial-gradient(circle, #8B0000 0%, #5a0000 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
`
```

**Implementation Notes:**
- Header: Large top hat emoji (or SVG crest) in ornate gold frame
- "Welcome to Sir Reginald's Manor" in Playfair Display
- Permission cards slide in from bottom with stagger
- Each granted permission gets a "wax seal" checkmark
- Continue button styled as brass door handle

### 5.2 Camera Setup - Ornate Picture Frame

**Theme:** Like positioning a portrait in a gilded frame

```tsx
/* File: src/components/camera-setup-screen.tsx */

// Video frame as ornate gilded frame
const cameraFrameStyles = `
  .gilded-frame {
    position: relative;
    padding: 12px;
    background: linear-gradient(
      135deg,
      var(--brass) 0%,
      var(--brass-light) 25%,
      var(--brass) 50%,
      var(--brass-aged) 75%,
      var(--brass) 100%
    );
    border-radius: 8px;
    box-shadow:
      0 8px 32px rgba(139, 69, 19, 0.3),
      inset 0 2px 4px rgba(255, 255, 255, 0.3);
  }

  .gilded-frame-inner {
    background: var(--parchment-dark);
    border: 4px solid var(--frame-wood);
    border-radius: 4px;
    overflow: hidden;
  }

  /* Corner ornaments */
  .frame-corner {
    position: absolute;
    width: 30px;
    height: 30px;
    background: var(--brass-light);
    clip-path: polygon(0 0, 100% 0, 0 100%);
  }

  .frame-corner.tl { top: 0; left: 0; }
  .frame-corner.tr { top: 0; right: 0; transform: rotate(90deg); }
  .frame-corner.bl { bottom: 0; left: 0; transform: rotate(-90deg); }
  .frame-corner.br { bottom: 0; right: 0; transform: rotate(180deg); }

  /* Sir Reginald's dialogue box - like a scroll */
  .dialogue-scroll {
    background: var(--parchment-light);
    border: 2px solid var(--brass-aged);
    border-radius: 4px;
    padding: 1.5rem;
    position: relative;
    margin-top: 1.5rem;
  }

  .dialogue-scroll::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 16px;
    background: var(--brass);
    border-radius: 0 0 8px 8px;
  }
`
```

**Implementation Notes:**
- Video feed wrapped in gilded frame with corner ornaments
- Positioning guide overlay styled like measuring lines in an old painting
- Sir Reginald quotes in scroll-style boxes
- Survey animation: monocle "scanning" the frame

### 5.3 Main Monitoring Screen - The Study Layout

**Theme:** Gentleman's study with video "window" and sidebar "bookshelves"

```tsx
/* File: src/app/page.tsx - Main Layout */

// Overall layout changes:
const studyLayout = `
  .study-layout {
    background: var(--parchment);
    min-height: 100vh;
    position: relative;
  }

  /* Subtle wainscoting effect at bottom */
  .study-layout::after {
    content: '';
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 80px;
    background: linear-gradient(
      to top,
      var(--manor-mahogany) 0%,
      transparent 100%
    );
    opacity: 0.05;
    pointer-events: none;
  }

  /* Video area - Like a window looking out */
  .study-window {
    background: var(--manor-mahogany);
    padding: 16px;
    border-radius: 8px;
    box-shadow:
      inset 0 0 20px rgba(0, 0, 0, 0.3),
      0 8px 32px rgba(0, 0, 0, 0.2);
  }

  /* Window frame effect */
  .window-frame {
    border: 8px solid var(--frame-wood);
    border-radius: 4px;
    position: relative;
  }

  /* Sidebar - Like a bookshelf/cabinet */
  .study-sidebar {
    background: linear-gradient(
      180deg,
      var(--parchment-dark) 0%,
      var(--parchment) 100%
    );
    border-left: 4px solid var(--frame-wood);
    padding: 1rem;
  }

  /* Each sidebar panel - Like a cabinet drawer */
  .cabinet-drawer {
    background: var(--parchment-light);
    border: 2px solid var(--frame-wood);
    border-radius: 4px;
    margin-bottom: 1rem;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .cabinet-drawer-handle {
    background: linear-gradient(180deg, var(--brass-light) 0%, var(--brass) 100%);
    padding: 0.75rem 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--brass-aged);
  }

  .cabinet-drawer-content {
    padding: 1rem;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }

  .cabinet-drawer.open .cabinet-drawer-content {
    max-height: 500px;
  }
`
```

### 5.4 Safety Status Panel - Trophy Cabinet

```tsx
/* File: src/components/safety-status-panel.tsx */

const trophyCabinetStyles = `
  .trophy-cabinet {
    background: var(--parchment-light);
    border: 3px solid var(--frame-wood);
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(139, 69, 19, 0.15);
  }

  .trophy-cabinet-header {
    background: var(--manor-mahogany);
    color: var(--parchment);
    padding: 1rem;
    font-family: var(--font-heading);
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .trophy-cabinet-header .crest {
    width: 32px;
    height: 32px;
    background: var(--brass);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .status-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--brass-aged);
  }

  .status-item:last-child {
    border-bottom: none;
  }

  .status-badge-ok {
    background: linear-gradient(135deg, var(--safe-manor) 0%, #1B5E20 100%);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .status-badge-warning {
    background: linear-gradient(135deg, var(--warning-manor) 0%, #B8860B 100%);
    color: var(--ink);
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
  }
`
```

### 5.5 Safety Alerts - Dramatic Announcements

**THE SHOUT - Most Important Alert**

```css
/* File: src/components/safety-alert-overlay.tsx */

/* THE SHOUT - Red Curtain Flash */
@keyframes curtain-flash {
  0% {
    background: transparent;
  }
  10% {
    background: var(--danger-manor);
  }
  20% {
    background: rgba(183, 28, 28, 0.8);
  }
  40% {
    background: rgba(183, 28, 28, 0.6);
  }
  100% {
    background: transparent;
  }
}

.shout-backdrop {
  animation: curtain-flash 1s ease-out;
}

/* Shout Card - Maximum Drama */
.shout-alert {
  background: linear-gradient(
    135deg,
    var(--danger-manor) 0%,
    #7f0000 100%
  );
  border: 4px solid var(--brass);
  border-radius: 8px;
  padding: 2rem;
  box-shadow:
    0 0 0 8px rgba(183, 28, 28, 0.3),
    0 16px 48px rgba(0, 0, 0, 0.4);
  animation: shake 0.5s ease-in-out;
}

.shout-title {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.05em;
}

/* Warning Alert - Brass Bell */
@keyframes bell-ring {
  0%, 100% { transform: rotate(0deg); }
  10%, 30% { transform: rotate(-15deg); }
  20%, 40% { transform: rotate(15deg); }
  50% { transform: rotate(0deg); }
}

.warning-bell {
  animation: bell-ring 0.8s ease-in-out;
}

.warning-alert {
  background: linear-gradient(
    135deg,
    var(--warning-manor) 0%,
    #8B6914 100%
  );
  border: 3px solid var(--brass);
  border-radius: 6px;
  padding: 1.5rem;
  box-shadow:
    0 0 20px rgba(201, 162, 39, 0.4),
    0 8px 32px rgba(0, 0, 0, 0.2);
}

/* Reminder Alert - Gentle Glow */
.reminder-alert {
  background: var(--parchment-light);
  border: 2px solid var(--brass-aged);
  border-radius: 4px;
  padding: 1rem;
  box-shadow: 0 0 16px rgba(184, 134, 11, 0.2);
}
```

### 5.6 Session Verdict - Grand Study Overlay

```tsx
/* File: src/components/session-verdict.tsx */

const verdictOverlayStyles = `
  /* Full-screen study backdrop */
  .verdict-backdrop {
    background:
      radial-gradient(ellipse at center, var(--parchment-dark) 0%, var(--manor-mahogany) 100%);
    backdrop-filter: blur(8px);
  }

  /* Verdict card - Like an illuminated manuscript */
  .verdict-manuscript {
    background: var(--parchment-light);
    border: 4px solid var(--brass);
    border-radius: 8px;
    box-shadow:
      0 0 0 8px var(--frame-wood),
      0 0 0 12px var(--brass-aged),
      0 16px 64px rgba(0, 0, 0, 0.4);
    max-width: 700px;
    overflow: hidden;
  }

  /* Header - Like a manuscript title */
  .verdict-header {
    background: linear-gradient(
      180deg,
      var(--manor-mahogany) 0%,
      var(--manor-walnut) 100%
    );
    color: var(--parchment);
    padding: 1.5rem 2rem;
    text-align: center;
    font-family: var(--font-heading);
    border-bottom: 4px solid var(--brass);
  }

  /* Sir Reginald's verdict text - Fancy typography */
  .verdict-quote {
    font-family: var(--font-accent);
    font-size: 1.25rem;
    line-height: 1.8;
    color: var(--ink);
    padding: 2rem;
    position: relative;
  }

  /* Decorative initial letter */
  .verdict-quote::first-letter {
    float: left;
    font-size: 4rem;
    line-height: 1;
    padding-right: 0.5rem;
    color: var(--brass);
    font-family: var(--font-heading);
    font-weight: 700;
  }

  /* Stats grid - Like trophy plaques */
  .stat-plaque {
    background: var(--parchment-dark);
    border: 2px solid var(--brass-aged);
    border-radius: 4px;
    padding: 1rem;
    text-align: center;
  }

  .stat-value {
    font-family: var(--font-heading);
    font-size: 2rem;
    font-weight: 700;
    color: var(--brass);
  }

  .stat-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--ink-faded);
    margin-top: 0.25rem;
  }
`
```

### 5.7 Thinking Monocle - Examination Animation

```tsx
/* File: src/components/thinking-monocle.tsx */

const monocleStyles = `
  .thinking-overlay {
    background: rgba(245, 236, 215, 0.9);
    backdrop-filter: blur(4px);
  }

  .thinking-card {
    background: var(--parchment-light);
    border: 3px solid var(--brass);
    border-radius: 8px;
    padding: 2rem;
    box-shadow:
      0 0 0 6px var(--frame-wood),
      0 8px 32px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  /* Animated monocle */
  .monocle-container {
    width: 80px;
    height: 80px;
    position: relative;
  }

  .monocle-lens {
    width: 60px;
    height: 60px;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.8) 0%,
      rgba(184, 134, 11, 0.2) 50%,
      rgba(255, 255, 255, 0.4) 100%
    );
    border: 4px solid var(--brass);
    border-radius: 50%;
    position: absolute;
    top: 10px;
    left: 10px;
    animation: monocle-examine 2s ease-in-out infinite;
  }

  .monocle-chain {
    position: absolute;
    bottom: 0;
    left: 30px;
    width: 2px;
    height: 25px;
    background: linear-gradient(
      to bottom,
      var(--brass) 0%,
      var(--brass-aged) 100%
    );
    animation: chain-swing 2s ease-in-out infinite;
  }

  @keyframes chain-swing {
    0%, 100% { transform: rotate(-5deg); }
    50% { transform: rotate(5deg); }
  }

  /* Progress bar - Brass filling */
  .progress-brass {
    height: 4px;
    background: var(--parchment-dark);
    border-radius: 2px;
    overflow: hidden;
    margin-top: 1rem;
  }

  .progress-brass-fill {
    height: 100%;
    background: linear-gradient(
      90deg,
      var(--brass-aged) 0%,
      var(--brass) 50%,
      var(--brass-light) 100%
    );
    animation: pour-progress 3s ease-in-out infinite;
  }
`
```

---

## 6. Sound Design (Optional Enhancement)

### Recommended Sounds (if time permits)

| Action | Sound | Description |
|--------|-------|-------------|
| Button Click | `click.mp3` | Soft brass click, like a door handle |
| Panel Slide | `slide.mp3` | Wooden drawer sliding |
| Alert Warning | `bell.mp3` | Single brass bell chime |
| Alert Shout | `alarm.mp3` | Urgent brass bell rapid |
| Success | `chime.mp3` | Pleasant completion tone |
| Sir Reginald Starts Speaking | `ahem.mp3` | Polite throat clear |

**Implementation:** Use Web Audio API with gain node for volume control.

---

## 7. Implementation Plan

### Phase 1: Foundation (HIGH Priority) - 2 hours

| Task | File | Description | Time |
|------|------|-------------|------|
| 1.1 | `globals.css` | Add full color palette CSS variables | 20min |
| 1.2 | `layout.tsx` | Configure Google Fonts (Playfair, Crimson, Cormorant) | 15min |
| 1.3 | `globals.css` | Add typography classes | 15min |
| 1.4 | `globals.css` | Add all animation keyframes | 30min |
| 1.5 | `globals.css` | Add texture and shadow utilities | 20min |
| 1.6 | `button.tsx` | Create `btn-brass` variant | 20min |

### Phase 2: Core Components (HIGH Priority) - 3 hours

| Task | File | Description | Time |
|------|------|-------------|------|
| 2.1 | `onboarding-screen.tsx` | Manor welcome theme, invitation cards | 45min |
| 2.2 | `camera-setup-screen.tsx` | Gilded frame, dialogue scrolls | 30min |
| 2.3 | `page.tsx` | Study layout wrapper, window frame | 30min |
| 2.4 | `safety-status-panel.tsx` | Trophy cabinet styling | 30min |
| 2.5 | `status-bar.tsx` | Mantelpiece header bar | 20min |
| 2.6 | `video-preview.tsx` | Window frame effect | 25min |

### Phase 3: Alerts & Verdict (HIGH Priority) - 2 hours

| Task | File | Description | Time |
|------|------|-------------|------|
| 3.1 | `safety-alert-overlay.tsx` | Dramatic THE SHOUT, warning bell | 45min |
| 3.2 | `session-verdict.tsx` | Illuminated manuscript style | 45min |
| 3.3 | `thinking-monocle.tsx` | Brass monocle animation | 30min |

### Phase 4: Secondary Components (MEDIUM Priority) - 2 hours

| Task | File | Description | Time |
|------|------|-------------|------|
| 4.1 | `near-miss-counter.tsx` | Ledger entry styling | 20min |
| 4.2 | `moment-timeline.tsx` | Journal entries look | 20min |
| 4.3 | `latency-stats.tsx` | Barometer/gauge style | 25min |
| 4.4 | `mode-toggle.tsx` | Brass switch design | 15min |
| 4.5 | `volume-control.tsx` | Gramophone dial | 15min |
| 4.6 | `snooze-button.tsx` | Bell with ribbon | 15min |
| 4.7 | `connection-screen.tsx` | Butler waiting animation | 20min |

### Phase 5: Polish & Animations (LOW Priority if time tight) - 1.5 hours

| Task | File | Description | Time |
|------|------|-------------|------|
| 5.1 | All components | Add slide-in animations with stagger | 30min |
| 5.2 | All components | Hover states with brass glow | 20min |
| 5.3 | `page.tsx` | Page transition animation | 20min |
| 5.4 | Optional | Sound effects integration | 20min |

**Total Estimated Time:** ~10.5 hours

### Quick Win Order (If Short on Time)

1. **globals.css** - Colors + Fonts (35min) - HUGE visual impact
2. **onboarding-screen.tsx** (45min) - First impression
3. **safety-alert-overlay.tsx** (45min) - THE SHOUT is the money shot
4. **session-verdict.tsx** (45min) - Demo ending
5. **video-preview.tsx** + **page.tsx** (55min) - Main screen

**Minimum viable theme: ~3 hours**

---

## 8. Theme Decision: WARM LIGHT

### Recommendation: Warm Parchment/Cream Base (Primary)

**Why Light Theme Works Better:**

1. **Manor House Authenticity:** British manor studies have cream/beige walls, natural light through windows, not dark caves
2. **Warm & Inviting:** A safety app should feel welcoming, not intimidating
3. **Contrast for Alerts:** Danger red POPS against cream; less visible against dark
4. **Demo Readiness:** Light themes photograph/record better on video
5. **Unique:** Most tech apps are dark mode default - this stands out

### Dark Mode: "Evening Study" Variant

Keep as an option for users who prefer it, styled as:
- Candlelit atmosphere
- Warmer dark (mahogany-black, not blue-black)
- Brass elements glow warmer
- Still feels like the same manor, just after sunset

### Theme Toggle

Style the toggle as a gas lamp switch:
- Light mode: Lamp "on" with warm glow icon
- Dark mode: Lamp "dim" with muted icon

---

## 9. Component Quick Reference

| Component | Theme Element | Animation |
|-----------|---------------|-----------|
| Onboarding | Manor entrance, invitations | Door open, cards slide up |
| Camera Setup | Gilded portrait frame | Frame assembles |
| Main Layout | Gentleman's study | None (stable) |
| Video Feed | Window looking out | Subtle frame glow when speaking |
| Status Bar | Mantelpiece | None |
| Safety Panel | Trophy cabinet | Drawer slide |
| Alerts | Dramatic announcements | Flash/shake for SHOUT |
| Verdict | Illuminated manuscript | Scroll unfurl |
| Thinking | Monocle examination | Monocle wobble + progress |

---

## 10. Success Metrics

### Demo-Worthy Checklist

- [ ] First impression (onboarding) makes people smile
- [ ] THE SHOUT is genuinely dramatic and memorable
- [ ] Sliding animations feel satisfying, not annoying
- [ ] Typography is elegant and readable
- [ ] Color palette feels cohesive and premium
- [ ] Session verdict feels like a proper "ending"
- [ ] App looks unique - not just another React dashboard

### Fun Factor Tests

1. Would someone show this to a friend unprompted?
2. Does THE SHOUT make people jump (in a good way)?
3. Do the animations feel like opening real drawers/doors?
4. Does Sir Reginald's personality shine through visuals?

---

## Appendix: Asset Suggestions

### Icons to Source/Create

- Sir Reginald coat of arms/crest
- Monocle (SVG, animated)
- Top hat (for headers)
- Brass bell (for warnings)
- Pocket watch (for timing)
- Quill pen (for documentation)
- Wax seal (for completed items)

### Background Patterns (Optional)

- Subtle damask for cards
- Wood grain for borders
- Leather texture for headers
- Paper texture for main bg

---

*"A gentleman's workshop is an extension of his character. Let us ensure Sir Reginald's abode reflects the distinguished nature of his purpose."*

**End of Theme Plan v1**
