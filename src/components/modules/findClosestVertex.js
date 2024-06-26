import * as THREE from 'three';

const findClosestVertex = (intersectPoint, borderVertices) => {
  let minDistance = Infinity;
  let closestVertex = {};
  let closestVertexIndex = -1;

  for (let i = 0; i < borderVertices.length; i++) {
    const vertex = new THREE.Vector3(
      borderVertices[i].x,
      borderVertices[i].y,
      borderVertices[i].z
    );
    const distance = vertex.distanceTo(intersectPoint);

    if (distance < minDistance) {
      minDistance = distance;
      closestVertex = vertex;
      closestVertexIndex = i;
    }
  }

  return { closestVertex, closestVertexIndex, minDistance };
};

export { findClosestVertex };
