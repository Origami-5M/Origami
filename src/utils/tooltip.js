import { useState } from 'react';
import styled from 'styled-components';

export const useTooltip = TOOLTIP_MESSAGES => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMouseOver = event => {
    const tooltipKey = event.currentTarget.getAttribute('data-tooltip-key');
    const message = TOOLTIP_MESSAGES[tooltipKey];
    if (message) {
      setTooltipMessage(message);
      setTooltipVisible(true);
      updateTooltipPosition(event);
    }
  };

  const handleMouseMove = event => {
    if (tooltipVisible) {
      updateTooltipPosition(event);
    }
  };

  const handleMouseOut = () => {
    setTooltipVisible(false);
  };

  const updateTooltipPosition = event => {
    const offsetX = 10;
    const offsetY = 20;
    let tooltipX = event.clientX + offsetX;
    let tooltipY = event.clientY + offsetY;

    const tooltipWidth = 200;
    const tooltipHeight = 40;

    if (tooltipX + tooltipWidth > window.innerWidth) {
      tooltipX = event.clientX - tooltipWidth - offsetX;
    }
    if (tooltipY + tooltipHeight > window.innerHeight) {
      tooltipY = event.clientY - tooltipHeight - offsetY;
    }

    setTooltipPosition({ x: tooltipX, y: tooltipY });
  };

  return {
    tooltipVisible,
    tooltipMessage,
    tooltipPosition,
    handleMouseOver,
    handleMouseMove,
    handleMouseOut,
  };
};

export const TooltipText = styled.span`
  position: fixed;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 8px 20px;
  position: fixed;
  z-index: 1000;
  transition: opacity 0.3s;
  pointer-events: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

export const TOOLTIP_MESSAGES = {
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
