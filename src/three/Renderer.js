import * as THREE from 'three';
import { sizes } from './Sizes';

const canvas = document.querySelector('.play-canvas');

const renderer = new THREE.WebGLRenderer({
  alpha: true,
  canvas: canvas,
});
renderer.setClearColor(0x000000, 0);
renderer.setSize(sizes.width, sizes.height);

export { renderer };
