import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';

const fetchUserDocument = async id => {
  const docRef = doc(db, 'users', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.error('No such document!');
    return null;
  }
};

async function fetchAllUserDocuments() {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const allDocuments = [];

    querySnapshot.forEach(doc => {
      const data = doc.data();
      allDocuments.push({ id: doc.id, ...data });
    });

    return allDocuments;
  } catch (error) {
    console.error('Error fetching all user documents:', error);
    throw error;
  }
}

export { fetchAllUserDocuments, fetchUserDocument };
