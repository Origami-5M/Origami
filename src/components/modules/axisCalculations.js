import * as THREE from 'three';
import { PAPER_BOUNDARY, DASH_SIZE } from '../../constants';
import { calculateCoordinate, getClampedPoint } from './coordinateUtils';

let axisPoints = {};

const getAxisPoints = () => {
  return axisPoints;
};

const calculateRotatedLine = (
  scene,
  mouseDownVertex,
  mouseUpVertex,
  vertexIntervalRotatedBasedOnX,
  vertexIntervalRotatedBasedOnY
) => {
  let vertexIntervalVector = {};
  let vertexIntervalMidPoint = {};

  if (mouseDownVertex) {
    vertexIntervalVector = new THREE.Vector3(
      mouseUpVertex.x - mouseDownVertex.x,
      mouseUpVertex.y - mouseDownVertex.y,
      mouseUpVertex.z - mouseDownVertex.z
    );

    vertexIntervalMidPoint = new THREE.Vector3(
      (mouseDownVertex.x + mouseUpVertex.x) / 2,
      (mouseDownVertex.y + mouseUpVertex.y) / 2,
      (mouseDownVertex.z + mouseUpVertex.z) / 2
    );
  }

  const rotatedVertexIntervalVector = new THREE.Vector3(
    -vertexIntervalVector.y,
    vertexIntervalVector.x,
    vertexIntervalVector.z
  );

  const startXBasedOnX = -PAPER_BOUNDARY;
  const startXBasedOnXCoord = calculateCoordinate(
    rotatedVertexIntervalVector,
    startXBasedOnX,
    'x',
    'y',
    vertexIntervalMidPoint
  );
  const startYBasedOnX = startXBasedOnXCoord.secondaryValue;
  const startZBasedOnX = startXBasedOnXCoord.zValue;

  const endXBasedOnX = PAPER_BOUNDARY;
  const endXBasedOnXCoord = calculateCoordinate(
    rotatedVertexIntervalVector,
    endXBasedOnX,
    'x',
    'y',
    vertexIntervalMidPoint
  );
  const endYBasedOnX = endXBasedOnXCoord.secondaryValue;
  const endZBasedOnX = endXBasedOnXCoord.zValue;

  const startYBasedOnY = -PAPER_BOUNDARY;
  const startYBasedOnYCoord = calculateCoordinate(
    rotatedVertexIntervalVector,
    startYBasedOnY,
    'y',
    'x',
    vertexIntervalMidPoint
  );
  const startXBasedOnY = startYBasedOnYCoord.secondaryValue;
  const startZBasedOnY = startYBasedOnYCoord.zValue;

  const endYBasedOnY = PAPER_BOUNDARY;
  const endYBasedOnYCoord = calculateCoordinate(
    rotatedVertexIntervalVector,
    endYBasedOnY,
    'y',
    'x',
    vertexIntervalMidPoint
  );
  const endXBasedOnY = endYBasedOnYCoord.secondaryValue;
  const endZBasedOnY = endYBasedOnYCoord.zValue;

  const clampedStartBasedOnX = getClampedPoint(
    new THREE.Vector3(startXBasedOnX, startYBasedOnX, startZBasedOnX),
    vertexIntervalMidPoint
  );
  const clampedEndBasedOnX = getClampedPoint(
    new THREE.Vector3(endXBasedOnX, endYBasedOnX, endZBasedOnX),
    vertexIntervalMidPoint
  );

  const clampedStartBasedOnY = getClampedPoint(
    new THREE.Vector3(startXBasedOnY, startYBasedOnY, startZBasedOnY),
    vertexIntervalMidPoint
  );
  const clampedEndBasedOnY = getClampedPoint(
    new THREE.Vector3(endXBasedOnY, endYBasedOnY, endZBasedOnY),
    vertexIntervalMidPoint
  );

  if (vertexIntervalRotatedBasedOnX) {
    scene.remove(vertexIntervalRotatedBasedOnX);
    vertexIntervalRotatedBasedOnX = null;
  }

  if (vertexIntervalRotatedBasedOnY) {
    scene.remove(vertexIntervalRotatedBasedOnY);
    vertexIntervalRotatedBasedOnY = null;
  }

  const rotatedVertexIntervalMaterial = new THREE.LineDashedMaterial({
    color: 0xffffff,
    dashSize: DASH_SIZE,
    gapSize: DASH_SIZE,
  });

  let rotatedLineVertex = {};

  if (startXBasedOnY <= -PAPER_BOUNDARY) {
    const rotatedVertexIntervalGeometry1 =
      new THREE.BufferGeometry().setFromPoints([
        clampedStartBasedOnX,
        clampedEndBasedOnX,
      ]);

    rotatedLineVertex = { clampedStartBasedOnX, clampedEndBasedOnX };

    vertexIntervalRotatedBasedOnX = new THREE.Line(
      rotatedVertexIntervalGeometry1,
      rotatedVertexIntervalMaterial
    );

    vertexIntervalRotatedBasedOnX.computeLineDistances();
    scene.add(vertexIntervalRotatedBasedOnX);
  } else if (startXBasedOnY >= PAPER_BOUNDARY) {
    const rotatedVertexIntervalGeometry1 =
      new THREE.BufferGeometry().setFromPoints([
        clampedStartBasedOnX,
        clampedEndBasedOnX,
      ]);

    rotatedLineVertex = { clampedStartBasedOnX, clampedEndBasedOnX };

    vertexIntervalRotatedBasedOnX = new THREE.Line(
      rotatedVertexIntervalGeometry1,
      rotatedVertexIntervalMaterial
    );

    vertexIntervalRotatedBasedOnX.computeLineDistances();
    scene.add(vertexIntervalRotatedBasedOnX);
  } else if (endXBasedOnY >= PAPER_BOUNDARY) {
    const rotatedVertexIntervalGeometry1 =
      new THREE.BufferGeometry().setFromPoints([
        clampedStartBasedOnX,
        clampedEndBasedOnX,
      ]);

    rotatedLineVertex = { clampedStartBasedOnX, clampedEndBasedOnX };

    vertexIntervalRotatedBasedOnX = new THREE.Line(
      rotatedVertexIntervalGeometry1,
      rotatedVertexIntervalMaterial
    );

    vertexIntervalRotatedBasedOnX.computeLineDistances();
    scene.add(vertexIntervalRotatedBasedOnX);
  } else if (endXBasedOnY <= PAPER_BOUNDARY) {
    const rotatedVertexIntervalGeometry2 =
      new THREE.BufferGeometry().setFromPoints([
        clampedStartBasedOnY,
        clampedEndBasedOnY,
      ]);

    rotatedLineVertex = { clampedStartBasedOnY, clampedEndBasedOnY };

    vertexIntervalRotatedBasedOnY = new THREE.Line(
      rotatedVertexIntervalGeometry2,
      rotatedVertexIntervalMaterial
    );

    vertexIntervalRotatedBasedOnY.computeLineDistances();
    scene.add(vertexIntervalRotatedBasedOnY);
  }

  const startPoint = rotatedLineVertex.clampedStartBasedOnX
    ? rotatedLineVertex.clampedStartBasedOnX
    : rotatedLineVertex.clampedStartBasedOnY;
  const endPoint = rotatedLineVertex.clampedEndBasedOnX
    ? rotatedLineVertex.clampedEndBasedOnX
    : rotatedLineVertex.clampedEndBasedOnY;

  axisPoints = { startPoint, endPoint };

  return {
    vertexIntervalRotatedBasedOnX,
    vertexIntervalRotatedBasedOnY,
    axisPoints,
  };
};

export { getAxisPoints, calculateRotatedLine };
