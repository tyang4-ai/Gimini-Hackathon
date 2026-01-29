# Omnigenesis - Product Specification v1

## Executive Summary

**Product Name:** Omnigenesis
**Tagline:** "Where Creation Never Ends"
**One-liner:** Infinite Craft meets infinite depth - combine anything, zoom into everything, watch it all evolve.

**Core Concept:** A generative creativity game where players combine elements to create new things, but every creation has infinite worlds inside it that can be explored, evolved through time, and translated across senses. The output is shareable infinite zoom videos in the style of viral TikTok content.

---

## The Problem We're Solving

Current AI creative tools are **flat**:
- Image generators make single images with no depth
- Combination games (like Infinite Craft) create things you can't explore
- Video generators make clips with no interactivity
- No tool lets you CREATE and then LIVE INSIDE your creations

**Omnigenesis changes this:** Everything you create is a universe you can enter.

---

## Target Users

1. **Creative explorers** - People who loved Infinite Craft, No Man's Sky, Spore
2. **Content creators** - TikTokers who want to make infinite zoom videos
3. **Casual gamers** - Anyone who wants to play god for 20 minutes
4. **Artists** - People who want AI as a collaborative worldbuilding tool

---

## Core Mechanics

### 1. COMBINE - The Infinite Craft Core
Merge any two elements to create something new.

**Starting Palette (12 Primordial Elements):**

| Category | Elements |
|----------|----------|
| **Matter** | �ite, 💧 Water, 🔥 Fire, 💨 Air |
| **Senses** | 👁️ Light, 👂 Silence, ✨ Shimmer, 🌑 Void |
| **Abstract** | 💔 Longing, ⏰ Time, ❓ Mystery, 💫 Wonder |

**Combination Examples:**
- Fire + Longing = 🕯️ The Candle in the Window
- Water + Time = 🌊 The Eternal Shore
- Silence + Mystery = 🚪 The Door That Doesn't Answer
- Light + Void = 🌅 The Last Sunset

**Combination Logic:**
- Gemini 3 Pro generates the combination result
- Each result has: Name, Image, Description, "Depth Potential" score
- Some combinations are common, some are rare
- The AI maintains consistency (same inputs = same output)

### 2. ZOOM - Every Creation Has Infinite Depth
Enter any element to discover what's inside.

**Zoom Mechanics:**
- Click/tap any element to ZOOM INTO it
- Inside: A new scene with 3-5 discoverable elements
- Each discovered element can be collected and combined
- Zoom depth is theoretically infinite
- 1M token context maintains consistency across all zoom levels

**Example Zoom Chain:**
```
🏚️ Abandoned House
  └→ ZOOM: Interior with [📜 Faded Letter] [🪞 Cracked Mirror] [🎹 Silent Piano]
       └→ ZOOM into Mirror: Shows the house when alive [👨‍👩‍👧 The Family] [🎄 Last Christmas]
            └→ ZOOM into Family: Their story [💍 The Promise] [😢 The Goodbye]
                 └→ ZOOM into Promise: A moment frozen [💑 Two Young Lovers]
                      └→ ZOOM into their eyes: Reflections of possible futures...
```

### 3. EVOLVE - Watch Anything Become More
Fast-forward any element through time.

**Evolution Mechanics:**
- Select any element → Choose time scale (years, millennia, eons)
- Veo generates evolution video (8 seconds)
- At key moments, new elements emerge
- Life can spontaneously appear and develop civilization
- Evolved elements can be zoomed into

**Example Evolution:**
```
🦠 Primordial Soup
  → Evolve 1M years: [🔬 First Cell] appears
  → Evolve 100M years: [🐟 Swimmers] [🦎 Crawlers] appear
  → Evolve 1B years: [🧠 Thinkers] appear with civilization
  → ZOOM into their civilization: They have mythology about YOU
```

### 4. TRANSLATE - Convert Between Senses
Experience any element through a different sense.

**Translation Options:**
- 👁️ VISUAL → What does it look like? (default)
- 👂 AUDIO → What does it sound like? (AI-generated audio)
- 📝 STORY → What's its narrative? (generated text)
- 💭 EMOTION → What does it feel like? (abstract visualization)

**Each translation creates a NEW element that can be combined:**
```
🌅 The Last Sunset
  → AUDIO translation: 🎵 "Sunset's Elegy" (a song)
  → EMOTION translation: 😌 "Acceptance" (can be combined with other elements)
```

---

## The Infinite Zoom Video Feature

### Core Feature: Export Your Journey
After playing, export your exploration as a seamless infinite zoom video.

**How it works:**
1. System tracks your zoom path during play
2. On export: AI generates transition frames between levels
3. Output: Smooth, TikTok-ready infinite zoom video
4. Music generated to match the journey's emotional arc

**Video Specs:**
- Resolution: 1080x1920 (vertical for TikTok) or 1920x1080 (horizontal)
- Length: 30s, 60s, or full journey
- Transitions: Seamless zoom (Veo-generated or interpolated)
- Audio: AI-generated soundtrack matching each level's mood

### Stretch Feature: Real-Time Narrated Zoom
Voice-control the zoom in real-time:

```
User: "Start with an eye"
→ [Eye generates, slow zoom begins]

User: "Inside the eye is a galaxy"  
→ [Iris becomes stars, zoom continues]

User: "Find a planet where colors have weight"
→ [Planet appears, synesthetic landscape]
```

Live API enables voice control. Video generates continuously. Export when done.

---

## Technical Architecture

### Gemini 3 API Usage

| Feature | Gemini 3 Capability | Model |
|---------|---------------------|-------|
| Element images | Nano Banana Pro | `gemini-3-pro-image-preview` |
| Evolution videos | Veo 3.1 | `veo-3.1` |
| Voice control | Live API | `gemini-2.5-flash-native-audio` |
| Combination logic | Gemini 3 Pro | `gemini-3-pro-preview` |
| Audio translation | Gemini TTS | `gemini-2.5-pro-tts` |
| Context memory | 1M context | All models |

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js)                      │
├─────────────────────────────────────────────────────────────┤
│  [Element Palette]  [Universe View]  [Zoom Viewport]        │
│  [Combine UI]       [Evolve Controls] [Export Button]       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (API Routes)                      │
├─────────────────────────────────────────────────────────────┤
│  /api/combine     - Generate new elements                    │
│  /api/zoom        - Generate inner world content             │
│  /api/evolve      - Generate evolution video                 │
│  /api/translate   - Convert element to different sense       │
│  /api/export      - Generate infinite zoom video             │
│  /api/session     - Manage universe state (1M context)       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     GEMINI 3 APIs                            │
├─────────────────────────────────────────────────────────────┤
│  Nano Banana Pro  │  Veo 3.1  │  Live API  │  Gemini 3 Pro  │
└─────────────────────────────────────────────────────────────┘
```

### State Management

**Universe State (stored in 1M context):**
```json
{
  "elements": [
    {
      "id": "uuid",
      "name": "The Candle in the Window",
      "emoji": "🕯️",
      "imageUrl": "...",
      "description": "...",
      "parents": ["fire", "longing"],
      "depthPotential": 8,
      "discovered": true,
      "zoomHistory": ["room", "mirror", "reflection"],
      "evolutions": [...]
    }
  ],
  "zoomPath": ["start", "candle", "room", "mirror"],
  "currentDepth": 4,
  "totalDiscoveries": 47
}
```

---

## User Interface Design

### Main Screen Layout

```
┌─────────────────────────────────────────────────────────────┐
│  OMNIGENESIS                    [🎬 Export] [⚙️ Settings]   │
├──────────────────────┬──────────────────────────────────────┤
│                      │                                      │
│   ELEMENT PALETTE    │         ZOOM VIEWPORT                │
│                      │                                      │
│   [🪨][💧][🔥][💨]   │    ┌────────────────────────┐        │
│   [👁️][👂][✨][🌑]   │    │                        │        │
│   [💔][⏰][❓][💫]   │    │   [Current Scene]      │        │
│                      │    │                        │        │
│   ─────────────────  │    │   Click to zoom        │        │
│                      │    │                        │        │
│   YOUR DISCOVERIES   │    └────────────────────────┘        │
│                      │                                      │
│   [🕯️][🏚️][🌅]...   │    [◀ ZOOM OUT]  [EVOLVE ⏩]         │
│                      │    [🔊 TRANSLATE]                    │
│                      │                                      │
├──────────────────────┴──────────────────────────────────────┤
│  COMBINE: Drag two elements here  [     ] + [     ] = ?    │
└─────────────────────────────────────────────────────────────┘
```

### Visual Style
- **Dark mode** with cosmic/nebula backgrounds
- **Glowing elements** with particle effects
- **Smooth zoom transitions** (ease-in-out)
- **Ethereal typography** (something like Space Grotesk or Outfit)
- **Subtle ambient animations** (floating particles, gentle pulses)

### Responsive Design
- Desktop: Full layout as shown
- Tablet: Stacked layout (palette on top)
- Mobile: Swipe-based navigation, full-screen zoom viewport

---

## Demo Script (2 Minutes)

### The Infinite Zoom Demo Video

The submission video IS an infinite zoom video generated by the product:

```
[0:00-0:05] Black. A single point of light appears.
            Text: "What if everything you created..."

[0:05-0:12] ZOOM into the light → It's a candle flame
            Text: "...had infinite worlds inside?"

[0:12-0:20] ZOOM into the flame → Inside: A tiny sun with orbiting motes

[0:20-0:28] ZOOM into a mote → It's a planet with a city

[0:28-0:35] ZOOM into the city → Market square with beings of light

[0:35-0:42] ZOOM into a merchant's eye → Reflection of another universe

[0:42-0:50] We're now in a forest. 
            [UI APPEARS: Combine mode]
            Fire + Longing = "The Waiting Flame" [Image generates]

[0:50-1:00] ZOOM into The Waiting Flame → House, someone at window
            Text: "Combine anything."

[1:00-1:10] ZOOM into the window → Their dream: a meadow
            Text: "Zoom into everything."

[1:10-1:22] [EVOLVE button pressed]
            VIDEO: Insects in meadow evolve over million years
            Civilization emerges. They build temples.
            Text: "Evolve what you find."

[1:22-1:35] ZOOM into their temple → They worship the candle flame
            [TRANSLATE: AUDIO]
            Their prayer becomes music - haunting, beautiful

[1:35-1:45] ZOOM into the music → Waveforms become landscape
            The music has creatures living in it

[1:45-1:52] ZOOM OUT suddenly → We see ALL levels at once
            A fractal tree of everything we created, interconnected

[1:52-2:00] Text: "OMNIGENESIS"
            Text: "Where creation never ends."
            Logo. Links.
```

### Live Demo Backup (If Video Fails)
Simple live demonstration:
1. Open app, show palette
2. Combine Fire + Longing → generate element
3. ZOOM into it → show depth
4. EVOLVE something → show video
5. Export → show infinite zoom video generation

---

## Technical Implementation Plan

### Phase 1: Core Loop (Days 1-5)
- [ ] Next.js project setup with Gemini 3 SDK
- [ ] Element palette with 12 primordial elements
- [ ] Combine mechanic with Nano Banana Pro
- [ ] Basic UI layout

### Phase 2: Zoom System (Days 6-10)
- [ ] Zoom into elements (generate inner world)
- [ ] Element discovery within zoom
- [ ] Zoom history/navigation (zoom out)
- [ ] Context management (universe state)

### Phase 3: Evolve System (Days 11-14)
- [ ] Evolution controls (time scale selection)
- [ ] Veo integration for evolution videos
- [ ] Element emergence from evolution
- [ ] Civilization detection and generation

### Phase 4: Polish & Export (Days 15-18)
- [ ] Translate mechanic (audio, emotion)
- [ ] Export journey as video
- [ ] Infinite zoom video generation
- [ ] Visual polish (animations, particles)

### Phase 5: Demo Video (Days 19-21)
- [ ] Record/generate demo video
- [ ] Edit and polish
- [ ] Write submission text
- [ ] Submit before Feb 9, 2026

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Veo video generation slow/expensive | Medium | High | Pre-generate common evolutions; fallback to image sequences |
| 1M context insufficient | Low | High | Summarize older zoom levels; prune non-essential state |
| Infinite zoom video generation complex | High | Medium | Start with simpler transitions; polish if time permits |
| Combination results inconsistent | Medium | Medium | Seed-based generation; cache results |
| API rate limits | Medium | High | Implement queuing; optimize requests |

---

## Success Metrics

### For Hackathon Judging

| Criteria | Weight | How We Win |
|----------|--------|------------|
| Technical Execution | 40% | Uses 5+ Gemini 3 APIs together (Nano Banana, Veo, Live, Pro, TTS) |
| Innovation/Wow | 30% | Nothing like this exists. Infinite depth in generated content. |
| Potential Impact | 20% | Viral potential (TikTok export), infinite replayability |
| Presentation | 10% | The demo IS an infinite zoom video - unforgettable |

### Target Win Probability
- Grand Prize: 25-35%
- Top 3: 55-65%
- Top 10: 85%+

---

## Competitive Analysis

| Competitor | What They Do | What We Do Better |
|------------|--------------|-------------------|
| Infinite Craft | Combine elements | Our elements have DEPTH you can explore |
| Midjourney | Generate images | Our images are WORLDS with life inside |
| Veo/Sora | Generate videos | Our videos show EVOLUTION of what you created |
| No Man's Sky | Explore procedural worlds | You CREATE the worlds, not just explore |

**Our Unique Position:** The only tool where your AI creations have infinite interior lives.

---

## Future Vision (Post-Hackathon)

1. **Multiplayer universes** - Your creations can meet others' creations
2. **Persistent worlds** - Come back tomorrow, your civilizations have progressed
3. **Creator economy** - Sell/share rare element discoveries
4. **AR mode** - Point camera at real world, omnigenesis it
5. **API** - Let others build on the omnigenesis engine

---

## Summary

Omnigenesis is **Infinite Craft + No Man's Sky + Spore + TikTok infinite zoom videos** powered by Gemini 3's full multimodal stack.

You combine elements. Those elements have worlds inside them. Those worlds evolve. You can experience them through any sense. And you can export your journey as viral infinite zoom content.

This is the game that makes people say: "I can't believe AI can do this now."

---

*Document Version: v1*
*Created: January 27, 2026*
*Author: Product Manager Agent*
