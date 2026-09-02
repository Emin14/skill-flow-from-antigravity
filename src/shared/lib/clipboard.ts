/**
 * shared/lib/clipboard.ts
 * Утилита копирования в буфер обмена с поддержкой Secure Context и fallback для мобильных и HTTP.
 */

export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (!text) return false;

  // 1. Попытка через стандартный Clipboard API (работает в HTTPS / localhost)
  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      // Игнорируем и переходим к надежному запасному варианту ниже
    }
  }

  // 2. Универсальный fallback через временный textarea + execCommand('copy')
  try {
    if (typeof document === 'undefined') return false;
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '0';
    textarea.style.width = '2em';
    textarea.style.height = '2em';
    textarea.style.padding = '0';
    textarea.style.border = 'none';
    textarea.style.outline = 'none';
    textarea.style.boxShadow = 'none';
    textarea.style.background = 'transparent';
    textarea.style.opacity = '0';
    textarea.setAttribute('readonly', '');
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    return successful;
  } catch (err) {
    console.warn('Fallback copy failed:', err);
    return false;
  }
};
