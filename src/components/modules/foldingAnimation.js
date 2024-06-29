import * as THREE from 'three';
import { paper } from '../../three/Paper';
import { foldingVertexPosition } from './foldingVertexPosition';
import { getFoldingDirection } from './getFoldingDirection';
import { borderVertices } from './makeVertices';

const foldingAnimation = (scene, axisPoints, redMarker, isFolding) => {
  const { startPoint, endPoint } = axisPoints;
  const direction = getFoldingDirection(startPoint, endPoint, redMarker);

  const createMarker = (color, position) => {
    const geometry = new THREE.SphereGeometry(0.05, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color });
    const marker = new THREE.Mesh(geometry, material);
    marker.position.copy(position);
    return marker;
  };

  foldingVertexPosition(
    paper.geometry.attributes.position,
    startPoint,
    endPoint,
    direction,
    isFolding,
    false
  );

  foldingVertexPosition(
    borderVertices,
    startPoint,
    endPoint,
    direction,
    isFolding,
    false
  );

  const startMarker = createMarker(0xff0000, startPoint);
  const endMarker = createMarker(0x0000ff, endPoint);

  const existingStartMarker = scene.getObjectByName('startMarker');
  const existingEndMarker = scene.getObjectByName('endMarker');
  if (existingStartMarker) scene.remove(existingStartMarker);
  if (existingEndMarker) scene.remove(existingEndMarker);

  startMarker.name = 'startMarker';
  endMarker.name = 'endMarker';
  scene.add(startMarker);
  scene.add(endMarker);

  return foldingVertexPosition;
};

export { foldingAnimation };
