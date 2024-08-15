const soundButton = document.querySelector('.sound-button');
const mainBgm = document.querySelector('.main-bgm');

const sandboxModeButton = document.getElementById('sandboxMode');
const guideModeButton = document.getElementById('guideMode');
const modeModal = document.querySelector('.mode-blur-bg');

const guideModeBox = document.querySelector('.guide-mode-box');
const startButton = document.querySelector('.big-start-button');

let isMuted = false;

const toggleSoundButton = isMuted => {
  if (isMuted) {
    soundButton.style.backgroundPosition = '-66px -108px';
    mainBgm.pause();
  } else {
    soundButton.style.backgroundPosition = '-130px -108px';
    mainBgm.play();
  }
};

const handleModeButtonClick = (clickedButton, otherButton) => {
  clickedButton.classList.add('active');
  otherButton.classList.remove('active');
};

const removeCheckIcon = buttons => {
  buttons.forEach(button => {
    button.classList.remove('active');
    const checkIcon = button.querySelector('.check-icon');
    if (checkIcon) {
      button.removeChild(checkIcon);
    }
  });
};

const addCheckIcon = button => {
  button.classList.add('active');

  const checkIcon = document.createElement('div');
  checkIcon.classList.add('check-icon');

  button.appendChild(checkIcon);
};

const navigateToPlay = () => {
  const activeGuideModeButton = document.querySelector('.guide-mode.active');
  if (!modeModal.classList.contains('hidden')) {
    const guideMode = activeGuideModeButton.getAttribute('data-mode');
    let url = new URL(`${window.location.origin}/play`);
    let params = new URLSearchParams(url.search);

    params.append('mode', guideMode);
    url.search = params.toString();

    window.location.href = url.toString();
  } else {
    window.location.href = '/play';
  }
};

const setupEventListeners = () => {
  if (soundButton) {
    soundButton.addEventListener('click', () => {
      isMuted = !isMuted;
      toggleSoundButton(isMuted);
    });
  }

  if (sandboxModeButton) {
    sandboxModeButton.addEventListener('click', () => {
      handleModeButtonClick(sandboxModeButton, guideModeButton);
      modeModal.classList.add('hidden');
    });
  }

  if (guideModeButton) {
    guideModeButton.addEventListener('click', () => {
      handleModeButtonClick(guideModeButton, sandboxModeButton);
      modeModal.classList.remove('hidden');
    });
  }

  if (guideModeBox) {
    guideModeBox.addEventListener('click', event => {
      const guideModeButtons = document.querySelectorAll('.guide-mode');
      const guideModeButton = event.target.closest('.guide-mode');

      removeCheckIcon(guideModeButtons);
      addCheckIcon(guideModeButton);
    });
  }

  if (startButton) {
    startButton.addEventListener('click', navigateToPlay);
  }
};

document.addEventListener('DOMContentLoaded', setupEventListeners);

export {
  toggleSoundButton,
  handleModeButtonClick,
  addCheckIcon,
  removeCheckIcon,
};
