import { GUIDE_IMAGES } from '../../constants/guide';

const urlParams = new URLSearchParams(window.location.search);
const guideMode = urlParams.get('mode');

const guideWrap = document.querySelector('.guide-wrap');
const prevButton = guideWrap.querySelector('.prev');
const nextButton = guideWrap.querySelector('.next');
const slider = guideWrap.querySelector('.slider');
const paginationText = guideWrap.querySelector('.pagination-text');

const listWidth = 160;
let slideList = GUIDE_IMAGES[guideMode];
let translate = 0;
let currentIdx = 0;

const updateSlideButtons = () => {
  if (currentIdx === 0) {
    prevButton.classList.add('hidden');
  } else {
    prevButton.classList.remove('hidden');
  }

  if (currentIdx === slideList.length - 1) {
    nextButton.classList.add('hidden');
  } else {
    nextButton.classList.remove('hidden');
  }
};

const moveSlide = event => {
  event.preventDefault();

  if (event.target.className.includes('next')) {
    if (currentIdx !== slideList.length - 1) {
      goToSlide(currentIdx + 1);
    }
  } else if (event.target.className.includes('prev')) {
    if (currentIdx !== 0) {
      goToSlide(currentIdx - 1);
    }
  }

  updateSlideButtons();
};

const goToSlide = index => {
  translate = -listWidth * index;
  slider.style.transform = `translateX(${translate}px)`;

  if (typeof index == 'number') {
    currentIdx = index;
    paginationText.textContent = `${currentIdx + 1} / ${slideList.length}`;
  } else {
    paginationText.textContent = `${index[0] + 1} / ${slideList.length}`;
  }

  updateSlideButtons();
};

export { currentIdx, goToSlide, moveSlide, updateSlideButtons };
