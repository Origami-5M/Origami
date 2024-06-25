import * as THREE from 'three';

import { camera } from '../../three/Camera';
import { paper } from '../../three/Paper';
import { borderVertices } from './makeVertices';

import { Z_GAP } from '../../constants';

const AllFoldedFaces = [];

const calculateFrontorBack = () => {
  const cameraDirection = new THREE.Vector3();
  camera.getWorldDirection(cameraDirection);

  const paperNormal = new THREE.Vector3(0, 0, 1);
  paperNormal.applyQuaternion(paper.quaternion);

  const dotProduct = cameraDirection.dot(paperNormal);

  if (dotProduct > 0) {
    return -1;
  } else {
    return 1;
  }
};

const getFoldDirection = (startPoint, endPoint, redMarker) => {
  const { x: x1, y: y1 } = startPoint;
  const { x: x2, y: y2 } = endPoint;
  const { x: xR, y: yR } = redMarker;

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

const getInequalityFunction = direction => {
  const inequalities = {
    left: (a, b) => a < b,
    right: (a, b) => a > b,
    above: (a, b) => a > b,
    below: (a, b) => a < b,
  };

  return inequalities[direction];
};

const getVertexFromPosition = (allPositions, i) => {
  if (!allPositions.isBufferAttribute) {
    return allPositions[i];
  } else {
    const vertex = new THREE.Vector3();
    vertex.fromBufferAttribute(allPositions, i);
    return vertex;
  }
};

const updateVertexPosition = (allPositions, i, vertex, nowFace) => {
  if (!allPositions.isBufferAttribute) {
    borderVertices[i] = { x: vertex.x, y: vertex.y, z: vertex.z };
  } else {
    nowFace.push({ x: vertex.x, y: vertex.y, z: vertex.z });
    allPositions.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }
};

const fold = (allPositions, startPoint, endPoint, direction) => {
  let count = allPositions.count;

  if (!allPositions.isBufferAttribute) {
    count = allPositions.length;
  }

  const { x: x1, y: y1 } = startPoint;
  const { x: x2, y: y2 } = endPoint;

  const nowFace = [];
  const inequality = getInequalityFunction(direction);
  const frontOrBack = calculateFrontorBack();

  const m = (y2 - y1) / (x2 - x1);
  const c = y1 - m * x1;

  if (x1 === x2) {
    for (let i = 0; i < count; i++) {
      const vertex = getVertexFromPosition(allPositions, i);

      if (inequality(vertex.x, x1)) {
        vertex.x = 2 * x1 - vertex.x;
        vertex.z += Z_GAP * frontOrBack;

        updateVertexPosition(allPositions, i, vertex, nowFace);
      }
    }
  } else if (y1 === y2) {
    for (let i = 0; i < count; i++) {
      const vertex = getVertexFromPosition(allPositions, i);

      if (inequality(vertex.y, y1)) {
        vertex.y = 2 * y1 - vertex.y;
        vertex.z += Z_GAP * frontOrBack;

        updateVertexPosition(allPositions, i, vertex, nowFace);
      }
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

        updateVertexPosition(allPositions, i, vertex, nowFace);
      }
    }
  }

  AllFoldedFaces.push(nowFace);
  allPositions.needsUpdate = true;
};

const foldingAnimation = (axisPoints, redMarker) => {
  const { startPoint, endPoint } = axisPoints;
  const direction = getFoldDirection(startPoint, endPoint, redMarker.position);

  fold(paper.geometry.attributes.position, startPoint, endPoint, direction);
  fold(borderVertices, startPoint, endPoint, direction);
};

export { foldingAnimation };
