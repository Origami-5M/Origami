import * as THREE from 'three';
import { Z_GAP } from '../../constants';
import { mode, nowStep } from './guideModules';

const rotateSelectedVertices = (
  positionAttribute,
  selectedVertices,
  totalRotation,
  frames,
  clockwise,
  rotatedData
) => {
  const stepAngle = (totalRotation / frames) * (clockwise ? 1 : -1);

  let currentFrame = 0;

  const performRotation = () => {
    const startPoint = rotatedData.startPoint;
    const endPoint = rotatedData.endPoint;

    if (startPoint && endPoint) {
      const direction = new THREE.Vector3()
        .subVectors(endPoint, startPoint)
        .normalize();

      const pivot = new THREE.Vector3()
        .addVectors(startPoint, endPoint)
        .multiplyScalar(0.5);
      const unfoldQuaternion = new THREE.Quaternion().setFromAxisAngle(
        direction,
        stepAngle
      );

      const vector = new THREE.Vector3();
      for (let i = 0; i < positionAttribute.count; i++) {
        if (selectedVertices.has(i)) {
          const x = positionAttribute.getX(i);
          const y = positionAttribute.getY(i);
          const z = positionAttribute.getZ(i);
          vector.set(x, y, z);

          vector.sub(pivot);
          vector.applyQuaternion(unfoldQuaternion);
          vector.add(pivot);
          positionAttribute.setXYZ(i, vector.x, vector.y, vector.z);
        }
      }
      positionAttribute.needsUpdate = true;
    }

    currentFrame++;
    if (currentFrame < frames) {
      requestAnimationFrame(performRotation);
    } else {
      for (let i = 0; i < positionAttribute.count; i++) {
        if (selectedVertices.has(i)) {
          const z = positionAttribute.getZ(i);
          if (z !== 0) {
            if (z < 0) {
              if ((mode === 'puppy' && nowStep === 3) || nowStep === 11) {
                positionAttribute.setZ(i, z + Z_GAP * 2);
              } else {
                positionAttribute.setZ(i, z + Z_GAP);
              }
            } else {
              positionAttribute.setZ(i, z - Z_GAP);
            }
          }
        }
      }
      positionAttribute.needsUpdate = true;
    }
  };

  performRotation();
};

const findAndSelectClosestVertices = (
  positions,
  positionAttribute,
  selectedVertices
) => {
  const vertex = new THREE.Vector3();

  positions.forEach(target => {
    const targetPosition = new THREE.Vector3(target.x, target.y, target.z);
    let minDistance = Infinity;
    let closestVertexIndex = -1;

    for (let i = 0; i < positionAttribute.count; i++) {
      vertex.fromBufferAttribute(positionAttribute, i);
      const distance = vertex.distanceTo(targetPosition);

      if (distance < minDistance) {
        minDistance = distance;
        closestVertexIndex = i;
      }
    }

    if (closestVertexIndex !== -1) {
      selectedVertices.add(closestVertexIndex);
    }
  });
};

export { rotateSelectedVertices, findAndSelectClosestVertices };
