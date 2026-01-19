# Sir Reginald Makesworth III - Comprehensive Test Plan v3

**Version:** 3.0
**Date:** January 19, 2026
**Tester:** Testing Agent
**Target:** Pre-Demo Video Recording Validation
**Spec Alignment:** 92% (per verifier report)
**Changes from v2:** Added WP-8 feature tests, unit tests, integration tests, demo-specific rehearsal tests, performance benchmarks

---

## Executive Summary

This test plan ensures Sir Reginald is fully functional and demo-ready before recording the hackathon submission video. Given this is a **video-only submission**, our focus is on ensuring each feature works reliably during controlled recording sessions.

**What's New in v3:**
- Unit tests for core parsing and calculation functions (response-parser, injury-statistics, latency)
- Integration tests for Gemini Live, audio playback, and video capture
- WP-8 feature tests (NearMissCounter, MomentTimeline, SessionVerdict, DocumentViewer, SuggestionAlert)
- Demo-specific rehearsal tests with take limits
- Performance benchmarks and memory stability tests
- Edge case tests for visual conditions and API failures

**Test Strategy:**
1. Unit tests for core parsing and calculation functions
2. Integration tests for Gemini Live and audio/video subsystems
3. End-to-end scenario tests for all P0 and P1 features
4. Performance validation for latency requirements
5. Edge case handling verification
6. Demo-specific rehearsal tests

---

## Test Environment

| Item | Requirement |
|------|-------------|
| **URL** | http://localhost:3000 |
| **Browser** | Chrome (latest) - required for Gemini Live |
| **Node.js** | v18+ |
| **API Key** | Valid GEMINI_API_KEY in `.env.local` |
| **Camera** | Webcam with 640x480 minimum resolution |
| **Microphone** | Any functional microphone |
| **Speakers** | External speakers recommended (workshop simulation) |
| **Ambient Noise** | Test at 60dB ambient to simulate workshop |
| **Network** | Stable internet connection |

---

## 1. Unit Tests

### 1.1 Response Parser Tests

**File:** `src/lib/response-parser.ts`

| Test ID | Function | Test Case | Input | Expected Output | Priority |
|---------|----------|-----------|-------|-----------------|----------|
| UP-1 | `parseShoutTag` | Valid shout tag | `<shout scenario="hand_near_blade">John! HAND!</shout>` | `{ scenario: 'hand_near_blade', message: 'John! HAND!', userName: 'John' }` | CRITICAL |
| UP-2 | `parseShoutTag` | Invalid scenario defaults | `<shout scenario="invalid">Stop!</shout>` | `{ scenario: 'immediate_danger', message: 'Stop!', userName: 'User' }` | HIGH |
| UP-3 | `parseShoutTag` | No shout tag | `"Normal response text"` | `null` | HIGH |
| UP-4 | `parseShoutTag` | Hot surface scenario | `<shout scenario="hot_surface">Alex! Don't touch!</shout>` | `{ scenario: 'hot_surface', ... }` | HIGH |
| UP-5 | `parseShoutTag` | Improper grip scenario | `<shout scenario="improper_grip">Both hands!</shout>` | `{ scenario: 'improper_grip', ... }` | HIGH |
| UP-6 | `parseGeminiResponse` | Single moment tag | `<moment>{"type":"technique","title":"Test","description":"Desc"}</moment>` | `ParsedResponse` with 1 moment | HIGH |
| UP-7 | `parseGeminiResponse` | Multiple moment tags | Response with 3 `<moment>` tags | `ParsedResponse` with 3 moments | MEDIUM |
| UP-8 | `parseGeminiResponse` | Malformed moment JSON | `<moment>invalid json</moment>` | Empty moments array, no crash | HIGH |
| UP-9 | `parseGeminiResponse` | Suggestion tag | `<suggestion>{"scenario":"missing_glasses","count":3,"suggestion":"Keep glasses nearby"}</suggestion>` | `suggestion` field populated | HIGH |
| UP-10 | `parseGeminiResponse` | Document tag | `<document># My Doc</document>` | `document` field = `# My Doc` | HIGH |
| UP-11 | `parseGeminiResponse` | Mixed tags | Response with moment + suggestion + document | All fields populated correctly | HIGH |
| UP-12 | `parseGeminiResponse` | All 8 moment types valid | Each type: new_step, technique, problem, solution, mistake, tip, lesson, safety | Correct type in output | MEDIUM |
| UP-13 | `extractScenarioFromWarning` | Hand near blade | `"Your hand is too close to the blade!"` | `'hand_near_blade'` | CRITICAL |
| UP-14 | `extractScenarioFromWarning` | Missing glasses | `"I don't see safety spectacles"` | `'missing_glasses'` | CRITICAL |
| UP-15 | `extractScenarioFromWarning` | Cluttered workspace | `"The workspace appears cluttered"` | `'cluttered_workspace'` | HIGH |
| UP-16 | `extractScenarioFromWarning` | Improper grip | `"Do use a two-hand grip"` | `'improper_grip'` | HIGH |
| UP-17 | `extractScenarioFromWarning` | Missing hearing | `"Hearing protection, please"` | `'missing_hearing'` | HIGH |
| UP-18 | `extractScenarioFromWarning` | No match | `"Great work today"` | `null` | MEDIUM |
| UP-19 | `hasShoutTag` | With tag | `<shout scenario="hand_near_blade">STOP!</shout>` | `true` | MEDIUM |
| UP-20 | `hasShoutTag` | Without tag | `"Normal text"` | `false` | MEDIUM |
| UP-21 | `removeAllTags` | All tags present | Response with all tag types | Clean text only | MEDIUM |
| UP-22 | `removeShoutTag` | Remove shout | `<shout scenario="x">Y</shout> text` | ` text` | MEDIUM |
| UP-23 | `validateMomentType` | Valid type | `"technique"` | `'technique'` | MEDIUM |
| UP-24 | `validateMomentType` | Invalid type | `"unknown_type"` | `'tip'` (default) | MEDIUM |
| UP-25 | `getMomentTypeDisplayName` | All types | Each type | Correct display name | LOW |
| UP-26 | `getMomentTypeIcon` | All types | Each type | Correct icon name | LOW |
| UP-27 | `getMomentTypeColor` | All types | Each type | Correct color class | LOW |

### 1.2 Injury Statistics Tests

**File:** `src/lib/injury-statistics.ts`

| Test ID | Function | Test Case | Input | Expected Output | Priority |
|---------|----------|-----------|-------|-----------------|----------|
| UI-1 | `INJURY_STATISTICS` | All 5 scenarios defined | Access all keys | 5 entries with valid data | CRITICAL |
| UI-2 | `INJURY_STATISTICS['hand_near_blade']` | Correct CPSC data | Access | `{ injuryType: 'Laceration or amputation', annualIncidents: '30,000', source: 'CPSC', estimatedCostLow: 20000, estimatedCostHigh: 120000, recoveryTime: '4-12 weeks' }` | HIGH |
| UI-3 | `INJURY_STATISTICS['missing_glasses']` | Correct AAO data | Access | `{ source: 'AAO', annualIncidents: '2,000', ... }` | HIGH |
| UI-4 | `INJURY_STATISTICS['cluttered_workspace']` | Correct OSHA data | Access | `{ source: 'OSHA', ... }` | MEDIUM |
| UI-5 | `INJURY_STATISTICS['improper_grip']` | Correct OSHA data | Access | `{ source: 'OSHA', ... }` | MEDIUM |
| UI-6 | `INJURY_STATISTICS['missing_hearing']` | Correct NIOSH data | Access | `{ source: 'NIOSH', annualIncidents: '22M exposed', ... }` | MEDIUM |
| UI-7 | `getScenarioFromText` | Hand + blade | `"hand near the blade"` | `'hand_near_blade'` | HIGH |
| UI-8 | `getScenarioFromText` | Glasses keyword | `"safety glasses"` | `'missing_glasses'` | HIGH |
| UI-9 | `getScenarioFromText` | Spectacles keyword | `"spectacles"` | `'missing_glasses'` | HIGH |
| UI-10 | `getScenarioFromText` | No match | `"nice work"` | `null` | MEDIUM |
| UI-11 | `formatCurrency` | Standard amount | `20000` | `'$20,000'` | MEDIUM |
| UI-12 | `formatCurrency` | Large amount | `120000` | `'$120,000'` | MEDIUM |
| UI-13 | `formatCurrency` | Zero | `0` | `'$0'` | LOW |
| UI-14 | `getTotalCostRange` | Multiple scenarios | `['hand_near_blade', 'missing_glasses']` | `{ low: 25000, high: 170000 }` | HIGH |
| UI-15 | `getTotalCostRange` | Empty array | `[]` | `{ low: 0, high: 0 }` | MEDIUM |
| UI-16 | `getTotalCostRange` | Invalid scenario | `['nonexistent']` | `{ low: 0, high: 0 }` | MEDIUM |
| UI-17 | `getStatsForScenario` | Valid scenario | `'hand_near_blade'` | Full `InjuryStats` object | HIGH |
| UI-18 | `getStatsForScenario` | Invalid scenario | `'nonexistent'` | `null` | MEDIUM |
| UI-19 | `getAllScenarios` | Get all | Call function | `['hand_near_blade', 'missing_glasses', 'cluttered_workspace', 'improper_grip', 'missing_hearing']` | MEDIUM |

### 1.3 Latency Calculation Tests

**File:** `src/lib/latency.ts`

| Test ID | Function | Test Case | Input | Expected Output | Priority |
|---------|----------|-----------|-------|-----------------|----------|
| UL-1 | `getLatencyLevel` | Good (<800ms) | `500` | `'good'` | HIGH |
| UL-2 | `getLatencyLevel` | Moderate (800-1500ms) | `1000` | `'moderate'` | HIGH |
| UL-3 | `getLatencyLevel` | Slow (1500-2000ms) | `1800` | `'slow'` | HIGH |
| UL-4 | `getLatencyLevel` | Critical (>2000ms) | `2500` | `'critical'` | HIGH |
| UL-5 | `getLatencyLevel` | Boundary good | `799` | `'good'` | MEDIUM |
| UL-6 | `getLatencyLevel` | Boundary moderate | `800` | `'moderate'` | MEDIUM |
| UL-7 | `getLatencyLevel` | Boundary slow | `1500` | `'slow'` | MEDIUM |
| UL-8 | `getLatencyLevel` | Boundary critical | `2000` | `'critical'` | MEDIUM |
| UL-9 | `LATENCY_COLORS` | All levels defined | Access all keys | 4 color strings | MEDIUM |
| UL-10 | `LATENCY_THRESHOLDS` | Correct values | Access | `{ good: 800, moderate: 1500, slow: 2000, critical: 2000 }` | MEDIUM |

### 1.4 Test Harness Tests

**File:** `src/lib/test-harness.ts`

| Test ID | Function | Test Case | Input | Expected Output | Priority |
|---------|----------|-----------|-------|-----------------|----------|
| UT-1 | `constructor` | Creates session ID | No args | Session ID starts with 'session-' | MEDIUM |
| UT-2 | `logSafetyTrigger` | Logs safety event | `('hand_near_blade', 500)` | Entry added with correct type | HIGH |
| UT-3 | `logMomentDetected` | Logs moment event | `('technique', 'Test')` | Entry added | HIGH |
| UT-4 | `logLatencySpike` | Logs latency spike | `(2500)` | Entry added | MEDIUM |
| UT-5 | `logPatternSuggestion` | Logs pattern | `('missing_glasses', 3)` | Entry added with count | MEDIUM |
| UT-6 | `logEdgeCase` | Logs edge case | `('poor_lighting')` | Entry added | MEDIUM |
| UT-7 | `updateAggregates` | Calculates stats | Multiple entries | Correct totals, avg, p95 | HIGH |
| UT-8 | `persistToStorage` | Saves to localStorage | Log entries | Data persisted | MEDIUM |
| UT-9 | `getAllLogs` | Retrieves logs | After persist | Returns array of logs | MEDIUM |
| UT-10 | `clearAllLogs` | Static clear | After logs exist | localStorage cleared | LOW |

---

## 2. Integration Tests

### 2.1 Gemini Live Connection Tests

**File:** `src/hooks/use-gemini-live.ts`

| Test ID | Test Case | Setup | Steps | Expected Result | Priority |
|---------|-----------|-------|-------|-----------------|----------|
| IG-1 | Successful connection | Valid API key | 1. Call `connect()` 2. Wait | `status` becomes `'connected'` | CRITICAL |
| IG-2 | API key fetch | Backend running | Observe network | `/api/token` called, key returned | CRITICAL |
| IG-3 | Status callback fires | Connected | Observe `onStatusChange` | Callback invoked | HIGH |
| IG-4 | Audio response handling | Connected | Receive audio message | `onAudio` callback with ArrayBuffer | HIGH |
| IG-5 | Text response handling | Connected | Receive text message | `onText` callback with string | HIGH |
| IG-6 | Video frame sending | Connected | Call `sendVideoFrame(base64)` | No error, latency timer starts | HIGH |
| IG-7 | Latency tracking | Frame sent, response received | Observe `latencyMs` | Value updates with reasonable number | HIGH |
| IG-8 | Thinking state on delay | Frame sent, no response for 2s | Wait 2 seconds | `isThinking` becomes `true` | HIGH |
| IG-9 | Thinking state clears | Response received | Observe `isThinking` | `isThinking` becomes `false` | HIGH |
| IG-10 | Disconnect cleanup | Connected | Call `disconnect()` | `status` becomes `'disconnected'` | HIGH |
| IG-11 | Reconnection on GoAway | Receive GoAway message | Observe behavior | `status` becomes `'reconnecting'` | MEDIUM |
| IG-12 | Session resumption token | Connected | Observe `resumptionTokenRef` | Token stored | MEDIUM |
| IG-13 | Proactive audio config | Check connect payload | Inspect config | `proactivity.proactiveAudio: true` | CRITICAL |
| IG-14 | v1alpha API version | Check client config | Inspect options | `httpOptions.apiVersion: 'v1alpha'` | CRITICAL |
| IG-15 | Kore voice configured | Check connect config | Inspect speechConfig | `voiceName: 'Kore'` | HIGH |
| IG-16 | Context window compression | Check connect config | Inspect config | `contextWindowCompression.slidingWindow: {}` | HIGH |
| IG-17 | Request verdict | Connected | Call `requestVerdict()` | Text prompt sent | HIGH |
| IG-18 | Request documentation | Connected | Call `requestDocumentation()` | Text prompt sent | HIGH |
| IG-19 | System prompt includes userName | Check config | Inspect systemInstruction | User name present | HIGH |
| IG-20 | Dual directive prompt | Check prompt | Inspect content | Safety + Witness sections present | HIGH |

### 2.2 Audio Playback Tests

**File:** `src/hooks/use-audio-player.ts`

| Test ID | Test Case | Setup | Steps | Expected Result | Priority |
|---------|-----------|-------|-------|-----------------|----------|
| IA-1 | Audio context initialization | Fresh hook | Call `initAudio()` | AudioContext created at 24000Hz | HIGH |
| IA-2 | Volume control | Context initialized | Change volume prop | `gainNode.gain.value` updates | MEDIUM |
| IA-3 | PCM playback | Context initialized | Call `playAudio(pcmBuffer)` | Audio plays without error | HIGH |
| IA-4 | Play start callback | Context initialized | Start playback | `onPlayStart` callback fires | HIGH |
| IA-5 | Play end callback | Audio playing | Wait for completion | `onPlayEnd` callback fires | HIGH |
| IA-6 | Queue processing | Multiple buffers | Add 3 buffers rapidly | All play in sequence | HIGH |
| IA-7 | Stop clears queue | Playing, queue has items | Call `stop()` | Queue cleared, `isPlaying` false | MEDIUM |
| IA-8 | Cleanup on unmount | Component unmounted | Observe | AudioContext closed | MEDIUM |
| IA-9 | Voice state transitions | During playback | Observe | idle -> ai-speaking -> idle | HIGH |

### 2.3 Video Capture Tests

**File:** `src/components/video-preview.tsx`

| Test ID | Test Case | Setup | Steps | Expected Result | Priority |
|---------|-----------|-------|-------|-----------------|----------|
| IV-1 | Camera permission request | Fresh load | Load component | `getUserMedia` called | HIGH |
| IV-2 | Video displays | Permission granted | Observe video element | Video stream visible | HIGH |
| IV-3 | Frame capture at 1 FPS | Connected | Wait 3 seconds | `onFrame` called 3 times | CRITICAL |
| IV-4 | Frame is valid JPEG | Capture occurs | Inspect base64 | Valid JPEG data | HIGH |
| IV-5 | Frame quality setting | Capture occurs | Inspect `toDataURL` | Quality 0.7 used | MEDIUM |
| IV-6 | Cleanup on disconnect | Disconnect | Observe tracks | All media tracks stopped | HIGH |
| IV-7 | Fallback UI on no camera | Camera denied | Observe UI | Fallback message displayed | MEDIUM |
| IV-8 | Mode badge displays | Any mode | Observe UI | Safety/Troubleshoot badge visible | MEDIUM |
| IV-9 | Watching indicator | Connected | Observe UI | "SIR REGINALD WATCHING" visible | HIGH |
| IV-10 | Attention area overlay | `attentionArea` set | Observe UI | "AREA OF CONCERN" visible | HIGH |

---

## 3. End-to-End Test Scenarios

### 3.1 Safety Features (Critical Path)

| Test ID | Scenario | Preconditions | Steps | Expected Result | Priority |
|---------|----------|---------------|-------|-----------------|----------|
| S-1 | THE SHOUT triggers for hand_near_blade | Connected, user name "Alex" | Position hand near saw blade | 1. `<shout>` parsed 2. SafetyAlertOverlay appears (red) 3. "ALEX! HAND!" in header 4. Shake animation 5. Audio plays 6. 10s countdown | CRITICAL |
| S-2 | THE SHOUT triggers for hot_surface | Connected | Touch heated 3D printer bed area | Same as S-1, scenario="hot_surface" | CRITICAL |
| S-3 | THE SHOUT triggers for improper_grip | Connected | Hold tool with one hand | Same as S-1, scenario="improper_grip" | CRITICAL |
| S-4 | THE SHOUT triggers for immediate_danger | Connected | Create ambiguous danger | SHOUT with scenario="immediate_danger" | HIGH |
| S-5 | Safety glasses warning (non-shout) | Connected, no glasses | Stand at laser cutter | Warning alert (yellow), "SAFETY NOTICE", 8s countdown | CRITICAL |
| S-6 | Cluttered workspace warning | Connected | Messy workspace visible | Warning alert about clutter | HIGH |
| S-7 | Hearing protection warning | Connected | Start loud tool | Warning about hearing protection | HIGH |
| S-8 | Alert auto-dismiss (8s) | Warning displayed | Wait 8 seconds | Alert disappears automatically | HIGH |
| S-9 | Alert auto-dismiss (10s for SHOUT) | SHOUT displayed | Wait 10 seconds | Alert disappears automatically | HIGH |
| S-10 | Alert manual dismiss | Alert displayed | Click dismiss button | Alert disappears immediately | HIGH |
| S-11 | Alert keyboard dismiss | Alert displayed | Press Enter/Escape/Space | Alert disappears | MEDIUM |
| S-12 | Snooze prevents alerts | Click snooze | Trigger danger condition | No alert appears | HIGH |
| S-13 | Snooze expires after 5 min | Snooze active | Wait 5 minutes | Alerts resume | MEDIUM |
| S-14 | Pattern tracking (3+ warnings) | Same scenario 3 times | Trigger missing_glasses 3x | `warningPatterns['missing_glasses']` = 3 | HIGH |
| S-15 | Context-aware suggestion appears | Pattern count >= 3 | Continue same scenario | SuggestionAlert displays with tip | HIGH |
| S-16 | Near-miss counter increments | Safety event occurs | Observe NearMissCounter | Count increases, stats displayed | HIGH |
| S-17 | Cost estimate displays | Multiple interventions | Observe NearMissCounter | Cost range shown | HIGH |
| S-18 | Intervention logs to TestHarness | Safety trigger | Check test harness | `logSafetyTrigger` called | HIGH |
| S-19 | PatternWarning component displays | 2+ same warning | Observe sidebar | PatternWarning card visible | HIGH |
| S-20 | Keyword fallback detection | No shout tag, "HAND!" in text | Trigger response | Alert still triggers via keywords | HIGH |

### 3.2 Documentation Features (NEW - WP-8)

| Test ID | Scenario | Preconditions | Steps | Expected Result | Priority |
|---------|----------|---------------|-------|-----------------|----------|
| D-1 | Moment detection - new_step | Long session | Start new major phase | Moment with type="new_step" | HIGH |
| D-2 | Moment detection - technique | Working | Demonstrate technique | Moment with type="technique" | HIGH |
| D-3 | Moment detection - problem | Working | Encounter problem | Moment with type="problem" | HIGH |
| D-4 | Moment detection - solution | After problem | Solve problem | Moment with type="solution" | HIGH |
| D-5 | Moment detection - mistake | Working | Make recoverable error | Moment with type="mistake" | HIGH |
| D-6 | Moment detection - tip | Any time | Do something noteworthy | Moment with type="tip" | MEDIUM |
| D-7 | Moment detection - lesson | After learning | Learn from experience | Moment with type="lesson" | MEDIUM |
| D-8 | Moment detection - safety | Safety event | Safety observation | Moment with type="safety" | HIGH |
| D-9 | MomentTimeline displays entries | Moments detected | Observe sidebar | Timeline shows entries with icons | HIGH |
| D-10 | MomentTimeline shows timestamps | Moments exist | Observe timeline | Elapsed time shown | HIGH |
| D-11 | MomentTimeline pagination | >5 moments | Observe timeline | maxVisible respected | MEDIUM |
| D-12 | LiveMetricOverlay moment count | Moments detected | Observe video overlay | Moment count updates | HIGH |
| D-13 | New moment pulse animation | Moment detected | Observe LiveMetricOverlay | Blue pulse animation | MEDIUM |
| D-14 | Document generation request | End session | Click "Generate Documentation" | Request sent to Gemini | HIGH |
| D-15 | Document response parsed | Gemini responds | Observe state | `generatedDocument` populated | HIGH |
| D-16 | DocumentViewer opens | Document generated | Click "Export Documentation" | Modal opens with markdown | HIGH |
| D-17 | Document export - Markdown | DocumentViewer open | Click Markdown export | File downloads as .md | HIGH |
| D-18 | Document export - Text | DocumentViewer open | Click Text export | File downloads as .txt | MEDIUM |
| D-19 | Document includes full template | Document generated | Review content | All sections present (Overview, Steps, Problems, Tips, etc.) | HIGH |
| D-20 | ContextIndicator appears | 30+ min session | Reference earlier event | Context indicator shows | MEDIUM |

### 3.3 Session Verdict Tests (NEW - WP-8)

| Test ID | Scenario | Preconditions | Steps | Expected Result | Priority |
|---------|----------|---------------|-------|-----------------|----------|
| V-1 | Verdict modal opens | Session with activity | Click "End Session" | SessionVerdict modal appears | HIGH |
| V-2 | Verdict auto-requests | Modal opens | Observe | `requestVerdict()` called | HIGH |
| V-3 | Speaking indicator | Verdict requested | Observe | "Sir Reginald is speaking..." | HIGH |
| V-4 | Duration displayed | Modal open | Observe | Correct duration (e.g., "15 minutes") | HIGH |
| V-5 | Moments count | Modal open | Observe | Correct count | HIGH |
| V-6 | Interventions count | Modal open | Observe | Correct count | HIGH |
| V-7 | Cost savings displayed | Modal open | Observe | Formatted cost range | HIGH |
| V-8 | Stats grid shows 4 items | Modal open | Observe | Duration, Moments, Interventions, Costs | HIGH |
| V-9 | Proactive suggestion | Pattern threshold met | Observe | Suggestion text shown | HIGH |
| V-10 | No interventions message | Zero interventions | Observe | "no safety interventions" text | MEDIUM |
| V-11 | Generate Documentation button | No doc yet | Click button | Loading state, then doc generated | HIGH |
| V-12 | Export Documentation button | Doc generated | Click button | DocumentViewer opens | HIGH |
| V-13 | Done button | Modal open | Click "Done" | Modal closes | HIGH |
| V-14 | Disconnect on close | Close verdict | Observe | Gemini disconnected | HIGH |
| V-15 | Notable technique mentioned | Technique moment exists | Observe | Technique title in quote | MEDIUM |
| V-16 | Speaking timeout (30s) | Verdict speaking | Wait 30s | Speaking indicator stops | MEDIUM |

### 3.4 UI/UX Tests

| Test ID | Scenario | Preconditions | Steps | Expected Result | Priority |
|---------|----------|---------------|-------|-----------------|----------|
| U-1 | Onboarding - permissions | Fresh start | Launch app | Permission request screen | HIGH |
| U-2 | Onboarding - grant permissions | Permission screen | Click "Grant Permissions" | Checkmarks appear | HIGH |
| U-3 | Onboarding - name entry | Permissions granted | Enter name | Name input works | HIGH |
| U-4 | Onboarding - ready state | Name entered | Click Continue | Ready message | HIGH |
| U-5 | Camera setup - greeting | Onboarding complete | Observe screen | Sir Reginald greeting | HIGH |
| U-6 | Camera setup - positioning guide | Greeting shown | Click Continue | Dashed border guide | HIGH |
| U-7 | Camera setup - survey | Positioning done | Click "Looks Good" | Pulse animation | MEDIUM |
| U-8 | Camera setup - complete | Survey done | Observe | "Begin Monitoring" button | HIGH |
| U-9 | Main session screen | Setup complete | Observe | All components visible | HIGH |
| U-10 | StatusBar connection indicator | Connected | Observe | Green dot | HIGH |
| U-11 | StatusBar latency indicator | Good latency | Observe | Green indicator | HIGH |
| U-12 | StatusBar End Session button | In session | Click | SessionVerdict opens | HIGH |
| U-13 | Mode toggle - Safety | Default | Observe | Safety mode badge | HIGH |
| U-14 | Mode toggle - Troubleshoot | Safety mode | Click toggle | Badge changes | HIGH |
| U-15 | Mode toggle - keyboard | Any mode | Press 'M' | Mode toggles | MEDIUM |
| U-16 | Volume control | In session | Drag slider | Volume changes | MEDIUM |
| U-17 | Sensitivity slider | In session | Change | Value updates | MEDIUM |
| U-18 | Theme toggle | In session | Toggle | Theme changes | MEDIUM |
| U-19 | ThinkingMonocle appears | >2s latency | Wait | Monocle appears | HIGH |
| U-20 | ThinkingMonocle disappears | Response received | Observe | Monocle disappears | HIGH |
| U-21 | VoiceActivityIndicator - idle | Not speaking | Observe | Idle state | MEDIUM |
| U-22 | VoiceActivityIndicator - speaking | Audio playing | Observe | "AI Speaking" | HIGH |
| U-23 | ReconnectionOverlay | Connection lost | Disconnect network | Overlay appears | HIGH |
| U-24 | ErrorScreen - camera | Camera error | Deny permission | Error screen | MEDIUM |
| U-25 | Personalized greeting | Name "Alex" | Check video | "Watching over Alex's workshop" | HIGH |
| U-26 | SafetyStatusPanel updates | Safety check | Observe panel | Status updates | HIGH |
| U-27 | LatencyStats display | Multiple responses | Observe panel | Current, Avg, P95 | HIGH |
| U-28 | NearMissCounter visible | Interventions exist | Observe sidebar | Counter card visible | HIGH |
| U-29 | TestMetricsPanel visible | In session | Observe sidebar | Metrics panel shows | MEDIUM |
| U-30 | SuggestionAlert dismissable | Suggestion shown | Click dismiss | Alert closes | HIGH |

---

## 4. Performance Tests

### 4.1 Latency Requirements

| Test ID | Metric | Requirement | Test Method | Pass Criteria | Priority |
|---------|--------|-------------|-------------|---------------|----------|
| P-1 | Response latency (average) | <800ms | Run 50 frames | Average < 800ms | CRITICAL |
| P-2 | Response latency (P95) | <1500ms | Run 100 frames | P95 < 1500ms | CRITICAL |
| P-3 | THE SHOUT latency | <400ms total | Time from frame to alert | < 400ms | CRITICAL |
| P-4 | Audio playback start | <100ms | Time from receive to sound | < 100ms | HIGH |
| P-5 | Frame capture rate | 1 FPS | Count frames over 60s | 58-62 frames | HIGH |
| P-6 | UI responsiveness | <100ms | Button click to state | < 100ms | HIGH |

### 4.2 Memory and Stability

| Test ID | Test | Duration | Measurement | Pass Criteria | Priority |
|---------|------|----------|-------------|---------------|----------|
| P-7 | Memory over 30 min | 30 minutes | Browser memory | No leak (< 50MB growth) | HIGH |
| P-8 | Memory over 60 min | 60 minutes | Browser memory | No leak (< 100MB growth) | MEDIUM |
| P-9 | Latency history capped | 100+ responses | Check array length | Capped at 100 | MEDIUM |
| P-10 | TestHarness log cap | Multiple sessions | Check localStorage | Max 20 sessions | MEDIUM |
| P-11 | Audio queue stability | Rapid bursts | Send 10 chunks | All play, no crash | HIGH |

### 4.3 Network Resilience

| Test ID | Test | Setup | Expected Result | Priority |
|---------|------|-------|-----------------|----------|
| P-12 | Reconnection on drop | Disable 5s, re-enable | Reconnects | HIGH |
| P-13 | Recovery message display | Network drop | Message shown | HIGH |
| P-14 | Reconnected confirmation | After reconnect | Confirmation shown | HIGH |
| P-15 | Session resumption | After reconnect | Context preserved | HIGH |
| P-16 | Token refresh | Session > 55 min | New token fetched | MEDIUM |

---

## 5. Edge Case Tests

### 5.1 Visual Conditions

| Test ID | Edge Case | Setup | Expected Behavior | Priority |
|---------|-----------|-------|-------------------|----------|
| E-1 | Poor lighting | Dim room | Sir Reginald notes visibility issue | HIGH |
| E-2 | Camera obstruction | Cover lens partially | Notes obstruction | HIGH |
| E-3 | Ambiguous motion | Quick unclear movement | Cautious response | HIGH |
| E-4 | No user in frame | Step away | Appropriate response | MEDIUM |
| E-5 | Multiple people | Second person enters | Handles gracefully | LOW |
| E-6 | Bright glare | Direct light | Mentions visibility | MEDIUM |

### 5.2 API and Connection Edge Cases

| Test ID | Edge Case | Expected Behavior | Priority |
|---------|-----------|-------------------|----------|
| E-7 | Gemini API error | Error screen displays | HIGH |
| E-8 | Rate limiting | Graceful handling | MEDIUM |
| E-9 | Large response | Renders completely | MEDIUM |
| E-10 | Empty response | No crash, ignored | MEDIUM |
| E-11 | Malformed JSON | Logged warning, no crash | HIGH |
| E-12 | Missing JSON fields | Defaults applied | HIGH |
| E-13 | Connection timeout | Timeout handling | MEDIUM |

### 5.3 User Input Edge Cases

| Test ID | Edge Case | Expected Behavior | Priority |
|---------|-----------|-------------------|----------|
| E-14 | Empty username | Button disabled | HIGH |
| E-15 | Very long username | Truncates gracefully | LOW |
| E-16 | Special characters | Sanitized/safe display | HIGH |
| E-17 | Rapid button clicks | No duplicate actions | MEDIUM |
| E-18 | Navigate away | Cleanup runs | LOW |

---

## 6. Demo-Specific Rehearsal Tests

**These tests validate exact demo moments with take limits.**

| Test ID | Demo Moment | Time Target | Action | Pass Criteria | Max Takes |
|---------|-------------|-------------|--------|---------------|-----------|
| DM-1 | THE SHOUT | ~0:45 | Hand toward blade | Full SHOUT sequence | 5 |
| DM-2 | Safety glasses warning | ~1:15 | No glasses at laser | Polite warning | 3 |
| DM-3 | Compliance acknowledgment | ~1:25 | Put on glasses | "Splendid!" response | 3 |
| DM-4 | Moment detection | ~2:00 | Notable technique | Timeline updates | 3 |
| DM-5 | Context reference | ~30:00 | Reference earlier | Recalls specific moment | 5 |
| DM-6 | Pattern suggestion | After 3 warnings | Repeat same issue | Suggestion appears | 3 |
| DM-7 | Session Verdict | End | Click End Session | Full spoken verdict | 3 |
| DM-8 | Cost savings | Verdict modal | Observe stats | Dollar amount visible | 1 |
| DM-9 | Documentation | Verdict modal | Click Generate | Full document | 3 |
| DM-10 | Near-miss counter | Throughout | Multiple interventions | Count matches | 1 |
| DM-11 | Latency green | Throughout | Observe overlay | <800ms, green | 1 |
| DM-12 | Proactive speaking | Any time | Wait | Unprompted observation | 5 |

---

## 7. Test Execution Plan

### 7.1 Order of Execution

| Phase | Tests | Duration | Dependencies |
|-------|-------|----------|--------------|
| 1. Environment Setup | - | 30 min | None |
| 2. Unit Tests | UP-*, UI-*, UL-*, UT-* | 1.5 hours | Phase 1 |
| 3. Integration Tests | IG-*, IA-*, IV-* | 2 hours | Phase 2 |
| 4. E2E Safety Tests | S-* | 2 hours | Phase 3 |
| 5. E2E Documentation Tests | D-* | 1.5 hours | Phase 3 |
| 6. E2E UI/UX Tests | U-* | 2 hours | Phase 3 |
| 7. Verdict Tests | V-* | 1 hour | Phases 4-6 |
| 8. Performance Tests | P-* | 2 hours | Phase 3 |
| 9. Edge Case Tests | E-* | 2 hours | Phase 3 |
| 10. Demo Rehearsal | DM-* | 3 hours | All phases |

**Total Estimated Time:** 17.5 hours (spread over 2-3 days)

### 7.2 Pass/Fail Criteria

**Overall Pass Criteria:**
- All CRITICAL tests pass
- 95%+ of HIGH priority tests pass
- No blocking bugs in demo scenarios
- P95 latency under 1500ms
- THE SHOUT reliability: 90%+ (18/20 trials)

---

## 8. Bug Tracking Template

| Bug ID | Date | Test ID | Description | Severity | Steps | Expected | Actual | Status | Fix Date |
|--------|------|---------|-------------|----------|-------|----------|--------|--------|----------|
| BUG-001 | | | | | | | | | |

### Severity Levels

| Level | Definition | Action |
|-------|------------|--------|
| **BLOCKER** | App won't start | Stop, fix immediately |
| **CRITICAL** | Core feature broken | Fix before demo |
| **HIGH** | Feature degraded | Fix before final demo |
| **MEDIUM** | Minor issue | Fix if time permits |
| **LOW** | Cosmetic | Backlog |

---

## 9. Test Sign-Off Checklist

Before recording demo video:

- [ ] All CRITICAL tests passing
- [ ] All demo-specific tests (DM-*) passing
- [ ] THE SHOUT triggers reliably (5/5 attempts)
- [ ] Safety glasses warning works
- [ ] Moment detection visible in UI
- [ ] Session verdict speaks correctly
- [ ] Documentation generates
- [ ] Latency consistently under 800ms
- [ ] No console errors
- [ ] Audio quality acceptable
- [ ] Video quality acceptable
- [ ] Physical test setup ready

**Sign-off:**
- Tester: _________________ Date: _________
- Developer: ______________ Date: _________

---

## Appendix: Test Summary

### Test Counts by Category

| Category | Critical | High | Medium | Low | Total |
|----------|----------|------|--------|-----|-------|
| Unit Tests (UP) | 2 | 17 | 8 | 0 | 27 |
| Unit Tests (UI) | 1 | 7 | 11 | 0 | 19 |
| Unit Tests (UL) | 0 | 4 | 6 | 0 | 10 |
| Unit Tests (UT) | 0 | 3 | 7 | 0 | 10 |
| Integration (IG) | 3 | 15 | 2 | 0 | 20 |
| Integration (IA) | 0 | 7 | 2 | 0 | 9 |
| Integration (IV) | 1 | 7 | 2 | 0 | 10 |
| Safety (S) | 5 | 14 | 1 | 0 | 20 |
| Documentation (D) | 0 | 15 | 5 | 0 | 20 |
| Verdict (V) | 0 | 12 | 4 | 0 | 16 |
| UI/UX (U) | 0 | 22 | 8 | 0 | 30 |
| Performance (P) | 3 | 10 | 3 | 0 | 16 |
| Edge Cases (E) | 0 | 9 | 7 | 2 | 18 |
| Demo (DM) | 0 | 12 | 0 | 0 | 12 |
| **Total** | **15** | **154** | **66** | **2** | **237** |

### New in v3

- 66 unit tests (UP, UI, UL, UT)
- 39 integration tests (IG, IA, IV)
- 20 documentation feature tests (D)
- 16 session verdict tests (V)
- 12 demo rehearsal tests (DM)
- WP-8 component tests throughout

---

*Test plan created by Testing Agent*
*"One does not simply ship untested code. One tests systematically."*
*-- Sir Reginald Testing Protocol v3*
