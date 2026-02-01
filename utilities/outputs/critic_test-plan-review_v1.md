# Critic Review: Omnigenesis Test Plan v2

## VERDICT: APPROVE

---

## Executive Summary

The test plan v2 represents a significant improvement over v1. The tester has transformed a basic checklist into a comprehensive, demo-focused testing strategy that aligns with the product spec v10 and addresses the core hackathon success criteria. The addition of the Demo Script Execution section (DEM-100 to DEM-111) is exactly what was needed - the demo IS the product, and now testing reflects that reality.

---

## Improvements Made (from v1)

### Major Additions (Excellent)

1. **Demo Script Execution Section (NEW)**
   - 12 timestamped test cases matching the 2-minute demo script
   - Specific expected results for each demo beat
   - Timing tolerance (+-5 seconds) as acceptance criteria
   - This is the most critical addition - without it, v1 was testing features, not the demo

2. **Intermediate Elements Section (NEW)**
   - 6 test cases covering Potential, Awareness, Foundation, Conflict, Reflection, Surrender
   - Tests for violet border, pulsing gold glow, pathway text
   - Aligns with product spec A1 (Intermediate Element UX)

3. **Context System Section (NEW)**
   - Tests for memory fragments, context callbacks, token counter
   - Addresses the "make context callbacks LOUD" requirement from critic reviews
   - Critical for demonstrating 1M context usage to judges

4. **Hint System Section (NEW)**
   - Tests for all 7 hint triggers from hints.ts
   - Verifies auto-dismiss behavior (4 seconds)
   - Validates hint doesn't block combination result

5. **Asset Verification Section (NEW)**
   - Explicit checks for 12 primordial images, 9 milestone images
   - Pre-cached data verification (25+ combinations, 10+ scenes)
   - Sound file verification (if enabled)

### Structural Improvements (Good)

6. **9-Second Reveal Breakdown Expanded**
   - v1 had 8 test cases, v2 has 13 with phase-specific timing
   - Added particle swirl, blur progression, lore typing, aftermath effects
   - Now matches product spec section 0.5 detail level

7. **Test Execution Phases Restructured**
   - 5 phases with clear time allocations (15 min to 2 hours)
   - Phase 3 (Demo Script Dry Run) is the critical gate
   - "BLOCKER" flags for critical failures

8. **Performance Targets Tightened**
   - Combine latency: 2s (v1) -> 1.5s (v2)
   - Animation frame rate: 60fps (v1) -> 55fps minimum (v2, more realistic)
   - Bundle size target added (<500KB initial JS)

9. **Bug Severity Classification Added**
   - P0-P4 scale with clear definitions
   - P0 (Blocker) = demo cannot proceed
   - Enables prioritization during bug triage

---

## Remaining Gaps

### 1. [Medium] Demo Mode Toggle Testing Missing

**Issue:** Tests verify DEMO_MODE=true behavior but don't test the toggle mechanism or fallback behavior during transition.

**What's Missing:**
- Test for switching between demo mode and live API mode
- Test for graceful fallback when cached data is missing AND API is unavailable
- Test for console error handling when both cache and API fail

**Recommendation:** Add 2-3 test cases for demo mode edge cases:
```
DEM-007: Demo mode + missing cache + API timeout = graceful error message
DEM-008: Toggle demo mode during session = state preserved
```

### 2. [Medium] Evolution Queue Behavior Underspecified

**Issue:** EVO-010 mentions "Multiple evolutions queue" but doesn't specify queue management testing.

**What's Missing:**
- Test for max queue depth (what happens if user triggers 5 milestones rapidly?)
- Test for queue persistence (does queue survive page refresh?)
- Test for queue notification UI (how many badges can appear?)

**Recommendation:** Add queue limit test and overflow behavior verification.

### 3. [Low] Sound System Coverage Reduced

**Issue:** v1 had 5 sound tests (SND-001 to SND-005), v2 embeds sound tests within other categories but loses explicit coverage for mute/unmute and volume control.

**What's Missing:**
- Explicit test for mute toggle
- Explicit test for volume slider
- Test for audio settings persistence across sessions

**Recommendation:** Either restore dedicated sound section or ensure PER-003 (audio settings persist) covers all audio controls.

### 4. [Low] Accessibility Removed

**Issue:** v1 had A11-001 to A11-003 for keyboard navigation, focus indicators, and color contrast. v2 removes these entirely.

**Rationale:** Likely intentional scope cut for hackathon focus. Accessibility is not in judging criteria.

**Recommendation:** Acceptable for hackathon, but note as technical debt if project continues post-hackathon.

### 5. [Low] Mobile/Responsive Testing Absent

**Issue:** No test cases for responsive behavior or touch interactions.

**Rationale:** Product spec explicitly states "Mobile optimization" is OUT OF SCOPE.

**Recommendation:** Acceptable. Confirm demo will be recorded on desktop only.

---

## Demo Script Section Analysis (Critical)

The demo script section (DEM-100 to DEM-111) is the heart of this test plan. Let me analyze its alignment with product spec v10 section 0.7:

| Demo Beat | Test Coverage | Alignment |
|-----------|---------------|-----------|
| Black -> Light (0:00-0:05) | DEM-100: App loads | Partial - missing intro animation |
| Zoom hook (0:05-0:25) | DEM-101, DEM-102, DEM-103 | Good |
| Combine demo (0:25-0:40) | DEM-104, DEM-105 | Good |
| Milestone reveal (0:40-0:55) | DEM-106, DEM-107 | Good |
| Context callback (1:05) | DEM-108 | Good |
| Evolution (1:25-1:35) | DEM-109, DEM-110 | Good |
| Final discovery (1:45-2:00) | DEM-111 | Good |

**Notable Gap:** The product spec demo script has a "BLACK -> Single point of light" intro at 0:00 and a "UI FADES IN" at 0:10. DEM-100 only tests "App loads" with sidebar and combine zone visible. If there's an animated intro, it's not tested.

**Recommendation:** Clarify whether the demo has an animated intro sequence. If yes, add test case for intro animation timing and visual quality.

---

## Execution Plan Assessment

### Time Allocations

| Phase | Allocated | Realistic? |
|-------|-----------|------------|
| Phase 1: Asset Verification | 15 min | Yes |
| Phase 2: Smoke Test | 30 min | Yes |
| Phase 3: Demo Script Dry Run | 45 min | **Tight** - should be 60 min |
| Phase 4: Feature Deep Dive | 2 hours | Yes |
| Phase 5: Demo Recording Prep | 1 hour | Yes |

**Issue:** Phase 3 includes "Record screen, verify each timestamp" for 12 test cases in 45 minutes. That's 3.75 minutes per test case including setup, execution, and timing verification. Recommend 60 minutes or reduce verification scope.

### Execution Order

The phased approach is correct:
1. Assets exist (can't test features without assets)
2. Core loop works (can't test demo without features)
3. Demo path works (can't record without verified path)
4. Edge cases covered (polish)
5. Recording prep (final gate)

This is professional QA sequencing.

---

## Success Criteria Assessment

| Criteria | Achievable? | Notes |
|----------|-------------|-------|
| Critical: 100% pass | Yes | 27 Critical tests, all achievable |
| High: 100% pass | Yes | 31 High tests, all achievable |
| Medium: 90% pass | Yes | 32 Medium tests, ~3 can fail |
| Low: 80% pass | Yes | 10 Low tests, ~2 can fail |
| Demo Script: +-5s per step | **Challenging** | Requires 50+ rehearsals |
| Performance targets | Yes | All realistic |

**Risk:** The +-5 second tolerance on 12 demo steps is aggressive. If the app runs slightly slow or the tester's timing is off, false failures will occur.

**Recommendation:** For Phase 3, use +-10 second tolerance for first pass. Tighten to +-5 seconds only for final recording prep.

---

## Alignment with Product Spec v10

| Spec Section | Test Coverage |
|--------------|---------------|
| 0.3 Core Experience (Combine, Zoom, Evolve) | Full coverage |
| 0.4 Element System (Primordials, Intermediates, Milestones) | Full coverage |
| 0.5 9-Second Reveal | Full coverage (13 tests) |
| 0.7 Demo Script | Full coverage (12 tests) |
| A1 Intermediate Element UX | Full coverage (6 tests) |
| A3 Recipe Hint System UX | Full coverage (6 tests) |
| A4 Pre-generation Checklist | Partial - tests assets exist but not generation process |
| Section 1 prompts.ts | Not directly tested (API integration tests cover) |
| Section 2 hints.ts | Full coverage |

**Gap:** The pre-generation checklist (A4) specifies exact counts: 20 scripted zoom scenes, 30 alternatives, 5 Veo videos, etc. The test plan checks for "25+ combinations" and "10+ scenes" but doesn't verify the exact counts from the spec.

**Recommendation:** Update AST-004 and AST-005 to match spec counts:
- AST-004: 80+ combinations (not 25+)
- AST-005: 50 zoom scenes (20 scripted + 30 alternatives, not 10+)

---

## Final Recommendations

1. **Increase Phase 3 time allocation from 45 min to 60 min**
   - Demo script verification is the most critical phase
   - 3.75 minutes per test case is too tight

2. **Add demo mode edge case tests**
   - Missing cache + API failure scenario
   - Demo mode toggle during session

3. **Update asset counts to match spec**
   - AST-004: 80+ combinations
   - AST-005: 50 zoom scenes

4. **Clarify intro animation testing**
   - Is there a "BLACK -> Light" intro sequence?
   - If yes, add test case

5. **Use relaxed timing tolerance for first pass**
   - Phase 3 first run: +-10 seconds
   - Final recording prep: +-5 seconds

---

## Score: 8.5/10

**Breakdown:**
- Demo focus: 10/10 (exactly what was needed)
- Spec alignment: 8/10 (minor count discrepancies)
- Completeness: 8/10 (some edge cases missing)
- Execution realism: 8/10 (Phase 3 timing tight)
- Structure: 9/10 (clear phases, priority flags)

**Why APPROVE despite gaps:**
- All gaps are Low or Medium severity
- No blockers for demo success
- Core demo path is fully tested
- Improvements are polish, not fundamentals

The test plan is ready for execution. The remaining gaps can be addressed during Phase 4 (Feature Deep Dive) without blocking the critical path.

---

## Sign-Off

| Field | Value |
|-------|-------|
| Document Reviewed | tester_test-plan_omnigenesis_v2.md |
| Product Spec Reference | pm_product-spec_omnigenesis_v10.md |
| Previous Version | tester_test-plan_omnigenesis_v1.md |
| Verdict | **APPROVE** |
| Confidence | High |
| Score | 8.5/10 |
| Key Strength | Demo Script Execution section |
| Key Gap | Asset counts underspecified |

---

*Critique completed: January 31, 2026*
*Reviewed document: Test Plan v2*
*Reviewer stance: Thorough but fair*
*Final message: This test plan will catch demo-breaking issues. Execute it.*
