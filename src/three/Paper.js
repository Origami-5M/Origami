import * as THREE from 'three';

const colors = [
  0x1aa24d, 0xf2482e, 0x343394, 0xfed53d, 0x000000, 0xff9fd5, 0x9ddef4,
  0xff8158,
];

const getRandomColors = length => {
  const frontColorIndex = Math.floor(Math.random() * length);
  let backColorIndex = 0;

  do {
    backColorIndex = Math.floor(Math.random() * length);
  } while (backColorIndex === frontColorIndex);

  return [frontColorIndex, backColorIndex];
};

const [frontColorIndex, backColorIndex] = getRandomColors(colors.length);
const frontColor = colors[frontColorIndex];
const backColor = colors[backColorIndex];

const geometry = new THREE.PlaneGeometry(3, 3, 10, 10);
const material = new THREE.ShaderMaterial({
  uniforms: {
    colorFront: { value: new THREE.Color(frontColor) },
    colorBack: { value: new THREE.Color(backColor) },
  },
  wireframe: true,
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

const getVertices = geometry => {
  const positions = geometry.attributes.position.array;
  const vertices = [];

  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];
    vertices.push({ x, y, z });
  }

  return vertices;
};

const addEdge = (a, b, edgeCount) => {
  const edge = a < b ? `${a}_${b}` : `${b}_${a}`;
  if (edgeCount[edge]) {
    edgeCount[edge]++;
  } else {
    edgeCount[edge] = 1;
  }
};

const findBorderVertices = geometry => {
  const edgeCount = {};
  const indices = geometry.index.array;

  for (let i = 0; i < indices.length; i += 3) {
    const a = indices[i];
    const b = indices[i + 1];
    const c = indices[i + 2];

    addEdge(a, b, edgeCount);
    addEdge(b, c, edgeCount);
    addEdge(c, a, edgeCount);
  }

  const borderVertices = new Set();

  for (const edge in edgeCount) {
    if (edgeCount[edge] === 1) {
      const [a, b] = edge.split('_').map(Number);
      borderVertices.add(a);
      borderVertices.add(b);
    }
  }

  return Array.from(borderVertices);
};

const allVertices = getVertices(geometry);
const borderVerticesIndexs = findBorderVertices(geometry);
const borderVertices = borderVerticesIndexs.map(index => allVertices[index]);

export { paper, borderVertices };
