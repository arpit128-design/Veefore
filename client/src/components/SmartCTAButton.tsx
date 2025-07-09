import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
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

  const getButtonText = () => {
    if (deviceStatus.hasEarlyAccess) {
      return 'Start Free Trial';
    } else if (deviceStatus.isOnWaitlist) {
      return 'Check Status';
    } else {
      return 'Get Early Access';
    }
  };

  const handleClick = () => {
    if (deviceStatus.hasEarlyAccess) {
      // User has early access, redirect to auth page
      window.location.href = '/auth';
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

  if (deviceStatus.isLoading) {
    return (
      <Button 
        size={size} 
        className={className}
        disabled
      >
        Loading...
      </Button>
    );
  }

  // If user has early access, render as Link to /auth
  if (deviceStatus.hasEarlyAccess) {
    return (
      <Link href="/auth">
        <Button size={size} className={className} variant={variant}>
          {children || getButtonText()}
          {showArrow && <ArrowRight className="ml-2 w-4 h-4" />}
        </Button>
      </Link>
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