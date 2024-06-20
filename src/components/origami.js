import * as THREE from 'three';
import { sizes } from '../three/Sizes';
import { camera } from '../three/Camera';
import { controls } from '../three/Controls';
import { ambientLight, directionalLight } from '../three/Lights';
import { paper, borderVertices } from '../three/Paper';
import { renderer } from '../three/Renderer';

const playCont = document.querySelector('.play-cont');

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

const updateClosestVertex = intersectionPoint => {
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

  if (closestVertexIndex !== -1) {
    const position = new THREE.Vector3(
      borderVertices[closestVertexIndex].x,
      borderVertices[closestVertexIndex].y,
      borderVertices[closestVertexIndex].z
    );
    pointsMarker.position.copy(position);
    pointsMarker.visible = true;
  }
};

const MarkClosestVertexAnimate = () => {
  raycaster.setFromCamera(mouse, camera);
  const intersect = raycaster.intersectObject(paper);

  if (intersect.length) {
    updateClosestVertex(intersect[0].point);
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
