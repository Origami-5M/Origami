import * as THREE from 'three';
import { Z_GAP } from '../../../constants/paper';

export const getFoldingDirection = (startPoint, endPoint, referencePoint) => {
  const { x: x1, y: y1 } = startPoint;
  const { x: x2, y: y2 } = endPoint;
  const { x: xR, y: yR } = referencePoint;

  if (x1 === x2) {
    return xR < x1 ? 'left' : 'right';
  }

  if (y1 === y2) {
    return yR < y1 ? 'below' : 'above';
  }

  const m = (y2 - y1) / (x2 - x1);
  const c = y1 - m * x1;
  const yOnLine = m * xR + c;

  return yR < yOnLine ? 'below' : 'above';
};

export const getInequality = direction => {
  const inequalities = {
    left: (a, b) => a < b,
    right: (a, b) => a > b,
    above: (a, b) => a > b,
    below: (a, b) => a < b,
  };

  return inequalities[direction];
};

export const calculateFrontOrBack = (camera, paperMesh) => {
  const cameraDirection = new THREE.Vector3();
  camera.getWorldDirection(cameraDirection);

  const paperNormal = new THREE.Vector3(0, 0, 1);
  paperNormal.applyQuaternion(paperMesh.quaternion);

  const dotProduct = cameraDirection.dot(paperNormal);

  if (dotProduct > 0) {
    return -1;
  } else {
    return 1;
  }
};

export const getVertexFromPosition = (allPositions, i) => {
  if (Array.isArray(allPositions)) {
    return allPositions[i];
  } else {
    const vertex = new THREE.Vector3();
    vertex.fromBufferAttribute(allPositions, i);
    return vertex;
  }
};

export const updateVertexPosition = (
  allPositions,
  i,
  vertex,
  nowFace,
  geometry
) => {
  nowFace.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z));
  allPositions.setXYZ(i, vertex.x, vertex.y, vertex.z);
  geometry.attributes.position.needsUpdate = true;
};

export const calculateReflectedPosition = (vertex, axisValue, axis) => {
  if (axis === 'x') {
    vertex.x = 2 * axisValue - vertex.x;
  } else if (axis === 'y') {
    vertex.y = 2 * axisValue - vertex.y;
  }
};

export const reflectAcrossLine = (vertex, m, c, frontOrBack) => {
  const m_perp = -1 / m;
  const c_perp = vertex.y - m_perp * vertex.x;

  const ix = (c_perp - c) / (m - m_perp);
  const iy = m * ix + c;

  vertex.x = 2 * ix - vertex.x;
  vertex.y = 2 * iy - vertex.y;
  vertex.z += Z_GAP * frontOrBack;
};
