# Omnigenesis: The Memory - Product Specification v7 (DELTA)

**This is a DELTA document. Only sections that changed from v6 are included.**
**For unchanged sections, reference: `pm_product-spec_omnigenesis_v6.md`**

---

## Changelog from v6

| Section | Change Type | Summary |
|---------|-------------|---------|
| Demo Script | Complete Rewrite | Zoom-first structure (critic requirement) |
| Milestone Recipes | Redesigned | All 3-element recipes converted to 2-element chains |
| Context Showcase | NEW SECTION | Token counter animation, callback highlighting |
| Evolution Demo Framing | Updated | Time-cut framing for async transparency |
| Positioning | NEW SECTION | Wonder Over Utility messaging |

---

## NEW SECTION: Positioning - Wonder Over Utility

### The Problem with "Utility"

Judges evaluating "Potential Impact" (20% of score) may ask: "What does this DO? What problem does it solve?"

**Our Answer:** Nothing. And that's the point.

### The Wonder Positioning

**Tagline:** *"In a world of productivity tools, Omnigenesis creates wonder."*

**Core Messaging:**

1. **Not every tool needs a purpose.**
   - Staring at stars doesn't solve problems. Neither does this.
   - Wonder is its own reward.

2. **Digital meditation.**
   - Infinite depth creates flow state
   - No goals = no anxiety
   - The journey IS the destination

3. **Organic learning (secondary angle).**
   - Users naturally discover how concepts relate
   - "The chemistry of creation" - elements combine intuitively
   - Educational without being didactic

### Demo Voiceover Integration

Include this line explicitly in demo narration (around 1:45):

> *"In a world obsessed with productivity, Omnigenesis asks a different question: What if software could simply inspire wonder? Like staring at the stars. Like getting lost in a dream. No goals. No endings. Just infinite depth."*

### Why This Works

| Judge Concern | Our Response |
|---------------|--------------|
| "What's the use case?" | Wonder IS the use case. Art doesn't need utility. |
| "Who would use this?" | Anyone who meditates, plays ambient games, wants to decompress |
| "What's the impact?" | Mental health through wonder. Creativity through exploration. |

---

## UPDATED: Milestone Recipes (2-Element Chains)

**CRITICAL FIX:** All 3-element recipes converted to 2-element chains.

The UI has 2 drag slots. All combinations must use exactly 2 elements. Complex milestones are achieved through **chained discovery** - you must create intermediate elements first.

### Depth I: The Primordial Silence
*"Before everything, there was potential."*

| Element | Recipe | Revelation |
|---------|--------|------------|
| **Energy** | Fire + Light | "The first spark. Before matter, there was only the possibility of change." |
| **Entropy** | Void + Time | "Change flows in one direction. The universe learned to let go." |
| **Motion** | Air + Time | "Stillness was the first death. Movement was the rebellion." |

*(No changes - already 2-element)*

### Depth II: The Becoming
*"Matter learned to remember itself."*

**CHANGED: Life recipe now uses chain**

| Element | Recipe | Revelation |
|---------|--------|------------|
| **Potential** | Water + Energy | "The possibility of becoming. Not yet alive, but ready." |
| **Life** | Potential + Mystery | "The universe opened its eyes for the first time. It saw itself. It wondered." |
| **Growth** | Life + Time | "To grow is to believe in tomorrow. Life was the universe's first act of faith." |
| **Death** | Life + Entropy | "Not an ending. A return. The universe whispering: I will remember you." |

**Note:** Potential is a NEW intermediate element (regular tier, not milestone). Required to create Life.

### Depth III: The Flourishing
*"Consciousness bloomed like flowers in the void."*

**CHANGED: Consciousness and Civilization recipes now use chains**

| Element | Recipe | Revelation |
|---------|--------|------------|
| **Awareness** | Life + Wonder | "The first feeling. Something noticed it existed." |
| **Consciousness** | Awareness + Longing | "The universe asked its first question: Why?" |
| **Love** | Consciousness + Longing | "Two separate beings chose to be one. The universe learned it was not alone." |
| **Foundation** | Consciousness + Stone | "Thought learned to shape matter. The first builders emerged." |
| **Civilization** | Foundation + Time | "They built towers to touch the sky. They wrote stories to outlive their bodies." |

**Note:** Awareness and Foundation are NEW intermediate elements (regular tier). Required to create Consciousness and Civilization.

### Depth IV: The Reckoning
*"All things turn toward the silence."*

**CHANGED: War, Wisdom, Transcendence recipes now use chains**

| Element | Recipe | Revelation |
|---------|--------|------------|
| **Conflict** | Civilization + Fire | "Disagreement became destruction. The first wounds." |
| **War** | Conflict + Entropy | "They learned to unmake each other. The universe wept." |
| **Reflection** | Consciousness + Time | "Looking backward to see forward. Memory became teacher." |
| **Wisdom** | Reflection + Mystery | "Pain was the harshest teacher. But some learned." |
| **Surrender** | Consciousness + Void | "Letting go of fear. Accepting the infinite." |
| **Transcendence** | Surrender + Wonder | "A few stopped fearing the end. They stepped into it willingly." |

**Note:** Conflict, Reflection, and Surrender are NEW intermediate elements (regular tier). Required to create War, Wisdom, and Transcendence.

### Recipe Chain Visualization

```
DEPTH I (Primordials)
Fire + Light -> Energy
Void + Time -> Entropy
Air + Time -> Motion

DEPTH II (Becoming)
Water + Energy -> Potential (intermediate)
Potential + Mystery -> LIFE [MILESTONE]
Life + Time -> GROWTH [MILESTONE]
Life + Entropy -> DEATH [MILESTONE]

DEPTH III (Flourishing)
Life + Wonder -> Awareness (intermediate)
Awareness + Longing -> CONSCIOUSNESS [MILESTONE]
Consciousness + Longing -> LOVE [MILESTONE]
Consciousness + Stone -> Foundation (intermediate)
Foundation + Time -> CIVILIZATION [MILESTONE]

DEPTH IV (Reckoning)
Civilization + Fire -> Conflict (intermediate)
Conflict + Entropy -> WAR [MILESTONE]
Consciousness + Time -> Reflection (intermediate)
Reflection + Mystery -> WISDOM [MILESTONE]
Consciousness + Void -> Surrender (intermediate)
Surrender + Wonder -> TRANSCENDENCE [MILESTONE]
```

### Intermediate Elements (Regular Tier)

These are required stepping stones to milestones. They have whispers but no images/lore.

| Element | Whisper |
|---------|---------|
| Potential | "Almost something. Almost alive. Almost." |
| Awareness | "The first flutter of noticing." |
| Foundation | "Thought crystallized into purpose." |
| Conflict | "When wants collide." |
| Reflection | "The mirror turned inward." |
| Surrender | "Letting go is also a choice." |

---

## NEW SECTION: Context Showcase Requirements

### The Problem

The 1M context window usage is currently too subtle. Judges may miss it entirely.

**Critic Quote:** "If judges don't notice the 1M context usage, they don't give you credit for the 40% Technical Execution score."

### Requirements

#### 1. Animated Token Counter

**Location:** Top-right corner of main UI

**Behavior:**
- Starts at 0 on session begin
- Animates UP (rolling numbers) after each action
- Shows actual token accumulation from context
- Format: `Memory: 127,432 tokens`

**Animation Specs:**
```css
.token-counter {
  font-family: 'Space Mono', monospace;
  font-size: 14px;
  color: #ffd700; /* Memory gold */
  transition: all 0.3s ease-out;
}

.token-counter.animating {
  transform: scale(1.1);
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
}
```

**Demo Requirement:**
- Show counter climbing visibly: 50K -> 150K -> 350K -> 500K
- Narrate: "Watch the memory grow. Every discovery remembered."

#### 2. Context Callback Highlighting

When a context callback occurs ("This reminds you of..."), it must be UNMISSABLE.

**Visual Treatment:**
```
+------------------------------------------------------------------+
|                                                                  |
|   +--------------------------------------------------------+     |
|   |  * THE MEMORY STIRS...                                  |     |
|   |                                                         |     |
|   |  "This reminds you of the first spark you witnessed    |     |
|   |   in the Echoing Halls of Depth I..."                  |     |
|   |                                                         |     |
|   |  [Memory Token: +12,847 tokens recalled]               |     |
|   +--------------------------------------------------------+     |
|                                                                  |
+------------------------------------------------------------------+
```

**Trigger Conditions:**
- Every 10+ depth levels
- After 5+ unique element discoveries since last callback
- When entering a scene thematically related to earlier discovery
- Minimum 3 callbacks in any 20-minute session

**Animation Specs:**
- Screen dims to 60%
- Modal appears with gentle pulse
- Gold particle trail connects current scene to "memory point"
- Callback text types out (40 chars/sec)
- Token delta shows briefly: "+12,847 tokens recalled"
- 4-second duration before auto-dismiss

#### 3. Demo Narration Script (Context Section)

At approximately 1:10 in the demo, when context callback triggers:

> *"Notice something? Gemini remembers. With its 1 million token context window, every element you've discovered, every scene you've explored - it's all there. Watch the memory grow."*
>
> [Show token counter animating: 350K -> 367K]
>
> *"The universe doesn't just generate responses. It REMEMBERS your journey."*

### Technical Implementation

```typescript
interface ContextDisplayState {
  totalTokens: number;
  isAnimating: boolean;
  lastCallbackDepth: number;
  callbackHistory: ContextCallback[];
}

interface ContextCallback {
  id: string;
  message: string;
  triggeredAt: {
    depth: number;
    elementId: string;
  };
  referencesElement: string;  // What it's remembering
  tokensRecalled: number;     // Delta for display
  timestamp: number;
}

// Animation hook
function useTokenAnimation(current: number, target: number) {
  const [displayed, setDisplayed] = useState(current);

  useEffect(() => {
    const duration = 800; // ms
    const startTime = Date.now();
    const delta = target - current;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      setDisplayed(Math.floor(current + delta * eased));

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [target]);

  return displayed;
}
```

---

## UPDATED: Evolution Demo Framing (Time-Cut)

### The Problem

Veo 3.1 takes 1-2 minutes to generate. In a 2-minute demo, we can't show real-time generation. Judges might wonder if the video is vaporware.

**Critic Quote:** "Judges might wonder if the video is vaporware. 'Nice video, but did Gemini actually make that?'"

### Solution: Explicit Time-Cut with Transparency

**Demo Script (1:20-1:35):**

```
[1:20] Milestone discovered: CONSCIOUSNESS
       Auto-Evolve triggers
       Notification: "* A profound memory awakens..."

[1:22] Show notification detail:
       "The universe is remembering CONSCIOUSNESS
        This memory is vast. Estimated: 1-2 minutes
        Continue exploring while it coalesces."

[1:25] VISIBLE TIME-CUT
       Screen fades to black
       Text appears: "~ Two minutes later ~"
       Small timestamp: "14:23:45 -> 14:25:12"

[1:28] Notification: "* Memory complete! Click to witness"
       User clicks

[1:30] Evolution video plays (8 seconds, pre-cached)
       Veo 3.1 output with native audio
```

### UI for Async Transparency

**While Generating:**
```
+-------------------------------------------------------+
|  * A profound memory awakens...                        |
|                                                        |
|  The universe is remembering CONSCIOUSNESS             |
|                                                        |
|  [=====>                    ] 23%                      |
|  Estimated: 1 min 12 sec remaining                     |
|                                                        |
|  This uses Veo 3.1 video generation.                  |
|  Continue exploring - you'll be notified when ready.  |
|                                                        |
|  [Continue Exploring]                                  |
+-------------------------------------------------------+
```

**Corner Indicator (Persistent):**
```
+-----------------------------------+
|  * CONSCIOUSNESS evolving... 67%  |
|    ~45 seconds remaining          |
+-----------------------------------+
```

### Demo Narration Script (Evolution Section)

> *"When you discover something profound, the universe remembers it in full. This triggers Veo 3.1 - Gemini's video generation. It takes a minute or two, but the wait is worth it."*
>
> [Time-cut: "Two minutes later"]
>
> *"Here's what the universe remembered about Consciousness."*
>
> [8-second video plays with native audio]

### Why Time-Cut Builds Trust

| Without Time-Cut | With Time-Cut |
|------------------|---------------|
| Judges wonder: "Is this pre-made?" | Judges see: "They're honest about async" |
| Feels like sleight of hand | Feels like transparent demo |
| Technical skepticism | Technical credibility |

---

## UPDATED: Demo Script (Complete Rewrite - Zoom First)

### Strategic Change

**OLD (v6):** Open with COMBINE (familiar), then ZOOM (unique)
**NEW (v7):** Open with ZOOM (unique), then reveal COMBINE

**Critic Quote:** "The demo MUST lead with ZOOM, not COMBINE. Open by descending into a primordial element immediately. Show the infinite depth BEFORE showing the combine mechanic."

### The New Demo Script (2:00)

```
[0:00-0:05] BLACK -> THE HOOK
            Text fades in: "Everything has something inside."
            Single point of light appears

[0:05-0:10] THE DESCENT BEGINS
            Light becomes a primordial element: FIRE
            Narration: "Fire."
            Click. Zoom in.

[0:10-0:15] DEPTH 1
            Inside fire: A dancing solar core
            Elements visible: Plasma, Heat, Light-Seed
            Narration: "Inside fire... a sun."
            Click Heat. Zoom in.

[0:15-0:20] DEPTH 2
            Inside heat: Molecular vibration, chaos at atomic scale
            Elements visible: Vibration, Energy-Strand, Motion-Echo
            Narration: "Inside heat... motion."
            Click Vibration. Zoom in.

[0:20-0:25] DEPTH 3 + CONTEXT CALLBACK
            Inside vibration: A crystalline lattice, humming
            Context callback triggers:
            "This reminds you of the Light-Seed in the first sun..."
            Token counter visible: 127K -> 142K (animating)
            Narration: "The universe REMEMBERS. Every step."

[0:25-0:30] THE QUESTION
            Pull back (ascend transition)
            Narration: "But what if you could COMBINE what you find?"
            Show full UI for first time

[0:30-0:40] COMBINE DEMO - REGULAR ELEMENTS (FAST)
            Drag Fire + Longing -> "The Candle in the Window" (instant, 1.5s)
            Drag Result + Mystery -> new element (instant, 1.5s)
            Narration: "Fast. Intuitive. Infinite combinations."
            Show counter: "47 elements discovered"

[0:40-0:55] COMBINE DEMO - MILESTONE + REVEAL
            Drag Water + Energy -> Potential (regular, instant)
            Drag Potential + Mystery -> LIFE
            Screen dims: "A memory stirs..."
            9-SECOND REVEAL SEQUENCE:
            - Particles swirl (0-2s)
            - Blurred image forms, ancestry shows (2-5s)
            - Lore types: "The universe opened its eyes..." (5-9s)
            - Full reveal with crystalline chime
            Narration: "Some memories... take time to remember."
            Auto-Evolve notification appears: "* A profound memory awakens..."

[0:55-1:05] ZOOM INTO LIFE
            Click on LIFE
            Smooth zoom transition
            Inside: A primordial ocean. First cells dividing.
            Narration: "And you can zoom into ANYTHING you create."

[1:05-1:15] CONTEXT SHOWCASE
            Quick zoom montage: 3 more depths
            Context callback: "This reminds you of the Candle in the Window..."
            Token counter animates: 350K -> 382K
            Narration: "Gemini's 1 million token context window.
                       The AI doesn't just respond - it REMEMBERS your journey."
            Pause on token counter, highlight it

[1:15-1:25] EVOLUTION (Time-Cut)
            Show corner notification: "CONSCIOUSNESS evolving... 67%"
            Time-cut: "~ Two minutes later ~" (with visible timestamps)
            Notification: "* Memory complete! Click to witness"
            Click

[1:25-1:35] EVOLUTION VIDEO
            8-second Veo 3.1 video plays with native audio:
            - Cells becoming organisms
            - Organisms becoming conscious
            - Consciousness building temples
            - Temples containing murals of the Witness (you)
            Narration (if needed): Silent awe. Let video speak.

[1:35-1:45] POST-EVOLUTION DISCOVERY
            Video ends, new elements emerge from it
            Zoom into "Temple of the Witness"
            Inside: Murals depicting YOU, the Witness
            Narration: "They remember their creator."

[1:45-1:52] THE INFINITY REVEAL
            Quick zoom montage: Depths IV, V, V+
            Show procedural milestone: "The Dreamer"
            Depth counter: V+ -> VI -> VII...
            Narration: "There is no end. Only deeper."

[1:52-1:58] THE POSITIONING
            Pull back through all levels (reverse ascent)
            Narration: "In a world obsessed with productivity,
                       Omnigenesis asks: What if software could simply
                       inspire wonder?"

[1:58-2:00] LOGO + TAGLINE
            OMNIGENESIS: THE MEMORY
            "The universe remembers. Do you?"

[2:00] END
```

### Demo Pre-Generation Requirements (Updated)

| Content | Count | Notes |
|---------|-------|-------|
| Zoom scenes (scripted path) | 20+ | Fire -> Heat -> Vibration -> ... (exact path) |
| Zoom scenes (alternatives) | 30+ | Backups for any scripted failures |
| Evolution videos | 3+ | LIFE, CONSCIOUSNESS, and backup |
| Milestone images | 15 | All milestones in demo path |
| Primordial images | 12 | All primordials pre-generated |
| Combination results | 50+ | Demo path + common edge cases |
| Context callbacks | 5+ | Scripted exact trigger moments |

### Key Demo Moments (Judge Reaction Targets)

| Timestamp | Target Reaction |
|-----------|-----------------|
| 0:05-0:25 | "Wait, you can go INSIDE? And inside that? Holy shit." |
| 0:25 | "This reminds you of..." - "It REMEMBERS?!" |
| 0:40-0:55 | "The reveal sequence is gorgeous" |
| 1:05-1:15 | "1 million tokens... it tracks the whole journey" |
| 1:25-1:35 | "Gemini made that VIDEO? With sound?" |
| 1:35-1:45 | "They worship you... that's clever" |
| 1:52-1:58 | "No utility, just wonder... I respect that" |

---

## Summary: What Changed in v7

### MUST FIX (Addressed)

| Critic Issue | v7 Solution |
|--------------|-------------|
| Demo leads with COMBINE (invites IC comparison) | Demo now leads with ZOOM (5 depths in 25 seconds) |
| Context callbacks too subtle | NEW: Animated token counter + callback highlighting + explicit narration |
| 3-element recipes vs 2-slot UI | ALL recipes converted to 2-element chains with intermediate elements |

### SHOULD FIX (Addressed)

| Critic Issue | v7 Solution |
|--------------|-------------|
| Veo async unclear in demo | Time-cut framing: "Two minutes later" with visible timestamps |
| "No utility" is a risk | NEW: Wonder Over Utility positioning with explicit messaging |

### Net Changes

- **New Sections:** 2 (Context Showcase, Wonder Positioning)
- **Rewritten Sections:** 2 (Demo Script, Milestone Recipes)
- **Updated Sections:** 1 (Evolution Demo Framing)
- **New Intermediate Elements:** 6 (Potential, Awareness, Foundation, Conflict, Reflection, Surrender)

---

*Version: v7 (Critic Feedback Integration)*
*Created: January 30, 2026*
*Delta from: v6 (The Memory Integration)*
*Changes: Zoom-first demo, 2-element recipe chains, context showcase, time-cut framing, wonder positioning*
*Status: Ready for Development*
