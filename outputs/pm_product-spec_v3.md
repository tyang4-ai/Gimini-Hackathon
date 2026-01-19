# WorkshopCopilot Product Specification v3

**Product:** WorkshopCopilot - "Your 24/7 Shop Mentor"
**Version:** 3.0
**Date:** January 15, 2026
**Target:** Google DeepMind Gemini 3 Hackathon
**Submission Deadline:** February 9, 2026, 5:00 PM PT

**Revision Notes:** This v3 addresses architecture and performance improvements:
1. Changed to Python backend + React frontend architecture (better Gemini SDK support)
2. Increased frame rate from 1 FPS to 15 FPS for real-time safety detection
3. Updated folder structure for separate frontend/backend
4. Updated development phases for backend setup
5. Preserved all v2 fixes (session management, audio playback, proactive testing)

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
| **Video Processing Rate** | Stable 15 FPS continuous feed | Frame counter |
| **Demo Reliability** | 100% success rate on 2 core demo scenarios | Demo rehearsal testing |
| **Session Stability** | Unlimited duration with context preservation | Context compression monitoring |

---

## 2. Technical Architecture

### 2.1 System Overview

```
+-----------------------------------------------------------------+
|                      FRONTEND (React/Next.js)                   |
|  +-------------+  +-------------+  +-------------------------+  |
|  |   Webcam    |  |  Microphone |  |  Speaker/UI             |  |
|  |   Feed      |  |   Input     |  |     Output              |  |
|  +------+------+  +------+------+  +------------^------------+  |
+---------|-----------------|-----------------------|---------------+
          |                 |                       |
          v                 v                       |
+-----------------------------------------------------------------+
|                    PYTHON BACKEND (FastAPI)                      |
|  +-----------------------------------------------------------+  |
|  |              WebSocket Handler                             |  |
|  |  - Receives video frames from frontend (15 FPS)           |  |
|  |  - Receives audio chunks from frontend                    |  |
|  |  - Forwards to Gemini Live API                            |  |
|  |  - Returns AI responses to frontend                       |  |
|  +-----------------------------------------------------------+  |
|  +-----------------------------------------------------------+  |
|  |              Gemini Live API Client                        |  |
|  |  - Maintains WebSocket to Gemini                          |  |
|  |  - Session management (compression + resumption)          |  |
|  |  - Handles proactive audio responses                      |  |
|  +-----------------------------------------------------------+  |
+-----------------------------------------------------------------+
          |                                      ^
          v                                      |
+-----------------------------------------------------------------+
|                    GEMINI LIVE API                               |
|              (v1alpha for proactive audio)                       |
+-----------------------------------------------------------------+
```

### 2.2 Architecture Decision: Python Backend + Frontend

**Decision:** Python backend (FastAPI) with React frontend, communicating via WebSocket

**Rationale:**
1. **Best SDK Support:** Python has the most mature google-genai SDK with full Live API support
2. **Familiar Stack:** Python is well-known for AI/ML work, easier to debug and extend
3. **Secure API Keys:** API key stays on backend, never exposed to browser
4. **Better Audio Processing:** Python has robust libraries for audio encoding/decoding
5. **Production Ready:** Easier to add features like logging, rate limiting, caching

**Trade-offs:**
- Additional deployment complexity (two services instead of one)
- Extra network hop (frontend -> backend -> Gemini) adds ~10-50ms latency
- For hackathon: Acceptable trade-off for SDK reliability

### 2.3 Data Flow

**Continuous Monitoring Mode (Safety Monitor):**
```
1. Webcam captures frame (15 FPS - every ~67ms)
2. Frame encoded to base64 JPEG in browser
3. Sent via WebSocket to Python backend
4. Backend forwards to Gemini Live API
5. Gemini analyzes frame (samples at ~1 FPS internally)
6. If hazard detected: Proactive audio response generated
7. Audio streamed back through backend to frontend
8. Audio played immediately in browser
9. Context compressed automatically via slidingWindow
10. Loop continues indefinitely (no 2-minute limit with compression)
```

**Why 15 FPS when Gemini samples at 1 FPS?**
Gemini Live internally processes video at approximately 1 FPS. However, sending 15 FPS ensures:
- Gemini always has the **most recent** frame when it samples
- If something dangerous happens, worst-case wait is ~67ms, not 1 second
- Smoother preview video in the frontend UI
- Safety-critical: we want the latest frame, not a stale one

**Reactive Mode (Visual Troubleshooter):**
```
1. User speaks: "What's wrong with this print?"
2. Audio captured in browser, sent to backend
3. Current video frame(s) sent alongside
4. Backend forwards both to Gemini
5. Gemini analyzes visual + audio query
6. Diagnostic audio response generated
7. Response streamed through backend to frontend
8. Response played in browser
```

### 2.4 Component Breakdown

| Component | Location | Responsibility | Technology |
|-----------|----------|---------------|------------|
| **VideoCapture** | Frontend | Webcam access, frame extraction at 15 FPS | MediaDevices API |
| **AudioIO** | Frontend | Microphone input, speaker output | Web Audio API |
| **FrontendWebSocket** | Frontend | Connection to backend | Native WebSocket |
| **UIComponents** | Frontend | Video preview, status, controls | React + Tailwind |
| **BackendWebSocket** | Backend | Client connections, message routing | FastAPI + websockets |
| **GeminiClient** | Backend | Gemini Live API connection | google-genai SDK |
| **SessionManager** | Backend | Context compression, session resumption | Token storage |
| **AudioProcessor** | Backend | Audio format conversion | Python audio libs |

---

## 3. Gemini Live API Integration

### 3.1 API Configuration

**Model:** `gemini-2.5-flash-native-audio-preview-12-2025`

**CRITICAL: API Version for Proactive Audio**

Proactive audio requires the `v1alpha` API version. This must be specified in the client library.

**Python Client Setup (Backend):**
```python
from google import genai
from google.genai import types

# CRITICAL: Use v1alpha for proactive audio features
client = genai.Client(
    api_key=os.environ["GEMINI_API_KEY"],
    http_options={"api_version": "v1alpha"}
)

# Session configuration
config = types.LiveConnectConfig(
    response_modalities=["AUDIO"],
    speech_config=types.SpeechConfig(
        voice_config=types.VoiceConfig(
            prebuilt_voice_config=types.PrebuiltVoiceConfig(
                voice_name="Kore"  # Calm, clear voice for safety
            )
        )
    ),
    system_instruction=types.Content(
        parts=[types.Part(text=SAFETY_SYSTEM_PROMPT)]
    ),
    # CRITICAL: Enables AI-initiated speech
    proactivity=types.ProactivityConfig(
        proactive_audio=True
    ),
    # CRITICAL: Enables unlimited session duration
    context_window_compression=types.ContextWindowCompressionConfig(
        sliding_window=types.SlidingWindow()
    ),
    # CRITICAL: Enables session recovery on disconnect
    session_resumption=types.SessionResumptionConfig()
)
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
- Continuous 15 FPS video feed (you sample at ~1 FPS but always get fresh frames)

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

### 3.3 Python Backend Gemini Client

```python
"""
Gemini Live API client wrapper for WorkshopCopilot backend
"""
import asyncio
import base64
import os
from typing import Callable, Optional
from google import genai
from google.genai import types

class GeminiLiveClient:
    """Manages connection to Gemini Live API with session management"""

    def __init__(
        self,
        system_prompt: str,
        on_audio_callback: Callable[[bytes], None],
        on_status_callback: Callable[[str], None]
    ):
        self.system_prompt = system_prompt
        self.on_audio = on_audio_callback
        self.on_status = on_status_callback
        self.session = None
        self.resumption_token: Optional[str] = None

        # CRITICAL: Use v1alpha for proactive audio
        self.client = genai.Client(
            api_key=os.environ["GEMINI_API_KEY"],
            http_options={"api_version": "v1alpha"}
        )

    async def connect(self):
        """Establish connection to Gemini Live API"""
        config = types.LiveConnectConfig(
            response_modalities=["AUDIO"],
            speech_config=types.SpeechConfig(
                voice_config=types.VoiceConfig(
                    prebuilt_voice_config=types.PrebuiltVoiceConfig(
                        voice_name="Kore"
                    )
                )
            ),
            system_instruction=types.Content(
                parts=[types.Part(text=self.system_prompt)]
            ),
            proactivity=types.ProactivityConfig(
                proactive_audio=True
            ),
            context_window_compression=types.ContextWindowCompressionConfig(
                sliding_window=types.SlidingWindow()
            ),
            session_resumption=types.SessionResumptionConfig(
                handle=self.resumption_token
            ) if self.resumption_token else types.SessionResumptionConfig()
        )

        self.on_status("connecting")

        async with self.client.aio.live.connect(
            model="gemini-2.5-flash-native-audio-preview-12-2025",
            config=config
        ) as session:
            self.session = session
            self.on_status("connected")

            # Listen for responses
            async for response in session.receive():
                await self._handle_response(response)

    async def _handle_response(self, response):
        """Process incoming messages from Gemini"""
        # Handle session resumption token updates
        if hasattr(response, 'session_resumption_update'):
            if response.session_resumption_update.new_handle:
                self.resumption_token = response.session_resumption_update.new_handle
                print("Resumption token updated")

        # Handle audio responses
        if hasattr(response, 'server_content'):
            if response.server_content.model_turn:
                for part in response.server_content.model_turn.parts:
                    if hasattr(part, 'inline_data'):
                        if part.inline_data.mime_type == "audio/pcm":
                            # Send raw PCM audio to callback
                            audio_bytes = base64.b64decode(part.inline_data.data)
                            self.on_audio(audio_bytes)

        # Handle GoAway (graceful disconnect request)
        if hasattr(response, 'go_away'):
            print("Server requested disconnect, will reconnect...")
            self.on_status("reconnecting")

    async def send_video_frame(self, base64_jpeg: str):
        """Send a video frame to Gemini"""
        if self.session:
            await self.session.send(
                input=types.LiveClientRealtimeInput(
                    media_chunks=[
                        types.Blob(
                            mime_type="image/jpeg",
                            data=base64.b64decode(base64_jpeg)
                        )
                    ]
                )
            )

    async def send_audio(self, base64_pcm: str):
        """Send audio input to Gemini"""
        if self.session:
            await self.session.send(
                input=types.LiveClientRealtimeInput(
                    media_chunks=[
                        types.Blob(
                            mime_type="audio/pcm;rate=16000",
                            data=base64.b64decode(base64_pcm)
                        )
                    ]
                )
            )

    async def disconnect(self):
        """Clean disconnect"""
        if self.session:
            await self.session.close()
            self.session = None
```

### 3.4 Audio Specifications

| Parameter | Value | Notes |
|-----------|-------|-------|
| **Input Audio Format** | 16-bit PCM, little-endian | Raw samples, no header |
| **Input Sample Rate** | 16,000 Hz | Specify in MIME type: `audio/pcm;rate=16000` |
| **Input Channels** | Mono | Single channel |
| **Output Audio Format** | 16-bit PCM, little-endian | Raw samples, no header |
| **Output Sample Rate** | 24,000 Hz | Always 24kHz from Gemini |
| **Output Channels** | Mono | Single channel |

### 3.5 Video Specifications (UPDATED)

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Frame Rate** | 15 FPS | Real-time safety needs latest frames |
| **Format** | JPEG (base64 encoded) | Good compression, wide support |
| **Resolution** | 640x480 | Balance of quality and bandwidth |
| **Quality** | 0.7 JPEG quality | Slightly lower to handle higher FPS |

**Bandwidth Calculation:**
- 15 FPS x ~30KB/frame = ~450KB/s = ~3.6 Mbps
- Acceptable for modern broadband connections
- Mobile data may need reduced resolution

**Frame Capture Implementation (Frontend):**
```javascript
// Capture at 15 FPS
const FRAME_RATE = 15;
const FRAME_INTERVAL = 1000 / FRAME_RATE; // ~67ms

let lastFrameTime = 0;

function captureLoop(timestamp) {
  if (timestamp - lastFrameTime >= FRAME_INTERVAL) {
    captureAndSendFrame();
    lastFrameTime = timestamp;
  }
  requestAnimationFrame(captureLoop);
}

function captureAndSendFrame() {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(videoElement, 0, 0, 640, 480);

  // Get base64 JPEG at 70% quality
  const base64Jpeg = canvas.toDataURL('image/jpeg', 0.7).split(',')[1];

  // Send to backend via WebSocket
  ws.send(JSON.stringify({
    type: 'video_frame',
    data: base64Jpeg
  }));
}

// Start capture loop
requestAnimationFrame(captureLoop);
```

**Backend Frame Handling:**
```python
async def handle_video_frame(websocket, frame_data: str):
    """Forward video frame to Gemini"""
    await gemini_client.send_video_frame(frame_data)
```

**Note on Gemini Internal Sampling:**
Gemini Live API processes video at approximately 1 FPS internally, regardless of input rate. By sending 15 FPS, we ensure:
1. Gemini always samples the most recent frame (max 67ms old, not 1 second)
2. Safety-critical moments are captured immediately
3. The preview video in the UI is smooth and responsive

### 3.6 Audio Playback Implementation (Frontend)

**CRITICAL:** Gemini returns raw 16-bit PCM audio, NOT encoded audio (MP3, WAV). The `decodeAudioData()` method expects encoded formats and will fail with raw PCM.

```typescript
/**
 * Correct implementation for playing raw PCM audio from Gemini Live API
 * Audio is 16-bit PCM, little-endian, mono, 24kHz
 */
class PCMAudioPlayer {
  private audioContext: AudioContext | null = null;
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
```

### 3.7 Session Limits

| Limit | Value | Solution |
|-------|-------|----------|
| **Without Compression** | ~2 min (video) / ~15 min (audio only) | N/A - always use compression |
| **With Context Compression** | Unlimited | `context_window_compression: sliding_window` |
| **Disconnect Recovery** | 2 hours | Store and reuse resumption token |
| **Context Window** | 128k tokens | Auto-compressed by sliding window |

---

## 4. Tech Stack

### 4.1 Stack Selection

| Layer | Technology | Justification |
|-------|------------|---------------|
| **Frontend** | Next.js 14 + TypeScript + Tailwind | Fast UI development, easy deployment |
| **Backend** | Python 3.11 + FastAPI + websockets | Best Gemini SDK support, familiar |
| **Communication** | WebSocket (frontend <-> backend) | Real-time bidirectional |
| **AI** | Gemini Live API via google-genai SDK | Required for hackathon |
| **Frontend Deployment** | Vercel | One-click deploy, free tier |
| **Backend Deployment** | Railway or Render | Easy Python hosting, WebSocket support |

### 4.2 Frontend Dependencies

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

### 4.3 Backend Dependencies

```
# requirements.txt
fastapi>=0.109.0
uvicorn>=0.27.0
websockets>=12.0
google-genai>=0.3.0
python-dotenv>=1.0.0
```

### 4.4 Browser Requirements

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
- [ ] 15 FPS frame capture and transmission to backend
- [ ] Backend forwards frames to Gemini Live API
- [ ] Proactive audio enabled via v1alpha API - AI initiates speech without user prompt
- [ ] Context compression enabled - session runs indefinitely without context loss
- [ ] Detects and warns about: missing safety glasses, hand near blade/danger zone
- [ ] Warning plays through speakers within 1 second of detection
- [ ] Can be toggled on/off by user

**Demo Scenario:**
User reaches toward laser cutter without safety glasses.
AI: "Hold on - I don't see safety glasses, and you're reaching toward the laser cutter. Let's fix that first."

**Technical Implementation:**
```python
# Backend: main.py
from fastapi import FastAPI, WebSocket
from app.gemini_client import GeminiLiveClient
from app.prompts.safety_monitor import SAFETY_SYSTEM_PROMPT

app = FastAPI()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    async def on_audio(audio_bytes: bytes):
        # Send audio back to frontend
        import base64
        await websocket.send_json({
            "type": "audio",
            "data": base64.b64encode(audio_bytes).decode()
        })

    async def on_status(status: str):
        await websocket.send_json({
            "type": "status",
            "status": status
        })

    gemini = GeminiLiveClient(
        system_prompt=SAFETY_SYSTEM_PROMPT,
        on_audio_callback=on_audio,
        on_status_callback=on_status
    )

    # Start Gemini connection in background
    import asyncio
    gemini_task = asyncio.create_task(gemini.connect())

    try:
        while True:
            data = await websocket.receive_json()

            if data["type"] == "video_frame":
                await gemini.send_video_frame(data["data"])
            elif data["type"] == "audio":
                await gemini.send_audio(data["data"])
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        await gemini.disconnect()
        gemini_task.cancel()
```

```typescript
// Frontend: Start monitoring
const startSafetyMonitor = async () => {
  const ws = new WebSocket('wss://your-backend.railway.app/ws');
  const audioPlayer = new PCMAudioPlayer();

  ws.onopen = () => {
    audioPlayer.initialize();
    audioPlayer.resume();

    // Start 15 FPS frame capture
    requestAnimationFrame(captureLoop);
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'audio') {
      audioPlayer.playPCMAudio(data.data);
    } else if (data.type === 'status') {
      updateStatusUI(data.status);
    }
  };
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
See Section 3.6 for the PCMAudioPlayer class.

---

#### P0-4: Session Management

**Description:** Handle Gemini Live API session lifecycle with proper context preservation and disconnect recovery.

**Acceptance Criteria:**
- [ ] Connection established when user starts monitoring
- [ ] Visual indicator of connection status (Connected/Connecting/Disconnected)
- [ ] Context preserved indefinitely via context window compression
- [ ] Auto-reconnect with session resumption if connection drops
- [ ] Resumption token stored and reused
- [ ] Clean disconnect on app close

---

### 5.2 P1 Features (Nice to Have - NOT in Core Demo)

#### P1-1: Material Identification

**Description:** User shows unknown material, AI identifies it and provides machine-specific settings.

**Demo Status:** STRETCH DEMO ONLY - If Safety + Troubleshooter demos work perfectly and there's time, include as bonus. Otherwise, CUT.

---

#### P1-2: Alert History Log

**Description:** Visual log of all safety warnings and troubleshooting queries in the session.

---

#### P1-3: Mode Toggle UI

**Description:** Easy toggle between Safety Monitor mode and Troubleshooter mode.

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
├── frontend/                    # Next.js frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx           # Root layout with providers
│   │   │   ├── page.tsx             # Main application page
│   │   │   └── globals.css          # Global styles + Tailwind
│   │   │
│   │   ├── components/
│   │   │   ├── VideoFeed.tsx        # Webcam display component
│   │   │   ├── StatusIndicator.tsx  # Connection/mode status
│   │   │   ├── ControlPanel.tsx     # Start/stop, mode toggle
│   │   │   ├── AlertHistory.tsx     # Log of AI interventions
│   │   │   └── VoiceButton.tsx      # Push-to-talk control
│   │   │
│   │   ├── lib/
│   │   │   ├── websocket.ts         # WebSocket to backend
│   │   │   ├── video.ts             # Video capture at 15 FPS
│   │   │   ├── audio.ts             # PCM audio I/O utilities
│   │   │   └── constants.ts         # App constants
│   │   │
│   │   ├── hooks/
│   │   │   ├── useWebSocket.ts      # Backend connection hook
│   │   │   ├── useVideoCapture.ts   # Webcam hook (15 FPS)
│   │   │   └── useAudioIO.ts        # Audio input/output hook
│   │   │
│   │   └── types/
│   │       └── index.ts             # TypeScript type definitions
│   │
│   ├── public/
│   │   └── favicon.ico
│   │
│   ├── .env.local                   # Backend URL (gitignored)
│   ├── .env.example                 # Example env file
│   ├── next.config.js
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── backend/                     # Python FastAPI backend
│   ├── main.py                      # FastAPI app entry point
│   ├── requirements.txt             # Python dependencies
│   │
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py                # Settings, API keys
│   │   ├── gemini_client.py         # Gemini Live API wrapper
│   │   ├── websocket_handler.py     # WebSocket route handlers
│   │   ├── audio_processor.py       # Audio encoding/decoding
│   │   │
│   │   └── prompts/
│   │       ├── __init__.py
│   │       ├── safety_monitor.py    # Safety system prompt
│   │       └── troubleshooter.py    # Troubleshooter system prompt
│   │
│   ├── tests/
│   │   ├── __init__.py
│   │   └── test_gemini.py           # Gemini client tests
│   │
│   ├── .env                         # API keys (gitignored)
│   ├── .env.example                 # Example env file
│   └── Dockerfile                   # For Railway/Render deploy
│
├── .gitignore
└── README.md
```

---

## 7. Development Phases

### Phase 1: Foundation (Days 1-3)

**Goal:** Backend + Frontend scaffolding, Gemini connection, basic audio working

| Task | Time Est. | Output |
|------|-----------|--------|
| Create backend: FastAPI project structure | 1 hour | Backend scaffold |
| Implement Gemini Live client (Python) | 4 hours | Connected to API |
| Test proactive audio basics | 2 hours | Verify v1alpha works |
| Create frontend: Next.js + TypeScript + Tailwind | 1 hour | Frontend scaffold |
| Implement WebSocket frontend <-> backend | 2 hours | Connected |
| Implement webcam access and display | 2 hours | Video showing |
| Implement 15 FPS frame capture and send | 2 hours | Frames flowing |
| Implement PCM audio playback (frontend) | 3 hours | Can hear responses |
| End-to-end test: frame -> Gemini -> audio | 2 hours | Full data flow |

**Checkpoint:** Can see webcam, send frames through backend to Gemini, hear a response.

**CRITICAL DAY 1 VALIDATION:**
- [ ] Backend connects to Gemini v1alpha
- [ ] Audio plays correctly (not garbled, not silent)
- [ ] Context compression working (check for session_resumption_update)

---

### Phase 2: Safety Monitor (Days 4-5)

**Goal:** Proactive safety monitoring working end-to-end

| Task | Time Est. | Output |
|------|-----------|--------|
| Verify 15 FPS capture stable | 1 hour | Continuous capture |
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
| Forward audio through backend to Gemini | 2 hours | Audio reaches Gemini |
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
| Deploy backend to Railway/Render | 2 hours | Backend live |
| Deploy frontend to Vercel | 1 hour | Frontend live |
| Integration testing deployed version | 2 hours | Works in production |
| Record demo video (multiple takes) | 6 hours | 3-minute video |
| Write submission description | 1 hour | ~200 words |

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

NARRATOR: "Continuous 15 FPS video streaming. Proactive AI that decides when to speak. Sub-second response time. This isn't a chatbot with a camera - it's an AI that watches and intervenes."

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
1. **Continuous video feed** still sent at 15 FPS
2. **Periodic safety check** prompt sent every 5 seconds:
   ```python
   # Backend: periodic safety check if no proactive response
   async def periodic_safety_check():
       while True:
           await asyncio.sleep(5)
           if not recent_ai_response:
               await gemini.send_text(
                   "Safety check: Analyze the current frame for any hazards. "
                   "Only respond if you see danger."
               )
   ```
3. **Manual trigger** button for user to request safety assessment

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

---

## 10. Risk Assessment

### 10.1 Technical Risks (UPDATED)

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Proactive audio unreliable** | Medium | Critical | Extensive testing (Section 9), hybrid fallback |
| **Backend <-> Gemini connection issues** | Low | High | Connection retry logic, resumption tokens |
| **Audio playback issues** | Low (fixed) | High | Corrected PCM implementation in Section 3.6 |
| **Session disconnects** | Low | Medium | Session resumption with stored tokens |
| **Context loss** | Low (fixed) | High | Context window compression enabled |
| **15 FPS bandwidth issues** | Low | Medium | Can reduce to 10 FPS if needed |
| **Backend deployment complexity** | Medium | Medium | Use Railway/Render with simple Dockerfile |
| **v1alpha API instability** | Medium | High | Test early, have v1beta fallback ready |

### 10.2 Time Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Scope creep** | High | High | P0 features only; Material ID is STRETCH |
| **Backend setup takes longer** | Medium | Medium | Start backend first, days 1-2 |
| **Proactive audio tuning** | High | High | Allocate full day for testing + fallback |
| **Demo recording takes longer** | High | Medium | Start recording day 8; multiple takes |
| **Deployment issues** | Medium | Medium | Deploy early (day 7), test both services |

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
Python 3.11+
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
4. Copy key to backend `.env` file

```bash
# backend/.env
GEMINI_API_KEY=your_api_key_here
```

### 11.3 Backend Setup

```bash
# Create backend directory
mkdir backend && cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your API key

# Run development server
uvicorn main:app --reload --port 8000
```

### 11.4 Frontend Setup

```bash
# Create frontend
npx create-next-app@latest frontend --typescript --tailwind --eslint --app

cd frontend

# Create .env.local
echo "NEXT_PUBLIC_BACKEND_URL=ws://localhost:8000/ws" > .env.local

# Start development server
npm run dev
```

### 11.5 Development Commands

```bash
# Backend
cd backend
uvicorn main:app --reload --port 8000    # Start dev server
pytest                                     # Run tests

# Frontend
cd frontend
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Run ESLint
```

### 11.6 Deployment

**Backend (Railway):**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up

# Set environment variable in Railway dashboard
# GEMINI_API_KEY = your_key
```

**Frontend (Vercel):**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Set environment variable in Vercel dashboard
# NEXT_PUBLIC_BACKEND_URL = wss://your-backend.railway.app/ws
```

---

## 12. Submission Checklist

### 12.1 Required Deliverables

| Item | Status | Notes |
|------|--------|-------|
| [ ] Working demo or interactive prototype | | Vercel + Railway URLs |
| [ ] Public code repository OR AI Studio link | | GitHub repo link |
| [ ] 3-minute demo video | | YouTube/Vimeo link |
| [ ] ~200 word Gemini integration description | | See below |
| [ ] Project must be NEW (created during contest) | | Git history proves this |

### 12.2 Gemini Integration Description (~200 words)

> WorkshopCopilot uses the Gemini Live API's native audio model (gemini-2.5-flash-native-audio-preview) with proactive audio enabled to create a real-time workshop safety monitor and troubleshooting assistant.
>
> **How Gemini 3 is Central:**
> - **Continuous Video Streaming:** We send 15 FPS video frames via WebSocket to maintain persistent awareness of the physical workspace, ensuring Gemini always analyzes the most recent frame
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
| [ ] Frontend deployment URL loads and works |
| [ ] Backend deployment URL responds |
| [ ] GitHub repo is public and accessible |
| [ ] Safety demo scenario works on deployed version |
| [ ] Troubleshooter demo scenario works on deployed version |
| [ ] Video is under 3 minutes |
| [ ] English audio/subtitles in video |

---

## Appendix A: API Reference Quick Sheet

### Python Client Setup (v1alpha for Proactive Audio)
```python
from google import genai
from google.genai import types

client = genai.Client(
    api_key=os.environ["GEMINI_API_KEY"],
    http_options={"api_version": "v1alpha"}
)
```

### Full Session Configuration
```python
config = types.LiveConnectConfig(
    response_modalities=["AUDIO"],
    speech_config=types.SpeechConfig(
        voice_config=types.VoiceConfig(
            prebuilt_voice_config=types.PrebuiltVoiceConfig(
                voice_name="Kore"
            )
        )
    ),
    system_instruction=types.Content(
        parts=[types.Part(text="...")]
    ),
    proactivity=types.ProactivityConfig(
        proactive_audio=True
    ),
    context_window_compression=types.ContextWindowCompressionConfig(
        sliding_window=types.SlidingWindow()
    ),
    session_resumption=types.SessionResumptionConfig()
)
```

### Voice Options
- Puck, Charon, Kore, Fenrir, Aoede (Kore recommended for calm, clear)

### Audio Formats
- Input: 16-bit PCM, 16kHz, mono, MIME: `audio/pcm;rate=16000`
- Output: 16-bit PCM, 24kHz, mono, MIME: `audio/pcm`

### Video Format
- 15 FPS, JPEG, 640x480, 70% quality

---

## Appendix B: Troubleshooting Guide

| Issue | Solution |
|-------|----------|
| No audio output | Check AudioContext initialization; must be after user interaction; verify PCM conversion |
| Garbled audio | Sample rate mismatch; ensure AudioContext is 24000Hz; check Int16 to Float32 conversion |
| Webcam not showing | Check browser permissions; ensure HTTPS; try different browser |
| Backend connection fails | Check Railway/Render logs; verify WebSocket URL; check CORS settings |
| AI not speaking proactively | Verify v1alpha endpoint in Python client; check proactivity config; run test plan |
| Session expires | Verify context_window_compression is set; check for session_resumption_update |
| High latency | Reduce to 10 FPS if needed; check network; optimize audio buffer scheduling |
| Context seems lost | Check that resumption token is being stored and reused |

---

## Appendix C: Key Changes from v2

| Area | v2 | v3 |
|------|----|----|
| **Architecture** | Client-side direct to Gemini | Python backend + React frontend |
| **Frame Rate** | 1 FPS | 15 FPS (Gemini still samples ~1 FPS internally) |
| **API Key Location** | Client-side (env variable) | Server-side only (more secure) |
| **Gemini SDK** | JavaScript WebSocket | Python google-genai SDK |
| **Folder Structure** | Single Next.js app | Separate frontend/ and backend/ |
| **Deployment** | Vercel only | Vercel (frontend) + Railway (backend) |
| **Development Phases** | Frontend-first | Backend-first (days 1-2) |

**Rationale for Changes:**
1. Python SDK has better support for Gemini Live API features
2. 15 FPS ensures Gemini always has the most recent frame for safety-critical detection
3. API key on backend is more secure (never exposed to browser)
4. Familiar Python stack for AI/ML work

---

## References

- [Gemini Live API Session Management](https://ai.google.dev/gemini-api/docs/live-session)
- [Gemini Live API Capabilities Guide](https://ai.google.dev/gemini-api/docs/live-guide)
- [Gemini Live API WebSocket Reference](https://ai.google.dev/api/live)
- [Google Gemini Python SDK](https://github.com/google/generative-ai-python)
- [FastAPI WebSocket Documentation](https://fastapi.tiangolo.com/advanced/websockets/)

---

*End of Product Specification v3*
