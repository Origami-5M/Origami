import { expect, test } from 'vitest';
import * as THREE from 'three';
import {
  getAxisPoints,
  calculateRotatedLine,
  isLeftTurn,
  computeBoundaryPoints,
  getIntersection,
  extendToBoundary,
} from '../../modules/axisCalculations.js';

test('getAxisPoints should return current axisPoints', () => {
  const scene = new THREE.Scene();
  const mouseDownVertex = new THREE.Vector3(0, 0, 0);
  const mouseUpVertex = new THREE.Vector3(1, 1, 0);
  const paperVertices = new THREE.BufferAttribute(
    new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0]),
    3
  );
  calculateRotatedLine(scene, mouseDownVertex, mouseUpVertex, paperVertices);
  const result = getAxisPoints();
  const expectedAxisPoints = {
    startPoint: new THREE.Vector3(1, 0, 0),
    endPoint: new THREE.Vector3(0, 1, 0),
  };

  expect(result.startPoint.x).toBeCloseTo(expectedAxisPoints.startPoint.x, 10);
  expect(result.startPoint.y).toBeCloseTo(expectedAxisPoints.startPoint.y, 10);
  expect(result.startPoint.z).toBeCloseTo(expectedAxisPoints.startPoint.z, 10);
  expect(result.endPoint.x).toBeCloseTo(expectedAxisPoints.endPoint.x, 10);
  expect(result.endPoint.y).toBeCloseTo(expectedAxisPoints.endPoint.y, 10);
  expect(result.endPoint.z).toBeCloseTo(expectedAxisPoints.endPoint.z, 10);
});

test('calculateRotatedLine should calculate the rotated line correctly', () => {
  const scene = new THREE.Scene();
  const mouseDownVertex = new THREE.Vector3(0, 0, 0);
  const mouseUpVertex = new THREE.Vector3(1, 1, 0);
  const paperVertices = new THREE.BufferAttribute(
    new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0]),
    3
  );
  const { rotatedLine, axisPoints } = calculateRotatedLine(
    scene,
    mouseDownVertex,
    mouseUpVertex,
    paperVertices
  );

  expect(rotatedLine).toBeInstanceOf(THREE.Line);
  expect(axisPoints).toHaveProperty('startPoint');
  expect(axisPoints).toHaveProperty('endPoint');
});

test('isLeftTurn should determine if the points make a left turn', () => {
  const referencePoint = new THREE.Vector3(0, 0, 0);
  const currentPoint = new THREE.Vector3(1, 0, 0);
  const nextPoint = new THREE.Vector3(1, 1, 0);
  const result = isLeftTurn(referencePoint, currentPoint, nextPoint);

  expect(result).toBe(true);
});

test('computeBoundaryPoints should return the correct boundary points', () => {
  const points = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(1, 1, 0),
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, 1, 0),
  ];
  const result = computeBoundaryPoints(points);

  expect(result).toHaveLength(4);
});

test('extendToBoundary should return a point on the boundary', () => {
  const midpoint = new THREE.Vector3(0, 0, 0);
  const direction = new THREE.Vector3(1, 0, 0);
  const boundaryPoint = [
    new THREE.Vector3(-1, -1, 0),
    new THREE.Vector3(1, -1, 0),
    new THREE.Vector3(1, 1, 0),
    new THREE.Vector3(-1, 1, 0),
  ];
  const scale = 1;
  const result = extendToBoundary(midpoint, direction, boundaryPoint, scale);

  expect(result).toBeInstanceOf(THREE.Vector3);
});

test('getIntersection should return the intersection point', () => {
  const midpoint = new THREE.Vector3(0, 0, 0);
  const direction = new THREE.Vector3(1, 0, 0);
  const pointA = new THREE.Vector3(1, -1, 0);
  const pointB = new THREE.Vector3(1, 1, 0);
  const scale = 1;
  const result = getIntersection(midpoint, direction, pointA, pointB, scale);

  expect(result).toBeInstanceOf(THREE.Vector3);
  expect(result.x).toBe(1);
});
