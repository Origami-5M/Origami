import { expect, describe, it } from 'vitest';
import * as THREE from 'three';
import {
  getAxisPoints,
  calculateRotatedLine,
  isLeftTurn,
  computeBoundaryPoints,
  getIntersection,
  extendToBoundary,
} from '../../modules/axisCalculations.js';

describe('축 계산 함수', () => {
  describe('getAxisPoints', () => {
    it('현재 축점을 반환해야 합니다', () => {
      const scene = new THREE.Scene();
      const mouseDownVertex = new THREE.Vector3(0, 0, 0);
      const mouseUpVertex = new THREE.Vector3(1, 1, 0);
      const paperVertices = new THREE.BufferAttribute(
        new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0]),
        3
      );
      calculateRotatedLine(
        scene,
        mouseDownVertex,
        mouseUpVertex,
        paperVertices
      );
      const result = getAxisPoints();
      const expectedAxisPoints = {
        startPoint: new THREE.Vector3(1, 0, 0),
        endPoint: new THREE.Vector3(0, 1, 0),
      };

      expect(result.startPoint.x).toBeCloseTo(
        expectedAxisPoints.startPoint.x,
        10
      );
      expect(result.startPoint.y).toBeCloseTo(
        expectedAxisPoints.startPoint.y,
        10
      );
      expect(result.startPoint.z).toBeCloseTo(
        expectedAxisPoints.startPoint.z,
        10
      );
      expect(result.endPoint.x).toBeCloseTo(expectedAxisPoints.endPoint.x, 10);
      expect(result.endPoint.y).toBeCloseTo(expectedAxisPoints.endPoint.y, 10);
      expect(result.endPoint.z).toBeCloseTo(expectedAxisPoints.endPoint.z, 10);
    });
  });

  describe('calculateRotatedLine', () => {
    it('회전된 라인을 올바르게 계산해야 합니다', () => {
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
  });

  describe('isLeftTurn', () => {
    it('점들이 좌회전을 하는지 여부를 결정해야 합니다', () => {
      const referencePoint = new THREE.Vector3(0, 0, 0);
      const currentPoint = new THREE.Vector3(1, 0, 0);
      const nextPoint = new THREE.Vector3(1, 1, 0);
      const result = isLeftTurn(referencePoint, currentPoint, nextPoint);

      expect(result).toBe(true);
    });
  });

  describe('computeBoundaryPoints', () => {
    it('올바른 경계점을 반환해야 합니다', () => {
      const points = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(1, 1, 0),
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, 1, 0),
      ];
      const result = computeBoundaryPoints(points);

      expect(result).toHaveLength(4);
    });
  });

  describe('extendToBoundary', () => {
    it('경계에 있는 점을 반환해야 합니다', () => {
      const midpoint = new THREE.Vector3(0, 0, 0);
      const direction = new THREE.Vector3(1, 0, 0);
      const boundaryPoint = [
        new THREE.Vector3(-1, -1, 0),
        new THREE.Vector3(1, -1, 0),
        new THREE.Vector3(1, 1, 0),
        new THREE.Vector3(-1, 1, 0),
      ];
      const scale = 1;
      const result = extendToBoundary(
        midpoint,
        direction,
        boundaryPoint,
        scale
      );

      expect(result).toBeInstanceOf(THREE.Vector3);
    });
  });

  describe('getIntersection', () => {
    it('교차점을 반환해야 합니다', () => {
      const midpoint = new THREE.Vector3(0, 0, 0);
      const direction = new THREE.Vector3(1, 0, 0);
      const pointA = new THREE.Vector3(1, -1, 0);
      const pointB = new THREE.Vector3(1, 1, 0);
      const scale = 1;
      const result = getIntersection(
        midpoint,
        direction,
        pointA,
        pointB,
        scale
      );

      expect(result).toBeInstanceOf(THREE.Vector3);
      expect(result.x).toBe(1);
    });
  });
});
