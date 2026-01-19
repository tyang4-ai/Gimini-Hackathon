# Sir Reginald - Human Testing Checklist

**Total Tests Requiring Human Verification: 116**

---

## PART A: Tests You Can Do ANYWHERE (No Workshop Needed)
**Location:** Any room with webcam, mic, speakers, and internet
**Estimated Time:** ~3 hours

---

### A1. Gemini API Connection Tests (12 tests)
*Requires: Webcam, microphone, speakers, internet*

- [ ] **G1: API token generates successfully**
  - **Do:** Open DevTools (F12) → Network tab → Start the app → Complete onboarding
  - **Check:** Look for POST to `/api/token` with 200 status
  - **Pass if:** Response contains `auth_tokens/` in the name field

- [ ] **G2: WebSocket connection establishes**
  - **Do:** In Network tab, filter by "WS" → Complete onboarding
  - **Check:** WebSocket connection to Gemini API appears
  - **Pass if:** Connection shows "101 Switching Protocols" and stays open

- [ ] **G3: Video frames being sent at 1 FPS**
  - **Do:** Watch WebSocket messages in Network tab for 10 seconds
  - **Check:** Count outgoing messages with image data
  - **Pass if:** ~10 messages sent in 10 seconds (1 per second)

- [ ] **G4: Audio output works**
  - **Do:** Complete onboarding, wait for Sir Reginald to speak
  - **Check:** Sound comes from speakers
  - **Pass if:** You hear Sir Reginald's voice clearly

- [ ] **G5: Proactive audio triggers**
  - **Do:** Sit silently in front of camera for 30-60 seconds, DON'T say anything
  - **Check:** Sir Reginald speaks without you prompting
  - **Pass if:** He comments on what he sees or gives a safety reminder unprompted

- [ ] **G10: Context compression works**
  - **Do:** Keep session running for 30+ minutes
  - **Check:** App doesn't crash or show memory errors
  - **Pass if:** Session continues working after 30 minutes

- [ ] **G11: Token refreshes before expiry**
  - **Do:** Keep session running for 25+ minutes, watch Network tab
  - **Check:** New POST to `/api/token` appears before 30 minutes
  - **Pass if:** Token refresh happens automatically, session continues

- [ ] **G12: Session resumption after brief disconnect**
  - **Do:** Disable WiFi for 5 seconds, then re-enable
  - **Check:** App shows reconnection overlay, then resumes
  - **Pass if:** Session continues without full restart

- [ ] **G13: British persona maintained**
  - **Do:** Interact with Sir Reginald 10 times
  - **Check:** Language uses British phrases ("I say", "Splendid", "Pardon")
  - **Pass if:** Never breaks character, always sounds British aristocrat

- [ ] **G14: Your name used in responses**
  - **Do:** Note the name you entered in onboarding, listen to responses
  - **Check:** Sir Reginald uses your name
  - **Pass if:** Name used at least once in first 5 interactions

- [ ] **G20: Voice quality is clear**
  - **Do:** Listen to Sir Reginald speak
  - **Check:** Audio is clear, not robotic or garbled
  - **Pass if:** Words are easily understood, pleasant to listen to

- [ ] **G21: Responses are relevant**
  - **Do:** Hold up different objects to camera, move around
  - **Check:** Sir Reginald's comments relate to what's visible
  - **Pass if:** Comments make sense for what camera sees

---

### A2. Latency & Degradation Tests (10 tests)
*Requires: Network throttling capability (DevTools → Network → Throttle)*

- [ ] **G6: Latency indicator GREEN when fast**
  - **Do:** Use app normally with good internet
  - **Check:** Look at the colored dot in status bar
  - **Pass if:** Dot is green, tooltip says "Good"

- [ ] **G7: Latency indicator YELLOW at 800-1500ms**
  - **Do:** DevTools → Network → Throttle → "Slow 3G"
  - **Check:** Latency dot color
  - **Pass if:** Dot turns yellow, tooltip says "Moderate"

- [ ] **G8: Latency indicator RED at 1500-2000ms**
  - **Do:** DevTools → Network → Throttle → Custom (1500ms delay)
  - **Check:** Latency dot color
  - **Pass if:** Dot turns red, tooltip says "Slow"

- [ ] **G9: Latency indicator CRITICAL at >2000ms**
  - **Do:** DevTools → Network → Throttle → Offline, then back online
  - **Check:** Latency dot and thinking monocle
  - **Pass if:** Dot turns dark red, thinking monocle may appear

- [ ] **G18: Fallback Level 1 at elevated latency**
  - **Do:** Throttle to "Slow 3G" for 30 seconds
  - **Check:** App continues working, maybe slower
  - **Pass if:** No crashes, responses still come through

- [ ] **G19: Thinking monocle appears at >2s latency**
  - **Do:** Throttle to very slow or briefly go offline
  - **Check:** Animated monocle overlay appears
  - **Pass if:** Monocle shows with Sir Reginald quote like "Gathering my thoughts..."

- [ ] **G22: Personality arc - warmer after 15+ minutes**
  - **Do:** Use app for 15+ minutes, note early vs late language
  - **Check:** Compare formality of early responses vs later responses
  - **Pass if:** Later responses feel warmer, less formal ("Between you and me...")

- [ ] **G23: Name frequency correct**
  - **Do:** Count name usage over 10 interactions
  - **Check:** Name used every 3-5 interactions
  - **Pass if:** Not every sentence, not never - balanced usage

- [ ] **G25: Visual overlay triggers on body part mentions**
  - **Do:** Position yourself so AI comments on your hands or face
  - **Check:** Colored overlay region appears on video
  - **Pass if:** Region highlights when AI mentions that body part

- [ ] **G26: Session resumption preserves context**
  - **Do:** Have a conversation, let token refresh happen (25 min), continue
  - **Check:** Sir Reginald remembers what you were doing
  - **Pass if:** Context not lost after token refresh

---

### A3. Error Handling Tests (18 tests)
*Requires: Ability to deny permissions, disconnect devices*

- [ ] **E1: Camera denied shows error screen**
  - **Do:** Start fresh session → Deny camera permission when prompted
  - **Check:** Error screen appears
  - **Pass if:** Shows camera error with retry option and static safety checklist

- [ ] **E2: Camera unplugged mid-session**
  - **Do:** While app running, physically unplug USB webcam
  - **Check:** App handles gracefully
  - **Pass if:** Shows error or reconnection message, doesn't crash

- [ ] **E3: Microphone denied shows error screen**
  - **Do:** Start fresh session → Deny microphone permission
  - **Check:** Error screen appears
  - **Pass if:** Shows microphone error with instructions

- [ ] **E4: Microphone unplugged mid-session**
  - **Do:** While app running, unplug USB microphone
  - **Check:** App handles gracefully
  - **Pass if:** Shows warning, continues with video-only if possible

- [ ] **E5: Network disabled before connection**
  - **Do:** Disable WiFi → Try to start app
  - **Check:** Error screen appears
  - **Pass if:** Shows connection error, not a blank screen or crash

- [ ] **E6: Network disabled during session**
  - **Do:** While app running, disable WiFi
  - **Check:** Reconnection overlay appears
  - **Pass if:** Sir Reginald says "Slight interruption..." or similar

- [ ] **E7: API timeout >2s shows thinking monocle**
  - **Do:** Throttle network severely (offline then online)
  - **Check:** Thinking monocle animation appears
  - **Pass if:** Monocle visible with rotating phrases

- [ ] **E8: API timeout >5s shows degradation message**
  - **Do:** Keep network very slow for 5+ seconds
  - **Check:** Additional degradation indicator
  - **Pass if:** UI indicates degraded mode, maybe reduced frame rate

- [ ] **E11: WebSocket force-closed attempts reconnection**
  - **Do:** In DevTools Console, run: `// manually close WS if possible`
  - **Check:** App attempts reconnection
  - **Pass if:** Reconnection overlay appears, attempts to reconnect

- [ ] **E12: Reconnection succeeds after brief disconnect**
  - **Do:** Disable WiFi for 5 seconds, re-enable
  - **Check:** App reconnects and continues
  - **Pass if:** "Connection restored" or session resumes normally

- [ ] **E13: Multiple rapid disconnects handled**
  - **Do:** Toggle WiFi off/on 3 times quickly
  - **Check:** App doesn't crash
  - **Pass if:** Eventually stabilizes and reconnects

- [ ] **E16: 30+ second offline enters offline mode**
  - **Do:** Disable WiFi for 30+ seconds
  - **Check:** App enters offline/fallback mode
  - **Pass if:** Shows offline indicator, maybe plays cached audio

- [ ] **E17: Browser tab hidden and returned**
  - **Do:** Switch to another tab for 30 seconds, return
  - **Check:** App resumes properly
  - **Pass if:** Video/audio restart, session continues

- [ ] **E17a: connection-lost.mp3 plays on disconnect**
  - **Do:** Disable WiFi suddenly
  - **Check:** Listen for audio cue
  - **Pass if:** Hear connection lost sound (if audio files exist)

- [ ] **E17b: reconnecting.mp3 plays during reconnect**
  - **Do:** During reconnection attempt, listen
  - **Check:** Audio cue during reconnect
  - **Pass if:** Hear reconnecting sound (if audio files exist)

- [ ] **E17c: safety-reminder.mp3 in degraded mode**
  - **Do:** Stay in degraded mode for a while
  - **Check:** Periodic safety reminder audio
  - **Pass if:** Hear cached safety reminder (if audio files exist)

- [ ] **E17d: connection-restored.mp3 on reconnect**
  - **Do:** After successful reconnection, listen
  - **Check:** Audio cue for restored connection
  - **Pass if:** Hear connection restored sound (if audio files exist)

- [ ] **E18: Browser refresh mid-session restarts cleanly**
  - **Do:** Press F5 to refresh page mid-session
  - **Check:** App restarts from onboarding
  - **Pass if:** Clean restart, no errors, can begin new session

---

### A4. UI/Functional Tests (15 tests)
*Requires: Just the browser*

- [ ] **F4: Camera permission deny flow**
  - **Do:** Start fresh → Click camera permission → Click "Block"
  - **Check:** Error screen appears with instructions
  - **Pass if:** Clear message about enabling camera in browser settings

- [ ] **F6: Microphone permission deny flow**
  - **Do:** Start fresh → Deny microphone permission
  - **Check:** Error screen appears
  - **Pass if:** Clear instructions for enabling microphone

- [ ] **F11: Volume slider adjusts voice volume**
  - **Do:** Move volume slider while Sir Reginald is speaking
  - **Check:** Volume changes
  - **Pass if:** Louder when slider up, quieter when slider down

- [ ] **F12: Mute toggle silences audio**
  - **Do:** Click mute button/icon
  - **Check:** Sir Reginald's voice stops
  - **Pass if:** Complete silence, visual indicator shows muted

- [ ] **F17: Snooze auto-cancels after 5 minutes**
  - **Do:** Click snooze, wait 5 minutes
  - **Check:** Snooze countdown reaches zero
  - **Pass if:** Snooze deactivates, normal alerts resume

- [ ] **F18: S key activates snooze**
  - **Do:** Press S key on keyboard
  - **Check:** Snooze activates
  - **Pass if:** Snooze indicator shows, countdown starts

- [ ] **F20: Theme persists after page refresh**
  - **Do:** Toggle to dark/light mode → Refresh page (F5)
  - **Check:** Theme setting after refresh
  - **Pass if:** Same theme as before refresh

- [ ] **F29: Error screen retry button works**
  - **Do:** Get to an error screen → Click "Retry" or "Try Again"
  - **Check:** App attempts to recover
  - **Pass if:** Returns to onboarding or retries connection

- [ ] **F34: Reconnection overlay appears on connection drop**
  - **Do:** Disable WiFi during active session
  - **Check:** Overlay with Sir Reginald message appears
  - **Pass if:** Shows reconnection message with spinning indicator

- [ ] **F35: Reconnection overlay dismisses on reconnect**
  - **Do:** After overlay appears, re-enable WiFi
  - **Check:** Overlay disappears
  - **Pass if:** Overlay gone, session resumes

- [ ] **A6: M key toggles mode**
  - **Do:** Press M key on keyboard
  - **Check:** Mode switches between Safety Guardian and Troubleshooter
  - **Pass if:** Mode indicator changes, Sir Reginald acknowledges

- [ ] **A7: S key activates snooze (when no alert)**
  - **Do:** With no active alert, press S key
  - **Check:** Snooze activates
  - **Pass if:** Snooze countdown appears

- [ ] **A8: Escape key dismisses active alert**
  - **Do:** Wait for alert to appear → Press Escape
  - **Check:** Alert dismisses
  - **Pass if:** Alert disappears immediately

- [ ] **A9: Enter/Space dismisses active alert**
  - **Do:** Wait for alert to appear → Press Enter or Space
  - **Check:** Alert dismisses
  - **Pass if:** Alert disappears immediately

- [ ] **A17: Hovering latency dot shows tooltip**
  - **Do:** Hover mouse over the latency indicator dot
  - **Check:** Tooltip appears
  - **Pass if:** Shows latency level and description

---

### A5. Accessibility Tests (12 tests)
*Requires: Ruler or DevTools inspector*

- [ ] **A1: Primary buttons at least 60x60px**
  - **Do:** DevTools → Inspect primary buttons → Check computed size
  - **Check:** Width and height values
  - **Pass if:** Both dimensions ≥60px

- [ ] **A2: Alert dismiss button 60px height**
  - **Do:** Trigger alert → Inspect dismiss button
  - **Check:** Height value
  - **Pass if:** Height ≥60px

- [ ] **A3: Control buttons at least 44x44px**
  - **Do:** Inspect mode toggle, theme toggle, etc.
  - **Check:** Size values
  - **Pass if:** Both dimensions ≥44px

- [ ] **A10: Voice command hints visible**
  - **Do:** Look at UI during alert or main screen
  - **Check:** Text mentioning voice commands
  - **Pass if:** Shows hints like "Say 'okay' to dismiss"

- [ ] **A11: Text readable in light mode**
  - **Do:** Switch to light mode, read all text
  - **Check:** Contrast and readability
  - **Pass if:** All text easily readable, no strain

- [ ] **A12: Text readable in dark mode**
  - **Do:** Switch to dark mode, read all text
  - **Check:** Contrast and readability
  - **Pass if:** All text easily readable, no strain

- [ ] **A18: Error messages are clear**
  - **Do:** Trigger various errors (camera deny, network off)
  - **Check:** Error message clarity
  - **Pass if:** Messages explain problem AND what to do

- [ ] **A19: Loading states have progress indicators**
  - **Do:** Watch connection screen, any loading moments
  - **Check:** Visual feedback during waits
  - **Pass if:** Spinners, progress bars, or animations shown

- [ ] **A20: Empty states have appropriate messaging**
  - **Do:** Check any screens that might be "empty"
  - **Check:** Placeholder text or guidance
  - **Pass if:** Never shows blank/empty without explanation

- [ ] **V52: Layout works at mobile width**
  - **Do:** DevTools → Toggle device toolbar → Select mobile
  - **Check:** Layout doesn't break
  - **Pass if:** All elements visible and usable

- [ ] **V53: Layout works at tablet width**
  - **Do:** DevTools → Toggle device toolbar → Select tablet
  - **Check:** Layout doesn't break
  - **Pass if:** All elements visible and usable

- [ ] **G24: Token endpoint includes userName**
  - **Do:** DevTools → Network → Find /api/token response
  - **Check:** Response payload
  - **Pass if:** userName field present in response or request

---

## PART B: Tests Requiring WORKSHOP Environment
**Location:** Workshop/garage with tools, good lighting, space to move
**Estimated Time:** ~4-5 hours (includes 20+ demo rehearsals)

### Props Checklist (Gather Before Testing)
- [ ] Safety glasses (clear lenses, easy to remove/put on)
- [ ] Power tool with visible blade (TABLE SAW or CIRCULAR SAW - **UNPLUGGED**)
- [ ] Hearing protection (over-ear muffs most visible)
- [ ] Clutter items (screws, wood scraps, random tools)
- [ ] Clean workspace to start
- [ ] Good overhead lighting
- [ ] External speakers (laptop speakers may not be loud enough)
- [ ] Tripod or stable camera mount
- [ ] Phone/camera to record demo takes

---

### B1. Demo Scenario Tests - THE CORE (19 tests)
*These are the 5 hardcoded scenarios that MUST work for the demo*

#### Scenario 1: Safety Glasses Off

- [ ] **D1: Removing glasses triggers warning**
  - **Do:** Wear safety glasses → Start session → Reach toward tool → REMOVE glasses while reaching
  - **Check:** Sir Reginald speaks up about glasses
  - **Pass if:** Warning within 3-5 seconds of removing glasses

- [ ] **D1a: Warning includes "safety spectacles" phrase**
  - **Do:** Listen carefully to the warning
  - **Check:** Exact wording
  - **Pass if:** Says "safety spectacles" or "eye protection"

- [ ] **D1b: Visual overlay highlights face region**
  - **Do:** Watch video preview during warning
  - **Check:** Colored overlay on face area
  - **Pass if:** Face region highlighted when discussing glasses

- [ ] **D1c: Putting glasses back on gets acknowledgment**
  - **Do:** Put glasses back on after warning
  - **Check:** Sir Reginald responds
  - **Pass if:** Acknowledgment like "Much obliged" or "Splendid"

#### Scenario 2: Hand Near Blade (THE SHOUT) ⚠️ CRITICAL

- [ ] **D2: Hand toward blade triggers THE SHOUT**
  - **Do:** With blade visible (UNPLUGGED!) → Slowly move hand toward blade
  - **Check:** Sir Reginald SHOUTS urgently
  - **Pass if:** Loud, urgent warning before hand reaches blade

- [ ] **D2a: SHOUT includes your name**
  - **Do:** Listen to the SHOUT
  - **Check:** Format is "[YOUR NAME]! HAND!"
  - **Pass if:** Your actual name shouted, followed by "HAND!"

- [ ] **D2b: SHOUT is loud and urgent**
  - **Do:** Compare to normal speaking volume
  - **Check:** Noticeably louder/more urgent
  - **Pass if:** Clearly different from calm warnings

- [ ] **D2c: SHOUT alert has shake animation**
  - **Do:** Watch the alert UI when SHOUT happens
  - **Check:** Alert box shakes/vibrates
  - **Pass if:** Visible shake animation on the alert

- [ ] **D2d: Follow-up apology after SHOUT**
  - **Do:** After pulling hand back, listen
  - **Check:** Sir Reginald apologizes for outburst
  - **Pass if:** Says something like "Apologies for the outburst, but..."

- [ ] **D2e: Visual overlay highlights hands region**
  - **Do:** Watch video preview during SHOUT
  - **Check:** Hands area highlighted
  - **Pass if:** Hands region has colored overlay

- [ ] **D2-RELIABILITY: Test THE SHOUT 20 times**
  - **Do:** Repeat hand-toward-blade motion 20 times, record results
  - **Check:** Count successful triggers
  - **Pass if:** 18 or more successes (90%+ reliability)
  - **Record:** ___ / 20 successful

#### Scenario 3: Cluttered Workspace

- [ ] **D3: Cluttered workspace triggers warning**
  - **Do:** Place multiple items on workspace (screws, scraps, tools) → Work near them
  - **Check:** Sir Reginald comments on clutter
  - **Pass if:** Warning about messy/cluttered workspace

- [ ] **D3a: Warning mentions tidiness**
  - **Do:** Listen to the warning
  - **Check:** Keywords like "cluttered", "tidy", "clear"
  - **Pass if:** Specifically mentions workspace cleanliness

- [ ] **D3b: Clearing workspace gets acknowledgment**
  - **Do:** Clear the clutter after warning
  - **Check:** Sir Reginald responds
  - **Pass if:** Acknowledgment of cleaner workspace

#### Scenario 4: Improper Grip

- [ ] **D4: Improper grip triggers correction**
  - **Do:** Hold tool incorrectly (fingers too close to blade, wrong hand position)
  - **Check:** Sir Reginald comments on grip
  - **Pass if:** Warning about hand/grip position

- [ ] **D4a: Advice is specific to grip**
  - **Do:** Listen to the correction
  - **Check:** Specific guidance given
  - **Pass if:** Tells you HOW to fix grip, not just "be careful"

#### Scenario 5: Missing Hearing Protection

- [ ] **D5: Missing ear protection triggers warning**
  - **Do:** With loud tool visible (or pretend it's on) → Have ears visible, no protection
  - **Check:** Sir Reginald comments on hearing protection
  - **Pass if:** Warning about ears/hearing protection

- [ ] **D5a: Multi-modal detection (test 10 times)**
  - **Do:** Combine audio cue (saw sound if possible) with visible ears
  - **Check:** Sir Reginald mentions BOTH seeing and hearing
  - **Pass if:** "I hear the saw AND see your ears unprotected" type response
  - **Record:** ___ / 10 multi-modal responses

#### Reliability Testing

- [ ] **D6: All 5 scenarios - 10 trials each**
  - **Do:** Run each scenario 10 times, record results
  - **Check:** Success rate per scenario
  - **Pass if:** Each scenario ≥70% success rate
  - **Record:**
    - Glasses: ___ / 10
    - SHOUT: ___ / 10
    - Clutter: ___ / 10
    - Grip: ___ / 10
    - Hearing: ___ / 10

- [ ] **D7: False positive rate (5 min safe work)**
  - **Do:** Work safely for 5 minutes (glasses on, good grip, clear workspace)
  - **Check:** Count unnecessary warnings
  - **Pass if:** 0-2 false positives in 5 minutes

---

### B2. Demo Flow Tests (22 tests)
*Full 2-minute demo rehearsal*

#### Onboarding & Setup

- [ ] **DF1: Complete onboarding flow**
  - **Do:** Start fresh → Enter name → Grant permissions → Complete setup
  - **Check:** Reaches main dashboard
  - **Pass if:** Smooth flow from start to monitoring

- [ ] **DF2: Onboarding timing <45 seconds**
  - **Do:** Time the onboarding with stopwatch
  - **Check:** Total time
  - **Pass if:** Under 45 seconds

- [ ] **DF3: Greeting stage - Sir Reginald welcomes**
  - **Do:** Watch/listen during camera setup
  - **Check:** Greeting dialogue
  - **Pass if:** "Good day!" or welcoming phrase

- [ ] **DF4: Positioning stage - theatrical direction**
  - **Do:** Follow camera positioning prompts
  - **Check:** Sir Reginald gives directions
  - **Pass if:** "Angle down a touch", "Show me your workspace" type dialogue

- [ ] **DF5: Survey stage - pulsing animation**
  - **Do:** Watch during survey stage
  - **Check:** Visual animation while scanning
  - **Pass if:** Pulsing/scanning animation visible

- [ ] **DF6: Complete stage - Begin Monitoring appears**
  - **Do:** Finish camera setup
  - **Check:** Button to start monitoring
  - **Pass if:** Clear "Begin Monitoring" or "Start" button

#### 2-Minute Demo Script Execution

- [ ] **DF7: 0:00-0:10 - Hook/contrast setup**
  - **Do:** Show "generic safety app" concept, then introduce Sir Reginald
  - **Check:** Smooth transition
  - **Pass if:** Clear before/after contrast established

- [ ] **DF8: 0:10-0:25 - Sir Reginald introduction**
  - **Do:** Let Sir Reginald greet and introduce himself
  - **Check:** Introduction sounds natural
  - **Pass if:** "Good day! I shall be keeping watch..." type intro

- [ ] **DF9: 0:25-0:45 - Guided camera setup**
  - **Do:** Follow Sir Reginald's camera positioning directions
  - **Check:** Theatrical and memorable
  - **Pass if:** He DIRECTS you ("angle down", "show me the saw")

- [ ] **DF10: 0:45-1:05 - Safe work demonstration**
  - **Do:** Work safely with proper PPE and technique
  - **Check:** Sir Reginald gives positive feedback
  - **Pass if:** "Excellent form", "Splendid", encouraging comments

- [ ] **DF11: 1:05-1:25 - Safety glasses scenario**
  - **Do:** Remove safety glasses while reaching toward tool
  - **Check:** Warning triggers
  - **Pass if:** Catches glasses removal, warns politely

- [ ] **DF12: 1:25-1:45 - THE SHOUT moment**
  - **Do:** Move hand toward blade
  - **Check:** SHOUT triggers with drama
  - **Pass if:** "[NAME]! HAND!" with urgency and shake animation

- [ ] **DF13: 1:45-2:00 - Closing**
  - **Do:** Complete task safely, let Sir Reginald close
  - **Check:** Signature closing phrase
  - **Pass if:** "Another day, another digit saved. Cheerio!"

- [ ] **DF14: Complete demo under 2 minutes**
  - **Do:** Time full demo with stopwatch
  - **Check:** Total time
  - **Pass if:** Under 2:00

- [ ] **DF15: Demo has 10-15 second buffer**
  - **Do:** Note how much time left at end
  - **Check:** Buffer for variations
  - **Pass if:** Finishes between 1:45-1:50

#### Recovery Scripts Testing

- [ ] **DF16: Recovery - Detection miss**
  - **Do:** If scenario doesn't trigger, wait
  - **Check:** Sir Reginald's recovery line
  - **Pass if:** "Hmm, my monocle seems foggy..." or similar

- [ ] **DF17: Recovery - Latency spike**
  - **Do:** Throttle network briefly during demo
  - **Check:** Thinking monocle appears
  - **Pass if:** "Gathering my thoughts..." with monocle animation

- [ ] **DF18: Recovery - Connection drop**
  - **Do:** Briefly disable WiFi during demo
  - **Check:** Reconnection dialogue
  - **Pass if:** "Slight interruption to my vigil..." message

- [ ] **DF19: Recovery - Audio fails**
  - **Do:** If audio cuts out, observe visual fallback
  - **Check:** Visual alerts still work
  - **Pass if:** Visual overlay and text alerts continue

- [ ] **DF20: Backup audio files exist**
  - **Do:** Check public/audio/ folder
  - **Check:** MP3 files present
  - **Pass if:** connection-lost.mp3, reconnecting.mp3, etc. exist

#### Consistency Trials

- [ ] **DF21: Full demo 5 times - track success**
  - **Do:** Run complete 2-minute demo 5 times
  - **Check:** How many fully successful
  - **Pass if:** 4/5 or better (80%+)
  - **Record:** ___ / 5 successful demos

- [ ] **DF22: THE SHOUT 20 trials**
  - **Do:** Test SHOUT moment 20 separate times
  - **Check:** Reliability
  - **Pass if:** 18/20 or better (90%+)
  - **Record:** ___ / 20 successful SHOUTs

---

### B3. Audio & Environment Tests (8 tests)
*Test at realistic workshop conditions*

- [ ] **A13: Alerts visible in bright workshop lighting**
  - **Do:** Turn on all workshop lights, test alert visibility
  - **Check:** Can see alerts clearly
  - **Pass if:** Alerts not washed out by bright lights

- [ ] **A14: Sir Reginald audible at 60dB ambient**
  - **Do:** Run a shop vac or fan for background noise, test audio
  - **Check:** Can hear Sir Reginald over noise
  - **Pass if:** Voice clearly audible over moderate background noise

- [ ] **A15: Volume adjustment adequate**
  - **Do:** Test volume slider range
  - **Check:** Can get loud enough for workshop
  - **Pass if:** Max volume sufficient for noisy environment

- [ ] **A16: Complete session hands-free**
  - **Do:** Run full session without touching screen/keyboard
  - **Check:** Can use voice and auto-features only
  - **Pass if:** Entire session possible with dirty/gloved hands

- [ ] **F21: Dismiss alert by clicking**
  - **Do:** When alert appears, click/tap the dismiss area
  - **Check:** Alert dismisses
  - **Pass if:** Immediate dismissal on tap

- [ ] **F22: Dismiss alert with Escape**
  - **Do:** When alert appears, press Escape key
  - **Check:** Alert dismisses
  - **Pass if:** Immediate dismissal

- [ ] **F23: Warning auto-dismisses after 8 seconds**
  - **Do:** Trigger warning alert, don't dismiss manually, count seconds
  - **Check:** Auto-dismissal timing
  - **Pass if:** Dismisses at ~8 seconds

- [ ] **F24: SHOUT auto-dismisses after 10 seconds**
  - **Do:** Trigger SHOUT, don't dismiss manually, count seconds
  - **Check:** Auto-dismissal timing
  - **Pass if:** Dismisses at ~10 seconds

---

## Test Results Summary

### Part A: Anywhere Tests
| Category | Passed | Total | Notes |
|----------|--------|-------|-------|
| A1: API Connection | ___ | 12 | |
| A2: Latency | ___ | 10 | |
| A3: Error Handling | ___ | 18 | |
| A4: UI/Functional | ___ | 15 | |
| A5: Accessibility | ___ | 12 | |
| **Subtotal** | ___ | **67** | |

### Part B: Workshop Tests
| Category | Passed | Total | Notes |
|----------|--------|-------|-------|
| B1: Demo Scenarios | ___ | 19 | |
| B2: Demo Flow | ___ | 22 | |
| B3: Audio/Environment | ___ | 8 | |
| **Subtotal** | ___ | **49** | |

### Reliability Metrics
| Test | Result | Target | Pass? |
|------|--------|--------|-------|
| THE SHOUT (20 trials) | ___/20 | 18/20 (90%) | |
| Full Demo (5 trials) | ___/5 | 4/5 (80%) | |
| Glasses scenario | ___/10 | 7/10 (70%) | |
| Clutter scenario | ___/10 | 7/10 (70%) | |
| Grip scenario | ___/10 | 7/10 (70%) | |
| Hearing scenario | ___/10 | 7/10 (70%) | |
| Multi-modal | ___/10 | 7/10 (70%) | |
| False positives (5 min) | ___ | ≤2 | |

---

## Final Checklist Before Demo Day

- [ ] THE SHOUT works 90%+ of the time
- [ ] All 5 scenarios trigger reliably
- [ ] 2-minute demo completes successfully
- [ ] Audio loud enough for demo environment
- [ ] Backup video recorded in case of failure
- [ ] Props ready and positioned
- [ ] API key has sufficient quota
- [ ] Internet connection stable at demo location

---

*Good luck with testing! Remember: Rehearse THE SHOUT 20+ times!*
