import * as THREE from 'three';
import confetti from 'canvas-confetti';

import { sizes } from '../three/Sizes';
import { camera, initializeCamera } from '../three/Camera';
import { controls } from '../three/Controls';
import { ambientLight, directionalLight } from '../three/Lights';
import { paper, borderVertices } from '../three/Paper';
import { renderer } from '../three/Renderer';
import { findClosestVertex } from './findClosestVertex';
import { calculateRotatedLine } from './axisCalculations';
import { POINTS_MARKER_COLOR, RED_MARKER_COLOR } from '../constants';

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

let isFinished = false;
let isDragging = false;
let areMarkersAtSamePosition = false;
let vertexIntervalRotatedBasedOnX = null;
let vertexIntervalRotatedBasedOnY = null;

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
};

const handleMouseDown = () => {
  if (pointsMarker.visible) {
    clickedRedMarker.position.copy(pointsMarker.position);
    pointsMarker.visible = false;
    clickedRedMarker.visible = true;
    controls.enabled = false;
    isDragging = true;
  }
};

const handleMouseUp = () => {
  isDragging = false;
  controls.enabled = true;

  if (areMarkersAtSamePosition && clickedRedMarker.visible) {
    foldFailToastMessage.innerText = '마우스를 접을 곳으로 이동해 주세요!';
    foldFailToastMessage.classList.add('active');

    setTimeout(() => {
      foldFailToastMessage.classList.remove('active');
    }, 2000);
  } else if (!pointsMarker.visible && clickedRedMarker.visible) {
    foldFailToastMessage.innerText =
      '꼭짓점이 접을 수 있는 선분에 닿아야 합니다!';
    foldFailToastMessage.classList.add('active');

    setTimeout(() => {
      foldFailToastMessage.classList.remove('active');
    }, 2000);
  } else {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(paper);

    if (intersects.length > 0) {
      const intersectPoint = intersects[0].point;
      const closestVertex = findClosestVertex(
        intersectPoint,
        borderVertices
      ).closestVertex;

      if (closestVertex) {
        const rotatedLines = calculateRotatedLine(
          scene,
          clickedRedMarker.position,
          closestVertex,
          vertexIntervalRotatedBasedOnX,
          vertexIntervalRotatedBasedOnY
        );

        vertexIntervalRotatedBasedOnX =
          rotatedLines.vertexIntervalRotatedBasedOnX;
        vertexIntervalRotatedBasedOnY =
          rotatedLines.vertexIntervalRotatedBasedOnY;
        vertexIntervalRotatedBasedOnX
          ? scene.add(vertexIntervalRotatedBasedOnX)
          : null;
        vertexIntervalRotatedBasedOnY
          ? scene.add(vertexIntervalRotatedBasedOnY)
          : null;
      }
    }
  }

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

  requestAnimationFrame(MarkClosestVertexAnimate);
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

window.addEventListener('resize', handleResize);
window.addEventListener('mousemove', handleMouseMove);
window.addEventListener('mousedown', handleMouseDown);
window.addEventListener('mouseup', handleMouseUp);
playCont.addEventListener('dblclick', initializeCamera);

markClosestVertexAnimate();
