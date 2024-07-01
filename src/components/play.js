import html2canvas from 'html2canvas';

import { showToastMessage } from './modules/showToastMessage';
import { TOAST_MESSAGE } from '../constants';
import { GUIDE_IMAGES, CHUNK_SIZE } from '../constants/guide';
import {
  currentIdx,
  moveSlide,
  updateSlideButtons,
} from './modules/guideSlide';
import { saveUserInfo } from './services/userService';
import { isGuideMode } from './modules/guideModules';

import { paper } from '../three/Paper';

const finishCanvas = document.querySelector('.finish-canvas');
const userNameInput = document.querySelector('.complete-input');
const shareButton = document.querySelector('.share-button');

const urlParams = new URLSearchParams(window.location.search);
const guideMode = urlParams.get('mode');

const guideWrap = document.querySelector('.guide-wrap');
const slider = guideWrap.querySelector('.slider');
const prevButton = guideWrap.querySelector('.prev');
const nextButton = guideWrap.querySelector('.next');
const paginationText = guideWrap.querySelector('.pagination-text');

let slideList = 0;
let sliderWidth = 160;

if (guideMode) {
  guideWrap.classList.remove('none');

  GUIDE_IMAGES[guideMode].forEach((src, i) => {
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
  event.preventDefault();
  if (event.target.matches('.restart-button')) {
    if (isGuideMode) {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const mode = urlParams.get('mode');

      window.location.href = `/play?mode=${mode}`;
    } else {
      window.location.reload();
    }
  }
});

prevButton.addEventListener('click', moveSlide);
nextButton.addEventListener('click', moveSlide);

const captureThumbnail = async element => {
  const canvas = await html2canvas(element, {
    useCORS: true,
    logging: true,
    allowTaint: true,
  });
  return canvas.toDataURL('image/png');
};

const chunkArray = (array, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

shareButton.addEventListener('click', async event => {
  event.preventDefault();
  const regex = /\S/;
  const userName = userNameInput.value;

  if (!regex.test(userName)) {
    showToastMessage(TOAST_MESSAGE.NO_NICKNAME);
    return;
  }

  try {
    const origamiPositions = Array.from(
      paper.geometry.attributes.position.array
    );
    const origamiChunks = chunkArray(origamiPositions, CHUNK_SIZE);

    const thumbnailURL = await captureThumbnail(finishCanvas);
    const userId = await saveUserInfo(userName, thumbnailURL, origamiChunks);

    window.location.href = `/gallery?id=${userId}`;
  } catch (error) {
    showToastMessage(TOAST_MESSAGE.ERROR_SAVE, error);
  }
});
