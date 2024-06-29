import * as THREE from 'three';
import { DASH_SIZE, AXIS_BOUNDARY } from '../../constants';

let axisPoints = {};

const getAxisPoints = () => axisPoints;

const computeBoundaryPoints = points => {
  points.sort((a, b) => a.x - b.x || a.y - b.y);

  const lowerPoints = [];
  for (let point of points) {
    while (
      lowerPoints.length >= 2 &&
      !isLeftTurn(
        lowerPoints[lowerPoints.length - 2],
        lowerPoints[lowerPoints.length - 1],
        point
      )
    ) {
      lowerPoints.pop();
    }
    lowerPoints.push(point);
  }

  const upperPoints = [];
  for (let i = points.length - 1; i >= 0; i--) {
    let point = points[i];
    while (
      upperPoints.length >= 2 &&
      !isLeftTurn(
        upperPoints[upperPoints.length - 2],
        upperPoints[upperPoints.length - 1],
        point
      )
    ) {
      upperPoints.pop();
    }
    upperPoints.push(point);
  }

  upperPoints.pop();
  lowerPoints.pop();
  return lowerPoints.concat(upperPoints);
};

const isLeftTurn = (referencePoint, currentPoint, nextPoint) => {
  return (
    (currentPoint.x - referencePoint.x) * (nextPoint.y - referencePoint.y) -
      (currentPoint.y - referencePoint.y) * (nextPoint.x - referencePoint.x) >
    0
  );
};

const calculateRotatedLine = (
  scene,
  mouseDownVertex,
  mouseUpVertex,
  paperVertices
) => {
  const position = paperVertices.array;
  const paperVerticesList = [];
  for (let i = 0; i < position.length; i += 3) {
    paperVerticesList.push(
      new THREE.Vector3(position[i], position[i + 1], position[i + 2])
    );
  }

  const boundaryPoint = computeBoundaryPoints(paperVerticesList);

  const midpoint = new THREE.Vector3(
    (mouseDownVertex.x + mouseUpVertex.x) / 2,
    (mouseDownVertex.y + mouseUpVertex.y) / 2,
    (mouseDownVertex.z + mouseUpVertex.z) / 2
  );

  const direction = new THREE.Vector3(
    mouseUpVertex.x - mouseDownVertex.x,
    mouseUpVertex.y - mouseDownVertex.y,
    mouseUpVertex.z - mouseDownVertex.z
  ).normalize();

  const rotatedDirection = new THREE.Vector3(
    -direction.y,
    direction.x,
    direction.z
  ).normalize();

  let startPoint = extendToBoundary(
    midpoint,
    rotatedDirection,
    boundaryPoint,
    -1
  );
  let endPoint = extendToBoundary(midpoint, rotatedDirection, boundaryPoint, 1);

  const geometry = new THREE.BufferGeometry().setFromPoints([
    startPoint,
    endPoint,
  ]);
  const material = new THREE.LineDashedMaterial({
    color: 0xffffff,
    dashSize: DASH_SIZE,
    gapSize: DASH_SIZE,
  });

  const rotatedLine = new THREE.Line(geometry, material);
  rotatedLine.computeLineDistances();

  scene.children.forEach(child => {
    if (child.geometry && child.geometry.attributes.position) {
      child.geometry.attributes.position.needsUpdate = true;
    }
  });

  axisPoints = { startPoint, endPoint };

  return { rotatedLine, axisPoints };
};

const extendToBoundary = (midpoint, direction, boundaryPoint, scale) => {
  let closestIntersection = null;
  let minDistance = Infinity;

  for (let i = 0; i < boundaryPoint.length; i++) {
    const currentPoint = boundaryPoint[i];
    const nextPoint = boundaryPoint[(i + 1) % boundaryPoint.length];
    const intersection = getIntersection(
      midpoint,
      direction,
      currentPoint,
      nextPoint,
      scale
    );

    if (intersection) {
      const distance = midpoint.distanceTo(intersection);
      if (distance < minDistance) {
        minDistance = distance;
        closestIntersection = intersection;
      }
    }
  }

  return (
    closestIntersection ||
    new THREE.Vector3(
      midpoint.x + direction.x * AXIS_BOUNDARY,
      midpoint.y + direction.y * AXIS_BOUNDARY,
      midpoint.z + direction.z * AXIS_BOUNDARY
    )
  );
};

const getIntersection = (midpoint, direction, pointA, pointB, scale) => {
  const scaledDirection = new THREE.Vector3()
    .copy(direction)
    .multiplyScalar(scale);
  const lineEnd = new THREE.Vector3().copy(midpoint).add(scaledDirection);

  const start = midpoint;
  const rayDirection = new THREE.Vector3().subVectors(lineEnd, start);

  const linePoint = pointA;
  const lineDirection = new THREE.Vector3().subVectors(pointB, pointA);

  const crossProduct = new THREE.Vector3().crossVectors(
    rayDirection,
    lineDirection
  );
  const denominator = crossProduct.lengthSq();

  if (denominator === 0) {
    return null;
  }

  const startToPoint = new THREE.Vector3().subVectors(linePoint, start);
  const intersectionCoefficient =
    new THREE.Vector3()
      .crossVectors(startToPoint, lineDirection)
      .dot(crossProduct) / denominator;

  if (intersectionCoefficient < 0) {
    return null;
  }

  const intersectionPoint = new THREE.Vector3().addVectors(
    start,
    rayDirection.multiplyScalar(intersectionCoefficient)
  );
  return intersectionPoint;
};

export { getAxisPoints, calculateRotatedLine };
