import { guideImages } from '../constants/guide';
import {
  currentIdx,
  moveSlide,
  updateSlideButtons,
} from './modules/guideSlide';
import { showToastMessage } from './modules/showToastMessage';
import { TOAST_MESSAGE } from '../constants';

const urlParams = new URLSearchParams(window.location.search);
const guideMode = urlParams.get('mode');

const guideWrap = document.querySelector('.guide-wrap');
const slider = guideWrap.querySelector('.slider');
const prevButton = guideWrap.querySelector('.prev');
const nextButton = guideWrap.querySelector('.next');
const paginationText = guideWrap.querySelector('.pagination-text');
const shareButton = document.querySelector('.share-button');
const userNameInput = document.querySelector('.complete-input');

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

const regex = /\S/;
shareButton.addEventListener('click', event => {
  event.preventDefault();

  const userName = userNameInput.value;
  if (!regex.test(userName)) {
    showToastMessage(TOAST_MESSAGE.NO_NICKNAME);
  } else {
    window.location.href = `/gallery`;
  }
});
