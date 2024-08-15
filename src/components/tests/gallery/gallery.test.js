import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { showToastMessage } from '../../modules/showToastMessage';
import * as getUserService from '../../services/getUserService';
import * as gallery from '../../gallery';

vi.mock('three');
vi.mock('three/examples/jsm/controls/OrbitControls');
vi.mock('../../modules/showToastMessage', () => ({
  showToastMessage: vi.fn(),
}));
vi.mock('../../services/getUserService');

describe('Gallery Component', () => {
  let dom;
  let window;
  let document;

  beforeEach(() => {
    dom = new JSDOM(
      `
      <!DOCTYPE html>
      <html>
        <body>
          <section>
            <div class="slide-inner"></div>
            <div class="share-modal none">
              <h3></h3>
            </div>
            <button class="list-prev"></button>
            <button class="list-next"></button>
            <div class="close-button"></div>
            <button class="share-icon-button"></button>
            <div class="detail-scene"></div>
          </section>
        </body>
      </html>
    `,
      {
        url: 'http://localhost',
        pretendToBeVisual: true,
      }
    );
    window = dom.window;
    document = window.document;
    globalThis.window = dom.window;
    globalThis.document = dom.window.document;
    globalThis.navigator = dom.window.navigator;

    window.THREE = THREE;
    window.OrbitControls = OrbitControls;

    gallery.initializeElements(document);
    const mockScene = new THREE.Scene();
    gallery.setScene(mockScene);
  });

  it('should create share list item correctly', async () => {
    const mockUserDocument = {
      id: '123',
      nickname: 'Test User',
      thumbnail: 'test.jpg',
    };

    getUserService.fetchUserDocument.mockResolvedValue(mockUserDocument);

    const listItem = await gallery.makeShareList('123');

    expect(listItem.tagName).toBe('LI');
    expect(listItem.classList.contains('share-list')).toBe(true);
    expect(listItem.id).toBe('123');

    const imgElement = listItem.querySelector('img');
    expect(imgElement.src).toBe('http://localhost/test.jpg');

    const titleElement = listItem.querySelector('.share-title');
    expect(titleElement.textContent).toBe('Test User');
  });

  it('should create correct number of pages', async () => {
    const mockAllDocuments = Array(9)
      .fill()
      .map((_, i) => ({ id: `${i + 1}` }));

    getUserService.fetchAllUserDocuments.mockResolvedValue(mockAllDocuments);
    getUserService.fetchUserDocument.mockResolvedValue({
      nickname: 'Test User',
      thumbnail: 'test.jpg',
    });

    await gallery.createPages();

    const slideInner = document.querySelector('.slide-inner');
    expect(slideInner.children.length).toBe(2);
  });

  it('should handle modal opening and closing', async () => {
    getUserService.fetchUserDocument.mockResolvedValue({
      nickname: 'Test User',
    });
    getUserService.fetchUserPositions.mockResolvedValue([]);

    await gallery.shareModalOn('123');
    expect(document.querySelector('section').classList.contains('active')).toBe(
      true
    );
    expect(
      document.querySelector('.share-modal').classList.contains('none')
    ).toBe(false);
    expect(document.querySelector('.share-modal h3').textContent).toBe(
      'Test User'
    );

    gallery.closeModal();
    expect(document.querySelector('section').classList.contains('active')).toBe(
      false
    );
    expect(
      document.querySelector('.share-modal').classList.contains('none')
    ).toBe(true);
  });

  it('should copy URL when share button is clicked', async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    await gallery.copyUrl();

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'http://localhost/'
    );
    expect(showToastMessage).toHaveBeenCalled();
  });

  it('should update slide position correctly', () => {
    gallery.updateSlidePosition();
    const slideInner = document.querySelector('.slide-inner');
    expect(slideInner.style.transform).toBe('translateX(-0%)');

    const prevButton = document.querySelector('.list-prev');
    const nextButton = document.querySelector('.list-next');
    expect(prevButton.style.display).toBe('none');
    expect(nextButton.style.display).toBe('block');
  });

  it('should render origami correctly', () => {
    const mockScene = { children: [], add: vi.fn() };
    gallery.setScene(mockScene);

    const mockPositions = [
      [0, 0, 0],
      [1, 1, 1],
      [2, 2, 2],
    ];
    gallery.renderOrigami(mockPositions);

    expect(mockScene.add).toHaveBeenCalled();
  });

  it('should render origami without errors', () => {
    const mockPositionsData = [
      [0, 0, 0],
      [1, 0, 0],
      [0, 1, 0],
    ];

    expect(() => {
      gallery.renderOrigami(mockPositionsData);
    }).not.toThrow();
  });
});
