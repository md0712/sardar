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
import { products as initialProducts } from '../data/products';

const PRODUCTS_COLLECTION = 'products';

/**
 * Fetch all products directly from Firestore database.
 * If collection is empty, returns an empty array [] so the UI can display "No products found".
 */
export async function getProducts() {
  try {
    const colRef = collection(db, PRODUCTS_COLLECTION);
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

    return items;
  } catch (error) {
    console.warn('Firestore getProducts error:', error.message);
    return [];
  }
}

/**
 * Real-time subscription to products collection in Firestore.
 * Updates the storefront and admin panel immediately whenever a product
 * is created, edited, deleted, or its image is updated.
 */
export function subscribeToProducts(callback) {
  try {
    const colRef = collection(db, PRODUCTS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
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
        callback(items);
      },
      (error) => {
        console.warn('Firestore subscribeToProducts error:', error.message);
        callback([]);
      }
    );
  } catch (err) {
    console.warn('Could not establish real-time product listener:', err);
    callback([]);
    return () => {};
  }
}

/**
 * Fetch a single product by ID from Firestore
 */
export async function getProductById(productId) {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, String(productId));
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
    return null;
  } catch (error) {
    console.warn(`Firestore getProductById error for ${productId}:`, error.message);
    return null;
  }
}

/**
 * Create a new product in Firestore (Admin only)
 */
export async function createProduct(productData) {
  const colRef = collection(db, PRODUCTS_COLLECTION);
  const rawData = {
    ...productData,
    price: Number(productData.price) || 0,
    originalPrice: Number(productData.originalPrice) || Number(productData.price) || 0,
    discount: Number(productData.discount) || 0,
    stock: Number(productData.stock) || 10,
    active: productData.active !== undefined ? productData.active : true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  // Strip any undefined keys to avoid Firestore rejection
  const cleanData = Object.entries(rawData).reduce((acc, [k, v]) => {
    if (v !== undefined) acc[k] = v;
    return acc;
  }, {});

  if (productData.id && typeof productData.id === 'string' && !productData.id.startsWith('new_')) {
    const docRef = doc(db, PRODUCTS_COLLECTION, productData.id);
    await setDoc(docRef, cleanData, { merge: true });
    return { id: productData.id, ...cleanData };
  } else {
    const docRef = await addDoc(colRef, cleanData);
    return { id: docRef.id, ...cleanData };
  }
}

/**
 * Update existing product (Admin only)
 */
export async function updateProduct(productId, updates) {
  const docRef = doc(db, PRODUCTS_COLLECTION, String(productId));
  const rawUpdates = {
    ...updates,
    updatedAt: serverTimestamp()
  };
  if (updates.price !== undefined) rawUpdates.price = Number(updates.price);
  if (updates.originalPrice !== undefined) rawUpdates.originalPrice = Number(updates.originalPrice);
  if (updates.stock !== undefined) rawUpdates.stock = Number(updates.stock);

  // Strip any undefined keys
  const cleanUpdates = Object.entries(rawUpdates).reduce((acc, [k, v]) => {
    if (v !== undefined) acc[k] = v;
    return acc;
  }, {});

  await setDoc(docRef, cleanUpdates, { merge: true });
  return { id: productId, ...cleanUpdates };
}

/**
 * Delete product (Admin only)
 */
export async function deleteProduct(productId) {
  const docRef = doc(db, PRODUCTS_COLLECTION, String(productId));
  await deleteDoc(docRef);
  return productId;
}

/**
 * Seed initial catalog to Firestore (Admin utility)
 * Copies bundled products into Firestore using a batch write.
 */
export async function seedProductsToFirestore(productsList = initialProducts) {
  const batch = writeBatch(db);
  const now = new Date();

  productsList.forEach((prod) => {
    const docRef = doc(db, PRODUCTS_COLLECTION, String(prod.id));
    batch.set(docRef, {
      ...prod,
      price: Number(prod.price) || 0,
      originalPrice: Number(prod.originalPrice) || Number(prod.price) || 0,
      active: true,
      stock: prod.stock || 15,
      createdAt: now,
      updatedAt: now
    });
  });

  await batch.commit();
  return productsList.length;
}
