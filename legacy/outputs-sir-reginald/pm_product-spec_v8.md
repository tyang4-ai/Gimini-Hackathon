# Sir Reginald Makesworth III - Your Distinguished Workshop Companion

**Product:** Sir Reginald - "He Watches. He Remembers. He Protects."
**Version:** 8.0
**Date:** January 18, 2026
**Target:** Google DeepMind Gemini 3 Hackathon
**Submission Deadline:** February 9, 2026, 5:00 PM PT

---

## Revision Notes (v8 - Combined Approach)

**THE COMBINATION:** Safety monitoring (v6) + Autonomous documentation (v7) in one product.

**Why This Approach:**
1. **Best of both worlds:** Safety is memorable (THE SHOUT), documentation is impressive depth
2. **Higher win probability:** Critic assessed 22% grand prize, 55% top 3 (vs 12%/15% alone)
3. **No architectural conflict:** Safety is interrupt-driven, documentation is accumulative
4. **Demo flexibility:** Lead with safety (70%), documentation shows depth (30%)
5. **Marathon agent + real-time:** Demonstrates Gemini's full capability range

**Tagline Options:**
- **Primary:** "He Watches. He Remembers. He Protects."
- **Alternative:** "Your Distinguished Workshop Companion"
- **Technical:** "The AI That Guards Your Hands and Documents Your Work"

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision](#2-product-vision)
3. [Core Features](#3-core-features)
4. [System Prompt - Dual Directive](#4-system-prompt---dual-directive)
5. [Technical Architecture](#5-technical-architecture)
6. [UI/UX Design](#6-uiux-design)
7. [Demo Script - 2 Minutes](#7-demo-script---2-minutes)
8. [Implementation Status & Timeline](#8-implementation-status--timeline)
9. [Success Criteria](#9-success-criteria)
10. [Risk Assessment](#10-risk-assessment)
11. [Submission Checklist](#11-submission-checklist)

---

## 1. Executive Summary

### 1.1 The Combined Concept

**Sir Reginald Makesworth III** is a distinguished British AI workshop companion that does TWO things:

1. **SAFETY GUARDIAN (Primary - THE SHOUT):** Real-time monitoring with proactive intervention BEFORE dangerous actions complete. The signature moment: Sir Reginald shouts "[NAME]! HAND!" when he sees imminent danger.

2. **THE WITNESS (Secondary - Documentation):** Autonomous observation and documentation of the entire workshop session. At session end, generates professional tutorials, troubleshooting guides, and technique documentation.

**Core Value Proposition:**
> "Sir Reginald is the AI companion who watches over your workshop - protecting you from injury in real-time AND documenting your work for you to share."

### 1.2 Why This Wins

| Hackathon Criteria | How v8 Addresses It |
|-------------------|---------------------|
| **Technical Execution (40%)** | Real-time safety (proactive audio) + Marathon agent (1M context documentation) |
| **Innovation/Wow Factor (30%)** | THE SHOUT is memorable + Generated documentation is tangible output |
| **Potential Impact (20%)** | Safety saves fingers + Documentation saves hours |
| **Presentation/Demo (10%)** | Lead with dramatic safety moment, reveal documentation depth |

### 1.3 The Differentiator

**"Before, not after."**

- ChatGPT: You upload a photo AFTER something happens, then ask
- Sir Reginald: He watches continuously and speaks BEFORE you complete a dangerous action

This isn't a feature difference. It's an architecture difference that only Gemini Live makes possible.

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

### 3.1 Priority Framework

| Priority | Feature | Demo Time | Notes |
|----------|---------|-----------|-------|
| **P0** | THE SHOUT (Hand near blade) | 15 sec | THE memorable moment |
| **P0** | Safety glasses warning | 10 sec | Most reliable scenario |
| **P0** | 5 hardcoded safety scenarios | Background | Demo reliability |
| **P0** | Session moment detection | Background | Accumulates during work |
| **P0** | Document generation | 15 sec | Show result at end |
| **P1** | Guided camera setup | 10 sec | Sir Reginald personality |
| **P1** | Personalization (user name) | Throughout | Used in warnings |
| **P1** | Visual overlay highlights | Shown with warnings | Wow factor |
| **P1** | Export (Markdown/PDF) | 5 sec | Tangible output |
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
- [ ] Response time <1 second from detection
- [ ] Overlay highlights hand region in orange

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
- Safety Moments: [N]

---
*Documented by Sir Reginald Makesworth III*
*"He Watches. He Remembers. He Protects."*
```

**Acceptance Criteria:**
- [ ] Generates complete document from session moments
- [ ] Proper structure with sections
- [ ] Timestamps included
- [ ] Exportable as Markdown (required), PDF (nice-to-have)

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
- Dark mode toggle (minor polish)
- Reliability dashboard (internal tooling)

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

═══════════════════════════════════════════════════════════════════════════════
PRIMARY DIRECTIVE - SAFETY (React Immediately)
═══════════════════════════════════════════════════════════════════════════════

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

═══════════════════════════════════════════════════════════════════════════════
SECONDARY DIRECTIVE - OBSERVATION (Accumulate Passively)
═══════════════════════════════════════════════════════════════════════════════

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

═══════════════════════════════════════════════════════════════════════════════
DOCUMENT GENERATION
═══════════════════════════════════════════════════════════════════════════════

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

---
*Documented by Sir Reginald Makesworth III*
*"He Watches. He Remembers. He Protects."*
</document>

═══════════════════════════════════════════════════════════════════════════════
WHAT YOU'RE WATCHING
═══════════════════════════════════════════════════════════════════════════════

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
5. If moment detected:
   - Brief commentary audio (every 3-5 minutes)
   - Moment data returned in response (<moment> tag)
   - Moment added to session memory
6. Context accumulates in Gemini's window
7. Loop continues for hours
```

**Document Generation:**
```
1. User triggers generation (button or voice command)
2. Client sends "generate documentation" request
3. Gemini reviews all accumulated moments
4. Gemini generates structured document (<document> tag)
5. Document streamed to client
6. Client formats and displays in preview
7. User can export to Markdown/PDF
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

  // Safety tracking (from v6)
  safetyInterventions: number;
  criticalSaves: number;
  lastSafetyCheck: Date;

  // Moment tracking (from v7)
  moments: Moment[];

  // Generated output
  generatedDocument?: string;
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

---

## 6. UI/UX Design

### 6.1 Layout Overview

```
+-------------------------------------------------------------------+
|  STATUS BAR                                              [End]    |
|  Connected | 0.8s | Session: 45m | Moments: 8                     |
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
|  Voice: "Splendid work..."   |    [Generate Documentation]         |
|                              |                                     |
|  +---------------------------+-----------------------------------+ |
|  | Volume  | Mode Toggle   | Safety Status Panel                | |
|  +---------------------------+-----------------------------------+ |
+-------------------------------------------------------------------+
```

### 6.2 Components - What's Kept from v6

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
| `StatusBar` | MODIFY | Add moment count, session duration |
| `ReconnectionOverlay` | KEEP | Character dialogue on reconnect |
| `SessionSummary` | MODIFY | Add documentation option |

### 6.3 Components - What's Added from v7

| Component | Priority | Purpose |
|-----------|----------|---------|
| `MomentTimeline` | P0 | Displays detected moments chronologically |
| `DocumentPreview` | P0 | Shows generated documentation |
| `ExportButtons` | P1 | Markdown/PDF export options |
| `ProjectNameInput` | P1 | Set project name for documentation |

### 6.4 Components - What's Removed

| Component | Reason |
|-----------|--------|
| `SensitivitySlider` | Unnecessary complexity |
| `SnoozeButton` | Rarely used, adds confusion |
| `ModeToggle` | No separate troubleshoot mode |
| `ThemeToggle` | Minor polish, not demo-worthy |

### 6.5 Simplified Onboarding Flow

```
1. Welcome Screen
   "Sir Reginald Makesworth III"
   "Your Distinguished Workshop Companion"
   "He Watches. He Remembers. He Protects."

2. Permissions
   Camera + Microphone access

3. Name Capture (voice + text fallback)
   "What name shall I call you?"

4. Project Name (text input)
   "What project shall we be working on today?"
   [Optional - can be inferred later]

5. Camera Setup
   Sir Reginald directs camera positioning

6. Begin Session
   "Splendid. I shall be keeping watch and taking notes.
    Do carry on, [Name]. I'm here if you need me."
```

---

## 7. Demo Script - 2 Minutes

### 7.1 Props Checklist

| Item | Purpose | Notes |
|------|---------|-------|
| Safety glasses | Put on after first warning | Clear lenses, visible |
| Table saw (or similar) | THE SHOUT moment | Can be non-operational |
| Small project in progress | Show documentation value | Woodworking ideal |
| Webcam | Stable position | Per Reginald's direction |

### 7.2 The Perfect 2-Minute Demo Script

**[0:00-0:05] HOOK - The Grabber**

*Camera shows presenter at workbench*

PRESENTER: "30,000 Americans lose fingers to table saws every year. Most were working alone."

*Beat*

PRESENTER: "What if you weren't alone?"

---

**[0:05-0:15] INTRO - Meet Sir Reginald**

*Show Sir Reginald UI with "WATCHING" indicator*

PRESENTER: "Meet Sir Reginald - an AI companion who watches your workshop in real-time."

*Point to latency indicator*

PRESENTER: "See that green dot? He's watching with sub-second response time."

---

**[0:15-0:30] DEMO 1 - Safety Glasses (Before/After)**

*Reach toward laser cutter without safety glasses*
*Visual overlay highlights face region*

SIR REGINALD: "Pardon the interruption, [Name], but I notice you're approaching the laser cutter without your safety spectacles. Do let's sort that out first, shall we?"

*Put on safety glasses*

SIR REGINALD: "Splendid! Do carry on with your excellent work."

PRESENTER: (to camera) "Before, not after. He caught it before I completed the action."

---

**[0:30-0:50] DEMO 2 - THE DRAMATIC SHOUT (Hand Near Blade)**

*Set up near table saw*
*Hand drifts toward blade area*
*Visual overlay highlights hands in orange*

SIR REGINALD: "[NAME]! HAND!"

*Pull hand back immediately*

SIR REGINALD: "Do forgive me for raising my voice - but that was rather too close to the blade for my comfort. Are you quite alright?"

*Nod to camera*

PRESENTER: "That wasn't a request-response. He shouted my name before I asked anything. That's proactive AI."

---

**[0:50-1:10] THE TWIST - He's Also Documenting**

*Show moment timeline on screen*

PRESENTER: "But here's what the judges won't expect. Sir Reginald isn't just watching for danger - he's documenting everything."

*Point to timeline showing moments*

PRESENTER: "Every step, every technique, every problem I solved - he's been noting it all."

SIR REGINALD: "I notice you're using tape to prevent tearout. A wise technique - I'm noting that for the documentation."

---

**[1:10-1:30] THE REVEAL - Generated Documentation**

*Click "Generate Documentation" button*

PRESENTER: "And now, after 30 minutes of work..."

*Document appears, scroll through it*

PRESENTER: "A complete tutorial. Steps with timestamps. Problems I encountered with solutions. Tips and techniques. All written by an AI that actually watched me work."

*Pause on specific section*

PRESENTER: "Look - he even caught the tearout problem and documented how I fixed it."

---

**[1:30-1:50] TECHNICAL DEPTH**

*Quick architecture slide*

PRESENTER: "How does this work? Gemini's Live API streams video at 1 FPS. Proactive audio means Sir Reginald speaks without being asked. And the 1 million token context window stores hours of observations."

PRESENTER: "This isn't ChatGPT answering questions. This is an AI that watches, protects, and documents - all in real-time."

---

**[1:50-2:00] CLOSE**

*Logo appears*

PRESENTER: "Sir Reginald Makesworth III. He watches. He remembers. He protects."

*Show document export*

PRESENTER: "Export your documentation and share with the world."

**Sir Reginald - Your Distinguished Workshop Companion**

---

### 7.3 Demo Breakdown by Time

| Segment | Time | Content | Purpose |
|---------|------|---------|---------|
| Hook | 0:00-0:05 | Finger loss statistic | Emotional grab |
| Intro | 0:05-0:15 | Meet Sir Reginald | Establish product |
| Safety Demo 1 | 0:15-0:30 | Glasses warning | Show proactive AI |
| Safety Demo 2 | 0:30-0:50 | THE SHOUT | Memorable moment |
| Documentation Twist | 0:50-1:10 | Reveal timeline | Unexpected depth |
| Documentation Reveal | 1:10-1:30 | Generated doc | Tangible output |
| Technical | 1:30-1:50 | Architecture | Credibility |
| Close | 1:50-2:00 | Tagline | Memorable ending |

**Time Split:** Safety ~60% | Documentation ~30% | Technical ~10%

---

## 8. Implementation Status & Timeline

### 8.1 What's Already Built (from v6)

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

### 8.2 What Needs to Be Built (from v7)

| Component | Priority | Estimate |
|-----------|----------|----------|
| Dual directive system prompt | P0 | 2 hours |
| Moment parsing from responses | P0 | 3 hours |
| Moment storage in session | P0 | 2 hours |
| MomentTimeline component | P0 | 4 hours |
| Document generation request | P0 | 2 hours |
| Document parsing from responses | P0 | 2 hours |
| DocumentPreview component | P0 | 3 hours |
| Markdown export | P1 | 2 hours |
| PDF export | P1 | 3 hours |
| Project name input | P1 | 1 hour |
| Update onboarding flow | P1 | 2 hours |
| Update status bar | P1 | 1 hour |
| Update session summary | P1 | 2 hours |

### 8.3 Implementation Timeline

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

**Phase 3: Polish & Export (Days 5-6)**
- Implement Markdown export
- Implement PDF export (if time)
- Update onboarding with project name
- Update status bar and session summary
- Remove unused components (sensitivity, snooze, etc.)

**Phase 4: Demo Preparation (Days 7-8)**
- Test all 5 safety scenarios
- Practice THE SHOUT moment
- Generate sample documentation
- Record demo video (multiple takes)

### 8.4 Time Estimate

| Phase | Estimate |
|-------|----------|
| Core Integration | 10 hours |
| Documentation Features | 12 hours |
| Polish & Export | 10 hours |
| Demo Preparation | 10 hours |
| **Total New Work** | **42 hours** |

**Note:** Existing v6 codebase saves approximately 40 hours of work.

---

## 9. Success Criteria

### 9.1 Technical Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Safety Response Time | <1 second | Timestamp logging |
| THE SHOUT Success Rate | >90% on 20+ tests | Manual testing |
| Proactive Audio Latency | First token <600ms | API timing |
| Session Duration | 2+ hours stable | Integration test |
| Document Generation | Complete doc from 1hr session | Manual test |
| Moment Detection | 5+ moments in 30 min session | Count |

### 9.2 Demo Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Safety glasses warning | 100% reliable | 10+ rehearsals |
| THE SHOUT moment | 100% reliable | 20+ rehearsals |
| Documentation generation | 100% reliable | 5+ tests |
| Demo video length | Exactly 2:00 | Timer |
| Audio audibility | Clear at 60dB ambient | Sound test |

### 9.3 Personality Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| British phrasing | Present in 90%+ responses | Manual review |
| User name usage | Every 3-5 interactions | Count |
| THE SHOUT character break | Name + one word only | Script review |
| Gracious acknowledgment | Always after compliance | Manual review |

---

## 10. Risk Assessment

### 10.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Safety + Documentation conflict** | Low | High | Clear priority in prompt |
| **Moment detection unreliable** | Medium | Medium | Safety is primary demo |
| **Document generation poor quality** | Medium | Low | Pre-generate backup |
| **THE SHOUT doesn't trigger** | Low | Critical | 20+ rehearsals |
| **Context lost in long session** | Low | Medium | Test 2+ hour sessions |
| **Proactive audio unreliable** | Medium | High | Simplified fallback |

### 10.2 Demo Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Connection fails during demo** | Low | Critical | Pre-recorded backup |
| **Documentation reveal underwhelms** | Low | Medium | Pre-generate great example |
| **Judges don't understand dual value** | Medium | Medium | Clear narration |
| **Time runs over 2 minutes** | Low | Low | Strict rehearsal |

### 10.3 Scope Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **PDF export too complex** | Medium | Low | Markdown-only fallback |
| **Too much to build** | Low | High | Clear priority list |
| **Dual feature dilutes message** | Medium | Medium | Lead with safety |

---

## 11. Submission Checklist

### 11.1 Required Deliverables

| Item | Status | Notes |
|------|--------|-------|
| [ ] Working demo | | Vercel URL |
| [ ] Public code repository | | GitHub repo link |
| [ ] 2-minute demo video | | YouTube/Vimeo link |
| [ ] ~200 word Gemini integration description | | See below |
| [ ] Project must be NEW | | Git history proves this |

### 11.2 Gemini Integration Description (~200 words)

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
> **The Result:** An AI that guards your hands in real-time AND documents your entire session autonomously.

### 11.3 Pre-Submission Testing

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
| [ ] Demo video exactly 2 minutes |
| [ ] Audio audible in video |
| [ ] Vercel deployment works |
| [ ] GitHub repo is public |

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

---

## Appendix B: File Changes Summary

### Files to Modify

| File | Changes |
|------|---------|
| `src/lib/prompts.ts` | Add dual directive prompt |
| `src/hooks/use-gemini-live.ts` | Add moment parsing, doc generation |
| `src/app/page.tsx` | Add timeline, doc preview, remove unused components |
| `src/components/status-bar.tsx` | Add moment count, session duration |
| `src/components/onboarding-screen.tsx` | Add project name input |
| `src/components/session-summary.tsx` | Add documentation option |
| `src/types/index.ts` | Add Moment, Session types |

### Files to Create

| File | Purpose |
|------|---------|
| `src/lib/moment-parser.ts` | Parse moments from responses |
| `src/lib/document-generator.ts` | Format and export documents |
| `src/components/MomentTimeline.tsx` | Display moment history |
| `src/components/DocumentPreview.tsx` | Show generated documentation |
| `src/components/ExportButtons.tsx` | Markdown/PDF export |
| `src/components/ProjectNameInput.tsx` | Project name input |

### Files to Remove (or ignore)

| File | Reason |
|------|--------|
| `src/components/sensitivity-slider.tsx` | Feature cut |
| `src/components/snooze-button.tsx` | Feature cut |
| `src/components/mode-toggle.tsx` | Feature cut |
| `src/components/theme-toggle.tsx` | Feature cut |

---

*End of Product Specification v8 - Sir Reginald: Your Distinguished Workshop Companion*

*"He Watches. He Remembers. He Protects."*
