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

  // Clean features array: support both { name, value } and legacy string features
  const cleanFeatures = Array.isArray(productData.features)
    ? productData.features
        .filter(f => f && (typeof f === 'string' || (f.name && f.name.trim())))
        .map(f => typeof f === 'string' ? { name: 'Feature', value: f.trim(), type: 'feature' } : { name: f.name.trim(), value: (f.value || '').trim(), ...(f.type ? { type: f.type } : {}) })
    : [];

  // Clean additionalInformation array
  const cleanAdditionalInfo = Array.isArray(productData.additionalInformation)
    ? productData.additionalInformation
        .filter(f => f && f.name && f.name.trim())
        .map(f => ({ name: f.name.trim(), value: (f.value || '').trim() }))
    : [];

  const rawData = {
    ...productData,
    name: productData.name || productData.title || '',
    title: productData.title || productData.name || '',
    modelNumber: (productData.modelNumber || '').trim(),
    price: Number(productData.price ?? productData.sellingPrice) || 0,
    sellingPrice: Number(productData.sellingPrice ?? productData.price) || 0,
    originalPrice: Number(productData.originalPrice ?? productData.originalMRP) || Number(productData.price ?? productData.sellingPrice) || 0,
    originalMRP: Number(productData.originalMRP ?? productData.originalPrice) || Number(productData.price ?? productData.sellingPrice) || 0,
    discount: Number(productData.discount) || 0,
    stock: productData.stock !== undefined && productData.stock !== '' ? Math.max(0, parseInt(productData.stock, 10)) : 10,
    features: cleanFeatures,
    additionalInformation: cleanAdditionalInfo,
    active: productData.active !== undefined ? productData.active : true,
    image: productData.image || productData.imageUrl || '',
    imageUrl: productData.imageUrl || productData.image || '',
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

  if (updates.name !== undefined) {
    rawUpdates.name = updates.name;
    rawUpdates.title = updates.name;
  }
  if (updates.title !== undefined) {
    rawUpdates.title = updates.title;
    rawUpdates.name = updates.title;
  }
  if (updates.modelNumber !== undefined) {
    rawUpdates.modelNumber = (updates.modelNumber || '').trim();
  }
  if (updates.price !== undefined) {
    rawUpdates.price = Number(updates.price);
    rawUpdates.sellingPrice = Number(updates.price);
  }
  if (updates.sellingPrice !== undefined) {
    rawUpdates.sellingPrice = Number(updates.sellingPrice);
    rawUpdates.price = Number(updates.sellingPrice);
  }
  if (updates.originalPrice !== undefined) {
    rawUpdates.originalPrice = Number(updates.originalPrice);
    rawUpdates.originalMRP = Number(updates.originalPrice);
  }
  if (updates.originalMRP !== undefined) {
    rawUpdates.originalMRP = Number(updates.originalMRP);
    rawUpdates.originalPrice = Number(updates.originalMRP);
  }
  if (updates.image !== undefined) {
    rawUpdates.image = updates.image;
    rawUpdates.imageUrl = updates.image;
  }
  if (updates.imageUrl !== undefined) {
    rawUpdates.imageUrl = updates.imageUrl;
    rawUpdates.image = updates.imageUrl;
  }
  if (updates.stock !== undefined && updates.stock !== '') {
    rawUpdates.stock = Math.max(0, parseInt(updates.stock, 10));
  }
  if (updates.features !== undefined && Array.isArray(updates.features)) {
    rawUpdates.features = updates.features
      .filter(f => f && (typeof f === 'string' || (f.name && f.name.trim())))
      .map(f => typeof f === 'string' ? { name: 'Feature', value: f.trim(), type: 'feature' } : { name: f.name.trim(), value: (f.value || '').trim(), ...(f.type ? { type: f.type } : {}) });
  }
  if (updates.additionalInformation !== undefined && Array.isArray(updates.additionalInformation)) {
    rawUpdates.additionalInformation = updates.additionalInformation
      .filter(f => f && f.name && f.name.trim())
      .map(f => ({ name: f.name.trim(), value: (f.value || '').trim() }));
  }

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
