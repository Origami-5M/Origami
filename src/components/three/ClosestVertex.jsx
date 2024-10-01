import { useMemo } from 'react';
import * as THREE from 'three';
import PointsMarker from './PointsMarker';
import { POINTS_MARKER_COLOR } from '../../constants/paper';

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

export const findClosestVertex = (point, corners, pointsPerEdge = 9) => {
  const borderVertices = generateBorderPoints(corners, pointsPerEdge);
  let closestVertex = borderVertices[0];
  let minDistance = point.distanceTo(borderVertices[0]);

  for (let i = 1; i < borderVertices.length; i++) {
    const distance = point.distanceTo(borderVertices[i]);

    if (distance < minDistance) {
      minDistance = distance;
      closestVertex = borderVertices[i];
    }
  }

  return closestVertex;
};

const BorderPoints = ({ corners, pointsPerEdge = 9, axisPoints }) => {
  const borderVertices = useMemo(
    () => generateBorderPoints(corners, pointsPerEdge),
    [corners, pointsPerEdge]
  );

  return (
    <group>
      {borderVertices.map((vertex, index) => (
        <PointsMarker position={vertex} color={POINTS_MARKER_COLOR} />
      ))}
      {axisPoints && (
        <line>
          <bufferGeometry>
            <bufferAttribute
              attachObject={['attributes', 'position']}
              count={2}
              array={
                new Float32Array([
                  axisPoints.startPoint.x,
                  axisPoints.startPoint.y,
                  axisPoints.startPoint.z,
                  axisPoints.endPoint.x,
                  axisPoints.endPoint.y,
                  axisPoints.endPoint.z,
                ])
              }
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="yellow" />
        </line>
      )}
    </group>
  );
};

export default BorderPoints;
