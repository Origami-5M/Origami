import * as THREE from 'three';
import { Z_GAP } from '../../../constants/paper';
import { GUIDE_IMAGES, GUIDE_STEPS } from '../../../constants/guide';

const rotateVector = (vector, pivot, quaternion) => {
  vector.sub(pivot);
  vector.applyQuaternion(quaternion);
  vector.add(pivot);
  return vector;
};

const updateVertexZPosition = (positionAttribute, selectedVertices) => {
  for (let i = 0; i < positionAttribute.count; i++) {
    if (selectedVertices.has(i)) {
      const z = positionAttribute.getZ(i);
      if (z !== 0) {
        const zAdjustment =
          (GUIDE_IMAGES === 'puppy' && GUIDE_STEPS === 3) || GUIDE_STEPS === 11
            ? Z_GAP * 2
            : Z_GAP;
        positionAttribute.setZ(i, z < 0 ? z + zAdjustment : z - zAdjustment);
      }
    }
  }
  positionAttribute.needsUpdate = true;
};

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
    const { startPoint, endPoint } = rotatedData;

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

      const positionArray = positionAttribute.array;
      const itemSize = positionAttribute.itemSize;

      for (let i = 0; i < positionAttribute.count; i++) {
        if (selectedVertices.has(i)) {
          const index = i * itemSize;
          const vector = new THREE.Vector3(
            positionArray[index],
            positionArray[index + 1],
            positionArray[index + 2]
          );

          const rotatedVector = rotateVector(vector, pivot, unfoldQuaternion);

          positionArray[index] = rotatedVector.x;
          positionArray[index + 1] = rotatedVector.y;
          positionArray[index + 2] = rotatedVector.z;
        }
      }
      positionAttribute.needsUpdate = true;
    }

    currentFrame++;
    if (currentFrame < frames) {
      requestAnimationFrame(performRotation);
    } else {
      updateVertexZPosition(positionAttribute, selectedVertices);
    }
  };

  performRotation();
};

const findAndSelectClosestVertices = (
  positions,
  positionAttribute,
  selectedVertices
) => {
  const positionArray = positionAttribute.array;
  const itemSize = positionAttribute.itemSize;

  positions.forEach(target => {
    let minDistance = Infinity;
    let closestVertexIndex = -1;

    for (let i = 0; i < positionAttribute.count; i++) {
      const index = i * itemSize;

      const dx = target.x - positionArray[index];
      const dy = target.y - positionArray[index + 1];
      const dz = target.z - positionArray[index + 2];
      const distance = dx * dx + dy * dy + dz * dz;

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

function handleFoldedMeshClick(rotateData, raycaster, setSelectedRotateData) {
  if (rotateData && rotateData.length > 0) {
    const foldedMeshes = rotateData
      .map((data, index) => {
        if (data && data.rotateVertices && data.rotateVertices.length > 0) {
          const mesh = createFoldedMesh(data.rotateVertices);
          mesh.userData.rotateDataIndex = index;
          return mesh;
        }
        return null;
      })
      .filter(mesh => mesh !== null);

    if (foldedMeshes.length > 0) {
      const intersects = raycaster.intersectObjects(foldedMeshes);

      if (intersects.length > 0) {
        console.log('접힌 면을 클릭했습니다.');
        const intersectedObject = intersects[0].object;
        const dataIndex = intersectedObject.userData.rotateDataIndex;
        const clickedData = rotateData[dataIndex];

        setSelectedRotateData(clickedData);
      } else {
        console.log('빈 공간을 클릭했습니다.');
      }
    }
  }
}

const createFoldedMesh = rotateVertices => {
  const geometry = new THREE.BufferGeometry();

  const positions = new Float32Array(rotateVertices.length * 3);
  for (let i = 0; i < rotateVertices.length; i++) {
    positions[i * 3] = rotateVertices[i].vertex.x;
    positions[i * 3 + 1] = rotateVertices[i].vertex.y;
    positions[i * 3 + 2] = rotateVertices[i].vertex.z;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const indices = [];
  for (let i = 0; i < rotateVertices.length - 2; i++) {
    indices.push(0, i + 1, i + 2);
  }
  geometry.setIndex(indices);

  const material = new THREE.MeshBasicMaterial({ visible: false });
  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
};

export {
  rotateSelectedVertices,
  findAndSelectClosestVertices,
  handleFoldedMeshClick,
};
