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
  writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { categories as defaultCategories } from '../data/products';

const CATEGORIES_COLLECTION = 'categories';

/**
 * Fetch all categories from Firestore.
 * If collection is empty, automatically seeds with default categories from products.js.
 */
export async function getCategories() {
  try {
    const colRef = collection(db, CATEGORIES_COLLECTION);
    const snapshot = await getDocs(colRef);

    if (snapshot.empty) {
      return [];
    }

    const items = [];
    snapshot.forEach((docSnap) => {
      items.push({
        id: docSnap.id,
        ...docSnap.data()
      });
    });

    // Sort by order or createdAt or fallback
    return items.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.warn('Firestore getCategories error:', error.message);
    return [];
  }
}

/**
 * Real-time subscription to categories in Firestore.
 */
export function subscribeToCategories(callback) {
  try {
    const colRef = collection(db, CATEGORIES_COLLECTION);
    return onSnapshot(
      colRef,
      async (snapshot) => {
        if (snapshot.empty) {
          callback([]);
          return;
        }

        const items = [];
        snapshot.forEach((docSnap) => {
          items.push({
            id: docSnap.id,
            ...docSnap.data()
          });
        });

        // Sort by order or fallback to name
        items.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
        callback(items);
      },
      (error) => {
        console.warn('Firestore subscribeToCategories error:', error.message);
        callback(defaultCategories);
      }
    );
  } catch (error) {
    console.warn('subscribeToCategories listener init error:', error.message);
    callback(defaultCategories);
    return () => {};
  }
}

/**
 * Create a new category in Firestore.
 */
export async function createCategory(categoryData) {
  try {
    const slug = (categoryData.id || categoryData.name || 'category')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const docId = slug || `cat_${Date.now()}`;
    const docRef = doc(db, CATEGORIES_COLLECTION, docId);

    const payload = {
      name: categoryData.name?.trim() || 'New Category',
      category: categoryData.category || 'furniture',
      image: categoryData.image?.trim() || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
      badge: categoryData.badge?.trim() || '',
      order: Number(categoryData.order) || Date.now(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(docRef, payload);
    return { id: docId, ...payload };
  } catch (error) {
    console.error('Error creating category in Firestore:', error);
    throw error;
  }
}

/**
 * Update an existing category in Firestore.
 */
export async function updateCategory(id, updates) {
  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    const payload = {
      ...updates,
      updatedAt: serverTimestamp()
    };
    await updateDoc(docRef, payload);
    return { id, ...payload };
  } catch (error) {
    console.error('Error updating category in Firestore:', error);
    throw error;
  }
}

/**
 * Delete a category from Firestore.
 */
export async function deleteCategory(id) {
  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting category from Firestore:', error);
    throw error;
  }
}
