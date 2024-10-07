import * as THREE from 'three';
import { Z_GAP } from '../../../constants/paper';

const getFoldingDirection = (startPoint, endPoint, referencePoint) => {
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

const getInequality = direction => {
  const inequalities = {
    left: (a, b) => a < b,
    right: (a, b) => a > b,
    above: (a, b) => a > b,
    below: (a, b) => a < b,
  };

  return inequalities[direction];
};

const calculateFrontOrBack = (camera, paperMesh) => {
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

const getVertexFromPosition = (allPositions, i) => {
  const vertex = new THREE.Vector3();
  vertex.fromBufferAttribute(allPositions, i);
  return vertex;
};

const updateVertexPosition = (allPositions, i, vertex, nowFace, geometry) => {
  nowFace.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z));
  allPositions.setXYZ(i, vertex.x, vertex.y, vertex.z);
  geometry.attributes.position.needsUpdate = true;
};

export const foldingAnimation = (
  allPositions,
  startPoint,
  endPoint,
  referencePoint,
  camera,
  paperMesh
) => {
  const previewFace = [];
  const nowFace = [];
  const geometry = paperMesh.geometry;

  const count = allPositions.count;
  const { x: x1, y: y1 } = startPoint;
  const { x: x2, y: y2 } = endPoint;

  const direction = getFoldingDirection(startPoint, endPoint, referencePoint);
  const inequality = getInequality(direction);
  const frontOrBack = calculateFrontOrBack(camera, paperMesh);

  const m = (y2 - y1) / (x2 - x1);
  const c = y1 - m * x1;

  if (x1 === x2) {
    for (let i = 0; i < count; i++) {
      const vertex = getVertexFromPosition(allPositions, i);

      if (inequality(vertex.x, x1)) {
        vertex.x = 2 * x1 - vertex.x;
        vertex.z += Z_GAP * frontOrBack;
      }

      previewFace.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z));
      updateVertexPosition(allPositions, i, vertex, nowFace, geometry);
    }
  } else if (y1 === y2) {
    for (let i = 0; i < count; i++) {
      const vertex = getVertexFromPosition(allPositions, i);

      if (inequality(vertex.y, y1)) {
        vertex.y = 2 * y1 - vertex.y;
        vertex.z += Z_GAP * frontOrBack;
      }

      previewFace.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z));
      updateVertexPosition(allPositions, i, vertex, nowFace, geometry);
    }
  } else {
    for (let i = 0; i < count; i++) {
      const vertex = getVertexFromPosition(allPositions, i);
      const yOnLine = m * vertex.x + c;

      if (inequality(vertex.y, yOnLine)) {
        const m_perp = -1 / m;
        const c_perp = vertex.y - m_perp * vertex.x;

        const ix = (c_perp - c) / (m - m_perp);
        const iy = m * ix + c;

        vertex.x = 2 * ix - vertex.x;
        vertex.y = 2 * iy - vertex.y;
        vertex.z += Z_GAP * frontOrBack;

        previewFace.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z));

        updateVertexPosition(allPositions, i, vertex, nowFace, geometry);
      }
    }
  }
};
