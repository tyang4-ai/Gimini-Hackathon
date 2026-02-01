import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// === TYPES ===

export type SoundId =
  | 'hover'
  | 'drop'
  | 'combine'
  | 'milestone'
  | 'zoom'
  | 'error';

// Sound configuration with volume multipliers for individual sounds
interface SoundConfig {
  src: string;
  volume: number; // Individual sound volume multiplier (0-1)
}

// === SOUND PATHS ===

const SOUND_PATHS: Record<SoundId, SoundConfig> = {
  hover: { src: '/sounds/hover.mp3', volume: 0.3 },
  drop: { src: '/sounds/drop.mp3', volume: 0.5 },
  combine: { src: '/sounds/combine.mp3', volume: 0.7 },
  milestone: { src: '/sounds/milestone.mp3', volume: 0.8 },
  zoom: { src: '/sounds/zoom.mp3', volume: 0.6 },
  error: { src: '/sounds/error.mp3', volume: 0.4 },
};

// === STATE INTERFACE ===

interface AudioState {
  // Settings
  masterVolume: number; // 0-1
  isMuted: boolean;

  // Runtime (not persisted)
  loadedSounds: Map<SoundId, HTMLAudioElement>;
  loadingPromises: Map<SoundId, Promise<HTMLAudioElement | null>>;
}

interface AudioActions {
  // Volume controls
  setMasterVolume: (volume: number) => void;
  mute: () => void;
  unmute: () => void;
  toggleMute: () => void;

  // Sound management
  loadSound: (soundId: SoundId) => Promise<HTMLAudioElement | null>;
  preloadAllSounds: () => Promise<void>;
  playSound: (soundId: SoundId) => void;

  // Cleanup
  clearCache: () => void;
}

type AudioStore = AudioState & AudioActions;

// === VOLUME RAMPING ===

/**
 * Smoothly ramp audio volume to prevent clicks/pops
 */
function rampVolume(
  audio: HTMLAudioElement,
  targetVolume: number,
  durationMs: number = 50
): void {
  const startVolume = audio.volume;
  const volumeDiff = targetVolume - startVolume;
  const startTime = performance.now();

  function update() {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(elapsed / durationMs, 1);

    // Ease-out curve for smoother transition
    const eased = 1 - Math.pow(1 - progress, 2);
    audio.volume = startVolume + volumeDiff * eased;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// === STORE IMPLEMENTATION ===

export const useAudioStore = create<AudioStore>()(
  persist(
    (set, get) => ({
      // Initial state
      masterVolume: 0.7,
      isMuted: false,
      loadedSounds: new Map(),
      loadingPromises: new Map(),

      // === VOLUME CONTROLS ===

      setMasterVolume: (volume: number) => {
        // Clamp volume between 0 and 1
        const clampedVolume = Math.max(0, Math.min(1, volume));
        set({ masterVolume: clampedVolume });

        // Update all loaded sounds with new volume
        const { loadedSounds, isMuted } = get();
        loadedSounds.forEach((audio, soundId) => {
          const config = SOUND_PATHS[soundId];
          const targetVolume = isMuted ? 0 : clampedVolume * config.volume;
          rampVolume(audio, targetVolume);
        });
      },

      mute: () => {
        set({ isMuted: true });

        // Mute all loaded sounds with ramping
        const { loadedSounds } = get();
        loadedSounds.forEach((audio) => {
          rampVolume(audio, 0);
        });
      },

      unmute: () => {
        set({ isMuted: false });

        // Restore volume on all loaded sounds
        const { loadedSounds, masterVolume } = get();
        loadedSounds.forEach((audio, soundId) => {
          const config = SOUND_PATHS[soundId];
          rampVolume(audio, masterVolume * config.volume);
        });
      },

      toggleMute: () => {
        const { isMuted, mute, unmute } = get();
        if (isMuted) {
          unmute();
        } else {
          mute();
        }
      },

      // === SOUND MANAGEMENT ===

      loadSound: async (soundId: SoundId): Promise<HTMLAudioElement | null> => {
        const { loadedSounds, loadingPromises } = get();

        // Return cached sound if already loaded
        if (loadedSounds.has(soundId)) {
          return loadedSounds.get(soundId) || null;
        }

        // Return existing loading promise if already loading
        if (loadingPromises.has(soundId)) {
          return loadingPromises.get(soundId) || null;
        }

        // Create new loading promise
        const loadPromise = new Promise<HTMLAudioElement | null>((resolve) => {
          const config = SOUND_PATHS[soundId];
          const audio = new Audio(config.src);

          // Set initial volume
          const { masterVolume, isMuted } = get();
          audio.volume = isMuted ? 0 : masterVolume * config.volume;

          // Handle successful load
          audio.addEventListener('canplaythrough', () => {
            set((state) => {
              const newLoadedSounds = new Map(state.loadedSounds);
              newLoadedSounds.set(soundId, audio);

              const newLoadingPromises = new Map(state.loadingPromises);
              newLoadingPromises.delete(soundId);

              return {
                loadedSounds: newLoadedSounds,
                loadingPromises: newLoadingPromises,
              };
            });
            resolve(audio);
          }, { once: true });

          // Handle load error - fail silently as per requirements
          audio.addEventListener('error', () => {
            set((state) => {
              const newLoadingPromises = new Map(state.loadingPromises);
              newLoadingPromises.delete(soundId);
              return { loadingPromises: newLoadingPromises };
            });
            // Fail silently - don't log or throw
            resolve(null);
          }, { once: true });

          // Start loading
          audio.load();
        });

        // Store the loading promise
        set((state) => {
          const newLoadingPromises = new Map(state.loadingPromises);
          newLoadingPromises.set(soundId, loadPromise);
          return { loadingPromises: newLoadingPromises };
        });

        return loadPromise;
      },

      preloadAllSounds: async (): Promise<void> => {
        const { loadSound } = get();
        const soundIds = Object.keys(SOUND_PATHS) as SoundId[];

        // Load all sounds in parallel
        await Promise.all(soundIds.map((soundId) => loadSound(soundId)));
      },

      playSound: (soundId: SoundId): void => {
        const { loadedSounds, masterVolume, isMuted, loadSound } = get();

        // If muted, don't play
        if (isMuted) {
          return;
        }

        // Get or load the sound
        let audio = loadedSounds.get(soundId);

        if (!audio) {
          // Sound not loaded yet - load it first, then play
          loadSound(soundId).then((loadedAudio) => {
            if (loadedAudio && !get().isMuted) {
              const config = SOUND_PATHS[soundId];
              loadedAudio.volume = get().masterVolume * config.volume;
              loadedAudio.currentTime = 0;
              loadedAudio.play().catch(() => {
                // Fail silently - browser may block autoplay
              });
            }
          });
          return;
        }

        // Play the sound
        const config = SOUND_PATHS[soundId];
        audio.volume = masterVolume * config.volume;
        audio.currentTime = 0;
        audio.play().catch(() => {
          // Fail silently - browser may block autoplay
        });
      },

      // === CLEANUP ===

      clearCache: () => {
        const { loadedSounds } = get();

        // Stop and remove all audio elements
        loadedSounds.forEach((audio) => {
          audio.pause();
          audio.src = '';
        });

        set({
          loadedSounds: new Map(),
          loadingPromises: new Map(),
        });
      },
    }),
    {
      name: 'omnigenesis-audio-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist settings, not runtime state
      partialize: (state) => ({
        masterVolume: state.masterVolume,
        isMuted: state.isMuted,
      }),
    }
  )
);

// === SELECTORS ===

export const selectMasterVolume = (state: AudioStore) => state.masterVolume;
export const selectIsMuted = (state: AudioStore) => state.isMuted;

// === EXPORTS ===

export { SOUND_PATHS };
export type { SoundConfig };
