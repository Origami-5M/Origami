import * as THREE from 'three';

export const findClosestVertex = (intersectPoint, borderVertices) => {
  let minDistance = Infinity;
  let closestVertex = null;

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
    }
  }

  return closestVertex;
};

export const createVertexIntervalLine = (
  scene,
  clickedRedMarker,
  closestVertex,
  vertexIntervalLine
) => {
  const MouseDownVertex = clickedRedMarker.position;
  const MouseUpVertex = closestVertex.clone();

  if (vertexIntervalLine) {
    scene.remove(vertexIntervalLine);
  }

  const vertexIntervalGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(MouseDownVertex.x, MouseDownVertex.y, MouseDownVertex.z),
    new THREE.Vector3(MouseUpVertex.x, MouseUpVertex.y, MouseUpVertex.z),
  ]);

  const vertexIntervalMaterial = new THREE.LineBasicMaterial({
    color: 0xff0000,
  });

  vertexIntervalLine = new THREE.Line(
    vertexIntervalGeometry,
    vertexIntervalMaterial
  );

  return vertexIntervalLine;
};
