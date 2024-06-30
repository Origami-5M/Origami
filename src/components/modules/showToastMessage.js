const showToastMessages = (toastMessage, text) => {
  toastMessage.innerText = text;
  toastMessage.classList.add('active');

  setTimeout(() => {
    toastMessage.classList.remove('active');
  }, 2000);
};

export { showToastMessages };
