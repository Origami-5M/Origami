import * as THREE from 'three';
import { PAPERCOLORS } from '../constants';

const getRandomColors = length => {
  const frontColorIndex = Math.floor(Math.random() * length);
  let backColorIndex = 0;

  do {
    backColorIndex = Math.floor(Math.random() * length);
  } while (backColorIndex === frontColorIndex);

  return [frontColorIndex, backColorIndex];
};

const [frontColorIndex, backColorIndex] = getRandomColors(PAPERCOLORS.length);
const frontColor = PAPERCOLORS[frontColorIndex];
const backColor = PAPERCOLORS[backColorIndex];

const geometry = new THREE.PlaneGeometry(3, 3, 100, 100);
const material = new THREE.ShaderMaterial({
  uniforms: {
    colorFront: { value: new THREE.Color(frontColor) },
    colorBack: { value: new THREE.Color(backColor) },
  },
  wireframe: false,
  vertexShader: `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,
  fragmentShader: `
  uniform vec3 colorFront;
  uniform vec3 colorBack;
  varying vec3 vNormal;
  void main() {
    if (gl_FrontFacing) {
      gl_FragColor = vec4(colorFront, 1.0);
    } else {
      gl_FragColor = vec4(colorBack, 1.0);
    }
  }
`,
  side: THREE.DoubleSide,
});

const paper = new THREE.Mesh(geometry, material);

const findBorderVertices = () => {
  const corners = [
    { x: 1.5, y: 1.5, z: 0 },
    { x: -1.5, y: 1.5, z: 0 },
    { x: -1.5, y: -1.5, z: 0 },
    { x: 1.5, y: -1.5, z: 0 },
  ];

  return corners;
};

const interpolatePoints = (start, end, numPoints) => {
  const points = [];
  const deltaX = (end.x - start.x) / (numPoints + 1);
  const deltaY = (end.y - start.y) / (numPoints + 1);
  const deltaZ = (end.z - start.z) / (numPoints + 1);

  points.push(start); // Add the starting corner

  for (let i = 1; i <= numPoints; i++) {
    points.push({
      x: start.x + deltaX * i,
      y: start.y + deltaY * i,
      z: start.z + deltaZ * i,
    });
  }

  return points;
};

const generateBorderPoints = (corners, pointsPerEdge) => {
  const borderPoints = [];

  for (let i = 0; i < corners.length; i++) {
    const start = corners[i];
    const end = corners[(i + 1) % corners.length];
    const interpolatedPoints = interpolatePoints(start, end, pointsPerEdge);
    borderPoints.push(...interpolatedPoints);
  }

  return borderPoints;
};

const corners = findBorderVertices();
const borderVertices = generateBorderPoints(corners, 9);

export { paper, borderVertices };
