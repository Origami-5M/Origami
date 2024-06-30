import { guideImages } from '../constants/guide';
import {
  currentIdx,
  moveSlide,
  updateSlideButtons,
} from './modules/guideSlide';

const urlParams = new URLSearchParams(window.location.search);
const guideMode = urlParams.get('mode');

const guideWrap = document.querySelector('.guide-wrap');
const slider = guideWrap.querySelector('.slider');
const prevButton = guideWrap.querySelector('.prev');
const nextButton = guideWrap.querySelector('.next');
const paginationText = guideWrap.querySelector('.pagination-text');
const shareButton = document.querySelector('.share-button');
const section = document.querySelector('section');
const completeCont = document.querySelector('.complete-cont');
const shareCont = document.querySelector('.share-modal');
const deleteButton = document.querySelector('.close-button');

let slideList = 0;
let sliderWidth = 160;

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

document.body.addEventListener('click', event => {
  if (event.target.matches('.restart-button')) {
    window.location.reload();
  }
});

prevButton.addEventListener('click', moveSlide);
nextButton.addEventListener('click', moveSlide);

const navigateToShare = () => {
  window.location.href = '/gallery';
};

shareButton.addEventListener('click', navigateToShare);

const shareModalOn = () => {
  section.classList.add('active');
  completeCont.classList.add('none');
  shareCont.classList.remove('none');
};

const closeModal = () => {
  section.classList.remove('active');
  shareCont.classList.remove('none');
};

shareButton.addEventListener('click', shareModalOn);
deleteButton.addEventListener('click', closeModal);
