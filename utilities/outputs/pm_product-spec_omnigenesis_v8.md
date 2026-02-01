# Omnigenesis: The Memory - Product Specification v8 (FINAL)

## Document Status

| Field | Value |
|-------|-------|
| **Version** | v8 (FINAL - Ready for Implementation) |
| **Built on** | v6 (base) + v7 (critic fixes) + v8 (final polish) |
| **Created** | January 30, 2026 |
| **Status** | LOCKED FOR DEVELOPMENT |

---

## Changes in v8

This is a DELTA document. For unchanged sections, reference v6 (base) and v7 (delta).

| Section | Change Type | Summary |
|---------|-------------|---------|
| Intermediate Element UX | NEW | Pulse/glow pathway indicator for stepping-stone elements |
| Demo Timing Fallback | NEW | Identifies expendable beat if demo runs long |
| Recipe Hint System | NEW | Subtle guidance when users attempt milestone combos prematurely |
| Pre-generation Checklist | CONSOLIDATED | Exact counts and verification criteria |
| Day 0-2 Veo Quality Criteria | NEW | Specific acceptance thresholds for Veo 3.1 output |

---

## Section 1: Intermediate Element UX

### The Problem

When users create intermediate elements (Potential, Awareness, Foundation, Conflict, Reflection, Surrender), they see only emoji + whisper, then immediately combine again to get a milestone with full 9-second reveal. The jump from "nothing special" to "cosmic revelation" feels abrupt.

### Solution: Pathway Indicator

Intermediate elements are stepping stones. They should FEEL like stepping stones - not just regular elements, but not full milestones either.

### Visual Treatment

**On Creation (0.8 seconds total):**

```
+-------------------------------------------------------------+
|                                                             |
|     [Potential]                                             |
|         *                                                   |
|       * * *                                                 |
|     *   *   *                                               |
|       * * *                                                 |
|         *                                                   |
|                                                             |
|     "Almost something. Almost alive. Almost."               |
|                                                             |
|     ---- ON THE PATH ----                                   |
|                                                             |
+-------------------------------------------------------------+
```

**Animation Sequence:**

| Phase | Time | Visual | Audio |
|-------|------|--------|-------|
| Creation | 0-0.3s | Element pulses 1.2x scale, soft glow appears | Soft chime (higher pitch than regular, lower than milestone) |
| Pathway Signal | 0.3-0.6s | Concentric rings pulse outward (2 rings), gold tint | Quiet harmonic undertone |
| Settle | 0.6-0.8s | Element settles to normal size, glow fades to subtle | Sound fades |

### CSS Specification

```css
.element--intermediate {
  /* Subtle persistent glow - differentiates from regular */
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.3);
  animation: intermediate-pulse 3s ease-in-out infinite;
}

@keyframes intermediate-pulse {
  0%, 100% {
    box-shadow: 0 0 8px rgba(255, 215, 0, 0.3);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 12px rgba(255, 215, 0, 0.5);
    transform: scale(1.02);
  }
}

.pathway-indicator {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #ffd700;
  opacity: 0.7;
  margin-top: 8px;
}
```

### Pathway Indicator Text

| Element | Text |
|---------|------|
| Potential | "On the path to LIFE" |
| Awareness | "On the path to CONSCIOUSNESS" |
| Foundation | "On the path to CIVILIZATION" |
| Conflict | "On the path to WAR" |
| Reflection | "On the path to WISDOM" |
| Surrender | "On the path to TRANSCENDENCE" |

**Display Logic:** Text appears for 2 seconds after creation, then fades. Remains visible on hover.

### Implementation Notes

```typescript
interface IntermediateElement extends Element {
  isIntermediate: true;
  leadsTo: MilestoneId;  // Which milestone this unlocks
}

const INTERMEDIATE_ELEMENTS: Record<string, IntermediateElement> = {
  'potential': { name: 'Potential', leadsTo: 'life', whisper: 'Almost something. Almost alive. Almost.' },
  'awareness': { name: 'Awareness', leadsTo: 'consciousness', whisper: 'The first flutter of noticing.' },
  'foundation': { name: 'Foundation', leadsTo: 'civilization', whisper: 'Thought crystallized into purpose.' },
  'conflict': { name: 'Conflict', leadsTo: 'war', whisper: 'When wants collide.' },
  'reflection': { name: 'Reflection', leadsTo: 'wisdom', whisper: 'The mirror turned inward.' },
  'surrender': { name: 'Surrender', leadsTo: 'transcendence', whisper: 'Letting go is also a choice.' },
};
```

---

## Section 2: Demo Timing Fallback

### The Problem

The v7 demo script has 10+ major beats in 2 minutes. If timing runs long during recording, which beat should be cut?

### Demo Beat Inventory

| Beat | Timestamp | Duration | Importance | Cuttable? |
|------|-----------|----------|------------|-----------|
| Zoom hook | 0:00-0:25 | 25s | CRITICAL | NO |
| Context callback #1 | 0:20-0:25 | 5s | High | **YES** |
| Combine reveal | 0:25-0:30 | 5s | CRITICAL | NO |
| Regular combines | 0:30-0:40 | 10s | High | Reduce to 5s |
| Milestone reveal | 0:40-0:55 | 15s | CRITICAL | NO |
| Zoom into Life | 0:55-1:05 | 10s | High | Reduce to 5s |
| Context callback #2 | 1:05-1:15 | 10s | CRITICAL | NO |
| Evolution time-cut | 1:15-1:25 | 10s | High | Reduce to 5s |
| Evolution video | 1:25-1:35 | 10s | CRITICAL | NO |
| Post-evolution | 1:35-1:45 | 10s | Medium | **YES** |
| Infinity reveal | 1:45-1:52 | 7s | High | Reduce to 4s |
| Positioning | 1:52-1:58 | 6s | High | NO |
| Logo | 1:58-2:00 | 2s | CRITICAL | NO |

### Fallback Priority (If Over 2:00)

**First Cut: Context Callback #1 (saves 5s)**
- Located at 0:20-0:25, during initial zoom descent
- Context Callback #2 at 1:05-1:15 is more impactful (includes token counter animation)
- One callback is sufficient to demonstrate memory feature

**Second Cut: Post-Evolution Discovery (saves 10s)**
- Located at 1:35-1:45, showing temples/murals
- The evolution video itself is the wow moment
- Can mention "new elements emerge" in narration without showing

**Third Cut: Reduce Regular Combines (saves 5s)**
- Show ONE fast combine instead of two
- Still demonstrates speed

### Revised Minimal Script (1:45 version)

If time is extremely tight, use this stripped version:

```
[0:00-0:20] ZOOM HOOK
            3 depths in 20 seconds, no callback

[0:20-0:25] THE QUESTION
            "What if you could combine?"

[0:25-0:35] COMBINE DEMO
            1 regular, 1 milestone reveal (9s)

[0:35-0:45] ZOOM INTO LIFE
            Show infinite depth concept

[0:45-0:55] CONTEXT CALLBACK (the important one)
            Token counter animation, memory showcase

[0:55-1:05] EVOLUTION TIME-CUT
            Quick, 5 seconds

[1:05-1:15] EVOLUTION VIDEO
            8-second Veo output

[1:15-1:25] INFINITY REVEAL
            Quick zoom montage

[1:25-1:35] POSITIONING + CLOSE
            Wonder messaging, logo
```

This version is 1:35, providing 25-second buffer.

---

## Section 3: Recipe Hint System

### The Problem

Users who try milestone combinations without prerequisites (e.g., Water + Mystery expecting Life) get "no result" or a random regular element. There's no guidance toward the chain discovery.

### Solution: Subtle Hints

When a user attempts a combination that would create a milestone IF they had the prerequisite, show a hint instead of failure.

### Hint Triggers

| Attempted Combo | Missing | Hint Message |
|-----------------|---------|--------------|
| Water + Mystery | Potential | "The universe stirs... but something is missing. Perhaps try combining Water with something more primal first." |
| Energy + Mystery | Potential | "A faint memory flickers... but the path is unclear. Energy might combine with something else first." |
| Life + Longing | Awareness | "Longing reaches out... but there's nothing to receive it yet. Life might need to notice first." |
| Awareness + Stone | Foundation | "The stone waits... but consciousness must first learn to shape before it can build." |
| Consciousness + Time | Reflection | "Time passes... but without first looking inward, nothing changes." |
| Consciousness + Void | Surrender | "The void whispers... but one must first accept its voice." |

### Implementation

```typescript
interface HintTrigger {
  attempted: [ElementId, ElementId];
  missing: ElementId;
  wouldCreate: MilestoneId;
  hint: string;
}

const HINTS: HintTrigger[] = [
  {
    attempted: ['water', 'mystery'],
    missing: 'potential',
    wouldCreate: 'life',
    hint: "The universe stirs... but something is missing. Perhaps try combining Water with something more primal first."
  },
  // ... additional hints
];

async function combine(a: Element, b: Element, context: MemoryContext): Promise<CombineResult | Hint> {
  // Check for hint triggers first
  const hint = HINTS.find(h =>
    (h.attempted[0] === a.id && h.attempted[1] === b.id) ||
    (h.attempted[0] === b.id && h.attempted[1] === a.id)
  );

  if (hint && !context.discoveredElements.includes(hint.missing)) {
    return { type: 'hint', message: hint.hint };
  }

  // Normal combination logic
  return await geminiCombine(a, b, context);
}
```

### Hint UX

```
+-------------------------------------------------------------+
|                                                             |
|     Water + Mystery                                         |
|                                                             |
|     ~ The universe stirs... ~                               |
|                                                             |
|     "...but something is missing.                           |
|      Perhaps try combining Water with                       |
|      something more primal first."                          |
|                                                             |
|                          [Dismiss]                          |
+-------------------------------------------------------------+
```

**Visual Treatment:**
- Italic text, slightly dimmed (opacity 0.8)
- No particle effects (this is a gentle nudge, not a discovery)
- Auto-dismiss after 4 seconds
- Does NOT prevent the actual combination result

**Important:** Hints are ADDITIONAL to the result. The combination still produces whatever it would produce. The hint is a subtle overlay that appears briefly.

---

## Section 4: Pre-generation Checklist (Consolidated)

### Exact Requirements

**All content must be pre-generated before demo recording. No live API calls during demo.**

| Category | Exact Count | Status | Verification |
|----------|-------------|--------|--------------|
| **Zoom Scenes (Scripted Path)** | 20 | [ ] | Fire > Heat > Vibration > ... through demo script |
| **Zoom Scenes (Alternatives)** | 30 | [ ] | Backup scenes for any scripted failures |
| **Evolution Videos (Veo 3.1)** | 5 | [ ] | LIFE, CONSCIOUSNESS, CIVILIZATION, backup x2 |
| **Milestone Images (Imagen 4)** | 15 | [ ] | All Depth I-IV milestones |
| **Primordial Images (Imagen 4)** | 12 | [ ] | All 12 primordials with artwork |
| **Intermediate Element Icons** | 6 | [ ] | Potential, Awareness, Foundation, Conflict, Reflection, Surrender |
| **Combination Results (scripted)** | 30 | [ ] | Exact demo path combinations |
| **Combination Results (alternatives)** | 50 | [ ] | Common user experiments |
| **Context Callbacks (scripted)** | 5 | [ ] | Exact trigger moments with text |
| **Context Callbacks (alternatives)** | 10 | [ ] | Backup callbacks if path deviates |

### Pre-generation Schedule

| Day | Content | Count | API |
|-----|---------|-------|-----|
| 3 | Primordial images | 12 | Imagen 4 |
| 3 | Intermediate icons | 6 | Imagen 4 (simple) |
| 4 | Milestone images | 15 | Imagen 4 |
| 4-5 | Zoom scenes (scripted) | 20 | Gemini Flash + Imagen 4 |
| 5-6 | Zoom scenes (alternatives) | 30 | Gemini Flash + Imagen 4 |
| 6 | Evolution videos | 5 | Veo 3.1 |
| 7-8 | Combination results | 80 | Gemini Flash |
| 8 | Context callbacks | 15 | Gemini Flash |

### Verification Criteria

Each pre-generated asset must pass:

| Asset Type | Pass Criteria |
|------------|---------------|
| Zoom Scene | 3-5 clickable elements visible, cosmic theme, no text errors |
| Evolution Video | 8 seconds, audio present, cinematic quality, thematically appropriate |
| Milestone Image | High quality, matches lore, dramatic composition |
| Combination Result | Name coherent, whisper poetic, no profanity/errors |
| Context Callback | References specific earlier element, grammatically correct |

### Demo Asset Storage

```
/public/demo-assets/
├── primordials/
│   ├── fire.png
│   ├── water.png
│   └── ... (12 total)
├── milestones/
│   ├── life.png
│   ├── consciousness.png
│   └── ... (15 total)
├── zoom-scenes/
│   ├── scripted/
│   │   ├── 01-inside-fire.json
│   │   ├── 02-inside-heat.json
│   │   └── ... (20 total)
│   └── alternatives/
│       └── ... (30 total)
├── evolution-videos/
│   ├── life-evolution.mp4
│   ├── consciousness-evolution.mp4
│   └── ... (5 total)
├── combinations/
│   └── results.json  // 80+ pre-computed results
└── callbacks/
    └── callbacks.json  // 15 pre-written callbacks
```

---

## Section 5: Day 0-2 Veo Quality Criteria

### The Problem

The evolution video at 1:25-1:35 in the demo is a make-or-break moment. If Veo 3.1 output is mediocre, the demo underwhelms. We must test Veo QUALITY, not just functionality, during CLI validation.

### Quality Testing Protocol

**Test on Days 1-2. Do not proceed to Phase 1 until criteria met.**

### Acceptance Thresholds

| Criterion | Threshold | Test Method |
|-----------|-----------|-------------|
| **Cinematic Quality** | 4/5 rating from team | Watch video cold, rate 1-5 |
| **Audio Integration** | Audio present, thematically appropriate | Listen without video, then with |
| **Motion Coherence** | No jarring frame jumps, smooth transitions | Watch at 0.5x speed |
| **Theme Alignment** | Video matches element being evolved | Compare to lore text |
| **Emotional Impact** | Generates "wow" reaction | Test on 2 non-team members |
| **Resolution** | 720p minimum, no artifacts | Check on 1080p display |
| **Duration** | 7-9 seconds (target 8) | Verify length |

### Test Prompts

Run these exact prompts during Day 0-2 testing:

**Prompt 1: LIFE**
```
A cosmic evolution: From primordial soup, the first cells divide and multiply.
Single-celled organisms become complex creatures. Life spreads across a world.
Cinematic, ethereal, cosmic scale. 8 seconds.
```

**Prompt 2: CONSCIOUSNESS**
```
A cosmic evolution: Simple organisms develop nervous systems. A creature
opens its eyes for the first time. It looks up at the stars and wonders.
Cinematic, profound, 8 seconds with emotional crescendo.
```

**Prompt 3: CIVILIZATION**
```
A cosmic evolution: Conscious beings gather. They build structures, cities,
monuments. They write, they create art, they reach for the sky.
Time-lapse civilization building, cinematic, 8 seconds.
```

**Prompt 4: TRANSCENDENCE**
```
A cosmic evolution: Beings of light transcend physical form. They merge with
the cosmos. Individual becomes universal. A peaceful dissolving into infinity.
Abstract, beautiful, peaceful, 8 seconds.
```

**Prompt 5: BACKUP**
```
A cosmic memory: The universe remembers its own birth. From void, to light,
to matter, to complexity. The story of everything in 8 seconds.
Cinematic, awe-inspiring.
```

### Evaluation Scorecard

| Prompt | Quality (1-5) | Audio (Y/N) | Motion (1-5) | Theme (Y/N) | Wow (Y/N) | PASS |
|--------|---------------|-------------|--------------|-------------|-----------|------|
| LIFE | | | | | | |
| CONSCIOUSNESS | | | | | | |
| CIVILIZATION | | | | | | |
| TRANSCENDENCE | | | | | | |
| BACKUP | | | | | | |

**Pass Criteria:** At least 3/5 videos must score 4+ on Quality, have Audio, score 4+ on Motion, match Theme, and generate Wow.

### Fallback Plan (If Veo Fails)

If Veo 3.1 output does not meet criteria after 3 prompt iterations:

**Option A: Reduce Evolution Scope**
- Generate 5-second videos instead of 8
- Use simpler prompts
- Accept lower quality for demo

**Option B: Pre-produce Videos**
- Use external video tools to create evolution sequences
- Cite as "powered by Veo 3.1" if Veo contributed to generation
- This is less impressive but ensures demo quality

**Option C: Cut Evolution from Demo**
- Focus on Combine + Zoom only
- Mention Evolution as "async feature" without showing
- Reduces wow factor but removes risk

**Decision Point:** End of Day 2. If Veo does not pass criteria, choose fallback option before Day 3.

---

## Final Pre-Implementation Checklist

**Everything below must be done before coding starts (Day 3).**

### Day 0: Environment Setup

- [ ] Gemini API key configured
- [ ] All model IDs verified (gemini-3-flash, imagen-4, veo-3.1-generate-preview)
- [ ] Rate limits understood
- [ ] CLI test harness created

### Day 1: Core API Validation

- [ ] **Gemini Flash:** 50+ combination prompts tested
  - Criteria: < 1.5s response, 90%+ usable outputs
- [ ] **Imagen 4:** 10+ milestone images generated
  - Criteria: < 12s generation, 80%+ quality acceptable
- [ ] **1M Context:** 200K+ tokens loaded and retrieved
  - Criteria: Retrieval works, no corruption

### Day 2: Veo Validation (CRITICAL)

- [ ] **Veo 3.1:** 5 evolution videos generated using test prompts above
- [ ] **Quality Scorecard:** Completed and reviewed
- [ ] **Pass Criteria Met:** At least 3/5 videos pass
- [ ] **Fallback Decision:** If fail, choose Option A/B/C

### Day 2 End: GO/NO-GO

| Check | Status |
|-------|--------|
| Gemini Flash works at speed | [ ] |
| Imagen 4 produces quality images | [ ] |
| 1M context loads without issues | [ ] |
| Veo 3.1 passes quality criteria OR fallback chosen | [ ] |

**If all checks pass: PROCEED TO PHASE 1**
**If any check fails: Re-scope before proceeding**

---

## Reference: Unchanged Sections

The following sections are unchanged from v6/v7 and should be referenced there:

| Section | Reference |
|---------|-----------|
| Core Experience (Combine, Zoom, Evolve) | v6 |
| Element System (Milestones, Primordials) | v6 |
| Milestone Recipes (2-element chains) | v7 |
| 9-Second Reveal Sequence | v6 |
| Technical Architecture | v6 |
| UI Layout and Visual Style | v6 |
| Demo Script (full version) | v7 |
| Context Showcase Requirements | v7 |
| Evolution Demo Framing | v7 |
| Wonder Over Utility Positioning | v7 |
| Implementation Plan (Phases 1-5) | v6 |
| Risk Assessment | v6 |
| Success Criteria | v6 |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v6 | Jan 30, 2026 | Base spec with Memory narrative, Milestone/Regular system |
| v7 | Jan 30, 2026 | Critic fixes: Zoom-first demo, 2-element chains, context showcase |
| v8 | Jan 30, 2026 | FINAL: Intermediate UX, demo fallback, hints, pre-gen checklist, Veo criteria |

---

*This is the FINAL specification. No further changes unless critical issues arise during implementation.*

*Build it. Execute flawlessly. Win.*
