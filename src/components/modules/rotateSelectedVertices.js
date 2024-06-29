import * as THREE from 'three';

const rotateSelectedVertices = (
  positionAttribute,
  selectedVertices,
  totalRotation,
  steps,
  clockwise,
  rotatedData
) => {
  const stepAngle = (totalRotation / steps) * (clockwise ? 1 : -1);

  let currentStep = 0;

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
      const rotationQuaternion = new THREE.Quaternion().setFromAxisAngle(
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
          vector.applyQuaternion(rotationQuaternion);
          vector.add(pivot);
          positionAttribute.setXYZ(i, vector.x, vector.y, vector.z);
        }
      }
      positionAttribute.needsUpdate = true;
    }

    currentStep++;
    if (currentStep < steps) {
      requestAnimationFrame(performRotation);
    } else {
      for (let i = 0; i < positionAttribute.count; i++) {
        if (selectedVertices.has(i)) {
          const z = positionAttribute.getZ(i);
          if (z !== 0) {
            if (z < 0) {
              positionAttribute.setZ(i, z + 0.02);
            } else {
              positionAttribute.setZ(i, z - 0.02);
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
