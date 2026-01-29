# Sir Reginald Test Plan v6 - Demo-Focused & Critic-Revised

**Version:** 6.0
**Date:** January 19, 2026
**Target:** Video Submission Excellence for $50K Grand Prize
**Philosophy:** "Test every moment judges will see"

---

## Executive Summary

| Metric | Value |
|--------|-------|
| **Total Tests** | ~125 (down from 247) |
| **Category A (Automated)** | ~25 tests |
| **Category B (Human/Workshop)** | ~100 tests |
| **Demo Rehearsal Time** | 8 hours (restored from 1.5h) |
| **Judge Experience Tests** | 15 tests (restored) |
| **Critical Path Coverage** | THE SHOUT only |

### Test Philosophy Change

**Old Philosophy (v5):** "Test every function"
**New Philosophy (v6):** "Test every moment judges will see"

The judges watch a 2-minute video. Every test must answer:
- "Will this affect what judges see?"
- "Will this cause the demo to fail?"
- "Is this THE SHOUT?"

If the answer is NO to all three, the test is cut.

---

## Category A: Automated Tests (~25 tests)

> **Total Time:** 45 minutes
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

### A3. Chrome MCP Visual Tests (10 tests)

> **Time:** 15 minutes
> **Purpose:** Capture screenshots for human review, verify DOM state

These are EXECUTABLE scripts using actual MCP tools. They capture evidence; humans judge quality.

#### A3.1 THE SHOUT Visual Capture

```
TEST A3.1: SHOUT State Screenshot Capture
PURPOSE: Capture SHOUT visual for human review

STEPS:
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

VERIFY (HUMAN):
- Red backdrop fills entire viewport
- "MARCUS!" displayed in large text
- Sir Reginald shouting image visible (NOT emoji)
- Shake animation class present in DOM
```

#### A3.2 Image Loading Verification

| Test ID | Test | MCP Command | Human Verifies |
|---------|------|-------------|----------------|
| A3.2.1 | sir-reginald-icon.png | `take_screenshot()` after load | Avatar visible |
| A3.2.2 | sir-reginald-shouting.png | `take_screenshot()` during SHOUT | Shouting face visible |
| A3.2.3 | sir-reginald-relief.png | `take_screenshot()` after dismiss | Relief face visible |
| A3.2.4 | Monocle flying animation | `take_snapshot()` | `monocle-flying` class exists |

#### A3.3 DOM State Verification

```
TEST A3.3: Verify SHOUT DOM Elements Exist
PURPOSE: Confirm critical classes/elements present

MCP COMMAND:
mcp__chrome-devtools__take_snapshot({ verbose: true })

VERIFY IN SNAPSHOT:
- [ ] Element with class "shout-backdrop" exists
- [ ] Element with class "shout-card" exists
- [ ] Element with class "animate-shake" exists
- [ ] img element with src containing "shouting" exists
- [ ] Button with dismiss functionality exists
- [ ] role="alertdialog" attribute present
- [ ] aria-modal="true" present
```

#### A3.4 Responsive Check

| Test ID | Viewport | MCP Commands | Human Verifies |
|---------|----------|--------------|----------------|
| A3.4.1 | 1920x1080 | `resize_page({ width: 1920, height: 1080 })`, `take_screenshot()` | SHOUT fills screen |
| A3.4.2 | 1280x720 | `resize_page({ width: 1280, height: 720 })`, `take_screenshot()` | SHOUT readable |

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

## Category B: Human/Workshop Tests (~100 tests)

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

### B2. Judge Experience Tests (15 tests) - RESTORED

> **Time:** 2 hours
> **Purpose:** Test if NON-MAKERS understand what happened
> **Participants:** 3-5 people who are NOT familiar with the project

This is the most important validation. If judges don't understand THE SHOUT, we lose.

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

#### B4.2 Audio Interrupt Priority (NEW - from critic)

| Test ID | Scenario | Expected | Latency |
|---------|----------|----------|---------|
| B4.2.1 | Danger while Sir Reginald speaking | SHOUT INTERRUPTS within 100ms | < 100ms |
| B4.2.2 | Multiple rapid alerts | Latest takes priority | < 200ms |
| B4.2.3 | SHOUT during observation | Cuts observation short | Immediate |

**THIS IS CRITICAL.** The positioning document says THE SHOUT interrupts. If it doesn't, we've misrepresented the product.

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

### B5. Demo Rehearsals (20 tests) - EXPANDED TO 8 HOURS

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

### B6. Recording Tests (15 tests) - OBS Validation Added

> **Time:** 1.5 hours
> **Purpose:** Ensure recording quality BEFORE demo day

#### B6.1 OBS Setup Validation (NEW - from critic)

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

### B7. Emergency Recovery Protocol (5 tests) - NEW

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
| B7.3.1 | Disconnect network for 5s | Auto-reconnect? | Target: < 10s |
| B7.3.2 | SHOUT not triggering (3 tries) | Follow protocol | Target: < 30s |
| B7.3.3 | Refresh mid-session | Session resumption | Target: < 15s |
| B7.3.4 | OBS crash | Restart, resume | Target: < 60s |
| B7.3.5 | Wrong API key | Switch to backup | Target: < 60s |

---

### B8. API Stress Tests (10 tests) - NEW

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

## Test Execution Order

### Phase 1: Pre-Demo Foundation (Day -3)

| Time | Tests | Purpose |
|------|-------|---------|
| 30 min | A4 Build Verification | App runs |
| 10 min | A1 Unit Tests | Parsing works |
| 15 min | A2 Component Tests | SHOUT component works |
| 15 min | A3 Chrome MCP Visuals | Capture screenshots |
| 30 min | B6.1 OBS Validation | Recording setup correct |

**Checkpoint:** Build passes, SHOUT renders, OBS configured

### Phase 2: Integration Testing (Day -2)

| Time | Tests | Purpose |
|------|-------|---------|
| 2 hr | B1 SHOUT Reliability | 20 trials |
| 1 hr | B3 Safety Scenarios | 5 scenarios work |
| 45 min | B4 Audio Tests | Sound is clear |
| 30 min | B7 Emergency Protocol | Know recovery paths |

**Checkpoint:** 90%+ SHOUT reliability, audio works, protocols known

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
| Audio interrupts | SHOUT cuts speech within 100ms | [ ] |
| Relief state | Shows after dismiss | [ ] |
| Judge comprehension | 3/3 viewers understand SHOUT | [ ] |
| OBS recording | 1080p60, good audio sync | [ ] |
| Full demo run | At least 3 perfect takes | [ ] |

### CRITICAL FAILURES (Block Demo)

ANY of these = DO NOT SUBMIT VIDEO:

1. THE SHOUT fails > 2/20 times
2. THE SHOUT shows emoji instead of shouting image
3. Audio does not play at all
4. SHOUT does NOT interrupt ongoing speech
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

---

## Risk Matrix (Updated)

| Risk | Probability | Impact | Mitigation | Test Coverage |
|------|-------------|--------|------------|---------------|
| THE SHOUT doesn't trigger | Medium | CRITICAL | 20 reliability trials, multiple takes | B1 |
| Shouting image doesn't load | Low | HIGH | Priority loading, A3 verification | A3 |
| Audio fails | Medium | HIGH | B4 tests, audio context init | B4 |
| Audio doesn't interrupt | Medium | HIGH | B4.2 interrupt tests | B4.2 |
| API connection unstable | Medium | HIGH | B7 emergency protocol | B7 |
| Rate limited | Medium | HIGH | B8 stress tests, backup key | B8 |
| Memory leak | Medium | MEDIUM | B8.2 30-min test | B8.2 |
| OBS recording bad | Low | CRITICAL | B6.1 validation first | B6.1 |
| Judges don't understand | Medium | CRITICAL | B2 judge experience tests | B2 |
| Cold start unreliable | Low | MEDIUM | B1.2.1 cold start test | B1.2 |

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
# Have backup ready
GEMINI_API_KEY_BACKUP=backup_key_here
```

### Test Data
- User name: "Marcus" (consistent across all tests)
- Controlled hand motions for reliability
- Same lighting setup for all takes

---

## Appendix B: Manual Test Checklist (Printable)

```
THE SHOUT MANUAL TEST CHECKLIST v6
Date: ____________
Tester: ____________

PRE-TEST SETUP
[ ] Camera working
[ ] Microphone working
[ ] Speakers on (not muted)
[ ] API key configured
[ ] Dev server running
[ ] OBS configured (1080p60, audio sources)
[ ] Backup API key ready
[ ] Backup browser tab loaded

TEST EXECUTION
[ ] Onboarding complete (name: Marcus)
[ ] Camera setup complete
[ ] Connection established
[ ] Sir Reginald speaks on connect

SHOUT TEST #___
[ ] Hand motion performed
[ ] SHOUT triggered: YES / NO
[ ] Latency: ______ms (target < 400ms)
[ ] Shouting IMAGE appeared (not emoji): YES / NO
[ ] Shake animation: YES / NO
[ ] Audio played: YES / NO
[ ] Audio INTERRUPTED speech: YES / NO / N/A
[ ] Countdown visible: YES / NO
[ ] Dismiss worked: YES / NO
[ ] Relief state appeared: YES / NO
[ ] Near-miss counter updated: YES / NO

NOTES:
_________________________________
_________________________________

VERDICT: PASS / FAIL
```

---

## Appendix C: Time Allocation Summary

| Category | v5 Time | v6 Time | Change |
|----------|---------|---------|--------|
| Automated Tests | 4.5h | 0.75h | -83% |
| Human/Workshop Tests | 6h | 8.5h | +42% |
| Demo Rehearsals | 1.5h | 8h | +433% |
| Judge Experience | 0h | 2h | NEW |
| OBS Validation | 0h | 0.5h | NEW |
| Emergency Protocol | 0h | 0.5h | NEW |
| API Stress Tests | 0h | 1h | NEW |
| **TOTAL** | 12h | 21.25h | +77% |

The extra time is focused entirely on what judges will see.

---

*"Judges don't run Jest. They watch a 2-minute video. Test accordingly."*

*-- Tester Agent v6, January 2026*

---

**Test Plan Status: READY FOR EXECUTION**
**Critic Issues Addressed: 6/6**
