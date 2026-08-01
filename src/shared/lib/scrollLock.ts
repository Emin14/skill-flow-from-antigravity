export const lockBodyScroll = () => {
  if (typeof document === 'undefined') return;
  document.body.style.overflow = 'hidden';
  document.body.style.touchAction = 'none';
  document.documentElement.style.overflow = 'hidden';
};

export const unlockBodyScroll = () => {
  if (typeof document === 'undefined') return;
  document.body.style.overflow = '';
  document.body.style.touchAction = '';
  document.documentElement.style.overflow = '';
};
