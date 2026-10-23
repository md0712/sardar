import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const ORDERS_COLLECTION = 'orders';

/**
 * Place a new order into Firestore
 */
export async function createOrder(orderData, customerUid = null) {
  const cleanOrder = {
    ...orderData,
    customerUid: customerUid || 'guest',
    subtotal: Number(orderData.subtotal) || 0,
    discount: Number(orderData.discount) || 0,
    delivery: Number(orderData.delivery) || 0,
    total: Number(orderData.total) || 0,
    status: orderData.status || 'Order Placed',
    paymentStatus: orderData.paymentStatus || 'Pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  let orderResult;
  if (orderData.id) {
    const docRef = doc(db, ORDERS_COLLECTION, String(orderData.id));
    await setDoc(docRef, cleanOrder);
    orderResult = { id: orderData.id, ...cleanOrder };
  } else {
    const colRef = collection(db, ORDERS_COLLECTION);
    const docRef = await addDoc(colRef, cleanOrder);
    cleanOrder.id = docRef.id;
    orderResult = { id: docRef.id, ...cleanOrder };
  }

  // Real-time synchronization of customer records to Firestore 'customers' collection
  try {
    const custKey = orderData.customer?.phone || 
      orderData.customer?.email || 
      (orderData.customer?.name ? orderData.customer.name.toLowerCase().replace(/\s+/g, '_') : null) ||
      customerUid;

    if (custKey) {
      const custDocRef = doc(db, 'customers', String(custKey));
      const existingSnap = await getDoc(custDocRef);
      if (existingSnap.exists()) {
        const prev = existingSnap.data();
        await updateDoc(custDocRef, {
          name: orderData.customer?.name || prev.name,
          phone: orderData.customer?.phone || prev.phone,
          email: orderData.customer?.email || prev.email,
          address: orderData.customer?.address || prev.address,
          city: orderData.customer?.city || prev.city,
          state: orderData.customer?.state || prev.state,
          pincode: orderData.customer?.pincode || prev.pincode,
          orderCount: (prev.orderCount || 1) + 1,
          totalSpent: (Number(prev.totalSpent) || 0) + (Number(cleanOrder.total) || 0),
          lastOrderDate: cleanOrder.date || new Date().toISOString(),
          lastOrderId: cleanOrder.id,
          updatedAt: serverTimestamp()
        });
      } else {
        await setDoc(custDocRef, {
          id: custKey,
          name: orderData.customer?.name || 'Showroom Customer',
          phone: orderData.customer?.phone || '—',
          email: orderData.customer?.email || '—',
          address: orderData.customer?.address || '—',
          city: orderData.customer?.city || 'Chennai',
          state: orderData.customer?.state || 'Tamil Nadu',
          pincode: orderData.customer?.pincode || '600001',
          orderCount: 1,
          totalSpent: Number(cleanOrder.total) || 0,
          lastOrderDate: cleanOrder.date || new Date().toISOString(),
          lastOrderId: cleanOrder.id,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    }
  } catch (custErr) {
    console.warn('Customer profile synchronization note:', custErr.message);
  }

  return orderResult;
}

/**
 * Fetch orders belonging to a specific customer
 */
export async function getOrdersForCustomer(customerUid) {
  if (!customerUid) return [];
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where('customerUid', '==', customerUid)
    );
    const snap = await getDocs(q);
    const list = [];
    snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
    return list;
  } catch (err) {
    console.warn('Error fetching customer orders:', err);
    return [];
  }
}

/**
 * Get all orders (Admin only)
 */
export async function getOrdersAdmin() {
  try {
    const colRef = collection(db, ORDERS_COLLECTION);
    const snap = await getDocs(colRef);
    const list = [];
    snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
    return list;
  } catch (err) {
    console.warn('Error fetching all orders for admin:', err);
    return [];
  }
}

/**
 * Real-time listener for Orders in Admin Panel
 * Returns an unsubscribe function for React useEffect cleanup
 */
export function subscribeToOrdersAdmin(onUpdate, onError) {
  try {
    const colRef = collection(db, ORDERS_COLLECTION);
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
        console.warn('Real-time orders listener notice:', error.message);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn('Could not establish real-time order listener:', err);
    return () => {};
  }
}

/**
 * Update order status (Admin only)
 */
export async function updateOrderStatus(orderId, status) {
  const docRef = doc(db, ORDERS_COLLECTION, String(orderId));
  await updateDoc(docRef, {
    status,
    updatedAt: serverTimestamp()
  });
  return { id: orderId, status };
}

/**
 * Edit order details (Admin only)
 */
export async function editOrder(orderId, updates) {
  const docRef = doc(db, ORDERS_COLLECTION, String(orderId));
  const cleanUpdates = {
    ...updates,
    updatedAt: serverTimestamp()
  };
  await updateDoc(docRef, cleanUpdates);
  return { id: orderId, ...cleanUpdates };
}

/**
 * Delete order from Firestore (Admin only)
 */
export async function deleteOrder(orderId) {
  const docRef = doc(db, ORDERS_COLLECTION, String(orderId));
  await deleteDoc(docRef);
  return orderId;
}
