# Sir Reginald UI Design Specification v3

**Based on:** Product Spec v6 + Critic's 10/10 Feedback
**Status:** Final Polish for Demo
**Date:** January 15, 2026
**Changes from v2:** Latency indicator, thinking monocle, volume control, sensitivity slider, snooze button, session summary, dark mode, personalization, guided camera setup

---

## Revision Summary (10/10 Polish)

| Feature | Description | Impact |
|---------|-------------|--------|
| **Latency Indicator** | Green/yellow/red dot showing API response time | Trust & transparency |
| **Thinking Monocle** | Animated monocle when API slow >2s | Graceful degradation |
| **Volume Control** | Slider for voice output level | Accessibility |
| **Sensitivity Slider** | Relaxed/Standard/Paranoid | User control |
| **Snooze Button** | 5-min warning suppress | Workflow flexibility |
| **Session Summary** | End-of-session stats modal | Engagement |
| **Dark Mode** | Theme toggle | User preference |
| **Name Capture** | Onboarding asks user's name | Personalization |
| **Camera Setup** | Guided positioning flow | Demo polish |
| **Reconnection UX** | Character dialogue during reconnect | Personality consistency |

---

## Table of Contents

1. [Design System](#1-design-system)
2. [Type Definitions](#2-type-definitions)
3. [Main Page Layout](#3-main-page-layout)
4. [Component Specifications](#4-component-specifications)
   - 4.1 StatusBar (with Latency Indicator)
   - 4.2 LatencyIndicator (NEW)
   - 4.3 ThinkingMonocle (NEW)
   - 4.4 ConnectionScreen
   - 4.5 OnboardingScreen (REVISED - Name Capture)
   - 4.6 CameraSetupScreen (NEW)
   - 4.7 VideoPreview (REVISED)
   - 4.8 SafetyStatusPanel
   - 4.9 VoiceActivityIndicator
   - 4.10 SafetyAlertOverlay (REVISED - with SHOUT)
   - 4.11 ModeToggle
   - 4.12 VolumeControl (NEW)
   - 4.13 SensitivitySlider (NEW)
   - 4.14 SnoozeButton (NEW)
   - 4.15 SessionSummary (NEW)
   - 4.16 ReconnectionOverlay (NEW)
   - 4.17 ErrorStates
   - 4.18 ThemeToggle (NEW - Dark Mode)
5. [CSS & Animations](#5-css--animations)
6. [Voice Commands](#6-voice-commands)
7. [Implementation Notes](#7-implementation-notes)

---

## 1. Design System

### 1.1 Color Palette (CSS Custom Properties)

```css
:root {
  /* Core colors - Light Mode */
  --background: #ffffff;
  --foreground: #0f0f0f;
  --surface: #f5f5f5;
  --surface-light: #ebebeb;
  --border: #e0e0e0;

  /* Brand colors */
  --primary: #8b5cf6;        /* Purple - troubleshoot mode, branding */
  --safe: #22c55e;           /* Green - safety mode, connected, good latency */
  --warning: #eab308;        /* Yellow - caution alerts, moderate latency */
  --danger: #ef4444;         /* Red - critical alerts, slow latency */

  /* Text colors */
  --muted-foreground: #6b7280;
  --text-muted: #9ca3af;

  /* Latency colors */
  --latency-good: #22c55e;
  --latency-moderate: #eab308;
  --latency-slow: #ef4444;

  /* Radius */
  --radius: 0.5rem;
}

/* Dark Mode */
.dark {
  --background: #0f0f0f;
  --foreground: #ffffff;
  --surface: #1a1a1a;
  --surface-light: #252525;
  --border: #333333;
  --muted-foreground: #a1a1a1;
  --text-muted: #6b7280;
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
| Sliders | 48px height | Easy to grab |

---

## 2. Type Definitions

```typescript
// src/types/index.ts

// Core application types
export type ConnectionStatus = "connecting" | "connected" | "reconnecting" | "disconnected" | "error"
export type Mode = "safety" | "troubleshoot"
export type VoiceState = "idle" | "listening" | "ai-speaking"
export type LatencyLevel = "good" | "moderate" | "slow" | "critical"
export type Theme = "light" | "dark"

// Sensitivity levels
export type SensitivityLevel = "relaxed" | "standard" | "paranoid"

// Error types for catastrophic failures
export type ErrorType = "camera" | "microphone" | "connection" | "fatal"

// Safety status
export interface SafetyStatus {
  lastCheck: Date
  eyeProtection: "ok" | "warning" | "unknown"
  handsPosition: "ok" | "warning" | "unknown"
  workspaceClutter: "ok" | "warning" | "unknown"
}

// Alert with SHOUT support
export interface SafetyAlert {
  id: string
  type: "warning" | "danger" | "shout"  // NEW: shout for critical
  message: string
  timestamp: Date
  autoDismissAt: Date
}

// Session summary data
export interface SessionSummary {
  userName: string
  duration: number  // minutes
  safetyInterventions: number
  criticalSaves: number
  troubleshootingRequests: number
  safetyScore: "Excellent" | "Good" | "Needs Attention"
}

// User preferences
export interface UserPreferences {
  volume: number  // 0-100
  sensitivity: SensitivityLevel
  theme: Theme
  userName: string
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
import { OnboardingScreen } from "@/components/onboarding-screen"
import { CameraSetupScreen } from "@/components/camera-setup-screen"
import { VideoPreview } from "@/components/video-preview"
import { SafetyStatusPanel } from "@/components/safety-status-panel"
import { ModeToggle } from "@/components/mode-toggle"
import { VoiceActivityIndicator } from "@/components/voice-activity-indicator"
import { SafetyAlertOverlay } from "@/components/safety-alert-overlay"
import { ThinkingMonocle } from "@/components/thinking-monocle"
import { VolumeControl } from "@/components/volume-control"
import { SensitivitySlider } from "@/components/sensitivity-slider"
import { SnoozeButton } from "@/components/snooze-button"
import { SessionSummary } from "@/components/session-summary"
import { ReconnectionOverlay } from "@/components/reconnection-overlay"
import { ErrorScreen } from "@/components/error-screen"
import { ThemeToggle } from "@/components/theme-toggle"
import type {
  ConnectionStatus, Mode, VoiceState, SafetyAlert,
  SafetyStatus, LatencyLevel, UserPreferences, SessionSummary as SessionSummaryType
} from "@/types"

export default function Home() {
  // Flow state
  const [isOnboarding, setIsOnboarding] = useState(true)
  const [isCameraSetup, setIsCameraSetup] = useState(false)
  const [showSessionSummary, setShowSessionSummary] = useState(false)

  // Connection state
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connecting")
  const [errorType, setErrorType] = useState<ErrorType | null>(null)
  const [latencyLevel, setLatencyLevel] = useState<LatencyLevel>("good")
  const [isThinking, setIsThinking] = useState(false)

  // Mode state
  const [mode, setMode] = useState<Mode>("safety")
  const [voiceState, setVoiceState] = useState<VoiceState>("idle")
  const [activeAlert, setActiveAlert] = useState<SafetyAlert | null>(null)
  const [isSnoozed, setIsSnoozed] = useState(false)
  const [snoozeEndTime, setSnoozeEndTime] = useState<Date | null>(null)

  // Safety status
  const [safetyStatus, setSafetyStatus] = useState<SafetyStatus>({
    lastCheck: new Date(),
    eyeProtection: "unknown",
    handsPosition: "ok",
    workspaceClutter: "ok",
  })

  // User preferences
  const [preferences, setPreferences] = useState<UserPreferences>({
    volume: 80,
    sensitivity: "standard",
    theme: "dark",
    userName: "",
  })

  // Session data
  const [sessionData, setSessionData] = useState<SessionSummaryType>({
    userName: "",
    duration: 0,
    safetyInterventions: 0,
    criticalSaves: 0,
    troubleshootingRequests: 0,
    safetyScore: "Good",
  })

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", preferences.theme === "dark")
  }, [preferences.theme])

  // Keyboard shortcuts for hands-free operation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "m" || e.key === "M") {
        setMode(m => m === "safety" ? "troubleshoot" : "safety")
      }
      if (e.key === "s" || e.key === "S") {
        handleSnooze()
      }
      if (e.key === "Escape" && activeAlert) {
        setActiveAlert(null)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeAlert])

  const handleSnooze = () => {
    setIsSnoozed(true)
    setSnoozeEndTime(new Date(Date.now() + 5 * 60 * 1000)) // 5 minutes
    setTimeout(() => setIsSnoozed(false), 5 * 60 * 1000)
  }

  const handleOnboardingComplete = (userName: string) => {
    setPreferences(p => ({ ...p, userName }))
    setSessionData(s => ({ ...s, userName }))
    setIsOnboarding(false)
    setIsCameraSetup(true)
  }

  const handleCameraSetupComplete = () => {
    setIsCameraSetup(false)
    setConnectionStatus("connected")
  }

  const handleEndSession = () => {
    setShowSessionSummary(true)
  }

  // Show onboarding first
  if (isOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />
  }

  // Show camera setup after onboarding
  if (isCameraSetup) {
    return <CameraSetupScreen
      userName={preferences.userName}
      onComplete={handleCameraSetupComplete}
    />
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
      userName={preferences.userName}
      onConnected={() => setConnectionStatus("connected")}
      onError={(type) => setErrorType(type)}
    />
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <StatusBar
        connectionStatus={connectionStatus}
        latencyLevel={latencyLevel}
        lastSafetyCheck={safetyStatus.lastCheck}
        onRetry={() => setConnectionStatus("connecting")}
        onEndSession={handleEndSession}
      />

      <main className="flex-1 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Main Video Area */}
            <div className="flex-1 space-y-4">
              <div className="relative">
                <VideoPreview
                  mode={mode}
                  isConnected={connectionStatus === "connected"}
                  attentionArea={activeAlert ? "general" : null}
                  isAISpeaking={voiceState === "ai-speaking"}
                  userName={preferences.userName}
                />

                {/* Thinking Monocle Overlay */}
                <ThinkingMonocle isThinking={isThinking} />
              </div>

              <VoiceActivityIndicator state={voiceState} />
              <ModeToggle mode={mode} onModeChange={setMode} />

              {/* Controls Row */}
              <div className="flex flex-wrap gap-4">
                <VolumeControl
                  value={preferences.volume}
                  onChange={(v) => setPreferences(p => ({ ...p, volume: v }))}
                />
                <SensitivitySlider
                  value={preferences.sensitivity}
                  onChange={(s) => setPreferences(p => ({ ...p, sensitivity: s }))}
                />
                <SnoozeButton
                  isSnoozed={isSnoozed}
                  snoozeEndTime={snoozeEndTime}
                  onSnooze={handleSnooze}
                />
                <ThemeToggle
                  theme={preferences.theme}
                  onChange={(t) => setPreferences(p => ({ ...p, theme: t }))}
                />
              </div>
            </div>

            {/* Safety Status Panel */}
            <div className="lg:w-64">
              <SafetyStatusPanel
                status={safetyStatus}
                isSnoozed={isSnoozed}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Safety Alert Overlay */}
      {activeAlert && !isSnoozed && (
        <SafetyAlertOverlay
          alert={activeAlert}
          userName={preferences.userName}
          onDismiss={() => setActiveAlert(null)}
        />
      )}

      {/* Reconnection Overlay */}
      {connectionStatus === "reconnecting" && (
        <ReconnectionOverlay />
      )}

      {/* Session Summary Modal */}
      {showSessionSummary && (
        <SessionSummary
          data={sessionData}
          onClose={() => setShowSessionSummary(false)}
        />
      )}
    </div>
  )
}
```

### 3.2 Layout Pattern (REVISED)

```
+------------------------------------------------------------------------+
|  STATUS BAR - Latency Dot | "Sir Reginald Active" | End Session        |
+------------------------------------------------------------------------+
|                                                                         |
|  +--------------------------------------------------+  +-------------+ |
|  |                                                  |  | SAFETY      | |
|  |         VIDEO PREVIEW (flex-1)                   |  | STATUS      | |
|  |         aspect-[4/3]                             |  | (lg:w-64)   | |
|  |                                                  |  |             | |
|  |    +--------------------------------------+      |  | Eye: OK     | |
|  |    |  THINKING MONOCLE (when >2s latency) |      |  | Hands: OK   | |
|  |    |  "Just a moment..."                  |      |  | Area: OK    | |
|  |    +--------------------------------------+      |  |             | |
|  |                                                  |  | SNOOZED:    | |
|  |  [SIR REGINALD WATCHING] [Recording]            |  | 4:32        | |
|  +--------------------------------------------------+  +-------------+ |
|  +--------------------------------------------------+                  |
|  |         VOICE ACTIVITY                           |                  |
|  +--------------------------------------------------+                  |
|  +--------------------------------------------------+                  |
|  |  [Safety Monitor]  [Troubleshooter]  (M key)     |                  |
|  +--------------------------------------------------+                  |
|  +--------------------------------------------------+                  |
|  | [Volume] [Sensitivity] [Snooze 5m] [Theme]       |                  |
|  +--------------------------------------------------+                  |
|                                                                         |
+------------------------------------------------------------------------+
```

---

## 4. Component Specifications

### 4.1 StatusBar (with Latency Indicator)

```tsx
// components/status-bar.tsx
"use client"

import { RefreshCw, Clock, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LatencyIndicator } from "./latency-indicator"
import type { ConnectionStatus, LatencyLevel } from "@/types"

interface StatusBarProps {
  connectionStatus: ConnectionStatus
  latencyLevel: LatencyLevel
  lastSafetyCheck: Date
  onRetry: () => void
  onEndSession: () => void
}

export function StatusBar({
  connectionStatus,
  latencyLevel,
  lastSafetyCheck,
  onRetry,
  onEndSession
}: StatusBarProps) {
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
          <div className="flex items-center gap-3">
            <LatencyIndicator level={latencyLevel} />
            <span className="text-sm font-medium">Sir Reginald Active</span>
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
            <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
            <span className="text-sm text-warning">Reconnecting...</span>
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
    <header className="h-14 bg-surface border-b border-border px-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        {getConnectionIndicator()}
      </div>

      <div className="flex items-center gap-6">
        {/* Last safety check */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="text-sm">Last check:</span>
          <span className="text-sm font-medium text-foreground">
            {formatLastCheck(lastSafetyCheck)}
          </span>
        </div>

        {/* End Session Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onEndSession}
          className="text-muted-foreground hover:text-foreground"
        >
          <LogOut className="w-4 h-4 mr-2" />
          End Session
        </Button>
      </div>
    </header>
  )
}
```

---

### 4.2 LatencyIndicator (NEW)

```tsx
// components/latency-indicator.tsx
"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { LatencyLevel } from "@/types"

interface LatencyIndicatorProps {
  level: LatencyLevel
}

const LATENCY_CONFIG = {
  good: {
    color: "bg-safe",
    label: "Excellent Response Time",
    description: "<800ms - Sir Reginald is watching closely"
  },
  moderate: {
    color: "bg-warning",
    label: "Moderate Latency",
    description: "800-1500ms - Slight delay in responses"
  },
  slow: {
    color: "bg-danger",
    label: "High Latency",
    description: "1500-2000ms - Responses may be delayed"
  },
  critical: {
    color: "bg-danger animate-pulse",
    label: "Critical Latency",
    description: ">2000ms - Connection issues detected"
  }
}

export function LatencyIndicator({ level }: LatencyIndicatorProps) {
  const config = LATENCY_CONFIG[level]

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 cursor-help">
            <span className={`w-3 h-3 rounded-full ${config.color}`} />
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <p className="font-semibold">{config.label}</p>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
```

---

### 4.3 ThinkingMonocle (NEW)

```tsx
// components/thinking-monocle.tsx
"use client"

interface ThinkingMonocleProps {
  isThinking: boolean
}

const THINKING_PHRASES = [
  "Just a moment whilst I examine this properly...",
  "Hmm, let me have a closer look...",
  "One moment, if you please...",
  "Processing... rather like waiting for tea to steep...",
]

export function ThinkingMonocle({ isThinking }: ThinkingMonocleProps) {
  if (!isThinking) return null

  const phrase = THINKING_PHRASES[Math.floor(Math.random() * THINKING_PHRASES.length)]

  return (
    <div className="absolute inset-0 flex items-center justify-center z-40 bg-black/30 backdrop-blur-sm rounded-lg">
      <div className="bg-surface rounded-xl p-6 shadow-2xl border border-border max-w-sm mx-4">
        <div className="flex items-center gap-4">
          {/* Animated monocle */}
          <div className="text-5xl animate-bounce">
            <span className="inline-block animate-pulse">
              <span role="img" aria-label="thinking">&#129488;</span>
            </span>
          </div>

          <div className="flex-1">
            <p className="font-semibold text-foreground mb-1">
              Sir Reginald is contemplating...
            </p>
            <p className="text-sm text-muted-foreground italic">
              "{phrase}"
            </p>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mt-4 h-1 bg-surface-light rounded-full overflow-hidden">
          <div className="h-full bg-primary animate-thinking-progress" />
        </div>
      </div>
    </div>
  )
}
```

---

### 4.4 ConnectionScreen

```tsx
// components/connection-screen.tsx
"use client"

import { useState, useEffect } from "react"
import type { ErrorType } from "@/types"

interface ConnectionScreenProps {
  userName: string
  onConnected: () => void
  onError: (type: ErrorType) => void
}

export function ConnectionScreen({ userName, onConnected, onError }: ConnectionScreenProps) {
  const [stage, setStage] = useState<"camera" | "gemini" | "ready">("camera")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
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
        return `Waking Sir Reginald for ${userName}...`
      case "ready":
        return "Ready!"
    }
  }

  const getQuote = () => {
    switch (stage) {
      case "camera":
        return "Just a moment whilst I find my spectacles..."
      case "gemini":
        return "Ah, preparing the workshop observation equipment..."
      case "ready":
        return `Splendid! Ready to assist you, ${userName}.`
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md mx-4">
        {/* Animated tophat */}
        <div className="text-7xl mb-6 animate-bounce">
          <span role="img" aria-label="top hat">&#127913;</span>
        </div>

        <h2 className="text-xl font-semibold text-foreground mb-2">
          {getMessage()}
        </h2>

        {/* Progress bar */}
        <div className="w-64 h-2 bg-surface rounded-full overflow-hidden mb-4 mx-auto">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-muted-foreground text-sm italic">
          "{getQuote()}"
        </p>
      </div>
    </div>
  )
}
```

---

### 4.5 OnboardingScreen (REVISED - Name Capture)

```tsx
// components/onboarding-screen.tsx
"use client"

import { useState } from "react"
import { Check, Camera, Mic, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface OnboardingScreenProps {
  onComplete: (userName: string) => void
}

type Step = "permissions" | "name" | "ready"

interface Permission {
  id: string
  label: string
  icon: React.ReactNode
  granted: boolean
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState<Step>("permissions")
  const [userName, setUserName] = useState("")
  const [permissions, setPermissions] = useState<Permission[]>([
    { id: "camera", label: "Camera Access", icon: <Camera className="w-5 h-5" />, granted: false },
    { id: "microphone", label: "Microphone Access", icon: <Mic className="w-5 h-5" />, granted: false },
    { id: "speaker", label: "Speaker Access", icon: <Volume2 className="w-5 h-5" />, granted: false },
  ])

  const handleRequestPermissions = async () => {
    try {
      // Request camera
      await navigator.mediaDevices.getUserMedia({ video: true })
      setPermissions(p => p.map(perm =>
        perm.id === "camera" ? { ...perm, granted: true } : perm
      ))

      // Request microphone
      await navigator.mediaDevices.getUserMedia({ audio: true })
      setPermissions(p => p.map(perm =>
        perm.id === "microphone" ? { ...perm, granted: true } : perm
      ))

      // Speaker is always available
      setPermissions(p => p.map(perm =>
        perm.id === "speaker" ? { ...perm, granted: true } : perm
      ))

      // Move to name step
      setTimeout(() => setStep("name"), 500)
    } catch (err) {
      console.error("Permission denied:", err)
    }
  }

  const handleNameSubmit = () => {
    if (userName.trim()) {
      setStep("ready")
      setTimeout(() => onComplete(userName.trim()), 1500)
    }
  }

  const allPermissionsGranted = permissions.every(p => p.granted)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">
            <span role="img" aria-label="top hat">&#127913;</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Welcome to Sir Reginald
          </h1>
          <p className="text-muted-foreground">
            Your Distinguished Workshop Guardian
          </p>
        </div>

        {/* Permissions Step */}
        {step === "permissions" && (
          <div className="bg-surface rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold mb-4">
              Grant Permissions
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Sir Reginald needs access to watch over your workshop.
            </p>

            <div className="space-y-3 mb-6">
              {permissions.map(perm => (
                <div
                  key={perm.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    perm.granted
                      ? "border-safe bg-safe/10"
                      : "border-border bg-surface-light"
                  }`}
                >
                  <div className={perm.granted ? "text-safe" : "text-muted-foreground"}>
                    {perm.granted ? <Check className="w-5 h-5" /> : perm.icon}
                  </div>
                  <span className={perm.granted ? "text-safe" : "text-foreground"}>
                    {perm.label}
                  </span>
                </div>
              ))}
            </div>

            <Button
              onClick={handleRequestPermissions}
              disabled={allPermissionsGranted}
              className="w-full h-12 bg-primary hover:bg-primary/90"
            >
              {allPermissionsGranted ? "Permissions Granted!" : "Grant Permissions"}
            </Button>
          </div>
        )}

        {/* Name Step */}
        {step === "name" && (
          <div className="bg-surface rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold mb-4">
              What shall I call you?
            </h2>
            <p className="text-sm text-muted-foreground mb-6 italic">
              "I should very much like to know with whom I have the pleasure of working."
            </p>

            <Input
              type="text"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
              className="mb-4 h-12 text-lg"
              autoFocus
            />

            <Button
              onClick={handleNameSubmit}
              disabled={!userName.trim()}
              className="w-full h-12 bg-primary hover:bg-primary/90"
            >
              Continue
            </Button>
          </div>
        )}

        {/* Ready Step */}
        {step === "ready" && (
          <div className="bg-surface rounded-lg border border-border p-6 text-center">
            <div className="text-4xl mb-4">
              <span role="img" aria-label="monocle">&#129488;</span>
            </div>
            <h2 className="text-lg font-semibold mb-2">
              Excellent, {userName}!
            </h2>
            <p className="text-sm text-muted-foreground italic">
              "A fine name indeed. Let us proceed to set up your workshop camera."
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
```

---

### 4.6 CameraSetupScreen (NEW)

```tsx
// components/camera-setup-screen.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight, RotateCcw } from "lucide-react"

interface CameraSetupScreenProps {
  userName: string
  onComplete: () => void
}

type SetupStage = "greeting" | "positioning" | "survey" | "complete"

const STAGE_DIALOGUE = {
  greeting: {
    quote: "Ah, splendid! I can see you now. Before we begin, let us ensure I have a proper view of your workspace.",
    instruction: "Position your camera to show your work area"
  },
  positioning: {
    quote: "If you wouldn't mind, position your camera so I can see your primary work surface - that's where the action will be, so to speak.",
    instruction: "I should be able to see from your hands down to the tool in front of you"
  },
  survey: {
    quote: "Right then, let me have a look around... I see a fine workspace taking shape.",
    instruction: "Surveying your workshop..."
  },
  complete: {
    quote: "Excellent! I believe I have a proper lay of the land now. Shall we begin?",
    instruction: "Camera setup complete"
  }
}

export function CameraSetupScreen({ userName, onComplete }: CameraSetupScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stage, setStage] = useState<SetupStage>("greeting")
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
        console.error("Camera access failed:", err)
      }
    }
    setupVideo()

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach(track => track.stop())
      }
    }
  }, [])

  const handleNextStage = () => {
    const stages: SetupStage[] = ["greeting", "positioning", "survey", "complete"]
    const currentIndex = stages.indexOf(stage)
    if (currentIndex < stages.length - 1) {
      setStage(stages[currentIndex + 1])
    }
  }

  const dialogue = STAGE_DIALOGUE[stage]

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">
            <span role="img" aria-label="monocle">&#129488;</span>
          </div>
          <h1 className="text-xl font-semibold text-foreground">
            Camera Setup
          </h1>
        </div>

        {/* Video Preview */}
        <div className="relative aspect-[4/3] bg-surface rounded-lg border-2 border-border overflow-hidden mb-6">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {!hasVideo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-muted-foreground">Loading camera...</p>
            </div>
          )}

          {/* Guide overlay */}
          {stage === "positioning" && (
            <div className="absolute inset-8 border-2 border-dashed border-primary/50 rounded-lg">
              <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                Position your workspace within this frame
              </div>
            </div>
          )}

          {/* Survey animation */}
          {stage === "survey" && (
            <div className="absolute inset-0 bg-primary/10 animate-pulse">
              <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 rounded text-sm text-white flex items-center gap-2">
                <RotateCcw className="w-4 h-4 animate-spin" />
                Surveying...
              </div>
            </div>
          )}
        </div>

        {/* Dialogue Box */}
        <div className="bg-surface rounded-lg border border-border p-6 mb-6">
          <p className="text-foreground italic mb-2">
            "{dialogue.quote}"
          </p>
          <p className="text-sm text-muted-foreground">
            {dialogue.instruction}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {stage !== "complete" ? (
            <Button
              onClick={handleNextStage}
              className="flex-1 h-14 bg-primary hover:bg-primary/90 text-lg"
            >
              {stage === "survey" ? (
                <>Looks Good</>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={onComplete}
              className="flex-1 h-14 bg-safe hover:bg-safe/90 text-lg text-white"
            >
              <Check className="w-5 h-5 mr-2" />
              Begin Monitoring, {userName}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
```

---

### 4.7 VideoPreview (REVISED)

```tsx
// components/video-preview.tsx
"use client"

import { useRef, useEffect, useState } from "react"
import { Shield, Wrench } from "lucide-react"
import type { Mode } from "@/types"

interface VideoPreviewProps {
  mode: Mode
  isConnected: boolean
  attentionArea: "general" | null
  isAISpeaking?: boolean
  userName: string
}

export function VideoPreview({
  mode,
  isConnected,
  attentionArea,
  isAISpeaking,
  userName
}: VideoPreviewProps) {
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
              <div className="text-4xl mb-2">
                <span role="img" aria-label="top hat">&#127913;</span>
              </div>
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

        {/* Watching Indicator - Top Right */}
        {isConnected && (
          <div className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 bg-black/60 rounded text-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-danger" />
            </span>
            <span className="text-white/90">SIR REGINALD WATCHING</span>
          </div>
        )}

        {/* Personalized greeting */}
        {isConnected && userName && (
          <div className="absolute bottom-3 left-3 text-white/70 text-xs bg-black/50 px-2 py-1 rounded">
            Watching over {userName}'s workshop
          </div>
        )}

        {/* Attention Area */}
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

### 4.8 SafetyStatusPanel (with Snooze indicator)

```tsx
// components/safety-status-panel.tsx
"use client"

import { Check, AlertTriangle, HelpCircle, Clock, Moon } from "lucide-react"
import type { SafetyStatus } from "@/types"

interface SafetyStatusPanelProps {
  status: SafetyStatus
  isSnoozed: boolean
}

export function SafetyStatusPanel({ status, isSnoozed }: SafetyStatusPanelProps) {
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
    return <span className="text-muted-foreground">-</span>
  }

  return (
    <div className="bg-surface rounded-lg border border-border">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold flex items-center gap-2">
          <span className="text-xl">
            <span role="img" aria-label="top hat">&#127913;</span>
          </span>
          Safety Status
        </h2>
      </div>

      {/* Snooze Banner */}
      {isSnoozed && (
        <div className="px-4 py-2 bg-warning/10 border-b border-warning/20 flex items-center gap-2 text-warning text-sm">
          <Moon className="w-4 h-4" />
          <span>Warnings snoozed</span>
        </div>
      )}

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

### 4.9 VoiceActivityIndicator

```tsx
// components/voice-activity-indicator.tsx
"use client"

import { Mic, Volume2 } from "lucide-react"
import type { VoiceState } from "@/types"

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
          <span className="text-sm text-muted-foreground">
            Ready - say "Hey Reggie" or press M to switch modes
          </span>
        </div>
      )}
    </div>
  )
}
```

---

### 4.10 SafetyAlertOverlay (REVISED - with SHOUT)

```tsx
// components/safety-alert-overlay.tsx
"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, XCircle, AlertOctagon } from "lucide-react"
import type { SafetyAlert } from "@/types"

interface SafetyAlertOverlayProps {
  alert: SafetyAlert
  userName: string
  onDismiss: () => void
}

export function SafetyAlertOverlay({ alert, userName, onDismiss }: SafetyAlertOverlayProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(
    alert.type === "shout" ? 10 : 8
  )

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

  const isShout = alert.type === "shout"
  const isDanger = alert.type === "danger" || isShout

  const bgColor = isShout
    ? "bg-danger"
    : isDanger
    ? "bg-danger/95"
    : "bg-warning/95"

  const textColor = isDanger ? "text-white" : "text-black"

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-3xl mx-auto">
        <div className={`${bgColor} rounded-lg p-4 shadow-2xl animate-slide-up ${
          isShout ? "animate-shake" : ""
        }`}>
          <div className="flex items-start gap-4">
            {isShout ? (
              <AlertOctagon className={`w-10 h-10 ${textColor} shrink-0 animate-pulse`} />
            ) : isDanger ? (
              <XCircle className={`w-8 h-8 ${textColor} shrink-0`} />
            ) : (
              <AlertTriangle className={`w-8 h-8 ${textColor} shrink-0`} />
            )}

            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className={`${isShout ? "text-2xl" : "text-lg"} font-bold ${textColor}`}>
                  {isShout ? (
                    <>{userName.toUpperCase()}! STOP!</>
                  ) : isDanger ? (
                    "SAFETY ALERT"
                  ) : (
                    "SAFETY NOTICE"
                  )}
                </h3>
                <span className={`text-sm ${textColor} opacity-80`}>
                  Auto-dismiss in {secondsRemaining}s
                </span>
              </div>

              <p className={`${textColor} leading-relaxed mb-4 ${isShout ? "text-lg" : ""}`}>
                "{alert.message}"
              </p>

              {/* HUGE touch target */}
              <button
                onClick={onDismiss}
                className={`w-full h-[60px] rounded-lg font-bold text-lg transition-all ${
                  isDanger
                    ? "bg-white text-danger hover:bg-white/90"
                    : "bg-black text-warning hover:bg-black/90"
                }`}
              >
                TAP or say "OKAY" to acknowledge
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

### 4.11 ModeToggle

```tsx
// components/mode-toggle.tsx
"use client"

import { Shield, Wrench } from "lucide-react"
import type { Mode } from "@/types"

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

      <p className="text-center text-xs text-muted-foreground mt-2">
        Press M to switch modes
      </p>
    </div>
  )
}
```

---

### 4.12 VolumeControl (NEW)

```tsx
// components/volume-control.tsx
"use client"

import { Volume2, VolumeX } from "lucide-react"
import { Slider } from "@/components/ui/slider"

interface VolumeControlProps {
  value: number
  onChange: (value: number) => void
}

export function VolumeControl({ value, onChange }: VolumeControlProps) {
  const isMuted = value === 0

  const handleToggleMute = () => {
    onChange(isMuted ? 80 : 0)
  }

  return (
    <div className="flex items-center gap-3 bg-surface rounded-lg border border-border p-3 min-w-[200px]">
      <button
        onClick={handleToggleMute}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </button>

      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        max={100}
        step={5}
        className="flex-1"
      />

      <span className="text-sm text-muted-foreground w-10 text-right">
        {value}%
      </span>
    </div>
  )
}
```

---

### 4.13 SensitivitySlider (NEW)

```tsx
// components/sensitivity-slider.tsx
"use client"

import { ShieldCheck, Shield, ShieldAlert } from "lucide-react"
import type { SensitivityLevel } from "@/types"

interface SensitivitySliderProps {
  value: SensitivityLevel
  onChange: (value: SensitivityLevel) => void
}

const SENSITIVITY_CONFIG = {
  relaxed: {
    icon: ShieldCheck,
    label: "Relaxed",
    description: "Only critical dangers",
    color: "text-safe"
  },
  standard: {
    icon: Shield,
    label: "Standard",
    description: "Balanced monitoring",
    color: "text-primary"
  },
  paranoid: {
    icon: ShieldAlert,
    label: "Paranoid",
    description: "Maximum vigilance",
    color: "text-warning"
  }
}

export function SensitivitySlider({ value, onChange }: SensitivitySliderProps) {
  const config = SENSITIVITY_CONFIG[value]
  const Icon = config.icon

  const levels: SensitivityLevel[] = ["relaxed", "standard", "paranoid"]
  const currentIndex = levels.indexOf(value)

  const handleClick = () => {
    const nextIndex = (currentIndex + 1) % levels.length
    onChange(levels[nextIndex])
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-3 bg-surface rounded-lg border border-border p-3 min-w-[180px] hover:bg-surface-light transition-colors"
    >
      <Icon className={`w-5 h-5 ${config.color}`} />
      <div className="text-left">
        <p className="text-sm font-medium">{config.label}</p>
        <p className="text-xs text-muted-foreground">{config.description}</p>
      </div>
    </button>
  )
}
```

---

### 4.14 SnoozeButton (NEW)

```tsx
// components/snooze-button.tsx
"use client"

import { useState, useEffect } from "react"
import { Moon, MoonOff } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SnoozeButtonProps {
  isSnoozed: boolean
  snoozeEndTime: Date | null
  onSnooze: () => void
}

export function SnoozeButton({ isSnoozed, snoozeEndTime, onSnooze }: SnoozeButtonProps) {
  const [timeRemaining, setTimeRemaining] = useState("")

  useEffect(() => {
    if (!isSnoozed || !snoozeEndTime) {
      setTimeRemaining("")
      return
    }

    const interval = setInterval(() => {
      const remaining = Math.max(0, snoozeEndTime.getTime() - Date.now())
      const minutes = Math.floor(remaining / 60000)
      const seconds = Math.floor((remaining % 60000) / 1000)
      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, "0")}`)
    }, 1000)

    return () => clearInterval(interval)
  }, [isSnoozed, snoozeEndTime])

  return (
    <Button
      variant={isSnoozed ? "secondary" : "outline"}
      onClick={onSnooze}
      disabled={isSnoozed}
      className={`min-w-[140px] h-12 ${
        isSnoozed ? "bg-warning/20 text-warning border-warning/30" : ""
      }`}
    >
      {isSnoozed ? (
        <>
          <MoonOff className="w-4 h-4 mr-2" />
          Snoozed {timeRemaining}
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 mr-2" />
          Snooze 5m
        </>
      )}
    </Button>
  )
}
```

---

### 4.15 SessionSummary (NEW)

```tsx
// components/session-summary.tsx
"use client"

import { X, Download, Star, Shield, AlertTriangle, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { SessionSummary as SessionSummaryType } from "@/types"

interface SessionSummaryProps {
  data: SessionSummaryType
  onClose: () => void
}

const SCORE_CONFIG = {
  "Excellent": {
    color: "text-safe",
    bgColor: "bg-safe/10",
    stars: 5,
    quote: "I must say, it's been a pleasure watching a careful craftsperson at work."
  },
  "Good": {
    color: "text-primary",
    bgColor: "bg-primary/10",
    stars: 4,
    quote: "Well done overall, though there's always room for improvement."
  },
  "Needs Attention": {
    color: "text-warning",
    bgColor: "bg-warning/10",
    stars: 2,
    quote: "Do keep those safety fundamentals in mind next time, won't you?"
  }
}

export function SessionSummary({ data, onClose }: SessionSummaryProps) {
  const config = SCORE_CONFIG[data.safetyScore]

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const handleExport = () => {
    const text = `
Sir Reginald Session Summary
============================
User: ${data.userName}
Duration: ${formatDuration(data.duration)}
Safety Interventions: ${data.safetyInterventions}
Critical Saves: ${data.criticalSaves}
Troubleshooting Requests: ${data.troubleshootingRequests}
Safety Score: ${data.safetyScore}

"${config.quote}"
- Sir Reginald Makesworth III
    `.trim()

    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `sir-reginald-session-${new Date().toISOString().split("T")[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface rounded-xl border border-border max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span role="img" aria-label="top hat">&#127913;</span>
            Session Complete
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Greeting */}
          <p className="text-foreground mb-4">
            Well then, <span className="font-semibold">{data.userName}</span>, we've had quite the productive session.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-surface-light rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Shield className="w-4 h-4" />
                <span className="text-xs">Duration</span>
              </div>
              <p className="text-xl font-bold">{formatDuration(data.duration)}</p>
            </div>

            <div className="bg-surface-light rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs">Interventions</span>
              </div>
              <p className="text-xl font-bold">{data.safetyInterventions}</p>
            </div>

            <div className="bg-surface-light rounded-lg p-3">
              <div className="flex items-center gap-2 text-danger mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs">Critical Saves</span>
              </div>
              <p className="text-xl font-bold text-danger">{data.criticalSaves}</p>
            </div>

            <div className="bg-surface-light rounded-lg p-3">
              <div className="flex items-center gap-2 text-primary mb-1">
                <Wrench className="w-4 h-4" />
                <span className="text-xs">Troubleshoot</span>
              </div>
              <p className="text-xl font-bold">{data.troubleshootingRequests}</p>
            </div>
          </div>

          {/* Safety Score */}
          <div className={`${config.bgColor} rounded-lg p-4 mb-6`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Safety Score</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < config.stars ? config.color : "text-muted-foreground/30"
                    }`}
                    fill={i < config.stars ? "currentColor" : "none"}
                  />
                ))}
              </div>
            </div>
            <p className={`text-lg font-bold ${config.color}`}>
              {data.safetyScore}
            </p>
          </div>

          {/* Quote */}
          <p className="text-sm text-muted-foreground italic mb-6">
            "{config.quote}"
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={handleExport} variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={onClose} className="flex-1 bg-primary hover:bg-primary/90">
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

### 4.16 ReconnectionOverlay (NEW)

```tsx
// components/reconnection-overlay.tsx
"use client"

import { useState, useEffect } from "react"
import { RefreshCw } from "lucide-react"

const RECONNECT_DIALOGUE = [
  "Just a moment - the telegraph wires seem to have crossed...",
  "Ah, technical difficulties. Rather like when the gas lamps flickered at Windsor...",
  "Bear with me - I'm attempting to re-establish communication...",
  "Almost there... the connection is being restored..."
]

export function ReconnectionOverlay() {
  const [dialogueIndex, setDialogueIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setDialogueIndex(i => (i + 1) % RECONNECT_DIALOGUE.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface rounded-xl border border-border p-8 max-w-md mx-4 text-center">
        <div className="text-5xl mb-4 animate-bounce">
          <span role="img" aria-label="monocle">&#129488;</span>
        </div>

        <div className="flex items-center justify-center gap-3 mb-4">
          <RefreshCw className="w-5 h-5 text-primary animate-spin" />
          <span className="font-semibold">Reconnecting...</span>
        </div>

        <p className="text-muted-foreground italic">
          "{RECONNECT_DIALOGUE[dialogueIndex]}"
        </p>
      </div>
    </div>
  )
}
```

---

### 4.17 ErrorStates

```tsx
// components/error-screen.tsx
"use client"

import { Camera, Mic, Wifi, AlertOctagon, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ErrorType } from "@/types"

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
      quote: "Hmm, my monocle seems to have fogged up - I've lost sight of you.",
      canRetry: true,
    },
    microphone: {
      icon: Mic,
      title: "Sir Reginald Cannot Hear",
      message: "Microphone access was denied or unavailable.",
      hint: "Voice commands won't work, but safety monitoring can continue in visual-only mode.",
      quote: "I say, I can no longer hear you. Rather like being at the opera with cotton in one's ears.",
      canRetry: true,
    },
    connection: {
      icon: Wifi,
      title: "Connection Lost",
      message: "Unable to connect to Sir Reginald's services.",
      hint: "Please check your internet connection and try again.",
      quote: "I'm terribly sorry, but the connection has become rather unreliable.",
      canRetry: true,
    },
    fatal: {
      icon: AlertOctagon,
      title: "Something Went Wrong",
      message: "An unexpected error occurred.",
      hint: "Please refresh the page and try again.",
      quote: "Well, that's rather peculiar. Something seems to have gone awry.",
      canRetry: true,
    },
  }

  const { icon: Icon, title, message, hint, quote, canRetry } = config[type]

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Sad tophat */}
        <div className="text-6xl mb-2">
          <span role="img" aria-label="top hat">&#127913;</span>
        </div>
        <div className="text-3xl mb-6">
          <span role="img" aria-label="sad">&#128546;</span>
        </div>

        <Icon className="w-16 h-16 mx-auto mb-4 text-danger" />

        <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
        <p className="text-muted-foreground mb-2">{message}</p>
        <p className="text-sm text-muted-foreground mb-4">{hint}</p>

        <p className="text-sm text-muted-foreground italic mb-8">
          "{quote}"
        </p>

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
          <h3 className="font-semibold mb-3 text-warning flex items-center gap-2">
            <AlertOctagon className="w-4 h-4" />
            Manual Safety Checklist
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>[ ] Safety glasses on before operating tools</li>
            <li>[ ] Work area clear of obstructions</li>
            <li>[ ] Proper ventilation for fumes</li>
            <li>[ ] Emergency stop accessible</li>
            <li>[ ] First aid kit nearby</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
```

---

### 4.18 ThemeToggle (NEW - Dark Mode)

```tsx
// components/theme-toggle.tsx
"use client"

import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Theme } from "@/types"

interface ThemeToggleProps {
  theme: Theme
  onChange: (theme: Theme) => void
}

export function ThemeToggle({ theme, onChange }: ThemeToggleProps) {
  const handleToggle = () => {
    onChange(theme === "dark" ? "light" : "dark")
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      className="w-12 h-12"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </Button>
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
  --background: #ffffff;
  --foreground: #0f0f0f;
  --surface: #f5f5f5;
  --surface-light: #ebebeb;
  --border: #e0e0e0;
  --primary: #8b5cf6;
  --safe: #22c55e;
  --warning: #eab308;
  --danger: #ef4444;
  --muted-foreground: #6b7280;
  --text-muted: #9ca3af;
  --radius: 0.5rem;
}

.dark {
  --background: #0f0f0f;
  --foreground: #ffffff;
  --surface: #1a1a1a;
  --surface-light: #252525;
  --border: #333333;
  --muted-foreground: #a1a1a1;
  --text-muted: #6b7280;
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

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

@keyframes thinking-progress {
  0% { width: 0%; }
  50% { width: 70%; }
  100% { width: 100%; }
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

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

.animate-thinking-progress {
  animation: thinking-progress 3s ease-in-out infinite;
}
```

---

## 6. Voice Commands

### 6.1 Alert Dismissal

| Phrase | Action |
|--------|--------|
| "okay" | Dismiss current alert |
| "got it" | Dismiss current alert |
| "acknowledged" | Dismiss current alert |
| "thanks" / "thank you" | Dismiss current alert |
| "dismiss" | Dismiss current alert |

### 6.2 Mode Switching

| Phrase | Action |
|--------|--------|
| "switch to troubleshooter" | Change to troubleshoot mode |
| "switch to safety" | Change to safety mode |
| "troubleshoot mode" | Change to troubleshoot mode |
| "safety mode" | Change to safety mode |
| "hey reggie, help me with something" | Change to troubleshoot mode |

### 6.3 Controls

| Phrase | Action |
|--------|--------|
| "snooze" | Snooze warnings for 5 minutes |
| "mute" | Mute audio output |
| "unmute" | Unmute audio output |
| "louder" | Increase volume |
| "quieter" | Decrease volume |

### 6.4 General

| Phrase | Action |
|--------|--------|
| "hey reggie" | Wake word (if sleeping) |
| "what do you see?" | Request current status |
| "is it safe?" | Request safety check |
| "end session" | Trigger session summary |

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
    "tailwind-merge": "^2.0.0",
    "@radix-ui/react-slider": "^1.1.0",
    "@radix-ui/react-tooltip": "^1.0.0"
  }
}
```

### 7.2 Critical Implementation Order

1. **OnboardingScreen** - Name capture first
2. **CameraSetupScreen** - Guided positioning
3. **ConnectionScreen** - Loading with personality
4. **VideoPreview** - Main display with latency indicator
5. **ThinkingMonocle** - Graceful degradation
6. **SafetyAlertOverlay** - Including SHOUT mode
7. **Controls Row** - Volume, sensitivity, snooze, theme
8. **SessionSummary** - End of session stats
9. **ReconnectionOverlay** - Character dialogue
10. **ErrorScreen** - Graceful failures

### 7.3 Demo Checklist

Before demo, verify:

- [ ] Name capture works and name appears in UI
- [ ] Camera setup flow is theatrical
- [ ] Connection screen shows during startup
- [ ] Latency indicator shows green when connected
- [ ] Thinking monocle appears when latency >2s
- [ ] Alert auto-dismisses after 8 seconds
- [ ] SHOUT alert has shake animation
- [ ] Alert dismiss button is HUGE and obvious
- [ ] Screen-edge glows green when AI speaks
- [ ] "WATCHING" indicator has ping animation
- [ ] Volume slider works
- [ ] Sensitivity toggle cycles through levels
- [ ] Snooze button shows countdown
- [ ] Dark mode toggle works
- [ ] Session summary shows stats
- [ ] Reconnection overlay shows character dialogue
- [ ] Error screens show static safety checklist
- [ ] M key switches modes
- [ ] S key triggers snooze
- [ ] Escape dismisses alerts

---

## Changes Summary v2 -> v3

| Component | Change |
|-----------|--------|
| StatusBar | Added latency indicator, end session button |
| LatencyIndicator | NEW - green/yellow/red dot with tooltip |
| ThinkingMonocle | NEW - animated overlay when >2s latency |
| OnboardingScreen | Added name capture step |
| CameraSetupScreen | NEW - guided camera positioning |
| VideoPreview | Added personalized greeting, AI speaking glow |
| SafetyStatusPanel | Added snooze indicator |
| SafetyAlertOverlay | Added SHOUT type with shake animation |
| VolumeControl | NEW - slider with mute toggle |
| SensitivitySlider | NEW - Relaxed/Standard/Paranoid |
| SnoozeButton | NEW - 5 minute warning suppress |
| SessionSummary | NEW - end of session stats modal |
| ReconnectionOverlay | NEW - character dialogue during reconnect |
| ThemeToggle | NEW - dark/light mode |
| CSS | Added shake, thinking-progress animations |
| Types | Added LatencyLevel, SensitivityLevel, UserPreferences |

---

*End of UI Design Specification v3 - Sir Reginald (10/10 Polish)*
