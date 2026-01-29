# Omnigenesis - Product Specification v5 (DELTA)

> **"Where Creation Never Ends"**

**Document Version:** v5 (AI-Assisted Development Reality Check)
**Created:** January 28, 2026
**Author:** Product Manager Agent
**Status:** Ready for Build
**Win Probability:** 50-55% (up from 35% with fixes)
**Timeline:** 12 days (Jan 28 - Feb 9, 2026)

---

## Document Structure

**This is a DELTA document.** For unchanged sections, see v4:
- Product Definition (Section 1) - **UNCHANGED** - see v4
- Technical Architecture (Section 2) - **UNCHANGED** - see v4
- Gemini API Integration (Section 3) - **MINOR UPDATES** - see Section 3 below
- Feature Specifications (Section 4) - **PRIORITY CHANGES** - see Section 4 below
- Data Models (Section 5) - **UNCHANGED** - see v4
- Folder Structure (Section 6) - **UNCHANGED** - see v4
- State Management (Section 7) - **UNCHANGED** - see v4
- Component Hierarchy (Section 8) - **UNCHANGED** - see v4
- Development Phases (Section 9) - **MAJOR REWRITE** - see Section 9 below
- Demo Script (Section 10) - **MAJOR UPDATES** - see Section 10 below
- Risk Assessment (Section 11) - **MAJOR UPDATES** - see Section 11 below
- Technical Showcase (Section 12) - **PRIORITY ELEVATED** - see Section 12 below

---

## Critical Changes Summary

| Change | From | To | Rationale |
|--------|------|-----|-----------|
| Evolution Priority | P1 | P2 | Veo reliability uncertain; cut unless ahead of schedule |
| Technical Showcase Priority | P1 | P0 | 40% judging weight; must be visible |
| Days 5-6 Zoom Estimate | 16h | 24-32h | Critic correctly identified underestimate |
| Days 9-10 | Evolution | Buffer | Schedule slack needed |
| Demo Strategy | Live API calls | Pre-computed path | Eliminate demo risk |
| Time Estimates | Code-only | Code + Debug | AI-assisted reality |

---

## NEW: AI-Assisted Development Reality

### What Claude Code Does Well (FAST)

| Task | Traditional Time | With Claude Code | Notes |
|------|-----------------|------------------|-------|
| TypeScript interfaces | 30 min | 5 min | Instant generation |
| React component scaffold | 1 hour | 10 min | Boilerplate is instant |
| Zustand store setup | 1 hour | 15 min | Pattern-based |
| API route creation | 45 min | 10 min | Boilerplate-heavy |
| Tailwind styling | 45 min | 15 min | Fast iteration |
| Basic unit tests | 1 hour | 20 min | Predictable patterns |

### What Claude Code Does Poorly (SLOW)

| Task | Expected | Reality | Why It's Slow |
|------|----------|---------|---------------|
| Complex state bugs | 30 min fix | 2+ hours | AI doesn't see cross-component effects |
| API integration quirks | 1 hour | 3+ hours | AI assumes happy path |
| Animation timing | 30 min | 2+ hours | Requires visual iteration |
| Edge case handling | 30 min | 1.5+ hours | AI misses corner cases |
| Debugging AI code | N/A | 50% of time | AI makes subtle mistakes |

### Realistic Time Distribution Per Feature

```
Traditional estimate: 4 hours for feature X

With Claude Code reality:
- Code generation: 1.2 hours (30% - this is FAST)
- Debugging AI mistakes: 2 hours (50% - this is SLOW)
- Testing & iteration: 0.8 hours (20%)
- Total: 4 hours (same, but time spent differently)

KEY INSIGHT: AI doesn't save time on complex features.
AI saves time on boilerplate. Debug time eats the savings.
```

### Estimation Multipliers

| Task Type | Multiplier | Example |
|-----------|------------|---------|
| Pure boilerplate | 0.3x | Setup, scaffolding |
| UI components | 0.7x | Static layouts |
| State management | 1.0x | No savings - debugging |
| API integration | 1.2x | MORE time - API quirks |
| Complex animations | 1.3x | MORE time - iteration |
| Cross-component flows | 1.5x | MORE time - hidden bugs |

---

## Section 3: Gemini API Integration (UPDATES)

### 3.4 NEW: Error States (Critic Gap Fix)

```typescript
// lib/api/error-handling.ts

export type APIErrorType =
  | 'timeout'      // > 5 seconds
  | 'rate_limit'   // 429 response
  | 'safety_block' // Content filtered
  | 'quota'        // Daily limit reached
  | 'network'      // Offline/unreachable
  | 'unknown';

export interface APIError {
  type: APIErrorType;
  message: string;
  retryable: boolean;
  retryAfterMs?: number;
}

export const ERROR_MESSAGES: Record<APIErrorType, string> = {
  timeout: "The cosmos is pondering... This is taking longer than expected.",
  rate_limit: "Cosmic energies recharging. Try again in a moment.",
  safety_block: "That combination exists beyond our realm. Try something else.",
  quota: "The universe needs rest. Check back tomorrow.",
  network: "Connection to the cosmos lost. Using cached creations.",
  unknown: "Something unexpected happened. Let's try again.",
};

export function handleAPIError(error: unknown): APIError {
  if (error instanceof Response) {
    if (error.status === 429) {
      const retryAfter = error.headers.get('retry-after');
      return {
        type: 'rate_limit',
        message: ERROR_MESSAGES.rate_limit,
        retryable: true,
        retryAfterMs: retryAfter ? parseInt(retryAfter) * 1000 : 5000,
      };
    }
    // ... handle other status codes
  }
  // ... handle other error types
}
```

### 3.5 NEW: Rate Limiting Strategy (Critic Gap Fix)

```typescript
// lib/api/rate-limiter.ts

interface QueuedRequest {
  id: string;
  execute: () => Promise<unknown>;
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
  priority: 'high' | 'normal';
}

class APIRateLimiter {
  private queue: QueuedRequest[] = [];
  private activeCount = 0;
  private readonly maxConcurrent = 3;
  private readonly minIntervalMs = 100; // ~10 requests/second max
  private lastRequestTime = 0;

  async enqueue<T>(
    execute: () => Promise<T>,
    priority: 'high' | 'normal' = 'normal'
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const request: QueuedRequest = {
        id: crypto.randomUUID(),
        execute,
        resolve: resolve as (value: unknown) => void,
        reject,
        priority,
      };

      if (priority === 'high') {
        this.queue.unshift(request);
      } else {
        this.queue.push(request);
      }

      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.activeCount >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    const timeSinceLastRequest = Date.now() - this.lastRequestTime;
    if (timeSinceLastRequest < this.minIntervalMs) {
      setTimeout(() => this.processQueue(), this.minIntervalMs - timeSinceLastRequest);
      return;
    }

    const request = this.queue.shift()!;
    this.activeCount++;
    this.lastRequestTime = Date.now();

    try {
      const result = await request.execute();
      request.resolve(result);
    } catch (error) {
      request.reject(error);
    } finally {
      this.activeCount--;
      this.processQueue();
    }
  }

  getQueueStatus() {
    return {
      queued: this.queue.length,
      active: this.activeCount,
      total: this.queue.length + this.activeCount,
    };
  }
}

export const apiRateLimiter = new APIRateLimiter();
```

### 3.6 NEW: Image Caching Strategy (Critic Gap Fix)

```typescript
// lib/cache/image-cache.ts

const DB_NAME = 'omnigenesis-images';
const STORE_NAME = 'images';
const MAX_SIZE_MB = 100;

interface CachedImage {
  id: string;           // Element ID or scene ID
  imageBase64: string;
  sizeBytes: number;
  accessedAt: number;
  createdAt: number;
}

class ImageCache {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('accessedAt', 'accessedAt');
      };
    });
  }

  async get(id: string): Promise<string | null> {
    if (!this.db) await this.init();

    return new Promise((resolve) => {
      const tx = this.db!.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        const cached = request.result as CachedImage | undefined;
        if (cached) {
          // Update access time for LRU
          cached.accessedAt = Date.now();
          store.put(cached);
          resolve(cached.imageBase64);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => resolve(null);
    });
  }

  async set(id: string, imageBase64: string): Promise<void> {
    if (!this.db) await this.init();

    const sizeBytes = imageBase64.length * 0.75; // Base64 to bytes estimate

    // Check if we need to evict
    await this.evictIfNeeded(sizeBytes);

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      const cached: CachedImage = {
        id,
        imageBase64,
        sizeBytes,
        accessedAt: Date.now(),
        createdAt: Date.now(),
      };

      const request = store.put(cached);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async evictIfNeeded(neededBytes: number): Promise<void> {
    const currentSize = await this.getTotalSize();
    const maxBytes = MAX_SIZE_MB * 1024 * 1024;

    if (currentSize + neededBytes <= maxBytes) return;

    // LRU eviction
    const tx = this.db!.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('accessedAt');
    const cursor = index.openCursor();

    let freedBytes = 0;
    const targetFree = (currentSize + neededBytes) - (maxBytes * 0.8);

    cursor.onsuccess = () => {
      const result = cursor.result;
      if (result && freedBytes < targetFree) {
        freedBytes += result.value.sizeBytes;
        store.delete(result.primaryKey);
        result.continue();
      }
    };
  }

  private async getTotalSize(): Promise<number> {
    return new Promise((resolve) => {
      const tx = this.db!.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const total = request.result.reduce((sum, item) => sum + item.sizeBytes, 0);
        resolve(total);
      };

      request.onerror = () => resolve(0);
    });
  }
}

export const imageCache = new ImageCache();
```

---

## Section 4: Feature Specifications (PRIORITY CHANGES)

### Priority Matrix (REVISED)

| Feature | v4 Priority | v5 Priority | Change Reason |
|---------|-------------|-------------|---------------|
| Element Palette | P0 | P0 | No change |
| Combine Zone | P0 | P0 | No change |
| Zoom Viewport | P0 | P0 | No change |
| Breadcrumb Navigation | P0 | P0 | No change |
| Discovery Counter | P0 | P0 | No change |
| **Technical Showcase** | P1 | **P0** | 40% judging weight |
| Evolution System | P1 | **P2** | Veo unreliable, schedule risk |
| Sound Effects | P1 | P1 | No change |
| Visual Polish | P1 | P1 | No change |
| Constellation Map | P2 | **CUT** | Never in demo script |
| Depth Potential Stars | P2 | **CUT** | Too subtle |
| Combination Hints | P2 | **CUT** | Reduces discovery magic |

### P0 Features (MUST HAVE)

1. Element Palette - 4h (unchanged)
2. Combine Zone - 6h (unchanged)
3. Zoom Viewport - 8h (unchanged)
4. Breadcrumb Navigation - 3h (unchanged)
5. Discovery Counter - 2h (unchanged)
6. **Technical Showcase Panel - 4h (PROMOTED)**

### P1 Features (SHOULD HAVE)

1. Sound Effects - 3h (unchanged)
2. Visual Polish (Animations) - 4h (unchanged)
3. Error State UI - 3h (NEW)
4. Loading Skeletons - 2h (NEW)
5. Demo Mode Toggle - 2h (NEW)

### P2 Features (IF TIME PERMITS)

1. **Evolution System - 16h (DEMOTED)**
2. Screenshot/Share - 2h (unchanged)

### NEW: P0-6 Technical Showcase Panel (PROMOTED)

**User Story:** As a hackathon judge, I want to see the technical sophistication so I can properly evaluate the 40% Technical Execution weight.

**Acceptance Criteria:**
- [ ] Toggle with T key
- [ ] Real-time latency meter (avg, p95)
- [ ] Context token counter (X / 1,000,000)
- [ ] Active API calls visualization
- [ ] Queue status indicator
- [ ] Universe stats (elements, depth, zooms)
- [ ] Visible during demo without distracting

**Effort (AI-Assisted):**
- Code generation: 1h
- Debug & polish: 2h
- Integration testing: 1h
- **Total: 4h**

---

## Section 9: Development Phases (MAJOR REWRITE)

### AI-Assisted Development Timeline

**Key Changes from v4:**
1. Each task now has: Code Time + Debug Time
2. Days 5-6 expanded to 24-32 hours (from 16)
3. Days 9-10 are BUFFER, not Evolution
4. Technical Showcase moved to Day 7
5. Evolution only attempted if ahead by Day 8

---

### Phase 0: API Validation (Day 0 - BEFORE Development)

**CRITICAL: Complete Day 0 BEFORE touching any game code.**

| Task | Time | Acceptance |
|------|------|------------|
| Validate Gemini Flash | 2h | 50 calls < 1.2s p95 |
| Validate Imagen 3 | 2h | 30 images < 2s p95 |
| Check Veo 3.1 access | 1h | Access confirmed OR Evolution cut |
| Pre-generate 12 primordial images | 2h | All saved to `/public/images/primordials/` |
| Document actual latencies | 0.5h | Spreadsheet ready |
| GO/NO-GO decision | 0.5h | Team aligned |

**Day 0 Deliverable:** All APIs validated, primordials generated, decision made.

**GO/NO-GO Matrix:**

| Condition | Decision |
|-----------|----------|
| Flash p95 < 1.5s, Imagen < 2s | GO |
| Flash p95 1.5-2s, Imagen < 2.5s | GO with degraded expectations |
| Flash p95 > 2s OR Imagen > 2.5s | PIVOT to different project |
| Veo accessible | Evolution stays P2 |
| Veo NOT accessible | Evolution CUT permanently |

---

### Phase 1: Foundation (Days 1-2)

#### Day 1: Project Setup + Combine API

| Task | Code Time | Debug Time | Total | Notes |
|------|-----------|------------|-------|-------|
| Create Next.js 14 project | 0.5h | 0h | 0.5h | Boilerplate |
| Configure Tailwind theme | 0.5h | 0.5h | 1h | Minor tweaks |
| Setup Zustand stores (3) | 0.5h | 1h | 1.5h | State complexity |
| Define TypeScript types | 0.5h | 0h | 0.5h | AI excels here |
| Create primordials data | 0.5h | 0h | 0.5h | Static data |
| Build `/api/combine` route | 0.5h | 1.5h | 2h | API quirks |
| Test combine endpoint | 0.5h | 1h | 1.5h | Edge cases |

**Day 1 Total: 7.5h**
**Day 1 Deliverable:** Can call combine API and get valid response

#### Day 2: Combine UI Complete

| Task | Code Time | Debug Time | Total | Notes |
|------|-----------|------------|-------|-------|
| Build ElementPalette component | 1h | 1h | 2h | Grid layout |
| Setup dnd-kit | 0.5h | 1h | 1.5h | Integration tricky |
| Build CombineZone component | 1h | 1.5h | 2.5h | Drop handling |
| Add combine animations | 0.5h | 1h | 1.5h | Framer timing |
| Wire up to Imagen | 0.5h | 1h | 1.5h | Image generation |

**Day 2 Total: 9h**
**Day 2 Deliverable:** Can combine elements, see results with images. CORE LOOP WORKS.

---

### Phase 2: Zoom System (Days 3-5) - EXPANDED

**CRITICAL: This is the highest-risk phase. Allocated 3 days, not 2.**

#### Day 3: Zoom API + Basic Viewport

| Task | Code Time | Debug Time | Total | Notes |
|------|-----------|------------|-------|-------|
| Build `/api/zoom` route | 1h | 2h | 3h | Parallel orchestration |
| Scene generation logic | 0.5h | 1.5h | 2h | Context management |
| ZoomViewport shell | 1h | 0.5h | 1.5h | Layout only |
| Scene background display | 0.5h | 1h | 1.5h | Image loading |

**Day 3 Total: 8h**
**Day 3 Deliverable:** Can call zoom API, display scene background

#### Day 4: Zoom Interaction + Elements

| Task | Code Time | Debug Time | Total | Notes |
|------|-----------|------------|-------|-------|
| SceneElement component | 1h | 1h | 2h | Positioned elements |
| Click-to-zoom handler | 0.5h | 1.5h | 2h | State transitions |
| Element collection logic | 0.5h | 1h | 1.5h | Add to palette |
| Zoom transition animation | 0.5h | 2h | 2.5h | Framer complexity |

**Day 4 Total: 8h**
**Day 4 Deliverable:** Can click elements, see zoom transition, collect elements

#### Day 5: Zoom Polish + Navigation

| Task | Code Time | Debug Time | Total | Notes |
|------|-----------|------------|-------|-------|
| Breadcrumb navigation | 1h | 1h | 2h | Stack management |
| Zoom out (pop) logic | 0.5h | 1.5h | 2h | Scene restoration |
| Context accumulation | 0.5h | 1.5h | 2h | Token tracking |
| Loading states | 0.5h | 1h | 1.5h | Skeleton/spinners |
| Edge case handling | 0.5h | 1.5h | 2h | Error states |

**Day 5 Total: 9.5h**
**Day 5 Deliverable:** Zoom system complete. Can zoom infinitely, navigate back.

---

### Phase 3: Technical Showcase + Polish (Days 6-7)

#### Day 6: Technical Showcase (P0)

| Task | Code Time | Debug Time | Total | Notes |
|------|-----------|------------|-------|-------|
| TechShowcase component | 1h | 1h | 2h | Layout + toggle |
| LatencyMeter component | 0.5h | 0.5h | 1h | Chart/visual |
| ContextCounter component | 0.5h | 0.5h | 1h | Progress bar |
| APIOrchestrator visual | 0.5h | 0.5h | 1h | Active calls |
| UniverseStats component | 0.5h | 0.5h | 1h | Numbers |
| Keyboard shortcut (T) | 0.25h | 0.25h | 0.5h | Simple |

**Day 6 Total: 6.5h**
**Day 6 Deliverable:** Technical Showcase complete, toggleable with T key

#### Day 7: Visual Polish

| Task | Code Time | Debug Time | Total | Notes |
|------|-----------|------------|-------|-------|
| Element spring animations | 0.25h | 0.5h | 0.75h | Simple |
| Combine flash effect | 0.25h | 0.5h | 0.75h | CSS + Framer |
| Discovery confetti | 0.5h | 1h | 1.5h | Library integration |
| Rare element glow | 0.25h | 0.25h | 0.5h | CSS only |
| Hover effects | 0.25h | 0.25h | 0.5h | CSS only |
| Loading skeletons | 0.5h | 0.5h | 1h | Replace spinners |
| Error state UI | 0.5h | 1h | 1.5h | Toast/modal |

**Day 7 Total: 6.5h**
**Day 7 Deliverable:** Game feels polished. All P1 visual polish done.

---

### Phase 4: Sound + Demo Mode (Day 8)

| Task | Code Time | Debug Time | Total | Notes |
|------|-----------|------------|-------|-------|
| Add sound effects | 0.5h | 1h | 1.5h | use-sound library |
| Mute toggle | 0.25h | 0.25h | 0.5h | Simple state |
| Demo mode implementation | 1h | 1.5h | 2.5h | Cache-only mode |
| Demo reset button | 0.25h | 0.5h | 0.75h | Clear state |
| Keyboard shortcuts (R, D) | 0.25h | 0.25h | 0.5h | Simple |
| Bug fixes from testing | 0h | 2h | 2h | Expected |

**Day 8 Total: 7.75h**
**Day 8 Deliverable:** Game is COMPLETE for Combine + Zoom. Demo-ready.

---

### Phase 5: BUFFER (Days 9-10)

**These are NOT Evolution days. These are buffer days.**

#### If ON SCHEDULE (Day 8 complete):

**Option A: Add Evolution (High Risk)**
- Day 9: Evolution backend (8h)
- Day 10: Evolution UI + pre-generate videos (8h)
- Risk: If issues, lose buffer

**Option B: Perfect the Demo (Low Risk)**
- Day 9: Pre-generate all demo content
- Day 10: Practice runs, fix edge cases
- Risk: None

**Recommended: Option B** unless everything is perfect by Day 8 end.

#### If BEHIND SCHEDULE:

Use Days 9-10 to catch up. Do NOT add Evolution.

#### Buffer Day Activities (if used as buffer)

| Task | Time |
|------|------|
| Pre-generate 50 demo zoom scenes | 3h |
| Pre-generate all demo combinations | 2h |
| Script exact demo sequence | 1h |
| 5+ practice demo runs | 2h |
| Fix discovered bugs | 4h |
| Performance optimization | 2h |
| Add demo mode caching | 2h |

---

### Phase 6: Demo Production (Days 11-12)

#### Day 11: Content + Rehearsal

| Task | Time |
|------|------|
| Final demo path scripting | 1h |
| Pre-compute ALL demo API calls | 2h |
| Cache all demo responses | 1h |
| Recording setup (OBS, mic) | 1h |
| 10+ practice runs | 2h |
| Fix any remaining issues | 1h |

**Day 11 Deliverable:** Demo runs flawlessly on cached content

#### Day 12: Record and Submit

| Task | Time | Deadline |
|------|------|----------|
| Final practice run | 0.5h | 9:00 AM |
| Record 5+ takes | 2h | 11:00 AM |
| Select best take | 0.5h | 11:30 AM |
| Edit video (cuts, music, overlays) | 2h | 1:30 PM |
| Write Devpost submission | 1h | 2:30 PM |
| Final review | 0.5h | 3:00 PM |
| SUBMIT | 0.5h | 3:30 PM |
| Buffer before deadline | 1.5h | 5:00 PM |

**Day 12 Deliverable:** PROJECT SUBMITTED before 5:00 PM PT

---

## Section 10: Demo Script (MAJOR UPDATES)

### 10.1 Pre-Computed Demo Path

**CRITICAL: Every single API call in the demo must be pre-computed and cached.**

```typescript
// data/demo-path.ts

export interface DemoStep {
  id: string;
  type: 'combine' | 'zoom' | 'evolve';
  inputs: string[];       // Element IDs
  expectedOutput: string; // Element ID or Scene ID
  timestamp: string;      // Demo script timestamp
  narration: string;      // What to say
}

export const DEMO_PATH: DemoStep[] = [
  {
    id: 'demo-1',
    type: 'combine',
    inputs: ['prim-fire', 'prim-longing'],
    expectedOutput: 'the-candle-in-the-window',
    timestamp: '0:10',
    narration: 'Let me show you how creation works.',
  },
  {
    id: 'demo-2',
    type: 'zoom',
    inputs: ['the-candle-in-the-window'],
    expectedOutput: 'scene-candle-interior',
    timestamp: '0:30',
    narration: 'But here is where it gets interesting...',
  },
  // ... all 15-20 demo steps pre-defined
];

// Pre-generated responses
export const DEMO_CACHE: Record<string, any> = {
  'combine:prim-fire+prim-longing': {
    id: 'the-candle-in-the-window',
    name: 'The Candle in the Window',
    description: 'A flame that waits for someone who may never return',
    emoji: '🕯️🪟',
    rarity: 'uncommon',
    // ... full element data
    imageBase64: '...', // Pre-generated Imagen result
  },
  'zoom:the-candle-in-the-window': {
    id: 'scene-candle-interior',
    description: 'A cozy room where shadows dance...',
    backgroundImageUrl: '/demo-cache/candle-scene.webp',
    elements: [
      // ... pre-generated scene elements
    ],
  },
  // ... all demo path responses
};
```

### 10.2 Demo Mode Implementation

```typescript
// hooks/useDemoMode.ts

export function useDemoMode() {
  const [isDemoMode, setDemoMode] = useState(false);

  const toggleDemoMode = useCallback(() => {
    setDemoMode(prev => !prev);
    console.log(isDemoMode ? '[DEMO MODE: OFF]' : '[DEMO MODE: ON - Using cached responses]');
  }, [isDemoMode]);

  // Register keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'd' && e.ctrlKey) {
        e.preventDefault();
        toggleDemoMode();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleDemoMode]);

  return { isDemoMode, toggleDemoMode };
}

// In API hooks, check demo mode first
export function useCombine() {
  const { isDemoMode } = useDemoMode();

  const combine = async (a: Element, b: Element) => {
    const cacheKey = `combine:${a.id}+${b.id}`;

    if (isDemoMode && DEMO_CACHE[cacheKey]) {
      // Simulate realistic delay
      await sleep(Math.random() * 500 + 800);
      return DEMO_CACHE[cacheKey];
    }

    // Real API call
    return await realCombineAPI(a, b);
  };

  return { combine };
}
```

### 10.3 Revised Demo Script (2:00)

```
[0:00-0:05] HOOK
- Black screen, "OMNIGENESIS" fades in
- Single element (Fire) appears, pulses
- "What if everything you created..."
- Zoom into Fire, reveal world inside
- "...had infinite worlds inside?"

[0:05-0:10] TITLE + SETUP
- Full UI visible
- Show palette with 12 primordials
- "Built with Gemini 3"
- SHOW: TechShowcase briefly (T toggle)

[0:10-0:30] COMBINE SEQUENCE (PRE-COMPUTED)
- Narration: "Combine any two elements..."
- Drag Fire + Longing → The Candle in the Window
- Show latency indicator: "1.3 seconds"
- Quick cuts: 3 more combinations
- Discovery counter animating: 13... 14... 15...
- "Each combination powered by Gemini Flash"

[0:30-0:45] THE ZOOM REVEAL (PRE-COMPUTED)
- Click The Candle in the Window
- Smooth 1s zoom transition
- Scene: A room where shadows dance
- 4 collectible elements appear
- "Everything has something inside"
- Collect one element (add to palette)

[0:45-1:05] INFINITE DEPTH (PRE-COMPUTED)
- Continue zooming: Depth 2... 3... 4...
- Show depth counter increasing
- At depth 5, find something unexpected
- Toggle TechShowcase (T key)
- Show: Context tokens used
- "Gemini's 1 million token context maintains coherence"
- "No matter how deep you go"

[1:05-1:25] TECHNICAL SHOWCASE MOMENT
- Leave TechShowcase visible
- Do one more combine (show latency)
- Do one more zoom (show parallel calls)
- "Real-time orchestration of Flash and Imagen"
- API visualization shows parallel calls

[1:25-1:40] EXPLORATION MONTAGE
- Quick cuts: different zoom paths
- Show variety of generated scenes
- Show rare element discovery (glow effect)
- Discovery confetti on legendary

[1:40-1:50] STATS + CLOSE
- Zoom out rapidly through levels
- Stats display: "47 Elements | Depth 12 | 8 Zooms"
- "Every creation. Infinitely deep."

[1:50-2:00] BRANDING
- OMNIGENESIS logo
- "Where Creation Never Ends"
- "Powered by Gemini 3"
- URL + QR code
```

### 10.4 Backup Recovery Scripts

**If Zoom fails at [0:30]:**
```
"Interesting - let me try another element..."
[Click a different cached element]
[Continue demo normally]
```

**If any API hangs > 3s:**
```
[Toggle to demo mode with Ctrl+D]
"Let me show you what we created earlier..."
[Continue with cached content]
```

**If browser crashes:**
```
[Have second browser tab pre-loaded at same state]
[Switch tabs, continue demo]
```

---

## Section 11: Risk Assessment (MAJOR UPDATES)

### 11.1 Risk Matrix (REVISED)

| Risk | Probability | Impact | Mitigation | Owner |
|------|-------------|--------|------------|-------|
| Flash API > 2s | 20% | CRITICAL | Day 0 validation, abort if fails | Dev |
| Imagen > 2s | 35% | HIGH | Pre-gen primordials, accept loading | Dev |
| Veo inaccessible | 50% | MEDIUM | Cut Evolution, it's P2 anyway | PM |
| Days 3-5 overrun | 40% | HIGH | 2 buffer days allocated | PM |
| Rate limit hit | 60% | MEDIUM | Rate limiter implemented | Dev |
| Safety filter blocks | 40% | LOW | Pre-test demo path | Dev |
| Demo recording fails | 15% | HIGH | Pre-computed path, multiple takes | Dev |
| Browser memory leak | 30% | MEDIUM | Image cache with LRU | Dev |

### 11.2 New Mitigations (Critic Fixes)

**1. Rate Limiting (NEW)**
- APIRateLimiter class (Section 3.5)
- Max 3 concurrent calls
- Exponential backoff on 429
- Queue status in TechShowcase

**2. Safety Filter Handling (NEW)**
```typescript
async function combineWithRetry(a: Element, b: Element, retries = 2): Promise<Element> {
  try {
    return await combine(a, b);
  } catch (error) {
    if (isSafetyBlock(error) && retries > 0) {
      // Try with rephrased prompt
      const altPrompt = rephraseCombinePrompt(a, b);
      return await combineWithAltPrompt(a, b, altPrompt, retries - 1);
    }
    throw error;
  }
}
```

**3. Quota Monitoring (NEW)**
- Track daily API calls in localStorage
- Warning at 80% of estimated quota
- Hard stop at 95% to preserve demo capacity

**4. Image Caching (NEW)**
- IndexedDB storage (Section 3.6)
- 100MB LRU cache
- Persists across refreshes
- Falls back gracefully

### 11.3 Schedule Risk Mitigation

**The Schedule Now Has Slack:**

| Scenario | Buffer Available | Action |
|----------|-----------------|--------|
| On schedule Day 5 | 2 days (Days 9-10) | Consider Evolution |
| 1 day behind Day 5 | 1 day | Skip Evolution, use for catch-up |
| 2 days behind Day 5 | 0 days | Cut Visual Polish to bare minimum |
| 3+ days behind Day 5 | CRISIS | Ship Combine only, zoom in v2 |

**Fallback Hierarchy:**
1. **Full Experience:** Combine + Zoom + Evolution + Polish
2. **Demo Ready:** Combine + Zoom + Polish (skip Evolution)
3. **Minimum Viable:** Combine + Zoom (minimal polish)
4. **Emergency:** Combine only (single feature demo)

---

## Section 12: Technical Showcase (PRIORITY ELEVATED TO P0)

### 12.1 Purpose (CRITICAL for 40% Judging Weight)

The TechShowcase component is not optional polish - it's a core P0 feature. Without visible technical metrics, judges assume this is "just another prompt wrapper."

### 12.2 Required Components

```typescript
// components/showcase/TechShowcase.tsx

export function TechShowcase() {
  const { showTechShowcase, toggleTechShowcase } = useUIStore();
  const metrics = useMetricsStore();
  const { universeContext } = useGameStore();
  const { getQueueStatus } = apiRateLimiter;

  // Register T key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 't' || e.key === 'T') {
        toggleTechShowcase();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleTechShowcase]);

  if (!showTechShowcase) return null;

  return (
    <motion.aside
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="fixed right-4 top-20 w-72 bg-black/90 border border-gold/30 rounded-lg p-4 z-50"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gold font-bold text-sm">Technical Showcase</h3>
        <span className="text-xs text-gray-500">Press T to hide</span>
      </div>

      {/* Latency Meters */}
      <LatencyMeter
        label="Combine"
        latencies={metrics.combineLatencies}
        target={1500}
        critical={2500}
      />
      <LatencyMeter
        label="Zoom"
        latencies={metrics.zoomLatencies}
        target={2000}
        critical={3000}
      />

      {/* Context Window */}
      <ContextCounter
        current={universeContext.tokenCount}
        max={1000000}
        label="Context Window"
      />

      {/* API Orchestration */}
      <div className="mt-4 pt-4 border-t border-gray-800">
        <h4 className="text-xs text-gray-500 mb-2">API Orchestration</h4>
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-8 h-8 rounded flex items-center justify-center text-xs",
                i < getQueueStatus().active
                  ? "bg-gold/50 text-black animate-pulse"
                  : "bg-gray-800 text-gray-600"
              )}
            >
              {i < getQueueStatus().active ? '...' : '-'}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-1">
          {getQueueStatus().queued > 0 && `${getQueueStatus().queued} queued`}
        </p>
      </div>

      {/* Universe Stats */}
      <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-3 gap-2">
        <Stat label="Elements" value={universeContext.totalDiscoveries} />
        <Stat label="Zooms" value={universeContext.totalZooms} />
        <Stat label="Depth" value={universeContext.deepestReached} />
      </div>
    </motion.aside>
  );
}
```

### 12.3 Demo Script Integration (Required Moments)

| Timestamp | Action | What to Say |
|-----------|--------|-------------|
| [0:05-0:10] | Toggle TechShowcase | "Let me show you the engineering behind this" |
| [0:25] | Point at latency | "Each combination in under 2 seconds" |
| [1:05-1:15] | Show context counter | "Using Gemini's full 1 million token context" |
| [1:20] | Show parallel calls | "Real-time orchestration of multiple APIs" |

---

## Appendix A: Day 0 Pre-Build Checklist

**Complete ALL items before writing any game code:**

### API Validation
- [ ] Gemini Flash: 50 test calls, p95 < 1.5s
- [ ] Imagen 3: 30 test images, p95 < 2s
- [ ] Veo 3.1: Access confirmed (or Evolution CUT)
- [ ] Rate limits documented
- [ ] Daily quotas understood

### Asset Preparation
- [ ] 12 primordial images generated and saved
- [ ] Fallback element image created
- [ ] Sound effect files sourced (or marked for later)
- [ ] Font files acquired

### Timeline Confirmed
- [ ] Evolution is P2 (not P1)
- [ ] Technical Showcase is P0
- [ ] Days 9-10 are buffer
- [ ] Team aligned on baseline: Combine + Zoom

### Demo Path Planned
- [ ] All 15-20 demo steps scripted
- [ ] Input/output for each step defined
- [ ] Cache structure designed

---

## Appendix B: Debug Time Expectations

**When debugging AI-generated code, expect these common issues:**

### State Management
- Stale closure bugs (useCallback deps wrong)
- Race conditions in async state updates
- Zustand selector not re-rendering
- immer not handling nested updates

### API Integration
- Missing error handling
- Incorrect response parsing
- Timeout handling incomplete
- Retry logic infinite-looping

### Animations
- Framer Motion exit not triggering
- AnimatePresence key conflicts
- Layout shift during animation
- Performance issues with many elements

### TypeScript
- Type assertions hiding runtime errors
- Optional chaining masking undefined
- Incorrect generic inference

**Budget 50% of feature time for these issues.**

---

## Summary: v4 → v5 Changes

| Category | v4 | v5 |
|----------|----|----|
| Timeline reality | Optimistic | AI-debug-aware |
| Evolution | P1 | P2 |
| Technical Showcase | P1 | P0 |
| Days 5-6 | 16h | 24-32h |
| Days 9-10 | Evolution | Buffer |
| Demo strategy | Live API | Pre-computed |
| Error handling | Missing | Specified |
| Rate limiting | Missing | Implemented |
| Image caching | Missing | IndexedDB |
| Win probability | 35% | 50-55% |

---

**This spec is ready for BUILD.**

The core insight: AI-assisted development changes WHERE time is spent, not HOW MUCH. Claude Code makes boilerplate instant but debugging takes longer. The schedule now accounts for this reality.

The secondary insight: Demo reliability requires pre-computation. Live API calls during demo recording are unacceptable risk. Every demo step must have a cached fallback.

**BEGIN DAY 0 VALIDATION IMMEDIATELY.**

---

*Document Version: v5 (AI-Assisted Development Reality Check)*
*Created: January 28, 2026*
*Author: Product Manager Agent*
*Status: Ready for Build*
