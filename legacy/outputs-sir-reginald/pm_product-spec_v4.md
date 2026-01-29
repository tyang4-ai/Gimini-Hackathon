# WorkshopCopilot Product Specification v4

**Product:** WorkshopCopilot - "Your 24/7 Shop Mentor"
**Version:** 4.0
**Date:** January 15, 2026
**Target:** Google DeepMind Gemini 3 Hackathon
**Submission Deadline:** February 9, 2026, 5:00 PM PT

**Revision Notes:** This v4 addresses architecture simplification based on analysis:
1. **MAJOR: Switched to Direct Client Connection with Ephemeral Tokens** (no Python backend)
2. **Reverted frame rate from 15 FPS to 1 FPS** (Gemini processes at 1 FPS anyway)
3. **Simplified to single Next.js app** (faster development, simpler deployment)
4. **Preserved all v2/v3 fixes:** Session management, PCM audio playback, v1alpha API, proactive testing

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

### 2.1 Architecture Decision: Direct Client Connection

**CHANGE FROM v3:** Switched from Python backend proxy to direct client connection with ephemeral tokens.

**Why This Change:**
1. **Google's Recommended Pattern:** Ephemeral tokens are Google's official solution for secure client-side connections
2. **Lower Latency:** Eliminates extra network hop (saves 20-50ms per message)
3. **Simpler Architecture:** One WebSocket connection instead of two
4. **Faster Development:** 11 hours vs 15 hours of implementation
5. **Better Demo Reliability:** Fewer moving parts = fewer failure points
6. **Lower Cost:** Serverless token endpoint vs dedicated video proxy server

**Trade-offs:**
- Token management required (auto-refresh before 30-min expiry)
- JavaScript SDK instead of Python (Google supports both)
- Client-side logging only (acceptable for hackathon)

### 2.2 System Overview

```
+----------------------------------------------------------------------+
|                    FRONTEND (Next.js on Vercel)                       |
|                                                                       |
|  +-------------+  +-------------+  +--------------------------+       |
|  |   Webcam    |  |  Microphone |  |  Speaker/UI              |       |
|  |   (1 FPS)   |  |   Input     |  |     Output               |       |
|  +------+------+  +------+------+  +-----------^--------------+       |
|         |                |                     |                      |
|         v                v                     |                      |
|  +------------------------------------------------------------------+ |
|  |                 Gemini Live Client (JS SDK)                      | |
|  |  - Uses ephemeral token for authentication                       | |
|  |  - Direct WebSocket to Gemini Live API                           | |
|  |  - Sends 1 FPS video + audio directly                            | |
|  |  - Receives proactive audio responses                            | |
|  |  - Handles session management (compression + resumption)         | |
|  +------------------------------------------------------------------+ |
|                           |                                           |
|  +------------------------------------------------------------------+ |
|  |              /api/token (Next.js API Route)                      | |
|  |  - Generates ephemeral tokens (30-min expiry)                    | |
|  |  - API key stays on server (never exposed to browser)            | |
|  |  - Stateless, serverless                                         | |
|  +------------------------------------------------------------------+ |
+----------------------------------------------------------------------+
          |                                      ^
          |  WebSocket (wss://generativelanguage.googleapis.com)
          v                                      |
+----------------------------------------------------------------------+
|                    GEMINI LIVE API                                    |
|              (gemini-2.5-flash-preview-native-audio-dialog)           |
|                                                                       |
|  - v1alpha API version (required for proactive audio)                 |
|  - Proactive audio enabled                                            |
|  - Context window compression                                         |
|  - Session resumption support                                         |
+----------------------------------------------------------------------+
```

### 2.3 Data Flow

**Continuous Monitoring Mode (Safety Monitor):**
```
1. Browser requests ephemeral token from /api/token
2. Browser connects directly to Gemini via WebSocket using token
3. Webcam captures frame (1 FPS - every 1 second)
4. Frame encoded to base64 JPEG in browser
5. Sent directly to Gemini via WebSocket
6. Gemini analyzes frame
7. If hazard detected: Proactive audio response generated
8. Audio streamed directly to browser
9. Audio played immediately via Web Audio API
10. Context compressed automatically via slidingWindow
11. Token refreshed before 30-minute expiry
12. Loop continues indefinitely
```

**Why 1 FPS (Reverted from v3's 15 FPS):**
- Gemini Live API processes video at approximately 1 FPS internally
- Sending 15 FPS wastes bandwidth (Gemini drops 14 out of 15 frames)
- 1 FPS is sufficient for safety monitoring (hazards don't happen in milliseconds)
- Lower bandwidth requirements (~30KB/s instead of ~450KB/s)
- Simpler implementation

**Reactive Mode (Visual Troubleshooter):**
```
1. User speaks: "What's wrong with this print?"
2. Audio captured in browser (16kHz PCM)
3. Current video frame sent alongside
4. Both sent directly to Gemini via WebSocket
5. Gemini analyzes visual + audio query
6. Diagnostic audio response generated
7. Response streamed directly to browser
8. Response played via Web Audio API
```

### 2.4 Component Breakdown

| Component | Location | Responsibility | Technology |
|-----------|----------|---------------|------------|
| **TokenEndpoint** | Server (API Route) | Generate ephemeral tokens | Next.js API Route |
| **GeminiClient** | Client | WebSocket to Gemini, session management | @google/genai SDK |
| **VideoCapture** | Client | Webcam access, frame extraction at 1 FPS | MediaDevices API |
| **AudioIO** | Client | Microphone input, speaker output (PCM) | Web Audio API |
| **UIComponents** | Client | Video preview, status, controls | React + Tailwind |

---

## 3. Gemini Live API Integration

### 3.1 API Configuration

**Model:** `gemini-2.5-flash-preview-native-audio-dialog`

**CRITICAL: API Version for Proactive Audio**

Proactive audio requires the `v1alpha` API version. The ephemeral token locks in the configuration.

### 3.2 Token API Implementation

```typescript
// src/app/api/token/route.ts
import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const SAFETY_SYSTEM_PROMPT = `
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
`;

export async function POST() {
  const client = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
    httpOptions: { apiVersion: 'v1alpha' }  // CRITICAL: Required for proactive audio
  });

  try {
    // Create ephemeral token with locked configuration
    const token = await client.authTokens.create({
      config: {
        model: 'gemini-2.5-flash-preview-native-audio-dialog',
        systemInstruction: SAFETY_SYSTEM_PROMPT,
        // Token expires in 30 minutes
        expireTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      }
    });

    return NextResponse.json({
      token: token.token,
      expiresAt: token.expireTime
    });
  } catch (error) {
    console.error('Token generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
}
```

### 3.3 Client Connection (Gemini Live Client)

```typescript
// src/lib/gemini-client.ts
import { GoogleGenAI, Modality } from '@google/genai';

interface GeminiClientCallbacks {
  onAudio: (audioData: string) => void;  // Base64 PCM audio
  onStatus: (status: string) => void;
  onError: (error: Error) => void;
}

export class GeminiLiveClient {
  private client: GoogleGenAI | null = null;
  private session: any = null;
  private resumptionToken: string | null = null;
  private callbacks: GeminiClientCallbacks;
  private tokenExpiresAt: Date | null = null;

  constructor(callbacks: GeminiClientCallbacks) {
    this.callbacks = callbacks;
  }

  /**
   * Initialize client with ephemeral token
   */
  async connect(ephemeralToken: string, expiresAt: string): Promise<void> {
    this.tokenExpiresAt = new Date(expiresAt);

    // Create client with ephemeral token (acts as API key)
    this.client = new GoogleGenAI({ apiKey: ephemeralToken });

    this.callbacks.onStatus('connecting');

    try {
      this.session = await this.client.live.connect({
        model: 'gemini-2.5-flash-preview-native-audio-dialog',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' }  // Calm, clear voice
            }
          },
          // CRITICAL: Enable proactive audio (AI initiates speech)
          proactivity: {
            proactiveAudio: true
          },
          // CRITICAL: Enable unlimited session duration
          contextWindowCompression: {
            slidingWindow: {}
          },
          // CRITICAL: Enable session recovery on disconnect
          sessionResumption: this.resumptionToken
            ? { handle: this.resumptionToken }
            : {}
        }
      });

      this.callbacks.onStatus('connected');

      // Start listening for responses
      this.listenForResponses();

    } catch (error) {
      this.callbacks.onError(error as Error);
      throw error;
    }
  }

  /**
   * Listen for incoming messages from Gemini
   */
  private async listenForResponses(): Promise<void> {
    if (!this.session) return;

    try {
      for await (const response of this.session.receive()) {
        this.handleResponse(response);
      }
    } catch (error) {
      this.callbacks.onError(error as Error);
      this.callbacks.onStatus('disconnected');
    }
  }

  /**
   * Handle incoming response from Gemini
   */
  private handleResponse(response: any): void {
    // Handle session resumption token updates
    if (response.sessionResumptionUpdate?.newHandle) {
      this.resumptionToken = response.sessionResumptionUpdate.newHandle;
      console.log('Resumption token updated');
    }

    // Handle audio responses
    if (response.serverContent?.modelTurn?.parts) {
      for (const part of response.serverContent.modelTurn.parts) {
        if (part.inlineData?.mimeType === 'audio/pcm') {
          // Forward base64 audio to callback
          this.callbacks.onAudio(part.inlineData.data);
        }
      }
    }

    // Handle GoAway (graceful disconnect request from server)
    if (response.goAway) {
      console.log('Server requested disconnect, will reconnect...');
      this.callbacks.onStatus('reconnecting');
    }
  }

  /**
   * Send video frame to Gemini
   */
  async sendVideoFrame(base64Jpeg: string): Promise<void> {
    if (!this.session) return;

    await this.session.send({
      realtimeInput: {
        mediaChunks: [{
          mimeType: 'image/jpeg',
          data: base64Jpeg
        }]
      }
    });
  }

  /**
   * Send audio to Gemini
   */
  async sendAudio(base64Pcm: string): Promise<void> {
    if (!this.session) return;

    await this.session.send({
      realtimeInput: {
        mediaChunks: [{
          mimeType: 'audio/pcm;rate=16000',
          data: base64Pcm
        }]
      }
    });
  }

  /**
   * Check if token needs refresh (refresh 5 minutes before expiry)
   */
  needsTokenRefresh(): boolean {
    if (!this.tokenExpiresAt) return false;
    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
    return this.tokenExpiresAt < fiveMinutesFromNow;
  }

  /**
   * Get stored resumption token for reconnection
   */
  getResumptionToken(): string | null {
    return this.resumptionToken;
  }

  /**
   * Clean disconnect
   */
  async disconnect(): Promise<void> {
    if (this.session) {
      await this.session.close();
      this.session = null;
    }
    this.client = null;
    this.callbacks.onStatus('disconnected');
  }
}
```

### 3.4 System Prompts

**Safety Monitor System Prompt:** (Used in token generation above)

**Visual Troubleshooter System Prompt:**
```typescript
// src/lib/prompts.ts
export const TROUBLESHOOTER_PROMPT = `
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
`;
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

### 3.6 Video Specifications (REVERTED TO 1 FPS)

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Frame Rate** | 1 FPS | Matches Gemini's internal processing rate |
| **Format** | JPEG (base64 encoded) | Good compression, wide support |
| **Resolution** | 640x480 | Balance of quality and bandwidth |
| **Quality** | 0.8 JPEG quality | Good clarity for safety detection |

**Bandwidth Calculation:**
- 1 FPS x ~40KB/frame = ~40KB/s = ~0.32 Mbps
- Easily handled by any connection
- Mobile-friendly bandwidth

**Frame Capture Implementation:**
```typescript
// src/hooks/useWebcam.ts
import { useCallback, useRef, useState, useEffect } from 'react';

const FRAME_RATE = 1;  // 1 FPS
const FRAME_INTERVAL = 1000 / FRAME_RATE;  // 1000ms

interface UseWebcamOptions {
  onFrame: (base64Jpeg: string) => void;
}

export function useWebcam({ onFrame }: UseWebcamOptions) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const captureIntervalRef = useRef<number | null>(null);

  // Initialize webcam
  const startWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsStreaming(true);

        // Create canvas for frame capture
        canvasRef.current = document.createElement('canvas');
        canvasRef.current.width = 640;
        canvasRef.current.height = 480;

        // Start frame capture loop
        captureIntervalRef.current = window.setInterval(() => {
          captureFrame();
        }, FRAME_INTERVAL);
      }
    } catch (err) {
      setError(err as Error);
    }
  }, []);

  // Capture single frame
  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isStreaming) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, 640, 480);

    // Get base64 JPEG at 80% quality
    const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.8);
    const base64Jpeg = dataUrl.split(',')[1];  // Remove "data:image/jpeg;base64," prefix

    onFrame(base64Jpeg);
  }, [isStreaming, onFrame]);

  // Stop webcam
  const stopWebcam = useCallback(() => {
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }

    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    setIsStreaming(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, [stopWebcam]);

  return {
    videoRef,
    isStreaming,
    error,
    startWebcam,
    stopWebcam
  };
}
```

### 3.7 Audio Playback Implementation

**CRITICAL:** Gemini returns raw 16-bit PCM audio, NOT encoded audio (MP3, WAV). The `decodeAudioData()` method expects encoded formats and will fail with raw PCM.

```typescript
// src/hooks/useAudioPlayer.ts

/**
 * Correct implementation for playing raw PCM audio from Gemini Live API
 * Audio is 16-bit PCM, little-endian, mono, 24kHz
 */
export class PCMAudioPlayer {
  private audioContext: AudioContext | null = null;
  private nextStartTime: number = 0;

  /**
   * Initialize audio context (call after user interaction)
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

// React hook wrapper
import { useRef, useCallback } from 'react';

export function useAudioPlayer() {
  const playerRef = useRef<PCMAudioPlayer | null>(null);

  const initialize = useCallback(() => {
    if (!playerRef.current) {
      playerRef.current = new PCMAudioPlayer();
    }
    playerRef.current.initialize();
  }, []);

  const resume = useCallback(async () => {
    await playerRef.current?.resume();
  }, []);

  const playAudio = useCallback((base64Audio: string) => {
    playerRef.current?.playPCMAudio(base64Audio);
  }, []);

  const stop = useCallback(() => {
    playerRef.current?.stop();
    playerRef.current = null;
  }, []);

  return { initialize, resume, playAudio, stop };
}
```

### 3.8 Session Limits

| Limit | Value | Solution |
|-------|-------|----------|
| **Without Compression** | ~2 min (video) / ~15 min (audio only) | N/A - always use compression |
| **With Context Compression** | Unlimited | `contextWindowCompression: { slidingWindow: {} }` |
| **Disconnect Recovery** | 2 hours | Store and reuse resumption token |
| **Context Window** | 128k tokens | Auto-compressed by sliding window |
| **Ephemeral Token Expiry** | 30 minutes | Auto-refresh before expiry |

---

## 4. Tech Stack

### 4.1 Stack Selection (SIMPLIFIED)

| Layer | Technology | Justification |
|-------|------------|---------------|
| **Full Stack** | Next.js 14 + TypeScript + Tailwind | Everything in one app |
| **AI Client** | @google/genai JS SDK | Direct WebSocket to Gemini |
| **Token API** | Next.js API Routes | Serverless, no separate backend |
| **Deployment** | Vercel | One-click deploy, free tier |

**Why Simplified Stack:**
- Single deployment target (Vercel)
- No server to manage
- Faster development (11 hours vs 15 hours)
- Fewer failure points for demo

### 4.2 Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@google/genai": "^0.3.0"
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
- [ ] 1 FPS frame capture and transmission to Gemini (direct)
- [ ] Proactive audio enabled via v1alpha API - AI initiates speech without user prompt
- [ ] Context compression enabled - session runs indefinitely without context loss
- [ ] Token auto-refresh before 30-minute expiry
- [ ] Detects and warns about: missing safety glasses, hand near blade/danger zone
- [ ] Warning plays through speakers within 1 second of detection
- [ ] Can be toggled on/off by user

**Demo Scenario:**
User reaches toward laser cutter without safety glasses.
AI: "Hold on - I don't see safety glasses, and you're reaching toward the laser cutter. Let's fix that first."

**Technical Implementation:**
```typescript
// src/hooks/useGeminiLive.ts
import { useState, useCallback, useRef, useEffect } from 'react';
import { GeminiLiveClient } from '@/lib/gemini-client';
import { useAudioPlayer } from './useAudioPlayer';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting';

export function useGeminiLive() {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [error, setError] = useState<Error | null>(null);
  const clientRef = useRef<GeminiLiveClient | null>(null);
  const tokenRefreshTimeoutRef = useRef<number | null>(null);
  const { initialize, resume, playAudio, stop: stopAudio } = useAudioPlayer();

  // Fetch ephemeral token from our API
  const fetchToken = useCallback(async () => {
    const response = await fetch('/api/token', { method: 'POST' });
    if (!response.ok) {
      throw new Error('Failed to fetch token');
    }
    return response.json();
  }, []);

  // Schedule token refresh
  const scheduleTokenRefresh = useCallback((expiresAt: string) => {
    const expiryTime = new Date(expiresAt).getTime();
    const refreshTime = expiryTime - 5 * 60 * 1000; // 5 minutes before expiry
    const delay = refreshTime - Date.now();

    if (delay > 0) {
      tokenRefreshTimeoutRef.current = window.setTimeout(async () => {
        console.log('Refreshing token...');
        const { token, expiresAt: newExpiresAt } = await fetchToken();
        // Note: In a full implementation, you'd reconnect with the new token
        // For the hackathon, token refresh during active session is stretch goal
        scheduleTokenRefresh(newExpiresAt);
      }, delay);
    }
  }, [fetchToken]);

  // Connect to Gemini
  const connect = useCallback(async () => {
    try {
      // Initialize audio (must be after user interaction)
      initialize();
      await resume();

      // Fetch ephemeral token
      const { token, expiresAt } = await fetchToken();

      // Create client with callbacks
      clientRef.current = new GeminiLiveClient({
        onAudio: (audioData) => {
          playAudio(audioData);
        },
        onStatus: (newStatus) => {
          setStatus(newStatus as ConnectionStatus);
        },
        onError: (err) => {
          setError(err);
        }
      });

      // Connect with token
      await clientRef.current.connect(token, expiresAt);

      // Schedule token refresh
      scheduleTokenRefresh(expiresAt);

    } catch (err) {
      setError(err as Error);
      setStatus('disconnected');
    }
  }, [fetchToken, initialize, resume, playAudio, scheduleTokenRefresh]);

  // Send video frame
  const sendFrame = useCallback(async (base64Jpeg: string) => {
    await clientRef.current?.sendVideoFrame(base64Jpeg);
  }, []);

  // Send audio
  const sendAudio = useCallback(async (base64Pcm: string) => {
    await clientRef.current?.sendAudio(base64Pcm);
  }, []);

  // Disconnect
  const disconnect = useCallback(async () => {
    if (tokenRefreshTimeoutRef.current) {
      clearTimeout(tokenRefreshTimeoutRef.current);
    }
    await clientRef.current?.disconnect();
    stopAudio();
    clientRef.current = null;
  }, [stopAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    status,
    error,
    connect,
    disconnect,
    sendFrame,
    sendAudio
  };
}
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

**Technical Implementation:** See Section 3.7 for the PCMAudioPlayer class.

---

#### P0-4: Session Management

**Description:** Handle Gemini Live API session lifecycle with proper context preservation, disconnect recovery, and token management.

**Acceptance Criteria:**
- [ ] Ephemeral token fetched on connect
- [ ] Connection established directly to Gemini
- [ ] Visual indicator of connection status (Connected/Connecting/Disconnected)
- [ ] Context preserved indefinitely via context window compression
- [ ] Auto-reconnect with session resumption if connection drops
- [ ] Resumption token stored and reused
- [ ] Token refreshed before 30-minute expiry
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

## 6. Folder Structure (SIMPLIFIED)

```
workshop-copilot/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main dashboard
│   │   ├── layout.tsx            # App layout with providers
│   │   ├── globals.css           # Global styles + Tailwind
│   │   └── api/
│   │       └── token/
│   │           └── route.ts      # Ephemeral token endpoint
│   │
│   ├── components/
│   │   ├── VideoPreview.tsx      # Webcam display
│   │   ├── SafetyAlert.tsx       # Visual alert overlay
│   │   ├── AIMessages.tsx        # Alert history log
│   │   ├── StatusBar.tsx         # Connection status
│   │   ├── ModeToggle.tsx        # Safety/Troubleshooter toggle
│   │   └── VoiceButton.tsx       # Push-to-talk control
│   │
│   ├── hooks/
│   │   ├── useGeminiLive.ts      # Main Gemini connection hook
│   │   ├── useWebcam.ts          # Webcam capture (1 FPS)
│   │   └── useAudioPlayer.ts     # PCM audio playback
│   │
│   ├── lib/
│   │   ├── gemini-client.ts      # Gemini Live WebSocket wrapper
│   │   └── prompts.ts            # System prompts
│   │
│   └── types/
│       └── index.ts              # TypeScript type definitions
│
├── public/
│   └── favicon.ico
│
├── .env.local                    # GEMINI_API_KEY (gitignored)
├── .env.example                  # Example env file
├── next.config.js
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

**Key Simplifications from v3:**
- No separate `backend/` folder
- No Python code
- No Dockerfile
- Single deployment target
- Token endpoint is just a Next.js API route

---

## 7. Development Phases (UPDATED - FASTER)

### Phase 1: Foundation (Days 1-3)

**Goal:** Token endpoint, Gemini connection, basic audio working, 1 FPS video

| Task | Time Est. | Output |
|------|-----------|--------|
| Create Next.js project with TypeScript + Tailwind | 0.5 hour | Project scaffold |
| Implement /api/token endpoint | 1 hour | Token generation working |
| Test ephemeral token creation | 0.5 hour | Verify v1alpha works |
| Implement Gemini Live client (JS SDK) | 3 hours | WebSocket connected |
| Test proactive audio basics | 2 hours | Verify proactive triggers |
| Implement webcam access and display | 1 hour | Video showing |
| Implement 1 FPS frame capture and send | 1 hour | Frames flowing to Gemini |
| Implement PCM audio playback | 2 hours | Can hear responses |
| End-to-end test: frame -> Gemini -> audio | 1 hour | Full data flow |

**Total: ~12 hours (less than v3's 19 hours)**

**Checkpoint:** Can see webcam, send frames to Gemini, hear a response.

**CRITICAL DAY 1 VALIDATION:**
- [ ] Token endpoint returns valid ephemeral token
- [ ] Client connects to Gemini via WebSocket
- [ ] Audio plays correctly (not garbled, not silent)
- [ ] Context compression working (check for sessionResumptionUpdate)

---

### Phase 2: Safety Monitor (Days 4-5)

**Goal:** Proactive safety monitoring working end-to-end

| Task | Time Est. | Output |
|------|-----------|--------|
| Verify 1 FPS capture stable | 0.5 hour | Continuous capture |
| Verify proactive audio triggers on safety hazards | 4 hours | AI initiates speech |
| Write and tune safety system prompt | 3 hours | Detects hazards reliably |
| Add status indicators UI | 1 hour | User knows system state |
| Test proactive behavior (see Section 9) | 4 hours | Documented behavior |

**Total: ~12.5 hours**

**Checkpoint:** Can demonstrate safety glasses detection and warning.

---

### Phase 3: Visual Troubleshooter (Days 6-7)

**Goal:** Reactive troubleshooting working end-to-end

| Task | Time Est. | Output |
|------|-----------|--------|
| Implement audio input capture (16kHz PCM) | 2 hours | Can record user voice |
| Send audio to Gemini | 1 hour | Audio reaches Gemini |
| Create push-to-talk UI | 1 hour | User can trigger query |
| Wire audio + video to query handler | 1 hour | Combined input working |
| Write troubleshooter system prompt | 2 hours | Good diagnoses |
| Test with failed 3D print scenarios | 2 hours | Accurate responses |

**Total: ~9 hours**

**Checkpoint:** Can demonstrate "what went wrong" diagnosis of a failed print.

---

### Phase 4: Polish + Demo Prep (Days 8-10)

**Goal:** Demo-ready application with fallbacks

| Task | Time Est. | Output |
|------|-----------|--------|
| Error handling and fallbacks | 2 hours | Graceful degradation |
| UI polish and responsive design | 2 hours | Looks professional |
| Test session resumption on disconnect | 1 hour | Recovery works |
| Token refresh logic | 1 hour | Long sessions work |
| Deploy to Vercel | 1 hour | App live |
| Integration testing deployed version | 2 hours | Works in production |
| Record demo video (multiple takes) | 6 hours | 3-minute video |
| Write submission description | 1 hour | ~200 words |

**Total: ~16 hours**

**Checkpoint:** Demo video recorded, submission ready.

---

### Total Development Time

| Phase | v3 Estimate | v4 Estimate | Savings |
|-------|-------------|-------------|---------|
| Foundation | 19 hours | 12 hours | 7 hours |
| Safety Monitor | 13 hours | 12.5 hours | 0.5 hours |
| Troubleshooter | 11 hours | 9 hours | 2 hours |
| Polish + Demo | 16 hours | 16 hours | 0 hours |
| **Total** | **59 hours** | **49.5 hours** | **9.5 hours** |

**Contingency Buffer: 3-4 Days** (expanded from v3's 2-3 days due to time savings)

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

NARRATOR: "Continuous video streaming. Proactive AI that decides when to speak. Sub-second response time. This isn't a chatbot with a camera - it's an AI that watches and intervenes."

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
2. **Periodic safety check** text prompt sent every 5 seconds:
   ```typescript
   // In useGeminiLive.ts
   const periodicSafetyCheck = useCallback(async () => {
     if (clientRef.current) {
       await clientRef.current.sendText(
         "Safety check: Analyze the current frame for any hazards. " +
         "Only respond if you see danger."
       );
     }
   }, []);

   // Set up interval when connected
   useEffect(() => {
     if (status === 'connected') {
       const interval = setInterval(periodicSafetyCheck, 5000);
       return () => clearInterval(interval);
     }
   }, [status, periodicSafetyCheck]);
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

## 10. Risk Assessment (UPDATED)

### 10.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Proactive audio unreliable** | Medium | Critical | Extensive testing (Section 9), hybrid fallback |
| **JS SDK missing features** | Low | High | Test on Day 1; Python backend is backup option |
| **Audio playback issues** | Low (fixed) | High | Corrected PCM implementation in Section 3.7 |
| **Token refresh complexity** | Low | Medium | Refresh 5 min before expiry; simple interval |
| **Session disconnects** | Low | Medium | Session resumption with stored tokens |
| **Context loss** | Low (fixed) | High | Context window compression enabled |
| **v1alpha API instability** | Medium | High | Test early; document any issues |

### 10.2 Architecture Risk Comparison

| Risk | v3 (Backend Proxy) | v4 (Direct Client) | Winner |
|------|-------------------|-------------------|--------|
| **Deployment complexity** | Two services | One service | v4 |
| **Network failures** | Two WebSockets | One WebSocket | v4 |
| **API key security** | Excellent | Good (tokens) | v3 (slight) |
| **Debugging ease** | Server logs | Client only | v3 (slight) |
| **Demo reliability** | More failure points | Fewer failure points | v4 |
| **Development time** | 15 hours backend | 0 hours backend | v4 |

**v4 wins on demo reliability and development speed, which matter most for hackathon.**

### 10.3 Time Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Scope creep** | High | High | P0 features only; Material ID is STRETCH |
| **Proactive audio tuning** | High | High | Allocate full day for testing + fallback |
| **Demo recording takes longer** | High | Medium | Start recording day 8; multiple takes |
| **Deployment issues** | Low | Medium | Vercel is simple; deploy early (day 7) |

### 10.4 Demo Risks

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
4. Copy key to `.env.local` file

```bash
# .env.local
GEMINI_API_KEY=your_api_key_here
```

### 11.3 Project Setup

```bash
# Clone or create project
npx create-next-app@latest workshop-copilot --typescript --tailwind --eslint --app

cd workshop-copilot

# Install dependencies
npm install @google/genai

# Create .env.local
cp .env.example .env.local
# Edit .env.local with your API key

# Start development server
npm run dev
```

### 11.4 Development Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
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

# Set environment variable in Vercel dashboard:
# GEMINI_API_KEY = your_key

# Or via CLI:
vercel env add GEMINI_API_KEY
```

**That's it.** No backend deployment needed. Single deployment target.

---

## 12. Submission Checklist

### 12.1 Required Deliverables

| Item | Status | Notes |
|------|--------|-------|
| [ ] Working demo or interactive prototype | | Vercel URL |
| [ ] Public code repository OR AI Studio link | | GitHub repo link |
| [ ] 3-minute demo video | | YouTube/Vimeo link |
| [ ] ~200 word Gemini integration description | | See below |
| [ ] Project must be NEW (created during contest) | | Git history proves this |

### 12.2 Gemini Integration Description (~200 words)

> WorkshopCopilot uses the Gemini Live API's native audio model (gemini-2.5-flash-preview-native-audio-dialog) with proactive audio enabled to create a real-time workshop safety monitor and troubleshooting assistant.
>
> **How Gemini 3 is Central:**
> - **Direct WebSocket Connection:** Using ephemeral tokens, the browser connects directly to Gemini Live API, eliminating proxy latency for safety-critical sub-second response
> - **Continuous Video Streaming:** We send 1 FPS video frames directly to Gemini, matching its internal processing rate for efficient bandwidth usage
> - **Proactive Audio (v1alpha):** The key differentiator - Gemini decides WHEN to speak without waiting for user prompts, enabling safety intervention before dangerous actions complete
> - **Context Window Compression:** Enables unlimited session duration by automatically compressing context, maintaining awareness across the entire workshop session
> - **Native Audio Output:** Sub-second voice responses for natural, hands-free interaction while users work with tools
> - **Multimodal Understanding:** Gemini analyzes video frames to detect safety hazards (missing PPE, dangerous hand positions) and diagnose physical problems (3D print failures, material identification)
>
> **Why This Requires Gemini Live:**
> Traditional vision APIs use request-response: upload photo, wait, get analysis. WorkshopCopilot requires continuous monitoring with proactive intervention - impossible without Gemini Live's streaming video + proactive audio architecture.

### 12.3 Pre-Submission Testing

| Test | Pass/Fail |
|------|-----------|
| [ ] Demo video plays correctly on YouTube/Vimeo |
| [ ] Vercel deployment URL loads and works |
| [ ] GitHub repo is public and accessible |
| [ ] Safety demo scenario works on deployed version |
| [ ] Troubleshooter demo scenario works on deployed version |
| [ ] Video is under 3 minutes |
| [ ] English audio/subtitles in video |

---

## Appendix A: API Reference Quick Sheet

### Token Endpoint
```typescript
// POST /api/token
// Returns: { token: string, expiresAt: string }
```

### Client Connection
```typescript
import { GoogleGenAI, Modality } from '@google/genai';

const client = new GoogleGenAI({ apiKey: ephemeralToken });

const session = await client.live.connect({
  model: 'gemini-2.5-flash-preview-native-audio-dialog',
  config: {
    responseModalities: [Modality.AUDIO],
    speechConfig: {
      voiceConfig: {
        prebuiltVoiceConfig: { voiceName: 'Kore' }
      }
    },
    proactivity: { proactiveAudio: true },
    contextWindowCompression: { slidingWindow: {} },
    sessionResumption: {}
  }
});
```

### Voice Options
- Puck, Charon, Kore, Fenrir, Aoede (Kore recommended for calm, clear)

### Audio Formats
- Input: 16-bit PCM, 16kHz, mono, MIME: `audio/pcm;rate=16000`
- Output: 16-bit PCM, 24kHz, mono, MIME: `audio/pcm`

### Video Format
- 1 FPS, JPEG, 640x480, 80% quality

---

## Appendix B: Troubleshooting Guide

| Issue | Solution |
|-------|----------|
| No audio output | Check AudioContext initialization; must be after user interaction; verify PCM conversion |
| Garbled audio | Sample rate mismatch; ensure AudioContext is 24000Hz; check Int16 to Float32 conversion |
| Webcam not showing | Check browser permissions; ensure HTTPS; try different browser |
| Token fetch fails | Check GEMINI_API_KEY in .env.local; verify Vercel env vars |
| AI not speaking proactively | Verify v1alpha in token config; check proactivity config; run test plan |
| Session expires | Token refresh not working; check refresh interval |
| Context seems lost | Check that sessionResumption is configured; verify slidingWindow enabled |

---

## Appendix C: Key Changes from v3

| Area | v3 | v4 |
|------|----|----|
| **Architecture** | Python backend proxy | Direct client + ephemeral tokens |
| **Frame Rate** | 15 FPS | 1 FPS (matches Gemini processing) |
| **Backend** | FastAPI + websockets | None (API route only) |
| **Deployment** | Vercel + Railway | Vercel only |
| **API Key Location** | Python backend env | Next.js API route env |
| **WebSocket Connections** | 2 (client-backend, backend-Gemini) | 1 (client-Gemini direct) |
| **Estimated Dev Time** | 59 hours | 49.5 hours |
| **Bandwidth** | ~3.6 Mbps | ~0.32 Mbps |

**Rationale for Changes:**
1. Google recommends ephemeral tokens for client-side connections
2. Lower latency (eliminated proxy hop)
3. Simpler architecture (one deployment, one WebSocket)
4. Faster development (saved 9.5 hours)
5. 1 FPS matches Gemini's internal processing (15 FPS was wasted bandwidth)

---

## References

- [Gemini Live API Session Management](https://ai.google.dev/gemini-api/docs/live-session)
- [Ephemeral Tokens | Gemini API](https://ai.google.dev/gemini-api/docs/ephemeral-tokens)
- [Gemini Live API Capabilities Guide](https://ai.google.dev/gemini-api/docs/live-guide)
- [Gemini Live API WebSocket Reference](https://ai.google.dev/api/live)
- [Google GenAI JavaScript SDK](https://github.com/google/generative-ai-js)
- [live-api-web-console (Official Example)](https://github.com/google-gemini/live-api-web-console)

---

*End of Product Specification v4*
