import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useDeviceWaitlistStatus } from '@/hooks/useDeviceWaitlistStatus';

interface SmartCTAButtonProps {
  className?: string;
  size?: 'sm' | 'lg' | 'default';
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  onWaitlistAction?: () => void;
  onStatusAction?: () => void;
  showArrow?: boolean;
  children?: React.ReactNode;
}

export function SmartCTAButton({ 
  className = "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700",
  size = "lg",
  variant = "default",
  onWaitlistAction,
  onStatusAction,
  showArrow = true,
  children
}: SmartCTAButtonProps) {
  const deviceStatus = useDeviceWaitlistStatus();
  const [, setLocation] = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);

  const getButtonText = () => {
    if (deviceStatus.hasEarlyAccess) {
      return 'Start Free Trial';
    } else if (deviceStatus.isOnWaitlist) {
      return 'Check Status';
    } else {
      return 'Get Early Access';
    }
  };

  const handleClick = async () => {
    if (deviceStatus.hasEarlyAccess) {
      // User has early access, redirect to signup page since they haven't registered yet
      setIsNavigating(true);
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 100));
      setLocation('/signup');
    } else if (deviceStatus.isOnWaitlist) {
      // User is on waitlist, show status card
      if (onStatusAction) {
        onStatusAction();
      }
    } else {
      // User needs to join waitlist
      if (onWaitlistAction) {
        onWaitlistAction();
      }
    }
  };

  if (deviceStatus.isLoading || isNavigating) {
    return (
      <Button 
        size={size} 
        className={className}
        disabled
      >
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {isNavigating ? 'Redirecting...' : 'Loading...'}
      </Button>
    );
  }

  // If user has early access, render as button with navigation handler
  if (deviceStatus.hasEarlyAccess) {
    return (
      <Button 
        size={size} 
        className={className} 
        variant={variant}
        onClick={handleClick}
        disabled={isNavigating}
      >
        {children || getButtonText()}
        {showArrow && <ArrowRight className="ml-2 w-4 h-4" />}
      </Button>
    );
  }

  // Otherwise render as button with click handler
  return (
    <Button 
      size={size} 
      className={className}
      variant={variant}
      onClick={handleClick}
    >
      {children || getButtonText()}
      {showArrow && <ArrowRight className="ml-2 w-4 h-4" />}
    </Button>
  );
}