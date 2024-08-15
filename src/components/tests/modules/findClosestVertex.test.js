import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { findClosestVertex } from '../../modules/findClosestVertex';

describe('findClosestVertex', () => {
  it('정확한 가장 가까운 정점과 거리를 찾아야 합니다.', () => {
    const intersectPoint = new THREE.Vector3(1, 1, 1);
    const borderVertices = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(2, 2, 2),
      new THREE.Vector3(1, 2, 1),
    ];

    const result = findClosestVertex(intersectPoint, borderVertices);

    const expectedDistance = Math.sqrt(1 + 1);
    const tolerance = 0.5;

    expect(result.closestVertex.equals(new THREE.Vector3(1, 2, 1))).toBe(true);
    expect(result.closestVertexIndex).toBe(2);
    expect(Math.abs(result.minDistance - expectedDistance)).toBeLessThan(
      tolerance
    );
  });

  it('빈 배열이 주어진 경우, 결과는 초기값이어야 합니다.', () => {
    const intersectPoint = new THREE.Vector3(1, 1, 1);
    const borderVertices = [];

    const result = findClosestVertex(intersectPoint, borderVertices);

    expect(result.closestVertex).toEqual({});
    expect(result.closestVertexIndex).toBe(-1);
    expect(result.minDistance).toBe(Infinity);
  });

  it('정점이 없는 경우 결과는 초기값이어야 합니다.', () => {
    const intersectPoint = new THREE.Vector3(1, 1, 1);
    const borderVertices = null;

    const result = findClosestVertex(intersectPoint, borderVertices);

    expect(result.closestVertex).toEqual({});
    expect(result.closestVertexIndex).toBe(-1);
    expect(result.minDistance).toBe(Infinity);
  });
});
