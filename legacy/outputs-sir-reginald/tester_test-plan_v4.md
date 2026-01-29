# Sir Reginald Makesworth III - Demo Validation Plan v4

**Version:** 4.0
**Date:** January 19, 2026
**Tester:** Testing Agent
**Target:** Video-Only Hackathon Submission
**Philosophy:** Test the DEMO, not the code

---

## Executive Summary

**KEY INSIGHT FROM CRITIC:** "The test plan treats Sir Reginald as software being shipped. But for a hackathon with video-only submission, Sir Reginald is a DEMO being filmed."

This revised plan prioritizes:
1. **Demo rehearsal** (8 hours) over unit testing (30 min)
2. **THE SHOUT reliability** as the make-or-break moment
3. **Judge experience validation** - will non-makers understand and be impressed?
4. **True E2E latency measurement** to back up marketing claims

**Changes from v3:**
- Cut unit test time 66% (1.5h → 0.5h)
- Added SHOUT Reliability Protocol (+2h)
- Added Judge Experience Tests (+2h)
- Added True E2E Latency Tests (+1h)
- Expanded Demo Rehearsal 167% (3h → 8h)
- All tests marked as [AUTOMATED] or [MANUAL]
- Added Pre-Recording Checklist

---

## Test Environment

| Item | Requirement |
|------|-------------|
| **URL** | http://localhost:3000 |
| **Browser** | Chrome (latest) - required for Gemini Live |
| **Node.js** | v18+ |
| **API Key** | Valid GEMINI_API_KEY in `.env.local` |
| **Camera** | Webcam with 640x480 minimum resolution |
| **Microphone** | Any functional microphone |
| **Speakers** | External speakers (workshop simulation) |
| **Ambient Noise** | Test at 60dB ambient (use phone app to verify) |
| **Recording** | OBS Studio configured for 1080p 30fps |
| **Lighting** | Front-facing soft light, no harsh shadows |

---

## 1. Automated Unit Tests [AUTOMATED - Jest]

**Time Allocation:** 30 minutes (setup + run)
**Command:** `npm test`

Only CRITICAL tests that prevent demo failures:

| Test ID | Function | Test Case | Priority |
|---------|----------|-----------|----------|
| UP-1 | `parseShoutTag` | Valid shout tag with scenario | CRITICAL |
| UP-13 | `extractScenarioFromWarning` | "hand near blade" → 'hand_near_blade' | CRITICAL |
| UP-14 | `extractScenarioFromWarning` | "safety spectacles" → 'missing_glasses' | CRITICAL |
| UI-1 | `INJURY_STATISTICS` | All 5 scenarios defined | CRITICAL |
| UL-1-4 | `getLatencyLevel` | All 4 levels return correct | HIGH |

**Jest Setup Required:**
```bash
npm install --save-dev jest @types/jest ts-jest
```

**Pre-Recording Check:** Run `npm test`, all must pass before any recording attempt.

---

## 2. Integration Smoke Tests [MANUAL - 1 hour]

Quick validation that systems connect:

| Test ID | Test | Pass Criteria | Priority |
|---------|------|---------------|----------|
| IG-1 | Gemini Live connects | Status = 'connected' within 10s | CRITICAL |
| IG-2 | Audio plays | Sound audible on test phrase | CRITICAL |
| IV-3 | Video captures at 1 FPS | Console shows frame count | CRITICAL |
| IG-13 | Proactive audio config | Inspect payload shows `proactiveAudio: true` | CRITICAL |

**If any CRITICAL fails:** Stop. Debug. Do not proceed to demo rehearsal.

---

## 3. THE SHOUT Reliability Protocol [MANUAL - 2 hours]

**This is the money moment. Get it right or lose.**

### Phase 1: Raw Trigger Rate (20 trials)

| Trial | Action | Expected | Actual (Pass/Fail) |
|-------|--------|----------|-------------------|
| 1-20 | Move hand toward blade | `<shout>` tag in response | ___/20 |

**Pass Criteria:** 18/20 (90%)
**If Fail:** Fix prompt or parsing BEFORE continuing

### Phase 2: Quality Validation (20 trials)

| Metric | Trials | Pass Criteria | Actual |
|--------|--------|---------------|--------|
| SH-1: Structured `<shout>` tag | 20 | 20/20 use tag format | ___/20 |
| SH-2: Name correctly extracted | 20 | 20/20 correct name | ___/20 |
| SH-3: Latency under 500ms | 20 | 19/20 under 500ms | ___/20 |
| SH-4: Audio clarity | 20 | Subjective 20/20 clear | ___/20 |
| SH-5: Red overlay appears | 20 | 20/20 visible | ___/20 |

### Phase 3: Phrasing Variety Log

Document actual Gemini responses to verify persona:

| Trial | Gemini's Exact Phrase | British? (Y/N) |
|-------|----------------------|----------------|
| 1 | | |
| 2 | | |
| ... | | |

**Target:** 90%+ British phrasing ("I say!", "Do be careful!", etc.)

---

## 4. True E2E Latency Measurement [MANUAL - 1 hour]

**The positioning claims "340ms" - we must prove it.**

### Instrumentation Required

Add timestamps to `use-audio-player.ts`:
```typescript
onPlayStart: () => {
  const audioStart = performance.now()
  console.log(`[LATENCY] Audio start: ${audioStart - frameTimestamp}ms`)
}
```

### Measurements

| Test ID | Start Point | End Point | Target | Actual |
|---------|-------------|-----------|--------|--------|
| P-TRUE-1 | Frame sent | Audio begins | <400ms | ___ms |
| P-TRUE-2 | Frame sent | Audio ends | <1200ms | ___ms |
| P-TRUE-3 | Hand moves (visual) | Voice heard | <500ms subjective | ___ms |

Run 20 measurements, calculate P95.

**If P95 > 500ms:** Investigate network, reduce frame quality, or adjust marketing claims.

---

## 5. Judge Experience Tests [MANUAL - 2 hours]

**These tests validate the DEMO, not the code.**

### Test 1: Muted Viewing (JE-1)

Watch the demo with sound OFF.

| Element | Visible? | Action if No |
|---------|----------|--------------|
| Red SHOUT overlay | Y/N | Increase opacity |
| Shake animation | Y/N | Increase intensity |
| Name in header | Y/N | Increase font size |
| Latency indicator | Y/N | Move to more visible position |
| Cost savings number | Y/N | Increase font size |

### Test 2: Non-Maker Comprehension (JE-2)

Show demo to 3 people who are NOT makers/woodworkers.

| Question | Person 1 | Person 2 | Person 3 |
|----------|----------|----------|----------|
| "What is this product?" | | | |
| "What happened when the hand moved?" | | | |
| "Would you use this?" | | | |
| "What was memorable?" | | | |

**Pass Criteria:** All 3 understand the core concept without explanation.

### Test 3: Emotional Response (JE-3)

| Moment | Target Reaction | Actual Reaction |
|--------|-----------------|-----------------|
| THE SHOUT triggers | Gasp, lean forward | |
| Cost savings shown | "Wow, that much?" | |
| Session verdict | Nod, smile | |

### Test 4: Voice Verification (JE-4)

Play Sir Reginald audio to 3 people.

| Question | Expected | Person 1 | Person 2 | Person 3 |
|----------|----------|----------|----------|----------|
| "What accent?" | British | | | |
| "Personality?" | Butler/aristocrat | | | |

### Test 5: Demo Timing (JE-5)

| Run | Target | Actual | Notes |
|-----|--------|--------|-------|
| 1 | <2:30 | | |
| 2 | <2:30 | | |
| 3 | <2:30 | | |

---

## 6. Safety Features E2E [MANUAL - 2 hours]

Core safety scenarios - must work for demo:

| Test ID | Scenario | Pass Criteria | Priority |
|---------|----------|---------------|----------|
| S-1 | THE SHOUT (hand near blade) | Full sequence: tag parsed, overlay, audio | CRITICAL |
| S-5 | Safety glasses warning | Yellow alert, 8s dismiss | CRITICAL |
| S-3 | Compliance acknowledgment | "Splendid!" response | HIGH |
| S-8 | Alert auto-dismiss | Disappears after countdown | HIGH |
| S-16 | Near-miss counter | Increments correctly | HIGH |
| S-15 | Pattern suggestion | Appears after 3 same warnings | HIGH |

**Skip:** S-2, S-4, S-6, S-7, S-9-14, S-17-20 (not demo-critical)

---

## 7. Documentation Features E2E [MANUAL - 1 hour]

| Test ID | Feature | Pass Criteria | Priority |
|---------|---------|---------------|----------|
| D-9 | MomentTimeline | Entries appear with icons | HIGH |
| D-14 | Document generation | Markdown generated | HIGH |
| D-16 | DocumentViewer | Modal opens | HIGH |
| V-1 | Session Verdict | Modal appears | HIGH |
| V-3 | Verdict speaking | Audio plays | HIGH |

**Skip:** D-1-8, D-10-13, D-15, D-17-20, V-2, V-4-16 (not demo-critical)

---

## 8. Pre-Recording Checklist [MANUAL - 30 min]

**Run this EVERY time before recording:**

### Technical Checks
- [ ] `npm test` passes (all 5 critical unit tests)
- [ ] Gemini connection established
- [ ] Audio output working (test phrase plays)
- [ ] Camera feed visible
- [ ] Latency indicator shows green (<800ms)
- [ ] No console errors

### Demo Environment
- [ ] Room lighting adequate (no harsh shadows)
- [ ] Workshop props arranged
- [ ] "Blade" or danger prop in position
- [ ] Safety glasses nearby for compliance demo
- [ ] Background free of distractions

### Recording Setup
- [ ] OBS Studio running
- [ ] Recording to correct folder
- [ ] 1080p 30fps confirmed
- [ ] Microphone input visible in OBS
- [ ] Browser window sized correctly

### Session State
- [ ] Fresh browser tab (no cached session)
- [ ] User name entered: "Alex" (or demo name)
- [ ] Camera setup completed
- [ ] Main dashboard visible

### Personal Prep
- [ ] Script reviewed
- [ ] Water nearby
- [ ] Phone silenced
- [ ] "Do Not Disturb" on

---

## 9. Demo Rehearsal [MANUAL - 8 hours]

**This is where hackathons are won or lost.**

### Day 1: Individual Moments (4 hours)

| Moment | Target Takes | Actual Takes | Best Take # |
|--------|--------------|--------------|-------------|
| THE SHOUT | 15-20 | | |
| Safety glasses warning | 5-10 | | |
| Compliance "Splendid!" | 5-10 | | |
| Moment detection | 5-10 | | |
| Pattern suggestion | 5-10 | | |
| Session verdict | 5-10 | | |
| Document generation | 3-5 | | |

### Day 2: Full Run-Throughs (4 hours)

| Run | Duration | Issues | Rating (1-10) |
|-----|----------|--------|---------------|
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |
| 5 | | | |
| 6 | | | |
| 7 | | | |
| 8 | | | |
| 9 | | | |
| 10 | | | |

**Target:** At least 3 runs rated 8+/10

### Cold Start Verification

| Test | Result |
|------|--------|
| Fresh session → THE SHOUT works first try | Y/N |
| No warmup needed | Y/N |
| First response is British-accented | Y/N |

### Multi-Day Variance Test

| Day | Date | SHOUT Success Rate | Notes |
|-----|------|-------------------|-------|
| 1 | | ___/10 | |
| 2 | | ___/10 | |
| 3 | | ___/10 | |

**Target:** Consistent 90%+ across all days

---

## 10. Edge Cases (Reduced) [MANUAL - 1 hour]

Only demo-relevant edge cases:

| Test ID | Edge Case | Why It Matters | Pass Criteria |
|---------|-----------|----------------|---------------|
| E-1 | Poor lighting | Demo may have shadows | Sir Reginald notes it gracefully |
| E-7 | Gemini API error | Must not crash during recording | Error screen displays |
| E-11 | Malformed response | Must not crash | Logged, no crash |
| E-14 | Empty username | Demo starts with name entry | Button disabled |

**Skip:** E-2-6, E-8-10, E-12-13, E-15-18

---

## Test Execution Plan (Revised)

| Phase | Tests | Duration | Day |
|-------|-------|----------|-----|
| 1. Environment Setup | - | 30 min | 1 |
| 2. Unit Tests [AUTOMATED] | Jest | 30 min | 1 |
| 3. Integration Smoke | IG-1,2, IV-3, IG-13 | 1 hour | 1 |
| 4. SHOUT Reliability Protocol | SH-1-5 | 2 hours | 1 |
| 5. True E2E Latency | P-TRUE-1-3 | 1 hour | 1 |
| 6. Safety E2E | S-1,3,5,8,15,16 | 2 hours | 2 |
| 7. Documentation E2E | D-9,14,16, V-1,3 | 1 hour | 2 |
| 8. Edge Cases | E-1,7,11,14 | 1 hour | 2 |
| 9. Judge Experience Tests | JE-1-5 | 2 hours | 2 |
| 10. Demo Rehearsal Day 1 | Individual moments | 4 hours | 3 |
| 11. Demo Rehearsal Day 2 | Full runs | 4 hours | 4 |

**Total:** 22 hours over 4 days

---

## Pass/Fail Criteria (Revised)

### Must Pass Before Recording

- [ ] All 5 CRITICAL unit tests pass
- [ ] SHOUT reliability: 90%+ (18/20)
- [ ] True E2E latency P95 < 500ms
- [ ] 3/3 non-makers understand demo concept
- [ ] 3/3 people identify voice as British
- [ ] At least 3 full runs rated 8+/10

### Recording Go/No-Go Decision

| Metric | Target | Actual | Go? |
|--------|--------|--------|-----|
| SHOUT reliability | 90% | | |
| Non-maker comprehension | 100% | | |
| Full run quality | 8+/10 | | |
| Technical stability | No crashes | | |

**If any "No-Go":** Fix the issue. Do not record.

---

## Bug Tracking

| Bug ID | Date | Test ID | Description | Severity | Status |
|--------|------|---------|-------------|----------|--------|
| | | | | | |

### Severity Levels

| Level | Definition | Action |
|-------|------------|--------|
| **BLOCKER** | Can't record demo | Stop everything, fix |
| **CRITICAL** | Demo will look bad | Fix before recording |
| **HIGH** | Noticeable issue | Fix if time permits |
| **MEDIUM** | Minor issue | Document, maybe fix |
| **LOW** | Cosmetic | Ignore |

---

## Final Sign-Off

Before recording final demo video:

- [ ] All CRITICAL tests passing
- [ ] SHOUT reliability verified (90%+)
- [ ] Judge experience tests passed
- [ ] Pre-recording checklist complete
- [ ] 3+ quality full runs completed
- [ ] Multi-day variance acceptable

**Sign-off:**
- Tester: _________________ Date: _________
- Developer: ______________ Date: _________

---

## Test Summary (v4 vs v3)

| Category | v3 | v4 | Change |
|----------|----|----|--------|
| Unit Tests | 66 | 5 (automated) | -92% |
| Integration | 39 | 4 (smoke) | -90% |
| Safety E2E | 20 | 6 | -70% |
| Documentation | 36 | 5 | -86% |
| Edge Cases | 18 | 4 | -78% |
| **NEW: SHOUT Reliability** | 0 | 5 metrics | +100% |
| **NEW: True E2E Latency** | 0 | 3 tests | +100% |
| **NEW: Judge Experience** | 0 | 5 tests | +100% |
| Demo Rehearsal | 12 | Full protocol | +400% |
| **Total Tests** | **237** | **~50 focused** | -79% |
| **Total Time** | **17.5h** | **22h** | +26% |

**The Philosophy Shift:**
- v3: "Test every function"
- v4: "Test every moment judges will see"

---

*"One tests the things that matter, not the things that are easy to test."*
*-- Sir Reginald Testing Philosophy v4*
