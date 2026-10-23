import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/**
 * Firebase Web Client Configuration
 * Priority: Vite environment variables (VITE_FIREBASE_*) -> Fallback to project defaults
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDAxE1CMHiul2nRlrOpiU5qNSUN39j8mRE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sardarelectricalsandfurnitures.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sardarelectricalsandfurnitures",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sardarelectricalsandfurnitures.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "680641873797",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:680641873797:web:ecdf814d32a2a151da26ec"
};

// Initialize Firebase only once across HMR and component lifecycles
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firebase modular service instances
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Prevent storage network operations from hanging indefinitely
if (storage) {
  try {
    storage.maxUploadRetryTime = 2500;
    storage.maxOperationRetryTime = 2500;
  } catch (e) {
    // Ignore environment restrictions if any
  }
}

export { app, auth, db, storage, firebaseConfig };
export default app;
