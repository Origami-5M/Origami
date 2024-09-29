import styled, { css } from 'styled-components';
import Sidebar from './Sidebar';

const commonButtonStyle = css`
  background-color: #888;
  box-sizing: border-box;
  width: 60px;
  height: 60px;
  border-radius: 999px;
  opacity: 50%;

  &:hover {
    opacity: 100%;
  }
`;

const MainContainer = styled.main`
  display: flex;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #343394;
`;

const SectionContainer = styled.section`
  position: relative;
  display: flex;
  align-items: flex-end;
  width: 100%;
  height: 96%;
  margin-left: 20px;
  border-radius: 30px;
  background-color: #e7e6ff;
`;

const BottomLayout = styled.div`
  z-index: 1;
  height: 68px;
  margin: 0 55px 57px 55px;

  ul {
    display: flex;
    align-items: center;
    height: 60px;
    gap: 20px;
  }
`;

const BottomLayoutLi = styled.li`
  height: 100%;
`;

const RestartButton = styled.button`
  background: url('/src/assets/img/nav_sprites.png') no-repeat -186px -9px;
  ${commonButtonStyle};
`;

const UnFoldButton = styled.button`
  background-color: #838383;
  cursor: default;
  font-size: 10px;
  opacity: 100%;
  ${commonButtonStyle};
`;

const RollBackButton = styled.button`
  background: url('/src/assets/img/checked_sprites.png') no-repeat -107px -56px;
  ${commonButtonStyle};
`;

const CommitButton = styled.button`
  background: url('/src/assets/img/checked_sprites.png') no-repeat -103px -2px;
  ${commonButtonStyle};
`;

const FinishButton = styled.button`
  height: 60px;
  padding: 15px 35px;
  border-radius: 60px;
  background: url(${props => props.image}) no-repeat center;
  background-size: cover;
  background-color: #f2482e;

  &:hover {
    background-color: #d5250a;
  }
`;

const PlayGuide = styled.div`
  position: absolute;
  top: 39px;
  right: 57px;
  padding: 16px 20px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const PlayGuideP = styled.p`
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const PlayGuideSpan = styled.span`
  font-weight: 600;
  color: #343394;
`;

const ArrowButtonBox = styled.div`
  height: 68px;
  margin: 0 55px 57px 55px;
  position: absolute;
  right: 0;
  z-index: 1;
`;

const ButtonUl = styled.ul`
  display: flex;
  align-items: center;
  height: 60px;
  gap: 20px;
  list-style: none;
`;

function Play() {
  return (
    <MainContainer>
      <SectionContainer>
        <PlayGuide>
          <PlayGuideP>
            <PlayGuideSpan>카메라 정면:</PlayGuideSpan> 빈 영역 더블클릭 하세요
          </PlayGuideP>
          <PlayGuideP>
            <PlayGuideSpan>카메라 회전: </PlayGuideSpan> 빈 영역 드래그 하세요
          </PlayGuideP>
        </PlayGuide>

        <BottomLayout>
          <ButtonUl>
            <BottomLayoutLi>
              <RestartButton />
            </BottomLayoutLi>
            <BottomLayoutLi>
              <FinishButton>FINISH</FinishButton>
            </BottomLayoutLi>
          </ButtonUl>
        </BottomLayout>

        <ArrowButtonBox>
          <ButtonUl>
            <BottomLayoutLi>
              <UnFoldButton disabled>UNFOLD</UnFoldButton>
            </BottomLayoutLi>
            <BottomLayoutLi>
              <RollBackButton disabled />
            </BottomLayoutLi>
            <BottomLayoutLi>
              <CommitButton disabled />
            </BottomLayoutLi>
          </ButtonUl>
        </ArrowButtonBox>
      </SectionContainer>
      <Sidebar />
    </MainContainer>
  );
}

export default Play;
