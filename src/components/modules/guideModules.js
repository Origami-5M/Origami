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
  unfoldButton.disabled = !guideStep[nowStep]?.unfold;
};

const updateStep = step => {
  nowStep += step;
  goToSlide(nowStep);
  checkUnfoldButtons();
  changeBorderVertices();
};

const updateZPosition = vertex => {
  const { z } = vertex;

  const updateVertexZ = (range, values) => {
    const [min, max] = range;
    const [newZ] = values;

    if (z > min && z < max) {
      vertex.z = newZ;
    }
  };

  switch (nowStep) {
    case 4:
    case 5:
      vertex.z = z >= 0.03 ? 0.02 : 0.04;
      break;
    case 6:
      updateVertexZ([0, 0.03], [0.06]);
      updateVertexZ([0.03, 0.05], [0.04]);
      updateVertexZ([0.05, 1], [0.02]);
      break;
    case 7:
      updateVertexZ([-Infinity, 0.01], [-0.02]);
      updateVertexZ([0.01, 0.03], [-0.04]);
      updateVertexZ([0.03, 0.05], [-0.06]);
      updateVertexZ([0.05, 0.07], [-0.08]);
      updateVertexZ([0.07, Infinity], [-0.1]);
      stepVertex.stepVertex8.push(vertex);
      break;
    case 8:
      updateVertexZ([-Infinity, 0.01], [0.1]);
      updateVertexZ([0.01, 0.03], [0.08]);
      updateVertexZ([0.03, 0.05], [0.06]);
      updateVertexZ([0.05, 0.07], [0.04]);
      updateVertexZ([0.07, 0.09], [0.01]);
      stepVertex.stepVertex9.push(vertex);
      break;
    case 9:
      updateVertexZ([-0.03, -0.01], [-0.1]);
      updateVertexZ([-0.05, -0.03], [-0.08]);
      updateVertexZ([-0.07, -0.05], [-0.06]);
      updateVertexZ([-0.09, -0.07], [-0.04]);
      updateVertexZ([-Infinity, -0.09], [-0.02]);
      stepVertex.stepVertex10.push(vertex);
      break;
    default:
      break;
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
