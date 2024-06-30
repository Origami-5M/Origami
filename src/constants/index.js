const POINTS_MARKER_COLOR = '#098cea';
const RED_MARKER_COLOR = '#ff0000';
const PAPERCOLORS = [
  0x1aa24d, 0xf2482e, 0x343394, 0xfed53d, 0x000000, 0xff9fd5, 0x9ddef4,
  0xff8158,
];

const SEGMENT_NUM = 300;
const AXIS_BOUNDARY = 10000;
const DASH_SIZE = 0.02;
const Z_GAP = 0.02;
const DIAMETER = Math.PI;
const FRAMES = 30;

const TOAST_MESSAGE = {
  SAME_POSITION: '마우스를 접을 곳으로 이동해 주세요!',
  NO_POINTMARKER: '꼭짓점이 접을 수 있는 선분에 닿아야 합니다!',
  URL_COPY: '링크가 복사되었습니다.',
  NO_NICKNAME: '등록할 이름은 공백으로만 이루어질 수 없습니다!',
  ERROR_SAVE: '사용자 정보 저장 중 오류가 발생했습니다.',
};

export {
  POINTS_MARKER_COLOR,
  RED_MARKER_COLOR,
  PAPERCOLORS,
  SEGMENT_NUM,
  AXIS_BOUNDARY,
  DASH_SIZE,
  Z_GAP,
  TOAST_MESSAGE,
  DIAMETER,
  FRAMES,
};
