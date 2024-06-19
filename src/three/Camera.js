import * as THREE from 'three';
import { sizes } from './Sizes';

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.z = 3;

export { camera };
