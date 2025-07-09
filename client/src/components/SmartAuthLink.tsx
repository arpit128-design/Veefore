import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useDeviceWaitlistStatus } from '@/hooks/useDeviceWaitlistStatus';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ReactNode } from 'react';

interface SmartAuthLinkProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg';
}

export function SmartAuthLink({ 
  children, 
  className = "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700",
  variant = "default",
  size = "default"
}: SmartAuthLinkProps) {
  const deviceStatus = useDeviceWaitlistStatus();
  const [, setLocation] = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);

  // Determine the appropriate route based on early access status
  const getAuthRoute = () => {
    if (deviceStatus.hasEarlyAccess) {
      // Early access users should go to signup since they haven't registered yet
      return '/signup';
    } else {
      // Regular users or non-early access users should go to signin
      return '/signin';
    }
  };

  const handleClick = async () => {
    setIsNavigating(true);
    // Add a small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 100));
    setLocation(getAuthRoute());
  };

  if (deviceStatus.isLoading || isNavigating) {
    return (
      <Button 
        className={className} 
        variant={variant}
        size={size}
        disabled
      >
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {isNavigating ? 'Redirecting...' : 'Loading...'}
      </Button>
    );
  }

  return (
    <Button 
      className={className} 
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isNavigating}
    >
      {children}
    </Button>
  );
}