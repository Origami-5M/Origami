import { GUIDE_STEPS } from '../../constants/guide';
import { changeBorderVertices } from './makeVertices';
import { goToSlide } from './guideSlide';

let nowStep = 0;

const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode');
const isGuideMode = Boolean(mode);
const guideStep = GUIDE_STEPS[mode];
const unfoldButton = document.querySelector('#unfoldButton');
const stepPlaneVertex = {
  stepVertex8: [],
  stepVertex9: [],
  stepVertex10: [],
};
const stepPuppyVertex = {
  stepVertex1: [],
};
const checkUnfoldButtons = () => {
  unfoldButton.disabled = !guideStep[nowStep].unfold;
};

const updateStep = step => {
  const newStep = nowStep + step;

  if (newStep >= 0 && newStep < guideStep.length) {
    nowStep = newStep;
    goToSlide(nowStep);
    checkUnfoldButtons();
    changeBorderVertices(guideStep[nowStep].points);
  }
};

const updateZPosition = vertex => {
  const { z } = vertex;
  if (mode === 'plane') {
    if (nowStep === 4 || nowStep === 5) {
      vertex.z = z >= 0.03 ? 0.02 : 0.04;
    } else if (nowStep === 6) {
      if (z >= 0.01 && z < 0.03) {
        vertex.z = 0.08;
      } else if (z >= 0.03 && z < 0.05) {
        vertex.z = 0.06;
      } else if (z >= 0.05 && z < 0.07) {
        vertex.z = 0.04;
      }
    } else if (nowStep === 7) {
      if (z > -0.05 && z < -0.03) {
        vertex.z = 0.01;
      } else if (z >= -0.03 && z < -0.01) {
        vertex.z = -0.01;
      } else if (z >= -0.01 && z < 0.01) {
        vertex.z = -0.03;
      } else if (z >= 0.01 && z < 0.03) {
        vertex.z = -0.05;
      } else if (z >= 0.03 && z < 0.05) {
        vertex.z = -0.07;
      } else if (z >= 0.05 && z < 0.07) {
        vertex.z = -0.09;
      }
      stepPlaneVertex.stepVertex8.push(vertex);
    } else if (nowStep === 8) {
      if (z >= 0.01 && z < 0.03) {
        vertex.z = 0.08;
      } else if (z >= 0.03 && z < 0.05) {
        vertex.z = 0.06;
      } else if (z >= 0.05 && z < 0.07) {
        vertex.z = 0.04;
      }
      stepPlaneVertex.stepVertex9.push(vertex);
    } else if (nowStep === 9) {
      if (z <= -0.01 && z > -0.03) {
        vertex.z = -0.1;
      } else if (z <= 0.03 && z > -0.05) {
        vertex.z = -0.08;
      } else if (z <= 0.05 && z > -0.07) {
        vertex.z = -0.06;
      } else if (z <= 0.07 && z > -0.09) {
        vertex.z = -0.04;
      } else if (z <= 0.09 && z > -0.11) {
        vertex.z = -0.02;
      }
      stepPlaneVertex.stepVertex10.push(vertex);
    }
  } else if (mode === 'puppy') {
    if (nowStep === 1) {
      if (z >= 0.01 && z < 0.03) {
        vertex.z = 0.04;
      } else if (z >= 0.03 && z < 0.05) {
        vertex.z = 0.02;
      }
      stepPuppyVertex.stepVertex1.push(vertex);
    } else {
      if (nowStep === 3 || nowStep === 4) {
        if (z > -Infinity && z < 0.01) {
          vertex.z = 0.06;
        } else if (z >= 0.01 && z < 0.03) {
          vertex.z = 0.04;
        } else if (z >= 0.03 && z < 0.05) {
          vertex.z = 0.02;
        } else if (z >= 0.05 && z < 0.07) {
          vertex.z = 0.02;
        }
      }
    }
  }
  return vertex;
};

export {
  mode,
  nowStep,
  isGuideMode,
  guideStep,
  updateStep,
  updateZPosition,
  stepPlaneVertex,
};
