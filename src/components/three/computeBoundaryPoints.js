import * as THREE from 'three';
import { AXIS_BOUNDARY, DASH_SIZE } from '../../constants/paper';

export const computeBoundaryPoints = vertices => {
  const points = vertices.map(v => new THREE.Vector2(v.x, v.y));
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
  return lowerPoints
    .concat(upperPoints)
    .map(p => new THREE.Vector3(p.x, p.y, 0));
};

const isLeftTurn = (referencePoint, currentPoint, nextPoint) => {
  return (
    (currentPoint.x - referencePoint.x) * (nextPoint.y - referencePoint.y) -
      (currentPoint.y - referencePoint.y) * (nextPoint.x - referencePoint.x) >
    0
  );
};

export const calculateRotatedLine = (
  scene,
  mouseDownVertex,
  mouseUpVertex,
  paperVertices
) => {
  const boundaryPoints = computeBoundaryPoints(paperVertices);

  const midpoint = new THREE.Vector3(
    (mouseDownVertex.x + mouseUpVertex.x) / 2,
    (mouseDownVertex.y + mouseUpVertex.y) / 2,
    (mouseDownVertex.z + mouseUpVertex.z) / 2
  );

  const direction = new THREE.Vector3()
    .subVectors(mouseUpVertex, mouseDownVertex)
    .normalize();

  const rotatedDirection = new THREE.Vector3(
    -direction.y,
    direction.x,
    direction.z
  ).normalize();

  const startPoint = extendToBoundary(
    midpoint,
    rotatedDirection,
    boundaryPoints
  ).add(new THREE.Vector3(0, 0, 0.01));

  const endPoint = extendToBoundary(
    midpoint,
    rotatedDirection.negate(),
    boundaryPoints
  ).add(new THREE.Vector3(0, 0, 0.01));

  const geometry = new THREE.BufferGeometry().setFromPoints([
    startPoint,
    endPoint,
  ]);
  const material = new THREE.LineDashedMaterial({
    color: 0xff0000,
    dashSize: DASH_SIZE,
    gapSize: DASH_SIZE,
  });

  const rotatedLine = new THREE.Line(geometry, material);
  rotatedLine.computeLineDistances();

  scene.children = scene.children.filter(child => child.type !== 'Line');
  scene.add(rotatedLine);

  return { startPoint, endPoint };
};

const extendToBoundary = (midpoint, direction, boundaryPoints) => {
  let intersection1 = findIntersection(midpoint, direction, boundaryPoints);
  let intersection2 = findIntersection(
    midpoint,
    direction.clone().negate(),
    boundaryPoints
  );

  return (
    intersection1 ||
    intersection2 ||
    midpoint.clone().add(direction.multiplyScalar(AXIS_BOUNDARY))
  );
};

const findIntersection = (midpoint, direction, boundaryPoints) => {
  let closestIntersection = null;
  let minDistance = Infinity;

  for (let i = 0; i < boundaryPoints.length; i++) {
    const currentPoint = boundaryPoints[i];
    const nextPoint = boundaryPoints[(i + 1) % boundaryPoints.length];
  }

  return (
    closestIntersection ||
    midpoint.clone().add(direction.clone().multiplyScalar(AXIS_BOUNDARY))
  );
};

export const updateBoundaryAndAxis = (
  scene,
  paperVertices,
  mouseDownVertex,
  mouseUpVertex
) => {
  const axisPoints = calculateRotatedLine(
    scene,
    mouseDownVertex,
    mouseUpVertex,
    paperVertices
  );
  return axisPoints;
};
