import { useState, useEffect } from 'react';

interface EarlyAccessConfig {
  isEarlyAccessMode: boolean;
  message: string;
  totalWaitlist: number;
  earlyAccessCount: number;
}

export function useEarlyAccess() {
  const [config, setConfig] = useState<EarlyAccessConfig>({
    isEarlyAccessMode: true, // Default to early access mode
    message: 'VeeFore is currently in early access. Join our waitlist to be notified when access becomes available!',
    totalWaitlist: 0,
    earlyAccessCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEarlyAccessConfig();
  }, []);

  const fetchEarlyAccessConfig = async () => {
    try {
      const response = await fetch('/api/early-access/config');
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (error) {
      console.error('Failed to fetch early access config:', error);
      // Keep default config on error
    } finally {
      setIsLoading(false);
    }
  };

  return { config, isLoading, refresh: fetchEarlyAccessConfig };
}