const infoButton = document.querySelector('.info-button');

const toggleInfo = () => {
  document.querySelector('.info-wrap').classList.toggle('visible');
};

infoButton.addEventListener('click', toggleInfo);
