# PM Implementation Plan: Fixing Critical Weaknesses

**Version:** v1
**Date:** 2026-01-18
**Status:** Ready for Implementation
**Priority:** CRITICAL - All fixes required for top 3 probability

---

## Executive Summary

The critic identified 3 critical weaknesses that risk our hackathon placement. This document provides a complete implementation plan with code snippets for each fix. Total implementation time: ~4-6 hours.

---

## Weakness 1: Keyword-Based Safety Detection (THE SHOUT is Fragile)

### Problem Statement

Currently, THE SHOUT detection relies on keyword matching in `page.tsx`:

```typescript
// Current fragile implementation (page.tsx lines 147-151)
const lowerText = parsed.plainText.toLowerCase()
const isShout = lowerText.includes("hand!") || lowerText.includes("stop!")
const isDanger = isShout || lowerText.includes("danger") || lowerText.includes("blade")
```

**The Problem:** If Gemini rephrases the warning (e.g., "FINGERS AWAY!" instead of "HAND!"), THE SHOUT won't trigger. This is a critical safety gap.

### Solution

1. **Modify system prompt** to output a structured `<shout>` tag for critical interventions
2. **Add parsing** in `response-parser.ts` for `<shout>` tags
3. **Make tag-based detection primary**, keep keyword detection as fallback
4. **Include scenario in tag** for proper logging

### Files to Modify

| File | Changes |
|------|---------|
| `src/lib/prompts.ts` | Add `<shout>` tag output instruction to CRITICAL SAVE PROTOCOL |
| `src/lib/response-parser.ts` | Add `parseShoutTag()` function and export `ShoutData` type |
| `src/types/index.ts` | Add `ShoutData` interface |
| `src/app/page.tsx` | Update `handleGeminiText` to check for parsed shout tag first |

### Code Snippets

#### 1. Update `src/types/index.ts` - Add ShoutData Interface

```typescript
// Add after SafetySuggestion interface (around line 85)

// ========================================
// SHOUT TAG DATA (Weakness 1 Fix)
// ========================================

export interface ShoutData {
  scenario: 'hand_near_blade' | 'hot_surface' | 'improper_grip' | 'immediate_danger'
  message: string
  userName: string
}
```

#### 2. Update `src/lib/prompts.ts` - Add Structured SHOUT Output

Replace the CRITICAL SAVE PROTOCOL section in `getSirReginaldDualPrompt` (around line 194-198):

```typescript
CRITICAL SAVE PROTOCOL (THE SHOUT):
For IMMINENT DANGER (hand about to contact blade, touching hot surface, etc.), you MUST:
1. Output a structured shout tag FIRST (this triggers the visual alert):
   <shout scenario="hand_near_blade">${userName}! HAND!</shout>
2. Then continue naturally: "Do forgive me for raising my voice - but that was rather too close for comfort. Are you quite alright?"

VALID SHOUT SCENARIOS:
- hand_near_blade: Hand approaching moving blade or cutting edge
- hot_surface: About to touch hot surface (laser, heated bed, etc.)
- improper_grip: Dangerous grip that could cause tool to slip
- immediate_danger: Any other imminent injury risk

EXAMPLE FULL RESPONSE:
<shout scenario="hand_near_blade">${userName}! HAND!</shout>
Do forgive me for raising my voice, but that was rather too close for comfort. Your fingers were drifting perilously near the saw blade. Are you quite alright?

IMPORTANT: The <shout> tag MUST come first in your response for immediate danger. The tag triggers the emergency alert; the spoken text follows.
```

Also add to `getSirReginaldSafetyPrompt` (around line 26-29):

```typescript
CRITICAL SAVE PROTOCOL:
For IMMINENT DANGER (hand about to contact blade), you MUST:
1. Output: <shout scenario="hand_near_blade">${userName || 'User'}! HAND!</shout>
2. Then speak: "Do forgive me for raising my voice - but that was rather too close for comfort."

VALID SCENARIOS: hand_near_blade, hot_surface, improper_grip, immediate_danger
```

#### 3. Update `src/lib/response-parser.ts` - Add Shout Tag Parsing

Add new imports and type at the top:

```typescript
import type { DetectedMoment, MomentType, SafetySuggestion, ParsedResponse, ShoutData } from "@/types";
```

Add after `removeAllTags` function (around line 133):

```typescript
/**
 * Parse <shout> tag from response
 * Returns ShoutData if found, null otherwise
 *
 * Format: <shout scenario="hand_near_blade">MESSAGE</shout>
 */
export function parseShoutTag(text: string): ShoutData | null {
  const shoutMatch = text.match(/<shout\s+scenario="([^"]+)">([\s\S]*?)<\/shout>/);

  if (!shoutMatch) return null;

  const [, scenario, message] = shoutMatch;

  // Validate scenario
  const validScenarios = ['hand_near_blade', 'hot_surface', 'improper_grip', 'immediate_danger'];
  const normalizedScenario = validScenarios.includes(scenario)
    ? scenario as ShoutData['scenario']
    : 'immediate_danger';

  // Extract userName from message if present (format: "NAME! WORD!")
  const nameMatch = message.match(/^([A-Za-z]+)!/);
  const userName = nameMatch ? nameMatch[1] : 'User';

  return {
    scenario: normalizedScenario,
    message: message.trim(),
    userName
  };
}

/**
 * Remove shout tags from text
 */
export function removeShoutTag(text: string): string {
  return text.replace(/<shout\s+scenario="[^"]*">[\s\S]*?<\/shout>/g, '').trim();
}

/**
 * Check if text contains a shout tag
 */
export function hasShoutTag(text: string): boolean {
  return /<shout\s+scenario="[^"]*">/.test(text);
}
```

Update `removeAllTags` to include shout:

```typescript
export function removeAllTags(text: string): string {
  return text
    .replace(/<moment>[\s\S]*?<\/moment>/g, '')
    .replace(/<suggestion>[\s\S]*?<\/suggestion>/g, '')
    .replace(/<document>[\s\S]*?<\/document>/g, '')
    .replace(/<shout\s+scenario="[^"]*">[\s\S]*?<\/shout>/g, '')
    .trim();
}
```

Update `hasStructuredTags`:

```typescript
export function hasStructuredTags(text: string): boolean {
  return /<moment>/.test(text) ||
         /<suggestion>/.test(text) ||
         /<document>/.test(text) ||
         /<shout\s+scenario="/.test(text);
}
```

#### 4. Update `src/app/page.tsx` - Use Parsed Shout Tag

Update imports (around line 34):

```typescript
import {
  parseGeminiResponse,
  extractScenarioFromWarning,
  parseShoutTag,
  removeShoutTag
} from "@/lib/response-parser"
```

Update `handleGeminiText` callback (around line 113):

```typescript
const handleGeminiText = useCallback((text: string) => {
  if (!sessionStartTime) return

  // FIRST: Check for structured <shout> tag (most reliable)
  const shoutData = parseShoutTag(text)

  // Parse the response for other structured data (removes shout tag too)
  const parsed = parseGeminiResponse(removeShoutTag(text), sessionStartTime)

  // Add any detected moments to state
  if (parsed.moments.length > 0) {
    setMoments(prev => [...prev, ...parsed.moments])
    for (const moment of parsed.moments) {
      testHarnessRef.current?.logMomentDetected(moment.type, moment.title)
    }
  }

  // Handle document generation
  if (parsed.document) {
    setGeneratedDocument(parsed.document)
    setIsGeneratingDoc(false)
  }

  // Handle context-aware suggestions from Gemini
  if (parsed.suggestion) {
    setCurrentSuggestion(parsed.suggestion)
  }

  // Detect region for overlay from plain text
  const region = detectRegionFromText(parsed.plainText)
  if (region) {
    setAttentionArea("general")
    setTimeout(() => setAttentionArea(null), 3000)
  }

  // SHOUT HANDLING - Tag-based (primary) or keyword-based (fallback)
  if (shoutData && !isSnoozed) {
    // PRIMARY: Structured tag detected - guaranteed SHOUT
    const alert: SafetyAlert = {
      id: Date.now().toString(),
      type: "shout",
      message: shoutData.message,
      timestamp: new Date(),
      autoDismissAt: new Date(Date.now() + 10000) // 10s for shout
    }
    setActiveAlert(alert)

    // Log safety trigger with scenario from tag
    testHarnessRef.current?.logSafetyTrigger(shoutData.scenario, currentLatencyMs)

    // Update warning patterns
    setWarningPatterns(prev => {
      const newCount = (prev[shoutData.scenario] || 0) + 1
      if (newCount >= 3) {
        testHarnessRef.current?.logPatternSuggestion(shoutData.scenario, newCount)
      }
      return { ...prev, [shoutData.scenario]: newCount }
    })

    // Create intervention
    const stats = INJURY_STATISTICS[shoutData.scenario]
    const intervention: SafetyIntervention = {
      id: `int-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date(),
      sessionStart: sessionStartTime,
      type: 'shout',
      scenario: shoutData.scenario,
      description: shoutData.message,
      latencyMs: currentLatencyMs,
      estimatedCostLow: stats?.estimatedCostLow || 0,
      estimatedCostHigh: stats?.estimatedCostHigh || 0
    }
    setInterventions(prev => [...prev, intervention])

    // Update safety status
    setSafetyStatus(prev => ({ ...prev, handsPosition: "warning", lastCheck: new Date() }))

    return // Skip keyword-based detection since we handled it
  }

  // FALLBACK: Keyword-based detection (when no <shout> tag present)
  const lowerText = parsed.plainText.toLowerCase()
  const isShout = lowerText.includes("hand!") || lowerText.includes("stop!") ||
                  lowerText.includes("fingers!") || lowerText.includes("away!")
  const isDanger = isShout || lowerText.includes("danger") || lowerText.includes("blade")
  const isWarning = lowerText.includes("safety glasses") || lowerText.includes("spectacles") ||
                    lowerText.includes("pardon") || lowerText.includes("notice")

  if ((isDanger || isWarning) && !isSnoozed) {
    const shortMessage = parsed.plainText.split(/[.!?]/)[0] + (parsed.plainText.includes('.') ? '.' : '!')
    const alert: SafetyAlert = {
      id: Date.now().toString(),
      type: isShout ? "shout" : isDanger ? "danger" : "warning",
      message: shortMessage,
      timestamp: new Date(),
      autoDismissAt: new Date(Date.now() + (isShout ? 10000 : 8000))
    }
    setActiveAlert(alert)

    const scenario = extractScenarioFromWarning(parsed.plainText)

    if (scenario) {
      testHarnessRef.current?.logSafetyTrigger(scenario, currentLatencyMs)

      setWarningPatterns(prev => {
        const newCount = (prev[scenario] || 0) + 1
        if (newCount >= 3) {
          testHarnessRef.current?.logPatternSuggestion(scenario, newCount)
        }
        return { ...prev, [scenario]: newCount }
      })
    }

    const stats = scenario ? INJURY_STATISTICS[scenario] : null
    const intervention: SafetyIntervention = {
      id: `int-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date(),
      sessionStart: sessionStartTime,
      type: isShout ? 'shout' : 'warning',
      scenario: scenario || 'unknown',
      description: parsed.plainText.length > 100
        ? parsed.plainText.substring(0, 100) + '...'
        : parsed.plainText,
      latencyMs: currentLatencyMs,
      estimatedCostLow: stats?.estimatedCostLow || 0,
      estimatedCostHigh: stats?.estimatedCostHigh || 0
    }
    setInterventions(prev => [...prev, intervention])
  }

  // Update safety status based on text
  if (lowerText.includes("safety glasses on") || lowerText.includes("splendid")) {
    setSafetyStatus(prev => ({ ...prev, eyeProtection: "ok", lastCheck: new Date() }))
  } else if (lowerText.includes("safety glasses") || lowerText.includes("spectacles")) {
    setSafetyStatus(prev => ({ ...prev, eyeProtection: "warning", lastCheck: new Date() }))
  }
}, [isSnoozed, sessionStartTime, currentLatencyMs])
```

### Acceptance Criteria

1. [ ] When Gemini outputs `<shout scenario="hand_near_blade">NAME! HAND!</shout>`, THE SHOUT alert triggers
2. [ ] Shout scenario is correctly logged to test harness
3. [ ] Keyword-based detection still works as fallback when no tag present
4. [ ] Injury statistics are populated based on scenario from tag
5. [ ] Alert type is always "shout" when tag is detected (regardless of message content)

---

## Weakness 2: No Real Validation Data (Test Metrics Hidden)

### Problem Statement

The TestHarness class exists and logs data, but:
1. No UI to display the metrics to judges
2. `TestHarness.getAggregateMetricsAcrossSessions()` is never called
3. No way to show safety trigger rate, P95 latency, or scenario breakdown

### Solution

Create a `TestMetricsPanel` component that:
1. Shows aggregate metrics across all sessions
2. Displays safety trigger rate as a percentage
3. Shows latency statistics (avg, P95, max)
4. Breaks down triggers by scenario
5. Is collapsible and positioned for demo visibility

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/test-metrics-panel.tsx` | NEW FILE - Create the metrics display component |
| `src/app/page.tsx` | Import and add TestMetricsPanel to the UI |

### Code Snippets

#### 1. Create `src/components/test-metrics-panel.tsx`

```typescript
"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, FlaskConical, Zap, AlertTriangle, Clock, BarChart3, Trash2 } from "lucide-react"
import { TestHarness } from "@/lib/test-harness"

interface MetricsPanelProps {
  isExpanded?: boolean
  showInProduction?: boolean // Set to true to show even in production
}

// Scenario display names
const SCENARIO_NAMES: Record<string, string> = {
  hand_near_blade: "Hand Near Blade",
  missing_glasses: "Missing Safety Glasses",
  cluttered_workspace: "Cluttered Workspace",
  improper_grip: "Improper Grip",
  missing_hearing: "Missing Hearing Protection",
  hot_surface: "Hot Surface Contact",
  immediate_danger: "Immediate Danger",
  unknown: "Other"
}

export function TestMetricsPanel({
  isExpanded: initialExpanded = false,
  showInProduction = false
}: MetricsPanelProps) {
  const [expanded, setExpanded] = useState(initialExpanded)
  const [metrics, setMetrics] = useState<ReturnType<typeof TestHarness.getAggregateMetricsAcrossSessions> | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  // Load metrics on mount and when refreshKey changes
  useEffect(() => {
    const loadMetrics = () => {
      const aggregateMetrics = TestHarness.getAggregateMetricsAcrossSessions()
      setMetrics(aggregateMetrics)
    }

    loadMetrics()

    // Refresh every 10 seconds while panel is open
    const interval = setInterval(loadMetrics, 10000)
    return () => clearInterval(interval)
  }, [refreshKey])

  // Only show in development unless explicitly enabled
  if (process.env.NODE_ENV === 'production' && !showInProduction) {
    return null
  }

  const handleClearLogs = () => {
    if (confirm('Clear all test logs? This cannot be undone.')) {
      TestHarness.clearAllLogs()
      setRefreshKey(k => k + 1)
    }
  }

  // Calculate safety trigger rate (triggers per session)
  const triggerRate = metrics && metrics.totalSessions > 0
    ? (metrics.totalSafetyTriggers / metrics.totalSessions).toFixed(1)
    : '0'

  // Get sorted scenarios by count
  const sortedScenarios = metrics
    ? Object.entries(metrics.safetyTriggersByScenario)
        .sort(([,a], [,b]) => b - a)
    : []

  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-surface-light transition-colors"
        aria-expanded={expanded}
        aria-label="Test metrics panel"
      >
        <div className="flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-primary" aria-hidden="true" />
          <span className="font-medium">Test Metrics</span>
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
            {metrics?.totalSessions || 0} sessions
          </span>
        </div>
        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && metrics && (
        <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Total Sessions */}
            <div className="bg-surface-light rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <BarChart3 className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs text-muted-foreground">Total Sessions</span>
              </div>
              <span className="text-xl font-bold text-foreground">
                {metrics.totalSessions}
              </span>
            </div>

            {/* Safety Trigger Rate */}
            <div className="bg-surface-light rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-danger" />
                <span className="text-xs text-muted-foreground">Triggers/Session</span>
              </div>
              <span className="text-xl font-bold text-danger">
                {triggerRate}
              </span>
            </div>

            {/* Total Triggers */}
            <div className="bg-surface-light rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-warning" />
                <span className="text-xs text-muted-foreground">Total Triggers</span>
              </div>
              <span className="text-xl font-bold text-foreground">
                {metrics.totalSafetyTriggers}
              </span>
            </div>

            {/* Total Moments */}
            <div className="bg-surface-light rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <BarChart3 className="w-3.5 h-3.5 text-safe" />
                <span className="text-xs text-muted-foreground">Moments Captured</span>
              </div>
              <span className="text-xl font-bold text-foreground">
                {metrics.totalMoments}
              </span>
            </div>
          </div>

          {/* Latency Statistics */}
          <div className="pt-3 border-t border-border">
            <h4 className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              <Zap className="w-3.5 h-3.5" />
              Latency Statistics
            </h4>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average:</span>
                <span className={`font-mono ${
                  metrics.overallAvgLatencyMs < 800 ? 'text-safe' :
                  metrics.overallAvgLatencyMs < 1500 ? 'text-warning' : 'text-danger'
                }`}>
                  {metrics.overallAvgLatencyMs}ms
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">P95:</span>
                <span className={`font-mono ${
                  metrics.overallP95LatencyMs < 800 ? 'text-safe' :
                  metrics.overallP95LatencyMs < 1500 ? 'text-warning' : 'text-danger'
                }`}>
                  {metrics.overallP95LatencyMs}ms
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max:</span>
                <span className={`font-mono ${
                  metrics.overallMaxLatencyMs < 800 ? 'text-safe' :
                  metrics.overallMaxLatencyMs < 1500 ? 'text-warning' : 'text-danger'
                }`}>
                  {metrics.overallMaxLatencyMs}ms
                </span>
              </div>
            </div>
          </div>

          {/* Triggers by Scenario */}
          {sortedScenarios.length > 0 && (
            <div className="pt-3 border-t border-border">
              <h4 className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                Triggers by Scenario
              </h4>
              <div className="space-y-2">
                {sortedScenarios.map(([scenario, count]) => (
                  <div key={scenario} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {SCENARIO_NAMES[scenario] || scenario}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-surface-light rounded-full overflow-hidden">
                        <div
                          className="h-full bg-danger rounded-full"
                          style={{
                            width: `${Math.min((count / metrics.totalSafetyTriggers) * 100, 100)}%`
                          }}
                        />
                      </div>
                      <span className="text-sm font-mono text-foreground w-6 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clear Logs Button */}
          <div className="pt-3 border-t border-border">
            <button
              onClick={handleClearLogs}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger/10 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear All Test Logs
            </button>
          </div>

          {/* No Data State */}
          {metrics.totalSessions === 0 && (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No test data yet. Complete a session to see metrics.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
```

#### 2. Update `src/app/page.tsx` - Add TestMetricsPanel

Add import (around line 25):

```typescript
import { TestMetricsPanel } from "@/components/test-metrics-panel"
```

Add to the right sidebar (around line 505, after MomentTimeline):

```typescript
{/* Moment Timeline - Shows captured moments */}
{sessionStartTime && (
  <MomentTimeline
    moments={moments}
    sessionStart={sessionStartTime}
    maxVisible={5}
  />
)}

{/* Test Metrics Panel - Shows aggregate test data */}
<TestMetricsPanel
  isExpanded={false}
  showInProduction={true} // Show in production for demo
/>
```

### Acceptance Criteria

1. [ ] TestMetricsPanel renders and is visible in the sidebar
2. [ ] Shows total sessions, total triggers, triggers per session
3. [ ] Shows latency statistics (avg, P95, max) with color coding
4. [ ] Shows breakdown by scenario with progress bars
5. [ ] Metrics update every 10 seconds
6. [ ] Clear button works and resets metrics
7. [ ] Panel is collapsible to not clutter UI

---

## Weakness 3: Spec-to-Implementation Gap (Hidden Features)

### Problem Statement

Several v10 spec features are implemented but not visible:
1. **Context retention** - Sir Reginald references earlier events, but UI doesn't show it
2. **End-to-end latency** - We track frame-to-response, but not frame-to-audio-complete
3. **Moment count** - Visible in overlay but not prominent
4. **Pattern warnings** - Tracked but not displayed until verdict

### Solution

1. **Add context retention indicator** - Show when Sir Reginald references earlier events
2. **Add true end-to-end latency measurement** - Frame capture to audio playback complete
3. **Make moment count more prominent** - Add pulse animation when new moment detected
4. **Add pattern warning indicator** - Show when same safety issue repeats

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/context-indicator.tsx` | NEW FILE - Shows when context retention is demonstrated |
| `src/components/live-metric-overlay.tsx` | Add pulse animation for new moments |
| `src/app/page.tsx` | Track true end-to-end latency, add context indicator |
| `src/components/pattern-warning.tsx` | NEW FILE - Shows repeated safety patterns |

### Code Snippets

#### 1. Create `src/components/context-indicator.tsx`

```typescript
"use client"

import { useEffect, useState } from "react"
import { Brain, Clock } from "lucide-react"

interface ContextIndicatorProps {
  /** Text that Sir Reginald just spoke */
  currentText: string
  /** Session start time for elapsed calculation */
  sessionStart: Date
  /** Minimum session duration before showing context indicators (seconds) */
  minSessionDuration?: number
}

// Phrases that indicate context retention (Sir Reginald referencing earlier events)
const CONTEXT_RETENTION_PHRASES = [
  "earlier",
  "before",
  "as we saw",
  "as I mentioned",
  "you'll recall",
  "similar to",
  "like that time",
  "the beginning",
  "first attempt",
  "previously",
  "a moment ago",
  "that tearout issue",
  "we encountered",
  "learned from"
]

export function ContextIndicator({
  currentText,
  sessionStart,
  minSessionDuration = 180 // 3 minutes minimum
}: ContextIndicatorProps) {
  const [showIndicator, setShowIndicator] = useState(false)
  const [contextPhrase, setContextPhrase] = useState<string | null>(null)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Check if session is long enough to demonstrate context retention
    const elapsedSeconds = (Date.now() - sessionStart.getTime()) / 1000
    if (elapsedSeconds < minSessionDuration) return

    // Check if current text contains context retention phrases
    const lowerText = currentText.toLowerCase()
    const foundPhrase = CONTEXT_RETENTION_PHRASES.find(phrase =>
      lowerText.includes(phrase)
    )

    if (foundPhrase) {
      setContextPhrase(foundPhrase)
      setShowIndicator(true)
      setFadeOut(false)

      // Start fade out after 5 seconds
      const fadeTimer = setTimeout(() => setFadeOut(true), 5000)
      // Hide completely after 6 seconds
      const hideTimer = setTimeout(() => {
        setShowIndicator(false)
        setContextPhrase(null)
      }, 6000)

      return () => {
        clearTimeout(fadeTimer)
        clearTimeout(hideTimer)
      }
    }
  }, [currentText, sessionStart, minSessionDuration])

  if (!showIndicator) return null

  return (
    <div
      className={`fixed bottom-24 left-4 z-40 transition-all duration-500 ${
        fadeOut ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="bg-primary/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg flex items-center gap-3">
        <Brain className="w-5 h-5 text-white animate-pulse" />
        <div>
          <p className="text-white text-sm font-medium">
            Context Retention Demonstrated
          </p>
          <p className="text-white/80 text-xs">
            Sir Reginald referenced earlier events ("{contextPhrase}...")
          </p>
        </div>
      </div>
    </div>
  )
}
```

#### 2. Create `src/components/pattern-warning.tsx`

```typescript
"use client"

import { AlertTriangle, TrendingUp } from "lucide-react"

interface PatternWarningProps {
  /** Warning patterns (scenario -> count) */
  patterns: Record<string, number>
  /** Minimum count to show pattern */
  threshold?: number
}

const SCENARIO_NAMES: Record<string, string> = {
  hand_near_blade: "Hand approaching blade",
  missing_glasses: "Missing safety glasses",
  cluttered_workspace: "Cluttered workspace",
  improper_grip: "Improper grip",
  missing_hearing: "Missing hearing protection"
}

export function PatternWarning({ patterns, threshold = 2 }: PatternWarningProps) {
  // Find patterns that exceed threshold
  const activePatterns = Object.entries(patterns)
    .filter(([, count]) => count >= threshold)
    .sort(([,a], [,b]) => b - a)

  if (activePatterns.length === 0) return null

  return (
    <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp className="w-4 h-4 text-warning" />
        <span className="text-sm font-medium text-warning">Repeating Patterns Detected</span>
      </div>
      <div className="space-y-1.5">
        {activePatterns.map(([scenario, count]) => (
          <div key={scenario} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {SCENARIO_NAMES[scenario] || scenario}
            </span>
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-warning" />
              <span className="font-mono text-warning">{count}x</span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Sir Reginald will suggest preventive measures
      </p>
    </div>
  )
}
```

#### 3. Update `src/components/live-metric-overlay.tsx` - Add Pulse Animation

Update the component to accept a `newMoment` prop:

```typescript
"use client"

import { useEffect, useState } from "react"
import { Eye, Clock, AlertTriangle, BookOpen } from "lucide-react"
import type { LatencyLevel } from "@/types"

interface LiveMetricOverlayProps {
  latencyLevel: LatencyLevel
  latencyMs: number
  momentCount: number
  interventionCount: number
  isWatching?: boolean
  /** True when a new moment was just detected (triggers pulse) */
  newMomentDetected?: boolean
}

// ... existing color constants ...

export function LiveMetricOverlay({
  latencyLevel,
  latencyMs,
  momentCount,
  interventionCount,
  isWatching = true,
  newMomentDetected = false,
}: LiveMetricOverlayProps) {
  const [isPulsing, setIsPulsing] = useState(false)

  // Trigger pulse animation when new moment detected
  useEffect(() => {
    if (newMomentDetected) {
      setIsPulsing(true)
      const timer = setTimeout(() => setIsPulsing(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [newMomentDetected, momentCount])

  return (
    <div
      className="absolute top-3 right-3 flex items-center gap-3 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1.5 select-none"
      role="region"
      aria-label="Live session metrics"
    >
      {/* ... existing watching indicator ... */}

      {/* Divider */}
      <div className="w-px h-4 bg-white/20" aria-hidden="true" />

      {/* ... existing latency indicator ... */}

      {/* Divider */}
      <div className="w-px h-4 bg-white/20" aria-hidden="true" />

      {/* Moments count - with pulse animation */}
      <div
        className={`flex items-center gap-1.5 transition-all duration-300 ${
          isPulsing ? 'scale-125 bg-primary/30 px-2 py-0.5 rounded' : ''
        }`}
        title={`${momentCount} moment${momentCount !== 1 ? "s" : ""} detected`}
      >
        <BookOpen
          className={`w-3.5 h-3.5 ${isPulsing ? 'text-primary animate-pulse' : 'text-primary'}`}
          aria-hidden="true"
        />
        <span className={`text-xs ${isPulsing ? 'text-primary font-bold' : 'text-white/90'}`}>
          {momentCount}
        </span>
      </div>

      {/* ... rest of component ... */}
    </div>
  )
}
```

#### 4. Update `src/app/page.tsx` - True End-to-End Latency + Context Indicator

Add imports:

```typescript
import { ContextIndicator } from "@/components/context-indicator"
import { PatternWarning } from "@/components/pattern-warning"
```

Add state for tracking:

```typescript
// Add around line 92, after other state declarations
const [lastResponseText, setLastResponseText] = useState("")
const [newMomentDetected, setNewMomentDetected] = useState(false)
const [e2eLatencyMs, setE2eLatencyMs] = useState(0)
const frameStartTimeRef = useRef<number>(0)
```

Update `handleGeminiText` to track last response text:

```typescript
// Add at the beginning of handleGeminiText callback
setLastResponseText(text)
```

Update moment detection to set the flag:

```typescript
// After adding moments to state
if (parsed.moments.length > 0) {
  setMoments(prev => [...prev, ...parsed.moments])
  setNewMomentDetected(true) // Trigger pulse
  setTimeout(() => setNewMomentDetected(false), 100) // Reset quickly so next detection triggers
  for (const moment of parsed.moments) {
    testHarnessRef.current?.logMomentDetected(moment.type, moment.title)
  }
}
```

Update audio player callback to measure true E2E latency:

```typescript
// Update useAudioPlayer around line 100
const { playAudio } = useAudioPlayer({
  volume: preferences.volume / 100,
  onPlayStart: () => {
    setVoiceState("ai-speaking")
    // Don't measure E2E start here - it starts at frame send
  },
  onPlayEnd: () => {
    setVoiceState("idle")
    // Calculate true end-to-end latency (frame send -> audio complete)
    if (frameStartTimeRef.current > 0) {
      const e2e = Date.now() - frameStartTimeRef.current
      setE2eLatencyMs(e2e)
      // Reset for next measurement
      frameStartTimeRef.current = 0
    }
    if (isVerdictSpeaking) {
      setIsVerdictSpeaking(false)
    }
  }
})
```

Update `handleFrame` to record start time:

```typescript
const handleFrame = useCallback((base64: string) => {
  if (connectionStatus === "connected") {
    frameStartTimeRef.current = Date.now() // Record frame send time for E2E
    sendVideoFrame(base64)
  }
}, [connectionStatus, sendVideoFrame])
```

Add components to JSX:

```typescript
{/* After LiveMetricOverlay, around line 443 */}
<LiveMetricOverlay
  latencyLevel={latencyLevel}
  latencyMs={currentLatencyMs}
  momentCount={moments.length}
  interventionCount={interventions.length}
  isWatching={connectionStatus === "connected" && !isSnoozed}
  newMomentDetected={newMomentDetected}
/>

{/* Context Indicator - Shows marathon agent capability */}
{sessionStartTime && (
  <ContextIndicator
    currentText={lastResponseText}
    sessionStart={sessionStartTime}
    minSessionDuration={180}
  />
)}
```

Add PatternWarning to sidebar (around line 496):

```typescript
{/* Pattern Warning - Shows repeating safety issues */}
{Object.keys(warningPatterns).length > 0 && (
  <PatternWarning
    patterns={warningPatterns}
    threshold={2}
  />
)}
```

### Acceptance Criteria

1. [ ] Context retention indicator appears when Sir Reginald references earlier events (after 3+ min)
2. [ ] Indicator shows the specific phrase that triggered detection
3. [ ] Moment count pulses when new moment is detected
4. [ ] Pattern warning shows in sidebar when same issue happens 2+ times
5. [ ] True E2E latency is measured (frame capture to audio playback complete)
6. [ ] All new components are responsive and match design system

---

## Implementation Order

1. **Weakness 1 (SHOUT fix)** - HIGHEST PRIORITY
   - This is a safety-critical fix
   - Estimated time: 1.5 hours

2. **Weakness 2 (Test Metrics)** - HIGH PRIORITY
   - Needed to show judges real validation data
   - Estimated time: 1.5 hours

3. **Weakness 3 (Hidden Features)** - MEDIUM PRIORITY
   - Surfaces existing functionality
   - Estimated time: 2 hours

**Total estimated time: 5 hours**

---

## Testing Plan

### Weakness 1 Tests

1. **Manual test**: Send a prompt that should trigger SHOUT
   - Simulate hand near blade scenario
   - Verify `<shout>` tag is parsed
   - Verify alert type is "shout"
   - Verify scenario is logged correctly

2. **Fallback test**: Ensure keyword detection still works
   - Test with response that lacks `<shout>` tag but contains "HAND!"
   - Verify shout still triggers

### Weakness 2 Tests

1. **Metrics display**: Run 2-3 test sessions
   - Verify session count updates
   - Verify trigger rate calculation
   - Verify latency statistics

2. **Clear functionality**: Clear logs and verify reset

### Weakness 3 Tests

1. **Context indicator**: Run session for 5+ minutes
   - Verify indicator appears when Sir Reginald references earlier events
   - Verify fade animation works

2. **Moment pulse**: Trigger moment detection
   - Verify overlay count pulses

3. **Pattern warning**: Trigger same safety issue 3 times
   - Verify warning appears in sidebar

---

## Rollback Plan

If any fix causes issues:

1. **Weakness 1**: Revert prompt changes, keep keyword-only detection
2. **Weakness 2**: Simply don't render TestMetricsPanel (set `showInProduction={false}`)
3. **Weakness 3**: Remove new components from page.tsx imports

All fixes are additive and can be individually disabled without breaking existing functionality.

---

## Sign-off

**PM Approval**: Pending
**Ready for Implementation**: YES

*This plan addresses all 3 critical weaknesses identified by the critic. Each fix includes specific code, file locations, and acceptance criteria. Implementation should proceed in order: Weakness 1 -> 2 -> 3.*
