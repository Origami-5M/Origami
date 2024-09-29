import { useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';
import ModeSidebar from './ModeSidebar';
import { useTooltip, TOOLTIP_MESSAGES, TooltipText } from './utils/tooltip';
import InfoTooltip from './InfoTooltip';

const commonButtonStyle = css`
  display: block;
  margin-bottom: 15px;
  text-align: center;
  border-radius: 999px;
  width: 60px;
  height: 60px;
  opacity: 0.5;
  background-size: cover;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`;

const SideNav = styled.nav`
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 110px;
  height: 100%;
  padding: 60px 0;
  background-color: #343394;
`;

const SideDiv = styled.div``;

const TooltipHomeButton = styled.button`
  ${commonButtonStyle};
  background: url('/src/assets/img/nav_sprites.png') no-repeat -5px -8px;
`;

const TooltipListButton = styled.button`
  ${commonButtonStyle};

  background: ${({ $isSidebarVisible }) =>
    $isSidebarVisible
      ? "url('/src/assets/img/checked_sprites.png') -8px -3px no-repeat"
      : "url('/src/assets/img/nav_sprites.png') -184px -80px no-repeat"};

  opacity: ${({ $isSidebarVisible }) => ($isSidebarVisible ? 1 : 0.5)};

  background-color: ${({ $isSidebarVisible }) =>
    $isSidebarVisible ? 'rgb(255, 255, 255)' : ''};

  &:hover {
    background-color: ${({ $isSidebarVisible }) =>
      $isSidebarVisible ? 'rgb(255, 255, 255)' : 'rgb(51, 50, 173)'};
  }
`;

const TooltipGalleryButton = styled.button`
  ${commonButtonStyle};
  background: url('/src/assets/img/nav_sprites.png') no-repeat -97px -8px;
`;

const TooltipSoundButton = styled.button`
  ${commonButtonStyle};
  background: url('/src/assets/img/nav_sprites.png') no-repeat;
  background-position: ${({ $isMuted }) =>
    $isMuted ? '-100px -137px' : '-100px -80px'};
`;

const TooltipGuideButton = styled.button`
  ${commonButtonStyle};
  background: url('/src/assets/img/nav_sprites.png') no-repeat -4px -81px;
`;

const modes = [
  {
    id: 'puppy',
    name: 'Puppy',
    image: '/src/assets/img/rocket-img.png',
  },
  {
    id: 'plane',
    name: 'Plane',
    image: '/src/assets/img/rocket-img.png',
  },
  {
    id: 'heart',
    name: 'Heart',
    image: '/src/assets/img/rocket-img.png',
  },
];

function Sidebar() {
  const [isMuted, setIsMuted] = useState(true);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const {
    tooltipVisible,
    tooltipMessage,
    tooltipPosition,
    handleMouseOver,
    handleMouseMove,
    handleMouseOut,
  } = useTooltip(TOOLTIP_MESSAGES);

  const audioRef = useRef(null);
  const tooltipRef = useRef(null);
  const tooltipButtonRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  }, [isMuted]);

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        tooltipRef.current &&
        tooltipButtonRef.current &&
        !tooltipRef.current.contains(event.target) &&
        !tooltipButtonRef.current.contains(event.target)
      ) {
        setIsTooltipVisible(false);
      }
    };

    if (isTooltipVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTooltipVisible]);

  const handleHomeClick = () => {
    window.location.href = '/';
  };

  const handleModeButtonClick = () => {
    setIsTooltipVisible(false);
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleGalleryClick = () => {
    window.location.href = '/gallery';
  };

  const handleSoundClick = () => {
    setIsMuted(!isMuted);
  };

  const handleSelectMode = mode => {
    const url = new URL(`${window.location.origin}/play`);
    url.searchParams.append('mode', mode);
    window.location.assign(url.toString());
  };

  const handleTooltipClick = () => {
    setIsSidebarVisible(false);
    setIsTooltipVisible(!isTooltipVisible);
  };

  return (
    <>
      <SideNav>
        <SideDiv>
          <TooltipHomeButton
            onClick={handleHomeClick}
            data-tooltip-key="HOME_TOOLTIP"
            onMouseOver={handleMouseOver}
            onMouseMove={handleMouseMove}
            onMouseOut={handleMouseOut}
          />
          <TooltipListButton
            onClick={handleModeButtonClick}
            $isSidebarVisible={isSidebarVisible}
            data-tooltip-key="PLAYMODELIST_TOOLTIP"
            onMouseOver={handleMouseOver}
            onMouseMove={handleMouseMove}
            onMouseOut={handleMouseOut}
          />
          <TooltipGalleryButton
            onClick={handleGalleryClick}
            data-tooltip-key="GALLERY_TOOLTIP"
            onMouseOver={handleMouseOver}
            onMouseMove={handleMouseMove}
            onMouseOut={handleMouseOut}
          />
        </SideDiv>
        <SideDiv>
          <TooltipSoundButton
            onClick={handleSoundClick}
            $isMuted={isMuted}
            data-tooltip-key="SOUND_TOOLTIP"
            onMouseOver={handleMouseOver}
            onMouseMove={handleMouseMove}
            onMouseOut={handleMouseOut}
          />
          <TooltipGuideButton
            onClick={handleTooltipClick}
            ref={tooltipButtonRef}
            data-tooltip-key="PLAYGUIDE_TOOLTIP"
            onMouseOver={handleMouseOver}
            onMouseMove={handleMouseMove}
            onMouseOut={handleMouseOut}
          />
          {isTooltipVisible && (
            <div ref={tooltipRef}>
              <InfoTooltip />
            </div>
          )}
        </SideDiv>
      </SideNav>

      <ModeSidebar
        modes={modes}
        onSelectMode={handleSelectMode}
        isVisible={isSidebarVisible}
      />

      <audio
        ref={audioRef}
        src="/src/assets/sound/origami_main_music.mp3"
        loop
        autoPlay
      />
      {tooltipVisible && (
        <TooltipText
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
          }}
        >
          {tooltipMessage}
        </TooltipText>
      )}
    </>
  );
}

export default Sidebar;
