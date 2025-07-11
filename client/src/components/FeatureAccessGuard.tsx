import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Crown, Zap, AlertCircle } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface FeatureAccessGuardProps {
  featureId: string;
  featureName: string;
  creditsRequired: number;
  children: React.ReactNode;
  fallbackContent?: React.ReactNode;
  requiredPlan?: string;
}

export function FeatureAccessGuard({
  featureId,
  featureName,
  creditsRequired,
  children,
  fallbackContent,
  requiredPlan = 'pro'
}: FeatureAccessGuardProps) {
  const { toast } = useToast();
  const [accessDenied, setAccessDenied] = useState(false);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  const validateAccess = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/subscription/validate-feature', {
        featureId,
        creditsRequired,
      });
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      if (data.hasAccess) {
        setHasAccess(true);
        setAccessDenied(false);
      } else {
        setHasAccess(false);
        setAccessDenied(true);
        toast({
          title: "Feature Locked",
          description: `${featureName} requires ${creditsRequired} credits and ${requiredPlan} plan.`,
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      setHasAccess(false);
      setAccessDenied(true);
      toast({
        title: "Access Check Failed",
        description: error.message || "Unable to verify feature access.",
        variant: "destructive",
      });
    },
  });

  // Check access on first render
  React.useEffect(() => {
    if (hasAccess === null) {
      validateAccess.mutate();
    }
  }, [hasAccess]);

  // Show loading state
  if (validateAccess.isPending || hasAccess === null) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Show access denied content
  if (accessDenied || !hasAccess) {
    return (
      <div className="space-y-4">
        <Alert>
          <Lock className="h-4 w-4" />
          <AlertDescription>
            This feature requires {creditsRequired} credits and {requiredPlan} plan access.
          </AlertDescription>
        </Alert>
        
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-blue-500" />
              {featureName} - Premium Feature
            </CardTitle>
            <CardDescription>
              Upgrade your plan to unlock advanced AI capabilities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-500" />
                <span className="text-sm">
                  Costs: <Badge variant="outline">{creditsRequired} credits</Badge>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-purple-500" />
                <span className="text-sm">
                  Required: <Badge variant="outline">{requiredPlan} plan</Badge>
                </span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => window.location.href = '/subscription'}>
                  Upgrade Plan
                </Button>
                <Button size="sm" variant="outline" onClick={() => validateAccess.mutate()}>
                  Check Access
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {fallbackContent}
      </div>
    );
  }

  // Show feature content if access is granted
  return <>{children}</>;
}

// Hook for checking feature access programmatically
export function useFeatureAccess(featureId: string, creditsRequired: number) {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/subscription/validate-feature', {
        featureId,
        creditsRequired,
      });
      const data = await response.json();
      return data;
    },
    onError: (error: any) => {
      toast({
        title: "Access Denied",
        description: error.message || "You don't have access to this feature.",
        variant: "destructive",
      });
    },
  });
}