# Claude Project Instructions

This file contains instructions for Claude when working on the Gemini 3 Hackathon project.

---

## User Approval Requirements

**IMPORTANT: Do NOT proceed with major decisions without explicit user approval.**

### Requires User Approval (MUST WAIT):
- Approving concepts to build (e.g., after critic says "BUILD")
- Pivoting to a different product idea
- Major architectural decisions
- Proceeding to next workflow phase (e.g., Research → PM → Build)
- Any significant strategic choice

### Does NOT Require Approval (proceed freely):
- Writing and editing code
- Running agents when explicitly requested
- Creating/updating files
- Fixing bugs
- Technical implementation details
- Research and information gathering

**When in doubt, ASK before proceeding with major decisions.**

---

## Session Context Management

### SESSION.md Setup

**At the start of EVERY session, check for `SESSION.md` in the project root.**

If it doesn't exist, create it with this template:

```markdown
# Gemini 3 Hackathon - Session Context

## Project Status
- **Current Phase:** [Research / Planning / Development / Testing / Polish]
- **Last Updated:** [Date and Time]
- **Active Agent:** [None / researcher / pm / critic / tester / marketing]

---

## Quick Context

### What We're Building
[One sentence description of the chosen product]

### Current Focus
[What we're working on right now]

### Blockers
- [Any blockers or issues]

---

## Progress Tracker

### Completed
- [ ] Market Research (`researcher_market-analysis_v1.md`)
- [ ] Product Spec (`pm_product-spec_v1.md`)
- [ ] Critical Review (`critic_review_v1.md`)
- [ ] Testing (`tester_report_v1.md`)
- [ ] Pitch Strategy (`marketing_pitch_v1.md`)
- [ ] Code Implementation
- [ ] Demo Video

### In Progress
- [Current task]

### Next Up
- [Next task]

---

## Key Decisions Made
| Decision | Choice | Rationale | Date |
|----------|--------|-----------|------|
| [Decision 1] | [Choice] | [Why] | [Date] |

---

## File Versions

| Agent | Latest Version | Status |
|-------|---------------|--------|
| Researcher | v1 | Complete |
| PM | v1 | Complete |
| Critic | v1 | Complete |
| Tester | v1 | Pending |
| Marketing | v1 | Pending |

---

## Important Links
- Hackathon: https://gemini3.devpost.com
- Gemini API Docs: https://ai.google.dev/gemini-api/docs
- AI Studio: https://aistudio.google.com

---

## Session Log

### [Date] - Session N
**Duration:** [X hours]
**Focus:** [What was worked on]
**Accomplishments:**
- [What was done]

**Next Session:**
- [What to do next]
```

---

### Session Update Protocol

**At the END of every major task and every session session, update SESSION.md with:**

1. **Update "Last Updated"** timestamp
2. **Update "Current Phase"** if changed
3. **Update "Progress Tracker"** checkboxes
4. **Update "File Versions"** table
5. **Add entry to "Session Log"** with:
   - What was accomplished
   - Key decisions made
   - What to do next session

This ensures continuity across sessions and prevents losing context.

---

## Output Naming Convention

All agent outputs go in `outputs/` folder with this naming:

```
{agent}_{task}_{version}.md
```

| Agent | Prefix | Example |
|-------|--------|---------|
| Market Researcher | `researcher_` | `researcher_market-analysis_v1.md` |
| Product Manager | `pm_` | `pm_product-spec_v1.md` |
| Critic | `critic_` | `critic_review_v1.md` |
| Tester | `tester_` | `tester_report_v1.md` |
| Marketing Director | `marketing_` | `marketing_pitch_v1.md` |

**Version incrementing:**
- v1: Initial output
- v2: After revisions based on feedback
- v3+: Subsequent iterations

---

## Agent Workflow

Run agents in this order:

```
1. Market Researcher → researcher_market-analysis_v1.md
      ↓
2. Product Manager → pm_product-spec_v1.md
      ↓
3. Critic → critic_review_v1.md
      ↓
   [Iterate: Fix issues, re-run PM → Critic until BUILD verdict]
      ↓
4. [Build the actual product]
      ↓
5. Tester → tester_report_v1.md
      ↓
   [Fix bugs, re-test until DEMO READY]
      ↓
6. Marketing Director → marketing_pitch_v1.md
```

---

## Project Structure

```
Gemini Hackathon/
├── CLAUDE.md              ← You are here (project instructions)
├── SESSION.md             ← Session context (create if missing)
├── Documents/
│   ├── 1.pdf              ← Hackathon overview
│   ├── 2.pdf              ← Rules and judging
│   ├── Resources and links.txt
│   └── EXPERIENCE.md      ← Lessons from past projects
├── agents/
│   ├── market-researcher.md
│   ├── product-manager.md
│   ├── critic.md
│   ├── tester.md
│   └── marketing-director.md
├── outputs/               ← Agent outputs go here
│   └── [agent]_[task]_v[N].md
└── src/                   ← Code goes here (when building)
```

---

## Hackathon Context (Quick Reference)

**Deadline:** February 9, 2026 at 5:00 PM PT
**Prize:** $50K grand, $20K 2nd, $10K 3rd

**Judging:**
- Technical Execution: 40%
- Innovation/Wow Factor: 30%
- Potential Impact: 20%
- Presentation/Demo: 10%

**Must Use:** Gemini 3 API

**Avoid:**
- Simple RAG
- Prompt wrappers
- Generic chatbots
- Basic vision analyzers

---

## Important Reminders

1. **Always read SESSION.md first** to understand current context
2. **Always update SESSION.md** at session end
3. **Use the correct output naming** convention
4. **Check for latest versions** of agent outputs before reading
5. **Be harsh in critiques** - nice feedback doesn't win hackathons
6. **Think demo-first** - everything should be demoable
7. **Use Chrome MCP** for visual testing when code is ready

---

## Core Reference Documents (READ BEFORE BUILDING)

**When developing, ALWAYS stay aligned with these documents:**

| Document | Purpose | Path |
|----------|---------|------|
| **Positioning v4** | Core identity, differentiators, messaging | `outputs/researcher_positioning_v4.md` |
| **Product Spec v6** | Full technical spec, features, architecture | `outputs/pm_product-spec_v6.md` |
| **UI Spec v3** | Component code, design system, UX patterns | `outputs/designer_ui-spec_v3.md` |
| **Critic Review v7** | Final verdict, remaining concerns | `outputs/critic_review_v7.md` |

### Non-Negotiables (From Positioning)

1. **"Before, not after"** - Real-time intervention, not post-upload analysis
2. **Sir Reginald personality** - British aristocrat, never breaks character
3. **THE SHOUT** - Emergency "[NAME]! HAND!" moment must work reliably
4. **5 hardcoded scenarios** - glasses, blade, clutter, grip, hearing
5. **Guided camera setup** - Sir Reginald directs camera positioning
6. **Voice-first, hands-free** - Users have dirty hands, can't type

### Scope Lock

**IN SCOPE:**
- Safety Monitor (proactive) - 5 scenarios
- Visual Troubleshooter (reactive)
- Guided camera setup
- Latency indicator, thinking monocle
- Personalization (name)
- Auto-dismiss alerts (8s)

**OUT OF SCOPE (Do NOT build):**
- Complex CAD integration
- CNC/welding/electronics
- Mobile-first design
- Multi-user features
- Analytics dashboard (mock only)

---

## Agent Execution Rules

### Critic Agent - Fresh Subagent Required

**IMPORTANT: When running the critic agent, ALWAYS spawn a NEW subagent.**

- Do NOT reuse an existing subagent for critic reviews
- Each critic review must start fresh with zero prior context from the conversation
- This minimizes subjectivity and confirmation bias
- The critic should only see: the agent prompt + the document being reviewed
- Pass the critic prompt and relevant files as input, nothing else
