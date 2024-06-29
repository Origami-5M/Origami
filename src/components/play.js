import { guideImages } from '../constants/guide';
import {
  currentIdx,
  moveSlide,
  updateSlideButtons,
} from './modules/guideSlide';

const homeButton = document.querySelector('.home-button');
const sidebarToggleButton = document.querySelector('.mode-button');
const infoButton = document.querySelector('.info-button');
const soundButton = document.querySelector('.sound-button');

const modeSidebar = document.querySelector('.mode-sidebar');
const modeLists = document.querySelectorAll('.mode-list li');

const mainBgm = document.querySelector('.main-bgm');

const urlParams = new URLSearchParams(window.location.search);
const guideMode = urlParams.get('mode');

const guideWrap = document.querySelector('.guide-wrap');
const slider = guideWrap.querySelector('.slider');
const prevButton = guideWrap.querySelector('.prev');
const nextButton = guideWrap.querySelector('.next');
const paginationText = guideWrap.querySelector('.pagination-text');

let slideList = 0;
let sliderWidth = 160;
let isMuted = false;

if (guideMode) {
  guideWrap.classList.remove('none');

  guideImages[guideMode].forEach((src, i) => {
    const li = document.createElement('li');
    const img = document.createElement('img');
    img.src = src;
    img.alt = `가이드 순서 ${i}`;
    li.appendChild(img);
    slider.appendChild(li);
  });

  slideList = slider.querySelectorAll('li');
  sliderWidth = 160 * slideList.length;

  slider.style.width = `${sliderWidth}px`;

  paginationText.textContent = `${currentIdx + 1} / ${slideList.length}`;
  updateSlideButtons();
}

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

document.body.addEventListener('click', event => {
  if (event.target.matches('.restart-button')) {
    window.location.reload();
  }
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

prevButton.addEventListener('click', moveSlide);
nextButton.addEventListener('click', moveSlide);
