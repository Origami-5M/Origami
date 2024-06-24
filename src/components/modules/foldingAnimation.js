import * as THREE from 'three';

import { camera } from '../../three/Camera';
import { paper } from '../../three/Paper';
import { Z_GAP } from '../../constants';

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

const fold = (startPoint, endPoint, direction) => {
  const allPositions = paper.geometry.attributes.position;
  const { x: x1, y: y1 } = startPoint;
  const { x: x2, y: y2 } = endPoint;

  const inequality = getInequalityFunction(direction);
  const frontOrBack = calculateFrontorBack();

  const m = (y2 - y1) / (x2 - x1);
  const c = y1 - m * x1;

  if (x1 === x2) {
    for (let i = 0; i < allPositions.count; i++) {
      const vertex = new THREE.Vector3();
      vertex.fromBufferAttribute(allPositions, i);

      if (inequality(vertex.x, x1)) {
        vertex.x = 2 * x1 - vertex.x;
        vertex.z += Z_GAP * frontOrBack;

        allPositions.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
    }
  } else if (y1 === y2) {
    for (let i = 0; i < allPositions.count; i++) {
      const vertex = new THREE.Vector3();
      vertex.fromBufferAttribute(allPositions, i);

      if (inequality(vertex.y, y1)) {
        vertex.y = 2 * y1 - vertex.y;
        vertex.z += Z_GAP * frontOrBack;

        allPositions.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
    }
  } else {
    for (let i = 0; i < allPositions.count; i++) {
      const vertex = new THREE.Vector3();
      vertex.fromBufferAttribute(allPositions, i);

      const yOnLine = m * vertex.x + c;
      if (inequality(vertex.y, yOnLine)) {
        const m_perp = -1 / m;
        const c_perp = vertex.y - m_perp * vertex.x;

        const ix = (c_perp - c) / (m - m_perp);
        const iy = m * ix + c;

        vertex.x = 2 * ix - vertex.x;
        vertex.y = 2 * iy - vertex.y;
        vertex.z += Z_GAP * frontOrBack;

        allPositions.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
    }
  }

  allPositions.needsUpdate = true;
};

const foldingAnimation = (axis, redMarker) => {
  const { rotatedLineVertex: borderVertex } = axis;
  const startPoint = borderVertex.clampedStartBasedOnX
    ? borderVertex.clampedStartBasedOnX
    : borderVertex.clampedStartBasedOnY;
  const endPoint = borderVertex.clampedEndBasedOnX
    ? borderVertex.clampedEndBasedOnX
    : borderVertex.clampedEndBasedOnY;

  const direction = getFoldDirection(startPoint, endPoint, redMarker.position);
  fold(startPoint, endPoint, direction);
};

export { foldingAnimation };
