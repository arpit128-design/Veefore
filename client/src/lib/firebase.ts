import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";

// Firebase configuration with better error handling
let firebaseConfig: any = null;

try {
  firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
    messagingSenderId: "123456789",
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };
} catch (error) {
  console.error('Failed to create Firebase configuration:', error);
}

// Validate Firebase configuration
if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
  console.error('Firebase configuration incomplete:', {
    apiKey: !!firebaseConfig.apiKey,
    projectId: !!firebaseConfig.projectId,
    appId: !!firebaseConfig.appId
  });
}

// Initialize Firebase only if configuration is valid
let app: any = null;
let auth: any = null;
let provider: any = null;

if (firebaseConfig && firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    
    provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Firebase initialization failed:', error);
  }
} else {
  console.warn('Firebase configuration incomplete - authentication will use demo mode');
}

export { auth };

export async function loginWithGoogle() {
  try {
    // Check if Firebase and provider are properly initialized
    if (!auth || !provider) {
      throw new Error('Firebase authentication is not properly configured. Please check your Firebase project setup.');
    }
    
    // Additional check for valid configuration
    if (!firebaseConfig?.apiKey || !firebaseConfig?.projectId) {
      throw new Error('Firebase configuration is incomplete. Please verify your environment variables.');
    }
    
    const result = await signInWithPopup(auth, provider);
    return result;
  } catch (error: any) {
    console.error('Google login error:', error);
    
    // Handle specific Firebase authentication errors
    if (error.code === 'auth/configuration-not-found') {
      throw new Error('Firebase project not configured properly. Please ensure Google Sign-In is enabled and your web app is correctly set up in Firebase Console.');
    } else if (error.code === 'auth/unauthorized-domain') {
      throw new Error(`Domain ${window.location.hostname} is not authorized. Please add it to Firebase Console > Authentication > Settings > Authorized domains.`);
    } else if (error.code === 'auth/operation-not-allowed') {
      throw new Error('Google Sign-In is disabled. Please enable it in Firebase Console > Authentication > Sign-in method.');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup was blocked by the browser. Please allow popups for this site and try again.');
    } else if (error.code === 'auth/cancelled-popup-request') {
      throw new Error('Sign-in was cancelled. Please try again.');
    }
    
    throw error;
  }
}

export async function logout() {
  try {
    // Clear demo mode from localStorage
    localStorage.removeItem('veefore_demo_mode');
    
    // If Firebase auth is available, sign out
    if (auth) {
      await signOut(auth);
    }
    
    // Force reload to reset application state
    window.location.reload();
  } catch (error) {
    console.error('Logout error:', error);
    // Even if Firebase logout fails, clear local state
    localStorage.removeItem('veefore_demo_mode');
    window.location.reload();
  }
}

export { onAuthStateChanged };
