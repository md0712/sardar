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
 * Direct async fetch for enquiries from Firestore database
 */
export async function getEnquiriesAdmin() {
  try {
    const colRef = collection(db, ENQUIRIES_COLLECTION);
    const snap = await getDocs(colRef);
    const list = [];
    snap.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() });
    });
    list.sort((a, b) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });
    return list;
  } catch (err) {
    console.warn('Error fetching enquiries from Firestore:', err);
    return [];
  }
}

/**
 * Real-time listener for enquiries (Admin only)
 */
export function subscribeToEnquiriesAdmin(onUpdate, onError) {
  try {
    const colRef = collection(db, ENQUIRIES_COLLECTION);

    // Initial immediate fetch
    getEnquiriesAdmin().then((initial) => {
      if (Array.isArray(initial) && initial.length > 0) {
        onUpdate(initial);
      }
    }).catch(() => {});

    return onSnapshot(
      colRef,
      (snapshot) => {
        const list = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() });
        });
        list.sort((a, b) => {
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeB - timeA;
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

