# Omnigenesis Testing Plan v1

## Overview
Comprehensive testing plan for Omnigenesis - The Memory hackathon project.

## Test Categories

### 1. Core Game Loop Tests

#### 1.1 COMBINE Mechanic
| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|-----------------|----------|
| CMB-001 | Drag primordial to slot 1 | Element appears in slot | Critical |
| CMB-002 | Drag primordial to slot 2 | Element appears in slot | Critical |
| CMB-003 | Two elements trigger auto-combine | API called, result appears | Critical |
| CMB-004 | Combine Stone + Water | Returns new element (e.g., Mud) | Critical |
| CMB-005 | Combine Fire + Air → Energy (milestone) | Triggers 9-second reveal | Critical |
| CMB-006 | Combine with hint trigger | Shows hint text | High |
| CMB-007 | Clear slots after combine | Slots reset to empty | High |
| CMB-008 | Combine loading state | Shows spinner during API call | Medium |
| CMB-009 | Combine error handling | Shows error message on failure | Medium |
| CMB-010 | Rapid combine attempts | Debounced, no duplicates | Low |

#### 1.2 ZOOM Mechanic
| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|-----------------|----------|
| ZOM-001 | Click primordial element | Zoom API called, scene renders | Critical |
| ZOM-002 | Scene elements positioned correctly | Elements at x,y percentages | Critical |
| ZOM-003 | Click element in scene (canZoomInto=true) | Zooms deeper | Critical |
| ZOM-004 | Breadcrumb navigation appears | Shows zoom path | High |
| ZOM-005 | Click breadcrumb to navigate back | Returns to that scene | High |
| ZOM-006 | Ascend button works | Returns to previous level | High |
| ZOM-007 | Depth indicator updates | Shows I, II, III, etc. | Medium |
| ZOM-008 | Memory fragment displayed | Shows gold box with lore | Medium |
| ZOM-009 | Context callback displayed | Shows "This reminds you of..." | Medium |
| ZOM-010 | Scene description typewriter | Text types out character by character | Medium |

#### 1.3 EVOLVE Mechanic
| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|-----------------|----------|
| EVO-001 | First milestone discovery triggers evolution | API call to /api/evolution | Critical |
| EVO-002 | Evolution generating indicator | Shows in corner | High |
| EVO-003 | Evolution ready notification | Badge appears when complete | High |
| EVO-004 | Click notification opens video | Modal with video player | High |
| EVO-005 | Video plays with controls | Play/pause, progress bar | Medium |
| EVO-006 | Close video modal | Modal closes, badge remains | Medium |

### 2. 9-Second Reveal Animation

| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|-----------------|----------|
| REV-001 | Screen dims (0-2s) | Overlay fades to 60% opacity | Critical |
| REV-002 | Emoji appears blurred (2-5s) | Large emoji with blur filter | Critical |
| REV-003 | Blur decreases (5-9s) | Blur goes from 20px to 0 | Critical |
| REV-004 | Gold glow pulse (post-reveal) | Pulsing animation starts | High |
| REV-005 | Lore text types out | TypewriterText component | High |
| REV-006 | Element name displayed | Shows milestone name | High |
| REV-007 | Click to skip | Skips to completion | Medium |
| REV-008 | onComplete callback fires | After ~11 seconds | High |

### 3. UI Components

#### 3.1 ElementCard
| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|-----------------|----------|
| ELC-001 | Primordial styling | Teal border, shimmer effect | Medium |
| ELC-002 | Milestone styling | Gold border, sparkle effect | Medium |
| ELC-003 | Intermediate styling | Violet border, pulse glow | Medium |
| ELC-004 | Regular element styling | Surface border, subtle glow | Low |
| ELC-005 | Hover state | Scale up, enhanced glow | Medium |
| ELC-006 | Drag visual feedback | Scale 1.1, opacity 0.8 | Medium |
| ELC-007 | Whisper text displayed | Below element card | Low |
| ELC-008 | Pathway text for intermediate | Shows "On the path to X" | Medium |

#### 3.2 Sidebar
| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|-----------------|----------|
| SID-001 | 12 primordials displayed | Grid of 12 elements | Critical |
| SID-002 | Discovered elements section | Shows newly discovered | High |
| SID-003 | Elements are draggable | Can drag to combine zone | Critical |
| SID-004 | Click element to zoom | Navigates to element scene | High |

#### 3.3 Header
| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|-----------------|----------|
| HDR-001 | Title displays | "THE MEMORY" | Low |
| HDR-002 | Remembered count | Shows number discovered | Medium |
| HDR-003 | Depth indicator | Shows current depth tier | Medium |
| HDR-004 | Memory counter | Shows context tokens | Low |

### 4. Visual Polish

| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|-----------------|----------|
| VIS-001 | ParticleField background | Subtle floating particles | Medium |
| VIS-002 | Celestial Dreams palette | Void, gold, violet, teal colors | High |
| VIS-003 | Fonts loaded correctly | Space Grotesk, Inter, Crimson Text | Medium |
| VIS-004 | Glow shadows on elements | Shadow effects visible | Medium |
| VIS-005 | Smooth animations | No jank or stutter | High |

### 5. Demo Mode

| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|-----------------|----------|
| DEM-001 | Enable DEMO_MODE | Set env variable | Critical |
| DEM-002 | Cached combine results | Uses demoData instead of API | Critical |
| DEM-003 | Cached zoom scenes | Uses demoData instead of API | Critical |
| DEM-004 | Fallback to API | When no cached data | High |
| DEM-005 | Console logs demo status | Shows [DEMO] prefix | Low |

### 6. Sound System

| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|-----------------|----------|
| SND-001 | Combine sound plays | On successful combine | Medium |
| SND-002 | Milestone sound plays | On milestone discovery | Medium |
| SND-003 | Zoom sound plays | On zoom into element | Medium |
| SND-004 | Mute/unmute works | Toggles all sounds | Low |
| SND-005 | Volume control | Adjusts master volume | Low |

### 7. State Persistence

| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|-----------------|----------|
| PER-001 | Discovered elements persist | Saved to localStorage | High |
| PER-002 | Refresh preserves state | Elements still discovered | High |
| PER-003 | Audio settings persist | Volume/mute saved | Low |

### 8. Error Handling

| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|-----------------|----------|
| ERR-001 | API timeout | Shows error, doesn't crash | High |
| ERR-002 | Invalid element ID | Graceful failure | Medium |
| ERR-003 | Network disconnected | Shows error message | High |
| ERR-004 | Malformed API response | Catches and displays error | Medium |

### 9. Performance

| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|-----------------|----------|
| PRF-001 | Combine latency < 2s | API returns quickly | Critical |
| PRF-002 | Zoom latency < 2s | Scene generates fast | Critical |
| PRF-003 | No memory leaks | Stable over time | High |
| PRF-004 | Smooth 60fps animations | No dropped frames | High |

### 10. Accessibility

| Test ID | Test Case | Expected Result | Priority |
|---------|-----------|-----------------|----------|
| A11-001 | Keyboard navigation | Tab through elements | Low |
| A11-002 | Focus indicators | Visible focus ring | Low |
| A11-003 | Color contrast | Text readable | Medium |

## Test Execution Plan

### Phase 1: Smoke Testing (30 min)
- CMB-001 to CMB-005
- ZOM-001, ZOM-002, ZOM-003
- REV-001 to REV-003
- Verify core loop works

### Phase 2: Feature Testing (2 hours)
- All remaining test cases
- Document any bugs found
- Screenshot key states

### Phase 3: Demo Path Testing (1 hour)
- Enable demo mode
- Run through scripted demo path
- Time each interaction
- Verify no API calls in demo mode

### Phase 4: Edge Cases (1 hour)
- Error scenarios
- Rapid interactions
- State persistence

## Tools Required
- Chrome DevTools (Network tab for API calls)
- Chrome DevTools (Performance tab for animation)
- React DevTools (Component state inspection)
- localStorage inspector

## Success Criteria
- All Critical tests pass
- All High tests pass
- 90% of Medium tests pass
- Demo path runs smoothly without errors
- Performance targets met (<2s latency)
