import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockDocument = {
  querySelector: vi.fn(() => ({
    querySelector: vi.fn(() => ({})),
  })),
};

const mockWindow = {
  document: mockDocument,
};

vi.stubGlobal('document', mockDocument);
vi.stubGlobal('window', mockWindow);

describe('foldingVertexPosition', () => {
  let foldingVertexPosition, borderData;
  let foldingDirectionModule, vertexModule;
  let guideModulesMock;

  beforeEach(async () => {
    vi.resetModules();

    guideModulesMock = {
      isGuideMode: false,
      mode: '',
      nowStep: 0,
      stepPlaneVertex: { stepVertex8: [] },
      updateZPosition: vi.fn(v => v),
    };

    vi.doMock('../../modules/getFoldingDirection', () => ({
      getInequalityFunction: vi.fn(),
      calculateFrontOrBack: vi.fn(),
    }));

    vi.doMock('../../modules/getVertexFromPosition', () => ({
      getVertexFromPosition: vi.fn(),
    }));

    vi.doMock('../../modules/guideModules', () => guideModulesMock);

    const foldingVertexPositionModule = await import(
      '../../modules/foldingVertexPosition'
    );
    foldingVertexPosition = foldingVertexPositionModule.foldingVertexPosition;
    borderData = foldingVertexPositionModule.borderData;

    foldingDirectionModule = await import('../../modules/getFoldingDirection');
    vertexModule = await import('../../modules/getVertexFromPosition');

    vi.clearAllMocks();
  });

  it('수직 폴딩 라인을 처리해야 합니다', async () => {
    const mockPositions = {
      count: 3,
      isBufferAttribute: true,
      setXYZ: vi.fn(),
    };

    foldingDirectionModule.getInequalityFunction.mockReturnValue(v => v > 0);
    foldingDirectionModule.calculateFrontOrBack.mockReturnValue(1);

    vertexModule.getVertexFromPosition
      .mockReturnValueOnce({ x: 1, y: 1, z: 0 })
      .mockReturnValueOnce({ x: -1, y: 1, z: 0 })
      .mockReturnValueOnce({ x: 0, y: 1, z: 0 });

    const result = foldingVertexPosition(
      mockPositions,
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      'right',
      true,
      false
    );

    expect(result.length).toBe(1);
    expect(mockPositions.setXYZ).toHaveBeenCalledTimes(1);
  });

  it('경계 정점을 처리해야 함', async () => {
    const mockPositions = {
      count: 1,
      isBufferAttribute: false,
    };

    foldingDirectionModule.getInequalityFunction.mockReturnValue(v => v > 0);
    foldingDirectionModule.calculateFrontOrBack.mockReturnValue(1);

    vertexModule.getVertexFromPosition.mockReturnValueOnce({
      x: 1,
      y: 1,
      z: 0,
    });

    foldingVertexPosition(
      mockPositions,
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      'upRight',
      true,
      true
    );

    expect(borderData.face).toBeDefined();
    expect(Array.isArray(borderData.face)).toBe(true);
  });

  it('가이드 모드를 처리해야 합니다', async () => {
    const mockPositions = {
      count: 1,
      isBufferAttribute: true,
      setXYZ: vi.fn(),
    };

    foldingDirectionModule.getInequalityFunction.mockReturnValue(v => v > 0);
    foldingDirectionModule.calculateFrontOrBack.mockReturnValue(1);

    vertexModule.getVertexFromPosition.mockReturnValueOnce({
      x: 1,
      y: 1,
      z: 0,
    });

    guideModulesMock.isGuideMode = true;
    guideModulesMock.updateZPosition.mockReturnValue({ x: 1, y: 1, z: 1 });

    const result = foldingVertexPosition(
      mockPositions,
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      'upRight',
      true,
      false
    );

    expect(result.length).toBe(1);
    expect(guideModulesMock.updateZPosition).toHaveBeenCalled();
    expect(mockPositions.setXYZ).toHaveBeenCalledWith(0, 1, 1, 1);
  });
});

describe('getAllFolderFaces', () => {
  let getAllFolderFaces;

  beforeEach(async () => {
    vi.resetModules();
    const foldingVertexPositionModule = await import(
      '../../modules/foldingVertexPosition'
    );
    getAllFolderFaces = foldingVertexPositionModule.getAllFolderFaces;
  });

  it('접힌 모든 영역을 반환해야 합니다', async () => {
    const faces = getAllFolderFaces();
    expect(Array.isArray(faces)).toBe(true);
  });
});

describe('rotatedData and borderData', () => {
  let foldingVertexPosition, rotatedData, borderData;
  let foldingDirectionModule, vertexModule;

  beforeEach(async () => {
    vi.resetModules();

    vi.doMock('../../modules/getFoldingDirection', () => ({
      getInequalityFunction: vi.fn(),
      calculateFrontOrBack: vi.fn(),
    }));

    vi.doMock('../../modules/getVertexFromPosition', () => ({
      getVertexFromPosition: vi.fn(),
    }));

    const foldingVertexPositionModule = await import(
      '../../modules/foldingVertexPosition'
    );
    foldingVertexPosition = foldingVertexPositionModule.foldingVertexPosition;
    rotatedData = foldingVertexPositionModule.rotatedData;
    borderData = foldingVertexPositionModule.borderData;

    foldingDirectionModule = await import('../../modules/getFoldingDirection');
    vertexModule = await import('../../modules/getVertexFromPosition');
  });

  it('접을 때 회전된 데이터를 업데이트해야 합니다', async () => {
    const mockPositions = {
      count: 1,
      isBufferAttribute: true,
      setXYZ: vi.fn(),
    };

    foldingDirectionModule.getInequalityFunction.mockReturnValue(v => v > 0);
    foldingDirectionModule.calculateFrontOrBack.mockReturnValue(1);

    vertexModule.getVertexFromPosition.mockReturnValueOnce({
      x: 1,
      y: 1,
      z: 0,
    });

    foldingVertexPosition(
      mockPositions,
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      'upRight',
      true,
      false
    );

    expect(rotatedData.face).toBeDefined();
    expect(rotatedData.startPoint).toEqual({ x: 0, y: 0 });
    expect(rotatedData.endPoint).toEqual({ x: 1, y: 1 });
  });

  it('경계 정점을 접을 때 borderData를 업데이트해야 합니다', async () => {
    const mockPositions = {
      count: 1,
      isBufferAttribute: false,
    };

    foldingDirectionModule.getInequalityFunction.mockReturnValue(v => v > 0);
    foldingDirectionModule.calculateFrontOrBack.mockReturnValue(1);

    vertexModule.getVertexFromPosition.mockReturnValueOnce({
      x: 1,
      y: 1,
      z: 0,
    });

    foldingVertexPosition(
      mockPositions,
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      'upRight',
      true,
      true
    );

    expect(borderData.face).toBeDefined();
    expect(borderData.startPoint).toEqual({ x: 0, y: 0 });
    expect(borderData.endPoint).toEqual({ x: 1, y: 1 });
  });
});
