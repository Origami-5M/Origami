import * as THREE from 'three';

import { calculateRotatedLine } from './axisCalculations';
import { getFoldingDirection } from './getFoldingDirection';
import { foldingVertexPosition } from './foldingVertexPosition';
import { prevFoldingArea } from './prevFoldingArea';

const prevFoldingAnimation = (
  scene,
  mouseUpVertex,
  vertexIntervalRotatedBasedOnX,
  vertexIntervalRotatedBasedOnY,
  clickedRedMarker
) => {
  const axisLines = calculateRotatedLine(
    scene,
    clickedRedMarker.position,
    mouseUpVertex,
    vertexIntervalRotatedBasedOnX,
    vertexIntervalRotatedBasedOnY
  );

  vertexIntervalRotatedBasedOnX = axisLines.vertexIntervalRotatedBasedOnX;
  vertexIntervalRotatedBasedOnY = axisLines.vertexIntervalRotatedBasedOnY;

  const existingPolygon = scene.getObjectByName('foldedAreaPolygon');
  if (existingPolygon) {
    scene.remove(existingPolygon);
  }

  const axis = {
    rotatedLineVertex: {
      clampedStartBasedOnX: axisLines.vertexIntervalRotatedBasedOnX
        ? axisLines.vertexIntervalRotatedBasedOnX.geometry.attributes.position.array.slice(
            0,
            3
          )
        : null,
      clampedEndBasedOnX: axisLines.vertexIntervalRotatedBasedOnX
        ? axisLines.vertexIntervalRotatedBasedOnX.geometry.attributes.position.array.slice(
            3,
            6
          )
        : null,
      clampedStartBasedOnY: axisLines.vertexIntervalRotatedBasedOnY
        ? axisLines.vertexIntervalRotatedBasedOnY.geometry.attributes.position.array.slice(
            0,
            3
          )
        : null,
      clampedEndBasedOnY: axisLines.vertexIntervalRotatedBasedOnY
        ? axisLines.vertexIntervalRotatedBasedOnY.geometry.attributes.position.array.slice(
            3,
            6
          )
        : null,
    },
  };

  const startPoint = axis.rotatedLineVertex.clampedStartBasedOnX
    ? new THREE.Vector3().fromArray(axis.rotatedLineVertex.clampedStartBasedOnX)
    : axis.rotatedLineVertex.clampedStartBasedOnY
      ? new THREE.Vector3().fromArray(
          axis.rotatedLineVertex.clampedStartBasedOnY
        )
      : null;
  const endPoint = axis.rotatedLineVertex.clampedEndBasedOnX
    ? new THREE.Vector3().fromArray(axis.rotatedLineVertex.clampedEndBasedOnX)
    : axis.rotatedLineVertex.clampedEndBasedOnY
      ? new THREE.Vector3().fromArray(axis.rotatedLineVertex.clampedEndBasedOnY)
      : null;

  const direction = getFoldingDirection(
    startPoint,
    endPoint,
    clickedRedMarker.position
  );
  const foldedVertices = foldingVertexPosition(
    startPoint,
    endPoint,
    direction,
    false
  );
  const foldedAreaPolygon = prevFoldingArea(foldedVertices);
  if (foldedAreaPolygon) {
    foldedAreaPolygon.name = 'foldedAreaPolygon';
    scene.add(foldedAreaPolygon);
  }
};

export { prevFoldingAnimation };
