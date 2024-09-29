import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';

const fetchUserDocument = async id => {
  const docRef = doc(db, 'users', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.error('데이터가 없습니다.');
    return null;
  }
};

const fetchAllUserDocuments = async () => {
  try {
    const usersDoc = await getDocs(collection(db, 'users'));
    const allDocuments = [];

    usersDoc.docs.forEach(doc => {
      const data = doc.data();
      allDocuments.push({ id: doc.id, ...data });
    });

    return allDocuments;
  } catch (error) {
    console.error(
      '사용자의 데이터를 처리하는 도중 에러가 발생했습니다.',
      error
    );
    throw error;
  }
};

const fetchUserPositions = async userId => {
  try {
    const usersCollectionRef = collection(db, 'users', userId, 'positions');
    const usersCoordinatedRef = await getDocs(usersCollectionRef);
    const positionsPromises = usersCoordinatedRef.docs.map(doc => {
      return doc.data().positions;
    });

    const positionsData = await Promise.all(positionsPromises);

    return positionsData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export { fetchAllUserDocuments, fetchUserDocument, fetchUserPositions };
