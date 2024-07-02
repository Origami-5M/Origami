const POINTS_MARKER_COLOR = '#343394';
const POINTS_MARKER_SIZE = 0.07;
const POINTS_LINE_COLOR = '#6c6bbb';
const RED_MARKER_COLOR = '#ff3f22';
const PAPERCOLORS = [
  '#D9F1CA',
  '#FF9A9A',
  '#D9C8FF',
  '#FFF3C8',
  '#FFD6E7',
  '#a4d4fd',
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

const TOOLTIP_MESSAGES = {
  HOME_TOOLTIP: '홈으로 이동합니다',
  PLAYMODELIST_TOOLTIP: '플레이모드 리스트를 볼 수 있습니다',
  GALLERY_TOOLTIP: '갤러리로 이동합니다',
  SOUND_TOOLTIP: '음악을 음소거할 수 있습니다',
  PLAYGUIDE_TOOLTIP: '플레이 가이드를 볼 수 있습니다',
  RESTART_TOOLTIP: '현재 모드의 처음 단계로 이동합니다',
  FINISH_TOOLTIP: '종이접기를 완료합니다',
  UNFOLD_TOOLTIP: '종이를 펼칩니다',
  PRESTEP_TOOLTIP: '이전 단계로 돌아갑니다',
  NEXTSTEP_TOOLTIP: '다음 단계로 돌아갑니다',
  SHARE_TOOLTIP: '공유할 수 있습니다',
  MODESELECT_TOOLTIP: '클릭하면 해당 모드로 이동합니다',
  NEXT_TOOLTIP: '다음 스텝 가이드를 보여줍니다',
  PREV_TOOLTIP: '이전 스텝 가이드를 보여줍니다',
};

const SETTIMEOUT_DEFAULT = 1500;

export {
  POINTS_MARKER_COLOR,
  POINTS_MARKER_SIZE,
  RED_MARKER_COLOR,
  POINTS_LINE_COLOR,
  PAPERCOLORS,
  SEGMENT_NUM,
  THRESHOLD,
  DASH_SIZE,
  Z_GAP,
  AXIS_BOUNDARY,
  DIAMETER,
  FRAMES,
  TOAST_MESSAGE,
  TOOLTIP_MESSAGES,
  SETTIMEOUT_DEFAULT,
};
