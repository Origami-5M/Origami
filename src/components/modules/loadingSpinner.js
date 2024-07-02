let playContainer = document.getElementById('play-container');
const shareContainer = document.getElementById('share-container');

const createLoadingSpinner = () => {
  const loadingSpinner = document.createElement('div');
  const loadingInfo = document.createElement('p');
  loadingSpinner.id = 'loading-spinner';
  loadingSpinner.className = 'loading-spinner';
  loadingSpinner.appendChild(loadingInfo);

  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    loadingSpinner.appendChild(dot);
  }

  return loadingSpinner;
};

const showLoadingSpinner = () => {
  let loadingSpinner = document.getElementById('loading-spinner');
  let confetti = document.getElementById('confetti-canvas');

  if (!loadingSpinner) {
    loadingSpinner = createLoadingSpinner();
    document.body.appendChild(loadingSpinner);
  }

  if (playContainer) {
    playContainer.style.opacity = '0';
  }

  if (confetti) {
    confetti.style.right = '-9999px';
  }

  loadingSpinner.style.display = 'flex';
};

const hideLoadingSpinner = () => {
  const loadingSpinner = document.getElementById('loading-spinner');
  if (loadingSpinner) {
    loadingSpinner.style.display = 'none';
  }

  if (shareContainer) {
    shareContainer.style.display = 'flex';
  }
};

export { showLoadingSpinner, hideLoadingSpinner };
