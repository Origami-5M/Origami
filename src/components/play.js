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
import {
  showLoadingSpinner,
  hideLoadingSpinner,
} from './modules/loadingSpinner';
import { paper } from '../three/Paper';

let finishCanvas,
  userNameInput,
  shareButton,
  guideWrap,
  slider,
  prevButton,
  nextButton,
  paginationText;
let slideList = 0;
let sliderWidth = 160;

const urlParams = new URLSearchParams(window.location.search);
const guideMode = urlParams.get('mode');

const initializeDOMElements = () => {
  finishCanvas = document.querySelector('.finish-canvas');
  userNameInput = document.querySelector('.complete-input');
  shareButton = document.querySelector('.share-button');
  guideWrap = document.querySelector('.guide-wrap');

  if (guideWrap) {
    slider = guideWrap.querySelector('.slider');
    prevButton = guideWrap.querySelector('.prev');
    nextButton = guideWrap.querySelector('.next');
    paginationText = guideWrap.querySelector('.pagination-text');
  }
};

const initializeGuideMode = () => {
  if (guideMode && guideWrap && slider) {
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

    if (paginationText) {
      paginationText.textContent = `${currentIdx + 1} / ${slideList.length}`;
    }
    updateSlideButtons();
  }
};

const handleRestartButton = event => {
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
};

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

const handleShareButton = async event => {
  event.preventDefault();
  const regex = /\S/;
  const userName = userNameInput.value;

  if (!regex.test(userName)) {
    showToastMessage(TOAST_MESSAGE.NO_NICKNAME);
    hideLoadingSpinner();
    return;
  }

  try {
    showLoadingSpinner();
    const origamiPositions = Array.from(
      paper.geometry.attributes.position.array
    );
    const origamiChunks = chunkArray(origamiPositions, CHUNK_SIZE);

    const thumbnailURL = await captureThumbnail(finishCanvas);
    const userId = await saveUserInfo(userName, thumbnailURL, origamiChunks);

    window.location.href = `/gallery?id=${userId}`;
  } catch (error) {
    showToastMessage(TOAST_MESSAGE.ERROR_SAVE, error);
  } finally {
    hideLoadingSpinner();
  }
};

const initializeEventListeners = () => {
  if (document.body) {
    document.body.addEventListener('click', handleRestartButton);
  }
  if (prevButton) {
    prevButton.addEventListener('click', moveSlide);
  }
  if (nextButton) {
    nextButton.addEventListener('click', moveSlide);
  }
  if (shareButton) {
    shareButton.addEventListener('click', handleShareButton);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeDOMElements();
    initializeGuideMode();
    initializeEventListeners();
  });
} else {
  initializeDOMElements();
  initializeGuideMode();
  initializeEventListeners();
}

export {
  initializeDOMElements,
  initializeGuideMode,
  handleRestartButton,
  captureThumbnail,
  chunkArray,
  handleShareButton,
  initializeEventListeners,
  finishCanvas,
  userNameInput,
  shareButton,
  guideMode,
  guideWrap,
  slider,
  prevButton,
  nextButton,
  paginationText,
  slideList,
  sliderWidth,
};
