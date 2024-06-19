import * as THREE from 'three';

const canvas = document.querySelector('.play-canvas');

const renderer = new THREE.WebGLRenderer({
  alpha: true,
  canvas: canvas,
});
renderer.setClearColor(0x000000, 0);
renderer.setSize(window.innerWidth, window.innerHeight);

export { renderer };
