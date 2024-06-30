import { GUIDE_STEPS } from '../../constants/guide';
import { changeBorderVertices } from './makeVertices';
import { goToSlide } from './guideSlide';

let nowStep = 0;

const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode');
const isGuideMode = Boolean(mode);
const guideStep = GUIDE_STEPS[mode];
const unfoldButton = document.querySelector('#unfoldButton');

const checkUnfoldButtons = () => {
  unfoldButton.disabled = !guideStep[nowStep].unfold;
};

const updateStep = step => {
  nowStep += step;
  goToSlide(nowStep);
  checkUnfoldButtons();
};

export { nowStep, isGuideMode, guideStep, updateStep };
