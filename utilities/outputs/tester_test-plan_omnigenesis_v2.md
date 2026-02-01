# Omnigenesis Testing Plan v2

## Overview
Comprehensive testing plan for Omnigenesis - The Memory hackathon project.
**Focus: Demo-first testing for hackathon success.**

---

## TEST CATEGORIES

### 1. DEMO SCRIPT EXECUTION (CRITICAL - NEW)

The 2-minute demo IS the product. This section tests the exact scripted path.

| Test ID | Timestamp | Action | Expected Result | Priority |
|---------|-----------|--------|-----------------|----------|
| DEM-100 | 0:00-0:05 | App loads | Sidebar with 12 primordials, empty viewport, combine zone visible | Critical |
| DEM-101 | 0:05-0:15 | Click Fire element | Zoom into Fire scene, 4-5 elements appear with positions | Critical |
| DEM-102 | 0:15-0:25 | Explore Fire scene | Click sub-element, breadcrumb shows "Fire > Ember" | Critical |
| DEM-103 | 0:25-0:35 | Navigate breadcrumb back | Returns to Fire scene smoothly | Critical |
| DEM-104 | 0:35-0:45 | Drag Fire + Air to combine | Elements appear in slots, auto-combine triggers | Critical |
| DEM-105 | 0:45-0:55 | Energy (milestone) discovered | 9-second reveal animation starts | Critical |
| DEM-106 | 0:55-1:04 | Reveal completes | Energy added to sidebar, evolution starts generating | Critical |
| DEM-107 | 1:04-1:15 | Create intermediate element | Drag Stone + Mystery → Potential (shows "On path to LIFE") | Critical |
| DEM-108 | 1:15-1:25 | Trigger context callback | Zoom deep, see "This reminds you of..." with token count | Critical |
| DEM-109 | 1:25-1:35 | Evolution ready notification | Click badge, video modal opens | Critical |
| DEM-110 | 1:35-1:45 | Play evolution video | 8-second video with audio plays | Critical |
| DEM-111 | 1:45-2:00 | Final discovery (Life) | Another milestone reveal, wow moment | Critical |

**Demo Timing Tolerance:** Each action must complete within ±5 seconds of timestamp.

---

### 2. CORE GAME LOOP

#### 2.1 COMBINE Mechanic
| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|-----------------|----------|
| CMB-001 | Drag primordial to slot 1 | Element appears in slot with animation | Critical |
| CMB-002 | Drag primordial to slot 2 | Element appears in slot with animation | Critical |
| CMB-003 | Two elements trigger auto-combine | API called within 100ms, loading state shows | Critical |
| CMB-004 | Combine Stone + Water | Returns "Mud" or similar regular element | Critical |
| CMB-005 | Combine Fire + Air → Energy | Milestone detected, triggers 9-second reveal | Critical |
| CMB-006 | Combine Stone + Mystery → Potential | Intermediate detected, shows pathway indicator | Critical |
| CMB-007 | Combine response < 1.5s | Gemini Flash returns within spec latency | Critical |
| CMB-008 | Clear slots after combine | Slots reset to empty state | High |
| CMB-009 | Combine loading state | Shows spinner/animation during API call | High |
| CMB-010 | Combine error handling | Shows error message, doesn't crash | High |
| CMB-011 | Rapid combine attempts | Debounced, prevents duplicate requests | Medium |
| CMB-012 | Combine sound plays | Audio feedback on successful combine | Medium |

#### 2.2 ZOOM Mechanic
| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|-----------------|----------|
| ZOM-001 | Click primordial element | Zoom API called, scene renders | Critical |
| ZOM-002 | Scene elements at correct positions | Elements placed at x,y percentages | Critical |
| ZOM-003 | Click zoomable element (canZoomInto=true) | Zooms deeper, depth increments | Critical |
| ZOM-004 | Zoom transition animation | 1s CSS transform, smooth scale | Critical |
| ZOM-005 | Zoom response < 2s | Scene generates within spec latency | Critical |
| ZOM-006 | Breadcrumb navigation appears | Shows "Surface > Fire > Ember" format | High |
| ZOM-007 | Click breadcrumb navigates back | Returns to that specific scene | High |
| ZOM-008 | Ascend button visible when zoomed | Shows up arrow with hover glow | High |
| ZOM-009 | Ascend button works | Returns to previous level | High |
| ZOM-010 | Depth indicator shows correct tier | I, II, III, IV, V+ based on depth | High |
| ZOM-011 | Depth V+ shows infinity message | "∞" or "Infinite" indicator | Medium |
| ZOM-012 | Scene description types out | TypewriterText animation plays | Medium |
| ZOM-013 | Background gradient matches theme | CSS gradient from scene data | Medium |
| ZOM-014 | Zoom sound plays | Audio feedback on zoom | Medium |

#### 2.3 EVOLVE Mechanic
| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|-----------------|----------|
| EVO-001 | First milestone triggers evolution | /api/evolution called automatically | Critical |
| EVO-002 | Generating indicator appears | Corner notification, non-intrusive | High |
| EVO-003 | Evolution polls for completion | 5-second intervals, status updates | High |
| EVO-004 | Ready notification appears | Pulsing badge when video ready | High |
| EVO-005 | Click badge opens video modal | Modal with player controls | High |
| EVO-006 | Video duration 7-9 seconds | Within Veo spec | High |
| EVO-007 | Video has audio | Native audio track plays | High |
| EVO-008 | Video resolution ≥ 720p | Quality check | Medium |
| EVO-009 | Close modal hides it | Badge remains for replay | Medium |
| EVO-010 | Multiple evolutions queue | Second milestone queues behind first | Medium |

---

### 3. 9-SECOND REVEAL ANIMATION (DETAILED)

| Test ID | Phase | Time | Test Case | Expected Result | Priority |
|---------|-------|------|-----------|-----------------|----------|
| REV-001 | Recognition | 0-2s | Screen dims | Overlay opacity 0 → 0.6 | Critical |
| REV-002 | Recognition | 0-2s | Particles swirl | ParticleField intensifies toward center | High |
| REV-003 | Anticipation | 2-5s | Emoji appears blurred | Large emoji (120px), blur: 20px | Critical |
| REV-004 | Anticipation | 2-5s | Blur decreases | blur: 20px → 5px over 3 seconds | Critical |
| REV-005 | Anticipation | 2-5s | Lore begins typing | TypewriterText starts at 3s mark | High |
| REV-006 | Revelation | 5-9s | Image sharpens | blur: 5px → 0 over 4 seconds | Critical |
| REV-007 | Revelation | 5-9s | Full element visible | Name, emoji, lore all shown | Critical |
| REV-008 | Aftermath | 9-11s | Gold glow pulse starts | 2s infinite animation | High |
| REV-009 | Aftermath | 9-11s | "X remembered" text | Confirmation message appears | High |
| REV-010 | Aftermath | 9-11s | Element moves to collection | Added to sidebar "Remembered" section | High |
| REV-011 | Any | - | Click to skip | Immediately completes reveal | Medium |
| REV-012 | Any | - | Milestone sound plays | Audio at reveal start and crescendo | Medium |
| REV-013 | Complete | 11s | onComplete fires | Callback triggers evolution | Critical |

---

### 4. INTERMEDIATE ELEMENTS (NEW SECTION)

| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|-----------------|----------|
| INT-001 | Create Potential (Stone + Mystery) | Element created with intermediate category | Critical |
| INT-002 | Violet border styling | Border color matches palette (#7f5af0) | High |
| INT-003 | Pulsing gold glow effect | Animation cycles every 2.5s | High |
| INT-004 | Pathway text displays | "On the path to LIFE" visible | Critical |
| INT-005 | Pathway text gold color | text-gold/80 class applied | Medium |
| INT-006 | All 6 intermediates tested | Potential, Awareness, Foundation, Conflict, Reflection, Surrender | High |

---

### 5. CONTEXT SYSTEM (NEW SECTION)

| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|-----------------|----------|
| CTX-001 | Memory fragment displays | Gold box with lore text in scene | High |
| CTX-002 | Context callback appears | "This reminds you of X from Depth Y" | Critical |
| CTX-003 | Callback references real element | References something player discovered | Critical |
| CTX-004 | Token counter displays | "Memory: X tokens" in header | Medium |
| CTX-005 | Token counter updates | Increments with each discovery | Medium |
| CTX-006 | Deep zoom (depth 10+) has callback | More likely at deeper levels | Medium |

---

### 6. HINT SYSTEM (NEW SECTION)

| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|-----------------|----------|
| HNT-001 | Water + Mystery without Potential | Hint: "...combining Water with something more primal first" | High |
| HNT-002 | Fire + Stone without Foundation | Appropriate hint appears | High |
| HNT-003 | Hint auto-dismiss | Disappears after 4 seconds | Medium |
| HNT-004 | Hint doesn't block result | Combination still produces element | High |
| HNT-005 | Hint visual styling | Italic, opacity 0.8, gold text | Medium |
| HNT-006 | All 7 hint triggers tested | Each hint in hints.ts verified | Medium |

---

### 7. ASSET VERIFICATION (NEW SECTION)

| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|-----------------|----------|
| AST-001 | 12 primordial images exist | Files in /public/primordials/*.png | Critical |
| AST-002 | 9 milestone images exist | Files in /public/milestones/*.png | Critical |
| AST-003 | Milestone images load correctly | No 404 errors, correct dimensions | Critical |
| AST-004 | Pre-cached combines in demoData | 25+ combinations available | Critical |
| AST-005 | Pre-cached scenes in demoData | 10+ zoom scenes available | Critical |
| AST-006 | Sound files exist (if enabled) | Files in /public/sounds/*.mp3 | Medium |

---

### 8. DEMO MODE TESTING

| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|-----------------|----------|
| DEM-001 | Set NEXT_PUBLIC_DEMO_MODE=true | Environment variable read | Critical |
| DEM-002 | Combine uses cached data | No /api/combine network call | Critical |
| DEM-003 | Zoom uses cached data | No /api/zoom network call | Critical |
| DEM-004 | Console shows [DEMO] logs | Debug messages visible | Low |
| DEM-005 | Uncached combo falls back to API | Graceful fallback works | High |
| DEM-006 | Uncached scene falls back to API | Graceful fallback works | High |

---

### 9. UI COMPONENTS

#### 9.1 ElementCard Styling
| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|-----------------|----------|
| ELC-001 | Primordial: teal border | border-teal/60 class | High |
| ELC-002 | Primordial: shimmer effect | Gradient animation plays | Medium |
| ELC-003 | Milestone: gold border | border-gold/70 class | High |
| ELC-004 | Milestone: sparkle effect | Box-shadow animation | Medium |
| ELC-005 | Intermediate: violet border | border-violet/50 class | High |
| ELC-006 | Intermediate: pulse glow | 2.5s cycle animation | High |
| ELC-007 | Regular: surface border | border-surface/40 class | Medium |
| ELC-008 | Hover: scale up | transform: scale(1.08) | Medium |
| ELC-009 | Drag: visual feedback | scale 1.1, opacity 0.8 | Medium |
| ELC-010 | Whisper text below card | Visible on showWhisper | Low |

#### 9.2 Sidebar
| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|-----------------|----------|
| SID-001 | 12 primordials in grid | 4x3 grid layout | Critical |
| SID-002 | Discovered section exists | "Remembered" heading | High |
| SID-003 | New discoveries appear | Added to Discovered section | Critical |
| SID-004 | Elements draggable | Can drag to combine zone | Critical |
| SID-005 | Click to zoom works | Navigates to element scene | High |

#### 9.3 Header
| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|-----------------|----------|
| HDR-001 | Title: "THE MEMORY" | Gold "THE" + Violet "MEMORY" | Medium |
| HDR-002 | Remembered count accurate | Shows correct discovery count | Medium |
| HDR-003 | Depth indicator updates | Shows current zoom depth | Medium |
| HDR-004 | Memory token count | Shows context token total | Low |

---

### 10. VISUAL POLISH

| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|-----------------|----------|
| VIS-001 | ParticleField renders | Subtle floating particles visible | High |
| VIS-002 | Particle colors correct | Gold, violet, teal from palette | Medium |
| VIS-003 | Celestial Dreams void background | #1c2541 base color | High |
| VIS-004 | Fonts load correctly | Space Grotesk, Inter, Crimson Text | High |
| VIS-005 | Glow shadows visible | Elements have shadow effects | Medium |
| VIS-006 | 60fps animations | No dropped frames in devtools | High |
| VIS-007 | No layout shift on load | Stable layout immediately | Medium |

---

### 11. PERFORMANCE

| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|-----------------|----------|
| PRF-001 | Combine latency < 1.5s | Gemini Flash spec | Critical |
| PRF-002 | Zoom latency < 2s | Scene generation spec | Critical |
| PRF-003 | Initial load < 3s | First contentful paint | High |
| PRF-004 | Animation frame rate ≥ 55fps | Performance tab check | High |
| PRF-005 | No memory leaks | Heap stable over 10 min play | Medium |
| PRF-006 | Bundle size reasonable | < 500KB initial JS | Medium |

---

### 12. ERROR HANDLING

| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|-----------------|----------|
| ERR-001 | API timeout (10s) | Shows error, doesn't crash | High |
| ERR-002 | Network disconnected | Shows error message | High |
| ERR-003 | Invalid element ID | Graceful failure, no crash | Medium |
| ERR-004 | Malformed API response | Error caught, displayed | Medium |
| ERR-005 | Missing asset file | Fallback or placeholder shown | Medium |

---

### 13. STATE PERSISTENCE

| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|-----------------|----------|
| PER-001 | Discovered elements persist | Saved to localStorage | High |
| PER-002 | Refresh preserves discoveries | Elements still there | High |
| PER-003 | Audio settings persist | Volume/mute remembered | Low |
| PER-004 | Clear localStorage resets | Fresh start possible | Low |

---

## TEST EXECUTION PHASES

### Phase 1: Asset Verification (15 min)
- AST-001 to AST-006
- Verify all images, sounds, demo data exist
- **BLOCKER if any Critical fails**

### Phase 2: Smoke Test (30 min)
- CMB-001 to CMB-007
- ZOM-001 to ZOM-005
- REV-001, REV-006, REV-013
- **Verify core loop works end-to-end**

### Phase 3: Demo Script Dry Run (45 min)
- DEM-100 to DEM-111
- Run through exact demo timeline
- **Record screen, verify each timestamp**
- **BLOCKER if any action off by > 10 seconds**

### Phase 4: Feature Deep Dive (2 hours)
- All remaining High/Medium tests
- Document bugs with screenshots
- Test edge cases

### Phase 5: Demo Recording Prep (1 hour)
- Enable DEMO_MODE
- Verify no live API calls
- Run demo script 3 times flawlessly
- **Green light for recording**

---

## TOOLS REQUIRED

1. **Chrome DevTools - Network Tab**
   - Verify API calls and latency
   - Confirm demo mode blocks API calls

2. **Chrome DevTools - Performance Tab**
   - Animation frame rate
   - Memory profiling

3. **Chrome DevTools - Application Tab**
   - localStorage inspection
   - State persistence verification

4. **React DevTools**
   - Component state inspection
   - Re-render analysis

5. **Stopwatch/Timer**
   - Demo script timing verification

---

## SUCCESS CRITERIA

| Priority | Requirement |
|----------|-------------|
| Critical | 100% pass rate |
| High | 100% pass rate |
| Medium | 90% pass rate |
| Low | 80% pass rate |
| Demo Script | All 12 steps within ±5s |
| Performance | All targets met |

---

## BUG SEVERITY CLASSIFICATION

- **P0 (Blocker)**: Demo cannot proceed, crash, data loss
- **P1 (Critical)**: Major feature broken, workaround exists
- **P2 (Major)**: Feature partially broken, impacts UX
- **P3 (Minor)**: Visual glitch, polish issue
- **P4 (Trivial)**: Cosmetic, no user impact
