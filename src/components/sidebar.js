const homeButton = document.querySelector('.home-button');
const sidebarToggleButton = document.querySelector('.mode-button');
const galleryButton = document.querySelector('.gallery-button');
const infoButton = document.querySelector('.info-button');
const infoWrap = document.querySelector('.info-wrap');
const soundButton = document.querySelector('.sound-button');

const modeSidebar = document.querySelector('.mode-sidebar');
const modeLists = document.querySelectorAll('.mode-list li');

const mainBgm = document.querySelector('.main-bgm');

const urlParams = new URLSearchParams(window.location.search);
const guideMode = urlParams.get('mode');

let isMuted = false;

const toggleInfo = () => {
  infoWrap.classList.toggle('visible');
  infoButton.classList.toggle('active');
};

export const navigateToPlayPage = mode => {
  let url = new URL(`${window.location.origin}/play`);
  let params = new URLSearchParams(url.search);
  params.append('mode', mode);
  url.search = params.toString();
  window.location.assign(url.toString());
};

export const checkList = event => {
  const modeLists = document.querySelectorAll('.mode-list li');
  modeLists.forEach(item => {
    if (item !== event.currentTarget) {
      item.classList.remove('active');
    } else {
      if (event.currentTarget.hasAttribute('data-guideMode')) {
        const selectGuideMode =
          event.currentTarget.getAttribute('data-guideMode');
        navigateToPlayPage(selectGuideMode);
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

export const changeSoundButton = (soundButton, mainBgm, isMuted) => {
  if (isMuted) {
    soundButton.style.backgroundPosition = '-100px -137px';
    mainBgm.pause();
  } else {
    soundButton.style.backgroundPosition = '-100px -80px';
    mainBgm.play();
  }
};

export const setupEventListeners = () => {
  if (infoButton) {
    infoButton.addEventListener('click', toggleInfo);
  }
  if (modeLists.length) {
    modeLists.forEach(item => {
      item.addEventListener('click', checkList);
    });
  }
  if (homeButton) {
    homeButton.addEventListener('click', () => {
      window.location.href = `/`;
    });
  }
  if (sidebarToggleButton && modeSidebar) {
    sidebarToggleButton.addEventListener('click', event => {
      sidebarToggleButton.classList.toggle('active');
      modeSidebar.classList.toggle('visible');
      event.stopPropagation();
    });
  }
  if (galleryButton) {
    galleryButton.addEventListener('click', () => {
      window.location.href = `/gallery`;
    });
  }
  if (soundButton) {
    soundButton.addEventListener('click', () => {
      isMuted = !isMuted;
      changeSoundButton(soundButton, mainBgm, isMuted);
    });
  }
  document.addEventListener('click', event => {
    if (
      !event.target.closest('.mode-sidebar') &&
      !event.target.closest('.mode-button')
    ) {
      if (modeSidebar) {
        modeSidebar.classList.remove('visible');
      }
      if (sidebarToggleButton) {
        sidebarToggleButton.classList.remove('active');
      }
    }

    if (
      !event.target.closest('.info-wrap') &&
      !event.target.closest('.info-button')
    ) {
      if (infoWrap) {
        infoWrap.classList.remove('visible');
      }
      if (infoButton) {
        infoButton.classList.remove('active');
      }
    }
  });
};

document.addEventListener('DOMContentLoaded', setupEventListeners);
