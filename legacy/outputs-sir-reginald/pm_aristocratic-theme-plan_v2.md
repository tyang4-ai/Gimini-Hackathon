# Sir Reginald - Aristocratic Manor Theme Plan

**Version:** 2.0
**Created:** 2026-01-19
**Product Manager:** Claude (PM Agent)
**Target Time:** 6-8 hours (demo-ready)

---

## Changes from v1

### REMOVED (Based on Critic Feedback)
| Item | Reason |
|------|--------|
| Dark mode ("Evening Study") | Zero demo value - judges see app for 2-3 minutes |
| Texture overlays (paper, leather) | 3% opacity = invisible on compressed video |
| Phase 4 secondary components | Near-miss counter, timeline, latency gauge, mode toggle, volume control, snooze button, connection screen - not demo-critical |
| Cabinet drawer animations | Complexity without payoff |
| Wax seal effects | Users spend 10 seconds on onboarding |
| Invitation card styling | Over-designed for actual use time |
| Corner ornaments on frames | CSS pseudo-elements are debugging hell |
| 15 different keyframe animations | Reduced to 5 essential animations |
| Onboarding complexity | Simplified to minimum needed |

### ADDED (Critical Missing Elements)
| Item | Reason |
|------|--------|
| Sir Reginald Avatar | Visual personality anchor - the butler needs a FACE |
| Video Overlay Bounding Box | Show WHERE the danger is during alerts - the "wow" moment |
| Speaking Indicator | Visual feedback when Sir Reginald talks - connects audio to visual |
| Sound effects as PRIORITY | Fun comes from VOICE + SOUND, not ornate CSS |

### RESTRUCTURED
| Change | Before | After |
|--------|--------|-------|
| THE SHOUT priority | Phase 3 | Phase 1 (it IS the demo) |
| Time estimates | ~10.5 hours optimistic | 6-8 hours realistic |
| Focus | "Elegant design system" | "High-impact demo moments" |
| Sound effects | "Optional enhancement" | Core requirement |

---

## Executive Summary

Transform Sir Reginald into a **memorable, personality-driven experience** through 5 high-impact visual moments. Fun comes from VOICE and PERSONALITY expressed through sound and reactive visuals - not ornate CSS.

**Core Insight:** An aristocratic butler is FUN because of how he REACTS, not because of brass gradients.

**The 5 Demo Moments That Matter:**
1. THE SHOUT - Maximum drama, makes judges jump
2. Sir Reginald Avatar - Visual personality anchor
3. Speaking Indicator - Audio-visual connection
4. Video Danger Bounding Box - "He SAW it" wow moment
5. Session Verdict - Strong ending, memorable exit

---

## 1. Color Palette - The Manor (Simplified)

### Primary Palette Only

```css
/* File: src/app/globals.css */

:root {
  /* === MANOR CORE COLORS === */

  /* Backgrounds - Warm Parchment */
  --manor-parchment: #F5ECD7;           /* Main background */
  --manor-parchment-dark: #EDE0C8;      /* Cards, surfaces */
  --manor-parchment-light: #FAF6EB;     /* Highlights */

  /* Brass & Gold - Interactive Elements */
  --manor-brass: #B8860B;               /* Primary brass - icons, borders */
  --manor-brass-light: #DAA520;         /* Hover states */
  --manor-brass-polish: #FFD700;        /* Highlights, glows */

  /* Wood Tones - Frames, Accents */
  --manor-mahogany: #4A2C2A;            /* Dark wood */
  --manor-frame-wood: #654321;          /* Frame borders */

  /* Safety Colors - Maximum Contrast */
  --manor-safe: #2E7D32;                /* Safe green */
  --manor-warning: #C9A227;             /* Warning gold */
  --manor-danger: #B71C1C;              /* DANGER RED - THE SHOUT */

  /* Text */
  --manor-ink: #2C1810;                 /* Primary text */
  --manor-ink-faded: #5D4E37;           /* Secondary text */

  /* === SEMANTIC MAPPINGS === */
  --background: var(--manor-parchment);
  --foreground: var(--manor-ink);
  --surface: var(--manor-parchment-dark);
  --border: var(--manor-frame-wood);
  --primary: var(--manor-brass);
  --accent: var(--manor-brass-light);
}
```

**Implementation:** Replace existing CSS variables in `globals.css`. 20 minutes max.

---

## 2. Typography - The Study (Simplified)

### Two Fonts Only

```tsx
/* File: src/app/layout.tsx */

import { Playfair_Display, Crimson_Pro } from 'next/font/google'

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

// Add to html className: `${playfair.variable} ${crimson.variable}`
```

```css
/* File: src/app/globals.css */

:root {
  --font-heading: 'Playfair Display', Georgia, serif;
  --font-body: 'Crimson Pro', Georgia, serif;
}

/* Headings */
h1, h2, h3, .heading {
  font-family: var(--font-heading);
  font-weight: 600;
  color: var(--manor-ink);
}

/* Body */
body, p {
  font-family: var(--font-body);
  line-height: 1.6;
  color: var(--manor-ink);
}

/* Sir Reginald's Quotes - Always italic, larger */
.reginald-speaks {
  font-family: var(--font-body);
  font-style: italic;
  font-size: 1.1rem;
  color: var(--manor-ink-faded);
}
```

**Implementation:** 15 minutes.

---

## 3. THE SHOUT Alert - Maximum Drama (HIGHEST PRIORITY)

**This IS the demo.** When Sir Reginald screams "MARCUS! HAND!" the room should react.

### Component: SafetyAlertOverlay

```tsx
/* File: src/components/safety-alert-overlay.tsx */

'use client'

import { useEffect, useRef } from 'react'

interface ShoutAlertProps {
  userName: string
  dangerType: string  // e.g., "HAND!", "BLADE!", "GLASSES!"
  isVisible: boolean
  onDismiss: () => void
}

export function ShoutAlert({ userName, dangerType, isVisible, onDismiss }: ShoutAlertProps) {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (isVisible) {
      // Play sound FIRST (100ms before visual)
      audioRef.current?.play()

      // Auto-dismiss after 8 seconds
      const timer = setTimeout(onDismiss, 8000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onDismiss])

  if (!isVisible) return null

  return (
    <>
      {/* Emergency Sound */}
      <audio ref={audioRef} src="/sounds/shout-alarm.mp3" preload="auto" />

      {/* Full-screen Red Flash */}
      <div className="shout-backdrop">
        {/* Alert Card */}
        <div className="shout-card">
          {/* Sir Reginald Avatar - Alarmed */}
          <div className="shout-avatar">
            <div className="monocle-flying" />
          </div>

          {/* THE SHOUT TEXT */}
          <div className="shout-content">
            <h1 className="shout-name">{userName.toUpperCase()}!</h1>
            <h2 className="shout-danger">{dangerType}</h2>
          </div>
        </div>
      </div>
    </>
  )
}
```

### CSS - The Shout Animations

```css
/* File: src/app/globals.css - THE SHOUT SECTION */

/* === THE SHOUT - MAXIMUM DRAMA === */

/* Red Flash Backdrop */
@keyframes curtain-flash {
  0% { background: rgba(183, 28, 28, 0); }
  5% { background: rgba(183, 28, 28, 1); }     /* INSTANT red */
  15% { background: rgba(183, 28, 28, 0.9); }
  100% { background: rgba(183, 28, 28, 0.7); }
}

.shout-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: curtain-flash 0.5s ease-out forwards;
}

/* Screen Shake */
@keyframes violent-shake {
  0%, 100% { transform: translateX(0); }
  10% { transform: translateX(-10px) rotate(-1deg); }
  20% { transform: translateX(10px) rotate(1deg); }
  30% { transform: translateX(-10px) rotate(-1deg); }
  40% { transform: translateX(10px) rotate(1deg); }
  50% { transform: translateX(-5px); }
  60% { transform: translateX(5px); }
  70% { transform: translateX(-2px); }
  80% { transform: translateX(2px); }
}

.shout-card {
  background: linear-gradient(135deg, #B71C1C 0%, #7f0000 100%);
  border: 6px solid var(--manor-brass);
  border-radius: 12px;
  padding: 3rem 4rem;
  text-align: center;
  box-shadow:
    0 0 0 12px rgba(183, 28, 28, 0.5),
    0 20px 60px rgba(0, 0, 0, 0.5);
  animation: violent-shake 0.6s ease-in-out;
}

/* Name Display - HUGE */
.shout-name {
  font-family: var(--font-heading);
  font-size: 5rem;
  font-weight: 700;
  color: white;
  text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
  margin: 0;
  letter-spacing: 0.1em;
}

/* Danger Type */
.shout-danger {
  font-family: var(--font-heading);
  font-size: 3rem;
  font-weight: 600;
  color: var(--manor-brass-polish);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin: 0.5rem 0 0 0;
}

/* Monocle Flying Off Animation */
@keyframes monocle-fly {
  0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
  50% { transform: translate(30px, -40px) rotate(180deg); opacity: 1; }
  100% { transform: translate(60px, 20px) rotate(360deg); opacity: 0; }
}

.shout-avatar {
  width: 100px;
  height: 100px;
  background: var(--manor-parchment);
  border: 4px solid var(--manor-brass);
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  position: relative;
  /* Sir Reginald's alarmed face - use emoji or SVG */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
}

.shout-avatar::after {
  content: '';
  position: absolute;
  top: 15px;
  right: 10px;
  width: 25px;
  height: 25px;
  border: 3px solid var(--manor-brass);
  border-radius: 50%;
  animation: monocle-fly 0.8s ease-out forwards;
}
```

**Implementation Time:** 2 hours (includes testing until it makes you jump)

**Testing Criteria:**
- [ ] Sound plays FIRST (100ms before visual)
- [ ] Red flash is IMMEDIATE and INTENSE
- [ ] Screen shake feels urgent, not nauseating
- [ ] Name is readable at a glance
- [ ] Auto-dismisses after 8 seconds
- [ ] Works on first try, every time

---

## 4. Sir Reginald Avatar - Visual Personality Anchor (NEW)

**The butler needs a FACE.** This is where personality lives visually.

### Component: ReginaldAvatar

```tsx
/* File: src/components/reginald-avatar.tsx */

'use client'

interface ReginaldAvatarProps {
  state: 'idle' | 'speaking' | 'thinking' | 'alarmed' | 'pleased'
  size?: 'sm' | 'md' | 'lg'
}

export function ReginaldAvatar({ state, size = 'md' }: ReginaldAvatarProps) {
  const sizeMap = {
    sm: 'w-12 h-12 text-2xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-24 h-24 text-5xl',
  }

  // Emoji-based for speed - can upgrade to SVG later
  const faceMap = {
    idle: { emoji: '', monocle: true },      // Neutral
    speaking: { emoji: '', monocle: true },   // Raised eyebrow
    thinking: { emoji: '', monocle: true },   // Contemplating
    alarmed: { emoji: '', monocle: false },  // Shocked, monocle falls
    pleased: { emoji: '', monocle: true },   // Satisfied
  }

  const { emoji, monocle } = faceMap[state]

  return (
    <div className={`reginald-avatar ${sizeMap[size]} ${state === 'speaking' ? 'avatar-speaking' : ''}`}>
      <span className="avatar-face">{emoji}</span>
      {monocle && <div className="avatar-monocle" />}
    </div>
  )
}
```

### CSS - Avatar Styles

```css
/* File: src/app/globals.css - AVATAR SECTION */

/* === SIR REGINALD AVATAR === */

.reginald-avatar {
  position: relative;
  background: linear-gradient(135deg, var(--manor-parchment-light) 0%, var(--manor-parchment-dark) 100%);
  border: 3px solid var(--manor-brass);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(139, 69, 19, 0.2);
}

/* Monocle */
.avatar-monocle {
  position: absolute;
  top: 20%;
  right: 15%;
  width: 30%;
  height: 30%;
  border: 2px solid var(--manor-brass);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
}

/* Speaking Pulse */
@keyframes speaking-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(184, 134, 11, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(184, 134, 11, 0); }
}

.avatar-speaking {
  animation: speaking-pulse 1s ease-in-out infinite;
}

.avatar-speaking .avatar-monocle {
  animation: monocle-examine 2s ease-in-out infinite;
}

@keyframes monocle-examine {
  0%, 100% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(-5deg) scale(1.05); }
  75% { transform: rotate(5deg) scale(1.05); }
}
```

**Implementation Time:** 45 minutes

**Usage:** Place avatar in header, next to dialogue boxes, on verdict screen.

---

## 5. Speaking Indicator - Audio-Visual Connection (NEW)

**When Sir Reginald talks, the screen should RESPOND.**

### Component: SpeakingIndicator

```tsx
/* File: src/components/speaking-indicator.tsx */

'use client'

interface SpeakingIndicatorProps {
  isSpeaking: boolean
  currentText?: string
}

export function SpeakingIndicator({ isSpeaking, currentText }: SpeakingIndicatorProps) {
  if (!isSpeaking) return null

  return (
    <div className="speaking-indicator">
      <div className="speaking-waves">
        <span className="wave wave-1" />
        <span className="wave wave-2" />
        <span className="wave wave-3" />
      </div>
      {currentText && (
        <p className="speaking-text reginald-speaks">"{currentText}"</p>
      )}
    </div>
  )
}
```

### CSS - Speaking Indicator

```css
/* File: src/app/globals.css - SPEAKING INDICATOR */

/* === SPEAKING INDICATOR === */

.speaking-indicator {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: var(--manor-parchment-light);
  border: 2px solid var(--manor-brass);
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(184, 134, 11, 0.2);
}

/* Audio Waves */
.speaking-waves {
  display: flex;
  align-items: center;
  gap: 3px;
  height: 24px;
}

.wave {
  width: 4px;
  background: var(--manor-brass);
  border-radius: 2px;
  animation: wave-bounce 0.6s ease-in-out infinite;
}

.wave-1 { height: 8px; animation-delay: 0ms; }
.wave-2 { height: 16px; animation-delay: 150ms; }
.wave-3 { height: 12px; animation-delay: 300ms; }

@keyframes wave-bounce {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.8); }
}

/* Speaking Text */
.speaking-text {
  font-size: 1rem;
  color: var(--manor-ink-faded);
  margin: 0;
  max-width: 400px;
}
```

**Implementation Time:** 30 minutes

---

## 6. Video Danger Bounding Box - The "He SAW It" Moment (NEW)

**When Sir Reginald alerts about danger, show WHERE on the video feed.**

### Component: DangerOverlay

```tsx
/* File: src/components/danger-overlay.tsx */

'use client'

interface DangerBox {
  x: number      // percentage from left (0-100)
  y: number      // percentage from top (0-100)
  width: number  // percentage of video width
  height: number // percentage of video height
  label: string  // e.g., "HAND NEAR BLADE"
}

interface DangerOverlayProps {
  boxes: DangerBox[]
  isVisible: boolean
}

export function DangerOverlay({ boxes, isVisible }: DangerOverlayProps) {
  if (!isVisible || boxes.length === 0) return null

  return (
    <div className="danger-overlay">
      {boxes.map((box, i) => (
        <div
          key={i}
          className="danger-box"
          style={{
            left: `${box.x}%`,
            top: `${box.y}%`,
            width: `${box.width}%`,
            height: `${box.height}%`,
          }}
        >
          <span className="danger-label">{box.label}</span>
        </div>
      ))}
    </div>
  )
}
```

### CSS - Danger Bounding Box

```css
/* File: src/app/globals.css - DANGER OVERLAY */

/* === VIDEO DANGER OVERLAY === */

.danger-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 100;
}

.danger-box {
  position: absolute;
  border: 4px solid var(--manor-danger);
  border-radius: 4px;
  background: rgba(183, 28, 28, 0.15);
  animation: danger-pulse 0.5s ease-in-out infinite alternate;
}

@keyframes danger-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(183, 28, 28, 0.7);
    border-color: var(--manor-danger);
  }
  100% {
    box-shadow: 0 0 20px 4px rgba(183, 28, 28, 0.4);
    border-color: #ff0000;
  }
}

.danger-label {
  position: absolute;
  bottom: 100%;
  left: 0;
  background: var(--manor-danger);
  color: white;
  font-family: var(--font-heading);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px 4px 0 0;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

**Implementation Time:** 1 hour (includes integration with Gemini response parsing)

**Integration Notes:**
- Gemini API returns danger coordinates in response
- Parse coordinates and pass to DangerOverlay component
- Overlay is positioned over the video feed element
- Coordinates may need scaling based on video dimensions

---

## 7. Gilded Frame for Video Feed - Distinctive Look

### CSS - Simple Brass Frame (No Corner Ornaments)

```css
/* File: src/app/globals.css - VIDEO FRAME */

/* === GILDED VIDEO FRAME === */

.gilded-frame {
  position: relative;
  padding: 8px;
  background: linear-gradient(
    135deg,
    var(--manor-brass) 0%,
    var(--manor-brass-light) 30%,
    var(--manor-brass) 50%,
    var(--manor-brass-light) 70%,
    var(--manor-brass) 100%
  );
  border-radius: 8px;
  box-shadow:
    inset 0 2px 4px rgba(255, 255, 255, 0.3),
    0 8px 24px rgba(139, 69, 19, 0.3);
}

.gilded-frame-inner {
  background: var(--manor-mahogany);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

/* Video element inside */
.gilded-frame video {
  display: block;
  width: 100%;
  height: auto;
}
```

### Component Usage

```tsx
/* Example usage in video-preview.tsx */

<div className="gilded-frame">
  <div className="gilded-frame-inner">
    <video ref={videoRef} autoPlay playsInline muted />
    <DangerOverlay boxes={dangerBoxes} isVisible={showDanger} />
  </div>
</div>
```

**Implementation Time:** 30 minutes

---

## 8. Session Verdict - Strong Ending (Simplified)

### Component: SessionVerdict

```tsx
/* File: src/components/session-verdict.tsx */

'use client'

import { ReginaldAvatar } from './reginald-avatar'

interface SessionVerdictProps {
  userName: string
  sessionDuration: string
  alertsAvoided: number
  nearMisses: number
  verdict: string  // Sir Reginald's closing statement
  isVisible: boolean
  onClose: () => void
}

export function SessionVerdict({
  userName,
  sessionDuration,
  alertsAvoided,
  nearMisses,
  verdict,
  isVisible,
  onClose
}: SessionVerdictProps) {
  if (!isVisible) return null

  return (
    <div className="verdict-backdrop">
      <div className="verdict-card">
        {/* Header */}
        <div className="verdict-header">
          <ReginaldAvatar state="pleased" size="lg" />
          <h1>Session Complete</h1>
        </div>

        {/* Stats */}
        <div className="verdict-stats">
          <div className="stat-plaque">
            <span className="stat-value">{sessionDuration}</span>
            <span className="stat-label">Duration</span>
          </div>
          <div className="stat-plaque">
            <span className="stat-value">{alertsAvoided}</span>
            <span className="stat-label">Dangers Averted</span>
          </div>
          <div className="stat-plaque">
            <span className="stat-value">{nearMisses}</span>
            <span className="stat-label">Close Calls</span>
          </div>
        </div>

        {/* Sir Reginald's Verdict */}
        <div className="verdict-quote">
          <p className="reginald-speaks">"{verdict}"</p>
          <p className="verdict-signature">- Sir Reginald</p>
        </div>

        {/* Close Button */}
        <button className="btn-brass" onClick={onClose}>
          Return to the Manor
        </button>
      </div>
    </div>
  )
}
```

### CSS - Session Verdict

```css
/* File: src/app/globals.css - SESSION VERDICT */

/* === SESSION VERDICT === */

.verdict-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(74, 44, 42, 0.9);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9000;
  animation: fade-in 0.3s ease-out;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.verdict-card {
  background: var(--manor-parchment-light);
  border: 4px solid var(--manor-brass);
  border-radius: 12px;
  box-shadow:
    0 0 0 8px var(--manor-frame-wood),
    0 20px 60px rgba(0, 0, 0, 0.4);
  max-width: 500px;
  width: 90%;
  overflow: hidden;
  animation: scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes scale-in {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.verdict-header {
  background: linear-gradient(180deg, var(--manor-mahogany) 0%, #3A2220 100%);
  color: var(--manor-parchment);
  padding: 2rem;
  text-align: center;
  border-bottom: 4px solid var(--manor-brass);
}

.verdict-header h1 {
  font-family: var(--font-heading);
  font-size: 1.75rem;
  color: var(--manor-parchment);
  margin: 1rem 0 0 0;
}

/* Stats Grid */
.verdict-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 1.5rem;
  background: var(--manor-parchment-dark);
}

.stat-plaque {
  background: var(--manor-parchment-light);
  border: 2px solid var(--manor-brass);
  border-radius: 6px;
  padding: 1rem;
  text-align: center;
}

.stat-value {
  display: block;
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 700;
  color: var(--manor-brass);
}

.stat-label {
  display: block;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--manor-ink-faded);
  margin-top: 0.25rem;
}

/* Quote Section */
.verdict-quote {
  padding: 2rem;
  text-align: center;
}

.verdict-quote .reginald-speaks {
  font-size: 1.25rem;
  line-height: 1.6;
  margin: 0;
}

.verdict-signature {
  font-family: var(--font-heading);
  font-style: italic;
  color: var(--manor-ink-faded);
  margin: 1rem 0 0 0;
}

/* Close Button */
.verdict-card .btn-brass {
  display: block;
  width: calc(100% - 3rem);
  margin: 0 1.5rem 1.5rem;
}
```

**Implementation Time:** 1.5 hours

---

## 9. Sound Effects - PRIORITY (Not Optional)

**Fun comes from SOUND. These are required, not nice-to-have.**

### Sound Files Needed

| Sound | File | When | Priority |
|-------|------|------|----------|
| THE SHOUT alarm | `/public/sounds/shout-alarm.mp3` | Danger alert | CRITICAL |
| Gentle chime | `/public/sounds/gentle-chime.mp3` | Reminder alerts | HIGH |
| Success fanfare | `/public/sounds/fanfare.mp3` | Session verdict | HIGH |
| Speaking start | `/public/sounds/ahem.mp3` | Sir Reginald starts | MEDIUM |

### Implementation - Sound Hook

```tsx
/* File: src/hooks/use-sound.ts */

'use client'

import { useRef, useCallback } from 'react'

export function useSound(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const play = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src)
    }
    audioRef.current.currentTime = 0
    audioRef.current.play().catch(() => {
      // Autoplay blocked - user hasn't interacted yet
      console.log('Sound blocked until user interaction')
    })
  }, [src])

  return { play }
}
```

### Usage

```tsx
// In a component
const shoutSound = useSound('/sounds/shout-alarm.mp3')

// When danger detected
shoutSound.play()
```

**Implementation Time:** 30 minutes (plus sourcing sounds - use freesound.org)

**Sound Sourcing Tips:**
- THE SHOUT: Search "alarm bell urgent" - needs to be startling
- Chime: Search "gentle bell notification"
- Fanfare: Search "short victory fanfare"
- Ahem: Search "throat clear butler"

---

## 10. Brass Button Component - Base Interactive Element

```css
/* File: src/app/globals.css - BRASS BUTTON */

/* === BRASS BUTTON === */

.btn-brass {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(180deg, var(--manor-brass-light) 0%, var(--manor-brass) 100%);
  border: 2px solid var(--manor-brass);
  color: var(--manor-ink);
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    0 4px 8px rgba(139, 69, 19, 0.2);
}

.btn-brass:hover {
  background: linear-gradient(180deg, var(--manor-brass-polish) 0%, var(--manor-brass-light) 100%);
  transform: translateY(-2px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    0 6px 16px rgba(184, 134, 11, 0.3);
}

.btn-brass:active {
  transform: translateY(0);
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.1),
    0 2px 4px rgba(139, 69, 19, 0.15);
}
```

**Implementation Time:** 15 minutes

---

## 11. Implementation Plan - Restructured for Demo Impact

### Phase 1: THE SHOUT (2 hours) - HIGHEST PRIORITY

| Task | Time | Deliverable |
|------|------|-------------|
| Implement ShoutAlert component | 45min | Full component with HTML/React |
| Add CSS animations (flash, shake) | 30min | Dramatic visual effects |
| Sound integration | 20min | Audio plays first |
| Testing until it makes you jump | 25min | QA and refinement |

**Exit Criteria:** When triggered, makes person physically react.

### Phase 2: Color + Typography Foundation (45 min)

| Task | Time | Deliverable |
|------|------|-------------|
| Add color variables to globals.css | 15min | Full palette |
| Configure Google Fonts in layout.tsx | 15min | Playfair + Crimson |
| Add typography classes | 15min | Heading, body, quotes |

**Exit Criteria:** App has "manor feel" without any component changes.

### Phase 3: Sir Reginald Avatar + Speaking (1.25 hours)

| Task | Time | Deliverable |
|------|------|-------------|
| ReginaldAvatar component | 30min | Avatar with states |
| SpeakingIndicator component | 30min | Wave animation + text |
| Integration with audio system | 15min | Triggers on speech |

**Exit Criteria:** Sir Reginald has a visual presence that reacts.

### Phase 4: Video Danger Overlay (1 hour)

| Task | Time | Deliverable |
|------|------|-------------|
| DangerOverlay component | 30min | Bounding box display |
| Parse Gemini coordinates | 20min | Transform API response |
| Integration with video feed | 10min | Position correctly |

**Exit Criteria:** Red boxes appear on video showing what Sir Reginald saw.

### Phase 5: Gilded Frame + Session Verdict (2 hours)

| Task | Time | Deliverable |
|------|------|-------------|
| Gilded frame CSS | 20min | Brass border on video |
| SessionVerdict component | 1h | Full verdict screen |
| Verdict CSS | 30min | Styling and animations |
| Testing | 10min | End-to-end flow |

**Exit Criteria:** Demo has a strong visual ending.

### Phase 6: Sound Effects (30 min)

| Task | Time | Deliverable |
|------|------|-------------|
| Source 4 sound files | 15min | From freesound.org |
| useSound hook | 10min | Reusable hook |
| Integrate sounds | 5min | Wire up to events |

**Exit Criteria:** App makes appropriate sounds.

### Phase 7: Polish + Testing (1 hour)

| Task | Time | Deliverable |
|------|------|-------------|
| Full flow test | 30min | Onboarding -> monitoring -> alert -> verdict |
| Fix issues | 20min | Bug fixes |
| Performance check | 10min | No animation jank |

**Exit Criteria:** Demo-ready.

---

## Total Time Budget

| Phase | Time | Running Total |
|-------|------|---------------|
| 1. THE SHOUT | 2h | 2h |
| 2. Color + Typography | 45min | 2h 45min |
| 3. Avatar + Speaking | 1h 15min | 4h |
| 4. Danger Overlay | 1h | 5h |
| 5. Frame + Verdict | 2h | 7h |
| 6. Sound Effects | 30min | 7h 30min |
| 7. Polish | 1h | **8h 30min** |

**Buffer built in.** If everything goes smoothly, done in 7 hours. Realistic with debugging: 8-9 hours.

---

## What's NOT In This Plan (Intentionally Cut)

- Dark mode
- Texture overlays
- Corner ornaments
- Secondary components (timeline, counters, gauges)
- Complex onboarding theming
- Cabinet drawer animations
- Page transition animations
- 15 different keyframe animations

**These can be added AFTER the demo is working if time permits.**

---

## Quick Reference: Demo Checklist

- [ ] THE SHOUT makes people jump
- [ ] Sir Reginald has a visible avatar
- [ ] Audio connects to visual (speaking indicator)
- [ ] Danger locations shown on video
- [ ] Brass frame looks premium, not cheap
- [ ] Session verdict is a strong ending
- [ ] Sounds play at right moments
- [ ] No animation jank

---

## Technical Warnings (From Critic)

1. **Test fonts FIRST** - Google Fonts can be flaky
2. **Use `--manor-*` prefix** - Avoid shadcn variable conflicts
3. **Animate only `transform` and `opacity`** - Avoid `box-shadow` animation
4. **Audio plays BEFORE visual** - 100ms delay on THE SHOUT visual
5. **Test brass gradients on multiple monitors** - Colors can look wrong
6. **Skip corner ornaments** - Pseudo-element positioning is debugging hell

---

*"A gentleman knows when to exercise restraint. We shall focus our considerable talents on moments of genuine impact, rather than adorning every corner with unnecessary flourish."*

**End of Theme Plan v2**
