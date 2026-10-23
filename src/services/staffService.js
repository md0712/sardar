import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { db, firebaseConfig } from '../lib/firebase';

const USERS_COLLECTION = 'users';

/**
 * Fetch all staff, shop admins, and employees from Firestore
 */
export async function getStaffUsers() {
  try {
    const colRef = collection(db, USERS_COLLECTION);
    const snap = await getDocs(colRef);
    const staff = [];

    snap.forEach((docSnap) => {
      const data = docSnap.data();
      // Filter for staff/admin roles (or return all for super admin management)
      if (['super_admin', 'shop_admin', 'admin', 'employee', 'dispatch', 'support'].includes(data.role)) {
        staff.push({ id: docSnap.id, ...data });
      }
    });

    return staff;
  } catch (error) {
    console.warn('Error fetching staff users:', error.message);
    return [];
  }
}

/**
 * Super Admin action: Register a new employee or shop admin
 * Uses an isolated secondary Firebase app instance to create the Firebase Auth account
 * without disrupting or logging out the Super Admin's active session.
 */
export async function createStaffAccount({ name, email, password, role = 'shop_admin', phone = '', createdBy = '' }) {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();
  const cleanRole = role.trim();

  // 1. Initialize temporary secondary Firebase instance
  const tempAppName = 'StaffCreator_' + Date.now();
  const tempApp = initializeApp(firebaseConfig, tempAppName);
  const tempAuth = getAuth(tempApp);

  try {
    // 2. Create the user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(tempAuth, cleanEmail, password);
    const newUid = userCredential.user.uid;

    if (cleanName) {
      await updateProfile(userCredential.user, { displayName: cleanName });
    }

    // 3. Write user profile with designated role into Firestore
    const newStaffDoc = {
      uid: newUid,
      name: cleanName,
      email: cleanEmail,
      phone: phone.trim(),
      role: cleanRole, // 'super_admin' | 'shop_admin' | 'employee' | 'dispatch' | 'support'
      admin: ['super_admin', 'shop_admin', 'admin'].includes(cleanRole),
      superAdmin: cleanRole === 'super_admin',
      status: 'Active',
      createdBy: createdBy || 'super_admin',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(doc(db, USERS_COLLECTION, newUid), newStaffDoc);

    return {
      id: newUid,
      ...newStaffDoc
    };
  } finally {
    // 4. Always cleanly dispose of the secondary app
    try {
      await deleteApp(tempApp);
    } catch {}
  }
}

/**
 * Update staff role (Super Admin only)
 */
export async function updateStaffRole(uid, newRole) {
  const userRef = doc(db, USERS_COLLECTION, uid);
  await updateDoc(userRef, {
    role: newRole,
    admin: ['super_admin', 'shop_admin', 'admin'].includes(newRole),
    superAdmin: newRole === 'super_admin',
    updatedAt: serverTimestamp()
  });
  return { uid, role: newRole };
}

/**
 * Update staff active/suspended status
 */
export async function updateStaffStatus(uid, newStatus) {
  const userRef = doc(db, USERS_COLLECTION, uid);
  await updateDoc(userRef, {
    status: newStatus,
    updatedAt: serverTimestamp()
  });
  return { uid, status: newStatus };
}

/**
 * Delete or remove a staff user from Firestore records
 */
export async function deleteStaffUser(uid) {
  const userRef = doc(db, USERS_COLLECTION, uid);
  await deleteDoc(userRef);
  return uid;
}
