import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { camera } from './Camera';
import { renderer } from './Renderer';

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

export { controls };
