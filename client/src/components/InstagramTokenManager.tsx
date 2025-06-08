import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWorkspace } from '@/hooks/useWorkspace';

interface TokenStatus {
  accountId: string;
  username: string;
  expiresAt: string | null;
  daysUntilExpiry: number;
  needsRefresh: boolean;
  isActive: boolean;
  lastSync: string | null;
}

interface TokenStatusResponse {
  success: boolean;
  accounts: TokenStatus[];
  totalAccounts: number;
  accountsNeedingRefresh: number;
}

export default function InstagramTokenManager() {
  const { currentWorkspace } = useWorkspace();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [refreshingAccount, setRefreshingAccount] = useState<string | null>(null);
  const [refreshingAll, setRefreshingAll] = useState(false);

  // Fetch token status for all Instagram accounts
  const { data: tokenStatus, isLoading } = useQuery<TokenStatusResponse>({
    queryKey: ['/api/instagram/token-status', currentWorkspace?.id],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/instagram/token-status?workspaceId=${currentWorkspace?.id}`);
      return response.json();
    },
    enabled: !!currentWorkspace?.id,
    refetchInterval: 60000, // Refresh every minute
  });

  // Refresh individual account token
  const refreshAccountMutation = useMutation({
    mutationFn: async (accountId: string) => {
      const response = await apiRequest('POST', `/api/instagram/refresh-token/${accountId}`);
      return response.json();
    },
    onSuccess: (data, accountId) => {
      toast({
        title: "Token Refreshed",
        description: `Successfully refreshed token for @${data.username}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/instagram/token-status'] });
      queryClient.invalidateQueries({ queryKey: ['/api/social-accounts'] });
      setRefreshingAccount(null);
    },
    onError: (error: any) => {
      toast({
        title: "Refresh Failed",
        description: error.message || 'Failed to refresh token',
        variant: "destructive",
      });
      setRefreshingAccount(null);
    }
  });

  // Refresh all account tokens
  const refreshAllMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/instagram/refresh-all-tokens');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "All Tokens Refreshed",
        description: "Successfully refreshed all Instagram tokens",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/instagram/token-status'] });
      queryClient.invalidateQueries({ queryKey: ['/api/social-accounts'] });
      setRefreshingAll(false);
    },
    onError: (error: any) => {
      toast({
        title: "Refresh Failed",
        description: error.message || 'Failed to refresh tokens',
        variant: "destructive",
      });
      setRefreshingAll(false);
    }
  });

  const handleRefreshAccount = (accountId: string) => {
    setRefreshingAccount(accountId);
    refreshAccountMutation.mutate(accountId);
  };

  const handleRefreshAll = () => {
    setRefreshingAll(true);
    refreshAllMutation.mutate();
  };

  const getStatusBadge = (account: TokenStatus) => {
    if (!account.isActive) {
      return <Badge variant="destructive">Inactive</Badge>;
    }
    
    if (account.needsRefresh) {
      return <Badge variant="destructive">Needs Refresh</Badge>;
    }
    
    if (account.daysUntilExpiry <= 14) {
      return <Badge variant="secondary">Expires Soon</Badge>;
    }
    
    return <Badge variant="default">Active</Badge>;
  };

  const getStatusIcon = (account: TokenStatus) => {
    if (!account.isActive) {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
    
    if (account.needsRefresh) {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
    
    if (account.daysUntilExpiry <= 14) {
      return <Clock className="h-4 w-4 text-yellow-500" />;
    }
    
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Instagram Token Management</CardTitle>
          <CardDescription>Loading token status...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!tokenStatus || tokenStatus.totalAccounts === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Instagram Token Management</CardTitle>
          <CardDescription>No Instagram accounts connected</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Connect an Instagram Business account to manage tokens
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Instagram Token Management</CardTitle>
            <CardDescription>
              {tokenStatus.totalAccounts} accounts • {tokenStatus.accountsNeedingRefresh} need refresh
            </CardDescription>
          </div>
          <Button
            onClick={handleRefreshAll}
            disabled={refreshingAll || tokenStatus.accountsNeedingRefresh === 0}
            variant="outline"
            size="sm"
          >
            {refreshingAll ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tokenStatus.accounts.map((account) => (
            <div
              key={account.accountId}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {getStatusIcon(account)}
                <div>
                  <p className="font-medium">@{account.username}</p>
                  <p className="text-sm text-muted-foreground">
                    Expires: {formatDate(account.expiresAt)} 
                    {account.daysUntilExpiry > 0 && ` (${account.daysUntilExpiry} days)`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last sync: {formatDate(account.lastSync)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {getStatusBadge(account)}
                <Button
                  onClick={() => handleRefreshAccount(account.accountId)}
                  disabled={refreshingAccount === account.accountId || !account.isActive}
                  variant="outline"
                  size="sm"
                >
                  {refreshingAccount === account.accountId ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {tokenStatus.accountsNeedingRefresh > 0 && (
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <p className="font-medium text-yellow-800 dark:text-yellow-200">
                Token Refresh Required
              </p>
            </div>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              {tokenStatus.accountsNeedingRefresh} account(s) need token refresh to maintain API access.
              Tokens are automatically refreshed daily, but you can refresh manually if needed.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}