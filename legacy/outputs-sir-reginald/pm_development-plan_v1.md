# Sir Reginald Development Plan v1

**Product:** Sir Reginald Makesworth III
**Version:** Development Plan 1.0
**Date:** January 18, 2026
**Deadline:** February 9, 2026 (22 days remaining)
**Submission Type:** Video-only (no live demo risk)

---

## 1. Codebase Analysis

### 1.1 Current Folder Structure

```
sir-reginald-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── token/
│   │   │       └── route.ts          # API key proxy endpoint
│   │   ├── favicon.ico
│   │   ├── globals.css               # Design system + animations
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Main application page
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx            # Button component
│   │   │   ├── input.tsx             # Input component
│   │   │   ├── slider.tsx            # Slider component (radix)
│   │   │   └── tooltip.tsx           # Tooltip component (radix)
│   │   ├── camera-setup-screen.tsx   # Camera positioning flow
│   │   ├── connection-screen.tsx     # Connection loading screen
│   │   ├── error-screen.tsx          # Error display
│   │   ├── latency-indicator.tsx     # Simple latency dot indicator
│   │   ├── mode-toggle.tsx           # Safety/Troubleshoot toggle
│   │   ├── onboarding-screen.tsx     # Permissions + name input
│   │   ├── reconnection-overlay.tsx  # Reconnection message
│   │   ├── safety-alert-overlay.tsx  # Alert banner (THE SHOUT)
│   │   ├── safety-status-panel.tsx   # Status checklist panel
│   │   ├── sensitivity-slider.tsx    # Sensitivity control
│   │   ├── session-summary.tsx       # Session end modal
│   │   ├── snooze-button.tsx         # Snooze warnings
│   │   ├── status-bar.tsx            # Top status bar
│   │   ├── theme-toggle.tsx          # Light/dark toggle
│   │   ├── thinking-monocle.tsx      # Thinking indicator
│   │   ├── video-preview.tsx         # Camera feed + frame capture
│   │   ├── voice-activity-indicator.tsx  # Voice state display
│   │   └── volume-control.tsx        # Volume slider
│   ├── hooks/
│   │   ├── use-audio-player.ts       # PCM audio playback
│   │   └── use-gemini-live.ts        # Gemini Live API connection
│   ├── lib/
│   │   ├── fallback-manager.ts       # Graceful degradation logic
│   │   ├── latency.ts                # Latency level calculation
│   │   ├── overlay-regions.ts        # Region detection from text
│   │   ├── prompts.ts                # System prompts (Safety + Troubleshoot)
│   │   └── utils.ts                  # Utility functions (cn)
│   └── types/
│       └── index.ts                  # Type definitions
├── package.json
├── tsconfig.json
├── next.config.ts
└── .env.local                        # API key configuration
```

### 1.2 Existing Components and Their Purposes

| Component | Purpose | Status |
|-----------|---------|--------|
| `page.tsx` | Main orchestrator - manages all state, flow, and renders components | COMPLETE - needs enhancement |
| `onboarding-screen.tsx` | Permissions + user name collection | COMPLETE |
| `camera-setup-screen.tsx` | Guided camera positioning with Sir Reginald dialogue | COMPLETE |
| `connection-screen.tsx` | Loading screen during connection | COMPLETE |
| `video-preview.tsx` | Camera feed display + 1 FPS frame capture | COMPLETE |
| `safety-alert-overlay.tsx` | Alert banner for warnings + THE SHOUT | COMPLETE |
| `session-summary.tsx` | End session modal with stats | PARTIAL - needs Reginald's Verdict |
| `safety-status-panel.tsx` | Status checklist (eye, hands, workspace) | COMPLETE |
| `status-bar.tsx` | Top bar with connection status | COMPLETE |
| `latency-indicator.tsx` | Simple colored dot for latency | PARTIAL - needs breakdown |
| `thinking-monocle.tsx` | Monocle animation during processing | COMPLETE |
| `use-gemini-live.ts` | Gemini Live API connection + messaging | COMPLETE |
| `use-audio-player.ts` | PCM audio queue playback | COMPLETE |
| `prompts.ts` | System prompts for Safety + Troubleshoot modes | PARTIAL - needs dual directive |

### 1.3 What's Already Implemented

**COMPLETE:**
- [x] User onboarding flow (permissions, name)
- [x] Camera setup with Sir Reginald dialogue
- [x] Gemini Live API connection (v1alpha, proactive audio)
- [x] 1 FPS video frame capture and sending
- [x] PCM audio playback from Gemini
- [x] Safety alert overlay with THE SHOUT styling
- [x] Basic session summary modal
- [x] Snooze functionality
- [x] Theme toggle (light/dark)
- [x] Volume control
- [x] Sensitivity slider
- [x] Mode toggle (safety/troubleshoot)
- [x] Basic latency indicator (colored dot)
- [x] Thinking monocle animation
- [x] Safety status panel (checklist)
- [x] Reconnection overlay
- [x] Error screen
- [x] Fallback manager structure

### 1.4 Gaps vs Product Spec v10

| Feature | Spec v10 Requirement | Current Status | Gap |
|---------|---------------------|----------------|-----|
| **Near-Miss Counter** | Display with specific injury stats, costs | NOT IMPLEMENTED | NEW component needed |
| **Latency Breakdown** | Pipeline stages (video, network, Gemini, audio) | Simple dot only | NEW component needed |
| **Moment Timeline** | Track detected moments during session | NOT IMPLEMENTED | NEW component + state needed |
| **Pattern Tracking** | Count repeated warnings, trigger suggestions | NOT IMPLEMENTED | Logic + state needed |
| **Context-Aware Suggestions** | After 3+ same warnings, suggest fix | NOT IMPLEMENTED | Prompt + UI needed |
| **Session Verdict** | Spoken Sir Reginald summary at end | NOT IMPLEMENTED | Audio + UI needed |
| **Document Generation** | Enhanced markdown with lessons/mistakes | NOT IMPLEMENTED | Component + logic needed |
| **Dual Directive Prompt** | Combined safety + witness mode | Separate prompts | Prompt consolidation needed |
| **Test Logging** | Persistent metrics logging | NOT IMPLEMENTED | Logging infrastructure needed |
| **Moment Tag Parsing** | Parse `<moment>` tags from Gemini | NOT IMPLEMENTED | Parser + state needed |
| **Live Metric Overlay** | Watching, latency, moments, interventions | Partial in status bar | Enhanced overlay needed |

---

## 2. Architecture Overview

### 2.1 Data Flow for New Features

```
+-----------------------------------------------------------------------------------+
|                              MAIN PAGE (page.tsx)                                  |
|                                                                                    |
|   +------------------+     +------------------+     +------------------+           |
|   |  Session State   |     |  Pattern State   |     |  Metrics State   |           |
|   |  - moments[]     |     |  - warningCounts |     |  - latencyHistory|           |
|   |  - interventions |     |  - suggestions   |     |  - breakdown     |           |
|   |  - startTime     |     |  - lastWarning   |     |  - avgLatency    |           |
|   +--------+---------+     +--------+---------+     +--------+---------+           |
|            |                        |                        |                     |
|            v                        v                        v                     |
|   +------------------------------------------------------------------------+       |
|   |                        SESSION CONTEXT                                  |       |
|   |  - Shared state object passed to components                            |       |
|   |  - Updated by Gemini response handlers                                  |       |
|   +------------------------------------------------------------------------+       |
|                                     |                                              |
|                                     v                                              |
|   +------------------------------------------------------------------------+       |
|   |                     USE-GEMINI-LIVE HOOK                                |       |
|   |  - Sends video frames                                                   |       |
|   |  - Receives audio + text responses                                      |       |
|   |  - NEW: Parses <moment> and <suggestion> tags                          |       |
|   |  - NEW: Tracks latency per pipeline stage                               |       |
|   +------------------------------------------------------------------------+       |
|                                     |                                              |
|         +---------------------------+---------------------------+                  |
|         v                           v                           v                  |
|   +-------------+           +---------------+           +---------------+          |
|   | onAudio()   |           | onText()      |           | onMoment()    |          |
|   | - Play PCM  |           | - Parse alerts|           | - Add to list |          |
|   | - Voice UI  |           | - Region detect|          | - Update UI   |          |
|   +-------------+           | - Pattern track|          +---------------+          |
|                             +---------------+                                      |
+-----------------------------------------------------------------------------------+
```

### 2.2 New State Management Approach

```typescript
// Extended Session State (in page.tsx)
interface SessionState {
  // Existing
  userName: string;
  startTime: Date | null;
  mode: Mode;

  // Safety Tracking (ENHANCED)
  interventions: SafetyIntervention[];  // With stats
  warningPatterns: Record<string, number>;  // scenario -> count

  // Moment Tracking (NEW)
  moments: DetectedMoment[];

  // Metrics (ENHANCED)
  metrics: {
    latencyHistory: number[];
    latencyBreakdown: LatencyBreakdown | null;
    avgLatency: number;
    p95Latency: number;
  };

  // Document (NEW)
  generatedDocument: string | null;
  verdictDelivered: boolean;
}
```

### 2.3 API Integration Points

**Gemini Response Parsing:**
```typescript
// New response structure from Gemini
interface GeminiResponse {
  // Existing
  serverContent?: {
    modelTurn?: {
      parts?: Array<{
        inlineData?: { mimeType?: string; data?: string };
        text?: string;  // May contain <moment> or <suggestion> tags
      }>;
    };
  };

  // Session resumption
  sessionResumptionUpdate?: { newHandle?: string };
  goAway?: boolean;
}

// New parsing required
function parseGeminiText(text: string): {
  plainText: string;
  moments: DetectedMoment[];
  suggestions: SafetySuggestion[];
  documentContent: string | null;
}
```

---

## 3. Work Packages (Parallelizable)

### WP-1: Near-Miss Counter Component

**Package Name:** `near-miss-counter`
**Description:** Display safety interventions with specific injury statistics and costs
**Dependencies:** None (standalone component)
**Estimated Complexity:** Medium

**Files to Create/Modify:**
- CREATE: `src/components/near-miss-counter.tsx`
- CREATE: `src/lib/injury-statistics.ts`
- MODIFY: `src/types/index.ts` (add SafetyIntervention interface)
- MODIFY: `src/app/page.tsx` (add state and render component)

**Sample Code:**

```typescript
// src/lib/injury-statistics.ts
export interface InjuryStats {
  injuryType: string;
  annualIncidents: string;
  source: string;
  estimatedCostLow: number;
  estimatedCostHigh: number;
  recoveryTime: string;
}

export const INJURY_STATISTICS: Record<string, InjuryStats> = {
  'hand_near_blade': {
    injuryType: 'Laceration or amputation',
    annualIncidents: '30,000',
    source: 'CPSC',
    estimatedCostLow: 20000,
    estimatedCostHigh: 120000,
    recoveryTime: '4-12 weeks'
  },
  'missing_glasses': {
    injuryType: 'Corneal burn or damage',
    annualIncidents: '2,000',
    source: 'AAO',
    estimatedCostLow: 5000,
    estimatedCostHigh: 50000,
    recoveryTime: '1-8 weeks'
  },
  'cluttered_workspace': {
    injuryType: 'Kickback or fall injury',
    annualIncidents: '15% of workshop injuries',
    source: 'OSHA',
    estimatedCostLow: 2000,
    estimatedCostHigh: 30000,
    recoveryTime: '1-6 weeks'
  },
  'improper_grip': {
    injuryType: 'Strain or laceration',
    annualIncidents: '10% of workshop injuries',
    source: 'OSHA',
    estimatedCostLow: 1000,
    estimatedCostHigh: 15000,
    recoveryTime: '1-4 weeks'
  },
  'missing_hearing': {
    injuryType: 'Hearing damage',
    annualIncidents: '22M exposed',
    source: 'NIOSH',
    estimatedCostLow: 3000,
    estimatedCostHigh: 10000,
    recoveryTime: 'Permanent'
  }
};

export function getScenarioFromText(text: string): string | null {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('hand') && (lowerText.includes('blade') || lowerText.includes('saw'))) {
    return 'hand_near_blade';
  }
  if (lowerText.includes('glasses') || lowerText.includes('spectacles')) {
    return 'missing_glasses';
  }
  if (lowerText.includes('clutter') || lowerText.includes('messy')) {
    return 'cluttered_workspace';
  }
  if (lowerText.includes('grip') || lowerText.includes('one hand')) {
    return 'improper_grip';
  }
  if (lowerText.includes('hearing') || lowerText.includes('ear')) {
    return 'missing_hearing';
  }
  return null;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
```

```typescript
// src/components/near-miss-counter.tsx
"use client"

import { AlertTriangle, DollarSign, Activity, Clock } from "lucide-react"
import { INJURY_STATISTICS, formatCurrency } from "@/lib/injury-statistics"
import type { SafetyIntervention } from "@/types"

interface NearMissCounterProps {
  interventions: SafetyIntervention[];
  maxVisible?: number;
  showDetailedStats?: boolean;
}

export function NearMissCounter({
  interventions,
  maxVisible = 5,
  showDetailedStats = true
}: NearMissCounterProps) {
  const formatTimestamp = (date: Date, sessionStart: Date) => {
    const elapsed = Math.floor((date.getTime() - sessionStart.getTime()) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalCostLow = interventions.reduce((sum, i) => sum + (i.estimatedCostLow || 0), 0);
  const totalCostHigh = interventions.reduce((sum, i) => sum + (i.estimatedCostHigh || 0), 0);

  const visibleInterventions = interventions.slice(-maxVisible);

  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="bg-danger/10 border-b border-danger/20 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-danger" />
            <span className="font-semibold text-foreground">
              NEAR-MISSES PREVENTED
            </span>
          </div>
          <span className="text-2xl font-bold text-danger">
            {interventions.length}
          </span>
        </div>
      </div>

      {/* Interventions List */}
      {interventions.length > 0 && (
        <div className="divide-y divide-border">
          {visibleInterventions.map((intervention, idx) => {
            const stats = INJURY_STATISTICS[intervention.scenario];

            return (
              <div key={intervention.id} className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-mono">
                      {formatTimestamp(intervention.timestamp, intervention.sessionStart)}
                    </span>
                    <span className={`text-sm font-medium ${
                      intervention.type === 'shout' ? 'text-danger' : 'text-warning'
                    }`}>
                      {intervention.type === 'shout' ? 'CRITICAL' : 'Warning'}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {intervention.latencyMs}ms
                  </span>
                </div>

                <p className="text-sm font-medium text-foreground">
                  {intervention.description}
                </p>

                {showDetailedStats && stats && (
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      <span>PREVENTED: {stats.injuryType}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 flex items-center justify-center">#</span>
                      <span>STATISTICS: {stats.annualIncidents} annually ({stats.source})</span>
                    </div>
                    <div className="flex items-center gap-1 text-safe">
                      <DollarSign className="w-3 h-3" />
                      <span>
                        COST AVOIDED: {formatCurrency(stats.estimatedCostLow)} - {formatCurrency(stats.estimatedCostHigh)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>RECOVERY TIME: {stats.recoveryTime}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Session Total */}
      {interventions.length > 0 && (
        <div className="bg-safe/10 border-t border-safe/20 px-4 py-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">SESSION TOTAL</span>
            <span className="font-bold text-safe">
              {formatCurrency(totalCostLow)} - {formatCurrency(totalCostHigh)} potential avoided
            </span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {interventions.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          <p className="text-sm">No safety interventions yet</p>
          <p className="text-xs mt-1">Sir Reginald is watching...</p>
        </div>
      )}
    </div>
  );
}
```

**Acceptance Criteria:**
- [ ] Displays count of interventions prominently
- [ ] Shows injury type, statistics, and source for each
- [ ] Shows estimated cost avoided per intervention
- [ ] Shows session total cost avoided
- [ ] Handles empty state gracefully
- [ ] Styled consistently with design system

**Can be parallelized with:** WP-2, WP-3, WP-4, WP-5

---

### WP-2: Latency Breakdown Component

**Package Name:** `latency-breakdown`
**Description:** Enhanced latency visualization with pipeline stages
**Dependencies:** None (standalone component)
**Estimated Complexity:** Medium

**Files to Create/Modify:**
- CREATE: `src/components/latency-breakdown.tsx`
- MODIFY: `src/hooks/use-gemini-live.ts` (add breakdown tracking)
- MODIFY: `src/types/index.ts` (add LatencyBreakdown interface)

**Sample Code:**

```typescript
// src/types/index.ts - add these types
export interface LatencyBreakdown {
  videoCapture: number;
  networkTransit: number;
  geminiProcessing: number;
  audioGeneration: number;
  total: number;
}
```

```typescript
// src/components/latency-breakdown.tsx
"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Zap } from "lucide-react"
import type { LatencyBreakdown as LatencyBreakdownType } from "@/types"

interface LatencyBreakdownProps {
  breakdown: LatencyBreakdownType | null;
  latencyHistory: number[];
  isExpanded?: boolean;
}

export function LatencyBreakdownComponent({
  breakdown,
  latencyHistory,
  isExpanded: initialExpanded = false
}: LatencyBreakdownProps) {
  const [expanded, setExpanded] = useState(initialExpanded);

  const getColor = (ms: number) => {
    if (ms < 500) return { bg: 'bg-safe', text: 'text-safe' };
    if (ms < 800) return { bg: 'bg-safe/70', text: 'text-safe' };
    if (ms < 1500) return { bg: 'bg-warning', text: 'text-warning' };
    if (ms < 2000) return { bg: 'bg-orange-500', text: 'text-orange-500' };
    return { bg: 'bg-danger', text: 'text-danger' };
  };

  const total = breakdown?.total ?? 0;
  const colors = getColor(total);
  const percentage = Math.min((total / 1000) * 100, 100);

  // Calculate P95 from history
  const sortedHistory = [...latencyHistory].sort((a, b) => a - b);
  const p95Index = Math.floor(sortedHistory.length * 0.95);
  const p95 = sortedHistory[p95Index] ?? 0;
  const avg = latencyHistory.length > 0
    ? Math.round(latencyHistory.reduce((a, b) => a + b, 0) / latencyHistory.length)
    : 0;

  if (!breakdown) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Zap className="w-4 h-4" />
        <span>Measuring...</span>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden">
      {/* Compact View */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-surface-light transition-colors"
      >
        <div className="flex items-center gap-3">
          <Zap className={`w-4 h-4 ${colors.text}`} />
          <span className="font-medium">Latency</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`font-bold ${colors.text}`}>{total}ms</span>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded View */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
          {/* Breakdown */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Video Capture:</span>
              <span className="font-mono">{breakdown.videoCapture}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Network Transit:</span>
              <span className="font-mono">{breakdown.networkTransit}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gemini Processing:</span>
              <span className="font-mono">{breakdown.geminiProcessing}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Audio Generation:</span>
              <span className="font-mono">{breakdown.audioGeneration}ms</span>
            </div>
          </div>

          {/* Total with bar */}
          <div className="pt-2 border-t border-border">
            <div className="flex justify-between mb-2">
              <span className="font-medium">TOTAL:</span>
              <span className={`font-bold ${colors.text}`}>{total}ms</span>
            </div>
            <div className="h-2 bg-surface-light rounded-full overflow-hidden">
              <div
                className={`h-full ${colors.bg} transition-all duration-300`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0ms</span>
              <span>500ms</span>
              <span>1000ms</span>
            </div>
          </div>

          {/* Session stats */}
          {latencyHistory.length > 0 && (
            <div className="pt-2 border-t border-border text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Session Avg:</span>
                <span className="font-mono">{avg}ms</span>
              </div>
              <div className="flex justify-between">
                <span>P95:</span>
                <span className="font-mono">{p95}ms</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

**Acceptance Criteria:**
- [ ] Shows compact view with total latency and color
- [ ] Expands to show pipeline stage breakdown
- [ ] Visual bar indicator for total latency
- [ ] Color-coded by latency threshold
- [ ] Shows session average and P95
- [ ] Updates in real-time

**Can be parallelized with:** WP-1, WP-3, WP-4, WP-5

---

### WP-3: Moment Timeline Component

**Package Name:** `moment-timeline`
**Description:** Display detected moments during session with lessons
**Dependencies:** None (standalone component)
**Estimated Complexity:** Medium

**Files to Create/Modify:**
- CREATE: `src/components/moment-timeline.tsx`
- CREATE: `src/lib/moment-parser.ts`
- MODIFY: `src/types/index.ts` (add DetectedMoment interface)

**Sample Code:**

```typescript
// src/types/index.ts - add these types
export interface DetectedMoment {
  id: string;
  timestamp: Date;
  elapsedSeconds: number;
  type: 'new_step' | 'technique' | 'problem' | 'solution' | 'mistake' | 'tip' | 'lesson' | 'safety';
  title: string;
  description: string;
  reasoning?: string;
  lesson?: string;
}
```

```typescript
// src/lib/moment-parser.ts
import type { DetectedMoment } from "@/types";

export function parseMomentTag(text: string, sessionStart: Date): DetectedMoment | null {
  const momentMatch = text.match(/<moment>([\s\S]*?)<\/moment>/);
  if (!momentMatch) return null;

  try {
    const jsonContent = momentMatch[1].trim();
    const parsed = JSON.parse(jsonContent);

    const now = new Date();
    return {
      id: `moment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: now,
      elapsedSeconds: Math.floor((now.getTime() - sessionStart.getTime()) / 1000),
      type: parsed.type?.toLowerCase() || 'tip',
      title: parsed.title || 'Observation',
      description: parsed.description || '',
      reasoning: parsed.reasoning,
      lesson: parsed.lesson,
    };
  } catch (e) {
    console.error('Failed to parse moment tag:', e);
    return null;
  }
}

export function removeMomentTags(text: string): string {
  return text.replace(/<moment>[\s\S]*?<\/moment>/g, '').trim();
}
```

```typescript
// src/components/moment-timeline.tsx
"use client"

import {
  ArrowRight, Lightbulb, AlertCircle, CheckCircle,
  XCircle, Star, BookOpen, Shield
} from "lucide-react"
import type { DetectedMoment } from "@/types"

interface MomentTimelineProps {
  moments: DetectedMoment[];
  sessionStart: Date;
  maxVisible?: number;
}

const MOMENT_ICONS: Record<DetectedMoment['type'], React.ReactNode> = {
  new_step: <ArrowRight className="w-4 h-4" />,
  technique: <Star className="w-4 h-4" />,
  problem: <XCircle className="w-4 h-4" />,
  solution: <CheckCircle className="w-4 h-4" />,
  mistake: <AlertCircle className="w-4 h-4" />,
  tip: <Lightbulb className="w-4 h-4" />,
  lesson: <BookOpen className="w-4 h-4" />,
  safety: <Shield className="w-4 h-4" />,
};

const MOMENT_COLORS: Record<DetectedMoment['type'], string> = {
  new_step: 'text-primary border-primary/20 bg-primary/5',
  technique: 'text-safe border-safe/20 bg-safe/5',
  problem: 'text-danger border-danger/20 bg-danger/5',
  solution: 'text-safe border-safe/20 bg-safe/5',
  mistake: 'text-warning border-warning/20 bg-warning/5',
  tip: 'text-primary border-primary/20 bg-primary/5',
  lesson: 'text-primary border-primary/20 bg-primary/5',
  safety: 'text-danger border-danger/20 bg-danger/5',
};

const MOMENT_LABELS: Record<DetectedMoment['type'], string> = {
  new_step: 'Step',
  technique: 'Technique',
  problem: 'Problem',
  solution: 'Solution',
  mistake: 'Mistake',
  tip: 'Tip',
  lesson: 'Lesson',
  safety: 'Safety',
};

export function MomentTimeline({ moments, sessionStart, maxVisible = 10 }: MomentTimelineProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const visibleMoments = moments.slice(-maxVisible);

  return (
    <div className="bg-surface rounded-lg border border-border">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            Moment Timeline
          </h3>
          <span className="text-sm text-muted-foreground">
            {moments.length} captured
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-h-96 overflow-y-auto">
        {visibleMoments.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p className="text-sm">No moments captured yet</p>
            <p className="text-xs mt-1">Sir Reginald is observing...</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {visibleMoments.map((moment) => (
              <div key={moment.id} className="p-4 space-y-2">
                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded ${MOMENT_COLORS[moment.type]}`}>
                    {MOMENT_ICONS[moment.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground font-mono">
                        {formatTime(moment.elapsedSeconds)}
                      </span>
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${MOMENT_COLORS[moment.type]}`}>
                        {MOMENT_LABELS[moment.type]}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {moment.title}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {moment.description}
                    </p>
                    {moment.lesson && (
                      <p className="text-xs text-primary mt-2 italic">
                        Lesson: {moment.lesson}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

**Acceptance Criteria:**
- [ ] Displays moments with timestamp, type icon, and description
- [ ] Shows lesson if captured
- [ ] Color-coded by moment type
- [ ] Scrollable when many moments
- [ ] Handles empty state
- [ ] Updates in real-time

**Can be parallelized with:** WP-1, WP-2, WP-4, WP-5

---

### WP-4: Dual Directive Prompt Enhancement

**Package Name:** `dual-directive-prompt`
**Description:** Combine safety and witness prompts with pattern detection and context-aware suggestions
**Dependencies:** None (prompt only)
**Estimated Complexity:** Low

**Files to Create/Modify:**
- MODIFY: `src/lib/prompts.ts` (add combined prompt)

**Sample Code:**

```typescript
// src/lib/prompts.ts - ADD this function

export const getSirReginaldDualPrompt = (userName: string) => `
You are Sir Reginald Makesworth III, a distinguished British gentleman who spent decades as the head craftsman at the Royal Workshop of Windsor Castle. You serve as both GUARDIAN and WITNESS for home workshop makers.

THE USER: ${userName}

YOUR CHARACTER:
- Speak with refined British English: polite, proper grammar, occasional dry wit
- Warm and caring, never condescending or alarming (except in emergencies)
- Patient and knowledgeable, like a mentor who's seen everything
- Use phrases like "I notice...", "Pardon the interruption...", "Do let's...", "Shall we..."
- PERSONALITY ARC: Start formal, become warmer as session progresses

===============================================================================
PRIMARY DIRECTIVE - SAFETY (React Immediately)
===============================================================================

YOUR CORE MISSION: Protect ${userName} from injury by speaking up BEFORE dangerous actions are completed.

SAFETY PRIORITIES (in order):
1. IMMEDIATE DANGER: Hands near moving blades, touching hot surfaces, improper tool grip
2. PPE MISSING: Safety glasses absent when using laser cutter, no hearing protection with loud tools
3. TECHNIQUE ISSUES: Improper cutting stance, incorrect tool usage, unsafe material handling
4. ENVIRONMENT HAZARDS: Cluttered workspace, fire risks, ventilation issues

CRITICAL SAVE PROTOCOL (THE SHOUT):
For IMMINENT DANGER (hand about to contact blade), break character briefly:
- SHOUT: "${userName}! HAND!" (or similar - name + one word)
- Then immediately: "Do forgive me for raising my voice - but that was rather too close for comfort. Are you quite alright?"

SAFETY RESPONSE GUIDELINES:
- Speak IMMEDIATELY when you see danger - don't wait to be asked
- Be firm but polite: "Pardon the interruption, but I notice..."
- Be specific about what you see: "I don't see safety spectacles..."
- After compliance, acknowledge graciously: "Splendid! Do carry on."
- Keep warnings brief - a few sentences at most

SPATIAL AWARENESS (for visual overlay):
When you detect something requiring attention, include WHERE you're looking:
- "your hand" / "your hands" - triggers hand region highlight
- "safety glasses" / "spectacles" - triggers face region highlight
- "the blade" / "cutting area" / "saw" - triggers tool region highlight
- "cluttered" / "workspace" - triggers workspace highlight

===============================================================================
CONTEXT-AWARE SAFETY SUGGESTIONS
===============================================================================

PATTERN ANALYSIS:
After you've warned about the SAME safety concern 3+ times in a session, provide a PROACTIVE SUGGESTION to eliminate the pattern - not just another warning.

When you detect a pattern, output a suggestion in this format:
<suggestion>
{
  "scenario": "hand_near_blade",
  "count": 4,
  "suggestion": "Might I suggest repositioning your workpiece so the offcuts fall on your side? It would eliminate the need to reach across entirely."
}
</suggestion>

Then speak it naturally: "I've noticed you've been reaching across the blade quite frequently today - that's the fourth time. Might I suggest repositioning your workpiece so the offcuts fall on your side?"

===============================================================================
EDGE CASE HANDLING
===============================================================================

POOR LIGHTING:
If visibility is compromised, say: "I'm having trouble seeing clearly, ${userName}. Would you mind adjusting the lighting? The shadows are making it difficult to keep a proper watch."

CAMERA OBSTRUCTION:
If view is blocked, say: "Something seems to be blocking my view. I do need a clear line of sight to be of assistance."

AMBIGUOUS MOTION:
If uncertain about danger level, err on side of caution: "I wasn't quite certain about that last movement. Do be careful near the blade - I'd rather speak up unnecessarily than remain silent when it matters."

CONNECTION ISSUES:
If experiencing latency, acknowledge it: "Do bear with me - the connection seems a bit sluggish at the moment."

===============================================================================
SECONDARY DIRECTIVE - OBSERVATION (Accumulate Passively)
===============================================================================

YOUR WITNESS MISSION: Observe and remember significant moments throughout the session for later documentation.

MOMENT DETECTION:
While watching, identify significant moments and output them in this format:

<moment>
{
  "type": "TECHNIQUE",
  "title": "Clever jig arrangement",
  "description": "Used a sacrificial board clamped as a stop block for consistent cuts",
  "reasoning": "Ensures repeatability without re-measuring each piece",
  "lesson": "Always use physical stops for batch cuts - faster and more accurate than measuring"
}
</moment>

Moment Types to Detect:
- NEW_STEP: Major phase change (starting a cut, assembly begins, etc.)
- TECHNIQUE: Notable skill or method being demonstrated
- PROBLEM: Issue encountered (failed print, bad cut, stuck piece)
- SOLUTION: Problem being resolved
- MISTAKE: Error made (can be recovered from)
- TIP: Best practice worth noting
- LESSON: Insight or learning moment

OBSERVATION COMMENTARY (spoken, every 3-5 minutes):
- "Ah, moving on to assembly. I shall note the transition."
- "That's a clever jig arrangement. I'm noting that for the documentation."
- "Hmm, I see some trouble there. Let's see how you address it."
- "A small stumble there, but well recovered. Makes for good teaching material."
- "I notice you corrected your approach after that first attempt - that's the sort of lesson worth documenting."

OBSERVATION FREQUENCY: Every 3-5 minutes, not constant. Don't over-comment.

===============================================================================
DOCUMENT GENERATION
===============================================================================

When asked to generate documentation (user says "write it up" or "generate documentation"), output in this format:

<document>
# [Project Name] - Tutorial by Sir Reginald

## Overview
[One paragraph summary of what was built]

## Materials & Tools Observed
[List what you saw used]

## Step-by-Step Guide

### Step 1: [Title]
**Time:** [start] - [end]
[Description]

**Reginald's Notes:**
- *What I noticed:* [Your observation as Sir Reginald]
- *Lesson learned:* [If a mistake was made and corrected]
- *Pro tip:* [Technique worth highlighting]

[Continue for all steps...]

## Problems Encountered & Solutions
[For each problem with timestamp, description, solution, and lesson]

## Tips & Techniques
[Notable techniques with reasoning for why they work]

## Mistakes Made (And Why They Matter)
[Mistakes caught and corrected, framed as learning opportunities]

## Session Summary
- Duration: [time]
- Major Steps: [count]
- Problems Solved: [count]
- Techniques Captured: [count]
- Safety Interventions: [count] potential issues prevented

---
*Documented by Sir Reginald Makesworth III*
*"He Watches. He Remembers. He Protects."*
</document>

===============================================================================
SESSION VERDICT
===============================================================================

At session end, when asked for summary, deliver a spoken verdict including:
1. Duration and what was accomplished
2. Number of moments documented
3. Specific techniques you found impressive
4. Safety interventions with estimated impact
5. Proactive suggestion for next session
6. Transition to documentation availability

Example:
"Well then, ${userName}, we've had quite the productive session. In [duration], you completed [N] major steps, and I noted [M] moments worth documenting - including [specific technique] which I found particularly impressive.

I did have to intervene [X] times for safety matters. [Brief mention of interventions]. Together, those interventions may well have saved you considerable trouble.

Perhaps next session we might work on [proactive suggestion based on patterns observed]?

The documentation is ready for your review - complete with the lessons we learned along the way. Well done, old sport."

===============================================================================
CONTEXT RETENTION DEMONSTRATION
===============================================================================

IMPORTANT: You have access to the full session context. When appropriate, reference earlier events to demonstrate memory:

Example (after 30+ minutes):
"Ah, this is similar to that tearout issue we encountered at the beginning of the session. You've clearly learned from that experience - I notice you're now supporting the cut from beneath."

Reference earlier moments naturally when relevant - this demonstrates the marathon agent capability.

===============================================================================
WHAT YOU'RE WATCHING
===============================================================================

- A home workshop with 3D printer, laser cutter, and/or basic power tools
- A single person (${userName}) working alone
- Continuous 1 FPS video feed over potentially hours

REMEMBER:
- SAFETY always takes priority over observation commentary
- If you see danger, interrupt yourself to warn
- You are both protector and documentarian
- Capture not just WHAT happened but WHY it matters
- Reference earlier context when relevant to demonstrate memory
`;
```

**Acceptance Criteria:**
- [ ] Combines safety and witness roles
- [ ] Includes `<moment>` tag format for parsing
- [ ] Includes `<suggestion>` tag for pattern analysis
- [ ] Includes `<document>` tag for generation
- [ ] Includes session verdict guidelines
- [ ] Includes edge case handling
- [ ] Uses userName throughout

**Can be parallelized with:** WP-1, WP-2, WP-3, WP-5

---

### WP-5: Response Parser Utilities

**Package Name:** `response-parser`
**Description:** Parse Gemini text responses for moments, suggestions, and documents
**Dependencies:** WP-4 (needs prompt format)
**Estimated Complexity:** Low

**Files to Create/Modify:**
- CREATE: `src/lib/response-parser.ts`
- MODIFY: `src/hooks/use-gemini-live.ts` (use parser)

**Sample Code:**

```typescript
// src/lib/response-parser.ts
import type { DetectedMoment } from "@/types";

export interface ParsedResponse {
  plainText: string;
  moments: DetectedMoment[];
  suggestion: SafetySuggestion | null;
  document: string | null;
}

export interface SafetySuggestion {
  scenario: string;
  count: number;
  suggestion: string;
}

export function parseGeminiResponse(
  text: string,
  sessionStart: Date
): ParsedResponse {
  let plainText = text;
  const moments: DetectedMoment[] = [];
  let suggestion: SafetySuggestion | null = null;
  let document: string | null = null;

  // Parse <moment> tags
  const momentMatches = text.matchAll(/<moment>([\s\S]*?)<\/moment>/g);
  for (const match of momentMatches) {
    try {
      const parsed = JSON.parse(match[1].trim());
      const now = new Date();
      moments.push({
        id: `moment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: now,
        elapsedSeconds: Math.floor((now.getTime() - sessionStart.getTime()) / 1000),
        type: (parsed.type?.toLowerCase() || 'tip') as DetectedMoment['type'],
        title: parsed.title || 'Observation',
        description: parsed.description || '',
        reasoning: parsed.reasoning,
        lesson: parsed.lesson,
      });
    } catch (e) {
      console.warn('Failed to parse moment:', e);
    }
    plainText = plainText.replace(match[0], '');
  }

  // Parse <suggestion> tag
  const suggestionMatch = text.match(/<suggestion>([\s\S]*?)<\/suggestion>/);
  if (suggestionMatch) {
    try {
      suggestion = JSON.parse(suggestionMatch[1].trim());
    } catch (e) {
      console.warn('Failed to parse suggestion:', e);
    }
    plainText = plainText.replace(suggestionMatch[0], '');
  }

  // Parse <document> tag
  const documentMatch = text.match(/<document>([\s\S]*?)<\/document>/);
  if (documentMatch) {
    document = documentMatch[1].trim();
    plainText = plainText.replace(documentMatch[0], '');
  }

  return {
    plainText: plainText.trim(),
    moments,
    suggestion,
    document,
  };
}

export function extractScenarioFromWarning(text: string): string | null {
  const lowerText = text.toLowerCase();

  if (lowerText.includes('hand!') ||
      (lowerText.includes('hand') && (lowerText.includes('blade') || lowerText.includes('saw')))) {
    return 'hand_near_blade';
  }
  if (lowerText.includes('glasses') || lowerText.includes('spectacles') || lowerText.includes('eye')) {
    return 'missing_glasses';
  }
  if (lowerText.includes('clutter') || lowerText.includes('messy') || lowerText.includes('workspace')) {
    return 'cluttered_workspace';
  }
  if (lowerText.includes('grip') || lowerText.includes('one hand') || lowerText.includes('two hand')) {
    return 'improper_grip';
  }
  if (lowerText.includes('hearing') || lowerText.includes('ear') || lowerText.includes('loud')) {
    return 'missing_hearing';
  }

  return null;
}
```

**Acceptance Criteria:**
- [ ] Parses `<moment>` tags into DetectedMoment objects
- [ ] Parses `<suggestion>` tags into SafetySuggestion objects
- [ ] Parses `<document>` tags for generated documentation
- [ ] Returns clean plainText without tags
- [ ] Handles malformed JSON gracefully
- [ ] Extracts scenario from warning text

**Can be parallelized with:** WP-1, WP-2, WP-3

---

### WP-6: Session Verdict Component

**Package Name:** `session-verdict`
**Description:** Enhanced session end modal with Reginald's spoken verdict
**Dependencies:** WP-1 (needs intervention data)
**Estimated Complexity:** Medium

**Files to Create/Modify:**
- CREATE: `src/components/session-verdict.tsx`
- MODIFY: `src/app/page.tsx` (integrate component)

**Sample Code:**

```typescript
// src/components/session-verdict.tsx
"use client"

import { X, FileText, Download, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/injury-statistics"
import type { SafetyIntervention, DetectedMoment } from "@/types"

interface SessionVerdictProps {
  userName: string;
  sessionStart: Date;
  moments: DetectedMoment[];
  interventions: SafetyIntervention[];
  warningPatterns: Record<string, number>;
  generatedDocument: string | null;
  onGenerateDoc: () => void;
  onExport: () => void;
  onClose: () => void;
}

export function SessionVerdict({
  userName,
  sessionStart,
  moments,
  interventions,
  warningPatterns,
  generatedDocument,
  onGenerateDoc,
  onExport,
  onClose,
}: SessionVerdictProps) {
  const formatDuration = () => {
    const elapsed = Math.floor((Date.now() - sessionStart.getTime()) / 1000);
    const hours = Math.floor(elapsed / 3600);
    const mins = Math.floor((elapsed % 3600) / 60);
    if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''} and ${mins} minute${mins !== 1 ? 's' : ''}`;
    return `${mins} minute${mins !== 1 ? 's' : ''}`;
  };

  const stepCount = moments.filter(m => m.type === 'new_step').length;
  const techniqueCount = moments.filter(m => m.type === 'technique').length;
  const problemCount = moments.filter(m => m.type === 'problem').length;

  const totalCostAvoided = interventions.reduce((sum, i) => {
    return sum + ((i.estimatedCostLow || 0) + (i.estimatedCostHigh || 0)) / 2;
  }, 0);

  // Find most repeated warning for suggestion
  const mostRepeated = Object.entries(warningPatterns)
    .filter(([_, count]) => count >= 3)
    .sort(([, a], [, b]) => b - a)[0];

  const getSuggestionText = (scenario: string) => {
    switch (scenario) {
      case 'hand_near_blade':
        return 'repositioning your workpiece so you don\'t need to reach across the blade';
      case 'missing_glasses':
        return 'keeping your safety spectacles on a hook right beside the laser';
      case 'cluttered_workspace':
        return 'clearing your bench between operations';
      case 'improper_grip':
        return 'using a proper two-handed grip throughout';
      case 'missing_hearing':
        return 'storing hearing protection with your power tools';
      default:
        return 'being a touch more mindful of safety';
    }
  };

  const notableTechnique = moments.find(m => m.type === 'technique')?.title;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface rounded-xl border border-border max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-surface">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-2xl">&#127913;</span>
            Reginald's Verdict
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verdict Content */}
        <div className="p-6 space-y-4">
          {/* Speaking indicator */}
          <div className="flex items-center gap-2 text-primary text-sm">
            <Volume2 className="w-4 h-4 animate-pulse" />
            <span className="italic">Sir Reginald is speaking...</span>
          </div>

          <div className="bg-surface-light rounded-lg p-6 space-y-4 text-lg leading-relaxed">
            <p>
              "Well then, <strong>{userName}</strong>, we've had quite the productive session.
            </p>

            <p>
              In <strong>{formatDuration()}</strong>, you completed <strong>{stepCount}</strong> major
              step{stepCount !== 1 ? 's' : ''}, and I noted <strong>{moments.length}</strong> moment{moments.length !== 1 ? 's' : ''} worth
              documenting
              {techniqueCount > 0 && (
                <> - including {notableTechnique ? `"${notableTechnique}"` : `${techniqueCount} clever technique${techniqueCount !== 1 ? 's' : ''}`} which I found particularly impressive</>
              )}
              {problemCount > 0 && (
                <>, and I observed you solve {problemCount} problem{problemCount !== 1 ? 's' : ''} along the way</>
              )}.
            </p>

            {interventions.length > 0 && (
              <p>
                I did have to intervene <strong>{interventions.length}</strong> time{interventions.length !== 1 ? 's' : ''} for
                safety matters.{' '}
                {interventions.find(i => i.type === 'shout') && (
                  <>That moment near the blade did give me quite a start. </>
                )}
                Together, those interventions may well have saved you approximately{' '}
                <strong className="text-safe">{formatCurrency(totalCostAvoided)}</strong> in medical expenses
                and several weeks of recovery time.
              </p>
            )}

            {mostRepeated && (
              <p className="italic text-muted-foreground">
                Perhaps next session we might work on {getSuggestionText(mostRepeated[0])}?
              </p>
            )}

            <p>
              The documentation is ready for your review - complete with the lessons we learned along the way.
              Well done, old sport."
            </p>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-surface-light rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{formatDuration().split(' ')[0]}</p>
              <p className="text-xs text-muted-foreground">Duration</p>
            </div>
            <div className="bg-surface-light rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-primary">{moments.length}</p>
              <p className="text-xs text-muted-foreground">Moments</p>
            </div>
            <div className="bg-surface-light rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-danger">{interventions.length}</p>
              <p className="text-xs text-muted-foreground">Interventions</p>
            </div>
            <div className="bg-surface-light rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-safe">{formatCurrency(totalCostAvoided)}</p>
              <p className="text-xs text-muted-foreground">Costs Avoided</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {!generatedDocument && (
              <Button onClick={onGenerateDoc} className="flex-1 bg-primary hover:bg-primary/90">
                <FileText className="w-4 h-4 mr-2" />
                Generate Documentation
              </Button>
            )}
            {generatedDocument && (
              <Button onClick={onExport} variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Export Documentation
              </Button>
            )}
            <Button onClick={onClose} variant="outline" className="flex-1">
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Acceptance Criteria:**
- [ ] Displays Sir Reginald's spoken verdict text
- [ ] Shows duration, moments, interventions, costs avoided
- [ ] Includes proactive suggestion based on patterns
- [ ] Links to documentation generation
- [ ] Speaking indicator animation
- [ ] Maintains character throughout

**Can be parallelized with:** WP-2, WP-3, WP-7

---

### WP-7: Document Viewer Component

**Package Name:** `document-viewer`
**Description:** Display and export generated documentation
**Dependencies:** WP-5 (needs document parsing)
**Estimated Complexity:** Medium

**Files to Create/Modify:**
- CREATE: `src/components/document-viewer.tsx`
- CREATE: `src/lib/document-export.ts`

**Sample Code:**

```typescript
// src/lib/document-export.ts
export function exportAsMarkdown(document: string, filename?: string): void {
  const blob = new Blob([document], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `sir-reginald-session-${new Date().toISOString().split('T')[0]}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportAsText(document: string, filename?: string): void {
  const blob = new Blob([document], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `sir-reginald-session-${new Date().toISOString().split('T')[0]}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
```

```typescript
// src/components/document-viewer.tsx
"use client"

import { useState } from "react"
import { X, Download, FileText, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { exportAsMarkdown, exportAsText } from "@/lib/document-export"

interface DocumentViewerProps {
  document: string;
  onClose: () => void;
}

export function DocumentViewer({ document, onClose }: DocumentViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(document);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportMd = () => {
    exportAsMarkdown(document);
  };

  const handleExportTxt = () => {
    exportAsText(document);
  };

  // Simple markdown rendering (basic formatting)
  const renderMarkdown = (md: string) => {
    return md.split('\n').map((line, i) => {
      if (line.startsWith('# ')) {
        return <h1 key={i} className="text-2xl font-bold mt-6 mb-4">{line.slice(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-xl font-semibold mt-5 mb-3">{line.slice(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-lg font-medium mt-4 mb-2">{line.slice(4)}</h3>;
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="ml-4">{line.slice(2)}</li>;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-bold">{line.slice(2, -2)}</p>;
      }
      if (line.startsWith('*') && line.endsWith('*')) {
        return <p key={i} className="italic text-muted-foreground">{line.slice(1, -1)}</p>;
      }
      if (line.startsWith('---')) {
        return <hr key={i} className="my-6 border-border" />;
      }
      if (line.trim() === '') {
        return <br key={i} />;
      }
      return <p key={i} className="mb-2">{line}</p>;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface rounded-xl border border-border max-w-4xl w-full shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Generated Documentation
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              {copied ? <Check className="w-4 h-4 text-safe" /> : <Copy className="w-4 h-4" />}
            </Button>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {renderMarkdown(document)}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 p-4 border-t border-border shrink-0">
          <Button onClick={handleExportMd} className="flex-1 bg-primary hover:bg-primary/90">
            <Download className="w-4 h-4 mr-2" />
            Export as Markdown
          </Button>
          <Button onClick={handleExportTxt} variant="outline" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Export as Text
          </Button>
        </div>
      </div>
    </div>
  );
}
```

**Acceptance Criteria:**
- [ ] Displays generated markdown with basic formatting
- [ ] Copy to clipboard functionality
- [ ] Export as Markdown file
- [ ] Export as plain text file
- [ ] Scrollable content area
- [ ] Responsive modal design

**Can be parallelized with:** WP-1, WP-2, WP-6

---

### WP-8: Main Page Integration

**Package Name:** `main-integration`
**Description:** Integrate all new components and state into main page
**Dependencies:** WP-1, WP-2, WP-3, WP-4, WP-5, WP-6, WP-7
**Estimated Complexity:** High

**Files to Modify:**
- MODIFY: `src/app/page.tsx` (major updates)
- MODIFY: `src/hooks/use-gemini-live.ts` (add response parsing)
- MODIFY: `src/types/index.ts` (add all new types)

**Key Changes:**

```typescript
// src/app/page.tsx - State additions
const [interventions, setInterventions] = useState<SafetyIntervention[]>([]);
const [moments, setMoments] = useState<DetectedMoment[]>([]);
const [warningPatterns, setWarningPatterns] = useState<Record<string, number>>({});
const [latencyBreakdown, setLatencyBreakdown] = useState<LatencyBreakdown | null>(null);
const [latencyHistory, setLatencyHistory] = useState<number[]>([]);
const [generatedDocument, setGeneratedDocument] = useState<string | null>(null);
const [showVerdict, setShowVerdict] = useState(false);
const [showDocViewer, setShowDocViewer] = useState(false);

// Enhanced handleGeminiText
const handleGeminiText = useCallback((text: string) => {
  const parsed = parseGeminiResponse(text, sessionStartTime || new Date());

  // Handle moments
  if (parsed.moments.length > 0) {
    setMoments(prev => [...prev, ...parsed.moments]);
  }

  // Handle document
  if (parsed.document) {
    setGeneratedDocument(parsed.document);
  }

  // Handle safety detection and pattern tracking
  const scenario = extractScenarioFromWarning(parsed.plainText);
  if (scenario) {
    const stats = INJURY_STATISTICS[scenario];
    const newIntervention: SafetyIntervention = {
      id: Date.now().toString(),
      timestamp: new Date(),
      sessionStart: sessionStartTime || new Date(),
      type: parsed.plainText.toLowerCase().includes('hand!') ? 'shout' : 'warning',
      scenario,
      description: parsed.plainText.slice(0, 100),
      latencyMs: latencyBreakdown?.total || 0,
      estimatedCostLow: stats?.estimatedCostLow || 0,
      estimatedCostHigh: stats?.estimatedCostHigh || 0,
    };
    setInterventions(prev => [...prev, newIntervention]);

    // Update pattern tracking
    setWarningPatterns(prev => ({
      ...prev,
      [scenario]: (prev[scenario] || 0) + 1,
    }));
  }

  // Continue with existing overlay/alert logic...
}, [sessionStartTime, latencyBreakdown]);
```

**Acceptance Criteria:**
- [ ] All new state properly initialized
- [ ] Response parsing integrated into Gemini handler
- [ ] Near-miss counter rendered in layout
- [ ] Latency breakdown rendered in layout
- [ ] Moment timeline rendered in layout
- [ ] Session verdict modal integrated
- [ ] Document viewer modal integrated
- [ ] Pattern tracking working
- [ ] All data flows correctly between components

**Cannot be parallelized - must wait for WP-1 through WP-7**

---

### WP-9: Live Metric Overlay Enhancement

**Package Name:** `live-metric-overlay`
**Description:** Enhanced status overlay on video with moments and interventions
**Dependencies:** WP-8 (needs integrated state)
**Estimated Complexity:** Low

**Files to Create/Modify:**
- CREATE: `src/components/live-metric-overlay.tsx`
- MODIFY: `src/components/video-preview.tsx` (add overlay)

**Sample Code:**

```typescript
// src/components/live-metric-overlay.tsx
"use client"

import { Eye, Clock, AlertTriangle, BookOpen } from "lucide-react"
import type { LatencyLevel } from "@/types"

interface LiveMetricOverlayProps {
  latencyLevel: LatencyLevel;
  latencyMs: number;
  momentCount: number;
  interventionCount: number;
}

const LATENCY_COLORS = {
  good: 'text-safe',
  moderate: 'text-warning',
  slow: 'text-orange-500',
  critical: 'text-danger',
};

export function LiveMetricOverlay({
  latencyLevel,
  latencyMs,
  momentCount,
  interventionCount,
}: LiveMetricOverlayProps) {
  return (
    <div className="absolute top-3 left-3 flex items-center gap-3 bg-black/70 rounded px-3 py-1.5">
      {/* Watching indicator */}
      <div className="flex items-center gap-1.5">
        <Eye className="w-3.5 h-3.5 text-safe" />
        <span className="text-xs text-white/90">Watching</span>
      </div>

      <div className="w-px h-4 bg-white/20" />

      {/* Latency */}
      <div className="flex items-center gap-1.5">
        <Clock className={`w-3.5 h-3.5 ${LATENCY_COLORS[latencyLevel]}`} />
        <span className={`text-xs font-mono ${LATENCY_COLORS[latencyLevel]}`}>
          {latencyMs}ms
        </span>
      </div>

      <div className="w-px h-4 bg-white/20" />

      {/* Moments */}
      <div className="flex items-center gap-1.5">
        <BookOpen className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs text-white/90">{momentCount}</span>
      </div>

      <div className="w-px h-4 bg-white/20" />

      {/* Interventions */}
      <div className="flex items-center gap-1.5">
        <AlertTriangle className={`w-3.5 h-3.5 ${interventionCount > 0 ? 'text-danger' : 'text-white/50'}`} />
        <span className={`text-xs ${interventionCount > 0 ? 'text-danger' : 'text-white/90'}`}>
          {interventionCount}
        </span>
      </div>
    </div>
  );
}
```

**Acceptance Criteria:**
- [ ] Shows watching status
- [ ] Shows latency with color coding
- [ ] Shows moment count
- [ ] Shows intervention count with emphasis
- [ ] Positioned over video feed
- [ ] Updates in real-time

**Can be parallelized with:** WP-10

---

### WP-10: Test Logging Infrastructure

**Package Name:** `test-logging`
**Description:** Persistent logging infrastructure for test sessions
**Dependencies:** WP-8 (needs session data)
**Estimated Complexity:** Medium

**Files to Create/Modify:**
- CREATE: `src/lib/test-harness.ts`
- MODIFY: `src/app/page.tsx` (add logging calls)

**Sample Code:**

```typescript
// src/lib/test-harness.ts
export interface TestLogEntry {
  timestamp: Date;
  type: 'safety_trigger' | 'moment_detected' | 'latency_spike' |
        'connection_issue' | 'pattern_suggestion' | 'edge_case';
  data: {
    scenario?: string;
    latencyMs?: number;
    latencyBreakdown?: LatencyBreakdown;
    success?: boolean;
    expected?: string;
    actual?: string;
    patternCount?: number;
    edgeCaseType?: string;
  };
}

export interface TestLog {
  sessionId: string;
  startTime: Date;
  entries: TestLogEntry[];
  aggregateMetrics: {
    totalSafetyTriggers: number;
    totalMoments: number;
    avgLatencyMs: number;
    p95LatencyMs: number;
    maxLatencyMs: number;
    safetyTriggersByScenario: Record<string, number>;
    patternSuggestionsTriggered: number;
    edgeCasesHandled: number;
  };
}

const STORAGE_KEY = 'sir-reginald-test-logs';

export class TestHarness {
  private log: TestLog;

  constructor(sessionId?: string) {
    this.log = {
      sessionId: sessionId || `session-${Date.now()}`,
      startTime: new Date(),
      entries: [],
      aggregateMetrics: {
        totalSafetyTriggers: 0,
        totalMoments: 0,
        avgLatencyMs: 0,
        p95LatencyMs: 0,
        maxLatencyMs: 0,
        safetyTriggersByScenario: {},
        patternSuggestionsTriggered: 0,
        edgeCasesHandled: 0,
      },
    };
  }

  logEvent(entry: Omit<TestLogEntry, 'timestamp'>): void {
    this.log.entries.push({
      ...entry,
      timestamp: new Date(),
    });
    this.updateAggregates();
    this.persistToStorage();
  }

  private updateAggregates(): void {
    const safetyEvents = this.log.entries.filter(e => e.type === 'safety_trigger');
    const momentEvents = this.log.entries.filter(e => e.type === 'moment_detected');
    const latencyEvents = this.log.entries.filter(e => e.data.latencyMs !== undefined);

    this.log.aggregateMetrics.totalSafetyTriggers = safetyEvents.length;
    this.log.aggregateMetrics.totalMoments = momentEvents.length;

    if (latencyEvents.length > 0) {
      const latencies = latencyEvents.map(e => e.data.latencyMs!).sort((a, b) => a - b);
      this.log.aggregateMetrics.avgLatencyMs = Math.round(
        latencies.reduce((a, b) => a + b, 0) / latencies.length
      );
      this.log.aggregateMetrics.p95LatencyMs = latencies[Math.floor(latencies.length * 0.95)] || 0;
      this.log.aggregateMetrics.maxLatencyMs = Math.max(...latencies);
    }

    // Safety triggers by scenario
    this.log.aggregateMetrics.safetyTriggersByScenario = {};
    for (const event of safetyEvents) {
      if (event.data.scenario) {
        this.log.aggregateMetrics.safetyTriggersByScenario[event.data.scenario] =
          (this.log.aggregateMetrics.safetyTriggersByScenario[event.data.scenario] || 0) + 1;
      }
    }

    this.log.aggregateMetrics.patternSuggestionsTriggered =
      this.log.entries.filter(e => e.type === 'pattern_suggestion').length;
    this.log.aggregateMetrics.edgeCasesHandled =
      this.log.entries.filter(e => e.type === 'edge_case').length;
  }

  private persistToStorage(): void {
    try {
      const allLogs = this.getAllLogs();
      const existingIndex = allLogs.findIndex(l => l.sessionId === this.log.sessionId);
      if (existingIndex >= 0) {
        allLogs[existingIndex] = this.log;
      } else {
        allLogs.push(this.log);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allLogs));
    } catch (e) {
      console.warn('Failed to persist test log:', e);
    }
  }

  getAllLogs(): TestLog[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  exportLog(): string {
    return JSON.stringify(this.log, null, 2);
  }

  exportAllLogs(): string {
    return JSON.stringify(this.getAllLogs(), null, 2);
  }

  getLog(): TestLog {
    return this.log;
  }
}
```

**Acceptance Criteria:**
- [ ] Logs safety triggers with scenario and latency
- [ ] Logs moment detections
- [ ] Logs latency spikes
- [ ] Logs pattern suggestions
- [ ] Logs edge cases
- [ ] Calculates aggregate metrics (avg, P95, max latency)
- [ ] Persists to localStorage
- [ ] Export as JSON
- [ ] Survives page refresh

**Can be parallelized with:** WP-9

---

## 4. Code Patterns & Standards

### 4.1 Component Structure Pattern

```typescript
// Standard component pattern
"use client"

import { useState, useCallback } from "react"
import { SomeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { SomeType } from "@/types"

interface ComponentNameProps {
  requiredProp: string;
  optionalProp?: number;
  onAction?: (value: string) => void;
}

export function ComponentName({
  requiredProp,
  optionalProp = 10,
  onAction
}: ComponentNameProps) {
  // State
  const [localState, setLocalState] = useState(false);

  // Handlers
  const handleClick = useCallback(() => {
    setLocalState(true);
    onAction?.(requiredProp);
  }, [requiredProp, onAction]);

  // Render
  return (
    <div className="bg-surface rounded-lg border border-border">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <h3 className="font-semibold">{requiredProp}</h3>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Content here */}
      </div>
    </div>
  );
}
```

### 4.2 Hook Pattern

```typescript
// Standard hook pattern
"use client"

import { useState, useCallback, useRef, useEffect } from "react"

interface UseHookNameOptions {
  optionA?: boolean;
  onCallback?: (value: string) => void;
}

interface UseHookNameReturn {
  state: string;
  action: () => void;
  isLoading: boolean;
}

export function useHookName({
  optionA = true,
  onCallback
}: UseHookNameOptions = {}): UseHookNameReturn {
  const [state, setState] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const someRef = useRef<SomeType | null>(null);

  const action = useCallback(() => {
    setState("updated");
    onCallback?.("value");
  }, [onCallback]);

  useEffect(() => {
    // Effect logic
    return () => {
      // Cleanup
    };
  }, []);

  return {
    state,
    action,
    isLoading,
  };
}
```

### 4.3 Type Definitions Pattern

```typescript
// src/types/index.ts pattern

// Use descriptive names
export type ConnectionStatus = "connecting" | "connected" | "reconnecting" | "disconnected" | "error";

// Interface for complex objects
export interface SafetyIntervention {
  id: string;
  timestamp: Date;
  sessionStart: Date;
  type: 'shout' | 'warning' | 'reminder' | 'suggestion';
  scenario: string;
  description: string;
  latencyMs: number;
  estimatedCostLow: number;
  estimatedCostHigh: number;
}

// Use optional properties with ?
export interface DetectedMoment {
  id: string;
  timestamp: Date;
  elapsedSeconds: number;
  type: 'new_step' | 'technique' | 'problem' | 'solution' | 'mistake' | 'tip' | 'lesson' | 'safety';
  title: string;
  description: string;
  reasoning?: string;
  lesson?: string;
}
```

### 4.4 Styling Approach

Use Tailwind CSS with design system variables:

```typescript
// Color usage
"text-foreground"     // Primary text
"text-muted-foreground"  // Secondary text
"bg-surface"          // Card backgrounds
"bg-surface-light"    // Nested backgrounds
"border-border"       // Standard borders

// Status colors
"text-safe"           // Success/safe state
"text-warning"        // Warning state
"text-danger"         // Error/danger state
"text-primary"        // Primary accent

// Consistent spacing
"p-4"                 // Standard padding
"gap-3"               // Standard gap
"space-y-4"           // Standard vertical spacing

// Component structure
"rounded-lg"          // Standard border radius
"border border-border" // Standard border
```

### 4.5 Error Handling Pattern

```typescript
// Always wrap async operations in try-catch
const fetchData = async () => {
  try {
    const response = await fetch("/api/data");
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle gracefully - set error state, show fallback, etc.
    setErrorState(true);
    return null;
  }
};

// For parsing, always handle malformed data
const parseData = (text: string) => {
  try {
    return JSON.parse(text);
  } catch (e) {
    console.warn("Failed to parse:", e);
    return null;
  }
};
```

---

## 5. Integration Points

### 5.1 Shared State/Context

The main page (`page.tsx`) serves as the state hub. All components receive state via props:

```typescript
// State in page.tsx
const [interventions, setInterventions] = useState<SafetyIntervention[]>([]);
const [moments, setMoments] = useState<DetectedMoment[]>([]);

// Pass to components
<NearMissCounter interventions={interventions} />
<MomentTimeline moments={moments} sessionStart={sessionStartTime} />
```

### 5.2 Event System

Components communicate upward via callbacks:

```typescript
// Parent provides handler
<SessionVerdict
  onGenerateDoc={() => requestDocGeneration()}
  onClose={() => setShowVerdict(false)}
/>

// Child calls when appropriate
const handleExport = () => {
  onGenerateDoc();
};
```

### 5.3 API Contract: Gemini Response Parsing

```typescript
// Expected input from Gemini (text content)
const geminiText = `
I notice you're reaching toward the laser cutter without safety spectacles.

<moment>
{"type": "TECHNIQUE", "title": "Jig setup", "description": "Proper alignment jig"}
</moment>
`;

// Expected output from parser
const parsed = parseGeminiResponse(geminiText, sessionStart);
// {
//   plainText: "I notice you're reaching toward...",
//   moments: [{ type: 'technique', title: 'Jig setup', ... }],
//   suggestion: null,
//   document: null
// }
```

---

## 6. Development Phases

### Phase 1: Core Features (P0) - Days 1-8

**Work Packages:** WP-1, WP-2, WP-3, WP-4, WP-5

**Goal:** All core v10 features implemented

| Day | Tasks | Packages |
|-----|-------|----------|
| 1-2 | Injury statistics, Near-miss counter | WP-1 |
| 1-2 | Latency breakdown component | WP-2 |
| 3-4 | Moment timeline, parser | WP-3, WP-5 |
| 3-4 | Dual directive prompt | WP-4 |

**Milestone:** Core components render, response parsing works

### Phase 2: Enhancement Features (P1) - Days 9-14

**Work Packages:** WP-6, WP-7, WP-8, WP-9, WP-10

**Goal:** Full integration, session verdict, documentation

| Day | Tasks | Packages |
|-----|-------|----------|
| 9-10 | Session verdict component | WP-6 |
| 9-10 | Document viewer | WP-7 |
| 11-12 | Main page integration | WP-8 |
| 13-14 | Live overlay, test logging | WP-9, WP-10 |

**Milestone:** Complete end-to-end flow works

### Phase 3: Polish & Testing - Days 15-19

**Goal:** Bug fixes, edge cases, reliability testing

| Day | Tasks |
|-----|-------|
| 15-16 | Test all 5 safety scenarios |
| 16-17 | Test pattern detection and suggestions |
| 17-18 | Test document generation |
| 18-19 | Edge case handling, latency testing |

**Milestone:** 50+ test sessions logged, >95% safety trigger rate

### Phase 4: Demo Recording - Days 20-22

**Goal:** Perfect 2-minute demo video

| Day | Tasks |
|-----|-------|
| 20 | Set up recording environment, props |
| 21 | Record multiple takes of each segment |
| 21-22 | Edit video, add effects, slow motion |
| 22 | Final export, DevPost submission |

**Milestone:** Polished 2:00 video submitted

---

## 7. Testing Strategy

### 7.1 Manual Testing Checklist

**Safety Scenarios (test each 3+ times):**
- [ ] Safety glasses warning triggers correctly
- [ ] THE SHOUT triggers on hand near blade
- [ ] Cluttered workspace detection works
- [ ] Improper grip detection works
- [ ] Missing hearing protection detection works

**Pattern Detection:**
- [ ] Warning count increments correctly
- [ ] Context-aware suggestion triggers after 3+ same warnings
- [ ] Suggestion is specific and actionable

**Moments:**
- [ ] `<moment>` tags parse correctly
- [ ] Moments appear in timeline
- [ ] Lessons included when present

**Session End:**
- [ ] Verdict modal displays correctly
- [ ] Stats are accurate
- [ ] Document generates properly
- [ ] Export works (Markdown, Text)

**Edge Cases:**
- [ ] Poor lighting feedback
- [ ] Camera obstruction feedback
- [ ] Connection loss and recovery
- [ ] Latency spike handling

### 7.2 Demo Scenario Testing

Run through the exact demo script 10+ times:

1. **Hook** - Stats display ready
2. **Safety glasses** - Warning triggers, counter increments
3. **THE SHOUT** - Triggers reliably, latency <500ms
4. **Near-miss counter** - Shows stats correctly
5. **Moments** - Timeline populates
6. **Documentation** - Generates with all sections
7. **Verdict** - Delivers complete summary

---

## 8. Risk Mitigation

### 8.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Gemini response inconsistent | Medium | High | Fallback parsing, retry logic |
| Latency too high for demo | Low | High | Record multiple takes, use best |
| Context window overflow | Low | Medium | Monitor token usage, compress |
| Audio playback issues | Medium | Medium | Test across browsers |

### 8.2 Scope Reduction Options

**If running short on time, cut in this order:**

1. **Cut first:** Test logging infrastructure (WP-10)
2. **Cut second:** Latency breakdown expansion (keep simple dot)
3. **Cut third:** Document export formats (keep Markdown only)
4. **Keep always:** THE SHOUT, safety scenarios, near-miss counter, session verdict

### 8.3 Essential vs Nice-to-Have

**ESSENTIAL (must ship):**
- THE SHOUT working reliably
- Near-miss counter with stats
- Session verdict spoken summary
- Basic documentation generation
- 5 safety scenarios working

**NICE-TO-HAVE (can cut):**
- Latency breakdown by pipeline stage
- Pattern detection suggestions
- Test logging infrastructure
- PDF export
- Edge case feedback (poor lighting, etc.)

---

## 9. Parallel Execution Matrix

| Package | Can Parallel With | Cannot Parallel With |
|---------|-------------------|---------------------|
| WP-1: Near-Miss Counter | WP-2, WP-3, WP-4, WP-5 | WP-8 |
| WP-2: Latency Breakdown | WP-1, WP-3, WP-4, WP-5 | WP-8 |
| WP-3: Moment Timeline | WP-1, WP-2, WP-4, WP-5 | WP-8 |
| WP-4: Dual Directive Prompt | WP-1, WP-2, WP-3, WP-5 | WP-8 |
| WP-5: Response Parser | WP-1, WP-2, WP-3, WP-4 | WP-8 |
| WP-6: Session Verdict | WP-2, WP-3, WP-7 | WP-8 |
| WP-7: Document Viewer | WP-1, WP-2, WP-6 | WP-8 |
| WP-8: Main Integration | None | ALL (depends on 1-7) |
| WP-9: Live Metric Overlay | WP-10 | WP-8 |
| WP-10: Test Logging | WP-9 | WP-8 |

**Recommended parallel streams:**

- **Stream A:** WP-1, WP-6
- **Stream B:** WP-2, WP-9
- **Stream C:** WP-3, WP-5, WP-7
- **Stream D:** WP-4, WP-10

**Then:** WP-8 (integration) after all streams complete

---

## 10. Quick Reference

### Commands

```bash
# Development
cd sir-reginald-app
npm run dev

# Build
npm run build

# Lint
npm run lint
```

### Key File Paths

```
src/app/page.tsx              # Main application
src/hooks/use-gemini-live.ts  # Gemini connection
src/lib/prompts.ts            # System prompts
src/types/index.ts            # Type definitions
src/components/               # UI components
src/lib/                      # Utilities
```

### Design System Colors

```css
--safe: #22c55e      /* Success, safe state */
--warning: #eab308   /* Warning state */
--danger: #ef4444    /* Error, danger state */
--primary: #8b5cf6   /* Primary accent */
--surface: #1a1a1a   /* Card backgrounds (dark) */
--border: #333333    /* Borders (dark) */
```

---

*Development Plan v1.0 - Sir Reginald Makesworth III*
*"He Watches. He Remembers. He Protects."*
