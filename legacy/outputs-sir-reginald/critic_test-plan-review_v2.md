# Test Plan v4 Critique: Will This Win $50K?

**Critic:** Fresh Subagent - Test Plan Specialist
**Date:** January 19, 2026
**Document Reviewed:** `outputs/tester_test-plan_v4.md`
**Context:** Video-only hackathon submission, 16,603 competitors, $50K grand prize
**Version:** 2.0 (Complete Rewrite)

---

## THE CORE QUESTION

**"Will this test plan lead to a winning demo video?"**

**Short Answer:** It's close. Really fucking close. But there are gaps that could cost you the $50K.

---

## Executive Summary

**Score: 7.5/10**
**Verdict: CONDITIONAL PASS - CRITICAL GAPS REMAIN**

v4 is a MASSIVE improvement. The philosophy shift from "test every function" (v3: 237 tests) to "test every moment judges will see" (v4: ~50 tests) shows someone finally understood the assignment. The 8 hours of demo rehearsal, the SHOUT Reliability Protocol, the Judge Experience Tests - this is thinking like a filmmaker, not a software engineer.

But you're still leaving money on the table. Let me answer the specific questions you asked, then tear into what's wrong.

---

## Answering Your Specific Questions

### 1. Is this plan testing THE RIGHT THINGS for a video-only submission?

**Answer: 85% yes, 15% no.**

**What's Right:**
- SHOUT Reliability Protocol (2h) - THE money moment
- Judge Experience Tests (2h) - Testing the VIEWING experience
- Demo Rehearsal (8h) - This is where wins come from
- Pre-Recording Checklist - Production-quality thinking

**What's Missing:**
- **No OBS/Recording validation** - You test the app works, but not that OBS captures it correctly
- **No audio overlap testing** - What if Sir Reginald is talking when danger appears? Does THE SHOUT interrupt or queue?
- **No disaster recovery protocol** - What's the plan when (not if) something breaks during recording?

### 2. Is THE SHOUT reliability protocol sufficient for the "money moment"?

**Answer: 80% sufficient.**

**What's Good:**
- 20 trials at 90% threshold - statistically meaningful
- 5 quality metrics (tag parsing, name extraction, latency, audio clarity, visual overlay) - covers key failure modes
- Phrasing variety log for persona consistency - smart

**What's Missing:**
- **No audio interrupt priority testing** - If Sir Reginald is mid-sentence, does THE SHOUT cut him off immediately or queue behind?
- **No latency degradation analysis** - What happens at 600ms? 800ms? When does "proactive" feel "reactive"?
- **Cold start buried in Section 9** - Should be in SHOUT protocol, not rehearsal
- **No "chaos" scenarios** - What if Gemini refuses? What if it halluccinates a different warning?

**Critical Gap:** The SHOUT might TRIGGER reliably but still FAIL the demo if it doesn't INTERRUPT ongoing audio immediately. Test this.

### 3. Are the "Judge Experience Tests" actually going to predict judge reactions?

**Answer: Partially.**

**What's Good:**
- JE-1 (Muted Viewing) - Brilliant. Judges absolutely watch on mute while scrolling.
- JE-2 (Non-Maker Comprehension) - Catches the maker bubble
- JE-4 (Voice Verification) - Persona is critical to differentiation

**What's Broken:**
- **Sample size is pathetic** - 3 people? You're betting $50K on the opinions of 3 people?
- **No "brutally honest" requirement** - Are these 3 friends who'll be polite? You need at least one asshole.
- **No emotional response measurement** - JE-3 says "Target: Gasp, lean forward" but how do you MEASURE this?
- **Testing happens Day 2** - If these fail, you've wasted Day 1 on technical tests that don't matter

**Fix:** 5-7 testers minimum. Move to Day 1. Include at least one person who will tell you your baby is ugly.

### 4. Is 22 hours of testing time well-allocated or wasted?

**Answer: 80% well-allocated, 20% questionable.**

**Well-Allocated (18 hours):**
| Phase | Hours | Why It's Valuable |
|-------|-------|-------------------|
| Demo Rehearsal | 8.0 | This IS the video production |
| SHOUT Reliability | 2.0 | Money moment de-risking |
| Judge Experience | 2.0 | Audience validation |
| Safety E2E | 2.0 | Demo-critical features |
| True E2E Latency | 1.0 | Backs up marketing claims |
| Integration Smoke | 1.0 | Basic sanity |
| Pre-Recording | 0.5 | Prevents stupid mistakes |
| Environment Setup | 0.5 | Necessary |

**Questionable (4 hours):**
| Phase | Hours | Issue |
|-------|-------|-------|
| Unit Tests | 0.5 | Run once in 5 min, not 30 min |
| Documentation E2E | 1.0 | Is doc generation even in demo? Cut to 0.5h |
| Edge Cases | 1.0 | "Poor lighting"? Use good lighting. Cut to 0.5h |

**Missing (Add 2-3 hours):**
- OBS Full Recording Test: 0.5h
- Audio Interrupt Testing: 0.5h
- Failure Recovery Testing: 1.0h
- Gemini Chaos Testing: 0.5h

**Net:** Cut 1.5h of low-value tests, add 2.5h of high-value tests. Total: 23 hours. Worth it.

### 5. Will this plan catch demo-breaking bugs BEFORE recording?

**Answer: Probably the obvious ones. Probably not the subtle ones.**

**Bugs This Plan WILL Catch:**
- THE SHOUT not triggering (SH-1)
- SHOUT audio garbled (SH-4)
- Latency too slow (P-TRUE-1)
- Judges confused (JE-2)
- Connection failing (IG-1)
- Camera not working (IV-3)

**Bugs This Plan WON'T Catch:**
- Audio desync where THE SHOUT queues instead of interrupts
- Memory leak causing lag after 30 minutes of rehearsal
- OBS capturing at wrong resolution/framerate
- Gemini breaking character mid-session
- Network disconnect recovery behavior
- State corruption from rapid session start/stop

**The Dangerous Assumption:** The plan assumes "if it works technically, the demo will be good." But demo bugs are DIFFERENT from code bugs. A technically working app can still produce a shitty video.

### 6. Is there too much "software testing" and not enough "demo validation"?

**Answer: No, v4 fixed this. But...**

v3 had 17.5h testing with 3h demo rehearsal (17% demo focus).
v4 has 22h testing with 8h demo rehearsal (36% demo focus).

The ratio is now appropriate. The addition of Judge Experience Tests and SHOUT Reliability Protocol means you're testing the EXPERIENCE, not just the CODE.

**But:** There's still no script. No shot list. No timing breakdown. "Demo rehearsal" without a script is just fucking around with a camera. Create a detailed demo script before Day 3 starts.

### 7. What's missing that could cause a demo disaster?

**Critical Gaps:**

| Disaster Scenario | What's Missing | Impact |
|-------------------|----------------|--------|
| **OBS records at 480p** | No recording validation test | Submission rejected or looks amateur |
| **THE SHOUT queues behind speech** | No audio interrupt test | Core value prop undermined |
| **Gemini disconnects mid-take** | No failure recovery protocol | Wasted takes, panic |
| **Memory leak after 30min** | No long-session stability test | Rehearsal slowdown, missed takes |
| **Sir Reginald breaks character** | No persona degradation test | Demo feels inconsistent |
| **Rate limit locks you out** | No rate limit identification | Locked out during prime recording time |

**The One That Scares Me Most:** No OBS validation. You could nail 50 takes and discover they're all unusable because OBS settings were wrong. Record a full mock demo on Day 1 and verify it's submission-ready.

### 8. Does this plan account for AI-generated code quirks?

**Answer: No. Not at all.**

The brief explicitly mentions "All code is written by Claude Code agents." AI-generated code has predictable failure patterns:

1. **Memory leaks in hooks** - Claude loves `useEffect` without cleanup
2. **Race conditions in async code** - Optimistic state updates that don't resolve
3. **State synchronization bugs** - Multiple sources of truth that drift
4. **Error boundaries that don't catch** - Try/catch in wrong places
5. **TypeScript `any` hiding runtime bugs** - Compiles fine, crashes at runtime

**None of these are tested.** The 5 unit tests remaining are basic function tests, not AI code smell tests.

**Fix:** Add 1 hour of AI code smell testing:
```
| Test ID | AI Code Smell | Test Method |
|---------|---------------|-------------|
| AI-1 | Memory leak | Run 10min session, check memory growth |
| AI-2 | State desync | Rapidly start/stop sessions |
| AI-3 | Race condition | Trigger SHOUT during frame send |
| AI-4 | Unhandled rejection | Open console, check for red errors |
```

This is NON-NEGOTIABLE for a 100% AI-generated codebase.

---

## The Brutal Truth: What's Actually Wrong

### Problem 1: No Disaster Recovery Protocol

You will experience failures during 8 hours of rehearsal and recording. The question isn't IF, it's WHEN.

What's your plan when:
- Gemini API goes down for 10 minutes?
- OBS crashes and you lose 20 minutes of footage?
- THE SHOUT stops working after working perfectly 50 times?
- You hit rate limits?

**The plan has no answers.** This isn't paranoia - this is professional video production.

**Add This:**
```
### Emergency Protocols

| Scenario | Detection | Response |
|----------|-----------|----------|
| Gemini API down | Error screen | Wait 5 min, retry, use backup API key |
| OBS crash | Recording stops | Check last save, restart, resume |
| Rate limit (429) | Console errors | Switch to backup Gemini project |
| SHOUT stops working | 3 consecutive failures | Fresh session, check prompt config |
| Audio desync | Voice doesn't match action | Re-record section with manual timing |
```

### Problem 2: Judge Experience Tests Are Too Late and Too Small

Testing with 3 people on Day 2 is ass-backwards.

**Why It's Wrong:**
1. If 3 people don't understand, you need to change your demo script
2. But demo rehearsal starts Day 3
3. You've wasted Day 1-2 on technical tests that are now moot
4. 3 people is a tiny sample - statistical noise

**Fix:**
- Move Judge Experience Tests to Day 1, BEFORE technical testing
- Increase to 5-7 people
- Include at least one person who you KNOW will be brutally honest
- Include someone who's never seen a hackathon project

### Problem 3: No Demo Script Referenced

Section 9 (Demo Rehearsal) says "Full Run-Throughs" but references no script.

**What's the opening line?**
**What happens at 0:15? 0:45? 1:30?**
**What are the exact actions in sequence?**

Without a script, "rehearsal" is just playing with the app. Professional demos have:
- Shot list with timestamps
- Exact verbal cues
- Specific actions at specific moments
- Contingency for when things go wrong

**Fix:** Reference or create a demo script. Add timing breakdown:
```
### Demo Timing Targets
| Section | Start | End | Key Moment |
|---------|-------|-----|------------|
| Intro + Name Entry | 0:00 | 0:15 | "Ah, Alex! Welcome..." |
| Camera Setup | 0:15 | 0:30 | Guided positioning |
| THE SHOUT | 0:45 | 1:00 | Hand near blade |
| Safety Compliance | 1:00 | 1:30 | Glasses warning + fix |
| Documentation | 1:30 | 2:00 | Timeline, insights |
| Verdict + Outro | 2:00 | 2:30 | "Capital session!" |
```

### Problem 4: SHOUT Latency Target is Too Generous

P95 < 500ms is half a second. The product spec claims 340ms. The positioning says "before, not after."

500ms is enough time for a hand to move 3-4 inches toward a blade. A judge will notice that the "proactive" warning is actually reactive.

**Fix:**
- Tighten to P95 < 400ms
- Add perceptual test: "At what latency does THE SHOUT feel late?"
- If you can't hit 400ms consistently, adjust marketing claims

### Problem 5: No Audio Interrupt Testing

THE SHOUT's entire value is that it INTERRUPTS danger before it happens. But what if Sir Reginald is mid-sentence when danger appears?

Possibilities:
1. SHOUT interrupts immediately (GOOD)
2. SHOUT queues behind current speech (BAD - defeats the purpose)
3. Audio overlaps creating garbage (VERY BAD)

**This is untested.** And it's a CORE value prop.

**Fix:** Add audio interrupt test:
```
| Test ID | Scenario | Pass Criteria |
|---------|----------|---------------|
| AI-INT-1 | Trigger danger during long observation | SHOUT cuts in < 100ms |
| AI-INT-2 | Audio cleanup | No overlapping garbled audio |
```

---

## Time Reallocation Recommendation

### Current vs Recommended

| Phase | Current | Recommended | Change |
|-------|---------|-------------|--------|
| Unit Tests | 0.5h | 0.25h | -0.25h (just run npm test) |
| Integration Smoke | 1.0h | 1.0h | - |
| SHOUT Reliability | 2.0h | 2.0h | - |
| True E2E Latency | 1.0h | 1.0h | - |
| Safety E2E | 2.0h | 2.0h | - |
| Documentation E2E | 1.0h | 0.5h | -0.5h |
| Edge Cases | 1.0h | 0.5h | -0.5h |
| Judge Experience | 2.0h | 2.5h | +0.5h (more people, Day 1) |
| Demo Rehearsal | 8.0h | 8.0h | - |
| Pre-Recording | 0.5h | 0.5h | - |
| **NEW: AI Code Smell** | 0 | 1.0h | +1.0h |
| **NEW: Audio Interrupt** | 0 | 0.5h | +0.5h |
| **NEW: OBS Validation** | 0 | 0.5h | +0.5h |
| **NEW: Failure Recovery** | 0 | 0.5h | +0.5h (documentation) |
| **TOTAL** | 22.0h | 23.25h | +1.25h |

Extra 1.25 hours for a $50K prize? Fucking obvious decision.

---

## Pass/Fail Criteria Review

### Current Criteria (Keep)
- SHOUT reliability 90%+ (18/20)
- True E2E latency P95 < 500ms (tighten to 400ms)
- 3/3 identify voice as British (keep)
- 3+ full runs rated 8+/10 (keep)

### Current Criteria (Modify)
- 3/3 non-makers understand -> **5/5 non-makers understand**

### Missing Criteria (Add)
- **Audio interrupt works** - SHOUT cuts in < 100ms during speech
- **OBS recording valid** - Test recording is correct format, resolution, audio
- **No console errors** - Zero red errors during full rehearsal run
- **Failure recovery documented** - Emergency protocol tested once

---

## Final Verdict

**Will this test plan lead to a winning demo video?**

**PROBABLY.** With the gaps fixed, this is a solid plan. Without fixing them, you're taking unnecessary risks.

**What Makes This Plan Good:**
1. SHOUT Reliability Protocol - Money moment is de-risked
2. Judge Experience Tests - Testing the viewer, not just the code
3. 8h Demo Rehearsal - Appropriate time for video production
4. Philosophy shift - "Test what judges see" is exactly right

**What Could Sink You:**
1. No disaster recovery protocol - When (not if) things break
2. No audio interrupt testing - Core value prop untested
3. No OBS validation - Could record 50 unusable takes
4. No AI code smell testing - 100% AI codebase has predictable bugs
5. 3 people is too small for Judge Experience
6. No demo script referenced

**Probability Assessment:**
- P(This plan catches major bugs): 75%
- P(Demo recording goes smoothly): 65% (would be 85% with fixes)
- P(Demo is compelling): 80% (assuming SHOUT works)
- P(Win Grand Prize | Execute Plan): 12% (16K competitors)
- P(Win Grand Prize | Execute Plan + Fixes): 18%
- P(Top 10 | Execute Plan + Fixes): 45%
- P(Win Something | Execute Plan + Fixes): 65%

**Bottom Line:** Fix the 6 gaps I identified. Spend the extra 1.25 hours. Don't gamble $50K on gaps that are easy to close.

---

## Quick Action Checklist

### Must Fix Before Testing Starts
- [ ] Create/reference demo script with timing
- [ ] Move Judge Experience Tests to Day 1
- [ ] Increase non-maker sample to 5-7
- [ ] Add audio interrupt test
- [ ] Add OBS full recording validation
- [ ] Add AI code smell tests
- [ ] Create emergency protocols document
- [ ] Tighten latency target to P95 < 400ms

### Must Fix Before Recording
- [ ] Test OBS settings produce submission-quality video
- [ ] Verify SHOUT interrupts ongoing speech
- [ ] Run 10-minute session and check memory
- [ ] Identify rate limit threshold
- [ ] Prepare backup API key / Gemini project

---

**Score: 7.5/10**

Fix the gaps, and this becomes a 9/10 plan. Don't fix them, and you're hoping nothing goes wrong during the most important 2 minutes of your hackathon journey.

Hope is not a strategy. Fix the damn gaps.

---

*"A test plan that only tests the happy path is a plan that hopes for luck. Winners make their own luck by testing the unhappy paths too."*
*-- Critic Agent*
