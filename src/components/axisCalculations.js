import * as THREE from 'three';

const PAPER_BOUNDARY = 1.5;

export const calculateRotatedLine = (
  scene,
  mouseDownVertex,
  mouseUpVertex,
  vertexIntervalRotatedBasedOnX,
  vertexIntervalRotatedBasedOnY
) => {
  const vertexIntervalVector = new THREE.Vector3(
    mouseUpVertex.x - mouseDownVertex.x,
    mouseUpVertex.y - mouseDownVertex.y,
    mouseUpVertex.z - mouseDownVertex.z
  );

  const vertexIntervalMidPoint = new THREE.Vector3(
    (mouseDownVertex.x + mouseUpVertex.x) / 2,
    (mouseDownVertex.y + mouseUpVertex.y) / 2,
    (mouseDownVertex.z + mouseUpVertex.z) / 2
  );

  const rotatedVertexIntervalVector = new THREE.Vector3(
    -vertexIntervalVector.y,
    vertexIntervalVector.x,
    vertexIntervalVector.z
  );

  const adjustCoordinateRange = (
    startPoint,
    endPoint,
    primaryAxis,
    secondaryAxis
  ) => {
    if (startPoint[primaryAxis] < -PAPER_BOUNDARY) {
      const scaleFactor =
        (-PAPER_BOUNDARY - endPoint[primaryAxis]) /
        (startPoint[primaryAxis] - endPoint[primaryAxis]);
      startPoint[primaryAxis] = -PAPER_BOUNDARY;
      startPoint[secondaryAxis] +=
        scaleFactor * (endPoint[secondaryAxis] - startPoint[secondaryAxis]);
      startPoint.z += scaleFactor * (endPoint.z - startPoint.z);
    } else if (startPoint[primaryAxis] > PAPER_BOUNDARY) {
      const scaleFactor =
        (PAPER_BOUNDARY - endPoint[primaryAxis]) /
        (startPoint[primaryAxis] - endPoint[primaryAxis]);
      startPoint[primaryAxis] = PAPER_BOUNDARY;
      startPoint[secondaryAxis] +=
        scaleFactor * (endPoint[secondaryAxis] - startPoint[secondaryAxis]);
      startPoint.z += scaleFactor * (endPoint.z - startPoint.z);
    }

    return startPoint;
  };

  const getClampedPoint = (startPoint, endPoint) => {
    startPoint = adjustCoordinateRange(startPoint, endPoint, 'x', 'y');
    startPoint = adjustCoordinateRange(startPoint, endPoint, 'y', 'x');
    return startPoint;
  };

  const calculateCoordinate = (
    intervalVector,
    boundary,
    primaryAxis,
    secondaryAxis
  ) => {
    const primaryValue = boundary;
    const secondaryValue =
      vertexIntervalMidPoint[secondaryAxis] +
      ((primaryValue - vertexIntervalMidPoint[primaryAxis]) *
        intervalVector[secondaryAxis]) /
        intervalVector[primaryAxis];
    const zValue =
      vertexIntervalMidPoint.z +
      ((primaryValue - vertexIntervalMidPoint[primaryAxis]) *
        intervalVector.z) /
        intervalVector[primaryAxis];
    return { primaryValue, secondaryValue, zValue };
  };

  const startXBasedOnX = -PAPER_BOUNDARY;
  const startXBasedOnXCoord = calculateCoordinate(
    rotatedVertexIntervalVector,
    startXBasedOnX,
    'x',
    'y'
  );
  const startYBasedOnX = startXBasedOnXCoord.secondaryValue;
  const startZBasedOnX = startXBasedOnXCoord.zValue;

  const endXBasedOnX = PAPER_BOUNDARY;
  const endXBasedOnXCoord = calculateCoordinate(
    rotatedVertexIntervalVector,
    endXBasedOnX,
    'x',
    'y'
  );
  const endYBasedOnX = endXBasedOnXCoord.secondaryValue;
  const endZBasedOnX = endXBasedOnXCoord.zValue;

  const startYBasedOnY = -PAPER_BOUNDARY;
  const startYBasedOnYCoord = calculateCoordinate(
    rotatedVertexIntervalVector,
    startYBasedOnY,
    'y',
    'x'
  );
  const startXBasedOnY = startYBasedOnYCoord.secondaryValue;
  const startZBasedOnY = startYBasedOnYCoord.zValue;

  const endYBasedOnY = PAPER_BOUNDARY;
  const endYBasedOnYCoord = calculateCoordinate(
    rotatedVertexIntervalVector,
    endYBasedOnY,
    'y',
    'x'
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
  }

  if (vertexIntervalRotatedBasedOnY) {
    scene.remove(vertexIntervalRotatedBasedOnY);
  }

  const rotatedVertexIntervalMaterial = new THREE.LineDashedMaterial({
    color: 0xffffff,
    dashSize: 0.02,
    gapSize: 0.02,
  });

  if (startXBasedOnY <= -PAPER_BOUNDARY) {
    const rotatedVertexIntervalGeometry1 =
      new THREE.BufferGeometry().setFromPoints([
        clampedStartBasedOnX,
        clampedEndBasedOnX,
      ]);

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

    vertexIntervalRotatedBasedOnY = new THREE.Line(
      rotatedVertexIntervalGeometry2,
      rotatedVertexIntervalMaterial
    );

    vertexIntervalRotatedBasedOnY.computeLineDistances();
    scene.add(vertexIntervalRotatedBasedOnY);
  }

  return { vertexIntervalRotatedBasedOnX, vertexIntervalRotatedBasedOnY };
};
