const playCont = document.querySelector('.play-cont');
const finishCont = document.querySelector('.play-cont.active');

let sizes = {
  width: playCont.getBoundingClientRect().width,
  height: playCont.getBoundingClientRect().height,
};

let finishSizes = {
  width: finishCont?.getBoundingClientRect().width,
  height: finishCont?.getBoundingClientRect().height,
};
export { sizes, finishSizes };
