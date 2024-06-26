import { paper } from '../../three/Paper';
import { foldingVertexPosition } from './foldingVertexPosition';
import { getFoldingDirection } from './getFoldingDirection';

const foldingAnimation = (axisPoints, redMarker, isFolding) => {
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
    direction,
    isFolding
  );

  return foldingVertexPosition;
};

export { foldingAnimation };
