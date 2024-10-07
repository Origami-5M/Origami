import * as THREE from 'three';

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

export const foldingAnimation = (
  allPositions,
  startPoint,
  endPoint,
  referencePoint,
  camera,
  paperMesh
) => {
  const direction = getFoldingDirection(startPoint, endPoint, referencePoint);

  const count = allPositions.count;
  const { x: x1, y: y1 } = startPoint;
  const { x: x2, y: y2 } = endPoint;
  const nowFace = [];

  const inequality = getInequality(direction);
  const frontOrBack = calculateFrontOrBack(camera, paperMesh);

  const m = (y2 - y1) / (x2 - x1);
  const c = y1 - m * x1;
};
