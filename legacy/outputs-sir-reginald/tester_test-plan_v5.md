# Sir Reginald Test Plan v5 - Comprehensive & Rigorous

**Version:** 5.0
**Date:** January 19, 2026
**Target:** 100% Feature Coverage for Hackathon Demo
**Specification Reference:** Product Spec v10, Verification Report v1 (100% implemented)

---

## Executive Summary

| Metric | Value |
|--------|-------|
| **Total Tests** | 247 |
| **Category A (Automated)** | 168 tests |
| **Category B (Human/Workshop)** | 79 tests |
| **Estimated Time - Automated** | 4.5 hours |
| **Estimated Time - Manual** | 6 hours |
| **Critical Path Tests** | 23 (THE SHOUT reliability) |

### Test Philosophy

This plan operates on the principle: **If it's in the demo, it must be tested 10 ways.**

THE SHOUT is the money moment. It gets 20+ dedicated tests because one failure during recording ruins everything.

---

## Category A: Automated Tests

### A1. Unit Tests (Jest)

> **Estimated Time:** 45 minutes
> **Test Location:** `sir-reginald-app/__tests__/`

#### A1.1 Response Parser Tests (`response-parser.ts`)

| Test ID | Test Name | Input | Expected Output | Priority |
|---------|-----------|-------|-----------------|----------|
| A1.1.1 | Parse valid shout tag | `<shout scenario="hand_near_blade">Marcus! HAND!</shout>` | `{ scenario: 'hand_near_blade', message: 'Marcus! HAND!', userName: 'Marcus' }` | P0 |
| A1.1.2 | Parse shout tag with hot_surface scenario | `<shout scenario="hot_surface">Watch out!</shout>` | `{ scenario: 'hot_surface', message: 'Watch out!', userName: 'User' }` | P0 |
| A1.1.3 | Parse shout tag with improper_grip | `<shout scenario="improper_grip">Both hands!</shout>` | `{ scenario: 'improper_grip', ... }` | P0 |
| A1.1.4 | Parse shout tag with immediate_danger | `<shout scenario="immediate_danger">STOP!</shout>` | `{ scenario: 'immediate_danger', ... }` | P0 |
| A1.1.5 | Parse shout tag with invalid scenario | `<shout scenario="invalid">Text</shout>` | Falls back to `immediate_danger` | P0 |
| A1.1.6 | Parse shout tag returns null for no match | `Regular text without tags` | `null` | P0 |
| A1.1.7 | Remove shout tag from text | `Before <shout scenario="x">Y</shout> After` | `Before After` | P1 |
| A1.1.8 | hasShoutTag returns true when present | `<shout scenario="hand_near_blade">X</shout>` | `true` | P1 |
| A1.1.9 | hasShoutTag returns false when absent | `Regular text` | `false` | P1 |
| A1.1.10 | Parse moment tag - new_step type | `<moment>{"type":"new_step","title":"Test"}</moment>` | Valid DetectedMoment with type 'new_step' | P1 |
| A1.1.11 | Parse moment tag - technique type | `<moment>{"type":"technique","title":"T"}</moment>` | type = 'technique' | P1 |
| A1.1.12 | Parse moment tag - problem type | `<moment>{"type":"problem","title":"P"}</moment>` | type = 'problem' | P1 |
| A1.1.13 | Parse moment tag - solution type | `<moment>{"type":"solution","title":"S"}</moment>` | type = 'solution' | P1 |
| A1.1.14 | Parse moment tag - mistake type | `<moment>{"type":"mistake","title":"M"}</moment>` | type = 'mistake' | P1 |
| A1.1.15 | Parse moment tag - tip type | `<moment>{"type":"tip","title":"T"}</moment>` | type = 'tip' | P1 |
| A1.1.16 | Parse moment tag - lesson type | `<moment>{"type":"lesson","title":"L"}</moment>` | type = 'lesson' | P1 |
| A1.1.17 | Parse moment tag - safety type | `<moment>{"type":"safety","title":"S"}</moment>` | type = 'safety' | P1 |
| A1.1.18 | Parse moment tag with invalid type | `<moment>{"type":"invalid"}</moment>` | Falls back to 'tip' | P1 |
| A1.1.19 | Parse malformed moment JSON gracefully | `<moment>{malformed json}</moment>` | No crash, moment skipped | P1 |
| A1.1.20 | Parse suggestion tag | `<suggestion>{"scenario":"x","count":3,"suggestion":"y"}</suggestion>` | Valid SafetySuggestion | P1 |
| A1.1.21 | Parse document tag | `<document># Doc Title\nContent</document>` | Extracted document string | P1 |
| A1.1.22 | extractScenarioFromWarning - hand_near_blade | `Your hand is near the blade!` | `'hand_near_blade'` | P0 |
| A1.1.23 | extractScenarioFromWarning - missing_glasses | `You need safety glasses` | `'missing_glasses'` | P1 |
| A1.1.24 | extractScenarioFromWarning - cluttered_workspace | `Your workspace is cluttered` | `'cluttered_workspace'` | P1 |
| A1.1.25 | extractScenarioFromWarning - improper_grip | `Use a two-hand grip` | `'improper_grip'` | P1 |
| A1.1.26 | extractScenarioFromWarning - missing_hearing | `Loud noise, hearing protection` | `'missing_hearing'` | P1 |
| A1.1.27 | extractScenarioFromWarning - no match | `General observation text` | `null` | P1 |
| A1.1.28 | removeAllTags removes all structured tags | Text with all tag types | Clean plain text | P2 |
| A1.1.29 | hasStructuredTags detects any tag | Various inputs | Boolean as expected | P2 |
| A1.1.30 | validateMomentType normalizes case | `'NEW_STEP'` | `'new_step'` | P2 |

#### A1.2 Injury Statistics Tests (`injury-statistics.ts`)

| Test ID | Test Name | Description | Expected |
|---------|-----------|-------------|----------|
| A1.2.1 | INJURY_STATISTICS has hand_near_blade | Lookup scenario | Object with injuryType, annualIncidents, source, costs |
| A1.2.2 | INJURY_STATISTICS has missing_glasses | Lookup scenario | Valid statistics object |
| A1.2.3 | INJURY_STATISTICS has cluttered_workspace | Lookup scenario | Valid statistics object |
| A1.2.4 | INJURY_STATISTICS has improper_grip | Lookup scenario | Valid statistics object |
| A1.2.5 | INJURY_STATISTICS has missing_hearing | Lookup scenario | Valid statistics object |
| A1.2.6 | formatCurrency formats correctly | `1000` | `'$1,000'` |
| A1.2.7 | formatCurrency handles large numbers | `150000` | `'$150,000'` |
| A1.2.8 | formatCurrency handles zero | `0` | `'$0'` |
| A1.2.9 | All scenarios have valid cost ranges | Loop through all | estimatedCostLow < estimatedCostHigh |
| A1.2.10 | All scenarios have sources | Loop through all | source is non-empty string |

#### A1.3 Latency Tests (`latency.ts`)

| Test ID | Test Name | Input | Expected |
|---------|-----------|-------|----------|
| A1.3.1 | getLatencyLevel returns 'good' | `< 800ms` | `'good'` |
| A1.3.2 | getLatencyLevel returns 'moderate' | `800-1500ms` | `'moderate'` |
| A1.3.3 | getLatencyLevel returns 'slow' | `1500-2000ms` | `'slow'` |
| A1.3.4 | getLatencyLevel returns 'critical' | `> 2000ms` | `'critical'` |
| A1.3.5 | getLatencyLevel boundary - 799ms | `799` | `'good'` |
| A1.3.6 | getLatencyLevel boundary - 800ms | `800` | `'moderate'` |
| A1.3.7 | getLatencyLevel boundary - 1499ms | `1499` | `'moderate'` |
| A1.3.8 | getLatencyLevel boundary - 1500ms | `1500` | `'slow'` |
| A1.3.9 | getLatencyLevel boundary - 1999ms | `1999` | `'slow'` |
| A1.3.10 | getLatencyLevel boundary - 2000ms | `2000` | `'critical'` |

#### A1.4 Alarm Sound Tests (`alarm-sound.ts`)

| Test ID | Test Name | Description | Expected |
|---------|-----------|-------------|----------|
| A1.4.1 | playShoutAlarm returns stop function | Call playShoutAlarm | Returns object with stop() method |
| A1.4.2 | playAlertBeep executes without error | Call playAlertBeep | No exception thrown |
| A1.4.3 | initAudioContext initializes | Call initAudioContext | No exception |
| A1.4.4 | stop() can be called multiple times | Call stop() twice | No exception |

#### A1.5 Overlay Regions Tests (`overlay-regions.ts`)

| Test ID | Test Name | Input | Expected |
|---------|-----------|-------|----------|
| A1.5.1 | detectRegionFromText - hands | `Watch your hand` | `'hands'` |
| A1.5.2 | detectRegionFromText - face | `Safety glasses` | `'face'` |
| A1.5.3 | detectRegionFromText - tool | `The blade is sharp` | `'tool'` |
| A1.5.4 | detectRegionFromText - general | `Be careful` | `'general'` or null |
| A1.5.5 | detectRegionFromText - no match | `Nice work!` | `null` |

---

### A2. Component Tests (React Testing Library)

> **Estimated Time:** 1.5 hours
> **Dependencies:** @testing-library/react, jest-dom

#### A2.1 ReginaldAvatar Component

| Test ID | Test Name | Props | Verify |
|---------|-----------|-------|--------|
| A2.1.1 | Renders idle state | `state="idle"` | Shows sir-reginald-icon.png |
| A2.1.2 | Renders speaking state | `state="speaking"` | Has avatar-speaking class |
| A2.1.3 | Renders thinking state | `state="thinking"` | Shows sir-reginald-thinking.png |
| A2.1.4 | Renders alarmed state | `state="alarmed"` | Shows sir-reginald-shouting.png, has animate-shake |
| A2.1.5 | Renders pleased state | `state="pleased"` | Shows sir-reginald-icon.png |
| A2.1.6 | Renders relief state | `state="relief"` | Shows sir-reginald-relief.png, has avatar-relief class |
| A2.1.7 | Size sm renders correctly | `size="sm"` | Container has w-12 h-12 |
| A2.1.8 | Size md renders correctly | `size="md"` | Container has w-16 h-16 |
| A2.1.9 | Size lg renders correctly | `size="lg"` | Container has w-24 h-24 |
| A2.1.10 | Size xl renders correctly | `size="xl"` | Container has w-32 h-32 |
| A2.1.11 | Has proper ARIA role | Any props | `role="img"` |
| A2.1.12 | Has proper ARIA label | `state="idle"` | `aria-label="Sir Reginald - idle"` |
| A2.1.13 | Compact variant renders | `isSpeaking={true}` | Has avatar-speaking class |
| A2.1.14 | Compact variant shows relief | `isRelief={true}` | Shows relief image |
| A2.1.15 | Compact variant shows alarmed | `isAlarmed={true}` | Shows shouting image |

#### A2.2 SafetyAlertOverlay Component (THE SHOUT)

| Test ID | Test Name | Props | Verify |
|---------|-----------|-------|--------|
| A2.2.1 | SHOUT renders full-screen backdrop | `type="shout"` | Has shout-backdrop class |
| A2.2.2 | SHOUT displays user name in uppercase | `userName="marcus"` | Shows "MARCUS!" |
| A2.2.3 | SHOUT shows danger type | message contains "hand" | Shows "HAND!" |
| A2.2.4 | SHOUT shows shouting image | `type="shout"` | Image src is sir-reginald-shouting.png |
| A2.2.5 | SHOUT has monocle-flying element | `type="shout"` | Element with class monocle-flying exists |
| A2.2.6 | SHOUT starts with 10s countdown | `type="shout"` | Shows "10s" initially |
| A2.2.7 | SHOUT countdown decrements | Wait 1 second | Shows "9s" |
| A2.2.8 | SHOUT auto-dismisses at 0 | Wait 10 seconds | onDismiss called |
| A2.2.9 | SHOUT dismiss button works | Click TAP button | onDismiss called |
| A2.2.10 | SHOUT keyboard dismiss (Enter) | Press Enter | onDismiss called |
| A2.2.11 | SHOUT keyboard dismiss (Escape) | Press Escape | onDismiss called |
| A2.2.12 | SHOUT keyboard dismiss (Space) | Press Space | onDismiss called |
| A2.2.13 | SHOUT has violent shake animation | `type="shout"` | shout-card has animation |
| A2.2.14 | Danger alert renders correctly | `type="danger"` | Different styling than shout |
| A2.2.15 | Warning alert renders correctly | `type="warning"` | Yellow/brass styling |
| A2.2.16 | Warning starts with 8s countdown | `type="warning"` | Shows "8s" |
| A2.2.17 | Alert shows message in quotes | Any type | Message wrapped in quotes |
| A2.2.18 | ARIA role is alertdialog | `type="shout"` | `role="alertdialog"` |
| A2.2.19 | ARIA modal is true | `type="shout"` | `aria-modal="true"` |
| A2.2.20 | getDangerType extracts FINGERS | message="fingers" | Shows "FINGERS!" |
| A2.2.21 | getDangerType extracts BLADE | message="blade" | Shows "BLADE!" |
| A2.2.22 | getDangerType extracts GLASSES | message="glasses" | Shows "GLASSES!" |
| A2.2.23 | getDangerType extracts STOP | message="stop" | Shows "STOP!" |
| A2.2.24 | getDangerType defaults to DANGER | message="unknown" | Shows "DANGER!" |

#### A2.3 NearMissCounter Component

| Test ID | Test Name | Props | Verify |
|---------|-----------|-------|--------|
| A2.3.1 | Renders header correctly | Any | Shows "NEAR-MISSES PREVENTED" |
| A2.3.2 | Shows count in header | 3 interventions | Shows "3" |
| A2.3.3 | Empty state renders | 0 interventions | Shows "No safety interventions yet" |
| A2.3.4 | Shows intervention details | 1 intervention | Shows timestamp, severity, latency |
| A2.3.5 | CRITICAL badge for shout | type='shout' | Shows "CRITICAL" in red |
| A2.3.6 | Warning badge for warning | type='warning' | Shows "Warning" |
| A2.3.7 | Shows injury statistics | Valid scenario | Shows PREVENTED, STATISTICS, COST AVOIDED |
| A2.3.8 | Shows recovery time | Valid scenario | Shows RECOVERY TIME |
| A2.3.9 | Session total calculates | Multiple interventions | Sum of costs shown |
| A2.3.10 | maxVisible limits display | 10 interventions, max=3 | Only 3 shown |
| A2.3.11 | ARIA region label | Any | `aria-label="Near-miss prevention counter"` |
| A2.3.12 | Format timestamp relative to session | 150 seconds in | Shows "2:30" |

#### A2.4 OnboardingScreen Component

| Test ID | Test Name | Action | Verify |
|---------|-----------|--------|--------|
| A2.4.1 | Initial state shows permissions | Render | "Grant Permissions" button visible |
| A2.4.2 | Shows Sir Reginald avatar | Render | Image with alt "Sir Reginald" |
| A2.4.3 | Camera permission indicator | Before grant | Camera Access not checked |
| A2.4.4 | Microphone permission indicator | Before grant | Microphone Access not checked |
| A2.4.5 | Speaker permission indicator | Before grant | Speaker Access not checked |
| A2.4.6 | Name step shows after permissions | Grant all | Shows "What shall I call you?" |
| A2.4.7 | Name input accepts text | Type "Marcus" | Input value updates |
| A2.4.8 | Continue disabled without name | Name empty | Button disabled |
| A2.4.9 | Continue enabled with name | Name entered | Button enabled |
| A2.4.10 | Ready state shows after name | Submit name | Shows "Excellent, {name}!" |
| A2.4.11 | onComplete called with name | Complete flow | Called with trimmed name |

#### A2.5 CameraSetupScreen Component

| Test ID | Test Name | Stage | Verify |
|---------|-----------|-------|--------|
| A2.5.1 | Initial stage is greeting | Render | Shows greeting dialogue |
| A2.5.2 | Shows Sir Reginald thinking | Render | sir-reginald-thinking.png |
| A2.5.3 | Video element exists | Render | video element in DOM |
| A2.5.4 | Positioning stage shows guide | Stage=positioning | Dashed border overlay visible |
| A2.5.5 | Survey stage shows animation | Stage=survey | "Surveying..." text visible |
| A2.5.6 | Complete stage shows button | Stage=complete | "Begin Monitoring" button |
| A2.5.7 | Button text changes per stage | Each stage | Different button text |
| A2.5.8 | onComplete called at end | Click Begin Monitoring | onComplete called |
| A2.5.9 | Shows user name in final button | userName="Marcus" | "Begin Monitoring, Marcus" |

#### A2.6 LatencyStats Component

| Test ID | Test Name | Props | Verify |
|---------|-----------|-------|--------|
| A2.6.1 | Shows current latency | currentMs=340 | "340ms" displayed |
| A2.6.2 | Good latency shows green | level="good" | Green indicator |
| A2.6.3 | Moderate latency shows yellow | level="moderate" | Yellow indicator |
| A2.6.4 | Slow latency shows orange | level="slow" | Orange indicator |
| A2.6.5 | Critical latency shows red | level="critical" | Red indicator |
| A2.6.6 | Expandable on click | Click header | Shows expanded content |
| A2.6.7 | Pipeline breakdown displays | With breakdown prop | Shows Video/Network/Gemini/Audio |
| A2.6.8 | Session stats show average | History provided | Average calculated |
| A2.6.9 | Session stats show P95 | History provided | P95 calculated |
| A2.6.10 | Progress bar width correct | currentMs=750 | 50% width (of 1500) |
| A2.6.11 | Scale indicators visible | Expanded | Shows 0ms, 500ms, 800ms, 1500ms |
| A2.6.12 | ARIA attributes correct | Any | Proper progressbar ARIA |

#### A2.7 SessionVerdict Component

| Test ID | Test Name | Props | Verify |
|---------|-----------|-------|--------|
| A2.7.1 | Shows user name in quote | userName="Marcus" | "Well then, Marcus" |
| A2.7.2 | Shows session duration | 30 minutes elapsed | "30m" in stat |
| A2.7.3 | Shows interventions count | 5 interventions | "5" in stat |
| A2.7.4 | Shows costs avoided | Calculated from interventions | "$X,XXX" format |
| A2.7.5 | Shows step count | moments with type='new_step' | Count displayed |
| A2.7.6 | Generate Doc button exists | No document | Button visible |
| A2.7.7 | Export Doc button after generation | With document | Button visible |
| A2.7.8 | Close button works | Click X | onClose called |
| A2.7.9 | Speaking indicator when speaking | isSpeaking=true | SpeakingIndicator visible |
| A2.7.10 | Verdict modal has backdrop | Render | verdict-backdrop class |

#### A2.8 MomentTimeline Component

| Test ID | Test Name | Props | Verify |
|---------|-----------|-------|--------|
| A2.8.1 | Renders moments list | 3 moments | 3 items displayed |
| A2.8.2 | Shows moment type icon | type='technique' | Wrench icon |
| A2.8.3 | Shows moment title | title="Test" | "Test" displayed |
| A2.8.4 | Shows timestamp | elapsedSeconds=150 | "2:30" displayed |
| A2.8.5 | maxVisible limits display | 10 moments, max=5 | Only 5 shown |
| A2.8.6 | Empty state renders | 0 moments | Empty state message |

---

### A3. Visual Tests (Chrome MCP)

> **Estimated Time:** 1.5 hours
> **Tools:** Chrome DevTools MCP, screenshot comparison

#### A3.1 Image Asset Tests

| Test ID | Test | Action | Expected |
|---------|------|--------|----------|
| A3.1.1 | sir-reginald-icon.png loads | Navigate to app | Image visible in avatar |
| A3.1.2 | sir-reginald-thinking.png loads | Trigger thinking state | Image visible |
| A3.1.3 | sir-reginald-shouting.png loads | Trigger SHOUT | Image visible in alert |
| A3.1.4 | sir-reginald-relief.png loads | Dismiss SHOUT | Image visible briefly |
| A3.1.5 | Images have correct aspect ratio | Screenshot all | Circular crop correct |
| A3.1.6 | Priority loading works | Check network | shouting.png loads early |

#### A3.2 THE SHOUT Visual Tests

| Test ID | Test | Action | Expected |
|---------|------|--------|----------|
| A3.2.1 | Red backdrop fills screen | Trigger SHOUT | Full viewport coverage |
| A3.2.2 | Name displays in huge font | Trigger SHOUT | 5rem font size visible |
| A3.2.3 | Shake animation visible | Trigger SHOUT | Card shakes violently |
| A3.2.4 | Monocle flying animation | Trigger SHOUT | Monocle animates off |
| A3.2.5 | Brass border visible | Trigger SHOUT | 6px border on card |
| A3.2.6 | Countdown visible | Wait 2 seconds | Shows decremented number |
| A3.2.7 | Dismiss button is large | Trigger SHOUT | 60px height, full width |
| A3.2.8 | Screenshot comparison - SHOUT | Trigger SHOUT | Matches baseline |

#### A3.3 Theme & Styling Tests

| Test ID | Test | Action | Expected |
|---------|------|--------|----------|
| A3.3.1 | Dark theme background | Set dark mode | #0D1B2A background |
| A3.3.2 | Light theme background | Set light mode | #F5ECD7 background |
| A3.3.3 | Brass accents visible | Check UI | #B8860B elements |
| A3.3.4 | Playfair Display font | Inspect headings | Font loaded |
| A3.3.5 | Crimson Pro font | Inspect body | Font loaded |
| A3.3.6 | manor-card styling | Check sidebar | Proper border/shadow |
| A3.3.7 | gilded-frame on video | Check video | Golden frame effect |

#### A3.4 Layout Responsiveness Tests

| Test ID | Test | Viewport | Expected |
|---------|------|----------|----------|
| A3.4.1 | Desktop layout | 1920x1080 | Two-column layout |
| A3.4.2 | Tablet layout | 1024x768 | Responsive adjustment |
| A3.4.3 | Large mobile | 768x1024 | Single column |
| A3.4.4 | SHOUT on mobile | 375x667 | Still readable, fills screen |
| A3.4.5 | Onboarding on mobile | 375x667 | Properly centered |

---

### A4. Performance Tests

> **Estimated Time:** 30 minutes

#### A4.1 Load Performance

| Test ID | Test | Metric | Target |
|---------|------|--------|--------|
| A4.1.1 | Initial page load | Time to interactive | < 3 seconds |
| A4.1.2 | First contentful paint | FCP | < 1.5 seconds |
| A4.1.3 | Largest contentful paint | LCP | < 2.5 seconds |
| A4.1.4 | Cumulative layout shift | CLS | < 0.1 |
| A4.1.5 | Sir Reginald icon load | Time | < 500ms |
| A4.1.6 | Shouting image preload | Network timing | Loaded in background |

#### A4.2 Runtime Performance

| Test ID | Test | Scenario | Target |
|---------|------|----------|--------|
| A4.2.1 | SHOUT trigger latency | From detection to display | < 100ms |
| A4.2.2 | Animation frame rate | During SHOUT shake | 60fps |
| A4.2.3 | Memory after 10 SHOUTs | Trigger 10 times | No significant increase |
| A4.2.4 | Memory after 30 minutes | Simulated session | < 500MB total |
| A4.2.5 | Countdown timer accuracy | SHOUT countdown | Within 100ms of 1 second |
| A4.2.6 | State transition speed | idle -> alarmed | < 50ms |

---

### A5. Accessibility Tests

> **Estimated Time:** 30 minutes

#### A5.1 ARIA & Semantic Tests

| Test ID | Test | Element | Expected |
|---------|------|---------|----------|
| A5.1.1 | SHOUT has alertdialog role | SafetyAlertOverlay | `role="alertdialog"` |
| A5.1.2 | SHOUT has modal true | SafetyAlertOverlay | `aria-modal="true"` |
| A5.1.3 | Avatar has img role | ReginaldAvatar | `role="img"` |
| A5.1.4 | Avatar has label | ReginaldAvatar | `aria-label` present |
| A5.1.5 | Counter has region | NearMissCounter | `role="region"` |
| A5.1.6 | Counter has label | NearMissCounter | `aria-label` present |
| A5.1.7 | Progress bar ARIA | LatencyStats | Proper progressbar ARIA |
| A5.1.8 | Buttons are focusable | All buttons | Can tab to them |
| A5.1.9 | Heading hierarchy | Page | H1 > H2 > H3 order |
| A5.1.10 | Images have alt text | All images | alt attribute present |

#### A5.2 Keyboard Navigation Tests

| Test ID | Test | Action | Expected |
|---------|------|--------|----------|
| A5.2.1 | Tab through onboarding | Tab key | Focus moves logically |
| A5.2.2 | Enter activates buttons | Press Enter | Button action fires |
| A5.2.3 | Escape dismisses SHOUT | Press Escape | SHOUT dismissed |
| A5.2.4 | Space dismisses SHOUT | Press Space | SHOUT dismissed |
| A5.2.5 | Focus trap in SHOUT | Tab while SHOUT open | Focus stays in modal |
| A5.2.6 | M key toggles mode | Press M | Mode switches |
| A5.2.7 | S key activates snooze | Press S | Snooze activates |

#### A5.3 Color Contrast Tests

| Test ID | Test | Element | Expected |
|---------|------|---------|----------|
| A5.3.1 | SHOUT text on red | White on red | 4.5:1+ ratio |
| A5.3.2 | Warning text | Dark on yellow | 4.5:1+ ratio |
| A5.3.3 | Body text dark mode | Light on navy | 4.5:1+ ratio |
| A5.3.4 | Body text light mode | Dark on parchment | 4.5:1+ ratio |
| A5.3.5 | Danger badge | White on red | 4.5:1+ ratio |

---

### A6. Build & Lint Tests

> **Estimated Time:** 15 minutes

#### A6.1 Build Verification

| Test ID | Test | Command | Expected |
|---------|------|---------|----------|
| A6.1.1 | Production build succeeds | `npm run build` | Exit code 0 |
| A6.1.2 | No build warnings | `npm run build` | No warnings |
| A6.1.3 | TypeScript compiles | `npx tsc --noEmit` | No errors |
| A6.1.4 | ESLint passes | `npm run lint` | No errors |
| A6.1.5 | All pages generate | Build output | / route generated |
| A6.1.6 | API route compiles | Build output | /api/token dynamic |

#### A6.2 Dependency Tests

| Test ID | Test | Check | Expected |
|---------|------|-------|----------|
| A6.2.1 | No vulnerable dependencies | `npm audit` | No high/critical |
| A6.2.2 | Dependencies install clean | `npm ci` | No errors |
| A6.2.3 | Lock file consistent | `npm ci` | No modifications |

---

## Category B: Human/Workshop Tests

### B1. Real Camera Tests

> **Estimated Time:** 1 hour
> **Requirements:** Webcam, workshop environment (or simulated)

#### B1.1 Camera Setup Flow

| Test ID | Test | Action | Pass Criteria |
|---------|------|--------|---------------|
| B1.1.1 | Camera permission request | Load app | Browser prompts for camera |
| B1.1.2 | Camera preview displays | Grant permission | Video feed visible |
| B1.1.3 | Guide overlay visible | Positioning stage | Dashed border shows |
| B1.1.4 | Survey animation | Survey stage | Pulse animation visible |
| B1.1.5 | Camera continues to main | Complete setup | Video still shows |
| B1.1.6 | Permission denial handling | Deny camera | Error screen shown |
| B1.1.7 | Different cameras work | Switch camera | Feed updates |

#### B1.2 Video Frame Capture

| Test ID | Test | Action | Pass Criteria |
|---------|------|--------|---------------|
| B1.2.1 | Frames capture at 1 FPS | Monitor network | ~1 request/second |
| B1.2.2 | Frame quality sufficient | Check sent data | Recognizable image |
| B1.2.3 | Low light handling | Dim lights | Still sends frames |
| B1.2.4 | Camera obstruction | Cover partially | Sends what's visible |

---

### B2. THE SHOUT Reliability Protocol

> **Estimated Time:** 2 hours
> **CRITICAL: This is the most important test section**

#### B2.1 SHOUT Trigger Reliability (20 Trials)

**Setup:** Record 20 attempts to trigger THE SHOUT with hand-near-blade motion.

| Trial | Time | Trigger Success | Latency (ms) | Image Correct | Audio Played | Shake Animation | Notes |
|-------|------|-----------------|--------------|---------------|--------------|-----------------|-------|
| 1 | | [ ] | | [ ] | [ ] | [ ] | |
| 2 | | [ ] | | [ ] | [ ] | [ ] | |
| 3 | | [ ] | | [ ] | [ ] | [ ] | |
| 4 | | [ ] | | [ ] | [ ] | [ ] | |
| 5 | | [ ] | | [ ] | [ ] | [ ] | |
| 6 | | [ ] | | [ ] | [ ] | [ ] | |
| 7 | | [ ] | | [ ] | [ ] | [ ] | |
| 8 | | [ ] | | [ ] | [ ] | [ ] | |
| 9 | | [ ] | | [ ] | [ ] | [ ] | |
| 10 | | [ ] | | [ ] | [ ] | [ ] | |
| 11 | | [ ] | | [ ] | [ ] | [ ] | |
| 12 | | [ ] | | [ ] | [ ] | [ ] | |
| 13 | | [ ] | | [ ] | [ ] | [ ] | |
| 14 | | [ ] | | [ ] | [ ] | [ ] | |
| 15 | | [ ] | | [ ] | [ ] | [ ] | |
| 16 | | [ ] | | [ ] | [ ] | [ ] | |
| 17 | | [ ] | | [ ] | [ ] | [ ] | |
| 18 | | [ ] | | [ ] | [ ] | [ ] | |
| 19 | | [ ] | | [ ] | [ ] | [ ] | |
| 20 | | [ ] | | [ ] | [ ] | [ ] | |

**Success Rate Target:** 90%+ (18/20 minimum)
**Latency Target:** 95% under 500ms

#### B2.2 SHOUT Sequential Triggering

| Test ID | Test | Action | Pass Criteria |
|---------|------|--------|---------------|
| B2.2.1 | SHOUT after SHOUT | Trigger twice in 30s | Both display correctly |
| B2.2.2 | SHOUT after warning | Warning then SHOUT | SHOUT overrides |
| B2.2.3 | SHOUT during speaking | While Reginald talks | SHOUT interrupts |
| B2.2.4 | Dismiss then re-trigger | Dismiss, trigger again | Second SHOUT works |
| B2.2.5 | Auto-dismiss then trigger | Let auto-dismiss, trigger | Works correctly |

#### B2.3 SHOUT Edge Cases

| Test ID | Test | Condition | Pass Criteria |
|---------|------|-----------|---------------|
| B2.3.1 | SHOUT in poor lighting | Dim room | Still triggers on danger |
| B2.3.2 | SHOUT with partial obstruction | Partially covered camera | Triggers if hand visible |
| B2.3.3 | SHOUT with fast motion | Quick hand movement | Triggers before reach |
| B2.3.4 | SHOUT with slow motion | Gradual approach | Triggers at appropriate distance |
| B2.3.5 | False positive rate | 30 min normal work | < 2 false positives |

---

### B3. Safety Scenario Tests

> **Estimated Time:** 1 hour
> **Requirements:** Safety glasses, simulated workshop items

#### B3.1 Hand Near Blade (THE SHOUT)

| Test ID | Test | Action | Pass Criteria |
|---------|------|--------|---------------|
| B3.1.1 | Hand approaching blade | Move hand toward blade | SHOUT triggers |
| B3.1.2 | Hand near but stationary | Hold hand near blade | Warning or SHOUT |
| B3.1.3 | Hand retreating | Move hand away | No additional alert |
| B3.1.4 | Near-miss counted | SHOUT triggers | Counter increments |
| B3.1.5 | Cost shown | SHOUT triggers | Statistics displayed |

#### B3.2 Safety Glasses Missing

| Test ID | Test | Action | Pass Criteria |
|---------|------|--------|---------------|
| B3.2.1 | No glasses detected | Start session without glasses | Warning within 30s |
| B3.2.2 | Glasses on face detected | Wear glasses | "Splendid" acknowledgment |
| B3.2.3 | Glasses removed mid-session | Remove glasses | Warning triggers |
| B3.2.4 | Repeated warnings | Ignore 3 times | Pattern suggestion |

#### B3.3 Cluttered Workspace

| Test ID | Test | Action | Pass Criteria |
|---------|------|--------|---------------|
| B3.3.1 | Cluttered area detected | Items scattered | Warning about clutter |
| B3.3.2 | Clean workspace | Clear workspace | Positive acknowledgment |
| B3.3.3 | Gradual clutter increase | Add items slowly | Warning at threshold |

#### B3.4 Improper Grip

| Test ID | Test | Action | Pass Criteria |
|---------|------|--------|---------------|
| B3.4.1 | One-handed grip detected | Hold tool one-handed | Two-hand warning |
| B3.4.2 | Proper grip detected | Use two hands | Positive response |
| B3.4.3 | Grip change during operation | Switch mid-use | Warning on switch |

#### B3.5 Hearing Protection

| Test ID | Test | Action | Pass Criteria |
|---------|------|--------|---------------|
| B3.5.1 | No protection during loud | Loud tool visible | Hearing warning |
| B3.5.2 | Protection visible | Wear ear protection | Acknowledged |

---

### B4. Audio Tests

> **Estimated Time:** 45 minutes
> **Requirements:** Speakers (not just headphones)

#### B4.1 Voice Clarity Tests

| Test ID | Test | Scenario | Pass Criteria |
|---------|------|----------|---------------|
| B4.1.1 | Sir Reginald voice audible | Any speaking | Clearly understandable |
| B4.1.2 | SHOUT audio cuts through | SHOUT trigger | Distinctly louder |
| B4.1.3 | Warning audio clear | Warning trigger | Understandable tone |
| B4.1.4 | British accent consistent | Multiple responses | Kore voice throughout |
| B4.1.5 | No audio clipping | SHOUT at full volume | Clean audio |

#### B4.2 Alarm Sound Tests

| Test ID | Test | Scenario | Pass Criteria |
|---------|------|----------|---------------|
| B4.2.1 | Two-tone alarm plays | SHOUT trigger | 880Hz/660Hz alternating |
| B4.2.2 | Alarm duration correct | SHOUT trigger | 1.6 seconds |
| B4.2.3 | Single beep for danger | Danger alert | Single 440Hz beep |
| B4.2.4 | Alarm stops on dismiss | Dismiss SHOUT | Alarm stops immediately |
| B4.2.5 | Audio context initialized | First interaction | No delay on first alarm |

#### B4.3 Volume Tests

| Test ID | Test | Volume Setting | Pass Criteria |
|---------|------|----------------|---------------|
| B4.3.1 | Volume at 100% | Slider max | Loud but not painful |
| B4.3.2 | Volume at 50% | Slider mid | Noticeably quieter |
| B4.3.3 | Volume at 0% | Slider min | Silent (or very quiet) |
| B4.3.4 | SHOUT 20-30% louder | Compare to normal | Measurable difference |

---

### B5. Gemini Integration Tests

> **Estimated Time:** 1 hour
> **Requirements:** Valid API key, stable internet

#### B5.1 Connection Tests

| Test ID | Test | Scenario | Pass Criteria |
|---------|------|----------|---------------|
| B5.1.1 | Initial connection | Start session | "connected" status |
| B5.1.2 | Token refresh | Wait 5+ minutes | Seamless reconnect |
| B5.1.3 | Network disconnect recovery | Disable/enable network | Reconnects automatically |
| B5.1.4 | Session resumption | After brief disconnect | Context maintained |

#### B5.2 Proactive Audio Tests

| Test ID | Test | Scenario | Pass Criteria |
|---------|------|----------|---------------|
| B5.2.1 | Sir Reginald speaks unprompted | Start monitoring | Speaks within 10s |
| B5.2.2 | Interruption capability | Mid-response danger | Interrupts to warn |
| B5.2.3 | Context reference | 5+ minute session | References earlier events |
| B5.2.4 | Multiple observations | 10 minute session | 2-3 observations |

#### B5.3 Response Latency Tests

| Test ID | Test | Target | Pass Criteria |
|---------|------|--------|---------------|
| B5.3.1 | Average latency | < 800ms | Green indicator |
| B5.3.2 | P95 latency | < 1500ms | Mostly green/yellow |
| B5.3.3 | SHOUT response time | < 500ms | Immediate feel |
| B5.3.4 | Pipeline breakdown accurate | Check breakdown | Values sum to total |

---

### B6. Demo Rehearsals

> **Estimated Time:** 1.5 hours
> **Requirements:** Full setup, recording equipment ready

#### B6.1 Full Demo Run-Through (5 Attempts)

| Attempt | Date/Time | Duration | THE SHOUT Success | Issues Encountered | Usable? |
|---------|-----------|----------|-------------------|-------------------|---------|
| 1 | | | [ ] | | [ ] |
| 2 | | | [ ] | | [ ] |
| 3 | | | [ ] | | [ ] |
| 4 | | | [ ] | | [ ] |
| 5 | | | [ ] | | [ ] |

**Checklist for each run:**
- [ ] Onboarding completes smoothly
- [ ] Camera setup works first try
- [ ] Sir Reginald speaks on connect
- [ ] Normal observations happen
- [ ] THE SHOUT triggers at right moment
- [ ] Sir Reginald's face appears (not emoji)
- [ ] Shake animation fires
- [ ] Audio is clear
- [ ] Near-miss counter updates
- [ ] Statistics display correctly
- [ ] Relief state shows after dismiss
- [ ] Session can continue normally

#### B6.2 Script Timing Tests

| Test ID | Segment | Target Time | Actual | Notes |
|---------|---------|-------------|--------|-------|
| B6.2.1 | Hook (tease SHOUT) | 0:00-0:15 | | |
| B6.2.2 | Introduction | 0:15-0:30 | | |
| B6.2.3 | THE SHOUT moment | 0:30-0:55 | | |
| B6.2.4 | Second scenario | 0:55-1:15 | | |
| B6.2.5 | Technical explanation | 1:15-1:35 | | |
| B6.2.6 | Impact stats | 1:35-1:50 | | |
| B6.2.7 | Close | 1:50-2:00 | | |

---

### B7. Recording Tests

> **Estimated Time:** 1 hour
> **Requirements:** OBS or equivalent, external mic recommended

#### B7.1 Recording Quality Tests

| Test ID | Test | Check | Pass Criteria |
|---------|------|-------|---------------|
| B7.1.1 | 1080p capture | Resolution | 1920x1080 or higher |
| B7.1.2 | 60fps capture | Frame rate | Smooth animations |
| B7.1.3 | Audio sync | A/V sync | No noticeable delay |
| B7.1.4 | Sir Reginald voice captured | Play back | Clear and audible |
| B7.1.5 | Narrator voice captured | Play back | Clear, no overlap |
| B7.1.6 | SHOUT audio captured | Play back | Dramatic and clear |
| B7.1.7 | No frame drops | Review footage | Smooth playback |

#### B7.2 Recording Scenarios

| Test ID | Scenario | Duration | Quality Check |
|---------|----------|----------|---------------|
| B7.2.1 | THE SHOUT close-up | 30 seconds | Face + hand visible |
| B7.2.2 | Full dashboard view | 30 seconds | All elements clear |
| B7.2.3 | Near-miss counter update | 15 seconds | Counter increment visible |
| B7.2.4 | Latency indicator | 15 seconds | Numbers readable |
| B7.2.5 | Session verdict | 30 seconds | Stats and quote visible |

---

## Test Execution Order

### Phase 1: Pre-Demo Verification (Day -3)

1. **A6** - Build & Lint Tests (15 min)
2. **A1** - Unit Tests (45 min)
3. **A2** - Component Tests (1.5 hours)
4. **A5** - Accessibility Tests (30 min)

**Checkpoint:** All automated tests pass

### Phase 2: Visual & Performance (Day -2)

5. **A3** - Visual Tests with Chrome MCP (1.5 hours)
6. **A4** - Performance Tests (30 min)
7. **B1** - Real Camera Tests (1 hour)

**Checkpoint:** UI looks correct, performance acceptable

### Phase 3: Integration & Reliability (Day -1)

8. **B5** - Gemini Integration Tests (1 hour)
9. **B3** - Safety Scenario Tests (1 hour)
10. **B4** - Audio Tests (45 min)
11. **B2** - THE SHOUT Reliability Protocol (2 hours)

**Checkpoint:** 90%+ SHOUT reliability achieved

### Phase 4: Demo Day Preparation (Day 0)

12. **B6** - Demo Rehearsals (1.5 hours)
13. **B7** - Recording Tests (1 hour)

**Checkpoint:** At least 3 usable demo takes recorded

---

## Pass/Fail Criteria

### DEMO READY Requirements

| Criteria | Requirement | Status |
|----------|-------------|--------|
| Build passes | `npm run build` succeeds | [ ] |
| Unit tests pass | 100% passing | [ ] |
| THE SHOUT reliability | 90%+ trigger success | [ ] |
| THE SHOUT shows image | Sir Reginald's face, not emoji | [ ] |
| Shake animation works | Visible violent shake | [ ] |
| Audio plays | Alarm and voice audible | [ ] |
| Relief state works | Shows after dismiss | [ ] |
| Average latency | < 800ms | [ ] |
| Full demo run | At least 1 perfect take | [ ] |

### Critical Failures (Block Demo)

Any of these failures means DO NOT DEMO:

1. THE SHOUT fails to trigger more than 2/20 times
2. THE SHOUT shows emoji instead of image
3. Audio does not play at all
4. App crashes during SHOUT
5. Connection fails repeatedly
6. Latency consistently > 2000ms

### Acceptable Issues (Can Demo With)

These can be worked around:

1. Occasional warning false positive (< 2/30 min)
2. Minor animation glitches
3. Theme switching issues
4. Mobile layout imperfect
5. One scenario less reliable than others

---

## Risk Matrix

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| THE SHOUT doesn't trigger | Medium | CRITICAL | 20 reliability tests, multiple takes |
| Shouting image doesn't load | Low | HIGH | Priority loading, preload verification |
| Audio fails | Medium | HIGH | Web Audio API fallback, test early |
| API connection unstable | Medium | HIGH | Session resumption, reconnect logic |
| Latency too high | Low | MEDIUM | Test network before recording |
| Recording quality poor | Low | MEDIUM | Test OBS settings before real takes |
| False positives during demo | Low | LOW | Controlled movements, practice |
| Theme issues | Low | LOW | Test both themes, pick one for demo |

---

## Appendix A: Test Environment Setup

### Required Software
- Node.js 18+
- Chrome (latest)
- OBS Studio
- Access to Chrome DevTools MCP

### Required Hardware
- Webcam (720p minimum)
- Microphone
- Speakers (not just headphones)
- Workshop props (or simulated)

### Environment Variables
```bash
# .env.local
GEMINI_API_KEY=your_api_key_here
```

### Test Data
- User name: "Marcus" (for consistency)
- Test scenarios: Use controlled hand movements
- Session duration for tests: Minimum 5 minutes

---

## Appendix B: Jest Test File Template

```typescript
// __tests__/response-parser.test.ts
import { parseShoutTag, extractScenarioFromWarning } from '@/lib/response-parser'

describe('parseShoutTag', () => {
  it('parses valid shout tag with hand_near_blade scenario', () => {
    const input = '<shout scenario="hand_near_blade">Marcus! HAND!</shout>'
    const result = parseShoutTag(input)
    expect(result).toEqual({
      scenario: 'hand_near_blade',
      message: 'Marcus! HAND!',
      userName: 'Marcus'
    })
  })

  it('returns null for text without shout tag', () => {
    const input = 'Regular text without tags'
    const result = parseShoutTag(input)
    expect(result).toBeNull()
  })

  // ... more tests
})
```

---

## Appendix C: Chrome MCP Visual Test Script

```typescript
// Visual test: THE SHOUT appearance
async function testShoutVisual(tabId: number) {
  // Navigate to app
  await mcp__claude-in-chrome__navigate({ url: 'http://localhost:3000', tabId })

  // Complete onboarding (simulate)
  // ...

  // Trigger SHOUT (would need actual Gemini or mock)
  // ...

  // Take screenshot
  const screenshot = await mcp__claude-in-chrome__computer({
    action: 'screenshot',
    tabId
  })

  // Verify:
  // 1. Red backdrop visible
  // 2. Name in large text
  // 3. Sir Reginald shouting image visible
  // 4. Shake animation class present

  return screenshot
}
```

---

## Appendix D: Manual Test Checklist (Printable)

```
THE SHOUT MANUAL TEST CHECKLIST
Date: ____________
Tester: ____________

PRE-TEST SETUP
[ ] Camera working
[ ] Microphone working
[ ] Speakers on (not muted)
[ ] API key configured
[ ] Dev server running
[ ] OBS recording ready

TEST EXECUTION
[ ] Onboarding complete (name: ________)
[ ] Camera setup complete
[ ] Connection established
[ ] Sir Reginald speaks on connect

SHOUT TEST #___
[ ] Hand motion performed
[ ] SHOUT triggered: YES / NO
[ ] Latency: ______ms
[ ] Shouting image appeared: YES / NO
[ ] Shake animation: YES / NO
[ ] Audio played: YES / NO
[ ] Countdown visible: YES / NO
[ ] Dismiss worked: YES / NO
[ ] Relief state appeared: YES / NO

NOTES:
_________________________________
_________________________________
_________________________________

VERDICT: PASS / FAIL
```

---

*"The only way to guarantee demo success is to test every possible failure mode. A hackathon video that shows a bug is a losing video. A hackathon video that shows THE SHOUT working perfectly is a winning video."*

*-- Tester Agent, January 2026*

---

**Test Plan Status: READY FOR EXECUTION**
