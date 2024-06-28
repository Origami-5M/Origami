import { guideSteps } from '../../constants/guide';
import { changeBorderVertices } from './makeVertices';
import { goToSlide } from './guideSlide';

let nowStep = 0;

const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode');
const isGuideMode = Boolean(mode);
const guideStep = guideSteps[mode];

const updateStep = step => {
  nowStep += step;
  goToSlide(nowStep);
  changeBorderVertices(guideStep[nowStep].points);
};

export { nowStep, isGuideMode, guideStep, updateStep };
