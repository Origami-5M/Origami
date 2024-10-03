import * as THREE from 'three';
import { THRESHOLD } from '../../../constants/paper';

const interpolatePoints = (start, end, numPoints) => {
  const points = [];

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const x = start.x + t * (end.x - start.x);
    const y = start.y + t * (end.y - start.y);
    const z = start.z + t * (end.z - start.z);
    points.push(new THREE.Vector3(x, y, z));
  }

  return points;
};

export const generateBorderPoints = (corners, pointsPerEdge = 9) => {
  const borderPoints = [];

  for (let i = 0; i < corners.length; i++) {
    const start = corners[i];
    const end = corners[(i + 1) % corners.length];
    const interpolatedPoints = interpolatePoints(start, end, pointsPerEdge);
    borderPoints.push(...interpolatedPoints);
  }

  return borderPoints;
};

export const getMousePositionIn3D = (
  event,
  containerRef,
  raycaster,
  camera,
  scene
) => {
  const rect = containerRef.current.getBoundingClientRect();
  const mouse = new THREE.Vector2(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1
  );

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  return intersects.length > 0 ? intersects[0].point : null;
};

export const findClosestMesh = (mouse3DPoint, borderVertices) => {
  if (!mouse3DPoint) return null;

  let closestVertex = null;
  let minDistance = Infinity;

  for (let i = 1; i < borderVertices.length; i++) {
    const distance = mouse3DPoint.distanceTo(borderVertices[i]);
    if (distance < THRESHOLD && distance < minDistance) {
      minDistance = distance;
      closestVertex = borderVertices[i];
    }
  }

  return closestVertex;
};
