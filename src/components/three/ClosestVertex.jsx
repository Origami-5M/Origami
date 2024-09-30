import { useMemo, useEffect } from 'react';
import * as THREE from 'three';

const interpolatePoints = (start, end, numPoints) => {
  const points = [];

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const x = start.x + t * (end.x - start.x);
    const y = start.y + t * (end.y - start.y);
    const z = start.z + t * (end.z - start.z);
    points.push(new THREE.Vector3(x, y, z));
  }

  return points;
};

const generateBorderPoints = (corners, pointsPerEdge = 9) => {
  const borderPoints = [];

  for (let i = 0; i < corners.length; i++) {
    const start = corners[i];
    const end = corners[(i + 1) % corners.length];
    const interpolatedPoints = interpolatePoints(start, end, pointsPerEdge);
    borderPoints.push(...interpolatedPoints);
  }

  return borderPoints;
};

const findClosestVertex = (point, vertices) => {
  let closestVertex = vertices[0];
  let minDistance = point.distanceTo(vertices[0]);

  for (let i = 1; i < vertices.length; i++) {
    const distance = point.distanceTo(vertices[i]);

    if (distance < minDistance) {
      minDistance = distance;
      closestVertex = vertices[i];
    }
  }

  return closestVertex;
};

const BorderPoints = ({
  corners,
  pointsPerEdge = 9,
  clickPoint,
  mouseUpPoint,
}) => {
  const borderVertices = useMemo(
    () => generateBorderPoints(corners, pointsPerEdge),
    [corners, pointsPerEdge]
  );

  const updateClosestVertices = () => {
    if (clickPoint) {
      const closestClickVertex = findClosestVertex(clickPoint, borderVertices);
      console.log('클릭 후 가장 가까운 정점:', closestClickVertex);
    }

    if (mouseUpPoint) {
      const closestMouseUpVertex = findClosestVertex(
        mouseUpPoint,
        borderVertices
      );
      console.log('MouseUp 후 가장 가까운 정점:', closestMouseUpVertex);
    }
  };

  useEffect(() => {
    updateClosestVertices();
  }, [clickPoint, mouseUpPoint]);

  return (
    <group>
      {borderVertices.map((vertex, index) => (
        <mesh key={index} position={vertex}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color="red" />
        </mesh>
      ))}
    </group>
  );
};

export default BorderPoints;
