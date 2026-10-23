import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const REVIEWS_COLLECTION = 'reviews';
const ENQUIRIES_COLLECTION = 'enquiries';

/**
 * Submit customer feedback / review to Firestore.
 * Saves to both 'reviews' collection and 'enquiries' collection
 * to ensure seamless visibility across Admin Panel and real-time feeds.
 */
export async function createCustomerReview(reviewData) {
  const cleanData = {
    name: reviewData.name?.trim() || 'Valued Customer',
    phone: reviewData.phone?.trim() || '',
    contact: reviewData.phone?.trim() || reviewData.contact?.trim() || '',
    email: reviewData.email?.trim() || '',
    rating: Number(reviewData.rating) || 5,
    category: reviewData.category || 'General Showroom Feedback',
    branch: reviewData.branch || 'Flagship Showroom (Vyasarpadi / Erukancheri, Chennai - 39)',
    message: reviewData.message?.trim() || reviewData.feedback?.trim() || '',
    feedback: reviewData.message?.trim() || reviewData.feedback?.trim() || '',
    status: reviewData.status || 'New',
    source: 'Contact Page',
    date: reviewData.date || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    createdAt: serverTimestamp()
  };

  try {
    // 1. Primary write to 'reviews' collection
    const reviewsColRef = collection(db, REVIEWS_COLLECTION);
    const reviewDoc = await addDoc(reviewsColRef, cleanData);

    // 2. Also ensure enquiry sync in 'enquiries' collection for double reliability
    try {
      const enquiriesColRef = collection(db, ENQUIRIES_COLLECTION);
      await addDoc(enquiriesColRef, {
        ...cleanData,
        reviewId: reviewDoc.id
      });
    } catch (enquiryErr) {
      console.warn('Enquiries collection sync notice:', enquiryErr.message);
    }

    return { id: reviewDoc.id, ...cleanData };
  } catch (err) {
    console.error('Error saving review to Firestore:', err);
    // If rules or network fail, attempt saving to enquiries as fallback
    try {
      const enquiriesColRef = collection(db, ENQUIRIES_COLLECTION);
      const enqDoc = await addDoc(enquiriesColRef, cleanData);
      return { id: enqDoc.id, ...cleanData };
    } catch (fallbackErr) {
      console.error('Fallback enquiry write failed:', fallbackErr);
      throw err;
    }
  }
}

/**
 * Real-time listener for customer reviews & feedback (Admin only)
 */
export function subscribeToReviews(onUpdate, onError) {
  try {
    const colRef = collection(db, REVIEWS_COLLECTION);
    const q = query(colRef, orderBy('createdAt', 'desc'));

    return onSnapshot(
      q,
      (snapshot) => {
        const list = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() });
        });
        onUpdate(list);
      },
      (error) => {
        // Fallback without orderBy if composite index is pending
        console.warn('Reviews orderBy listener notice, falling back to simple query:', error.message);
        try {
          return onSnapshot(
            colRef,
            (snap) => {
              const list = [];
              snap.forEach((docSnap) => {
                list.push({ id: docSnap.id, ...docSnap.data() });
              });
              // Sort locally by date or createdAt
              list.sort((a, b) => {
                const timeA = a.createdAt?.seconds || 0;
                const timeB = b.createdAt?.seconds || 0;
                return timeB - timeA;
              });
              onUpdate(list);
            },
            (fallbackErr) => {
              if (onError) onError(fallbackErr);
            }
          );
        } catch (e) {
          if (onError) onError(error);
        }
      }
    );
  } catch (err) {
    console.warn('Could not establish real-time reviews listener:', err);
    return () => {};
  }
}

/**
 * Update review/feedback status (e.g. 'New', 'Contacted', 'Resolved')
 */
export async function updateReviewStatus(reviewId, status) {
  try {
    const docRef = doc(db, REVIEWS_COLLECTION, String(reviewId));
    await updateDoc(docRef, { 
      status,
      updatedAt: serverTimestamp()
    });
    return { id: reviewId, status };
  } catch (err) {
    console.error('Error updating review status:', err);
    throw err;
  }
}

/**
 * Delete a review/feedback document from Firestore
 */
export async function deleteReview(reviewId) {
  try {
    const docRef = doc(db, REVIEWS_COLLECTION, String(reviewId));
    await deleteDoc(docRef);
    return { id: reviewId };
  } catch (err) {
    console.error('Error deleting review:', err);
    throw err;
  }
}
