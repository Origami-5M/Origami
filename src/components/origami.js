import * as THREE from 'three';
import { sizes } from '../three/Sizes';
import { camera } from '../three/Camera';
import { controls } from '../three/Controls';
import { ambientLight, directionalLight } from '../three/Lights';
import { paper, borderVertices } from '../three/Paper';
import { renderer } from '../three/Renderer';

const playCont = document.querySelector('.play-cont');
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredPoint = null;
let clickPoint = null;

window.addEventListener('resize', () => {
  const updatedSizes = playCont.getBoundingClientRect();
  sizes.width = updatedSizes.width;
  sizes.height = updatedSizes.height;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
});

playCont.addEventListener('mousemove', event => {
  const rect = playCont.getBoundingClientRect();

  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(plane);

  if (hoveredPoint) {
    scene.remove(hoveredPoint);
    hoveredPoint = null;
  }

  if (intersects.length > 0) {
    const point = intersects[0].point;
    const planeWidth = plane.geometry.parameters.width;
    const planeHeight = plane.geometry.parameters.height;

    const snappedPoint = new THREE.Vector3(
      Math.round(point.x * 10) / 10,
      Math.round(point.y * 10) / 10,
      Math.round(point.z * 10) / 10
    );

    let pointColor = 0xff0000;

    if (
      Math.abs(snappedPoint.x) === planeWidth / 2 ||
      Math.abs(snappedPoint.y) === planeHeight / 2
    ) {
      pointColor = 0x0000ff;
    }

    const pointGeometry = new THREE.BufferGeometry().setFromPoints([
      snappedPoint,
    ]);
    const pointMaterial = new THREE.PointsMaterial({
      color: pointColor,
      size: 0.05,
    });

    hoveredPoint = new THREE.Points(pointGeometry, pointMaterial);
    scene.add(hoveredPoint);
  }
});

playCont.addEventListener('mousedown', event => {
  const rect = playCont.getBoundingClientRect();

  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(plane);

  if (clickPoint) {
    scene.remove(clickPoint);
    clickPoint = null;
  }

  if (intersects.length > 0) {
    const point = intersects[0].point;
    const planeWidth = plane.geometry.parameters.width;
    const planeHeight = plane.geometry.parameters.height;

    const snappedPoint = new THREE.Vector3(
      Math.round(point.x * 10) / 10,
      Math.round(point.y * 10) / 10,
      Math.round(point.z * 10) / 10
    );

    if (
      Math.abs(snappedPoint.x) === planeWidth / 2 ||
      Math.abs(snappedPoint.y) === planeHeight / 2
    ) {
      const pointGeometry = new THREE.BufferGeometry().setFromPoints([
        snappedPoint,
      ]);

      const pointMaterial = new THREE.PointsMaterial({
        color: 0x0000ff,
        size: 0.05,
      });

      clickPoint = new THREE.Points(pointGeometry, pointMaterial);
      scene.add(clickPoint);
    }
  }
});

playCont.addEventListener('mouseup', event => {
  const rect = playCont.getBoundingClientRect();

  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(plane);

  if (intersects.length > 0) {
    const point = intersects[0].point;
    const planeWidth = plane.geometry.parameters.width;
    const planeHeight = plane.geometry.parameters.height;

    const snappedPoint = new THREE.Vector3(
      Math.round(point.x * 10) / 10,
      Math.round(point.y * 10) / 10,
      Math.round(point.z * 10) / 10
    );

    if (
      Math.abs(snappedPoint.x) === planeWidth / 2 ||
      Math.abs(snappedPoint.y) === planeHeight / 2
    ) {
      // 접기 기능 구현 추가 위치
    } else {
      if (clickPoint) {
        const toastMessage = document.getElementById('toast_message');

        toastMessage.classList.add('active');

        setTimeout(function () {
          toastMessage.classList.remove('active');
        }, 1000);
      }
    }
  }

  if (clickPoint) {
    scene.remove(clickPoint);
    clickPoint = null;
  }
});

const scene = new THREE.Scene();
scene.add(paper);
scene.add(ambientLight);
scene.add(directionalLight);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let closestVertexIndex = -1;

const createPointsMarker = () => {
  const geometry = new THREE.SphereGeometry(0.03, 16, 16);
  const material = new THREE.MeshBasicMaterial({ color: '#098CEA' });
  const marker = new THREE.Mesh(geometry, material);
  marker.visible = false;
  return marker;
};

const pointsMarker = createPointsMarker();
scene.add(pointsMarker);

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

MarkClosestVertexAnimate();
