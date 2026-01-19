# Sir Reginald - Marketing Materials (Draft v1)

**Date:** January 17, 2026
**Status:** First Draft for Review

---

## 1. One-Liner (10 words or less)

**"The AI that stops you before you bleed."**

Alternative options:
- "Your workshop guardian. Watches. Warns. Saves fingers."
- "Before, not after. That's the difference."

---

## 2. Elevator Pitch (30 seconds)

### Hook (5 sec)
"30,000 Americans lose fingers to table saws every year. Most were working alone."

### Problem (10 sec)
"Every other AI waits for you to upload a photo AFTER something goes wrong. By then, the cut is already made. The damage is done."

### Solution (10 sec)
"Sir Reginald watches your workshop in real-time and speaks up BEFORE you complete a dangerous action. He's the AI that doesn't wait for your prompt - he shouts your name when your hand drifts toward the blade."

### Closer (5 sec)
"ChatGPT sees photos after you upload them. Sir Reginald sees danger before you complete the action. That's not a feature. That's a save."

---

## 3. Key Messages (3)

### Message 1: "Before, Not After"
The fundamental differentiator. ChatGPT and Claude analyze static images AFTER you upload them. Sir Reginald watches continuously and intervenes BEFORE accidents happen. This isn't incremental improvement - it's the difference between a diagnosis and a save.

### Message 2: "The AI That Speaks First"
Traditional AI waits for your prompt. Sir Reginald decides WHEN to speak. He watches, and the moment he sees danger developing, he speaks up - with impeccable British manners.

### Message 3: "Only Possible with Gemini Live"
This isn't a nice-to-have API choice. Continuous video streaming, sub-250ms voice response, proactive audio capability - these features are unique to Gemini Live. Sir Reginald is impossible without it.

---

## 4. Demo Highlights

### THE SHOUT Moment (Peak Drama)
User's hand drifts toward spinning blade.
**"[NAME]! HAND!"**
User flinches, pulls back.
*Calmer:* "Apologies for the outburst. But I did notice your fingers approaching the blade rather more closely than I'd prefer."

**Why this moment matters:** It's unforgettable. Judges will remember "the AI that shouted my name" long after they've forgotten generic demos.

### Guided Camera Setup (Innovation)
Sir Reginald directs the camera positioning himself:
"Ah yes, there's the table saw... angle down a touch so I might see your hands clearly... Splendid!"

**Why this moment matters:** It shows the AI DIRECTING the human - memorable, unique, demonstrates spatial awareness.

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
| Sub-250ms voice response | Safety intervention faster than human reaction time |
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

Every year, 30,000 Americans lose fingers to table saws. The statistics are worse for home workshops than professional settings. Why? Professional shops have safety oversight. Someone is watching.

The midnight maker in the garage has no one.

Sir Reginald provides the safety oversight that's missing when there's no one else in the shop. Not after the injury. Not when you upload a photo to Reddit asking what went wrong. BEFORE. In the moment when a watchful presence could make the difference between a close call and a life-changing injury.

And he does it with the patience of a mentor and the concern of a colleague who's been doing this for forty years.

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

## Next Steps for Review

1. Review one-liner options - which resonates most?
2. Refine elevator pitch timing (currently reads ~35 seconds)
3. Confirm demo moments are achievable with current build
4. Add any missing competitive differentiators

---

*Draft v1 - Ready for feedback*
