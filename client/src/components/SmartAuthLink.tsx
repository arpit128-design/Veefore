import { Link } from 'wouter';
import { useDeviceWaitlistStatus } from '@/hooks/useDeviceWaitlistStatus';
import { Button } from '@/components/ui/button';
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

  return (
    <Link href={getAuthRoute()}>
      <Button 
        className={className} 
        variant={variant}
        size={size}
      >
        {children}
      </Button>
    </Link>
  );
}