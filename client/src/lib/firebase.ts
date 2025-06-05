import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate Firebase configuration
if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
  console.error('Firebase configuration incomplete:', {
    apiKey: !!firebaseConfig.apiKey,
    projectId: !!firebaseConfig.projectId,
    appId: !!firebaseConfig.appId
  });
}

console.log('Firebase config:', { 
  projectId: firebaseConfig.projectId,
  apiKey: firebaseConfig.apiKey ? 'present' : 'missing',
  appId: firebaseConfig.appId ? 'present' : 'missing'
});

console.log('Current domain:', window.location.hostname);
console.log('Current origin:', window.location.origin);

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('email');
provider.addScope('profile');

export async function loginWithGoogle() {
  try {
    // Check if Firebase is properly configured
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
      throw new Error('Firebase configuration is incomplete. Please check your environment variables.');
    }
    
    const result = await signInWithPopup(auth, provider);
    return result;
  } catch (error: any) {
    console.error('Google login error:', error);
    
    // Provide specific error messages for common issues
    if (error.code === 'auth/configuration-not-found') {
      throw new Error('Firebase project configuration not found. Please verify your Firebase project settings and ensure the web app is properly configured.');
    } else if (error.code === 'auth/unauthorized-domain') {
      throw new Error('This domain is not authorized for OAuth operations. Add this domain to your Firebase project\'s authorized domains.');
    } else if (error.code === 'auth/operation-not-allowed') {
      throw new Error('Google sign-in is not enabled in your Firebase project. Please enable it in the Authentication section.');
    }
    
    throw error;
  }
}

export function logout() {
  return signOut(auth);
}

export { onAuthStateChanged };
