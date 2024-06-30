import * as THREE from 'three';
import confetti from 'canvas-confetti';

import { sizes } from '../../three/Sizes';
import { camera, initializeCamera } from '../../three/Camera';
import { controls } from '../../three/Controls';
import { ambientLight, directionalLight } from '../../three/Lights';
import { paper } from '../../three/Paper';
import { renderer, finishRenderer } from '../../three/Renderer';
import { showToastMessages } from './showToastMessage';

import { debounce } from './debounce';
import { findClosestVertex } from './findClosestVertex';
import { calculateRotatedLine } from './axisCalculations';
import { foldingAnimation } from './foldingAnimation';
import {
  borderVertices,
  addVertices,
  changeBorderVertices,
} from './makeVertices';
import { getFoldingDirection } from './getFoldingDirection';
import {
  foldingVertexPosition,
  rotatedData,
  borderData,
} from './foldingVertexPosition';
import { prevFoldingArea } from './prevFoldingArea';
import { nowStep, isGuideMode, guideStep, updateStep } from './guideModules';
import {
  rotateSelectedVertices,
  findAndSelectClosestVertices,
} from './rotateSelectedVertices';

import {
  checkActiveButtons,
  changeToPrevFold,
  changeToNextFold,
  saveFoldHistory,
} from './prevNextButtons';

import {
  DIAMETER,
  FRAMES,
  POINTS_MARKER_COLOR,
  RED_MARKER_COLOR,
  TOAST_MESSAGE,
} from '../../constants';

const section = document.querySelector('section');
const playCont = document.querySelector('.play-cont');
const finishCont = document.querySelector('.complete-scene');
const finishButton = document.querySelector('.finish-button');
const completeCont = document.querySelector('.complete-cont');
const toastMessage = document.querySelector('#toastMessage');

const prevButton = document.querySelector('#prevButton');
const nextButton = document.querySelector('#nextButton');

const scene = new THREE.Scene();
scene.add(paper);
scene.add(ambientLight);
scene.add(directionalLight);

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

if (isGuideMode) {
  changeBorderVertices(guideStep[nowStep].points);
}

const createPointsMarker = color => {
  const geometry = new THREE.SphereGeometry(0.03, 16, 16);
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

  if (isDragging) {
    debouncedUpdateFoldOnMouseMove(event);
  }
};

const updateClosestVertexHover = intersectionPoint => {
  const { closestVertex } = findClosestVertex(
    intersectionPoint,
    borderVertices
  );
  return closestVertex;
};

const handleMouseDown = () => {
  selectedVerticesInitializeSet();
  const positions = rotatedData.face;
  if (positions) {
    findAndSelectClosestVertices(positions, allVertex, selectedVertices);
  }

  if (pointsMarker.visible) {
    initialMousePosition.set(event.clientX, event.clientY);
    isDragging = true;
  }

  if (pointsMarker.visible) {
    clickedRedMarker.position.copy(pointsMarker.position);
    pointsMarker.visible = false;
    clickedRedMarker.visible = true;
    controls.enabled = false;
  }

  const intersects = raycaster.intersectObject(paper);

  if (intersects.length > 0) {
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

const debouncedUpdateFoldOnMouseMove = debounce(updateFoldOnMouseMove, 10);

const handleMouseUp = () => {
  controls.enabled = true;
  const isFolding = true;
  const isBorderVertices = true;
  const isClockwise = false;

  if (isDragging && !pointsMarker.visible) {
    rotateSelectedVertices(
      allVertex,
      selectedVertices,
      DIAMETER,
      FRAMES,
      isClockwise,
      rotatedData
    );

    const direction = getFoldingDirection(
      borderData.startPoint,
      borderData.endPoint,
      clickedRedMarker.position
    );

    foldingVertexPosition(
      borderData.face,
      borderData.startPoint,
      borderData.endPoint,
      direction,
      isFolding,
      isBorderVertices
    );
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

  if (areMarkersAtSamePosition && clickedRedMarker.visible) {
    showToastMessages(toastMessage, TOAST_MESSAGE.SAME_POSITION);
  } else if (!pointsMarker.visible && clickedRedMarker.visible) {
    showToastMessages(toastMessage, TOAST_MESSAGE.NO_POINTMARKER);
  } else if (pointsMarker.visible && clickedRedMarker.visible) {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(paper);

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

        saveFoldHistory({
          paper: new Float32Array(allVertex.array.slice()),
          borderVertices: JSON.parse(JSON.stringify(borderVertices)),
        });
        foldingAnimation(
          scene,
          axis.axisPoints,
          clickedRedMarker.position,
          true,
          isAxisPoint
        );
        addVertices();
        checkActiveButtons(prevButton, nextButton);

        if (isGuideMode) {
          updateStep(1);
        }
      }
    }
  }

  startVertex = {};
  hoverVertex = {};
  clickedRedMarker.visible = false;
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
    const threshold = 0.6;
    updateClosestVertex(intersect[0].point, threshold);
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
