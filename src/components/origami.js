import * as THREE from 'three';
import { sizes } from '../three/Sizes';
import { camera, initializeCamera } from '../three/Camera';
import { controls } from '../three/Controls';
import { ambientLight, directionalLight } from '../three/Lights';
import { paper, borderVertices } from '../three/Paper';
import { renderer } from '../three/Renderer';

import { POINTS_MARKER_COLOR, RED_MARKER_COLOR } from '../constants';

const playCont = document.querySelector('.play-cont');
const foldFailToastMessage = document.querySelector('#foldFailToastMessage');

const scene = new THREE.Scene();
scene.add(paper);
scene.add(ambientLight);
scene.add(directionalLight);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let isDragging = false;
let closestVertexIndex = -1;
let areMarkersAtSamePosition = false;

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

const handleResize = () => {
  const { width, height } = playCont.getBoundingClientRect();
  sizes.width = width;
  sizes.height = height;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
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
      '꼭지점이 접을 수 있는 선분에 닿아야 합니다!';
    foldFailToastMessage.classList.add('active');

    setTimeout(() => {
      foldFailToastMessage.classList.remove('active');
    }, 2000);
  } else {
    // 접기 기능구현 들어가야할 곳!
  }
  clickedRedMarker.visible = false;
};

const updateClosestVertex = (intersectionPoint, thresholdDistance) => {
  let minDistance = Infinity;
  closestVertexIndex = -1;

  for (let i = 0; i < borderVertices.length; i++) {
    const vertex = new THREE.Vector3(
      borderVertices[i].x,
      borderVertices[i].y,
      borderVertices[i].z
    );
    const distance = vertex.distanceTo(intersectionPoint);

    if (distance < minDistance) {
      minDistance = distance;
      closestVertexIndex = i;
    }
  }

  if (closestVertexIndex !== -1 && minDistance < thresholdDistance) {
    const position = new THREE.Vector3(
      borderVertices[closestVertexIndex].x,
      borderVertices[closestVertexIndex].y,
      borderVertices[closestVertexIndex].z
    );

    pointsMarker.position.copy(position);
    pointsMarker.visible = true;
  } else {
    pointsMarker.visible = false;
  }

  areMarkersAtSamePosition = pointsMarker.position.equals(
    clickedRedMarker.position
  );
};

const MarkClosestVertexAnimate = () => {
  raycaster.setFromCamera(mouse, camera);
  const intersect = raycaster.intersectObject(paper);

  if (intersect.length) {
    const threshold = 0.6;
    updateClosestVertex(intersect[0].point, threshold);
  } else {
    pointsMarker.visible = false;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(MarkClosestVertexAnimate);
};

window.addEventListener('resize', handleResize);
window.addEventListener('mousemove', handleMouseMove);
window.addEventListener('mousedown', handleMouseDown);
window.addEventListener('mouseup', handleMouseUp);
playCont.addEventListener('dblclick', initializeCamera);

MarkClosestVertexAnimate();
