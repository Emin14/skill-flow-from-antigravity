/**
 * Web Audio API Sound Synthesizer for Task Completion
 * Fully compatible with iPhone Safari (iOS WebKit), Android & Desktop.
 */

let audioCtx: AudioContext | null = null;
let isUnlocked = false;

export const unlockAudio = (): void => {
  if (typeof window === 'undefined') return;
  try {
    if (!audioCtx) {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().then(() => {
        isUnlocked = true;
      }).catch(() => {});
    } else if (audioCtx && audioCtx.state === 'running') {
      isUnlocked = true;
    }
  } catch (err) {
    // Ignore audio unlock errors
  }
};

// Listen for first touch/click interaction on mobile Safari to unlock Web Audio API
if (typeof window !== 'undefined') {
  const handleUserGesture = () => {
    unlockAudio();
    if (isUnlocked) {
      window.removeEventListener('touchstart', handleUserGesture);
      window.removeEventListener('touchend', handleUserGesture);
      window.removeEventListener('click', handleUserGesture);
    }
  };
  window.addEventListener('touchstart', handleUserGesture, { passive: true });
  window.addEventListener('touchend', handleUserGesture, { passive: true });
  window.addEventListener('click', handleUserGesture, { passive: true });
}

export const isCompletionSoundEnabled = (): boolean => {
  if (typeof window === 'undefined') return true;
  const val = localStorage.getItem('completion-sound-enabled');
  return val === null ? true : val === 'true';
};

export const setCompletionSoundEnabled = (enabled: boolean): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('completion-sound-enabled', enabled ? 'true' : 'false');
};

/**
 * Plays a pleasant, harmonic 2-tone completion chime (E5 -> A5)
 */
export const playTaskCompletionSound = (force: boolean = false): void => {
  if (!force && !isCompletionSoundEnabled()) return;

  try {
    unlockAudio();

    if (!audioCtx) return;

    // Force resume if suspended (critical for iOS Safari)
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }

    const ctx = audioCtx;
    const now = ctx.currentTime;

    // Dual Oscillators for rich harmonic warmth
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';

    // Tone 1: E5 (659.25 Hz) -> A5 (880 Hz)
    osc1.frequency.setValueAtTime(659.25, now);
    osc1.frequency.setValueAtTime(880.00, now + 0.07);

    // Tone 2: E6 (1318.5 Hz) -> A6 (1760 Hz) - subtle upper harmonic
    osc2.frequency.setValueAtTime(1318.5, now);
    osc2.frequency.setValueAtTime(1760.0, now + 0.07);

    // Soft Gain Envelope: fast attack, smooth exponential decay
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
  } catch (err) {
    // Silent failover if audio API is blocked
  }
};
