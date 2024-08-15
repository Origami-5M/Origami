import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as THREE from 'three';
import {
  rotateSelectedVertices,
  findAndSelectClosestVertices,
} from '../../modules/rotateSelectedVertices';

vi.mock('three', () => {
  return {
    Vector3: vi.fn(() => ({
      subVectors: vi.fn().mockReturnThis(),
      normalize: vi.fn().mockReturnThis(),
      addVectors: vi.fn().mockReturnThis(),
      multiplyScalar: vi.fn().mockReturnThis(),
      set: vi.fn(),
      sub: vi.fn(),
      applyQuaternion: vi.fn(),
      add: vi.fn(),
      fromBufferAttribute: vi.fn(),
      distanceTo: vi.fn().mockReturnValue(1),
    })),
    Quaternion: vi.fn(() => ({
      setFromAxisAngle: vi.fn().mockReturnThis(),
    })),
  };
});

vi.mock('../../constants', () => ({
  Z_GAP: 0.1,
}));

vi.mock('./guideModules', () => ({
  mode: 'puppy',
  nowStep: 3,
}));

describe('rotateSelectedVertices', () => {
  let positionAttribute, selectedVertices, rotatedData;

  beforeEach(() => {
    positionAttribute = {
      count: 3,
      getX: vi.fn().mockReturnValue(0),
      getY: vi.fn().mockReturnValue(0),
      getZ: vi.fn().mockReturnValue(0),
      setXYZ: vi.fn(),
      setZ: vi.fn(),
      needsUpdate: false,
    };
    selectedVertices = new Set([0, 2]);
    rotatedData = {
      startPoint: new THREE.Vector3(0, 0, 0),
      endPoint: new THREE.Vector3(1, 1, 1),
    };
    vi.useFakeTimers();
  });

  it('선택된 정점들을 회전시켜야 합니다.', () => {
    rotateSelectedVertices(
      positionAttribute,
      selectedVertices,
      Math.PI / 2,
      1,
      true,
      rotatedData
    );

    vi.runAllTimers();

    expect(positionAttribute.setXYZ).toHaveBeenCalledTimes(2);
    expect(positionAttribute.needsUpdate).toBe(true);
  });

  it('시계 방향 및 반시계 방향 회전을 처리해야 합니다.', () => {
    rotateSelectedVertices(
      positionAttribute,
      selectedVertices,
      Math.PI / 2,
      1,
      false,
      rotatedData
    );

    vi.runAllTimers();

    expect(positionAttribute.setXYZ).toHaveBeenCalledTimes(2);
  });
});

describe('findAndSelectClosestVertices', () => {
  let positionAttribute;

  beforeEach(() => {
    positionAttribute = {
      count: 5,
      getX: vi.fn().mockReturnValue(0),
      getY: vi.fn().mockReturnValue(0),
      getZ: vi.fn().mockReturnValue(0),
    };
  });

  it('빈 positions 배열을 처리해야 합니다.', () => {
    const selectedVertices = new Set();

    findAndSelectClosestVertices([], positionAttribute, selectedVertices);

    expect(selectedVertices.size).toBe(0);
  });
});
