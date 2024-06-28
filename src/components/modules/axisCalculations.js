import * as THREE from 'three';
import { DASH_SIZE } from '../../constants';

let axisPoints = {};

const getAxisPoints = () => axisPoints;

const computeConvexHull = points => {
  points.sort((a, b) => a.x - b.x || a.y - b.y);

  const lower = [];
  for (let point of points) {
    while (
      lower.length >= 2 &&
      !isLeftTurn(lower[lower.length - 2], lower[lower.length - 1], point)
    ) {
      lower.pop();
    }
    lower.push(point);
  }

  const upper = [];
  for (let i = points.length - 1; i >= 0; i--) {
    let point = points[i];
    while (
      upper.length >= 2 &&
      !isLeftTurn(upper[upper.length - 2], upper[upper.length - 1], point)
    ) {
      upper.pop();
    }
    upper.push(point);
  }

  upper.pop();
  lower.pop();
  return lower.concat(upper);
};

const isLeftTurn = (a, b, c) => {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x) > 0;
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

  const hull = computeConvexHull(paperVerticesList);

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

  let startPoint = extendToBoundary(midpoint, rotatedDirection, hull, -1);
  let endPoint = extendToBoundary(midpoint, rotatedDirection, hull, 1);

  if (
    !isFinite(startPoint.x) ||
    !isFinite(startPoint.y) ||
    !isFinite(startPoint.z) ||
    !isFinite(endPoint.x) ||
    !isFinite(endPoint.y) ||
    !isFinite(endPoint.z)
  ) {
    console.error('Invalid start or end point:', startPoint, endPoint);
    return;
  }

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

  paperVertices.needsUpdate = true;
  scene.children.forEach(child => {
    if (child.geometry && child.geometry.attributes.position) {
      child.geometry.attributes.position.needsUpdate = true;
    }
  });

  axisPoints = { startPoint, endPoint };

  return { rotatedLine, axisPoints };
};

const extendToBoundary = (midpoint, direction, hull, scale) => {
  let closestIntersection = null;
  let minDistance = Infinity;

  for (let i = 0; i < hull.length; i++) {
    const a = hull[i];
    const b = hull[(i + 1) % hull.length];
    const intersection = getIntersection(midpoint, direction, a, b, scale);

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
      midpoint.x + direction.x * 10000,
      midpoint.y + direction.y * 10000,
      midpoint.z + direction.z * 10000
    )
  );
};

const getIntersection = (midpoint, direction, a, b, scale) => {
  const dir = new THREE.Vector3().copy(direction).multiplyScalar(scale);
  const lineEnd = new THREE.Vector3().copy(midpoint).add(dir);

  const p1 = midpoint;
  const d1 = new THREE.Vector3().subVectors(lineEnd, midpoint);

  const p2 = a;
  const d2 = new THREE.Vector3().subVectors(b, a);

  const d1CrossD2 = new THREE.Vector3().crossVectors(d1, d2);
  const denom = d1CrossD2.lengthSq();

  if (denom === 0) {
    return null;
  }

  const p2SubP1 = new THREE.Vector3().subVectors(p2, p1);
  const t1 =
    new THREE.Vector3().crossVectors(p2SubP1, d2).dot(d1CrossD2) / denom;

  if (t1 < 0) {
    return null;
  }

  const intersection = new THREE.Vector3().addVectors(
    p1,
    d1.multiplyScalar(t1)
  );
  return intersection;
};

export { getAxisPoints, calculateRotatedLine };
