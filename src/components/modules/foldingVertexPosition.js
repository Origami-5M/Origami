import * as THREE from 'three';
import {
  getInequalityFunction,
  calculateFrontOrBack,
} from './getFoldingDirection';
import { getVertexFromPosition } from './getVertexFromPosition';
import { borderVertices } from './makeVertices';

import { Z_GAP } from '../../constants';
import {
  isGuideMode,
  mode,
  nowStep,
  stepPlaneVertex,
  updateZPosition,
} from './guideModules';

const allFoldedFaces = [];
const rotatedData = {};
const borderData = {};

const foldingVertexPosition = (
  allPositions,
  startPoint,
  endPoint,
  direction,
  isFolding,
  isBorderVertices
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

  const previewFace = [];
  const nowFace = [];

  const inequality = getInequalityFunction(direction);
  const frontOrBack = calculateFrontOrBack();

  const m = (y2 - y1) / (x2 - x1);
  const c = y1 - m * x1;

  const isInStepVertex8 = vertex => {
    return stepPlaneVertex.stepVertex8.some(
      v =>
        Math.abs(v.x - vertex.x) < 1e-6 &&
        Math.abs(v.y - vertex.y) < 1e-6 &&
        Math.abs(v.z - vertex.z) < 1e-6
    );
  };

  if (x1 === x2) {
    for (let i = 0; i < count; i++) {
      const vertex = getVertexFromPosition(allPositions, i);

      if (inequality(vertex.x, x1)) {
        vertex.x = 2 * x1 - vertex.x;
        if (isBorderVertices) {
          vertex.z += Z_GAP * -frontOrBack;
        } else {
          vertex.z += Z_GAP * frontOrBack;
        }
        previewFace.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z));

        if (isFolding) {
          const updateVertex = isGuideMode ? updateZPosition(vertex) : vertex;
          updateVertexPosition(allPositions, i, updateVertex, nowFace);
        }
      }
    }
  } else if (y1 === y2) {
    for (let i = 0; i < count; i++) {
      const vertex = getVertexFromPosition(allPositions, i);

      if (inequality(vertex.y, y1)) {
        vertex.y = 2 * y1 - vertex.y;

        if (mode === 'puppy' && nowStep === 5) {
          if (Math.abs(vertex.z) >= 0.01) {
            if (isBorderVertices) {
              vertex.z += Z_GAP * -frontOrBack;
            } else {
              vertex.z += Z_GAP * frontOrBack;
            }

            previewFace.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z));

            if (isFolding) {
              const updateVertex = updateZPosition(vertex);
              updateVertexPosition(allPositions, i, updateVertex, nowFace);
            }
          } else {
            previewFace.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z));
          }
        } else {
          if (isBorderVertices) {
            vertex.z += Z_GAP * -frontOrBack;
          } else {
            vertex.z += Z_GAP * frontOrBack;
          }

          previewFace.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z));

          if (isFolding) {
            const updateVertex = isGuideMode ? updateZPosition(vertex) : vertex;
            updateVertexPosition(allPositions, i, updateVertex, nowFace);
          }
        }
      }
    }
  } else {
    for (let i = 0; i < count; i++) {
      const vertex = getVertexFromPosition(allPositions, i);
      const yOnLine = m * vertex.x + c;

      if (
        inequality(vertex.y, yOnLine) &&
        (nowStep === 8 ? !isInStepVertex8(vertex) : true)
      ) {
        const m_perp = -1 / m;
        const c_perp = vertex.y - m_perp * vertex.x;

        const ix = (c_perp - c) / (m - m_perp);
        const iy = m * ix + c;

        vertex.x = 2 * ix - vertex.x;
        vertex.y = 2 * iy - vertex.y;
        if (isBorderVertices) {
          vertex.z += Z_GAP * -frontOrBack;
        } else {
          vertex.z += Z_GAP * frontOrBack;
        }

        previewFace.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z));

        if (isFolding) {
          const updateVertex = isGuideMode ? updateZPosition(vertex) : vertex;
          updateVertexPosition(allPositions, i, updateVertex, nowFace);
        }
      }
    }
  }

  if (allPositions.isBufferAttribute && isFolding) {
    allFoldedFaces.push(nowFace);
    rotatedData.face = nowFace;
    rotatedData.startPoint = startPoint;
    rotatedData.endPoint = endPoint;
  } else {
    borderData.face = nowFace;
    borderData.startPoint = startPoint;
    borderData.endPoint = endPoint;
  }

  return previewFace;
};

const updateVertexPosition = (allPositions, i, vertex, nowFace) => {
  if (!allPositions.isBufferAttribute) {
    borderVertices[i] = { x: vertex.x, y: vertex.y, z: vertex.z };
  } else {
    nowFace.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z));
    allPositions.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }
};

const getAllFolderFaces = () => {
  return allFoldedFaces;
};

export { foldingVertexPosition, getAllFolderFaces, rotatedData, borderData };
