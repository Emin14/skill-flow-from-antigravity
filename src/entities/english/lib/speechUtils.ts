/**
 * Web Speech API wrapper with iOS/Safari mobile compatibility and voice fallback
 */
export const speakEnglishWord = (text: string, accent: 'us' | 'uk' = 'us', rate = 0.85): void => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  try {
    window.speechSynthesis.cancel();

    const cleanText = text.replace(/\d+$/, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = accent === 'uk' ? 'en-GB' : 'en-US';
    utterance.rate = rate;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const targetLangPrefix = accent === 'uk' ? 'en-GB' : 'en-US';
      const preferredVoice = voices.find(
        (v) => v.lang.replace('_', '-').startsWith(targetLangPrefix) && (v.name.includes('Natural') || v.name.includes('Enhanced') || v.name.includes('Siri') || v.name.includes('Google'))
      ) || voices.find((v) => v.lang.replace('_', '-').startsWith(targetLangPrefix))
        || voices.find((v) => v.lang.startsWith('en'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
};

/**
 * Mobile vibration haptic feedback (Safe for iPhone Safari & Android)
 */
export const triggerHapticFeedback = (type: 'light' | 'medium' | 'success' | 'error' = 'light'): void => {
  if (typeof window === 'undefined' || !('navigator' in window)) return;

  try {
    if (navigator.vibrate) {
      if (type === 'light') navigator.vibrate(15);
      else if (type === 'medium') navigator.vibrate(30);
      else if (type === 'success') navigator.vibrate([20, 50, 20]);
      else if (type === 'error') navigator.vibrate([40, 40, 40]);
    }
  } catch {
    // Ignore unsupported vibration
  }
};
