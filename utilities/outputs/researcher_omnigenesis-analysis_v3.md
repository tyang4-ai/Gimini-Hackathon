# Market Research: Omnigenesis FINAL v3

## Executive Summary

**This version focuses on one thing: Making Omnigenesis a GAME people want to PLAY.**

Previous versions were too focused on technical impressiveness. This version asks: "Would I spend 30 minutes playing this?" If the answer isn't an enthusiastic yes, the project fails regardless of technical merit.

**The Core Insight:** [Infinite Craft's addiction](https://www.dexerto.com/gaming/what-is-infinite-craft-how-to-play-the-addictive-new-game-2536960/) comes from a 2-second dopamine loop. Everything else is secondary. Omnigenesis MUST nail this loop before adding depth (Zoom) or spectacle (Evolve).

**Win Probability with Fun-Focused Approach: 45-55%**

Why the increase? Because judges are humans who play games. A technically impressive demo that's boring loses to a simple demo that's fun. Our competition will likely over-engineer. We will out-fun them.

---

## What Makes This FUN

### The Addiction Loop

Based on [compulsion loop research](https://www.gameanalytics.com/blog/the-compulsion-loop-explained) and [idle game design principles](https://ericguan.substack.com/p/idle-game-design-principles):

**The Dopamine Cycle:**
```
ANTICIPATION (drag elements)
    -> ACTION (drop to combine)
    -> REWARD (new element appears)
    -> ANTICIPATION (what else can I make?)
```

**Timing is Everything:**
| Phase | Target Time | Why |
|-------|-------------|-----|
| Drag start | Instant | Immediate response to input |
| Hover feedback | 50ms | Visual cue that something will happen |
| Drop + processing | 1.5s MAX | [Under 2s maintains flow state](https://medium.com/@luc_chaoui/understanding-game-design-the-psychology-of-addiction-41128565305f) |
| Result reveal | 500ms | Brief pause builds anticipation |
| Image appears | +1s (streamed) | Can happen after name for perceived speed |

**Variable Rewards (The Slot Machine Effect):**
- Most combinations: Common results (80%)
- Some combinations: Rare discoveries (15%)
- Few combinations: "First Discovery" (5%)

This [variable ratio reinforcement](https://www.maketecheasier.com/why-games-are-designed-addictive/) is why slot machines are addictive. Same principle applies here.

### The Discovery Joy

From [Little Alchemy's design](https://londonlovestech.com/the-science-of-fun-little-alchemys-addictive-gameplay-explained/):

> "Every successful combination is a mini eureka moment, an affirmation of the player's ingenuity."

**What Creates Discovery Joy:**
1. **Surprise outcomes** - AI unpredictability means you don't know what you'll get
2. **Logical connections** - But results make sense in retrospect ("Oh! Fire + Longing = Candle, because longing is a slow burn!")
3. **Collection dopamine** - The number goes up. We love when numbers go up.
4. **Social proof** - "First Discovery!" labels create status

**The ZOOM Multiplier:**
Each element isn't just a result - it's a DOOR. This creates secondary discovery joy:
- "What's inside this?"
- "How deep does this go?"
- "Is there a pattern across zoom levels?"

### The "One More Turn" Factor

Why players won't stop:

**1. Unfinished Business**
- "I have 47 elements but there are more..."
- "I haven't zoomed into this one yet..."
- "My evolution is almost done..."

**2. Sunk Cost**
- "I've discovered 100 things, I can't stop now"
- "I'm at depth 15, I want to see 20"

**3. Near Misses**
- Elements with high "Depth Potential" that you haven't explored
- Combinations you suspect will be rare

**4. No Penalty for Playing**
[Little Alchemy succeeded because](https://londonlovestech.com/the-science-of-fun-little-alchemys-addictive-gameplay-explained/):
> "There are no levels, timers, or pressure - you can explore at your own pace."

Same principle: No wrong moves. No time limits. Pure exploration.

---

## The Player Journey

### First 60 Seconds

**What They See:**
```
[Dark cosmic background with gentle particles]

        OMNIGENESIS
    "Where Creation Never Ends"

Starting elements floating: [Fire] [Water] [Stone] [Air]
                           [Light] [Void] [Time] [Wonder]

        [Combine Zone with pulsing border]

        "Drag two elements together"
```

**What They Do:**
1. **0-10s:** Look at elements, read names, feel curious
2. **10-20s:** Drag Fire toward Water (obvious first choice)
3. **20-25s:** See combination animation, brief anticipation
4. **25-27s:** RESULT: "Steam" appears with image
5. **27-35s:** Drag Steam + Air = "Cloud"
6. **35-45s:** Rapid combinations: Cloud + Water = "Rain"
7. **45-60s:** Discovery counter hits 5-6. Player thinks: "How many are there?"

**What They Feel:**
- Wonder (what IS this?)
- Curiosity (what can I make?)
- Satisfaction (I made a thing!)
- Greed (I want MORE things)

### First 5 Minutes

**Gameplay Pattern:**
1. **Minutes 1-2:** Rapid combining. 15+ discoveries. Building inventory.
2. **Minute 2-3:** Slow down. Start thinking about combinations. "What if I combine Rain + Fire?"
3. **Minute 3-4:** Notice "Zoom" indicator on an element. Click it.
4. **Minute 4-5:** MIND BLOWN. "There's a world INSIDE?"

**The Zoom Moment:**
This is the first "WOW." Player clicks an element expecting... what? But they get a SCENE. With more elements inside. The game just got infinitely bigger.

**Discovery Count by Minute 5:** ~25-35 elements

**Emotion Arc:**
```
Curiosity -> Satisfaction -> Routine -> SURPRISE (Zoom) -> Renewed Curiosity
```

### First 30 Minutes

**What Happens:**
1. **Minutes 5-10:** Alternate between Combine and Zoom. Build element library.
2. **Minutes 10-15:** Go deep. Reach zoom level 5+. Start noticing patterns.
3. **Minutes 15-20:** Hit "Evolution Potential" on an element. Start first evolution.
4. **Minutes 20-25:** Continue playing while evolution runs. Forget about it.
5. **Minutes 25-30:** Evolution notification. Watch video. NEW elements emerge.

**Key Moment - Evolution Reveal:**
After ~20 minutes of play, the player has emotional investment in their universe. When evolution completes and shows CIVILIZATIONS emerging from their creation... that's the emotional peak.

**Discovery Count by Minute 30:** ~100-150 elements

**Emotion Arc:**
```
Building -> Exploring -> Mastering -> Waiting (but busy) -> EPIC PAYOFF
```

### Return Visits

**Why They Come Back:**

1. **Offline Evolution (Future Feature)**
   - "My element might have evolved while I was gone"
   - Tamagotchi-style anticipation

2. **Unfinished Depths**
   - "I only got to level 12, I want to see 20"
   - "I didn't zoom into that weird element yet"

3. **Combination Hunting**
   - "What happens if I combine evolved elements with primordials?"
   - "I want to be 'First' to discover something"

4. **Sharing**
   - "Wait till my friend sees what I made"
   - Screenshot/share culture

---

## Simple Implementation Solutions

### Constellation Map / Universe View

The "constellation map" showing element relationships needs to be SIMPLE to implement but visually impressive.

| Option | Library | Effort | Polish | Notes |
|--------|---------|--------|--------|-------|
| **React Flow** | [reactflow.dev](https://reactflow.dev/) | 4-6 hrs | High | Best choice. Built for node-based UIs. Used by Stripe. MIT licensed. |
| D3.js Force | [d3js.org](https://d3js.org/) | 8-12 hrs | Very High | More control but steeper learning curve |
| Vis.js | vis-network | 3-4 hrs | Medium | Easy but less React-native |
| Cytoscape.js | [js.cytoscape.org](https://js.cytoscape.org/) | 6-8 hrs | High | Good for complex graphs, might be overkill |
| Reagraph | WebGL-based | 4-6 hrs | High | Good performance, newer library |

**Recommendation: React Flow**
- Nodes are just React components (easy to style)
- Dragging, zooming, panning built-in
- [Used by Stripe, Typeform for similar UIs](https://webkid.io/blog/react-flow-node-based-graph-library/)
- Can add custom edge animations for "connection reveal"
- Install: `npm install @xyflow/react`

**Implementation Sketch:**
```tsx
import { ReactFlow, Background, Controls } from '@xyflow/react';

const nodes = elements.map(el => ({
  id: el.id,
  position: calculatePosition(el), // Force-directed or grid
  data: { label: el.emoji + ' ' + el.name },
  type: 'elementNode' // Custom styled node
}));

const edges = connections.map(conn => ({
  id: conn.id,
  source: conn.from,
  target: conn.to,
  animated: true // Glowing connection
}));

<ReactFlow nodes={nodes} edges={edges}>
  <Background variant="dots" />
  <Controls />
</ReactFlow>
```

### Drag-and-Drop Combine

| Option | Library | Effort | Polish | Notes |
|--------|---------|--------|--------|-------|
| **dnd-kit** | [@dnd-kit/core](https://dndkit.com/) | 3-4 hrs | High | Modern, performant, modular. Best choice. |
| pragmatic-drag-and-drop | Atlassian's new library | 4-5 hrs | High | Lighter than dnd-kit, native HTML5 DnD |
| hello-pangea/dnd | Fork of react-beautiful-dnd | 3-4 hrs | High | Good for lists but we need free-form |
| react-dnd | [react-dnd.github.io](https://react-dnd.github.io/react-dnd/) | 4-5 hrs | Medium | Older, more boilerplate |

**Recommendation: dnd-kit**
- [Zero dependencies, ~10kb](https://github.com/clauderic/dnd-kit)
- Built-in sensors for pointer, touch, keyboard
- Highly customizable animations
- Install: `npm install @dnd-kit/core @dnd-kit/sortable`

**Implementation Sketch:**
```tsx
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';

function Element({ id, emoji, name }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      {emoji} {name}
    </div>
  );
}

function CombineZone() {
  const { setNodeRef, isOver } = useDroppable({ id: 'combine-zone' });
  return (
    <div ref={setNodeRef} className={isOver ? 'glow' : ''}>
      Drop elements here
    </div>
  );
}
```

### Animations & Polish ("Game Juice")

From [game juice research](https://www.bloodmooninteractive.com/articles/juice.html):
> "Particles are a juicy game's best friend. Dust clouds, sparkles, debris - they all give motion and feedback."

| Effect | Library/Approach | Effort | Notes |
|--------|------------------|--------|-------|
| **Element appear** | Framer Motion scale + opacity | 1 hr | `initial={{scale:0}} animate={{scale:1}}` |
| **Combine flash** | CSS keyframes + Framer | 1 hr | White flash on drop |
| **Discovery confetti** | [react-confetti-explosion](https://www.npmjs.com/package/react-confetti-explosion) | 30 min | Triggers on new discovery |
| **Zoom transition** | Framer Motion layoutId | 2 hrs | Element "expands" into scene |
| **Particles (ambient)** | [tsParticles](https://confetti.js.org/) | 2 hrs | Floating particles in background |
| **Glow effects** | CSS box-shadow + filter | 30 min | Rare elements glow |
| **Screen shake** | Framer Motion x/y offset | 30 min | On evolution complete |

**Framer Motion is the Core:**
- Install: `npm install motion`
- Handles 80% of animation needs with minimal code
- [330+ pre-built animations available](https://motion.dev/)

**Quick Win Animations (30 min each):**
```tsx
// Element appear
<motion.div
  initial={{ scale: 0, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ type: "spring", bounce: 0.5 }}
>
  {element}
</motion.div>

// Discovery celebration
<motion.div
  animate={{
    scale: [1, 1.2, 1],
    rotate: [0, 5, -5, 0]
  }}
  transition={{ duration: 0.5 }}
>
  FIRST DISCOVERY!
</motion.div>

// Hover glow
<motion.div whileHover={{ boxShadow: "0 0 20px gold" }}>
  [Element]
</motion.div>
```

**Confetti on First Discovery:**
```tsx
import ConfettiExplosion from 'react-confetti-explosion';

{isFirstDiscovery && (
  <ConfettiExplosion
    force={0.6}
    duration={2000}
    particleCount={100}
    colors={['#ffd700', '#ff6b6b', '#4ecdc4']}
  />
)}
```

---

## Minimum Viable FUN

### Must Have (Core Fun)

These features are ESSENTIAL. Without them, the game isn't fun:

| Feature | Why Essential | Effort |
|---------|---------------|--------|
| **12 starting elements** | Need enough variety to start | 2 hrs |
| **Drag-drop combine** | Core interaction | 4 hrs |
| **< 2 second results** | Maintains flow state | Critical |
| **Element images** | Visual reward | Included in combine |
| **Discovery counter** | Numbers go up = dopamine | 30 min |
| **Click-to-zoom** | The differentiator | 6 hrs |
| **Smooth zoom transition** | Makes zoom feel magical | 2 hrs |
| **3-5 elements per scene** | Discovery in each zoom | Included |
| **Zoom out navigation** | Can't get stuck | 1 hr |
| **Element collection panel** | See all discoveries | 2 hrs |

**Total Core Effort: ~18 hours**

### Should Have (Enhanced Fun)

These make it BETTER but aren't critical:

| Feature | Why Valuable | Effort |
|---------|--------------|--------|
| "First Discovery" labels | Social proof, status | 2 hrs |
| Depth potential stars | Creates anticipation | 1 hr |
| Combination hints | Reduces frustration | 2 hrs |
| Sound effects | [Audio is 50% of juice](https://www.gamedeveloper.com/design/squeezing-more-juice-out-of-your-game-design-) | 3 hrs |
| Evolution feature | Demo wow moment | 8 hrs |
| Constellation map | 1M context visualization | 4 hrs |
| Rare element glow | Rewards luck | 30 min |
| Scene variety (templates) | Prevents repetition | 3 hrs |

**Total Enhanced Effort: ~24 hours**

### Cut (Not Worth It for v1)

These features sound cool but are time sinks:

| Feature | Why Cut | Alternative |
|---------|---------|-------------|
| ~~Translate feature~~ | Already cut in v3 spec | N/A |
| ~~Export/share pipeline~~ | Complex video handling | Screenshot button |
| ~~Offline evolution~~ | Requires backend infra | Future feature |
| ~~Multiplayer~~ | Scope explosion | Single player focus |
| ~~Mobile responsive~~ | Time sink | Desktop only |
| ~~Tutorial/onboarding~~ | Simple enough without | Tooltips only |
| ~~Achievement system~~ | Nice but not essential | Discovery counter is enough |
| ~~Leaderboards~~ | Backend work | "First Discovery" is enough |

---

## The 12-Day Playable Build

| Days | Focus | Deliverable | Playable State |
|------|-------|-------------|----------------|
| **1-2** | API Validation | CLI tests for Flash, Nano Banana, Veo | Not playable |
| **3-4** | Core Combine | Drag-drop + Gemini integration + images | Can combine elements endlessly |
| **5-6** | Zoom System | Click-to-zoom + scene generation + navigation | Can zoom infinitely |
| **7-8** | Polish Core | Animations, sound, visual juice | FUN to play |
| **9-10** | Evolution | Async Veo + modal + reveal ceremony | Complete feature set |
| **11** | Demo Content | Pre-generate paths, rehearse demo | Demo-ready |
| **12** | Record & Submit | Video editing, final polish, submit | SHIPPED |

### Day-by-Day Breakdown:

**Days 1-2: API Validation**
- Test 50+ combinations with Flash
- Test 30+ image generations with Nano Banana
- Test 3-5 Veo videos
- GO/NO-GO decision

**Day 3: Core Setup**
- Next.js 14 + Tailwind + Zustand
- Basic UI layout (palette, combine zone, viewport)
- Element data model

**Day 4: Combine Mechanic**
- dnd-kit integration
- Gemini Flash API call
- Image generation (parallel)
- Result display

**Day 5: Zoom Foundation**
- Click-to-zoom interaction
- Scene generation API
- Basic zoom transition
- Breadcrumb navigation

**Day 6: Zoom Polish**
- Smooth CSS/Framer transitions
- Element discovery in scenes
- Context management
- Depth tracking

**Day 7: Visual Juice**
- Framer Motion animations
- Confetti on discoveries
- Glow effects
- Ambient particles

**Day 8: Sound + Polish**
- Simple sound effects (combine, discover, zoom)
- UI polish passes
- Bug fixes

**Day 9: Evolution Feature**
- Evolution modal + button
- Veo API integration
- Async job queue
- Progress indicator

**Day 10: Evolution Polish**
- Video player
- Reveal ceremony
- Element emergence
- Integration testing

**Day 11: Demo Preparation**
- Pre-generate 5-8 evolution videos
- Pre-generate 50+ zoom scenes on demo path
- Script exact demo sequence
- Practice 10+ times

**Day 12: Ship It**
- Record demo video (multiple takes)
- Edit video (add music, text overlays)
- Write Devpost submission
- Submit before 5PM PT

---

## Demo Strategy (Show the FUN)

### The Problem with Tech Demos

Most hackathon demos are:
- "Look at this API call"
- "Watch me click buttons"
- "See how it generates content"

Judges are BORED. They've seen 50 demos. Most are impressive but not memorable.

### The Solution: Make Judges PLAY

The demo video should make judges want to TRY the game themselves. That means:

1. **Show JOY, not features** - Celebrate discoveries, not implementations
2. **Fast pace** - Match the 2-second loop in editing
3. **Surprise moments** - The zoom reveal. The evolution payoff.
4. **Human reactions** - Brief moments of "whoa" (even if staged)

### Demo Video Structure (2 Minutes)

```
[0:00-0:05] HOOK
Black screen -> Single element appears
"What if everything you created..."
Element opens into a world
"...had infinite worlds inside?"

[0:05-0:10] TITLE
OMNIGENESIS
"Where Creation Never Ends"
"Built with Gemini 3"

[0:10-0:30] COMBINE MONTAGE
Show 6-8 rapid combinations in 20 seconds
Quick cuts. Satisfying sounds. Numbers going up.
"Combine anything. Create everything."

[0:30-0:45] ZOOM REVEAL
Click an element. Hold for 1 second of anticipation.
BOOM - zoom into a world.
Quick zoom montage: 5 levels in 10 seconds.
"Everything has something inside."

[0:45-1:10] THE DEPTH
Show exploring to depth 10+
Find something unexpected (a figure, a symbol, a message)
"Go as deep as you want. There's always more."

[1:10-1:25] EVOLUTION SETUP
Find an element with high potential.
"Watch your creation evolve."
Start evolution. Show "Years passing" counter.
"We'll come back to this."

[1:25-1:40] CONTINUE PLAYING
Quick combine + zoom actions.
Evolution notification appears.
Click. Screen dims.

[1:40-1:55] THE PAYOFF
Evolution video plays (pre-generated, cinematic).
Civilization rises. Temple appears.
Zoom into temple.
Murals of the creator (you).
"They remember you."

[1:55-2:00] CLOSE
Rapid pullback through all levels.
Final stats: Elements discovered, depth reached.
"OMNIGENESIS. Where Creation Never Ends."
Logo. URL.
```

### Key Demo Decisions

**Music:** Epic but subtle. Think Interstellar or Arrival. Builds during evolution reveal.

**Pacing:** Match the game loop. 2-second cuts during combine montage. Slower during zoom reveals.

**Voice:** Optional. If used, keep it minimal. "Combine anything." "Zoom into everything." Let visuals speak.

**Call to Action:** "Try it yourself at [URL]" or "Available on Devpost"

---

## Win Probability Assessment

### With This Fun-Focused Approach: 45-55%

**Why Higher Than v2 (35-45%)?**

| Factor | v2 Approach | v3 Approach | Impact |
|--------|-------------|-------------|--------|
| Core loop speed | "Target < 3s" | "MUST be < 2s or fail" | +5% |
| Animation polish | "Add later" | "Days 7-8 dedicated" | +3% |
| Sound design | "Optional" | "Essential juice" | +2% |
| Demo emotion | "Show features" | "Show joy" | +5% |
| Library choices | "Figure it out" | "React Flow, dnd-kit, Framer" | +3% (saved time) |
| Scope focus | "Maybe cut" | "Cut list is final" | +2% (execution) |

### What Could Push to 60%+

1. **Flawless < 1.5s combine loop** - If every combination is instant
2. **Judge falls in love** - The "they remember you" moment hits emotionally
3. **Competition stumbles** - Other multimodal demos are boring
4. **Viral potential visible** - Judges see this spreading on social media

### What Could Drop Below 40%

1. **Combine latency > 3s** - Game feels broken
2. **Veo API failures** - Can't show evolution
3. **UI looks unpolished** - "Just a tech demo" perception
4. **Demo video is boring** - Judges tune out

---

## Research Sources

### Game Design & Psychology
- [Infinite Craft - Wikipedia](https://en.wikipedia.org/wiki/Infinite_Craft) - 300M+ daily recipes, AI-powered infinite combinations
- [Dexerto - What makes Infinite Craft addictive](https://www.dexerto.com/gaming/what-is-infinite-craft-how-to-play-the-addictive-new-game-2536960/) - Discovery joy, AI unpredictability
- [Little Alchemy's addictive gameplay](https://londonlovestech.com/the-science-of-fun-little-alchemys-addictive-gameplay-explained/) - Dopamine mechanics, no-pressure design
- [Compulsion Loops - GameAnalytics](https://www.gameanalytics.com/blog/the-compulsion-loop-explained) - Skinner box, reward loops
- [Make Tech Easier - Why Games are Addictive](https://www.maketecheasier.com/why-games-are-designed-addictive/) - Variable rewards, dopamine triggers
- [Idle Game Design Principles](https://ericguan.substack.com/p/idle-game-design-principles) - Progression, waiting as mechanic
- [Game Juice - Blood Moon Interactive](https://www.bloodmooninteractive.com/articles/juice.html) - Visual feedback, polish effects
- [Squeezing Juice - Game Developer](https://www.gamedeveloper.com/design/squeezing-more-juice-out-of-your-game-design-) - Audio importance, particle effects

### React Libraries
- [React Flow](https://reactflow.dev/) - Node-based UIs, MIT licensed
- [dnd-kit](https://dndkit.com/) - Modern drag and drop toolkit
- [Motion (Framer Motion)](https://motion.dev/) - Production animation library
- [react-confetti-explosion](https://www.npmjs.com/package/react-confetti-explosion) - Lightweight confetti effects
- [tsParticles](https://confetti.js.org/) - Customizable particle effects
- [D3.js](https://d3js.org/) - Graph visualization (backup)
- [Cytoscape.js](https://js.cytoscape.org/) - Graph theory library

### Development Guides
- [DEV Community - Framer Motion Beginner's Guide 2024](https://dev.to/iamfaham/framer-motion-react-a-complete-beginners-guide-2024-30e2) - Animation tutorial
- [React Flow Blog - Node-Based Graph Library](https://webkid.io/blog/react-flow-node-based-graph-library/) - React Flow usage
- [dnd-kit GitHub](https://github.com/clauderic/dnd-kit) - Installation and examples

---

## Final Checklist: Is This FUN?

Before submission, verify:

- [ ] Can I combine 10 elements in under 30 seconds?
- [ ] Does each result surprise me?
- [ ] Do I want to zoom into things?
- [ ] Is the zoom transition smooth and satisfying?
- [ ] Does the discovery counter feel rewarding?
- [ ] Would I play this for 30 minutes?
- [ ] Does the evolution payoff feel worth the wait?
- [ ] Would I show this to a friend?
- [ ] Does the demo make me want to try it?

**If any answer is "no" - fix it before submitting.**

---

*Document Version: v3 (FINAL - Fun-Focused)*
*Created: January 28, 2026*
*Analyst: Market Researcher Agent*
*Focus: PLAYABILITY and FUN*
*Win Probability: 45-55%*
