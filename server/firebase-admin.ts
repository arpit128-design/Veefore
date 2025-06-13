import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
let firebaseAdmin: admin.app.App | null = null;

try {
  // Check if Firebase Admin is already initialized
  if (!admin.apps.length) {
    // For development environment, use Application Default Credentials
    // This works in most cloud environments and locally with gcloud auth
    firebaseAdmin = admin.initializeApp({
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    });

    console.log('[FIREBASE ADMIN] Initialized successfully with project:', process.env.VITE_FIREBASE_PROJECT_ID);
  } else {
    firebaseAdmin = admin.app();
    console.log('[FIREBASE ADMIN] Using existing instance');
  }
} catch (error: any) {
  console.error('[FIREBASE ADMIN] Initialization failed:', error.message);
  firebaseAdmin = null;
}

export { firebaseAdmin, admin };