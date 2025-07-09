import { useState, useEffect } from 'react';

interface DeviceWaitlistStatus {
  isLoading: boolean;
  isOnWaitlist: boolean;
  hasEarlyAccess: boolean;
  userEmail?: string;
  referralCode?: string;
  error?: string;
}

export function useDeviceWaitlistStatus() {
  const [status, setStatus] = useState<DeviceWaitlistStatus>({
    isLoading: true,
    isOnWaitlist: false,
    hasEarlyAccess: false,
  });

  useEffect(() => {
    const checkDeviceStatus = async () => {
      try {
        const response = await fetch('/api/early-access/check-device', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStatus({
            isLoading: false,
            isOnWaitlist: true,
            hasEarlyAccess: data.user?.status === 'early_access',
            userEmail: data.user?.email,
            referralCode: data.user?.referralCode,
          });
        } else {
          // Device not found on waitlist - this is normal, not an error
          setStatus({
            isLoading: false,
            isOnWaitlist: false,
            hasEarlyAccess: false,
          });
        }
      } catch (error) {
        // Silently handle errors and set default state
        // Don't log errors to avoid console spam
        setStatus({
          isLoading: false,
          isOnWaitlist: false,
          hasEarlyAccess: false,
        });
      }
    };

    // Set initial loading to false immediately to prevent white screens
    setStatus(prev => ({ ...prev, isLoading: false }));
    
    // Then check device status asynchronously
    checkDeviceStatus();
  }, []);

  return status;
}