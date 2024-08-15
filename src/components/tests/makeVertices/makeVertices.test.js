import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  borderVertices,
  addVertices,
  changeBorderVertices,
} from '../../modules/makeVertices';
import * as axisCalculations from '../../modules/axisCalculations';

vi.spyOn(axisCalculations, 'getAxisPoints');

describe('경계 정점 모듈 함수', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('올바른 개수의 점을 사용하여 borderVertics를 초기화해야 합니다', () => {
    expect(borderVertices).toHaveLength(40);
  });

  it('should add vertices based on axis points', () => {
    const initialBorderVertices = [...borderVertices];
    axisCalculations.getAxisPoints.mockReturnValue({
      startPoint: { x: 0, y: 0, z: 0 },
      endPoint: { x: 1, y: 1, z: 1 },
    });

    addVertices();

    expect(axisCalculations.getAxisPoints).toHaveBeenCalled();
    expect(borderVertices.length).toBe(initialBorderVertices.length + 40);
  });

  it('경계 정점을 변경해야 함', () => {
    const newData = [
      { x: 1, y: 1, z: 1 },
      { x: 2, y: 2, z: 2 },
    ];
    changeBorderVertices(newData);

    expect(borderVertices).toEqual(newData);
  });
});
