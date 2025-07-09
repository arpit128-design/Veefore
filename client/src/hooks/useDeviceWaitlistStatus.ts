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
        setStatus(prev => ({ ...prev, isLoading: true }));
        
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
          // Device not found on waitlist
          setStatus({
            isLoading: false,
            isOnWaitlist: false,
            hasEarlyAccess: false,
          });
        }
      } catch (error) {
        console.error('Error checking device waitlist status:', error);
        setStatus({
          isLoading: false,
          isOnWaitlist: false,
          hasEarlyAccess: false,
          error: 'Failed to check device status',
        });
      }
    };

    checkDeviceStatus();
  }, []);

  return status;
}