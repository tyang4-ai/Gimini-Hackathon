# Omnigenesis Build Plan - FINAL

## Decision: BUILD (Full Scope)

**User Decision:** Keep full scope (Combine + Zoom + Evolve) despite critic's recommendation to cut Evolve.

**Rationale:** The project's value is showcasing ALL Gemini 3 modalities (text + image + video + context). Cutting Evolve undermines the core pitch.

**Critic's Warning (15-20% win probability):** Acknowledged but rejected. User believes the full vision is worth the execution risk.

**Mitigation:** CLI prototype first (Day 1-2) to validate all APIs before committing to UI work.

---

## Critical Success Factors

### 1. Timeline Reality Check
- **Available:** 12 days (Jan 28 - Feb 9)
- **Original Plan:** 13 days
- **Verdict:** Tight but doable if you cut scope ruthlessly

### 2. Prioritized Build Order

| Priority | Feature | Days | Why |
|----------|---------|------|-----|
| P0 | Combine | 2 | Core loop, must be fast & polished |
| P0 | Zoom | 3 | Key differentiator, infinite depth |
| P1 | Evolve | 2 | Wow factor, but async so less critical |
| P1 | Polish + Demo | 3 | Pre-generate content, record video |
| Buffer | Contingency | 2 | Things will break |

**Total: 12 days** (exactly matches available time)

### 3. What Must Work Perfectly
1. **Combine < 3 seconds** - The addiction loop
2. **Zoom transitions smooth** - The magic moment
3. **Demo video scripted & rehearsed** - No live API calls in submission

### 4. What Can Be "Good Enough"
1. **Evolve** - Async with explicit wait, pre-generate for demo
2. **UI polish** - Functional > beautiful
3. **Sound effects** - Skip if time-constrained

---

## Addressing Critic Concerns

### Concern 1: 1M Context is Marketing
**Fix:** Make context visible in the demo
- Show Sir Reginald-style callback: "This reminds me of what you created earlier..."
- Display "Universe Memory: 847K tokens" in UI
- Have an element reference something from 10+ zooms ago

### Concern 2: Evolve Breaks Addiction Loop
**Fix:** Frame it correctly
- Evolve is the "rare epic drop" not the core loop
- Core loop is Combine + Zoom (both fast)
- Demo shows: fast-fast-fast-then-epic-payoff

### Concern 3: Infinite Craft Clones Exist
**Fix:** Emphasize ZOOM as the differentiator
- "Infinite Craft lets you combine. We let you GO INSIDE."
- The recursive depth is genuinely novel
- Pitch: "Everything has worlds inside"

---

## Technical Stack

```
omnigenesis/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main game
│   │   ├── layout.tsx            # Cosmic theme
│   │   └── api/
│   │       ├── combine/route.ts  # Flash + Nano Banana
│   │       ├── zoom/route.ts     # Scene generation
│   │       └── evolve/
│   │           ├── route.ts      # Start Veo job
│   │           └── [id]/route.ts # Check status
│   ├── components/
│   │   ├── ElementPalette.tsx    # Draggable elements
│   │   ├── CombineZone.tsx       # Drop zone
│   │   ├── ZoomViewport.tsx      # Main canvas
│   │   ├── EvolutionModal.tsx    # Async start
│   │   └── VideoPlayer.tsx       # Watch evolutions
│   ├── store/
│   │   └── gameStore.ts          # Zustand state
│   └── lib/
│       ├── gemini.ts             # SDK setup
│       └── prompts.ts            # All prompts
└── public/
    └── elements/                 # Pre-generated images
```

---

## Day-by-Day Plan

### Days 1-2: API Validation (CLI Prototype)
**CRITICAL: Prove the APIs work before building UI**

- [ ] Create test scripts (Node.js + Gemini SDK)
- [ ] Test Gemini Flash: 50+ combination prompts
  - Measure latency (target: < 2 seconds)
  - Check response quality (no garbage)
  - Document failure modes
- [ ] Test Nano Banana: 30+ image generations
  - Measure latency (target: < 3 seconds)
  - Check quality (usable for game)
  - Test various element types
- [ ] Test Veo 3.1: 3-5 evolution videos
  - Measure actual generation time
  - Check video quality
  - Verify async job pattern works
- [ ] Test 1M context: Load 500K+ tokens, verify retrieval
- [ ] **GO/NO-GO decision at end of Day 2**

**Success Criteria:**
- Combine: < 3 seconds, 95%+ usable responses
- Zoom images: < 4 seconds, 90%+ usable quality
- Evolve: Async works, video generates (time doesn't matter)
- Context: Can retrieve info from 500K+ token history

**If ANY fail:** Re-scope immediately, don't waste days on broken foundation.

### Days 3-4: Core Combine (UI)
- [ ] Next.js 14 + Tailwind + Zustand setup
- [ ] Integrate validated API code from CLI prototype
- [ ] `/api/combine` endpoint (Flash for logic + Nano Banana for image)
- [ ] 12 primordial elements with pre-generated images
- [ ] ElementPalette component (draggable)
- [ ] CombineZone component (drop zone)
- [ ] Result display with animation
- **Test:** Can combine any two elements in < 3 seconds

### Days 5-7: Zoom System
- [ ] ZoomViewport component (scene display)
- [ ] `/api/zoom` endpoint (scene + element generation)
- [ ] Click-to-zoom interaction
- [ ] Zoom transition animation (CSS transform)
- [ ] Zoom out / breadcrumb navigation
- [ ] Context management (universe state)
- [ ] Depth counter display
- [ ] **WOW MOMENT: Test zoom to 20+ levels, have deep level reference early creation**
- **Test:** Can zoom 20+ levels deep, context callbacks work

### Days 8-9: Evolution
- [ ] EvolutionModal component with clear "1-2 min wait" messaging
- [ ] `/api/evolve` endpoint (Veo 3.1 async)
- [ ] Job queue and status polling
- [ ] Progress indicator in sidebar
- [ ] Notification when ready
- [ ] VideoPlayer component
- [ ] Element emergence after evolution
- **Test:** Can start evolution, get video, see new elements

### Days 10-11: Polish & Pre-Generation
- [ ] Visual polish (particles, glow, smooth transitions)
- [ ] Pre-generate 10+ evolution videos for demo
- [ ] Pre-generate 30+ zoom scenes along demo path
- [ ] Pre-cache key demo element combinations
- [ ] Context memory callback display ("This reminds me of...")
- [ ] Discovery stats panel
- [ ] Universe memory display (show token count)

### Day 12: Demo Recording & Submit
- [ ] Script exact 2-minute demo path
- [ ] Rehearse 10+ times
- [ ] Record multiple takes
- [ ] Edit best takes together
- [ ] Write submission text (~200 words)
- [ ] **SUBMIT before Feb 9 5PM PT**

---

## Contingency Plan

**If behind schedule by Day 7:**
- Evolve becomes "Coming Soon" with pre-recorded fake video
- Focus all remaining time on polishing Combine + Zoom
- The core product (Combine + Zoom) must be flawless

**If APIs fail on Day 1-2:**
- Pivot to simpler scope immediately
- Don't waste days building on broken foundation

---

## Demo Strategy

### Pre-Generate Everything
- **Evolution videos:** 10+ for key elements (Candle, etc.)
- **Zoom scenes:** 50+ along scripted path
- **Combinations:** All pairs used in demo

### Demo Script (2 min)
| Time | Content | API Showcased |
|------|---------|---------------|
| 0:00-0:10 | Hook - "What if everything had worlds inside?" | - |
| 0:10-0:25 | Combine demo - Fast, satisfying | Flash + Nano Banana |
| 0:25-0:45 | Zoom demo - Go 5+ levels deep | Image Generation |
| 0:45-1:00 | Context callback - "This reminds me..." | 1M Context |
| 1:00-1:20 | Evolution video (pre-cached, edited) | Veo 3.1 |
| 1:20-1:45 | Zoom into civilization - They worship you | Full Integration |
| 1:45-2:00 | Logo + tagline | - |

### Submission Pitch
"Omnigenesis showcases the full power of Gemini 3:
- **Combine** uses Flash for instant creative reasoning
- **Zoom** uses Nano Banana for infinite visual depth
- **Evolve** uses Veo for civilization timelapses
- **Context** uses 1M tokens to remember your entire universe

Future: VR port using video input for spatial creation."

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Veo too slow | Pre-generate all demo videos |
| Nano Banana quality varies | Pre-generate and curate demo images |
| API rate limits | Use caching, batch pre-generation |
| Demo fails | Never call live APIs during recording |
| Time runs out | Cut Evolve to "coming soon" if needed |

---

## Verification Plan

### Before Recording Demo
1. [ ] Combine works in < 3 seconds (test 50+ combinations)
2. [ ] Zoom works to depth 15+ (no repetition/garbage)
3. [ ] Evolution videos ready (10+ pre-generated)
4. [ ] Context callbacks work (reference earlier creations)
5. [ ] Full demo path rehearsed 20+ times

### Submission Checklist
- [ ] Video uploaded to YouTube (public, < 3 min)
- [ ] Public code repo (GitHub)
- [ ] ~200 word description with Gemini features listed
- [ ] Working demo link OR AI Studio link
- [ ] Submitted before Feb 9 5PM PT

---

## Final Assessment

### Critic's Assessment: 15-20% win probability
- Timeline unrealistic
- Evolve breaks addiction loop
- Not novel enough vs 16,600 submissions
- 1M context is marketing fluff

### User's Decision: BUILD ANYWAY (Full Scope)
- Full vision showcases ALL Gemini 3 modalities
- CLI prototype first mitigates API risk
- Contingency plan if behind schedule
- Passion for the project matters

**Adjusted Win Probability:** 20-30% (with CLI validation + contingency plan)

**Key Success Factors:**
1. Day 1-2 CLI validation MUST pass - no UI work on broken APIs
2. Combine + Zoom MUST be flawless - these are the core product
3. Evolve can be "good enough" or faked if needed
4. ONE memorable moment at deep zoom level (context callback)

**The Bet:** You're betting that showcasing Gemini 3's full breadth beats specialized depth. The critic disagrees. Only the judges will decide who's right.

---

*Plan created: January 28, 2026*
*Critic review: January 28, 2026 (15-20% verdict)*
*User decision: Proceed with full scope + CLI validation first*
*Status: Ready for execution*
