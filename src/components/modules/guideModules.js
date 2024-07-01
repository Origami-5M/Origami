import { GUIDE_STEPS } from '../../constants/guide';
import { changeBorderVertices } from './makeVertices';
import { goToSlide } from './guideSlide';

let nowStep = 0;

const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode');
const isGuideMode = Boolean(mode);
const guideStep = GUIDE_STEPS[mode];
const unfoldButton = document.querySelector('#unfoldButton');
const stepVertex8 = [];
const stepVertex9 = [];
const stepVertex10 = [];

const checkUnfoldButtons = () => {
  unfoldButton.disabled = !guideStep[nowStep]?.unfold;
};

const updateStep = step => {
  nowStep += step;
  goToSlide(nowStep);
  checkUnfoldButtons();
  changeBorderVertices();
};

const updateZPosition = vertex => {
  if (nowStep === 4 || nowStep === 5) {
    if (vertex.z >= 0.03) {
      vertex.z = 0.02;
    } else {
      vertex.z = 0.04;
    }
  } else if (nowStep === 6) {
    if (vertex.z < 0.03) {
      vertex.z = 0.06;
    } else if (vertex.z > 0.03 && vertex.z < 0.05) {
      vertex.z = 0.04;
    } else {
      vertex.z = 0.02;
    }
  } else if (nowStep === 7) {
    if (vertex.z < 0.01) {
      vertex.z = -0.02;
    } else if (vertex.z > 0.01 && vertex.z < 0.03) {
      vertex.z = -0.04;
    } else if (vertex.z > 0.03 && vertex.z < 0.05) {
      vertex.z = -0.06;
    } else if (vertex.z > 0.05 && vertex.z < 0.07) {
      vertex.z = -0.08;
    } else {
      vertex.z = -0.1;
    }
    stepVertex8.push(vertex);
  } else if (nowStep === 8) {
    if (vertex.z < 0.01) {
      vertex.z = 0.1;
    } else if (vertex.z > 0.01 && vertex.z < 0.03) {
      vertex.z = 0.08;
    } else if (vertex.z > 0.03 && vertex.z < 0.05) {
      vertex.z = 0.06;
    } else if (vertex.z > 0.05 && vertex.z < 0.07) {
      vertex.z = 0.04;
    } else if (vertex.z > 0.07 && vertex.z < 0.09) {
      vertex.z = -0.02;
    }

    stepVertex9.push(vertex);
  } else if (nowStep === 9) {
    if (vertex.z < -0.01 && vertex.z > -0.03) {
      vertex.z = -0.1;
    } else if (vertex.z < -0.03 && vertex.z > -0.05) {
      vertex.z = -0.08;
    } else if (vertex.z < -0.05 && vertex.z > -0.07) {
      vertex.z = -0.06;
    } else if (vertex.z < -0.07 && vertex.z > -0.09) {
      vertex.z = -0.04;
    } else {
      vertex.z = -0.02;
    }
    stepVertex10.push(vertex);
  }

  return vertex;
};

export {
  nowStep,
  isGuideMode,
  guideStep,
  updateStep,
  updateZPosition,
  stepVertex8,
  stepVertex9,
  stepVertex10,
};
