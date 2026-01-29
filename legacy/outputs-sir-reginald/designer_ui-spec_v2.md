# Sir Reginald UI Design Specification v2

**Based on:** v0 Mockup + Critic Feedback
**Status:** Revised Design (addressing critic's concerns)
**Date:** January 15, 2026
**Changes from v1:** Loading states, simplified overlay, hands-free fixes, error states, status checklist

---

## Revision Summary (Critic Fixes)

| Issue | v1 Problem | v2 Solution |
|-------|------------|-------------|
| No loading states | Blank UI during connection | New `ConnectionScreen` component |
| Visual overlay fake | Hardcoded regions miss actual location | Simplified "area of attention" with honest labeling |
| Hands-free broken | Must click to dismiss alerts | Auto-dismiss 8s, voice dismiss, huge touch targets |
| No error states | Catastrophic failures show nothing | New error components for camera/mic/fatal |
| Messages panel waste | 320px of useless past messages | Replaced with real-time `SafetyStatusPanel` |

---

## Table of Contents

1. [Design System](#1-design-system)
2. [Type Definitions](#2-type-definitions)
3. [Main Page Layout](#3-main-page-layout)
4. [Component Specifications](#4-component-specifications)
   - 4.1 StatusBar
   - 4.2 ConnectionScreen (NEW)
   - 4.3 VideoPreview (REVISED)
   - 4.4 SafetyStatusPanel (REPLACES AIMessagesPanel)
   - 4.5 VoiceActivityIndicator
   - 4.6 SafetyAlertOverlay (REVISED - not modal)
   - 4.7 ModeToggle (REVISED - keyboard support)
   - 4.8 OnboardingScreen
   - 4.9 ErrorStates (NEW)
5. [CSS & Animations](#5-css--animations)
6. [Voice Commands](#6-voice-commands)
7. [Implementation Notes](#7-implementation-notes)

---

## 1. Design System

### 1.1 Color Palette (CSS Custom Properties)

```css
:root {
  /* Core colors */
  --background: #0f0f0f;
  --foreground: #ffffff;
  --surface: #1a1a1a;
  --surface-light: #252525;
  --border: #333333;

  /* Brand colors */
  --primary: #8b5cf6;        /* Purple - troubleshoot mode, branding */
  --safe: #22c55e;           /* Green - safety mode, connected */
  --warning: #eab308;        /* Yellow - caution alerts */
  --danger: #ef4444;         /* Red - critical alerts */

  /* Text colors */
  --muted-foreground: #a1a1a1;
  --text-muted: #6b7280;

  /* Radius */
  --radius: 0.5rem;
}
```

### 1.2 Typography

```css
--font-sans: "Inter", system-ui, sans-serif;
--font-mono: "Geist Mono", monospace;
```

### 1.3 Touch Targets (Hands-Free Design)

**CRITICAL:** All interactive elements must be usable with dirty/gloved hands.

| Element | Minimum Size | Notes |
|---------|--------------|-------|
| Primary buttons | 60x60px | Large enough for gloved finger |
| Secondary buttons | 44x44px | Standard mobile minimum |
| Dismiss areas | Full-width | Tap anywhere to dismiss |

---

## 2. Type Definitions

```typescript
// Core application types
export type ConnectionStatus = "connecting" | "connected" | "reconnecting" | "disconnected" | "error"
export type Mode = "safety" | "troubleshoot"
export type VoiceState = "idle" | "listening" | "ai-speaking"

// NEW: Error types for catastrophic failures
export type ErrorType = "camera" | "microphone" | "connection" | "fatal"

export interface SafetyStatus {
  lastCheck: Date
  eyeProtection: "ok" | "warning" | "unknown"
  handsPosition: "ok" | "warning" | "unknown"
  workspaceClutter: "ok" | "warning" | "unknown"
}

// Alert now includes countdown for auto-dismiss
export interface SafetyAlert {
  id: string
  type: "warning" | "danger"
  message: string
  timestamp: Date
  autoDismissAt: Date  // 8 seconds from show
}
```

---

## 3. Main Page Layout

### 3.1 Page Structure (REVISED)

```tsx
// app/page.tsx
"use client"

import { useState, useEffect } from "react"
import { StatusBar } from "@/components/status-bar"
import { ConnectionScreen } from "@/components/connection-screen"
import { VideoPreview } from "@/components/video-preview"
import { SafetyStatusPanel } from "@/components/safety-status-panel"
import { ModeToggle } from "@/components/mode-toggle"
import { VoiceActivityIndicator } from "@/components/voice-activity-indicator"
import { SafetyAlertOverlay } from "@/components/safety-alert-overlay"
import { OnboardingScreen } from "@/components/onboarding-screen"
import { ErrorScreen } from "@/components/error-screen"

export default function Home() {
  const [isOnboarding, setIsOnboarding] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connecting")
  const [errorType, setErrorType] = useState<ErrorType | null>(null)
  const [mode, setMode] = useState<Mode>("safety")
  const [voiceState, setVoiceState] = useState<VoiceState>("idle")
  const [activeAlert, setActiveAlert] = useState<SafetyAlert | null>(null)
  const [safetyStatus, setSafetyStatus] = useState<SafetyStatus>({
    lastCheck: new Date(),
    eyeProtection: "unknown",
    handsPosition: "ok",
    workspaceClutter: "ok",
  })

  // Keyboard shortcuts for hands-free operation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "m" || e.key === "M") {
        setMode(m => m === "safety" ? "troubleshoot" : "safety")
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Show onboarding first
  if (isOnboarding) {
    return <OnboardingScreen onBegin={() => {
      setIsOnboarding(false)
      setConnectionStatus("connecting")
    }} />
  }

  // Show error screen for catastrophic failures
  if (errorType) {
    return <ErrorScreen type={errorType} onRetry={() => {
      setErrorType(null)
      setConnectionStatus("connecting")
    }} />
  }

  // Show connection screen while connecting
  if (connectionStatus === "connecting") {
    return <ConnectionScreen
      onConnected={() => setConnectionStatus("connected")}
      onError={(type) => setErrorType(type)}
    />
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <StatusBar
        connectionStatus={connectionStatus}
        lastSafetyCheck={safetyStatus.lastCheck}
        onRetry={() => setConnectionStatus("connecting")}
      />

      <main className="flex-1 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Main Video Area - Now takes more space */}
            <div className="flex-1 space-y-4">
              <VideoPreview
                mode={mode}
                isConnected={connectionStatus === "connected"}
                attentionArea={activeAlert ? "general" : null}
              />
              <VoiceActivityIndicator state={voiceState} />
              <ModeToggle mode={mode} onModeChange={setMode} />
            </div>

            {/* Safety Status Panel - Replaces Messages */}
            <div className="lg:w-64">
              <SafetyStatusPanel status={safetyStatus} />
            </div>
          </div>
        </div>
      </main>

      {/* Safety Alert - Now an overlay ON the video, not a modal */}
      {activeAlert && (
        <SafetyAlertOverlay
          alert={activeAlert}
          onDismiss={() => setActiveAlert(null)}
        />
      )}
    </div>
  )
}
```

### 3.2 Layout Pattern (REVISED)

```
┌────────────────────────────────────────────────────────────────────────┐
│  STATUS BAR - "Last safety check: 3s ago" (not session timer)         │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌────────────────────────────────────────────────┐  ┌──────────────┐ │
│  │                                                │  │ SAFETY       │ │
│  │         VIDEO PREVIEW (flex-1)                 │  │ STATUS       │ │
│  │         aspect-[4/3]                           │  │ (lg:w-64)    │ │
│  │                                                │  │              │ │
│  │    ┌──────────────────────────────────────┐   │  │ ✓ Eyes: OK   │ │
│  │    │  SAFETY ALERT OVERLAY (on video)     │   │  │ ✓ Hands: OK  │ │
│  │    │  (not blocking, semi-transparent)    │   │  │ ⚠ Area: Check│ │
│  │    └──────────────────────────────────────┘   │  │              │ │
│  │                                                │  │ Last: 3s ago │ │
│  └────────────────────────────────────────────────┘  └──────────────┘ │
│  ┌────────────────────────────────────────────────┐                   │
│  │         VOICE ACTIVITY                         │                   │
│  └────────────────────────────────────────────────┘                   │
│  ┌────────────────────────────────────────────────┐                   │
│  │  [Safety Monitor]  [Troubleshooter]  (M key)   │                   │
│  └────────────────────────────────────────────────┘                   │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Component Specifications

### 4.1 StatusBar (REVISED)

**Changes:** Replaced "Session timer" with "Last safety check" - more useful info.

```tsx
// components/status-bar.tsx
"use client"

import { Mic, MicOff, RefreshCw, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ConnectionStatus } from "@/app/page"

interface StatusBarProps {
  connectionStatus: ConnectionStatus
  lastSafetyCheck: Date
  onRetry: () => void
}

export function StatusBar({ connectionStatus, lastSafetyCheck, onRetry }: StatusBarProps) {
  // Format as "3s ago", "1m ago", etc.
  const formatLastCheck = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    return `${minutes}m ago`
  }

  const getConnectionIndicator = () => {
    switch (connectionStatus) {
      case "connected":
        return (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-safe animate-pulse" />
            <span className="text-sm">Sir Reginald Active</span>
          </div>
        )
      case "connecting":
        return (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
            <span className="text-sm text-warning">Connecting...</span>
          </div>
        )
      case "reconnecting":
        return (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-sm text-orange-500">Reconnecting...</span>
          </div>
        )
      case "disconnected":
      case "error":
        return (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-danger" />
            <span className="text-sm text-danger">Disconnected</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRetry}
              className="h-8 px-3 text-danger hover:bg-danger/10"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Retry
            </Button>
          </div>
        )
    }
  }

  return (
    <header className="h-12 bg-surface border-b border-border px-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        {getConnectionIndicator()}
      </div>

      {/* Last safety check - more useful than session timer */}
      <div className="flex items-center gap-2 text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span className="text-sm">Last check:</span>
        <span className="text-sm font-medium text-foreground">
          {formatLastCheck(lastSafetyCheck)}
        </span>
      </div>
    </header>
  )
}
```

---

### 4.2 ConnectionScreen (NEW)

**Purpose:** Show meaningful UI during Gemini connection (2-5 seconds).

```tsx
// components/connection-screen.tsx
"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import type { ErrorType } from "@/app/page"

interface ConnectionScreenProps {
  onConnected: () => void
  onError: (type: ErrorType) => void
}

export function ConnectionScreen({ onConnected, onError }: ConnectionScreenProps) {
  const [stage, setStage] = useState<"camera" | "gemini" | "ready">("camera")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulated connection stages - replace with actual logic
    const stages = [
      { stage: "camera", duration: 1000 },
      { stage: "gemini", duration: 2000 },
      { stage: "ready", duration: 500 },
    ]

    let currentStage = 0
    const runStage = () => {
      if (currentStage >= stages.length) {
        onConnected()
        return
      }

      setStage(stages[currentStage].stage as any)
      setProgress((currentStage + 1) / stages.length * 100)

      setTimeout(() => {
        currentStage++
        runStage()
      }, stages[currentStage].duration)
    }

    runStage()
  }, [onConnected])

  const getMessage = () => {
    switch (stage) {
      case "camera":
        return "Accessing camera..."
      case "gemini":
        return "Waking Sir Reginald..."
      case "ready":
        return "Ready!"
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        {/* Animated tophat */}
        <div className="text-6xl mb-6 animate-bounce">🎩</div>

        <h2 className="text-xl font-semibold text-foreground mb-2">
          {getMessage()}
        </h2>

        {/* Progress bar */}
        <div className="w-64 h-2 bg-surface rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-muted-foreground text-sm">
          "Just a moment whilst I prepare the workshop..."
        </p>
      </div>
    </div>
  )
}
```

---

### 4.3 VideoPreview (REVISED)

**Changes:**
- Simplified "attention area" instead of fake precise regions
- Screen-edge glow when AI is speaking
- Liveness animation on "WATCHING" indicator

```tsx
// components/video-preview.tsx
"use client"

import { useRef, useEffect, useState } from "react"
import { Shield, Wrench } from "lucide-react"
import type { Mode } from "@/app/page"

interface VideoPreviewProps {
  mode: Mode
  isConnected: boolean
  attentionArea: "general" | null  // Simplified - no fake precision
  isAISpeaking?: boolean
}

export function VideoPreview({ mode, isConnected, attentionArea, isAISpeaking }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasVideo, setHasVideo] = useState(false)

  useEffect(() => {
    async function setupVideo() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setHasVideo(true)
        }
      } catch (err) {
        console.log("Camera access denied or unavailable")
        setHasVideo(false)
      }
    }

    if (isConnected) {
      setupVideo()
    }

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [isConnected])

  const borderColor = mode === "safety" ? "border-safe" : "border-primary"

  return (
    <div className="relative">
      {/* Screen-edge glow when AI is speaking */}
      {isAISpeaking && (
        <div className="absolute -inset-1 bg-safe/20 rounded-xl blur-md animate-pulse" />
      )}

      <div className={`relative aspect-[4/3] bg-surface rounded-lg border-2 ${borderColor} overflow-hidden`}>
        {/* Video Feed */}
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

        {/* Fallback when no video */}
        {!hasVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface">
            <div className="text-center text-muted-foreground">
              <div className="text-4xl mb-2">🎩</div>
              <p>Camera feed will appear here</p>
              <p className="text-sm mt-1">Grant camera access to begin</p>
            </div>
          </div>
        )}

        {/* Mode Badge - Top Left */}
        <div className="absolute top-3 left-3">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium ${
              mode === "safety"
                ? "bg-safe/20 text-safe border border-safe/30"
                : "bg-primary/20 text-primary border border-primary/30"
            }`}
          >
            {mode === "safety" ? (
              <>
                <Shield className="w-4 h-4" />
                SAFETY MODE
              </>
            ) : (
              <>
                <Wrench className="w-4 h-4" />
                TROUBLESHOOT
              </>
            )}
          </div>
        </div>

        {/* Watching Indicator - Top Right - Now with liveness animation */}
        {isConnected && (
          <div className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 bg-black/60 rounded text-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-danger" />
            </span>
            <span className="text-white/90">SIR REGINALD WATCHING</span>
          </div>
        )}

        {/* SIMPLIFIED Attention Area - Honest labeling, no fake precision */}
        {attentionArea && (
          <div className="absolute inset-4 border-2 border-warning/50 rounded-lg bg-warning/10 animate-pulse-border">
            <div className="absolute top-2 left-2 px-2 py-1 bg-black/80 rounded text-xs text-warning font-medium">
              AREA OF CONCERN
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

---

### 4.4 SafetyStatusPanel (REPLACES AIMessagesPanel)

**Purpose:** Real-time safety checklist showing current status - actually useful during work.

```tsx
// components/safety-status-panel.tsx
"use client"

import { Check, AlertTriangle, HelpCircle, Clock } from "lucide-react"
import type { SafetyStatus } from "@/app/page"

interface SafetyStatusPanelProps {
  status: SafetyStatus
}

export function SafetyStatusPanel({ status }: SafetyStatusPanelProps) {
  const formatLastCheck = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    return `${minutes}m ago`
  }

  const StatusIcon = ({ state }: { state: "ok" | "warning" | "unknown" }) => {
    if (state === "ok") return <Check className="w-5 h-5 text-safe" />
    if (state === "warning") return <AlertTriangle className="w-5 h-5 text-warning" />
    return <HelpCircle className="w-5 h-5 text-muted-foreground" />
  }

  const StatusText = ({ state }: { state: "ok" | "warning" | "unknown" }) => {
    if (state === "ok") return <span className="text-safe">OK</span>
    if (state === "warning") return <span className="text-warning">Check</span>
    return <span className="text-muted-foreground">—</span>
  }

  return (
    <div className="bg-surface rounded-lg border border-border">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold flex items-center gap-2">
          <span className="text-xl">🎩</span>
          Safety Status
        </h2>
      </div>

      <div className="p-4 space-y-4">
        {/* Eye Protection */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StatusIcon state={status.eyeProtection} />
            <span className="text-sm">Eye Protection</span>
          </div>
          <StatusText state={status.eyeProtection} />
        </div>

        {/* Hands Position */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StatusIcon state={status.handsPosition} />
            <span className="text-sm">Hands Position</span>
          </div>
          <StatusText state={status.handsPosition} />
        </div>

        {/* Workspace */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StatusIcon state={status.workspaceClutter} />
            <span className="text-sm">Workspace Clear</span>
          </div>
          <StatusText state={status.workspaceClutter} />
        </div>

        {/* Last Check */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Clock className="w-4 h-4" />
            <span>Last check: {formatLastCheck(status.lastCheck)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

### 4.5 VoiceActivityIndicator (unchanged from v1)

```tsx
// components/voice-activity-indicator.tsx
"use client"

import { Mic, Volume2 } from "lucide-react"
import type { VoiceState } from "@/app/page"

interface VoiceActivityIndicatorProps {
  state: VoiceState
}

export function VoiceActivityIndicator({ state }: VoiceActivityIndicatorProps) {
  return (
    <div className="bg-surface rounded-lg border border-border p-3">
      {state === "ai-speaking" && (
        <div className="flex items-center gap-3">
          <Volume2 className="w-5 h-5 text-safe" />
          <div className="flex items-center gap-1">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-safe rounded-full animate-sound-wave"
                style={{
                  height: "16px",
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
          <span className="text-sm text-safe">Sir Reginald speaking</span>
        </div>
      )}

      {state === "listening" && (
        <div className="flex items-center gap-3">
          <Mic className="w-5 h-5 text-primary animate-pulse" />
          <div className="flex-1 bg-surface-light rounded-full h-2 overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: "60%" }} />
          </div>
          <span className="text-sm text-muted-foreground">Listening...</span>
        </div>
      )}

      {state === "idle" && (
        <div className="flex items-center gap-3">
          <Mic className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Ready - say "Hey Reggie" or press M to switch modes</span>
        </div>
      )}
    </div>
  )
}
```

---

### 4.6 SafetyAlertOverlay (REVISED - Not a Modal)

**Changes:**
- Now overlays ON the video, doesn't block it
- Auto-dismiss after 8 seconds (not 10)
- Countdown timer visible
- HUGE touch target (full-width button, 60px height)
- Clear voice dismiss instructions

```tsx
// components/safety-alert-overlay.tsx
"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, XCircle } from "lucide-react"
import type { SafetyAlert } from "@/app/page"

interface SafetyAlertOverlayProps {
  alert: SafetyAlert
  onDismiss: () => void
}

export function SafetyAlertOverlay({ alert, onDismiss }: SafetyAlertOverlayProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(8)

  // Auto-dismiss countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining(s => {
        if (s <= 1) {
          onDismiss()
          return 0
        }
        return s - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [onDismiss])

  // Keyboard dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape" || e.key === " ") {
        onDismiss()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onDismiss])

  const isDANGER = alert.type === "danger"
  const bgColor = isDANGER ? "bg-danger/95" : "bg-warning/95"
  const textColor = isDANGER ? "text-white" : "text-black"

  return (
    // Positioned at bottom of video area, not blocking entire screen
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-3xl mx-auto">
        <div className={`${bgColor} rounded-lg p-4 shadow-2xl animate-slide-up`}>
          <div className="flex items-start gap-4">
            {isDANGER ? (
              <XCircle className={`w-8 h-8 ${textColor} shrink-0`} />
            ) : (
              <AlertTriangle className={`w-8 h-8 ${textColor} shrink-0`} />
            )}

            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className={`text-lg font-bold ${textColor}`}>
                  {isDANGER ? "⚠️ SAFETY ALERT" : "⚠️ SAFETY NOTICE"}
                </h3>
                {/* Countdown timer */}
                <span className={`text-sm ${textColor} opacity-80`}>
                  Auto-dismiss in {secondsRemaining}s
                </span>
              </div>

              <p className={`${textColor} leading-relaxed mb-4`}>
                "{alert.message}"
              </p>

              {/* HUGE touch target - 60px minimum height */}
              <button
                onClick={onDismiss}
                className={`w-full h-[60px] rounded-lg font-bold text-lg transition-all ${
                  isDANGER
                    ? "bg-white text-danger hover:bg-white/90"
                    : "bg-black text-warning hover:bg-black/90"
                }`}
              >
                TAP ANYWHERE or say "OKAY" to acknowledge
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

### 4.7 ModeToggle (REVISED - Keyboard Support)

**Changes:** Added keyboard shortcut hint, larger touch targets.

```tsx
// components/mode-toggle.tsx
"use client"

import { Shield, Wrench } from "lucide-react"
import type { Mode } from "@/app/page"

interface ModeToggleProps {
  mode: Mode
  onModeChange: (mode: Mode) => void
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="bg-surface rounded-lg border border-border p-2">
      <div className="flex">
        <button
          onClick={() => onModeChange("safety")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded transition-all min-h-[48px] ${
            mode === "safety"
              ? "bg-safe text-white"
              : "text-muted-foreground hover:text-foreground hover:bg-surface-light"
          }`}
        >
          <Shield className="w-5 h-5" />
          <span className="font-medium">Safety Monitor</span>
        </button>

        <button
          onClick={() => onModeChange("troubleshoot")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded transition-all min-h-[48px] ${
            mode === "troubleshoot"
              ? "bg-primary text-white"
              : "text-muted-foreground hover:text-foreground hover:bg-surface-light"
          }`}
        >
          <Wrench className="w-5 h-5" />
          <span className="font-medium">Troubleshooter</span>
        </button>
      </div>

      {/* Keyboard hint */}
      <p className="text-center text-xs text-muted-foreground mt-2">
        Press M to switch modes • Say "switch to troubleshooter"
      </p>
    </div>
  )
}
```

---

### 4.8 OnboardingScreen (unchanged from v1)

Same as v1 - the critic approved this component.

---

### 4.9 ErrorStates (NEW)

**Purpose:** Graceful handling of catastrophic failures.

```tsx
// components/error-screen.tsx
"use client"

import { Camera, Mic, Wifi, AlertOctagon, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ErrorType } from "@/app/page"

interface ErrorScreenProps {
  type: ErrorType
  onRetry: () => void
}

export function ErrorScreen({ type, onRetry }: ErrorScreenProps) {
  const config = {
    camera: {
      icon: Camera,
      title: "Sir Reginald Cannot See",
      message: "Camera access was denied or the camera is unavailable.",
      hint: "Please check your browser permissions and ensure your camera is connected.",
      canRetry: true,
    },
    microphone: {
      icon: Mic,
      title: "Sir Reginald Cannot Hear",
      message: "Microphone access was denied or unavailable.",
      hint: "Voice commands won't work, but safety monitoring can continue in visual-only mode.",
      canRetry: true,
    },
    connection: {
      icon: Wifi,
      title: "Connection Lost",
      message: "Unable to connect to Sir Reginald's services.",
      hint: "Please check your internet connection and try again.",
      canRetry: true,
    },
    fatal: {
      icon: AlertOctagon,
      title: "Something Went Wrong",
      message: "An unexpected error occurred.",
      hint: "Please refresh the page and try again. If the problem persists, check your browser console.",
      canRetry: true,
    },
  }

  const { icon: Icon, title, message, hint, canRetry } = config[type]

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Sad tophat */}
        <div className="text-6xl mb-4">🎩</div>
        <div className="text-2xl mb-6">😔</div>

        <Icon className="w-16 h-16 mx-auto mb-4 text-danger" />

        <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
        <p className="text-muted-foreground mb-4">{message}</p>
        <p className="text-sm text-muted-foreground mb-8">{hint}</p>

        {canRetry && (
          <Button
            onClick={onRetry}
            className="bg-primary hover:bg-primary/90 text-white min-h-[60px] px-8 text-lg"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Again
          </Button>
        )}

        {/* Static safety checklist for offline mode */}
        <div className="mt-8 p-4 bg-surface rounded-lg border border-border text-left">
          <h3 className="font-semibold mb-3 text-warning">⚠️ Manual Safety Checklist</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>□ Safety glasses on before operating tools</li>
            <li>□ Work area clear of obstructions</li>
            <li>□ Proper ventilation for fumes</li>
            <li>□ Emergency stop accessible</li>
            <li>□ First aid kit nearby</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
```

---

## 5. CSS & Animations

### 5.1 Global Styles (REVISED)

```css
/* app/globals.css */
@import "tailwindcss";

:root {
  --background: #0f0f0f;
  --foreground: #ffffff;
  --surface: #1a1a1a;
  --surface-light: #252525;
  --border: #333333;
  --primary: #8b5cf6;
  --safe: #22c55e;
  --warning: #eab308;
  --danger: #ef4444;
  --muted-foreground: #a1a1a1;
  --text-muted: #6b7280;
  --radius: 0.5rem;
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Custom animations */
@keyframes pulse-border {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes sound-wave {
  0%, 100% { transform: scaleY(0.3); }
  50% { transform: scaleY(1); }
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-pulse-border {
  animation: pulse-border 2s ease-in-out infinite;
}

.animate-sound-wave {
  animation: sound-wave 0.5s ease-in-out infinite;
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
```

---

## 6. Voice Commands

**CRITICAL:** These must be handled by Gemini, documented here for implementation.

### 6.1 Alert Dismissal

| Phrase | Action |
|--------|--------|
| "okay" | Dismiss current alert |
| "got it" | Dismiss current alert |
| "acknowledged" | Dismiss current alert |
| "thanks" | Dismiss current alert |
| "dismiss" | Dismiss current alert |

### 6.2 Mode Switching

| Phrase | Action |
|--------|--------|
| "switch to troubleshooter" | Change to troubleshoot mode |
| "switch to safety" | Change to safety mode |
| "troubleshoot mode" | Change to troubleshoot mode |
| "safety mode" | Change to safety mode |
| "hey reggie, help me with something" | Change to troubleshoot mode |

### 6.3 General

| Phrase | Action |
|--------|--------|
| "hey reggie" | Wake word (if sleeping) |
| "what do you see?" | Request current status |
| "is it safe?" | Request safety check |

---

## 7. Implementation Notes

### 7.1 Dependencies Required

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "lucide-react": "^0.300.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  }
}
```

### 7.2 Critical Implementation Order

1. **ConnectionScreen** - Users MUST see something during connection
2. **ErrorScreen** - Graceful failures before anything else
3. **SafetyAlertOverlay** - Core functionality
4. **VideoPreview** - Main display
5. **SafetyStatusPanel** - Replace messages with useful info
6. **Voice command handling** - Integrate with Gemini responses

### 7.3 Demo Checklist

Before demo, verify:

- [ ] Connection screen shows during startup
- [ ] Alert auto-dismisses after 8 seconds
- [ ] Alert dismiss button is HUGE and obvious
- [ ] Screen-edge glows green when AI speaks
- [ ] "WATCHING" indicator has ping animation
- [ ] Error screens show static safety checklist
- [ ] M key switches modes
- [ ] Safety status panel updates in real-time

---

## Changes Summary v1 → v2

| Component | Change |
|-----------|--------|
| StatusBar | Session timer → "Last safety check" |
| ConnectionScreen | NEW - shows progress during connection |
| VideoPreview | Simplified attention area, added AI speaking glow |
| AIMessagesPanel | REMOVED - replaced with SafetyStatusPanel |
| SafetyStatusPanel | NEW - real-time safety checklist |
| SafetyAlert → SafetyAlertOverlay | Modal → bottom overlay, 8s auto-dismiss, huge button |
| ModeToggle | Added keyboard shortcut hint, larger buttons |
| ErrorScreen | NEW - graceful catastrophic failure handling |
| Voice Commands | NEW section documenting Gemini integration |

---

*End of UI Design Specification v2*
