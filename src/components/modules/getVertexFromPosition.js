import * as THREE from 'three';

const getVertexFromPosition = (allPositions, i) => {
  if (!allPositions.isBufferAttribute) {
    return allPositions[i];
  } else {
    const vertex = new THREE.Vector3();
    vertex.fromBufferAttribute(allPositions, i);
    return vertex;
  }
};

export { getVertexFromPosition };
