import styled from 'styled-components';

const InfoWrap = styled.div`
  position: absolute;
  z-index: 3;
  bottom: 140px;
  right: 120px;
  display: none;
  font-size: 14px;
  border-radius: 30px;
  background-color: #fff;
  transition: all 0.2s ease-in-out;

  &.visible {
    display: block;
  }

  &::before {
    position: absolute;
    z-index: 3;
    bottom: -54px;
    right: -32px;
    content: '';
    width: 61px;
    height: 79px;
    background: url('/src/assets/img/speech-bubble.png') no-repeat -5px -30px;
    background-size: contain;
  }
`;

const InfoP = styled.p`
  width: 745px;
  padding: 30px;
  line-height: 1.8;
  text-align: left;
`;

const InfoSpan = styled.span`
  color: #343394;
  font-weight: 900;
`;

const Tooltip = () => {
  return (
    <InfoWrap className="visible">
      <InfoP>
        안녕하세요! 드래그를 사용하여 종이를 접는 방법을 알려드리겠습니다.
        <br />
        <br />
        <InfoSpan>드래그 하기:</InfoSpan> 마우스를 사용하여 접고 싶은 부분을
        클릭한 상태에서 원하는 방향으로 드래그하세요. 예를 들어, 종이의 한쪽
        끝을 클릭한 상태에서 위로 드래그하면, 종이가 위쪽으로 접힙니다.
        <br />
        <br />
        <InfoSpan>펼치기:</InfoSpan> 펼칠 수 있는 상태에선 UNFOLD가
        활성화됩니다. 활성화된 상태에서 펼치고 싶은 면을 클릭하면 펼칠 수
        있습니다.
        <br />
        <br />
        <InfoSpan>접기 방향 조절하기:</InfoSpan> 드래그 중에 마우스를 움직이는
        방향에 따라 접히는 각도와 방향이 실시간으로 조정됩니다. 원하는 각도에
        도달하면 마우스 클릭을 놓으세요. 그러면 종이가 그 상태로 접힙니다.
        <br />
        <br />
        <InfoSpan>다양한 각도에서 보기:</InfoSpan> 배경을 드래그하면 3D 공간에서
        종이를 회전시켜 다양한 각도에서 확인할 수 있습니다. 이렇게 하면 접힌
        부분을 더 명확하게 볼 수 있습니다. 재설정 및 되돌리기: 실수로 잘못
        접었다면, 상단 메뉴의 `되돌리기` 버튼을 눌러 이전 상태로 돌아갈 수
        있습니다. 또한, 처음부터 다시 시작하고 싶다면 `재설정` 버튼을 누르면
        됩니다. 지금부터 즐거운 종이접기를 즐겨보세요!
      </InfoP>
    </InfoWrap>
  );
};

export default Tooltip;
