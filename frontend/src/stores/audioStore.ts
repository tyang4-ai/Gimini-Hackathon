import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { playSound as playSynthSound, initAudio, type SoundId } from '@/lib/soundGenerator';

// Re-export SoundId for consumers
export type { SoundId } from '@/lib/soundGenerator';

// === STATE INTERFACE ===

interface AudioState {
  // Settings
  masterVolume: number; // 0-1
  isMuted: boolean;

  // Runtime (not persisted)
  isInitialized: boolean;
}

interface AudioActions {
  // Volume controls
  setMasterVolume: (volume: number) => void;
  mute: () => void;
  unmute: () => void;
  toggleMute: () => void;

  // Sound management
  preloadAllSounds: () => Promise<void>;
  playSound: (soundId: SoundId) => void;

  // Cleanup
  clearCache: () => void;
}

type AudioStore = AudioState & AudioActions;

// === STORE IMPLEMENTATION ===

export const useAudioStore = create<AudioStore>()(
  persist(
    (set, get) => ({
      // Initial state
      masterVolume: 0.7,
      isMuted: false,
      isInitialized: false,

      // === VOLUME CONTROLS ===

      setMasterVolume: (volume: number) => {
        // Clamp volume between 0 and 1
        const clampedVolume = Math.max(0, Math.min(1, volume));
        set({ masterVolume: clampedVolume });
      },

      mute: () => {
        set({ isMuted: true });
      },

      unmute: () => {
        set({ isMuted: false });
      },

      toggleMute: () => {
        const { isMuted } = get();
        set({ isMuted: !isMuted });
      },

      // === SOUND MANAGEMENT ===

      preloadAllSounds: async (): Promise<void> => {
        // Initialize AudioContext on user interaction
        initAudio();
        set({ isInitialized: true });
      },

      playSound: (soundId: SoundId): void => {
        const { isMuted, masterVolume, isInitialized } = get();

        // If muted, don't play
        if (isMuted) {
          return;
        }

        // Initialize if not already done (handles first interaction)
        if (!isInitialized) {
          initAudio();
          set({ isInitialized: true });
        }

        // Play the synthesized sound with master volume
        playSynthSound(soundId, masterVolume);
      },

      // === CLEANUP ===

      clearCache: () => {
        // No cache to clear with Web Audio API
        set({ isInitialized: false });
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
