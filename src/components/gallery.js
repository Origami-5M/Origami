import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { showToastMessage } from './modules/showToastMessage';
import { TOAST_MESSAGE } from '../constants';
import {
  fetchUserDocument,
  fetchAllUserDocuments,
  fetchUserPositions,
} from '../components/services/getUserService';
import { sizes } from '../three/Sizes';
import {
  showLoadingSpinner,
  hideLoadingSpinner,
} from './modules/loadingSpinner';

let slideInner,
  prevButton,
  nextButton,
  shareCont,
  deleteButton,
  section,
  shareIconButton,
  sceneCont;
let scene, camera, renderer, controls;
let currentPage = 0;
let totalPages = 0;

showLoadingSpinner();

const makeShareList = async id => {
  try {
    const shareListData = await fetchUserDocument(id);
    const newList = document.createElement('li');
    newList.setAttribute('class', 'share-list');
    const newListContWrap = document.createElement('div');
    const newListImgWrap = document.createElement('div');
    const newListImg = document.createElement('img');
    const newListName = document.createElement('h3');

    newList.appendChild(newListContWrap);
    newListContWrap.setAttribute('class', 'list-cont');

    newListContWrap.appendChild(newListImgWrap);
    newListImgWrap.appendChild(newListImg);
    newListImgWrap.setAttribute('class', 'img-wrap');

    newListContWrap.appendChild(newListName);
    newListName.setAttribute('class', 'share-title');

    newList.setAttribute('id', id);
    newListImg.src = shareListData.thumbnail || '/assets/img/guide/guide.png';
    newListName.textContent = `${shareListData.nickname}`;

    return newList;
  } catch (error) {
    showToastMessage(TOAST_MESSAGE.ERROR_DEFAULT);
  }
};

const createPages = async () => {
  try {
    const allItems = await fetchAllUserDocuments();
    const totalItems = allItems.length;
    const itemsPerPage = 8;
    totalPages = Math.ceil(totalItems / itemsPerPage);

    for (let i = 0; i < totalPages; i++) {
      const newPage = document.createElement('ul');
      newPage.classList.add('share-lists');
      newPage.style.flex = '0 0 100%';

      for (let j = 0; j < itemsPerPage; j++) {
        const itemIndex = i * itemsPerPage + j;
        if (itemIndex >= totalItems) break;

        const newList = await makeShareList(allItems[itemIndex].id);
        if (newList) {
          newPage.appendChild(newList);
          hideLoadingSpinner();
        }
      }

      slideInner.appendChild(newPage);
    }

    updateSlidePosition();
    checkUrlForModal(new URLSearchParams(window.location.search).get('id'));
    await handleUserPositions(
      new URLSearchParams(window.location.search).get('id')
    );
  } catch (error) {
    showToastMessage(TOAST_MESSAGE.ERROR_DEFAULT);
  }
};

const updateSlidePosition = () => {
  slideInner.style.transform = `translateX(-${currentPage * 100}%)`;

  if (currentPage === 0) {
    prevButton.style.display = 'none';
  } else {
    prevButton.style.display = 'block';
  }

  if (currentPage === totalPages - 1) {
    nextButton.style.display = 'none';
  } else {
    nextButton.style.display = 'block';
  }
};

const shareModalOn = async id => {
  if (!section || !shareCont) {
    console.error('DOM elements are not initialized');
    return;
  }

  section.classList.add('active');
  shareCont.classList.remove('none');

  const userDocument = await fetchUserDocument(id);
  const nickname = userDocument.nickname;

  const modalHeading = shareCont.querySelector('h3');
  if (modalHeading) {
    modalHeading.textContent = nickname;
  } else {
    console.error('Modal heading element not found');
  }

  await handleUserPositions(id);

  hideLoadingSpinner();
};

const closeModal = () => {
  shareCont.classList.add('none');
  section.classList.remove('active');

  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);

  params.delete('id');
  const newUrl = `${url.pathname}?${params.toString()}`;

  history.pushState({}, '', newUrl);
};

const copyUrl = () => {
  const currentUrl = window.location.href;
  navigator.clipboard
    .writeText(currentUrl)
    .then(() => {
      showToastMessage(TOAST_MESSAGE.URL_COPY);
    })
    .catch(() => {
      showToastMessage(TOAST_MESSAGE.ERROR_COPY);
    });
};

const checkUrlForModal = async idValue => {
  if (idValue) {
    const escapedIdValue = CSS.escape(idValue);
    const activeShareList = document.querySelector(`#${escapedIdValue}`);
    if (activeShareList) {
      shareModalOn(idValue);
    }
  }
};

const handleUserPositions = async idValue => {
  if (idValue) {
    try {
      const saveCoordinates = await fetchUserPositions(idValue);
      if (saveCoordinates.length) {
        renderOrigami(saveCoordinates);
      }
    } catch (error) {
      showToastMessage(TOAST_MESSAGE.ERROR_DEFAULT);
    }
  }
};

const renderOrigami = positionsData => {
  if (!scene || !scene.children) {
    console.error(
      'Scene is not initialized or does not have children property'
    );
    return;
  }

  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }

  const flattenedPositions = positionsData.flat();
  const geometry = new THREE.PlaneGeometry();
  const vertices = new Float32Array(flattenedPositions);

  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

  const indices = [];
  for (let i = 0; i < flattenedPositions.length / 3 - 2; i += 3) {
    indices.push(i, i + 1, i + 2);
  }
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const material = new THREE.MeshBasicMaterial({
    color: 0x0077ff,
    wireframe: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
};

document.addEventListener('DOMContentLoaded', async () => {
  slideInner = document.querySelector('.slide-inner');
  prevButton = document.querySelector('.list-prev');
  nextButton = document.querySelector('.list-next');
  shareCont = document.querySelector('.share-modal');
  deleteButton = document.querySelector('.close-button');
  section = document.querySelector('section');
  shareIconButton = document.querySelector('.share-icon-button');
  sceneCont = document.querySelector('.detail-scene');

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer();

  renderer.setClearColor('#ffffff');
  renderer.setSize(sizes.width, sizes.height);
  sceneCont.appendChild(renderer.domElement);
  camera.position.z = 5;

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  animate();

  createPages();

  nextButton.addEventListener('click', () => {
    if (currentPage < totalPages - 1) {
      currentPage++;
      updateSlidePosition();
    }
  });

  prevButton.addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage--;
      updateSlidePosition();
    }
  });

  slideInner.addEventListener('click', async event => {
    const shareList = event.target.closest('.share-list');
    if (shareList) {
      const listId = shareList.getAttribute('id');
      await shareModalOn(listId);

      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);
      params.set('id', listId);
      const newUrl = `${url.pathname}?${params.toString()}`;

      history.pushState({ id: listId }, '', newUrl);

      await handleUserPositions(listId);
    }
  });

  deleteButton.addEventListener('click', closeModal);
  shareIconButton.addEventListener('click', copyUrl);
});

const initializeElements = doc => {
  slideInner = doc.querySelector('.slide-inner');
  prevButton = doc.querySelector('.list-prev');
  nextButton = doc.querySelector('.list-next');
  shareCont = doc.querySelector('.share-modal');
  deleteButton = doc.querySelector('.close-button');
  section = doc.querySelector('section');
  shareIconButton = doc.querySelector('.share-icon-button');
  sceneCont = doc.querySelector('.detail-scene');
};

const setScene = newScene => {
  scene = newScene;
};

export {
  makeShareList,
  createPages,
  updateSlidePosition,
  shareModalOn,
  closeModal,
  copyUrl,
  checkUrlForModal,
  handleUserPositions,
  renderOrigami,
  initializeElements,
  setScene,
};
