import { useState, useEffect, createContext, useContext } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { apiRequest } from '@/lib/queryClient';
import { User } from '@shared/schema';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
  token: null
});

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Clear any invalid tokens on startup
    const existingToken = localStorage.getItem('veefore_auth_token');
    if (existingToken && existingToken.split('.').length !== 3) {
      console.log('[AUTH] Clearing invalid token on startup');
      localStorage.removeItem('veefore_auth_token');
    }

    // Check if Firebase auth is available
    if (!auth) {
      console.warn('Firebase auth not available');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (!firebaseUser) {
        // User is not authenticated - set loading to false immediately
        console.log('[AUTH] No user authenticated, setting loading to false');
        setUser(null);
        setToken(null);
        setLoading(false);
        return;
      }
      
      if (firebaseUser) {
        try {
          // Clear any demo mode when real user is authenticated
          localStorage.removeItem('veefore_demo_mode');
          
          // Get Firebase ID token (force refresh to ensure valid JWT)
          const idToken = await firebaseUser.getIdToken(true);
          
          // Validate token format before storing
          if (idToken && idToken.split('.').length === 3) {
            setToken(idToken);
            localStorage.setItem('veefore_auth_token', idToken);
            console.log('[AUTH] Valid JWT token stored');
          } else {
            console.error('[AUTH] Invalid token format received:', idToken?.substring(0, 50));
            // Clear any invalid tokens
            localStorage.removeItem('veefore_auth_token');
            setToken(null);
          }
          
          // Check if user exists in our database BEFORE setting loading to false
          try {
            console.log('[AUTH] Checking user in database with token:', idToken.substring(0, 20) + '...');
            const response = await fetch('/api/user', {
              headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
              }
            });
            
            console.log('[AUTH] User check response status:', response.status);
            
            if (response.ok) {
              const userData = await response.json();
              console.log('[AUTH] User found in database:', userData.username);
              console.log('[AUTH] User onboarding status:', userData.isOnboarded);
              console.log('[AUTH] Complete user data received from backend:', {
                id: userData.id,
                email: userData.email,
                username: userData.username,
                isOnboarded: userData.isOnboarded,
                isOnboardedType: typeof userData.isOnboarded,
                isEmailVerified: userData.isEmailVerified,
                firebaseUid: userData.firebaseUid
              });
              setUser(userData);
              // Set loading to false only after user data is loaded
              setLoading(false);
            } else if (response.status === 404) {
              // User doesn't exist, create them
              console.log('[AUTH] User not found, creating new user');
              try {
                const createUserResponse = await fetch('/api/user', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    firebaseUid: firebaseUser.uid,
                    email: firebaseUser.email!,
                    username: firebaseUser.displayName || firebaseUser.email!.split('@')[0],
                    displayName: firebaseUser.displayName,
                    avatar: firebaseUser.photoURL
                  })
                });
                
                if (createUserResponse.ok) {
                  const newUserData = await createUserResponse.json();
                  console.log('[AUTH] New user created:', newUserData.username);
                  setUser(newUserData);
                  // Set loading to false only after new user is created
                  setLoading(false);
                } else {
                  const errorData = await createUserResponse.json();
                  console.error('[AUTH] Failed to create user:', errorData);
                  // Set loading to false even if user creation fails
                  setLoading(false);
                }
              } catch (createError) {
                console.error('[AUTH] Error creating user:', createError);
                // Set loading to false even if there's an error
                setLoading(false);
              }
            } else {
              const errorData = await response.text();
              console.error('[AUTH] User sync failed with status:', response.status, errorData);
              // Set loading to false even if user sync fails
              setLoading(false);
            }
          } catch (error) {
            console.error('[AUTH] Failed to sync user:', error);
            // Set loading to false even if there's an error
            setLoading(false);
          }
        } catch (error) {
          console.error('Failed to get Firebase token:', error);
        }
      } else {
        // Only fall back to demo mode if explicitly requested
        const demoMode = localStorage.getItem('veefore_demo_mode');
        if (demoMode === 'true') {
          const demoUser: User = {
            id: 1,
            firebaseUid: 'demo-user',
            email: 'demo@veefore.com',
            username: 'DemoCommander',
            displayName: 'Demo Commander',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
            credits: 2500,
            plan: 'Pro',
            stripeCustomerId: null,
            stripeSubscriptionId: null,
            referralCode: 'DEMO123',
            totalReferrals: 47,
            totalEarned: 1250,
            referredBy: null,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          setUser(demoUser);
          setToken('demo-token');
        } else {
          setUser(null);
          setToken(null);
        }
      }
      
      // Loading is already set to false above for authenticated users
      // and at the beginning for non-authenticated users
    });

    return unsubscribe;
  }, []);

  return { user, firebaseUser, loading, token };
}

export const AuthProvider = AuthContext.Provider;
export default AuthContext;
