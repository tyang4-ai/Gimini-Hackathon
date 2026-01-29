# Test Plan Critique: Sir Reginald v3

**Critic:** Test Plan Review Agent (Fresh Subagent)
**Date:** January 19, 2026
**Document Reviewed:** `outputs/tester_test-plan_v3.md`
**Context:** Pre-demo validation for Gemini 3 Hackathon (VIDEO-ONLY submission)

---

## Overall Assessment

**Score:** 6.5/10
**Verdict:** REVISE
**One-Line Summary:** A thorough-looking plan that prioritizes test quantity over test quality, lacks automation strategy, and dangerously underestimates demo rehearsal time while overinvesting in low-value unit tests.

---

## The Good (What's Working)

1. **Comprehensive coverage of WP-8 features.** The plan correctly includes all new documentation features (NearMissCounter, MomentTimeline, SessionVerdict, DocumentViewer, SuggestionAlert). This shows good spec alignment.

2. **Structured test IDs and priority system.** The CRITICAL/HIGH/MEDIUM/LOW priority system with clear test IDs enables focused testing and progress tracking. The 15 CRITICAL tests are correctly identified as gates.

3. **Demo-specific rehearsal section (DM-*).** The take limits (5 takes for THE SHOUT, 3 for compliance) acknowledge video-only submission reality. This is the right mindset.

4. **Edge case coverage is reasonable.** E-1 through E-18 cover visual conditions, API failures, and input validation. The "poor lighting" and "camera obstruction" tests are especially relevant for real workshop conditions.

5. **Pass/fail criteria are clear.** "90%+ THE SHOUT reliability (18/20 trials)" is specific and measurable. This is good.

---

## Critical Weaknesses (Ranked)

### 1. Massive Time Underestimate for Demo Rehearsal (FATAL)

**Problem:** The plan allocates 3 hours for demo rehearsal (DM-* tests) while allocating 17.5 hours total. For a VIDEO-ONLY submission where the video IS the product, this ratio is inverted.

**Impact:** The previous critic assessment stated: "The code can't get any better. The video can." Yet this plan spends 5.5 hours on unit tests and only 3 hours on demo rehearsal. This is how you get top 10 instead of top 3.

**Fix:**
- Invert the ratio: 8-10 hours on demo rehearsal, 4 hours on unit/integration tests
- Add "Video Production Tests" section with lighting, audio, camera angle validation
- Include "Audience Test" - show demo to 3 non-makers, measure their comprehension and emotional response to THE SHOUT

**Time Reality:**
```
THE SHOUT perfect capture: 2-3 hours (not 5 takes, more like 20)
Safety glasses warning: 1 hour
Full 2-minute flow: 3-4 hours with multiple takes
Context retention demo (30-min session): 2 hours minimum
Total realistic demo rehearsal: 8-10 hours
```

---

### 2. Unit Tests Are Mostly Waste (Wrong Investment)

**Problem:** 66 unit tests (UP-*, UI-*, UL-*, UT-*) testing functions like `formatCurrency(0)` returns `'$0'`. These tests provide nearly zero value for a hackathon demo.

**Impact:**
- 1.5 hours allocated to testing `parseShoutTag` edge cases when THE SHOUT working ONCE in the demo is all that matters
- Zero unit tests will be shown to judges
- Time spent here is time NOT spent on video production

**Fix:**
- Cut unit test time from 1.5 hours to 30 minutes
- Focus ONLY on CRITICAL unit tests: UP-1, UP-13, UP-14, UI-1 (4 tests, 30 minutes)
- Delete or skip all MEDIUM/LOW priority unit tests

**The Brutal Truth:** Nobody wins a hackathon because `validateMomentType('unknown_type')` returns the correct default. You win because THE SHOUT makes judges gasp.

---

### 3. No Automation Strategy (Execution Gap)

**Problem:** 237 tests listed, but no indication of which are automated vs manual. The plan reads as if a human will manually execute all 237 tests. This is insane.

**Impact:**
- Manual execution of 237 tests takes 40+ hours, not 17.5
- No regression safety - if a bug is fixed, all tests must be re-run manually
- No CI/CD integration means no confidence in last-minute changes

**Fix:**
```
| Category | Should Automate? | Tool | Why |
|----------|------------------|------|-----|
| Unit Tests (UP, UI, UL, UT) | YES | Jest | Run on every code change |
| Integration Tests (IG-1 to IG-10) | PARTIAL | Playwright | Can mock API |
| Integration Tests (IG-11+) | NO | Manual | Require real Gemini connection |
| E2E Tests | NO | Manual | Require physical demo setup |
| Performance | PARTIAL | Lighthouse + custom | Automated baselines |
| Demo Rehearsal | NO | Manual | This IS the video production |
```

Add to plan:
- `npm test` runs all 66 unit tests automatically
- Pre-recording checklist: "Run `npm test`, verify all pass"
- Mark each test as [AUTOMATED] or [MANUAL] in the table

---

### 4. Missing THE SHOUT Reliability Protocol (Critical for Demo)

**Problem:** THE SHOUT is the "money moment" - the critic says it's worth 10% probability boost. The test plan has S-1 (test it triggers) and DM-1 (5 takes limit), but no systematic reliability testing.

**Impact:** If THE SHOUT works 70% of the time, you'll waste hours during video recording trying to get a good take. The plan doesn't address this.

**Fix:** Add dedicated reliability test section:
```
### SHOUT Reliability Protocol (Pre-Recording)

| Test | Trials | Pass Criteria | Action if Fail |
|------|--------|---------------|----------------|
| SH-1 | 20 hand-near-blade scenarios | 18/20 trigger SHOUT | Fix prompt or parsing |
| SH-2 | Varied phrasings logged | All use <shout> tag | Add structured output requirement |
| SH-3 | Latency under 500ms | 19/20 under 500ms | Investigate network |
| SH-4 | Name correctly extracted | 20/20 correct | Fix regex |
| SH-5 | Audio clarity | Subjective 20/20 clear | Adjust volume/EQ |

Run SH-1 through SH-5 BEFORE any video recording. If <90% pass, stop and fix.
```

---

### 5. Performance Tests Miss The Point (Wrong Metrics)

**Problem:** P-1 through P-6 measure latency, but the critic specifically called out: "The '340ms' claims in the positioning can't be verified from the code." The test plan doesn't measure TRUE end-to-end latency.

**Impact:** Marketing claims "340ms response time" but tests only measure frame-to-response, not frame-to-audio-complete. Judges may probe this.

**Fix:** Add TRUE end-to-end latency test:
```
| Test ID | Metric | Start Point | End Point | Target |
|---------|--------|-------------|-----------|--------|
| P-TRUE-1 | True E2E | Frame captured | Audio begins playing | <400ms |
| P-TRUE-2 | Audio complete | Frame captured | Audio stops playing | <1200ms |
| P-TRUE-3 | User perception | Hand moves | Voice begins | <500ms subjective |
```

Instrument `use-audio-player.ts` to fire timestamps on audio start/end. Log these alongside frame send timestamps.

---

### 6. No "What Judges Will See" Test Section

**Problem:** The test plan validates features work, but doesn't validate the DEMO works as a viewing experience.

**Impact:** You can have 237 passing tests and still produce a confusing demo video. Tests validate code; they don't validate communication.

**Fix:** Add "Judge Experience Tests" section:
```
### Judge Experience Tests (New Section)

| Test ID | What to Validate | Method | Pass Criteria |
|---------|------------------|--------|---------------|
| JE-1 | THE SHOUT is visually obvious | Watch on muted video | Red overlay + shake visible |
| JE-2 | Latency indicator visible | Screenshot | Green dot clearly visible |
| JE-3 | Cost savings reads in 2 seconds | Show to non-maker | They can read the number |
| JE-4 | Sir Reginald voice is British | Play to 3 people | 3/3 say "British" |
| JE-5 | Demo timing under 2:30 | Stopwatch | <2:30 |
| JE-6 | Subtitle readability | Watch on mute | All subtitles readable |
```

---

## Coverage Gaps

| Missing Test | Why It Matters | Priority |
|--------------|----------------|----------|
| **Audio quality in workshop environment** | 60dB ambient specified but no actual test procedure | CRITICAL |
| **Slow-motion capture validation** | Positioning doc specifies slow-mo for SHOUT, not tested | HIGH |
| **Multi-take video continuity** | Editing cuts may break flow - need take-matching tests | HIGH |
| **Browser compatibility** | Only Chrome listed, but video may be watched on any browser | MEDIUM |
| **Mobile responsiveness** | Judges may view demo on phone | MEDIUM |
| **Subtitle timing verification** | "Judges on mute" is a listed risk, subtitles untested | HIGH |
| **Context indicator visibility** | New feature, no visual prominence test | HIGH |
| **Testimonial capture flow** | Positioning mentions testimonial, no test for it | HIGH |

---

## Time Analysis

**Original Estimate:** 17.5 hours
**Realistic Estimate:** 28-32 hours (if manual) or 18-20 hours (with automation + cuts)

**Recommended Cuts:**
- Unit tests MEDIUM/LOW: Cut 45 minutes (keep only CRITICAL/HIGH)
- Integration tests IG-11 to IG-20: Cut 45 minutes (test manually only if issues arise)
- Edge cases E-4, E-5, E-15, E-18: Cut 30 minutes (unlikely scenarios)
- UI/UX tests U-14 through U-18: Cut 30 minutes (mode toggle is not demo-critical)

**Recommended Additions:**
- SHOUT Reliability Protocol: Add 2 hours
- Judge Experience Tests: Add 2 hours
- True E2E Latency Measurement: Add 1 hour
- Extended Demo Rehearsal: Add 5 hours
- Audio Quality Validation: Add 1 hour

**Revised Time Budget:**
```
| Phase | Original | Revised | Change |
|-------|----------|---------|--------|
| Environment Setup | 0.5h | 0.5h | - |
| Unit Tests | 1.5h | 0.5h | -1h (automate, run only CRITICAL) |
| Integration Tests | 2h | 1h | -1h (cut low-value tests) |
| E2E Safety Tests | 2h | 2h | - |
| E2E Documentation Tests | 1.5h | 1h | -0.5h |
| E2E UI/UX Tests | 2h | 1h | -1h (cut non-demo tests) |
| Verdict Tests | 1h | 0.5h | -0.5h |
| Performance Tests | 2h | 1.5h | -0.5h |
| Edge Case Tests | 2h | 1h | -1h |
| SHOUT Reliability (NEW) | 0h | 2h | +2h |
| True E2E Latency (NEW) | 0h | 1h | +1h |
| Judge Experience (NEW) | 0h | 2h | +2h |
| Demo Rehearsal | 3h | 8h | +5h |
| **TOTAL** | **17.5h** | **22h** | +4.5h |
```

The 22 hours is better invested than the original 17.5 because it prioritizes what actually wins hackathons.

---

## Demo-Specific Concerns

1. **No video production checklist.** The test plan validates features but doesn't validate recording setup (lighting, mic check, OBS settings, etc.). Add a pre-recording checklist.

2. **Take limits are optimistic.** DM-1 says "5 takes max" for THE SHOUT. Reality: you'll need 15-20 attempts to get perfect timing where hand position, Gemini response, audio clarity, and facial expression all align.

3. **No "cold start" test.** Does THE SHOUT work on a fresh session? Or does it need warmup? The demo will start fresh.

4. **No "recovery from failure" demo test.** What if Gemini doesn't respond during recording? The test plan doesn't validate the "technical difficulties" recovery scripts in a demo context.

5. **No B-roll or cutaway planning.** Professional demos use B-roll. Where are the "close-up of hand near blade" tests?

6. **Subtitle testing missing.** Risk assessment says "Judges on mute miss THE SHOUT" but there's no test for subtitle timing, font size, or contrast.

---

## Gemini Live API Risks

| Risk | Test Coverage | Gap |
|------|---------------|-----|
| **Proactive audio doesn't trigger** | IG-13 (config check), but no actual trigger test | Need reliability test with 20+ scenarios |
| **GoAway during demo** | IG-11 (reconnection), P-12 to P-15 | Good coverage |
| **Rate limiting** | E-8 (graceful handling) | Minimal - what IS graceful handling? |
| **Latency spike** | P-1, P-2 (average/P95) | Good coverage |
| **Context window exhaustion** | IG-16 (compression enabled) | No actual 30-min test to verify compression works |
| **Voice not British enough** | Not tested | CRITICAL GAP - add subjective test |
| **v1alpha deprecation** | Not tested | Low risk, but consider documenting fallback |
| **Model behavior variance** | Not tested | Gemini may respond differently on different days - need multi-day testing |

**Critical Gap:** No test validates that Gemini's actual responses match the expected Sir Reginald persona. The system prompt asks for British phrases, but does Gemini actually say "Pardon the interruption"? Add a persona consistency test.

---

## Automation Recommendations

| Test Category | Should Automate? | Tool | Why |
|---------------|------------------|------|-----|
| Unit Tests (UP, UI, UL, UT) | **YES** | Jest | Instant feedback, run on every save |
| Integration (IG-1 to IG-10) | **YES** | Jest + mocks | Can mock SDK responses |
| Integration (IG-11+) | **NO** | Manual | Requires real Gemini connection |
| Audio Playback (IA-*) | **PARTIAL** | Jest + Web Audio mock | Basic flow testable |
| Video Capture (IV-*) | **NO** | Manual | Requires physical camera |
| Safety E2E (S-*) | **NO** | Manual | Requires visual staging |
| Performance (P-*) | **PARTIAL** | Custom harness | Latency logging can be automated |
| Edge Cases | **NO** | Manual | Require deliberate failure injection |
| Demo Rehearsal | **NO** | Manual | This IS video production |

**Automation ROI:**
- Automating unit tests saves 1 hour on every re-test cycle
- With 2-3 bug fix cycles expected, total savings: 2-3 hours
- Worth the 2-hour investment to set up Jest

**Immediate Action:** Add `npm test` script with Jest configuration. Run before every recording attempt.

---

## Action Items

### Must Fix (Before Testing Begins)

- [ ] **Invert time allocation:** Cut unit/integration time, add 5+ hours to demo rehearsal
- [ ] **Add SHOUT Reliability Protocol:** 20 trials with documented pass rate
- [ ] **Add Judge Experience Tests:** Validate demo is comprehensible to non-makers
- [ ] **Add True E2E Latency Measurement:** Instrument audio player timestamps
- [ ] **Automate unit tests:** Set up Jest, run on every build
- [ ] **Add pre-recording checklist:** Lighting, audio, OBS settings, Gemini status

### Should Fix (Before Demo Recording)

- [ ] **Add subtitle timing tests:** Verify readability on muted playback
- [ ] **Add persona consistency test:** Verify Gemini uses British phrasing
- [ ] **Add multi-day variance test:** Run SHOUT test on 3 different days
- [ ] **Add "cold start" test:** Verify features work on fresh session
- [ ] **Add audio quality test procedure:** Specify exact 60dB measurement method
- [ ] **Document what "graceful handling" means for rate limiting (E-8)**

### Nice to Have (If Time Permits)

- [ ] Add video production checklist (lighting, mic, camera angles)
- [ ] Add B-roll shot list for professional demo feel
- [ ] Add browser compatibility spot checks
- [ ] Add testimonial capture protocol

---

## Final Verdict

**RECOMMENDATION:** REVISE
**Confidence:** High
**Path Forward:** This test plan needs surgery, not tweaks. The fundamental problem is that it's a SOFTWARE TEST PLAN when you need a DEMO VALIDATION PLAN.

**The Core Issue:**
The test plan treats Sir Reginald as a software product being shipped. But for a hackathon with video-only submission, Sir Reginald is a DEMO being filmed. The test plan should ask: "Will judges be impressed by what they see and hear for 2 minutes?" instead of "Does `formatCurrency(0)` return `'$0'`?"

**Revised Philosophy:**
1. **Unit tests exist to prevent regressions** - automate them, run them, but don't obsess over them
2. **Integration tests validate the pipeline works** - do them once, trust the result
3. **Demo rehearsals ARE the tests** - every rehearsal is a test of the video production
4. **Judge experience is the ultimate test** - if 3 non-makers watch your demo and gasp at THE SHOUT, you pass

**What to Do Now:**
1. Revise the test plan per the action items above
2. Set up Jest automation for unit tests (2 hours)
3. Run the SHOUT Reliability Protocol (2 hours)
4. Spend the rest of the time on demo rehearsal

**The Brutal Reality:**
You have ~20 days until deadline (February 9). If you spend 17.5 hours testing software that's 92% aligned with spec, you're optimizing the wrong thing. The positioning doc says "The code can't get any better. The video can." The test plan should reflect that truth.

Go test the demo, not the code.

---

*"Testing is a noble endeavor, but one must test the right things. The judges shall not ask to see your Jest output."*
*-- Sir Reginald Testing Philosophy, Revised*
