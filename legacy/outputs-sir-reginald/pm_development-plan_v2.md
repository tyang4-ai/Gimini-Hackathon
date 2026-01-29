# Sir Reginald Development Plan v2

**Product:** Sir Reginald Makesworth III
**Version:** Development Plan 2.0
**Date:** January 18, 2026
**Deadline:** February 9, 2026 (22 days remaining)
**Submission Type:** Video-only (no live demo risk)

---

## Changes from v1

This section documents all changes made in response to the critic's review (`critic_dev-plan-review_v1.md`).

### Critical Code Bug Fixes

| Bug | Location | Fix Applied |
|-----|----------|-------------|
| **Variable name collision** | WP-7 `document-export.ts` line 1422 | Renamed parameter from `document` to `content` in both export functions |
| **Unsafe type assertion** | WP-5 `response-parser.ts` line 1124 | Added explicit validation against `validTypes` array before casting |
| **Duplicate moment parsing** | WP-3 `moment-parser.ts` | **REMOVED** - All moment parsing consolidated into WP-5 |
| **Deprecated `.substr()`** | WP-3, WP-5 ID generation | Changed to `.substring()` throughout |

### Added Work Packages

| New Package | Purpose |
|-------------|---------|
| **WP-0: Type Definition Consolidation** | Single source of truth for all new types, created first |
| **WP-11: Gemini Hook Enhancement** | Add `requestVerdict()` and `sendTextPrompt()` methods for verdict/document generation |

### Latency Breakdown Decision

**DECISION: Remove latency breakdown by pipeline stage.**

The critic correctly identified that we cannot accurately measure individual pipeline stages (video capture, network transit, Gemini processing, audio generation) client-side. The Gemini API does not provide timing metadata.

**Replacement:** Keep the existing simple latency indicator (total round-trip time), but enhance it with:
- Color-coded thresholds (already exists)
- Session average and P95 statistics (new)
- Simple expanded view (no fake breakdown)

This is honest and still provides value for the demo.

### Dependency Order Corrections

**Fixed WP-5 dependency:** WP-5 (Response Parser) now depends on WP-4 (Dual Directive Prompt) - cannot be parallelized.

**Revised Parallel Streams:**

```
Stream A: WP-0 -> WP-1, WP-6
Stream B: WP-4 -> WP-5, WP-7  (SEQUENTIAL: 4 before 5)
Stream C: WP-3, WP-9
Stream D: WP-2 (simplified), WP-10

Then: WP-11 -> WP-8 (integration requires hook enhancement first)
```

### Time Estimate Revisions

| Phase | v1 Estimate | v2 Estimate | Reason |
|-------|-------------|-------------|--------|
| Phase 1 | Days 1-8 | Days 1-10 | Added WP-0, WP-4->WP-5 sequential dependency |
| Phase 2 | Days 9-14 | Days 11-15 | Added WP-11, integration debugging buffer |
| Phase 3 | Days 15-19 | Days 16-19 | Maintained but more realistic |
| Phase 4 | Days 20-22 | Days 20-22 | Unchanged |
| **Buffer** | 0 days | 2 days | Built into Phase 1 and 2 |

### Integration Fixes

| Integration Gap | Fix Applied |
|-----------------|-------------|
| **Spoken verdict trigger** | WP-11 adds `requestVerdict()` method to `use-gemini-live.ts` |
| **Document generation trigger** | WP-11 adds `sendTextPrompt()` method for requesting documentation |
| **State duplication** | WP-8 now removes `sessionData.safetyInterventions` and derives from `interventions.length` |

### Additional Fixes Applied

- **Error boundaries added** to WP-8 integration spec
- **Accessibility attributes** added to component acceptance criteria
- **`.substr()` -> `.substring()`** throughout all sample code
- **Session start validation** added to prevent null timestamp issues
- **Test mocks specification** added to Phase 3

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
| `latency-indicator.tsx` | Simple colored dot for latency | COMPLETE |
| `thinking-monocle.tsx` | Monocle animation during processing | COMPLETE |
| `use-gemini-live.ts` | Gemini Live API connection + messaging | COMPLETE - needs enhancement |
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
| **Latency Stats** | Session average, P95 | Simple dot only | Enhancement needed |
| **Moment Timeline** | Track detected moments during session | NOT IMPLEMENTED | NEW component + state needed |
| **Pattern Tracking** | Count repeated warnings, trigger suggestions | NOT IMPLEMENTED | Logic + state needed |
| **Context-Aware Suggestions** | After 3+ same warnings, suggest fix | NOT IMPLEMENTED | Prompt + UI needed |
| **Session Verdict** | Spoken Sir Reginald summary at end | NOT IMPLEMENTED | Hook + UI needed |
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
|   |  - interventions |     |  - suggestions   |     |  - avgLatency    |           |
|   |  - startTime     |     |  - lastWarning   |     |  - p95Latency    |           |
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
|   |                     USE-GEMINI-LIVE HOOK (ENHANCED)                     |       |
|   |  - Sends video frames                                                   |       |
|   |  - Receives audio + text responses                                      |       |
|   |  - NEW: sendTextPrompt() for verdict/doc requests                       |       |
|   |  - NEW: requestVerdict() helper method                                  |       |
|   +------------------------------------------------------------------------+       |
|                                     |                                              |
|         +---------------------------+---------------------------+                  |
|         v                           v                           v                  |
|   +-------------+           +---------------+           +---------------+          |
|   | onAudio()   |           | onText()      |           | onMoment()    |          |
|   | - Play PCM  |           | - Parse alerts|           | - Add to list |          |
|   | - Voice UI  |           | - Parse tags  |           | - Update UI   |          |
|   +-------------+           | - Pattern track|          +---------------+          |
|                             +---------------+                                      |
+-----------------------------------------------------------------------------------+
```

### 2.2 New State Management Approach

```typescript
// Extended Session State (in page.tsx)
// Note: sessionData.safetyInterventions REMOVED - derive from interventions.length
interface ExtendedSessionState {
  // Existing (from UserPreferences and SessionSummary)
  userName: string;
  startTime: Date | null;
  mode: Mode;

  // Safety Tracking (ENHANCED)
  interventions: SafetyIntervention[];  // REPLACES safetyInterventions counter
  warningPatterns: Record<string, number>;  // scenario -> count

  // Moment Tracking (NEW)
  moments: DetectedMoment[];

  // Metrics (ENHANCED)
  latencyHistory: number[];

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
function parseGeminiResponse(
  text: string,
  sessionStart: Date
): ParsedResponse {
  // Returns: { plainText, moments[], suggestion, document }
}
```

---

## 3. Work Packages (Parallelizable)

### WP-0: Type Definition Consolidation (NEW)

**Package Name:** `type-consolidation`
**Description:** Single source of truth for all new types - MUST complete first
**Dependencies:** None - START HERE
**Estimated Complexity:** Low

**Files to Create/Modify:**
- MODIFY: `src/types/index.ts` (add all new interfaces)

**Sample Code:**

```typescript
// src/types/index.ts - ADD these types

// ========================================
// SAFETY INTERVENTION TRACKING
// ========================================

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

export interface SafetySuggestion {
  scenario: string;
  count: number;
  suggestion: string;
}

// ========================================
// MOMENT TRACKING
// ========================================

export type MomentType =
  | 'new_step'
  | 'technique'
  | 'problem'
  | 'solution'
  | 'mistake'
  | 'tip'
  | 'lesson'
  | 'safety';

export interface DetectedMoment {
  id: string;
  timestamp: Date;
  elapsedSeconds: number;
  type: MomentType;
  title: string;
  description: string;
  reasoning?: string;
  lesson?: string;
}

// ========================================
// PARSED RESPONSE
// ========================================

export interface ParsedResponse {
  plainText: string;
  moments: DetectedMoment[];
  suggestion: SafetySuggestion | null;
  document: string | null;
}

// ========================================
// INJURY STATISTICS (for near-miss counter)
// ========================================

export interface InjuryStats {
  injuryType: string;
  annualIncidents: string;
  source: string;
  estimatedCostLow: number;
  estimatedCostHigh: number;
  recoveryTime: string;
}

// ========================================
// LATENCY METRICS
// ========================================

export interface LatencyMetrics {
  current: number;
  history: number[];
  average: number;
  p95: number;
}

// ========================================
// TEST LOGGING
// ========================================

export interface TestLogEntry {
  timestamp: Date;
  type: 'safety_trigger' | 'moment_detected' | 'latency_spike' |
        'connection_issue' | 'pattern_suggestion' | 'edge_case';
  data: {
    scenario?: string;
    latencyMs?: number;
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
```

**Acceptance Criteria:**
- [ ] All new types defined in single file
- [ ] No circular dependencies
- [ ] Types exported and importable
- [ ] TypeScript compiles without errors
- [ ] Existing types unchanged (backward compatible)

**MUST complete before:** WP-1, WP-2, WP-3, WP-5, WP-10

---

### WP-1: Near-Miss Counter Component

**Package Name:** `near-miss-counter`
**Description:** Display safety interventions with specific injury statistics and costs
**Dependencies:** WP-0 (types)
**Estimated Complexity:** Medium

**Files to Create/Modify:**
- CREATE: `src/components/near-miss-counter.tsx`
- CREATE: `src/lib/injury-statistics.ts`
- MODIFY: `src/app/page.tsx` (add state and render component)

**Sample Code:**

```typescript
// src/lib/injury-statistics.ts
import type { InjuryStats } from "@/types";

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
  sessionStart: Date;  // Required, not optional via fallback
  maxVisible?: number;
  showDetailedStats?: boolean;
}

export function NearMissCounter({
  interventions,
  sessionStart,
  maxVisible = 5,
  showDetailedStats = true
}: NearMissCounterProps) {
  const formatTimestamp = (date: Date) => {
    const elapsed = Math.floor((date.getTime() - sessionStart.getTime()) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalCostLow = interventions.reduce((sum, i) => sum + (i.estimatedCostLow || 0), 0);
  const totalCostHigh = interventions.reduce((sum, i) => sum + (i.estimatedCostHigh || 0), 0);

  const visibleInterventions = interventions.slice(-maxVisible);

  return (
    <div
      className="bg-surface rounded-lg border border-border overflow-hidden"
      role="region"
      aria-label="Near-miss prevention counter"
    >
      {/* Header */}
      <div className="bg-danger/10 border-b border-danger/20 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-danger" aria-hidden="true" />
            <span className="font-semibold text-foreground">
              NEAR-MISSES PREVENTED
            </span>
          </div>
          <span
            className="text-2xl font-bold text-danger"
            aria-label={`${interventions.length} near-misses prevented`}
          >
            {interventions.length}
          </span>
        </div>
      </div>

      {/* Interventions List */}
      {interventions.length > 0 && (
        <div className="divide-y divide-border" role="list">
          {visibleInterventions.map((intervention) => {
            const stats = INJURY_STATISTICS[intervention.scenario];

            return (
              <div key={intervention.id} className="p-4 space-y-2" role="listitem">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-mono">
                      {formatTimestamp(intervention.timestamp)}
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
                      <Activity className="w-3 h-3" aria-hidden="true" />
                      <span>PREVENTED: {stats.injuryType}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 flex items-center justify-center">#</span>
                      <span>STATISTICS: {stats.annualIncidents} annually ({stats.source})</span>
                    </div>
                    <div className="flex items-center gap-1 text-safe">
                      <DollarSign className="w-3 h-3" aria-hidden="true" />
                      <span>
                        COST AVOIDED: {formatCurrency(stats.estimatedCostLow)} - {formatCurrency(stats.estimatedCostHigh)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" aria-hidden="true" />
                      <span>RECOVERY TIME: {stats.recoveryTime}</span>
                    </div>
                  </div>
                )}

                {/* Fallback for unrecognized scenarios */}
                {showDetailedStats && !stats && (
                  <div className="text-xs text-muted-foreground italic">
                    Safety intervention recorded
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
- [ ] Handles unrecognized scenarios (shows fallback, not "$0")
- [ ] Styled consistently with design system
- [ ] Includes ARIA labels for accessibility

**Can be parallelized with:** WP-2, WP-3, WP-6 (after WP-0 completes)

---

### WP-2: Enhanced Latency Indicator

**Package Name:** `latency-enhanced`
**Description:** Enhanced latency visualization with session stats (NO fake breakdown)
**Dependencies:** WP-0 (types)
**Estimated Complexity:** Low

**Note:** Removed pipeline breakdown per critic feedback - cannot measure client-side.

**Files to Create/Modify:**
- MODIFY: `src/components/latency-indicator.tsx` (enhance existing)
- MODIFY: `src/app/page.tsx` (add latency history state)

**Sample Code:**

```typescript
// src/components/latency-indicator.tsx (ENHANCED)
"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Zap } from "lucide-react"
import type { LatencyLevel } from "@/types"

interface EnhancedLatencyIndicatorProps {
  level: LatencyLevel;
  currentMs: number;
  latencyHistory: number[];
  isExpanded?: boolean;
}

const LATENCY_COLORS = {
  good: { bg: 'bg-safe', text: 'text-safe' },
  moderate: { bg: 'bg-warning', text: 'text-warning' },
  slow: { bg: 'bg-orange-500', text: 'text-orange-500' },
  critical: { bg: 'bg-danger', text: 'text-danger' },
};

export function EnhancedLatencyIndicator({
  level,
  currentMs,
  latencyHistory,
  isExpanded: initialExpanded = false
}: EnhancedLatencyIndicatorProps) {
  const [expanded, setExpanded] = useState(initialExpanded);

  const colors = LATENCY_COLORS[level];

  // Calculate session stats
  const avg = latencyHistory.length > 0
    ? Math.round(latencyHistory.reduce((a, b) => a + b, 0) / latencyHistory.length)
    : 0;

  const sortedHistory = [...latencyHistory].sort((a, b) => a - b);
  const p95Index = Math.floor(sortedHistory.length * 0.95);
  const p95 = sortedHistory[p95Index] ?? 0;

  const percentage = Math.min((currentMs / 1000) * 100, 100);

  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden">
      {/* Compact View */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-surface-light transition-colors"
        aria-expanded={expanded}
        aria-label={`Latency: ${currentMs} milliseconds, ${level}`}
      >
        <div className="flex items-center gap-3">
          <Zap className={`w-4 h-4 ${colors.text}`} aria-hidden="true" />
          <span className="font-medium">Response Time</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`font-bold ${colors.text}`}>{currentMs}ms</span>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
          )}
        </div>
      </button>

      {/* Expanded View - Session Stats Only (no fake breakdown) */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
          {/* Total with bar */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Current:</span>
              <span className={`font-bold ${colors.text}`}>{currentMs}ms</span>
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
            <div className="pt-2 border-t border-border text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Session Average:</span>
                <span className="font-mono">{avg}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">P95:</span>
                <span className="font-mono">{p95}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Samples:</span>
                <span className="font-mono">{latencyHistory.length}</span>
              </div>
            </div>
          )}

          {latencyHistory.length === 0 && (
            <p className="text-sm text-muted-foreground text-center">
              Collecting data...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
```

**Acceptance Criteria:**
- [ ] Shows compact view with current latency and color
- [ ] Expands to show session statistics
- [ ] Visual bar indicator for current latency
- [ ] Color-coded by latency threshold
- [ ] Shows session average and P95
- [ ] Updates in real-time
- [ ] NO fake breakdown data (honest implementation)
- [ ] Includes ARIA attributes

**Can be parallelized with:** WP-1, WP-3 (after WP-0 completes)

---

### WP-3: Moment Timeline Component

**Package Name:** `moment-timeline`
**Description:** Display detected moments during session with lessons
**Dependencies:** WP-0 (types), WP-5 (parsing - for integration)
**Estimated Complexity:** Medium

**Note:** Moment parsing logic moved to WP-5 per critic feedback (consolidation).

**Files to Create/Modify:**
- CREATE: `src/components/moment-timeline.tsx`
- MODIFY: `src/app/page.tsx` (add state and render component)

**Sample Code:**

```typescript
// src/components/moment-timeline.tsx
"use client"

import {
  ArrowRight, Lightbulb, AlertCircle, CheckCircle,
  XCircle, Star, BookOpen, Shield
} from "lucide-react"
import type { DetectedMoment, MomentType } from "@/types"

interface MomentTimelineProps {
  moments: DetectedMoment[];
  sessionStart: Date;
  maxVisible?: number;
}

const MOMENT_ICONS: Record<MomentType, React.ReactNode> = {
  new_step: <ArrowRight className="w-4 h-4" />,
  technique: <Star className="w-4 h-4" />,
  problem: <XCircle className="w-4 h-4" />,
  solution: <CheckCircle className="w-4 h-4" />,
  mistake: <AlertCircle className="w-4 h-4" />,
  tip: <Lightbulb className="w-4 h-4" />,
  lesson: <BookOpen className="w-4 h-4" />,
  safety: <Shield className="w-4 h-4" />,
};

const MOMENT_COLORS: Record<MomentType, string> = {
  new_step: 'text-primary border-primary/20 bg-primary/5',
  technique: 'text-safe border-safe/20 bg-safe/5',
  problem: 'text-danger border-danger/20 bg-danger/5',
  solution: 'text-safe border-safe/20 bg-safe/5',
  mistake: 'text-warning border-warning/20 bg-warning/5',
  tip: 'text-primary border-primary/20 bg-primary/5',
  lesson: 'text-primary border-primary/20 bg-primary/5',
  safety: 'text-danger border-danger/20 bg-danger/5',
};

const MOMENT_LABELS: Record<MomentType, string> = {
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
    <div
      className="bg-surface rounded-lg border border-border"
      role="region"
      aria-label="Moment timeline"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" aria-hidden="true" />
            Moment Timeline
          </h3>
          <span className="text-sm text-muted-foreground">
            {moments.length} captured
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-h-96 overflow-y-auto" role="list">
        {visibleMoments.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p className="text-sm">No moments captured yet</p>
            <p className="text-xs mt-1">Sir Reginald is observing...</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {visibleMoments.map((moment) => (
              <div key={moment.id} className="p-4 space-y-2" role="listitem">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-1.5 rounded ${MOMENT_COLORS[moment.type]}`}
                    aria-hidden="true"
                  >
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
- [ ] Includes ARIA labels for accessibility

**Can be parallelized with:** WP-1, WP-2 (after WP-0 completes)

---

### WP-4: Dual Directive Prompt Enhancement

**Package Name:** `dual-directive-prompt`
**Description:** Combine safety and witness prompts with pattern detection and context-aware suggestions
**Dependencies:** None (prompt only)
**Estimated Complexity:** Medium (upgraded from Low per critic)

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

VALID MOMENT TYPES (must be one of these exactly):
- NEW_STEP: Major phase change (starting a cut, assembly begins, etc.)
- TECHNIQUE: Notable skill or method being demonstrated
- PROBLEM: Issue encountered (failed print, bad cut, stuck piece)
- SOLUTION: Problem being resolved
- MISTAKE: Error made (can be recovered from)
- TIP: Best practice worth noting
- LESSON: Insight or learning moment
- SAFETY: Safety-related observation

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
- [ ] Includes `<moment>` tag format for parsing with VALID types list
- [ ] Includes `<suggestion>` tag for pattern analysis
- [ ] Includes `<document>` tag for generation
- [ ] Includes session verdict guidelines
- [ ] Includes edge case handling
- [ ] Uses userName throughout
- [ ] **TESTED:** Prompt produces parseable tags with Gemini (verify before WP-5)

**MUST complete before:** WP-5
**Can be parallelized with:** WP-0, WP-1, WP-2, WP-3

---

### WP-5: Response Parser Utilities

**Package Name:** `response-parser`
**Description:** Parse Gemini text responses for moments, suggestions, and documents
**Dependencies:** WP-0 (types), WP-4 (MUST complete first - defines tag format)
**Estimated Complexity:** Medium (upgraded from Low per critic)

**Note:** Consolidated all parsing here (removed duplicate WP-3 parser).

**Files to Create/Modify:**
- CREATE: `src/lib/response-parser.ts`
- MODIFY: `src/hooks/use-gemini-live.ts` (use parser)

**Sample Code:**

```typescript
// src/lib/response-parser.ts
import type { DetectedMoment, MomentType, SafetySuggestion, ParsedResponse } from "@/types";

// Valid moment types for validation
const VALID_MOMENT_TYPES: MomentType[] = [
  'new_step', 'technique', 'problem', 'solution',
  'mistake', 'tip', 'lesson', 'safety'
];

/**
 * Parse a Gemini response to extract structured data
 * Handles malformed JSON gracefully
 */
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

      // Validate and normalize type (case-insensitive)
      const rawType = parsed.type?.toLowerCase() || 'tip';
      const validType = VALID_MOMENT_TYPES.includes(rawType as MomentType)
        ? rawType as MomentType
        : 'tip';  // Default to 'tip' for unknown types

      moments.push({
        id: `moment-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        timestamp: now,
        elapsedSeconds: Math.floor((now.getTime() - sessionStart.getTime()) / 1000),
        type: validType,
        title: parsed.title || 'Observation',
        description: parsed.description || '',
        reasoning: parsed.reasoning,
        lesson: parsed.lesson,
      });
    } catch (e) {
      console.warn('Failed to parse moment tag:', e, 'Content:', match[1]);
      // Don't crash - just skip malformed moment
    }
    plainText = plainText.replace(match[0], '');
  }

  // Parse <suggestion> tag
  const suggestionMatch = text.match(/<suggestion>([\s\S]*?)<\/suggestion>/);
  if (suggestionMatch) {
    try {
      const parsed = JSON.parse(suggestionMatch[1].trim());
      suggestion = {
        scenario: parsed.scenario || 'unknown',
        count: parsed.count || 0,
        suggestion: parsed.suggestion || ''
      };
    } catch (e) {
      console.warn('Failed to parse suggestion tag:', e);
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

/**
 * Extract scenario from warning text for pattern tracking
 */
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

/**
 * Remove all structured tags from text, leaving only spoken content
 */
export function removeAllTags(text: string): string {
  return text
    .replace(/<moment>[\s\S]*?<\/moment>/g, '')
    .replace(/<suggestion>[\s\S]*?<\/suggestion>/g, '')
    .replace(/<document>[\s\S]*?<\/document>/g, '')
    .trim();
}
```

**Acceptance Criteria:**
- [ ] Parses `<moment>` tags into DetectedMoment objects with type validation
- [ ] Parses `<suggestion>` tags into SafetySuggestion objects
- [ ] Parses `<document>` tags for generated documentation
- [ ] Returns clean plainText without tags
- [ ] Handles malformed JSON gracefully (logs warning, continues)
- [ ] Validates moment types against allowed list (defaults to 'tip')
- [ ] Uses `.substring()` not `.substr()`
- [ ] Extracts scenario from warning text

**CANNOT be parallelized with WP-4** - must complete WP-4 first
**Can be parallelized with:** WP-1, WP-2, WP-3 (after WP-4)

---

### WP-6: Session Verdict Component

**Package Name:** `session-verdict`
**Description:** Enhanced session end modal with Reginald's spoken verdict
**Dependencies:** WP-0 (types), WP-1 (intervention data format), WP-11 (verdict trigger)
**Estimated Complexity:** High (upgraded from Medium per critic - needs audio sync)

**Files to Create/Modify:**
- CREATE: `src/components/session-verdict.tsx`
- MODIFY: `src/app/page.tsx` (integrate component)

**Sample Code:**

```typescript
// src/components/session-verdict.tsx
"use client"

import { useState, useEffect } from "react"
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
  isVerdictSpeaking: boolean;  // From parent, tracks Gemini audio
  onRequestVerdict: () => void;  // Trigger Gemini to speak verdict
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
  isVerdictSpeaking,
  onRequestVerdict,
  onGenerateDoc,
  onExport,
  onClose,
}: SessionVerdictProps) {
  const [verdictRequested, setVerdictRequested] = useState(false);

  // Request verdict on mount
  useEffect(() => {
    if (!verdictRequested) {
      setVerdictRequested(true);
      onRequestVerdict();
    }
  }, [verdictRequested, onRequestVerdict]);

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="verdict-title"
    >
      <div className="bg-surface rounded-xl border border-border max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-surface">
          <h2 id="verdict-title" className="text-xl font-bold flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">&#127913;</span>
            Reginald's Verdict
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Close verdict modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verdict Content */}
        <div className="p-6 space-y-4">
          {/* Speaking indicator */}
          <div className="flex items-center gap-2 text-primary text-sm" aria-live="polite">
            <Volume2 className={`w-4 h-4 ${isVerdictSpeaking ? 'animate-pulse' : ''}`} aria-hidden="true" />
            <span className="italic">
              {isVerdictSpeaking ? 'Sir Reginald is speaking...' : 'Verdict delivered'}
            </span>
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
- [ ] Speaking indicator animation synced with actual Gemini audio
- [ ] Maintains character throughout
- [ ] Includes ARIA labels and focus management
- [ ] Triggers `requestVerdict()` on mount to start Gemini audio

**Can be parallelized with:** WP-2, WP-3, WP-7

---

### WP-7: Document Viewer Component

**Package Name:** `document-viewer`
**Description:** Display and export generated documentation
**Dependencies:** WP-0 (types), WP-5 (document parsing)
**Estimated Complexity:** Medium

**Files to Create/Modify:**
- CREATE: `src/components/document-viewer.tsx`
- CREATE: `src/lib/document-export.ts`

**Sample Code:**

```typescript
// src/lib/document-export.ts
// NOTE: Parameter renamed from 'document' to 'content' to avoid collision with window.document

export function exportAsMarkdown(content: string, filename?: string): void {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = window.document.createElement('a');
  a.href = url;
  a.download = filename || `sir-reginald-session-${new Date().toISOString().split('T')[0]}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportAsText(content: string, filename?: string): void {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = window.document.createElement('a');
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
  content: string;  // Renamed from 'document' to avoid confusion
  onClose: () => void;
}

export function DocumentViewer({ content, onClose }: DocumentViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportMd = () => {
    exportAsMarkdown(content);
  };

  const handleExportTxt = () => {
    exportAsText(content);
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="doc-title"
    >
      <div className="bg-surface rounded-xl border border-border max-w-4xl w-full shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
          <h2 id="doc-title" className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" aria-hidden="true" />
            Generated Documentation
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
            >
              {copied ? <Check className="w-4 h-4 text-safe" /> : <Copy className="w-4 h-4" />}
            </Button>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Close document viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {renderMarkdown(content)}
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
- [ ] **NO variable name collision** (uses `content` not `document`)
- [ ] Includes ARIA labels

**Can be parallelized with:** WP-1, WP-2, WP-6

---

### WP-8: Main Page Integration

**Package Name:** `main-integration`
**Description:** Integrate all new components and state into main page
**Dependencies:** WP-0, WP-1, WP-2, WP-3, WP-4, WP-5, WP-6, WP-7, **WP-11** (hook enhancement)
**Estimated Complexity:** Very High

**Files to Modify:**
- MODIFY: `src/app/page.tsx` (major updates)
- MODIFY: `src/types/index.ts` (verify imports)

**Key Changes:**

```typescript
// src/app/page.tsx - ADDITIONS

import { NearMissCounter } from "@/components/near-miss-counter"
import { EnhancedLatencyIndicator } from "@/components/latency-indicator"
import { MomentTimeline } from "@/components/moment-timeline"
import { SessionVerdict } from "@/components/session-verdict"
import { DocumentViewer } from "@/components/document-viewer"
import { parseGeminiResponse, extractScenarioFromWarning } from "@/lib/response-parser"
import { INJURY_STATISTICS } from "@/lib/injury-statistics"
import type { SafetyIntervention, DetectedMoment, ParsedResponse } from "@/types"

// ERROR BOUNDARY (wrap new components)
import { ErrorBoundary } from "@/components/error-boundary"  // CREATE this

// NEW STATE (add to component)
const [interventions, setInterventions] = useState<SafetyIntervention[]>([]);
const [moments, setMoments] = useState<DetectedMoment[]>([]);
const [warningPatterns, setWarningPatterns] = useState<Record<string, number>>({});
const [latencyHistory, setLatencyHistory] = useState<number[]>([]);
const [generatedDocument, setGeneratedDocument] = useState<string | null>(null);
const [showVerdict, setShowVerdict] = useState(false);
const [showDocViewer, setShowDocViewer] = useState(false);
const [isVerdictSpeaking, setIsVerdictSpeaking] = useState(false);

// REMOVE sessionData.safetyInterventions - derive from interventions.length instead
// This fixes the state duplication issue identified by critic

// ENHANCED handleGeminiText (replace existing)
const handleGeminiText = useCallback((text: string) => {
  // Ensure sessionStartTime is set before processing
  const sessionStart = sessionStartTime || new Date();

  // Parse structured content
  const parsed = parseGeminiResponse(text, sessionStart);

  // Handle moments
  if (parsed.moments.length > 0) {
    setMoments(prev => [...prev, ...parsed.moments]);
  }

  // Handle document
  if (parsed.document) {
    setGeneratedDocument(parsed.document);
  }

  // Existing overlay/alert logic uses plainText (without tags)
  const region = detectRegionFromText(parsed.plainText);
  if (region) {
    setAttentionArea("general");
    setTimeout(() => setAttentionArea(null), 3000);
  }

  // Safety detection and pattern tracking
  const lowerText = parsed.plainText.toLowerCase();
  const isShout = lowerText.includes("hand!") || lowerText.includes("stop!");
  const isDanger = isShout || lowerText.includes("danger") || lowerText.includes("blade");
  const isWarning = lowerText.includes("safety glasses") || lowerText.includes("spectacles") ||
                    lowerText.includes("pardon") || lowerText.includes("notice");

  if ((isDanger || isWarning) && !isSnoozed) {
    const scenario = extractScenarioFromWarning(parsed.plainText);
    const stats = scenario ? INJURY_STATISTICS[scenario] : null;

    // Create intervention record
    const newIntervention: SafetyIntervention = {
      id: Date.now().toString(),
      timestamp: new Date(),
      sessionStart: sessionStart,
      type: isShout ? 'shout' : 'warning',
      scenario: scenario || 'unknown',
      description: parsed.plainText.slice(0, 100),
      latencyMs: latencyHistory[latencyHistory.length - 1] || 0,
      estimatedCostLow: stats?.estimatedCostLow || 0,
      estimatedCostHigh: stats?.estimatedCostHigh || 0,
    };
    setInterventions(prev => [...prev, newIntervention]);

    // Update pattern tracking
    if (scenario) {
      setWarningPatterns(prev => ({
        ...prev,
        [scenario]: (prev[scenario] || 0) + 1,
      }));
    }

    // Existing alert logic
    const alert: SafetyAlert = {
      id: Date.now().toString(),
      type: isShout ? "shout" : isDanger ? "danger" : "warning",
      message: parsed.plainText,
      timestamp: new Date(),
      autoDismissAt: new Date(Date.now() + (isShout ? 10000 : 8000))
    };
    setActiveAlert(alert);
  }

  // Update safety status (existing logic)
  if (lowerText.includes("safety glasses on") || lowerText.includes("splendid")) {
    setSafetyStatus(prev => ({ ...prev, eyeProtection: "ok", lastCheck: new Date() }));
  } else if (lowerText.includes("safety glasses") || lowerText.includes("spectacles")) {
    setSafetyStatus(prev => ({ ...prev, eyeProtection: "warning", lastCheck: new Date() }));
  }
}, [sessionStartTime, isSnoozed, latencyHistory]);

// TRACK LATENCY HISTORY
const handleLatencyChange = useCallback((level: LatencyLevel, ms?: number) => {
  setLatencyLevel(level);
  if (ms !== undefined) {
    setLatencyHistory(prev => [...prev.slice(-99), ms]);  // Keep last 100
  }
}, []);

// VERDICT AND DOC GENERATION HANDLERS
const handleRequestVerdict = useCallback(() => {
  setIsVerdictSpeaking(true);
  requestVerdict();  // From enhanced hook (WP-11)
}, [requestVerdict]);

const handleGenerateDoc = useCallback(() => {
  sendTextPrompt("Please generate the documentation for this session.");  // From WP-11
}, [sendTextPrompt]);

// UPDATE sessionData to derive from interventions
// REMOVE: safetyInterventions: number from state
// REPLACE with computed value:
const sessionStats = {
  ...sessionData,
  safetyInterventions: interventions.length,
  criticalSaves: interventions.filter(i => i.type === 'shout').length,
};
```

**Acceptance Criteria:**
- [ ] All new state properly initialized
- [ ] Response parsing integrated into Gemini handler
- [ ] Near-miss counter rendered in layout
- [ ] Enhanced latency indicator rendered in layout
- [ ] Moment timeline rendered in layout
- [ ] Session verdict modal integrated
- [ ] Document viewer modal integrated
- [ ] Pattern tracking working
- [ ] All data flows correctly between components
- [ ] **NO state duplication** - safetyInterventions derived from interventions.length
- [ ] **sessionStartTime null check** - uses fallback Date() if null
- [ ] **Error boundaries** wrap new components
- [ ] Latency history tracked correctly

**CANNOT be parallelized - must wait for WP-0 through WP-7 AND WP-11**

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
    <div
      className="absolute top-3 left-3 flex items-center gap-3 bg-black/70 rounded px-3 py-1.5"
      aria-label="Live session metrics"
    >
      {/* Watching indicator */}
      <div className="flex items-center gap-1.5">
        <Eye className="w-3.5 h-3.5 text-safe" aria-hidden="true" />
        <span className="text-xs text-white/90">Watching</span>
      </div>

      <div className="w-px h-4 bg-white/20" aria-hidden="true" />

      {/* Latency */}
      <div className="flex items-center gap-1.5">
        <Clock className={`w-3.5 h-3.5 ${LATENCY_COLORS[latencyLevel]}`} aria-hidden="true" />
        <span
          className={`text-xs font-mono ${LATENCY_COLORS[latencyLevel]}`}
          aria-label={`Response time: ${latencyMs} milliseconds`}
        >
          {latencyMs}ms
        </span>
      </div>

      <div className="w-px h-4 bg-white/20" aria-hidden="true" />

      {/* Moments */}
      <div className="flex items-center gap-1.5">
        <BookOpen className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
        <span className="text-xs text-white/90" aria-label={`${momentCount} moments captured`}>
          {momentCount}
        </span>
      </div>

      <div className="w-px h-4 bg-white/20" aria-hidden="true" />

      {/* Interventions */}
      <div className="flex items-center gap-1.5">
        <AlertTriangle
          className={`w-3.5 h-3.5 ${interventionCount > 0 ? 'text-danger' : 'text-white/50'}`}
          aria-hidden="true"
        />
        <span
          className={`text-xs ${interventionCount > 0 ? 'text-danger' : 'text-white/90'}`}
          aria-label={`${interventionCount} safety interventions`}
        >
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
- [ ] Includes ARIA labels

**Can be parallelized with:** WP-10

---

### WP-10: Test Logging Infrastructure

**Package Name:** `test-logging`
**Description:** Persistent logging infrastructure for test sessions
**Dependencies:** WP-0 (types), WP-8 (session data to log)
**Estimated Complexity:** Medium

**Files to Create/Modify:**
- CREATE: `src/lib/test-harness.ts`
- MODIFY: `src/app/page.tsx` (add logging calls)

**Sample Code:**

```typescript
// src/lib/test-harness.ts
import type { TestLog, TestLogEntry } from "@/types";

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

  clearAllLogs(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// Singleton for easy access
let testHarnessInstance: TestHarness | null = null;

export function getTestHarness(sessionId?: string): TestHarness {
  if (!testHarnessInstance) {
    testHarnessInstance = new TestHarness(sessionId);
  }
  return testHarnessInstance;
}

export function resetTestHarness(sessionId?: string): TestHarness {
  testHarnessInstance = new TestHarness(sessionId);
  return testHarnessInstance;
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
- [ ] Clear all logs functionality

**Can be parallelized with:** WP-9

---

### WP-11: Gemini Hook Enhancement (NEW)

**Package Name:** `gemini-hook-enhancement`
**Description:** Add methods for triggering verdict and document generation
**Dependencies:** WP-4 (prompt format)
**Estimated Complexity:** Medium

**This WP addresses the critic's concern about missing integration for spoken verdict and document generation.**

**Files to Modify:**
- MODIFY: `src/hooks/use-gemini-live.ts`

**Sample Code:**

```typescript
// src/hooks/use-gemini-live.ts - ADD these methods

// Add to interface
interface UseGeminiLiveOptions {
  userName: string
  onAudio?: (audioData: ArrayBuffer) => void
  onText?: (text: string) => void
  onStatusChange?: (status: ConnectionStatus) => void
  onLatencyChange?: (level: LatencyLevel, ms?: number) => void  // ENHANCED: now includes ms
}

// Add inside hook, after sendAudio

// Send text prompt (for verdict/documentation requests)
const sendTextPrompt = useCallback(async (text: string) => {
  if (!sessionRef.current) {
    console.warn('Cannot send text prompt: not connected');
    return;
  }

  try {
    await sessionRef.current.send({
      clientContent: {
        turns: [{
          role: "user",
          parts: [{ text }]
        }],
        turnComplete: true
      }
    });
  } catch (error) {
    console.error("Error sending text prompt:", error);
  }
}, []);

// Request session verdict (convenience method)
const requestVerdict = useCallback(async () => {
  const verdictPrompt = `Please deliver your session verdict now. Summarize what we accomplished, the moments you documented, safety interventions you made, and any suggestions for next time. Speak this as Sir Reginald would.`;
  await sendTextPrompt(verdictPrompt);
}, [sendTextPrompt]);

// Request documentation generation (convenience method)
const requestDocumentation = useCallback(async () => {
  const docPrompt = `Please generate the full documentation for this session now. Include all the steps, techniques, problems solved, and lessons learned. Output it in the <document> tag format.`;
  await sendTextPrompt(docPrompt);
}, [sendTextPrompt]);

// MODIFY return statement
return {
  status,
  latencyLevel,
  isThinking,
  connect,
  disconnect,
  sendVideoFrame,
  sendAudio,
  sendTextPrompt,      // NEW
  requestVerdict,      // NEW
  requestDocumentation, // NEW
  needsTokenRefresh
}

// MODIFY updateLatency to include ms value
const updateLatency = useCallback((ms: number) => {
  const level = getLatencyLevel(ms)
  setLatencyLevel(level)
  onLatencyChange?.(level, ms)  // Pass ms value
}, [onLatencyChange])
```

**Acceptance Criteria:**
- [ ] `sendTextPrompt()` method sends text to Gemini session
- [ ] `requestVerdict()` triggers spoken session summary
- [ ] `requestDocumentation()` triggers document generation
- [ ] `onLatencyChange` callback now receives both level and ms value
- [ ] Methods handle disconnected state gracefully
- [ ] Error handling for failed sends

**MUST complete before:** WP-8
**Can be parallelized with:** WP-1, WP-2, WP-3, WP-6, WP-7

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
    <div
      className="bg-surface rounded-lg border border-border"
      role="region"
      aria-label="Component description"
    >
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

### 4.2 Error Boundary Pattern (NEW)

```typescript
// src/components/error-boundary.tsx
"use client"

import { Component, ReactNode } from "react"

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-danger/10 border border-danger/20 rounded-lg">
          <p className="text-sm text-danger">Something went wrong loading this component.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 4.3 Type Definitions Pattern

All types go in `src/types/index.ts` (see WP-0).

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
    return null;  // Return null, don't crash
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
<NearMissCounter interventions={interventions} sessionStart={sessionStartTime!} />
<MomentTimeline moments={moments} sessionStart={sessionStartTime!} />
```

### 5.2 Event System

Components communicate upward via callbacks:

```typescript
// Parent provides handler
<SessionVerdict
  onRequestVerdict={handleRequestVerdict}
  onGenerateDoc={handleGenerateDoc}
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

## 6. Development Phases (REVISED)

### Phase 1: Foundation & Core Features - Days 1-10

**Work Packages:** WP-0, WP-1, WP-2, WP-3, WP-4, WP-5

**Goal:** All core v10 features implemented

| Day | Tasks | Packages | Notes |
|-----|-------|----------|-------|
| 1 | Type consolidation | WP-0 | MUST complete first |
| 2-3 | Injury statistics, Near-miss counter | WP-1 | Can start after WP-0 |
| 2-3 | Enhanced latency indicator | WP-2 | Can start after WP-0 |
| 4-5 | Moment timeline | WP-3 | Can start after WP-0 |
| 4-5 | Dual directive prompt | WP-4 | No dependencies |
| 6-7 | Response parser | WP-5 | MUST wait for WP-4 |
| 8-10 | Buffer for testing, iteration | - | Prompt testing with Gemini |

**Milestone:** Core components render, response parsing works, prompt produces tags

### Phase 2: Enhancement & Integration - Days 11-15

**Work Packages:** WP-6, WP-7, WP-11, WP-8, WP-9, WP-10

**Goal:** Full integration, session verdict, documentation

| Day | Tasks | Packages | Notes |
|-----|-------|----------|-------|
| 11 | Session verdict component | WP-6 | After WP-1 |
| 11 | Document viewer | WP-7 | After WP-5 |
| 12 | Gemini hook enhancement | WP-11 | Critical for integration |
| 13-14 | Main page integration | WP-8 | After WP-11 |
| 15 | Live overlay, test logging | WP-9, WP-10 | After WP-8 |

**Milestone:** Complete end-to-end flow works

### Phase 3: Polish & Testing - Days 16-19

**Goal:** Bug fixes, edge cases, reliability testing

| Day | Tasks |
|-----|-------|
| 16 | Test all 5 safety scenarios (3x each) |
| 16-17 | Test pattern detection and suggestions |
| 17 | Test document generation |
| 18 | Edge case handling, latency testing |
| 19 | Cross-browser testing, accessibility audit |

**Test Mocks:** Create mock Gemini responses for offline testing:
- Mock safety warning response
- Mock moment tag response
- Mock suggestion tag response
- Mock document tag response

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
- [ ] Invalid moment types default to 'tip'

**Session End:**
- [ ] Verdict modal displays correctly
- [ ] Stats are accurate
- [ ] Spoken verdict triggers Gemini audio
- [ ] Document generates properly
- [ ] Export works (Markdown, Text)

**Edge Cases:**
- [ ] Poor lighting feedback
- [ ] Camera obstruction feedback
- [ ] Connection loss and recovery
- [ ] Latency spike handling
- [ ] Malformed JSON in tags

### 7.2 Mock Data for Offline Testing

Create `src/lib/test-mocks.ts`:

```typescript
export const MOCK_RESPONSES = {
  safetyWarning: `I notice you're reaching toward the laser cutter without safety spectacles, old sport. Do let's pop those on before proceeding.`,

  shout: `Marcus! HAND! Do forgive me for raising my voice - but that was rather too close for comfort.`,

  withMoment: `Ah, moving on to assembly. I shall note the transition.

<moment>
{"type": "NEW_STEP", "title": "Assembly begins", "description": "Transitioning from cutting to assembly phase"}
</moment>`,

  withSuggestion: `I've noticed you've been reaching across the blade quite frequently today - that's the fourth time.

<suggestion>
{"scenario": "hand_near_blade", "count": 4, "suggestion": "Might I suggest repositioning your workpiece so the offcuts fall on your side?"}
</suggestion>`,

  withDocument: `The documentation is ready.

<document>
# Workshop Project - Tutorial by Sir Reginald

## Overview
A successful afternoon building a custom shelf.
</document>`
};
```

### 7.3 Demo Scenario Testing

Run through the exact demo script 10+ times:

1. **Hook** - Stats display ready
2. **Safety glasses** - Warning triggers, counter increments
3. **THE SHOUT** - Triggers reliably, latency <500ms
4. **Near-miss counter** - Shows stats correctly
5. **Moments** - Timeline populates
6. **Documentation** - Generates with all sections
7. **Verdict** - Delivers complete summary

---

## 8. Risk Mitigation (ENHANCED)

### 8.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Gemini response inconsistent | Medium | High | **Prompt engineering iteration**, fuzzy parsing, explicit tag format in prompt |
| Gemini doesn't output tags | Medium | High | Test prompt early (Day 4-5), iterate if needed, fallback to raw text |
| Latency too high for demo | Low | High | Record multiple takes, optimize frame size |
| Context window overflow | Low | Medium | Monitor token usage, compress |
| Audio playback issues | Medium | Medium | Test across browsers |
| State management complexity | High | Medium | **Consider useReducer if needed** |

### 8.2 Scope Reduction Options

**If running short on time, cut in this order:**

1. **Cut first:** Test logging infrastructure (WP-10)
2. **Cut second:** Live metric overlay (WP-9) - keep simple status bar
3. **Cut third:** Document export formats (keep Markdown only)
4. **Keep always:** THE SHOUT, safety scenarios, near-miss counter, session verdict

### 8.3 Essential vs Nice-to-Have

**ESSENTIAL (must ship):**
- THE SHOUT working reliably
- Near-miss counter with stats
- Session verdict spoken summary
- Basic documentation generation
- 5 safety scenarios working
- Response parsing for tags

**NICE-TO-HAVE (can cut):**
- Expanded latency stats (keep simple dot)
- Pattern detection suggestions
- Test logging infrastructure
- Live metric overlay
- PDF export
- Edge case feedback (poor lighting, etc.)

---

## 9. Revised Parallel Execution Matrix

| Package | Can Parallel With | CANNOT Parallel With | Must Complete First |
|---------|-------------------|---------------------|---------------------|
| WP-0: Types | None | ALL | - |
| WP-1: Near-Miss Counter | WP-2, WP-3, WP-4 | WP-5, WP-8 | WP-0 |
| WP-2: Latency Enhanced | WP-1, WP-3, WP-4 | WP-8 | WP-0 |
| WP-3: Moment Timeline | WP-1, WP-2, WP-4 | WP-8 | WP-0 |
| WP-4: Dual Directive Prompt | WP-1, WP-2, WP-3, WP-11 | WP-5 | - |
| WP-5: Response Parser | WP-1, WP-2, WP-3 | WP-4 | **WP-4** |
| WP-6: Session Verdict | WP-2, WP-3, WP-7 | WP-8 | WP-0, WP-1 |
| WP-7: Document Viewer | WP-1, WP-2, WP-6 | WP-8 | WP-0, WP-5 |
| WP-8: Main Integration | None | ALL | **ALL (0-7, 11)** |
| WP-9: Live Metric Overlay | WP-10 | WP-8 | WP-8 |
| WP-10: Test Logging | WP-9 | WP-8 | WP-0, WP-8 |
| WP-11: Hook Enhancement | WP-1, WP-2, WP-3, WP-6, WP-7 | WP-8 | WP-4 |

**Recommended execution order:**

```
Day 1: WP-0 (types)
Day 2-5: WP-1, WP-2, WP-3, WP-4 (parallel)
Day 6-7: WP-5 (after WP-4)
Day 8-10: Buffer, prompt testing
Day 11: WP-6, WP-7, WP-11 (parallel)
Day 12-14: WP-8 (integration)
Day 15: WP-9, WP-10 (parallel)
```

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

# Type check
npx tsc --noEmit
```

### Key File Paths

```
src/app/page.tsx              # Main application
src/hooks/use-gemini-live.ts  # Gemini connection
src/lib/prompts.ts            # System prompts
src/lib/response-parser.ts    # Tag parsing (NEW)
src/lib/injury-statistics.ts  # Injury data (NEW)
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

### Environment Requirements

- Node.js 18+
- npm 9+
- Chrome/Firefox/Safari (latest)
- Gemini API key in `.env.local`

---

*Development Plan v2.0 - Sir Reginald Makesworth III*
*"He Watches. He Remembers. He Protects."*
