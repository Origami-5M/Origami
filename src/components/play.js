const homeButton = document.querySelector('.home-button');
const sidebarToggleButton = document.querySelector('.mode-button');
const infoButton = document.querySelector('.info-button');
const soundButton = document.querySelector('.sound-button');

const modeSidebar = document.querySelector('.mode-sidebar');
const modeLists = document.querySelectorAll('.mode-list li');

const mainBgm = document.querySelector('.main-bgm');

const urlParams = new URLSearchParams(window.location.search);
const guideMode = urlParams.get('guideMode');

const guideWrap = document.querySelector('.guide-wrap');
const slider = guideWrap.querySelector('.slider');
const slideList = slider.querySelectorAll('li');
const prevButton = guideWrap.querySelector('.prev');
const nextButton = guideWrap.querySelector('.next');

const paginationText = guideWrap.querySelector('.pagination-text');
const listWidth = 210;
const sliderWidth = 210 * slideList.length;

let currentIdx = 0;
let translate = 0;
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
    }
  });

  event.currentTarget.classList.toggle('active');
};

modeLists.forEach(item => {
  if (item.getAttribute('data-guideMode') === guideMode) {
    item.classList.add('hidden');
  }
});

if (guideMode) {
  guideWrap.classList.remove('hidden');
}

infoButton.addEventListener('click', toggleInfo);
modeLists.forEach(item => {
  item.addEventListener('click', checkList);
});

homeButton.addEventListener('click', () => {
  window.location.href = `/`;
});

document.body.addEventListener('click', event => {
  if (event.target.matches('.restart-button')) {
    window.location.href = `/`;
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

slider.style.width = `${sliderWidth}px`;

function updateSlideButtons() {
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
}

function moveSlide(event) {
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
}

function goToSlide(index) {
  translate = -listWidth * index;
  slider.style.transform = `translateX(${translate}px)`;
  currentIdx = index;

  paginationText.textContent = `${currentIdx + 1} / ${slideList.length}`;
  updateSlideButtons();
}

paginationText.textContent = `${currentIdx + 1} / ${slideList.length}`;
updateSlideButtons();

prevButton.addEventListener('click', moveSlide);
nextButton.addEventListener('click', moveSlide);
