import { GUIDE_STEPS } from '../../constants/guide';
import { changeBorderVertices } from './makeVertices';
import { goToSlide } from './guideSlide';

let nowStep = 0;

const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode');
const isGuideMode = Boolean(mode);
const guideStep = GUIDE_STEPS[mode];
const unfoldButton = document.querySelector('#unfoldButton');
const stepVertex = {
  stepVertex8: [],
  stepVertex9: [],
  stepVertex10: [],
};

const checkUnfoldButtons = () => {
  unfoldButton.disabled = !guideStep[nowStep].unfold;
};

const updateStep = step => {
  nowStep += step;
  goToSlide(nowStep);
  checkUnfoldButtons();
  changeBorderVertices();
};

const Z_VALUES = {
  STEP_4_5: { HIGH: 0.04, LOW: 0.02, THRESHOLD: 0.03 },
  STEP_6: [
    { CONDITION: z => z < 0.03, VALUE: 0.06 },
    { CONDITION: z => z > 0.03 && z < 0.05, VALUE: 0.04 },
    { CONDITION: () => true, VALUE: 0.02 },
  ],
  STEP_7: [
    { CONDITION: z => z < 0.01, VALUE: -0.02 },
    { CONDITION: z => z > 0.01 && z < 0.03, VALUE: -0.04 },
    { CONDITION: z => z > 0.03 && z < 0.05, VALUE: -0.06 },
    { CONDITION: z => z > 0.05 && z < 0.07, VALUE: -0.08 },
    { CONDITION: () => true, VALUE: -0.1 },
  ],
  STEP_8: [
    { CONDITION: z => z < 0.01, VALUE: 0.1 },
    { CONDITION: z => z > 0.01 && z < 0.03, VALUE: 0.08 },
    { CONDITION: z => z > 0.03 && z < 0.05, VALUE: 0.06 },
    { CONDITION: z => z > 0.05 && z < 0.07, VALUE: 0.04 },
    { CONDITION: z => z > 0.07 && z < 0.09, VALUE: -0.02 },
  ],
  STEP_9: [
    { CONDITION: z => z < -0.01 && z > -0.03, VALUE: -0.1 },
    { CONDITION: z => z < -0.03 && z > -0.05, VALUE: -0.08 },
    { CONDITION: z => z < -0.05 && z > -0.07, VALUE: -0.06 },
    { CONDITION: z => z < -0.07 && z > -0.09, VALUE: -0.04 },
    { CONDITION: () => true, VALUE: -0.02 },
  ],
};
const updateZPosition = vertex => {
  const updateVertexZ = conditions => {
    for (const { CONDITION, VALUE } of conditions) {
      if (CONDITION(vertex.z)) {
        vertex.z = VALUE;
        return vertex;
      }
    }
  };
  if (nowStep === 4 || nowStep === 5) {
    vertex.z =
      vertex.z >= Z_VALUES.STEP_4_5.THRESHOLD
        ? Z_VALUES.STEP_4_5.HIGH
        : Z_VALUES.STEP_4_5.LOW;
  } else if (nowStep === 6) {
    updateVertexZ(Z_VALUES.STEP_6);
  } else if (nowStep === 7) {
    updateVertexZ(Z_VALUES.STEP_7);
    stepVertex.stepVertex8.push(vertex);
  } else if (nowStep === 8) {
    updateVertexZ(Z_VALUES.STEP_8);
    stepVertex.stepVertex9.push(vertex);
  } else if (nowStep === 9) {
    updateVertexZ(Z_VALUES.STEP_9);
    stepVertex.stepVertex10.push(vertex);
  }
  return vertex;
};

export {
  nowStep,
  isGuideMode,
  guideStep,
  updateStep,
  updateZPosition,
  stepVertex,
};
