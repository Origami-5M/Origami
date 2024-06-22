import * as THREE from 'three';

export const calculateRotatedLine = (
  scene,
  MouseDownVertex,
  MouseUpVertex,
  createPointsMarker,
  vertexIntervalRotatedLine
) => {
  const vertexIntervalVector = new THREE.Vector3(
    MouseUpVertex.x - MouseDownVertex.x,
    MouseUpVertex.y - MouseDownVertex.y,
    MouseUpVertex.z - MouseDownVertex.z
  );

  const vertexIntervalMidPoint = new THREE.Vector3(
    (MouseDownVertex.x + MouseUpVertex.x) / 2,
    (MouseDownVertex.y + MouseUpVertex.y) / 2,
    (MouseDownVertex.z + MouseUpVertex.z) / 2
  );

  const rotatedVertexIntervalVector = new THREE.Vector3(
    -vertexIntervalVector.y,
    vertexIntervalVector.x,
    vertexIntervalVector.z
  );

  const createMarkerAtPoint = (x, y, z) => {
    if (x >= -1.5 && x <= 1.5 && y >= -1.5 && y <= 1.5) {
      const marker = createPointsMarker(0x00ff00);
      marker.position.set(x, y, z);
      marker.visible = true;
      scene.add(marker);
      return true;
    }
    return false;
  };

  const rotatedLineStartX = -1.5;
  const rotatedLineStartY =
    vertexIntervalMidPoint.y +
    ((rotatedLineStartX - vertexIntervalMidPoint.x) *
      rotatedVertexIntervalVector.y) /
      rotatedVertexIntervalVector.x;
  const rotatedLineStartZ =
    vertexIntervalMidPoint.z +
    ((rotatedLineStartX - vertexIntervalMidPoint.x) *
      rotatedVertexIntervalVector.z) /
      rotatedVertexIntervalVector.x;

  const rotatedLineEndX = 1.5;
  const rotatedLineEndY =
    vertexIntervalMidPoint.y +
    ((rotatedLineEndX - vertexIntervalMidPoint.x) *
      rotatedVertexIntervalVector.y) /
      rotatedVertexIntervalVector.x;
  const rotatedLineEndZ =
    vertexIntervalMidPoint.z +
    ((rotatedLineEndX - vertexIntervalMidPoint.x) *
      rotatedVertexIntervalVector.z) /
      rotatedVertexIntervalVector.x;

  const AdjustCoordinateRange = (
    startPoint,
    endPoint,
    primaryAxis,
    secondaryAxis
  ) => {
    if (startPoint[primaryAxis] < -1.5) {
      const scaleFactor =
        (-1.5 - endPoint[primaryAxis]) /
        (startPoint[primaryAxis] - endPoint[primaryAxis]);
      startPoint[primaryAxis] = -1.5;
      startPoint[secondaryAxis] +=
        scaleFactor * (endPoint[secondaryAxis] - startPoint[secondaryAxis]);
      startPoint.z += scaleFactor * (endPoint.z - startPoint.z);
    } else if (startPoint[primaryAxis] > 1.5) {
      const scaleFactor =
        (1.5 - endPoint[primaryAxis]) /
        (startPoint[primaryAxis] - endPoint[primaryAxis]);
      startPoint[primaryAxis] = 1.5;
      startPoint[secondaryAxis] +=
        scaleFactor * (endPoint[secondaryAxis] - startPoint[secondaryAxis]);
      startPoint.z += scaleFactor * (endPoint.z - startPoint.z);
    }

    return startPoint;
  };

  const getClampedPoint = (startPoint, endPoint) => {
    startPoint = AdjustCoordinateRange(startPoint, endPoint, 'x', 'y');
    startPoint = AdjustCoordinateRange(startPoint, endPoint, 'y', 'x');
    return startPoint;
  };

  const clampedStartPoint = getClampedPoint(
    new THREE.Vector3(rotatedLineStartX, rotatedLineStartY, rotatedLineStartZ),
    vertexIntervalMidPoint
  );
  const clampedEndPoint = getClampedPoint(
    new THREE.Vector3(rotatedLineEndX, rotatedLineEndY, rotatedLineEndZ),
    vertexIntervalMidPoint
  );

  if (vertexIntervalRotatedLine) {
    scene.remove(vertexIntervalRotatedLine);
  }

  if (
    createMarkerAtPoint(
      clampedStartPoint.x,
      clampedStartPoint.y,
      clampedStartPoint.z
    ) &&
    createMarkerAtPoint(clampedEndPoint.x, clampedEndPoint.y, clampedEndPoint.z)
  ) {
    if (vertexIntervalRotatedLine) {
      scene.remove(vertexIntervalRotatedLine);
    }

    const rotatedVertexIntervalGeometry =
      new THREE.BufferGeometry().setFromPoints([
        clampedStartPoint,
        clampedEndPoint,
      ]);

    const rotatedVertexIntervalMaterial = new THREE.LineBasicMaterial({
      color: 0x0000ff,
    });

    vertexIntervalRotatedLine = new THREE.Line(
      rotatedVertexIntervalGeometry,
      rotatedVertexIntervalMaterial
    );

    scene.add(vertexIntervalRotatedLine);
  }
  return vertexIntervalRotatedLine;
};
