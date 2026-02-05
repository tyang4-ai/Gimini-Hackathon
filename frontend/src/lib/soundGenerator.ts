/**
 * Sound Generator - Web Audio API synthesis for game sounds
 * Creates synthetic sounds without requiring audio files
 */

export type SoundId = 'hover' | 'drop' | 'combine' | 'milestone' | 'zoom' | 'error';

// Singleton AudioContext
let audioContext: AudioContext | null = null;

/**
 * Get or create the AudioContext (must be called after user interaction)
 */
function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  // Resume if suspended (browser autoplay policy)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

/**
 * Initialize the audio context on first user interaction
 * Call this early (e.g., on first click/drag) to avoid latency on first sound
 */
export function initAudio(): void {
  getAudioContext();
}

/**
 * Generate hover sound - short high blip
 */
function playHover(ctx: AudioContext, volume: number): void {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(800, ctx.currentTime);

  gainNode.gain.setValueAtTime(0.3 * volume, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.1);
}

/**
 * Generate drop sound - soft thud
 */
function playDrop(ctx: AudioContext, volume: number): void {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(200, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);

  gainNode.gain.setValueAtTime(0.5 * volume, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.15);
}

/**
 * Generate combine sound - ascending chime with harmonics
 */
function playCombine(ctx: AudioContext, volume: number): void {
  const baseFreq = 440;
  const harmonics = [1, 1.5, 2]; // Fundamental, fifth, octave

  harmonics.forEach((ratio, i) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(baseFreq * ratio, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(baseFreq * ratio * 2, ctx.currentTime + 0.3);

    const startTime = ctx.currentTime + i * 0.05;
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.7 * volume / harmonics.length, startTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.3);
  });
}

/**
 * Generate milestone sound - majestic C-E-G arpeggio chord with reverb simulation
 */
function playMilestone(ctx: AudioContext, volume: number): void {
  const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5

  // Create a convolver for reverb-like effect
  const convolver = ctx.createConvolver();
  const dryGain = ctx.createGain();
  const wetGain = ctx.createGain();

  dryGain.gain.setValueAtTime(0.7, ctx.currentTime);
  wetGain.gain.setValueAtTime(0.3, ctx.currentTime);

  // Create simple impulse response for reverb
  const impulseLength = ctx.sampleRate * 1.5;
  const impulse = ctx.createBuffer(2, impulseLength, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const channelData = impulse.getChannelData(channel);
    for (let i = 0; i < impulseLength; i++) {
      channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / impulseLength, 2);
    }
  }
  convolver.buffer = impulse;

  notes.forEach((freq, i) => {
    const oscillator = ctx.createOscillator();
    const oscillator2 = ctx.createOscillator(); // Slight detuning for richness
    const noteGain = ctx.createGain();

    oscillator.connect(noteGain);
    oscillator2.connect(noteGain);
    noteGain.connect(dryGain);
    noteGain.connect(convolver);
    dryGain.connect(ctx.destination);
    convolver.connect(wetGain);
    wetGain.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator2.type = 'triangle';
    oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
    oscillator2.frequency.setValueAtTime(freq * 1.002, ctx.currentTime); // Slight detune

    const startTime = ctx.currentTime + i * 0.15;
    noteGain.gain.setValueAtTime(0, startTime);
    noteGain.gain.linearRampToValueAtTime(0.8 * volume / notes.length, startTime + 0.05);
    noteGain.gain.setValueAtTime(0.8 * volume / notes.length, startTime + 0.8);
    noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + 2);

    oscillator.start(startTime);
    oscillator2.start(startTime);
    oscillator.stop(startTime + 2);
    oscillator2.stop(startTime + 2);
  });
}

/**
 * Generate zoom sound - whoosh frequency sweep
 */
function playZoom(ctx: AudioContext, volume: number): void {
  // Frequency sweep oscillator
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  // Add some noise for texture
  const bufferSize = ctx.sampleRate * 0.4;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    noiseData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 0.5);
  }

  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  const noiseGain = ctx.createGain();
  noiseSource.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noiseGain.gain.setValueAtTime(0.15 * volume, ctx.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(200, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.2);
  oscillator.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.4);

  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.6 * volume, ctx.currentTime + 0.1);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

  oscillator.start(ctx.currentTime);
  noiseSource.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.4);
  noiseSource.stop(ctx.currentTime + 0.4);
}

/**
 * Generate error sound - descending buzz
 */
function playError(ctx: AudioContext, volume: number): void {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(300, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.2);

  gainNode.gain.setValueAtTime(0.4 * volume, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.2);
}

/**
 * Play a sound by ID
 * @param soundId - The sound to play
 * @param volume - Volume multiplier (0-1), defaults to 1
 */
export function playSound(soundId: SoundId, volume: number = 1): void {
  try {
    const ctx = getAudioContext();

    switch (soundId) {
      case 'hover':
        playHover(ctx, volume);
        break;
      case 'drop':
        playDrop(ctx, volume);
        break;
      case 'combine':
        playCombine(ctx, volume);
        break;
      case 'milestone':
        playMilestone(ctx, volume);
        break;
      case 'zoom':
        playZoom(ctx, volume);
        break;
      case 'error':
        playError(ctx, volume);
        break;
    }
  } catch (error) {
    // Fail silently - audio should never break the game
    console.debug('Sound playback error:', error);
  }
}

/**
 * Clean up audio context (call on unmount if needed)
 */
export function cleanupAudio(): void {
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
}
