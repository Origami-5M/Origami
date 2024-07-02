import * as THREE from 'three';
import confetti from 'canvas-confetti';

import { sizes } from '../../three/Sizes';
import { camera, initializeCamera } from '../../three/Camera';
import { controls } from '../../three/Controls';
import { ambientLight, directionalLight } from '../../three/Lights';
import { paper } from '../../three/Paper';
import { renderer, finishRenderer } from '../../three/Renderer';

import { findClosestVertex } from './findClosestVertex';
import { calculateRotatedLine } from './axisCalculations';
import { foldingAnimation } from './foldingAnimation';
import {
  borderVertices,
  addVertices,
  changeBorderVertices,
} from './makeVertices';
import { getFoldingDirection } from './getFoldingDirection';
import { foldingVertexPosition, rotatedData } from './foldingVertexPosition';
import { prevFoldingArea } from './prevFoldingArea';
import {
  mode,
  nowStep,
  isGuideMode,
  guideStep,
  updateStep,
  stepPlaneVertex,
} from './guideModules';
import {
  rotateSelectedVertices,
  findAndSelectClosestVertices,
} from './rotateSelectedVertices';
import { makeDiamondPaper } from './makeDiamondPaper';
import { showToastMessage } from './showToastMessage';

import {
  checkActiveButtons,
  changeToPrevFold,
  changeToNextFold,
  onFoldChange,
} from './prevNextButtons';

import {
  DIAMETER,
  THRESHOLD,
  FRAMES,
  POINTS_MARKER_SIZE,
  POINTS_MARKER_COLOR,
  RED_MARKER_COLOR,
  TOAST_MESSAGE,
} from '../../constants';

const section = document.querySelector('section');
const playCont = document.querySelector('.play-cont');
const finishCont = document.querySelector('.complete-scene');
const finishButton = document.querySelector('.finish-button');
const completeCont = document.querySelector('.complete-cont');

const prevButton = document.querySelector('#prevButton');
const nextButton = document.querySelector('#nextButton');

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let isDragging = false;
let isFinished = false;
let areMarkersAtSamePosition = false;
let confettiIntervalId = 0;
let isAxisPoint = false;

let startVertex = {};
let hoverVertex = {};
let allVertex = paper.geometry.attributes.position;
let initialMousePosition = new THREE.Vector2();
let selectedVertices = new Set();

const scene = new THREE.Scene();

scene.add(paper);
scene.add(ambientLight);
scene.add(directionalLight);

if (isGuideMode) {
  changeBorderVertices(guideStep[nowStep].points);
  if (mode === 'puppy') {
    const angle = DIAMETER / 4;
    makeDiamondPaper(angle);
  }
}

const createPointsMarker = color => {
  const geometry = new THREE.SphereGeometry(POINTS_MARKER_SIZE, 16, 16);
  const material = new THREE.MeshBasicMaterial({ color });
  const marker = new THREE.Mesh(geometry, material);

  if (!isGuideMode) {
    marker.visible = false;
  }

  return marker;
};

const selectedVerticesInitializeSet = () => {
  selectedVertices = new Set();
};

const pointsMarker = createPointsMarker(POINTS_MARKER_COLOR);
const clickedRedMarker = createPointsMarker(RED_MARKER_COLOR);
scene.add(pointsMarker);
scene.add(clickedRedMarker);
clickedRedMarker.visible = false;

const updateSizesAndCamera = cont => {
  const rect = cont.getBoundingClientRect();
  sizes.width = rect.width;
  sizes.height = rect.height;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
};

const handleResize = () => {
  updateSizesAndCamera(playCont);
  renderer.setSize(sizes.width, sizes.height);

  if (isFinished) {
    updateSizesAndCamera(finishCont);
    finishRenderer.setSize(sizes.width, sizes.height);
  }
};

const handleMouseMove = event => {
  const rect = playCont.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / sizes.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / sizes.height) * 2 + 1;

  if (pointsMarker.visible && clickedRedMarker.visible) {
    updateFoldOnMouseMove(event);
  }
};

const updateClosestVertexHover = intersectionPoint => {
  const { closestVertex } = findClosestVertex(
    intersectionPoint,
    borderVertices
  );
  return closestVertex;
};

const updateFoldOnMouseMove = () => {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(paper);

  if (intersects.length > 0) {
    const intersectPoint = intersects[0].point;
    hoverVertex = updateClosestVertexHover(intersectPoint);

    if (hoverVertex) {
      const axisLines = calculateRotatedLine(
        scene,
        clickedRedMarker.position,
        hoverVertex,
        allVertex
      );

      const existingPolygon = scene.getObjectByName('foldedAreaPolygon');

      if (existingPolygon) {
        scene.remove(existingPolygon);
      }

      let startPoint = axisLines.axisPoints.startPoint;
      let endPoint = axisLines.axisPoints.endPoint;

      const direction = getFoldingDirection(
        startPoint,
        endPoint,
        clickedRedMarker.position
      );

      const currentFoldedArea = foldingVertexPosition(
        allVertex,
        startPoint,
        endPoint,
        direction,
        false
      );

      const foldedAreaPolygon = prevFoldingArea(currentFoldedArea);

      if (foldedAreaPolygon) {
        foldedAreaPolygon.name = 'foldedAreaPolygon';
        scene.add(foldedAreaPolygon);
      }
    }
  }
};

const handleMouseDown = event => {
  selectedVerticesInitializeSet();

  if (mode === 'plane') {
    if (nowStep === 1) {
      if (guideStep[nowStep].unfold) {
        const positions = rotatedData.face;

        if (positions) {
          findAndSelectClosestVertices(positions, allVertex, selectedVertices);
        }
      }
    } else if (nowStep === 10) {
      const positions = stepPlaneVertex.stepVertex9;
      findAndSelectClosestVertices(positions, allVertex, selectedVertices);
    } else if (nowStep === 11) {
      const positions = stepPlaneVertex.stepVertex10;
      findAndSelectClosestVertices(positions, allVertex, selectedVertices);
    } else if (!isGuideMode) {
      const positions = rotatedData.face;
      if (positions) {
        findAndSelectClosestVertices(positions, allVertex, selectedVertices);
      }
    }
  } else if (mode === 'puppy') {
    if (nowStep === 2) {
      if (guideStep[nowStep].unfold) {
        const positions = rotatedData.face;

        if (positions) {
          findAndSelectClosestVertices(positions, allVertex, selectedVertices);
        }
      }
    }
  }

  if (pointsMarker.visible) {
    initialMousePosition.set(event.clientX, event.clientY);
    isDragging = true;

    clickedRedMarker.position.copy(pointsMarker.position);
    clickedRedMarker.visible = true;
    pointsMarker.visible = false;
    controls.enabled = false;
  }

  const intersects = raycaster.intersectObject(paper);

  if (intersects.length > 0) {
    if (mode === 'plane') {
      if (nowStep === 1) {
        if (guideStep[nowStep].unfold) {
          const positions = rotatedData.face;

          if (positions) {
            findAndSelectClosestVertices(
              positions,
              allVertex,
              selectedVertices
            );
          }
        }
      } else if (nowStep === 10) {
        const positions = stepPlaneVertex.stepVertex9;
        findAndSelectClosestVertices(positions, allVertex, selectedVertices);
      } else if (nowStep === 11) {
        const positions = stepPlaneVertex.stepVertex10;
        findAndSelectClosestVertices(positions, allVertex, selectedVertices);
      } else if (!isGuideMode) {
        const positions = rotatedData.face;
        if (positions) {
          findAndSelectClosestVertices(positions, allVertex, selectedVertices);
        }
      }
    } else if (mode === 'puppy') {
      if (nowStep === 2) {
        if (guideStep[nowStep].unfold) {
          const positions = rotatedData.face;

          if (positions) {
            findAndSelectClosestVertices(
              positions,
              allVertex,
              selectedVertices
            );
          }
        }
      }
    }

    if (pointsMarker.visible) {
      initialMousePosition.set(event.clientX, event.clientY);
      isDragging = true;

      clickedRedMarker.position.copy(pointsMarker.position);
      clickedRedMarker.visible = true;
      pointsMarker.visible = false;
      controls.enabled = false;
    }

    const intersectPoint = intersects[0].point;
    startVertex = findClosestVertex(
      intersectPoint,
      borderVertices
    ).closestVertex;

    if (startVertex) {
      isDragging = true;
      clickedRedMarker.position.copy(startVertex);
      clickedRedMarker.visible = true;
      controls.enabled = false;
      pointsMarker.visible = false;

      const { closestVertex } = findClosestVertex(startVertex, borderVertices);
      isAxisPoint = closestVertex.isAxisPoint;
    }
  }
};

const handleMouseUp = () => {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(paper);

  let isClockwise = false;

  if (mode === 'plane') {
    if (guideStep[nowStep].unfold) {
      if (isDragging && !pointsMarker.visible) {
        let degree = DIAMETER;
        if (nowStep === 10 || nowStep === 11) {
          degree = DIAMETER / 2;
        }
        if (nowStep === 11) {
          isClockwise = true;
        }

        onFoldChange();

        rotateSelectedVertices(
          allVertex,
          selectedVertices,
          degree,
          FRAMES,
          isClockwise,
          rotatedData
        );

        selectedVerticesInitializeSet();
        updateStep(1);
      }
    }
  } else if (mode === 'puppy') {
    if (guideStep[nowStep].unfold) {
      if (isDragging && !pointsMarker.visible) {
        isClockwise = true;
        rotatedData.endPoint = { x: 0, y: -2.1, z: 0 };
        rotatedData.startPoint = { x: 0, y: 2.1, z: 0 };

        onFoldChange();

        rotateSelectedVertices(
          allVertex,
          selectedVertices,
          DIAMETER,
          FRAMES,
          isClockwise,
          rotatedData
        );
        selectedVerticesInitializeSet();
        updateStep(1);
      }
    }
  } else {
    const isClockwise = false;

    rotateSelectedVertices(
      allVertex,
      selectedVertices,
      DIAMETER,
      FRAMES,
      isClockwise,
      rotatedData
    );
    selectedVerticesInitializeSet();
  }
  isDragging = false;

  const existingPrevArea = scene.getObjectByName('prevFoldingAreaLine');
  if (existingPrevArea) {
    scene.remove(existingPrevArea);
  }

  const existingPolygon = scene.getObjectByName('foldedAreaPolygon');
  if (existingPolygon) {
    scene.remove(existingPolygon);
  }

  if (
    areMarkersAtSamePosition &&
    clickedRedMarker.visible &&
    !guideStep[nowStep].unfold
  ) {
    showToastMessage(TOAST_MESSAGE.SAME_POSITION);
  } else if (!pointsMarker.visible && clickedRedMarker.visible) {
    if (!isGuideMode) {
      showToastMessage(TOAST_MESSAGE.NO_POINTMARKER);
    }
  } else if (pointsMarker.visible && clickedRedMarker.visible) {
    if (intersects.length > 0) {
      const intersectPoint = intersects[0].point;
      const closestVertex = findClosestVertex(
        intersectPoint,
        borderVertices
      ).closestVertex;

      if (startVertex && hoverVertex) {
        const axis = calculateRotatedLine(
          scene,
          clickedRedMarker.position,
          closestVertex,
          allVertex
        );

        onFoldChange();

        foldingAnimation(
          scene,
          axis.axisPoints,
          clickedRedMarker.position,
          true,
          isAxisPoint
        );
        checkActiveButtons(prevButton, nextButton);

        if (isGuideMode) {
          updateStep(1);
        } else {
          addVertices();
        }
      }
    }
  }

  startVertex = {};
  hoverVertex = {};
  clickedRedMarker.visible = false;
  controls.enabled = true;
};

const updateClosestVertex = (intersectionPoint, thresholdDistance) => {
  const { closestVertex, closestVertexIndex, minDistance } = findClosestVertex(
    intersectionPoint,
    borderVertices
  );

  if (closestVertexIndex !== -1 && minDistance < thresholdDistance) {
    pointsMarker.position.copy(closestVertex);
    pointsMarker.visible = true;
  } else {
    pointsMarker.visible = false;
  }

  areMarkersAtSamePosition = pointsMarker.position.equals(
    clickedRedMarker.position
  );
};

const markClosestVertexAnimate = () => {
  raycaster.setFromCamera(mouse, camera);
  const intersect = raycaster.intersectObject(paper);

  if (intersect.length) {
    updateClosestVertex(intersect[0].point, THRESHOLD);
  } else {
    pointsMarker.visible = false;
  }

  controls.update();

  if (isFinished) {
    camera.position.z = 3.5;
    finishRenderer.render(scene, camera);
    paper.rotation.y += 0.01;
  } else {
    renderer.render(scene, camera);
  }

  requestAnimationFrame(markClosestVertexAnimate);
};

const launchConfetti = () => {
  if (isFinished) {
    confetti({
      particleCount: 200,
      spread: 130,
      origin: { y: 0.65 },
      zIndex: 3,
    });
  } else {
    clearInterval(confettiIntervalId);
  }
};

finishButton.addEventListener('click', () => {
  isFinished = true;

  completeCont.classList.remove('none');
  section.classList.add('active');

  launchConfetti();
  confettiIntervalId = setInterval(launchConfetti, 3500);

  renderer.clear();
  handleResize();
  initializeCamera();
});

prevButton.addEventListener('click', () => {
  changeToPrevFold();
  checkActiveButtons(prevButton, nextButton);
  if (isGuideMode) updateStep(-1);
});
nextButton.addEventListener('click', () => {
  changeToNextFold();
  checkActiveButtons(prevButton, nextButton);
  if (isGuideMode) updateStep(1);
});

window.addEventListener('resize', handleResize);
window.addEventListener('mousemove', handleMouseMove);
window.addEventListener('mousedown', handleMouseDown);
window.addEventListener('mouseup', handleMouseUp);
playCont.addEventListener('dblclick', initializeCamera);

markClosestVertexAnimate();
