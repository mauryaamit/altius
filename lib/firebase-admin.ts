import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

let adminDbInstance: ReturnType<typeof getFirestore> | null = null;
let adminStorageInstance: ReturnType<typeof getStorage> | null = null;

function ensureFirebaseAdminApp() {
  if (!getApps().length) {
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'altius-436b0.firebasestorage.app';

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error('[FirebaseAdmin] FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables must be configured.');
    }

    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
      storageBucket,
    });
  }
}

export function getAdminDb() {
  if (adminDbInstance) return adminDbInstance;
  ensureFirebaseAdminApp();
  adminDbInstance = getFirestore();
  return adminDbInstance;
}

export function getAdminStorageBucket() {
  return null;
}

