import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const ENQUIRIES_COLLECTION = 'enquiries';

/**
 * Submit an enquiry (public)
 */
export async function createEnquiry(enquiryData) {
  const colRef = collection(db, ENQUIRIES_COLLECTION);
  const docRef = await addDoc(colRef, {
    ...enquiryData,
    status: enquiryData.status || 'New',
    createdAt: serverTimestamp()
  });
  return { id: docRef.id, ...enquiryData };
}

/**
 * Real-time listener for enquiries (Admin only)
 */
export function subscribeToEnquiriesAdmin(onUpdate, onError) {
  try {
    const colRef = collection(db, ENQUIRIES_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const list = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() });
        });
        onUpdate(list);
      },
      (error) => {
        console.warn('Real-time enquiries listener notice:', error.message);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn('Could not establish real-time enquiries listener:', err);
    return () => {};
  }
}

/**
 * Update enquiry status (Admin only)
 */
export async function updateEnquiryStatus(enquiryId, status) {
  const docRef = doc(db, ENQUIRIES_COLLECTION, String(enquiryId));
  await updateDoc(docRef, { status });
  return { id: enquiryId, status };
}

/**
 * Delete enquiry (Admin only)
 */
export async function deleteEnquiry(enquiryId) {
  const docRef = doc(db, ENQUIRIES_COLLECTION, String(enquiryId));
  await deleteDoc(docRef);
  return { id: enquiryId };
}

