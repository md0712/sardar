/**
 * Admin Provisioning Script for Sardar Mart Furniture and Home Appliances
 * 
 * Securely assigns the verified Firebase Auth custom user claim { admin: true }
 * to a designated user. This is executed server-side via the Firebase Admin SDK.
 * 
 * Usage:
 *   node scripts/set-admin.mjs <user-email-or-uid> [--key <path-to-serviceAccountKey.json>]
 * 
 * Examples:
 *   node scripts/set-admin.mjs admin@sardarelectricals.com
 *   node scripts/set-admin.mjs admin@sardarelectricals.com --key ./serviceAccountKey.json
 * 
 * How to obtain a Service Account Key:
 *   1. Visit Firebase Console -> Project Settings -> Service accounts
 *   2. Select "Node.js" and click "Generate new private key"
 *   3. Save the JSON file as `serviceAccountKey.json` in this project directory
 *      (Note: serviceAccountKey.json is already strictly ignored in .gitignore)
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(`
=============================================================
  Sardar Mart Furniture and Home Appliances - Admin Provisioning Script
=============================================================
Usage:
  node scripts/set-admin.mjs <user-email-or-uid> [--key <path>]

Options:
  --key <path>   Path to Firebase Service Account JSON key
  --revoke       Revoke admin privileges instead of granting

Examples:
  node scripts/set-admin.mjs admin@sardarelectricals.com
  node scripts/set-admin.mjs admin@sardarelectricals.com --key ./serviceAccountKey.json
  node scripts/set-admin.mjs admin@sardarelectricals.com --revoke
`);
  process.exit(0);
}

const targetIdentifier = args[0];
const isRevoke = args.includes('--revoke');

// Check for explicit key flag
let serviceAccountPath = null;
const keyFlagIndex = args.indexOf('--key');
if (keyFlagIndex !== -1 && args[keyFlagIndex + 1]) {
  serviceAccountPath = path.resolve(args[keyFlagIndex + 1]);
} else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  serviceAccountPath = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);
} else {
  // Check common default locations in the project root
  const candidateKeys = [
    './serviceAccountKey.json',
    './service-account.json',
    './serviceAccount.json',
    '../serviceAccountKey.json'
  ];
  for (const candidate of candidateKeys) {
    if (fs.existsSync(candidate)) {
      serviceAccountPath = path.resolve(candidate);
      break;
    }
  }
}

// Initialize Admin App
let adminApp;
if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
  console.log(`Using Service Account credentials from: ${serviceAccountPath}`);
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  adminApp = initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id || 'sardarelectricalsandfurnitures'
  });
} else {
  console.log('No serviceAccountKey.json found. Attempting Application Default Credentials (ADC)...');
  console.log('Tip: If ADC fails, download a service account JSON from Firebase Console -> Project Settings -> Service accounts and pass --key <path>');
  try {
    adminApp = initializeApp({
      projectId: 'sardarelectricalsandfurnitures'
    });
  } catch (err) {
    console.error('Failed to initialize Firebase Admin SDK without credentials:', err.message);
    process.exit(1);
  }
}

const auth = getAuth(adminApp);
const db = getFirestore(adminApp);

async function run() {
  try {
    console.log(`\nLooking up user: "${targetIdentifier}"...`);
    let user;

    if (targetIdentifier.includes('@')) {
      try {
        user = await auth.getUserByEmail(targetIdentifier.trim());
      } catch (err) {
        if (err.code === 'auth/user-not-found') {
          console.error(`\n[ERROR] User with email "${targetIdentifier}" does not exist in Firebase Authentication.`);
          console.log(`Please first register this user account in the app or via Firebase Console -> Authentication -> Users.`);
          process.exit(1);
        }
        throw err;
      }
    } else {
      user = await auth.getUser(targetIdentifier.trim());
    }

    console.log(`Found User:`);
    console.log(`  - UID:   ${user.uid}`);
    console.log(`  - Email: ${user.email}`);
    console.log(`  - Current Custom Claims:`, user.customClaims || {});

    if (isRevoke) {
      console.log(`\nRevoking administrator claims...`);
      await auth.setCustomUserClaims(user.uid, { admin: false });

      // Update Firestore user profile
      try {
        const userRef = db.collection('users').doc(user.uid);
        await userRef.set({
          role: 'customer',
          admin: false,
          updatedAt: FieldValue.serverTimestamp()
        }, { merge: true });
      } catch (err) {
        console.warn('Note: Could not update user document in Firestore:', err.message);
      }

      console.log(`\n[SUCCESS] Administrator privileges REVOKED for ${user.email} (${user.uid}).`);
    } else {
      console.log(`\nGranting verified custom claim { admin: true }...`);
      await auth.setCustomUserClaims(user.uid, {
        ...(user.customClaims || {}),
        admin: true
      });

      // Update Firestore user profile document
      try {
        const userRef = db.collection('users').doc(user.uid);
        await userRef.set({
          role: 'admin',
          admin: true,
          updatedAt: FieldValue.serverTimestamp()
        }, { merge: true });
        console.log(`Updated Firestore document 'users/${user.uid}' with role: 'admin'.`);
      } catch (err) {
        console.warn('Note: Could not update user document in Firestore:', err.message);
      }

      console.log(`\n=============================================================`);
      console.log(`  SUCCESS: Administrator Privileges Granted!`);
      console.log(`=============================================================`);
      console.log(`User ${user.email} (UID: ${user.uid}) now has:`);
      console.log(`  - Custom Claim: { admin: true }`);
      console.log(`  - Validated by Firestore Security Rules: request.auth.token.admin == true`);
      console.log(`\nNext Steps:`);
      console.log(`1. If the user is currently logged in on the web app, click "Refresh Claims"`);
      console.log(`   or log out and log back in to reload their verified ID token.`);
      console.log(`2. Access the Staff Portal via the footer link or at the admin route.`);
      console.log(`=============================================================\n`);
    }
  } catch (error) {
    console.error('\n[ERROR] Provisioning failed:', error);
    process.exit(1);
  }
}

run();
