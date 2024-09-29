import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Main = styled.main`
  position: relative;
  display: flex;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #343394;
  padding: 20px;
`;

const MainBg = styled.div`
  position: relative;
  overflow: hidden;
  width: calc(100vw - 410px);
  height: calc(100vh - 40px);
  border-radius: 40px;
  background: #fff url('/src/assets/img/main_bg.png') no-repeat center;
  background-size: cover;
`;

const SidebarContainer = styled.nav`
  position: relative;
  width: 410px;
  height: 100%;
`;

const ModeBlurBg = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  transform: translate(-50%, -50%);
  width: 98%;
  height: 98%;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  padding: 60px;
  border-radius: 40px;
  transition: opacity 0.3s ease;
  color: #ffffff;
  opacity: ${props => (props.$visible ? 1 : 0)};
  pointer-events: ${props => (props.$visible ? 'auto' : 'none')};
`;

const GuideModeBox = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

const GuideModeButton = styled.button`
  position: relative;
  width: 25%;
  height: 200px;
  border-radius: 30px;
  padding: 15px;
  transition: width 0.3s ease;
  background: url(${props => props.$bgImage});
  background-size: cover;
  color: #ffffff;

  &:hover {
    width: 30%;
  }

  &.active {
    width: 30%;
  }
`;

const RocketImg = styled.img`
  position: absolute;
  top: -30px;
  right: 0;
  width: 60%;
  max-width: 100px;
`;

const PlayIcon = styled.div`
  position: absolute;
  bottom: 120px;
  width: 47px;
  height: 47px;
  background: url('/src/assets/img/css_sprites.png') -96px -8px;
`;

const CheckIcon = styled.div`
  position: absolute;
  right: 15px;
  bottom: 50px;
  width: 37px;
  height: 27px;
  background: url('/src/assets/img/css_sprites.png') -221px -125px;
`;

const ModeInfo = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
`;

const ModeTitle = styled.p`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  align-self: flex-start;
  color: #ffffff;
`;

const ModeLevel = styled.span`
  margin-top: 10px;
  font-size: 14px;
  font-weight: 100;
  align-self: flex-start;
  color: #ffffff;
`;

const SoundBox = styled.div`
  display: flex;
  margin-bottom: 60px;
`;

const SoundButton = styled.button`
  margin-left: auto;
  width: 47px;
  height: 39px;
  background-image: url(/src/assets/img/css_sprites.png);
  background-position: ${props =>
    props.isMuted ? '-66px -108px' : '-130px -108px'};
  transition: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const MainBgm = styled.audio``;

const ModeBox = styled.div``;

const Span = styled.span``;

const ModeButton = styled.button`
  width: 100%;
  height: 130px;
  color: #ffffff;
  background: -300px no-repeat;
  transition: all 0.3s ease-in-out;
  border: none;
  cursor: pointer;
  padding: 0;
  background-color: transparent;

  &:hover {
    color: #f2482e;
  }

  &.active {
    color: #f2482e;
    background: url('/src/assets/img/active-mode-btn.png') -10px no-repeat;
    background-size: cover;
  }

  span {
    font-size: 20px;
    font-weight: 600;
  }
`;

const BigStartButton = styled.button`
  position: absolute;
  left: 50%;
  bottom: 10px;
  transform: translateX(-50%);
  width: 80%;
  height: 70px;
  text-align: center;
  background: #f2482e;
  color: #ffffff;
  border-radius: 10px;
  font-size: 34px;
  font-weight: 600;
  transition: all 0.3s;
  border: none;
  cursor: pointer;

  &:hover {
    width: 85%;
    height: 80px;
  }
`;

function App() {
  const [activeGuideMode, setActiveGuideMode] = useState('puppy');
  const [activeMode, setActiveMode] = useState('sandbox');
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef(null);

  const isGuideMode = activeMode === 'guide';

  const toggleSound = () => {
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.log('오디오 재생 오류:', error);
        });
      }
    }
  }, [isMuted]);

  return (
    <Main>
      <MainBg>
        <ModeBlurBg $visible={isGuideMode}>
          <GuideModeBox>
            <GuideModeButton
              className={activeGuideMode === 'puppy' ? 'active' : ''}
              $bgImage="/src/assets/img/blue-gamebg.png"
              onClick={() => setActiveGuideMode('puppy')}
            >
              <RocketImg src="/src/assets/img/rocket-img.png" />
              <PlayIcon />
              {activeGuideMode === 'puppy' && <CheckIcon />}
              <ModeInfo>
                <ModeTitle>PUPPY</ModeTitle>
                <ModeLevel>Easy</ModeLevel>
              </ModeInfo>
            </GuideModeButton>
            <GuideModeButton
              className={activeGuideMode === 'plane' ? 'active' : ''}
              $bgImage="/src/assets/img/orange-gamebg.png"
              onClick={() => setActiveGuideMode('plane')}
            >
              <RocketImg src="/src/assets/img/rocket-img.png" />
              <PlayIcon />
              {activeGuideMode === 'plane' && <CheckIcon />}
              <ModeInfo>
                <ModeTitle>PLANE</ModeTitle>
                <ModeLevel>Normal</ModeLevel>
              </ModeInfo>
            </GuideModeButton>
            <GuideModeButton
              className={activeGuideMode === 'boat' ? 'active' : ''}
              $bgImage="/src/assets/img/green-gamebg.png"
              onClick={() => setActiveGuideMode('boat')}
            >
              <RocketImg src="/src/assets/img/rocket-img.png" />
              <PlayIcon />
              {activeGuideMode === 'boat' && <CheckIcon />}
              <ModeInfo>
                <ModeTitle>BOAT</ModeTitle>
                <ModeLevel>Hard</ModeLevel>
              </ModeInfo>
            </GuideModeButton>
          </GuideModeBox>
        </ModeBlurBg>
      </MainBg>
      <SidebarContainer>
        <SoundBox>
          <MainBgm
            ref={audioRef}
            src="/src/assets/sound/origami_main_music.mp3"
            loop
            autoPlay
          />
          <SoundButton isMuted={isMuted} onClick={toggleSound} />
        </SoundBox>
        <ModeBox>
          <ModeButton
            className={activeMode === 'sandbox' ? 'active' : ''}
            id="sandboxMode"
            onClick={() => setActiveMode('sandbox')}
          >
            <span>SANDBOX MODE</span>
          </ModeButton>
          <ModeButton
            className={activeMode === 'guide' ? 'active' : ''}
            id="guideMode"
            onClick={() => setActiveMode('guide')}
          >
            <Span>GUIDE MODE</Span>
          </ModeButton>
        </ModeBox>
        <BigStartButton>START</BigStartButton>
      </SidebarContainer>
    </Main>
  );
}

export default App;
