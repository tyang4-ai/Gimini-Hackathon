import { useCallback, useEffect } from 'react';
import { useAudioStore, type SoundId } from '@/stores/audioStore';

// === RESULT INTERFACE ===

export interface UseSoundResult {
  play: (soundId: SoundId) => void;
  setVolume: (volume: number) => void;
  mute: () => void;
  unmute: () => void;
  isMuted: boolean;
  volume: number;
}

// === HOOK OPTIONS ===

export interface UseSoundOptions {
  /**
   * Whether to preload all sounds when the hook mounts
   * @default false
   */
  preload?: boolean;
}

// === HOOK IMPLEMENTATION ===

/**
 * Hook for playing game sounds with volume control
 *
 * @example
 * ```tsx
 * function CombineButton() {
 *   const { play, isMuted, mute, unmute } = useSound();
 *
 *   const handleCombine = () => {
 *     play('combine');
 *     // ... combine logic
 *   };
 *
 *   return (
 *     <>
 *       <button onClick={handleCombine}>Combine</button>
 *       <button onClick={isMuted ? unmute : mute}>
 *         {isMuted ? 'Unmute' : 'Mute'}
 *       </button>
 *     </>
 *   );
 * }
 * ```
 */
export function useSound(options: UseSoundOptions = {}): UseSoundResult {
  const { preload = false } = options;

  // Get store state and actions
  const masterVolume = useAudioStore((state) => state.masterVolume);
  const isMuted = useAudioStore((state) => state.isMuted);
  const playSound = useAudioStore((state) => state.playSound);
  const setMasterVolume = useAudioStore((state) => state.setMasterVolume);
  const muteAction = useAudioStore((state) => state.mute);
  const unmuteAction = useAudioStore((state) => state.unmute);
  const preloadAllSounds = useAudioStore((state) => state.preloadAllSounds);

  // Preload sounds on mount if requested
  useEffect(() => {
    if (preload) {
      preloadAllSounds();
    }
  }, [preload, preloadAllSounds]);

  // Memoized play function
  const play = useCallback(
    (soundId: SoundId) => {
      playSound(soundId);
    },
    [playSound]
  );

  // Memoized setVolume function
  const setVolume = useCallback(
    (volume: number) => {
      setMasterVolume(volume);
    },
    [setMasterVolume]
  );

  // Memoized mute function
  const mute = useCallback(() => {
    muteAction();
  }, [muteAction]);

  // Memoized unmute function
  const unmute = useCallback(() => {
    unmuteAction();
  }, [unmuteAction]);

  return {
    play,
    setVolume,
    mute,
    unmute,
    isMuted,
    volume: masterVolume,
  };
}

// === CONVENIENCE HOOKS ===

/**
 * Hook that returns just the play function for minimal re-renders
 *
 * @example
 * ```tsx
 * function Element() {
 *   const playSound = useSoundEffect();
 *
 *   return (
 *     <div
 *       onMouseEnter={() => playSound('hover')}
 *       onClick={() => playSound('drop')}
 *     >
 *       Element
 *     </div>
 *   );
 * }
 * ```
 */
export function useSoundEffect(): (soundId: SoundId) => void {
  const playSound = useAudioStore((state) => state.playSound);

  return useCallback(
    (soundId: SoundId) => {
      playSound(soundId);
    },
    [playSound]
  );
}

/**
 * Hook for sound settings UI
 *
 * @example
 * ```tsx
 * function SoundSettings() {
 *   const { volume, setVolume, isMuted, toggleMute } = useSoundSettings();
 *
 *   return (
 *     <div>
 *       <input
 *         type="range"
 *         min={0}
 *         max={1}
 *         step={0.1}
 *         value={volume}
 *         onChange={(e) => setVolume(Number(e.target.value))}
 *       />
 *       <button onClick={toggleMute}>
 *         {isMuted ? 'Unmute' : 'Mute'}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useSoundSettings() {
  const masterVolume = useAudioStore((state) => state.masterVolume);
  const isMuted = useAudioStore((state) => state.isMuted);
  const setMasterVolume = useAudioStore((state) => state.setMasterVolume);
  const toggleMute = useAudioStore((state) => state.toggleMute);

  const setVolume = useCallback(
    (volume: number) => {
      setMasterVolume(volume);
    },
    [setMasterVolume]
  );

  return {
    volume: masterVolume,
    setVolume,
    isMuted,
    toggleMute,
  };
}

// === EXPORTS ===

export { type SoundId } from '@/stores/audioStore';
export default useSound;
