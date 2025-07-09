import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export interface WaitlistStatus {
  isOnWaitlist: boolean;
  hasEarlyAccess: boolean;
  userEmail: string | null;
  referralCode: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useWaitlistStatus() {
  const [status, setStatus] = useState<WaitlistStatus>({
    isOnWaitlist: false,
    hasEarlyAccess: false,
    userEmail: null,
    referralCode: null,
    isLoading: true,
    error: null
  });

  const { user } = useAuth();

  useEffect(() => {
    async function checkWaitlistStatus() {
      if (!user?.email) {
        setStatus(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        // Check if user is on waitlist
        const response = await fetch(`/api/early-access/check-status?email=${encodeURIComponent(user.email)}`);
        const data = await response.json();

        if (response.ok && data.user) {
          setStatus({
            isOnWaitlist: true,
            hasEarlyAccess: data.user.status === 'early_access',
            userEmail: user.email,
            referralCode: data.user.referralCode || null,
            isLoading: false,
            error: null
          });
        } else {
          setStatus({
            isOnWaitlist: false,
            hasEarlyAccess: false,
            userEmail: user.email,
            referralCode: null,
            isLoading: false,
            error: null
          });
        }
      } catch (error) {
        console.error('Error checking waitlist status:', error);
        setStatus(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to check waitlist status'
        }));
      }
    }

    checkWaitlistStatus();
  }, [user?.email]);

  return status;
}

// Helper function to check if user is on waitlist by IP/device
export async function checkWaitlistByDevice(): Promise<{
  isOnWaitlist: boolean;
  userEmail?: string;
  referralCode?: string;
}> {
  try {
    const response = await fetch('/api/early-access/check-device');
    const data = await response.json();
    
    if (response.ok && data.user) {
      return {
        isOnWaitlist: true,
        userEmail: data.user.email,
        referralCode: data.user.referralCode
      };
    }
    
    return { isOnWaitlist: false };
  } catch (error) {
    console.error('Error checking device waitlist status:', error);
    return { isOnWaitlist: false };
  }
}