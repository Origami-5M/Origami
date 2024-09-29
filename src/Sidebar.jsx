import { useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';

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
  background: url('/src/assets/img/nav_sprites.png') no-repeat -184px -80px;
`;

const TooltipGalleryButton = styled.button`
  ${commonButtonStyle};
  background: url('/src/assets/img/nav_sprites.png') no-repeat -97px -8px;
`;

const TooltipSoundButton = styled.button`
  ${commonButtonStyle};
  background: url('/src/assets/img/nav_sprites.png') no-repeat
    ${({ isMuted }) => (isMuted ? '-100px -137px' : '-100px -80px')};
`;

const TooltipGuideButton = styled.button`
  ${commonButtonStyle};
  background: url('/src/assets/img/nav_sprites.png') no-repeat -4px -81px;
`;

const ModeSidebar = styled.aside`
  position: absolute;
  top: 0;
  left: 110px;
  width: 200px;
  height: 100%;
  background-color: #fff;
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
  z-index: 1000;
`;

const ModeList = styled.ul`
  list-style: none;
  padding: 20px;
  margin: 0;
`;

const ModeListItem = styled.li`
  margin-bottom: 15px;
  cursor: pointer;
  display: ${({ isHidden }) => (isHidden ? 'none' : 'block')};

  div {
    text-align: center;

    h3 {
      margin-bottom: 10px;
      font-size: 18px;
      color: #343394;
    }

    img {
      width: 100px;
      height: auto;
    }
  }
`;

function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = event => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler();
    };
    document.addEventListener('mousedown', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, [ref, handler]);
}

function Sidebar() {
  const [isMuted, setIsMuted] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [guideMode] = useState(
    new URLSearchParams(window.location.search).get('mode')
  );

  const infoWrapRef = useRef(null);
  const modeSidebarRef = useRef(null);
  const audioRef = useRef(null);

  const handleHomeClick = () => {
    window.location.href = '/';
  };

  const handleModeButtonClick = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleGalleryClick = () => {
    window.location.href = '/gallery';
  };

  const handleSoundClick = () => {
    setIsMuted(!isMuted);
  };

  const handleInfoClick = () => {
    setIsInfoVisible(!isInfoVisible);
  };

  const handleModeSelect = mode => {
    const url = new URL(`${window.location.origin}/play`);
    url.searchParams.append('mode', mode);
    window.location.assign(url.toString());
  };

  useClickOutside(infoWrapRef, () => {
    setIsInfoVisible(false);
  });

  useClickOutside(modeSidebarRef, () => {
    setIsSidebarVisible(false);
  });

  useEffect(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  }, [isMuted]);

  return (
    <>
      <SideNav>
        <SideDiv>
          <TooltipHomeButton onClick={handleHomeClick} />
          <TooltipListButton onClick={handleModeButtonClick} />
          <TooltipGalleryButton onClick={handleGalleryClick} />
        </SideDiv>
        <SideDiv>
          <TooltipSoundButton onClick={handleSoundClick} $isMuted={isMuted} />
          <TooltipGuideButton onClick={handleInfoClick} />
        </SideDiv>
      </SideNav>

      <audio
        ref={audioRef}
        src="/src/assets/sound/origami_main_music.mp3"
        loop
        autoPlay
      />

      <ModeSidebar $isVisible={isSidebarVisible} ref={modeSidebarRef}>
        <ModeList>
          <ModeListItem
            onClick={() => handleModeSelect('puppy')}
            isHidden={guideMode === 'puppy'}
          >
            <div>
              <h3>Puppy</h3>
              <p>
                <img
                  src="/src/assets/img/puppy-img.png"
                  alt="종이접기 강아지 이미지"
                />
              </p>
            </div>
          </ModeListItem>
          <ModeListItem
            onClick={() => handleModeSelect('plane')}
            $isHidden={guideMode === 'plane'}
          >
            <div>
              <h3>Plane</h3>
              <p>
                <img
                  src="/src/assets/img/plane-img.png"
                  alt="종이접기 비행기 이미지"
                />
              </p>
            </div>
          </ModeListItem>
          <ModeListItem
            onClick={() => handleModeSelect('heart')}
            $isHidden={guideMode === 'heart'}
          >
            <div>
              <h3>Heart</h3>
              <p>
                <img
                  src="/src/assets/img/heart-img.png"
                  alt="종이접기 하트 이미지"
                />
              </p>
            </div>
          </ModeListItem>
        </ModeList>
      </ModeSidebar>
    </>
  );
}

export default Sidebar;
