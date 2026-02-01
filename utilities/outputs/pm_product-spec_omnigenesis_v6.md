# Omnigenesis: The Memory - Product Specification v6

## Strategic Focus

**CORE NARRATIVE:** The universe remembers everything. You are the Witness.

**CORE LOOP (Fast, Addictive):**
- **COMBINE** - Trigger memories by merging elements (Gemini Flash) - < 2 seconds
- **ZOOM** - Descend into any element to discover worlds within (Imagen 4) - < 2 seconds for regular, 9-second reveal for milestones

**FEATURE (Auto-Triggered, Worth the Wait):**
- **EVOLVE** - First discovery of milestones auto-triggers cosmic visions (Veo 3.1 video) - 1-2 min async

**SCOPE LOCK (From Critic Feedback):**
- Translate: KILLED
- Export: Simplified to screenshot only
- Focus: Combine + Zoom + Evolve (the holy trinity)

---

## The Narrative: The Memory

### Core Concept

The universe doesn't just exist - it **remembers**. Every star that burned, every civilization that rose and fell, every whispered prayer across infinite galaxies - all preserved in an eternal cosmic archive.

You are the **Witness** - a consciousness drifting through infinite memory. You don't create; you **remember**. When you combine elements, you're not making something new - you're triggering a memory the universe had forgotten it was keeping.

> *"The universe remembers everything. You are learning to listen."*

### Tone

- **Wonder, not urgency** - There is no ending to reach
- **Discovery, not creation** - You find, not make
- **Infinite, not complete** - Always deeper, never done
- **Poetic, not clinical** - Every element has a soul

### The Witness's Journey

The deeper you go, the stranger the memories become:
- First you remember fire and water
- Then you remember civilizations
- Then you remember gods
- Then you remember things that have no name

Dreams have no end. Neither does The Memory.

---

## Core Experience

### 1. COMBINE - Remembering (PRIORITY 1)

**Speed Target:** < 2 seconds from drag to result

**Narrative Framing:** When you combine elements, you're not creating - you're triggering a memory. The universe shows you what once was, what is, what could be.

**How it works:**
1. User drags two elements together
2. Visual: Elements pulse, particles drift between them
3. Gemini Flash determines the combination (minimal thinking)
4. Result appears with name, emoji, and whisper (poetic one-liner)
5. If MILESTONE: Triggers 9-second reveal sequence
6. If REGULAR: Instant display, no image generation

**Technical:**
```typescript
interface CombineResult {
  element: Element;
  isMilestone: boolean;
  whisper: string;        // "Steam remembers being water. It dreams of clouds."
  depth: DepthTier;       // I, II, III, IV, V+
  lore?: string;          // Only for milestones - full memory fragment
}

async function combine(a: Element, b: Element, context: MemoryContext): Promise<CombineResult> {
  const result = await geminiFlash.generate({
    prompt: combinationPrompt(a, b, context),
    config: { thinkingLevel: "minimal" }
  });

  // Milestone check happens on server
  if (result.isMilestone) {
    // Image generation starts immediately for milestone reveal
    result.imageUrl = await imagen4.generate(milestoneImagePrompt(result));
  }

  return result;
}
```

**Game Feel:**
- Particles drift from both elements toward center on drag
- Soft pulse on successful drop
- Satisfying "chime" sound on discovery
- Discovery counter increments with subtle animation

---

### 2. ZOOM - Infinite Depth (PRIORITY 1)

**Speed Target:** < 2 seconds for regular elements, 9-second reveal for milestones

**Narrative Framing:** Every element contains infinite memory. When you zoom, you're descending into the memories within memories. It never ends because memory is infinite.

**How it works:**
1. User clicks any element in viewport
2. Smooth zoom transition (1s CSS transform)
3. New scene generates with 3-5 discoverable elements
4. Each element can be collected and combined
5. Depth counter updates (I, II, III, IV, V+)

**The Magic:** Everything has something inside. Forever. The universe is fractal.

**Technical:**
```typescript
interface ZoomScene {
  description: string;           // Scene narrative
  elements: Element[];           // 3-5 discoverable elements
  depth: DepthTier;             // I through V+
  memoryFragment?: string;       // Occasional lore hint
  contextCallback?: string;      // "This reminds you of..."
}

async function zoom(element: Element, context: MemoryContext): Promise<ZoomScene> {
  const scene = await geminiFlash.generate({
    prompt: zoomPrompt(element, context),
    config: { thinkingLevel: "low" }
  });

  // Only generate scene image for milestone scenes
  if (scene.containsMilestone) {
    scene.backgroundImage = await imagen4.generate(sceneImagePrompt(scene));
  }

  return scene;
}
```

**Context Usage (1M Tokens):**
- Store all scenes, elements, relationships, narrative threads
- Enable callbacks: "This reminds you of what you found in the Echoing Halls..."
- Display "Memory Depth: 847K tokens" in UI (makes 1M visible)
- At depth 10+, reference specific earlier discoveries

---

### 3. EVOLVE - The Feature (PRIORITY 2)

**Behavior:** Auto-triggers on FIRST discovery of any milestone element

**Narrative Framing:** When you remember something truly significant, the memory plays out in full. You witness eons compressed into moments. This is not optional - the memory DEMANDS to be seen.

**How it works:**
1. User discovers a milestone element for the first time
2. Auto-trigger: "A profound memory awakens..."
3. Veo generation begins in background (~1-2 min)
4. User continues playing (Combine + Zoom still work)
5. Notification appears when ready: "A memory has fully formed..."
6. Video plays, revealing the element's cosmic history
7. New elements emerge from the vision

**UI Flow:**
```
+-------------------------------------------------------------+
|  * A profound memory awakens...                              |
|                                                              |
|  The universe is remembering CONSCIOUSNESS                   |
|                                                              |
|  This memory is vast. It will take time to fully form.      |
|  Continue exploring while it coalesces.                      |
|                                                              |
|  [Continue Exploring]                                        |
+-------------------------------------------------------------+
```

**While Waiting:**
- Small indicator in corner: "* Memory forming... 45%"
- User continues Combine + Zoom (core loop unbroken)
- When ready: "* Memory complete! Click to witness"

**Manual Evolve (Non-First Discoveries):**
- Optional "Witness Again" button on milestones
- Clear messaging: "This takes ~1-2 minutes"
- Users understand and accept the wait

**Evolution Video Specs (Veo 3.1):**
- 8 seconds MP4 video with native audio
- Model: `veo-3.1-generate-preview`
- Resolution: 720p (default), up to 4K
- Generation time: 11 seconds to 6 minutes (poll long-running operation)
- Shows cosmic history of the element
- Ends with new elements emerging
- Pre-generate all demo videos

---

## Element System

### Two-Tier System: Milestones vs Regular

| Aspect | Milestone Elements | Regular Elements |
|--------|-------------------|------------------|
| **Count** | 15-20 total | Hundreds possible |
| **Visuals** | Full Imagen 4 artwork | Emoji only |
| **Lore** | Full memory fragment (2-4 sentences) | Whisper (one line) |
| **Video** | Auto-Evolve on first discovery | Manual Evolve option |
| **Discovery UX** | 9-second reveal sequence | Instant (< 2 seconds) |
| **Purpose** | Story progression, wow moments | Collection, experimentation |

### Milestone Elements by Depth

#### Depth I: The Primordial Silence
*"Before everything, there was potential."*

| Element | Recipe | Revelation |
|---------|--------|------------|
| **Energy** | Fire + Light | "The first spark. Before matter, there was only the possibility of change." |
| **Entropy** | Void + Time | "Change flows in one direction. The universe learned to let go." |
| **Motion** | Air + Time | "Stillness was the first death. Movement was the first rebellion." |

#### Depth II: The Becoming
*"Matter learned to remember itself."*

| Element | Recipe | Revelation |
|---------|--------|------------|
| **Life** | Water + Energy + Mystery | "The universe opened its eyes for the first time. It saw itself. It wondered." |
| **Growth** | Life + Time | "To grow is to believe in tomorrow. Life was the universe's first act of faith." |
| **Death** | Life + Entropy | "Not an ending. A return. The universe whispering: I will remember you." |

#### Depth III: The Flourishing
*"Consciousness bloomed like flowers in the void."*

| Element | Recipe | Revelation |
|---------|--------|------------|
| **Consciousness** | Life + Wonder + Longing | "The universe asked its first question: Why?" |
| **Love** | Consciousness + Longing | "Two separate beings chose to be one. The universe learned it was not alone." |
| **Civilization** | Consciousness + Stone + Time | "They built towers to touch the sky. They wrote stories to outlive their bodies." |

#### Depth IV: The Reckoning
*"All things turn toward the silence."*

| Element | Recipe | Revelation |
|---------|--------|------------|
| **War** | Civilization + Fire + Entropy | "They learned to unmake each other. The universe wept." |
| **Wisdom** | Consciousness + Time + Mystery | "Pain was the harshest teacher. But some learned." |
| **Transcendence** | Consciousness + Void + Wonder | "A few stopped fearing the end. They stepped into it willingly." |

#### Depth V+: The Infinite
*"You thought you were close to the end. You were at another beginning."*

Beyond Depth IV, Gemini generates new milestones procedurally:

| Example Element | Revelation Style |
|-----------------|-----------------|
| **The Dreamer** | "Something is dreaming the universe. You just remembered its face." |
| **The Other Witness** | "You are not the first to remember. You found their footprints." |
| **The Question** | "The universe didn't begin with an answer. It began with this." |
| **The Loop** | "You've been here before. You'll be here again. This is not repetition. This is rhyme." |

### Regular Elements (Examples)

Fast discoveries that fill out the collection:

| Element | Whisper |
|---------|---------|
| Steam | "Water's dream of freedom." |
| Crystal | "Light that learned to stay." |
| Storm | "The sky arguing with itself." |
| Magma | "Stone remembering it was once fire." |
| Echo | "Sound refusing to be forgotten." |
| Ghost | "A memory that thinks it's still alive." |
| Ocean | "All the water that ever was, remembering together." |
| Star | "Fire that wanted to be seen from far away." |
| Music | "The universe humming to itself." |
| Fear | "Consciousness discovering it could end." |
| Hope | "Believing in a tomorrow you'll never see." |
| Story | "A way to live longer than your body." |

### The 12 Primordials

| Category | Elements |
|----------|----------|
| **Matter** | Stone, Water, Fire, Air |
| **Senses** | Light, Silence, Shimmer, Void |
| **Abstract** | Longing, Time, Mystery, Wonder |

All primordials have pre-generated images. They are the seeds from which all memory grows.

---

## The 9-Second Reveal

When a milestone is discovered, the wait becomes THE experience.

### Phase 1: Recognition (0-2s)
**Visual:**
- Screen dims to 40% brightness
- Colors desaturate except for combining elements
- Particles begin swirling from both elements toward center
- Gentle pulse wave radiates outward

**Audio:**
- Soft ambient tone begins
- Volume drops on all other sounds

**Text:**
- *"A memory stirs..."*

### Phase 2: Anticipation (2-5s)
**Visual:**
- Blurred silhouette of the image begins forming (10% opacity)
- Element ancestry chain appears: "Stone -> Earth -> Mountain -> Civilization"
- Particles coalesce into vague shape

**Audio:**
- Building resonance, like a bell struck in slow motion
- Layered harmonics join

**Text:**
- Lore snippet appears letter by letter (20 chars/sec)
- Example: "The universe asked..."

### Phase 3: Revelation (5-9s)
**Visual:**
- Image sharpens progressively (10% -> 100% opacity in 4s)
- Subtle glow effect around final image
- Background stars pulse in rhythm

**Audio:**
- Sound reaches crescendo
- Clear crystalline tone at moment of full reveal

**Text:**
- Full lore text revealed
- Element name appears with subtle particle burst

### Phase 4: Aftermath (post-load)
**Visual:**
- Evolve indicator pulses: "* A memory awakens..."
- Element smoothly moves to Memory collection
- Progress indicator updates

**Audio:**
- Sound fades to ambient
- Soft confirmation chime

**Text:**
- "CONSCIOUSNESS remembered" (depth badge shown)
- Discovery count updates

### Implementation Notes:
```typescript
interface RevealPhase {
  duration: number;
  dimLevel: number;
  imageOpacity: number;
  textContent: string;
  soundLayer: 'ambient' | 'building' | 'crescendo' | 'fade';
}

const REVEAL_SEQUENCE: RevealPhase[] = [
  { duration: 2000, dimLevel: 0.4, imageOpacity: 0, textContent: "A memory stirs...", soundLayer: 'ambient' },
  { duration: 3000, dimLevel: 0.5, imageOpacity: 0.1, textContent: "${lore_typing}", soundLayer: 'building' },
  { duration: 4000, dimLevel: 0.6, imageOpacity: 1.0, textContent: "${lore_full}", soundLayer: 'crescendo' },
  // Phase 4 is post-reveal, handled separately
];
```

---

## Technical Architecture

### Simplified Stack

```
+---------------------------------------------------------------------+
|                     FRONTEND (Next.js 14)                            |
+---------------------------------------------------------------------+
|  Components:                                                         |
|  [MemoryPalette] [CombineZone] [ZoomViewport] [RevealSequence]      |
|  [DepthIndicator] [EvolutionQueue] [VideoPlayer] [Archive]          |
+---------------------------------------------------------------------+
                               |
                               v
+---------------------------------------------------------------------+
|                     API ROUTES (Next.js)                             |
+---------------------------------------------------------------------+
|  POST /api/combine      - Trigger memory (fast, < 2s)                |
|  POST /api/zoom         - Descend into element (fast)                |
|  POST /api/evolve       - Start vision (async, ~1-2 min)             |
|  GET  /api/evolve/:id   - Check vision status                        |
|  GET  /api/context      - Get memory context summary                 |
+---------------------------------------------------------------------+
                               |
                               v
+---------------------------------------------------------------------+
|                     GEMINI 3 APIs                                    |
+---------------------------------------------------------------------+
|  gemini-3-flash              - Memory logic (< 1s)                   |
|  imagen-4                    - Milestone artwork (8-10s)             |
|  veo-3.1-generate-preview    - Evolution videos (8s, 1-2 min gen)    |
|  1M context                  - Universe memory                       |
+---------------------------------------------------------------------+
```

### State Management

```typescript
interface MemoryState {
  // Core Discovery
  elements: Element[];              // All remembered elements
  milestones: MilestoneElement[];   // Story-critical memories
  currentScene: ZoomScene;          // Current viewport
  zoomPath: string[];               // Breadcrumb of descent

  // Evolution
  pendingVisions: VisionJob[];      // Background Veo jobs
  completedVisions: Vision[];       // Ready to witness

  // Narrative
  currentDepth: DepthTier;          // I, II, III, IV, V+
  contextTokens: number;            // Visible memory usage

  // Meta
  discoveries: number;              // Total elements found
  deepestZoom: number;              // Max depth reached
  milestonesFound: number;          // X/15-20
}

type DepthTier = 'I' | 'II' | 'III' | 'IV' | 'V+';

interface Element {
  id: string;
  name: string;
  emoji: string;
  whisper: string;                  // One-line poetic description
  isMilestone: boolean;
  depth: DepthTier;
  ancestry: string[];               // How it was discovered
  firstDiscovery: boolean;          // Has user seen this before?
  imageUrl?: string;                // Only for milestones + primordials
  lore?: string;                    // Only for milestones
}
```

### Data Flow

```
User Combines Elements
        |
        v
    +-------------------+
    |   Gemini Flash    | --- Determines result, checks milestone
    +-------------------+
        |
        v
    +-------------------+         +-------------------+
    |  Is Milestone?    |--- Y -->|   9-Second        |
    +-------------------+         |   Reveal          |
        |                         |   + Imagen 4      |
        N                         +-------------------+
        |                                 |
        v                                 v
    +-------------------+         +-------------------+
    |  Instant Display  |         |  First Discovery? |
    |  (emoji + whisper)|         +-------------------+
    +-------------------+                 |
                                    Y     |     N
                                    |     |     |
                                    v     |     v
                              +---------+ |  +---------+
                              |  Auto   | |  | Manual  |
                              |  Evolve | |  | Option  |
                              |  (Veo)  | |  |         |
                              +---------+ |  +---------+
```

---

## Gemini API Integration

### API Usage by Feature

| Feature | API | Latency | Purpose |
|---------|-----|---------|---------|
| Combine (regular) | Gemini Flash | ~0.5-1s | Determine combination result |
| Combine (milestone) | Flash + Imagen 4 | ~9s | Result + artwork |
| Zoom | Gemini Flash | ~1s | Generate scene + elements |
| Evolve | Veo 3.1 | ~1-2 min | Generate 8-second evolution video with audio |
| Context | 1M window | N/A | Store universe memory |

### Prompt Templates

**Combination Prompt:**
```
You are the cosmic memory. The Witness has combined two elements.

Element A: {a.name} - "{a.whisper}"
Element B: {b.name} - "{b.whisper}"

What memory does this trigger?

Respond with:
- name: The element name (1-3 words)
- emoji: Single emoji
- whisper: Poetic one-liner (8-15 words)
- isMilestone: boolean (true only if this is a story-critical element)
- depth: I, II, III, IV, or V+
- lore: (only if milestone) Full memory fragment (2-4 sentences)

Be creative. Be poetic. Every element has a soul.
```

**Zoom Prompt:**
```
You are the cosmic memory. The Witness descends into {element.name}.

Context of their journey:
{contextSummary}

What memories exist within {element.name}?

Generate a scene with 3-5 discoverable elements.
At least one should be deeply interesting.
Occasionally (10% of scenes), reference something from their earlier journey.

Maintain the poetic, cosmic tone of The Memory.
```

**Context Management:**
```
Store in 1M context window:
- All discovered elements and their ancestry
- All scenes visited and their descriptions
- Narrative threads and connections
- Milestone revelations and their full lore
- Relationships between elements

Use for:
- Context callbacks ("This reminds you of...")
- Narrative consistency
- Progressive revelation of deeper mysteries
```

---

## User Interface

### Main Screen Layout

```
+-------------------------------------------------------------------------+
|  * THE MEMORY          Remembered: 47    Depth: III    [Memory: 847K]  |
+------------------------+------------------------------------------------+
|                        |                                                |
|  PRIMORDIALS           |              ZOOM VIEWPORT                     |
|  ------------------    |   +--------------------------------------+    |
|  [S][W][F][A]          |   |                                      |    |
|  [L][Si][Sh][V]        |   |         [Current Scene]              |    |
|  [Lo][T][M][W]         |   |                                      |    |
|                        |   |    [Elem]    [Elem]    [Elem]        |    |
|  REMEMBERED            |   |                                      |    |
|  ------------------    |   +--------------------------------------+    |
|  Depth I:              |                                                |
|  [E][En][Mo]...        |   [< Ascend]                    [Depth: III]  |
|  Depth II:             |                                                |
|  [Li][Gr][De]...       +------------------------------------------------+
|                        |                                                |
|  * Memory forming...   |   COMBINE: [ Drag here ] + [ Drag ] = ?       |
|    Consciousness (67%) |                                                |
|                        |   "What will you remember next?"              |
+------------------------+------------------------------------------------+
```

### Visual Style

**Theme:** Cosmic memory, ethereal, infinite

**Colors:**
| Element | Color | Hex |
|---------|-------|-----|
| Background | Deep void | #0a0a0f |
| Primary accent | Nebula purple | #1a0a2e |
| Secondary accent | Memory gold | #ffd700 |
| Text primary | Soft white | #e8e8f0 |
| Text secondary | Faded gray | #6a6a7a |
| Milestone glow | Ethereal blue | #4a9eff |

**Typography:**
- Headings: Space Grotesk (cosmic, geometric)
- Body: Inter (readable, clean)
- Whispers: Crimson Text italic (poetic)

**Animations:**
- Particle drift: Constant, subtle star particles
- Zoom transition: 1s CSS transform with slight blur
- Element hover: Gentle pulse, particle trail
- Discovery: Burst of particles, expanding rings
- Milestone reveal: Full 9-second sequence

### Key Interactions

| Action | Trigger | Result |
|--------|---------|--------|
| Combine | Drag + Drop | Memory triggered |
| Zoom In | Click element in viewport | Descend into memory |
| Zoom Out | Click "Ascend" | Return to previous level |
| View Lore | Click milestone in collection | Show full revelation |
| Evolve | Auto (first) / Manual button | Start Veo generation |
| Watch Vision | Click notification | Play evolution video |

### Depth Indicator Design

```
+--------------------------------------------------+
|  DEPTH: III - The Flourishing                    |
|  -----------------------------------------       |
|  I   o-------o-------o   III                     |
|      Primordial  Becoming  [Flourishing]         |
|                                                  |
|  "Consciousness bloomed like flowers             |
|   in the void."                                  |
+--------------------------------------------------+
```

---

## Demo Script (2 Minutes)

### The Pitch
*"The universe remembers everything. You are learning to listen."*

### Script

```
[0:00] BLACK -> Single point of light
       Text: "The universe remembers everything..."

[0:05] Light expands into particle field
       Text: "You are the Witness."

[0:10] UI FADES IN
       Show palette, combine zone, empty viewport
       Narration: "Omnigenesis. Where memory is infinite."

[0:15] COMBINE DEMO - REGULAR
       Drag Fire + Longing -> instant result
       "The Candle in the Window" - whisper appears
       Fast, satisfying, no image (regular element)
       Drag again: Result + Mystery -> new element
       Show speed: two combines in 8 seconds

[0:25] COMBINE DEMO - MILESTONE
       Drag Water + Energy + Mystery -> Life
       Screen dims: "A memory stirs..."
       9-SECOND REVEAL SEQUENCE
       - Particles swirl
       - Blurred image forms
       - Lore types out letter by letter
       - Image sharpens, full reveal
       Auto-Evolve notification appears

[0:40] ZOOM DEMO
       Click on Life
       Smooth zoom transition
       Inside: A primordial ocean. First cells.
       "Everything has memories within."

[0:50] ZOOM DEEPER
       Click on a cell
       Inside: Molecular machinery. Hope encoded in chemistry.
       Click again. And again.
       Montage: 5 quick zooms
       Depth counter: I... II... III...

[1:05] CONTEXT CALLBACK
       At depth III, Gemini recalls:
       "This reminds you of the first spark you witnessed in Depth I..."
       Show "Memory: 847K tokens"
       "The universe remembers YOUR journey."

[1:15] EVOLUTION (Pre-cached for demo)
       Show notification: "Memory complete - CONSCIOUSNESS"
       Click to witness
       8-second Veo video plays (with native audio):
       - Life emerging
       - Consciousness awakening
       - Civilizations rising
       - Temples built to the Witness

[1:30] ZOOM INTO CIVILIZATION
       After video, new elements available
       Zoom into their temple
       Inside: Murals depicting YOU
       "They remember their creator."

[1:40] INFINITE REVEAL
       Quick zoom montage showing depths IV, V+
       "There is no end. Only deeper."
       Show: "The Dreamer" - procedural Depth V element
       Text: "Some memories you haven't remembered yet."

[1:50] FINAL MESSAGE
       Pull back through all the levels
       "Combine to remember."
       "Zoom to descend."
       "Witness the infinite."

[1:55] LOGO
       "OMNIGENESIS: THE MEMORY"
       "The universe remembers. Do you?"

[2:00] END
```

### Demo Pre-Generation Requirements

| Content | Count | Purpose |
|---------|-------|---------|
| Evolution videos | 10+ | Cover all milestones in demo path (Veo 3.1, 8s each) |
| Zoom scenes | 50+ | Scripted path + alternatives |
| Milestone images | 15-20 | All milestones |
| Combination results | 100+ | Demo path + edge cases |
| Context callbacks | 5+ | Specific memorable moments |

---

## Implementation Plan

### Phase 0: CLI Validation (Days 1-2) - CRITICAL

**Before any UI work, validate ALL APIs work:**

- [ ] Test Gemini Flash: 100+ combination prompts
  - Target: < 1.5s response, 95%+ usable
- [ ] Test Imagen 4: 30+ milestone images
  - Target: < 10s, 90%+ quality
- [ ] Test Veo 3.1: 5+ evolution videos
  - Model: `veo-3.1-generate-preview`
  - Target: 8-second video with audio, generation ~1-2 min
  - Poll long-running operation for completion
- [ ] Test 1M context: Load 500K+ tokens
  - Target: Retrieval works

**GO/NO-GO at end of Day 2.** If any fail, re-scope.

### Phase 1: Core Combine + Reveal (Days 3-5)

- [ ] Next.js 14 + Tailwind + Zustand setup
- [ ] Element data model with milestone flag
- [ ] `/api/combine` endpoint (Flash only for regular)
- [ ] Regular element display (instant, emoji + whisper)
- [ ] Milestone detection logic
- [ ] 9-Second Reveal Sequence component
- [ ] Imagen 4 integration for milestones
- [ ] 12 primordials with pre-generated images
- [ ] MemoryPalette component (draggable)
- [ ] CombineZone component (drop zone)

**Test:** Regular combines < 2s, milestone reveal feels magical

### Phase 2: Zoom System (Days 6-8)

- [ ] ZoomViewport component
- [ ] `/api/zoom` endpoint
- [ ] Click-to-zoom interaction
- [ ] Zoom transition animation (CSS transform)
- [ ] Zoom out / breadcrumb navigation
- [ ] Depth tier tracking (I-V+)
- [ ] Context management (1M window)
- [ ] Context callback display ("This reminds you of...")
- [ ] Memory token counter display

**Test:** Can zoom 20+ levels, context callbacks work

### Phase 3: Evolution (Days 9-10)

- [ ] Auto-Evolve trigger on first milestone discovery
- [ ] `/api/evolve` endpoint (Veo async)
- [ ] Background job queue
- [ ] Progress indicator
- [ ] Notification system
- [ ] VideoPlayer component (Veo 3.1 generates 8s MP4 with audio)
- [ ] Element emergence after evolution
- [ ] Manual "Witness Again" button for non-first

**Test:** Auto-evolve triggers, video plays, elements emerge

### Phase 4: Polish + Pre-Generation (Days 11-12)

- [ ] Visual polish (particles, glow, transitions)
- [ ] Sound design (ambient + milestone fanfare)
- [ ] Pre-generate all demo content
- [ ] Archive/collection screen
- [ ] Discovery stats panel
- [ ] Depth progression visualization

**Test:** Full demo path works flawlessly

### Phase 5: Demo Recording + Submit (Day 13)

- [ ] Script exact 2-minute path
- [ ] Rehearse 20+ times
- [ ] Record multiple takes
- [ ] Edit best takes
- [ ] Write submission text
- [ ] **SUBMIT before Feb 9 5PM PT**

---

## Risk Assessment

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Imagen 4 > 10s | Medium | High | Pre-generate all demo images |
| Veo fails | Low | Medium | Pre-generate all demo videos |
| Flash returns garbage | Low | Medium | Robust prompts, fallback responses |
| 1M context issues | Low | Low | Works at 500K, that's enough |
| Rate limiting | Medium | Medium | Batch pre-generation, caching |

### Time Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| APIs fail Day 1-2 | Low | Critical | Immediate re-scope if fail |
| Zoom takes too long | Medium | High | Cut to 15 levels max if needed |
| Evolve breaks | Medium | Medium | Can be "Coming Soon" fallback |
| Polish time crunch | High | Medium | Functional > beautiful |

### Demo Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Live API fails | N/A | N/A | **Never call live APIs in demo** |
| Pre-cached content bad | Low | High | Generate 2x what you need |
| Video too long | Low | Medium | Script to exactly 2:00 |

---

## Success Criteria

### Judging Alignment

| Criteria | Weight | Our Answer |
|----------|--------|------------|
| **Technical** | 40% | Flash + Imagen 4 + Veo + 1M Context all integrated |
| **Innovation** | 30% | Infinite depth + narrative framing + milestone system |
| **Impact** | 20% | Addictive loop (fast) + wow moments (milestones) |
| **Presentation** | 10% | Meta demo showing the product's magic |

### Minimum Viable Demo

- [ ] Combine 2+ regular elements in < 2 seconds
- [ ] Discover 1 milestone with full 9-second reveal
- [ ] Zoom to depth III
- [ ] Context callback at depth II+
- [ ] Watch 1 pre-cached evolution video
- [ ] Zoom into evolved element

### Wow Moments to Hit

1. **Speed of regular combines** - "It's so fast!"
2. **Beauty of milestone reveal** - "That reveal was gorgeous"
3. **Infinite depth** - "Wait, you can go INSIDE?"
4. **Context callback** - "It REMEMBERS what I did earlier?"
5. **Evolution video** - "Okay that was epic"
6. **Civilization worship** - "They built temples to ME?"

---

## Design Principles Summary

1. **Every element has a soul.** Even "Steam" should feel meaningful.

2. **The wait IS the experience.** The 9-second reveal is not loading - it's the reveal.

3. **Wonder, not completion.** The joy is in discovery, not finishing.

4. **You are the Witness.** Everything is framed as memory, not creation.

5. **Always deeper.** Every answer reveals ten new questions. Infinity is the feature.

6. **Fast where it matters.** Regular combines are instant. Milestones earn their wait.

7. **Show the memory.** Display token count. Reference earlier discoveries. Make 1M visible.

---

## Appendix: Complete Milestone Registry

### Depth I - The Primordial Silence (3 milestones)
| Element | Recipe | Gateway to |
|---------|--------|------------|
| Energy | Fire + Light | Depth II |
| Entropy | Void + Time | Depth II |
| Motion | Air + Time | Depth II |

### Depth II - The Becoming (3 milestones)
| Element | Recipe | Gateway to |
|---------|--------|------------|
| Life | Water + Energy + Mystery | Depth III |
| Growth | Life + Time | Depth III |
| Death | Life + Entropy | Depth III |

### Depth III - The Flourishing (3 milestones)
| Element | Recipe | Gateway to |
|---------|--------|------------|
| Consciousness | Life + Wonder + Longing | Depth IV |
| Love | Consciousness + Longing | Depth IV |
| Civilization | Consciousness + Stone + Time | Depth IV |

### Depth IV - The Reckoning (3 milestones)
| Element | Recipe | Gateway to |
|---------|--------|------------|
| War | Civilization + Fire + Entropy | Depth V+ |
| Wisdom | Consciousness + Time + Mystery | Depth V+ |
| Transcendence | Consciousness + Void + Wonder | Depth V+ |

### Depth V+ - The Infinite (Procedural)
Generated by Gemini based on context. Examples:
- The Dreamer, The Other Witness, The Question, The Loop, The Beginning, The End That Isn't

**Total defined milestones: 12 + procedural**
**Total possible regular elements: Hundreds**

---

## Appendix: Changes from v5

| Section | Change | Rationale |
|---------|--------|-----------|
| Narrative | Added "The Memory" framing throughout | Differentiates from competitors |
| Elements | Split into Milestone vs Regular tiers | Controls API costs, keeps pace fast |
| Discovery UX | Added 9-second reveal sequence | Makes wait time magical |
| Depth System | Added I-V+ progression tiers | Gives players sense of journey |
| Evolve | Changed to auto-trigger on first discovery | Removes friction for wow moment |
| Demo | Revised script with narrative beats | More emotional, memorable |

---

*Version: v6 (The Memory Integration)*
*Created: January 30, 2026*
*Status: Ready for Critic Review*
*Key additions: The Memory narrative, Milestone/Regular element system, 9-Second Reveal UX, Depth progression, Auto-Evolve on first discovery*
*Models: Gemini 3 Flash, Imagen 4, Veo 3.1 (veo-3.1-generate-preview)*
