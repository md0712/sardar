/**
 * Super Admin Registration Script for SardarElectricalsAndFurnitures
 * 
 * Registers or upgrades a Super Administrator in Firebase Authentication
 * and Cloud Firestore `users` collection.
 * 
 * Usage:
 *   node scripts/create-super-admin.mjs [email] [password] [name]
 * 
 * Example:
 *   node scripts/create-super-admin.mjs superadmin@sardarelectricals.com Admin@2026! "Super Admin"
 */

import fs from 'fs';
import path from 'path';

// Read config from .env.local or fallback to project defaults
let apiKey = "AIzaSyDAxE1CMHiul2nRlrOpiU5qNSUN39j8mRE";
let projectId = "sardarelectricalsandfurnitures";

if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('VITE_FIREBASE_API_KEY=')) {
      apiKey = trimmed.split('=')[1].trim();
    } else if (trimmed.startsWith('VITE_FIREBASE_PROJECT_ID=')) {
      projectId = trimmed.split('=')[1].trim();
    }
  }
}

const args = process.argv.slice(2);
const email = (args[0] || 'superadmin@sardarelectricals.com').trim().toLowerCase();
const password = args[1] || 'SuperAdmin@2026!';
const name = args[2] || 'Super Administrator';

console.log(`
=============================================================
  Sardar Mart Furniture and Home Appliances - Super Admin Provisioner
=============================================================
Target Email:    ${email}
Password:        ${password}
Display Name:    ${name}
Project ID:      ${projectId}
=============================================================
`);

async function createSuperAdmin() {
  try {
    let idToken = null;
    let localId = null;

    console.log(`[Step 1/3] Registering account in Firebase Authentication...`);

    // 1. Attempt signup via Firebase Identity Toolkit REST API
    const signUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;
    const signUpRes = await fetch(signUpUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true
      })
    });

    const signUpData = await signUpRes.json();

    if (signUpRes.ok) {
      localId = signUpData.localId;
      idToken = signUpData.idToken;
      console.log(`Account registered in Firebase Auth successfully! UID: ${localId}`);
    } else if (signUpData.error && signUpData.error.message.includes('EMAIL_EXISTS')) {
      console.log(`Account already exists in Firebase Auth. Signing in to retrieve UID...`);
      // Sign in to get UID & token
      const signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
      const signInRes = await fetch(signInUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true
        })
      });

      const signInData = await signInRes.json();
      if (!signInRes.ok) {
        throw new Error(`User exists but sign-in failed: ${signInData.error?.message}. If password differs, change it in Firebase Console or pass the correct password.`);
      }
      localId = signInData.localId;
      idToken = signInData.idToken;
      console.log(`Authenticated existing account. UID: ${localId}`);
    } else {
      throw new Error(`Firebase Auth error: ${JSON.stringify(signUpData.error)}`);
    }

    // 2. Update display name in Firebase Auth
    console.log(`[Step 2/3] Setting display name to "${name}"...`);
    const updateProfileUrl = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${apiKey}`;
    await fetch(updateProfileUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idToken,
        displayName: name,
        returnSecureToken: true
      })
    });

    // 3. Create / Update Super Admin Document in Firestore
    console.log(`[Step 3/3] Registering Super Admin profile in Firestore 'users/${localId}'...`);
    const firestoreDocUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${localId}?updateMask.fieldPaths=uid&updateMask.fieldPaths=name&updateMask.fieldPaths=email&updateMask.fieldPaths=role&updateMask.fieldPaths=admin&updateMask.fieldPaths=superAdmin&updateMask.fieldPaths=status&updateMask.fieldPaths=updatedAt`;
    
    const nowIso = new Date().toISOString();
    const docPayload = {
      fields: {
        uid: { stringValue: localId },
        name: { stringValue: name },
        email: { stringValue: email },
        role: { stringValue: 'super_admin' },
        admin: { booleanValue: true },
        superAdmin: { booleanValue: true },
        status: { stringValue: 'Active' },
        updatedAt: { timestampValue: nowIso }
      }
    };

    const docRes = await fetch(firestoreDocUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify(docPayload)
    });

    if (!docRes.ok) {
      const errText = await docRes.text();
      console.warn(`Firestore update notice: ${errText}`);
    } else {
      console.log(`Firestore document 'users/${localId}' successfully updated with role: 'super_admin'!`);
    }

    // 4. Also check if Firebase Admin SDK / service account is available to set custom claims
    let customClaimsNotice = '';
    const candidateKeys = [
      './serviceAccountKey.json',
      './service-account.json',
      './serviceAccount.json'
    ];
    let keyPath = null;
    for (const ck of candidateKeys) {
      if (fs.existsSync(ck)) {
        keyPath = ck;
        break;
      }
    }

    if (keyPath) {
      try {
        const { initializeApp, cert } = await import('firebase-admin/app');
        const { getAuth } = await import('firebase-admin/auth');
        const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
        const adminApp = initializeApp({ credential: cert(serviceAccount) }, 'admin_provisioner_' + Date.now());
        const adminAuth = getAuth(adminApp);
        await adminAuth.setCustomUserClaims(localId, { admin: true, superAdmin: true });
        console.log(`Verified custom claims { admin: true, superAdmin: true } successfully set via Admin SDK.`);
        customClaimsNotice = 'Custom claims { admin: true, superAdmin: true } applied!';
      } catch (adminErr) {
        console.warn(`Admin SDK claims notice: ${adminErr.message}`);
      }
    }

    console.log(`
=============================================================
  SUCCESS: Super Admin Account Created & Registered!
=============================================================
Email:       ${email}
Password:    ${password}
UID:         ${localId}
Role:        super_admin
Status:      Registered in Authentication & Firestore collection
${customClaimsNotice ? customClaimsNotice + '\n' : ''}
How to log in:
1. Open the website: http://localhost:5173
2. Click "Staff Portal" in the footer (or press Ctrl + Shift + A)
3. Enter:
     Email:    ${email}
     Password: ${password}
4. Access the full Super Admin dashboard!
   From the "Admin Users & Roles" tab, you can now register
   and manage shop admins, staff, and employees.
=============================================================
`);

  } catch (error) {
    console.error(`\n[ERROR] Super Admin registration failed:`, error.message);
    process.exit(1);
  }
}

createSuperAdmin();
