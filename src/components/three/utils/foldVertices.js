import * as THREE from 'three';
import { Z_GAP } from '../../../constants/paper';
import {
  getFoldingDirection,
  getInequality,
  calculateFrontOrBack,
  getVertexFromPosition,
  updateVertexPosition,
  calculateReflectedPosition,
  reflectAcrossLine,
} from './foldingUtils';

export const foldVertices = (
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
  const foldedVertices = Array.isArray(allPositions) ? [...allPositions] : null;
  const count = Array.isArray(allPositions)
    ? allPositions.length
    : allPositions.count;

  const { x: x1, y: y1 } = startPoint;
  const { x: x2, y: y2 } = endPoint;

  const direction = getFoldingDirection(startPoint, endPoint, referencePoint);
  const inequality = getInequality(direction);
  const frontOrBack = calculateFrontOrBack(camera, paperMesh);

  const m = (y2 - y1) / (x2 - x1);
  const c = y1 - m * x1;

  for (let i = 0; i < count; i++) {
    const vertex = getVertexFromPosition(allPositions, i);

    if (x1 === x2 && inequality(vertex.x, x1)) {
      calculateReflectedPosition(vertex, x1, 'x');
      vertex.z += Z_GAP * frontOrBack;
    } else if (y1 === y2 && inequality(vertex.y, y1)) {
      calculateReflectedPosition(vertex, y1, 'y');
      vertex.z += Z_GAP * frontOrBack;
    } else if (inequality(vertex.y, m * vertex.x + c)) {
      reflectAcrossLine(vertex, m, c, frontOrBack);
    }

    if (!Array.isArray(allPositions)) {
      previewFace.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z));
      updateVertexPosition(allPositions, i, vertex, nowFace, geometry);
    } else {
      foldedVertices[i] = vertex;
    }
  }

  if (Array.isArray(allPositions)) {
    return foldedVertices;
  }
};
