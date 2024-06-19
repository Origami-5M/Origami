import * as THREE from 'three';
import { sizes } from '../three/Sizes';
import { camera } from '../three/Camera';
import { controls } from '../three/Controls';
import { ambientLight, directionalLight } from '../three/Lights';
import { plane } from '../three/Plane';
import { renderer } from '../three/Renderer';

const playCont = document.querySelector('.play-cont');

window.addEventListener('resize', () => {
  const updatedSizes = playCont.getBoundingClientRect();
  sizes.width = updatedSizes.width;
  sizes.height = updatedSizes.height;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
});

const scene = new THREE.Scene();

scene.add(plane);
scene.add(ambientLight);
scene.add(directionalLight);

const animate = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();
