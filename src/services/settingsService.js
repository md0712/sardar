import { 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const SETTINGS_COLLECTION = 'settings';
const STORE_CONFIG_DOC = 'store_config';

export const DEFAULT_STORE_CONFIG = {
  // Store Branding & Contact
  storeName: 'Sardar Mart',
  phone: '+91 6383056338',
  secondaryPhone: '+91 9344623632',
  email: 'sardarmart64@gmail.com',
  address: 'No. 192, E.H Road, Cholan nagar, Vyasarpadi, Erukancheri, Chennai - 39.',
  timing: '9:30 AM – 9:30 PM (All 7 Days Open)',
  announcement1: 'Free Express Delivery & 0% Easy EMI on All Products',
  announcement2: 'Festive Mega Offer: Special Discounts on Complete Living Room & Appliance Combos',
  footerDescription: 'Sardar Mart Furniture and Home Appliances is your trusted destination for luxury furniture, smart electronics, and top-tier home appliances. Delivering quality and comfort since 1998.',
  instagramUrl: 'https://www.instagram.com/sardar_mart_ch_39?xtok=N2c2cW8xYmdzM3Fy',
  instagramHandle: 'sardar_mart_ch_39',
  facebookUrl: 'https://facebook.com',
  youtubeUrl: 'https://youtube.com',
  whatsappNumber: '+91 6383056338',

  // Legal & Tax Settings
  storeLegalName: 'Sardar Mart Furniture and Home Appliances Pvt Ltd',
  gstNumber: '33DVKPR2334L1Z9',
  currency: 'INR (₹)',
  taxGst: '18%',
  invoicePrefix: 'SEF-2026-',
  freeShippingThreshold: '4999',
  standardDeliveryFee: '0',
  courierPartner: 'Sardar White-Glove Fleet',
  defaultOrderStatus: 'Order Placed',
  showDiscountPercentage: false, // Control display of discount % in storefront (default disabled as requested)
  whatsappAlerts: true,
  smsAlerts: true,
  emailReports: true,
  twoFactorAuth: false
};

/**
 * Fetch store settings from Firestore with local fallback
 */
export async function getStoreSettings() {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, STORE_CONFIG_DOC);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { ...DEFAULT_STORE_CONFIG, ...snap.data() };
    }
    return DEFAULT_STORE_CONFIG;
  } catch (err) {
    console.warn('Error reading store settings from Firestore:', err.message);
    return DEFAULT_STORE_CONFIG;
  }
}

/**
 * Update store settings in Firestore (Admin only)
 */
export async function saveStoreSettings(updates) {
  const docRef = doc(db, SETTINGS_COLLECTION, STORE_CONFIG_DOC);
  const data = {
    ...updates,
    updatedAt: serverTimestamp()
  };
  await setDoc(docRef, data, { merge: true });
  return data;
}

/**
 * Real-time listener for store settings
 */
export function subscribeToStoreSettings(onUpdate) {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, STORE_CONFIG_DOC);
    return onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          onUpdate({ ...DEFAULT_STORE_CONFIG, ...snap.data() });
        } else {
          onUpdate(DEFAULT_STORE_CONFIG);
        }
      },
      (error) => {
        console.warn('Real-time store settings notice:', error.message);
      }
    );
  } catch (err) {
    console.warn('Could not subscribe to store settings:', err.message);
    return () => {};
  }
}
