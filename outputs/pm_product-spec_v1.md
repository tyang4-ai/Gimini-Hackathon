# WorkshopCopilot Product Specification v1

**Product:** WorkshopCopilot - "Your 24/7 Shop Mentor"
**Version:** 1.0
**Date:** January 15, 2026
**Target:** Google DeepMind Gemini 3 Hackathon
**Submission Deadline:** February 9, 2026, 5:00 PM PT

---

## Table of Contents

1. [Product Definition](#1-product-definition)
2. [Technical Architecture](#2-technical-architecture)
3. [Gemini Live API Integration](#3-gemini-live-api-integration)
4. [Tech Stack](#4-tech-stack)
5. [Feature Specifications](#5-feature-specifications)
6. [Folder Structure](#6-folder-structure)
7. [Development Phases](#7-development-phases)
8. [Demo Script](#8-demo-script)
9. [Risk Assessment](#9-risk-assessment)
10. [Environment Setup](#10-environment-setup)
11. [Submission Checklist](#11-submission-checklist)

---

## 1. Product Definition

### 1.1 Problem Statement

**The Maker's Dangerous Reality:**

Home workshop hobbyists work alone in garages and basements, often late at night when their focus is lowest. They face two critical problems:

1. **No Safety Net:** When cutting, drilling, or laser-cutting, one moment of distraction leads to permanent injury. There's no one watching when attention slips.

2. **No Expert Access:** When a 3D print fails or a cut goes wrong, there's no one to ask. YouTube tutorials can't see YOUR problem. Forum answers take hours.

**The Statistics:**
- 30,000 finger amputations per year from table saws in the US
- $50 average wasted per beginner in failed 3D prints before figuring out settings
- 1,400+ US makerspaces need scalable safety oversight

### 1.2 Target User

**Primary Persona: The Midnight Maker**

- Works alone in garage/basement/spare room
- Evening and weekend maker - projects happen when family is asleep
- Self-taught from YouTube, forums, trial and error
- Owns 3D printer, maybe laser cutter, basic power tools
- Has had close calls - the near-miss that still makes them nervous
- Gets stuck on problems and has no one to ask in the moment

**Why This Audience:**
- Safety stakes are highest (no one else is there)
- Need is clearest (isolation is the defining characteristic)
- Story is most universal (judges understand working alone)
- Demo is most impactful (AI saving someone who has no backup)

### 1.3 Value Proposition

**One-Liner:**
> "WorkshopCopilot is the AI that watches your workshop - stops you before you bleed, helps you when you're stuck."

**Core Differentiator:**
> "Before, not after. ChatGPT sees photos AFTER you upload them. WorkshopCopilot sees danger BEFORE you complete the action."

**Why This Matters:**
- ChatGPT/Claude: Request-response model - you ask, then they answer
- WorkshopCopilot: Continuous monitoring - it watches, then it speaks
- That's not a feature difference. That's an architecture difference.

### 1.4 Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Safety Response Time** | <1 second from hazard detection to voice warning | Timestamp logging |
| **Voice Interaction Latency** | First token in <600ms | API response timing |
| **Video Processing Rate** | Stable 1 FPS continuous feed | Frame counter |
| **Demo Reliability** | 100% success rate on 3 core demo scenarios | Demo rehearsal testing |
| **Session Stability** | 2-minute uninterrupted audio+video session | Connection monitoring |

---

## 2. Technical Architecture

### 2.1 System Overview

```
+------------------+     WebSocket      +-------------------+
|                  |  (Audio + Video)   |                   |
|   Browser UI     | <----------------> |  Gemini Live API  |
|   (React/Next)   |                    |  (gemini-2.5-     |
|                  |                    |   flash-native-   |
|  - Webcam Feed   |                    |   audio-preview)  |
|  - Audio I/O     |                    |                   |
|  - Status UI     |                    |  - Video Analysis |
+------------------+                    |  - Speech Output  |
         |                              |  - Proactive Mode |
         v                              +-------------------+
+------------------+
|  Local State     |
|  - Session ID    |
|  - Mode Toggle   |
|  - Alert History |
+------------------+
```

### 2.2 Architecture Decision: Client-Side Direct Connection

**Decision:** Direct browser-to-Gemini WebSocket connection (no backend server)

**Rationale:**
1. **Lower Latency:** Eliminates server hop for safety-critical responses
2. **Simpler Architecture:** No server infrastructure to deploy/maintain
3. **Hackathon Speed:** Faster to build and debug
4. **Demo Reliability:** Fewer failure points during live demo

**Security Note:**
- Use ephemeral tokens (recommended by Google for client-side)
- For hackathon demo: API key in environment variable is acceptable
- Production: Would require backend token service

### 2.3 Data Flow

**Continuous Monitoring Mode (Safety Monitor):**
```
1. Webcam captures frame (every 1 second)
2. Frame encoded to base64
3. Sent via WebSocket to Gemini Live API
4. Gemini analyzes frame with safety system prompt
5. If hazard detected: Proactive audio response generated
6. Audio streamed back and played immediately
7. Loop continues until session ends or user stops
```

**Reactive Mode (Visual Troubleshooter):**
```
1. User speaks: "What's wrong with this print?"
2. Audio captured and streamed to Gemini
3. Current video frame(s) sent alongside
4. Gemini analyzes visual + audio query
5. Diagnostic audio response generated
6. Response streamed and played
```

### 2.4 Component Breakdown

| Component | Responsibility | Technology |
|-----------|---------------|------------|
| **VideoCapture** | Webcam access, frame extraction at 1 FPS | MediaDevices API |
| **AudioIO** | Microphone input, speaker output | Web Audio API |
| **WebSocketManager** | Connection lifecycle, message handling | Native WebSocket |
| **GeminiClient** | API message formatting, response parsing | Custom wrapper |
| **StateManager** | Mode toggle, session state, history | React useState/Context |
| **UI Components** | Video preview, status indicators, controls | React + Tailwind |

---

## 3. Gemini Live API Integration

### 3.1 API Configuration

**Model:** `gemini-2.5-flash-native-audio-preview-12-2025`

**Session Configuration:**
```javascript
const sessionConfig = {
  model: "gemini-2.5-flash-native-audio-preview-12-2025",
  generationConfig: {
    responseModalities: ["AUDIO"],
    speechConfig: {
      voiceConfig: {
        prebuiltVoiceConfig: {
          voiceName: "Kore" // Calm, clear voice for safety
        }
      }
    }
  },
  systemInstruction: {
    parts: [{ text: SAFETY_SYSTEM_PROMPT }]
  },
  proactivity: {
    proactiveAudio: true  // CRITICAL: Enables AI-initiated speech
  }
};
```

### 3.2 System Prompts

**Safety Monitor System Prompt:**
```
You are WorkshopCopilot, a safety-focused workshop assistant monitoring a home workshop via live video feed.

YOUR CORE MISSION: Protect the user from injury by speaking up BEFORE dangerous actions are completed.

SAFETY PRIORITIES (in order):
1. IMMEDIATE DANGER: Hands near moving blades, touching hot surfaces, improper tool grip
2. PPE MISSING: Safety glasses absent when using laser cutter, no hearing protection with loud tools
3. TECHNIQUE ISSUES: Improper cutting stance, incorrect tool usage, unsafe material handling
4. ENVIRONMENT HAZARDS: Cluttered workspace, fire risks, ventilation issues

RESPONSE GUIDELINES:
- Speak IMMEDIATELY when you see danger - don't wait for them to ask
- Use calm, direct language: "Hold on - I don't see safety glasses."
- Be specific about what you see: "Your hand is getting close to the blade."
- Avoid lecturing or long explanations - brief warnings save lives
- If you're unsure, err on the side of caution and speak up

TONE:
- Like an experienced friend watching over your shoulder
- Not a nagging safety system - a helpful peer
- Direct but not alarming - calm confidence

WHAT YOU'RE WATCHING:
- A home workshop with 3D printer, laser cutter, and/or basic power tools
- A single person working alone
- Continuous 1 FPS video feed

WHEN NOT TO SPEAK:
- Normal, safe operation
- User already wearing proper PPE
- No immediate hazards visible
- Background activity unrelated to immediate work
```

**Visual Troubleshooter System Prompt:**
```
You are WorkshopCopilot, an expert workshop troubleshooting assistant. The user is showing you a physical object or situation and asking for diagnosis.

YOUR EXPERTISE:
- 3D Printing (FDM): Bed leveling, adhesion, stringing, layer separation, warping, supports
- Laser Cutting: Power/speed settings, material identification, cut quality, safety
- Basic Woodworking: Cut quality, joint problems, material selection
- Material Identification: Common woods, plastics, composites by visual inspection

DIAGNOSTIC APPROACH:
1. Describe what you SEE specifically (location, pattern, extent)
2. Identify the likely CAUSE based on visual evidence
3. Provide ACTIONABLE fix (specific settings, techniques)
4. Offer to explain further if they want details

RESPONSE STYLE:
- Start with what you observe: "I can see layer separation around the 30% mark..."
- Give specific numbers when relevant: "Try 205C instead of 210C"
- Keep initial response under 30 seconds - offer to elaborate
- If unclear, ask clarifying questions

LIMITATIONS:
- If you can't see clearly, say so and ask them to move the object
- If the problem is outside your expertise, be honest about it
- Don't guess wildly - confidence should match evidence
```

### 3.3 WebSocket Message Types

**Client to Server:**

```javascript
// Setup message (first message)
{
  "setup": {
    "model": "gemini-2.5-flash-native-audio-preview-12-2025",
    "generationConfig": { /* session config */ },
    "systemInstruction": { /* system prompt */ }
  }
}

// Realtime input (audio/video frames)
{
  "realtimeInput": {
    "mediaChunks": [
      {
        "mimeType": "image/jpeg",  // or "audio/pcm"
        "data": "<base64-encoded-data>"
      }
    ]
  }
}

// Client content (text messages)
{
  "clientContent": {
    "turns": [
      {
        "role": "user",
        "parts": [{ "text": "What's wrong with this print?" }]
      }
    ],
    "turnComplete": true
  }
}
```

**Server to Client:**

```javascript
// Setup complete
{
  "setupComplete": {}
}

// Server content (model response)
{
  "serverContent": {
    "modelTurn": {
      "parts": [
        {
          "inlineData": {
            "mimeType": "audio/pcm",
            "data": "<base64-encoded-audio>"
          }
        }
      ]
    },
    "turnComplete": true  // or false if still streaming
  }
}

// Interruption signal
{
  "serverContent": {
    "interrupted": true
  }
}
```

### 3.4 Audio Specifications

| Parameter | Value |
|-----------|-------|
| Input Audio Format | 16-bit PCM |
| Input Sample Rate | 16,000 Hz |
| Input Channels | Mono |
| Output Sample Rate | 24,000 Hz |
| Chunk Size | 1024 samples |

### 3.5 Video Specifications

| Parameter | Value |
|-----------|-------|
| Frame Rate | 1 FPS |
| Format | JPEG (base64 encoded) |
| Resolution | 640x480 recommended |
| Quality | 0.8 JPEG quality |

### 3.6 Session Limits

| Limit | Value | Mitigation |
|-------|-------|------------|
| Audio + Video Session | 2 minutes max | Auto-reconnect, session chaining |
| Audio Only Session | 15 minutes max | N/A (we use video) |
| Context Window | 128k tokens (native audio) | Session reset clears context |

---

## 4. Tech Stack

### 4.1 Stack Selection

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Framework** | Next.js 14 (App Router) | Fast setup, built-in routing, easy deployment |
| **Language** | TypeScript | Type safety, better DX, fewer runtime errors |
| **Styling** | Tailwind CSS | Rapid UI development, no CSS files |
| **State** | React useState + Context | Simple, no extra dependencies |
| **Audio** | Web Audio API | Native browser support, low latency |
| **Video** | MediaDevices API | Native webcam access |
| **WebSocket** | Native WebSocket | Direct connection, no library overhead |
| **Deployment** | Vercel | One-click deploy, free tier, fast |
| **Testing** | Manual + Chrome DevTools | Hackathon speed over test coverage |

### 4.2 Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/react": "^18.2.0",
    "@types/node": "^20.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

### 4.3 Browser Requirements

- Chrome 90+ (primary target)
- Firefox 90+ (secondary)
- Safari 15+ (untested, may work)
- HTTPS required for camera/microphone access

---

## 5. Feature Specifications

### 5.1 P0 Features (Must Have for Demo)

#### P0-1: Safety Monitor (Proactive)

**Description:** Continuous video monitoring that speaks up when it detects safety hazards without user prompting.

**Acceptance Criteria:**
- [ ] Webcam feed displayed in UI with "MONITORING" indicator
- [ ] 1 FPS frame capture and transmission to Gemini Live API
- [ ] Proactive audio enabled - AI initiates speech without user prompt
- [ ] Detects and warns about: missing safety glasses, hand near blade/danger zone
- [ ] Warning plays through speakers within 1 second of detection
- [ ] Can be toggled on/off by user

**Demo Scenario:**
User reaches toward laser cutter without safety glasses.
AI: "Hold on - I don't see safety glasses, and you're reaching toward the laser cutter. Let's fix that first."

**Technical Implementation:**
```javascript
// Core monitoring loop
const startSafetyMonitor = async () => {
  const session = await initGeminiSession(SAFETY_SYSTEM_PROMPT, { proactiveAudio: true });

  setInterval(async () => {
    const frame = captureVideoFrame();
    await session.sendRealtimeInput({
      mediaChunks: [{
        mimeType: "image/jpeg",
        data: frame.toBase64()
      }]
    });
  }, 1000); // 1 FPS

  session.onAudioResponse((audioData) => {
    playAudio(audioData);
  });
};
```

---

#### P0-2: Visual Troubleshooter (Reactive)

**Description:** User shows a failed print/cut/problem and asks what went wrong. AI analyzes visually and provides diagnosis.

**Acceptance Criteria:**
- [ ] Push-to-talk or voice activation button
- [ ] User can ask questions while showing objects to camera
- [ ] AI analyzes current video frames alongside audio query
- [ ] Provides specific, actionable diagnosis
- [ ] Response plays as natural speech

**Demo Scenario:**
User holds up a 3D print with visible layer separation.
User: "Hey, what went wrong with this print?"
AI: "I can see layer separation starting around the 30% mark, and there's stringing between the towers. This usually means heat creep - your hotend is getting too warm. Try reducing your printing temperature by 5 degrees and adding more part cooling. Also, that overhang on the left needed supports."

**Technical Implementation:**
```javascript
// Voice query handler
const handleVoiceQuery = async (audioStream) => {
  // Send audio + current video frame
  await session.sendRealtimeInput({
    mediaChunks: [
      { mimeType: "audio/pcm", data: audioStream.toBase64() },
      { mimeType: "image/jpeg", data: captureVideoFrame().toBase64() }
    ]
  });

  // Response handled by existing audio callback
};
```

---

#### P0-3: Voice Output System

**Description:** All AI responses delivered as natural speech through the user's speakers.

**Acceptance Criteria:**
- [ ] Audio responses play automatically when received
- [ ] Clear, understandable voice (Kore voice selected)
- [ ] Supports barge-in (AI can interrupt itself if situation changes)
- [ ] Volume controllable through system audio

**Technical Implementation:**
```javascript
// Audio playback system
class AudioPlayer {
  private audioContext: AudioContext;
  private audioQueue: AudioBuffer[] = [];

  async playPCM(base64Data: string, sampleRate: number = 24000) {
    const audioData = base64ToArrayBuffer(base64Data);
    const audioBuffer = await this.audioContext.decodeAudioData(audioData);

    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);
    source.start();
  }
}
```

---

#### P0-4: Session Management

**Description:** Handle Gemini Live API session lifecycle including connection, reconnection, and the 2-minute video limit.

**Acceptance Criteria:**
- [ ] Connection established on app load
- [ ] Visual indicator of connection status (Connected/Connecting/Disconnected)
- [ ] Auto-reconnect if connection drops
- [ ] Graceful handling of 2-minute session limit with auto-renewal
- [ ] Clean disconnect on app close

**Technical Implementation:**
```javascript
// Session manager with auto-reconnect
class SessionManager {
  private ws: WebSocket | null = null;
  private sessionStartTime: number = 0;
  private readonly MAX_SESSION_MS = 110000; // 110 seconds (buffer before 2 min)

  async connect() {
    this.ws = new WebSocket(GEMINI_LIVE_ENDPOINT);
    this.sessionStartTime = Date.now();

    // Setup session renewal timer
    setTimeout(() => this.renewSession(), this.MAX_SESSION_MS);

    this.ws.onclose = () => this.handleDisconnect();
  }

  private async renewSession() {
    // Gracefully close and reconnect
    await this.disconnect();
    await this.connect();
  }
}
```

---

### 5.2 P1 Features (Nice to Have)

#### P1-1: Material Identification

**Description:** User shows unknown material, AI identifies it and provides machine-specific settings.

**Acceptance Criteria:**
- [ ] Identifies common materials: woods, plastics, composites
- [ ] Provides laser cutter settings (speed, power) for identified material
- [ ] Provides 3D printer settings if relevant
- [ ] Warns about hazardous materials (PVC, etc.)

**Demo Scenario:**
User: "I found this in the scrap bin. What is it and what settings should I use?"
AI: "That looks like 3mm Baltic birch plywood based on the edge grain layers. For your laser cutter, I'd suggest 15mm/s speed at 80% power for a clean cut. Do a test cut in the corner first - some plywoods have inconsistent glue layers."

---

#### P1-2: Alert History Log

**Description:** Visual log of all safety warnings and troubleshooting queries in the session.

**Acceptance Criteria:**
- [ ] Timestamped list of AI interventions
- [ ] Distinguishes safety warnings from troubleshooting
- [ ] Scrollable history panel
- [ ] Persists during session (clears on reload)

---

#### P1-3: Mode Toggle UI

**Description:** Easy toggle between Safety Monitor mode and Troubleshooter mode.

**Acceptance Criteria:**
- [ ] Toggle button/switch in main UI
- [ ] Visual feedback showing current mode
- [ ] Mode-specific system prompts loaded
- [ ] Smooth transition without reconnection

---

### 5.3 P2 Features (Post-Hackathon)

- Multi-camera support
- Session recording/playback
- Custom safety rule configuration
- Integration with specific 3D printer APIs for settings suggestions
- Mobile app version
- Offline mode with reduced capabilities

---

## 6. Folder Structure

```
workshop-copilot/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout with providers
│   │   ├── page.tsx             # Main application page
│   │   └── globals.css          # Global styles + Tailwind
│   │
│   ├── components/
│   │   ├── VideoFeed.tsx        # Webcam display component
│   │   ├── StatusIndicator.tsx  # Connection/mode status
│   │   ├── ControlPanel.tsx     # Start/stop, mode toggle
│   │   ├── AlertHistory.tsx     # Log of AI interventions
│   │   └── VoiceButton.tsx      # Push-to-talk control
│   │
│   ├── lib/
│   │   ├── gemini/
│   │   │   ├── client.ts        # WebSocket connection manager
│   │   │   ├── messages.ts      # Message type definitions
│   │   │   └── prompts.ts       # System prompts
│   │   │
│   │   ├── media/
│   │   │   ├── video.ts         # Video capture utilities
│   │   │   └── audio.ts         # Audio I/O utilities
│   │   │
│   │   └── utils/
│   │       ├── base64.ts        # Encoding utilities
│   │       └── constants.ts     # App constants
│   │
│   ├── hooks/
│   │   ├── useGeminiSession.ts  # Gemini connection hook
│   │   ├── useVideoCapture.ts   # Webcam hook
│   │   └── useAudioIO.ts        # Audio input/output hook
│   │
│   └── types/
│       └── index.ts             # TypeScript type definitions
│
├── public/
│   └── favicon.ico
│
├── .env.local                   # API keys (gitignored)
├── .env.example                 # Example env file
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## 7. Development Phases

### Phase 1: Foundation (Days 1-2)

**Goal:** Basic Next.js app with webcam display and Gemini connection

| Task | Time Est. | Output |
|------|-----------|--------|
| Create Next.js project with TypeScript + Tailwind | 1 hour | Boilerplate running |
| Implement webcam access and display | 2 hours | Video showing in browser |
| Create Gemini WebSocket connection | 3 hours | Connected to API |
| Send test video frame, receive response | 2 hours | End-to-end data flow |
| Audio output playback | 2 hours | Can hear Gemini responses |

**Checkpoint:** Can see webcam, connect to Gemini, send a frame, hear a response.

---

### Phase 2: Safety Monitor (Days 3-4)

**Goal:** Proactive safety monitoring working end-to-end

| Task | Time Est. | Output |
|------|-----------|--------|
| Implement 1 FPS frame capture loop | 1 hour | Continuous capture |
| Configure proactive audio in session | 2 hours | AI can initiate speech |
| Write and tune safety system prompt | 3 hours | Detects hazards reliably |
| Add status indicators UI | 1 hour | User knows system state |
| Test with real safety scenarios | 2 hours | Reliable warnings |

**Checkpoint:** Can demonstrate safety glasses detection and warning.

---

### Phase 3: Visual Troubleshooter (Days 5-6)

**Goal:** Reactive troubleshooting working end-to-end

| Task | Time Est. | Output |
|------|-----------|--------|
| Implement audio input capture | 2 hours | Can record user voice |
| Create push-to-talk UI | 1 hour | User can trigger query |
| Wire audio + video to query handler | 2 hours | Combined input working |
| Write troubleshooter system prompt | 2 hours | Good diagnoses |
| Test with failed 3D print scenarios | 2 hours | Accurate responses |

**Checkpoint:** Can demonstrate "what went wrong" diagnosis of a failed print.

---

### Phase 4: Polish + Demo Prep (Days 7-8)

**Goal:** Demo-ready application with fallbacks

| Task | Time Est. | Output |
|------|-----------|--------|
| Session auto-renewal for 2-min limit | 2 hours | Seamless reconnection |
| Error handling and fallbacks | 2 hours | Graceful degradation |
| UI polish and responsive design | 2 hours | Looks professional |
| Record demo video (multiple takes) | 4 hours | 3-minute video |
| Write submission description | 1 hour | ~200 words |
| Deploy to Vercel | 1 hour | Public URL |

**Checkpoint:** Demo video recorded, submission ready.

---

### Contingency Buffer: 2-3 Days

For: API issues, unexpected bugs, demo re-recordings

---

## 8. Demo Script

### 8.1 Demo Flow (3 Minutes Total)

**[0:00 - 0:15] HOOK - Safety Save Live**

*Camera shows: Workshop setup with laser cutter/power tool visible*

NARRATOR: "Before, not after."

*Reaches toward tool without safety glasses*

WORKSHOPCOPILOT: "Hold on - I don't see safety glasses, and you're reaching toward the laser cutter. Let's fix that first."

NARRATOR: "That warning just saved my hand. ChatGPT couldn't have done that - because ChatGPT can't see what's happening right now."

---

**[0:15 - 0:35] THE PROBLEM**

NARRATOR: "30,000 Americans lose fingers to table saws every year. Most were working alone. By the time they could upload a photo, they'd already be bleeding."

*Shows the WorkshopCopilot UI - webcam feed with MONITORING indicator*

NARRATOR: "Home makers work alone - late at night, no one watching. One slip, no one there to stop them."

---

**[0:35 - 0:55] WHY GEMINI LIVE**

NARRATOR: "This is only possible because of Gemini Live API."

*Shows side-by-side comparison graphic:*
- ChatGPT: Static photo upload -> Wait -> Response
- WorkshopCopilot: Continuous video -> Proactive warning

NARRATOR: "Continuous 1 FPS video streaming. Proactive AI that decides when to speak. Sub-second response time. This isn't a chatbot with a camera - it's an AI that watches and intervenes."

---

**[0:55 - 1:40] DEMO 2 - Visual Troubleshooter**

*Holds up a 3D print with visible defects*

NARRATOR: "But safety is just half of it. When something goes wrong, you need answers."

*Presses voice button*

USER: "Hey, what went wrong with this print?"

WORKSHOPCOPILOT: "I can see layer separation starting around the 30% mark, and there's stringing between the towers. This usually means heat creep - your hotend is getting too warm. Try reducing your printing temperature by 5 degrees and adding more part cooling."

NARRATOR: "No uploading. No typing. I just showed it the problem. This is hands-free troubleshooting."

---

**[1:40 - 2:15] DEMO 3 - Material Intelligence**

*Holds up an unlabeled piece of material*

USER: "I found this in the scrap bin. What is it and what settings should I use?"

WORKSHOPCOPILOT: "That looks like 3mm Baltic birch plywood based on the edge grain layers. For your laser cutter, I'd suggest 15mm/s speed at 80% power. Do a test cut in the corner first."

NARRATOR: "Material identification plus machine-specific settings. No looking up charts. No forum posts. Just answers."

---

**[2:15 - 2:45] TECHNICAL DEPTH + IMPACT**

NARRATOR: "WorkshopCopilot uses Gemini Live API's native audio model with proactive audio enabled. Continuous video at 1 frame per second, with voice responses in under a second."

*Shows architecture diagram briefly*

NARRATOR: "Every year, makers work alone and get hurt alone. WorkshopCopilot is the experienced friend watching over your shoulder - available 24/7."

---

**[2:45 - 3:00] CLOSE**

*Shows safety monitoring UI, "MONITORING" indicator pulsing*

NARRATOR: "ChatGPT sees photos after you upload them. WorkshopCopilot sees danger before you complete the action. Your 24/7 shop mentor."

*Logo and tagline:*
**WorkshopCopilot - Before, not after.**

---

### 8.2 Demo Props Needed

| Item | Purpose | Notes |
|------|---------|-------|
| Safety glasses | Safety demo - put them on after warning | Clear lenses work best on camera |
| Failed 3D print | Troubleshooter demo | Needs visible defects: layer separation, stringing |
| Scrap plywood piece | Material ID demo | Unlabeled, 3mm with visible edge grain |
| Webcam | Primary video feed | Good quality, stable mount |
| Laser cutter OR table saw | Background equipment for safety context | Can be non-operational for demo |
| Workshop setting | Credibility | Garage/makerspace background |

### 8.3 Demo Fallback Plan

**If Gemini connection fails:**
- Pre-recorded backup video ready to play
- Narrative explains "let me show you a recording from earlier"

**If audio doesn't work:**
- Text-to-speech local fallback with pre-written responses
- Captions on screen

**If video capture fails:**
- Still images sent at intervals
- Explain "connection quality is reduced" and continue

---

## 9. Risk Assessment

### 9.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **2-minute session limit** | High | High | Auto-reconnect with 110-second timer; practice seamless renewal |
| **Gemini API rate limits** | Medium | High | Monitor usage; have backup API key; reduce frame rate if needed |
| **Proactive audio not triggering** | Medium | Critical | Extensive prompt tuning; fallback to reactive-only mode |
| **Audio latency too high** | Low | High | Use native audio model; optimize audio buffer sizes |
| **WebSocket disconnects** | Medium | Medium | Exponential backoff reconnection; status indicator for user |
| **Browser compatibility** | Low | Medium | Test on Chrome first; document known issues |

### 9.2 Time Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Scope creep** | High | High | P0 features only; say no to new ideas until P0 complete |
| **API learning curve** | Medium | Medium | Start with Google's sample code; use AI Studio for testing |
| **Demo recording takes longer** | High | Medium | Start recording day 7; allow full day for multiple takes |
| **Deployment issues** | Low | Medium | Deploy early (day 5); fix issues before final push |

### 9.3 Demo Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Live demo fails during recording** | Medium | High | Record in segments; have backup takes ready |
| **Safety detection inconsistent** | Medium | High | Pre-test exact demo scenarios 10+ times; use consistent lighting |
| **Audio not clear in video** | Medium | Medium | Use external mic; add captions to video |
| **Workshop background noise** | Medium | Low | Record in quiet time; noise cancellation in post |

---

## 10. Environment Setup

### 10.1 Prerequisites

```bash
# Required software
Node.js 18+
npm or yarn
Git
Modern web browser (Chrome recommended)
Webcam
Microphone
```

### 10.2 API Keys

**Gemini API Key:**
1. Go to https://aistudio.google.com/
2. Click "Get API Key"
3. Create a new key or use existing
4. Copy key to `.env.local`

```bash
# .env.local
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

**Note:** For hackathon, client-side API key is acceptable. Production would need backend token service.

### 10.3 Project Setup

```bash
# Clone/create project
npx create-next-app@latest workshop-copilot --typescript --tailwind --eslint --app

cd workshop-copilot

# Create env file
cp .env.example .env.local
# Edit .env.local with your API key

# Start development server
npm run dev

# Open https://localhost:3000
# Note: HTTPS required for camera access in some browsers
```

### 10.4 Development Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

### 10.5 Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variable in Vercel dashboard
# NEXT_PUBLIC_GEMINI_API_KEY = your_key
```

---

## 11. Submission Checklist

### 11.1 Required Deliverables

| Item | Status | Notes |
|------|--------|-------|
| [ ] Working demo or interactive prototype | | Vercel deployment URL |
| [ ] Public code repository OR AI Studio link | | GitHub repo link |
| [ ] 3-minute demo video | | YouTube/Vimeo link |
| [ ] ~200 word Gemini integration description | | See below |
| [ ] Project must be NEW (created during contest) | | Git history proves this |

### 11.2 Gemini Integration Description (~200 words)

> WorkshopCopilot uses the Gemini Live API's native audio model (gemini-2.5-flash-native-audio-preview) with proactive audio enabled to create a real-time workshop safety monitor and troubleshooting assistant.
>
> **How Gemini 3 is Central:**
> - **Continuous Video Streaming:** We send 1 FPS video frames via WebSocket to maintain persistent awareness of the physical workspace
> - **Proactive Audio:** The key differentiator - Gemini decides WHEN to speak without waiting for user prompts, enabling safety intervention before dangerous actions complete
> - **Native Audio Output:** Sub-second voice responses for natural, hands-free interaction while users work with tools
> - **Multimodal Understanding:** Gemini analyzes video frames to detect safety hazards (missing PPE, dangerous hand positions) and diagnose physical problems (3D print failures, material identification)
>
> **Why This Requires Gemini Live:**
> Traditional vision APIs use request-response: upload photo, wait, get analysis. WorkshopCopilot requires continuous monitoring with proactive intervention - impossible without Gemini Live's streaming video + proactive audio architecture.
>
> The combination of real-time video understanding, proactive voice initiation, and low-latency audio response creates something that didn't exist before: an AI that watches your workshop and speaks up before you complete a dangerous action.

### 11.3 Pre-Submission Testing

| Test | Pass/Fail |
|------|-----------|
| [ ] Demo video plays correctly on YouTube/Vimeo |
| [ ] Deployment URL loads and works |
| [ ] GitHub repo is public and accessible |
| [ ] All demo scenarios work on deployed version |
| [ ] Video is under 3 minutes |
| [ ] English audio/subtitles in video |

---

## Appendix A: API Reference Quick Sheet

### WebSocket Endpoint
```
wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent
```

### Authentication Header
```
x-goog-api-key: YOUR_API_KEY
```

### Proactive Audio Config
```javascript
proactivity: {
  proactiveAudio: true
}
```

### Voice Options
- Puck, Charon, Kore, Fenrir, Aoede (Kore recommended for calm, clear)

---

## Appendix B: Troubleshooting Guide

| Issue | Solution |
|-------|----------|
| No audio output | Check browser audio permissions; ensure AudioContext is resumed after user interaction |
| Webcam not showing | Check browser permissions; ensure HTTPS; try different browser |
| WebSocket disconnects | Check API key; implement reconnection logic; reduce frame rate |
| AI not speaking proactively | Verify proactiveAudio: true in config; check system prompt; ensure v1alpha API version |
| High latency | Reduce video resolution; check network; use closer server region |
| Session expires | Implement auto-renewal at 110 seconds; handle setupComplete on reconnect |

---

*End of Product Specification v1*
