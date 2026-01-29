# WorkshopCopilot Product Specification v2

**Product:** WorkshopCopilot - "Your 24/7 Shop Mentor"
**Version:** 2.0
**Date:** January 15, 2026
**Target:** Google DeepMind Gemini 3 Hackathon
**Submission Deadline:** February 9, 2026, 5:00 PM PT

**Revision Notes:** This v2 addresses critical issues identified in critic review:
1. Fixed session management with context window compression + session resumption
2. Fixed audio playback code for raw 16-bit PCM
3. Added v1alpha API version requirement for proactive audio
4. Added proactive audio testing plan
5. Clarified demo scope (2 core + 1 stretch)

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
9. [Proactive Audio Testing Plan](#9-proactive-audio-testing-plan)
10. [Risk Assessment](#10-risk-assessment)
11. [Environment Setup](#11-environment-setup)
12. [Submission Checklist](#12-submission-checklist)

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
| **Demo Reliability** | 100% success rate on 2 core demo scenarios | Demo rehearsal testing |
| **Session Stability** | Unlimited duration with context preservation | Context compression monitoring |

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
|  - Session Token |
|  - Resumption ID |
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
7. Context compressed automatically via slidingWindow
8. Loop continues indefinitely (no 2-minute limit with compression)
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
| **AudioIO** | Microphone input, speaker output (raw PCM) | Web Audio API |
| **WebSocketManager** | Connection lifecycle, message handling | Native WebSocket |
| **GeminiClient** | API message formatting, response parsing | Custom wrapper |
| **SessionManager** | Context compression, session resumption | Token storage |
| **StateManager** | Mode toggle, session state, history | React useState/Context |
| **UI Components** | Video preview, status indicators, controls | React + Tailwind |

---

## 3. Gemini Live API Integration

### 3.1 API Configuration

**Model:** `gemini-2.5-flash-native-audio-preview-12-2025`

**CRITICAL: API Version for Proactive Audio**

Proactive audio requires the `v1alpha` API version. This must be specified either:
- In the client library httpOptions
- In the WebSocket URL path

**Session Configuration (CORRECTED):**
```javascript
// CRITICAL: Use v1alpha for proactive audio features
const ai = new GoogleGenAI({
  apiKey: API_KEY,
  httpOptions: { apiVersion: "v1alpha" }
});

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
  // CRITICAL: Enables AI-initiated speech
  proactivity: {
    proactiveAudio: true
  },
  // CRITICAL: Enables unlimited session duration
  contextWindowCompression: {
    slidingWindow: {}  // Uses default compression behavior
  },
  // CRITICAL: Enables session recovery on disconnect
  sessionResumption: {}  // Server will send resumption tokens
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

### 3.3 WebSocket Connection

**CRITICAL: WebSocket URL Format**

For proactive audio to work, use the v1alpha endpoint:

```javascript
// CORRECT: v1alpha endpoint for proactive audio
const WS_URL = "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent";

// Full connection URL with API key
const connectionUrl = `${WS_URL}?key=${API_KEY}`;
```

**Note:** The standard v1beta endpoint does NOT support proactive audio.

### 3.4 WebSocket Message Types

**Client to Server:**

```javascript
// Setup message (first message after connection)
{
  "setup": {
    "model": "models/gemini-2.5-flash-native-audio-preview-12-2025",
    "generationConfig": {
      "responseModalities": ["AUDIO"],
      "speechConfig": {
        "voiceConfig": {
          "prebuiltVoiceConfig": { "voiceName": "Kore" }
        }
      }
    },
    "systemInstruction": { "parts": [{ "text": "..." }] },
    "proactivity": { "proactiveAudio": true },
    "contextWindowCompression": { "slidingWindow": {} },
    "sessionResumption": {}
  }
}

// Resume session (if reconnecting)
{
  "setup": {
    "model": "models/gemini-2.5-flash-native-audio-preview-12-2025",
    // ... same config as above ...
    "sessionResumption": {
      "handle": "<resumption-token-from-previous-session>"
    }
  }
}

// Realtime input (audio/video frames)
{
  "realtimeInput": {
    "mediaChunks": [
      {
        "mimeType": "image/jpeg",
        "data": "<base64-encoded-data>"
      }
    ]
  }
}

// Audio input with sample rate
{
  "realtimeInput": {
    "mediaChunks": [
      {
        "mimeType": "audio/pcm;rate=16000",
        "data": "<base64-encoded-pcm-data>"
      }
    ]
  }
}
```

**Server to Client:**

```javascript
// Setup complete
{
  "setupComplete": {}
}

// Session resumption update (store this token!)
{
  "sessionResumptionUpdate": {
    "newHandle": "<resumption-token>",
    "resumable": true
  }
}

// Server content (model response with audio)
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
    "turnComplete": true
  }
}

// GoAway message (server requesting graceful disconnect)
{
  "goAway": {}
}
```

### 3.5 Audio Specifications

| Parameter | Value | Notes |
|-----------|-------|-------|
| **Input Audio Format** | 16-bit PCM, little-endian | Raw samples, no header |
| **Input Sample Rate** | 16,000 Hz | Specify in MIME type: `audio/pcm;rate=16000` |
| **Input Channels** | Mono | Single channel |
| **Output Audio Format** | 16-bit PCM, little-endian | Raw samples, no header |
| **Output Sample Rate** | 24,000 Hz | Always 24kHz from Gemini |
| **Output Channels** | Mono | Single channel |

### 3.6 Audio Playback Implementation (CORRECTED)

**CRITICAL FIX:** Gemini returns raw 16-bit PCM audio, NOT encoded audio (MP3, WAV). The `decodeAudioData()` method expects encoded formats and will fail with raw PCM.

```typescript
/**
 * Correct implementation for playing raw PCM audio from Gemini Live API
 * Audio is 16-bit PCM, little-endian, mono, 24kHz
 */
class PCMAudioPlayer {
  private audioContext: AudioContext | null = null;
  private audioQueue: Float32Array[] = [];
  private isPlaying: boolean = false;
  private nextStartTime: number = 0;

  constructor() {
    // AudioContext must be created after user interaction
  }

  /**
   * Initialize audio context (call after user clicks something)
   */
  initialize(): void {
    if (!this.audioContext) {
      // CRITICAL: Sample rate must be 24000 to match Gemini output
      this.audioContext = new AudioContext({ sampleRate: 24000 });
    }
  }

  /**
   * Resume audio context (required after user interaction)
   */
  async resume(): Promise<void> {
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  /**
   * Play raw PCM audio from Gemini
   * @param base64Audio - Base64 encoded 16-bit PCM audio from Gemini
   */
  playPCMAudio(base64Audio: string): void {
    if (!this.audioContext) {
      console.error('AudioContext not initialized. Call initialize() first.');
      return;
    }

    // Step 1: Decode base64 to binary
    const binaryString = atob(base64Audio);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Step 2: Convert bytes to Int16Array (16-bit PCM, little-endian)
    const int16Array = new Int16Array(bytes.buffer);

    // Step 3: Convert Int16 to Float32 for Web Audio API
    // Web Audio API requires samples in -1.0 to 1.0 range
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      // Normalize 16-bit signed integer to float: divide by 32768 (2^15)
      float32Array[i] = int16Array[i] / 32768.0;
    }

    // Step 4: Create AudioBuffer
    const audioBuffer = this.audioContext.createBuffer(
      1,                      // mono (1 channel)
      float32Array.length,    // number of samples
      24000                   // sample rate (Gemini outputs 24kHz)
    );

    // Step 5: Copy data to the buffer
    audioBuffer.getChannelData(0).set(float32Array);

    // Step 6: Create source node and play
    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);

    // Schedule playback (handles queuing for smooth streaming)
    const startTime = Math.max(
      this.audioContext.currentTime,
      this.nextStartTime
    );
    source.start(startTime);
    this.nextStartTime = startTime + audioBuffer.duration;
  }

  /**
   * Stop all audio and reset
   */
  stop(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.nextStartTime = 0;
  }
}

// Usage example:
const audioPlayer = new PCMAudioPlayer();

// After user clicks start button:
document.getElementById('startBtn').addEventListener('click', async () => {
  audioPlayer.initialize();
  await audioPlayer.resume();
});

// When receiving audio from Gemini:
websocket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.serverContent?.modelTurn?.parts) {
    for (const part of data.serverContent.modelTurn.parts) {
      if (part.inlineData?.mimeType === 'audio/pcm') {
        audioPlayer.playPCMAudio(part.inlineData.data);
      }
    }
  }
};
```

### 3.7 Session Management Implementation (CORRECTED)

**CRITICAL FIX:** The v1 spec proposed naive reconnection every 110 seconds, which loses ALL context. The correct approach uses context window compression for unlimited sessions and session resumption for disconnect recovery.

```typescript
/**
 * Correct session management with context compression and resumption
 */
class GeminiSessionManager {
  private ws: WebSocket | null = null;
  private resumptionToken: string | null = null;
  private onAudioCallback: ((audioData: string) => void) | null = null;
  private onStatusCallback: ((status: string) => void) | null = null;

  private readonly WS_URL =
    "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent";

  constructor(
    private apiKey: string,
    private systemPrompt: string
  ) {}

  /**
   * Connect to Gemini Live API with proper session management
   */
  async connect(): Promise<void> {
    const url = `${this.WS_URL}?key=${this.apiKey}`;
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this.sendSetupMessage();
      this.onStatusCallback?.('connecting');
    };

    this.ws.onmessage = (event) => {
      this.handleMessage(JSON.parse(event.data));
    };

    this.ws.onclose = (event) => {
      this.onStatusCallback?.('disconnected');
      // Auto-reconnect with resumption token if available
      if (this.resumptionToken && !event.wasClean) {
        console.log('Connection lost, resuming session...');
        setTimeout(() => this.reconnect(), 1000);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.onStatusCallback?.('error');
    };
  }

  /**
   * Send setup message with context compression and session resumption
   */
  private sendSetupMessage(): void {
    const setupMessage = {
      setup: {
        model: "models/gemini-2.5-flash-native-audio-preview-12-2025",
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: "Kore" }
            }
          }
        },
        systemInstruction: {
          parts: [{ text: this.systemPrompt }]
        },
        // CRITICAL: Enable proactive audio
        proactivity: {
          proactiveAudio: true
        },
        // CRITICAL: Enable context compression for unlimited sessions
        contextWindowCompression: {
          slidingWindow: {}
        },
        // CRITICAL: Enable session resumption
        sessionResumption: this.resumptionToken
          ? { handle: this.resumptionToken }
          : {}
      }
    };

    this.ws?.send(JSON.stringify(setupMessage));
  }

  /**
   * Handle incoming messages
   */
  private handleMessage(data: any): void {
    // Handle setup complete
    if (data.setupComplete) {
      this.onStatusCallback?.('connected');
      console.log('Session established');
    }

    // CRITICAL: Store resumption token for recovery
    if (data.sessionResumptionUpdate?.newHandle) {
      this.resumptionToken = data.sessionResumptionUpdate.newHandle;
      console.log('Resumption token updated');
    }

    // Handle audio response
    if (data.serverContent?.modelTurn?.parts) {
      for (const part of data.serverContent.modelTurn.parts) {
        if (part.inlineData?.mimeType === 'audio/pcm') {
          this.onAudioCallback?.(part.inlineData.data);
        }
      }
    }

    // Handle GoAway (server requesting graceful disconnect)
    if (data.goAway) {
      console.log('Server requested disconnect, reconnecting...');
      this.ws?.close();
      setTimeout(() => this.reconnect(), 100);
    }
  }

  /**
   * Reconnect with session resumption
   */
  private async reconnect(): Promise<void> {
    if (this.resumptionToken) {
      console.log('Resuming previous session...');
      await this.connect();
    } else {
      console.log('No resumption token, starting fresh session');
      await this.connect();
    }
  }

  /**
   * Send video frame
   */
  sendVideoFrame(base64Jpeg: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        realtimeInput: {
          mediaChunks: [{
            mimeType: "image/jpeg",
            data: base64Jpeg
          }]
        }
      }));
    }
  }

  /**
   * Send audio input
   */
  sendAudio(base64Pcm: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        realtimeInput: {
          mediaChunks: [{
            mimeType: "audio/pcm;rate=16000",
            data: base64Pcm
          }]
        }
      }));
    }
  }

  /**
   * Register callbacks
   */
  onAudio(callback: (audioData: string) => void): void {
    this.onAudioCallback = callback;
  }

  onStatus(callback: (status: string) => void): void {
    this.onStatusCallback = callback;
  }

  /**
   * Disconnect cleanly
   */
  disconnect(): void {
    this.ws?.close();
    this.ws = null;
  }
}
```

### 3.8 Video Specifications

| Parameter | Value |
|-----------|-------|
| Frame Rate | 1 FPS |
| Format | JPEG (base64 encoded) |
| Resolution | 640x480 recommended |
| Quality | 0.8 JPEG quality |

### 3.9 Session Limits (CORRECTED)

| Limit | Value | Solution |
|-------|-------|----------|
| **Without Compression** | ~2 min (video) / ~15 min (audio only) | N/A - always use compression |
| **With Context Compression** | Unlimited | `contextWindowCompression: { slidingWindow: {} }` |
| **Disconnect Recovery** | 2 hours | Store and reuse `sessionResumptionUpdate.newHandle` |
| **Context Window** | 128k tokens | Auto-compressed by sliding window |

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
- [ ] Proactive audio enabled via v1alpha API - AI initiates speech without user prompt
- [ ] Context compression enabled - session runs indefinitely without context loss
- [ ] Detects and warns about: missing safety glasses, hand near blade/danger zone
- [ ] Warning plays through speakers within 1 second of detection
- [ ] Can be toggled on/off by user

**Demo Scenario:**
User reaches toward laser cutter without safety glasses.
AI: "Hold on - I don't see safety glasses, and you're reaching toward the laser cutter. Let's fix that first."

**Technical Implementation:**
```typescript
// Core monitoring loop with proper session management
const startSafetyMonitor = async () => {
  const sessionManager = new GeminiSessionManager(
    API_KEY,
    SAFETY_SYSTEM_PROMPT
  );

  const audioPlayer = new PCMAudioPlayer();
  audioPlayer.initialize();
  await audioPlayer.resume();

  sessionManager.onAudio((audioData) => {
    audioPlayer.playPCMAudio(audioData);
  });

  sessionManager.onStatus((status) => {
    updateStatusUI(status);
  });

  await sessionManager.connect();

  // Continuous frame capture at 1 FPS
  setInterval(() => {
    const frame = captureVideoFrame();
    sessionManager.sendVideoFrame(frame);
  }, 1000);
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
AI: "I can see layer separation starting around the 30% mark, and there's stringing between the towers. This usually means heat creep - your hotend is getting too warm. Try reducing your printing temperature by 5 degrees and adding more part cooling."

**Technical Implementation:**
```typescript
// Voice query handler
const handleVoiceQuery = async (audioStream: AudioBuffer) => {
  // Convert audio buffer to base64 PCM
  const pcmData = audioBufferToPCM(audioStream);
  const base64Audio = arrayBufferToBase64(pcmData);

  // Send audio + current video frame together
  sessionManager.sendAudio(base64Audio);
  sessionManager.sendVideoFrame(captureVideoFrame());

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
- [ ] AudioContext properly initialized after user interaction

**Technical Implementation:**
See Section 3.6 for the corrected PCMAudioPlayer class.

---

#### P0-4: Session Management

**Description:** Handle Gemini Live API session lifecycle with proper context preservation and disconnect recovery.

**Acceptance Criteria:**
- [ ] Connection established on app load
- [ ] Visual indicator of connection status (Connected/Connecting/Disconnected)
- [ ] Context preserved indefinitely via context window compression
- [ ] Auto-reconnect with session resumption if connection drops
- [ ] Resumption token stored and reused
- [ ] Clean disconnect on app close

**Technical Implementation:**
See Section 3.7 for the corrected GeminiSessionManager class.

---

### 5.2 P1 Features (Nice to Have - NOT in Core Demo)

#### P1-1: Material Identification

**Description:** User shows unknown material, AI identifies it and provides machine-specific settings.

**Acceptance Criteria:**
- [ ] Identifies common materials: woods, plastics, composites
- [ ] Provides laser cutter settings (speed, power) for identified material
- [ ] Provides 3D printer settings if relevant
- [ ] Warns about hazardous materials (PVC, etc.)

**Demo Status:** STRETCH DEMO ONLY - If Safety + Troubleshooter demos work perfectly and there's time, include as bonus. Otherwise, CUT.

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
│   │   │   ├── session.ts       # Session resumption handling
│   │   │   ├── messages.ts      # Message type definitions
│   │   │   └── prompts.ts       # System prompts
│   │   │
│   │   ├── media/
│   │   │   ├── video.ts         # Video capture utilities
│   │   │   └── audio.ts         # PCM audio I/O utilities
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

### Phase 1: Foundation (Days 1-3)

**Goal:** Basic Next.js app with webcam display, Gemini connection, and WORKING audio playback

| Task | Time Est. | Output |
|------|-----------|--------|
| Create Next.js project with TypeScript + Tailwind | 1 hour | Boilerplate running |
| Implement webcam access and display | 2 hours | Video showing in browser |
| Create Gemini WebSocket connection (v1alpha) | 3 hours | Connected to API |
| Implement PCM audio playback (CORRECTED) | 4 hours | Can hear Gemini responses |
| Send test video frame, receive response | 2 hours | End-to-end data flow |

**Checkpoint:** Can see webcam, connect to Gemini, send a frame, hear a response.

**CRITICAL DAY 1 VALIDATION:**
- [ ] Audio plays correctly (not garbled, not silent)
- [ ] v1alpha connection successful
- [ ] Context compression working (check for sessionResumptionUpdate messages)

---

### Phase 2: Safety Monitor (Days 4-5)

**Goal:** Proactive safety monitoring working end-to-end

| Task | Time Est. | Output |
|------|-----------|--------|
| Implement 1 FPS frame capture loop | 1 hour | Continuous capture |
| Verify proactive audio triggers on safety hazards | 4 hours | AI initiates speech |
| Write and tune safety system prompt | 3 hours | Detects hazards reliably |
| Add status indicators UI | 1 hour | User knows system state |
| Test proactive behavior (see Section 9) | 4 hours | Documented behavior |

**Checkpoint:** Can demonstrate safety glasses detection and warning.

---

### Phase 3: Visual Troubleshooter (Days 6-7)

**Goal:** Reactive troubleshooting working end-to-end

| Task | Time Est. | Output |
|------|-----------|--------|
| Implement audio input capture (16kHz PCM) | 2 hours | Can record user voice |
| Create push-to-talk UI | 1 hour | User can trigger query |
| Wire audio + video to query handler | 2 hours | Combined input working |
| Write troubleshooter system prompt | 2 hours | Good diagnoses |
| Test with failed 3D print scenarios | 2 hours | Accurate responses |

**Checkpoint:** Can demonstrate "what went wrong" diagnosis of a failed print.

---

### Phase 4: Polish + Demo Prep (Days 8-10)

**Goal:** Demo-ready application with fallbacks

| Task | Time Est. | Output |
|------|-----------|--------|
| Error handling and fallbacks | 2 hours | Graceful degradation |
| UI polish and responsive design | 2 hours | Looks professional |
| Test session resumption on disconnect | 2 hours | Recovery works |
| Record demo video (multiple takes) | 6 hours | 3-minute video |
| Write submission description | 1 hour | ~200 words |
| Deploy to Vercel | 1 hour | Public URL |

**Checkpoint:** Demo video recorded, submission ready.

---

### Contingency Buffer: 2-3 Days

For: API issues, unexpected bugs, demo re-recordings, proactive audio tuning

---

## 8. Demo Script

### 8.1 Demo Flow (3 Minutes Total)

**CRITICAL: 2 Core Demos + 1 Stretch**

| Demo | Priority | Time Allocated | Cut if needed? |
|------|----------|----------------|----------------|
| Safety Save | P0 CORE | 0:00 - 1:15 | NEVER |
| Visual Troubleshooter | P0 CORE | 1:15 - 2:30 | NEVER |
| Material ID | P1 STRETCH | 2:30 - 2:50 | YES - first to cut |
| Close | Required | 2:50 - 3:00 | Shorten if needed |

---

**[0:00 - 0:15] HOOK - Safety Save Live**

*Camera shows: Workshop setup with laser cutter/power tool visible*

NARRATOR: "Before, not after."

*Reaches toward tool without safety glasses*

WORKSHOPCOPILOT: "Hold on - I don't see safety glasses, and you're reaching toward the laser cutter. Let's fix that first."

NARRATOR: "That warning just saved my hand. ChatGPT couldn't have done that - because ChatGPT can't see what's happening right now."

---

**[0:15 - 0:45] THE PROBLEM**

NARRATOR: "30,000 Americans lose fingers to table saws every year. Most were working alone. By the time they could upload a photo, they'd already be bleeding."

*Shows the WorkshopCopilot UI - webcam feed with MONITORING indicator*

NARRATOR: "Home makers work alone - late at night, no one watching. One slip, no one there to stop them."

---

**[0:45 - 1:15] WHY GEMINI LIVE**

NARRATOR: "This is only possible because of Gemini Live API."

*Shows side-by-side comparison graphic:*
- ChatGPT: Static photo upload -> Wait -> Response
- WorkshopCopilot: Continuous video -> Proactive warning

NARRATOR: "Continuous 1 FPS video streaming. Proactive AI that decides when to speak. Sub-second response time. This isn't a chatbot with a camera - it's an AI that watches and intervenes."

---

**[1:15 - 2:30] DEMO 2 - Visual Troubleshooter**

*Holds up a 3D print with visible defects*

NARRATOR: "But safety is just half of it. When something goes wrong, you need answers."

*Presses voice button*

USER: "Hey, what went wrong with this print?"

WORKSHOPCOPILOT: "I can see layer separation starting around the 30% mark, and there's stringing between the towers. This usually means heat creep - your hotend is getting too warm. Try reducing your printing temperature by 5 degrees and adding more part cooling."

NARRATOR: "No uploading. No typing. I just showed it the problem. This is hands-free troubleshooting."

---

**[2:30 - 2:50] STRETCH DEMO 3 - Material Intelligence (OPTIONAL)**

**IF TIME AND WORKING:** Include this demo.
**IF BEHIND OR RISKY:** Skip directly to close.

*Holds up an unlabeled piece of material*

USER: "I found this in the scrap bin. What is it and what settings should I use?"

WORKSHOPCOPILOT: "That looks like 3mm Baltic birch plywood based on the edge grain layers. For your laser cutter, I'd suggest 15mm/s speed at 80% power. Do a test cut in the corner first."

---

**[2:50 - 3:00] CLOSE**

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
| Scrap plywood piece | Material ID demo (STRETCH) | Only if Demo 3 included |
| Webcam | Primary video feed | Good quality, stable mount |
| Laser cutter OR table saw | Background equipment for safety context | Can be non-operational for demo |
| Workshop setting | Credibility | Garage/makerspace background |

### 8.3 Demo Fallback Plan

**If proactive audio doesn't trigger on safety hazard:**
- Use manual trigger button as backup
- Edit video to use a take where it worked

**If Gemini connection fails:**
- Pre-recorded backup video ready to play
- Narrative explains "let me show you a recording from earlier"

**If audio doesn't work:**
- Show text transcription on screen
- Add captions to video

**If Material ID demo is flaky:**
- Cut it from demo - 2 core demos are enough to win

**Recording strategy:**
- Record 5+ takes of each demo segment
- Edit together best takes
- Have "clean" fallback takes ready

---

## 9. Proactive Audio Testing Plan

**CRITICAL:** The success of this project depends on proactive audio triggering reliably on safety hazards. This behavior is not guaranteed and must be tested extensively before committing.

### 9.1 Testing Goals

1. **Understand trigger conditions:** What causes Gemini to speak proactively?
2. **Measure reliability:** What % of hazard presentations trigger a warning?
3. **Identify false positives:** When does it speak when it shouldn't?
4. **Document latency:** How long from hazard to warning?

### 9.2 Test Scenarios

| Scenario | Expected Behavior | Test Count | Pass Criteria |
|----------|-------------------|------------|---------------|
| **No safety glasses + reaching toward tool** | Immediate warning | 20 tests | >90% trigger |
| **Hand near blade (simulated)** | Immediate warning | 20 tests | >90% trigger |
| **Safety glasses ON + reaching toward tool** | No warning (or compliment) | 10 tests | <10% trigger |
| **Normal activity (walking, standing)** | No warning | 10 tests | 0% trigger |
| **Picking up object from table** | No warning | 10 tests | <5% trigger |

### 9.3 Testing Protocol

```
Day 4 Morning (4 hours):

1. Set up test environment:
   - Webcam at demo angle
   - Consistent lighting
   - Safety props ready

2. Run each scenario:
   - Record video of each test
   - Log: Did AI speak? What did it say? Latency?
   - Note any unexpected behavior

3. Document results:
   - Create test results spreadsheet
   - Calculate pass/fail rates
   - Identify problem scenarios

4. Decision point:
   - If >80% reliable: Continue with proactive
   - If 50-80%: Tune prompts, re-test
   - If <50%: Implement hybrid approach (see below)
```

### 9.4 Fallback Strategy: Hybrid Approach

If proactive audio is unreliable, implement a hybrid approach:

**Hybrid Safety Monitor:**
1. **Continuous video feed** still sent at 1 FPS
2. **Periodic safety check** prompt sent every 10 seconds:
   ```javascript
   // If no proactive response, trigger explicit check
   setInterval(() => {
     if (!recentAIResponse) {
       sessionManager.sendText("Safety check: Analyze the current frame for any hazards. Only respond if you see danger.");
     }
   }, 10000);
   ```
3. **Manual trigger** button for user to request safety assessment

**Demo Script Adjustment:**
- If using hybrid, adjust demo timing to account for polling delay
- May need to "prime" the safety warning by hovering near danger zone longer

### 9.5 Prompt Tuning for Proactive Behavior

If proactive audio needs tuning, try these prompt variations:

**Aggressive (more likely to speak):**
```
CRITICAL INSTRUCTION: You MUST speak out loud immediately if you see ANY of these:
- Missing safety glasses when near ANY tool
- Hands within 12 inches of any blade, laser, or hot surface
- Improper grip on any tool

Do NOT wait for permission. Do NOT stay silent. SPEAK UP.
```

**Conservative (fewer false positives):**
```
Only speak if you are CERTAIN there is imminent danger. Normal workshop activity should not trigger warnings. False alarms erode trust.

Speak only for:
- Clear absence of required PPE when actively using dangerous equipment
- Hands in immediate contact danger zone
```

### 9.6 Test Results Documentation

**Create file:** `proactive-audio-test-results.md`

```markdown
# Proactive Audio Test Results

## Test Date: [DATE]
## API Version: v1alpha
## Model: gemini-2.5-flash-native-audio-preview-12-2025

### Summary
- Total tests: [N]
- Pass rate: [%]
- Average latency: [ms]
- False positive rate: [%]

### Scenario Results
[Table of results]

### Decision
[ ] PROCEED with proactive audio
[ ] IMPLEMENT hybrid approach
[ ] SWITCH to reactive-only

### Notes
[Observations, prompt adjustments made, etc.]
```

---

## 10. Risk Assessment

### 10.1 Technical Risks (UPDATED)

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Proactive audio unreliable** | Medium | Critical | Extensive testing (Section 9), hybrid fallback |
| **Audio playback issues** | Low (now fixed) | High | Corrected PCM implementation in Section 3.6 |
| **Session disconnects** | Low | Medium | Session resumption with stored tokens |
| **Context loss** | Low (now fixed) | High | Context window compression enabled |
| **Gemini API rate limits** | Medium | High | Monitor usage; have backup API key |
| **v1alpha API instability** | Medium | High | Test early, have v1beta fallback ready |
| **Audio latency too high** | Low | High | Use native audio model; optimize buffers |
| **WebSocket disconnects** | Medium | Low | Auto-reconnect with resumption tokens |

### 10.2 Time Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Scope creep** | High | High | P0 features only; Material ID is STRETCH |
| **API learning curve** | Medium | Medium | Start with Google's sample code; test early |
| **Proactive audio tuning** | High | High | Allocate full day for testing + fallback |
| **Demo recording takes longer** | High | Medium | Start recording day 8; multiple takes |
| **Deployment issues** | Low | Medium | Deploy early (day 7) |

### 10.3 Demo Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Proactive audio doesn't trigger** | Medium | Critical | Manual trigger fallback; multiple takes |
| **Safety detection inconsistent** | Medium | High | Extensive pre-testing; consistent lighting |
| **Audio not clear in video** | Medium | Medium | External mic; captions in video |
| **Wrong diagnosis given** | Low | Medium | Pre-test exact props; edit best takes |

---

## 11. Environment Setup

### 11.1 Prerequisites

```bash
# Required software
Node.js 18+
npm or yarn
Git
Modern web browser (Chrome recommended)
Webcam
Microphone
```

### 11.2 API Keys

**Gemini API Key:**
1. Go to https://aistudio.google.com/
2. Click "Get API Key"
3. Create a new key or use existing
4. Copy key to `.env.local`

```bash
# .env.local
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

**Note:** For hackathon, client-side API key is acceptable. Production would need backend token service with ephemeral tokens.

### 11.3 Project Setup

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

### 11.4 Development Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

### 11.5 Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variable in Vercel dashboard
# NEXT_PUBLIC_GEMINI_API_KEY = your_key
```

---

## 12. Submission Checklist

### 12.1 Required Deliverables

| Item | Status | Notes |
|------|--------|-------|
| [ ] Working demo or interactive prototype | | Vercel deployment URL |
| [ ] Public code repository OR AI Studio link | | GitHub repo link |
| [ ] 3-minute demo video | | YouTube/Vimeo link |
| [ ] ~200 word Gemini integration description | | See below |
| [ ] Project must be NEW (created during contest) | | Git history proves this |

### 12.2 Gemini Integration Description (~200 words)

> WorkshopCopilot uses the Gemini Live API's native audio model (gemini-2.5-flash-native-audio-preview) with proactive audio enabled to create a real-time workshop safety monitor and troubleshooting assistant.
>
> **How Gemini 3 is Central:**
> - **Continuous Video Streaming:** We send 1 FPS video frames via WebSocket to maintain persistent awareness of the physical workspace
> - **Proactive Audio (v1alpha):** The key differentiator - Gemini decides WHEN to speak without waiting for user prompts, enabling safety intervention before dangerous actions complete
> - **Context Window Compression:** Enables unlimited session duration by automatically compressing context, maintaining awareness across the entire workshop session
> - **Native Audio Output:** Sub-second voice responses for natural, hands-free interaction while users work with tools
> - **Multimodal Understanding:** Gemini analyzes video frames to detect safety hazards (missing PPE, dangerous hand positions) and diagnose physical problems (3D print failures, material identification)
>
> **Why This Requires Gemini Live:**
> Traditional vision APIs use request-response: upload photo, wait, get analysis. WorkshopCopilot requires continuous monitoring with proactive intervention - impossible without Gemini Live's streaming video + proactive audio architecture.
>
> The combination of real-time video understanding, proactive voice initiation, and low-latency audio response creates something that didn't exist before: an AI that watches your workshop and speaks up before you complete a dangerous action.

### 12.3 Pre-Submission Testing

| Test | Pass/Fail |
|------|-----------|
| [ ] Demo video plays correctly on YouTube/Vimeo |
| [ ] Deployment URL loads and works |
| [ ] GitHub repo is public and accessible |
| [ ] Safety demo scenario works on deployed version |
| [ ] Troubleshooter demo scenario works on deployed version |
| [ ] Video is under 3 minutes |
| [ ] English audio/subtitles in video |

---

## Appendix A: API Reference Quick Sheet

### WebSocket Endpoint (v1alpha for Proactive Audio)
```
wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent
```

### Authentication
```
URL: ...?key=YOUR_API_KEY
```

### Full Setup Configuration
```javascript
{
  setup: {
    model: "models/gemini-2.5-flash-native-audio-preview-12-2025",
    generationConfig: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: "Kore" }
        }
      }
    },
    systemInstruction: { parts: [{ text: "..." }] },
    proactivity: { proactiveAudio: true },
    contextWindowCompression: { slidingWindow: {} },
    sessionResumption: {}
  }
}
```

### Voice Options
- Puck, Charon, Kore, Fenrir, Aoede (Kore recommended for calm, clear)

### Audio Formats
- Input: 16-bit PCM, 16kHz, mono, MIME: `audio/pcm;rate=16000`
- Output: 16-bit PCM, 24kHz, mono, MIME: `audio/pcm`

---

## Appendix B: Troubleshooting Guide

| Issue | Solution |
|-------|----------|
| No audio output | Check AudioContext initialization; must be after user interaction; verify PCM conversion |
| Garbled audio | Sample rate mismatch; ensure AudioContext is 24000Hz; check Int16 to Float32 conversion |
| Webcam not showing | Check browser permissions; ensure HTTPS; try different browser |
| WebSocket disconnects | Check API key; verify v1alpha URL; check for GoAway messages |
| AI not speaking proactively | Verify v1alpha endpoint; check proactivity config; run test plan |
| Session expires | Verify contextWindowCompression is set; check for sessionResumptionUpdate messages |
| High latency | Reduce video resolution; check network; optimize audio buffer scheduling |
| Context seems lost | Check that sessionResumption token is being stored and reused |

---

## Appendix C: Key Changes from v1

| Area | v1 (Broken) | v2 (Fixed) |
|------|-------------|------------|
| **Session Management** | Naive reconnect every 110s, loses context | Context compression + session resumption |
| **Audio Playback** | `decodeAudioData()` (wrong for PCM) | Manual PCM to Float32 conversion |
| **API Version** | Not specified | v1alpha required for proactive audio |
| **WebSocket URL** | v1beta | v1alpha |
| **Demo Scope** | 3 demos (Safety, Troubleshoot, Material) | 2 core (Safety, Troubleshoot) + 1 stretch |
| **Testing** | None specified | Full proactive audio test plan |

---

## References

- [Gemini Live API Session Management](https://ai.google.dev/gemini-api/docs/live-session)
- [Gemini Live API Capabilities Guide](https://ai.google.dev/gemini-api/docs/live-guide)
- [Gemini Live API WebSocket Reference](https://ai.google.dev/api/live)
- [Google Gemini Live API Web Console (GitHub)](https://github.com/google-gemini/live-api-web-console)

---

*End of Product Specification v2*
