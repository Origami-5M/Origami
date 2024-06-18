const $soundButton = document.querySelector('.sound-button');
const $mainBgm = document.querySelector('.main-bgm');
let isMute = false;

const changeSoundButton = isMute => {
  if (isMute) {
    $soundButton.style.backgroundPosition = '-66px -108px';
    $mainBgm.pause();
  } else {
    $soundButton.style.backgroundPosition = '-130px -108px';
    $mainBgm.play();
  }
};

$soundButton.addEventListener('click', () => {
  isMute = !isMute;
  changeSoundButton(isMute);
});
