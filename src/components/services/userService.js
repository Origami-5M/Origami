import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

const saveUserInfo = async (nickname, thumbnail, origamiPositions) => {
  try {
    const userRef = collection(db, 'users');
    const docRef = await addDoc(userRef, {
      nickname: nickname,
      thumbnail: thumbnail,
      positions: origamiPositions,
    });

    console.log('사용자 정보가 Firestore에 저장되었습니다.');
    return docRef.id;
  } catch (error) {
    console.error('사용자 정보 저장 중 오류가 발생했습니다:', error);
    throw error;
  }
};

export { saveUserInfo };
