# Critic Review: Test Plan v6 (Revision)

## Overall Score: 8.5/10 (up from 6.5/10)

This is a SIGNIFICANT improvement. v6 fundamentally changed its philosophy from "test every function" to "test every moment judges will see." That single shift corrects the core mistake of v5. The plan is now demo-centric, prioritizes rehearsal time, and addresses nearly all critical issues from the v3 review.

---

## Issues Fixed

### 1. Judge Experience Tests RESTORED (Critical - FIXED)
**v3 Complaint:** "Judge Experience Tests Were Removed"
**v6 Fix:** Section B2 restores 15 Judge Experience tests with 2 hours allocated. The protocol is excellent - blind viewing, specific questions (JE-1 through JE-10), clear pass criteria (3/3 viewers must understand SHOUT), and explicit STOP instruction if JE-1 fails.

**Verdict:** Fully addressed.

### 2. Demo Rehearsal Time RESTORED (Critical - FIXED)
**v3 Complaint:** "Demo Rehearsal Time Slashed to 1.5 Hours"
**v6 Fix:** Expanded to 8 HOURS minimum with 10 full run-throughs. Table for tracking attempts, comprehensive checklist per run-through, timing script validation (B5.2), and recovery practice (B5.3).

**Verdict:** Exceeded expectations. 8 hours is more than v3 recommended (4h).

### 3. Audio Interrupt Priority Testing ADDED (Critical - FIXED)
**v3 Complaint:** "No Audio Interrupt Priority Testing"
**v6 Fix:** Section B4.2 explicitly tests audio interrupt priority with 3 tests:
- B4.2.1: SHOUT INTERRUPTS within 100ms
- B4.2.2: Latest alert takes priority
- B4.2.3: SHOUT cuts observation short

The plan even includes a bold note: "THIS IS CRITICAL."

**Verdict:** Fully addressed.

### 4. OBS Recording Quality Validation ADDED (Critical - FIXED)
**v3 Complaint:** "No OBS Recording Quality Validation"
**v6 Fix:** Section B6.1 is entirely new, covering:
- Resolution (1920x1080)
- Frame rate (60fps)
- Bitrate (6000kbps+)
- Encoder (x264/NVENC)
- Audio bitrate (192kbps+)
- Export format validation
- Playback verification on multiple devices

**Verdict:** Fully addressed and comprehensive.

### 5. Emergency Recovery Protocol ADDED (Critical - FIXED)
**v3 Complaint:** "Emergency Recovery Protocol Missing"
**v6 Fix:** Section B7 adds full emergency protocols for:
- Gemini disconnects (check status, refresh, backup API key, pre-recorded footage)
- SHOUT failure (exaggerate motion, retry, console check, restart)
- Audio breaks (mute check, audio context, refresh, backup speakers)
- App crashes (backup browser tab ready)
- Rate limits (backup API key, wait, reduce frame rate)

Plus 5 protocol tests (B7.2.1-5).

**Verdict:** Fully addressed.

### 6. Rate Limit Testing ADDED (Critical - FIXED)
**v3 Complaint:** "Rate Limit Unknown"
**v6 Fix:** Section B8 adds API Stress Tests including:
- B8.1: Rate limit discovery at 10/30/60 minute intervals
- Explicit instruction: "If rate limited: Note the threshold. Plan breaks during testing."
- Memory leak testing (B8.2)
- Long session stability (B8.3)

Appendix A also includes backup API key configuration.

**Verdict:** Fully addressed.

---

## Issues Remaining

### 1. Chrome MCP Tests Are Still Hybrid Manual-Automated
**v3 Complaint:** "Manual verification disguised as automation"
**v6 Status:** Section A3 improved but still has ambiguity. Tests like A3.1 say "VERIFY (HUMAN): Red backdrop fills entire viewport" which is correct labeling, but the test is classified under "Automated Tests."

The time allocation table (Appendix C) correctly shows this as only 0.75h, so it's not wasting significant time, but the categorization is still misleading.

**Impact:** LOW - Time is appropriate now, just mislabeled.

### 2. No Gemini "Chaos" Testing
**v3 Complaint:** "What if Gemini refuses to trigger THE SHOUT? What if it hallucinates a different warning?"
**v6 Status:** Not explicitly addressed. The emergency protocol covers SHOUT not triggering but doesn't test what happens if Gemini produces unexpected output (different warning, broken format, refusal).

**Impact:** MEDIUM - Could catch an edge case during recording.

### 3. Cold Start Reliability Partially Addressed
**v3 Complaint:** "First SHOUT in a fresh session might behave differently"
**v6 Status:** B1.2.1 tests "Cold Start SHOUT" which is good. However, the threshold is "Triggers within 3s of connection" - that's not comparing cold start reliability to warm session reliability, just verifying it works at all.

**Impact:** LOW - Basic case covered, statistical comparison missing but not critical.

---

## New Issues Found

### 1. Test Count Mismatch
**Issue:** Executive summary says "~125 tests" but actual count:
- A1: 5 tests
- A2: 5 tests
- A3: 10 tests
- A4: 5 tests
- B1: 25 tests
- B2: 15 tests
- B3: 15 tests
- B4: 15 tests
- B5: 20 tests
- B6: 15 tests
- B7: 5 tests
- B8: 10 tests

**Actual total:** ~145 tests

Not a functional issue, just sloppy math. Executive summary says ~125.

**Impact:** NONE - Just cosmetic.

### 2. Time Budget Exceeds Reasonable Schedule
**Issue:** Appendix C shows total time of 21.25 hours. That's nearly 3 full work days. The execution order shows 4 phases across Days -3 to 0, but:
- Day -3: 1.5h
- Day -2: 4.25h
- Day -1: 3h
- Day 0: 9.5h

Day 0 alone has 9.5 hours of testing plus recording. That's a brutal schedule.

**Impact:** MEDIUM - Realistic but exhausting. Need to ensure tester stamina.

### 3. SHOUT Interrupt Test Latency Target May Be Too Aggressive
**Issue:** B4.2.1 requires SHOUT to interrupt speech within 100ms. That's extremely fast for:
1. Gemini to process the danger
2. Cancel current TTS
3. Start new SHOUT TTS

If Gemini's processing alone takes 200-400ms (which is normal), 100ms interrupt is impossible. The positioning document says "interrupts" but doesn't specify latency.

**Impact:** MEDIUM - Test may fail not because of a bug, but because of unrealistic target. Consider 500ms or "before user finishes dangerous motion."

### 4. No Backup Take Strategy
**Issue:** B5.3 covers recovery practice but doesn't address: what if you CAN'T recover?

Example: You get the perfect SHOUT take on attempt 7, then Gemini goes down. Do you submit the imperfect take 7? Where's the decision framework for "good enough"?

**Impact:** LOW - Implicit in "10 attempts minimum" but could be explicit.

### 5. Judge Experience Viewer Recruitment Not Addressed
**Issue:** B2 says "3-5 people who are NOT familiar with the project" but doesn't say:
- Where to find them
- When to recruit
- What if you can't find 3?

For a hackathon with a deadline, viewer availability could be a blocker.

**Impact:** LOW - Practical concern but solvable.

---

## Score Breakdown

### 1. Completeness: 8/10 (up from 5/10)
- All 6 critical gaps from v3 addressed
- Safety scenarios covered
- Audio testing comprehensive
- Emergency protocols added
- Minor gaps: Gemini chaos testing, viewer recruitment

### 2. Practicality: 8/10 (up from 6/10)
- Time allocations realistic for each phase
- Automated tests cut from 4.5h to 0.75h (83% reduction)
- Manual tests practical and executable
- 21h total is ambitious but achievable over 4 days
- Minor concern: Day 0 schedule is intense

### 3. Demo Focus: 9/10 (up from 4/10)
- Philosophy explicitly changed: "Test every moment judges will see"
- 8 hours demo rehearsal (was 1.5h)
- Judge Experience tests restored with clear protocols
- Every test now answers: "Will this affect what judges see?"
- Recording validation comprehensive
- Near perfect demo-centric approach

### 4. Automation Strategy: 8/10 (up from 5/10)
- Automated tests appropriately minimal (25 tests, 45 min)
- Human tests prioritized for judgment calls
- Chrome MCP used for evidence capture, not quality judgment
- Clear distinction between what automation CAN and CANNOT verify
- Minor issue: A3 still labeled "automated" but requires human review

### 5. Risk Mitigation: 9/10 (up from 4/10)
- Risk matrix updated with test coverage column
- Emergency protocols documented AND tested
- Rate limit discovery added
- Memory leak testing added
- Critical failures list expanded (audio interrupt, OBS recording)
- Backup API key mentioned in Appendix A
- Minor gap: No Gemini refusal/hallucination testing

### 6. Chrome MCP Utilization: 8/10 (up from 5/10)
- A3 now correctly uses MCP for screenshot capture
- DOM state verification explicit (class checks, attribute checks)
- Human verification clearly labeled as human
- Responsive checks practical
- Time allocation reasonable (15 min)
- Minor issue: Still categorized under "Automated" tests

---

## Verdict

**BUILD**

Test Plan v6 demonstrates a fundamental understanding of what matters for this hackathon. The philosophy shift from "test every function" to "test every moment judges will see" shows maturity. The team addressed ALL 6 critical issues from v3 review:

1. Judge Experience Tests restored with rigorous protocol
2. Demo rehearsal expanded to 8 hours
3. Audio interrupt testing added with specific latency targets
4. OBS validation comprehensive
5. Emergency recovery protocols documented and testable
6. Rate limit discovery included

The plan is now appropriately demo-centric. Time allocation:
- 0.75h automated (4%)
- 8.5h workshop/integration (40%)
- 8h demo rehearsal (38%)
- 4h recording/OBS/stress (19%)

That 38% demo rehearsal allocation is exactly right for a video competition.

**Remaining concerns are minor:**
- 100ms interrupt target may be unrealistic
- Chrome MCP labeling is misleading but time-appropriate
- No Gemini chaos testing
- 21h is a lot but spread across 4 days

None of these are show-stoppers. Execute this plan.

---

## What Would Make This 10/10?

1. **Relabel A3 as "Human-Assisted Visual Verification"** - Just be honest about what it is.

2. **Add Gemini chaos testing (30 min)** - What if Gemini:
   - Returns warning without proper shout tag?
   - Refuses to generate SHOUT (content policy)?
   - Returns truncated response?

3. **Adjust audio interrupt target** - 100ms is probably unrealistic. Change to "interrupts within 500ms" or "before dangerous motion completes."

4. **Add backup take decision framework** - At what point do you accept an imperfect take? Explicit criteria.

5. **Fix test count** - Either correct "~125" to "~145" or recount.

6. **Add viewer recruitment checklist** - Where to find 3-5 non-makers with short notice.

7. **Cold start statistical comparison** - Compare first SHOUT latency vs nth SHOUT latency, not just pass/fail.

These are polish items. The core plan is solid.

---

## Comparison Summary

| Metric | v5 | v6 | Change |
|--------|-----|-----|--------|
| Overall Score | 6.5/10 | 8.5/10 | +2.0 |
| Total Tests | 247 | ~145 | -41% |
| Automated Time | 4.5h | 0.75h | -83% |
| Demo Rehearsal | 1.5h | 8h | +433% |
| Judge Experience | 0h | 2h | +2h |
| OBS Validation | 0h | 0.5h | +0.5h |
| Emergency Protocol | 0h | 0.5h | +0.5h |
| API Stress Testing | 0h | 1h | +1h |
| Philosophy | "Test every function" | "Test every moment judges will see" | Correct shift |

---

*"v6 understands that this is a VIDEO COMPETITION, not a software QA exercise. The 8 hours of demo rehearsal says everything about where priorities belong. Execute this plan."*

*-- Critic Agent, January 2026*

---

**Document:** Test Plan v6
**Previous Version Score:** 6.5/10 (v5)
**Current Version Score:** 8.5/10 (v6)
**Improvement Severity:** SIGNIFICANT - All critical issues addressed
**Action Required:** Proceed with execution
