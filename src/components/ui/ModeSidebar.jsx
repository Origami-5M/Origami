import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useTooltip, TOOLTIP_MESSAGES, TooltipText } from '../../utils/tooltip';

const SidebarContainer = styled.aside`
  position: absolute;
  right: ${({ $isVisible }) => ($isVisible ? '102px' : '-250px')};
  top: 2%;
  width: ${({ $isVisible }) => ($isVisible ? '269px' : '0px')};
  height: 96%;
  opacity: ${({ $isVisible }) => ($isVisible ? '1' : '0')};
  z-index: 30;
  overflow: hidden;
  box-sizing: border-box;
  padding: 30px 0 0 0;
  border-radius: 30px;
  background-color: #fff;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.25));
  transition: all 0.2s ease-in-out;
  display: block;
`;

const ModeList = styled.ul`
  list-style: none;
`;

const ModeItem = styled.li`
  margin-bottom: 35px;
  padding: 0 30px;
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    padding: 30px 30px;
    background-color: rgba(52, 51, 148, 0.1);
  }
`;
const ModeDiv = styled.div`
  position: relative;
  width: 209px;
  height: 155px;
  background-image: url(/src/assets/img/green-gamebg.png);
  background-size: contain;
  border-radius: 30px;
`;
const ModeH3 = styled.h3`
  position: absolute;
  bottom: 30px;
  left: 20px;
  color: rgb(255, 255, 255);
  font-size: 24px;
  font-weight: 900;
`;

const ModeP = styled.p`
  position: absolute;
  z-index: 1;
  top: -20px;
  right: -15px;
  width: 120px;
  height: 120px;
`;

const ModeImg = styled.img`
  width: 100%;
  height: 100%;
`;

const ModeSidebar = ({ modes, onSelectMode, isVisible }) => {
  const {
    tooltipVisible,
    tooltipMessage,
    tooltipPosition,
    handleMouseOver,
    handleMouseMove,
    handleMouseOut,
  } = useTooltip(TOOLTIP_MESSAGES);

  return (
    <>
      <SidebarContainer $isVisible={isVisible}>
        <ModeList>
          {modes.map(mode => (
            <ModeItem
              key={mode.id}
              onClick={() => onSelectMode(mode.id)}
              $data-guideMode={mode.id}
              data-tooltip-key="MODESELECT_TOOLTIP"
              onMouseOver={handleMouseOver}
              onMouseMove={handleMouseMove}
              onMouseOut={handleMouseOut}
            >
              <ModeDiv>
                <ModeH3>{mode.name}</ModeH3>
                <ModeP>
                  <ModeImg
                    src={mode.image}
                    alt={`${mode.name} 이미지`}
                    width="50"
                    height="50"
                  />
                </ModeP>
              </ModeDiv>
            </ModeItem>
          ))}
        </ModeList>
      </SidebarContainer>
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
};

ModeSidebar.propTypes = {
  modes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSelectMode: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
};

export default ModeSidebar;
