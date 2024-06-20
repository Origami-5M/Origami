import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/Addons.js';

import { camera } from './Camera';
import { renderer } from './Renderer';

const controls = new TrackballControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;
controls.rotateSpeed = 4.0;

controls.mouseButtons = {
  LEFT: THREE.MOUSE.ROTATE,
  MIDDLE: THREE.MOUSE.DOLLY,
  RIGHT: null,
};

controls.minDistance = 1.5;
controls.maxDistance = 5;

export { controls };
