import * as THREE from 'three';

export const calculateMousePosition = event => {
  const mouse = new THREE.Vector3();
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
  meshRef
) => {
  const mouse = calculateMousePosition(event);
  const point = getIntersectionPoint(mouse, camera, raycaster, meshRef);
  if (point) {
    setPoint(point);
  }
};
