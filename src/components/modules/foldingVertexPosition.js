import * as THREE from 'three';
import {
  getInequalityFunction,
  calculateFrontOrBack,
} from './getFoldingDirection';
import { getVertexFromPosition } from './getVertexFromPosition';
import { borderVertices } from './makeVertices';

import { Z_GAP } from '../../constants';

const allFoldedFaces = [];

const foldingVertexPosition = (
  allPositions,
  startPoint,
  endPoint,
  direction,
  isFolding
) => {
  let count = allPositions.count;

  if (!allPositions.isBufferAttribute) {
    count = allPositions.length;
  }

  if (!startPoint || !endPoint) {
    return;
  }

  const { x: x1, y: y1 } = startPoint;
  const { x: x2, y: y2 } = endPoint;

  const nowFace = [];
  const prevFace = [];

  const inequality = getInequalityFunction(direction);
  const frontOrBack = calculateFrontOrBack();

  const m = (y2 - y1) / (x2 - x1);
  const c = y1 - m * x1;

  if (x1 === x2) {
    for (let i = 0; i < count; i++) {
      const vertex = getVertexFromPosition(allPositions, i);

      if (inequality(vertex.x, x1)) {
        vertex.x = 2 * x1 - vertex.x;
        vertex.z += Z_GAP * frontOrBack;

        prevFace.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z));

        if (isFolding) {
          updateVertexPosition(allPositions, i, vertex, nowFace);
        }
      }
    }
  } else if (y1 === y2) {
    for (let i = 0; i < count; i++) {
      const vertex = getVertexFromPosition(allPositions, i);

      if (inequality(vertex.y, y1)) {
        vertex.y = 2 * y1 - vertex.y;
        vertex.z += Z_GAP * frontOrBack;

        prevFace.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z));

        if (isFolding) {
          updateVertexPosition(allPositions, i, vertex, nowFace);
        }
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

        prevFace.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z));

        if (isFolding) {
          updateVertexPosition(allPositions, i, vertex, nowFace);
        }
      }
    }
  }

  if (allPositions.isBufferAttribute && isFolding) {
    allFoldedFaces.push(nowFace);
  }

  allPositions.needsUpdate = true;

  return prevFace;
};

const updateVertexPosition = (allPositions, i, vertex, nowFace) => {
  if (!allPositions.isBufferAttribute) {
    borderVertices[i] = { x: vertex.x, y: vertex.y, z: vertex.z };
  } else {
    nowFace.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z));
    allPositions.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }
};

const getallFoldedFaces = () => {
  return allFoldedFaces;
};

export { foldingVertexPosition, getallFoldedFaces };
