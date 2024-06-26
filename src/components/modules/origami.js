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
import { borderVertices, addVertices } from './makeVertices';
import { getFoldingDirection } from './getFoldingDirection';
import { foldingVertexPosition } from './foldingVertexPosition';
import { prevFoldingArea } from './prevFoldingArea';

import {
  POINTS_MARKER_COLOR,
  RED_MARKER_COLOR,
  TOAST_MESSAGE,
} from '../../constants';

const section = document.querySelector('section');
const playCont = document.querySelector('.play-cont');
const finishCont = document.querySelector('.complete-scene');
const finishButton = document.querySelector('.finish-button');
const completeCont = document.querySelector('.complete-cont');
const foldFailToastMessage = document.querySelector('#foldFailToastMessage');

const scene = new THREE.Scene();
scene.add(paper);
scene.add(ambientLight);
scene.add(directionalLight);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let isDragging = false;
let startVertex = {};
let hoverVertex = {};
let isFinished = false;
let confettiIntervalId = 0;
let areMarkersAtSamePosition = false;
let vertexIntervalRotatedBasedOnX = {};
let vertexIntervalRotatedBasedOnY = {};

const createPointsMarker = color => {
  const geometry = new THREE.SphereGeometry(0.03, 16, 16);
  const material = new THREE.MeshBasicMaterial({ color });
  const marker = new THREE.Mesh(geometry, material);
  marker.visible = false;
  return marker;
};

const pointsMarker = createPointsMarker(POINTS_MARKER_COLOR);
scene.add(pointsMarker);

const clickedRedMarker = createPointsMarker(RED_MARKER_COLOR);
scene.add(clickedRedMarker);

const showToastMessages = text => {
  foldFailToastMessage.innerText = text;
  foldFailToastMessage.classList.add('active');

  setTimeout(() => {
    foldFailToastMessage.classList.remove('active');
  }, 2000);
};

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

const handleMouseDown = event => {
  if (pointsMarker.visible) {
    clickedRedMarker.position.copy(pointsMarker.position);
    pointsMarker.visible = false;
    clickedRedMarker.visible = true;
    controls.enabled = false;
  }

  handleMouseMove(event);

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
        vertexIntervalRotatedBasedOnX,
        vertexIntervalRotatedBasedOnY
      );

      vertexIntervalRotatedBasedOnX = axisLines.vertexIntervalRotatedBasedOnX;
      vertexIntervalRotatedBasedOnY = axisLines.vertexIntervalRotatedBasedOnY;

      const existingPolygon = scene.getObjectByName('foldedAreaPolygon');
      if (existingPolygon) {
        scene.remove(existingPolygon);
      }

      const axis = {
        rotatedLineVertex: {
          clampedStartBasedOnX: axisLines.vertexIntervalRotatedBasedOnX
            ? axisLines.vertexIntervalRotatedBasedOnX.geometry.attributes.position.array.slice(
                0,
                3
              )
            : null,
          clampedEndBasedOnX: axisLines.vertexIntervalRotatedBasedOnX
            ? axisLines.vertexIntervalRotatedBasedOnX.geometry.attributes.position.array.slice(
                3,
                6
              )
            : null,
          clampedStartBasedOnY: axisLines.vertexIntervalRotatedBasedOnY
            ? axisLines.vertexIntervalRotatedBasedOnY.geometry.attributes.position.array.slice(
                0,
                3
              )
            : null,
          clampedEndBasedOnY: axisLines.vertexIntervalRotatedBasedOnY
            ? axisLines.vertexIntervalRotatedBasedOnY.geometry.attributes.position.array.slice(
                3,
                6
              )
            : null,
        },
      };

      let startPoint = null;
      if (axis.rotatedLineVertex.clampedStartBasedOnX) {
        startPoint = new THREE.Vector3().fromArray(
          axis.rotatedLineVertex.clampedStartBasedOnX
        );
      } else if (axis.rotatedLineVertex.clampedStartBasedOnY) {
        startPoint = new THREE.Vector3().fromArray(
          axis.rotatedLineVertex.clampedStartBasedOnY
        );
      }

      let endPoint = null;
      if (axis.rotatedLineVertex.clampedEndBasedOnX) {
        endPoint = new THREE.Vector3().fromArray(
          axis.rotatedLineVertex.clampedEndBasedOnX
        );
      } else if (axis.rotatedLineVertex.clampedEndBasedOnY) {
        endPoint = new THREE.Vector3().fromArray(
          axis.rotatedLineVertex.clampedEndBasedOnY
        );
      }

      const direction = getFoldingDirection(
        startPoint,
        endPoint,
        clickedRedMarker.position
      );

      const currentFoldedArea = foldingVertexPosition(
        paper.geometry.attributes.position,
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

const handleMouseUp = () => {
  controls.enabled = true;
  isDragging = false;

  const existingPrevArea = scene.getObjectByName('prevFoldingAreaLine');
  if (existingPrevArea) {
    scene.remove(existingPrevArea);
  }

  const existingPolygon = scene.getObjectByName('foldedAreaPolygon');
  if (existingPolygon) {
    scene.remove(existingPolygon);
  }

  if (vertexIntervalRotatedBasedOnX) {
    scene.remove(vertexIntervalRotatedBasedOnX);
    vertexIntervalRotatedBasedOnX = null;
  }

  if (vertexIntervalRotatedBasedOnY) {
    scene.remove(vertexIntervalRotatedBasedOnY);
    vertexIntervalRotatedBasedOnY = null;
  }

  if (areMarkersAtSamePosition && clickedRedMarker.visible) {
    showToastMessages(TOAST_MESSAGE.SAME_POSITION);
  } else if (!pointsMarker.visible && clickedRedMarker.visible) {
    showToastMessages(TOAST_MESSAGE.NO_POINTMARKER);
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
          vertexIntervalRotatedBasedOnX,
          vertexIntervalRotatedBasedOnY
        );

        vertexIntervalRotatedBasedOnX = axis.vertexIntervalRotatedBasedOnX;
        vertexIntervalRotatedBasedOnY = axis.vertexIntervalRotatedBasedOnY;
        vertexIntervalRotatedBasedOnX
          ? scene.add(vertexIntervalRotatedBasedOnX)
          : null;
        vertexIntervalRotatedBasedOnY
          ? scene.add(vertexIntervalRotatedBasedOnY)
          : null;

        foldingAnimation(axis.axisPoints, clickedRedMarker, true);
        addVertices();
      }
    }
  }

  startVertex = null;
  hoverVertex = null;
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

window.addEventListener('resize', handleResize);
window.addEventListener('mousemove', handleMouseMove);
window.addEventListener('mousedown', handleMouseDown);
window.addEventListener('mouseup', handleMouseUp);
playCont.addEventListener('dblclick', initializeCamera);

markClosestVertexAnimate();
