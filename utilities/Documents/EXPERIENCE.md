# Claude GUI Companion - Development Experience & Lessons Learned

## Overview
This document captures the knowledge, patterns, and lessons learned during the development and UI redesign of Claude GUI Companion.

## 1. User Preferences Observed
- Preference for visual verification using Chrome browser automation
- Likes detailed, step-by-step documentation
- Prefers subagents for parallel task execution
- Values SESSION.md updates after each task completion
- Appreciates comprehensive fix lists with file references

## 2. Project Architecture Insights

### Tech Stack
- Tauri 2.0 + React 19 + TypeScript + Vite
- Zustand for state management
- No Tailwind CSS - uses CSS variables in index.css
- Inline styles in components (not CSS modules)

### Key Patterns
- Components use inline style objects, not className with Tailwind
- CSS variables defined in :root in src/index.css
- Tool cards have colored left borders for visual differentiation
- Glass effect using backdrop-filter for modals

## 3. CSS & Styling Lessons

### OKLCH Color System
- Modern color format: `oklch(lightness chroma hue)`
- Example: `oklch(0.82 0.16 165)` = mint green
- Hue values: 165=green, 240=blue, 260=purple, 55=amber, 25=red

### Color Variable Pattern
```css
--color-bg-base: oklch(0.14 0.015 260);     /* Darkest */
--color-bg-surface: oklch(0.18 0.015 260);  /* Cards */
--color-bg-elevated: oklch(0.21 0.015 260); /* Modals */
--color-bg-overlay: oklch(0.24 0.015 260);  /* Hover */
```

### Ghost Button Pattern
```tsx
backgroundColor: "transparent",
border: "1px solid var(--color-accent)",
color: "var(--color-accent)",
// Hover: backgroundColor: "rgba(130, 230, 190, 0.1)"
```

## 4. Component Patterns

### Tool Card Left Border
```tsx
<div style={{
  position: 'absolute',
  left: 0, top: 0, bottom: 0,
  width: '3px',
  borderRadius: 'var(--radius-lg) 0 0 var(--radius-lg)',
  backgroundColor: 'var(--color-tool-bash)'
}} />
```

### Settings Panel - Two Column Modal
- Left sidebar: 192px with category buttons
- Right content: flex-1 with scrollable content
- Active category: accent color with 15% opacity background

### Command Palette
- Centered modal at 20% from top
- Backdrop with blur effect
- Selected item: background highlight (not border)
- Footer with keyboard hints

## 5. Common Errors & Solutions

### Error: Hardcoded colors not updating
**Problem:** Components using hardcoded hex colors instead of CSS variables
**Solution:** Replace all hardcoded colors with var(--color-*) references

### Error: Dev server not reflecting changes
**Problem:** Browser showing cached styles after code changes
**Solution:**
1. Hard refresh (Ctrl+Shift+R)
2. Restart dev server: `npx kill-port 1420 && npm run dev`

### Error: TypeScript strict mode violations
**Problem:** Using `any` type or missing type annotations
**Solution:** Define proper interfaces for all props and state

### Error: Component not using design system
**Problem:** New components created with different styling approach
**Solution:** Always use CSS variables from index.css, follow existing patterns

## 6. Build & Development Commands

```bash
# Development
npm run dev           # Start Vite dev server (port 1420)
npm run tauri dev     # Start with Tauri (desktop mode)

# Building
npm run build         # Build frontend only
npm run tauri build   # Build executable

# Testing
npm run test          # Run unit tests
npm run test:e2e      # Run e2e tests
```

## 7. File Organization

### Component Locations
- `src/components/layout/` - AppShell, Sidebar, TabBar, CommandPalette, SettingsPanel
- `src/components/tools/` - BashCard, EditCard, ReadCard, GlobGrepCard
- `src/components/mcp/` - MCPPanel, MCPServerList, MCPAddModal
- `src/components/input/` - InputArea

### Module Locations
- `src/core/` - cli-bridge, edit-arbiter, store, session-storage
- `src/modules/` - commands, context, history, mcp, skills, templates, usage

## 8. Design Template Adaptation Process

When adapting from a design template:
1. Screenshot both apps side-by-side
2. Create detailed fix list with file references
3. Map template's Tailwind classes to CSS variables
4. Update components one by one
5. Verify build after each change
6. Visual verification in browser
7. Update SESSION.md with progress

### Tailwind to CSS Variable Mapping
- `bg-primary/15` → `rgba(var(--color-accent-rgb), 0.15)`
- `text-primary` → `var(--color-accent)`
- `rounded-xl` → `var(--radius-lg)` or `12px`
- `bg-muted` → `var(--color-bg-overlay)`

## 9. Subagent Usage Patterns

### When to use subagents:
- Multiple independent file modifications
- Parallel component updates
- Build verification
- Documentation creation

### Best practices:
- Provide detailed instructions with file paths
- Include code snippets for reference
- Request SESSION.md updates in each task
- Specify build verification step

## 10. Session Management

### SESSION.md Best Practices
- Update after each major task
- Include status, files modified, changes made
- Use checkbox format for pending tasks
- Keep "Current Phase" and "App Status" updated

## 11. Browser Automation Notes

### Chrome MCP Plugin Usage
- Always get tab context first
- Use find() for element discovery
- Screenshots for verification
- Hard refresh after code changes
- Connection can be unstable - retry on failure

## 12. Future Recommendations

1. Consider migrating to Tailwind CSS for easier template adaptation
2. Add pre-commit hooks for linting
3. Increase test coverage for UI components
4. Consider dark/light theme toggle testing
5. Add accessibility testing (ARIA labels, keyboard navigation)

---

*This document was generated based on the development session for Claude GUI Companion UI redesign.*
