import { borderVertices } from './makeVertices';

const updateVertexPosition = (allPositions, i, vertex, nowFace) => {
  if (!allPositions.isBufferAttribute) {
    borderVertices[i] = { x: vertex.x, y: vertex.y, z: vertex.z };
  } else {
    nowFace.push({ x: vertex.x, y: vertex.y, z: vertex.z });
    allPositions.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }
};

export { updateVertexPosition };
