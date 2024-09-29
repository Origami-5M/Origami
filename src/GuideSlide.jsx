import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTooltip, TOOLTIP_MESSAGES, TooltipText } from './utils/tooltip';

const GUIDE_IMAGES = {
  puppy: [
    'src/assets/img/guide/puppy-guide1.png',
    'src/assets/img/guide/puppy-guide2.png',
    'src/assets/img/guide/puppy-guide3.png',
    'src/assets/img/guide/puppy-guide5.png',
    'src/assets/img/guide/puppy-guide4.png',
    'src/assets/img/guide/puppy-guide6.png',
    'src/assets/img/guide/puppy-guide7.png',
  ],
  plane: [
    'src/assets/img/guide/plane-guide1.png',
    'src/assets/img/guide/plane-guide2.png',
    'src/assets/img/guide/plane-guide3.png',
    'src/assets/img/guide/plane-guide4.png',
    'src/assets/img/guide/plane-guide5.png',
    'src/assets/img/guide/plane-guide6.png',
    'src/assets/img/guide/plane-guide7.png',
    'src/assets/img/guide/plane-guide8.png',
    'src/assets/img/guide/plane-guide9.png',
    'src/assets/img/guide/plane-guide10.png',
    'src/assets/img/guide/plane-guide11.png',
    'src/assets/img/guide/plane-guide12.png',
  ],
};

const GuideWrap = styled.div`
  position: absolute;
  top: 39px;
  left: 57px;
  padding: 16px 60px;
  border-radius: 30px;
  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const GuideSlider = styled.div`
  width: 160px;
  height: 160px;
  overflow: hidden;
  border-radius: 10px;
`;

const Slider = styled.ul`
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  transition: transform 0.5s;
`;

const SliderItem = styled.li`
  display: flex;
  justify-content: center;
  width: 160px;
  height: 160px;
  background-color: #e7e6ff;
  flex-shrink: 0;
`;

const SliderImage = styled.img`
  width: 120px;
  height: 120px;
`;

const ArrowDiv = styled.div``;

const ArrowButton = styled.button`
  position: absolute;
  top: 42%;
  width: 16px;
  height: 26px;
  background-repeat: no-repeat;
  background-color: transparent;
  border: none;
  cursor: pointer;
  &.tooltip-button {
  }
`;

const PrevButton = styled(ArrowButton)`
  left: 24px;
  background-image: url('/src/assets/img/checked_sprites.png');
  background-position: -20px -72px;
`;

const NextButton = styled(ArrowButton)`
  right: 20px;
  background-image: url('/src/assets/img/checked_sprites.png');
  background-position: -80px -18px;
`;

const Pagination = styled.div`
  position: absolute;
  bottom: 26px;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 10px;
  color: #343394;
  font-size: 16px;
  text-align: center;
`;

const PaginationText = styled.span``;

const GuideSlide = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const [slideList, setSlideList] = useState(GUIDE_IMAGES['puppy']);
  const [currentIdx, setCurrentIdx] = useState(0);
  const listWidth = 160;
  const {
    tooltipVisible,
    tooltipMessage,
    tooltipPosition,
    handleMouseOver,
    handleMouseMove,
    handleMouseOut,
  } = useTooltip(TOOLTIP_MESSAGES);

  useEffect(() => {
    setSlideList(GUIDE_IMAGES[mode] || []);
  }, [mode]);

  const moveSlide = direction => {
    if (direction === 'next' && currentIdx < slideList.length - 1) {
      setCurrentIdx(prevIdx => prevIdx + 1);
    } else if (direction === 'prev' && currentIdx > 0) {
      setCurrentIdx(prevIdx => prevIdx - 1);
    }
  };

  return (
    <GuideWrap>
      <GuideSlider>
        <Slider
          style={{ transform: `translateX(-${listWidth * currentIdx}px)` }}
        >
          {slideList.map((imageSrc, index) => (
            <SliderItem key={index}>
              <SliderImage src={imageSrc} alt={`Slide ${index + 1}`} />
            </SliderItem>
          ))}
        </Slider>
      </GuideSlider>
      <ArrowDiv>
        {currentIdx > 0 && (
          <PrevButton
            onClick={() => moveSlide('prev')}
            onMouseOver={handleMouseOver}
            onMouseMove={handleMouseMove}
            onMouseOut={handleMouseOut}
            className="tooltip-button"
            data-tooltip-key="PREV_TOOLTIP"
          />
        )}
        {currentIdx < slideList.length - 1 && (
          <NextButton
            onClick={() => moveSlide('next')}
            onMouseOver={handleMouseOver}
            onMouseMove={handleMouseMove}
            onMouseOut={handleMouseOut}
            className="tooltip-button"
            data-tooltip-key="NEXT_TOOLTIP"
          />
        )}
      </ArrowDiv>
      <Pagination>
        <PaginationText>
          {currentIdx + 1} / {slideList.length}
        </PaginationText>
      </Pagination>
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
    </GuideWrap>
  );
};

export default GuideSlide;
