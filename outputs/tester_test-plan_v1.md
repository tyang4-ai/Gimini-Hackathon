# Sir Reginald Test Plan v1

**Application:** Sir Reginald Makesworth III - Your Distinguished Workshop Guardian
**Version:** 1.0
**Date:** January 16, 2026
**Tester:** Tester Agent
**Status:** Ready for Execution

---

## Test Environment

| Item | Requirement |
|------|-------------|
| **URL** | http://localhost:3000 |
| **Browser** | Chrome (latest) |
| **Camera** | Webcam with 640x480 minimum resolution |
| **Microphone** | Any functional microphone |
| **Speakers** | External speakers recommended (workshop simulation) |
| **Ambient Noise** | Test at 60dB ambient to simulate workshop |
| **Network** | Stable internet connection for Gemini API |
| **API Key** | Valid GEMINI_API_KEY in .env.local |

---

## Pre-Test Setup Checklist

- [ ] Application running at localhost:3000 (`npm run dev`)
- [ ] .env.local contains valid GEMINI_API_KEY
- [ ] Chrome DevTools console open (F12) for error monitoring
- [ ] Camera physically connected and functional
- [ ] Microphone physically connected and functional
- [ ] Speakers at audible volume level
- [ ] Demo props prepared (see Props/Equipment Needed section)
- [ ] Screen recording software ready for documenting issues
- [ ] Network tab open in DevTools to monitor API calls
- [ ] Browser permissions cleared (for fresh permission testing)

---

## Test Categories

### Category 1: Visual/UI Tests

| ID | Test Case | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|----------|
| V1 | Onboarding Screen Appearance | 1. Navigate to localhost:3000 with fresh session | Top hat emoji, "Welcome to Sir Reginald" title, "Your Distinguished Workshop Guardian" subtitle, permissions list with icons | P0 |
| V2 | Permission List Display | 1. View onboarding screen | Three permissions shown: Camera, Microphone, Speaker with icons and unchecked states | P0 |
| V3 | Permission Granted State | 1. Grant camera permission 2. Observe visual change | Check icon replaces camera icon, green border/background appears | P0 |
| V4 | Name Input Field | 1. Complete permissions 2. View name step | Input field with placeholder "Enter your name", elegant Sir Reginald quote | P0 |
| V5 | Name Confirmation | 1. Enter name "James" 2. Click Continue | Monocle emoji, "Excellent, James!" confirmation text | P0 |
| V6 | Connection Screen Stages | 1. Complete onboarding 2. Watch connection screen | Three stages shown: "Accessing camera...", "Waking Sir Reginald for [name]...", "Ready!" with progress bar | P0 |
| V7 | Connection Screen Quotes | 1. Watch connection screen | In-character quotes: "Just a moment whilst I find my spectacles...", etc. | P1 |
| V8 | Camera Setup Screen Layout | 1. Complete connection 2. View camera setup | Video preview, stage dialogue box, "Continue" button, guide overlay | P0 |
| V9 | Camera Setup Guide Overlay | 1. Progress to positioning stage | Dashed border overlay with "Position your workspace within this frame" label | P1 |
| V10 | Camera Survey Animation | 1. Progress to survey stage | Pulsing primary color overlay, spinning "Surveying..." indicator | P1 |
| V11 | Main Dashboard Layout | 1. Complete camera setup | Video preview (4:3), status bar at top, safety panel on right, controls below video | P0 |
| V12 | Video Preview Mode Badge | 1. View main dashboard in safety mode | "SAFETY MODE" badge with shield icon, green styling | P0 |
| V13 | Video Preview Mode Badge - Troubleshoot | 1. Switch to troubleshoot mode | "TROUBLESHOOT" badge with wrench icon, purple styling | P0 |
| V14 | Watching Indicator | 1. View main dashboard when connected | Red pulsing dot with "SIR REGINALD WATCHING" text | P0 |
| V15 | Personalized Greeting | 1. Complete onboarding with name 2. View video preview | "Watching over [name]'s workshop" text at bottom | P1 |
| V16 | Status Bar - Connected | 1. View connected state | Green latency dot, "Sir Reginald Active" text | P0 |
| V17 | Status Bar - Disconnected | 1. Simulate disconnect | Red dot, "Disconnected" text, "Retry" button | P0 |
| V18 | Status Bar - Last Check | 1. View status bar | Clock icon with "Last check: Xs ago" updating | P1 |
| V19 | Status Bar - End Session Button | 1. View status bar | "End Session" button with logout icon | P0 |
| V20 | Safety Status Panel | 1. View right panel | "Safety Status" header with top hat, three status rows (Eye, Hands, Workspace), last check time | P0 |
| V21 | Safety Status - OK State | 1. View status with OK items | Green checkmark icon, "OK" text | P0 |
| V22 | Safety Status - Warning State | 1. Trigger warning 2. View status | Yellow triangle icon, "Check" text | P1 |
| V23 | Safety Status - Snoozed Banner | 1. Click snooze 2. View panel | Yellow "Warnings snoozed" banner with moon icon | P1 |
| V24 | Voice Activity - Idle | 1. View with idle state | Microphone icon, "Ready - say 'Hey Reggie' or press M to switch modes" | P1 |
| V25 | Voice Activity - AI Speaking | 1. Trigger AI response 2. View indicator | Speaker icon, animated sound bars, "Sir Reginald speaking" text | P0 |
| V26 | Voice Activity - Listening | 1. Activate listening mode | Pulsing microphone icon, progress bar, "Listening..." | P1 |
| V27 | Mode Toggle - Safety Active | 1. Select Safety Monitor | Green background on Safety, muted on Troubleshooter | P0 |
| V28 | Mode Toggle - Troubleshoot Active | 1. Select Troubleshooter | Purple background on Troubleshooter, muted on Safety | P0 |
| V29 | Mode Toggle - Shortcut Hint | 1. View mode toggle | "Press M to switch modes" text below buttons | P1 |
| V30 | Volume Control | 1. View controls row | Volume icon, slider, percentage display | P1 |
| V31 | Sensitivity Slider | 1. View controls row | Shield icon with label and description | P1 |
| V32 | Snooze Button - Active | 1. View when not snoozed | Moon icon, "Snooze 5m" text | P1 |
| V33 | Snooze Button - Snoozed | 1. Click snooze 2. View button | "Snoozed X:XX" countdown timer, disabled state | P1 |
| V34 | Theme Toggle | 1. View controls row | Sun/moon icon button | P1 |
| V35 | Dark Mode - Background | 1. Toggle to dark mode | Background changes to dark (#0f0f0f) | P1 |
| V36 | Dark Mode - Text | 1. Toggle to dark mode | Text inverts to white/light colors | P1 |
| V37 | Dark Mode - Surfaces | 1. Toggle to dark mode | Cards and surfaces use dark variants | P1 |
| V38 | Safety Alert - Warning | 1. Trigger warning alert | Yellow overlay slides up from bottom, warning icon, message, large dismiss button | P0 |
| V39 | Safety Alert - Danger | 1. Trigger danger alert | Red overlay, XCircle icon, "SAFETY ALERT" header | P0 |
| V40 | Safety Alert - SHOUT | 1. Trigger SHOUT alert | Bright red overlay, AlertOctagon icon, "[NAME]! STOP!" header, shake animation | P0 |
| V41 | Safety Alert - Auto-dismiss Timer | 1. Trigger alert 2. Watch timer | Countdown text "Auto-dismiss in Xs" decreasing | P0 |
| V42 | Safety Alert - Dismiss Button Size | 1. Measure dismiss button | Button height is 60px minimum | P0 |
| V43 | Thinking Monocle Overlay | 1. Simulate >2s latency | Overlay with monocle emoji, "Sir Reginald is contemplating...", rotating quote, progress bar | P0 |
| V44 | Reconnection Overlay | 1. Simulate reconnection | Modal with monocle emoji, spinning refresh icon, rotating character dialogue | P0 |
| V45 | Session Summary Modal | 1. Click "End Session" | Modal with stats grid, safety score with stars, personalized quote, Export/Done buttons | P0 |
| V46 | Session Summary - Stats | 1. View modal | Duration, Interventions, Critical Saves, Troubleshoot counts | P0 |
| V47 | Session Summary - Export | 1. Click Export | Downloads .txt file with session summary | P1 |
| V48 | Error Screen - Camera | 1. Deny camera permission | Sad top hat, Camera icon, "Sir Reginald Cannot See" title, in-character quote, manual safety checklist | P0 |
| V49 | Error Screen - Connection | 1. Simulate connection failure | Wifi icon, "Connection Lost" title, retry button | P0 |
| V50 | Error Screen - Static Checklist | 1. View any error screen | Manual safety checklist displayed at bottom | P0 |
| V51 | Screen-Edge Glow | 1. Trigger AI speaking 2. View video | Green glow effect around video preview | P1 |
| V52 | Responsive - Mobile Width | 1. Resize to 375px width | Layout stacks vertically, elements remain usable | P2 |
| V53 | Responsive - Tablet Width | 1. Resize to 768px width | Layout adjusts, safety panel may stack | P2 |

---

### Category 2: Functional Tests

| ID | Test Case | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|----------|
| F1 | Name Capture | 1. Enter name "James" 2. Submit | Name stored and used throughout session | P0 |
| F2 | Name Persistence | 1. Complete onboarding with name 2. Navigate through screens | Name appears in all personalized locations | P0 |
| F3 | Camera Permission - Grant | 1. Fresh session 2. Click Grant Permissions 3. Allow camera | Camera permission checkbox turns green | P0 |
| F4 | Camera Permission - Deny | 1. Fresh session 2. Deny camera permission | Error screen shown with camera-specific message | P0 |
| F5 | Microphone Permission - Grant | 1. Grant microphone access | Microphone checkbox turns green | P0 |
| F6 | Microphone Permission - Deny | 1. Deny microphone access | Microphone error screen or graceful degradation | P0 |
| F7 | Video Preview Working | 1. Complete setup 2. View dashboard | Live webcam feed displays in video preview | P0 |
| F8 | Video Preview - No Camera | 1. View with camera unavailable | Placeholder with top hat and "Camera feed will appear here" | P0 |
| F9 | Mode Toggle - Click | 1. Click Troubleshooter 2. Click Safety | Mode switches on click, visual update immediate | P0 |
| F10 | Mode Toggle - M Key | 1. Press M key | Mode toggles between Safety and Troubleshoot | P0 |
| F11 | Volume Control - Slider | 1. Drag volume slider | Percentage updates, audio volume changes | P1 |
| F12 | Volume Control - Mute Toggle | 1. Click volume icon | Toggles between muted (0%) and previous level | P1 |
| F13 | Sensitivity Slider - Cycle | 1. Click sensitivity button multiple times | Cycles through Relaxed > Standard > Paranoid > Relaxed | P1 |
| F14 | Sensitivity - Visual Feedback | 1. Change sensitivity | Icon and description update to match level | P1 |
| F15 | Snooze Button - Activate | 1. Click Snooze 5m | Button shows countdown, warnings suppressed | P0 |
| F16 | Snooze Button - Countdown | 1. Activate snooze 2. Watch countdown | Timer decrements every second | P1 |
| F17 | Snooze Button - Auto-Cancel | 1. Wait 5 minutes after snooze | Snooze automatically deactivates | P1 |
| F18 | Snooze Button - S Key | 1. Press S key | Snooze activates same as button click | P1 |
| F19 | Theme Toggle - Click | 1. Click theme toggle | Switches between dark and light mode | P1 |
| F20 | Theme Toggle - Persistence | 1. Toggle theme 2. Refresh page | Theme preference persists (or resets - document behavior) | P2 |
| F21 | Safety Alert - Dismiss Click | 1. Trigger alert 2. Click dismiss button | Alert dismisses immediately | P0 |
| F22 | Safety Alert - Escape Key | 1. Trigger alert 2. Press Escape | Alert dismisses | P0 |
| F23 | Safety Alert - Auto-Dismiss 8s | 1. Trigger warning alert 2. Wait 8 seconds | Alert auto-dismisses after countdown | P0 |
| F24 | Safety Alert - SHOUT 10s | 1. Trigger SHOUT alert 2. Count time | SHOUT alert has 10 second auto-dismiss | P0 |
| F25 | Safety Alert - Suppressed When Snoozed | 1. Activate snooze 2. Trigger alert | Alert does NOT appear while snoozed | P0 |
| F26 | Session Summary - Open | 1. Click End Session | Session summary modal opens | P0 |
| F27 | Session Summary - Close | 1. Open summary 2. Click Done or X | Modal closes | P0 |
| F28 | Session Summary - Duration | 1. Use app for 2 minutes 2. End session | Duration shows approximately 2 minutes | P1 |
| F29 | Error Screen - Retry | 1. Trigger error 2. Click Try Again | Reconnection attempt starts | P0 |
| F30 | Camera Setup - Skip | 1. Check if skip option exists | Document whether camera setup can be skipped | P2 |
| F31 | Latency Indicator - Updates | 1. Observe latency indicator during use | Dot color changes based on actual latency | P0 |
| F32 | Thinking Monocle - Trigger | 1. Simulate >2s latency | Thinking monocle overlay appears | P0 |
| F33 | Thinking Monocle - Dismiss | 1. Wait for latency to improve | Thinking monocle disappears when latency normalizes | P1 |
| F34 | Reconnection Overlay - Trigger | 1. Simulate connection drop | Reconnection overlay appears with dialogue | P0 |
| F35 | Reconnection - Auto-Dismiss | 1. Reconnect successfully | Overlay dismisses, normal operation resumes | P0 |

---

### Category 3: Gemini Integration Tests

| ID | Test Case | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|----------|
| G1 | API Token Generation | 1. Check DevTools Network tab 2. Look for /api/token call | Token endpoint returns 200 with token and expiresAt | P0 |
| G2 | WebSocket Connection | 1. Check DevTools Network tab 2. Look for WebSocket | WebSocket connection to generativelanguage.googleapis.com established | P0 |
| G3 | Video Frames Sent | 1. Monitor WebSocket messages 2. Wait 5 seconds | Approximately 5 frames sent (1 FPS) | P0 |
| G4 | Audio Output Works | 1. Complete setup 2. Wait for proactive response | Hear Sir Reginald's voice through speakers | P0 |
| G5 | Proactive Audio Triggers | 1. Stay still in frame 2. Wait | Sir Reginald speaks without user prompt (may take 10-30 seconds) | P0 |
| G6 | Latency Indicator - Good | 1. Observe indicator with fast connection | Green dot when latency <800ms | P0 |
| G7 | Latency Indicator - Moderate | 1. Simulate 800-1500ms latency | Yellow dot appears | P1 |
| G8 | Latency Indicator - Slow | 1. Simulate 1500-2000ms latency | Red dot appears | P1 |
| G9 | Latency Indicator - Critical | 1. Simulate >2000ms latency | Red pulsing dot, thinking monocle appears | P0 |
| G10 | Context Compression | 1. Use app for 30+ minutes | Session continues without context overflow errors | P1 |
| G11 | Token Refresh | 1. Use app for 25 minutes 2. Check for new token request | New token requested before 30-minute expiry | P1 |
| G12 | Session Resumption | 1. Simulate brief disconnect 2. Reconnect | Session resumes without full restart | P1 |
| G13 | British Persona | 1. Trigger Sir Reginald response | Response uses British phrasing ("I do beg your pardon", "spectacles", "rather") | P0 |
| G14 | User Name in Responses | 1. Complete onboarding with name 2. Trigger response | Sir Reginald uses user's name in response | P0 |
| G15 | Visual Overlay Trigger | 1. Trigger response mentioning "your hand" | Visual overlay appears on video | P1 |
| G16 | Error Handling - API Timeout | 1. Simulate API timeout | Graceful degradation, thinking monocle, eventual fallback | P0 |
| G17 | Error Handling - WebSocket Disconnect | 1. Disconnect WebSocket | Reconnection overlay appears, auto-retry begins | P0 |
| G18 | Fallback Chain - Level 1 | 1. Observe with elevated latency | Yellow latency indicator, no user notification | P1 |
| G19 | Fallback Chain - Level 2 | 1. Simulate >2s latency | Thinking monocle, red indicator | P0 |
| G20 | Voice Quality | 1. Listen to Sir Reginald | Audio clear, no distortion, appropriate volume | P0 |
| G21 | Response Relevance | 1. Present safety scenario 2. Listen | Response relevant to what AI sees | P0 |

---

### Category 4: Demo Scenario Tests (The 5 Hardcoded)

| ID | Test Case | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|----------|
| D1 | Safety Glasses Off - Detection | 1. Face camera without glasses 2. Reach toward simulated tool | Sir Reginald warns about missing spectacles | P0 |
| D1a | Safety Glasses Off - Exact Phrase | 1. Same as D1 | Response contains "safety spectacles" or "eye protection" | P0 |
| D1b | Safety Glasses Off - Visual Overlay | 1. Same as D1 | Face region highlighted during warning | P1 |
| D1c | Safety Glasses Off - Compliance | 1. Put on glasses after warning | Sir Reginald acknowledges: "Splendid!" or similar | P0 |
| D2 | Hand Near Blade (THE SHOUT) - Detection | 1. Move hand toward blade area | Sir Reginald SHOUTS user's name | P0 |
| D2a | THE SHOUT - Contains Name | 1. Same as D2 | "[NAME]! HAND!" exact format | P0 |
| D2b | THE SHOUT - Is Loud/Urgent | 1. Same as D2 | Voice is noticeably louder/more urgent than normal | P0 |
| D2c | THE SHOUT - Visual Alert | 1. Same as D2 | SHOUT-type alert appears with shake animation | P0 |
| D2d | THE SHOUT - Follow-up Apology | 1. After shout | "Do forgive me for raising my voice" or similar | P0 |
| D2e | THE SHOUT - Hands Overlay | 1. During warning | Hands region highlighted in orange | P1 |
| D3 | Cluttered Workspace - Detection | 1. Place multiple objects on work surface | Sir Reginald mentions clutter | P0 |
| D3a | Cluttered Workspace - Exact Phrase | 1. Same as D3 | Response mentions "workspace" and "clear" or "tidy" | P1 |
| D3b | Cluttered Workspace - Compliance | 1. Clear workspace | Sir Reginald acknowledges improvement | P1 |
| D4 | Improper Grip - Detection | 1. Hold tool with one hand or improper position | Sir Reginald comments on grip | P0 |
| D4a | Improper Grip - Specific Advice | 1. Same as D4 | Response includes specific grip advice (two-handed, position) | P1 |
| D5 | Missing Hearing Protection - Detection | 1. Expose ears near loud tool (or simulate) | Sir Reginald mentions hearing protection | P0 |
| D5a | Hearing Protection - Audio Detection | 1. Play saw sound while ears visible | Sir Reginald may mention hearing sound (multi-modal) | P2 |
| D6 | Scenario Reliability - 10 Trials Each | 1. Run each scenario 10 times 2. Record success rate | Target: >80% trigger rate per scenario | P0 |
| D7 | False Positive Rate | 1. Work safely for 5 minutes 2. Count false warnings | Target: <10% false positive rate | P0 |

---

### Category 5: Error Handling Tests

| ID | Test Case | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|----------|
| E1 | Camera Denied | 1. Fresh session 2. Deny camera permission | Camera error screen with in-character quote and manual checklist | P0 |
| E2 | Camera Lost Mid-Session | 1. Disconnect camera during use | Error handling triggers, recovery attempted | P0 |
| E3 | Microphone Denied | 1. Deny microphone permission | Graceful degradation or microphone error screen | P0 |
| E4 | Microphone Lost Mid-Session | 1. Disconnect microphone during use | Visual-only mode continues or error shown | P1 |
| E5 | API Connection Fails | 1. Disable network 2. Attempt connection | Connection error screen, retry option | P0 |
| E6 | API Connection Lost | 1. Disable network during session | Reconnection overlay appears, auto-retry | P0 |
| E7 | API Timeout >2s | 1. Simulate slow API response | Thinking monocle appears, latency indicator red | P0 |
| E8 | API Timeout >5s | 1. Simulate very slow response | Frame rate reduction or fallback mode | P1 |
| E9 | Token Endpoint Fails | 1. Make /api/token return error | Error screen with retry option | P0 |
| E10 | Invalid API Key | 1. Use invalid GEMINI_API_KEY | Error screen with appropriate message | P0 |
| E11 | WebSocket Disconnect | 1. Force close WebSocket | Reconnection flow begins | P0 |
| E12 | WebSocket Reconnect Success | 1. Disconnect then reconnect | "Connection restored" in-character message | P0 |
| E13 | Multiple Rapid Disconnects | 1. Disconnect/reconnect 3 times quickly | App remains stable, no crashes | P1 |
| E14 | Vision Fails, Audio Continues | 1. Simulate video processing failure only | Sir Reginald mentions monocle foggy, audio continues | P1 |
| E15 | Audio Fails, Vision Continues | 1. Simulate audio failure only | Text alerts displayed instead of voice | P1 |
| E16 | Offline Mode | 1. Complete disconnect for 30+ seconds | Offline fallback with cached phrases or static checklist | P1 |
| E17 | Browser Tab Hidden | 1. Switch to different tab 2. Return | App resumes correctly | P1 |
| E18 | Browser Refresh | 1. Refresh page mid-session | App restarts cleanly (onboarding or resume) | P1 |

---

### Category 6: Demo Flow Tests

| ID | Test Case | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|----------|
| DF1 | Full Onboarding Flow | 1. Start fresh 2. Complete all onboarding steps | Smooth flow through permissions > name > camera setup > dashboard | P0 |
| DF2 | Onboarding Timing | 1. Time full onboarding | Target: <45 seconds from start to dashboard | P1 |
| DF3 | Guided Camera Setup - Greeting | 1. Enter camera setup | Sir Reginald greets and explains camera positioning | P0 |
| DF4 | Guided Camera Setup - Direction | 1. Progress through setup | Sir Reginald provides theatrical camera direction | P0 |
| DF5 | Guided Camera Setup - Survey | 1. Progress to survey | Visual survey animation, Sir Reginald acknowledges workspace | P0 |
| DF6 | Guided Camera Setup - Complete | 1. Complete setup | "Begin Monitoring, [name]" button appears | P0 |
| DF7 | Demo Script - 0:00-0:10 | 1. Execute demo opening | Contrast setup with generic safety app messaging works | P0 |
| DF8 | Demo Script - 0:10-0:25 | 1. Introduce Sir Reginald | App appears, Sir Reginald speaks introduction | P0 |
| DF9 | Demo Script - 0:25-0:45 | 1. Camera setup demo | Guided camera positioning demonstrates AI directing human | P0 |
| DF10 | Demo Script - 0:45-1:05 | 1. Safe work demonstration | Sir Reginald gives encouraging commentary | P1 |
| DF11 | Demo Script - 1:05-1:25 | 1. Safety glasses scenario | Warning triggers, compliance acknowledged | P0 |
| DF12 | Demo Script - 1:25-1:45 | 1. THE SHOUT scenario | SHOUT triggers reliably, dramatic moment achieved | P0 |
| DF13 | Demo Script - 1:45-2:00 | 1. Closing | Session ends gracefully with signature phrase | P1 |
| DF14 | Complete 2-Minute Demo | 1. Run entire demo script | Full demo completes within 2 minutes | P0 |
| DF15 | Demo Timing Buffer | 1. Time full demo | Demo has 10-15 second buffer for variations | P1 |
| DF16 | Recovery Script - Detection Miss | 1. Scenario doesn't trigger | Sir Reginald: "Hmm, my monocle seems a touch foggy..." | P0 |
| DF17 | Recovery Script - Latency Spike | 1. Simulate latency during demo | Sir Reginald: "Pardon me, gathering my thoughts..." | P0 |
| DF18 | Recovery Script - Connection Drop | 1. Brief connection loss | Sir Reginald: "Slight interruption to my vigil..." | P0 |
| DF19 | Recovery Script - Audio Fails | 1. Audio stops working | Visual overlay and text alerts continue | P0 |
| DF20 | Backup Audio Files | 1. Verify cached audio exists | Check public/audio/ for fallback MP3s | P1 |
| DF21 | Demo Consistency - 5 Takes | 1. Run full demo 5 times | Demo works reliably 4/5 or better | P0 |
| DF22 | Demo Consistency - THE SHOUT | 1. Test THE SHOUT 20 times | SHOUT works 18/20 or better (90%) | P0 |

---

### Category 7: Accessibility & UX Tests

| ID | Test Case | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|----------|
| A1 | Touch Target - Primary Buttons | 1. Measure button dimensions | Primary buttons are 60x60px minimum | P0 |
| A2 | Touch Target - Dismiss Button | 1. Measure alert dismiss button | Height is 60px, full width | P0 |
| A3 | Touch Target - Controls | 1. Measure control buttons | Secondary controls 44x44px minimum | P1 |
| A4 | Auto-Dismiss Alerts | 1. Trigger alert 2. Do not interact | Alert auto-dismisses after 8 seconds | P0 |
| A5 | Auto-Dismiss - SHOUT | 1. Trigger SHOUT 2. Do not interact | SHOUT auto-dismisses after 10 seconds | P0 |
| A6 | Keyboard - M Key | 1. Press M | Mode toggles | P0 |
| A7 | Keyboard - S Key | 1. Press S | Snooze activates | P0 |
| A8 | Keyboard - Escape | 1. With alert open 2. Press Escape | Alert dismisses | P0 |
| A9 | Keyboard - Enter/Space | 1. With alert open 2. Press Enter or Space | Alert dismisses | P1 |
| A10 | Voice Commands - Documented | 1. Review UI | Voice command hints visible ("say 'Hey Reggie'") | P1 |
| A11 | Color Contrast - Light Mode | 1. View in light mode | Text readable, sufficient contrast | P1 |
| A12 | Color Contrast - Dark Mode | 1. View in dark mode | Text readable, sufficient contrast | P1 |
| A13 | Alert Visibility - Workshop Lighting | 1. View alerts in bright light | Alerts visible and readable | P1 |
| A14 | Audio Volume - Default | 1. Test default volume at 60dB ambient | Voice audible over workshop noise | P0 |
| A15 | Audio Volume - Adjustable | 1. Adjust volume slider | Voice volume changes accordingly | P1 |
| A16 | Hands-Free Operation | 1. Complete session without touching screen | Voice commands and keyboard work throughout | P2 |
| A17 | Tooltip - Latency Indicator | 1. Hover over latency dot | Tooltip shows latency explanation | P2 |
| A18 | Error Messages - Clear | 1. Trigger various errors | Error messages explain problem and solution | P1 |
| A19 | Progress Indicators | 1. View all loading states | Progress bars/spinners shown during waits | P1 |
| A20 | Empty States | 1. View states with no data | Appropriate empty state messaging | P2 |

---

## Demo Rehearsal Checklist

### Before Demo

- [ ] Application running and fully loaded
- [ ] Camera positioned per Sir Reginald's guidance
- [ ] Microphone tested and working
- [ ] Speakers at appropriate volume (test at demo venue ambient noise)
- [ ] All demo props within easy reach
- [ ] User name "James" (or chosen name) entered
- [ ] API connection verified (green latency indicator)
- [ ] Test THE SHOUT once to confirm working
- [ ] Screen recording ready (backup)
- [ ] Backup video prepared (in case of failure)

### Demo Script Walkthrough

- [ ] [0:00-0:10] Contrast setup messaging prepared
- [ ] [0:10-0:25] Introduction flows smoothly, Sir Reginald speaks
- [ ] [0:25-0:45] Camera setup demo - AI directing human moment works
- [ ] [0:45-1:05] Safe work demo - encouraging commentary triggers
- [ ] [1:05-1:25] Safety glasses scenario - warning and compliance work
- [ ] [1:25-1:45] THE SHOUT - name is shouted, dramatic moment achieved
- [ ] [1:45-2:00] Closing - session ends with signature phrase

### Recovery Preparation

- [ ] Know recovery scripts if detection misses
- [ ] Know what to say if latency spikes
- [ ] Have manual trigger backup if proactive audio fails
- [ ] Backup video file accessible

### Post-Demo

- [ ] End session gracefully
- [ ] Show session summary (optional)
- [ ] Answer judge questions

---

## Props/Equipment Needed

### Essential Props

- [ ] Safety glasses (clear lenses, visible from camera)
- [ ] Simulated blade area (table saw or marked surface)
- [ ] Several objects for cluttered workspace demo
- [ ] Tool for grip demonstration (screwdriver, saw handle)
- [ ] Ear protection (visible earmuffs or plugs)

### Equipment

- [ ] Webcam (good quality, stable mount)
- [ ] External microphone (optional, reduces noise)
- [ ] External speakers (at demo volume level)
- [ ] Good lighting (face visible, no harsh shadows)
- [ ] Table/workbench setup

### Backup Equipment

- [ ] Second webcam
- [ ] Laptop internal mic/speakers (backup)
- [ ] Pre-recorded demo video (USB stick)
- [ ] Printed manual safety checklist

---

## Risk Areas (Pay Extra Attention)

### Critical Risk Areas

1. **THE SHOUT Reliability** - This is the money moment. Test 20+ times. Must work during demo.
2. **Proactive Audio Triggering** - Core differentiator. If not triggering, fallback to prompted mode.
3. **Safety Glasses Detection** - First demo scenario. Must work consistently.
4. **Latency Spikes** - Can disrupt flow. Have thinking monocle ready as graceful cover.
5. **WebSocket Stability** - Connection drops kill the demo. Test network stability.

### Medium Risk Areas

6. **British Persona Consistency** - Verify every response uses British phrasing.
7. **User Name Usage** - Personalization must work - name should appear in responses.
8. **Visual Overlay Alignment** - May not perfectly match region, accept approximate.
9. **Multi-Modal Detection** - Stretch feature, may not be reliable.
10. **Audio Volume at Venue** - Test at actual demo location ambient noise.

### Lower Risk (Still Test)

11. **Sensitivity Slider Effect** - May not noticeably change behavior.
12. **Session Summary Accuracy** - Stats might not be perfectly tracked.
13. **Snooze Functionality** - May not use during demo.
14. **Dark Mode** - Cosmetic, unlikely to affect demo.
15. **Error Screens** - Hope not to see them, but verify they work.

---

## Estimated Test Duration

| Category | Test Count | Time Estimate |
|----------|------------|---------------|
| Visual/UI Tests | 53 tests | 90 minutes |
| Functional Tests | 35 tests | 60 minutes |
| Gemini Integration Tests | 21 tests | 45 minutes |
| Demo Scenario Tests | 15 tests | 120 minutes (includes repeat trials) |
| Error Handling Tests | 18 tests | 45 minutes |
| Demo Flow Tests | 22 tests | 90 minutes |
| Accessibility & UX Tests | 20 tests | 30 minutes |
| **Total** | **184 tests** | **~8 hours** |

### Recommended Testing Order

1. **Day 1 (3 hours):** Visual/UI Tests, Functional Tests
2. **Day 2 (3 hours):** Gemini Integration Tests, Error Handling Tests
3. **Day 3 (4 hours):** Demo Scenario Tests (with reliability trials), Demo Flow Tests
4. **Day 4 (1 hour):** Accessibility Tests, Full demo rehearsals

### Minimum Viable Testing (Time Constrained)

If time is limited, focus on these P0 tests:

1. All Visual tests marked P0 (~15 tests, 30 min)
2. All Functional tests marked P0 (~15 tests, 30 min)
3. All Gemini Integration tests marked P0 (~10 tests, 30 min)
4. All Demo Scenario tests D1-D5 + reliability (~10 tests, 90 min)
5. Demo Flow tests DF1, DF11, DF12, DF14, DF22 (~5 tests, 60 min)
6. Accessibility tests A1-A8 (~8 tests, 15 min)

**Minimum Total: ~63 critical tests, ~4.5 hours**

---

## Test Results Template

```markdown
## Test Execution Results

**Date:** [Date]
**Tester:** [Name]
**Build:** [Version/Commit]

### Summary
- Total Tests: X
- Passed: X
- Failed: X
- Blocked: X
- Not Run: X

### Failed Tests
| ID | Test Case | Expected | Actual | Severity | Notes |
|----|-----------|----------|--------|----------|-------|
| XX | ... | ... | ... | P0/P1/P2 | ... |

### Blocked Tests
| ID | Test Case | Blocker | Notes |
|----|-----------|---------|-------|

### Demo Reliability Metrics
| Scenario | Trials | Success | Rate |
|----------|--------|---------|------|
| Safety Glasses | 10 | X | X% |
| THE SHOUT | 20 | X | X% |
| Cluttered Workspace | 10 | X | X% |
| Improper Grip | 10 | X | X% |
| Hearing Protection | 10 | X | X% |

### Notes and Observations
- ...

### Recommendations
- ...
```

---

## Appendix: Test Data

### Sample User Names for Testing

- "James" (demo name from script)
- "Alex" (gender neutral)
- "Sir Reginald" (edge case - same as AI)
- "A" (single letter)
- "Alexander Hamilton III" (long name)

### Sample Error Messages to Verify

- Camera: "Hmm, my monocle seems to have fogged up - I've lost sight of you."
- Microphone: "I say, I can no longer hear you. Rather like being at the opera with cotton in one's ears."
- Connection: "I'm terribly sorry, but the connection has become rather unreliable."
- Timeout: "I do apologize - I seem to have become momentarily distracted."

### Keyboard Shortcut Reference

| Key | Action |
|-----|--------|
| M | Toggle mode (Safety/Troubleshoot) |
| S | Snooze warnings |
| Escape | Dismiss alert |
| Enter | Dismiss alert |
| Space | Dismiss alert |

---

*End of Test Plan v1 - Sir Reginald*
