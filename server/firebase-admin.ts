import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
let firebaseAdmin: admin.app.App | null = null;

try {
  // Check if Firebase Admin is already initialized
  if (!admin.apps.length) {
    // Use service account key from environment
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      
      firebaseAdmin = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      });

      console.log('[FIREBASE ADMIN] Initialized with service account for project:', process.env.VITE_FIREBASE_PROJECT_ID);
    } else {
      // Fallback to Application Default Credentials
      firebaseAdmin = admin.initializeApp({
        projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      });

      console.log('[FIREBASE ADMIN] Initialized with default credentials for project:', process.env.VITE_FIREBASE_PROJECT_ID);
    }
  } else {
    firebaseAdmin = admin.app();
    console.log('[FIREBASE ADMIN] Using existing instance');
  }
} catch (error: any) {
  console.error('[FIREBASE ADMIN] Initialization failed:', error.message);
  firebaseAdmin = null;
}

export { firebaseAdmin, admin };