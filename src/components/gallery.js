const slideInner = document.querySelector('.slide-inner');
const prevButton = document.querySelector('.list-prev');
const nextButton = document.querySelector('.list-next');
const shareCont = document.querySelector('.share-modal');
const deleteButton = document.querySelector('.close-button');
const section = document.querySelector('section');
const shareIconButton = document.querySelector('.share-icon-button');

const totalItems = 18;
const itemsPerPage = 8;
const totalPages = Math.ceil(totalItems / itemsPerPage);

let currentPage = 0;

for (let i = 0; i < totalPages; i++) {
  const newPage = document.createElement('ul');
  newPage.classList.add('share-lists');
  newPage.style.flex = '0 0 100%';

  for (let j = 0; j < itemsPerPage; j++) {
    const itemIndex = i * itemsPerPage + j;
    if (itemIndex >= totalItems) break;

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

    newList.setAttribute('id', `share-list-${itemIndex + 1}`);

    newListImg.src = '/src/assets/img/complete.png';
    newListName.textContent = `New List Item ${itemIndex + 1}`;

    newPage.appendChild(newList);
  }

  slideInner.appendChild(newPage);
}

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

updateSlidePosition();

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

const shareModalOn = id => {
  const listId = id.toString();
  section.classList.add('active');
  shareCont.classList.remove('none');
};

const closeModal = () => {
  shareCont.classList.add('none');
  section.classList.remove('active');

  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);

  params.delete('ID');
  const newUrl = `${url.pathname}?${params.toString()}`;

  history.pushState({}, '', newUrl);
};

slideInner.addEventListener('click', event => {
  const shareList = event.target.closest('.share-list');
  if (shareList) {
    const listId = shareList.getAttribute('id');
    shareModalOn(listId);

    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    params.set('id', listId);
    const newUrl = `${url.pathname}?${params.toString()}`;

    history.pushState({ id: listId }, '', newUrl);
  }
});

deleteButton.addEventListener('click', closeModal);

const copyUrl = () => {
  const currentUrl = window.location.href;
  navigator.clipboard
    .writeText(currentUrl)
    .then(() => {
      alert('URL이 복사되었습니다.');
    })
    .catch(err => {
      console.error('URL 복사 중 오류가 발생했습니다:', err);
    });
};

shareIconButton.addEventListener('click', copyUrl);

const checkUrlForModal = () => {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const listId = params.get('id');

  if (listId) {
    const activeShareList = document.querySelector(`#${listId}`);
    if (activeShareList) {
      shareModalOn(listId);
    }
  }
};

checkUrlForModal();
