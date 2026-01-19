# v0 UI Design Prompt - Sir Reginald

## Product Overview

**Sir Reginald Makesworth III** - "Your Distinguished Workshop Guardian"

A real-time AI workshop safety assistant with a British aristocrat personality. It watches your workshop through a webcam, warns you before accidents happen, and helps troubleshoot problems - all hands-free via voice.

**Personality:** Distinguished British gentleman, retired head craftsman from Windsor Castle. Speaks politely ("Pardon the interruption, but I notice..."), never condescending, warm but authoritative.

---

## What to Build

A **dark-themed dashboard** for a real-time AI workshop monitor. The user sets up a webcam in their workshop, and "Sir Reginald" watches and speaks to them.

### Core Layout (Desktop - 1280px+)

```
┌────────────────────────────────────────────────────────────────────────┐
│  STATUS BAR                                                            │
│  🟢 Connected to Sir Reginald  │  🎤 Listening  │  Session: 02:34      │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌─────────────────────────────────────────────┐  ┌─────────────────┐ │
│  │                                             │  │                 │ │
│  │                                             │  │  AI MESSAGES    │ │
│  │            LIVE VIDEO FEED                  │  │                 │ │
│  │             (webcam view)                   │  │  🎩 "Splendid!  │ │
│  │               640x480                       │  │   Safety glasses│ │
│  │                                             │  │   on. Do carry  │ │
│  │  ┌──────────────────┐                       │  │   on."          │ │
│  │  │ 🛡️ SAFETY MODE   │     [SIR REGINALD    │  │      just now   │ │
│  │  └──────────────────┘      WATCHING] 🔴     │  │                 │ │
│  │                                             │  │  🎩 "I notice   │ │
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓  <- Visual Overlay          │  │   your hand..." │ │
│  │  ▓ HANDS AREA ▓     (semi-transparent       │  │      2 min ago  │ │
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓      highlight region)      │  │                 │ │
│  │                                             │  │                 │ │
│  └─────────────────────────────────────────────┘  └─────────────────┘ │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  MODE TOGGLE                                                      │ │
│  │  [🛡️ Safety Monitor]  [🔧 Troubleshooter]                         │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Design System

### Colors (Dark Theme)

| Color | Hex | Usage |
|-------|-----|-------|
| Background | `#0F0F0F` | Main background |
| Surface | `#1A1A1A` | Cards, panels |
| Surface Light | `#252525` | Hover states |
| Primary/Safe | `#22C55E` | Connected, safe status |
| Warning | `#EAB308` | Caution alerts |
| Danger | `#EF4444` | Safety alerts |
| Accent | `#8B5CF6` | Sir Reginald branding (royal purple) |
| Text Primary | `#FFFFFF` | Main text |
| Text Secondary | `#A1A1A1` | Labels, hints |
| Text Muted | `#6B7280` | Timestamps |

### Typography

- **Font:** Inter (or system sans-serif)
- **Headings:** Bold, white
- **Body:** Regular, white/gray
- **Status text:** Medium weight

### Visual Style

- **Rounded corners:** 8px for cards, 4px for buttons
- **Subtle borders:** 1px `#333333`
- **Shadows:** Minimal, dark theme
- **Feel:** Industrial but refined, like a high-end workshop tool

---

## Components to Design

### 1. Status Bar (Top)

48px height, spans full width.

Contains:
- **Connection status:** Green dot + "Connected to Sir Reginald" (or red "Disconnected")
- **Mic status:** 🎤 icon + "Listening" / "Muted"
- **Session timer:** "Session: 02:34"

```
┌──────────────────────────────────────────────────────────────────────┐
│ 🟢 Connected to Sir Reginald  │  🎤 Listening  │  Session: 02:34    │
└──────────────────────────────────────────────────────────────────────┘
```

**Connection States:**
| State | Indicator |
|-------|-----------|
| Connected | 🟢 Green dot, "Connected to Sir Reginald" |
| Connecting | 🟡 Pulsing yellow, "Connecting..." |
| Reconnecting | 🟠 Pulsing orange, "Reconnecting..." |
| Disconnected | 🔴 Red dot, "Disconnected" + Retry button |

---

### 2. Video Preview (Main Area)

The hero component. Shows live webcam feed.

**Specs:**
- Aspect ratio: 4:3
- Size: 640x480px minimum, can scale up
- Border radius: 8px
- Border: 2px solid (color changes by mode - green for safety, purple for troubleshoot)

**Overlays on video:**
1. **Mode badge** (top-left): "🛡️ SAFETY MODE" or "🔧 TROUBLESHOOT"
2. **Recording indicator** (top-right): Red dot + "SIR REGINALD WATCHING"
3. **Visual highlight region** (semi-transparent): Shows where AI is looking

**Visual Highlight Overlay:**
When Sir Reginald speaks about something, highlight that region:
- Semi-transparent colored rectangle with pulsing corners
- Colors: Orange for hands/danger, Teal for face/PPE, Green for equipment
- Fades in/out smoothly

---

### 3. AI Messages Panel (Right Sidebar)

Shows Sir Reginald's recent messages as a scrollable list.

**Width:** 320px
**Style:** Dark card with messages stacked vertically

Each message:
```
┌─────────────────────────────────────┐
│ 🎩  "Pardon the interruption, but  │
│     I notice you're reaching       │
│     toward the blade without       │
│     safety spectacles."            │
│                              2m ago │
└─────────────────────────────────────┘
```

- Icon: 🎩 (top hat) or a refined avatar
- Message text in quotes
- Timestamp in muted text, bottom-right
- Most recent at top

---

### 4. Safety Alert (Modal Overlay)

When Sir Reginald detects danger, show a prominent alert overlay.

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│     ⚠️  SAFETY NOTICE                                       │
│                                                             │
│     "Pardon the interruption, but I don't see              │
│      safety spectacles, and that laser is rather           │
│      unforgiving of such oversights."                       │
│                                                             │
│                   [ Acknowledged ]                          │
│                                                             │
│     Say "okay" or "got it" to dismiss                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Styles:**
- Warning (yellow border): PPE missing, technique issues
- Danger (red border): Immediate hazard, hand near blade

**Behavior:**
- Appears center-screen over video
- Pulsing border animation
- Can dismiss via button OR voice ("okay", "got it")
- Auto-dismiss after 10 seconds

---

### 5. Mode Toggle

Switch between Safety Monitor and Troubleshooter modes.

```
┌────────────────────────────────────────────────────────┐
│   [ 🛡️ Safety Monitor ]    [ 🔧 Troubleshooter ]      │
└────────────────────────────────────────────────────────┘
```

- Segmented control style
- Active mode has filled background
- Safety = Green accent, Troubleshoot = Purple accent

---

### 6. Voice Activity Indicators

Show when Sir Reginald is speaking vs when user is speaking.

**AI Speaking:**
```
┌─────────────────────────────────────┐
│ 🔊 ▁▂▃▅▃▂▁  Sir Reginald speaking  │
└─────────────────────────────────────┘
```
- Animated sound wave bars
- Green glow on messages panel

**User Speaking:**
```
┌─────────────────────────────────────┐
│ 🎤 ████░░░░░  Listening...         │
└─────────────────────────────────────┘
```
- Audio level meter
- Pulsing mic icon

**Idle:**
```
┌─────────────────────────────────────┐
│ 🎤 Ready                           │
└─────────────────────────────────────┘
```

---

### 7. Fallback/Degradation Indicator

When connection quality drops, show current status:

```
┌─────────────────────────────────────────────────────────────┐
│ ⚡ Reduced Monitoring                                        │
│ "I'm experiencing a touch of delay. Do be extra careful."   │
└─────────────────────────────────────────────────────────────┘
```

Small banner below status bar, yellow/orange background.

---

### 8. Onboarding/Setup Screen

First-time user flow:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                        🎩                                       │
│                                                                 │
│              Sir Reginald Makesworth III                        │
│           Your Distinguished Workshop Guardian                  │
│                                                                 │
│    ┌─────────────────────────────────────────────────────┐     │
│    │                                                     │     │
│    │              [ Camera Preview ]                     │     │
│    │                                                     │     │
│    └─────────────────────────────────────────────────────┘     │
│                                                                 │
│    ✓ Camera access granted                                     │
│    ✓ Microphone access granted                                 │
│    ○ Test audio output                                         │
│                                                                 │
│                  [ Begin Session ]                              │
│                                                                 │
│    "Good day! I shall be keeping a watchful eye on your        │
│     workshop. Do carry on with your excellent work."           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Branding Elements

**Sir Reginald Identity:**
- Icon: 🎩 (top hat) or monocle
- Color: Royal purple (`#8B5CF6`) as accent
- Tone: Refined, distinguished, but approachable
- Tagline: "Your Distinguished Workshop Guardian"

**Logo lockup:**
```
🎩 Sir Reginald
   Your Distinguished Workshop Guardian
```

---

## Responsive Notes

**Desktop (1280px+):** Full layout as shown above
**Tablet (768-1279px):** Video full width, messages as bottom sheet
**Mobile (<768px):** Not primary target, but functional - video stacked over controls

---

## Key Screens to Generate

1. **Main Dashboard** - Safety Monitor mode active, showing video with overlay
2. **Safety Alert** - Modal overlay with warning message
3. **Troubleshooter Mode** - Different accent color, user asking about a problem
4. **Onboarding** - Setup screen with permission requests
5. **Disconnected State** - Error state with reconnect option

---

## Technical Notes (for implementation)

- Framework: Next.js 14 + TypeScript + Tailwind CSS
- Video is from webcam using `getUserMedia()`
- All voice interaction - user's hands are busy with tools
- Dark theme mandatory (easier on eyes in variable workshop lighting)
