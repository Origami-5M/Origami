import * as THREE from 'three';

import { paper } from '../../three/Paper';
import { getFoldingDirection } from './getFoldingDirection';
import { foldingVertexPosition } from './foldingVertexPosition';
import { prevFoldingArea } from './prevFoldingArea';

const prevFoldingAnimation = (scene, axisLines, clickedRedMarker) => {
  const existingPolygon = scene.getObjectByName('foldedAreaPolygon');
  if (existingPolygon) {
    scene.remove(existingPolygon);
  }

  const getClampedVertices = (axisLines, axisType) => {
    return {
      clampedStart: axisLines[axisType]
        ? axisLines[axisType].geometry.attributes.position.array.slice(0, 3)
        : null,
      clampedEnd: axisLines[axisType]
        ? axisLines[axisType].geometry.attributes.position.array.slice(3, 6)
        : null,
    };
  };

  const xVertices = getClampedVertices(
    axisLines,
    'vertexIntervalRotatedBasedOnX'
  );
  const yVertices = getClampedVertices(
    axisLines,
    'vertexIntervalRotatedBasedOnY'
  );

  const axis = {
    rotatedLineVertex: {
      clampedStartBasedOnX: xVertices.clampedStart,
      clampedEndBasedOnX: xVertices.clampedEnd,
      clampedStartBasedOnY: yVertices.clampedStart,
      clampedEndBasedOnY: yVertices.clampedEnd,
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

  let foldedVertices = foldingVertexPosition(
    paper.geometry.attributes.position,
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
