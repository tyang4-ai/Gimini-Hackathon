# Sir Reginald - Marketing Pitch v1

**Date:** January 17, 2026
**Status:** Final Draft

---

## 1. One-Liner (10 words or less)

**"The AI that stops you before you bleed."**

---

## 2. Elevator Pitch (30 seconds exactly)

### Hook (5 sec)
"30,000 Americans lose fingers to table saws every year. Most were working alone."

### Problem (8 sec)
"Every other AI waits for you to upload a photo AFTER something goes wrong. By then, the damage is done."

### Solution (12 sec)
"Sir Reginald watches your workshop in real-time. He shouts your name when your hand drifts toward the blade - before the cut, not after."

### Closer (5 sec)
"That's not a feature. That's a save."

---

## 3. Key Messages (3)

### Message 1: "Before, Not After"
The fundamental differentiator. ChatGPT and Claude analyze static images AFTER you upload them. Sir Reginald watches continuously and intervenes BEFORE accidents happen. This isn't incremental improvement - it's the difference between a diagnosis and a save.

### Message 2: "The AI That Speaks First"
Traditional AI waits for your prompt. Sir Reginald decides WHEN to speak. He watches, and the moment he sees danger developing, he speaks up - with impeccable British manners.

### Message 3: "Only Possible with Gemini Live"
This isn't a nice-to-have API choice. Continuous video streaming, sub-second voice response, proactive audio capability - these features are unique to Gemini Live. Sir Reginald is impossible without it.

---

## 4. Demo Highlights

### THE SHOUT Moment (Peak Drama)
User's hand drifts toward spinning blade.
**"[NAME]! HAND!"**
User flinches, pulls back.
*Calmer:* "Apologies for the outburst. But I did notice your fingers approaching the blade rather more closely than I'd prefer."

**Why this moment matters:** It's unforgettable. Judges will remember "the AI that shouted my name" long after they've forgotten generic demos.

### Guided Camera Setup (Innovation)
Sir Reginald doesn't just watch - he DIRECTS the user to position the camera:
"Ah yes, there's the table saw... angle down a touch so I might see your hands clearly... Splendid!"

**Why this moment matters:** This shows the AI actively directing the human, not passively waiting for input. It demonstrates spatial awareness and turns a potential limitation (camera positioning) into a memorable, theatrical feature. No other demo will have an AI telling the user where to point their camera.

### Thinking Monocle (Graceful Degradation)
When latency spikes, a monocle animation appears with Sir Reginald saying:
"Just a moment whilst I examine this properly..."

**Why this moment matters:** Instead of hiding latency, we make it part of the character. It shows technical sophistication (we're monitoring response times) while keeping users informed with charm rather than error messages.

### Safety Glasses Intervention (Before/After)
User removes glasses, reaches toward tool.
Sir Reginald speaks BEFORE the action completes.
User complies, gets gracious acknowledgment.

**Why this moment matters:** Clear demonstration of "before, not after" - the core differentiator.

### Visual Overlay
When Sir Reginald detects something, the UI highlights WHERE he's looking (hands, face, tool area).

**Why this moment matters:** Proves the AI is actually watching, not just generating generic responses. Builds trust and creates visual "wow factor."

---

## 5. Technical Talking Points

### For Technical Judges

**Architecture Innovation:**
- Direct WebSocket connection using ephemeral tokens (Google's recommended secure pattern)
- v1alpha API version required for proactive audio (not available in standard v1)
- 1 FPS video streaming matching Gemini's internal processing rate
- Context window compression for unlimited session duration

**Why Gemini Live is Required:**
| Capability | What It Enables |
|------------|-----------------|
| Continuous video streaming | Persistent spatial awareness |
| Sub-second voice response | Safety intervention before action completes |
| Proactive audio | AI decides WHEN to speak without waiting for prompt |
| Barge-in | Critical interruption capability for THE SHOUT |

**The Fundamental Difference:**
- ChatGPT/Claude: You ask, then they answer
- Sir Reginald: He watches, then he speaks

This isn't a feature difference. This is an architecture difference.

**Graceful Degradation:**
6-level fallback chain from full proactive monitoring to offline cached phrases. Sir Reginald never goes completely silent, even during connection loss.

---

## 6. Impact Statement

### The Human Story

Every year, 30,000 Americans lose fingers to table saws. The maker community knows this statistic - and every serious hobbyist has had the near-miss that still makes them nervous.

The problem isn't that people are careless. It's that they work alone.

Professional shops have safety oversight. Someone is watching. But the midnight maker in the garage? The weekend woodworker in the basement? They have YouTube tutorials that can't see their workspace. Forums that take hours to respond. AI assistants that wait for them to upload a photo after the injury.

Sir Reginald is the colleague you don't have. The mentor watching over your shoulder. The voice that speaks up in the moment when a warning could make the difference between a close call and a life-changing injury.

And he does it with the patience of someone who's spent forty years ensuring no one loses a finger on his watch.

### Platform Vision

Sir Reginald is the first application of the Proactive AI Safety Platform. The same architecture - continuous watching, proactive intervention, graceful degradation - applies anywhere humans work with their hands:

- **Workshops** (Sir Reginald) - Today
- **Laboratories** (Dr. Pemberton) - Future
- **Kitchens** (Chef Henri) - Future

The character changes. The architecture remains. This is a platform, not a point solution.

---

## 7. Memorable Quotes

**From Sir Reginald:**
- "Safety isn't about being afraid. It's about being prepared. I'm simply here to ensure you go home with all your fingers."
- "[NAME]! HAND!"
- "Splendid! Safety glasses on. Do carry on with your excellent work."
- "Another day, another digit saved. Cheerio!"

**For the pitch:**
- "The AI that watches your workshop - stops you before you bleed, helps you when you're stuck. With a distinguished British accent."
- "ChatGPT sees photos after you upload them. Sir Reginald sees danger before you complete the action."

---

## 8. Competitive Framing

| Competitor | What They Do | Why Sir Reginald is Different |
|------------|--------------|-------------------------------|
| ChatGPT Vision | Upload photo, get analysis | Static image AFTER the fact. Can't watch continuously. By the time you upload, the cut is made. |
| Claude Vision | Upload photo, get analysis | Same limitation - reactive, never proactive. |
| YouTube Tutorials | Watch pre-recorded videos | Generic content that can't see YOUR workspace. Can't warn you when YOUR hand drifts. |

**The moat:** ChatGPT and Claude APIs are request-response. Adding continuous streaming with proactive intervention would require fundamental architecture changes. Gemini Live is currently unique in offering this capability.

---

*Marketing Pitch v1 - Ready for Demo*
