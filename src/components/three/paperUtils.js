import * as THREE from 'three';
import { findClosestVertex } from './ClosestVertex';

export const calculateMousePosition = (event, camera) => {
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  return mouse;
};

export const getIntersectionPoint = (mouse, camera, raycaster, meshRef) => {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(meshRef.current);
  return intersects.length > 0 ? intersects[0].point : null;
};

export const handlePointerEvent = (
  event,
  setPoint,
  logMessage,
  camera,
  raycaster,
  meshRef,
  paperCorners
) => {
  const mouse = calculateMousePosition(event, camera);
  const intersectionPoint = getIntersectionPoint(
    mouse,
    camera,
    raycaster,
    meshRef
  );

  if (intersectionPoint) {
    const closestVertex = findClosestVertex(intersectionPoint, paperCorners);

    if (closestVertex) {
      setPoint(closestVertex);
      return closestVertex;
    }
  }
};
