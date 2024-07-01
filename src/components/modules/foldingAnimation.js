import { paper } from '../../three/Paper';
import { foldingVertexPosition } from './foldingVertexPosition';
import { getFoldingDirection } from './getFoldingDirection';
import { borderVertices } from './makeVertices';

const foldingAnimation = (scene, axisPoints, redMarker, isFolding) => {
  const { startPoint, endPoint } = axisPoints;
  const direction = getFoldingDirection(startPoint, endPoint, redMarker);

  foldingVertexPosition(
    paper.geometry.attributes.position,
    startPoint,
    endPoint,
    direction,
    isFolding
  );

  foldingVertexPosition(
    borderVertices,
    startPoint,
    endPoint,
    direction,
    isFolding
  );

  const existingStartMarker = scene.getObjectByName('startMarker');
  const existingEndMarker = scene.getObjectByName('endMarker');
  if (existingStartMarker) scene.remove(existingStartMarker);
  if (existingEndMarker) scene.remove(existingEndMarker);

  return foldingVertexPosition;
};

export { foldingAnimation };
