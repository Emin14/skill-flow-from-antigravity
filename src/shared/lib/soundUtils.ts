/**
 * Universal Sound Synthesizer & Audio Engine for Task Completion
 * Fully compatible with iPhone Safari (iOS WebKit), Android & Desktop.
 * Bypasses iOS physical silent switch & Web Audio autoplay restrictions.
 */

let audioCtx: AudioContext | null = null;
let isUnlocked = false;
let cachedAudioElement: HTMLAudioElement | null = null;

/**
 * Generates a 0.35s 16-bit PCM WAV base64 Data URI for the harmonic chime (E5 -> A5).
 * Played via HTML5 Audio element to bypass iOS physical Silent/Mute switch.
 */
const generateChimeWavDataUri = (): string => {
  const sampleRate = 22050;
  const duration = 0.35;
  const numSamples = Math.floor(sampleRate * duration);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  // RIFF header
  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, 36 + numSamples * 2, true);
  view.setUint32(8, 0x57415645, false); // "WAVE"
  // fmt subchunk
  view.setUint32(12, 0x666d7420, false); // "fmt "
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  // data subchunk
  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, numSamples * 2, true);

  // E5 (659.25Hz) -> A5 (880Hz) harmonic chime calculation
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const freq1 = t < 0.07 ? 659.25 : 880.0;
    const freq2 = t < 0.07 ? 1318.5 : 1760.0;

    let env = 0;
    if (t < 0.02) {
      env = t / 0.02;
    } else {
      env = Math.exp(-(t - 0.02) * 8.5);
    }

    const sample1 = Math.sin(2 * Math.PI * freq1 * t);
    const sample2 = Math.sin(2 * Math.PI * freq2 * t) * 0.3;
    const sample = (sample1 + sample2) * env * 0.35;

    const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    view.setInt16(44 + i * 2, intSample, true);
  }

  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return 'data:audio/wav;base64,' + btoa(binary);
};

export const unlockAudio = (): void => {
  if (typeof window === 'undefined') return;

  try {
    // 1. Create AudioContext if not initialized
    if (!audioCtx) {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }

    // 2. Play silent buffer source to unlock iOS WebKit audio graph
    if (audioCtx) {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }
      const buffer = audioCtx.createBuffer(1, 1, 22050);
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.start(0);
      isUnlocked = true;
    }

    // 3. Pre-cache HTML5 Audio Element for iOS Media Session bypass
    if (!cachedAudioElement && typeof Audio !== 'undefined') {
      const wavUri = generateChimeWavDataUri();
      cachedAudioElement = new Audio(wavUri);
      cachedAudioElement.load();
    }
  } catch (err) {
    // Ignore audio unlock errors
  }
};

// Global gesture listeners to unlock audio on first user touch/click
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
 * Plays a pleasant, harmonic 2-tone completion chime (E5 -> A5).
 * Uses dual-engine playback (Web Audio + HTML5 Audio fallback) for 100% reliability on iOS Safari.
 */
export const playTaskCompletionSound = (force: boolean = false): void => {
  if (!force && !isCompletionSoundEnabled()) return;

  if (typeof window === 'undefined') return;

  unlockAudio();

  let webAudioPlayed = false;

  // Engine 1: Web Audio API Synthesizer
  try {
    if (audioCtx) {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }

      const ctx = audioCtx;
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(659.25, now);
      osc1.frequency.setValueAtTime(880.0, now + 0.07);

      osc2.frequency.setValueAtTime(1318.5, now);
      osc2.frequency.setValueAtTime(1760.0, now + 0.07);

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
      webAudioPlayed = true;
    }
  } catch (err) {
    webAudioPlayed = false;
  }

  // Engine 2: HTML5 Audio Element Fallback for iOS hardware Silent Switch bypass
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  if (isIOS || !webAudioPlayed) {
    try {
      if (cachedAudioElement) {
        cachedAudioElement.currentTime = 0;
        const playPromise = cachedAudioElement.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Audio blocked by browser policy
          });
        }
      } else {
        const wavUri = generateChimeWavDataUri();
        const audio = new Audio(wavUri);
        audio.play().catch(() => {});
      }
    } catch (err) {
      // Ignore fallback playback errors
    }
  }
};
