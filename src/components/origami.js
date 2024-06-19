import * as THREE from 'three';
import { camera } from '../three/Camera';
import { controls } from '../three/Controls';
import { ambientLight, directionalLight } from '../three/Lights';
import { plane } from '../three/Plane';
import { renderer } from '../three/Renderer';

const scene = new THREE.Scene();
scene.add(plane);
scene.add(ambientLight);
scene.add(directionalLight);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
