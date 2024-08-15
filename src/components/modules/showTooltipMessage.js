import { TOOLTIP_MESSAGES } from '../../constants/index';

export function moveTooltip(event, tooltipText) {
  const tooltipRect = tooltipText.getBoundingClientRect();
  const offsetX = 10;
  const offsetY = 20;

  let tooltipX = event.clientX + offsetX;
  let tooltipY = event.clientY + offsetY;

  if (tooltipX + tooltipRect.width > window.innerWidth) {
    tooltipX = event.clientX - tooltipRect.width - offsetX;
  }
  if (tooltipY + tooltipRect.height > window.innerHeight) {
    tooltipY = event.clientY - tooltipRect.height - offsetY;
  }

  tooltipText.style.left = `${tooltipX}px`;
  tooltipText.style.top = `${tooltipY}px`;
}

document.querySelectorAll('.tooltip-button').forEach(button => {
  let tooltipText;

  button.addEventListener('mouseover', function (event) {
    const tooltipKey = this.getAttribute('data-tooltip-key');
    const tooltipMessage = TOOLTIP_MESSAGES[tooltipKey];

    if (tooltipMessage) {
      tooltipText = document.createElement('span');
      tooltipText.className = 'tooltip-text';
      tooltipText.textContent = tooltipMessage;
      tooltipText.style.position = 'fixed';
      tooltipText.style.visibility = 'visible';
      tooltipText.style.opacity = '1';
      document.body.appendChild(tooltipText);
      moveTooltip(event, tooltipText);
    }
  });

  button.addEventListener('mousemove', event =>
    moveTooltip(event, tooltipText)
  );

  button.addEventListener('mouseout', function () {
    if (tooltipText) {
      tooltipText.style.visibility = 'hidden';
      tooltipText.style.opacity = '0';
      document.body.removeChild(tooltipText);
      tooltipText = null;
    }
  });
});
