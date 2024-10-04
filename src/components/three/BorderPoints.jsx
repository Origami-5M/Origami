import { useMemo } from 'react';
import { useAtom } from 'jotai';
import {
  borderVerticesAtom,
  closestVertexAtom,
  selectedVerticesAtom,
  isDraggingAtom,
} from '../../atoms';
import { generateBorderPoints } from './utils/borderVerticesUtils';
import { POINTS_MARKER_COLOR, RED_MARKER_COLOR } from '../../constants/paper';
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
  const [, setBorderVertices] = useAtom(borderVerticesAtom);
  const [closestVertex] = useAtom(closestVertexAtom);
  const [selectedVertices] = useAtom(selectedVerticesAtom);
  const [isDragging] = useAtom(isDraggingAtom);

  useMemo(() => {
    const newBorderVertices = generateBorderPoints(corners, pointsPerEdge);
    setBorderVertices(newBorderVertices);
  }, [corners]);

  return (
    <group>
      {isDragging && selectedVertices.point1 && (
        <PointsMarker
          position={selectedVertices.point1}
          color={RED_MARKER_COLOR}
        />
      )}
      {closestVertex && (
        <PointsMarker
          position={closestVertex}
          color={isDragging ? RED_MARKER_COLOR : POINTS_MARKER_COLOR}
        />
      )}

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
