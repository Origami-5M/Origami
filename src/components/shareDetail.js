const detailContainer = document.querySelector('.detailContainer-container');
const shareScene = document.createElement('div');
const shareLayoutBottom = document.createElement('div');
const shareName = document.createElement('h3');
const shareIcon = document.createElement('button');

detailContainer.appendChild(shareScene);
shareScene.setAttribute('class', 'detailContainer-scene');
detailContainer.appendChild(shareLayoutBottom);
shareLayoutBottom.setAttribute('class', 'share-info');
shareLayoutBottom.appendChild(shareName);
shareName.setAttribute('class', 'detailContainer-name');
shareLayoutBottom.appendChild(shareIcon);
shareIcon.setAttribute('class', 'share-icon circle-button');
