# Architecture Analysis: Backend Proxy vs Direct Client Connection

**Document:** pm_architecture-analysis_v1.md
**Date:** January 15, 2026
**Purpose:** Evaluate the optimal architecture for WorkshopCopilot's Gemini Live API integration

---

## Executive Summary

**RECOMMENDED: Option B - Direct Client Connection with Ephemeral Tokens**

For a hackathon project with safety-critical latency requirements (<1 second), the direct client connection architecture is superior. Google explicitly supports this pattern via ephemeral tokens, and it eliminates an entire network hop that adds 10-50ms+ latency. The slight increase in initial setup complexity is offset by simpler runtime architecture, lower operational cost, and Google's official tooling support.

---

## Option A: Python Backend Proxy (Current v3 Spec)

### How It Works

```
+------------------+     WebSocket      +------------------+     WebSocket      +------------------+
|                  | ----------------> |                  | ----------------> |                  |
|  Browser Client  |    15 FPS video   |  Python Backend  |    15 FPS video   |  Gemini Live API |
|  (Next.js)       |    + audio        |  (FastAPI)       |    + audio        |                  |
|                  | <---------------- |                  | <---------------- |                  |
+------------------+    AI audio       +------------------+    AI audio       +------------------+
                       response                               response
```

**Data Flow:**
1. Browser captures webcam at 15 FPS (~30KB/frame)
2. Browser sends frames via WebSocket to Python backend
3. Backend receives, decodes, re-encodes, forwards to Gemini
4. Gemini responds with audio
5. Backend receives audio, forwards to browser
6. Browser plays audio

### Pros

| Advantage | Details |
|-----------|---------|
| **API Key Security** | API key never leaves server, impossible for client to extract |
| **Centralized Logging** | All traffic flows through server, easy to log and debug |
| **Rate Limiting** | Server can control API usage, prevent abuse |
| **Session State** | Server can persist resumption tokens across client reconnects |
| **SDK Maturity** | Python `google-genai` SDK has the most complete Live API support |
| **Familiar Stack** | Python is common for AI/ML work, easier to find help |

### Cons

| Disadvantage | Details |
|--------------|---------|
| **Extra Latency** | Every message traverses two WebSocket connections (+10-50ms minimum) |
| **Double Bandwidth** | Video frames sent twice (client->server, server->Gemini) |
| **Server Cost** | Must provision server capable of handling video streaming |
| **Complexity** | Two deployment targets, two sets of WebSocket code |
| **Single Point of Failure** | Server outage = complete app failure |
| **Scaling Concerns** | Video proxy is CPU/bandwidth intensive |

### Latency Analysis

```
Latency Breakdown (Optimistic):
- Browser -> Backend WebSocket: 5-20ms
- Backend processing (decode/encode): 2-10ms
- Backend -> Gemini WebSocket: 5-20ms
- Gemini processing: 100-500ms
- Gemini -> Backend: 5-20ms
- Backend -> Browser: 5-20ms
----------------------------------------
Total added latency: 22-90ms over direct connection
```

**Real-world consideration:** If the backend is hosted in a different region than Google's Gemini servers, latency could be significantly higher. If backend is on Railway/Render (likely US-East or US-West), and Gemini servers are elsewhere, each hop adds variable latency.

### Security Model

```
API Key Protection:
- API key stored in backend environment variable
- Never transmitted to client
- Zero client-side exposure risk
- Backend authenticates all requests

Risk Assessment: EXCELLENT
```

### Implementation Complexity

| Component | Effort | Notes |
|-----------|--------|-------|
| FastAPI WebSocket server | 4 hours | Handle client connections, message routing |
| Gemini Live client wrapper | 4 hours | Session management, audio/video forwarding |
| Audio encoding/decoding | 2 hours | PCM format handling |
| Error handling & reconnection | 3 hours | Handle both connections |
| Deployment (Railway) | 2 hours | Dockerfile, environment setup |
| **Total** | **15 hours** | Backend work only |

---

## Option B: Direct Client Connection with Ephemeral Tokens

### How It Works

```
+------------------+     HTTPS (once)   +------------------+
|                  | ----------------> |                  |
|  Browser Client  |   "Get token"     |  Token Server    |  (Minimal backend)
|  (Next.js)       | <---------------- |  (Serverless)    |
+------------------+   Ephemeral token +------------------+
         |
         |  WebSocket (direct)
         |  15 FPS video + audio
         v
+------------------+
|  Gemini Live API |
+------------------+
         |
         |  AI audio response
         v
+------------------+
|  Browser Client  |
+------------------+
```

**Data Flow:**
1. Browser authenticates with your backend (can be serverless)
2. Backend generates ephemeral token (1 API call to Gemini)
3. Backend returns token to browser
4. Browser connects DIRECTLY to Gemini via WebSocket using token
5. Browser streams video/audio directly to Gemini
6. Gemini responds directly to browser
7. Token expires after 30 minutes; client requests new token

### Pros

| Advantage | Details |
|-----------|---------|
| **Lower Latency** | One WebSocket connection instead of two (-20-50ms) |
| **Reduced Bandwidth** | Video only transmitted once |
| **Google-Supported** | Ephemeral tokens are Google's official solution for this pattern |
| **Simpler Runtime** | No server to maintain during live sessions |
| **Lower Cost** | Token server can be serverless (Vercel API route) |
| **Better Scaling** | Each client connects directly, no server bottleneck |
| **Official Example** | Google's `live-api-web-console` uses this pattern |

### Cons

| Disadvantage | Details |
|--------------|---------|
| **Token Management** | Must implement token refresh logic |
| **JavaScript SDK** | `@google/genai` JS SDK may have fewer features than Python |
| **Client Complexity** | WebSocket management in browser code |
| **Logging** | Harder to log/debug traffic (can only log at client) |
| **Token Security** | Short-lived tokens can still be intercepted (mitigated by expiry) |

### Latency Analysis

```
Latency Breakdown:
- Browser -> Gemini WebSocket: 10-30ms
- Gemini processing: 100-500ms
- Gemini -> Browser: 10-30ms
----------------------------------------
Total round-trip: 120-560ms

Savings vs Option A: 22-90ms per message
```

**For safety-critical detection:** If target is <1 second response, saving 50ms is significant (5% improvement).

### Security Model

```
Token-Based Security:
- API key stored on backend (same as Option A)
- Backend generates short-lived ephemeral tokens
- Tokens expire in 30 minutes (configurable)
- Tokens can be locked to specific configurations
- Even if token intercepted, limited damage window

Risk Assessment: GOOD (Google's recommended approach)
```

**From Google's documentation:**
> "Ephemeral tokens are short-lived authentication tokens for accessing the Gemini API through WebSockets. They are designed to enhance security when you are connecting directly from a user's device to the API."

### Implementation Complexity

| Component | Effort | Notes |
|-----------|--------|-------|
| Token endpoint (serverless) | 2 hours | Vercel API route or Next.js API |
| JavaScript WebSocket client | 4 hours | Direct Gemini connection |
| Token refresh logic | 1 hour | Request new token before expiry |
| Audio playback (same as A) | 2 hours | PCM handling in browser |
| Error handling | 2 hours | Connection recovery |
| **Total** | **11 hours** | Less total work |

---

## Side-by-Side Comparison

| Criterion | Option A (Backend Proxy) | Option B (Direct + Tokens) | Winner |
|-----------|-------------------------|---------------------------|--------|
| **Latency** | +22-90ms per message | Direct connection | **B** |
| **Complexity** | Two WebSocket layers, two deployments | One WebSocket, serverless token | **B** |
| **Security** | Excellent (key never leaves server) | Good (short-lived tokens) | A (slight) |
| **Reliability** | Server is single point of failure | Only token endpoint needed | **B** |
| **Dev Speed** | ~15 hours backend work | ~11 hours total | **B** |
| **Scaling** | Server bottleneck for video | Direct connections scale naturally | **B** |
| **Cost** | Server must handle video traffic | Serverless token calls only | **B** |
| **SDK Support** | Python SDK is most mature | JS SDK works, fewer examples | A (slight) |
| **Google Support** | Valid pattern | **Recommended pattern** | **B** |

**Score: Option B wins 6-2**

---

## Research Findings from Google Documentation

### Google's Explicit Recommendation

From [Ephemeral tokens | Gemini API](https://ai.google.dev/gemini-api/docs/ephemeral-tokens):
> "For production environments, in order to mitigate security risks, we recommend using ephemeral tokens instead of standard API keys."

### Why Direct Connection Matters for Real-Time

From [Get started with Live API](https://ai.google.dev/gemini-api/docs/live):
> "Client-to-server generally offers better performance for streaming audio and video, since it bypasses the need to send the stream to your backend first."

### Official Example Repository

Google's own [live-api-web-console](https://github.com/google-gemini/live-api-web-console) demonstrates the direct client connection pattern with React, using the `@google/genai` SDK.

---

## Recommendation

### RECOMMENDED: Option B - Direct Client Connection with Ephemeral Tokens

**Reasoning:**

1. **Latency is Critical:** WorkshopCopilot's success depends on sub-second safety warnings. Every millisecond counts. The backend proxy adds unnecessary latency.

2. **Google's Recommended Pattern:** Ephemeral tokens exist specifically for this use case. Google built this feature to enable secure direct client connections.

3. **Simpler Architecture:** One WebSocket connection is simpler than two. Less code, fewer failure modes.

4. **Faster Development:** 11 hours vs 15 hours of implementation work. More time for testing and polish.

5. **Better Demo Reliability:** Fewer moving parts = fewer things that can fail during demo.

6. **Cost Efficient:** Serverless token endpoint (free on Vercel) vs. dedicated server for video proxy.

### Implementation Notes

**Token Server (Next.js API Route):**
```typescript
// pages/api/token.ts
import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const token = await client.authTokens.create({
    config: {
      uses: 1,
      expireTime: new Date(Date.now() + 30 * 60 * 1000), // 30 min
    }
  });

  res.json({ token: token.name });
}
```

**Client Connection:**
```typescript
// Get token from your server
const { token } = await fetch('/api/token').then(r => r.json());

// Connect directly to Gemini
const ai = new GoogleGenAI({ apiKey: token });
const session = await ai.live.connect({
  model: 'gemini-2.5-flash-native-audio-preview-12-2025',
  config: {
    responseModalities: ['AUDIO'],
    proactivity: { proactiveAudio: true },
    contextWindowCompression: { slidingWindow: {} },
  }
});
```

### Key Implementation Considerations

1. **Token Refresh:** Implement automatic token refresh before 30-minute expiry
2. **Session Resumption:** Store resumption tokens client-side for reconnection
3. **JavaScript SDK Testing:** Test the JS SDK's proactive audio support early
4. **Fallback Plan:** If JS SDK has issues, Option A is still viable

### Risk Mitigation

| Risk | Mitigation |
|------|------------|
| JS SDK missing features | Test proactive audio on Day 1; switch to Option A if broken |
| Token expiry during demo | Refresh token every 10 minutes during active sessions |
| Client logging difficult | Add client-side logging to browser console; record demo sessions |

---

## Updated Architecture Diagram

```
+------------------------------------------------------------------+
|                    FRONTEND (Next.js on Vercel)                   |
|  +-------------+  +-------------+  +--------------------------+   |
|  |   Webcam    |  |  Microphone |  |  Speaker/UI Output       |   |
|  |   Feed      |  |   Input     |  |                          |   |
|  +------+------+  +------+------+  +-----------^--------------+   |
|         |                |                     |                  |
|         v                v                     |                  |
|  +--------------------------------------------------+            |
|  |            Gemini Live WebSocket Client           |            |
|  |  - Uses ephemeral token for authentication        |            |
|  |  - Sends 15 FPS video + audio directly            |            |
|  |  - Receives proactive audio responses             |            |
|  |  - Handles session resumption                     |            |
|  +--------------------------------------------------+            |
+------------------------------------------------------------------+
          |                                      ^
          |  WebSocket (wss://generativelanguage.googleapis.com)
          v                                      |
+------------------------------------------------------------------+
|                    GEMINI LIVE API                                |
|              (gemini-2.5-flash-native-audio-preview)              |
|                                                                   |
|  - Proactive audio enabled                                        |
|  - Context window compression                                     |
|  - Session resumption support                                     |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
|            TOKEN SERVER (Next.js API Route on Vercel)             |
|                                                                   |
|  /api/token - Returns ephemeral token (30-min expiry)             |
|  - Only called once per session + on refresh                      |
|  - Stateless, serverless                                          |
+------------------------------------------------------------------+
```

---

## Action Items

1. **Immediate:** Update PM spec v4 to use direct client architecture
2. **Day 1:** Validate JavaScript SDK supports proactive audio with ephemeral tokens
3. **Day 1:** Build token endpoint and test connection
4. **Contingency:** Keep Option A as backup if JS SDK has issues

---

## Sources

- [Ephemeral tokens | Gemini API | Google AI for Developers](https://ai.google.dev/gemini-api/docs/ephemeral-tokens)
- [Get started with Live API | Gemini API | Google AI for Developers](https://ai.google.dev/gemini-api/docs/live)
- [Best practices with Gemini Live API | Google Cloud](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/live-api/best-practices)
- [live-api-web-console | GitHub](https://github.com/google-gemini/live-api-web-console)
- [Building Real-Time Multimodal AI Apps with Gemini Live API](https://www.garvik.dev/ai/gemini-live-api-streaming)
- [Live API - WebSockets API reference | Gemini API](https://ai.google.dev/api/live)

---

*End of Architecture Analysis v1*
