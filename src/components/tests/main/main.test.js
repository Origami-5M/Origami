import { describe, it, expect, beforeEach, vi } from 'vitest';

const setupDOM = html => {
  document.body.innerHTML = html;
};

const importModule = async () => {
  const module = await import('../../main.js');
  return module;
};

describe('toggleSoundButton', () => {
  let toggleSoundButton, soundButton, mainBgm;

  beforeEach(async () => {
    setupDOM(`
      <div class="sound-button" style="background-position: -66px -108px;"></div>
      <audio class="main-bgm"></audio>
    `);

    const module = await importModule();
    toggleSoundButton = module.toggleSoundButton;
    soundButton = document.querySelector('.sound-button');
    mainBgm = document.querySelector('.main-bgm');

    vi.spyOn(mainBgm, 'play').mockImplementation(() => {});
    vi.spyOn(mainBgm, 'pause').mockImplementation(() => {});
  });

  it('sound 버튼을 클릭하면 mute가 토글됩니다.', () => {
    toggleSoundButton(true);
    expect(soundButton.style.backgroundPosition).toBe('-66px -108px');
    expect(mainBgm.pause).toHaveBeenCalledTimes(1);

    toggleSoundButton(false);
    expect(soundButton.style.backgroundPosition).toBe('-130px -108px');
    expect(mainBgm.play).toHaveBeenCalledTimes(1);
  });
});

describe('handleModeButtonClick', () => {
  let handleModeButtonClick, sandboxModeButton, guideModeButton;

  beforeEach(async () => {
    setupDOM(`
      <button id="sandboxMode" class="mode-button">Sandbox</button>
      <button id="guideMode" class="mode-button">Guide</button>
    `);

    const module = await importModule();
    handleModeButtonClick = module.handleModeButtonClick;
    sandboxModeButton = document.getElementById('sandboxMode');
    guideModeButton = document.getElementById('guideMode');
  });

  it('클릭된 버튼에 "active" 클래스를 추가하고 다른 버튼에서는 제거해야 합니다.', () => {
    handleModeButtonClick(sandboxModeButton, guideModeButton);
    expect(sandboxModeButton.classList.contains('active')).toBe(true);
    expect(guideModeButton.classList.contains('active')).toBe(false);

    handleModeButtonClick(guideModeButton, sandboxModeButton);
    expect(guideModeButton.classList.contains('active')).toBe(true);
    expect(sandboxModeButton.classList.contains('active')).toBe(false);
  });
});

describe('removeCheckIcon and addCheckIcon', () => {
  let removeCheckIcon, addCheckIcon;

  beforeEach(async () => {
    setupDOM(`
      <button class="guide-mode">
        <div class="check-icon"></div>
      </button>
      <button class="guide-mode"></button>
    `);

    const module = await importModule();
    removeCheckIcon = module.removeCheckIcon;
    addCheckIcon = module.addCheckIcon;
  });

  it('모든 버튼에서 "check-icon"을 제거해야 합니다.', () => {
    const buttons = document.querySelectorAll('.guide-mode');
    removeCheckIcon(buttons);
    buttons.forEach(button => {
      expect(button.querySelector('.check-icon')).toBe(null);
    });
  });

  it('주어진 버튼에 "check-icon"을 추가해야 합니다.', () => {
    const button = document.querySelector('.guide-mode');
    addCheckIcon(button);
    expect(button.querySelector('.check-icon')).not.toBe(null);
  });
});
