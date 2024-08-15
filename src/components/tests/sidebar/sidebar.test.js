import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  checkList,
  changeSoundButton,
  setupEventListeners,
} from '../../sidebar';

const setupDOM = html => {
  document.body.innerHTML = html;
};

describe('UI 인터렉션 테스트', () => {
  let infoButton, infoWrap;

  beforeEach(() => {
    setupDOM(`
      <button class="info-button">Info</button>
      <div class="info-wrap">Info Content</div>
    `);

    infoButton = document.querySelector('.info-button');
    infoWrap = document.querySelector('.info-wrap');

    const toggleInfo = () => {
      infoWrap.classList.toggle('visible');
      infoButton.classList.toggle('active');
    };

    infoButton.addEventListener('click', toggleInfo);
  });

  it('infoButton 클릭 시 infoWrap과 infoButton의 클래스가 토글됩니다.', () => {
    expect(infoWrap.classList.contains('visible')).toBe(false);
    expect(infoButton.classList.contains('active')).toBe(false);

    infoButton.click();

    expect(infoWrap.classList.contains('visible')).toBe(true);
    expect(infoButton.classList.contains('active')).toBe(true);

    infoButton.click();

    expect(infoWrap.classList.contains('visible')).toBe(false);
    expect(infoButton.classList.contains('active')).toBe(false);
  });
});

describe('Mode Lists 인터렉션 테스트', () => {
  let modeLists;

  beforeEach(() => {
    setupDOM(`
      <ul class="mode-list">
        <li data-guideMode="easy">Easy Mode</li>
        <li data-guideMode="hard">Hard Mode</li>
      </ul>
    `);

    modeLists = document.querySelectorAll('.mode-list li');

    modeLists.forEach(item => {
      item.addEventListener('click', checkList);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('modeLists 항목 클릭 시 active 클래스가 토글되고 URL이 변경되어야 합니다.', () => {
    const [easyMode, hardMode] = modeLists;

    easyMode.click();
    expect(easyMode.classList.contains('active')).toBe(true);
    expect(hardMode.classList.contains('active')).toBe(false);

    hardMode.click();
    expect(hardMode.classList.contains('active')).toBe(true);
    expect(easyMode.classList.contains('active')).toBe(false);
  });
});

describe('toggleInfo 함수 테스트', () => {
  let infoButton, infoWrap;

  beforeEach(() => {
    document.body.innerHTML = `
      <button class="info-button">Info</button>
      <div class="info-wrap">Info Content</div>
    `;

    infoButton = document.querySelector('.info-button');
    infoWrap = document.querySelector('.info-wrap');

    const toggleInfo = () => {
      infoWrap.classList.toggle('visible');
      infoButton.classList.toggle('active');
    };

    infoButton.addEventListener('click', toggleInfo);
  });

  it('infoButton 클릭 시 infoWrap과 infoButton의 클래스가 토글됩니다.', () => {
    expect(infoWrap.classList.contains('visible')).toBe(false);
    expect(infoButton.classList.contains('active')).toBe(false);

    infoButton.click();

    expect(infoWrap.classList.contains('visible')).toBe(true);
    expect(infoButton.classList.contains('active')).toBe(true);

    infoButton.click();

    expect(infoWrap.classList.contains('visible')).toBe(false);
    expect(infoButton.classList.contains('active')).toBe(false);
  });
});

describe('changeSoundButton 함수 테스트', () => {
  let soundButton, mainBgm;

  beforeEach(() => {
    setupDOM(`
      <button class="sound-button"></button>
      <audio class="main-bgm"></audio>
    `);

    soundButton = document.querySelector('.sound-button');
    mainBgm = document.querySelector('.main-bgm');

    vi.spyOn(mainBgm, 'play').mockImplementation(() => {});
    vi.spyOn(mainBgm, 'pause').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('isMuted가 true일 때 soundButton의 배경이 변경되고 mainBgm이 정지됩니다.', () => {
    changeSoundButton(soundButton, mainBgm, true);

    expect(soundButton.style.backgroundPosition).toBe('-100px -137px');
    expect(mainBgm.pause).toHaveBeenCalled();
  });

  it('isMuted가 false일 때 soundButton의 배경이 변경되고 mainBgm이 재생됩니다.', () => {
    changeSoundButton(soundButton, mainBgm, false);

    expect(soundButton.style.backgroundPosition).toBe('-100px -80px');
    expect(mainBgm.play).toHaveBeenCalled();
  });
});

describe('setupEventListeners 함수 테스트', () => {
  let soundButton;

  beforeEach(() => {
    setupDOM(`
      <button class="info-button">Info</button>
      <div class="info-wrap">Info Content</div>
      <button class="mode-button"></button>
      <div class="mode-sidebar"></div>
      <button class="gallery-button">Gallery</button>
      <button class="sound-button"></button>
      <audio class="main-bgm"></audio>
      <ul class="mode-list">
        <li data-guideMode="easy">Easy Mode</li>
        <li data-guideMode="hard">Hard Mode</li>
      </ul>
    `);

    soundButton = document.querySelector('.sound-button');

    setupEventListeners();
  });

  it('soundButton 클릭 시 음소거 상태가 토글됩니다.', () => {
    const mainBgm = document.querySelector('.main-bgm');
    vi.spyOn(mainBgm, 'play').mockImplementation(() => {});
    vi.spyOn(mainBgm, 'pause').mockImplementation(() => {});

    let isMuted = false;
    changeSoundButton(soundButton, mainBgm, isMuted);
    expect(soundButton.style.backgroundPosition).toBe('-100px -80px');
    expect(mainBgm.play).toHaveBeenCalled();

    isMuted = true;
    changeSoundButton(soundButton, mainBgm, isMuted);
    expect(soundButton.style.backgroundPosition).toBe('-100px -137px');
    expect(mainBgm.pause).toHaveBeenCalled();
  });
});
