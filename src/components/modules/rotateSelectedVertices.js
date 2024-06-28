import * as THREE from 'three';
import { getAxisPoints } from './axisCalculations';
import { geometry } from '../../three/Paper';

const rotateSelectedVertices = (
  selectedVertices,
  totalRotation = Math.PI,
  steps = 180,
  interval = 16,
  clockwise = true
) => {
  const stepAngle = (totalRotation / steps) * (clockwise ? 1 : -1);
  let currentStep = 0;

  const performRotation = () => {
    const axisPoints = getAxisPoints();
    const startPoint = axisPoints.startPoint;
    const endPoint = axisPoints.endPoint;

    if (startPoint && endPoint) {
      const direction = new THREE.Vector3()
        .subVectors(startPoint, endPoint)
        .normalize();

      const pivot = startPoint.clone();
      const quaternion = new THREE.Quaternion().setFromAxisAngle(
        direction,
        stepAngle
      );

      const positionAttribute = geometry.attributes.position;

      const vector = new THREE.Vector3();
      for (let i = 0; i < positionAttribute.count; i++) {
        if (selectedVertices.has(i)) {
          const x = positionAttribute.getX(i);
          const y = positionAttribute.getY(i);
          const z = positionAttribute.getZ(i);
          vector.set(x, y, z);

          vector.sub(pivot);
          vector.applyQuaternion(quaternion);
          vector.add(pivot);
          positionAttribute.setXYZ(i, vector.x, vector.y, vector.z);
        }
      }
      positionAttribute.needsUpdate = true;
    }

    currentStep++;

    if (currentStep < steps) {
      setTimeout(performRotation, interval);
    }
  };

  performRotation();
};

/**
 *  x,y,z를 인덱스로 바꿔서 저장시키는 함수
 * @param {*} positions
 * @param {*} geometry
 * @param {*} selectedVertices 선택된 x,y,z 의 좌표
 */
const findAndSelectClosestVertices = (
  positions,
  geometry,
  selectedVertices
) => {
  const positionAttribute = geometry.attributes.position;
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
