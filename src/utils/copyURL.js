import TOAST_MESSAGE from '../constants/toastMessage';

const copyURL = async () => {
  const currentUrl = window.location.href;
  try {
    await navigator.clipboard.writeText(currentUrl);
    return TOAST_MESSAGE.URL_COPY;
  } catch (error) {
    return TOAST_MESSAGE.ERROR_COPY;
  }
};

export default copyURL;
