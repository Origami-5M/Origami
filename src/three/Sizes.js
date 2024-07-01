const playCont = document.querySelector('.play-cont');
const modalCont = document.querySelector('.detail-scene');

let sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const modalSizes = {
  width: 250,
  height: 250,
};

if (playCont) {
  const playContRect = playCont.getBoundingClientRect();
  sizes = {
    width: playContRect.width,
    height: playContRect.height,
  };
} else if (modalCont) {
  sizes = {
    width: modalSizes.width,
    height: modalSizes.height,
  };
} else {
  console.error('Neither .play-cont nor .detail-scene element found');
}

export { sizes };
