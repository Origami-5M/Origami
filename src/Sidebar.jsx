import styled, { css } from 'styled-components';

export default function Sidebar() {
  const commonButtonStyle = css`
    display: block;
    margin-bottom: 15px;
    text-align: center;
    border-radius: 999px;
    width: 60px;
    height: 60px;
    opacity: 0.5;
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
    background: url(/src/assets/img/nav_sprites.png) no-repeat -5px -8px;
  `;

  const TooltipListButton = styled.button`
    ${commonButtonStyle};
    background: url(/src/assets/img/nav_sprites.png) no-repeat -184px -80px;
  `;

  const TooltipGalleryButton = styled.button`
    ${commonButtonStyle};
    background: url(/src/assets/img/nav_sprites.png) no-repeat -97px -8px;
  `;

  const TooltipSoundButton = styled.button`
    ${commonButtonStyle};
    background: url(/src/assets/img/nav_sprites.png) no-repeat -100px -80px;
  `;

  const TooltipGuideButton = styled.button`
    ${commonButtonStyle};
    background: url(/src/assets/img/nav_sprites.png) no-repeat -4px -81px;
  `;

  return (
    <SideNav>
      <SideDiv>
        <TooltipHomeButton />
        <TooltipListButton />
        <TooltipGalleryButton />
      </SideDiv>
      <SideDiv>
        <TooltipSoundButton />
        <TooltipGuideButton />
      </SideDiv>
    </SideNav>
  );
}
