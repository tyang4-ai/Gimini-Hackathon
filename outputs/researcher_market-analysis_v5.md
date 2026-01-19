# Market Research v5 - Workshop Copilot (Expanded SafeShop)

**Agent:** Market Researcher
**Version:** v5 (Expanded concept based on user direction)
**Date:** January 15, 2026
**Status:** Ready for Critic Review

---

## Executive Summary

Building on SafeShop (v4), this version expands the concept into **WorkshopCopilot** - a comprehensive AI assistant for maker spaces and home workshops. Think "Claude in Chrome, but for physical workshops with cameras and live video."

**The Core Concept:** An AI that sees your workshop through cameras, understands your tools and projects, and guides you through everything from safety to technique to troubleshooting - in real-time via voice.

---

## Concept: WorkshopCopilot

### The Vision

**"Claude in Chrome for Physical Workshops"**

Just as Claude in Chrome watches your browser and helps you navigate digital tasks, WorkshopCopilot watches your workshop through webcams and helps you navigate physical making tasks.

| Claude in Chrome | WorkshopCopilot |
|------------------|-----------------|
| Sees your browser | Sees your workshop via webcam |
| Understands web pages | Understands tools, materials, projects |
| Helps with digital tasks | Helps with physical making |
| Voice + visual guidance | Voice + visual guidance |
| Context-aware assistance | Context-aware assistance |

---

### Problem Statement

**The Maker's Dilemma:**

1. **Information Overload** - YouTube tutorials, manuals, forums... but nothing answers YOUR specific question in YOUR moment
2. **Safety Gaps** - Beginners don't know what they don't know. Dangerous habits form without feedback
3. **Tool Complexity** - Each tool has settings, protocols, best practices. Hard to remember everything
4. **Isolation** - Most makers work alone. No mentor to ask "is this right?"
5. **Context Switching** - Stopping work to Google/YouTube breaks flow and gets hands dirty

**The Opportunity:**
An AI that watches your workspace, knows your tools, and is always available to answer "how do I..." or warn "don't do that" - hands-free, in real-time.

---

### Target User

**Primary:** Home workshop enthusiasts, maker space members, hobbyist fabricators

**Demographics:**
- Age 25-55
- Mix of beginners and intermediate makers
- Own or have access to: 3D printers, laser cutters, basic woodworking tools
- Learn primarily from YouTube, forums, trial and error
- Frustrated by information fragmentation

**Use Cases:**
- "How do I level this 3D printer bed?"
- "What speed should I use for cutting this acrylic?"
- "Is my wood joint technique correct?"
- "Why is my print failing?"
- "Am I doing this safely?"

---

### Tool & Protocol Knowledge Base

**WorkshopCopilot knows (not exhaustive, focused on common maker tools):**

#### 3D Printing
| Topic | Knowledge |
|-------|-----------|
| Bed Leveling | Paper test technique, auto-leveling procedures |
| Filament Types | PLA, PETG, ABS settings, temperature ranges |
| Print Settings | Layer height, infill %, supports, adhesion |
| Troubleshooting | Stringing, warping, layer adhesion, clogs |
| Safety | Fume ventilation, hot end burns, pinch points |

#### Laser Cutting
| Topic | Knowledge |
|-------|-----------|
| Material Settings | Power/speed for wood, acrylic, cardboard, leather |
| Focus & Alignment | Proper focus distance, mirror alignment |
| File Prep | Vector vs raster, kerf compensation |
| Safety | Eye protection, fume extraction, fire watch |
| Troubleshooting | Incomplete cuts, burn marks, engraving depth |

#### Design Software (Simple Tools)
| Tool | Knowledge |
|------|-----------|
| Inkscape | SVG creation, path operations, text to path, export for laser |
| Tinkercad | Basic 3D modeling, combining shapes, export STL |
| Canva | Simple design layouts (for vinyl cutting, etc.) |
| Cura/PrusaSlicer | Slicing basics, support generation, print preview |

**NOT included (too complex, specialist tools):**
- Rhino, AutoCAD, Fusion 360, SolidWorks
- CNC machining (mill, lathe)
- Welding, metalworking
- Advanced electronics (PCB design)

#### Hand Tools & Woodworking
| Topic | Knowledge |
|-------|-----------|
| Saw Types | When to use miter, table, circular, jig saw |
| Joinery | Basic joints (butt, pocket, dowel, biscuit) |
| Measuring | Reading tape, square check, marking techniques |
| Sanding | Grit progression, technique |
| Safety | Push sticks, blade guards, PPE, stance |

#### General Workshop
| Topic | Knowledge |
|-------|-----------|
| Material ID | Wood types, plastic types, metal basics |
| Fasteners | Screw types, when to pre-drill, anchors |
| Finishing | Stain, paint, sealant basics |
| Organization | Tool storage, workflow optimization |

---

### Why Gemini Live is ESSENTIAL

| Capability | How WorkshopCopilot Uses It |
|------------|----------------------------|
| **Continuous Video (1 FPS)** | Watches workspace, identifies tools in use, monitors safety |
| **Sub-250ms Voice Response** | Real-time guidance without stopping work |
| **Proactive Intervention** | Speaks up when it sees danger or mistakes |
| **Context Awareness** | Knows your project, remembers previous questions |
| **Multimodal Understanding** | Sees what you're doing + hears your questions |
| **Barge-In Capability** | Can interrupt for safety-critical alerts |

**Why NOT Other APIs:**

| API | Limitation |
|-----|------------|
| OpenAI Realtime | Audio-only. Can't see the workshop. |
| GPT-4 Vision | Request-response. Can't continuously monitor. |
| Claude | No real-time streaming at all. |
| Local Models | Too slow for real-time safety intervention. |

**Gemini Live is the ONLY option** for continuous video monitoring + real-time voice interaction.

---

### Core Features

#### 1. Safety Monitor (From SafeShop)
- **What it watches:** PPE (glasses, gloves), hand positions, tool guards, proper stance
- **How it alerts:** Voice warning + visual indicator
- **Example:** "Safety glasses not detected. The laser cutter requires eye protection."

#### 2. Tool Guide Mode
- **What it does:** Step-by-step guidance for using specific tools
- **How it works:** User says "Help me level my 3D printer bed" → AI walks through each step, watching progress via camera
- **Example:** "Place paper under the nozzle... now adjust the left front knob until you feel slight resistance... good, move to the next corner."

#### 3. Troubleshooter
- **What it does:** Diagnoses problems based on what it sees
- **How it works:** User says "Why is my print failing?" → AI analyzes visible symptoms
- **Example:** "I can see the first layer isn't adhering well. The nozzle looks too high. Let's re-level the bed."

#### 4. Settings Advisor
- **What it does:** Recommends settings based on material and tool
- **How it works:** User shows material to camera → AI identifies and recommends
- **Example:** "That looks like 3mm birch plywood. For clean cuts on your laser, try 15% power at 20mm/s. Do a test cut first."

#### 5. Technique Coach
- **What it does:** Watches your technique and provides feedback
- **How it works:** Continuous observation during work
- **Example:** "Your chisel angle is too steep - try lowering to about 25 degrees for a cleaner cut."

#### 6. Project Context
- **What it does:** Remembers your current project and provides relevant help
- **How it works:** User uploads project files/describes goal → AI maintains context
- **Example:** "Since you're making the hexagon shelf, remember to account for the 0.2mm kerf when cutting the joints."

---

### MEASURABLE Success Metrics

| Metric | How Measured | What It Shows |
|--------|--------------|---------------|
| Safety Compliance | % of time PPE detected when required | Safety improvement |
| Task Completion | User confirms step completed | Guidance effectiveness |
| Troubleshooting Accuracy | Problem correctly identified | Diagnostic capability |
| Settings Accuracy | Successful cut/print with recommended settings | Knowledge quality |
| Response Latency | Time from question to answer | Real-time capability |
| Session Duration | How long users engage | Value/stickiness |

---

### Demo Scenario (3 minutes, no acting required)

**Setup:** Webcam pointed at workspace with 3D printer and/or laser cutter visible.

**Script:**

**[0:00-0:20] Introduction**
> "Meet WorkshopCopilot - your AI workshop assistant. It sees your workspace through this camera, knows your tools, and guides you in real-time. Let me show you."

**[0:20-0:50] Safety Demo**
> *Walk toward laser cutter without safety glasses*
>
> **AI:** "Hold on - I don't see safety glasses. The laser cutter requires eye protection before operation."
>
> *Put on glasses*
>
> **AI:** "Safety glasses confirmed. You're good to proceed."

**[0:50-1:30] Tool Guidance Demo**
> "I want to cut some acrylic but I'm not sure about the settings."
>
> *Hold up acrylic sheet to camera*
>
> **AI:** "That looks like 3mm clear acrylic. For your 40W laser, I'd recommend: Power 70%, Speed 15mm/s. Make sure your exhaust fan is running - acrylic fumes are harmful."
>
> "What about for engraving?"
>
> **AI:** "For engraving on acrylic, drop to Power 15%, Speed 150mm/s. That'll give you a nice frosted effect without melting."

**[1:30-2:10] Troubleshooting Demo**
> *Show 3D print with visible stringing*
>
> "My prints keep coming out like this. What's wrong?"
>
> **AI:** "I can see stringing between the parts - those thin threads. This usually means your retraction settings need adjustment or your temperature is too high. What filament are you using?"
>
> "PLA at 210 degrees."
>
> **AI:** "210 is on the high end for PLA. Try dropping to 195-200 and increase retraction to 6mm. That should clean up the stringing."

**[2:10-2:45] Technique Demo**
> *Start making a cut with hand positioning slightly wrong*
>
> **AI:** "I notice your hand is close to the blade path. Move it back about 6 inches and use the push stick for this cut."
>
> *Adjust position*
>
> **AI:** "Good positioning. Safe to proceed."

**[2:45-3:00] Closing**
> "WorkshopCopilot - an expert maker always watching, always ready to help. Built with Gemini Live API."

---

### Why This Demo Works

| Factor | Why It Succeeds |
|--------|-----------------|
| **No acting required** | Just use tools naturally, AI responds |
| **Multiple capabilities shown** | Safety + guidance + troubleshooting + technique |
| **Objective verification** | Judges can see the stringing, see the hand position |
| **Relatable** | Many judges have 3D printers or know someone who does |
| **Novel framing** | "Claude in Chrome for workshops" is immediately understood |
| **Clear Gemini fit** | "Only Gemini can watch and respond in real-time" |

---

### Competitive Landscape

| Competitor | What They Do | Gap WorkshopCopilot Fills |
|------------|--------------|---------------------------|
| YouTube Tutorials | Pre-recorded, generic | Can't see YOUR situation |
| Manufacturer Manuals | Static documentation | Can't answer follow-ups |
| Reddit/Forums | Async Q&A | Slow, not real-time |
| TimberTinker AI | Woodworking chatbot | No video, can't see work |
| 3D Print AI tools | Analyze uploaded images | Not real-time, not voice |

**The Gap:** No tool combines **continuous video monitoring + real-time voice interaction + maker knowledge base**.

---

### Technical Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Webcam    │  │  Microphone │  │  Speaker/Earbuds    │  │
│  │   Feed      │  │   Input     │  │     Output          │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────▲──────────┘  │
└─────────┼────────────────┼─────────────────────┼─────────────┘
          │                │                     │
          ▼                ▼                     │
┌─────────────────────────────────────────────────────────────┐
│                    GEMINI LIVE API                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Continuous Video Stream (1 FPS)         │    │
│  │              + Audio Input Stream                    │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              System Prompt (Knowledge Base)          │    │
│  │  - Tool protocols (3D printing, laser, woodworking) │    │
│  │  - Safety rules                                      │    │
│  │  - Troubleshooting guides                            │    │
│  │  - Project context                                   │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Voice Output (Sub-250ms)                │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Knowledge Base Structure

```
workshop_knowledge/
├── safety/
│   ├── general_ppe.md
│   ├── laser_cutter_safety.md
│   ├── 3d_printer_safety.md
│   └── power_tool_safety.md
├── tools/
│   ├── 3d_printing/
│   │   ├── bed_leveling.md
│   │   ├── filament_guide.md
│   │   ├── troubleshooting.md
│   │   └── slicer_settings.md
│   ├── laser_cutting/
│   │   ├── material_settings.md
│   │   ├── alignment.md
│   │   └── file_prep.md
│   ├── woodworking/
│   │   ├── saw_types.md
│   │   ├── joinery.md
│   │   └── finishing.md
│   └── software/
│       ├── inkscape_basics.md
│       ├── tinkercad_guide.md
│       └── slicer_basics.md
└── troubleshooting/
    ├── 3d_print_failures.md
    ├── laser_cut_issues.md
    └── common_mistakes.md
```

---

### Scoring

| Criterion | Score | Reasoning |
|-----------|-------|-----------|
| **Innovation** | 9/10 | "Claude in Chrome for workshops" is novel framing, continuous video + voice + maker knowledge doesn't exist |
| **Demo Reliability** | 9/10 | Multiple demo scenarios, all objective (stringing visible, hand position visible, settings verifiable) |
| **Judge Freshness** | 10/10 | Zero competition in "AI workshop assistant with live video" space |
| **Feasibility** | 8/10 | Core tech (Gemini Live) is ready; knowledge base requires curation but no ML training |
| **Gemini Lock-In** | 10/10 | Impossible without Gemini Live's continuous video + voice capability |
| **Impact** | 8/10 | Maker community is passionate, 3D printing alone is $20B+ market |
| **Total** | **36/40** | |

---

### Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Gemini misidentifies tool/material | Medium | Medium | Test extensively; add "I'm not sure, can you tell me what that is?" fallback |
| Knowledge base has gaps | Medium | High | Focus demo on well-documented tools (3D printer, laser); acknowledge limitations |
| Latency too high for safety | High | Low | Test safety scenarios early; have backup alert system |
| Judges don't relate to maker space | Medium | Medium | Frame as "Claude in Chrome for physical world" - they'll get that analogy |
| Demo equipment fails | High | Low | Have backup video; test equipment morning-of |

---

### Why This Wins

1. **Novel Category** - No one has built "AI workshop assistant with live video"
2. **Clear Gemini Differentiation** - Only API that can do continuous video + voice
3. **Relatable Analogy** - "Claude in Chrome for workshops" instantly understood
4. **Multiple Demo Hooks** - Safety, guidance, troubleshooting all visually compelling
5. **Passionate Community** - Makers will share this; potential virality
6. **Scalable Vision** - "Every maker space, every classroom, every home workshop"

---

### Comparison to Previous Concepts

| Aspect | PresenceCoach (v3) | SafeShop (v4) | WorkshopCopilot (v5) |
|--------|-------------------|---------------|----------------------|
| Domain | Pitch coaching | Workshop safety | Workshop everything |
| Scope | Single use case | Single use case | Multi-use (safety + guide + troubleshoot) |
| Category Saturation | HIGH | LOW | VERY LOW |
| Demo Acting Required | Yes | Minimal | No |
| Knowledge Depth | Shallow (energy vibes) | Medium (safety rules) | Deep (tool protocols, settings, techniques) |
| Value Proposition | "Coach your pitch" | "Stay safe" | "Expert maker always available" |
| Memorability | Medium | High | Very High |

---

## Final Recommendation

**Build WorkshopCopilot.**

It combines:
- SafeShop's safety monitoring (proven demo reliability)
- Comprehensive maker tool knowledge (3D printing, laser, woodworking, Inkscape)
- The "Claude in Chrome" framing (immediately understood)
- Multiple demo scenarios (safety + guidance + troubleshooting)
- Zero competition in category

**This is the fullest expression of what Gemini Live can do in the physical world.**

---

*Ready for Critic Review*
