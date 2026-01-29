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

**Make full use of the questions feature and ask the user preference questions**
---

## GitHub Updates

**IMPORTANT: After making code changes, remind the user to push to GitHub.**

**Repository:** https://github.com/tyang4-ai/Gimini-Hackathon

**After significant code changes:**
1. Update SESSION.md with changes made
2. Commit with descriptive message (NO "Co-Authored-By" lines)
3. Push to origin main

**Commands:**
```bash
cd "C:\Users\22317\Documents\Coding\Hackathon Stuff\Gemini Hackathon"
git add .
git commit -m "Description of changes"
git push origin main
```

**Never commit:**
- `.env.local` or any `.env*` files (API keys)
- `.claude/` folder
- `node_modules/`

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

All agent outputs go in `utilities/outputs/` folder with this naming:

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

## Project Structure

```
Gemini Hackathon/
├── CLAUDE.md              ← You are here (project instructions)
├── SESSION.md             ← Session context
├── legacy/                ← Old Sir Reginald project (archived)
│   ├── sir-reginald-app/
│   └── outputs-sir-reginald/
├── utilities/
│   ├── Documents/         ← Hackathon docs (1.pdf, 2.pdf)
│   ├── agents/            ← Agent prompts
│   └── outputs/           ← Omnigenesis specs and reviews
├── cli-prototype/         ← Day 1-2 API validation
├── frontend/              ← Next.js app (main project)
└── shared/                ← Shared types, prompts, constants
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
8. **Reference the reference doc** for official documents from the developers

---

## Core Reference Documents (READ BEFORE BUILDING)

**When developing, ALWAYS stay aligned with these documents:**

| Document | Purpose | Path |
|----------|---------|------|
| **Build Plan v1** | Day-by-day execution plan | `utilities/outputs/omnigenesis_build-plan_v1.md` |
| **Product Spec v3** | Full technical spec, features, architecture | `utilities/outputs/pm_product-spec_omnigenesis_v3.md` |
| **Critic Review v2** | Final verdict, remaining concerns | `utilities/outputs/critic_omnigenesis-review_v2.md` |

### Non-Negotiables (From Build Plan)

1. **CLI Prototype First** - Validate all APIs before building UI (Days 1-2)
2. **Combine < 3 seconds** - The addiction loop MUST be fast
3. **Zoom transitions smooth** - The magic moment
4. **Pre-generate demo content** - Never call live APIs during recording
5. **Showcase ALL modalities** - Text (Flash) + Image (Nano Banana) + Video (Veo) + Context (1M)

### Core Loop

1. **COMBINE** - Merge elements to create new things (Gemini 3 Flash + Nano Banana)
2. **ZOOM** - Enter any element to discover worlds inside (image generation)
3. **EVOLVE** - Watch creations develop civilizations (Veo video, async)

### Scope Lock

**IN SCOPE (Must Build):**
- Combine mechanic (12 primordials, drag & drop)
- Zoom mechanic (infinite depth, context memory)
- Evolve mechanic (async Veo, explicit wait messaging)
- Visual polish (cosmic theme, particles)
- Demo video (2 minutes, scripted path)

**OUT OF SCOPE (Do NOT build):**
- Translate feature (killed)
- Export as video (simplified to screenshot)
- Sound effects (only if time permits)
- Mobile optimization
- User accounts / persistence

---

## Agent Execution Rules

### Critic Agent - Fresh Subagent Required

**IMPORTANT: When running the critic agent, ALWAYS spawn a NEW subagent.**

- Do NOT reuse an existing subagent for critic reviews
- Each critic review must start fresh with zero prior context from the conversation
- This minimizes subjectivity and confirmation bias
- The critic should only see: the agent prompt + the document being reviewed
- Pass the critic prompt and relevant files as input, nothing else
