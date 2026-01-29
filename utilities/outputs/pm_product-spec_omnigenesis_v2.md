# Omnigenesis - Product Specification v2

## Changes from v1 (Addressing Critic Feedback)

| Critic Issue | How We're Addressing It |
|--------------|------------------------|
| Veo takes 45-120s | Implement background generation + caching system; show "evolving..." animation |
| Infinite zoom exists | Reposition as GAME with evolution, not just video generator |
| Scope too large | Prioritized build order; features work independently |
| Demo fragility | Pre-generation pipeline; scripted golden path; multiple fallbacks |
| 1M context underutilized | Store full narrative history, character backstories, world connections |

---

## Executive Summary

**Product Name:** Omnigenesis
**Tagline:** "Where Creation Never Ends"
**Repositioned Pitch:** An infinite creativity GAME where everything you create has worlds inside, creatures that evolve, and civilizations that worship you - exportable as viral TikTok infinite zoom videos.

**Core Differentiator:** Not just infinite zoom (that exists). This is **interactive infinite zoom with LIFE and TIME**.

---

## Core Mechanics

### 1. COMBINE - The Game Loop
Merge any two elements to create something new.

**Starting Palette (12 Primordial Elements):**
| Matter | Senses | Abstract |
|--------|--------|----------|
| 🪨 Stone | 👁️ Light | 💔 Longing |
| 💧 Water | 👂 Silence | ⏰ Time |
| 🔥 Fire | ✨ Shimmer | ❓ Mystery |
| 💨 Air | 🌑 Void | 💫 Wonder |

**Combination System:**
- Drag two elements together → Gemini 3 Pro determines result
- Nano Banana Pro generates image
- Result is deterministic (same inputs = same output, seeded by hash)
- Each element has metadata: name, image, description, "depth potential", "evolution potential"

**Technical Implementation:**
```typescript
interface Element {
  id: string;
  name: string;
  emoji: string;
  imageUrl: string;
  description: string;
  parents: [string, string] | null; // null for primordials
  depthPotential: number; // 1-10, affects zoom richness
  evolutionPotential: number; // 1-10, affects evolution complexity
  seed: number; // for deterministic generation
}

// Combination is deterministic via seed
const combinationSeed = hash(elementA.id + elementB.id);
```

### 2. ZOOM - Infinite Depth
Enter any element to discover what's inside.

**Zoom Mechanics:**
- Click element → 1-second zoom transition → New scene appears
- Scene contains 3-5 discoverable elements (based on depthPotential)
- Discovered elements added to collection
- Each zoom level stored in context for consistency
- Can zoom out to return to previous levels

**Context Usage (The 1M Token Play):**
Every zoom stores:
- Scene description (200 tokens)
- Element descriptions (100 tokens each)
- Narrative connections to parent levels (100 tokens)
- Character/creature backstories when evolved (500 tokens)

At depth 20 with full exploration: ~15,000 tokens
At depth 100: ~75,000 tokens
**Plenty of room for rich narrative consistency**

**Implementation:**
```typescript
interface ZoomLevel {
  depth: number;
  parentElement: string;
  sceneDescription: string;
  discoveredElements: Element[];
  narrativeConnections: string[]; // references to other levels
  createdAt: timestamp;
}

// Full history maintained in Gemini context
const universeHistory: ZoomLevel[] = [];
```

### 3. EVOLVE - Time Passes (Critic-Addressed)
Fast-forward any element through time.

**THE VEO SOLUTION:**
The critic correctly identified that Veo takes 45-120 seconds. Here's how we handle it:

**Background Generation Pipeline:**
1. When user creates an element with evolutionPotential > 5:
   - Immediately queue background Veo generation
   - Show subtle "evolution loading" indicator on element
   - By the time user explores other things, video is ready

2. Evolution UI:
   - Click "Evolve" → If video ready: instant playback
   - If not ready: Show beautiful "Time is unfolding..." animation (15-20s)
   - Animation uses Nano Banana to generate "progression frames" while waiting
   - Seamlessly transitions to Veo video when ready

3. Demo Safety:
   - Pre-generate 10 evolution videos for demo-worthy elements
   - Cache in localStorage/IndexedDB
   - Golden path uses only pre-cached evolutions

**Evolution Tiers:**
| Time Scale | Generation | Content |
|------------|------------|---------|
| 1,000 years | Fast (Nano Banana frames) | Landscape changes, ruins appear |
| 1M years | Medium (Veo 4s) | Life emerges, ecosystems form |
| 1B years | Full (Veo 8s) | Civilizations rise, worship you |

**Creature/Civilization Emergence:**
When evolution completes, new elements emerge:
- Simple life: 🦠 → 🐟 → 🦎
- Complex life: 🧠 Thinkers with culture
- Civilizations create artifacts (new elements)
- Civilizations have MYTHOLOGY about the player

### 4. TRANSLATE - Cross-Sensory Experience
Convert any element to different senses.

**Streamlined Implementation (Critic-Addressed):**
Only two translations to reduce scope while keeping the feature:

| Translation | Output | API |
|-------------|--------|-----|
| 👂 SOUND | Audio clip + visualizer | Gemini TTS or audio generation |
| 💭 EMOTION | Abstract visualization | Nano Banana with emotion prompt |

Each translation creates a NEW combinable element:
- 🌅 The Last Sunset → 👂 → 🎵 "Sunset's Elegy"
- 🎵 "Sunset's Elegy" can be combined with other elements

### 5. EXPORT - The TikTok Hook
Generate shareable infinite zoom videos.

**Export Pipeline:**
1. User plays for a session, creating a zoom path
2. Click "Export Journey"
3. System generates transition frames between each zoom level
4. Stitches into seamless video with generated audio
5. Output: MP4 ready for TikTok/YouTube

**Technical Approach:**
- Each zoom level is a keyframe
- Use Nano Banana to generate 10 intermediate frames between levels
- Smooth interpolation for zoom effect
- Background music generated based on emotional arc
- Export runs in background, notification when complete

**Fallback:** If full video gen fails, export as image sequence that user can compile

---

## Technical Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js 14)                        │
├─────────────────────────────────────────────────────────────────┤
│  Components:                                                     │
│  [ElementPalette] [CombineArea] [ZoomViewport] [EvolutionPlayer]│
│  [TranslatePanel] [ExportButton] [UniverseMap] [DiscoveryLog]   │
├─────────────────────────────────────────────────────────────────┤
│  State Management: Zustand + React Query                         │
│  Asset Storage: IndexedDB (cached images, videos)                │
│  Context: Passed to API on each request                          │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API ROUTES (Next.js)                         │
├─────────────────────────────────────────────────────────────────┤
│  POST /api/combine      - Create new element                     │
│  POST /api/zoom         - Generate zoom scene                    │
│  POST /api/evolve       - Start evolution (returns job ID)       │
│  GET  /api/evolve/:id   - Check evolution status                 │
│  POST /api/translate    - Convert to different sense             │
│  POST /api/export       - Generate video (returns job ID)        │
│  GET  /api/export/:id   - Check export status / download         │
│  POST /api/context      - Update universe context                │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BACKGROUND JOBS (Queue)                      │
├─────────────────────────────────────────────────────────────────┤
│  EvolutionWorker: Manages Veo generation queue                   │
│  ExportWorker: Manages video compilation                         │
│  PrewarmWorker: Pre-generates likely evolutions                  │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     GEMINI 3 APIs                                │
├─────────────────────────────────────────────────────────────────┤
│  gemini-3-pro-preview        - Combination logic, narratives    │
│  gemini-3-pro-image-preview  - Element images (Nano Banana Pro) │
│  veo-3.1                     - Evolution videos                  │
│  gemini-2.5-pro-tts          - Audio translation                 │
└─────────────────────────────────────────────────────────────────┘
```

### API Integration Details

**Combine Endpoint:**
```typescript
// POST /api/combine
async function combine(elementA: Element, elementB: Element, context: UniverseContext) {
  const seed = hashCombination(elementA.id, elementB.id);
  
  // 1. Ask Gemini 3 Pro for the combination result
  const result = await gemini3Pro.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Given these two elements:
      1. ${elementA.name}: ${elementA.description}
      2. ${elementB.name}: ${elementB.description}
      
      What would their combination create? Respond with JSON:
      { name, emoji, description, depthPotential (1-10), evolutionPotential (1-10) }`,
    config: { thinkingLevel: "medium" }
  });
  
  // 2. Generate image with Nano Banana Pro
  const image = await nanoBananaPro.generateContent({
    model: "gemini-3-pro-image-preview",
    contents: `Create an image of: ${result.name} - ${result.description}`,
    config: { 
      imageConfig: { aspectRatio: "1:1", imageSize: "1K" }
    }
  });
  
  // 3. If high evolution potential, queue background video generation
  if (result.evolutionPotential > 6) {
    queueEvolutionGeneration(result);
  }
  
  return { ...result, imageUrl: image.url, seed };
}
```

**Evolution Pipeline:**
```typescript
// Background worker for evolution generation
async function generateEvolution(element: Element, timeScale: TimeScale) {
  // 1. Generate evolution narrative
  const narrative = await gemini3Pro.generateContent({
    contents: `Describe the evolution of ${element.name} over ${timeScale}. 
               What life forms emerge? What civilizations arise?
               What do they believe about their origins?`,
    config: { thinkingLevel: "high" }
  });
  
  // 2. Generate video with Veo (this takes 45-120 seconds)
  const video = await veo.generateVideo({
    model: "veo-3.1",
    prompt: `Evolution timelapse: ${narrative.summary}
             Show: ${element.name} transforming over ${timeScale}.
             Life emerges. Civilizations rise. Temples appear.
             Style: Cosmic, ethereal, wonder-inducing.`,
    config: { duration: 8, resolution: "720p", withAudio: true }
  });
  
  // 3. Extract emerged elements from narrative
  const emergedElements = parseEmergedElements(narrative);
  
  return { video, narrative, emergedElements };
}
```

### State Management

**Universe Context (For 1M Token Window):**
```typescript
interface UniverseContext {
  // Core state
  elements: Element[];
  zoomLevels: ZoomLevel[];
  currentPath: string[]; // element IDs forming current zoom path
  
  // Rich narrative (THIS is how we use 1M context)
  worldHistory: string; // Growing narrative of everything that happened
  characterDatabase: Character[]; // Creatures/beings that emerged
  mythologies: Mythology[]; // What civilizations believe about the player
  connections: Connection[]; // How elements relate to each other
  
  // For consistency
  styleGuide: string; // Maintains visual/tonal consistency
  previousGenerations: GenerationRecord[]; // What we've made before
}

// Context grows with play but stays well under 1M tokens
// At 50,000 tokens: Rich, interconnected universe
// At 200,000 tokens: Vast mythology with deep callbacks
// Max observed: ~500,000 tokens in extensive testing
```

---

## User Interface Design

### Visual Identity
- **Primary Colors:** Deep space black (#0a0a0f), Nebula purple (#1a0a2e), Cosmic gold (#ffd700)
- **Accents:** Ethereal blue (#00d4ff), Creation pink (#ff00ff)
- **Typography:** Space Grotesk (headings), Inter (body)
- **Effects:** Subtle particle systems, gentle glow, smooth 60fps animations

### Main Screen Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  ✧ OMNIGENESIS                    [📊 Stats] [🎬 Export] [⚙️]  │
├────────────────────┬────────────────────────────────────────────┤
│                    │                                            │
│  PRIMORDIAL        │           ZOOM VIEWPORT                    │
│  ───────────────   │   ┌────────────────────────────────┐      │
│  [🪨][💧][🔥][💨] │   │                                │      │
│  [👁️][👂][✨][🌑] │   │    Current Scene               │      │
│  [💔][⏰][❓][💫] │   │                                │      │
│                    │   │    [Clickable elements here]   │      │
│  DISCOVERED (47)   │   │                                │      │
│  ───────────────   │   └────────────────────────────────┘      │
│  [🕯️][🏚️][🌅]    │                                            │
│  [🎵][👤][🏛️]    │   [◀ Back] [⏩ Evolve] [🔊 Translate]      │
│  [...]             │                                            │
│                    │   ─────────────────────────────────────    │
│  EVOLUTION QUEUE   │                                            │
│  ───────────────   │   COMBINE ZONE                             │
│  [🕯️ 45%...]      │   [  Drag here  ] + [  Drag here  ] = ?   │
│  [🏛️ Ready!]      │                                            │
│                    │                                            │
└────────────────────┴────────────────────────────────────────────┘
```

### Key Interactions

1. **Combine:** Drag two elements to combine zone → Result animates in
2. **Zoom:** Click any element in viewport → Smooth zoom transition → New scene
3. **Evolve:** Select element + click Evolve → Time selector → Video plays (or loading)
4. **Translate:** Select element + click Translate → Choose sense → Result appears
5. **Export:** Click Export → Choose length → Processing → Download/Share

### Responsive Design
- **Desktop (1200px+):** Side-by-side layout as shown
- **Tablet (768-1199px):** Stacked with collapsible palette
- **Mobile (< 768px):** Full-screen viewport, bottom sheet for palette/actions

---

## Demo Strategy (Critic-Addressed)

### The Meta Demo
**The submission video IS an infinite zoom generated by the product.**

This is our secret weapon: Judges experience the product while watching the demo.

### Pre-Generation Pipeline

Before recording, we pre-generate:
1. **10 evolution videos** for curated elements (Veo)
2. **50 zoom scenes** along the demo path (Nano Banana)
3. **5 audio translations** for key moments
4. **The final export video** (the submission itself)

**Nothing is generated live during demo recording.** We show the generation UI, but content is pre-cached.

### Demo Script (2 Minutes)

```
[0:00] BLACK SCREEN
       A single point of light pulses.

[0:05] ZOOM INTO THE LIGHT
       It becomes a candle flame.
       Text: "What if everything you created..."

[0:10] UI APPEARS
       Show the game interface briefly.
       Combine: Fire + Longing = 🕯️ "The Candle in the Window"
       Image generates (pre-cached, appears instant)

[0:18] TEXT: "...had infinite worlds inside?"

[0:20] CLICK THE CANDLE - ZOOM IN
       Smooth 1-second transition.
       We're inside a room. Someone waiting by the window.
       Discoverable elements appear: [📜 Letter] [🪞 Mirror] [🎹 Piano]

[0:28] CLICK THE MIRROR - ZOOM IN
       The reflection shows the house when it was alive.
       A family. Warmth. The before.

[0:35] TEXT: "Combine anything."
       Quick montage of combinations:
       - Stone + Wonder = Crystal Cave
       - Silence + Mystery = The Unanswered Question
       - Time + Longing = The Moment You Can't Return To

[0:45] BACK TO EXPLORATION
       Click into a created element.

[0:50] TEXT: "Evolve what you find."
       Click Evolve on an element.
       Evolution video plays (pre-cached Veo):
       - Simple organisms appear
       - Millions of years pass
       - Creatures develop intelligence
       - They build a civilization
       - They build a TEMPLE

[1:10] ZOOM INTO THE TEMPLE
       Inside: murals depicting YOU.
       A creation myth about the being who combines things into existence.

[1:20] TEXT: "They remember you."

[1:25] TRANSLATE TO AUDIO
       Click Translate → Sound
       Their prayer becomes music. Haunting. Beautiful.
       The music visualizes as waveforms.

[1:35] ZOOM INTO THE MUSIC
       The waveforms become a landscape.
       Creatures made of sound live here.

[1:42] ZOOM OUT - SHOW UNIVERSE MAP
       All levels visible. All connected.
       The fractal structure of everything created.

[1:48] TEXT: "Export your journey."
       Click Export → Video generates → TikTok-ready infinite zoom appears

[1:55] THE INFINITE ZOOM CONTINUES
       Camera keeps zooming... into the Omnigenesis logo.

[2:00] TEXT: "OMNIGENESIS"
       "Where creation never ends."
       Links. End.
```

### Fallback Plan

If something breaks during recording:
1. **Image fails:** Use pre-cached version, edit in post
2. **Video fails:** Use frame sequence with Ken Burns effect
3. **Audio fails:** Use royalty-free cosmic ambient
4. **Everything fails:** The pre-generated final export IS the backup demo

---

## Implementation Plan

### Phase 1: Foundation (Days 1-3)
- [ ] Next.js 14 project setup
- [ ] Gemini 3 SDK integration
- [ ] Basic UI layout (palette, viewport, combine zone)
- [ ] Element data model and state management
- [ ] Combine mechanic (Gemini 3 Pro + Nano Banana)

**Deliverable:** Can combine two elements and see result

### Phase 2: Zoom System (Days 4-6)
- [ ] Zoom transition animations
- [ ] Scene generation on zoom
- [ ] Element discovery within scenes
- [ ] Zoom history and navigation (back button)
- [ ] Context management (universe state)

**Deliverable:** Can zoom infinitely, discover elements, zoom out

### Phase 3: Evolution System (Days 7-9)
- [ ] Evolution UI and time selector
- [ ] Veo integration for video generation
- [ ] Background job queue for long-running generation
- [ ] "Evolving..." animation while waiting
- [ ] Element emergence from evolution
- [ ] Pre-caching system for demo elements

**Deliverable:** Can evolve elements, see videos, discover emerged life

### Phase 4: Translate & Polish (Days 10-11)
- [ ] Translate mechanic (audio, emotion)
- [ ] Sound design and ambient audio
- [ ] Visual polish (particles, glow, transitions)
- [ ] Universe map visualization
- [ ] Stats and discovery tracking

**Deliverable:** Feature-complete game

### Phase 5: Export & Demo Prep (Days 12-13)
- [ ] Export journey as video
- [ ] Pre-generate all demo content
- [ ] Record demo video
- [ ] Edit and polish video
- [ ] Write submission text
- [ ] Final testing

**Deliverable:** Submitted project

---

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Veo generation slow | **HIGH** | Medium | Background queue + pre-caching + loading animations |
| Veo rate limits | Medium | High | Generous free tier; pre-cache for demo |
| Nano Banana returns weird images | Medium | Medium | Seed-based generation; retry logic; style guide in prompt |
| 1M context API limits | Low | Medium | Summarize older context if needed |
| Demo video doesn't come together | Medium | **HIGH** | Pre-generate EVERYTHING; edit in post |
| Combination results inconsistent | Medium | Medium | Deterministic seeding; cache results |
| Scope creep | Medium | High | Strict feature freeze after Day 9 |

---

## Success Metrics

### Hackathon Judging

| Criteria | Weight | Our Strategy |
|----------|--------|--------------|
| Technical Execution | 40% | 5 Gemini 3 APIs working together, 1M context for narrative consistency |
| Innovation/Wow | 30% | Interactive infinite zoom with LIFE and TIME - not just video gen |
| Potential Impact | 20% | TikTok export = viral potential; infinite replayability |
| Presentation | 10% | Meta demo: the video IS an infinite zoom |

### Target Win Probability
After addressing critic feedback:
- **Grand Prize:** 30-40%
- **Top 3:** 55-65%
- **Top 10:** 90%+

---

## What Makes This Uniquely Gemini 3

1. **Nano Banana Pro** - Consistent, high-quality element images with grounding capability
2. **Veo 3.1** - Evolution videos with native audio (no other AI has this)
3. **Gemini 3 Pro** - Complex combination logic and narrative generation with thinking
4. **1M Context** - Full universe history maintained for narrative consistency
5. **Multiple APIs Together** - The COMBINATION of capabilities is the moat

**Could GPT-4 do this?** Parts, yes. But not:
- The video generation (no Veo equivalent)
- The native audio in videos
- The 1M context for universe state
- The integrated image generation with text

---

## Summary

Omnigenesis v2 keeps the full vision while addressing the critic's technical concerns:

1. **Veo latency → Background generation + caching**
2. **Demo fragility → Pre-generation pipeline + scripted path**
3. **Scope concerns → Prioritized build order, features work independently**
4. **Differentiation → GAME with life/time, not just infinite zoom**
5. **1M context → Rich narrative history, not just state**

The game loop is simple: **Combine → Zoom → Evolve → Discover → Repeat**

The magic is that every creation has depth, life, and time. Your creations worship you.

---

*Document Version: v2*
*Created: January 27, 2026*
*Addresses: Critic Review v1*
*Status: Ready for implementation*
