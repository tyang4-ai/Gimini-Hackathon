# Sir Reginald UI Design Specification v1

**Based on:** v0 Mockup Implementation
**Status:** Reference Design (code to be adapted during implementation)
**Date:** January 15, 2026

---

## Table of Contents

1. [Design System](#1-design-system)
2. [Type Definitions](#2-type-definitions)
3. [Main Page Layout](#3-main-page-layout)
4. [Component Specifications](#4-component-specifications)
5. [CSS & Animations](#5-css--animations)
6. [Implementation Notes](#6-implementation-notes)

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

### 1.3 Tailwind Color Classes

| Class | Color | Usage |
|-------|-------|-------|
| `bg-background` | `#0f0f0f` | Main page background |
| `bg-surface` | `#1a1a1a` | Cards, panels |
| `bg-surface-light` | `#252525` | Hover states, secondary surfaces |
| `text-safe` | `#22c55e` | Connected status, safety mode |
| `text-warning` | `#eab308` | Warning alerts |
| `text-danger` | `#ef4444` | Danger alerts |
| `text-primary` | `#8b5cf6` | Troubleshoot mode, accents |
| `text-muted-foreground` | `#a1a1a1` | Secondary text |
| `border-border` | `#333333` | Subtle borders |

---

## 2. Type Definitions

```typescript
// Core application types
export type ConnectionStatus = "connected" | "connecting" | "reconnecting" | "disconnected"
export type Mode = "safety" | "troubleshoot"
export type VoiceState = "idle" | "listening" | "ai-speaking"

export interface Message {
  id: string
  text: string
  timestamp: Date
  type: "info" | "warning" | "danger"
}
```

---

## 3. Main Page Layout

### 3.1 Page Structure

```tsx
// app/page.tsx
"use client"

import { useState } from "react"
import { StatusBar } from "@/components/status-bar"
import { VideoPreview } from "@/components/video-preview"
import { AIMessagesPanel } from "@/components/ai-messages-panel"
import { ModeToggle } from "@/components/mode-toggle"
import { VoiceActivityIndicator } from "@/components/voice-activity-indicator"
import { SafetyAlert } from "@/components/safety-alert"
import { OnboardingScreen } from "@/components/onboarding-screen"
import { DegradationBanner } from "@/components/degradation-banner"

export default function Home() {
  const [isOnboarding, setIsOnboarding] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connected")
  const [mode, setMode] = useState<Mode>("safety")
  const [voiceState, setVoiceState] = useState<VoiceState>("idle")
  const [sessionTime, setSessionTime] = useState(154) // seconds
  const [isMuted, setIsMuted] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [isDegraded, setIsDegraded] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  if (isOnboarding) {
    return <OnboardingScreen onBegin={() => setIsOnboarding(false)} />
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <StatusBar
        connectionStatus={connectionStatus}
        isMuted={isMuted}
        sessionTime={sessionTime}
        onToggleMute={() => setIsMuted(!isMuted)}
        onRetry={() => {/* reconnect logic */}}
      />

      {isDegraded && <DegradationBanner />}

      <main className="flex-1 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Main Video Area */}
            <div className="flex-1 space-y-4">
              <VideoPreview mode={mode} isConnected={connectionStatus === "connected"} />
              <VoiceActivityIndicator state={voiceState} />
              <ModeToggle mode={mode} onModeChange={setMode} />
            </div>

            {/* AI Messages Sidebar */}
            <div className="lg:w-80">
              <AIMessagesPanel messages={messages} />
            </div>
          </div>
        </div>
      </main>

      <SafetyAlert
        isOpen={showAlert}
        type="warning"
        message="..."
        onDismiss={() => setShowAlert(false)}
      />
    </div>
  )
}
```

### 3.2 Layout Pattern

```
┌────────────────────────────────────────────────────────────────────────┐
│  STATUS BAR (h-12)                                                     │
├────────────────────────────────────────────────────────────────────────┤
│  DEGRADATION BANNER (if active)                                        │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌─────────────────────────────────────────────┐  ┌─────────────────┐ │
│  │         VIDEO PREVIEW (flex-1)              │  │  AI MESSAGES    │ │
│  │         aspect-[4/3]                        │  │  (lg:w-80)      │ │
│  └─────────────────────────────────────────────┘  │                 │ │
│  ┌─────────────────────────────────────────────┐  │                 │ │
│  │         VOICE ACTIVITY                      │  │                 │ │
│  └─────────────────────────────────────────────┘  │                 │ │
│  ┌─────────────────────────────────────────────┐  │                 │ │
│  │         MODE TOGGLE                         │  │                 │ │
│  └─────────────────────────────────────────────┘  └─────────────────┘ │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Component Specifications

### 4.1 StatusBar

**Purpose:** Top navigation bar with connection status, mic toggle, session timer

```tsx
// components/status-bar.tsx
"use client"

import { Mic, MicOff, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ConnectionStatus } from "@/app/page"

interface StatusBarProps {
  connectionStatus: ConnectionStatus
  isMuted: boolean
  sessionTime: number
  onToggleMute: () => void
  onRetry: () => void
}

export function StatusBar({ connectionStatus, isMuted, sessionTime, onToggleMute, onRetry }: StatusBarProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getConnectionIndicator = () => {
    switch (connectionStatus) {
      case "connected":
        return (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-safe animate-pulse" />
            <span className="text-sm">Connected to Sir Reginald</span>
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
        return (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-danger" />
            <span className="text-sm text-danger">Disconnected</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRetry}
              className="h-6 px-2 text-xs text-danger hover:text-danger hover:bg-danger/10"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
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

        <div className="h-4 w-px bg-border" />

        <button onClick={onToggleMute} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          {isMuted ? (
            <>
              <MicOff className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Muted</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 text-safe" />
              <span className="text-sm">Listening</span>
            </>
          )}
        </button>
      </div>

      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="text-sm">Session:</span>
        <span className="text-sm font-medium text-foreground font-mono">{formatTime(sessionTime)}</span>
      </div>
    </header>
  )
}
```

---

### 4.2 VideoPreview

**Purpose:** Main video display with mode badge, watching indicator, and highlight overlay

```tsx
// components/video-preview.tsx
"use client"

import { useRef, useEffect, useState } from "react"
import { Shield, Wrench } from "lucide-react"
import type { Mode } from "@/app/page"

interface VideoPreviewProps {
  mode: Mode
  isConnected: boolean
}

interface HighlightRegion {
  x: number      // percentage from left
  y: number      // percentage from top
  width: number  // percentage width
  height: number // percentage height
  color: "orange" | "teal" | "green"
  label: string
}

export function VideoPreview({ mode, isConnected }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasVideo, setHasVideo] = useState(false)
  const [highlightRegion, setHighlightRegion] = useState<HighlightRegion | null>(null)

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

  // Function to show highlight region (called by Gemini response handler)
  const showHighlight = (region: HighlightRegion) => {
    setHighlightRegion(region)
    setTimeout(() => setHighlightRegion(null), 3000)
  }

  const borderColor = mode === "safety" ? "border-safe" : "border-primary"

  return (
    <div className="relative">
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

        {/* Recording Indicator - Top Right */}
        {isConnected && (
          <div className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 bg-black/60 rounded text-sm">
            <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
            <span className="text-white/90">SIR REGINALD WATCHING</span>
          </div>
        )}

        {/* Visual Highlight Region */}
        {highlightRegion && (
          <div
            className="absolute transition-all duration-300"
            style={{
              left: `${highlightRegion.x}%`,
              top: `${highlightRegion.y}%`,
              width: `${highlightRegion.width}%`,
              height: `${highlightRegion.height}%`,
            }}
          >
            <div
              className={`w-full h-full border-2 rounded animate-pulse-border ${
                highlightRegion.color === "orange"
                  ? "border-orange-500 bg-orange-500/20"
                  : highlightRegion.color === "teal"
                    ? "border-teal-500 bg-teal-500/20"
                    : "border-safe bg-safe/20"
              }`}
            >
              <span className="absolute -top-6 left-0 text-xs font-medium px-2 py-0.5 rounded bg-black/80 text-white">
                {highlightRegion.label}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

**Highlight Region Presets:**

| Region | x | y | width | height | color | label |
|--------|---|---|-------|--------|-------|-------|
| Hands | 20 | 60 | 40 | 30 | orange | HANDS AREA |
| Face | 30 | 5 | 40 | 35 | teal | FACE AREA |
| Tool | 10 | 30 | 35 | 50 | orange | TOOL AREA |
| Printer | 55 | 20 | 40 | 60 | green | 3D PRINTER |
| Workpiece | 20 | 40 | 60 | 40 | orange | WORKPIECE |

---

### 4.3 AIMessagesPanel

**Purpose:** Scrollable sidebar showing Sir Reginald's messages

```tsx
// components/ai-messages-panel.tsx
"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import type { Message } from "@/app/page"

interface AIMessagesPanelProps {
  messages: Message[]
}

export function AIMessagesPanel({ messages }: AIMessagesPanelProps) {
  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return "just now"
    if (minutes < 60) return `${minutes}m ago`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`

    return date.toLocaleDateString()
  }

  return (
    <div className="bg-surface rounded-lg border border-border h-full">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold flex items-center gap-2">
          <span className="text-xl">🎩</span>
          AI Messages
        </h2>
      </div>

      <ScrollArea className="h-[400px] lg:h-[calc(100vh-320px)]">
        <div className="p-4 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-3 rounded-lg border ${
                message.type === "danger"
                  ? "bg-danger/10 border-danger/30"
                  : message.type === "warning"
                    ? "bg-warning/10 border-warning/30"
                    : "bg-surface-light border-border"
              }`}
            >
              <div className="flex gap-2">
                <span className="text-lg shrink-0">🎩</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-relaxed">"{message.text}"</p>
                  <p className="text-xs text-text-muted mt-2 text-right">
                    {formatTimestamp(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
```

---

### 4.4 VoiceActivityIndicator

**Purpose:** Visual feedback for voice states (idle, listening, AI speaking)

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
          <span className="text-sm text-muted-foreground">Ready</span>
        </div>
      )}
    </div>
  )
}
```

---

### 4.5 SafetyAlert

**Purpose:** Modal overlay for safety warnings/dangers

```tsx
// components/safety-alert.tsx
"use client"

import { useEffect } from "react"
import { AlertTriangle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SafetyAlertProps {
  isOpen: boolean
  type: "warning" | "danger"
  message: string
  onDismiss: () => void
}

export function SafetyAlert({ isOpen, type, message, onDismiss }: SafetyAlertProps) {
  // Auto-dismiss after 10 seconds
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onDismiss, 10000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onDismiss])

  // Keyboard dismiss (Enter/Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && (e.key === "Enter" || e.key === "Escape")) {
        onDismiss()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onDismiss])

  if (!isOpen) return null

  const borderColor = type === "danger" ? "border-danger" : "border-warning"
  const bgColor = type === "danger" ? "bg-danger/10" : "bg-warning/10"
  const iconColor = type === "danger" ? "text-danger" : "text-warning"

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className={`max-w-lg w-full ${bgColor} border-2 ${borderColor} rounded-lg p-6 animate-pulse-border`}>
        <div className="flex items-start gap-4">
          {type === "danger" ? (
            <XCircle className={`w-8 h-8 ${iconColor} shrink-0`} />
          ) : (
            <AlertTriangle className={`w-8 h-8 ${iconColor} shrink-0`} />
          )}

          <div className="flex-1">
            <h3 className={`text-lg font-bold ${iconColor} mb-3`}>
              {type === "danger" ? "⚠️ SAFETY ALERT" : "⚠️ SAFETY NOTICE"}
            </h3>

            <p className="text-foreground leading-relaxed mb-6">"{message}"</p>

            <div className="flex flex-col items-center gap-3">
              <Button
                onClick={onDismiss}
                className={`w-full ${
                  type === "danger"
                    ? "bg-danger hover:bg-danger/90"
                    : "bg-warning hover:bg-warning/90 text-black"
                }`}
              >
                Acknowledged
              </Button>

              <p className="text-sm text-muted-foreground">Say "okay" or "got it" to dismiss</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

### 4.6 ModeToggle

**Purpose:** Toggle between Safety Monitor and Troubleshooter modes

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
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded transition-all ${
            mode === "safety"
              ? "bg-safe text-white"
              : "text-muted-foreground hover:text-foreground hover:bg-surface-light"
          }`}
        >
          <Shield className="w-4 h-4" />
          <span className="font-medium">Safety Monitor</span>
        </button>

        <button
          onClick={() => onModeChange("troubleshoot")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded transition-all ${
            mode === "troubleshoot"
              ? "bg-primary text-white"
              : "text-muted-foreground hover:text-foreground hover:bg-surface-light"
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span className="font-medium">Troubleshooter</span>
        </button>
      </div>
    </div>
  )
}
```

---

### 4.7 OnboardingScreen

**Purpose:** First-time setup with permission requests

```tsx
// components/onboarding-screen.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { Check, Circle, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OnboardingScreenProps {
  onBegin: () => void
}

export function OnboardingScreen({ onBegin }: OnboardingScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [permissions, setPermissions] = useState({
    camera: false,
    microphone: false,
    audioTested: false,
  })

  useEffect(() => {
    async function checkPermissions() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }

        setPermissions((prev) => ({
          ...prev,
          camera: true,
          microphone: true,
        }))
      } catch (err) {
        console.log("Permission denied:", err)
      }
    }

    checkPermissions()

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [])

  const testAudio = () => {
    const utterance = new SpeechSynthesisUtterance(
      "Good day! I shall be keeping a watchful eye on your workshop."
    )
    utterance.rate = 0.9
    utterance.pitch = 0.8
    speechSynthesis.speak(utterance)
    setPermissions((prev) => ({ ...prev, audioTested: true }))
  }

  const canBegin = permissions.camera && permissions.microphone

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎩</div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Sir Reginald Makesworth III
          </h1>
          <p className="text-muted-foreground text-lg">
            Your Distinguished Workshop Guardian
          </p>
        </div>

        {/* Camera Preview */}
        <div className="bg-surface rounded-lg border border-border overflow-hidden mb-6">
          <div className="aspect-video relative">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            {!permissions.camera && (
              <div className="absolute inset-0 flex items-center justify-center bg-surface">
                <p className="text-muted-foreground">Awaiting camera access...</p>
              </div>
            )}
          </div>
        </div>

        {/* Permission Checklist */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3">
            {permissions.camera ? (
              <Check className="w-5 h-5 text-safe" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground" />
            )}
            <span className={permissions.camera ? "text-foreground" : "text-muted-foreground"}>
              Camera access granted
            </span>
          </div>

          <div className="flex items-center gap-3">
            {permissions.microphone ? (
              <Check className="w-5 h-5 text-safe" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground" />
            )}
            <span className={permissions.microphone ? "text-foreground" : "text-muted-foreground"}>
              Microphone access granted
            </span>
          </div>

          <div className="flex items-center gap-3">
            {permissions.audioTested ? (
              <Check className="w-5 h-5 text-safe" />
            ) : (
              <button onClick={testAudio} className="flex items-center gap-2 text-primary hover:underline">
                <Circle className="w-5 h-5" />
                <span>Test audio output</span>
                <Volume2 className="w-4 h-4" />
              </button>
            )}
            {permissions.audioTested && <span className="text-foreground">Audio output tested</span>}
          </div>
        </div>

        {/* Begin Button */}
        <Button
          onClick={onBegin}
          disabled={!canBegin}
          className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg"
        >
          Begin Session
        </Button>

        {/* Welcome Message */}
        <div className="mt-6 p-4 bg-surface rounded-lg border border-border">
          <p className="text-center text-muted-foreground italic">
            "Good day! I shall be keeping a watchful eye on your workshop.
            Do carry on with your excellent work."
          </p>
        </div>
      </div>
    </div>
  )
}
```

---

### 4.8 DegradationBanner

**Purpose:** Banner shown when connection quality degrades

```tsx
// components/degradation-banner.tsx
"use client"

import { Zap } from "lucide-react"

export function DegradationBanner() {
  return (
    <div className="bg-warning/20 border-b border-warning/30 px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <Zap className="w-4 h-4 text-warning" />
        <span className="text-sm">
          <span className="font-medium text-warning">Reduced Monitoring</span>
          <span className="text-warning/80 ml-2">
            "I'm experiencing a touch of delay. Do be extra careful."
          </span>
        </span>
      </div>
    </div>
  )
}
```

---

## 5. CSS & Animations

### 5.1 Global Styles

```css
/* app/globals.css */
@import "tailwindcss";

:root {
  /* Core colors */
  --background: #0f0f0f;
  --foreground: #ffffff;
  --surface: #1a1a1a;
  --surface-light: #252525;
  --border: #333333;

  /* Brand colors */
  --primary: #8b5cf6;
  --safe: #22c55e;
  --warning: #eab308;
  --danger: #ef4444;

  /* Text colors */
  --muted-foreground: #a1a1a1;
  --text-muted: #6b7280;

  /* Radius */
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
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes sound-wave {
  0%, 100% {
    transform: scaleY(0.3);
  }
  50% {
    transform: scaleY(1);
  }
}

.animate-pulse-border {
  animation: pulse-border 2s ease-in-out infinite;
}

.animate-sound-wave {
  animation: sound-wave 0.5s ease-in-out infinite;
}
```

### 5.2 Tailwind Config Extensions

```typescript
// tailwind.config.ts (extend theme)
{
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        "surface-light": "var(--surface-light)",
        border: "var(--border)",
        primary: "var(--primary)",
        safe: "var(--safe)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        "muted-foreground": "var(--muted-foreground)",
        "text-muted": "var(--text-muted)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
}
```

---

## 6. Implementation Notes

### 6.1 Dependencies Required

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "lucide-react": "^0.300.0",
    "@radix-ui/react-scroll-area": "^1.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  }
}
```

### 6.2 Icon Usage (Lucide React)

| Icon | Import | Usage |
|------|--------|-------|
| Shield | `lucide-react` | Safety mode |
| Wrench | `lucide-react` | Troubleshoot mode |
| Mic / MicOff | `lucide-react` | Microphone status |
| Volume2 | `lucide-react` | AI speaking |
| AlertTriangle | `lucide-react` | Warning alerts |
| XCircle | `lucide-react` | Danger alerts |
| RefreshCw | `lucide-react` | Retry button |
| Check / Circle | `lucide-react` | Permission checklist |
| Zap | `lucide-react` | Degradation banner |

### 6.3 Branding Elements

- **Icon:** 🎩 (tophat emoji)
- **Primary Color:** `#8b5cf6` (purple)
- **Product Name:** Sir Reginald Makesworth III
- **Tagline:** Your Distinguished Workshop Guardian
- **Watching Indicator:** "SIR REGINALD WATCHING"

### 6.4 Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 768px | Stacked (video above messages) |
| Tablet | 768px - 1023px | Stacked with larger video |
| Desktop | ≥ 1024px | Side-by-side (video + sidebar) |

---

*End of UI Design Specification v1*
