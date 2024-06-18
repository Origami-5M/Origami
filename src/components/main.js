const $soundButton = document.querySelector('.sound-button');
const $mainBgm = document.querySelector('.main-bgm');

const $sandboxModeButton = document.getElementById('sandboxMode');
const $guideModeButton = document.getElementById('guideMode');
const $modeModal = document.querySelector('.mode-blur-bg');

const $guideModeBox = document.querySelector('.guide-mode-box');

let isMuted = false;

const toggleSoundButton = isMuted => {
  if (isMuted) {
    $soundButton.style.backgroundPosition = '-66px -108px';
    $mainBgm.pause();
  } else {
    $soundButton.style.backgroundPosition = '-130px -108px';
    $mainBgm.play();
  }
};

$soundButton.addEventListener('click', () => {
  isMuted = !isMuted;
  toggleSoundButton(isMuted);
});

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

$sandboxModeButton.addEventListener('click', () => {
  handleModeButtonClick($sandboxModeButton, $guideModeButton);
  $modeModal.style.opacity = '0';
});

$guideModeButton.addEventListener('click', () => {
  handleModeButtonClick($guideModeButton, $sandboxModeButton);
  $modeModal.style.opacity = '1';
});

$guideModeBox.addEventListener('click', event => {
  const $guideModeButtons = document.querySelectorAll('.guide-mode');
  const $guideModeButton = event.target.closest('.guide-mode');

  removeCheckIcon($guideModeButtons);
  addCheckIcon($guideModeButton);
});
