import { showToastMessage } from '../modules/showToastMessage';
import { TOAST_MESSAGE } from '../../constants';
import { frontColor, backColor } from '../../three/Paper';
import { db } from '../../../firebase';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';

const saveUserInfo = async (nickname, thumbnail, origamiChunks) => {
  try {
    const userRef = collection(db, 'users');
    const userDocRef = await addDoc(userRef, {
      nickname: nickname,
      thumbnail: thumbnail,
      colors: [frontColor, backColor],
    });

    const positionsCollectionRef = collection(userDocRef, 'positions');

    for (let index = 0; index < origamiChunks.length; index++) {
      const chunk = origamiChunks[index];
      const docRef = doc(positionsCollectionRef, index.toString());
      await setDoc(docRef, { positions: chunk });
    }

    showToastMessage(TOAST_MESSAGE.SUCCESS_SAVE);
    return userDocRef.id;
  } catch (error) {
    showToastMessage(TOAST_MESSAGE.ERROR_SAVE);
    throw error;
  }
};

export { saveUserInfo };
