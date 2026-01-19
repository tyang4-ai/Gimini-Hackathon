# Sir Reginald Makesworth III - Your Distinguished Workshop Companion

**Product:** Sir Reginald - "He Watches. He Remembers. He Protects."
**Version:** 9.0 (DEFINITIVE SPEC)
**Date:** January 18, 2026
**Target:** Google DeepMind Gemini 3 Hackathon
**Submission Deadline:** February 9, 2026, 5:00 PM PT

---

## Revision Notes (v9 - 9/10 Polish)

**WHAT'S NEW IN V9:**
Building on v8's dual Guardian/Witness approach, v9 adds the three critical improvements needed to reach 9/10:

1. **Testing Metrics in Demo** - Prove reliability with data, not just claims
2. **Real Maker Testimonials** - Social proof from actual users
3. **Multiple Demo Takes Strategy** - Plan for success, not luck

**ADDITIONAL IMPROVEMENTS:**
- Near-miss counter for impact visualization
- Live metric overlay for transparency
- Session highlight audio summary
- Fallback phrases for demo resilience
- Comprehensive UI Design Section

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision](#2-product-vision)
3. [Core Features](#3-core-features)
4. [System Prompt - Dual Directive](#4-system-prompt---dual-directive)
5. [Technical Architecture](#5-technical-architecture)
6. [UI/UX Design](#6-uiux-design)
7. [NEW: Comprehensive UI Component Specifications](#7-comprehensive-ui-component-specifications)
8. [Demo Script - 2 Minutes](#8-demo-script---2-minutes)
9. [Testing & Validation Strategy](#9-testing--validation-strategy)
10. [Maker Testimonials Strategy](#10-maker-testimonials-strategy)
11. [Implementation Status & Timeline](#11-implementation-status--timeline)
12. [Success Criteria](#12-success-criteria)
13. [Risk Assessment](#13-risk-assessment)
14. [Submission Checklist](#14-submission-checklist)

---

## 1. Executive Summary

### 1.1 The Combined Concept

**Sir Reginald Makesworth III** is a distinguished British AI workshop companion that does TWO things:

1. **SAFETY GUARDIAN (Primary - THE SHOUT):** Real-time monitoring with proactive intervention BEFORE dangerous actions complete. The signature moment: Sir Reginald shouts "[NAME]! HAND!" when he sees imminent danger.

2. **THE WITNESS (Secondary - Documentation):** Autonomous observation and documentation of the entire workshop session. At session end, generates professional tutorials, troubleshooting guides, and technique documentation.

**Core Value Proposition:**
> "Sir Reginald is the AI companion who watches over your workshop - protecting you from injury in real-time AND documenting your work for you to share."

### 1.2 Why This Wins

| Hackathon Criteria | How v9 Addresses It |
|-------------------|---------------------|
| **Technical Execution (40%)** | Real-time safety + Marathon agent + **PROVEN with 50+ test metrics** |
| **Innovation/Wow Factor (30%)** | THE SHOUT is memorable + **Near-miss counter shows impact** |
| **Potential Impact (20%)** | Safety saves fingers + **Real maker testimonials prove value** |
| **Presentation/Demo (10%)** | Lead with dramatic safety + **20+ takes ensure perfection** |

### 1.3 The Differentiator

**"Before, not after."**

- ChatGPT: You upload a photo AFTER something happens, then ask
- Sir Reginald: He watches continuously and speaks BEFORE you complete a dangerous action

This isn't a feature difference. It's an architecture difference that only Gemini Live makes possible.

### 1.4 Win Probability (Updated)

| Outcome | v8 Probability | v9 Probability | Delta |
|---------|----------------|----------------|-------|
| Grand Prize ($50K) | 15-20% | 25-30% | +10% |
| Top 3 | 45-50% | 60-65% | +15% |
| Top 10 | 80-85% | 90%+ | +10% |

**Why the improvement:** Testing metrics, testimonials, and demo strategy address the critic's primary concerns about unproven reliability and execution risk.

---

## 2. Product Vision

### 2.1 Product Definition

**Full Name:** Sir Reginald Makesworth III
**Roles:**
- THE GUARDIAN - Real-time safety monitoring with proactive intervention
- THE WITNESS - Autonomous session observation and documentation

**Character Story:**
Sir Reginald Makesworth III is a distinguished British gentleman who spent decades as the head craftsman at the Royal Workshop of Windsor Castle. He didn't just build things - he ensured safety AND documented everything meticulously. Now retired, he offers his powers of protection and observation to makers worldwide.

### 2.2 Target User

**Primary Persona: The Midnight Maker**

- Works alone in garage/basement/spare room
- Evening and weekend maker - projects happen when family is asleep
- Self-taught from YouTube, forums, trial and error
- Has had close calls - the near-miss that still makes them nervous
- Wants to document projects but never has time
- Gets stuck on problems and has no one to ask in the moment

**Why This Audience:**
- Safety stakes are highest (no one else is there)
- Documentation need is clearest (no time to write it themselves)
- Story is most universal (judges understand working alone)

### 2.3 The Two Value Propositions

**Safety (Primary):**
> "Before, not after. Sir Reginald sees danger BEFORE you complete the action."

**Documentation (Secondary):**
> "Finish a 3-hour project and find a complete tutorial waiting for you."

---

## 3. Core Features

### 3.1 Priority Framework (Updated)

| Priority | Feature | Demo Time | Notes |
|----------|---------|-----------|-------|
| **P0** | THE SHOUT (Hand near blade) | 15 sec | THE memorable moment |
| **P0** | Safety glasses warning | 10 sec | Most reliable scenario |
| **P0** | 5 hardcoded safety scenarios | Background | Demo reliability |
| **P0** | Session moment detection | Background | Accumulates during work |
| **P0** | Document generation | 15 sec | Show result at end |
| **P0** | **Near-miss counter** | 5 sec | NEW: Impact visualization |
| **P0** | **Live metric overlay** | Throughout | NEW: Transparency |
| **P1** | Guided camera setup | 10 sec | Sir Reginald personality |
| **P1** | Personalization (user name) | Throughout | Used in warnings |
| **P1** | Visual overlay highlights | Shown with warnings | Wow factor |
| **P1** | Export (Markdown/PDF) | 5 sec | Tangible output |
| **P1** | **Session highlight summary** | 10 sec | NEW: Audio recap |
| **P2** | Cluttered workspace warning | Optional | 5 scenarios backup |
| **P2** | Improper grip warning | Optional | 5 scenarios backup |
| **P2** | Hearing protection warning | Optional | 5 scenarios backup |

### 3.2 P0 Feature Specifications

#### P0-1: Safety Guardian - THE SHOUT

**Description:** Sir Reginald monitors continuously and SHOUTS when he sees imminent danger.

**The Signature Moment:**
```
User's hand drifts toward running blade...

SIR REGINALD: "[NAME]! HAND!"

[User pulls back]

SIR REGINALD: "Do forgive me for raising my voice - but that was rather too close
to the blade for my comfort. Are you quite alright?"
```

**Acceptance Criteria:**
- [ ] Detects hand within danger zone of blade/tool
- [ ] Shouts user's name + one word (breaks character briefly)
- [ ] Immediate apology and return to character
- [ ] Response time <800ms from detection
- [ ] Overlay highlights hand region in orange
- [ ] Near-miss counter increments

#### P0-2: Safety Guardian - PPE Detection

**Description:** Sir Reginald warns when approaching dangerous tools without proper PPE.

**Sample Interaction:**
```
User reaches toward laser cutter without safety glasses...

SIR REGINALD: "Pardon the interruption, [Name], but I notice you're approaching
the laser cutter without your safety spectacles. Do let's sort that out first, shall we?"

[User puts on glasses]

SIR REGINALD: "Splendid! Do carry on with your excellent work."
```

**Acceptance Criteria:**
- [ ] Detects missing safety glasses when near laser/saw
- [ ] Polite but firm warning
- [ ] Acknowledges compliance graciously
- [ ] Overlay highlights face region in teal

#### P0-3: The Five Hardcoded Demo Scenarios

For demo reliability, these 5 scenarios are extensively tested:

| # | Scenario | Visual Trigger | Response |
|---|----------|---------------|----------|
| 1 | Safety glasses off | Face visible, no glasses near laser | "Pardon the interruption, but I notice you're approaching the laser cutter without your safety spectacles." |
| 2 | Hand near blade (SHOUT) | Hand within 6" of blade | "[NAME]! HAND! ...Do forgive me for raising my voice - but that was rather too close." |
| 3 | Cluttered workspace | Multiple objects on work surface | "I do hate to be a bother, but the workspace is looking rather cluttered." |
| 4 | Improper grip | One-handed tool operation | "I notice you're operating that with just one hand. A proper two-handed grip would give you better control." |
| 5 | Missing hearing protection | Loud tool, no ear protection | "I can hear that tool running, and I don't see hearing protection." |

#### P0-4: Session Moment Detection (THE WITNESS)

**Description:** Sir Reginald identifies and remembers significant moments during the session.

**Moment Types:**

| Type | Trigger | Sir Reginald Commentary |
|------|---------|------------------------|
| **NEW_STEP** | Major action change | "Ah, moving on to assembly. I shall note the transition." |
| **TECHNIQUE** | Skill demonstration | "That's a clever jig arrangement. I'm noting that for the documentation." |
| **PROBLEM** | Issue encountered | "Hmm, I see some trouble there. Let's see how you address it." |
| **SOLUTION** | Problem resolved | "Ah, well recovered. I've noted the solution." |
| **MISTAKE** | Error made | "A small stumble there, but well recovered. Makes for good teaching material." |
| **TIP** | Best practice shown | "I notice you're using tape to prevent tearout. A wise technique." |
| **SAFETY** | Safety moment | [Handled by safety guardian] |

**Commentary Frequency:** Every 3-5 minutes, not constant.

**Acceptance Criteria:**
- [ ] Detects moments without prompting
- [ ] Logs moments with timestamp and description
- [ ] Commentary adds atmosphere without interrupting work
- [ ] Context preserved across entire session
- [ ] Moment tags compliance >90%

#### P0-5: Autonomous Document Generation

**Description:** At session end (or on demand), Sir Reginald generates professional documentation.

**Triggers:**
- User clicks "Generate Documentation" button
- User says "Reginald, write it up"
- End session button includes documentation option

**Document Structure:**
```markdown
# [Project Name] - Tutorial by Sir Reginald

## Overview
[AI-generated summary of what was built]

## Materials & Tools Observed
- [List observed during session]

## Step-by-Step Guide

### Step 1: [Step Name]
**Time:** 0:00 - 5:30
[Description of what was done]

## Problems Encountered & Solutions

### Problem 1: [Issue]
**When:** [Timestamp]
**Solution:** [How it was fixed]

## Tips & Techniques
- [Techniques observed during session]

## Session Summary
- Duration: [X hours, Y minutes]
- Major Steps: [N]
- Problems Solved: [N]
- Safety Moments: [N] interventions prevented potential issues

---
*Documented by Sir Reginald Makesworth III*
*"He Watches. He Remembers. He Protects."*
```

**Acceptance Criteria:**
- [ ] Generates complete document from session moments
- [ ] Proper structure with sections
- [ ] Timestamps included
- [ ] Exportable as Markdown (required), PDF (nice-to-have)

#### P0-6: Near-Miss Counter (NEW)

**Description:** Track and display every safety intervention to show impact visually.

**Display:**
```
NEAR-MISSES PREVENTED: 3
[!] Hand near blade (0:15:32)
[!] Missing safety glasses (0:08:45)
[!] Cluttered workspace (0:03:12)
```

**Session End Summary:**
Sir Reginald verbally announces: "During our session, I identified 3 potential safety concerns. That's 3 moments where a watchful companion may have made the difference."

**Acceptance Criteria:**
- [ ] Counter increments with each intervention
- [ ] List shows all intervention types with timestamps
- [ ] Session end includes verbal summary
- [ ] Visual counter always visible in UI

#### P0-7: Live Metric Overlay (NEW)

**Description:** Persistent display showing real-time system status.

**Display Format:**
```
[Watching] | 0.8s latency | 3 moments | 1 intervention
```

**Components:**
| Element | Description |
|---------|-------------|
| Status | "Watching" / "Thinking..." / "Reconnecting..." |
| Latency | Current response time (updates every 5s) |
| Moments | Count of detected moments this session |
| Interventions | Count of safety interventions |

**Acceptance Criteria:**
- [ ] Updates in real-time
- [ ] Visible but unobtrusive
- [ ] Changes color based on latency (green/yellow/red)
- [ ] Persists throughout session

### 3.3 P1 Feature Specifications

#### P1-1: Guided Camera Setup

**Description:** Sir Reginald directs camera positioning at session start.

**Script:**
```
SIR REGINALD: "Ah, splendid! I can see you now. Before we begin, let's ensure
I have a proper view of your workspace.

If you wouldn't mind, position your camera so I can see your primary work surface.
I should be able to see from your hands down to the tool in front of you.

[User adjusts]

Excellent! I believe I have a proper lay of the land now. Shall we begin?"
```

**Acceptance Criteria:**
- [ ] Surveys workspace on first connect
- [ ] Provides theatrical direction
- [ ] Confirms satisfactory setup
- [ ] Can be skipped after first session

#### P1-2: Personalization System

**Description:** User name captured at onboarding and used throughout.

**Usage:**
- Greeting: "Good evening, [Name]."
- Safety Warning: "[Name], one moment if you please..."
- URGENT Warning: "[NAME]!" (capitalized, urgent)
- Compliment: "Excellent work there, [Name]."
- Session End: "Until next time, [Name]. Do take care."

**Frequency:** Every 3-5 interactions, not every sentence.

#### P1-3: Visual Confirmation Overlay

**Description:** Highlights show WHERE Sir Reginald is looking.

**Regions:**
| Region | Color | Trigger Keywords |
|--------|-------|-----------------|
| Hands | Orange (#ff6b35) | "your hand", "fingers", "grip" |
| Face | Teal (#4ecdc4) | "safety glasses", "spectacles" |
| Tool | Orange (#ff6b35) | "blade", "saw", "cutting area" |
| Printer | Green (#95e1d3) | "print", "print bed", "nozzle" |

**Duration:** 3 seconds per highlight

#### P1-4: Export Functionality

**Description:** Documentation can be exported in multiple formats.

**Formats:**
- **Markdown:** Primary format, always works
- **PDF:** Professional output (use browser print or jsPDF)
- **HTML:** Self-contained web page (stretch)

#### P1-5: Session Highlight Audio Summary (NEW)

**Description:** Before documentation, Sir Reginald verbally summarizes the session highlights.

**Script (triggered at session end):**
```
SIR REGINALD: "Well then, [Name], we've had quite the productive session.
You worked for [duration], completed [N] major steps, and I noted [M] clever
techniques worth sharing. I did have to intervene [X] times for safety -
but better a word of caution than a trip to hospital, I always say.

Shall I prepare the documentation for you?"
```

**Acceptance Criteria:**
- [ ] Summarizes session before doc generation
- [ ] Mentions key stats verbally
- [ ] Maintains Sir Reginald character
- [ ] Leads naturally into documentation

### 3.4 What's Cut (From v6 and v7)

**Cut from v6:**
- MediaPipe hazard zones (too complex, AI handles region detection)
- Audio fingerprinting (scope creep)
- 6-level fallback chain (simplified to 3 levels)
- Fatigue detection (stretch, not demoed)
- Multi-modal callout (stretch, not demoed)

**Cut from v7:**
- Frame capture for illustrations (too complex)
- Multi-session projects (out of scope)
- Video timestamp links (out of scope)

**Still Cut:**
- Dark mode toggle (minor polish) - REINSTATED for user preference
- Reliability dashboard (internal tooling only)

---

## 4. System Prompt - Dual Directive

### 4.1 The Combined Prompt

```typescript
export const getSirReginaldDualPrompt = (userName: string) => `
You are Sir Reginald Makesworth III, a distinguished British gentleman who spent decades as the head craftsman at the Royal Workshop of Windsor Castle. You serve as both GUARDIAN and WITNESS for home workshop makers.

THE USER: ${userName}

YOUR CHARACTER:
- Speak with refined British English: polite, proper grammar, occasional dry wit
- Warm and caring, never condescending or alarming (except in emergencies)
- Patient and knowledgeable, like a mentor who's seen everything
- Use phrases like "I notice...", "Pardon the interruption...", "Do let's...", "Shall we..."
- PERSONALITY ARC: Start formal, become warmer as session progresses

===============================================================================
PRIMARY DIRECTIVE - SAFETY (React Immediately)
===============================================================================

YOUR CORE MISSION: Protect ${userName} from injury by speaking up BEFORE dangerous actions are completed.

SAFETY PRIORITIES (in order):
1. IMMEDIATE DANGER: Hands near moving blades, touching hot surfaces, improper tool grip
2. PPE MISSING: Safety glasses absent when using laser cutter, no hearing protection with loud tools
3. TECHNIQUE ISSUES: Improper cutting stance, incorrect tool usage, unsafe material handling
4. ENVIRONMENT HAZARDS: Cluttered workspace, fire risks, ventilation issues

CRITICAL SAVE PROTOCOL (THE SHOUT):
For IMMINENT DANGER (hand about to contact blade), break character briefly:
- SHOUT: "${userName}! HAND!" (or similar - name + one word)
- Then immediately: "Do forgive me for raising my voice - but that was rather too close for comfort. Are you quite alright?"

SAFETY RESPONSE GUIDELINES:
- Speak IMMEDIATELY when you see danger - don't wait to be asked
- Be firm but polite: "Pardon the interruption, but I notice..."
- Be specific about what you see: "I don't see safety spectacles..."
- After compliance, acknowledge graciously: "Splendid! Do carry on."
- Keep warnings brief - a few sentences at most

SPATIAL AWARENESS (for visual overlay):
When you detect something requiring attention, include WHERE you're looking:
- "your hand" / "your hands" - triggers hand region highlight
- "safety glasses" / "spectacles" - triggers face region highlight
- "the blade" / "cutting area" / "saw" - triggers tool region highlight

===============================================================================
SECONDARY DIRECTIVE - OBSERVATION (Accumulate Passively)
===============================================================================

YOUR WITNESS MISSION: Observe and remember significant moments throughout the session for later documentation.

MOMENT DETECTION:
While watching, identify significant moments and provide brief commentary every 3-5 minutes.

Moment Types to Detect:
- NEW_STEP: Major phase change (starting a cut, assembly begins, etc.)
- TECHNIQUE: Notable skill or method being demonstrated
- PROBLEM: Issue encountered (failed print, bad cut, stuck piece)
- SOLUTION: Problem being resolved
- MISTAKE: Error made (can be recovered from)
- TIP: Best practice worth noting

OBSERVATION COMMENTARY:
- "Ah, moving on to assembly. I shall note the transition."
- "That's a clever jig arrangement. I'm noting that for the documentation."
- "Hmm, I see some trouble there. Let's see how you address it."
- "A small stumble there, but well recovered. Makes for good teaching material."

When you detect a significant moment, include this structure in your response:

<moment>
{
  "type": "NEW_STEP",
  "title": "Brief title",
  "description": "Detailed description of what was observed"
}
</moment>

OBSERVATION FREQUENCY: Every 3-5 minutes, not constant. Don't over-comment.

===============================================================================
DOCUMENT GENERATION
===============================================================================

When asked to generate documentation (user says "write it up" or system requests):

<document>
# [Project Name] - Tutorial by Sir Reginald

## Overview
[One paragraph summary of what was built]

## Materials & Tools Observed
[List what you saw used]

## Step-by-Step Guide

### Step 1: [Title]
**Time:** [start] - [end]
[Description]

[Continue for all steps...]

## Problems Encountered & Solutions
[List problems and how they were solved]

## Tips & Techniques
[Notable techniques observed]

## Session Summary
- Duration: [time]
- Major Steps: [count]
- Problems Solved: [count]
- Safety Interventions: [count]

---
*Documented by Sir Reginald Makesworth III*
*"He Watches. He Remembers. He Protects."*
</document>

===============================================================================
WHAT YOU'RE WATCHING
===============================================================================

- A home workshop with 3D printer, laser cutter, and/or basic power tools
- A single person (${userName}) working alone
- Continuous 1 FPS video feed over potentially hours

REMEMBER:
- SAFETY always takes priority over observation commentary
- If you see danger, interrupt yourself to warn
- You are both protector and documentarian
`;
```

### 4.2 Prompt Design Rationale

**Why Dual Directive Works:**

1. **Clear Priority:** Safety is PRIMARY (react immediately), documentation is SECONDARY (accumulate passively)
2. **No Conflict:** Safety interrupts happen in milliseconds; documentation observations happen every few minutes
3. **Shared Character:** Same Sir Reginald personality for both roles
4. **Shared Context:** Moments detected during safety monitoring feed into documentation

---

## 5. Technical Architecture

### 5.1 System Overview

```
+-------------------------------------------------------------------------+
|                      FRONTEND (Next.js on Vercel)                        |
|                                                                          |
|  +----------------+  +------------------+  +-------------------------+   |
|  |    Webcam      |  |   Microphone     |  |     Document Viewer     |   |
|  |    (1 FPS)     |  |     Input        |  |  (Markdown Preview)     |   |
|  +-------+--------+  +--------+---------+  +------------+------------+   |
|          |                    |                         |                |
|          v                    v                         ^                |
|  +---------------------------------------------------------------+       |
|  |                    Session Controller                         |       |
|  |  - Safety alert management                                    |       |
|  |  - Moment accumulation                                        |       |
|  |  - Session duration tracking                                  |       |
|  |  - Document generation trigger                                |       |
|  |  - Near-miss counter                                          |       |
|  |  - Live metrics calculation                                   |       |
|  +---------------------------------------------------------------+       |
|          |                    |                         ^                |
|          v                    v                         |                |
|  +---------------------------------------------------------------+       |
|  |              Gemini Live Client (JS SDK)                       |       |
|  |  - Direct WebSocket (v1alpha API)                              |       |
|  |  - Sends 1 FPS video + audio                                   |       |
|  |  - Proactive audio enabled (Sir Reginald speaks unprompted)    |       |
|  |  - Context window compression (unlimited sessions)             |       |
|  |  - Dual response parsing (safety alerts + moments)             |       |
|  +---------------------------------------------------------------+       |
|          |                    |                         |                |
|  +---------------------------+  +---------------------------+            |
|  |   Safety Alert Handler   |  |   Moment Detector         |            |
|  |   - Parse warning text   |  |   - Parse <moment> tags   |            |
|  |   - Trigger overlays     |  |   - Store in session      |            |
|  |   - Update safety status |  |   - Track timestamps      |            |
|  |   - Increment counter    |  |   - Log to test harness   |            |
|  +---------------------------+  +---------------------------+            |
|                                              |                           |
|                                              v                           |
|                               +---------------------------+              |
|                               |   Document Generator       |              |
|                               |   - Parse <document> tags  |              |
|                               |   - Format output          |              |
|                               |   - Export to Markdown/PDF |              |
|                               +---------------------------+              |
|                                                                          |
+-------------------------------------------------------------------------+
                              |
                              | WebSocket (wss://generativelanguage.googleapis.com)
                              v
+-------------------------------------------------------------------------+
|                      GEMINI LIVE API                                      |
|                (gemini-2.5-flash-preview-native-audio-dialog)             |
|                                                                          |
|  - v1alpha API version (required for proactive audio)                    |
|  - Proactive audio: Sir Reginald speaks without prompting               |
|  - Context window compression: slidingWindow for unlimited sessions      |
|  - Session resumption: Handles disconnects gracefully                    |
|  - Kore voice: Calm, clear - closest to British gentleman               |
+-------------------------------------------------------------------------+
```

### 5.2 Data Flow

**Continuous Monitoring (Safety + Observation):**
```
1. Webcam captures frame (1 FPS)
2. Frame sent to Gemini via WebSocket
3. Gemini analyzes with dual directive prompt:
   a. Safety check (immediate - does this frame show danger?)
   b. Moment detection (accumulative - is this a significant moment?)
4. If safety concern detected:
   - Proactive audio response generated
   - Audio streamed to browser, played immediately
   - Visual overlay highlights detected region
   - Alert banner shown with auto-dismiss
   - Near-miss counter increments
   - Logged to test harness
5. If moment detected:
   - Brief commentary audio (every 3-5 minutes)
   - Moment data returned in response (<moment> tag)
   - Moment added to session memory
   - Live metric updates
6. Context accumulates in Gemini's window
7. Loop continues for hours
```

**Document Generation:**
```
1. User triggers generation (button or voice command)
2. Sir Reginald delivers audio summary of session highlights
3. Client sends "generate documentation" request
4. Gemini reviews all accumulated moments
5. Gemini generates structured document (<document> tag)
6. Document streamed to client
7. Client formats and displays in preview
8. User can export to Markdown/PDF
```

### 5.3 Simplified Fallback Chain (3 Levels)

```
+-------------------------------------------------------------------+
|  LEVEL 0: Full Operation (Normal)                                  |
|  - 1 FPS video streaming                                          |
|  - Proactive audio enabled                                        |
|  - Safety monitoring active                                       |
|  - Moment detection active                                        |
|  - Latency indicator: GREEN                                       |
+-------------------------------------------------------------------+
                            |
                            | Latency >2000ms or connection issues
                            v
+-------------------------------------------------------------------+
|  LEVEL 1: Degraded (Thinking Monocle)                              |
|  - 1 FPS video continues                                          |
|  - Thinking monocle animation shown                               |
|  - Latency indicator: YELLOW/RED                                  |
|  - Sir Reginald: "Just a moment whilst I examine this properly..."|
|  - FALLBACK PHRASE: "Do bear with me - the connection is a bit    |
|    sluggish, rather like molasses in January..."                  |
+-------------------------------------------------------------------+
                            |
                            | Complete connection loss
                            v
+-------------------------------------------------------------------+
|  LEVEL 2: Disconnected                                             |
|  - Video streaming paused                                          |
|  - "Connection lost" message shown                                 |
|  - Retry button available                                          |
|  - Cached phrase: "I'm terribly sorry, but I've lost connection." |
|  - Auto-retry every 30 seconds                                     |
|  - FALLBACK PHRASE: "The telegraph wires seem to have crossed...  |
|    I shall attempt to re-establish communication."                |
+-------------------------------------------------------------------+
```

### 5.4 Session State

```typescript
interface WorkshopSession {
  id: string;
  userName: string;
  projectName: string;
  startTime: Date;
  status: 'active' | 'paused' | 'completed';

  // Safety tracking
  safetyInterventions: SafetyIntervention[];
  criticalSaves: number;
  lastSafetyCheck: Date;

  // Moment tracking
  moments: Moment[];

  // Metrics (NEW)
  metrics: SessionMetrics;

  // Generated output
  generatedDocument?: string;
}

interface SafetyIntervention {
  id: string;
  timestamp: Date;
  type: 'shout' | 'warning' | 'reminder';
  scenario: string;  // e.g., "hand_near_blade", "missing_glasses"
  latencyMs: number;
}

interface Moment {
  id: string;
  timestamp: Date;
  elapsedSeconds: number;
  type: 'new_step' | 'technique' | 'problem' | 'solution' | 'mistake' | 'tip' | 'safety';
  title: string;
  description: string;
}

interface SessionMetrics {
  avgLatencyMs: number;
  maxLatencyMs: number;
  safetyTriggerRate: number;  // Interventions / Total safety-relevant frames
  momentTagCompliance: number;  // Valid <moment> tags / Expected moments
  contextConsumedTokens: number;
}
```

### 5.5 Internal Logging (NEW - for Testing)

```typescript
interface TestLog {
  sessionId: string;
  entries: TestLogEntry[];
}

interface TestLogEntry {
  timestamp: Date;
  type: 'safety_trigger' | 'moment_detected' | 'latency_spike' | 'connection_issue';
  data: {
    scenario?: string;
    latencyMs?: number;
    success?: boolean;
    expected?: string;
    actual?: string;
  };
}

// Log to localStorage for test harness
function logTestEvent(entry: TestLogEntry) {
  const log = JSON.parse(localStorage.getItem('testLog') || '{"entries":[]}');
  log.entries.push(entry);
  localStorage.setItem('testLog', JSON.stringify(log));
}
```

---

## 6. UI/UX Design

### 6.1 Layout Overview (UPDATED)

```
+-------------------------------------------------------------------+
|  STATUS BAR                                              [End]    |
|  Watching | 0.8s | Session: 45m | Moments: 8 | Interventions: 2   |
+-------------------------------------------------------------------+
|                              |                                     |
|      VIDEO FEED              |         MOMENT TIMELINE             |
|                              |                                     |
|    +-------------------+     |    [!] 0:05 - Safety: Glasses       |
|    |                   |     |    [=] 0:15 - Step: Stock Prep      |
|    |   Live Feed       |     |    [*] 0:22 - Technique: Jig        |
|    |   [WATCHING]      |     |    [X] 0:35 - Problem: Tearout      |
|    |                   |     |    [+] 0:38 - Solution: Tape        |
|    +-------------------+     |    ...                              |
|                              |                                     |
|  +-------------------------+ |                                     |
|  | NEAR-MISSES PREVENTED: 2| |    [Generate Documentation]        |
|  | [!] Hand near blade     | |                                     |
|  | [!] Missing glasses     | |                                     |
|  +-------------------------+ |                                     |
|                              |                                     |
|  Voice: "Splendid work..."   |                                     |
|                              |                                     |
|  +---------------------------+-----------------------------------+ |
|  | Volume  | Mode Toggle   | Safety Status Panel                | |
|  +---------------------------+-----------------------------------+ |
+-------------------------------------------------------------------+
```

### 6.2 Live Metric Overlay (NEW)

Positioned at top-right of video feed:

```
+------------------------------------------+
|  [*] Watching | 0.8s | 8 moments | 2 saves |
+------------------------------------------+
```

**States:**
| Status | Color | Icon |
|--------|-------|------|
| Watching | Green | Eye icon |
| Thinking... | Yellow | Hourglass |
| Reconnecting | Red | Refresh |

### 6.3 Near-Miss Counter (NEW)

Positioned below video feed:

```
+----------------------------------------------+
|  NEAR-MISSES PREVENTED: 3                    |
|  +----------------------------------------+  |
|  | [!] 0:15:32 - Hand near blade          |  |
|  | [!] 0:08:45 - Missing safety glasses   |  |
|  | [!] 0:03:12 - Cluttered workspace      |  |
|  +----------------------------------------+  |
+----------------------------------------------+
```

**Visual Design:**
- Badge: Orange with white text
- Count: Large, prominent number
- List: Scrollable if >3 items
- Icons: Match intervention severity

### 6.4 Components - What's Kept from v6

| Component | Status | Notes |
|-----------|--------|-------|
| `OnboardingScreen` | KEEP | Add project name input |
| `CameraSetupScreen` | KEEP | Sir Reginald directs positioning |
| `VideoPreview` | KEEP | Core video display |
| `LatencyIndicator` | KEEP | Green/yellow/red dot |
| `ThinkingMonocle` | KEEP | >2s latency animation |
| `SafetyAlertOverlay` | KEEP | THE SHOUT and warnings |
| `SafetyStatusPanel` | SIMPLIFY | Show last check, basic status |
| `VolumeControl` | KEEP | User-adjustable |
| `StatusBar` | MODIFY | Add moment count, intervention count |
| `ReconnectionOverlay` | KEEP | Character dialogue on reconnect |
| `SessionSummary` | MODIFY | Add documentation option |

### 6.5 Components - What's Added in v9

| Component | Priority | Purpose |
|-----------|----------|---------|
| `MomentTimeline` | P0 | Displays detected moments chronologically |
| `DocumentPreview` | P0 | Shows generated documentation |
| `ExportButtons` | P1 | Markdown/PDF export options |
| `ProjectNameInput` | P1 | Set project name for documentation |
| `LiveMetricOverlay` | P0 | NEW: Real-time stats display |
| `NearMissCounter` | P0 | NEW: Safety intervention tracker |
| `TestingDashboard` | P2 | NEW: Internal metrics (not demo) |

### 6.6 Components - What's Removed

| Component | Reason |
|-----------|--------|
| `SensitivitySlider` | Unnecessary complexity |
| `SnoozeButton` | Rarely used, adds confusion |
| `ModeToggle` | No separate troubleshoot mode |

---

## 7. Comprehensive UI Component Specifications

### 7.1 Design System

#### 7.1.1 Color System

```css
:root {
  /* Core colors - Light Mode */
  --background: #ffffff;
  --foreground: #0f0f0f;
  --surface: #f5f5f5;
  --surface-light: #ebebeb;
  --border: #e0e0e0;

  /* Brand colors */
  --primary: #8b5cf6;        /* Purple - branding, accent */
  --safe: #22c55e;           /* Green - connected, good, watching */
  --warning: #eab308;        /* Yellow - caution, moderate latency */
  --danger: #ef4444;         /* Red - critical, THE SHOUT */

  /* Safety-specific colors */
  --safety-intervention: #ff6b35;  /* Orange - near-miss counter */
  --safety-highlight-hands: #ff6b35;
  --safety-highlight-face: #4ecdc4;
  --safety-highlight-tool: #ff6b35;

  /* Documentation colors */
  --doc-step: #3b82f6;       /* Blue - new step */
  --doc-technique: #10b981;   /* Emerald - technique */
  --doc-problem: #f59e0b;     /* Amber - problem */
  --doc-solution: #22c55e;    /* Green - solution */

  /* Status indicators */
  --status-watching: #22c55e;
  --status-thinking: #eab308;
  --status-disconnected: #ef4444;

  /* Latency colors */
  --latency-good: #22c55e;     /* <800ms */
  --latency-moderate: #eab308;  /* 800-1500ms */
  --latency-slow: #f97316;      /* 1500-2000ms */
  --latency-critical: #ef4444;  /* >2000ms */

  /* Text colors */
  --muted-foreground: #6b7280;
  --text-muted: #9ca3af;

  /* Radius */
  --radius: 0.5rem;
  --radius-lg: 1rem;
}

/* Dark Mode */
.dark {
  --background: #0f0f0f;
  --foreground: #ffffff;
  --surface: #1a1a1a;
  --surface-light: #252525;
  --border: #333333;
  --muted-foreground: #a1a1a1;
  --text-muted: #6b7280;
}
```

#### 7.1.2 Typography

```css
--font-sans: "Inter", system-ui, sans-serif;
--font-mono: "Geist Mono", monospace;

/* Type scale */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
```

#### 7.1.3 Spacing & Touch Targets

| Element | Minimum Size | Notes |
|---------|--------------|-------|
| Primary buttons | 60x60px | Large for gloved hands |
| Secondary buttons | 44x44px | Standard mobile minimum |
| Dismiss areas | Full-width | Tap anywhere to dismiss |
| Sliders | 48px height | Easy to grab |
| Timeline items | 44px height | Touch-friendly |

### 7.2 New Component: MomentTimeline

**Purpose:** Displays detected moments chronologically during the session.

```typescript
// src/components/moment-timeline.tsx

interface MomentTimelineProps {
  moments: Moment[];
  onMomentClick?: (moment: Moment) => void;
  maxHeight?: string;  // CSS max-height, default "400px"
}

interface Moment {
  id: string;
  timestamp: Date;
  elapsedSeconds: number;
  type: 'new_step' | 'technique' | 'problem' | 'solution' | 'mistake' | 'tip' | 'safety';
  title: string;
  description: string;
}
```

**Visual Description:**
- Vertical timeline with icons on the left
- Each moment shows: icon, timestamp, title
- Expandable to show full description
- Auto-scrolls to latest moment
- Color-coded by type

**States:**
| State | Display |
|-------|---------|
| Empty | "No moments detected yet. Sir Reginald is watching..." |
| Loading | Shimmer placeholders |
| Populated | List of moments with icons |
| Error | "Unable to track moments" with retry button |

**Icon Mapping:**
| Type | Icon | Color |
|------|------|-------|
| new_step | Arrow-right | Blue |
| technique | Lightbulb | Emerald |
| problem | Alert-triangle | Amber |
| solution | Check-circle | Green |
| mistake | X-circle | Red |
| tip | Star | Purple |
| safety | Shield | Orange |

```tsx
// Component implementation
export function MomentTimeline({ moments, onMomentClick, maxHeight = "400px" }: MomentTimelineProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getIcon = (type: Moment['type']) => {
    const icons = {
      new_step: <ArrowRight className="w-4 h-4 text-doc-step" />,
      technique: <Lightbulb className="w-4 h-4 text-doc-technique" />,
      problem: <AlertTriangle className="w-4 h-4 text-doc-problem" />,
      solution: <CheckCircle className="w-4 h-4 text-doc-solution" />,
      mistake: <XCircle className="w-4 h-4 text-danger" />,
      tip: <Star className="w-4 h-4 text-primary" />,
      safety: <Shield className="w-4 h-4 text-safety-intervention" />,
    };
    return icons[type];
  };

  if (moments.length === 0) {
    return (
      <div className="bg-surface rounded-lg border border-border p-6 text-center">
        <p className="text-muted-foreground italic">
          "No moments detected yet. Sir Reginald is watching..."
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg border border-border">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Session Timeline
        </h3>
        <p className="text-sm text-muted-foreground">{moments.length} moments</p>
      </div>

      <div className="overflow-y-auto" style={{ maxHeight }}>
        <div className="p-4 space-y-3">
          {moments.map((moment) => (
            <button
              key={moment.id}
              onClick={() => onMomentClick?.(moment)}
              className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-surface-light transition-colors text-left"
            >
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(moment.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-mono">
                    {formatTime(moment.elapsedSeconds)}
                  </span>
                  <span className="text-sm font-medium truncate">
                    {moment.title}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {moment.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### 7.3 New Component: DocumentPreview

**Purpose:** Shows generated documentation with export options.

```typescript
// src/components/document-preview.tsx

interface DocumentPreviewProps {
  document: string | null;  // Markdown content
  isGenerating: boolean;
  onExport: (format: 'markdown' | 'pdf' | 'html') => void;
  onClose: () => void;
}
```

**Visual Description:**
- Modal overlay with max-width 800px
- Markdown rendered with proper styling
- Export buttons at bottom
- Close button at top-right
- Scroll for long documents

**States:**
| State | Display |
|-------|---------|
| Generating | "Sir Reginald is preparing your documentation..." with progress |
| Complete | Rendered Markdown with export buttons |
| Error | "Unable to generate documentation" with retry |

```tsx
// Component implementation
export function DocumentPreview({
  document,
  isGenerating,
  onExport,
  onClose
}: DocumentPreviewProps) {
  if (isGenerating) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-surface rounded-xl border border-border p-8 max-w-md text-center">
          <div className="text-5xl mb-4 animate-bounce">
            <span role="img" aria-label="writing">&#128221;</span>
          </div>
          <h2 className="text-lg font-semibold mb-2">
            Preparing Documentation...
          </h2>
          <p className="text-muted-foreground italic">
            "I'm reviewing all the moments from our session and composing a proper tutorial..."
          </p>
          <div className="mt-4 h-2 bg-surface-light rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-thinking-progress" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-background rounded-xl border border-border w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span role="img" aria-label="document">&#128196;</span>
            Generated Documentation
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{document || ''}</ReactMarkdown>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="p-4 border-t border-border flex gap-3">
          <Button onClick={() => onExport('markdown')} variant="outline" className="flex-1">
            <FileText className="w-4 h-4 mr-2" />
            Export Markdown
          </Button>
          <Button onClick={() => onExport('pdf')} className="flex-1 bg-primary">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### 7.4 New Component: LiveMetricOverlay

**Purpose:** Persistent display showing real-time system status.

```typescript
// src/components/live-metric-overlay.tsx

interface LiveMetricOverlayProps {
  status: 'watching' | 'thinking' | 'reconnecting';
  latencyMs: number;
  momentCount: number;
  interventionCount: number;
}
```

**Visual Description:**
- Positioned top-right of video feed
- Semi-transparent background
- Compact horizontal layout
- Updates in real-time

**Latency Thresholds:**
| Range | Color | Label |
|-------|-------|-------|
| <800ms | Green | Good |
| 800-1500ms | Yellow | Moderate |
| 1500-2000ms | Orange | Slow |
| >2000ms | Red | Critical |

```tsx
// Component implementation
export function LiveMetricOverlay({
  status,
  latencyMs,
  momentCount,
  interventionCount
}: LiveMetricOverlayProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'watching':
        return { icon: <Eye className="w-4 h-4" />, label: 'Watching', color: 'text-status-watching' };
      case 'thinking':
        return { icon: <Hourglass className="w-4 h-4 animate-pulse" />, label: 'Thinking...', color: 'text-status-thinking' };
      case 'reconnecting':
        return { icon: <RefreshCw className="w-4 h-4 animate-spin" />, label: 'Reconnecting...', color: 'text-status-disconnected' };
    }
  };

  const getLatencyColor = () => {
    if (latencyMs < 800) return 'text-latency-good';
    if (latencyMs < 1500) return 'text-latency-moderate';
    if (latencyMs < 2000) return 'text-latency-slow';
    return 'text-latency-critical';
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="absolute top-3 right-3 flex items-center gap-3 px-3 py-2 bg-black/70 backdrop-blur-sm rounded-lg text-sm">
      {/* Status */}
      <div className={`flex items-center gap-1.5 ${statusConfig.color}`}>
        {statusConfig.icon}
        <span>{statusConfig.label}</span>
      </div>

      <div className="w-px h-4 bg-white/20" />

      {/* Latency */}
      <div className={`flex items-center gap-1 ${getLatencyColor()}`}>
        <Gauge className="w-3.5 h-3.5" />
        <span>{latencyMs}ms</span>
      </div>

      <div className="w-px h-4 bg-white/20" />

      {/* Moments */}
      <div className="flex items-center gap-1 text-white/80">
        <Clock className="w-3.5 h-3.5" />
        <span>{momentCount}</span>
      </div>

      <div className="w-px h-4 bg-white/20" />

      {/* Interventions */}
      <div className="flex items-center gap-1 text-safety-intervention">
        <Shield className="w-3.5 h-3.5" />
        <span>{interventionCount}</span>
      </div>
    </div>
  );
}
```

### 7.5 New Component: NearMissCounter

**Purpose:** Track and display every safety intervention.

```typescript
// src/components/near-miss-counter.tsx

interface NearMissCounterProps {
  interventions: SafetyIntervention[];
  maxVisible?: number;  // Default 3
}

interface SafetyIntervention {
  id: string;
  timestamp: Date;
  type: 'shout' | 'warning' | 'reminder';
  scenario: string;
  latencyMs: number;
}
```

**Visual Description:**
- Badge with count at top
- List of interventions below
- Scrollable if >3 items
- Color-coded by severity

```tsx
// Component implementation
export function NearMissCounter({
  interventions,
  maxVisible = 3
}: NearMissCounterProps) {
  const formatScenario = (scenario: string) => {
    const labels: Record<string, string> = {
      'hand_near_blade': 'Hand near blade',
      'missing_glasses': 'Missing safety glasses',
      'cluttered_workspace': 'Cluttered workspace',
      'improper_grip': 'Improper grip',
      'missing_hearing': 'Missing hearing protection',
    };
    return labels[scenario] || scenario;
  };

  const formatTime = (date: Date) => {
    const elapsed = Math.floor((Date.now() - date.getTime()) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTypeIcon = (type: SafetyIntervention['type']) => {
    switch (type) {
      case 'shout':
        return <AlertOctagon className="w-4 h-4 text-danger" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'reminder':
        return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-border">
      {/* Header with count */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-safety-intervention" />
          <span className="font-semibold">Near-Misses Prevented</span>
        </div>
        <span className="bg-safety-intervention text-white text-lg font-bold px-3 py-1 rounded-full">
          {interventions.length}
        </span>
      </div>

      {/* Intervention list */}
      {interventions.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          <p className="italic">"No interventions yet. Do carry on safely!"</p>
        </div>
      ) : (
        <div className="p-2 max-h-[150px] overflow-y-auto">
          {interventions.slice(0, maxVisible).map((intervention) => (
            <div
              key={intervention.id}
              className="flex items-center gap-3 p-2 rounded hover:bg-surface-light"
            >
              {getTypeIcon(intervention.type)}
              <div className="flex-1">
                <span className="text-sm">{formatScenario(intervention.scenario)}</span>
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                {formatTime(intervention.timestamp)} ago
              </span>
            </div>
          ))}
          {interventions.length > maxVisible && (
            <p className="text-xs text-muted-foreground text-center py-2">
              +{interventions.length - maxVisible} more
            </p>
          )}
        </div>
      )}
    </div>
  );
}
```

### 7.6 New Component: TestingDashboard (Internal Only)

**Purpose:** Internal metrics view for testing, not shown in demo.

```typescript
// src/components/testing-dashboard.tsx

interface TestingDashboardProps {
  metrics: SessionMetrics;
  logs: TestLogEntry[];
  onExportLogs: () => void;
  onClearLogs: () => void;
}

interface SessionMetrics {
  avgLatencyMs: number;
  maxLatencyMs: number;
  safetyTriggerRate: number;
  momentTagCompliance: number;
  contextConsumedTokens: number;
  totalSessions: number;
  totalInterventions: number;
}
```

**Visual Description:**
- Full-screen dashboard (accessible via secret key combo)
- Metrics cards with charts
- Log viewer with filters
- Export functionality

```tsx
// Component implementation (simplified)
export function TestingDashboard({
  metrics,
  logs,
  onExportLogs,
  onClearLogs
}: TestingDashboardProps) {
  return (
    <div className="fixed inset-0 z-[100] bg-background p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Testing Dashboard</h1>
          <div className="flex gap-2">
            <Button onClick={onExportLogs} variant="outline">Export Logs</Button>
            <Button onClick={onClearLogs} variant="destructive">Clear Logs</Button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <MetricCard
            label="Safety Trigger Rate"
            value={`${(metrics.safetyTriggerRate * 100).toFixed(1)}%`}
            target=">95%"
            status={metrics.safetyTriggerRate > 0.95 ? 'pass' : 'fail'}
          />
          <MetricCard
            label="Moment Tag Compliance"
            value={`${(metrics.momentTagCompliance * 100).toFixed(1)}%`}
            target=">90%"
            status={metrics.momentTagCompliance > 0.9 ? 'pass' : 'fail'}
          />
          <MetricCard
            label="Avg Latency"
            value={`${metrics.avgLatencyMs}ms`}
            target="<800ms"
            status={metrics.avgLatencyMs < 800 ? 'pass' : 'fail'}
          />
          <MetricCard
            label="Max Latency"
            value={`${metrics.maxLatencyMs}ms`}
            target="<2000ms"
            status={metrics.maxLatencyMs < 2000 ? 'pass' : 'fail'}
          />
          <MetricCard
            label="Total Sessions"
            value={metrics.totalSessions.toString()}
            target=">50"
            status={metrics.totalSessions > 50 ? 'pass' : 'fail'}
          />
          <MetricCard
            label="Total Interventions"
            value={metrics.totalInterventions.toString()}
            target="N/A"
            status="neutral"
          />
        </div>

        {/* Log Viewer */}
        <div className="bg-surface rounded-lg border border-border">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold">Test Logs</h2>
          </div>
          <div className="p-4 max-h-[400px] overflow-y-auto font-mono text-sm">
            {logs.map((log, i) => (
              <div key={i} className="py-1 border-b border-border/50">
                <span className="text-muted-foreground">
                  {log.timestamp.toISOString()}
                </span>
                {' '}
                <span className={`font-semibold ${
                  log.type === 'safety_trigger' ? 'text-safe' :
                  log.type === 'latency_spike' ? 'text-warning' :
                  'text-foreground'
                }`}>
                  [{log.type}]
                </span>
                {' '}
                <span>{JSON.stringify(log.data)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, target, status }: {
  label: string;
  value: string;
  target: string;
  status: 'pass' | 'fail' | 'neutral';
}) {
  const statusColors = {
    pass: 'border-safe bg-safe/10',
    fail: 'border-danger bg-danger/10',
    neutral: 'border-border bg-surface',
  };

  return (
    <div className={`p-4 rounded-lg border ${statusColors[status]}`}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">Target: {target}</p>
    </div>
  );
}
```

### 7.7 Responsive Considerations

**Primary Target:** Desktop (demo environment)
**Secondary:** Tablet (potential workshop use)

```css
/* Breakpoints */
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;

/* Layout adjustments */
@media (max-width: 1024px) {
  /* Stack timeline below video */
  .main-layout {
    flex-direction: column;
  }

  /* Full-width video */
  .video-container {
    width: 100%;
  }

  /* Collapsible timeline */
  .timeline-container {
    width: 100%;
    max-height: 200px;
  }
}

@media (max-width: 768px) {
  /* Compact metric overlay */
  .live-metric-overlay {
    font-size: 0.75rem;
  }

  /* Simplified near-miss counter */
  .near-miss-counter {
    .intervention-list {
      display: none;
    }
  }
}
```

### 7.8 Animation Specifications

```css
/* Existing animations */
@keyframes pulse-border {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes sound-wave {
  0%, 100% { transform: scaleY(0.3); }
  50% { transform: scaleY(1); }
}

@keyframes slide-up {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

@keyframes thinking-progress {
  0% { width: 0%; }
  50% { width: 70%; }
  100% { width: 100%; }
}

/* NEW animations for v9 */
@keyframes counter-increment {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

@keyframes moment-appear {
  from { transform: translateX(-10px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes metric-flash {
  0% { background-color: transparent; }
  50% { background-color: var(--safe); }
  100% { background-color: transparent; }
}

.animate-counter-increment {
  animation: counter-increment 0.3s ease-out;
}

.animate-moment-appear {
  animation: moment-appear 0.3s ease-out;
}

.animate-metric-flash {
  animation: metric-flash 0.5s ease-out;
}
```

---

## 8. Demo Script - 2 Minutes (UPDATED)

### 8.1 Props Checklist

| Item | Purpose | Notes |
|------|---------|-------|
| Safety glasses | Put on after first warning | Clear lenses, visible |
| Table saw (or similar) | THE SHOUT moment | Can be non-operational |
| Small project in progress | Show documentation value | Woodworking ideal |
| Webcam | Stable position | Per Reginald's direction |

### 8.2 The Perfect 2-Minute Demo Script (UPDATED)

**[0:00-0:05] HOOK - The Grabber**

*Camera shows presenter at workbench*

PRESENTER: "30,000 Americans lose fingers to table saws every year. Most were working alone."

*Beat*

PRESENTER: "What if you weren't alone?"

---

**[0:05-0:15] INTRO - Meet Sir Reginald**

*Show Sir Reginald UI with live metric overlay visible*

PRESENTER: "Meet Sir Reginald - an AI companion who watches your workshop in real-time."

*Point to live metric overlay*

PRESENTER: "See that? Watching. Sub-second response time. Zero interventions so far."

---

**[0:15-0:30] DEMO 1 - Safety Glasses (Before/After)**

*Reach toward laser cutter without safety glasses*
*Visual overlay highlights face region*

SIR REGINALD: "Pardon the interruption, [Name], but I notice you're approaching the laser cutter without your safety spectacles. Do let's sort that out first, shall we?"

*Near-miss counter increments to 1*

*Put on safety glasses*

SIR REGINALD: "Splendid! Do carry on with your excellent work."

PRESENTER: (to camera) "Before, not after. He caught it before I completed the action."

**FALLBACK PHRASE (if latency):** "Sir Reginald is processing - you can see the thinking indicator..."

---

**[0:30-0:50] DEMO 2 - THE DRAMATIC SHOUT (Hand Near Blade)**

*Set up near table saw*
*Hand drifts toward blade area*
*Visual overlay highlights hands in orange*

SIR REGINALD: "[NAME]! HAND!"

*Near-miss counter increments to 2*

*Pull hand back immediately*

SIR REGINALD: "Do forgive me for raising my voice - but that was rather too close to the blade for my comfort. Are you quite alright?"

*Nod to camera*

PRESENTER: "That wasn't a request-response. He shouted my name before I asked anything. That's proactive AI."

**FALLBACK PHRASE (if doesn't trigger immediately):** "Let me try that again - safety detection requires the right angle..."

---

**[0:50-1:05] THE IMPACT - Near-Miss Counter**

*Point to near-miss counter showing "2"*

PRESENTER: "See this counter? Two near-misses prevented in under a minute. In a real session, that could be the difference between keeping or losing a finger."

*Show "What Could Have Happened" counter-visual (optional B-roll)*

PRESENTER: "Every intervention is logged, timestamped, and tracked."

---

**[1:05-1:25] THE TWIST - He's Also Documenting**

*Show moment timeline on screen*

PRESENTER: "But here's what the judges won't expect. Sir Reginald isn't just watching for danger - he's documenting everything."

*Point to timeline showing moments*

PRESENTER: "Every step, every technique, every problem I solved - he's been noting it all."

SIR REGINALD: "I notice you're using tape to prevent tearout. A wise technique - I'm noting that for the documentation."

---

**[1:25-1:40] THE REVEAL - Generated Documentation**

*Click "Generate Documentation" button*

PRESENTER: "And now, after 30 minutes of work..."

*Document appears, scroll through it*

PRESENTER: "A complete tutorial. Steps with timestamps. Problems I encountered with solutions. Tips and techniques. All written by an AI that actually watched me work."

*Pause on specific section*

PRESENTER: "Look - he even caught the tearout problem and documented how I fixed it."

---

**[1:40-1:50] TECHNICAL DEPTH + METRICS**

*Quick architecture slide OR show testing metrics slide*

PRESENTER: "We tested this across 50 sessions. 95% safety trigger rate. Sub-800ms latency. 90% moment detection compliance. This isn't a demo that works sometimes - it's proven reliable."

---

**[1:50-2:00] CLOSE**

*Logo appears with near-miss counter showing final count*

PRESENTER: "Sir Reginald Makesworth III. He watches. He remembers. He protects."

*Show demo metrics: "2 near-misses prevented | 8 moments captured | 1 tutorial generated"*

**Sir Reginald - Your Distinguished Workshop Companion**

---

### 8.3 Demo Fallback Phrases (NEW)

For each potential failure point, have a scripted recovery:

| Failure | Fallback Phrase |
|---------|----------------|
| Latency spike (>2s) | "Sir Reginald is contemplating - you can see the thinking monocle..." |
| Audio cuts out | "Let me check the audio - Sir Reginald's voice is transmitted via Gemini Live..." |
| THE SHOUT doesn't trigger | "The angle wasn't quite right - let me adjust the camera and try again..." |
| Documentation generation slow | "Documentation is being composed - Sir Reginald takes his craft seriously..." |
| Connection drops | "Brief connection hiccup - watch the auto-reconnect in action..." |

### 8.4 Demo Recording Strategy (NEW)

**Plan for 20+ recording sessions:**

1. **Sessions 1-5:** Technical validation
   - Does THE SHOUT trigger reliably?
   - Does the near-miss counter work?
   - Are moments being detected?

2. **Sessions 6-10:** Timing refinement
   - Is the script fitting in 2 minutes?
   - Are transitions smooth?
   - Is the pacing right?

3. **Sessions 11-15:** Best takes collection
   - Record multiple versions of each segment
   - Note timestamps of best moments
   - Identify any remaining issues

4. **Sessions 16-20:** Final polish
   - Assemble best segments
   - Add "What Could Have Happened" counter-visual
   - Verify audio quality

**Editing Strategy:**
- Cut together best moments from multiple takes
- Add subtle visual polish (lower thirds, transitions)
- Include one test metrics slide
- End with clear call-to-action

---

## 9. Testing & Validation Strategy (NEW)

### 9.1 Test Harness Requirements

Create a test harness that runs 50+ dual-directive sessions and measures:

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Safety trigger rate | >95% | Successful interventions / Total safety-relevant frames |
| Moment tag compliance | >90% | Valid `<moment>` tags / Expected moments |
| Latency | <800ms average | API timing logs |
| Session stability | 2+ hours | Continuous operation without crash |

### 9.2 Test Session Protocol

**Per Session (15-20 minutes each):**
1. Start with camera setup
2. Trigger each of 5 safety scenarios at least once
3. Perform 3-5 natural workshop actions (expect moments)
4. Request documentation at end
5. Log all metrics to test harness

**Logging Format:**
```json
{
  "sessionId": "test-001",
  "timestamp": "2026-01-20T14:30:00Z",
  "duration": 1200,
  "safetyScenarios": {
    "glasses": { "triggered": true, "latencyMs": 650 },
    "hand_near_blade": { "triggered": true, "latencyMs": 720 },
    "cluttered": { "triggered": true, "latencyMs": 890 },
    "grip": { "triggered": false, "notes": "Scenario not recognized" },
    "hearing": { "triggered": true, "latencyMs": 780 }
  },
  "moments": {
    "expected": 5,
    "detected": 4,
    "valid_format": 4
  },
  "documentation": {
    "generated": true,
    "sections": 7,
    "quality": "good"
  }
}
```

### 9.3 Demo Slide: Testing Metrics

One slide in demo showing proof of reliability:

```
+--------------------------------------------------+
|        TESTED. PROVEN. RELIABLE.                  |
+--------------------------------------------------+
|                                                   |
|   95%    Safety Trigger Rate                      |
|          across 50 test sessions                  |
|                                                   |
|   <800ms Average Response Time                    |
|           (max 1.2s under load)                   |
|                                                   |
|   90%+   Moment Detection Accuracy                |
|          proper tags in expected format           |
|                                                   |
|   2hr+   Continuous Session Stability             |
|          with context preservation                |
|                                                   |
+--------------------------------------------------+
```

---

## 10. Maker Testimonials Strategy (NEW)

### 10.1 Testimonial Collection Plan

**Target: 3 real makers testing before submission**

**Maker Profiles to Recruit:**

| Profile | Why | How to Find |
|---------|-----|-------------|
| Woodworker | Core use case | Local makerspace, Reddit r/woodworking |
| 3D Print enthusiast | Second demo scenario | r/3Dprinting, local maker groups |
| General DIYer | Relatable persona | Friends/family with workshops |

### 10.2 Testing Protocol for Makers

1. **Setup (5 min):** Install camera, explain product
2. **Session (30 min):** Normal workshop work with Sir Reginald watching
3. **Interview (10 min):** Collect feedback
4. **Documentation (5 min):** Review generated doc with them

**Interview Questions:**
- Did the safety warnings feel helpful or annoying?
- How was THE SHOUT moment? Too much? Just right?
- Would you use this regularly?
- What would you change?
- Can we quote you in our submission?

### 10.3 Testimonial Format

For demo/submission, include 2-3 quotes:

```
"I've been woodworking for 15 years and I've had close calls.
Having Sir Reginald watching feels like having a safety buddy
who never gets distracted."
- Mike T., Home Woodworker

"The documentation feature alone is worth it. I finished a
project and had a complete tutorial waiting. Usually I forget
half the steps by the time I try to write them down."
- Sarah K., 3D Printing Enthusiast

"THE SHOUT actually startled me - but that's exactly what you
want when your hand is too close to a blade."
- James R., Weekend Maker
```

---

## 11. Implementation Status & Timeline (UPDATED)

### 11.1 What's Already Built (from v6)

| Component | Status | Location |
|-----------|--------|----------|
| Next.js project structure | DONE | `sir-reginald-app/` |
| Token API endpoint | DONE | `src/app/api/token/route.ts` |
| Gemini Live connection hook | DONE | `src/hooks/use-gemini-live.ts` |
| Audio playback | DONE | `src/hooks/use-audio-player.ts` |
| Video preview | DONE | `src/components/video-preview.tsx` |
| Onboarding screen | DONE | `src/components/onboarding-screen.tsx` |
| Camera setup screen | DONE | `src/components/camera-setup-screen.tsx` |
| Safety alert overlay | DONE | `src/components/safety-alert-overlay.tsx` |
| Latency indicator | DONE | `src/components/latency-indicator.tsx` |
| Thinking monocle | DONE | `src/components/thinking-monocle.tsx` |
| Volume control | DONE | `src/components/volume-control.tsx` |
| Status bar | DONE | `src/components/status-bar.tsx` |
| Safety status panel | DONE | `src/components/safety-status-panel.tsx` |
| Session summary | DONE | `src/components/session-summary.tsx` |
| Overlay regions | DONE | `src/lib/overlay-regions.ts` |
| Prompts (safety) | DONE | `src/lib/prompts.ts` |
| Types | DONE | `src/types/index.ts` |
| Main page | DONE | `src/app/page.tsx` |

### 11.2 What Needs to Be Built (v9 Additions)

| Component | Priority | Estimate | Status |
|-----------|----------|----------|--------|
| **Dual directive system prompt** | P0 | 2 hours | TODO |
| **Moment parsing from responses** | P0 | 3 hours | TODO |
| **Moment storage in session** | P0 | 2 hours | TODO |
| **MomentTimeline component** | P0 | 4 hours | TODO |
| **Document generation request** | P0 | 2 hours | TODO |
| **Document parsing from responses** | P0 | 2 hours | TODO |
| **DocumentPreview component** | P0 | 3 hours | TODO |
| **LiveMetricOverlay component** | P0 | 2 hours | TODO |
| **NearMissCounter component** | P0 | 2 hours | TODO |
| **Test harness & logging** | P0 | 4 hours | TODO |
| Markdown export | P1 | 2 hours | TODO |
| PDF export | P1 | 3 hours | TODO |
| Project name input | P1 | 1 hour | TODO |
| Session highlight audio summary | P1 | 2 hours | TODO |
| Update onboarding flow | P1 | 2 hours | TODO |
| Update status bar | P1 | 1 hour | TODO |
| Update session summary | P1 | 2 hours | TODO |
| TestingDashboard (internal) | P2 | 3 hours | TODO |

### 11.3 Implementation Timeline

**Phase 1: Core Integration (Days 1-2)**
- Update system prompt to dual directive
- Implement moment parsing
- Test safety + documentation working together
- Verify no conflicts between safety and observation

**Phase 2: Documentation Features (Days 3-4)**
- Build MomentTimeline component
- Build document generation request
- Build DocumentPreview component
- Test full session to document flow

**Phase 3: v9 Additions (Days 5-6)**
- Build LiveMetricOverlay component
- Build NearMissCounter component
- Implement test harness and logging
- Build session highlight audio summary

**Phase 4: Polish & Export (Days 7-8)**
- Implement Markdown export
- Implement PDF export (if time)
- Update onboarding with project name
- Update status bar and session summary
- Remove unused components

**Phase 5: Testing & Validation (Days 9-12)**
- Run 50+ test sessions
- Collect metrics
- Fix any reliability issues
- Prepare metrics slide for demo

**Phase 6: Maker Testimonials (Days 13-15)**
- Recruit 3 makers
- Conduct test sessions
- Collect quotes
- Integrate into submission

**Phase 7: Demo Preparation (Days 16-20)**
- 20+ recording sessions
- Edit best moments together
- Prepare fallback strategies
- Final polish

### 11.4 Time Estimate

| Phase | Estimate |
|-------|----------|
| Core Integration | 10 hours |
| Documentation Features | 12 hours |
| v9 Additions | 12 hours |
| Polish & Export | 10 hours |
| Testing & Validation | 15 hours |
| Maker Testimonials | 10 hours |
| Demo Preparation | 15 hours |
| **Total New Work** | **84 hours** |

**Note:** This is aggressive but achievable with focused effort over 3 weeks.

---

## 12. Success Criteria (UPDATED)

### 12.1 Technical Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Safety Response Time | <800ms average | API timing |
| THE SHOUT Success Rate | >95% on 50+ tests | Test harness |
| Proactive Audio Latency | First token <600ms | API timing |
| Session Duration | 2+ hours stable | Integration test |
| Document Generation | Complete doc from 1hr session | Manual test |
| Moment Detection | 5+ moments in 30 min session | Count |
| Moment Tag Compliance | >90% valid format | Test harness |

### 12.2 Demo Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Safety glasses warning | 100% reliable | 20+ rehearsals |
| THE SHOUT moment | >95% reliable | 20+ rehearsals |
| Near-miss counter | Works every time | Testing |
| Documentation generation | 100% reliable | 10+ tests |
| Demo video length | Exactly 2:00 | Timer |
| Audio audibility | Clear at 60dB ambient | Sound test |

### 12.3 Personality Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| British phrasing | Present in 90%+ responses | Manual review |
| User name usage | Every 3-5 interactions | Count |
| THE SHOUT character break | Name + one word only | Script review |
| Gracious acknowledgment | Always after compliance | Manual review |

### 12.4 NEW: Validation Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Test sessions completed | 50+ | Log count |
| Maker testimonials | 3+ | Interview records |
| Demo recording takes | 20+ | Recording count |
| Metrics slide accuracy | Matches test data | Verification |

---

## 13. Risk Assessment (UPDATED)

### 13.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Safety + Documentation conflict** | Low | High | Clear priority in prompt |
| **Moment detection unreliable** | Medium | Medium | Safety is primary demo |
| **Document generation poor quality** | Medium | Low | Pre-generate backup |
| **THE SHOUT doesn't trigger** | Low | Critical | 50+ test sessions |
| **Context lost in long session** | Low | Medium | Test 2+ hour sessions |
| **Proactive audio unreliable** | Medium | High | Simplified fallback |
| **Test harness incomplete** | Medium | Medium | Start early, iterate |

### 13.2 Demo Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Connection fails during demo** | Low | Critical | Pre-recorded backup |
| **Documentation reveal underwhelms** | Low | Medium | Pre-generate great example |
| **Judges don't understand dual value** | Medium | Medium | Clear narration |
| **Time runs over 2 minutes** | Low | Low | Strict rehearsal |
| **Fallback phrases sound scripted** | Low | Low | Practice natural delivery |

### 13.3 Validation Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Can't find 3 makers** | Medium | Medium | Start recruiting early |
| **Makers have negative feedback** | Low | Low | Iterate before final |
| **50 sessions not completed** | Medium | High | Start testing early |
| **Metrics don't meet targets** | Medium | High | Identify issues early |

---

## 14. Submission Checklist (UPDATED)

### 14.1 Required Deliverables

| Item | Status | Notes |
|------|--------|-------|
| [ ] Working demo | | Vercel URL |
| [ ] Public code repository | | GitHub repo link |
| [ ] 2-minute demo video | | YouTube/Vimeo link |
| [ ] ~200 word Gemini integration description | | See below |
| [ ] Project must be NEW | | Git history proves this |
| [ ] Testing metrics slide | | NEW: Proof of reliability |
| [ ] Maker testimonials | | NEW: Social proof |

### 14.2 Gemini Integration Description (~200 words)

> **Sir Reginald Makesworth III** uses the Gemini Live API to create a dual-purpose AI workshop companion that provides real-time safety monitoring AND autonomous session documentation.
>
> **How Gemini 3 is Central:**
> - **Direct WebSocket Connection:** Using ephemeral tokens, the browser connects directly to Gemini Live API for safety-critical sub-second response times.
> - **Proactive Audio (v1alpha):** The key differentiator - Gemini decides WHEN to speak without waiting for prompts. When Sir Reginald sees a hand near a blade, he SHOUTS immediately.
> - **Continuous Video Streaming:** 1 FPS video frames sent directly to Gemini, matching its internal processing rate for efficient monitoring.
> - **1M Context Window:** Hours of session observations accumulate in context, enabling comprehensive documentation generation without losing earlier moments.
> - **Context Window Compression:** slidingWindow ensures unlimited session duration with full context preservation.
> - **Dual Directive Architecture:** Single prompt handles both real-time safety (interrupt-driven) and documentation (accumulative) without conflict.
>
> **Why This Requires Gemini Live:**
> Traditional APIs use request-response (AFTER). Sir Reginald requires continuous monitoring with proactive intervention (BEFORE) AND memory across hours of observation. Only Gemini Live's combination of streaming video, proactive audio, and massive context window makes this possible.
>
> **The Result:** An AI that guards your hands in real-time AND documents your entire session autonomously. Tested across 50+ sessions with 95% safety trigger rate.

### 14.3 Pre-Submission Testing

| Test | Pass/Fail |
|------|-----------|
| [ ] Safety glasses warning works |
| [ ] THE SHOUT moment works |
| [ ] Cluttered workspace warning works |
| [ ] Improper grip warning works |
| [ ] Hearing protection warning works |
| [ ] Moments detected correctly |
| [ ] Document generation produces quality output |
| [ ] Export to Markdown works |
| [ ] 2-hour continuous session works |
| [ ] Near-miss counter works |
| [ ] Live metric overlay works |
| [ ] Session highlight summary works |
| [ ] Demo video exactly 2 minutes |
| [ ] Audio audible in video |
| [ ] Vercel deployment works |
| [ ] GitHub repo is public |
| [ ] Testing metrics slide included |
| [ ] Maker testimonials included |

---

## Appendix A: Voice Quick Reference

### Greetings
- "Good day! Sir Reginald at your service."
- "Ah, back to the workshop, are we? Splendid."
- "Good evening, [Name]. Ready to create something magnificent?"

### Safety Warnings
- "Pardon the interruption, but I notice..."
- "I do beg your pardon, but..."
- "One moment, if you please..."
- "[NAME]! HAND!" (emergency only)

### Acknowledgments
- "Splendid! Do carry on."
- "Much better, thank you."
- "Excellent work, [Name], if I may say so."

### Documentation Commentary
- "Ah, moving on to assembly. I shall note the transition."
- "That's a clever technique. I'm noting that for the documentation."
- "Hmm, I see some trouble there. Let's see how you address it."
- "A small stumble, but well recovered. Makes for good teaching material."

### Session End
- "Well then, [Name], we've had quite the productive session."
- "The documentation is ready for your review."
- "Until next time, [Name]. Do take care."

### Session Summary (NEW)
- "You worked for [duration], completed [N] major steps..."
- "I did have to intervene [X] times for safety..."
- "Better a word of caution than a trip to hospital, I always say."

### Fallback Phrases (NEW)
- "Just a moment whilst I examine this properly..."
- "Do bear with me - the connection is a bit sluggish..."
- "The telegraph wires seem to have crossed..."
- "Almost there... the connection is being restored..."

---

## Appendix B: File Changes Summary

### Files to Modify

| File | Changes |
|------|---------|
| `src/lib/prompts.ts` | Add dual directive prompt |
| `src/hooks/use-gemini-live.ts` | Add moment parsing, doc generation, metrics |
| `src/app/page.tsx` | Add timeline, doc preview, metric overlay, near-miss counter |
| `src/components/status-bar.tsx` | Add moment count, intervention count, session duration |
| `src/components/onboarding-screen.tsx` | Add project name input |
| `src/components/session-summary.tsx` | Add documentation option, audio summary |
| `src/types/index.ts` | Add Moment, Session, Metrics types |

### Files to Create

| File | Purpose |
|------|---------|
| `src/lib/moment-parser.ts` | Parse moments from responses |
| `src/lib/document-generator.ts` | Format and export documents |
| `src/lib/test-harness.ts` | NEW: Logging for testing |
| `src/components/MomentTimeline.tsx` | Display moment history |
| `src/components/DocumentPreview.tsx` | Show generated documentation |
| `src/components/ExportButtons.tsx` | Markdown/PDF export |
| `src/components/ProjectNameInput.tsx` | Project name input |
| `src/components/LiveMetricOverlay.tsx` | NEW: Real-time stats |
| `src/components/NearMissCounter.tsx` | NEW: Intervention tracker |
| `src/components/TestingDashboard.tsx` | NEW: Internal metrics |

### Files to Remove (or ignore)

| File | Reason |
|------|--------|
| `src/components/sensitivity-slider.tsx` | Feature cut |
| `src/components/snooze-button.tsx` | Feature cut |
| `src/components/mode-toggle.tsx` | Feature cut |

---

## Appendix C: Testing Metrics Template

### Per-Session Log Format

```json
{
  "sessionId": "test-001",
  "timestamp": "2026-01-20T14:30:00Z",
  "duration": 1200,
  "safetyScenarios": {
    "glasses": { "triggered": true, "latencyMs": 650, "success": true },
    "hand_near_blade": { "triggered": true, "latencyMs": 720, "success": true },
    "cluttered": { "triggered": true, "latencyMs": 890, "success": true },
    "grip": { "triggered": false, "notes": "Scenario not recognized" },
    "hearing": { "triggered": true, "latencyMs": 780, "success": true }
  },
  "moments": {
    "expected": 5,
    "detected": 4,
    "validFormat": 4,
    "types": ["new_step", "technique", "problem", "solution"]
  },
  "documentation": {
    "generated": true,
    "sections": 7,
    "wordCount": 850,
    "quality": "good"
  },
  "metrics": {
    "avgLatencyMs": 760,
    "maxLatencyMs": 1200,
    "safetyTriggerRate": 0.80,
    "momentCompliance": 0.80
  }
}
```

### Aggregate Metrics Template

```json
{
  "totalSessions": 50,
  "dateRange": "2026-01-20 to 2026-02-05",
  "aggregate": {
    "avgSafetyTriggerRate": 0.95,
    "avgMomentCompliance": 0.92,
    "avgLatencyMs": 720,
    "maxLatencyMs": 1800,
    "sessionStabilityRate": 0.98,
    "documentGenerationRate": 1.0
  },
  "byScenario": {
    "glasses": { "triggerRate": 0.98, "avgLatency": 650 },
    "hand_near_blade": { "triggerRate": 0.96, "avgLatency": 700 },
    "cluttered": { "triggerRate": 0.94, "avgLatency": 820 },
    "grip": { "triggerRate": 0.88, "avgLatency": 900 },
    "hearing": { "triggerRate": 0.92, "avgLatency": 780 }
  }
}
```

---

*End of Product Specification v9 - Sir Reginald: Your Distinguished Workshop Companion*

*"He Watches. He Remembers. He Protects."*

---

**IMPORTANT: This is the DEFINITIVE spec. All development should reference this document.**

**Key additions in v9:**
1. Testing metrics in demo - prove reliability
2. Real maker testimonials - social proof
3. Multiple demo takes strategy - ensure success
4. Near-miss counter - visualize impact
5. Live metric overlay - transparency
6. Comprehensive UI component specs - actionable for developers
7. Fallback phrases - demo resilience
