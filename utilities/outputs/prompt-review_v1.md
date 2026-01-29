# Agent Prompt Review Summary

**Reviewer:** Prompt Engineering Expert
**Date:** 2026-01-28
**Files Reviewed:** 7 agent prompts in `utilities/agents/`

---

## Overview

All seven agent prompts have been analyzed and rewritten to follow LLM prompt engineering best practices. The changes focus on clarity, consistency, specificity, and actionability.

---

## Changes by Prompt

### 1. critic.md

**Key Changes:**

| Aspect | Before | After |
|--------|--------|-------|
| Role definition | Embedded in prose with profanity | Clear "Role" section with focused mission |
| Tone guidance | Scattered examples | Consolidated in table format |
| Perspectives | Prose descriptions | Numbered list with clear labels |
| Tests | Mixed with prose | Dedicated "Five Critical Tests" section |
| Output format | Verbose template | Structured with tables for consistency |

**Why Improvements Help:**
- Clearer role definition reduces ambiguity about agent purpose
- Tables make tone guidance scannable and actionable
- Numbered tests provide a concrete evaluation framework
- Structured output template ensures consistent, comparable reviews

### 2. debugger.md

**Key Changes:**

| Aspect | Before | After |
|--------|--------|-------|
| Data collection | Listed as "automatic" | Reframed as "mandatory" with explicit steps |
| Commands | Inline code | Separated into clear code blocks |
| Common issues | List format | Tables with Check/Expected columns |
| Success criteria | Paragraph | Checklist format |
| Process phases | Numbered lists | Phase-based structure with DO NOT SKIP emphasis |

**Why Improvements Help:**
- "Mandatory" framing ensures evidence collection happens first
- Tables for common issues make troubleshooting faster
- Explicit "DO NOT proceed" instructions prevent premature fixes
- Checklist-based success criteria ensures nothing is missed

### 3. marketing-director.md

**Key Changes:**

| Aspect | Before | After |
|--------|--------|-------|
| Prerequisites | Numbered list | Table with File/Purpose columns |
| Judge psychology | Prose | Dedicated section with tables |
| Demo script | Prose template | Table-based timing with Element/Content structure |
| Deliverables | Numbered with prose | Clear numbered sections with requirements |
| Output template | Very long | Streamlined with consistent table structures |

**Why Improvements Help:**
- Table-based prerequisites make dependencies clear
- Judge psychology section provides context before tasks
- Element/Content tables for demo script ensure nothing is missed
- Consistent structure across all sections reduces cognitive load

### 4. market-researcher.md

**Key Changes:**

| Aspect | Before | After |
|--------|--------|-------|
| Context | Scattered throughout | Consolidated in "Hackathon Context" section |
| Prize info | In prose | Table format |
| Judging criteria | List | Table with Criterion/Weight/Focus columns |
| Strategic tracks | Numbered list | Table format |
| Research protocol | Paragraphs | Numbered steps with bold keywords |
| Concept template | Prose | Attribute/Details table structure |

**Why Improvements Help:**
- Consolidated context reduces hunting for information
- Tables for criteria and tracks are more scannable
- Numbered protocol ensures systematic research
- Structured concept template produces comparable outputs

### 5. product-manager.md

**Key Changes:**

| Aspect | Before | After |
|--------|--------|-------|
| Prerequisites | Mixed format | Clean table with File/Purpose |
| Constraints | Prose | Organized into Submission/Technical/Judging sections |
| Tasks | Numbered with prose | Numbered with clear deliverables |
| Tech stack template | JSON-like | Table format |
| Demo script | Prose | Table with Time/Action/Script columns |
| Tools | Bullet list | Table format |

**Why Improvements Help:**
- Clear prerequisite table prevents missing inputs
- Separated constraint types aid comprehension
- Demo script table ensures timing discipline
- Consistent table formatting throughout

### 6. tester.md

**Key Changes:**

| Aspect | Before | After |
|--------|--------|-------|
| Tools | Code blocks with descriptions | Tables organized by category |
| Checklist | Bullet points | Properly formatted checkbox lists |
| Test results template | Prose descriptions | Tables with Test Case/Expected/Actual/Status |
| Bug list | Prose | Tables with ID/Description/Steps/Expected/Actual |
| Workflow | Numbered list | Code-style numbered workflow |

**Why Improvements Help:**
- Tool tables organized by purpose (Setup/Visual/Interaction/Debug)
- Checkbox lists enable tracking completion
- Standardized bug tables ensure reproducibility
- Clear workflow sequence prevents skipped steps

### 7. ui-designer.md

**Key Changes:**

| Aspect | Before | After |
|--------|--------|-------|
| Product context | Long prose | Tables for Features and Interaction Pattern |
| Constraints | Mixed format | Three separate tables (Technical/User/Hackathon) |
| Required screens | Prose heavy | Structured with Must Include/Nice to Have |
| Color palette | Prose description | Clean table with Color/Usage/Hex |
| Component sizes | Embedded | Dedicated table with Desktop/Tablet columns |
| Output template | Very detailed | Streamlined with consistent table structures |

**Why Improvements Help:**
- Tables make constraints immediately clear
- Screen requirements separated into priority tiers
- Design system specifications in implementable format
- Responsive behavior explicitly documented per component

---

## Cross-Cutting Patterns Applied

### 1. Consistent Structure

All prompts now follow this structure:
```
# [Agent] Agent

## Role
[One clear mission statement]

---

## Prerequisites / Context
[Tables of required inputs]

---

## [Main Content Sections]
[Task-specific content]

---

## Output Format
[Exact template to use]

---

## Guidelines
[Numbered best practices]

---

## Tools
[Table of available tools]

---

## Execution Steps
[Numbered sequence to follow]
```

### 2. Tables Over Prose

Converted prose to tables wherever information had consistent attributes:
- Prerequisites (File, Purpose)
- Criteria (Name, Weight, Focus)
- Tools (Tool, Purpose)
- Component sizes (Component, Desktop, Tablet)
- Bug lists (ID, Description, Steps, Expected, Actual)

### 3. Imperative Language

Changed from passive/suggestive to imperative:
- "You should analyze" → "Analyze"
- "Consider reading" → "Read"
- "It would be good to" → "[Do X]"

### 4. Explicit Execution Steps

Every prompt now ends with numbered execution steps that can be followed linearly.

### 5. Clear Output Specification

Every prompt specifies:
- Exact file path and naming convention
- Complete template to follow
- What each section should contain

---

## Patterns Noticed Across Prompts

### Strengths in Original Prompts

1. **Strong personas** - Critic agent had memorable personality
2. **Hackathon awareness** - Good context about judging criteria
3. **Tool documentation** - Chrome MCP commands well documented
4. **Output templates** - Detailed templates provided

### Weaknesses Addressed

1. **Inconsistent structure** - Each prompt had different organization
2. **Prose-heavy instructions** - Hard to scan quickly
3. **Vague task descriptions** - "Research X" without specifying what to find
4. **Missing explicit steps** - What to do first, second, third
5. **Redundant content** - Same information repeated differently
6. **Output format variations** - Templates not matching actual examples

---

## Recommendations for Future Prompts

1. **Start with role** - One sentence mission statement
2. **Use tables** - For any structured information
3. **Number execution steps** - Clear sequence to follow
4. **Provide examples** - Show, don't just tell
5. **Specify what NOT to do** - Guardrails prevent errors
6. **End with clear output** - Exact format expected
7. **Keep consistent across agents** - Same structure, similar formatting

---

## Summary

| Prompt | Lines Before | Lines After | Key Improvement |
|--------|--------------|-------------|-----------------|
| critic.md | 267 | 273 | Structured tests and evaluation framework |
| debugger.md | 111 | 203 | Mandatory evidence collection protocol |
| marketing-director.md | 489 | 386 | Streamlined with table-based structure |
| market-researcher.md | 180 | 233 | Consolidated context, structured concepts |
| product-manager.md | 342 | 404 | Clear task decomposition and templates |
| tester.md | 368 | 404 | Organized tools, standardized bug tracking |
| ui-designer.md | 433 | 426 | Implementable design system specification |

All prompts now follow consistent formatting, use tables for structured data, and provide clear execution sequences.
