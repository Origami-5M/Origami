const POINTS_MARKER_COLOR = '#000';
const POINTS_MARKER_SIZE = 0.07;
const RED_MARKER_COLOR = '#ff0000';
const PAPERCOLORS = [
  '#D9F1CA',
  '#FF9A9A',
  '#D9C8FF',
  '#FFF3C8',
  '#FFD6E7',
  '#959595',
  '#FFDEB8',
  '#BDFBFF',
];

const SEGMENT_NUM = 150;
const THRESHOLD = 0.3;
const AXIS_BOUNDARY = 10000;
const DASH_SIZE = 0.02;
const Z_GAP = 0.02;
const FRAMES = 30;
const DIAMETER = Math.PI;

const TOAST_MESSAGE = {
  SAME_POSITION: '🚨 마우스를 접을 곳으로 이동해 주세요',
  NO_POINTMARKER: '🚨 꼭짓점이 접을 수 있는 선분에 닿아야 합니다',
  NO_SELECTED_MODE: '🚨 시작할 모드를 선택해주세요!',
  URL_COPY: '링크가 복사되었습니다 ✅',
  NO_NICKNAME: '🚨 등록할 이름은 공백으로만 이루어질 수 없습니다!',
  SUCCESS_SAVE: '공유가 완료되었습니다 ✅',
  ERROR_SAVE: '🚨 사용자 정보 저장 중 오류가 발생했습니다',
  ERROR_COPY: '🚨 URL 복사 중 오류가 발생했습니다',
  ERROR_DEFAULT: '🚨 오류가 발생하였습니다',
};

export {
  POINTS_MARKER_COLOR,
  POINTS_MARKER_SIZE,
  RED_MARKER_COLOR,
  PAPERCOLORS,
  SEGMENT_NUM,
  THRESHOLD,
  DASH_SIZE,
  Z_GAP,
  AXIS_BOUNDARY,
  DIAMETER,
  FRAMES,
  TOAST_MESSAGE,
};
