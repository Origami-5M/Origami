import styled from 'styled-components';

const FlexColumnCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CompleteMain = styled(FlexColumnCenter)`
  width: 100%;
  height: 100%;
  padding: 20px 0;
`;

const CompleteScene = styled.div`
  width: 390px;
  height: 390px;
  background-color: white;
`;

const Input = styled.input`
  font-size: 14px;
  width: 487px;
  height: 35px;
  margin-top: 20px;
  padding: 20px 40px;
  border: none;
  border-radius: 35px;

  &:focus {
    outline: none;
  }
`;

const CompleteButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const RoundButton = styled.button`
  box-sizing: border-box;
  height: 60px;
  padding: 15px 35px;
  border-radius: 60px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
`;

const RestartButton = styled(RoundButton)`
  background-color: #9797c9;

  &:hover {
    background-color: #6464a7;
  }
`;

const ButtonRed = styled(RoundButton)`
  background-color: #f2482e;

  &:hover {
    background-color: #d5250a;
  }
`;

const CompletePage = () => {
  return (
    <CompleteMain>
      <CompleteScene />
      <form>
        <Input type="text" placeholder="등록할 이름을 입력해주세요." />
      </form>
      <CompleteButtonContainer>
        <RestartButton>RESTART</RestartButton>
        <ButtonRed>SHARE</ButtonRed>
      </CompleteButtonContainer>
    </CompleteMain>
  );
};

export default CompletePage;
