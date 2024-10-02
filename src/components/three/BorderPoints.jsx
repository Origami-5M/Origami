import { useMemo } from 'react';
import { useAtom } from 'jotai';
import { borderVerticesAtom } from '../../atoms';
import { generateBorderPoints } from './utils/borderVerticesUtils';
import { POINTS_MARKER_COLOR } from '../../constants/paper';
import PointsMarker from './PointsMarker';

export const findClickClosestVertex = (point, corners, pointsPerEdge = 9) => {
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
  const [borderVertices, setBorderVertices] = useAtom(borderVerticesAtom);

  useMemo(() => {
    const newBorderVertices = generateBorderPoints(corners, pointsPerEdge);
    setBorderVertices(newBorderVertices);
  }, [corners]);

  return (
    <group>
      {borderVertices.map((vertex, index) => (
        <PointsMarker
          key={index}
          position={vertex}
          color={POINTS_MARKER_COLOR}
        />
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
