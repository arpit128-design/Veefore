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
    // Check if Firebase auth is available
    if (!auth) {
      console.warn('Firebase auth not available');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Clear any demo mode when real user is authenticated
          localStorage.removeItem('veefore_demo_mode');
          
          // Get Firebase ID token
          const idToken = await firebaseUser.getIdToken();
          setToken(idToken);
          localStorage.setItem('veefore_auth_token', idToken);
          
          // Check if user exists in our database
          try {
            const response = await fetch('/api/user', {
              headers: {
                'Authorization': `Bearer ${idToken}`
              }
            });
            
            if (response.ok) {
              const userData = await response.json();
              setUser(userData);
            } else if (response.status === 404) {
              // User doesn't exist, create them
              const newUserResponse = await apiRequest('POST', '/api/user', {
                firebaseUid: firebaseUser.uid,
                email: firebaseUser.email!,
                username: firebaseUser.displayName || firebaseUser.email!.split('@')[0],
                displayName: firebaseUser.displayName,
                avatar: firebaseUser.photoURL
              });
              
              const newUserData = await newUserResponse.json();
              setUser(newUserData);
            }
          } catch (error) {
            console.error('Failed to sync user:', error);
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
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, firebaseUser, loading, token };
}

export const AuthProvider = AuthContext.Provider;
export default AuthContext;
