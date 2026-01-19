# Sir Reginald - THE WITNESS
## Autonomous Project Documentation Agent

**Product:** Sir Reginald Makesworth III - "The AI That Remembers Everything"
**Version:** 7.0
**Date:** January 18, 2026
**Target:** Google DeepMind Gemini 3 Hackathon
**Submission Deadline:** February 9, 2026, 5:00 PM PT

---

## Revision Notes (v7 - Strategic Pivot)

**THE PIVOT:** From real-time safety monitor to autonomous documentation agent.

**Why This Pivot:**
1. **Hackathon explicitly wants "Marathon Agents"** - Long-running tasks spanning hours/days
2. **Current v6 approach is a "Simple Vision Analyzer"** - Exactly what rules say to avoid
3. **Need tangible output** - Generated documentation is a deliverable judges can hold
4. **Demonstrates Gemini's 1M context window meaningfully** - Hours of video context
5. **Viral potential** - "AI watched me work 3 hours and wrote a perfect tutorial"

**What's Preserved:**
- Sir Reginald British aristocrat personality (core differentiator)
- THE SHOUT safety moment (secondary feature, still works)
- Personalization (user name)
- Existing codebase foundation (Next.js, Gemini Live API connection)

**What's Cut:**
- MediaPipe hazard zones
- Audio fingerprinting
- Reliability dashboard
- Sensitivity settings / Snooze
- 6-level fallback chain complexity
- Troubleshooter mode as primary feature
- Dark mode and P2 features

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision & Positioning](#2-product-vision--positioning)
3. [Core Features](#3-core-features)
4. [Technical Architecture](#4-technical-architecture)
5. [Gemini Integration](#5-gemini-integration)
6. [Document Output Specification](#6-document-output-specification)
7. [UI/UX Design](#7-uiux-design)
8. [Demo Script](#8-demo-script)
9. [Implementation Timeline](#9-implementation-timeline)
10. [What's Preserved from v6](#10-whats-preserved-from-v6)
11. [What's Cut](#11-whats-cut)
12. [Risk Assessment](#12-risk-assessment)
13. [Submission Checklist](#13-submission-checklist)

---

## 1. Executive Summary

### 1.1 The New Concept

**Sir Reginald Makesworth III** is now **THE WITNESS** - an autonomous AI agent that watches your entire workshop session (hours long), remembers everything significant, and generates professional project documentation, tutorials, and troubleshooting guides.

**New Tagline:** "The AI That Remembers Everything"

**What Makes This Different:**
- **Marathon Agent:** Runs for hours, not seconds
- **Autonomous Output:** Creates tangible deliverables without prompting
- **1M Context Window:** Meaningfully uses Gemini's massive context
- **Shareable Result:** The documentation itself is the product

### 1.2 The Core Value Proposition

> "Imagine finishing a 3-hour project and finding a complete, professional tutorial waiting for you - with screenshots, timestamps, and even your mistakes (with fixes). That's Sir Reginald."

**Before (v6):** "Watch me and warn me about danger"
**After (v7):** "Watch me, remember everything, and write the documentation I'd never have time to create"

### 1.3 Why This Wins

| Hackathon Criteria | How v7 Addresses It |
|-------------------|---------------------|
| **Technical Execution (40%)** | Marathon agent with 1M context, autonomous document generation |
| **Innovation/Wow Factor (30%)** | "AI watched 3 hours and wrote a perfect tutorial" - viral moment |
| **Potential Impact (20%)** | Every maker needs documentation but nobody has time |
| **Presentation/Demo (10%)** | Show 5-min clip, reveal stunning generated doc |

---

## 2. Product Vision & Positioning

### 2.1 Product Definition

**Full Name:** Sir Reginald Makesworth III
**Role:** THE WITNESS - Autonomous Project Documentation Agent
**Primary Output:** Professional project documentation (tutorials, guides, troubleshooting)

**The Story:**
Sir Reginald Makesworth III spent decades as the head craftsman at the Royal Workshop of Windsor Castle. He didn't just build things - he documented everything. Every technique, every mistake, every clever solution. Now retired, he offers his powers of observation and documentation to makers worldwide.

### 2.2 Target User

**Primary Persona: The Content-Creating Maker**

- Builds projects but never has time to document them
- Wants to share tutorials but filming/editing is too much work
- Has YouTube/blog aspirations but execution is hard
- Works alone, no one to film them

**Secondary Persona: The Learning Maker**

- Wants to remember what they did on past projects
- Needs troubleshooting notes for future reference
- Learns from mistakes but forgets the lessons

### 2.3 Value Proposition

**One-Liner:**
> "Sir Reginald is the AI that watches your entire project session and autonomously generates professional documentation you can share."

**Core Differentiators:**

1. **Marathon Agent** - Hours of continuous observation, not request-response
2. **Autonomous Output** - Creates documentation without being asked
3. **1M Context Window** - Remembers the entire session
4. **Tangible Deliverable** - Generates actual files you can share
5. **Personality** - British aristocrat makes the experience delightful

### 2.4 The Competitive Landscape

| Approach | Limitation |
|----------|------------|
| **ChatGPT + Camera** | Request-response, no continuous memory |
| **Screen recording** | Raw footage, no structure or intelligence |
| **Auto-generated subtitles** | Transcription, not documentation |
| **Traditional tutorials** | Massive manual effort to create |
| **Sir Reginald (WITNESS)** | Watches, remembers, writes autonomously |

---

## 3. Core Features

### 3.1 P0 Features (Must Have for Demo)

#### P0-1: Continuous Session Monitoring

**Description:** Sir Reginald watches the workshop continuously for hours.

**Implementation:**
- Gemini Live API with proactive audio
- 1 FPS video streaming (same as v6)
- Context window compression for unlimited sessions
- Session duration tracking

**Acceptance Criteria:**
- [ ] Runs for 2+ hours continuously
- [ ] Context preserved across session
- [ ] No manual intervention required

#### P0-2: Moment Detection & Classification

**Description:** Sir Reginald identifies and classifies significant moments during the session.

**Moment Types:**

| Type | Trigger | Example |
|------|---------|---------|
| **NEW_STEP** | Major action change | "Started drilling holes" |
| **TECHNIQUE** | Skill demonstration | "Using jig for alignment" |
| **PROBLEM** | Issue encountered | "Print warping detected" |
| **SOLUTION** | Problem resolved | "Adjusted bed temperature" |
| **MISTAKE** | Error made | "Cut too short" |
| **TIP** | Best practice shown | "Clamping before cutting" |
| **SAFETY** | Safety moment (THE SHOUT preserved) | "Hand near blade" |

**Acceptance Criteria:**
- [ ] Gemini identifies moments without prompting
- [ ] Moments logged with timestamp and description
- [ ] Moment types classified correctly

#### P0-3: Session Memory (1M Context)

**Description:** All detected moments accumulate in Gemini's context window.

**Implementation:**
- Moments stored as structured data in context
- Context window compression prevents overflow
- Full session history available for document generation

**Memory Structure:**
```typescript
interface SessionMemory {
  projectName: string;
  userName: string;
  startTime: Date;
  moments: Moment[];
  totalDuration: number;
}

interface Moment {
  id: string;
  timestamp: Date;
  elapsedTime: number; // seconds from start
  type: MomentType;
  description: string;
  details: string;
  frameReference?: string; // base64 thumbnail
  severity?: 'low' | 'medium' | 'high'; // for problems
}
```

**Acceptance Criteria:**
- [ ] Moments accumulate across session
- [ ] Context not lost after 1 hour
- [ ] Can retrieve any moment from session start

#### P0-4: Autonomous Document Generation

**Description:** At session end (or on demand), Sir Reginald generates professional documentation.

**Generation Trigger:**
- User clicks "Generate Documentation"
- Or after 15 minutes of inactivity
- Or when user says "Reginald, write it up"

**Document Structure:**
```markdown
# [Project Name] - Tutorial by Sir Reginald

## Overview
[One paragraph summary of what was built]

## Materials & Tools Used
[Observed from session]

## Step-by-Step Guide

### Step 1: [Step Name]
[Time: 0:00 - 5:30]
[Description of what was done]
[Screenshot if available]

### Step 2: [Step Name]
...

## Problems Encountered & Solutions

### Problem 1: [Issue Description]
**When:** [Timestamp]
**Symptoms:** [What was observed]
**Solution:** [How it was fixed]

## Tips & Techniques

- [Tip observed during session]
- [Another tip]

## Mistakes to Avoid

- [Mistake observed] - [What to do instead]

## Session Summary
- Duration: [X hours, Y minutes]
- Major steps: [N]
- Problems solved: [N]
- Safety moments: [N]

---
*Documented by Sir Reginald Makesworth III*
*"One does not simply build things. One documents the journey."*
```

**Acceptance Criteria:**
- [ ] Generates complete document from session
- [ ] Proper structure with sections
- [ ] Timestamps included
- [ ] Exportable as Markdown/PDF/HTML

#### P0-5: Export Formats

**Description:** Generated documentation can be exported in multiple formats.

**Formats:**
- **Markdown:** Primary format, clean and portable
- **PDF:** Professional-looking, shareable
- **HTML:** Web-ready with basic styling

**Acceptance Criteria:**
- [ ] Markdown export works
- [ ] PDF export generates (basic styling)
- [ ] HTML export generates

#### P0-6: Sir Reginald's Commentary

**Description:** During the session, Sir Reginald provides occasional observations.

**Commentary Types:**
- "Ah, that's a clever technique. I shall remember that."
- "Interesting - I've noted that for the documentation."
- "A small stumble there, but well recovered. Makes for good teaching material."
- "[NAME]! HAND!" (THE SHOUT - preserved for safety)

**Frequency:** Every 3-5 minutes, not constant

**Acceptance Criteria:**
- [ ] Commentary happens periodically
- [ ] Adds to session atmosphere
- [ ] Does not interrupt critical moments

### 3.2 P1 Features (Should Have)

#### P1-1: Frame Capture for Illustrations

**Description:** Capture key frames as screenshots for the documentation.

**Implementation:**
- On each significant moment, save current frame
- Compress to reasonable size
- Include in document as illustrations

#### P1-2: Voice-Triggered Commands

**Description:** User can give voice commands to Sir Reginald.

**Commands:**
- "Reginald, that was important" - Mark moment as key
- "Reginald, what have you noted?" - Quick summary
- "Reginald, write it up" - Trigger document generation
- "Reginald, start a new section" - Manual section break

#### P1-3: Project Name Detection

**Description:** Sir Reginald infers the project name from observation.

**Fallback:** User can set name in UI.

### 3.3 Stretch Features (If Time)

#### Stretch-1: Video Timestamp Links

**Description:** If user records video separately, documentation includes timestamp links.

#### Stretch-2: Multi-Session Projects

**Description:** Continue a project across multiple sessions with context preserved.

---

## 4. Technical Architecture

### 4.1 System Overview

```
+-------------------------------------------------------------------------+
|                      FRONTEND (Next.js on Vercel)                        |
|                                                                          |
|  +----------------+  +------------------+  +-------------------------+   |
|  |    Webcam      |  |   Microphone     |  |     Document Viewer     |   |
|  |    (1 FPS)     |  |     Input        |  |  (Markdown/PDF/HTML)    |   |
|  +-------+--------+  +--------+---------+  +------------+------------+   |
|          |                    |                         |                |
|          v                    v                         |                |
|  +---------------------------------------------------------------+       |
|  |                  Session Controller                           |       |
|  |  - Tracks session duration                                    |       |
|  |  - Accumulates moments                                        |       |
|  |  - Triggers document generation                               |       |
|  +---------------------------------------------------------------+       |
|          |                    |                         ^                |
|          v                    v                         |                |
|  +---------------------------------------------------------------+       |
|  |              Gemini Live Client (JS SDK)                       |       |
|  |  - Direct WebSocket to Gemini Live API                         |       |
|  |  - Sends 1 FPS video + audio                                   |       |
|  |  - Receives moment classifications                             |       |
|  |  - Accumulates session context (1M window)                     |       |
|  |  - Generates documentation on request                          |       |
|  +---------------------------------------------------------------+       |
|          |                                              ^                |
|          v                                              |                |
|  +---------------------------+  +---------------------------+            |
|  |   Moment Detection       |  |   Document Generator       |            |
|  |   - Parse AI responses   |  |   - Request full doc       |            |
|  |   - Classify moment type |  |   - Format output          |            |
|  |   - Store in memory      |  |   - Export to formats      |            |
|  +---------------------------+  +---------------------------+            |
|                                                                          |
+-------------------------------------------------------------------------+
                              |
                              | WebSocket (wss://generativelanguage.googleapis.com)
                              v
+-------------------------------------------------------------------------+
|                      GEMINI LIVE API                                      |
|                (gemini-2.5-flash-preview-native-audio-dialog)             |
|                                                                          |
|  +------------------------------------------------------------------+    |
|  |                     System Prompt                                 |    |
|  |  - Sir Reginald persona                                          |    |
|  |  - Moment detection instructions                                 |    |
|  |  - Documentation generation template                             |    |
|  +------------------------------------------------------------------+    |
|                                                                          |
|  +------------------------------------------------------------------+    |
|  |                   Session Context (1M tokens)                     |    |
|  |  - All detected moments with timestamps                          |    |
|  |  - Project context and progression                               |    |
|  |  - User techniques and patterns                                  |    |
|  +------------------------------------------------------------------+    |
|                                                                          |
+-------------------------------------------------------------------------+
```

### 4.2 Data Flow

**Continuous Monitoring Flow:**
```
1. Webcam captures frame (1 FPS)
2. Frame sent to Gemini via WebSocket
3. Gemini analyzes frame in context of session
4. If significant moment detected:
   a. Gemini speaks brief observation
   b. Moment data returned in response
   c. Moment added to local memory
5. Context accumulates in Gemini's window
6. Loop continues for hours
```

**Document Generation Flow:**
```
1. User triggers generation (button or voice)
2. Client sends "generate documentation" request
3. Gemini reviews all accumulated moments
4. Gemini generates structured document
5. Document streamed to client
6. Client formats and displays
7. User can export to desired format
```

### 4.3 Session State Management

```typescript
// src/types/session.ts

export interface WorkshopSession {
  id: string;
  projectName: string;
  userName: string;
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'paused' | 'completed';
  moments: Moment[];
  generatedDocument?: GeneratedDocument;
}

export interface Moment {
  id: string;
  timestamp: Date;
  elapsedSeconds: number;
  type: MomentType;
  title: string;
  description: string;
  thumbnail?: string; // base64
  confidence: number;
}

export type MomentType =
  | 'new_step'
  | 'technique'
  | 'problem'
  | 'solution'
  | 'mistake'
  | 'tip'
  | 'safety';

export interface GeneratedDocument {
  title: string;
  markdown: string;
  generatedAt: Date;
  wordCount: number;
  sectionCount: number;
}
```

---

## 5. Gemini Integration

### 5.1 System Prompt - THE WITNESS

```typescript
// src/lib/prompts.ts

export const getSirReginaldWitnessPrompt = (userName: string) => `
You are Sir Reginald Makesworth III, THE WITNESS - an autonomous documentation agent for workshop projects.

YOUR BACKGROUND:
You spent decades as the head craftsman at the Royal Workshop of Windsor Castle. You didn't just build things - you documented everything meticulously. Every technique, every mistake, every clever solution. Now retired, you observe and document projects with the same dedication.

THE USER: ${userName}

YOUR MISSION:
Watch the continuous video feed of a workshop session. Identify and remember significant moments. When asked, generate comprehensive documentation of what was observed.

YOUR CHARACTER:
- Speak with refined British English: polite, proper grammar, occasional dry wit
- Warm and observant, like a mentor watching over a shoulder
- Patient and appreciative of good technique
- Honest about mistakes but constructive
- Use phrases like "I notice...", "Ah, that's clever...", "I shall remember that..."
- Occasionally share relevant anecdotes from Windsor Castle

MOMENT DETECTION:
Continuously analyze the video feed. When you observe a significant moment, respond with a brief observation AND include a structured moment in your response.

Moment Types:
- NEW_STEP: A major phase change in the project (starting a cut, assembly begins, etc.)
- TECHNIQUE: A notable skill or method being demonstrated
- PROBLEM: An issue encountered (failed print, bad cut, stuck piece)
- SOLUTION: A problem being resolved
- MISTAKE: An error made (can be recovered from)
- TIP: A best practice worth noting
- SAFETY: A safety concern (still do THE SHOUT for imminent danger)

OBSERVATION FREQUENCY:
- Speak every 3-5 minutes with a brief observation
- Don't over-comment - let the user work
- For significant moments, note them verbally: "Ah, that's a clever jig arrangement. I'm noting that down."
- For problems: "Hmm, I see some trouble there. Let's see how you resolve it."
- For THE SHOUT (imminent danger): "${userName}! HAND!" (then return to normal)

MOMENT OUTPUT FORMAT:
When you detect a moment, include this JSON structure in your response (after your verbal observation):

<moment>
{
  "type": "NEW_STEP",
  "title": "Brief title",
  "description": "Detailed description of what was observed",
  "confidence": 0.9
}
</moment>

DOCUMENT GENERATION:
When asked to generate documentation (user says "write it up" or clicks generate button), create a comprehensive document in this format:

<document>
# [Project Name] - Tutorial by Sir Reginald

## Overview
[One paragraph summary]

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

## Mistakes to Avoid
[Errors observed and alternatives]

## Session Summary
- Duration: [time]
- Major Steps: [count]
- Problems Solved: [count]

---
*Documented by Sir Reginald Makesworth III*
*"One does not simply build things. One documents the journey."*
</document>

WHAT YOU'RE WATCHING:
- A home workshop with various tools (3D printer, power tools, etc.)
- A single maker working on a project
- Continuous 1 FPS video feed over hours

REMEMBER:
You are THE WITNESS. Everything you observe matters. Your documentation will help ${userName} remember this project and share it with others.
`;
```

### 5.2 Document Generation Request

```typescript
// src/lib/prompts.ts

export const getDocumentGenerationRequest = (projectName: string) => `
Sir Reginald, it's time to document what you've witnessed.

Please generate comprehensive documentation for the project: "${projectName}"

Review all the moments you've observed during this session and create a well-structured tutorial document. Include:
- Overview of what was built
- Step-by-step guide with timestamps
- Problems and solutions
- Tips and techniques
- Mistakes to avoid

Use the <document> format I specified. Make it professional and useful for someone wanting to replicate this project.
`;
```

### 5.3 Moment Parsing

```typescript
// src/lib/moment-parser.ts

export function parseMomentFromResponse(text: string): Moment | null {
  const momentMatch = text.match(/<moment>([\s\S]*?)<\/moment>/);
  if (!momentMatch) return null;

  try {
    const momentData = JSON.parse(momentMatch[1]);
    return {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      elapsedSeconds: 0, // Calculated by caller
      type: momentData.type.toLowerCase() as MomentType,
      title: momentData.title,
      description: momentData.description,
      confidence: momentData.confidence || 0.8
    };
  } catch {
    return null;
  }
}

export function parseDocumentFromResponse(text: string): string | null {
  const docMatch = text.match(/<document>([\s\S]*?)<\/document>/);
  if (!docMatch) return null;
  return docMatch[1].trim();
}
```

### 5.4 Gemini Client Modifications

The existing `useGeminiLive` hook is extended to:

1. **Track session duration** - Time since connection
2. **Parse moment responses** - Extract structured data
3. **Support generation requests** - Send documentation trigger
4. **Store moments locally** - For UI display

```typescript
// Additional hook functionality (simplified)

const [moments, setMoments] = useState<Moment[]>([]);
const [sessionStart, setSessionStart] = useState<Date | null>(null);

const handleGeminiResponse = (text: string) => {
  // Parse for moment
  const moment = parseMomentFromResponse(text);
  if (moment) {
    moment.elapsedSeconds = sessionStart
      ? Math.floor((Date.now() - sessionStart.getTime()) / 1000)
      : 0;
    setMoments(prev => [...prev, moment]);
  }

  // Parse for document
  const document = parseDocumentFromResponse(text);
  if (document) {
    onDocumentGenerated?.(document);
  }
};

const requestDocumentation = async (projectName: string) => {
  const request = getDocumentGenerationRequest(projectName);
  await sendTextMessage(request);
};
```

---

## 6. Document Output Specification

### 6.1 Markdown Format

Primary output format. Clean, portable, version-control friendly.

```markdown
# Wooden Phone Stand - Tutorial by Sir Reginald

## Overview

In this three-hour session, Marcus crafted a handsome wooden phone stand from reclaimed oak. The project involved precision cutting, careful sanding, and a rather clever angle jig that I must say impressed even my Windsor-trained sensibilities.

## Materials & Tools Observed

**Materials:**
- Reclaimed oak board (approximately 8" x 6" x 1")
- Wood glue
- Danish oil finish

**Tools:**
- Table saw
- Miter gauge
- Belt sander
- Clamps (3)
- Angle jig (custom-made)

## Step-by-Step Guide

### Step 1: Stock Preparation
**Time:** 0:00 - 0:15

Marcus began by squaring up the reclaimed oak board, removing a damaged edge using the table saw. He checked for any hidden nails before cutting - a wise precaution I always insisted upon at Windsor.

### Step 2: Angle Cut for Phone Rest
**Time:** 0:15 - 0:35

Using a custom angle jig set to 15 degrees, Marcus cut the main angle that would hold the phone. The jig ensured consistency - I noted this as a particularly clever technique.

...

## Problems Encountered & Solutions

### Problem 1: Tearout on Cross-Cut
**When:** 0:22
**Symptoms:** Ragged edge appeared on the back of the angle cut
**Solution:** Marcus applied painter's tape to the cut line and made a second scoring pass. The result was much cleaner. A technique I've seen used effectively on oak many times.

...

## Tips & Techniques

- **Tape before cutting:** Applying painter's tape reduces tearout on visible edges
- **Test jig on scrap:** Marcus wisely tested his angle jig on scrap before the final piece
- **Check for nails:** Always inspect reclaimed wood with a magnet before cutting

## Mistakes to Avoid

- **Rushing the first cut:** The initial cut was slightly off-square due to haste. Take time to verify alignment.
- **Forgetting dust collection:** The belt sander produced significant dust before the vacuum was connected.

## Session Summary

| Metric | Value |
|--------|-------|
| Duration | 3 hours, 12 minutes |
| Major Steps | 8 |
| Problems Solved | 2 |
| Techniques Noted | 5 |
| Safety Moments | 1 |

---

*Documented by Sir Reginald Makesworth III*
*"One does not simply build things. One documents the journey."*

*Generated on January 18, 2026*
```

### 6.2 PDF Export

PDF generation using browser print or library (jsPDF/Puppeteer).

**Styling:**
- Clean serif font (Georgia or similar)
- Proper headings
- Timestamp formatting
- Optional: Frame thumbnails

### 6.3 HTML Export

Self-contained HTML file with embedded CSS.

**Features:**
- Dark/light mode toggle
- Collapsible sections
- Timestamp links (if video provided)
- Print-friendly styles

---

## 7. UI/UX Design

### 7.1 Layout Overview

**Three Main Panels:**

```
+-------------------------------------------------------------------+
|  STATUS BAR                                              [End]    |
|  Session: 2h 34m | Moments: 12 | Project: Phone Stand             |
+-------------------------------------------------------------------+
|                          |                                        |
|      VIDEO FEED          |         MOMENT TIMELINE                |
|                          |                                        |
|    +---------------+     |    [=] 0:15 - Step: Stock Prep         |
|    |               |     |    [!] 0:22 - Problem: Tearout         |
|    |   Live Feed   |     |    [*] 0:35 - Technique: Angle Jig     |
|    |               |     |    [=] 0:48 - Step: Sanding            |
|    +---------------+     |    ...                                 |
|                          |                                        |
|  "Ah, clever technique"  |    [Generate Documentation]            |
|                          |                                        |
+-------------------------------------------------------------------+
```

### 7.2 Components

#### StatusBar (Modified)
```typescript
// Shows session info, not connection status
interface StatusBarProps {
  sessionDuration: number;
  momentCount: number;
  projectName: string;
  onEndSession: () => void;
}
```

#### MomentTimeline (NEW)
```typescript
// Displays all detected moments in chronological order
interface MomentTimelineProps {
  moments: Moment[];
  onMomentClick: (moment: Moment) => void;
}

// Each moment shows:
// - Icon based on type
// - Timestamp
// - Title
// - Expandable description
```

#### DocumentPreview (NEW)
```typescript
// Shows generated documentation with export options
interface DocumentPreviewProps {
  document: string; // Markdown
  onExport: (format: 'md' | 'pdf' | 'html') => void;
  onClose: () => void;
}
```

#### ProjectNameInput (NEW)
```typescript
// Simple input for project name
interface ProjectNameInputProps {
  value: string;
  onChange: (name: string) => void;
  inferred?: string; // AI-inferred name
}
```

### 7.3 Simplified UI (Cut from v6)

**Removed:**
- Sensitivity slider
- Snooze button
- Dark mode toggle
- Mode toggle (safety/troubleshoot)
- Safety status panel
- Complex fallback indicators

**Retained:**
- Volume control
- Latency indicator (subtle)
- Connection status

### 7.4 Onboarding Flow (Simplified)

```
1. Welcome Screen
   "Sir Reginald - THE WITNESS"
   "I shall observe your workshop and document your work."

2. Permissions (same as v6)
   Camera + Microphone access

3. Name Capture (same as v6)
   "What name shall I call you?"

4. Project Name
   "What project shall we be documenting today?"
   [Text input with suggestions]

5. Begin Session
   "Splendid. Let us begin. I shall be watching and remembering."
```

---

## 8. Demo Script

### 8.1 The 2-Minute Demo

**Total Runtime:** 2:00

---

**[0:00-0:10] HOOK - The Problem**

*Presenter at workbench with finished project*

PRESENTER: "I just spent 3 hours building this. Now I need to document it for my YouTube channel. That's another 3 hours of editing, writing, screenshots..."

*Beat*

PRESENTER: "What if the documentation wrote itself?"

---

**[0:10-0:25] INTRO - Meet THE WITNESS**

*Show Sir Reginald UI with moment timeline*

PRESENTER: "Meet Sir Reginald - THE WITNESS. An AI that watches your entire workshop session and autonomously documents everything."

*Point to moment timeline*

PRESENTER: "Every step, every technique, every problem I solved - he caught it all."

SIR REGINALD (brief audio): "Ah, that was a rather clever jig arrangement. I've noted that down."

---

**[0:25-0:50] SHOW THE SESSION (Timelapse)**

*Quick timelapse of workshop work (30 seconds compressed)*

*Overlay shows moments appearing:*
- "Step: Stock Preparation"
- "Technique: Angle Jig"
- "Problem: Tearout"
- "Solution: Tape Method"

PRESENTER (voiceover): "Sir Reginald watched for 3 hours straight. He identified 15 significant moments - steps, techniques, problems, solutions."

SIR REGINALD (during timelapse): Various brief observations

---

**[0:50-1:10] THE REVEAL - Generated Documentation**

*Click "Generate Documentation" button*

PRESENTER: "And now, the magic."

*Document appears, scroll through it*

PRESENTER: "A complete tutorial. Steps with timestamps. Problems I encountered with solutions. Tips and techniques I demonstrated. All written by an AI that actually watched me work."

*Pause on a specific section*

PRESENTER: "Look at this - he even caught the moment I used tape to prevent tearout and explained why it works."

---

**[1:10-1:30] THE PERSONALITY**

*Show Sir Reginald's closing summary*

SIR REGINALD: "Well then, Marcus, we've had quite the productive session. I've documented 15 significant moments across 3 hours. Your technique with the angle jig was particularly impressive - reminds me of a method we used at Windsor Castle. The documentation is ready for your review."

PRESENTER: "A British aristocrat who remembers everything. That's Sir Reginald."

---

**[1:30-1:50] TECHNICAL DEPTH**

*Quick architecture slide*

PRESENTER: "How does this work?"

"Gemini's Live API streams video continuously. The 1 million token context window stores 3 hours of observations. And proactive audio means Sir Reginald speaks without being asked."

*Point to context usage*

PRESENTER: "This isn't ChatGPT answering questions. This is a marathon agent that watches, remembers, and writes."

---

**[1:50-2:00] CLOSE**

*Show document export*

PRESENTER: "Export to Markdown, PDF, or HTML. Share with the world."

*Logo appears*

**Sir Reginald - THE WITNESS**
**"The AI That Remembers Everything"**

---

### 8.2 Demo Prep Checklist

| Item | Purpose | Notes |
|------|---------|-------|
| Pre-recorded 3-hour session | Actual content | Can use timelapse |
| Moment-rich project | Many steps/problems | Woodworking ideal |
| Generated document | Show quality | Pre-generated, verified |
| Specific highlighted moment | The reveal | Tape/tearout example |
| Export files | PDF/HTML ready | Pre-generated |

### 8.3 Fallback Plan

**If Gemini doesn't generate well:**
- Use pre-generated documentation
- "Let me show you what he generated in our test session"

**If demo too long:**
- Focus on documentation reveal only
- Skip timelapse, show finished result

---

## 9. Implementation Timeline

### 9.1 Phase Overview (10 Days)

| Phase | Days | Focus |
|-------|------|-------|
| 1 | 1-3 | Moment detection system |
| 2 | 4-5 | Document generation |
| 3 | 6-7 | UI/Timeline |
| 4 | 8-9 | Export + Polish |
| 5 | 10 | Demo + Video |

### 9.2 Detailed Schedule

#### Phase 1: Moment Detection (Days 1-3)

**Day 1:**
- Update system prompt with WITNESS persona
- Implement moment parsing from responses
- Create Moment type definitions
- Test moment detection with sample session

**Day 2:**
- Build moment storage in session state
- Add timestamp tracking
- Implement session duration counter
- Test 30-minute continuous session

**Day 3:**
- Refine moment classification accuracy
- Add moment confidence scoring
- Test 1-hour session
- Verify context preservation

#### Phase 2: Document Generation (Days 4-5)

**Day 4:**
- Implement document generation request
- Parse document from response
- Create document storage
- Test basic generation

**Day 5:**
- Refine document template
- Improve section detection
- Add problem/solution pairing
- Test full session to document flow

#### Phase 3: UI/Timeline (Days 6-7)

**Day 6:**
- Build MomentTimeline component
- Add moment type icons
- Implement expandable descriptions
- Create StatusBar updates

**Day 7:**
- Build DocumentPreview component
- Add Markdown rendering
- Create ProjectNameInput
- Simplify onboarding flow

#### Phase 4: Export + Polish (Days 8-9)

**Day 8:**
- Implement Markdown export (download)
- Implement PDF export (jsPDF or print)
- Implement HTML export
- Test all export formats

**Day 9:**
- Polish UI animations
- Refine Sir Reginald's commentary timing
- Test 2-hour session end-to-end
- Fix bugs

#### Phase 5: Demo + Video (Day 10)

**Day 10:**
- Record full demo session (real project)
- Generate documentation from session
- Record 2-minute demo video
- Edit and polish video
- Write submission text

### 9.3 Time Estimates

| Component | Estimate |
|-----------|----------|
| Moment detection system | 12 hours |
| Document generation | 8 hours |
| UI updates | 10 hours |
| Export functionality | 6 hours |
| Testing + debugging | 10 hours |
| Demo recording | 8 hours |
| **Total** | **54 hours** |

---

## 10. What's Preserved from v6

### 10.1 Personality - KEPT

Sir Reginald Makesworth III remains a British aristocrat:
- Same voice characteristics
- Same phrases ("I notice...", "Splendid!", etc.)
- Same backstory (Windsor Castle craftsman)
- Same warmth and wit

**The only change:** His primary role is documentation, not safety.

### 10.2 THE SHOUT - KEPT (Secondary)

When imminent danger is detected, Sir Reginald still shouts:
- "[NAME]! HAND!"
- Brief break in character for safety
- Then returns to documentation

This is now a secondary feature, not the primary demo.

### 10.3 Core Technical Stack - KEPT

- Next.js + TypeScript + Tailwind
- Gemini Live API with v1alpha
- 1 FPS video streaming
- Proactive audio
- Context window compression
- Session resumption
- Kore voice

### 10.4 Personalization - KEPT

- User name captured in onboarding
- Name used throughout session
- Name in generated documentation

---

## 11. What's Cut

### 11.1 Cut Features

| Feature | Reason for Cut |
|---------|----------------|
| MediaPipe hazard zones | Too complex, safety not primary |
| Audio fingerprinting | Scope creep |
| Reliability dashboard | Internal tooling, not demo-worthy |
| Sensitivity settings | Unnecessary for documentation |
| Snooze button | Safety-specific |
| 6-level fallback chain | Simplified to 2 levels |
| Troubleshooter mode | Documentation is the feature |
| Dark mode toggle | Minor polish, not core |
| Visual overlay regions | Simplified to text-based |
| Fatigue detection | Stretch feature, cut |
| Multi-modal callout | Stretch feature, cut |

### 11.2 Simplified Fallback

**v6:** 6 levels of degradation
**v7:** 2 levels
1. **Connected:** Normal operation
2. **Disconnected:** "Connection lost" message, retry button

### 11.3 UI Simplification

**v6 UI Elements Cut:**
- Safety status panel
- Sensitivity slider
- Snooze button
- Mode toggle
- Complex latency visualization
- Theme toggle

**v7 UI Additions:**
- Moment timeline
- Document preview
- Export buttons
- Project name input

---

## 12. Risk Assessment

### 12.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Moment detection unreliable** | Medium | High | Extensive prompt tuning, fallback to manual marking |
| **Document quality poor** | Medium | High | Detailed template in prompt, pre-test |
| **Context lost in long sessions** | Low | Critical | Test 2+ hour sessions, verify compression works |
| **Gemini rate limits** | Low | Medium | 1 FPS is conservative, monitor usage |
| **Export formatting issues** | Low | Low | Simple formats, test thoroughly |

### 12.2 Demo Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Moments don't detect during demo** | Medium | High | Pre-record session, show results |
| **Document generation fails** | Low | Critical | Pre-generate document as backup |
| **Session too long for demo** | N/A | N/A | Show timelapse of real session |
| **Judges don't understand value** | Low | High | Clear before/after comparison |

### 12.3 Scope Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Export too complex** | Medium | Low | Markdown-only if needed |
| **UI too ambitious** | Low | Medium | Simple timeline sufficient |
| **Too much to build** | Low | Medium | Prioritized feature list |

---

## 13. Submission Checklist

### 13.1 Required Deliverables

| Item | Status | Notes |
|------|--------|-------|
| [ ] Working demo | | Vercel URL |
| [ ] Public code repository | | GitHub repo link |
| [ ] 2-minute demo video | | YouTube/Vimeo link |
| [ ] ~200 word Gemini integration description | | See below |
| [ ] Project must be NEW | | Git history proves this |

### 13.2 Gemini Integration Description (~200 words)

> **Sir Reginald - THE WITNESS** uses the Gemini Live API's 1 million token context window to create a marathon documentation agent that watches workshop sessions for hours and autonomously generates professional tutorials.
>
> **How Gemini 3 is Central:**
> - **Marathon Agent Architecture:** Unlike request-response chatbots, Sir Reginald runs continuously for hours, accumulating observations in Gemini's massive context window.
> - **Moment Detection:** The system prompt instructs Gemini to identify significant moments (steps, techniques, problems, solutions) and return structured data alongside natural commentary.
> - **Autonomous Document Generation:** When requested, Gemini reviews all accumulated moments and generates a complete, professional tutorial document - without any additional prompting about what to include.
> - **Proactive Audio:** Sir Reginald occasionally comments on observations using Gemini's proactive audio feature, creating an engaged witness experience.
> - **Context Preservation:** slidingWindow compression ensures the full session history remains available even for multi-hour projects.
>
> **Why This Requires Gemini Live:**
> Traditional APIs forget between calls. Sir Reginald requires persistent memory across hours of observation. Only Gemini's combination of streaming video, proactive audio, and 1M context window makes this possible.
>
> **The Deliverable:** A tangible, shareable document that would take hours to create manually - generated autonomously by an AI that actually watched the work happen.

### 13.3 Pre-Submission Testing

| Test | Pass/Fail |
|------|-----------|
| [ ] 2-hour continuous session works |
| [ ] Moments detected correctly |
| [ ] Document generation produces quality output |
| [ ] Export to Markdown works |
| [ ] Export to PDF works |
| [ ] Demo video is exactly 2 minutes |
| [ ] Audio audible in video |
| [ ] Vercel deployment works |
| [ ] GitHub repo is public |

---

## Appendix A: Sir Reginald WITNESS Voice Examples

### During Session

**Step Detection:**
- "Ah, moving on to assembly. I shall note the transition."
- "A new phase begins. The sanding, I see."

**Technique Observation:**
- "That's a clever jig arrangement. Reminds me of a method we used at Windsor."
- "I notice you're using tape to prevent tearout. A wise technique I shall document."

**Problem Detection:**
- "Hmm, I see some trouble there. Layer separation, if I'm not mistaken. Let's see how you address it."
- "A spot of difficulty with the alignment. I'm watching."

**Solution Noted:**
- "Ah, well recovered. Adjusting the temperature seems to have done the trick."
- "Splendid fix. I've noted the solution for the documentation."

**General Commentary:**
- "This is coming along nicely, [Name]."
- "I must say, your workspace organization is commendable."

**THE SHOUT (Preserved):**
- "[NAME]! HAND!"
- "Do forgive me - but that was rather close. Are you quite alright?"

### Document Generation

**Starting:**
- "Right then, let me compile what I've witnessed into proper documentation."

**Complete:**
- "The documentation is ready for your review, [Name]. Quite a productive session, I must say."

---

## Appendix B: Document Template

```markdown
# [PROJECT_NAME] - Tutorial by Sir Reginald

*Documented during a live workshop session on [DATE]*

## Overview

[AI-generated summary of the project - 2-3 sentences describing what was built and the general approach]

## Materials & Tools Observed

**Materials:**
- [List of materials observed being used]

**Tools:**
- [List of tools observed being used]

## Step-by-Step Guide

### Step 1: [Step Title]
**Time:** [START] - [END]

[Description of what was done in this step]

[If thumbnail available: ![Step 1](thumbnail_1.jpg)]

---

### Step 2: [Step Title]
**Time:** [START] - [END]

[Description]

---

[Continue for all steps...]

## Problems Encountered & Solutions

### Problem: [Problem Title]
**Occurred at:** [TIMESTAMP]

**What happened:**
[Description of the problem]

**How it was solved:**
[Description of the solution]

**Lesson learned:**
[Takeaway for future projects]

---

[Continue for all problems...]

## Tips & Techniques

1. **[Technique Name]:** [Description of the technique and why it's effective]
2. **[Technique Name]:** [Description]
3. [Continue...]

## Mistakes to Avoid

1. **[Mistake]:** [What happened and what to do instead]
2. **[Mistake]:** [Description]
3. [Continue...]

## Session Summary

| Metric | Value |
|--------|-------|
| Total Duration | [X hours, Y minutes] |
| Major Steps | [Count] |
| Techniques Documented | [Count] |
| Problems Solved | [Count] |
| Safety Moments | [Count] |

---

*Documented by Sir Reginald Makesworth III*
*"One does not simply build things. One documents the journey."*

*Generated automatically from a live workshop session*
*[DATE AND TIME]*
```

---

## Appendix C: Quick Reference

### New Files to Create

| File | Purpose |
|------|---------|
| `src/types/session.ts` | Session and Moment types |
| `src/lib/moment-parser.ts` | Parse moments from responses |
| `src/lib/document-generator.ts` | Document formatting utilities |
| `src/components/MomentTimeline.tsx` | Timeline UI |
| `src/components/DocumentPreview.tsx` | Document viewer |
| `src/components/ProjectNameInput.tsx` | Project name input |
| `src/components/ExportButtons.tsx` | Export controls |

### Modified Files

| File | Changes |
|------|---------|
| `src/lib/prompts.ts` | New WITNESS system prompt |
| `src/hooks/use-gemini-live.ts` | Moment handling, doc generation |
| `src/app/page.tsx` | New layout with timeline |
| `src/components/StatusBar.tsx` | Session info instead of connection |
| `src/components/OnboardingScreen.tsx` | Add project name step |

### Removed Files

| File | Reason |
|------|--------|
| `src/components/sensitivity-slider.tsx` | Feature cut |
| `src/components/snooze-button.tsx` | Feature cut |
| `src/components/mode-toggle.tsx` | Feature cut |
| `src/components/safety-status-panel.tsx` | Feature cut |
| `src/components/theme-toggle.tsx` | Feature cut |
| `src/lib/fallback-manager.ts` | Simplified |

---

*End of Product Specification v7 - Sir Reginald THE WITNESS*
