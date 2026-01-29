# Omnigenesis - Product Specification v3 (FINAL)

## Strategic Focus

**CORE LOOP (Fast, Addictive):**
- **COMBINE** - Merge elements → instant result (text generation via Gemini 3 Pro)
- **ZOOM** - Enter any element → discover worlds inside (image generation via Nano Banana)

**FEATURE (Acknowledged Wait):**
- **EVOLVE** - Explicit button with "This generates a video (~1-2 min)" - users understand and accept the wait

**CUT:**
- ~~Translate~~ - Removed
- ~~Export~~ - Simplified to screenshot/share (no video pipeline for v1)

---

## The Core Experience

### 1. COMBINE - The Infinite Craft Core (PRIORITY 1)

**Speed Target:** < 3 seconds from drag to result

**How it works:**
1. User drags two elements together
2. Gemini 3 Pro determines the combination (thinking: low for speed)
3. Nano Banana generates the image
4. Result appears with name, emoji, description, image

**Technical:**
```typescript
// Combination endpoint - optimized for speed
async function combine(a: Element, b: Element): Promise<Element> {
  // Parallel requests for speed
  const [result, image] = await Promise.all([
    gemini3Pro.generateContent({
      model: "gemini-3-flash-preview", // Flash for speed
      contents: combinationPrompt(a, b),
      config: { thinkingLevel: "minimal" } // Fastest
    }),
    // Image generation starts immediately with predicted result
  ]);
  
  return { ...result, imageUrl: image.url };
}
```

**Starting Elements (12 Primordials):**
| Matter | Senses | Abstract |
|--------|--------|----------|
| 🪨 Stone | 👁️ Light | 💔 Longing |
| 💧 Water | 👂 Silence | ⏰ Time |
| 🔥 Fire | ✨ Shimmer | ❓ Mystery |
| 💨 Air | 🌑 Void | 💫 Wonder |

**Game Mechanics:**
- Discovery tracking (X/??? elements discovered)
- Combination history
- Deterministic results (same inputs = same output)
- Some combinations are "rare" (low probability pairings)

---

### 2. ZOOM - Infinite Depth (PRIORITY 1)

**Speed Target:** < 2 seconds from click to new scene

**How it works:**
1. User clicks any element in the viewport
2. Smooth zoom transition (1 second CSS animation)
3. New scene generates with 3-5 discoverable elements
4. Each element can be collected and combined

**The Magic:** Everything has something inside. Forever.

**Technical:**
```typescript
// Zoom endpoint - generates inner world
async function zoom(element: Element, context: UniverseContext): Promise<ZoomScene> {
  const scene = await gemini3Pro.generateContent({
    model: "gemini-3-flash-preview",
    contents: zoomPrompt(element, context),
    config: { thinkingLevel: "low" }
  });
  
  // Generate scene image + element images in parallel
  const images = await Promise.all([
    generateSceneImage(scene.description),
    ...scene.elements.map(e => generateElementImage(e))
  ]);
  
  return { ...scene, images };
}
```

**Depth Mechanics:**
- Each element has "depthPotential" (1-10)
- Higher potential = richer scenes inside
- Can zoom out to return to previous levels
- Universe context maintains consistency

**Context Usage (1M Tokens):**
- Store scene descriptions, element relationships, narrative threads
- AI "remembers" what you've created
- Connections emerge: "This reminds me of what you found earlier..."

---

### 3. EVOLVE - The Feature (PRIORITY 2)

**User Expectation:** Explicit that this takes time

**How it works:**
1. User selects an element with evolutionPotential > 5
2. Clicks "EVOLVE" button
3. Modal appears: "Evolution takes 1-2 minutes. We'll notify you when ready."
4. User clicks "Start Evolution"
5. Generation happens in background
6. Notification when complete
7. User watches video, discovers emerged elements

**UI Design:**
```
┌─────────────────────────────────────────┐
│  ⏳ EVOLVE: The Candle in the Window    │
├─────────────────────────────────────────┤
│                                         │
│  Watch millions of years unfold.        │
│  See what your creation becomes.        │
│                                         │
│  ⚠️ This generates a video and takes    │
│     about 1-2 minutes.                  │
│                                         │
│  [Cancel]           [Start Evolution]   │
│                                         │
└─────────────────────────────────────────┘
```

**While Waiting:**
- User continues playing (Combine + Zoom)
- Small indicator in corner: "🧬 Evolving... 45%"
- When ready: "🎬 Evolution complete! Click to watch"

**Video Specs:**
- 8 seconds via Veo 3.1
- Shows time passing, life emerging, civilizations rising
- Ends with new elements to discover

**Demo Strategy:**
- Pre-generate all evolution videos
- In demo video, use editing to speed up or cut waiting
- Show "Start Evolution" → cut to → video playing

---

## Technical Architecture

### Simplified Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js 14)                        │
├─────────────────────────────────────────────────────────────────┤
│  Components:                                                     │
│  [ElementPalette] [CombineZone] [ZoomViewport] [EvolveButton]   │
│  [DiscoveryLog] [EvolutionQueue] [VideoPlayer]                  │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API ROUTES (Next.js)                         │
├─────────────────────────────────────────────────────────────────┤
│  POST /api/combine      - Create new element (fast)              │
│  POST /api/zoom         - Generate zoom scene (fast)             │
│  POST /api/evolve       - Start evolution (async job)            │
│  GET  /api/evolve/:id   - Check evolution status                 │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     GEMINI 3 APIs                                │
├─────────────────────────────────────────────────────────────────┤
│  gemini-3-flash-preview      - Combination logic (speed)        │
│  gemini-3-pro-image-preview  - Element/scene images             │
│  veo-3.1                     - Evolution videos (async)         │
└─────────────────────────────────────────────────────────────────┘
```

### State Management

```typescript
interface GameState {
  // Core
  elements: Element[];           // All discovered elements
  currentScene: ZoomScene;       // What's in the viewport
  zoomPath: string[];            // Breadcrumb of zoom history
  
  // Evolution
  evolutionQueue: EvolutionJob[]; // Pending evolutions
  completedEvolutions: Evolution[]; // Ready to watch
  
  // Meta
  discoveries: number;           // Total elements discovered
  deepestZoom: number;           // Max depth reached
}
```

---

## User Interface

### Main Screen

```
┌─────────────────────────────────────────────────────────────────┐
│  ✧ OMNIGENESIS              Discovered: 47    Depth: 12   [⚙️] │
├────────────────────┬────────────────────────────────────────────┤
│                    │                                            │
│  ELEMENTS          │           ZOOM VIEWPORT                    │
│  ───────────────   │   ┌────────────────────────────────┐      │
│  Primordials:      │   │                                │      │
│  [🪨][💧][🔥][💨] │   │    [Current Scene Image]       │      │
│  [👁️][👂][✨][🌑] │   │                                │      │
│  [💔][⏰][❓][💫] │   │    [Element] [Element] [Elem]   │      │
│                    │   │                                │      │
│  Discovered:       │   └────────────────────────────────┘      │
│  [🕯️][🏚️][🌅]... │                                            │
│                    │   [◀ Zoom Out]              [⏩ Evolve]   │
│  ───────────────   │                                            │
│                    ├────────────────────────────────────────────┤
│  🧬 Evolving...    │                                            │
│  └ Candle (67%)    │   COMBINE: [ Drag here ] + [ Drag ] = ?   │
│                    │                                            │
└────────────────────┴────────────────────────────────────────────┘
```

### Visual Style
- **Theme:** Cosmic dark with ethereal highlights
- **Colors:** Deep space (#0a0a0f), Nebula purple (#1a0a2e), Gold accents (#ffd700)
- **Animations:** Smooth zooms, particle effects, gentle pulses
- **Typography:** Space Grotesk (headings), Inter (body)

### Key Interactions
1. **Drag + Drop** → Combine two elements
2. **Click element** → Zoom into it
3. **Click "Zoom Out"** → Return to previous level
4. **Click "Evolve"** → Start async evolution
5. **Click notification** → Watch evolution video

---

## Demo Script (2 Minutes)

### The Pitch
"Infinite Craft meets infinite depth. Everything you create has worlds inside."

### Script

```
[0:00] BLACK → Single point of light
       Text: "What if everything you created..."

[0:05] Light becomes a candle flame
       Text: "...had infinite worlds inside?"

[0:10] UI APPEARS
       Show palette, combine zone, viewport
       Narration: "Omnigenesis. Where creation never ends."

[0:15] COMBINE DEMO
       Drag Fire + Longing → "The Candle in the Window" appears
       Fast, satisfying, immediate
       Drag result + Mystery → New element appears

[0:25] ZOOM DEMO
       Click on created element
       Smooth zoom transition
       Inside: A room. A figure. Waiting.
       "Everything has something inside."

[0:35] ZOOM DEEPER
       Click on something in the room
       New scene. New elements.
       "Go as deep as you want."

[0:45] ZOOM EVEN DEEPER
       Montage: 5 quick zooms, each revealing more
       Show depth counter: 5... 8... 12...
       "There's always more."

[1:00] EVOLUTION TEASE
       Show an element with high evolution potential
       Click "Evolve"
       Modal: "This generates a video..."
       Click "Start"

[1:05] CUT TO: Evolution video playing
       (Pre-generated, edited in)
       Show millions of years passing
       Life emerging
       Civilization rising
       Temple appearing

[1:20] ZOOM INTO CIVILIZATION
       After evolution, new elements available
       Zoom into their temple
       Inside: Murals of YOU
       "They remember their creator."

[1:35] PULL BACK - SHOW SCALE
       Quick montage: All the elements created
       The depth explored
       The worlds discovered

[1:45] FINAL MESSAGE
       "Combine anything."
       "Zoom into everything."
       "Watch creation evolve."

[1:55] LOGO
       "OMNIGENESIS"
       "Where creation never ends."

[2:00] END
```

---

## Implementation Plan

### Phase 1: Core Combine (Days 1-3)
- [ ] Next.js 14 project setup
- [ ] Gemini 3 SDK integration
- [ ] Element data model
- [ ] Combine mechanic (Gemini 3 Flash + Nano Banana)
- [ ] Element palette UI
- [ ] Combine zone UI
- [ ] Basic viewport

**Deliverable:** Can combine elements, see results

### Phase 2: Zoom System (Days 4-7)
- [ ] Zoom viewport with clickable elements
- [ ] Zoom transition animations
- [ ] Scene generation on zoom
- [ ] Element discovery within scenes
- [ ] Zoom history and back navigation
- [ ] Context management
- [ ] Depth tracking

**Deliverable:** Can zoom infinitely, discover elements

### Phase 3: Evolution (Days 8-10)
- [ ] Evolve button and modal
- [ ] Veo integration
- [ ] Async job queue
- [ ] Progress indicator
- [ ] Notification system
- [ ] Video player
- [ ] Element emergence from evolution

**Deliverable:** Can evolve elements, watch videos

### Phase 4: Polish & Demo (Days 11-13)
- [ ] Visual polish (particles, glow, transitions)
- [ ] Sound effects (optional)
- [ ] Discovery stats UI
- [ ] Pre-generate demo content (10+ evolutions, 50+ zoom scenes)
- [ ] Script demo path
- [ ] Record demo video
- [ ] Edit and polish
- [ ] Submit

**Deliverable:** Submitted project

---

## Pre-Demo Checklist

### Content to Pre-Generate
- [ ] 10 evolution videos for key elements
- [ ] 50 zoom scenes along demo path
- [ ] All combination results for demo elements
- [ ] Backup images for all demo elements

### Demo Rehearsal
- [ ] Script exact click path
- [ ] Time each section
- [ ] Practice 20+ times
- [ ] Record multiple takes
- [ ] Edit best takes together

---

## Success Criteria

### For Hackathon
| Criteria | Weight | Our Answer |
|----------|--------|------------|
| Technical | 40% | Gemini 3 Flash + Nano Banana + Veo working together |
| Innovation | 30% | Infinite depth in generated content - not just images |
| Impact | 20% | Addictive game loop, infinite replayability |
| Presentation | 10% | Meta demo - video shows the product's magic |

### Win Probability
With this focused approach: **35-40%**

---

## Summary

Omnigenesis v3 is focused:

**FAST CORE:** Combine + Zoom (< 3 seconds each)
**SLOW FEATURE:** Evolve (1-2 minutes, user knows and accepts)

The game loop is:
1. Combine elements → instant gratification
2. Zoom into results → discovery and wonder
3. Occasionally evolve → epic payoff worth waiting for

The demo shows all three, with evolution edited for pacing.

This is achievable. This is focused. This can win.

---

*Version: v3 (FINAL)*
*Created: January 27, 2026*
*Status: Ready for implementation*
