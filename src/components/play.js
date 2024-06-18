const infoButton = document.querySelector('.info-button');
const modeLists = document.querySelectorAll('.mode-list li');
const sidebarToggleButton = document.querySelector('.mode-button');
const modeSidebar = document.querySelector('.mode-sidebar');
const homeButton = document.querySelector('.home-button');
const finishButton = document.querySelector('.finish-button');
const urlParams = new URLSearchParams(window.location.search);
const guideMode = urlParams.get('guideMode');
const soundButton = document.querySelector('.sound-button');
const mainBgm = document.querySelector('.main-bgm');
let isMute = false;

const toggleInfo = () => {
  const infoWrap = document.querySelector('.info-wrap');
  infoWrap.classList.toggle('visible');
  infoButton.classList.toggle('active');
};

const checkList = event => {
  modeLists.forEach(item => {
    if (item !== event.currentTarget) {
      item.classList.remove('active');
    }
  });

  event.currentTarget.classList.toggle('active');
};

modeLists.forEach(item => {
  if (item.getAttribute('data-guideMode') === guideMode) {
    item.classList.add('hidden');
  }
});

infoButton.addEventListener('click', toggleInfo);
modeLists.forEach(item => {
  item.addEventListener('click', checkList);
});

homeButton.addEventListener('click', () => {
  window.location.href = `origami/`;
});

finishButton.addEventListener('click', () => {
  // 완료 기능 구현 필요
  console.log('Finish button clicked');
});

sidebarToggleButton.addEventListener('click', event => {
  sidebarToggleButton.classList.toggle('active');
  modeSidebar.classList.toggle('visible');
  event.stopPropagation();
});

document.addEventListener('click', event => {
  if (
    !event.target.closest('.mode-sidebar') &&
    !event.target.closest('.mode-button')
  ) {
    modeSidebar.classList.remove('visible');
    sidebarToggleButton.classList.remove('active');
  }
});

const changeSoundButton = isMute => {
  if (isMute) {
    soundButton.style.backgroundPosition = '-100px -137px';
    mainBgm.pause();
  } else {
    soundButton.style.backgroundPosition = '-100px -80px';
    mainBgm.play();
  }
};

soundButton.addEventListener('click', () => {
  isMute = !isMute;
  changeSoundButton(isMute);
});
