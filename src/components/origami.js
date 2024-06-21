import * as THREE from 'three';
import { sizes } from '../three/Sizes';
import { camera } from '../three/Camera';
import { controls } from '../three/Controls';
import { ambientLight, directionalLight } from '../three/Lights';
import { paper, borderVertices } from '../three/Paper';
import { renderer } from '../three/Renderer';

const playCont = document.querySelector('.play-cont');
const foldFailToastMessage = document.querySelector('#fold-fail-toast-message');

const scene = new THREE.Scene();
scene.add(paper);
scene.add(ambientLight);
scene.add(directionalLight);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let closestVertexIndex = -1;
let areMarkersAtSamePosition = false;

const createPointsMarker = color => {
  const geometry = new THREE.SphereGeometry(0.03, 16, 16);
  const material = new THREE.MeshBasicMaterial({ color });
  const marker = new THREE.Mesh(geometry, material);
  marker.visible = false;
  return marker;
};

const pointsMarker = createPointsMarker('#098CEA');
scene.add(pointsMarker);

const clickedRedMarker = createPointsMarker('#FF0000');
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
  }
};

const handleMouseUp = () => {
  if (areMarkersAtSamePosition) {
    foldFailToastMessage.classList.add('active');

    setTimeout(() => {
      foldFailToastMessage.classList.remove('active');
    }, 1000);
  } else if (pointsMarker.visible) {
    console.log('접기 로직');
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

MarkClosestVertexAnimate();
