const homeButton = document.querySelector('.home-button');
const sidebarToggleButton = document.querySelector('.mode-button');
const galleryButton = document.querySelector('.gallery-button');
const infoButton = document.querySelector('.info-button');
const soundButton = document.querySelector('.sound-button');

const modeSidebar = document.querySelector('.mode-sidebar');
const modeLists = document.querySelectorAll('.mode-list li');

const mainBgm = document.querySelector('.main-bgm');

const urlParams = new URLSearchParams(window.location.search);
const guideMode = urlParams.get('mode');

let isMuted = false;

const toggleInfo = () => {
  const infoWrap = document.querySelector('.info-wrap');
  infoWrap.classList.toggle('visible');
  infoButton.classList.toggle('active');
};

const checkList = event => {
  modeLists.forEach(item => {
    if (item !== event.currentTarget) {
      item.classList.remove('active');
    } else {
      if (event.currentTarget.hasAttribute('data-guideMode')) {
        let url = new URL(`${window.location.origin}/play`);
        let params = new URLSearchParams(url.search);
        const selectGuideMode =
          event.currentTarget.getAttribute('data-guideMode');
        params.append('mode', selectGuideMode);
        url.search = params.toString();
        window.location.href = url.toString();
      }
    }
  });

  event.currentTarget.classList.toggle('active');
};

modeLists.forEach(item => {
  if (item.getAttribute('data-guideMode') === guideMode) {
    item.classList.add('none');
  }
});

infoButton.addEventListener('click', toggleInfo);
modeLists.forEach(item => {
  item.addEventListener('click', checkList);
});

homeButton.addEventListener('click', () => {
  window.location.href = `/`;
});

sidebarToggleButton.addEventListener('click', event => {
  sidebarToggleButton.classList.toggle('active');
  modeSidebar.classList.toggle('visible');
  event.stopPropagation();
});

galleryButton.addEventListener('click', () => {
  window.location.href = `/gallery`;
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

const changeSoundButton = isMuted => {
  if (isMuted) {
    soundButton.style.backgroundPosition = '-100px -137px';
    mainBgm.pause();
  } else {
    soundButton.style.backgroundPosition = '-100px -80px';
    mainBgm.play();
  }
};

soundButton.addEventListener('click', () => {
  isMuted = !isMuted;
  changeSoundButton(isMuted);
});
