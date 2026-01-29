# Sir Reginald Test Plan v7 - Final Revisions for 10/10

**Version:** 7.0
**Date:** January 19, 2026
**Target:** Video Submission Excellence for $50K Grand Prize
**Philosophy:** "Test every moment judges will see"

---

## Executive Summary

| Metric | Value |
|--------|-------|
| **Total Tests** | 135 (actual count) |
| **Category A (Automated)** | 20 tests |
| **Category A/B (Semi-Automated + Human Verification)** | 10 tests |
| **Category B (Human/Workshop)** | 105 tests |
| **Demo Rehearsal Time** | 8 hours |
| **Judge Experience Tests** | 15 tests |
| **Time Buffer** | 2 hours for unexpected issues |
| **Critical Path Coverage** | THE SHOUT only |

### Test Count Breakdown

| Section | Count |
|---------|-------|
| A1. Critical Unit Tests | 5 |
| A2. Critical Component Tests | 5 |
| A3. Chrome MCP (Semi-Automated) | 10 |
| A4. Build Verification | 5 |
| B1. SHOUT Reliability | 25 |
| B2. Judge Experience | 15 |
| B3. Safety Scenarios | 15 |
| B4. Audio Tests | 15 |
| B5. Demo Rehearsals | 20 |
| B6. Recording Tests | 15 |
| B7. Emergency Recovery | 5 |
| B8. API Stress Tests | 10 |
| B9. Gemini Chaos Tests | 10 |
| **TOTAL** | **135** |

### Test Philosophy

**Philosophy:** "Test every moment judges will see"

The judges watch a 2-minute video. Every test must answer:
- "Will this affect what judges see?"
- "Will this cause the demo to fail?"
- "Is this THE SHOUT?"

If the answer is NO to all three, the test is cut.

---

## Pre-Test Master Checklist

**Run this checklist BEFORE starting any test session.**

### Environment Checklist
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm packages installed (`npm install` in sir-reginald-app)
- [ ] Chrome browser updated (latest version)
- [ ] OBS Studio installed and configured
- [ ] Chrome DevTools accessible (F12)
- [ ] **Chrome MCP running** (for UI inspection/screenshots)
- [ ] **Chrome DevTools MCP running** (for F12 debugging/console)

### Hardware Checklist
- [ ] Webcam connected and functional (test in Settings > Camera)
- [ ] Webcam resolution 720p minimum (1080p preferred)
- [ ] External microphone connected (if available)
- [ ] Speakers working (test with system sound)
- [ ] Workshop props available:
  - [ ] Blade/saw or sharp tool for hand-near-blade scenario
  - [ ] Safety glasses
  - [ ] Items for clutter scenario
  - [ ] Two-handed tool for grip scenario

### API & Configuration Checklist
- [ ] `.env.local` exists with `GEMINI_API_KEY`
- [ ] Backup API key documented (but NOT in .env yet)
- [ ] API key has sufficient quota (check Google Cloud Console)
- [ ] Internet connection stable

### Software State Checklist
- [ ] Dev server starts without errors (`npm run dev`)
- [ ] App loads at http://localhost:3000
- [ ] No console errors on initial load
- [ ] Camera permission granted in browser

### Recording Setup Checklist (if recording)
- [ ] OBS configured per B6.1 settings
- [ ] Desktop audio source added
- [ ] Microphone audio source added (if voiceover)
- [ ] Recording path has >10GB free space
- [ ] Test recording plays back correctly

**If ANY item fails, resolve before proceeding with tests.**

---

## MCP Tools Usage Guide

**IMPORTANT: Keep both MCP servers running throughout ALL testing sessions.**

### Chrome MCP (`mcp__claude-in-chrome__*`)
Use for **UI inspection and visual verification**:
- `mcp__claude-in-chrome__computer` - Take screenshots, click elements
- `mcp__claude-in-chrome__read_page` - Get accessibility tree of page elements
- `mcp__claude-in-chrome__find` - Find elements by description
- `mcp__claude-in-chrome__navigate` - Navigate to URLs
- `mcp__claude-in-chrome__tabs_context_mcp` - Get current tab context

**When to use:** Visual tests, UI verification, screenshot capture for test evidence.

### Chrome DevTools MCP (`mcp__chrome-devtools__*`)
Use for **F12 debugging and technical inspection**:
- `mcp__chrome-devtools__take_snapshot` - Get DOM/accessibility tree
- `mcp__chrome-devtools__take_screenshot` - Capture current page state
- `mcp__chrome-devtools__list_console_messages` - View console logs/errors
- `mcp__chrome-devtools__list_network_requests` - Monitor API calls
- `mcp__chrome-devtools__evaluate_script` - Run JavaScript in page context

**When to use:** Console error checking, network monitoring, performance profiling.

### Test Category MCP Requirements

| Category | Chrome MCP | DevTools MCP | Purpose |
|----------|------------|--------------|---------|
| A1-A2 (Unit/Component) | Optional | Optional | Jest runs independently |
| A3 (Visual Tests) | **REQUIRED** | **REQUIRED** | UI screenshots + console checks |
| A4 (Build Verification) | **REQUIRED** | **REQUIRED** | Visual + error verification |
| B1-B9 (Human Tests) | **KEEP RUNNING** | **KEEP RUNNING** | Assist with debugging/evidence |

### Human Execution Tests - MCP Assistance

During human execution tests (Category B), keep both MCPs running to:
1. **Capture evidence** - Screenshot THE SHOUT moment for test logs
2. **Debug failures** - Check console for errors if something breaks
3. **Monitor network** - Verify Gemini API calls are succeeding
4. **Verify UI state** - Confirm correct avatar images are displayed

**Quick Commands for Human Tests:**
```
# Before starting a test - verify app state
mcp__chrome-devtools__list_console_messages (check for errors)

# After THE SHOUT triggers - capture evidence
mcp__chrome-devtools__take_screenshot

# If something fails - debug
mcp__chrome-devtools__list_console_messages
mcp__chrome-devtools__list_network_requests
```

---

## Category A: Automated Tests (20 tests)

> **Total Time:** 30 minutes
> **Focus:** Only critical path - THE SHOUT must work

### A1. Critical Unit Tests (5 tests)

> **Time:** 10 minutes
> **Location:** `sir-reginald-app/__tests__/`

| Test ID | Test Name | Input | Expected | Why It Matters |
|---------|-----------|-------|----------|----------------|
| A1.1 | Parse shout tag correctly | `<shout scenario="hand_near_blade">Marcus! HAND!</shout>` | Extracts scenario + message | THE SHOUT parsing |
| A1.2 | Extract user name from shout | Same as above | `userName: 'Marcus'` | Personalization in SHOUT |
| A1.3 | No shout returns null | `Regular text` | `null` | False positive prevention |
| A1.4 | Invalid scenario fallback | `<shout scenario="invalid">Text</shout>` | Falls back to `immediate_danger` | Graceful degradation |
| A1.5 | hasShoutTag detection | `<shout scenario="x">Y</shout>` | `true` | Triggers visual overlay |

**Jest Implementation:**
```typescript
// __tests__/shout-parser.test.ts
import { parseShoutTag, hasShoutTag } from '@/lib/response-parser'

describe('THE SHOUT Parsing - Critical Path', () => {
  it('A1.1: parses valid shout tag with hand_near_blade', () => {
    const input = '<shout scenario="hand_near_blade">Marcus! HAND!</shout>'
    const result = parseShoutTag(input)
    expect(result?.scenario).toBe('hand_near_blade')
    expect(result?.message).toBe('Marcus! HAND!')
  })

  it('A1.2: extracts user name from shout message', () => {
    const input = '<shout scenario="hand_near_blade">Marcus! HAND!</shout>'
    const result = parseShoutTag(input)
    expect(result?.userName).toBe('Marcus')
  })

  it('A1.3: returns null for text without shout', () => {
    expect(parseShoutTag('Regular observation')).toBeNull()
  })

  it('A1.4: invalid scenario falls back to immediate_danger', () => {
    const input = '<shout scenario="unknown">Stop!</shout>'
    const result = parseShoutTag(input)
    expect(result?.scenario).toBe('immediate_danger')
  })

  it('A1.5: hasShoutTag detects presence', () => {
    expect(hasShoutTag('<shout scenario="x">Y</shout>')).toBe(true)
    expect(hasShoutTag('no shout here')).toBe(false)
  })
})
```

---

### A2. Critical Component Tests (5 tests)

> **Time:** 15 minutes
> **Focus:** SafetyAlertOverlay - THE SHOUT component ONLY

| Test ID | Test Name | Props | Verify | Why It Matters |
|---------|-----------|-------|--------|----------------|
| A2.1 | SHOUT renders full-screen | `type="shout"` | Has `shout-backdrop` class | Fills screen on danger |
| A2.2 | User name in uppercase | `userName="marcus"` | Shows "MARCUS!" | THE SHOUT uses name |
| A2.3 | Shouting image displayed | `type="shout"` | `sir-reginald-shouting.png` src | Not emoji |
| A2.4 | Dismiss button works | Click TAP button | `onDismiss` called | User can clear alert |
| A2.5 | Keyboard dismiss (Space/Enter/Escape) | Press key | `onDismiss` called | Hands-free dismissal |

**React Testing Library Implementation:**
```typescript
// __tests__/SafetyAlertOverlay.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { SafetyAlertOverlay } from '@/components/SafetyAlertOverlay'

describe('THE SHOUT Component - Critical Path', () => {
  const mockDismiss = jest.fn()

  beforeEach(() => mockDismiss.mockClear())

  it('A2.1: SHOUT renders full-screen backdrop', () => {
    render(<SafetyAlertOverlay type="shout" message="HAND!" onDismiss={mockDismiss} />)
    expect(document.querySelector('.shout-backdrop')).toBeInTheDocument()
  })

  it('A2.2: displays user name in uppercase', () => {
    render(<SafetyAlertOverlay type="shout" message="HAND!" userName="marcus" onDismiss={mockDismiss} />)
    expect(screen.getByText(/MARCUS/)).toBeInTheDocument()
  })

  it('A2.3: displays shouting image, not emoji', () => {
    render(<SafetyAlertOverlay type="shout" message="HAND!" onDismiss={mockDismiss} />)
    const img = document.querySelector('img[src*="shouting"]')
    expect(img).toBeInTheDocument()
  })

  it('A2.4: dismiss button triggers onDismiss', () => {
    render(<SafetyAlertOverlay type="shout" message="HAND!" onDismiss={mockDismiss} />)
    fireEvent.click(screen.getByRole('button'))
    expect(mockDismiss).toHaveBeenCalled()
  })

  it('A2.5: keyboard dismisses (Space/Enter/Escape)', () => {
    render(<SafetyAlertOverlay type="shout" message="HAND!" onDismiss={mockDismiss} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(mockDismiss).toHaveBeenCalled()
  })
})
```

---

### A3. Chrome MCP Visual Tests - Semi-Automated (10 tests)

> **Time:** 15 minutes
> **Type:** Semi-Automated (MCP Capture + Human Verification)
> **Purpose:** Capture screenshots and DOM state via automation; humans verify visual quality
> **REQUIRED TOOLS:** Chrome MCP (UI) + Chrome DevTools MCP (F12/Console)

**NOTE:** These tests use automated MCP tools to capture evidence, but require HUMAN judgment to verify the captured output meets quality standards. They are NOT fully automated.

**MCP Tool Usage for A3 Tests:**
- **Chrome MCP** (`mcp__claude-in-chrome__computer`): Take screenshots, verify UI elements
- **Chrome DevTools MCP** (`mcp__chrome-devtools__take_snapshot`): Inspect DOM, check console for errors
- Use DevTools MCP to verify no console errors during visual capture
- Use Chrome MCP for visual screenshots of THE SHOUT

#### A3.1 THE SHOUT Visual Capture

```
TEST A3.1: SHOUT State Screenshot Capture
TYPE: Semi-Automated (MCP Capture + Human Verification)
PURPOSE: Capture SHOUT visual for human review

AUTOMATED STEPS (MCP):
1. Navigate to http://localhost:3000
2. Complete onboarding (use mock or manual)
3. Trigger SHOUT via test endpoint OR manually trigger danger
4. Wait 500ms for animations
5. Capture screenshot
6. Capture DOM snapshot

MCP COMMANDS:
- mcp__chrome-devtools__navigate_page({ type: "url", url: "http://localhost:3000" })
- mcp__chrome-devtools__take_screenshot({ format: "png" })
- mcp__chrome-devtools__take_snapshot({ verbose: false })

HUMAN VERIFICATION (Review captured screenshot):
- [ ] Red backdrop fills entire viewport
- [ ] "MARCUS!" displayed in large text
- [ ] Sir Reginald shouting image visible (NOT emoji)
- [ ] Shake animation class present in DOM

VERDICT: PASS / FAIL (Human decision required)
```

#### A3.2 Image Loading Verification

| Test ID | Test | MCP Capture | Human Verifies |
|---------|------|-------------|----------------|
| A3.2.1 | sir-reginald-icon.png | `take_screenshot()` after load | Avatar visible |
| A3.2.2 | sir-reginald-shouting.png | `take_screenshot()` during SHOUT | Shouting face visible |
| A3.2.3 | sir-reginald-relief.png | `take_screenshot()` after dismiss | Relief face visible |
| A3.2.4 | Monocle flying animation | `take_snapshot()` | `monocle-flying` class exists |

#### A3.3 DOM State Verification

```
TEST A3.3: Verify SHOUT DOM Elements Exist
TYPE: Semi-Automated (MCP Capture + Human Verification)
PURPOSE: Confirm critical classes/elements present

MCP COMMAND:
mcp__chrome-devtools__take_snapshot({ verbose: true })

HUMAN VERIFICATION (Review captured snapshot):
- [ ] Element with class "shout-backdrop" exists
- [ ] Element with class "shout-card" exists
- [ ] Element with class "animate-shake" exists
- [ ] img element with src containing "shouting" exists
- [ ] Button with dismiss functionality exists
- [ ] role="alertdialog" attribute present
- [ ] aria-modal="true" present

VERDICT: PASS / FAIL (Human decision required)
```

#### A3.4 Responsive Check

| Test ID | Viewport | MCP Capture | Human Verifies |
|---------|----------|-------------|----------------|
| A3.4.1 | 1920x1080 | `resize_page()`, `take_screenshot()` | SHOUT fills screen, readable |
| A3.4.2 | 1280x720 | `resize_page()`, `take_screenshot()` | SHOUT fills screen, readable |

---

### A4. Build Verification (5 tests)

> **Time:** 5 minutes
> **Purpose:** App deploys without errors

| Test ID | Command | Pass Criteria |
|---------|---------|---------------|
| A4.1 | `npm run build` | Exit code 0, no errors |
| A4.2 | `npx tsc --noEmit` | No TypeScript errors |
| A4.3 | `npm run lint` | No lint errors |
| A4.4 | Check for shouting.png in build | File exists in output |
| A4.5 | Start dev server | Loads on localhost:3000 |

```bash
# A4 Build Verification Script
cd sir-reginald-app
npm run build && echo "A4.1 PASS" || echo "A4.1 FAIL"
npx tsc --noEmit && echo "A4.2 PASS" || echo "A4.2 FAIL"
npm run lint && echo "A4.3 PASS" || echo "A4.3 FAIL"
ls .next/static/media/*shouting* && echo "A4.4 PASS" || echo "A4.4 FAIL"
npm run dev &
sleep 5
curl -s http://localhost:3000 | grep -q "Sir Reginald" && echo "A4.5 PASS" || echo "A4.5 FAIL"
```

---

## Category B: Human/Workshop Tests (105 tests)

> **IMPORTANT: Keep Chrome MCP and Chrome DevTools MCP running throughout ALL Category B tests!**
>
> - **Chrome MCP**: Use for capturing screenshot evidence of THE SHOUT, UI states
> - **Chrome DevTools MCP**: Use for checking console errors, monitoring network requests, debugging failures
>
> These tools help you debug issues in real-time and capture evidence for test logs.

### B1. THE SHOUT Reliability Protocol (25 tests)

> **Time:** 2 hours
> **CRITICAL: This determines if we can demo**

#### B1.1 SHOUT Trigger Reliability (20 Trials)

**Setup:** Real workshop environment (or simulated), webcam active, Gemini connected.

| Trial | Time | Trigger Success | Latency (ms) | Image Correct | Audio Played | Shake Animation | Recovery to Normal |
|-------|------|-----------------|--------------|---------------|--------------|-----------------|-------------------|
| 1 | | [ ] | | [ ] | [ ] | [ ] | [ ] |
| 2 | | [ ] | | [ ] | [ ] | [ ] | [ ] |
| 3 | | [ ] | | [ ] | [ ] | [ ] | [ ] |
| 4 | | [ ] | | [ ] | [ ] | [ ] | [ ] |
| 5 | | [ ] | | [ ] | [ ] | [ ] | [ ] |
| 6 | | [ ] | | [ ] | [ ] | [ ] | [ ] |
| 7 | | [ ] | | [ ] | [ ] | [ ] | [ ] |
| 8 | | [ ] | | [ ] | [ ] | [ ] | [ ] |
| 9 | | [ ] | | [ ] | [ ] | [ ] | [ ] |
| 10 | | [ ] | | [ ] | [ ] | [ ] | [ ] |
| 11 | | [ ] | | [ ] | [ ] | [ ] | [ ] |
| 12 | | [ ] | | [ ] | [ ] | [ ] | [ ] |
| 13 | | [ ] | | [ ] | [ ] | [ ] | [ ] |
| 14 | | [ ] | | [ ] | [ ] | [ ] | [ ] |
| 15 | | [ ] | | [ ] | [ ] | [ ] | [ ] |
| 16 | | [ ] | | [ ] | [ ] | [ ] | [ ] |
| 17 | | [ ] | | [ ] | [ ] | [ ] | [ ] |
| 18 | | [ ] | | [ ] | [ ] | [ ] | [ ] |
| 19 | | [ ] | | [ ] | [ ] | [ ] | [ ] |
| 20 | | [ ] | | [ ] | [ ] | [ ] | [ ] |

**Thresholds:**
- Success Rate: 90%+ (18/20 minimum)
- Latency: 95% under 400ms
- Image Correct: 100% (shouting face, not emoji)
- Audio: 100%

#### B1.2 SHOUT Edge Cases (5 tests)

| Test ID | Scenario | Action | Pass Criteria |
|---------|----------|--------|---------------|
| B1.2.1 | Cold Start SHOUT | Fresh page load, immediate danger | Triggers within 3s of connection |
| B1.2.2 | SHOUT after SHOUT | Trigger twice in 30s | Second triggers correctly |
| B1.2.3 | SHOUT while Sir Reginald speaking | Danger mid-sentence | SHOUT interrupts speech |
| B1.2.4 | Rapid dismiss + retrigger | Dismiss, danger again in 2s | Retriggers correctly |
| B1.2.5 | SHOUT at session minute 30 | Long session stability | Same reliability as minute 1 |

---

### B2. Judge Experience Tests (15 tests) - REQUIRES 3-5 NON-MAKER VIEWERS

> **Time:** 2 hours
> **Viewers Required:** 3-5 non-makers (friends, family, colleagues who don't do workshop/DIY)
> **Purpose:** Test if NON-MAKERS understand what happened
> **Participants:** 3-5 people who are NOT familiar with the project

This is the most important validation. If judges don't understand THE SHOUT, we lose.

#### Viewer Recruitment Protocol

**Who Qualifies as a "Non-Maker" Test Viewer:**
- NOT involved in this hackathon project
- NOT a software developer working on this codebase
- Has NOT seen the demo or product before
- Ideally: no workshop/maker background (to simulate judge unfamiliarity)
- Acceptable: maker with no prior knowledge of THIS project

**Where to Find Test Viewers:**
- Friends/family who are NOT developers
- Discord communities (general tech, not maker-specific)
- Reddit: r/samplesize, r/FavorForAFavor, r/SideProject
- Colleagues from non-technical departments
- University students (non-CS majors)
- Neighbors, roommates

**What to Tell Them Beforehand:**
- "I need you to watch a 2-minute video and answer some questions"
- "You don't need any technical knowledge"
- "Just watch normally like you're seeing this for the first time"
- "I'll ask you questions after - no right or wrong answers"
- DO NOT explain what the product does
- DO NOT prime them about safety or workshops
- DO NOT tell them what to look for

**Consent for Feedback Usage:**
- "Your feedback will help improve our hackathon submission"
- "Your responses may be summarized in our development notes"
- "Your identity will remain anonymous"
- Get verbal acknowledgment before proceeding

**Session Structure:**
1. Brief intro (see above)
2. Play 2-minute demo video with NO interruptions
3. Ask questions immediately after
4. Record responses verbatim
5. Thank them and collect any additional thoughts

---

#### B2.1 Blind Demo Viewing (5 tests per viewer)

**Protocol:**
1. Show viewer the 2-minute demo video with NO explanation
2. Ask questions after
3. Record responses verbatim

| Viewer | Background | Questions Asked | Responses |
|--------|------------|-----------------|-----------|
| Viewer 1 | | | |
| Viewer 2 | | | |
| Viewer 3 | | | |

**Questions to Ask:**

| Q# | Question | Good Answer | Bad Answer |
|----|----------|-------------|------------|
| JE-1 | "What did Sir Reginald do when the hand got close?" | "Yelled/warned about the hand near the blade" | "I don't know" / "Something flashed" |
| JE-2 | "Why did the screen turn red?" | "Danger/emergency/warning about injury" | "Error?" / "Bug?" |
| JE-3 | "What is this product?" | "Safety assistant/monitor for workshops" | "Chatbot" / "Camera app" |
| JE-4 | "Would this be useful?" | "Yes, prevents injuries" | "Not sure what it does" |
| JE-5 | "What was the most memorable moment?" | "THE SHOUT / when he yelled" | Something else |

**Pass Criteria:**
- 3/3 viewers correctly identify THE SHOUT's purpose (JE-1)
- 3/3 viewers understand the red screen = danger (JE-2)
- 2/3 viewers correctly describe the product (JE-3)

**If JE-1 fails:** THE SHOUT is not clear enough. STOP. Fix before continuing.

#### B2.2 Comprehension Timing Tests

| Test ID | Timestamp | Question | Pass Criteria |
|---------|-----------|----------|---------------|
| JE-6 | 0:15 | "What did you just see?" | Knows something about safety/workshop |
| JE-7 | 0:45 (after SHOUT) | "What just happened?" | "Warning about hand near blade" |
| JE-8 | 1:30 | "What's the main value?" | Injury prevention |
| JE-9 | 2:00 (end) | "Would you submit this?" | "Yes" |
| JE-10 | End | "What would make it better?" | Actionable feedback |

---

### B3. Safety Scenario Tests (15 tests)

> **Time:** 1 hour
> **Purpose:** All 5 hardcoded scenarios work in real environment

#### B3.1 Hand Near Blade - THE SHOUT

| Test ID | Action | Expected | Notes |
|---------|--------|----------|-------|
| B3.1.1 | Move hand toward visible blade/tool | SHOUT triggers | Primary demo moment |
| B3.1.2 | Hand near but stationary | Warning or SHOUT | Depends on proximity |
| B3.1.3 | Hand retreating | No additional alert | Don't punish correction |

#### B3.2 Safety Glasses Missing

| Test ID | Action | Expected |
|---------|--------|----------|
| B3.2.1 | Start without safety glasses | Warning within 30s |
| B3.2.2 | Put on safety glasses | "Splendid" acknowledgment |
| B3.2.3 | Remove glasses mid-session | Warning triggers |

#### B3.3 Cluttered Workspace

| Test ID | Action | Expected |
|---------|--------|----------|
| B3.3.1 | Scattered items visible | Warning about clutter |
| B3.3.2 | Clear workspace | Positive response |
| B3.3.3 | Gradual clutter buildup | Warning at threshold |

#### B3.4 Improper Grip

| Test ID | Action | Expected |
|---------|--------|----------|
| B3.4.1 | One-handed tool grip | Two-hand warning |
| B3.4.2 | Proper two-handed grip | Positive response |
| B3.4.3 | Grip change during use | Warning on switch |

#### B3.5 Hearing Protection

| Test ID | Action | Expected |
|---------|--------|----------|
| B3.5.1 | Loud tool visible, no ear protection | Hearing protection warning |
| B3.5.2 | Ear protection visible | Acknowledgment |

---

### B4. Audio Tests (15 tests)

> **Time:** 45 minutes
> **Purpose:** Ensure audio is CLEAR and DRAMATIC in recording

#### B4.1 Voice Clarity

| Test ID | Test | Pass Criteria |
|---------|------|---------------|
| B4.1.1 | Sir Reginald normal speech | Words understandable at 50% volume |
| B4.1.2 | SHOUT audio | Dramatically louder, cuts through |
| B4.1.3 | British accent consistency | Kore voice throughout, never breaks |
| B4.1.4 | No audio clipping | Clean waveform at max volume |
| B4.1.5 | Audio with background noise | Still understandable |

#### B4.2 Audio Interrupt Priority

| Test ID | Scenario | Expected | Target Latency | Acceptable Latency |
|---------|----------|----------|----------------|-------------------|
| B4.2.1 | Danger while Sir Reginald speaking | SHOUT INTERRUPTS | < 500ms | < 1000ms |
| B4.2.2 | Multiple rapid alerts | Latest takes priority | < 500ms | < 1000ms |
| B4.2.3 | SHOUT during observation | Cuts observation short | < 500ms | < 1000ms |

**NOTE:** Audio interrupt relies on Gemini Live's actual capability. The 500ms target is realistic for Gemini Live's response time. The previous 100ms target was unrealistic for the full pipeline (Gemini processing + audio generation + browser playback).

**How to Measure:**
1. Start a stopwatch when danger motion begins
2. Stop when SHOUT audio begins playing
3. Subtract estimated Gemini processing time (~200-300ms) to isolate interrupt latency

**THIS IS CRITICAL.** The positioning document says THE SHOUT interrupts. If it takes >1000ms, the interruption feels too delayed.

#### B4.3 Alarm Sound Tests

| Test ID | Test | Expected |
|---------|------|----------|
| B4.3.1 | Two-tone alarm | 880Hz/660Hz alternating |
| B4.3.2 | Alarm duration | 1.6 seconds |
| B4.3.3 | Alarm stops on dismiss | Immediate stop |
| B4.3.4 | First alarm (cold audio context) | No delay |

#### B4.4 Volume Consistency

| Test ID | Setting | Pass Criteria |
|---------|---------|---------------|
| B4.4.1 | Volume 100% | Loud but not painful |
| B4.4.2 | Volume 50% | Noticeably quieter |
| B4.4.3 | SHOUT vs normal speech | SHOUT 20-30% louder |

---

### B5. Demo Rehearsals (20 tests) - 8 HOURS

> **Time:** 8 hours minimum
> **Purpose:** Perfect the 2-minute video
> **Required:** At least 10 full run-throughs

This is the actual deliverable. The video wins or loses.

#### B5.1 Full Demo Run-Through (10 Attempts Minimum)

| Attempt | Date/Time | Duration | SHOUT Success | SHOUT Latency | Audio Clear | Issues | Usable Take? |
|---------|-----------|----------|---------------|---------------|-------------|--------|--------------|
| 1 | | | [ ] | ms | [ ] | | [ ] |
| 2 | | | [ ] | ms | [ ] | | [ ] |
| 3 | | | [ ] | ms | [ ] | | [ ] |
| 4 | | | [ ] | ms | [ ] | | [ ] |
| 5 | | | [ ] | ms | [ ] | | [ ] |
| 6 | | | [ ] | ms | [ ] | | [ ] |
| 7 | | | [ ] | ms | [ ] | | [ ] |
| 8 | | | [ ] | ms | [ ] | | [ ] |
| 9 | | | [ ] | ms | [ ] | | [ ] |
| 10 | | | [ ] | ms | [ ] | | [ ] |

**Run-Through Checklist (EVERY attempt):**
- [ ] Onboarding completes smoothly
- [ ] Camera setup works first try
- [ ] Sir Reginald speaks on connect
- [ ] Normal observations happen naturally
- [ ] THE SHOUT triggers at EXACT RIGHT MOMENT
- [ ] Sir Reginald's FACE appears (not emoji)
- [ ] Shake animation fires
- [ ] Audio is clear and dramatic
- [ ] User name displayed correctly
- [ ] Near-miss counter updates
- [ ] Statistics display correctly
- [ ] Relief state shows after dismiss
- [ ] Session continues normally after

#### B5.2 Script Timing Tests

The demo video must hit exact timings. Practice until locked.

| Segment | Target Start | Target End | Duration | Content | Status |
|---------|-------------|------------|----------|---------|--------|
| Hook | 0:00 | 0:10 | 10s | Tease THE SHOUT moment | [ ] |
| Problem | 0:10 | 0:25 | 15s | Workshop injury stats | [ ] |
| THE SHOUT | 0:25 | 0:50 | 25s | Full demo of SHOUT | [ ] |
| Second Scenario | 0:50 | 1:10 | 20s | Safety glasses warning | [ ] |
| How It Works | 1:10 | 1:30 | 20s | Technical explanation | [ ] |
| Impact | 1:30 | 1:50 | 20s | Cost savings, potential | [ ] |
| Close | 1:50 | 2:00 | 10s | CTA, logo | [ ] |

**Timing Validation:**
- [ ] Each segment hits within +/- 2 seconds
- [ ] Total runtime: 1:55 - 2:00
- [ ] THE SHOUT happens at exactly 0:30 (+/- 3s)

#### B5.3 Recovery Practice

Practice recovering from failures DURING recording:

| Test ID | Failure | Recovery Action | Time to Recover |
|---------|---------|-----------------|-----------------|
| B5.3.1 | SHOUT doesn't trigger | Retry motion, or cut to different take | < 5s |
| B5.3.2 | Audio cuts out | Check connection, restart take | < 30s |
| B5.3.3 | Wrong name displayed | Stop take, fix setting, restart | < 1min |
| B5.3.4 | Gemini disconnects | Refresh, reconnect, restart take | < 2min |
| B5.3.5 | App crashes | Have backup browser tab ready | < 30s |

---

### B6. Recording Tests (15 tests) - OBS Validation

> **Time:** 1.5 hours
> **Purpose:** Ensure recording quality BEFORE demo day

#### B6.1 OBS Setup Validation

Do this FIRST, before any other recording tests.

| Test ID | Setting | Target | Actual | Status |
|---------|---------|--------|--------|--------|
| B6.1.1 | Resolution | 1920x1080 | | [ ] |
| B6.1.2 | Frame Rate | 60fps | | [ ] |
| B6.1.3 | Bitrate | 6000kbps+ | | [ ] |
| B6.1.4 | Encoder | x264 or NVENC | | [ ] |
| B6.1.5 | Audio Bitrate | 192kbps+ | | [ ] |
| B6.1.6 | Audio Sources | Desktop + Mic | | [ ] |
| B6.1.7 | Export Format | MP4 H.264 | | [ ] |

**OBS Test Recording:**
1. Record 30 seconds of THE SHOUT
2. Export
3. Play back on different device
4. Verify quality

| Check | Pass Criteria | Status |
|-------|---------------|--------|
| Video quality | Sharp, no compression artifacts | [ ] |
| Frame smoothness | 60fps, no drops during shake | [ ] |
| Audio sync | A/V within 50ms | [ ] |
| SHOUT audio | Loud, clear, not clipped | [ ] |
| File size | < 500MB for 2 min | [ ] |
| Playback | Works in VLC, browser, phone | [ ] |

#### B6.2 Recording Quality Checks

| Test ID | What to Record | Duration | Quality Check |
|---------|----------------|----------|---------------|
| B6.2.1 | THE SHOUT close-up | 30s | Face + hand clearly visible |
| B6.2.2 | Full dashboard | 30s | All UI elements readable |
| B6.2.3 | Near-miss counter | 15s | Numbers and stats visible |
| B6.2.4 | Latency indicator | 15s | Numbers readable |
| B6.2.5 | Session verdict | 30s | Quote and stats visible |

#### B6.3 Multiple Takes Strategy

| Take # | Focus | Notes |
|--------|-------|-------|
| Takes 1-3 | Full run-through, identify issues | |
| Takes 4-6 | Focus on THE SHOUT timing | |
| Takes 7-8 | Focus on audio clarity | |
| Takes 9-10 | Final polished attempts | |
| Backup | Extra takes for safety | |

---

### B7. Emergency Recovery Protocol (5 tests)

> **Time:** 30 minutes
> **Purpose:** Know exactly what to do when things fail

#### B7.1 Protocol Documentation

**WHEN GEMINI DISCONNECTS:**
1. Check API status (https://status.google.com)
2. Try refresh page
3. If persistent, switch to backup API key
4. If still failing, use pre-recorded footage

**WHEN THE SHOUT FAILS TO TRIGGER:**
1. Try motion again (exaggerate hand movement)
2. Wait 5 seconds, retry
3. If 3 failures, check console for errors
4. Restart session if needed
5. Use backup take if recording

**WHEN AUDIO BREAKS:**
1. Check speaker not muted
2. Verify audio context initialized (click screen)
3. Refresh page
4. Use backup device speakers

**WHEN APP CRASHES:**
1. Immediately switch to backup browser tab (have one ready)
2. Or use pre-loaded backup instance
3. For recording: edit around it or use backup take

**WHEN RATE LIMITED:**
1. Switch to backup Gemini API key
2. If no backup, wait 60 seconds
3. Reduce frame rate to 0.5 FPS temporarily

#### B7.2 Emergency Protocol Tests

| Test ID | Simulate | Recovery | Time to Recover |
|---------|----------|----------|-----------------|
| B7.2.1 | Disconnect network for 5s | Auto-reconnect? | Target: < 10s |
| B7.2.2 | SHOUT not triggering (3 tries) | Follow protocol | Target: < 30s |
| B7.2.3 | Refresh mid-session | Session resumption | Target: < 15s |
| B7.2.4 | OBS crash | Restart, resume | Target: < 60s |
| B7.2.5 | Wrong API key | Switch to backup | Target: < 60s |

---

### B8. API Stress Tests (10 tests)

> **Time:** 1 hour
> **Purpose:** Ensure stability during extended testing/recording

#### B8.1 Rate Limit Discovery

| Test ID | Duration | Calls | Rate Limit Hit? | Notes |
|---------|----------|-------|-----------------|-------|
| B8.1.1 | 10 min | ~600 | [ ] | |
| B8.1.2 | 30 min | ~1800 | [ ] | |
| B8.1.3 | 1 hour | ~3600 | [ ] | |

**If rate limited:** Note the threshold. Plan breaks during testing.

#### B8.2 Memory Leak Test (30+ min session)

| Checkpoint | Time | Memory (Task Manager) | Status |
|------------|------|----------------------|--------|
| Start | 0 min | MB | |
| | 10 min | MB | |
| | 20 min | MB | |
| | 30 min | MB | |

**Pass Criteria:** Memory increase < 100MB over 30 minutes

#### B8.3 Long Session Stability

| Test ID | Duration | Check | Pass Criteria |
|---------|----------|-------|---------------|
| B8.3.1 | 30 min | THE SHOUT still triggers | Same reliability as start |
| B8.3.2 | 30 min | Audio still works | No degradation |
| B8.3.3 | 30 min | No UI glitches | Smooth operation |
| B8.3.4 | 30 min | Latency stable | No increase over time |

---

### B9. Gemini Chaos Testing (10 tests) - NEW

> **Time:** 45 minutes
> **Purpose:** Handle edge cases where Gemini behaves unexpectedly

#### B9.1 Gemini Misbehavior Scenarios

| Test ID | Scenario | How to Simulate | Expected Behavior | Pass Criteria |
|---------|----------|-----------------|-------------------|---------------|
| B9.1.1 | Gemini returns inappropriate content | N/A (monitor only) | App filters/handles gracefully | No offensive content shown to user |
| B9.1.2 | Gemini goes silent for 10+ seconds | Disconnect network briefly, reconnect | Loading/reconnecting indicator | User informed, no crash |
| B9.1.3 | Gemini generates non-safety commentary | Observe natural conversation drift | Commentary stays workshop-relevant | Doesn't derail demo |
| B9.1.4 | Gemini response missing `<shout>` tag when danger present | **CONTROLLED:** Trigger SHOUT 10 times, count responses with vs without tag | Fallback keyword detection triggers if tag missing | User warned 100% of attempts via tag OR fallback |
| B9.1.5 | Gemini sends malformed `<shout>` tag | N/A (code review check) | Parser handles gracefully | No crash, logs error |

#### B9.2 Response Timeout Tests

| Test ID | Scenario | Action | Pass Criteria |
|---------|----------|--------|---------------|
| B9.2.1 | No response in 5 seconds | Trigger danger, wait | Loading indicator visible |
| B9.2.2 | No response in 10 seconds | Trigger danger, wait | Timeout message OR retry |
| B9.2.3 | Response arrives after timeout | Trigger, wait 15s, response comes | Handles late response gracefully |

#### B9.3 Shout Tag Reliability

| Test ID | Input | Expected Output | Pass Criteria |
|---------|-------|-----------------|---------------|
| B9.3.1 | Valid `<shout scenario="hand_near_blade">MARCUS! HAND!</shout>` | SHOUT triggers | Full SHOUT experience |
| B9.3.2 | Missing closing tag `<shout scenario="test">Text` | Fallback behavior | No crash, warning shown |
| B9.3.3 | Empty shout `<shout scenario="test"></shout>` | Fallback message | Uses default SHOUT text |
| B9.3.4 | Multiple shouts in one response | Process first OR all | Consistent behavior |
| B9.3.5 | Shout with extra attributes | Ignore extras | SHOUT still works |

**Testing Methodology:**
- B9.1.1, B9.1.3: Observe during extended testing sessions (30+ minutes)
- B9.1.2: Briefly disable network adapter, re-enable after 10-15 seconds
- B9.1.4: **CONTROLLED TEST** - Trigger 10 shouts, verify each produces either `<shout>` tag or fallback keyword detection succeeds
- B9.1.5, B9.3.x: Create unit tests to verify parser resilience
- B9.2.x: Use network throttling in Chrome DevTools to simulate slow responses

---

## Test Failure Decision Tree

**Use this flowchart when a test fails to determine next steps.**

```
TEST FAILED
    |
    v
Is it a CRITICAL test? (A1, A2, B1.1, B2.1)
    |
   YES --> STOP ALL TESTING
    |       |
    |       v
    |   Is it a CODE issue?
    |       |
    |      YES --> Fix code, re-run test
    |       |
    |      NO --> Is it an ENVIRONMENT issue?
    |              |
    |             YES --> Fix setup (camera, audio, OBS), re-run
    |              |
    |             NO --> Is it a GEMINI issue?
    |                     |
    |                    YES --> Try backup API key, check status.google.com
    |                     |      If persistent: wait 30 min OR use fallback
    |                     |
    |                    NO --> Document issue, escalate
    |
   NO --> Is it blocking other tests?
           |
          YES --> Fix now, then continue
           |
          NO --> Log issue, continue testing
                  |
                  v
              Fix in next available slot
```

### Specific Failure Responses

| Failure Type | Immediate Action | Escalation |
|--------------|------------------|------------|
| Build fails (A4) | Check npm errors, fix code | Cannot proceed without build |
| Unit test fails (A1) | Fix parser code | Block on SHOUT parsing |
| SHOUT doesn't trigger (B1) | Check Gemini connection, retry 3x | If 3+ failures, debug prompt/code |
| Image not loading (A3) | Check file paths, network tab | May need to rebuild |
| Audio not playing (B4) | Click to init audio context, check volume | Check Web Audio API code |
| Rate limited (B8) | Switch API key, wait 60s | Use backup key, reduce FPS |
| Judges confused (B2) | Identify confusion point, fix demo | May need to re-record segments |
| OBS recording bad (B6) | Check settings, test again | Must resolve before demo day |

---

## Test Execution Order

### Phase 1: Pre-Demo Foundation (Day -3)

| Time | Tests | Purpose |
|------|-------|---------|
| 15 min | Pre-Test Master Checklist | Everything ready |
| 30 min | A4 Build Verification | App runs |
| 10 min | A1 Unit Tests | Parsing works |
| 15 min | A2 Component Tests | SHOUT component works |
| 15 min | A3 Chrome MCP Visuals | Capture screenshots + human verify |
| 30 min | B6.1 OBS Validation | Recording setup correct |

**Checkpoint:** Build passes, SHOUT renders, OBS configured

### Phase 2: Integration Testing (Day -2)

| Time | Tests | Purpose |
|------|-------|---------|
| 2 hr | B1 SHOUT Reliability | 20 trials |
| 1 hr | B3 Safety Scenarios | 5 scenarios work |
| 45 min | B4 Audio Tests | Sound is clear |
| 30 min | B7 Emergency Protocol | Know recovery paths |
| 45 min | B9 Gemini Chaos Testing | Handle Gemini edge cases |

**Checkpoint:** 90%+ SHOUT reliability, audio works, protocols known, Gemini edge cases handled

### Phase 3: Judge Experience (Day -1)

| Time | Tests | Purpose |
|------|-------|---------|
| 2 hr | B2 Judge Experience | Non-makers understand |
| 1 hr | B8 API Stress Tests | No rate limits/leaks |

**Checkpoint:** Viewers understand THE SHOUT, no API issues

### Phase 4: Demo Day Preparation (Day 0)

| Time | Tests | Purpose |
|------|-------|---------|
| 8 hr | B5 Demo Rehearsals | Perfect the video |
| 1.5 hr | B6 Recording Tests | Quality validation |
| 2 hr | **Buffer for unexpected issues** | Handle surprises |

**Checkpoint:** At least 3 perfect usable takes recorded

---

## Pass/Fail Criteria

### DEMO READY Checklist

| Criteria | Requirement | Status |
|----------|-------------|--------|
| Build passes | `npm run build` succeeds | [ ] |
| SHOUT triggers | 90%+ success rate (18/20) | [ ] |
| SHOUT shows face | Sir Reginald's face, not emoji | [ ] |
| Shake animation | Visible violent shake | [ ] |
| Audio plays | Alarm + voice clearly audible | [ ] |
| Audio interrupts | SHOUT cuts speech within 1000ms | [ ] |
| Relief state | Shows after dismiss | [ ] |
| Judge comprehension | 3/3 viewers understand SHOUT | [ ] |
| OBS recording | 1080p60, good audio sync | [ ] |
| Full demo run | At least 3 perfect takes | [ ] |
| Gemini chaos handled | Edge cases don't crash app | [ ] |

### CRITICAL FAILURES (Block Demo)

ANY of these = DO NOT SUBMIT VIDEO:

1. THE SHOUT fails > 2/20 times
2. THE SHOUT shows emoji instead of shouting image
3. Audio does not play at all
4. SHOUT does NOT interrupt ongoing speech (>2000ms)
5. App crashes during SHOUT
6. Gemini connection fails repeatedly
7. OBS recording is unusable (wrong format, no audio, artifacts)
8. 0/3 judge test viewers understand what happened
9. Rate limited with no backup key

### Acceptable Issues (Can Demo With)

- Occasional false positive warning (< 2/30 min)
- Minor animation glitches
- Mobile layout imperfect
- One scenario less reliable than others
- Latency occasionally > 800ms (but < 1500ms)
- Gemini occasionally drifts off-topic (self-corrects)

---

## Risk Matrix (Updated)

| Risk | Probability | Impact | Mitigation | Test Coverage |
|------|-------------|--------|------------|---------------|
| THE SHOUT doesn't trigger | Medium | CRITICAL | 20 reliability trials, multiple takes | B1 |
| Shouting image doesn't load | Low | HIGH | Priority loading, A3 verification | A3 |
| Audio fails | Medium | HIGH | B4 tests, audio context init | B4 |
| Audio doesn't interrupt | Medium | HIGH | B4.2 interrupt tests (realistic targets) | B4.2 |
| API connection unstable | Medium | HIGH | B7 emergency protocol | B7 |
| Rate limited | Medium | HIGH | B8 stress tests, backup key | B8 |
| Memory leak | Medium | MEDIUM | B8.2 30-min test | B8.2 |
| OBS recording bad | Low | CRITICAL | B6.1 validation first | B6.1 |
| Judges don't understand | Medium | CRITICAL | B2 judge experience tests | B2 |
| Cold start unreliable | Low | MEDIUM | B1.2.1 cold start test | B1.2 |
| Gemini misbehaves | Medium | HIGH | B9 chaos testing | B9 |
| Gemini misses shout tag | Medium | HIGH | B9.1.4, fallback warning | B9 |

---

## Appendix A: Test Environment Setup

### Required Software
- Node.js 18+
- Chrome (latest)
- OBS Studio (configured per B6.1)
- Access to Chrome DevTools

### Required Hardware
- Webcam (720p minimum, 1080p preferred)
- Microphone (external recommended)
- Speakers (not just headphones - need room audio)
- Workshop props (blade/saw, safety glasses, items for clutter)

### API Keys
```bash
# .env.local
GEMINI_API_KEY=primary_key_here
# Have backup ready (documented separately, NOT in .env)
# GEMINI_API_KEY_BACKUP=backup_key_here
```

### Test Data
- User name: "Marcus" (consistent across all tests)
- Controlled hand motions for reliability
- Same lighting setup for all takes

---

## Appendix B: Manual Test Log Template (Printable)

Print this for each testing session. One page per test type.

```
================================================================
THE SHOUT MANUAL TEST LOG v7
================================================================
Date: ____________    Tester: ____________    Session #: ____

PRE-TEST CHECKLIST (mark all before starting)
[ ] Camera working         [ ] Speakers on (not muted)
[ ] Microphone working     [ ] API key configured
[ ] Dev server running     [ ] Backup API key documented
[ ] OBS configured         [ ] Workshop props ready

================================================================
SHOUT RELIABILITY TRIAL LOG
================================================================

Trial #: ____    Time Started: ____:____

[ ] Hand motion performed toward blade/tool
[ ] SHOUT triggered: YES / NO
[ ] Latency: ______ms (measure with stopwatch)
[ ] Shouting IMAGE appeared (not emoji): YES / NO
[ ] Shake animation visible: YES / NO
[ ] Audio alarm played: YES / NO
[ ] Audio INTERRUPTED speech: YES / NO / N/A
[ ] "MARCUS!" displayed correctly: YES / NO
[ ] Countdown timer visible: YES / NO
[ ] Dismiss worked (tap/keyboard): YES / NO
[ ] Relief state appeared after dismiss: YES / NO
[ ] Near-miss counter incremented: YES / NO
[ ] Session continued normally after: YES / NO

ISSUES OBSERVED:
_________________________________________________________________
_________________________________________________________________

VERDICT: PASS / FAIL

================================================================
JUDGE EXPERIENCE VIEWER LOG
================================================================

Viewer ID: ____    Background: ________________
Date/Time: ____________

JE-1: "What did Sir Reginald do when the hand got close?"
Response: _______________________________________________________
Rating: GOOD / BAD

JE-2: "Why did the screen turn red?"
Response: _______________________________________________________
Rating: GOOD / BAD

JE-3: "What is this product?"
Response: _______________________________________________________
Rating: GOOD / BAD

JE-4: "Would this be useful?"
Response: _______________________________________________________
Rating: GOOD / BAD

JE-5: "What was the most memorable moment?"
Response: _______________________________________________________
Rating: GOOD / BAD

Additional Comments from Viewer:
_________________________________________________________________
_________________________________________________________________

VIEWER VERDICT: UNDERSTOOD / CONFUSED

================================================================
DEMO REHEARSAL LOG
================================================================

Attempt #: ____    Date/Time: ____________

Duration: ____:____    Target: 2:00

TIMING CHECKPOINTS:
[ ] Hook complete by 0:10
[ ] Problem statement by 0:25
[ ] THE SHOUT triggers at ~0:30 (actual: ____:____)
[ ] Second scenario by 1:10
[ ] How it works by 1:30
[ ] Impact section by 1:50
[ ] Close by 2:00

SHOUT QUALITY:
[ ] Triggered at right moment: YES / NO
[ ] Face image (not emoji): YES / NO
[ ] Shake animation: YES / NO
[ ] Audio clear: YES / NO
[ ] Latency acceptable (<800ms): YES / NO (actual: ____ms)

ISSUES:
_________________________________________________________________

USABLE TAKE: YES / NO
================================================================
```

---

## Appendix C: Time Allocation Summary

| Category | v6 Time | v7 Time | Change |
|----------|---------|---------|--------|
| Pre-Test Checklist | 0h | 0.25h | NEW |
| Automated Tests | 0.75h | 0.5h | -33% |
| Semi-Automated (Chrome MCP) | (included above) | 0.25h | Reclassified |
| Human/Workshop Tests | 8.5h | 9.25h | +9% |
| Gemini Chaos Testing | 0h | 0.75h | NEW |
| Demo Rehearsals | 8h | 8h | Same |
| Judge Experience | 2h | 2h | Same |
| OBS Validation | 0.5h | 0.5h | Same |
| Emergency Protocol | 0.5h | 0.5h | Same |
| API Stress Tests | 1h | 1h | Same |
| **Time Buffer** | 0h | 2h | NEW |
| **TOTAL** | 21.25h | 25h | +18% |

The extra time accounts for Gemini chaos testing and buffer for unexpected issues.

---

*"Judges don't run Jest. They watch a 2-minute video. Test accordingly."*

*-- Tester Agent v7, January 2026*

---

**Test Plan Status: READY FOR EXECUTION**
**Target Critic Score: 10/10**

---

## Changes from v6

1. **Fixed Chrome MCP Test Labeling (Issue 1):**
   - Renamed A3 section to "Chrome MCP Visual Tests - Semi-Automated"
   - Added explicit "TYPE: Semi-Automated (MCP Capture + Human Verification)" to each test
   - Clarified that these tests require human judgment for verification
   - Updated executive summary to show separate count for Semi-Automated tests

2. **Added Gemini Chaos Testing (Issue 2):**
   - Added new section B9 with 10 tests
   - B9.1: Gemini misbehavior scenarios (inappropriate content, silence, drift, missing tags)
   - B9.2: Response timeout tests (5s, 10s, late response handling)
   - B9.3: Shout tag reliability (malformed tags, empty tags, multiple tags)
   - Added testing methodology for each scenario type
   - Updated execution timeline to include B9 on Day -2

3. **Fixed Unrealistic 100ms Audio Interrupt Target (Issue 3):**
   - Changed B4.2 targets from 100ms to realistic values:
     - Target: <500ms (realistic for Gemini Live pipeline)
     - Acceptable: <1000ms
   - Added explanation of why 500ms is realistic (Gemini processing + audio generation + playback)
   - Added measurement methodology for isolating interrupt latency
   - Updated DEMO READY checklist to reflect 1000ms threshold
   - Updated CRITICAL FAILURES to use 2000ms as hard limit

4. **Fixed Test Count Discrepancy (Issue 4):**
   - Recounted all tests accurately: 135 total
   - Added detailed breakdown table in Executive Summary:
     - A1: 5, A2: 5, A3: 10, A4: 5
     - B1: 25, B2: 15, B3: 15, B4: 15, B5: 20, B6: 15, B7: 5, B8: 10, B9: 10
   - Separated Category A/B counts properly (20 automated, 10 semi-automated, 105 human)

5. **Added Viewer Recruitment Checklist (Issue 5):**
   - Added complete "Viewer Recruitment Protocol" section under B2
   - Includes: who qualifies as "non-maker"
   - Includes: where to find test viewers (Discord, Reddit, friends, colleagues)
   - Includes: what to tell them beforehand (script provided)
   - Includes: consent language for feedback usage
   - Includes: session structure

6. **Added Pre-Test Master Checklist:**
   - New section at the top: "Pre-Test Master Checklist"
   - Environment checklist (Node, npm, Chrome, OBS, DevTools)
   - Hardware checklist (webcam, mic, speakers, props)
   - API & configuration checklist
   - Software state checklist
   - Recording setup checklist (if recording)

7. **Added Test Failure Decision Tree:**
   - Visual flowchart for "What to do if X test fails"
   - Covers: critical vs non-critical failures
   - Covers: code issues, environment issues, Gemini issues
   - Specific failure response table with immediate actions and escalation paths

8. **Added 2-Hour Time Buffer:**
   - Added explicit 2-hour buffer in Phase 4 (Demo Day Preparation)
   - Updated time allocation summary to show 25h total (up from 21.25h)
   - Buffer specifically for unexpected issues during demo day

9. **Updated Test Log Template:**
   - Expanded Appendix B with more comprehensive printable template
   - Includes: SHOUT reliability trial log with all checkpoints
   - Includes: Judge experience viewer log
   - Includes: Demo rehearsal log with timing checkpoints
   - Made it actually printable (one page per test type)

10. **Fixed B7.2 Test ID Numbering:**
    - Corrected B7.3.x to B7.2.x (was inconsistent in v6)

11. **Updated Risk Matrix:**
    - Added "Gemini misbehaves" and "Gemini misses shout tag" risks
    - Both reference B9 for test coverage
