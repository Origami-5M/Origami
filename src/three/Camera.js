import * as THREE from 'three';
import { sizes } from './Sizes';

const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.z = 3;

const initialCameraPosition = camera.position.clone();

export { camera, initialCameraPosition };
