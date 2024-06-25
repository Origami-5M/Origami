import { paper } from '../../three/Paper';
import { borderVertices } from './makeVertices';
import { foldingVertexPosition } from './foldingVertexPosition';
import { getFoldingDirection } from './getFoldingDirection';

const foldingAnimation = (axisPoints, redMarker) => {
  const { startPoint, endPoint } = axisPoints;
  const direction = getFoldingDirection(
    startPoint,
    endPoint,
    redMarker.position
  );

  foldingVertexPosition(
    paper.geometry.attributes.position,
    startPoint,
    endPoint,
    direction
  );
  foldingVertexPosition(borderVertices, startPoint, endPoint, direction);
};

export { foldingAnimation };
