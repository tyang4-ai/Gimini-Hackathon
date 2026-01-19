# Development Plan v1 - Critical Review

**Document Reviewed:** `pm_development-plan_v1.md`
**Reviewer:** Critic Agent
**Date:** January 18, 2026
**Verdict:** NEEDS REVISION BEFORE BUILD

---

## Executive Summary

The development plan is **comprehensive in scope but dangerously optimistic in execution**. It provides excellent component specifications and sample code, but suffers from critical integration gaps, underestimated complexity, and several technical errors that will cause build failures if not addressed.

**Overall Assessment:** 6.5/10 - Good foundation, but will fail without revisions.

---

## 1. Completeness Analysis

### 1.1 Features from v10 Spec NOT Covered

| Missing Feature | Spec Location | Impact |
|-----------------|---------------|--------|
| **Sensitivity Slider Integration** | Existing in codebase | Not mentioned in WP-8 integration |
| **Snooze Functionality with New Features** | Existing component | No spec for how snooze interacts with new moment/intervention tracking |
| **Audio Playback of Verdict** | P0-8 in spec | WP-6 shows text but no spec for SPOKEN verdict via Gemini |
| **Mode Toggle Impact on Moments** | Spec mentions dual directive | WP-4 prompt doesn't clarify if moments are captured in both modes |
| **Context Retention Demonstration** | Spec section on 30+ minute references | No WP for how to track and demonstrate cross-session context |
| **Broader Application Tease** | P2-2 in spec | Not in any work package |

### 1.2 Missing Work Packages

**WP-MISSING-1: Type Definition Consolidation**
- The plan mentions modifying `types/index.ts` in multiple WPs (1, 2, 3)
- No single package owns the type definitions
- Risk: Merge conflicts, incomplete types, circular dependencies

**WP-MISSING-2: Gemini Hook Enhancement**
- WP-5 (response parser) assumes integration with `use-gemini-live.ts`
- No WP specifies HOW to modify the hook to use the parser
- Critical gap: Parser exists but hook doesn't call it

**WP-MISSING-3: Latency Breakdown Collection**
- WP-2 shows a component for displaying breakdown
- NO code shows how to COLLECT the breakdown data
- The existing hook only tracks total latency via `Date.now()` comparison

### 1.3 Acceptance Criteria Gaps

WP-4 (Dual Directive Prompt) acceptance criteria are incomplete:
- [ ] Missing: "Prompt tested with Gemini and tags parse correctly"
- [ ] Missing: "Edge case prompts (poor lighting etc.) tested"
- [ ] Missing: "Pattern detection threshold (3+) is configurable"

WP-8 (Main Integration) has no specific acceptance criteria beyond "all data flows correctly" - this is too vague for verification.

---

## 2. Technical Accuracy Issues

### 2.1 Critical Code Bugs

**Bug 1: WP-7 document-export.ts - Variable Name Collision**
```typescript
// Line 1422-1423 - BUG
export function exportAsMarkdown(document: string, filename?: string): void {
  const blob = new Blob([document], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');  // ERROR: `document` is parameter, not window.document
```
**Fix:** Rename parameter to `content` or use `window.document.createElement()`.

**Bug 2: WP-5 response-parser.ts - Type Assertion Issue**
```typescript
// Line 1124 - UNSAFE
type: (parsed.type?.toLowerCase() || 'tip') as DetectedMoment['type'],
```
This will fail type checking if Gemini returns an unexpected type like "OBSERVATION". Need validation:
```typescript
const validTypes = ['new_step', 'technique', 'problem', 'solution', 'mistake', 'tip', 'lesson', 'safety'];
type: validTypes.includes(parsed.type?.toLowerCase())
  ? parsed.type.toLowerCase() as DetectedMoment['type']
  : 'tip',
```

**Bug 3: WP-1 near-miss-counter.tsx - Missing sessionStart Property**
```typescript
// Line 352 - Component assumes intervention has sessionStart
{formatTimestamp(intervention.timestamp, intervention.sessionStart)}
```
But `SafetyIntervention` interface (line 2007-2013) shows sessionStart is a property. However, the creation in WP-8 (line 1603-1612):
```typescript
const newIntervention: SafetyIntervention = {
  // ...
  sessionStart: sessionStartTime || new Date(),  // This is correct
```
BUT - the existing `page.tsx` does NOT have `sessionStartTime` as a nullable Date - it's initialized as `null`:
```typescript
const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)
```
If an intervention fires before session starts (theoretically impossible but defensive coding matters), `sessionStartTime || new Date()` would create inconsistent timestamps.

**Bug 4: WP-3 moment-parser.ts - Duplicate Function**
Lines 674-701 in the plan define `parseMomentTag()` in `moment-parser.ts`.
But WP-5 lines 1106-1161 define `parseGeminiResponse()` in `response-parser.ts` which also parses moments.

**Redundant code - WP-3 moment-parser.ts should be deleted or merged into WP-5.**

### 2.2 API Compatibility Issues

**Issue 1: Gemini Response Format Assumption**
The plan assumes Gemini will output structured `<moment>` tags reliably. But the prompt (WP-4) says:
```
MOMENT DETECTION:
While watching, identify significant moments and output them in this format:
```
This is a SUGGESTION to the model, not a guarantee. Gemini may:
- Output malformed JSON inside tags
- Skip tags entirely
- Use different tag names
- Output tags mid-sentence

**Mitigation needed:** Fuzzy parsing, fallback extraction, explicit testing.

**Issue 2: Latency Breakdown - No Data Source**
WP-2 component expects:
```typescript
interface LatencyBreakdown {
  videoCapture: number;
  networkTransit: number;
  geminiProcessing: number;
  audioGeneration: number;
  total: number;
}
```
But the existing `use-gemini-live.ts` only captures:
```typescript
lastFrameSentAtRef.current = Date.now()
// ...later...
const latency = Date.now() - lastFrameSentAtRef.current
```
This is TOTAL latency only. There's **no way to measure individual stages** without:
1. Server-side timestamps (not available)
2. Heuristic estimation (inaccurate)
3. Fake data (dishonest for hackathon)

**Recommendation:** Either remove latency breakdown entirely or add disclaimer that values are estimates.

---

## 3. Dependency Order Problems

### 3.1 Incorrect Parallelization Claims

The plan claims WP-5 (Response Parser) can be parallelized with WP-4 (Dual Directive Prompt).

**WRONG.** WP-5 MUST parse the tags defined in WP-4. If WP-4 changes the tag format during development, WP-5 becomes invalid.

**Correct dependency:** WP-4 -> WP-5 (sequential)

### 3.2 Missing Dependencies

| Work Package | Claims Parallel With | Actually Depends On |
|--------------|---------------------|---------------------|
| WP-6: Session Verdict | WP-2, WP-3, WP-7 | WP-1 (needs intervention data format) AND WP-3 (needs moment data) |
| WP-9: Live Metric Overlay | WP-10 | WP-2 (needs latency data format), WP-3 (needs moment count), WP-8 (needs integration point) |
| WP-10: Test Logging | WP-9 | WP-8 (needs session data to log) |

### 3.3 Revised Execution Order

```
Phase 1: Types & Prompts (Foundation)
  WP-4 (Prompt) - START HERE
  Types consolidation (NEW WP)

Phase 2: Parsers & Data (Can parallel)
  WP-5 (Response Parser) - AFTER WP-4
  WP-1 (Near-Miss Counter)
  WP-3 (Moment Timeline)

Phase 3: Display Components (Can parallel)
  WP-2 (Latency Breakdown) - OR REMOVE
  WP-7 (Document Viewer)
  WP-6 (Session Verdict) - AFTER WP-1, WP-3

Phase 4: Integration (Sequential)
  Gemini Hook Enhancement (NEW WP)
  WP-8 (Main Integration)

Phase 5: Polish
  WP-9 (Live Metric Overlay)
  WP-10 (Test Logging)
```

---

## 4. Time Estimate Critique

### 4.1 Underestimated Work

| Work Package | Plan Estimate | Realistic Estimate | Why |
|--------------|---------------|-------------------|-----|
| WP-4: Dual Directive Prompt | "Low complexity" | Medium | Testing prompt with Gemini, iterating on tag formats, edge cases |
| WP-5: Response Parser | "Low complexity" | Medium-High | Regex edge cases, malformed JSON handling, integration testing |
| WP-8: Main Integration | "High complexity" | Very High | Every component needs wiring, state management becomes complex, debugging |
| WP-6: Session Verdict | "Medium" | High | Triggering spoken verdict via Gemini, syncing audio with UI |

### 4.2 Phase Timeline Critique

**Phase 1 (Days 1-8): Core Features**
- Plan allocates 8 days for WP-1 through WP-5
- Realistic: 10-12 days with integration testing
- Risk: Falls behind immediately, cascades to later phases

**Phase 3 (Days 15-19): Polish & Testing**
- Only 5 days allocated
- 50+ test sessions needed (per spec)
- Realistic: Need 7-10 days minimum
- Risk: Ship untested code or miss deadline

### 4.3 Missing Time Allocations

| Task | Not Allocated | Needed |
|------|---------------|--------|
| Debugging integration issues | 0 days | 2-3 days |
| Gemini prompt iteration | 0 days | 1-2 days |
| Cross-browser testing | 0 days | 1 day |
| Video recording prep | Minimal | 1-2 days setup |

---

## 5. Risk Assessment Gaps

### 5.1 Unmentioned Risks

**Risk: Gemini Tag Compliance**
- Severity: HIGH
- Probability: MEDIUM
- Description: Gemini may not reliably output `<moment>`, `<suggestion>`, `<document>` tags
- Mitigation: Explicit testing early, fallback parsing, prompt engineering iteration
- NOT MENTIONED in plan's risk section

**Risk: Audio-Visual Sync for Verdict**
- Severity: MEDIUM
- Probability: HIGH
- Description: WP-6 shows UI for verdict but doesn't specify how Gemini speaks it
- Mitigation: Need explicit API call to Gemini for spoken summary
- NOT MENTIONED

**Risk: State Management Complexity**
- Severity: HIGH
- Probability: HIGH
- Description: Page.tsx already has 20+ useState hooks. Adding 6+ more will make debugging nightmare
- Mitigation: Consider React Context or state reducer pattern
- NOT MENTIONED

**Risk: Latency Breakdown Impossibility**
- Severity: LOW (if removed)
- Probability: CERTAIN
- Description: Cannot accurately measure pipeline stages client-side
- Mitigation: Remove feature or use estimates with disclaimer
- NOT MENTIONED

### 5.2 Risk Mitigations That Won't Work

The plan says:
> "Gemini response inconsistent | Medium | High | Fallback parsing, retry logic"

**Problem:** Retry logic doesn't help if Gemini NEVER outputs tags. Need prompt engineering, not retry logic.

The plan says:
> "Latency too high for demo | Low | High | Record multiple takes, use best"

**Problem:** This assumes latency is variable. If it's CONSISTENTLY too high, no number of takes helps. Need latency optimization strategy, not just multiple recordings.

---

## 6. Code Quality Issues

### 6.1 Inconsistent Patterns

**Pattern 1: State Update Style**
WP-8 sample code uses:
```typescript
setInterventions(prev => [...prev, newIntervention]);
```
But WP-1 sample code accesses state directly:
```typescript
const totalCostLow = interventions.reduce((sum, i) => sum + (i.estimatedCostLow || 0), 0);
```
**Issue:** Mixing functional updates with direct access can cause stale closure bugs.

**Pattern 2: Error Handling**
WP-5 uses console.warn for parse errors:
```typescript
} catch (e) {
  console.warn('Failed to parse moment:', e);
}
```
But WP-10 (test logging) doesn't capture these warnings.
**Issue:** Silent failures during testing, hard to diagnose issues.

**Pattern 3: ID Generation**
WP-3 and WP-5 both generate IDs:
```typescript
id: `moment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
```
**Issue:** `.substr()` is deprecated. Should use `.substring()` or crypto-safe ID generation.

### 6.2 Missing Error Boundaries

No component includes error boundaries. If any component throws during render (e.g., malformed moment data), entire app crashes.

**Add:** Error boundary wrapper for new components, especially parsers.

### 6.3 Accessibility Omissions

- WP-1: Near-miss counter has no aria-labels for screen readers
- WP-2: Latency colors lack text alternatives for colorblind users
- WP-6: Session verdict modal has no focus trap

---

## 7. Missing Details for Developers

### 7.1 Environment Requirements Not Specified

- Node version requirement
- npm vs yarn preference
- Environment variable setup for testing
- Browser compatibility matrix

### 7.2 Testing Strategy Gaps

Plan says "Manual Testing Checklist" but no:
- Unit test specifications
- Integration test setup
- Mock data for offline development
- How to simulate Gemini responses for testing

### 7.3 Missing API Documentation

The plan references the token API (`/api/token`) but doesn't document:
- What happens when token expires during session
- Rate limiting behavior
- Error response formats

### 7.4 CSS/Styling Dependencies

Components use classes like `bg-surface`, `text-danger`, `border-border`.
These are presumably in `globals.css` but the plan doesn't:
- Confirm these classes exist
- Document how to add new ones
- Specify dark/light mode handling for new components

---

## 8. Integration Concerns

### 8.1 Interface Mismatches

**Mismatch 1: SafetyIntervention Interface**
WP-1 expects:
```typescript
interface SafetyIntervention {
  estimatedCostLow: number;
  estimatedCostHigh: number;
}
```
WP-8 creates:
```typescript
estimatedCostLow: stats?.estimatedCostLow || 0,
estimatedCostHigh: stats?.estimatedCostHigh || 0,
```
**Issue:** If `stats` is undefined (scenario not recognized), costs are 0. Counter shows "$0 avoided" which looks broken.

**Mismatch 2: LatencyBreakdown Source**
WP-2 component expects `breakdown: LatencyBreakdown | null` prop.
WP-8 integration references `latencyBreakdown` state.
WP-8 never shows how `latencyBreakdown` state gets populated.
**Issue:** Component renders but shows "Measuring..." forever.

### 8.2 Event Flow Gaps

**Gap 1: Spoken Verdict Trigger**
WP-6 shows verdict UI with "Sir Reginald is speaking..." indicator.
But NO code triggers Gemini to actually speak the verdict.
The `useGeminiLive` hook has `sendVideoFrame` but no `sendTextPrompt` method.
**Issue:** Visual says speaking, but no audio plays.

**Gap 2: Document Generation Trigger**
WP-6 has `onGenerateDoc` callback.
WP-8 mentions `requestDocGeneration()` function.
This function is never defined.
**Issue:** Button does nothing when clicked.

### 8.3 State Synchronization

The existing `page.tsx` tracks `sessionData` with:
```typescript
interface SessionSummary {
  safetyInterventions: number;
  criticalSaves: number;
}
```
WP-8 adds new `interventions: SafetyIntervention[]` state.
These are DUPLICATES - `interventions.length` should equal `sessionData.safetyInterventions`.
**Issue:** State can drift, showing inconsistent numbers.

**Recommendation:** Remove `sessionData.safetyInterventions` and derive from `interventions.length`.

---

## 9. Specific Fixes Required

### 9.1 Critical Fixes (Must Do)

1. **Fix WP-7 variable name collision** - Rename `document` parameter to `content`
2. **Add type validation in WP-5** - Validate moment types before assertion
3. **Add Gemini hook method for verdict** - New `requestVerdict()` method needed
4. **Add document generation trigger** - Define `requestDocGeneration()` function
5. **Remove or fake latency breakdown** - Cannot measure client-side, either remove or estimate
6. **Fix dependency order** - WP-4 must complete before WP-5

### 9.2 High Priority Fixes

1. **Consolidate state management** - Use reducer pattern or context
2. **Add error boundaries** - Wrap new components
3. **Add missing types to single WP** - Create WP-0 for type consolidation
4. **Add testing mocks** - Need to test without live Gemini connection

### 9.3 Medium Priority Fixes

1. **Add accessibility attributes** - aria-labels, focus management
2. **Add dark mode support verification** - Ensure new components work in both themes
3. **Document environment setup** - Dev requirements in README
4. **Fix deprecated `.substr()` usage** - Use `.substring()`

---

## 10. Verdict

### Assessment: NEEDS REVISION

The development plan demonstrates strong understanding of the product requirements and provides valuable sample code. However, **it will not produce a working build in its current form** due to:

1. Critical bugs in sample code
2. Missing integration pathways
3. Impossible feature assumptions (latency breakdown)
4. Optimistic time estimates
5. Unaddressed risks

### Recommendation

Before proceeding to build:

1. **Create WP-0: Type Consolidation** - Single source of truth for all new types
2. **Remove Latency Breakdown Breakdown** - Keep simple total only, or use explicit estimates
3. **Add WP-11: Gemini Hook Enhancement** - Explicit package for adding verdict/doc generation
4. **Fix the 4 critical code bugs** - Before any WP starts
5. **Revise timeline** - Add 3-5 days buffer
6. **Add integration test specifications** - How to verify components work together

### Path to Approval

Address the 9.1 Critical Fixes, then resubmit for review. With fixes, this plan would score 8/10 and be ready for execution.

---

*Reviewed with zero context from prior conversation.*
*"Harsh feedback is kind feedback when a deadline looms."*
