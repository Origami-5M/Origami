import { describe, it, expect } from 'vitest';
import { isMobileDevice } from '../../mobileRedirect.js';

Object.defineProperty(window, 'navigator', {
  value: {
    userAgent: '',
  },
});

describe('isMobileDevice', () => {
  it('모바일 장치에서 true를 반환해야 한다', () => {
    navigator.userAgent =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1';
    expect(isMobileDevice()).toBe(true);
  });

  it('비모바일 장치에서 false를 반환해야 한다', () => {
    navigator.userAgent =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3';
    expect(isMobileDevice()).toBe(false);
  });
});
