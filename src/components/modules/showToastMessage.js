const toastMessage = document.querySelector('#toastMessage');

const showToastMessage = text => {
  toastMessage.innerText = text;
  toastMessage.classList.add('active');

  setTimeout(() => {
    toastMessage.classList.remove('active');
  }, 2000);
};

export { showToastMessage };
