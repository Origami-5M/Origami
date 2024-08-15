import { expect, describe, it, beforeEach, vi } from 'vitest';
import { moveTooltip } from '../../modules/showTooltipMessage';

describe('moveTooltip', () => {
  let tooltipText;

  beforeEach(() => {
    vi.stubGlobal('window', {
      innerWidth: 1024,
      innerHeight: 768,
    });

    tooltipText = {
      style: {},
      getBoundingClientRect: () => ({ width: 100, height: 50 }),
    };
  });

  describe('툴팁이 화면 안에 있을 때', () => {
    it('올바른 위치로 계산되어야 함', () => {
      const event = { clientX: 100, clientY: 100 };
      moveTooltip(event, tooltipText);

      expect(tooltipText.style.left).toBe('110px');
      expect(tooltipText.style.top).toBe('120px');
    });
  });

  describe('툴팁이 오른쪽 경계를 벗어날 때', () => {
    it('왼쪽으로 위치가 조정되어야 함', () => {
      const event = { clientX: 1000, clientY: 100 };
      moveTooltip(event, tooltipText);

      expect(tooltipText.style.left).toBe('890px');
      expect(tooltipText.style.top).toBe('120px');
    });
  });

  describe('툴팁이 아래쪽 경계를 벗어날 때', () => {
    it('위쪽으로 위치가 조정되어야 함', () => {
      const event = { clientX: 100, clientY: 700 };
      moveTooltip(event, tooltipText);

      expect(tooltipText.style.left).toBe('110px');
      expect(tooltipText.style.top).toBe('630px');
    });
  });

  describe('툴팁이 오른쪽과 아래쪽 경계를 모두 벗어날 때', () => {
    it('왼쪽 위로 위치가 조정되어야 함', () => {
      const event = { clientX: 1000, clientY: 700 };
      moveTooltip(event, tooltipText);

      expect(tooltipText.style.left).toBe('890px');
      expect(tooltipText.style.top).toBe('630px');
    });
  });
});
