import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const PROMO_COLLECTION = 'promoCodes';

/**
 * Fetch all promo codes from Firestore.
 * Returns empty array [] if collection is empty.
 */
export async function getPromoCodes() {
  try {
    const colRef = collection(db, PROMO_COLLECTION);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return [];

    const promos = [];
    snapshot.forEach((snap) => {
      promos.push({
        id: snap.id,
        ...snap.data()
      });
    });
    return promos;
  } catch (error) {
    console.warn('Firestore getPromoCodes error:', error.message);
    try {
      // Fallback without orderBy in case index is not yet built
      const colRef = collection(db, PROMO_COLLECTION);
      const snap = await getDocs(colRef);
      const items = [];
      snap.forEach((d) => items.push({ id: d.id, ...d.data() }));
      return items;
    } catch {
      return [];
    }
  }
}

/**
 * Real-time subscription to promoCodes collection in Firestore.
 */
export function subscribeToPromoCodes(callback) {
  try {
    const colRef = collection(db, PROMO_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (snapshot.empty) {
          callback([]);
          return;
        }
        const items = [];
        snapshot.forEach((snap) => {
          items.push({
            id: snap.id,
            ...snap.data()
          });
        });
        // Sort newest first if createdAt exists
        items.sort((a, b) => {
          const tA = a.createdAt?.seconds || 0;
          const tB = b.createdAt?.seconds || 0;
          return tB - tA;
        });
        callback(items);
      },
      (error) => {
        console.warn('Real-time promoCodes listener error:', error.message);
        callback([]);
      }
    );
  } catch (err) {
    console.warn('subscribeToPromoCodes setup failed:', err);
    return () => {};
  }
}

/**
 * Create a new promo code document in Firestore.
 * @param {Object} promoData
 * @param {string} promoData.code - e.g. "FESTIVE25"
 * @param {number} promoData.discountPercentage - e.g. 25 (%)
 * @param {number} promoData.maxDiscountAmount - e.g. 40000 (limit)
 * @param {number} [promoData.minOrderAmount] - e.g. 1000
 * @param {string} [promoData.description] - e.g. "25% discount upto ₹40,000"
 * @param {string} [promoData.validTill] - e.g. "Valid till 31 Dec 2026"
 */
export async function createPromoCode(promoData) {
  const code = (promoData.code || '').trim().toUpperCase();
  if (!code) {
    throw new Error('Promo code name is required.');
  }

  const discountPercentage = Number(promoData.discountPercentage) || 0;
  if (discountPercentage <= 0 || discountPercentage > 100) {
    throw new Error('Offer percentage must be between 1 and 100%.');
  }

  const maxDiscountAmount = Number(promoData.maxDiscountAmount) || 0;
  const minOrderAmount = Number(promoData.minOrderAmount) || 0;
  const description = promoData.description?.trim() || `${discountPercentage}% OFF on orders upto ₹${maxDiscountAmount.toLocaleString('en-IN')}`;
  const validTill = promoData.validTill?.trim() || 'Valid until stocks last';
  const status = promoData.status || 'active';

  // Sanitize data for Firestore
  const newPromo = {
    code,
    discountPercentage,
    maxDiscountAmount,
    minOrderAmount,
    description,
    validTill,
    status,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const colRef = collection(db, PROMO_COLLECTION);
  const docRef = await addDoc(colRef, newPromo);
  return { id: docRef.id, ...newPromo };
}

/**
 * Update an existing promo code
 */
export async function updatePromoCode(id, updates) {
  const docRef = doc(db, PROMO_COLLECTION, id);
  const sanitized = {
    ...updates,
    updatedAt: serverTimestamp()
  };
  if (sanitized.code) sanitized.code = sanitized.code.trim().toUpperCase();
  if (sanitized.discountPercentage !== undefined) sanitized.discountPercentage = Number(sanitized.discountPercentage);
  if (sanitized.maxDiscountAmount !== undefined) sanitized.maxDiscountAmount = Number(sanitized.maxDiscountAmount);
  if (sanitized.minOrderAmount !== undefined) sanitized.minOrderAmount = Number(sanitized.minOrderAmount);

  await updateDoc(docRef, sanitized);
  return { id, ...sanitized };
}

/**
 * Toggle promo code active / inactive
 */
export async function togglePromoCodeStatus(id, currentStatus) {
  const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
  const docRef = doc(db, PROMO_COLLECTION, id);
  await updateDoc(docRef, {
    status: newStatus,
    updatedAt: serverTimestamp()
  });
  return newStatus;
}

/**
 * Delete a promo code from Firestore
 */
export async function deletePromoCode(id) {
  const docRef = doc(db, PROMO_COLLECTION, id);
  await deleteDoc(docRef);
  return id;
}

/**
 * Calculate promo discount based on subtotal and promo configuration
 */
export function calculatePromoDiscount(promo, subtotal) {
  if (!promo || promo.status === 'inactive') return 0;
  if (promo.minOrderAmount && subtotal < promo.minOrderAmount) {
    return 0;
  }
  const rawDiscount = Math.round(subtotal * (Number(promo.discountPercentage) / 100));
  if (promo.maxDiscountAmount && promo.maxDiscountAmount > 0) {
    return Math.min(rawDiscount, promo.maxDiscountAmount);
  }
  return rawDiscount;
}
