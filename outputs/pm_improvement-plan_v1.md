# PM Implementation Plan: Sir Reginald 7.8 → 9.3/10

**Date:** January 19, 2026
**Target:** Improve from 7.8/10 to 9.3/10 (75% Top 3 probability)
**Estimated Total Time:** 8 hours

---

## Executive Summary

This plan outlines 7 improvements to transform Sir Reginald from a "strong entry" to a "top 3 contender." The improvements focus on visual polish, emotional impact, and demo memorability—the elements judges remember when deliberating.

**Point Impact Breakdown:**
| Priority | Improvement | Points | Time |
|----------|------------|--------|------|
| 1 | Replace emoji with Sir Reginald shouting image | +0.3 | 30 min |
| 2 | Add SHOUT Statistics overlay | +0.4 | 2 hours |
| 3 | Add hero latency display during SHOUT | +0.3 | 1 hour |
| 4 | Add near-miss counter animation | +0.2 | 1 hour |
| 5 | Add cinematic letterbox bars | +0.1 | 30 min |
| 6 | Add ambient workshop audio | +0.1 | 1.5 hours |
| 7 | Polish session verdict with achievement badges | +0.1 | 1.5 hours |
| **TOTAL** | | **+1.5** | **8 hours** |

---

## Improvement 1: Replace Emoji with Sir Reginald Shouting Image

### Priority: CRITICAL (+0.3 points)
### Time Estimate: 30 minutes

### Problem
THE SHOUT—the most memorable 15 seconds of the entire demo—currently displays a generic emoji (`😨`) instead of Sir Reginald's actual face. This undermines the entire character-driven positioning.

### Current State
**File:** `sir-reginald-app/src/components/safety-alert-overlay.tsx`
**Lines 96-98:**
```tsx
<div className="shout-avatar">
  <span aria-hidden="true">{'\u{1F628}'}</span>
  <div className="monocle-flying" aria-hidden="true" />
</div>
```

### Solution

#### Step 1: Copy the shouting image to public folder
- **Source:** `Documents/Sir_regniald_shouting.png` (2.4 MB)
- **Destination:** `sir-reginald-app/public/sir-reginald-shouting.png`
- Note: Consider optimizing to ~200KB for faster load

#### Step 2: Update SafetyAlertOverlay component
Replace the emoji span with an Image component:

```tsx
// Add import at top
import Image from "next/image"

// Replace lines 96-98 in the isShout block
<div className="shout-avatar shout-avatar-image">
  <Image
    src="/sir-reginald-shouting.png"
    alt="Sir Reginald alarmed"
    width={100}
    height={100}
    className="rounded-full"
    priority
  />
  <div className="monocle-flying" aria-hidden="true" />
</div>
```

#### Step 3: Update ShoutAlert component (same file)
Apply the same change to the standalone `ShoutAlert` component at lines 223-225.

#### Step 4: Update CSS for image-based avatar
Add to `globals.css`:
```css
.shout-avatar-image {
  overflow: hidden;
}

.shout-avatar-image img {
  object-fit: cover;
  transform: scale(1.1);
}
```

### Acceptance Criteria
- [ ] Shouting image displays in SHOUT overlay instead of emoji
- [ ] Image is properly sized (100x100px display)
- [ ] Monocle flying animation still works
- [ ] Image loads instantly (priority loading)

---

## Improvement 2: SHOUT Statistics Overlay

### Priority: HIGH (+0.4 points)
### Time Estimate: 2 hours

### Problem
When THE SHOUT triggers, judges see the warning but don't see the IMPACT. The injury statistics exist in the codebase but aren't shown during the dramatic moment.

### Current State
- Statistics exist in `lib/injury-statistics.ts`
- Near-miss counter shows stats AFTER the alert dismisses
- THE SHOUT overlay has no statistics display

### Solution

#### Step 1: Create new ShoutStatistics component
**New file:** `sir-reginald-app/src/components/shout-statistics.tsx`

```tsx
"use client"

import { useEffect, useState } from "react"
import { INJURY_STATISTICS, formatCurrency } from "@/lib/injury-statistics"
import { AlertTriangle, DollarSign, Calendar, Activity } from "lucide-react"

interface ShoutStatisticsProps {
  scenario: string
  isVisible: boolean
}

/**
 * Dramatic statistics overlay shown during THE SHOUT
 * Appears after a short delay to let the initial warning sink in
 */
export function ShoutStatistics({ scenario, isVisible }: ShoutStatisticsProps) {
  const [showStats, setShowStats] = useState(false)
  const stats = INJURY_STATISTICS[scenario]

  useEffect(() => {
    if (isVisible) {
      // Show stats after 1.5 seconds to let initial shock register
      const timer = setTimeout(() => setShowStats(true), 1500)
      return () => clearTimeout(timer)
    } else {
      setShowStats(false)
    }
  }, [isVisible])

  if (!stats || !showStats) return null

  return (
    <div className="shout-stats-overlay">
      <div className="shout-stats-card">
        <h3 className="shout-stats-title">
          <AlertTriangle className="w-5 h-5" />
          INJURY STATISTICS
        </h3>

        <div className="shout-stats-grid">
          {/* Injury Type */}
          <div className="shout-stat">
            <Activity className="w-4 h-4 text-red-300" />
            <span className="shout-stat-label">POTENTIAL INJURY</span>
            <span className="shout-stat-value">{stats.injuryType}</span>
          </div>

          {/* Annual Incidents */}
          <div className="shout-stat">
            <AlertTriangle className="w-4 h-4 text-yellow-300" />
            <span className="shout-stat-label">ANNUAL INCIDENTS</span>
            <span className="shout-stat-value text-2xl">{stats.annualIncidents}</span>
            <span className="shout-stat-source">Source: {stats.source}</span>
          </div>

          {/* Cost Range */}
          <div className="shout-stat">
            <DollarSign className="w-4 h-4 text-green-300" />
            <span className="shout-stat-label">MEDICAL COSTS</span>
            <span className="shout-stat-value text-green-300">
              {formatCurrency(stats.estimatedCostLow)} - {formatCurrency(stats.estimatedCostHigh)}
            </span>
          </div>

          {/* Recovery Time */}
          <div className="shout-stat">
            <Calendar className="w-4 h-4 text-blue-300" />
            <span className="shout-stat-label">RECOVERY TIME</span>
            <span className="shout-stat-value">{stats.recoveryTime}</span>
          </div>
        </div>

        <p className="shout-stats-tagline">
          Sir Reginald just saved you from this.
        </p>
      </div>
    </div>
  )
}
```

#### Step 2: Add CSS for statistics overlay
Add to `globals.css`:

```css
/* ===================================================
   SHOUT STATISTICS OVERLAY
   =================================================== */

.shout-stats-overlay {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  animation: stats-slide-up 0.5s ease-out;
}

@keyframes stats-slide-up {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.shout-stats-card {
  background: rgba(0, 0, 0, 0.85);
  border: 2px solid var(--manor-brass);
  border-radius: 12px;
  padding: 1.5rem;
  min-width: 400px;
  backdrop-filter: blur(8px);
}

.shout-stats-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--manor-brass-polish);
  font-family: var(--font-heading);
  font-size: 0.9rem;
  letter-spacing: 0.15em;
  margin-bottom: 1rem;
  text-transform: uppercase;
}

.shout-stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.shout-stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.shout-stat-label {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.shout-stat-value {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
}

.shout-stat-source {
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.4);
  font-style: italic;
}

.shout-stats-tagline {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
  font-style: italic;
  color: var(--manor-brass-light);
  font-size: 0.9rem;
}
```

#### Step 3: Integrate into SafetyAlertOverlay
Update `safety-alert-overlay.tsx`:

```tsx
// Add import
import { ShoutStatistics } from "./shout-statistics"

// In the isShout return block, add after the shout-card div:
{isShout && (
  <>
    {/* Existing shout-backdrop content */}
    <div className="shout-backdrop" role="alertdialog" aria-modal="true">
      <div className="shout-card">
        {/* ... existing content ... */}
      </div>

      {/* NEW: Statistics overlay */}
      <ShoutStatistics
        scenario={alert.scenario || 'hand_near_blade'}
        isVisible={true}
      />
    </div>
  </>
)}
```

### Acceptance Criteria
- [ ] Statistics appear 1.5 seconds after SHOUT triggers
- [ ] Shows: injury type, annual incidents, source, cost range, recovery time
- [ ] Animates in from bottom
- [ ] "Sir Reginald just saved you from this" tagline displays
- [ ] Doesn't interfere with SHOUT dismiss button

---

## Improvement 3: Hero Latency Display

### Priority: HIGH (+0.3 points)
### Time Estimate: 1 hour

### Problem
The "340ms" latency is Sir Reginald's technical flex—proof that he's faster than human reaction time. But this number is buried in an expandable panel. During THE SHOUT, judges should see the speed.

### Solution

#### Step 1: Create HeroLatency component
**New file:** `sir-reginald-app/src/components/hero-latency.tsx`

```tsx
"use client"

import { Zap } from "lucide-react"

interface HeroLatencyProps {
  latencyMs: number
  isVisible: boolean
}

/**
 * Hero latency display shown during SHOUT
 * Makes the speed viscerally clear to judges
 */
export function HeroLatency({ latencyMs, isVisible }: HeroLatencyProps) {
  if (!isVisible) return null

  const getLatencyColor = () => {
    if (latencyMs < 400) return "text-green-400"
    if (latencyMs < 600) return "text-yellow-400"
    return "text-orange-400"
  }

  const getLatencyLabel = () => {
    if (latencyMs < 400) return "FASTER THAN HUMAN REACTION"
    if (latencyMs < 600) return "REAL-TIME INTERVENTION"
    return "PROACTIVE WARNING"
  }

  return (
    <div className="hero-latency">
      <div className="hero-latency-icon">
        <Zap className="w-6 h-6" />
      </div>
      <div className="hero-latency-content">
        <span className={`hero-latency-number ${getLatencyColor()}`}>
          {latencyMs}ms
        </span>
        <span className="hero-latency-label">{getLatencyLabel()}</span>
      </div>
    </div>
  )
}
```

#### Step 2: Add CSS
Add to `globals.css`:

```css
/* ===================================================
   HERO LATENCY DISPLAY
   =================================================== */

.hero-latency {
  position: absolute;
  top: 2rem;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(0, 0, 0, 0.85);
  border: 2px solid var(--manor-brass);
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
  z-index: 10000;
  animation: hero-pulse 1s ease-in-out infinite;
}

@keyframes hero-pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(46, 125, 50, 0.5);
  }
  50% {
    box-shadow: 0 0 20px 4px rgba(46, 125, 50, 0.3);
  }
}

.hero-latency-icon {
  color: var(--manor-brass-polish);
}

.hero-latency-content {
  display: flex;
  flex-direction: column;
}

.hero-latency-number {
  font-family: var(--font-mono, monospace);
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1;
}

.hero-latency-label {
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
```

#### Step 3: Integrate into SafetyAlertOverlay
Pass latency to the component and display during SHOUT:

```tsx
// Add to SafetyAlertOverlayProps interface
latencyMs?: number

// In the isShout block, add at top of shout-backdrop:
<HeroLatency latencyMs={latencyMs || 340} isVisible={true} />
```

#### Step 4: Pass latency from page.tsx
Update the SafetyAlertOverlay usage to include current latency.

### Acceptance Criteria
- [ ] Latency number displays prominently during SHOUT (top-right)
- [ ] Shows "FASTER THAN HUMAN REACTION" for <400ms
- [ ] Pulses with green glow to draw attention
- [ ] Uses monospace font for that "technical" feel

---

## Improvement 4: Near-Miss Counter Animation

### Priority: MEDIUM (+0.2 points)
### Time Estimate: 1 hour

### Problem
When the near-miss counter increments, it just... changes. No celebration. No "you dodged a bullet" moment. Judges won't notice unless there's visual feedback.

### Solution

#### Step 1: Add animation CSS
Add to `globals.css`:

```css
/* ===================================================
   NEAR-MISS COUNTER ANIMATIONS
   =================================================== */

@keyframes counter-increment {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.3);
    color: var(--manor-danger);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes counter-flash {
  0%, 100% {
    background: transparent;
  }
  50% {
    background: rgba(183, 28, 28, 0.2);
  }
}

.counter-animate {
  animation: counter-increment 0.6s ease-out;
}

.counter-card-flash {
  animation: counter-flash 0.8s ease-out;
}

/* Saved money celebration */
@keyframes money-saved {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-30px);
  }
}

.money-saved-popup {
  position: absolute;
  top: -20px;
  right: 10px;
  color: var(--manor-safe);
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1.25rem;
  animation: money-saved 1.5s ease-out forwards;
  pointer-events: none;
}
```

#### Step 2: Update NearMissCounter component
**File:** `sir-reginald-app/src/components/near-miss-counter.tsx`

Add state to track when count changes:

```tsx
// Add imports
import { useState, useEffect, useRef } from "react"

// Inside the component, add:
const [isAnimating, setIsAnimating] = useState(false)
const [showSavedPopup, setShowSavedPopup] = useState(false)
const [lastSavedAmount, setLastSavedAmount] = useState(0)
const prevCountRef = useRef(interventions.length)

// Effect to detect new interventions
useEffect(() => {
  if (interventions.length > prevCountRef.current) {
    // New intervention added
    setIsAnimating(true)

    // Calculate the cost of the newest intervention
    const newest = interventions[interventions.length - 1]
    const avgCost = ((newest.estimatedCostLow || 0) + (newest.estimatedCostHigh || 0)) / 2
    setLastSavedAmount(avgCost)
    setShowSavedPopup(true)

    // Reset animations
    setTimeout(() => {
      setIsAnimating(false)
      setShowSavedPopup(false)
    }, 1500)
  }
  prevCountRef.current = interventions.length
}, [interventions])

// Update the counter display span:
<span
  className={`text-2xl font-bold text-danger ${isAnimating ? 'counter-animate' : ''}`}
  aria-label={`${interventions.length} near-misses prevented`}
>
  {interventions.length}
</span>

// Add popup after the counter:
{showSavedPopup && lastSavedAmount > 0 && (
  <div className="money-saved-popup">
    +{formatCurrency(lastSavedAmount)} saved!
  </div>
)}

// Add flash class to the wrapper:
<div
  className={`bg-surface rounded-lg border border-border overflow-hidden ${isAnimating ? 'counter-card-flash' : ''}`}
  ...
>
```

### Acceptance Criteria
- [ ] Counter number pulses/scales when incremented
- [ ] Background flashes red briefly
- [ ] "+$X,XXX saved!" popup floats up and fades
- [ ] Animation completes in ~1.5 seconds

---

## Improvement 5: Cinematic Letterbox Bars

### Priority: LOW (+0.1 points)
### Time Estimate: 30 minutes

### Problem
The video feed looks like a regular webcam. Adding cinematic letterbox bars gives it a "professional production" feel that suggests polish.

### Solution

#### Step 1: Create LetterboxOverlay component
**New file:** `sir-reginald-app/src/components/letterbox-overlay.tsx`

```tsx
"use client"

interface LetterboxOverlayProps {
  barHeight?: number  // Percentage of video height
  isVisible?: boolean
}

/**
 * Cinematic letterbox bars for video preview
 * Adds professional film-like appearance
 */
export function LetterboxOverlay({
  barHeight = 8,
  isVisible = true
}: LetterboxOverlayProps) {
  if (!isVisible) return null

  return (
    <div className="letterbox-container" aria-hidden="true">
      <div
        className="letterbox-bar letterbox-top"
        style={{ height: `${barHeight}%` }}
      />
      <div
        className="letterbox-bar letterbox-bottom"
        style={{ height: `${barHeight}%` }}
      />
    </div>
  )
}
```

#### Step 2: Add CSS
Add to `globals.css`:

```css
/* ===================================================
   CINEMATIC LETTERBOX BARS
   =================================================== */

.letterbox-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 50;
}

.letterbox-bar {
  position: absolute;
  left: 0;
  right: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 0.8) 100%
  );
}

.letterbox-top {
  top: 0;
}

.letterbox-bottom {
  bottom: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 0.8) 100%
  );
}
```

#### Step 3: Add to VideoPreview component
Import and render inside the video container.

### Acceptance Criteria
- [ ] Black bars appear at top and bottom of video feed
- [ ] Bars are ~8% height each
- [ ] Gradient edge for smooth transition
- [ ] Does not interfere with video content

---

## Improvement 6: Ambient Workshop Audio

### Priority: LOW (+0.1 points)
### Time Estimate: 1.5 hours

### Problem
The workshop feels silent between Sir Reginald's comments. Subtle ambient audio (workshop sounds, tool hum) adds atmosphere and covers awkward silences.

### Solution

#### Step 1: Create ambient audio source
Generate or source royalty-free ambient workshop sounds:
- Light power tool hum
- Occasional workshop ambiance
- Very subtle, background-level

Use Web Audio API to generate procedural ambient sound, or:
- Source a royalty-free loop (freesound.org)
- Keep under 200KB for quick load

#### Step 2: Create AmbientAudio component
**New file:** `sir-reginald-app/src/components/ambient-audio.tsx`

```tsx
"use client"

import { useEffect, useRef } from "react"

interface AmbientAudioProps {
  isPlaying: boolean
  volume?: number  // 0-1, default 0.15 (very subtle)
}

/**
 * Ambient workshop audio for atmosphere
 * Uses Web Audio API for procedural generation
 */
export function AmbientAudio({ isPlaying, volume = 0.15 }: AmbientAudioProps) {
  const audioContextRef = useRef<AudioContext | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null)

  useEffect(() => {
    if (!isPlaying) {
      // Clean up
      noiseNodeRef.current?.stop()
      audioContextRef.current?.close()
      return
    }

    // Create audio context
    const audioContext = new AudioContext()
    audioContextRef.current = audioContext

    // Create gain node for volume control
    const gainNode = audioContext.createGain()
    gainNode.gain.value = volume
    gainNode.connect(audioContext.destination)
    gainNodeRef.current = gainNode

    // Create brown noise (more pleasant than white noise)
    const bufferSize = audioContext.sampleRate * 2
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    let lastOut = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      data[i] = (lastOut + (0.02 * white)) / 1.02
      lastOut = data[i]
      data[i] *= 3.5 // Boost
    }

    // Create and start noise source
    const noise = audioContext.createBufferSource()
    noise.buffer = buffer
    noise.loop = true

    // Add low-pass filter for that "workshop hum" feel
    const filter = audioContext.createBiquadFilter()
    filter.type = "lowpass"
    filter.frequency.value = 200

    noise.connect(filter)
    filter.connect(gainNode)
    noise.start()
    noiseNodeRef.current = noise

    return () => {
      noise.stop()
      audioContext.close()
    }
  }, [isPlaying, volume])

  // Update volume when prop changes
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume
    }
  }, [volume])

  return null // No visual component
}
```

#### Step 3: Add to main page
```tsx
<AmbientAudio isPlaying={isSessionActive && !isSpeaking} volume={0.1} />
```

Automatically mute when Sir Reginald is speaking.

### Acceptance Criteria
- [ ] Subtle ambient hum plays during active session
- [ ] Automatically mutes when Sir Reginald speaks
- [ ] Volume is very low (barely noticeable consciously)
- [ ] No audio files needed (Web Audio API generated)

---

## Improvement 7: Session Verdict Achievement Badges

### Priority: LOW (+0.1 points)
### Time Estimate: 1.5 hours

### Problem
The session verdict is functional but lacks celebration. Achievement badges add gamification and memorable visual moments.

### Solution

#### Step 1: Create VerdictBadge component
**New file:** `sir-reginald-app/src/components/verdict-badge.tsx`

```tsx
"use client"

import { Shield, Eye, Star, Trophy, Heart } from "lucide-react"

type BadgeType =
  | "safety_champion"    // Zero near-misses
  | "vigilant_eye"       // Sir Reginald caught 3+ dangers
  | "master_craftsman"   // Session > 30 min with techniques
  | "quick_learner"      // Improved after suggestions
  | "the_shout_survivor" // Survived THE SHOUT

interface VerdictBadgeProps {
  type: BadgeType
  isEarned: boolean
}

const BADGE_CONFIG: Record<BadgeType, {
  icon: typeof Shield
  title: string
  description: string
  color: string
}> = {
  safety_champion: {
    icon: Shield,
    title: "Safety Champion",
    description: "Zero safety interventions needed",
    color: "text-green-400 border-green-400"
  },
  vigilant_eye: {
    icon: Eye,
    title: "Vigilant Eye",
    description: "Sir Reginald caught 3+ dangers",
    color: "text-blue-400 border-blue-400"
  },
  master_craftsman: {
    icon: Star,
    title: "Master Craftsman",
    description: "Extended session with technique moments",
    color: "text-purple-400 border-purple-400"
  },
  quick_learner: {
    icon: Heart,
    title: "Quick Learner",
    description: "Improved after safety suggestions",
    color: "text-pink-400 border-pink-400"
  },
  the_shout_survivor: {
    icon: Trophy,
    title: "The Shout Survivor",
    description: "Heeded Sir Reginald's urgent warning",
    color: "text-yellow-400 border-yellow-400"
  }
}

export function VerdictBadge({ type, isEarned }: VerdictBadgeProps) {
  const config = BADGE_CONFIG[type]
  const Icon = config.icon

  return (
    <div
      className={`verdict-badge ${isEarned ? 'earned' : 'locked'} ${isEarned ? config.color : ''}`}
      title={config.description}
    >
      <Icon className="w-6 h-6" />
      <span className="badge-title">{config.title}</span>
      {!isEarned && <div className="badge-lock" />}
    </div>
  )
}

/**
 * Calculate which badges were earned this session
 */
export function calculateEarnedBadges(
  interventions: number,
  moments: { type: string }[],
  sessionMinutes: number,
  hadShout: boolean
): BadgeType[] {
  const earned: BadgeType[] = []

  if (interventions === 0) earned.push("safety_champion")
  if (interventions >= 3) earned.push("vigilant_eye")
  if (sessionMinutes >= 30 && moments.some(m => m.type === 'technique')) {
    earned.push("master_craftsman")
  }
  if (hadShout) earned.push("the_shout_survivor")

  return earned
}
```

#### Step 2: Add CSS for badges
```css
/* ===================================================
   VERDICT BADGES
   =================================================== */

.verdict-badges {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  padding: 1rem;
  border-top: 1px solid var(--manor-brass);
}

.verdict-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem;
  border: 2px solid;
  border-radius: 8px;
  position: relative;
  transition: transform 0.2s ease;
}

.verdict-badge.earned {
  background: rgba(0, 0, 0, 0.2);
  animation: badge-earn 0.5s ease-out;
}

.verdict-badge.locked {
  opacity: 0.3;
  border-color: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.3);
}

.badge-title {
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-lock {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 6px;
}

@keyframes badge-earn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
```

#### Step 3: Integrate into SessionVerdict
Add badges section before the action buttons.

### Acceptance Criteria
- [ ] Badges display at end of session
- [ ] Earned badges are highlighted and animated
- [ ] Locked badges are greyed out
- [ ] At least 1-2 badges earned per session (to feel rewarding)

---

## Implementation Order

For maximum efficiency and demo-ability at any point:

1. **Improvement 1: Shouting Image** (30 min) - CRITICAL, do first
2. **Improvement 4: Counter Animation** (1 hour) - Quick win, visible impact
3. **Improvement 3: Hero Latency** (1 hour) - Technical flex
4. **Improvement 2: SHOUT Statistics** (2 hours) - Major impact
5. **Improvement 5: Letterbox Bars** (30 min) - Quick polish
6. **Improvement 7: Verdict Badges** (1.5 hours) - End-of-session wow
7. **Improvement 6: Ambient Audio** (1.5 hours) - Final polish

**Total: 8 hours**

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Shouting image too large | Optimize to 200KB before copying |
| Statistics overlay too busy | Test with non-makers, simplify if needed |
| Ambient audio annoying | Keep volume at 0.1 or lower |
| Badges feel gimmicky | Only show earned badges, don't over-gamify |
| Animation performance | Test on target demo machine |

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| SHOUT visual impact | 6/10 (emoji) | 9/10 (real face + stats) |
| Technical credibility | 7/10 | 9/10 (hero latency) |
| Counter engagement | 5/10 (static) | 8/10 (animated) |
| Video polish | 6/10 | 8/10 (letterbox + audio) |
| Session completion feel | 7/10 | 9/10 (badges) |
| **Overall** | **7.8/10** | **9.3/10** |

---

## Files to Create

1. `sir-reginald-app/src/components/shout-statistics.tsx` - NEW
2. `sir-reginald-app/src/components/hero-latency.tsx` - NEW
3. `sir-reginald-app/src/components/letterbox-overlay.tsx` - NEW
4. `sir-reginald-app/src/components/ambient-audio.tsx` - NEW
5. `sir-reginald-app/src/components/verdict-badge.tsx` - NEW

## Files to Modify

1. `sir-reginald-app/public/` - Copy shouting image
2. `sir-reginald-app/src/components/safety-alert-overlay.tsx` - Image + integrations
3. `sir-reginald-app/src/components/near-miss-counter.tsx` - Animation
4. `sir-reginald-app/src/components/session-verdict.tsx` - Badges
5. `sir-reginald-app/src/app/globals.css` - All new CSS
6. `sir-reginald-app/src/app/page.tsx` - Component integrations

---

*"A plan without execution is merely a wish. Execute with precision."*
*— PM Agent v1*
