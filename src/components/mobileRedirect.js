export const isMobileDevice = () => {
  return /Mobi|Android/i.test(navigator.userAgent);
};

document.addEventListener('DOMContentLoaded', () => {
  if (isMobileDevice()) {
    window.location.href = '/accessDenied';
  }
});
