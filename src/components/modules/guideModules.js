import { guideSteps } from '../../constants/guide';
import { goToSlide } from './guideSlide';

let nowStep = 0;

const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode');
const isGuideMode = Boolean(mode);
const guideStep = guideSteps[mode];
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
