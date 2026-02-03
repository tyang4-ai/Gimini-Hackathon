# Sound Files Required

The following sound files are needed for the game:

| File | Volume | Purpose |
|------|--------|---------|
| `hover.mp3` | 30% | Element hover feedback |
| `drop.mp3` | 50% | Element drop into slot |
| `combine.mp3` | 70% | Successful combination |
| `milestone.mp3` | 80% | Milestone reveal animation |
| `zoom.mp3` | 60% | Zooming into element |
| `error.mp3` | 40% | Error feedback |

## Sound Design Notes

- Keep files small (< 100KB each)
- Use short, satisfying sounds (< 2 seconds)
- Milestone sound should have more impact (can be longer, up to 5s)
- Consider using free sound resources like freesound.org or mixkit.co

## Audio Store

The audio is managed by `frontend/src/stores/audioStore.ts` which:
- Persists volume and mute settings to localStorage
- Fails silently if sound files are missing
- Supports volume ramping to prevent clicks/pops
