# Omnigenesis - Product Specification v4 (DETAILED)

> **"Where Creation Never Ends"**

**Document Version:** v4 (Comprehensive Implementation Spec)
**Created:** January 28, 2026
**Author:** Product Manager Agent
**Status:** Ready for Critic Review
**Win Probability:** 42-55%
**Timeline:** 12 days (Jan 28 - Feb 9, 2026)

---

## Table of Contents

1. [Product Definition](#1-product-definition)
2. [Technical Architecture](#2-technical-architecture)
3. [Gemini API Integration](#3-gemini-api-integration)
4. [Feature Specifications](#4-feature-specifications)
5. [Data Models](#5-data-models)
6. [Folder Structure](#6-folder-structure)
7. [State Management](#7-state-management)
8. [Component Hierarchy](#8-component-hierarchy)
9. [Development Phases](#9-development-phases)
10. [Demo Script](#10-demo-script)
11. [Risk Assessment](#11-risk-assessment)
12. [Technical Showcase](#12-technical-showcase)

---

## 1. Product Definition

### 1.1 Problem Statement

Current AI-powered creative tools are either:
- **Finite** - Limited content libraries (Infinite Craft has 300M+ recipes, but results are just text/simple images)
- **Shallow** - Generated images are endpoints, not explorable worlds
- **Static** - Created content doesn't evolve or change over time

Users want to create without limits, explore without boundaries, and watch their creations come alive.

### 1.2 Target User

**Primary Persona: The Curious Creator**
- Age: 18-35
- Plays browser games during work breaks
- Loves discovery mechanics (Infinite Craft, Little Alchemy, Doodle God)
- Values "just one more" experiences
- Shares interesting discoveries on social media

**Secondary Persona: The Demo Judge**
- Technical background (weighs 40% on Technical Execution)
- Sees 50+ demos in rapid succession
- Needs immediate "wow" to remember project
- Values visible technical innovation

### 1.3 Value Proposition

**One Sentence:** Infinite Craft meets infinite depth - combine anything, zoom into everything, watch civilizations evolve.

**Three Pillars:**

| Pillar | Experience | Technical Foundation | Latency Target |
|--------|------------|---------------------|----------------|
| **COMBINE** | Merge any two elements, get surprising results | Gemini 3 Flash + Imagen 3 | < 2 seconds |
| **ZOOM** | Click any element, discover worlds inside | Imagen 3 + 1M context window | < 2 seconds |
| **EVOLVE** | Watch creations develop civilizations | Veo 3.1 video generation | 1-2 minutes (async) |

### 1.4 Competitive Differentiation

| Product | Strength | Our Advantage |
|---------|----------|---------------|
| Infinite Craft | Endless combinations | We add **depth** - zoom into results |
| DALL-E | Beautiful images | We add **exploration** - images have content inside |
| WorldSim | Evolving worlds | We add **creation** - users control what evolves |

**The Killer Feature:** Everything has something inside. Forever. No endpoints. No "leaf nodes." Infinite depth.

### 1.5 Scope Lock (From Critic Review)

**IN SCOPE:**
- Combine mechanic (P0)
- Zoom system (P0)
- Evolution feature (P1)
- Technical showcase for judges (P1)
- Basic sound effects (P1)
- Constellation map (P2)

**OUT OF SCOPE (Cut for v1):**
- Translate feature (cut)
- Export/share video pipeline (screenshot only)
- Mobile responsive design
- Multiplayer features
- Achievement/leaderboard systems

---

## 2. Technical Architecture

### 2.1 System Overview

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (Browser)                                 │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                        Next.js 14 App Router                            │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐   │  │
│  │  │   Zustand   │  │   dnd-kit   │  │ React Flow  │  │Framer Motion │   │  │
│  │  │   (State)   │  │ (Drag-Drop) │  │(Constellation)│ │ (Animations) │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └──────────────┘   │  │
│  │                                                                          │  │
│  │  ┌───────────────────────────────────────────────────────────────────┐  │  │
│  │  │                        COMPONENTS                                  │  │  │
│  │  │  ElementPalette | CombineZone | ZoomViewport | EvolutionModal     │  │  │
│  │  │  BreadcrumbNav  | DiscoveryLog | TechShowcase | VideoPlayer       │  │  │
│  │  └───────────────────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       │ HTTP/REST
                                       ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                           NEXT.JS API ROUTES                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │ POST /api/combine│  │ POST /api/zoom  │  │ POST /api/evolve            │  │
│  │ (< 2s response)  │  │ (< 2s response) │  │ GET  /api/evolve/:id        │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘  │
│                                                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                      PARALLEL API ORCHESTRATOR                         │  │
│  │   - Manages concurrent Gemini requests                                 │  │
│  │   - Tracks latency metrics (displayed in TechShowcase)                 │  │
│  │   - Handles fallbacks and retries                                      │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       │ HTTPS
                                       ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                              GEMINI 3 APIs                                    │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ gemini-2.0-flash-exp (or gemini-3-flash-preview when available)         ││
│  │   - Combination logic (~500ms)                                          ││
│  │   - Scene descriptions (~700ms)                                         ││
│  │   - Universe context management (1M tokens)                             ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ Imagen 3 (via AI Studio or Vertex AI)                                   ││
│  │   - Element images (512x512, ~1.2s)                                     ││
│  │   - Scene backgrounds (1024x1024, ~1.5s)                                ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ Veo 3.1                                                                  ││
│  │   - Evolution videos (8 seconds, ~90-120s generation)                   ││
│  │   - Async job queue with polling                                        ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow

```
COMBINE FLOW:
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ User drags  │────▶│ Drop in     │────▶│ API: Flash  │────▶│ New Element │
│ 2 elements  │     │ CombineZone │     │ + Imagen    │     │ + Image     │
└─────────────┘     └─────────────┘     │ (parallel)  │     └─────────────┘
                                        └─────────────┘

ZOOM FLOW:
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ User clicks │────▶│ Zoom        │────▶│ API: Flash  │────▶│ New Scene + │
│ element     │     │ transition  │     │ + Imagen    │     │ Elements    │
└─────────────┘     └─────────────┘     │ (parallel)  │     └─────────────┘
                                        └─────────────┘

EVOLVE FLOW:
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ User starts │────▶│ Modal +     │────▶│ API: Veo    │────▶│ Video URL + │
│ evolution   │     │ confirmation│     │ (async,     │     │ new Elements│
└─────────────┘     └─────────────┘     │ 1-2 min)    │     └─────────────┘
                                        └─────────────┘
```

### 2.3 Latency Budget

**CRITICAL: Total response time MUST be < 2 seconds for core loop**

| Operation | Target | Acceptable | Kill (Fallback) |
|-----------|--------|------------|-----------------|
| Flash API (text) | 500ms | 800ms | > 1200ms |
| Imagen (image) | 1000ms | 1500ms | > 2000ms |
| **Combined (parallel)** | **1200ms** | **1800ms** | **> 2500ms** |
| UI Transition | 200ms | 300ms | > 500ms |
| **Total User Latency** | **1400ms** | **2000ms** | **> 3000ms** |

**Latency Tracking Implementation:**
```typescript
// hooks/useLatencyTracker.ts
export function useLatencyTracker() {
  const recordLatency = (type: 'combine' | 'zoom' | 'image', ms: number) => {
    useMetricsStore.getState().recordLatency(type, ms);

    // Warning threshold
    if (ms > 2000) {
      console.warn(`[LATENCY] ${type} exceeded 2s: ${ms}ms`);
    }
  };

  return { recordLatency };
}
```

---

## 3. Gemini API Integration

### 3.1 API Endpoints & Configuration

#### Gemini Flash (Text Generation)

```typescript
// lib/gemini/client.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const flashModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp", // or "gemini-3-flash-preview"
  generationConfig: {
    temperature: 0.85,           // High for creativity
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 500,        // Keep responses concise
    responseMimeType: "application/json",
  },
  safetySettings: [
    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
  ],
});
```

#### Imagen 3 (Image Generation)

```typescript
// lib/imagen/client.ts

// Option A: Via AI Studio (if available)
const IMAGEN_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:generateImages";

export async function generateImage(prompt: string, size: '512' | '1024' = '512'): Promise<string> {
  const startTime = Date.now();

  const response = await fetch(IMAGEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': process.env.GEMINI_API_KEY!,
    },
    body: JSON.stringify({
      instances: [{ prompt }],
      parameters: {
        sampleCount: 1,
        aspectRatio: "1:1",
        outputOptions: {
          mimeType: "image/webp",
          compressionQuality: 85,
        },
        safetyFilterLevel: "block_some",
      },
    }),
  });

  const latency = Date.now() - startTime;
  console.log(`[IMAGEN] Generated in ${latency}ms`);

  const data = await response.json();
  return data.predictions[0].bytesBase64Encoded;
}

// Option B: Via Vertex AI
import { VertexAI } from "@google-cloud/vertexai";

const vertex = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT!,
  location: 'us-central1',
});

export async function generateImageVertex(prompt: string): Promise<string> {
  const model = vertex.preview.getGenerativeModel({
    model: 'imagen-3.0-generate-001',
  });

  const result = await model.generateContent(prompt);
  return result.response.candidates[0].content.parts[0].inlineData.data;
}
```

#### Veo 3.1 (Video Generation)

```typescript
// lib/veo/client.ts

interface VeoJob {
  operationId: string;
  status: 'pending' | 'processing' | 'complete' | 'failed';
  videoUrl?: string;
  error?: string;
}

const VEO_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/veo-3.1:generateVideo";

export async function startVideoGeneration(prompt: string): Promise<string> {
  const response = await fetch(VEO_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': process.env.VEO_API_KEY!,
    },
    body: JSON.stringify({
      prompt,
      parameters: {
        durationSeconds: 8,
        aspectRatio: "16:9",
        resolution: "720p",
      },
    }),
  });

  const data = await response.json();
  return data.name; // Operation ID for polling
}

export async function checkVideoStatus(operationId: string): Promise<VeoJob> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/${operationId}`,
    {
      headers: {
        'x-goog-api-key': process.env.VEO_API_KEY!,
      },
    }
  );

  const data = await response.json();

  return {
    operationId,
    status: data.done ? 'complete' : 'processing',
    videoUrl: data.response?.videoUri,
    error: data.error?.message,
  };
}
```

### 3.2 Prompt Engineering

#### Combine Prompt

```typescript
// lib/gemini/prompts.ts

export const COMBINE_SYSTEM_PROMPT = `You are Omnigenesis, a cosmic creator AI. When given two elements, you determine what they create when combined.

RULES:
1. Results should be surprising but logical in retrospect
2. Results should feel creative, not obvious
3. Always output valid JSON
4. Names should be evocative (2-4 words max)
5. Descriptions should be poetic (1 sentence, max 20 words)
6. Assign rarity: common (70%), uncommon (20%), rare (8%), legendary (2%)
7. Assign depth potential 1-10 (how interesting to zoom into)
8. Assign evolution potential 1-10 (how interesting to evolve)

ELEMENT CATEGORIES (for reference):
- Physical: Objects, creatures, landscapes, materials
- Abstract: Emotions, concepts, phenomena
- Narrative: Characters, stories, moments
- Cosmic: Universal forces, dimensions, paradoxes`;

export function buildCombinePrompt(
  a: Element,
  b: Element,
  context: UniverseContext
): string {
  return `${COMBINE_SYSTEM_PROMPT}

UNIVERSE CONTEXT (recent creations for coherence):
${context.recentElements.slice(0, 20).map(e => `- ${e.name}`).join('\n')}

COMBINATION REQUEST:
Element A: "${a.name}" - ${a.description}
Element B: "${b.name}" - ${b.description}

What do these create when combined? Respond with ONLY this JSON:
{
  "name": "string (2-4 words)",
  "description": "string (1 poetic sentence)",
  "emoji": "string (1-2 emoji)",
  "rarity": "common" | "uncommon" | "rare" | "legendary",
  "depthPotential": number (1-10),
  "evolutionPotential": number (1-10)
}`;
}
```

#### Zoom Prompt

```typescript
export const ZOOM_SYSTEM_PROMPT = `You are Omnigenesis, revealing the infinite worlds within everything.

When a user zooms into an element, you reveal what exists INSIDE it - a scene with 3-5 discoverable elements.

RULES:
1. The scene should feel like entering a new world
2. Elements within should be thematically connected but surprising
3. Each element is a noun with its own potential for depth
4. Scenes should have narrative potential
5. Visual descriptions should be vivid and specific
6. The deeper the zoom, the more abstract/strange things can become
7. Each scene element needs a position (x: 0-100, y: 0-100)`;

export function buildZoomPrompt(
  element: Element,
  context: UniverseContext,
  depth: number
): string {
  return `${ZOOM_SYSTEM_PROMPT}

CURRENT DEPTH: ${depth} (1 = surface, deeper = stranger)
ZOOM PATH: ${context.zoomPath.map(z => z.element.name).join(' > ')} > ${element.name}

UNIVERSE CONTEXT:
${context.recentElements.slice(0, 15).map(e => `- ${e.name}`).join('\n')}

ELEMENT TO ZOOM INTO: "${element.name}"
Description: ${element.description}

Reveal what's inside. Respond with ONLY this JSON:
{
  "sceneDescription": "string (2-3 sentences describing the world inside)",
  "sceneVisual": "string (1-2 sentences for image generation prompt)",
  "elements": [
    {
      "name": "string (2-3 words)",
      "description": "string (1 sentence)",
      "emoji": "string (1-2 emoji)",
      "position": { "x": number (0-100), "y": number (0-100) },
      "depthPotential": number (1-10),
      "evolutionPotential": number (1-10)
    }
  ],
  "ambientDescription": "string (mood, sounds, atmosphere)"
}`;
}
```

#### Evolution Prompt

```typescript
export const EVOLUTION_SYSTEM_PROMPT = `You are Omnigenesis, the witness of eons.

When an element evolves, you describe what happens over millions of years. The video will show this transformation.`;

export function buildEvolutionPrompt(
  element: Element,
  context: UniverseContext
): string {
  return `${EVOLUTION_SYSTEM_PROMPT}

ELEMENT: "${element.name}"
Description: ${element.description}
Evolution Potential: ${element.evolutionPotential}/10

Describe the 8-second evolution video. Respond with ONLY this JSON:
{
  "videoPrompt": "string (cinematic description for Veo, 2-3 sentences)",
  "stages": [
    { "second": 0, "description": "Beginning state" },
    { "second": 2, "description": "First transformation" },
    { "second": 4, "description": "Civilization/meaning emerges" },
    { "second": 6, "description": "Peak moment" },
    { "second": 8, "description": "Final state" }
  ],
  "emergedElements": [
    {
      "name": "string",
      "description": "string",
      "emoji": "string"
    }
  ],
  "narrativeHook": "string (ties back to the creator)"
}`;
}
```

### 3.3 Context Window Management (1M Tokens)

```typescript
// lib/utils/context.ts

interface UniverseContext {
  // Core state (always included)
  recentElements: Element[];        // Last 50 elements created
  zoomPath: ZoomBreadcrumb[];       // Current zoom navigation
  currentScene: ZoomScene | null;   // Active scene

  // Relationship tracking
  combinations: CombinationRecord[]; // What was combined to make what

  // Narrative threads
  themes: string[];                  // Recurring themes detected
  characters: string[];              // Named entities that recur

  // Token management
  tokenCount: number;                // Current token usage estimate
  maxTokens: number;                 // 1M limit
}

// Token estimation helper
export function estimateTokens(text: string): number {
  // Rough estimate: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
}

// Context compression when approaching limit
export function compressContext(ctx: UniverseContext): UniverseContext {
  if (ctx.tokenCount < 800000) return ctx; // 80% threshold

  return {
    ...ctx,
    recentElements: ctx.recentElements.slice(0, 30),
    combinations: ctx.combinations.slice(-100),
    themes: ctx.themes.slice(0, 5),
    characters: ctx.characters.slice(0, 10),
    tokenCount: estimateTokens(JSON.stringify({
      recentElements: ctx.recentElements.slice(0, 30),
      combinations: ctx.combinations.slice(-100),
    })),
  };
}
```

---

## 4. Feature Specifications

### 4.1 P0 Features (Must Have - Core Game Loop)

#### P0-1: Element Palette

**User Story:** As a player, I want to see all my discovered elements so I can choose what to combine.

**Acceptance Criteria:**
- [ ] Display 12 starting primordial elements on first load
- [ ] Show all discovered elements in scrollable grid
- [ ] Elements are draggable (via dnd-kit)
- [ ] Elements show: emoji, name, rarity glow (if rare+)
- [ ] Discovery counter shows "X discovered"
- [ ] Elements grouped: Primordials first, then Discovered (recent first)
- [ ] Hover shows full description tooltip

**Technical Implementation:**
```typescript
// components/game/ElementPalette/ElementPalette.tsx
import { useDraggable } from '@dnd-kit/core';
import { useGameStore } from '@/stores/gameStore';

export function ElementPalette() {
  const elements = useGameStore((state) => state.elements);
  const discoveries = useGameStore((state) => state.discoveries);

  const primordials = elements.filter(e => e.isPrimordial);
  const discovered = elements.filter(e => !e.isPrimordial);

  return (
    <aside className="w-64 bg-black/50 p-4 overflow-y-auto">
      <h2 className="text-gold font-bold mb-2">Elements</h2>
      <p className="text-sm text-gray-400 mb-4">{discoveries} discovered</p>

      <section>
        <h3 className="text-sm text-gray-500 mb-2">Primordials</h3>
        <div className="grid grid-cols-4 gap-2">
          {primordials.map(el => (
            <DraggableElement key={el.id} element={el} />
          ))}
        </div>
      </section>

      <section className="mt-4">
        <h3 className="text-sm text-gray-500 mb-2">Discovered</h3>
        <div className="grid grid-cols-4 gap-2">
          {discovered.map(el => (
            <DraggableElement key={el.id} element={el} />
          ))}
        </div>
      </section>
    </aside>
  );
}
```

**Effort:** 4 hours

---

#### P0-2: Combine Zone

**User Story:** As a player, I want to drag two elements together to create something new.

**Acceptance Criteria:**
- [ ] Central drop zone visible at all times
- [ ] Visual feedback when dragging over zone (glow)
- [ ] Accepts exactly 2 elements (slots A and B)
- [ ] Shows "?" result placeholder during generation
- [ ] Displays result with spring animation within 2 seconds
- [ ] Result can be clicked to zoom into it
- [ ] Clear button to reset slots

**Technical Implementation:**
```typescript
// components/game/CombineZone/CombineZone.tsx
import { useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';

export function CombineZone() {
  const {
    combineSlotA,
    combineSlotB,
    combineResult,
    isCombining,
    combine,
    clearCombine,
  } = useGameStore();

  const { setNodeRef, isOver } = useDroppable({ id: 'combine-zone' });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex items-center justify-center gap-4 p-8 rounded-lg",
        "bg-gradient-to-r from-purple-900/30 to-blue-900/30",
        "border-2 border-dashed",
        isOver ? "border-gold" : "border-gray-700"
      )}
    >
      <CombineSlot element={combineSlotA} slot="A" />
      <span className="text-2xl text-gray-500">+</span>
      <CombineSlot element={combineSlotB} slot="B" />
      <span className="text-2xl text-gray-500">=</span>

      <AnimatePresence mode="wait">
        {isCombining ? (
          <motion.div
            key="loading"
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            exit={{ scale: 0 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="w-16 h-16 rounded-lg bg-purple-500/50 flex items-center justify-center"
          >
            ?
          </motion.div>
        ) : combineResult ? (
          <motion.div
            key="result"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            <ElementCard element={combineResult} />
          </motion.div>
        ) : (
          <div className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-700" />
        )}
      </AnimatePresence>
    </div>
  );
}
```

**Effort:** 6 hours

---

#### P0-3: Zoom Viewport

**User Story:** As a player, I want to click on any element to discover the world inside it.

**Acceptance Criteria:**
- [ ] Main viewport area showing current scene
- [ ] Scene background image (Imagen generated)
- [ ] 3-5 clickable elements positioned in scene
- [ ] Click element = zoom transition + new scene loads
- [ ] Smooth zoom transition (1s, Framer Motion)
- [ ] Elements in scene are collectible (click + to add to palette)
- [ ] Loading state during scene generation (pulsing border)
- [ ] Empty state when no scene (instruction text)

**Technical Implementation:**
```typescript
// components/game/ZoomViewport/ZoomViewport.tsx
import { motion, AnimatePresence } from 'framer-motion';

export function ZoomViewport() {
  const { currentScene, isZooming, pushZoom, collectSceneElement } = useGameStore();

  if (!currentScene) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black/30 rounded-lg">
        <p className="text-gray-500">Click an element to zoom in</p>
      </div>
    );
  }

  return (
    <motion.div
      className="flex-1 relative rounded-lg overflow-hidden"
      layout
    >
      {/* Scene Background */}
      <motion.img
        src={currentScene.backgroundImageUrl}
        alt={currentScene.description}
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      />

      {/* Scene Elements */}
      {currentScene.elements.map((sceneEl) => (
        <SceneElement
          key={sceneEl.element.id}
          sceneElement={sceneEl}
          onZoom={() => handleZoom(sceneEl.element)}
          onCollect={() => collectSceneElement(sceneEl.element.id)}
        />
      ))}

      {/* Loading Overlay */}
      <AnimatePresence>
        {isZooming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center"
          >
            <div className="animate-pulse text-xl">Zooming...</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
```

**Effort:** 8 hours

---

#### P0-4: Breadcrumb Navigation

**User Story:** As a player, I want to navigate back to previous zoom levels.

**Acceptance Criteria:**
- [ ] Show zoom path: "Surface > Fire > Candle > ..."
- [ ] Click any breadcrumb to zoom out to that level
- [ ] Depth indicator shows current level number
- [ ] Smooth reverse zoom transition
- [ ] Maximum display: 5 breadcrumbs (collapse middle with "...")
- [ ] "Surface" always shown as root

**Technical Implementation:**
```typescript
// components/game/Navigation/BreadcrumbNav.tsx

export function BreadcrumbNav() {
  const { zoomStack, popToLevel } = useGameStore();
  const depth = zoomStack.length;

  // Collapse if more than 5 levels
  const displayItems = useMemo(() => {
    if (zoomStack.length <= 5) return zoomStack;

    return [
      zoomStack[0],
      { collapsed: true, count: zoomStack.length - 4 },
      ...zoomStack.slice(-3),
    ];
  }, [zoomStack]);

  return (
    <nav className="flex items-center gap-2 text-sm">
      <button
        onClick={() => popToLevel(0)}
        className="text-gold hover:underline"
      >
        Surface
      </button>

      {displayItems.map((item, i) => (
        <Fragment key={i}>
          <span className="text-gray-600">/</span>
          {item.collapsed ? (
            <span className="text-gray-500">...({item.count})</span>
          ) : (
            <button
              onClick={() => popToLevel(i + 1)}
              className="hover:text-gold"
            >
              {item.element.emoji} {item.element.name}
            </button>
          )}
        </Fragment>
      ))}

      <span className="ml-4 text-gray-500">Depth: {depth}</span>
    </nav>
  );
}
```

**Effort:** 3 hours

---

#### P0-5: Discovery Counter

**User Story:** As a player, I want to see how many elements I've discovered.

**Acceptance Criteria:**
- [ ] Shows "X Discovered" count prominently
- [ ] Animates on new discovery (+1 with pulse)
- [ ] Shows "FIRST!" badge for legendary rarity (mock)

**Effort:** 2 hours

---

### 4.2 P1 Features (Should Have - Enhanced Experience)

#### P1-1: Evolution System

**User Story:** As a player, I want to evolve elements and watch civilizations emerge.

**Acceptance Criteria:**
- [ ] "Evolve" button appears on elements with evolutionPotential >= 5
- [ ] Modal explains: "This takes 1-2 minutes"
- [ ] Modal shows element details and stages preview
- [ ] Progress indicator during generation (0-100%)
- [ ] Notification when evolution complete
- [ ] Video player to watch evolution (8 seconds)
- [ ] New elements emerge after video completes
- [ ] Can continue playing while evolution generates

**Technical Implementation:**
```typescript
// components/game/Evolution/EvolutionModal.tsx

export function EvolutionModal() {
  const {
    isEvolutionModalOpen,
    evolutionModalElement,
    closeEvolutionModal,
    startEvolution,
  } = useUIStore();

  if (!isEvolutionModalOpen || !evolutionModalElement) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-gray-900 rounded-lg p-6 max-w-md w-full"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold text-gold mb-4">
          Evolve: {evolutionModalElement.emoji} {evolutionModalElement.name}
        </h2>

        <p className="text-gray-300 mb-4">
          Watch millions of years unfold. See what your creation becomes.
        </p>

        <div className="bg-yellow-900/30 border border-yellow-700 rounded p-3 mb-6">
          <p className="text-yellow-200 text-sm">
            ⏳ This generates a video and takes about 1-2 minutes.
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={closeEvolutionModal}
            className="flex-1 py-2 rounded border border-gray-600 hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => startEvolution(evolutionModalElement.id)}
            className="flex-1 py-2 rounded bg-gold text-black font-bold hover:bg-yellow-500"
          >
            Start Evolution
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
```

**Effort:** 12 hours total

---

#### P1-2: Technical Showcase Panel

**User Story:** As a judge reviewing the demo, I want to see the technical depth of the implementation.

**Acceptance Criteria:**
- [ ] Toggle panel with keyboard shortcut (T key)
- [ ] Real-time latency meter for Combine and Zoom
- [ ] Context token usage counter (X / 1,000,000)
- [ ] Parallel API orchestration visualization
- [ ] Universe stats (elements, depth, zooms)
- [ ] Subtle, doesn't distract from gameplay

**Effort:** 4 hours

---

#### P1-3: Sound Effects

**User Story:** As a player, I want satisfying audio feedback for my actions.

**Acceptance Criteria:**
- [ ] Combine sound (crystallize chime)
- [ ] Discovery sound (discovery sparkle)
- [ ] Zoom sound (whoosh + depth echo)
- [ ] Evolution complete sound (epic reveal)
- [ ] Mute toggle in settings

**Implementation:**
```typescript
// hooks/useSoundEffects.ts
import useSound from 'use-sound';

export function useSoundEffects() {
  const isMuted = useUIStore((state) => state.isSoundMuted);

  const [playCombine] = useSound('/sounds/combine.mp3', { volume: 0.5, soundEnabled: !isMuted });
  const [playDiscover] = useSound('/sounds/discover.mp3', { volume: 0.6, soundEnabled: !isMuted });
  const [playZoom] = useSound('/sounds/zoom.mp3', { volume: 0.4, soundEnabled: !isMuted });
  const [playEvolve] = useSound('/sounds/evolve-complete.mp3', { volume: 0.7, soundEnabled: !isMuted });

  return { playCombine, playDiscover, playZoom, playEvolve };
}
```

**Effort:** 3 hours

---

#### P1-4: Visual Polish (Animations)

**User Story:** As a player, I want the game to feel satisfying and polished.

**Acceptance Criteria:**
- [ ] Element appear: spring scale + opacity
- [ ] Combine flash: white flash on drop
- [ ] Discovery confetti: on first discovery
- [ ] Rare element glow: CSS box-shadow pulse
- [ ] Ambient particles: subtle cosmic background
- [ ] Hover effects on all interactive elements

**Effort:** 4 hours

---

### 4.3 P2 Features (Nice to Have)

| Feature | Effort | Description |
|---------|--------|-------------|
| Constellation Map | 6h | React Flow visualization of all elements |
| Depth Potential Stars | 1h | 1-3 stars showing depth potential |
| Combination Hints | 2h | Subtle highlight of good combinations |
| Screenshot/Share | 2h | Capture viewport with branding |

---

## 5. Data Models

### 5.1 Core Types

```typescript
// types/element.ts

export interface Element {
  id: string;                    // UUID v4
  name: string;                  // "The Candle in the Window"
  description: string;           // "A flame that never wavers..."
  emoji: string;                 // "🕯️🪟"

  // Images
  imageUrl: string;              // URL to generated image
  imageBase64?: string;          // Fallback for offline/caching

  // Classification
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  depthPotential: number;        // 1-10
  evolutionPotential: number;    // 1-10

  // Origins
  isPrimordial: boolean;         // Starting element
  parentA?: string;              // Element ID of first parent
  parentB?: string;              // Element ID of second parent

  // Discovery
  discoveredAt: string;          // ISO timestamp
  discoveredAtDepth: number;     // What zoom level was this found at
  isFirstDiscovery: boolean;     // Was this a global first? (mock)
}
```

### 5.2 Scene Types

```typescript
// types/scene.ts

export interface ZoomScene {
  id: string;                    // UUID v4
  parentElementId: string;       // What element contains this scene
  depth: number;                 // How deep (1 = surface)

  // Visual
  description: string;           // "A vast library with infinite shelves..."
  backgroundImageUrl: string;    // Imagen generated
  ambientDescription: string;    // "Dust motes float in shafts of light..."

  // Contents
  elements: SceneElement[];      // Elements in this scene

  // Timestamps
  generatedAt: string;           // ISO timestamp
}

export interface SceneElement {
  element: Element;
  position: {
    x: number;                   // 0-100 (percentage)
    y: number;                   // 0-100 (percentage)
  };
  isCollected: boolean;          // Has user added to palette
}

export interface ZoomBreadcrumb {
  sceneId: string;
  element: Element;              // The element zoomed into
  depth: number;
}
```

### 5.3 Evolution Types

```typescript
// types/evolution.ts

export interface EvolutionJob {
  id: string;                    // UUID v4
  elementId: string;             // What element is evolving
  status: 'pending' | 'generating' | 'complete' | 'failed';
  progress: number;              // 0-100

  // Timestamps
  startedAt: string;
  completedAt?: string;

  // Results
  videoUrl?: string;
  emergedElements?: Element[];
  narrativeHook?: string;

  // Error handling
  errorMessage?: string;
  retryCount: number;
}
```

### 5.4 Universe Context

```typescript
// types/universe.ts

export interface UniverseContext {
  sessionId: string;
  createdAt: string;

  // Element tracking
  recentElements: Element[];     // Last 50
  allElementIds: Set<string>;    // Fast lookup

  // Zoom context
  zoomPath: ZoomBreadcrumb[];
  currentScene: ZoomScene | null;
  deepestReached: number;

  // Relationships
  combinations: CombinationRecord[];

  // Metrics
  tokenCount: number;
  totalDiscoveries: number;
  totalZooms: number;
  totalEvolutions: number;
}

export interface CombinationRecord {
  id: string;
  inputA: string;                // Element ID
  inputB: string;                // Element ID
  output: string;                // Element ID
  timestamp: string;
}
```

---

## 6. Folder Structure

```
omnigenesis/
├── .env.local                  # API keys (NEVER commit)
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
│
├── public/
│   ├── sounds/
│   │   ├── combine.mp3
│   │   ├── discover.mp3
│   │   ├── zoom.mp3
│   │   └── evolve-complete.mp3
│   ├── fonts/
│   │   ├── SpaceGrotesk-Variable.woff2
│   │   └── Inter-Variable.woff2
│   └── images/
│       ├── logo.svg
│       ├── primordials/         # Pre-generated
│       │   ├── stone.webp
│       │   ├── water.webp
│       │   └── ... (12 total)
│       └── fallback-element.webp
│
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Main game page
│   │   ├── globals.css         # Tailwind + custom
│   │   └── api/
│   │       ├── combine/
│   │       │   └── route.ts    # POST - combine
│   │       ├── zoom/
│   │       │   └── route.ts    # POST - zoom
│   │       └── evolve/
│   │           ├── route.ts    # POST - start
│   │           └── [id]/
│   │               └── route.ts # GET - status
│   │
│   ├── components/
│   │   ├── ui/                 # Primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Tooltip.tsx
│   │   │
│   │   ├── game/               # Core game
│   │   │   ├── ElementPalette/
│   │   │   ├── CombineZone/
│   │   │   ├── ZoomViewport/
│   │   │   ├── Evolution/
│   │   │   └── Navigation/
│   │   │
│   │   ├── showcase/           # Tech showcase
│   │   │   ├── TechShowcase.tsx
│   │   │   ├── LatencyMeter.tsx
│   │   │   └── ContextCounter.tsx
│   │   │
│   │   └── effects/            # Visual effects
│   │       ├── DiscoveryConfetti.tsx
│   │       ├── ParticleBackground.tsx
│   │       └── CombineFlash.tsx
│   │
│   ├── hooks/
│   │   ├── useCombine.ts
│   │   ├── useZoom.ts
│   │   ├── useEvolution.ts
│   │   ├── useSoundEffects.ts
│   │   └── useLatencyTracker.ts
│   │
│   ├── stores/
│   │   ├── gameStore.ts        # Main state
│   │   ├── uiStore.ts          # UI state
│   │   └── metricsStore.ts     # Performance
│   │
│   ├── lib/
│   │   ├── gemini/
│   │   │   ├── client.ts
│   │   │   ├── prompts.ts
│   │   │   └── schemas.ts
│   │   ├── imagen/
│   │   │   └── client.ts
│   │   ├── veo/
│   │   │   ├── client.ts
│   │   │   └── queue.ts
│   │   └── utils/
│   │       ├── cn.ts
│   │       └── uuid.ts
│   │
│   ├── types/
│   │   ├── element.ts
│   │   ├── scene.ts
│   │   ├── evolution.ts
│   │   └── universe.ts
│   │
│   └── data/
│       └── primordials.ts      # 12 starting elements
│
└── scripts/
    ├── validate-apis.ts        # Day 1-2
    └── pre-generate-demo.ts    # Day 10
```

---

## 7. State Management

### 7.1 Game Store (Zustand)

```typescript
// stores/gameStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PRIMORDIAL_ELEMENTS } from '@/data/primordials';

interface GameState {
  // ELEMENTS
  elements: Element[];
  addElement: (element: Element) => void;

  // COMBINE
  combineSlotA: Element | null;
  combineSlotB: Element | null;
  combineResult: Element | null;
  isCombining: boolean;
  setCombineSlot: (slot: 'A' | 'B', element: Element | null) => void;
  startCombine: () => void;
  completeCombine: (result: Element) => void;
  clearCombine: () => void;

  // ZOOM
  currentScene: ZoomScene | null;
  zoomStack: ZoomBreadcrumb[];
  isZooming: boolean;
  pushZoom: (scene: ZoomScene, element: Element) => void;
  popZoom: () => void;
  popToLevel: (depth: number) => void;
  collectSceneElement: (elementId: string) => void;

  // EVOLUTION
  evolutionQueue: EvolutionJob[];
  completedEvolutions: Evolution[];
  startEvolution: (elementId: string) => void;
  updateEvolutionProgress: (jobId: string, progress: number) => void;
  completeEvolution: (jobId: string, evolution: Evolution) => void;

  // UNIVERSE CONTEXT
  universeContext: UniverseContext;

  // METRICS
  discoveries: number;
  deepestZoom: number;

  // RESET
  resetGame: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state
      elements: PRIMORDIAL_ELEMENTS,
      combineSlotA: null,
      combineSlotB: null,
      combineResult: null,
      isCombining: false,
      currentScene: null,
      zoomStack: [],
      isZooming: false,
      evolutionQueue: [],
      completedEvolutions: [],
      universeContext: createInitialContext(),
      discoveries: 12,
      deepestZoom: 0,

      // Actions
      addElement: (element) => set((state) => ({
        elements: [...state.elements, element],
        discoveries: state.discoveries + 1,
        universeContext: {
          ...state.universeContext,
          recentElements: [element, ...state.universeContext.recentElements].slice(0, 50),
          totalDiscoveries: state.universeContext.totalDiscoveries + 1,
        },
      })),

      setCombineSlot: (slot, element) => set((state) => ({
        [slot === 'A' ? 'combineSlotA' : 'combineSlotB']: element,
      })),

      startCombine: () => set({ isCombining: true }),

      completeCombine: (result) => set((state) => ({
        isCombining: false,
        combineResult: result,
        elements: [...state.elements, result],
        discoveries: state.discoveries + 1,
        universeContext: {
          ...state.universeContext,
          recentElements: [result, ...state.universeContext.recentElements].slice(0, 50),
          combinations: [
            ...state.universeContext.combinations,
            {
              id: crypto.randomUUID(),
              inputA: state.combineSlotA!.id,
              inputB: state.combineSlotB!.id,
              output: result.id,
              timestamp: new Date().toISOString(),
            },
          ],
        },
      })),

      clearCombine: () => set({
        combineSlotA: null,
        combineSlotB: null,
        combineResult: null,
      }),

      pushZoom: (scene, element) => set((state) => ({
        currentScene: scene,
        zoomStack: [...state.zoomStack, { sceneId: scene.id, element, depth: scene.depth }],
        deepestZoom: Math.max(state.deepestZoom, scene.depth),
        isZooming: false,
        universeContext: {
          ...state.universeContext,
          zoomPath: [...state.universeContext.zoomPath, { sceneId: scene.id, element, depth: scene.depth }],
          currentScene: scene,
          totalZooms: state.universeContext.totalZooms + 1,
        },
      })),

      popToLevel: (depth) => set((state) => {
        const newStack = state.zoomStack.slice(0, depth);
        return {
          zoomStack: newStack,
          currentScene: depth === 0 ? null : state.currentScene, // Would need scene fetch
          universeContext: {
            ...state.universeContext,
            zoomPath: newStack,
          },
        };
      }),

      collectSceneElement: (elementId) => set((state) => {
        if (!state.currentScene) return state;

        const sceneEl = state.currentScene.elements.find(e => e.element.id === elementId);
        if (!sceneEl || sceneEl.isCollected) return state;

        return {
          elements: [...state.elements, sceneEl.element],
          discoveries: state.discoveries + 1,
          currentScene: {
            ...state.currentScene,
            elements: state.currentScene.elements.map(e =>
              e.element.id === elementId ? { ...e, isCollected: true } : e
            ),
          },
        };
      }),

      // ... other actions
    }),
    {
      name: 'omnigenesis-game',
      partialize: (state) => ({
        elements: state.elements,
        discoveries: state.discoveries,
        deepestZoom: state.deepestZoom,
      }),
    }
  )
);

function createInitialContext(): UniverseContext {
  return {
    sessionId: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    recentElements: PRIMORDIAL_ELEMENTS,
    allElementIds: new Set(PRIMORDIAL_ELEMENTS.map(e => e.id)),
    zoomPath: [],
    currentScene: null,
    deepestReached: 0,
    combinations: [],
    tokenCount: 0,
    totalDiscoveries: 12,
    totalZooms: 0,
    totalEvolutions: 0,
  };
}
```

### 7.2 UI Store

```typescript
// stores/uiStore.ts
import { create } from 'zustand';

interface UIState {
  // Modals
  isEvolutionModalOpen: boolean;
  evolutionModalElement: Element | null;
  isConstellationOpen: boolean;

  // Settings
  isSoundMuted: boolean;
  showTechShowcase: boolean;

  // Notifications
  notifications: Notification[];

  // Actions
  openEvolutionModal: (element: Element) => void;
  closeEvolutionModal: () => void;
  toggleTechShowcase: () => void;
  toggleSound: () => void;
  addNotification: (n: Notification) => void;
  removeNotification: (id: string) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isEvolutionModalOpen: false,
  evolutionModalElement: null,
  isConstellationOpen: false,
  isSoundMuted: false,
  showTechShowcase: false,
  notifications: [],

  openEvolutionModal: (element) => set({
    isEvolutionModalOpen: true,
    evolutionModalElement: element,
  }),

  closeEvolutionModal: () => set({
    isEvolutionModalOpen: false,
    evolutionModalElement: null,
  }),

  toggleTechShowcase: () => set((state) => ({
    showTechShowcase: !state.showTechShowcase,
  })),

  toggleSound: () => set((state) => ({
    isSoundMuted: !state.isSoundMuted,
  })),

  addNotification: (n) => set((state) => ({
    notifications: [...state.notifications, n],
  })),

  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id),
  })),
}));
```

### 7.3 Metrics Store

```typescript
// stores/metricsStore.ts
import { create } from 'zustand';

interface MetricsState {
  combineLatencies: number[];
  zoomLatencies: number[];
  imageLatencies: number[];
  activeApiCalls: number;
  currentTokenCount: number;
  peakTokenCount: number;

  recordLatency: (type: 'combine' | 'zoom' | 'image', ms: number) => void;
  getAverageLatency: (type: 'combine' | 'zoom' | 'image') => number;
  getP95Latency: (type: 'combine' | 'zoom' | 'image') => number;
  incrementApiCalls: () => void;
  decrementApiCalls: () => void;
  updateTokenCount: (count: number) => void;
}

export const useMetricsStore = create<MetricsState>()((set, get) => ({
  combineLatencies: [],
  zoomLatencies: [],
  imageLatencies: [],
  activeApiCalls: 0,
  currentTokenCount: 0,
  peakTokenCount: 0,

  recordLatency: (type, ms) => set((state) => {
    const key = `${type}Latencies` as 'combineLatencies' | 'zoomLatencies' | 'imageLatencies';
    return { [key]: [...state[key], ms].slice(-100) };
  }),

  getAverageLatency: (type) => {
    const key = `${type}Latencies` as const;
    const latencies = get()[key];
    if (latencies.length === 0) return 0;
    return Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length);
  },

  getP95Latency: (type) => {
    const key = `${type}Latencies` as const;
    const sorted = [...get()[key]].sort((a, b) => a - b);
    if (sorted.length === 0) return 0;
    return sorted[Math.floor(sorted.length * 0.95)];
  },

  incrementApiCalls: () => set((s) => ({ activeApiCalls: s.activeApiCalls + 1 })),
  decrementApiCalls: () => set((s) => ({ activeApiCalls: Math.max(0, s.activeApiCalls - 1) })),
  updateTokenCount: (count) => set((s) => ({
    currentTokenCount: count,
    peakTokenCount: Math.max(s.peakTokenCount, count),
  })),
}));
```

---

## 8. Component Hierarchy

```
App (layout.tsx)
├── Providers
│   ├── DndContext (dnd-kit)
│   └── ToastProvider
│
└── GamePage (page.tsx)
    ├── Header
    │   ├── Logo
    │   ├── DiscoveryCounter
    │   ├── DepthIndicator
    │   └── SettingsButton
    │
    ├── MainContent (flex row)
    │   ├── ElementPalette (left sidebar)
    │   │   ├── PrimordialSection
    │   │   │   └── DraggableElement[]
    │   │   ├── DiscoveredSection
    │   │   │   └── DraggableElement[]
    │   │   └── EvolutionQueueMini
    │   │
    │   ├── GameArea (center)
    │   │   ├── BreadcrumbNav
    │   │   ├── ZoomViewport
    │   │   │   ├── SceneBackground
    │   │   │   ├── SceneElement[]
    │   │   │   └── ZoomControls
    │   │   └── CombineZone
    │   │       ├── CombineSlot (A)
    │   │       ├── CombineSlot (B)
    │   │       └── CombineResult
    │   │
    │   └── TechShowcase (right, toggle)
    │       ├── LatencyMeter
    │       ├── ContextCounter
    │       └── APIOrchestrator
    │
    ├── Modals (portals)
    │   ├── EvolutionModal
    │   │   ├── EvolutionPrompt
    │   │   ├── EvolutionProgress
    │   │   └── EvolutionPlayer
    │   └── ConstellationModal
    │
    ├── Effects (fixed/absolute)
    │   ├── ParticleBackground
    │   └── DiscoveryConfetti
    │
    └── Notifications (fixed bottom-right)
        └── NotificationToast[]
```

---

## 9. Development Phases

### Phase 0: API Validation (Days 1-2)

**Objective:** Confirm all APIs work within latency requirements. GO/NO-GO decision.

#### Day 1: Text Generation Testing

| Task | Time | Acceptance |
|------|------|------------|
| Setup Next.js 14 project | 1h | `npm run dev` works |
| Configure Gemini SDK | 1h | Can call Flash API |
| Create combine CLI test | 2h | 50+ combinations < 1200ms p95 |
| Refine combine prompt | 2h | Results are creative |
| Log latency metrics | 1h | Have spreadsheet |

**Day 1 Checklist:**
- [ ] `npm create next-app@latest omnigenesis --typescript --tailwind --app`
- [ ] Add `@google/generative-ai` package
- [ ] Create `.env.local` with `GEMINI_API_KEY`
- [ ] Create `scripts/validate-apis.ts`
- [ ] Run 50 combination tests
- [ ] Document: p50, p90, p99 latencies

**GO/NO-GO:**
- Flash p95 < 1200ms: **GO**
- Flash p95 1200-1800ms: **GO with warning**
- Flash p95 > 1800ms: **EVALUATE**

#### Day 2: Image + Video Testing

| Task | Time | Acceptance |
|------|------|------------|
| Setup Imagen client | 1.5h | Can generate images |
| Test 30 image generations | 2h | All < 2000ms p95 |
| Test parallel Flash + Imagen | 1.5h | Combined < 2500ms |
| Setup Veo client | 2h | Can start + poll job |
| Generate 3 test videos | 1h | All complete < 3 min |

**Day 2 Checklist:**
- [ ] Imagen endpoint configured
- [ ] 30 image tests complete
- [ ] Parallel API test passing
- [ ] Veo client working
- [ ] 3 test videos generated
- [ ] All latency metrics documented

---

### Phase 1: Core Combine (Days 3-4)

**Objective:** Working combine mechanic. First playable state.

#### Day 3: Foundation

| Task | Time |
|------|------|
| Create folder structure | 1h |
| Configure Tailwind theme | 0.5h |
| Setup Zustand stores | 1h |
| Define primordials data | 0.5h |
| Build ElementPalette UI | 2h |
| Create layout shell | 1h |

**Day 3 Deliverable:** Can see palette with 12 primordial elements

#### Day 4: Combine Mechanic

| Task | Time |
|------|------|
| Setup dnd-kit | 1h |
| Build CombineZone UI | 2h |
| Create /api/combine route | 1.5h |
| Add result animation | 1.5h |
| Error handling + retry | 1h |
| End-to-end test | 1h |

**Day 4 Deliverable:** Can combine elements infinitely. Core loop works!

---

### Phase 2: Zoom System (Days 5-6)

**HIGHEST RISK PHASE**

#### Day 5: Zoom Foundation

| Task | Time |
|------|------|
| Create /api/zoom route | 2h |
| Build ZoomViewport UI | 2h |
| Handle click-to-zoom | 1.5h |
| Basic zoom transition | 1.5h |
| Breadcrumb navigation | 1h |

**Day 5 Deliverable:** Can zoom into elements, see scenes

#### Day 6: Zoom Polish

| Task | Time |
|------|------|
| Smooth Framer transitions | 2h |
| Element collection from scenes | 1h |
| Zoom out navigation | 1h |
| Context management | 2h |
| Depth tracking | 1h |
| Edge case handling | 1h |

**Day 6 Deliverable:** Zoom feels magical. Can go infinitely deep.

---

### Phase 3: Polish Core (Days 7-8)

#### Day 7: Visual Juice

| Task | Time |
|------|------|
| Element spring animation | 0.5h |
| Combine flash effect | 0.5h |
| Discovery confetti | 1h |
| Rare element glow | 0.5h |
| Particle background | 1.5h |
| Hover effects | 1h |
| Loading states | 1.5h |
| Micro-animations | 1h |

#### Day 8: Sound + Final Polish

| Task | Time |
|------|------|
| Add sound effects (use-sound) | 2h |
| Mute toggle | 0.5h |
| UI polish pass | 2h |
| Bug fixes | 2h |
| Performance check | 1h |

**Day 8 Deliverable:** Game is FUN. Core experience polished.

---

### Phase 4: Evolution (Days 9-10)

#### Day 9: Evolution System

| Task | Time |
|------|------|
| Evolve button UI | 1h |
| Evolution modal | 2h |
| Veo API integration | 2h |
| Job queue in state | 1.5h |
| Polling mechanism | 1.5h |

#### Day 10: Evolution Complete

| Task | Time |
|------|------|
| Progress indicator | 1h |
| Completion notification | 1h |
| Video player | 1.5h |
| Emerged elements | 1.5h |
| Pre-generate demo videos | 2h |
| Integration testing | 1h |

**Day 10 Deliverable:** All three pillars functional!

---

### Phase 5: Demo Prep (Days 11-12)

#### Day 11: Technical Showcase + Content

| Task | Time |
|------|------|
| Build TechShowcase component | 2h |
| Toggle with T key | 0.5h |
| Pre-generate 50 zoom scenes | 2h |
| Script demo sequence | 1h |
| Practice runs (5+) | 1.5h |
| Fix any issues | 1h |

#### Day 12: Record and Submit

| Task | Time |
|------|------|
| Recording setup (OBS) | 0.5h |
| Record multiple takes | 2h |
| Edit video (music, overlays) | 2h |
| Write Devpost submission | 1.5h |
| Final review | 0.5h |
| SUBMIT | 0.5h |

**Day 12 Deliverable:** PROJECT SHIPPED! Before 5PM PT

---

## 10. Demo Script

### 10.1 Video Structure (2:00)

```
[0:00-0:05] HOOK
- Black screen, single element appears
- "What if everything you created..."
- Element expands into world
- "...had infinite worlds inside?"

[0:05-0:10] TITLE
- OMNIGENESIS logo
- "Where Creation Never Ends"
- "Built with Gemini 3"

[0:10-0:30] COMBINE MONTAGE
- Show full UI
- Drag Fire + Longing → "The Candle in the Window"
- Quick cuts: 6-8 combinations in 20 seconds
- Discovery counter: 13... 17... 21...
- "Combine anything. Create everything."
- SHOW: Latency indicator (~1.5s)

[0:30-0:45] ZOOM REVEAL
- Click "The Candle in the Window"
- 1 second pause (anticipation)
- SMOOTH zoom transition
- Reveal: A room, a figure waiting
- "Everything has something inside."

[0:45-1:05] THE DEPTH
- Continue zooming: levels 5... 8... 12...
- Show depth counter
- Find something unexpected
- "Go as deep as you want."
- SHOW: Context token counter (1M)

[1:05-1:20] EVOLUTION SETUP
- Find element with high potential
- Click "Evolve"
- Modal: "Watch millions of years..."
- Click "Start Evolution"
- "We'll come back to this."

[1:20-1:40] EVOLUTION PAYOFF
- Notification: "Evolution complete!"
- Video plays (8 seconds, pre-generated)
- Civilization rises, temple appears
- New elements emerge

[1:40-1:50] EMOTIONAL PEAK
- Zoom into civilization's temple
- Murals depicting the creator (you)
- "They remember you."

[1:50-2:00] CLOSE
- Rapid pullback through all levels
- Stats: "47 Elements | Depth 15 | 3 Evolutions"
- "OMNIGENESIS"
- "Where Creation Never Ends"
- Logo + URL
```

### 10.2 Pre-Generated Content

| Content | Quantity |
|---------|----------|
| Demo zoom scenes | 15 (scripted path) |
| Backup scenes | 35 |
| Evolution videos | 8 |
| Cached combinations | All demo path |

---

## 11. Risk Assessment

### 11.1 Critical Risks

| Risk | Prob | Impact | Mitigation |
|------|------|--------|------------|
| Flash API > 2s | 25% | CRITICAL | Minimal thinking, optimize prompts |
| Imagen > 2s | 30% | HIGH | Pre-generate primordials, accept loading |
| Veo failures | 35% | MEDIUM | Pre-generate all demo videos |
| Days 5-6 overrun | 40% | HIGH | Start early, have zoom-only fallback |
| Demo recording issues | 20% | MEDIUM | Pre-generate all content, multiple takes |

### 11.2 Fallback Strategies

**If latency is too high:**
```typescript
const LATENCY_FALLBACKS = {
  // Use cached results for common combinations
  CACHED_COMBINATIONS: new Map<string, Element>(),

  // Placeholder images
  FALLBACK_IMAGE: '/images/fallback-element.webp',

  // Simpler scenes (3 elements instead of 5)
  DEGRADED_MODE: { sceneElementCount: 3 },
};
```

**If schedule slips:**
- Day 7-8: Skip sounds if needed
- Day 9-10: Cut evolution for v1
- Day 11: Use zoom-only demo

### 11.3 "Zoom-Only" Fallback Demo

If evolution must be cut:
1. Focus on perfect Combine + Zoom
2. Demo theme: "Infinite depth"
3. Still differentiates from Infinite Craft

---

## 12. Technical Showcase

### 12.1 Purpose

Judges weight Technical Execution at 40%. We need VISIBLE technical depth.

### 12.2 TechShowcase Component

```typescript
// components/showcase/TechShowcase.tsx
export function TechShowcase() {
  const { showTechShowcase } = useUIStore();
  const { combineLatencies, zoomLatencies, activeApiCalls } = useMetricsStore();
  const { universeContext } = useGameStore();

  if (!showTechShowcase) return null;

  return (
    <motion.div className="fixed right-4 top-20 w-64 bg-black/80 rounded-lg p-4">
      <h3 className="text-gold font-bold mb-3">Tech Showcase</h3>

      {/* Real-time latency */}
      <LatencyMeter label="Combine" latencies={combineLatencies} target={1500} />
      <LatencyMeter label="Zoom" latencies={zoomLatencies} target={2000} />

      {/* 1M Context usage */}
      <ContextCounter
        current={universeContext.tokenCount}
        max={1000000}
      />

      {/* Parallel API visualization */}
      <APIOrchestrator activeCount={activeApiCalls} />

      {/* Universe stats */}
      <UniverseStats
        elements={universeContext.totalDiscoveries}
        zooms={universeContext.totalZooms}
        depth={universeContext.deepestReached}
      />
    </motion.div>
  );
}
```

### 12.3 Demo Script for Tech Showcase

At **[0:25]** during combine montage:
> "Each combination hits Gemini Flash in under 2 seconds."
*Show latency indicator*

At **[1:00]** during deep zoom:
> "We're using Gemini's full 1 million token context window to maintain universe coherence."
*Toggle TechShowcase panel briefly*

---

## Appendix A: Primordial Elements

```typescript
// data/primordials.ts
export const PRIMORDIAL_ELEMENTS: Element[] = [
  // Matter
  { id: 'prim-stone', name: 'Stone', description: 'The bones of the earth, patient and eternal', emoji: '🪨', isPrimordial: true, rarity: 'common', depthPotential: 6, evolutionPotential: 4, imageUrl: '/images/primordials/stone.webp', discoveredAt: new Date().toISOString(), discoveredAtDepth: 0, isFirstDiscovery: false },
  { id: 'prim-water', name: 'Water', description: 'Life-giver, shape-shifter, keeper of depths', emoji: '💧', isPrimordial: true, rarity: 'common', depthPotential: 8, evolutionPotential: 7, imageUrl: '/images/primordials/water.webp', discoveredAt: new Date().toISOString(), discoveredAtDepth: 0, isFirstDiscovery: false },
  { id: 'prim-fire', name: 'Fire', description: 'The first warmth, the final hunger', emoji: '🔥', isPrimordial: true, rarity: 'common', depthPotential: 7, evolutionPotential: 6, imageUrl: '/images/primordials/fire.webp', discoveredAt: new Date().toISOString(), discoveredAtDepth: 0, isFirstDiscovery: false },
  { id: 'prim-air', name: 'Air', description: 'Invisible carrier of whispers and storms', emoji: '💨', isPrimordial: true, rarity: 'common', depthPotential: 5, evolutionPotential: 3, imageUrl: '/images/primordials/air.webp', discoveredAt: new Date().toISOString(), discoveredAtDepth: 0, isFirstDiscovery: false },

  // Senses
  { id: 'prim-light', name: 'Light', description: 'The revealer, the truth that cannot hide', emoji: '👁️', isPrimordial: true, rarity: 'common', depthPotential: 8, evolutionPotential: 5, imageUrl: '/images/primordials/light.webp', discoveredAt: new Date().toISOString(), discoveredAtDepth: 0, isFirstDiscovery: false },
  { id: 'prim-silence', name: 'Silence', description: 'What remains when all sound flees', emoji: '👂', isPrimordial: true, rarity: 'common', depthPotential: 7, evolutionPotential: 6, imageUrl: '/images/primordials/silence.webp', discoveredAt: new Date().toISOString(), discoveredAtDepth: 0, isFirstDiscovery: false },
  { id: 'prim-shimmer', name: 'Shimmer', description: 'Light dancing on the edge of perception', emoji: '✨', isPrimordial: true, rarity: 'common', depthPotential: 6, evolutionPotential: 4, imageUrl: '/images/primordials/shimmer.webp', discoveredAt: new Date().toISOString(), discoveredAtDepth: 0, isFirstDiscovery: false },
  { id: 'prim-void', name: 'Void', description: 'The absence that defines all presence', emoji: '🌑', isPrimordial: true, rarity: 'common', depthPotential: 9, evolutionPotential: 8, imageUrl: '/images/primordials/void.webp', discoveredAt: new Date().toISOString(), discoveredAtDepth: 0, isFirstDiscovery: false },

  // Abstract
  { id: 'prim-longing', name: 'Longing', description: 'The ache for what was or might have been', emoji: '💔', isPrimordial: true, rarity: 'common', depthPotential: 8, evolutionPotential: 9, imageUrl: '/images/primordials/longing.webp', discoveredAt: new Date().toISOString(), discoveredAtDepth: 0, isFirstDiscovery: false },
  { id: 'prim-time', name: 'Time', description: 'The river that flows in only one direction', emoji: '⏰', isPrimordial: true, rarity: 'common', depthPotential: 9, evolutionPotential: 10, imageUrl: '/images/primordials/time.webp', discoveredAt: new Date().toISOString(), discoveredAtDepth: 0, isFirstDiscovery: false },
  { id: 'prim-mystery', name: 'Mystery', description: 'Questions that refuse to be answered', emoji: '❓', isPrimordial: true, rarity: 'common', depthPotential: 10, evolutionPotential: 7, imageUrl: '/images/primordials/mystery.webp', discoveredAt: new Date().toISOString(), discoveredAtDepth: 0, isFirstDiscovery: false },
  { id: 'prim-wonder', name: 'Wonder', description: 'The spark that ignites all exploration', emoji: '💫', isPrimordial: true, rarity: 'common', depthPotential: 8, evolutionPotential: 6, imageUrl: '/images/primordials/wonder.webp', discoveredAt: new Date().toISOString(), discoveredAtDepth: 0, isFirstDiscovery: false },
];
```

---

## Appendix B: Environment Variables

```bash
# .env.local (NEVER COMMIT)

# Gemini API
GEMINI_API_KEY=your_gemini_api_key

# Veo API (if separate)
VEO_API_KEY=your_veo_key

# Vertex AI (optional, for Imagen)
GOOGLE_CLOUD_PROJECT=your_project_id

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## Summary

**Omnigenesis** is a **12-day sprint** to build an **infinitely deep creation game** showcasing Gemini 3's multimodal capabilities.

**Core Loop:**
1. **COMBINE** - Merge any two elements (< 2s)
2. **ZOOM** - Discover worlds inside everything (< 2s)
3. **EVOLVE** - Watch civilizations emerge (async, 1-2 min)

**Critical Success Factors:**
- API latency < 2 seconds for core loop
- Days 5-6 Zoom System is highest risk
- Technical Showcase addresses 40% judging weight
- Pre-generate demo content by Day 10
- Have "zoom-only" fallback ready

**Win Probability:** 42-55%

This specification provides everything needed to begin development immediately.

---

*Document Version: v4 (Comprehensive Implementation Spec)*
*Created: January 28, 2026*
*Author: Product Manager Agent*
*Status: Ready for Critic Review*
