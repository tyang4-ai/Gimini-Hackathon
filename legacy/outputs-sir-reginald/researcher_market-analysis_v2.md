# Gemini 3 Hackathon - Market Research Analysis v2

**Agent:** Market Researcher
**Version:** v2
**Date:** January 14, 2026
**Status:** Complete
**Previous Version:** v1 (rejected by critic)

---

## Executive Summary

This revised market analysis addresses the critic's feedback head-on. The v1 concepts were rejected for being saturated (CodeSentinel = "every hackathon has this"), LLM-agnostic (could work with GPT-4/Claude), and demo-boring (watching code scroll).

**This version focuses exclusively on:**
1. **Gemini Live API exploitation** - Sub-250ms real-time video+audio is Gemini's ONLY defensible moat
2. **Human-in-the-loop demos** - Judges engage with people, not text
3. **Vertical specificity** - Narrow domains that haven't been saturated
4. **"Never seen this" factor** - Ideas that exploit capabilities competitors literally cannot replicate

**Key Research Insight:** Gemini Live API processes video at 1 FPS with <250ms latency for combined audio+video+reasoning. This is unique. OpenAI Realtime is audio-only. Claude has no real-time streaming. GPT-4o Vision is request-response, not streaming. **Any concept that requires continuous video understanding with voice interaction is Gemini-exclusive territory.**

---

## Part 1: Research Findings - Where Gemini Live API Creates Unfair Advantage

### 1.1 What Gemini Live Can Do That Others Cannot

| Capability | Gemini Live | OpenAI Realtime | Claude | GPT-4o |
|-----------|-------------|-----------------|--------|--------|
| Real-time video streaming | Yes (1 FPS, <250ms) | No | No | No |
| Real-time audio streaming | Yes (<250ms) | Yes | No | No |
| Combined video+audio+reasoning | Yes | No | No | No |
| Native voice generation | Yes (24 languages) | Yes | No | No |
| Session memory | Yes (10 min sessions) | Yes | No | No |
| Barge-in (interrupt mid-response) | Yes | Yes | No | No |
| Affective dialog (emotion-aware) | Yes | Limited | No | No |
| Proactive response (decides when to speak) | Yes | No | No | No |

**The Defensible Moat:** Any application requiring "see what I'm doing + hear what I'm saying + respond in real-time" is Gemini-exclusive. This is not a small moat - it's a canyon.

### 1.2 What's Already Been Built (Avoid These)

Based on research, the following Gemini Live applications are already saturated or in production:

- **Gaming co-pilot** (Google's own demo - Real-Time Gaming Guide)
- **Customer service assistant** (Shopify Sidekick)
- **Loan officer assistant** (UWM's Mia)
- **Music co-creation companion** (Napster AI Companions)
- **Technical support** (SightCall Visual Support)
- **Live coding coach** (Critic's suggestion for LiveMentor v1)

**Critical Observation:** Most existing implementations are B2B enterprise solutions. Consumer-facing, emotionally engaging applications are underexplored.

### 1.3 Underexplored Opportunities (Where the Gaps Are)

My research identified several gaps where real-time video+audio AI creates massive value but hasn't been exploited:

| Gap | Why It's Underexplored | Gemini Live Fit |
|-----|----------------------|-----------------|
| **Real-time social skills coaching** | Requires continuous face/voice reading + instant feedback | Perfect - needs video+audio+reasoning loop |
| **Parent-child interaction coaching** | Traditional PCIT uses earpieces + one-way mirrors - no scalable solution | Perfect - coach parent in real-time during play |
| **Live presentation/pitch coaching** | Existing tools give post-hoc feedback, not live | Perfect - watch presentation, interrupt with tips |
| **Accessibility: Real-time sign language interpretation** | Most solutions are pre-recorded or text-only | Perfect - continuous visual understanding |
| **High-stakes conversation practice** | Interview tools are turn-based, not flowing | Perfect - continuous video analysis of body language |

### 1.4 Demo Engagement Research

From analyzing 2025 hackathon winners (Microsoft AI Agents, Google Cloud Gen AI, Healthcare AI):

**What Judges Loved:**
- Human-on-camera interactions (WeNome genomic chat demo)
- Live problem-solving (Shopify "forgets they're talking to AI in 1 minute")
- Emotional hooks (person struggles -> coaching -> success)
- Real-time adaptability (AI responds to what it sees)

**What Judges Ignored:**
- Workflow visualizations (boxes and arrows)
- Code generation demos (every team has one)
- Dashboard analytics (no emotional engagement)
- Pre-recorded scenarios (obviously scripted)

---

## Part 2: Five NEW Product Concepts

### Concept 1: "MirrorCoach" - Real-Time Social Anxiety Intervention

**Problem Statement:**
Social anxiety affects 15 million American adults. Current interventions (CBT, exposure therapy) require expensive therapist visits and don't provide real-time feedback during actual social situations. People with social anxiety know they struggle but can't identify WHAT they're doing wrong in the moment.

**Target User:**
Adults with mild-to-moderate social anxiety who want to practice conversations, job interviews, or dating scenarios in a safe environment before facing them in reality.

**Why Gemini Live is ESSENTIAL (Not Optional):**
This requires continuous video analysis of the user's face, body language, and voice tone while simultaneously:
1. Playing the role of conversation partner
2. Tracking anxiety indicators (fidgeting, eye contact, speech patterns)
3. Providing real-time coaching whispers ("Good eye contact", "Slow down", "Breathe")

No other LLM can do this. OpenAI Realtime is audio-only - can't see fidgeting. GPT-4o Vision is request-response - can't provide continuous coaching.

**Core Features:**
1. **Scenario Selection** - Pick your challenge: job interview, first date, networking event, difficult conversation
2. **Adaptive Roleplay Partner** - Gemini plays the interviewer/date/colleague with realistic responses
3. **Real-Time Anxiety Detection** - Watches for signs of distress and adjusts difficulty or pauses
4. **Whisper Coaching** - Gentle voice prompts only the user hears: "You're doing great, maintain that energy"
5. **Post-Session Analysis** - Replay with annotations showing where confidence peaked/dropped

**Demo Scenario (3 minutes):**
1. (0:00) Host introduces: "Meet Sarah, who gets nervous in job interviews"
2. (0:15) Sarah starts mock interview with MirrorCoach playing interviewer
3. (0:45) MirrorCoach notices Sarah looking down, whispers "Great answer! Try looking at the camera"
4. (1:15) Sarah asks a question that would be awkward - MirrorCoach smoothly adapts
5. (1:45) Sarah's confidence visibly increases - MirrorCoach notes "Much better energy!"
6. (2:15) Interview ends - MirrorCoach shows replay with confidence graph overlay
7. (2:45) Sarah: "That's the first time I got feedback WHILE practicing, not after"

**"Wow Factor" Hook:**
"An AI that watches your face, hears your voice, and coaches you through anxiety IN REAL-TIME - like having a therapist whispering in your ear during the actual conversation."

**Why Judges Haven't Seen This:**
- Most "interview practice" tools are turn-based chatbots
- Anxiety detection + live coaching requires simultaneous video+audio+reasoning
- The emotional transformation (nervous -> confident) is visceral and engaging
- Judges can imagine using this themselves

**Critic Test:**
- Could this work with GPT-4/Claude? **No - requires continuous video streaming + voice interaction**
- Is this "just a chatbot"? **No - it's watching you AND responding to what it sees**
- Demo reliability? **High - screen share + webcam is stable technology**

**Innovation Score:** 9/10

---

### Concept 2: "ParentPal" - Real-Time Parenting Interaction Coach

**Problem Statement:**
Parent-Child Interaction Therapy (PCIT) is clinically proven to reduce child behavioral problems by 50-70%. But it requires a therapist with a one-way mirror and an earpiece in the parent's ear, costing $150-300/session. Only ~5,000 trained PCIT therapists exist in the US. Most parents who need this can't access it.

**Target User:**
Parents of children ages 2-7 with behavioral challenges (tantrums, defiance, aggression) who can't afford or access traditional therapy.

**Why Gemini Live is ESSENTIAL (Not Optional):**
PCIT's magic is the LIVE coaching - telling parents what to say WHILE they're interacting with their child. This requires:
1. Watching parent-child interaction via video
2. Understanding behavioral dynamics in real-time
3. Whispering coaching prompts to parent without disrupting the child
4. Tracking progress across sessions

No turn-based LLM can do this. The parent can't stop to type or wait for a response. They need coaching in the MOMENT.

**Core Features:**
1. **Live Session Mode** - Parent wears AirPods, child doesn't know about the AI
2. **PRIDE Skill Coaching** - Whispers evidence-based prompts: "Label that emotion", "Give specific praise", "Reflect what they said"
3. **Behavior Pattern Recognition** - Identifies escalation patterns before tantrums happen
4. **Session Recording** - Saves interactions for therapist review (optional)
5. **Progress Tracking** - Tracks improvements in specific skills over weeks

**Demo Scenario (3 minutes):**
1. (0:00) Parent and child (4yo) playing with blocks, parent wearing AirPods
2. (0:30) ParentPal whispers: "Great eye contact. Try labeling what she's building."
3. (0:45) Parent: "You're making a tall tower!" Child beams.
4. (1:00) Child starts getting frustrated - ParentPal: "I see frustration building. Try: 'That looks tricky, you're working hard'"
5. (1:30) Parent uses the phrase, child calms down and continues
6. (2:00) Child successfully completes tower - ParentPal: "Perfect moment for specific praise"
7. (2:20) Parent: "You didn't give up even when it was hard! That's persistence!"
8. (2:40) End scene showing session summary: "3 labeled praise, 2 emotion reflections, 1 de-escalation"

**"Wow Factor" Hook:**
"$200/hour therapy, delivered through AirPods, by an AI that watches your parenting in real-time and whispers exactly what the best therapists would say."

**Why Judges Haven't Seen This:**
- Existing parenting AI is text-based advice, not live coaching
- The "whisper in ear while interacting" paradigm is unique
- Emotional hook is enormous (parent-child bonding, preventing tantrums)
- Targets a proven therapy model (PCIT has 40+ years of research)

**Critic Test:**
- Could this work with GPT-4/Claude? **No - requires continuous video + whispered coaching**
- Demo reliability? **High - just needs webcam + AirPods**
- Is the problem real? **Yes - 5,000 PCIT therapists vs millions of families in need**

**Innovation Score:** 10/10

---

### Concept 3: "PitchPerfect" - Real-Time Investor Pitch Coach

**Problem Statement:**
Founders practice pitches alone or with friends who don't give honest feedback. They watch themselves on video AFTER, but don't know what they looked like during the critical moments. VCs make decisions in the first 30 seconds based on confidence, not content. There's no way to practice with real-time feedback on presence.

**Target User:**
Startup founders preparing for investor pitches, accelerator demo days, or important presentations.

**Why Gemini Live is ESSENTIAL (Not Optional):**
This requires watching the presenter's body language, voice energy, eye contact, and pacing while they present, then interrupting with coaching at the exact right moment. Example: "Your energy dropped when you said the revenue number - own it more."

No other system can do this - it requires continuous video analysis + contextual interruption.

**Core Features:**
1. **VC Persona Selection** - Choose your investor archetype (skeptical, friendly, distracted, aggressive)
2. **Live Presence Coaching** - Real-time whispers: "Stand up straighter", "Slow down on the numbers", "You just said 'um' 3 times"
3. **Energy Tracking** - Visualizes confidence/energy throughout the pitch
4. **Q&A Simulation** - AI asks challenging questions based on pitch content
5. **Highlight Reel** - Automatically clips best and worst moments for review

**Demo Scenario (3 minutes):**
1. (0:00) Founder begins pitch: "We're solving the $50B logistics problem..."
2. (0:20) PitchPerfect whispers: "Great opening energy! Maintain that eye contact."
3. (0:45) Founder gets to pricing - voice drops, looks at notes
4. (0:50) PitchPerfect: "Energy dip detected - look up, own the number"
5. (1:10) Founder recovers, delivers number with confidence
6. (1:30) PitchPerfect (as VC): "What's your burn rate?" - simulates tough question
7. (2:00) Founder answers nervously
8. (2:10) PitchPerfect: "Good answer, but you looked down. Try again with direct eye contact."
9. (2:30) Session ends - shows energy graph with annotations: "Pricing slide was your weak point"

**"Wow Factor" Hook:**
"Imagine if you could have a legendary VC coach whispering in your ear during your pitch, telling you exactly when to slow down, stand taller, or own your numbers."

**Why Judges Haven't Seen This:**
- Existing pitch tools are post-hoc analysis (Yoodli, Orai)
- Live interruption with contextual coaching is novel
- The "energy graph" overlay on video is visually compelling
- Every founder in the audience will want this

**Critic Test:**
- Could this work with GPT-4/Claude? **No - requires continuous video + real-time coaching**
- Demo reliability? **Very high - just webcam + screen share**
- Is this saturated? **No - existing tools give feedback AFTER, not DURING**

**Innovation Score:** 8/10

---

### Concept 4: "SignFlow" - Real-Time ASL Conversation Enabler

**Problem Statement:**
11 million deaf Americans rely on sign language, but real-time interpretation is expensive ($25-150/hour) and unavailable for spontaneous conversations. Existing AI sign language tools either:
- Only recognize individual letters/words (not conversational)
- Only translate sign-to-text (one direction)
- Require expensive hardware

A deaf person can't have a natural video call with a hearing person without booking an interpreter days in advance.

**Target User:**
Deaf/HoH individuals who want spontaneous video conversations with hearing people without pre-booking interpreters.

**Why Gemini Live is ESSENTIAL (Not Optional):**
This requires:
1. Continuous video of the signer, understanding full ASL phrases (not just letters)
2. Converting to spoken English in real-time (Gemini's native voice)
3. Listening to the hearing person's speech
4. Displaying text/generating sign guidance for the deaf person

This is a bidirectional real-time video+audio translation pipeline. No other API can do this.

**Core Features:**
1. **ASL-to-Voice** - Deaf person signs, Gemini speaks to hearing person in real-time
2. **Voice-to-Text** - Hearing person speaks, Gemini displays text for deaf person
3. **Context Memory** - Understands conversation flow, not just individual phrases
4. **Deaf-owned Design** - Built with deaf community input (following Sign-Speak model)
5. **Low-latency Focus** - Optimized for conversational back-and-forth

**Demo Scenario (3 minutes):**
1. (0:00) Split screen: Deaf person on left, hearing person on right
2. (0:15) Deaf person signs "Hello, nice to meet you"
3. (0:18) Hearing person's screen shows Gemini speaking those words in natural voice
4. (0:25) Hearing person responds verbally: "Nice to meet you too! Where are you from?"
5. (0:28) Deaf person's screen shows text transcription
6. (0:35) Deaf person signs response, Gemini translates
7. (1:00-2:30) Natural back-and-forth conversation
8. (2:45) End slate: "2 minute conversation. Zero interpreter fees. Zero advance booking."

**"Wow Factor" Hook:**
"For the first time, a deaf person and hearing person can have a spontaneous video call - no interpreter, no advance booking, just natural conversation powered by AI."

**Why Judges Haven't Seen This:**
- Most sign language AI is letter-by-letter, not conversational
- Bidirectional real-time translation hasn't been demoed
- Accessibility technology has massive emotional appeal
- The visual of two people naturally conversing is powerful

**Critic Test:**
- Could this work with GPT-4/Claude? **No - requires continuous video + voice output**
- Technical risk? **Medium - ASL recognition is improving but not perfect**
- Demo reliability? **Medium - depends on signing clarity, but can be practiced**

**Important Note:** This concept requires ASL recognition capability. While Gemini's video understanding is general-purpose, ASL is a specialized domain. Would need to validate that Gemini can understand conversational ASL with acceptable accuracy. If not, this becomes a "prove the capability" demo rather than a "use the capability" demo.

**Innovation Score:** 9/10 (if ASL recognition works), 6/10 (if limited)

---

### Concept 5: "WatchParty AI" - Real-Time Content Co-Watching Companion

**Problem Statement:**
People watch content alone and have no one to discuss it with. Existing "watch party" features just sync playback - they don't enhance the experience. Movie podcasts and YouTube essays are AFTER the fact. There's no way to have a knowledgeable companion who watches WITH you and can answer questions, point out details, or share context in real-time.

**Target User:**
Solo viewers who want a companion experience when watching films, sports, documentaries, or educational content.

**Why Gemini Live is ESSENTIAL (Not Optional):**
This requires:
1. Watching the same video content the user is watching (screen share)
2. Understanding what's happening on screen
3. Responding to voice questions about the content
4. Proactively sharing relevant context without being asked

The "proactive audio" feature of Gemini Live (where it decides when to speak) is perfect for this - it can comment on interesting moments without being prompted.

**Core Features:**
1. **Content-Aware Companion** - Watches screen share, understands what's happening
2. **Question Answering** - "Who's that actor?", "What did they just reference?", "Is this historically accurate?"
3. **Proactive Insights** - "Fun fact: this scene was filmed in one take"
4. **Adjustable Personality** - Film critic, sports analyst, history buff, casual friend
5. **Spoiler Protection** - Knows not to reveal future plot points

**Demo Scenario (3 minutes):**
1. (0:00) User starts watching a classic film scene (something visually rich)
2. (0:20) WatchParty AI (without being asked): "Notice the mirror in the background - the director uses that motif throughout"
3. (0:40) User: "Wait, who's that character again?"
4. (0:45) AI: "That's the antagonist's brother - he appeared briefly in the opening but becomes important later"
5. (1:10) Important dialogue moment - AI stays quiet (knows not to talk over it)
6. (1:30) Scene ends. User: "Was that actor in anything else I'd know?"
7. (1:35) AI lists filmography without spoiling current film
8. (2:00) AI: "Coming up is one of the most iconic shots in cinema history"
9. (2:30) Demo ends with user: "This is like watching with a film school friend"

**"Wow Factor" Hook:**
"Finally, an AI companion that WATCHES with you - not just answers questions, but actively enhances the experience by pointing out details you'd miss."

**Why Judges Haven't Seen This:**
- No existing "watch party" feature has AI that understands the content
- Proactive commentary (not just reactive) is unique
- Appeals to universal experience (watching things alone)
- Demo is inherently engaging (we all like watching movies)

**Critic Test:**
- Could this work with GPT-4/Claude? **No - requires continuous screen share + proactive audio**
- Demo reliability? **Very high - just screen share + voice**
- Is this compelling? **Yes - immediate "I want this" reaction**

**Innovation Score:** 8/10

---

## Part 3: Scoring Against Critic's Criteria

| Concept | Gemini Essential? | Demo Engagement | "Never Seen" Factor | Demo Reliability | Total |
|---------|------------------|-----------------|---------------------|-----------------|-------|
| MirrorCoach | 10 - Requires continuous video+audio | 9 - Human transformation visible | 8 - Some anxiety tools exist but not live | 9 - Webcam + AirPods | **36/40** |
| ParentPal | 10 - PCIT paradigm needs live whisper | 10 - Child + parent is deeply emotional | 10 - No scalable PCIT alternative exists | 8 - Needs cooperative child | **38/40** |
| PitchPerfect | 9 - Live coaching needs video | 8 - Founders relate strongly | 7 - Pitch tools exist, live coaching is new | 9 - Just webcam | **33/40** |
| SignFlow | 10 - Bidirectional video+audio | 10 - Accessibility is powerful | 9 - No conversational ASL translator | 6 - ASL accuracy unknown | **35/40** |
| WatchParty AI | 9 - Proactive + video understanding | 8 - Universal appeal | 8 - Watch party concept + AI is novel | 9 - Screen share is reliable | **34/40** |

---

## Part 4: Final Recommendation

### Top Pick: **ParentPal** (Concept 2)

**Why ParentPal Wins:**

1. **Gemini Lock-In (10/10)**
   - The entire value proposition requires continuous video + whispered coaching
   - This literally cannot work with any other API
   - PCIT's effectiveness is PROVEN - we're just scaling delivery

2. **Emotional Demo (10/10)**
   - A parent successfully de-escalating a tantrum in real-time
   - A child's face transforming from frustrated to proud
   - Judges who are parents will tear up

3. **"Never Seen This" (10/10)**
   - No one has scaled PCIT with AI
   - The "therapist-in-your-ear" paradigm is viscerally understandable
   - Addresses a $150-300/session problem with a free/cheap solution

4. **Production-Ready Positioning**
   - Aligns with 2025 winner patterns (domain-specific, enterprise-ready)
   - Clear path to actual product (partner with PCIT International)
   - Defensible moat (Gemini Live is required)

5. **Technical Feasibility**
   - Doesn't require novel ML (uses Gemini's existing capabilities)
   - Demo can be practiced and reliable
   - Failure mode is acceptable ("coach misses a moment" is ok)

### Runner-Up: **MirrorCoach** (Concept 1)

If ParentPal is deemed too risky (child cooperation is unpredictable), MirrorCoach has:
- Similar "AI coaching in real-time" paradigm
- Adult-only demo (more controllable)
- Strong emotional hook (anxiety transformation)
- Slightly less novel but more predictable demo

### Concepts to Avoid

**SignFlow:** High impact but technical risk - ASL recognition accuracy is unvalidated. Would need to test extensively before committing.

**PitchPerfect:** Strong but less unique - pitch tools exist. The "live coaching" angle is novel but the category isn't.

**WatchParty AI:** Fun and engaging but feels more "feature" than "product". Better as a v2 feature than hackathon entry.

---

## Part 5: Implementation Strategy for ParentPal

### Week 1: Core Loop
- Gemini Live API integration
- Basic video understanding of parent-child interaction
- Voice whisper system (text-to-speech coaching prompts)

### Week 2: PCIT Protocol
- Implement PCIT's PRIDE skills (Praise, Reflect, Imitate, Describe, Enthusiasm)
- Build coaching prompt library based on clinical literature
- Basic behavior pattern recognition

### Week 3: Polish
- Session recording and playback
- Progress tracking across sessions
- UI/UX for parent onboarding

### Week 4: Demo
- Practice with real parent-child pairs
- Script 3-minute demo with backup scenarios
- Record backup video in case live demo fails

---

## Appendix: Research Sources

### Gemini Live API Capabilities
- [Gemini Live API Documentation](https://ai.google.dev/gemini-api/docs/live)
- [Gemini Live API on Vertex AI](https://cloud.google.com/blog/products/ai-machine-learning/gemini-live-api-available-on-vertex-ai)
- [Shopify Sidekick Implementation](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/live-api)

### Real-Time AI Applications
- [ZEGOCLOUD: Multimodal AI in Real-Time Experiences](https://www.zegocloud.com/blog/multimodal-ai-agent-is-reshaping-real-time-experiences)
- [Fast Company: Why 2026 Belongs to Multimodal AI](https://www.fastcompany.com/91466308/why-2026-belongs-to-multimodal-ai)
- [Telco Infrastructure for AI Latency](https://arxiv.org/html/2504.03708v1)

### PCIT and Parenting AI
- [PCIT International](https://www.pcit.org/about)
- [Chat2Learn - University of Chicago](https://the-learning-agency.com/the-cutting-ed/article/key-principles-in-developing-generative-ai-to-boost-parent-engagement-and-childrens-early-skill-development/)
- [PACEE: Parent-AI Collaborative Emotion Education](https://arxiv.org/html/2511.14414)
- [AI-based Parenting Skill Enhancement](https://www.ovid.com/journals/fare/pdf/10.1111/fare.13158)

### Social Anxiety and Coaching AI
- [Stanford AI Social Coach for Autism](https://hai.stanford.edu/news/an-ai-social-coach-is-teaching-empathy-to-people-with-autism)
- [Cambridge VR Public Speaking Platform](https://www.cam.ac.uk/stories/AI-VR-eliminates-fear-of-public-speaking)
- [AI Negotiation Training - ASU](https://news.asu.edu/b/20250911-ai-transforming-negotiation-training-next-global-leaders)

### Interview and Pitch Practice Tools
- [Hyperbound AI Sales Roleplay](https://www.hyperbound.ai/)
- [Yoodli Public Speaking Coach](https://www.unite.ai/best-ai-tools-for-public-speaking/)
- [Final Round AI Mock Interview](https://www.finalroundai.com/ai-mock-interview)

### Sign Language AI
- [Sign-Speak Interpreting Service](https://itsaccessibility.syr.edu/sign-speak-interpreting-service/)
- [Signapse AI Sign Language Translation](https://www.signapse.ai/)
- [Real-Time ASL Interpretation Research](https://www.sciencedaily.com/releases/2025/04/250409114945.htm)

### Hackathon Winners Analysis
- [Microsoft AI Agents Hackathon 2025](https://techcommunity.microsoft.com/blog/azuredevcommunityblog/ai-agents-hackathon-2025-%E2%80%93-category-winners-showcase/4415088)
- [Google Cloud Gen AI Hackathon 2025](https://www.outlookbusiness.com/artificial-intelligence/google-cloud-gen-ai-hackathon-2025-winners-use-cases-and-what-270000-developers-built)

---

*End of Market Research Analysis v2*

**Addressing Critic's v1 Feedback:**

| Critic's Concern | How v2 Addresses It |
|------------------|---------------------|
| "Every hackathon has code AI" | No code concepts in v2 |
| "Could work with any LLM" | All concepts require continuous video+audio streaming - Gemini exclusive |
| "Demo is boring" | All demos feature human transformation on camera |
| "LangGraph with a UI" | No orchestration platforms in v2 |
| "Enterprise product at hackathon" | Consumer-focused, emotionally engaging concepts |
| "Browser automation is flaky" | All demos use stable webcam+voice only |
| "LiveMentor for coding" | Expanded paradigm to more novel domains (parenting, social anxiety) |
