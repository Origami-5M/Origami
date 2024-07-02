import * as THREE from 'three';
import { POINTS_LINE_COLOR } from '../../constants';

const getBoundaryPoint = points => {
  if (!points) {
    return;
  }

  points.sort((a, b) => (a.x !== b.x ? a.x - b.x : a.y - b.y));

  const cross = (o, a, b) =>
    (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

  const lower = [];
  for (let point of points) {
    while (
      lower.length >= 2 &&
      cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0
    ) {
      lower.pop();
    }
    lower.push(point);
  }

  const upper = [];
  for (let i = points.length - 1; i >= 0; i--) {
    const point = points[i];
    while (
      upper.length >= 2 &&
      cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0
    ) {
      upper.pop();
    }
    upper.push(point);
  }

  lower.pop();
  upper.pop();
  return lower.concat(upper);
};

const drawThickLine = (points, color, thickness) => {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const indices = [];

  if (!points) {
    return;
  }

  points.forEach((point, i) => {
    const nextPoint = points[(i + 1) % points.length];
    const direction = new THREE.Vector3()
      .subVectors(nextPoint, point)
      .normalize();
    const perpendicular = new THREE.Vector3(
      -direction.y,
      direction.x,
      0
    ).multiplyScalar(thickness / 2);

    const p1 = point.clone().add(perpendicular);
    const p2 = point.clone().sub(perpendicular);
    const p3 = nextPoint.clone().add(perpendicular);
    const p4 = nextPoint.clone().sub(perpendicular);

    const index = vertices.length / 3;
    vertices.push(p1.x, p1.y, p1.z);
    vertices.push(p2.x, p2.y, p2.z);
    vertices.push(p3.x, p3.y, p3.z);
    vertices.push(p4.x, p4.y, p4.z);

    indices.push(index, index + 1, index + 2);
    indices.push(index + 1, index + 3, index + 2);
  });

  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  geometry.setIndex(indices);

  const material = new THREE.MeshBasicMaterial({
    color,
    side: THREE.DoubleSide,
  });
  return new THREE.Mesh(geometry, material);
};

const prevFoldingArea = (foldedVertices, thickness = 0.01) => {
  const hullVertices = getBoundaryPoint(foldedVertices);
  const line = drawThickLine(hullVertices, POINTS_LINE_COLOR, thickness);

  if (!line) {
    return;
  }

  line.position.z += 0.001;

  return line;
};

export { prevFoldingArea };
