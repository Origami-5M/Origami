import * as THREE from 'three';
import { sizes, finishSizes } from './Sizes';

const canvas = document.querySelector('.play-canvas');
const finishCanvas = document.querySelector('.finish-canvas');

const renderer = new THREE.WebGLRenderer({
  alpha: true,
  canvas: canvas,
});
renderer.setClearColor(0x000000, 0);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(sizes.width, sizes.height);

const finishRenderer = new THREE.WebGLRenderer({
  alpha: true,
  canvas: finishCanvas,
});
finishRenderer.setClearColor(0x000000, 0);
finishRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
finishRenderer.setSize(finishSizes.width, finishSizes.height);

export { renderer, finishRenderer };
