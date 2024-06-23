import * as THREE from 'three';
import { sizes } from './Sizes';

const canvas = document.querySelector('.play-canvas');
const finishCanvas = document.querySelector('.finish-canvas');

const createRenderer = canvas => {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    canvas: canvas,
  });

  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(sizes.width, sizes.height);

  return renderer;
};

const renderer = createRenderer(canvas);
const finishRenderer = createRenderer(finishCanvas);

export { renderer, finishRenderer };
