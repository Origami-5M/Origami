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

document.addEventListener('DOMContentLoaded', async () => {
  const slideInner = document.querySelector('.slide-inner');
  const prevButton = document.querySelector('.list-prev');
  const nextButton = document.querySelector('.list-next');
  const shareCont = document.querySelector('.share-modal');
  const deleteButton = document.querySelector('.close-button');
  const section = document.querySelector('section');
  const shareIconButton = document.querySelector('.share-icon-button');
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const idValue = params.get('id');
  const sceneCont = document.querySelector('.detail-scene');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer();

  renderer.setSize(sizes.width, sizes.height);
  sceneCont.appendChild(renderer.domElement);
  camera.position.z = 5;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  animate();

  let currentPage = 0;
  let totalPages = 0;

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
      newListImg.src =
        shareListData.thumbnail || '../assets/img/guide/guide.png';
      newListName.textContent = `${shareListData.nickname}`;

      return newList;
    } catch (error) {
      console.error('Error fetching user document:', error);
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
          }
        }

        slideInner.appendChild(newPage);
      }

      updateSlidePosition();
      checkUrlForModal(idValue);
      await handleUserPositions(idValue);
    } catch (error) {
      console.error('Error creating pages:', error);
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

  const shareModalOn = async id => {
    section.classList.add('active');
    shareCont.classList.remove('none');

    const userDocument = await fetchUserDocument(id);
    const nickname = userDocument.nickname;

    const modalHeading = shareCont.querySelector('h3');
    modalHeading.textContent = nickname;
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

  const copyUrl = () => {
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        showToastMessage(TOAST_MESSAGE.URL_COPY);
      })
      .catch(err => {
        console.error('URL 복사 중 오류가 발생했습니다:', err);
      });
  };

  shareIconButton.addEventListener('click', copyUrl);

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
        console.log(saveCoordinates);
        if (saveCoordinates.length) {
          renderOrigami(saveCoordinates);
        }
      } catch (error) {
        console.error('Error fetching user positions:', error);
      }
    } else {
      console.warn('idValue is null or undefined');
    }
  };

  const renderOrigami = positionsData => {
    positionsData.forEach(positions => {
      const geometry = new THREE.BufferGeometry();
      const vertices = new Float32Array(positions.length);

      for (let i = 0; i < positions.length; i++) {
        vertices[i] = positions[i];
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

      const material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true,
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    });
  };

  // 기존 positionsData 사용 예제
  // const positionsData = [
  //   // 첫 번째 데이터셋 (예: 삼각형)
  //   [
  //     new THREE.Vector3(1, 1, 0),
  //     new THREE.Vector3(-1, 1, 0),
  //     new THREE.Vector3(0, -1, 0)
  //   ],
  //   // 두 번째 데이터셋 (예: 또 다른 삼각형)
  //   [
  //     new THREE.Vector3(2, 2, 0),
  //     new THREE.Vector3(-2, 2, 0),
  //     new THREE.Vector3(0, -2, 0)
  //   ]
  // ];

  // renderOrigami(positionsData);
});
