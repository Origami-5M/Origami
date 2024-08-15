import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { JSDOM } from 'jsdom';
import html2canvas from 'html2canvas';
import { showToastMessage } from '../../modules/showToastMessage';
import { TOAST_MESSAGE } from '../../../constants/index';
import * as playModule from '../../play';

vi.mock('html2canvas');
vi.mock('../../modules/showToastMessage');
vi.mock('../../services/userService');
vi.mock('../../../three/Paper', () => ({
  paper: {
    geometry: {
      attributes: {
        position: {
          array: new Float32Array([1, 2, 3, 4, 5, 6]),
        },
      },
    },
  },
}));

describe('Play 모듈', () => {
  let dom;
  let window;
  let document;

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
      url: 'http://localhost',
      pretendToBeVisual: true,
    });
    window = dom.window;
    document = window.document;

    document.body.innerHTML = `
      <div class="finish-canvas"></div>
      <input class="complete-input" />
      <button class="share-button"></button>
      <div class="guide-wrap">
        <ul class="slider"></ul>
        <button class="prev"></button>
        <button class="next"></button>
        <div class="pagination-text"></div>
      </div>
    `;

    vi.stubGlobal('window', window);
    vi.stubGlobal('document', document);

    vi.clearAllMocks();

    playModule.initializeDOMElements();
    playModule.initializeGuideMode();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('captureThumbnail', () => {
    it('html2canvas를 사용하여 썸네일을 캡처해야 합니다', async () => {
      const mockCanvas = {
        toDataURL: vi.fn().mockReturnValue('mock-data-url'),
      };
      html2canvas.mockResolvedValue(mockCanvas);

      const element = document.createElement('div');
      const result = await playModule.captureThumbnail(element);

      expect(html2canvas).toHaveBeenCalledWith(element, expect.any(Object));
      expect(result).toBe('mock-data-url');
    });
  });

  describe('chunkArray', () => {
    it('배열을 올바르게 청크로 나눠야 합니다', () => {
      const array = [1, 2, 3, 4, 5, 6];
      const result = playModule.chunkArray(array, 2);
      expect(result).toEqual([
        [1, 2],
        [3, 4],
        [5, 6],
      ]);
    });
  });

  describe('handleShareButton', () => {
    it('사용자 이름이 비어있을 때 토스트 메시지를 표시해야 합니다', async () => {
      const event = new window.Event('click');
      await playModule.handleShareButton(event);

      expect(showToastMessage).toHaveBeenCalledWith(TOAST_MESSAGE.NO_NICKNAME);
    });

    it('에러 발생 시 토스트 메시지를 표시해야 합니다', async () => {
      const event = new window.Event('click');
      document.querySelector('.complete-input').value = 'testUser';

      html2canvas.mockResolvedValue({
        toDataURL: vi.fn().mockReturnValue('mock-thumbnail-url'),
      });
      vi.mock('../../services/userService', () => ({
        saveUserInfo: vi.fn().mockRejectedValue(new Error('Mock error')),
      }));

      await playModule.handleShareButton(event);

      expect(showToastMessage).toHaveBeenCalledWith(
        TOAST_MESSAGE.ERROR_SAVE,
        expect.any(Error)
      );
    });
  });
});
