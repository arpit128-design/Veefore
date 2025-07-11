import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useWorkspaceContext } from "@/hooks/useWorkspace";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Facebook,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Settings,
  Unlink,
  RefreshCw,
  Trash2,
  Clock,
  AlertTriangle,
  Radio,
  Activity
} from "lucide-react";
import InstagramTokenManager from "@/components/InstagramTokenManager";

interface SocialAccount {
  id: number;
  platform: string;
  username: string;
  accountId: string;
  accessToken: string;
  isActive: boolean;
  expiresAt?: Date;
  lastSync?: Date;
  // Instagram-specific fields
  followersCount?: number;
  followingCount?: number;
  mediaCount?: number;
  // YouTube-specific fields
  subscriberCount?: number;
  videoCount?: number;
  viewCount?: number;
}

const platformConfig = {
  instagram: {
    name: "Instagram Business",
    icon: Instagram,
    color: "text-pink-500",
    bgColor: "bg-gradient-to-r from-purple-500 to-pink-500",
    description: "Connect your Instagram Business account to manage posts and analyze performance",
    features: ["Post scheduling", "Analytics", "Story management", "Hashtag suggestions"]
  },
  twitter: {
    name: "Twitter/X",
    icon: Twitter,
    color: "text-blue-400",
    bgColor: "bg-gradient-to-r from-blue-400 to-blue-600",
    description: "Connect your Twitter account for automated posting and engagement tracking",
    features: ["Tweet scheduling", "Thread creation", "Analytics", "Trend analysis"]
  },
  linkedin: {
    name: "LinkedIn",
    icon: Linkedin,
    color: "text-blue-600",
    bgColor: "bg-gradient-to-r from-blue-600 to-blue-800",
    description: "Professional networking and content sharing for business growth",
    features: ["Professional posts", "Article publishing", "Network analytics", "Lead generation"]
  },
  youtube: {
    name: "YouTube",
    icon: Youtube,
    color: "text-red-500",
    bgColor: "bg-gradient-to-r from-red-500 to-red-700",
    description: "Upload and manage video content with automated optimization",
    features: ["Video uploads", "Thumbnail generation", "Description optimization", "Analytics"]
  },
  facebook: {
    name: "Facebook Pages",
    icon: Facebook,
    color: "text-blue-500",
    bgColor: "bg-gradient-to-r from-blue-500 to-blue-700",
    description: "Manage Facebook business pages and advertising campaigns",
    features: ["Page management", "Ad campaigns", "Audience insights", "Event promotion"]
  }
};

export default function Integrations() {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspaceContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [liveDataStatus, setLiveDataStatus] = useState<Record<string, 'syncing' | 'live' | 'stale'>>({});
  const [manualConnectOpen, setManualConnectOpen] = useState(false);
  const [manualConnectPlatform, setManualConnectPlatform] = useState<string>('instagram');
  const [accessToken, setAccessToken] = useState("");
  const [username, setUsername] = useState("");

  // Fetch connected social accounts with auto-refresh
  const { data: socialAccounts, isLoading, refetch } = useQuery({
    queryKey: ['social-accounts', currentWorkspace?.id],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/social-accounts?workspaceId=${currentWorkspace?.id}`);
      return response.json();
    },
    enabled: !!currentWorkspace?.id,
    refetchInterval: 30000, // Auto-refresh every 30 seconds
    refetchIntervalInBackground: true,
  });

  // Auto-refresh effect for live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(new Date());
      if (socialAccounts?.length > 0) {
        // Mark all accounts as syncing
        const updatedStatus: Record<string, 'syncing' | 'live' | 'stale'> = {};
        socialAccounts.forEach((account: SocialAccount) => {
          updatedStatus[account.platform] = 'syncing';
        });
        setLiveDataStatus(updatedStatus);
        
        // Refresh data
        refetch().then(() => {
          // Mark as live after successful refresh
          socialAccounts.forEach((account: SocialAccount) => {
            updatedStatus[account.platform] = 'live';
          });
          setLiveDataStatus({...updatedStatus});
        });
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [socialAccounts, refetch]);

  // Initialize live status
  useEffect(() => {
    if (socialAccounts?.length > 0) {
      const initialStatus: Record<string, 'syncing' | 'live' | 'stale'> = {};
      socialAccounts.forEach((account: SocialAccount) => {
        initialStatus[account.platform] = 'live';
      });
      setLiveDataStatus(initialStatus);
    }
  }, [socialAccounts]);

  // Connect social account mutation
  const connectMutation = useMutation({
    mutationFn: async (platform: string) => {
      console.log(`[CONNECT DEBUG] ===========================================`);
      console.log(`[CONNECT DEBUG] Attempting to connect ${platform}`);
      console.log(`[CONNECT DEBUG] User state:`, user ? 'Present' : 'Missing');
      console.log(`[CONNECT DEBUG] User ID:`, user?.id);
      console.log(`[CONNECT DEBUG] Firebase UID:`, user?.firebaseUid);
      
      // Get fresh token from Firebase auth or localStorage
      let token = localStorage.getItem('veefore_auth_token');
      console.log(`[CONNECT DEBUG] Token from localStorage:`, token ? `Present (${token.substring(0, 20)}...)` : 'Missing');
      
      // Handle demo mode vs real Firebase user
      if (user && token) {
        console.log(`[CONNECT DEBUG] User exists, checking if demo mode or real Firebase user`);
        
        // Check if this is demo mode
        if (user.firebaseUid === 'demo-user') {
          console.log(`[CONNECT DEBUG] Demo mode detected, using demo token`);
          token = 'demo-token';
          localStorage.setItem('veefore_auth_token', token);
        } else {
          // Real Firebase user - get fresh token
          console.log(`[CONNECT DEBUG] Real Firebase user, attempting to get fresh token`);
          try {
            // Import Firebase auth dynamically
            const { auth } = await import('@/lib/firebase');
            console.log(`[CONNECT DEBUG] Firebase auth current user:`, auth.currentUser ? 'Present' : 'Missing');
            
            if (auth.currentUser) {
              const freshToken = await auth.currentUser.getIdToken(true); // Force refresh
              if (freshToken) {
                token = freshToken;
                localStorage.setItem('veefore_auth_token', freshToken);
                console.log(`[CONNECT DEBUG] Fresh token obtained from Firebase (${freshToken.substring(0, 20)}...)`);
              }
            } else {
              console.log(`[CONNECT DEBUG] No current Firebase user found`);
            }
          } catch (error) {
            console.error(`[CONNECT ERROR] Failed to get fresh token:`, error);
          }
        }
      } else {
        console.log(`[CONNECT DEBUG] No user in auth context`);
      }
      
      console.log(`[CONNECT DEBUG] Final token state:`, token ? `Present (${token.substring(0, 20)}...)` : 'Missing');
      
      if (!token) {
        console.error(`[CONNECT ERROR] No authentication token available after all attempts`);
        throw new Error('Authentication token not found. Please refresh the page and try again.');
      }
      
      console.log(`[CONNECT DEBUG] Making authenticated request to /api/${platform}/auth`);
      console.log(`[CONNECT DEBUG] Request headers will include: Authorization: Bearer ${token.substring(0, 20)}...`);
      
      try {
        // Make direct authenticated fetch to ensure proper headers
        const response = await fetch(`/api/${platform}/auth?workspaceId=${currentWorkspace?.id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        
        console.log(`[CONNECT DEBUG] Response status:`, response.status);
        console.log(`[CONNECT DEBUG] Response ok:`, response.ok);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[CONNECT ERROR] Response error:`, errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        console.log(`[CONNECT DEBUG] Response data:`, data);
        
        if (data.authUrl) {
          console.log(`[CONNECT DEBUG] Redirecting to:`, data.authUrl);
          window.location.href = data.authUrl;
        } else {
          throw new Error('Failed to get authorization URL');
        }
      } catch (error: any) {
        console.error(`[CONNECT ERROR] Request failed:`, error);
        
        // Handle demo mode authentication requirement
        if (error.message.includes('requires real authentication')) {
          throw new Error('Instagram integration requires real authentication. Please log out and log in with your Google account to connect your Instagram Business account.');
        }
        
        throw error;
      }
    },
    onMutate: (platform) => {
      setConnectingPlatform(platform);
    },
    onError: (error: any) => {
      setConnectingPlatform(null);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect account",
        variant: "destructive",
      });
    }
  });

  // Manual connection mutation (supports both Instagram and YouTube)
  const manualConnectMutation = useMutation({
    mutationFn: async ({ accessToken, username, platform }: { accessToken: string; username: string; platform: string }) => {
      const endpoint = platform === 'instagram' ? '/api/instagram/manual-connect' : '/api/youtube/manual-connect';
      const response = await apiRequest('POST', endpoint, {
        accessToken,
        username
      });
      return response.json();
    },
    onSuccess: (data) => {
      const platformName = manualConnectPlatform === 'instagram' ? 'Instagram' : 'YouTube';
      toast({
        title: `${platformName} Connected`,
        description: `Successfully connected ${data.account?.username || data.username}`,
      });
      setManualConnectOpen(false);
      setAccessToken("");
      setUsername("");
      queryClient.invalidateQueries({ queryKey: ['social-accounts'] });
    },
    onError: (error: any) => {
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Disconnect social account mutation
  const disconnectMutation = useMutation({
    mutationFn: async (accountId: number) => {
      const response = await apiRequest('DELETE', `/api/social-accounts/${accountId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-accounts'] });
      toast({
        title: "Account Disconnected",
        description: "Social media account has been successfully disconnected.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Disconnection Failed",
        description: error.message || "Failed to disconnect account",
        variant: "destructive",
      });
    }
  });

  // Toggle account status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ accountId, isActive }: { accountId: number; isActive: boolean }) => {
      const response = await apiRequest('PATCH', `/api/social-accounts/${accountId}`, { isActive });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-accounts'] });
    }
  });

  // Refresh token mutation (updated for multi-platform support)
  const refreshTokenMutation = useMutation({
    mutationFn: async ({ accountId, platform }: { accountId: number; platform: string }) => {
      const response = await apiRequest('POST', `/api/${platform}/refresh-token/${accountId}`);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['social-accounts'] });
      toast({
        title: "Data Refreshed",
        description: `${data.username || 'Account'} data has been successfully refreshed.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Refresh Failed",
        description: error.message || "Failed to refresh token",
        variant: "destructive",
      });
    }
  });

  // Direct Instagram connection mutation (uses existing token)
  const directConnectMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/instagram/connect-direct');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-accounts'] });
      toast({
        title: "Instagram Connected",
        description: "Instagram account connected successfully using existing token.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect Instagram account",
        variant: "destructive",
      });
    }
  });

  // Cleanup old accounts mutation
  const cleanupMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/social-accounts/cleanup');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['social-accounts'] });
      toast({
        title: "Cleanup Complete",
        description: `Removed ${data.deletedAccounts} old Instagram accounts.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Cleanup Failed",
        description: error.message || "Failed to cleanup old accounts",
        variant: "destructive",
      });
    }
  });

  const getConnectedAccount = (platform: string): SocialAccount | undefined => {
    return Array.isArray(socialAccounts) ? socialAccounts.find((account: SocialAccount) => account.platform === platform) : undefined;
  };

  const isTokenExpired = (account: SocialAccount): boolean => {
    if (!account.expiresAt) return false;
    return new Date(account.expiresAt) < new Date();
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin w-8 h-8 border-4 border-electric-cyan border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-orbitron font-bold neon-text text-electric-cyan mb-2">
            Social Integrations
          </h2>
          <p className="text-asteroid-silver">
            Connect your social media accounts to automate content creation and analytics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Settings className="text-asteroid-silver" />
            <span className="text-sm text-asteroid-silver">
              {socialAccounts?.length || 0} platforms connected
            </span>
          </div>
          <Button
            onClick={() => cleanupMutation.mutate()}
            disabled={cleanupMutation.isPending}
            variant="outline"
            size="sm"
            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
          >
            {cleanupMutation.isPending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Cleaning...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Old Accounts
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Connection Status Alert */}
      {socialAccounts?.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Connect your first social media account to start using VeeFore's AI-powered content creation and analytics features.
          </AlertDescription>
        </Alert>
      )}

      {/* Platform Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(platformConfig).map(([platform, config]) => {
          const connectedAccount = getConnectedAccount(platform);
          const isConnected = !!connectedAccount;
          const isExpired = connectedAccount ? isTokenExpired(connectedAccount) : false;
          const IconComponent = config.icon;

          return (
            <Card key={platform} className="relative overflow-hidden border-asteroid-gray/20 bg-space-black/50 backdrop-blur-sm">
              {/* Platform Header with Gradient */}
              <div className={`h-2 ${config.bgColor}`} />
              
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${config.bgColor} bg-opacity-10`}>
                      <IconComponent className={`w-6 h-6 ${config.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{config.name}</CardTitle>
                      {isConnected && (
                        <div className="flex items-center gap-2 mt-1">
                          {isExpired ? (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Token Expired
                            </Badge>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Badge variant="default" className="text-xs bg-green-500/20 text-green-400">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Connected
                              </Badge>
                              {/* Live Data Status Indicator */}
                              {liveDataStatus[platform] === 'syncing' ? (
                                <Badge variant="outline" className="text-xs border-electric-cyan text-electric-cyan">
                                  <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                                  Syncing
                                </Badge>
                              ) : liveDataStatus[platform] === 'live' ? (
                                <Badge variant="outline" className="text-xs border-green-400 text-green-400">
                                  <Radio className="w-3 h-3 mr-1" />
                                  Live
                                </Badge>
                              ) : liveDataStatus[platform] === 'stale' ? (
                                <Badge variant="outline" className="text-xs border-blue-400 text-blue-400">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Stale
                                </Badge>
                              ) : null}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {isConnected && (
                    <Switch
                      checked={connectedAccount?.isActive}
                      onCheckedChange={(checked) => 
                        toggleStatusMutation.mutate({ 
                          accountId: connectedAccount.id, 
                          isActive: checked 
                        })
                      }
                      disabled={isExpired}
                    />
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-asteroid-silver text-sm">
                  {config.description}
                </p>

                {/* Features List */}
                <div className="space-y-2">
                  <h4 className="text-white font-medium text-sm">Features:</h4>
                  <ul className="space-y-1">
                    {config.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-xs text-asteroid-silver">
                        <div className="w-1 h-1 bg-electric-cyan rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Connected Account Info */}
                {isConnected && (
                  <div className="space-y-2 p-3 bg-space-black/30 rounded-lg border border-asteroid-gray/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-asteroid-silver">Account:</span>
                      <span className="text-xs text-white font-mono">
                        @{connectedAccount.username}
                      </span>
                    </div>
                    
                    {/* Platform-specific stats */}
                    {platform === 'instagram' && connectedAccount.followersCount !== undefined && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-asteroid-silver">Followers:</span>
                          <span className="text-xs text-electric-cyan">
                            {connectedAccount.followersCount?.toLocaleString() || '0'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-asteroid-silver">Posts:</span>
                          <span className="text-xs text-electric-cyan">
                            {connectedAccount.mediaCount?.toLocaleString() || '0'}
                          </span>
                        </div>
                      </>
                    )}
                    
                    {platform === 'youtube' && connectedAccount.subscriberCount !== undefined && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-asteroid-silver">Subscribers:</span>
                          <span className="text-xs text-red-400">
                            {connectedAccount.subscriberCount?.toLocaleString() || '0'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-asteroid-silver">Videos:</span>
                          <span className="text-xs text-red-400">
                            {connectedAccount.videoCount?.toLocaleString() || '0'}
                          </span>
                        </div>
                        {connectedAccount.viewCount && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-asteroid-silver">Total Views:</span>
                            <span className="text-xs text-red-400">
                              {connectedAccount.viewCount?.toLocaleString() || '0'}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                    
                    {connectedAccount.lastSync && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-asteroid-silver">Last Sync:</span>
                        <span className="text-xs text-asteroid-silver">
                          {new Date(connectedAccount.lastSync).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </span>
                      </div>
                    )}
                    
                    {/* Live Data Timestamp */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-asteroid-silver">Auto-refresh:</span>
                      <span className="text-xs text-electric-cyan">
                        {lastRefresh.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {!isConnected ? (
                    <>
                      <Button 
                        onClick={() => connectMutation.mutate(platform)}
                        disabled={connectingPlatform === platform}
                        className="flex-1 bg-gradient-to-r from-electric-cyan to-nebula-purple hover:from-electric-cyan/80 hover:to-nebula-purple/80"
                      >
                        {connectingPlatform === platform ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Connect
                          </>
                        )}
                      </Button>
                      {(platform === 'instagram' || platform === 'youtube') && (
                        <Dialog open={manualConnectOpen} onOpenChange={setManualConnectOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline"
                              className="border-electric-cyan text-electric-cyan hover:bg-electric-cyan hover:text-white"
                              onClick={() => setManualConnectPlatform(platform)}
                            >
                              Manual Connect
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-space-black border-asteroid-gray/20">
                            <DialogHeader>
                              <DialogTitle className="text-white">
                                Connect {platform === 'instagram' ? 'Instagram' : 'YouTube'} Manually
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              {platform === 'youtube' && (
                                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                  <div className="flex items-start space-x-3">
                                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                                    <div>
                                      <h4 className="text-amber-500 font-medium">OAuth App Verification Required</h4>
                                      <p className="text-xs text-asteroid-gray mt-1">
                                        YouTube OAuth is blocked due to Google app verification requirements. Manual connection allows you to use YouTube features during development.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                              <div>
                                <Label htmlFor="username" className="text-white">
                                  {platform === 'instagram' ? 'Instagram Username' : 'YouTube Channel Name'}
                                </Label>
                                <Input
                                  id="username"
                                  placeholder={platform === 'instagram' 
                                    ? "Enter your Instagram username (e.g., arpit9996363)"
                                    : "Enter your YouTube channel name"
                                  }
                                  value={username}
                                  onChange={(e) => setUsername(e.target.value)}
                                  className="bg-asteroid-gray/10 border-asteroid-gray/20 text-white"
                                />
                              </div>
                              <div>
                                <Label htmlFor="token" className="text-white">Access Token</Label>
                                <Input
                                  id="token"
                                  placeholder={platform === 'instagram'
                                    ? "Enter your Instagram access token"
                                    : "Enter your YouTube API access token"
                                  }
                                  value={accessToken}
                                  onChange={(e) => setAccessToken(e.target.value)}
                                  className="bg-asteroid-gray/10 border-asteroid-gray/20 text-white"
                                />
                                <p className="text-xs text-asteroid-gray mt-1">
                                  {platform === 'instagram'
                                    ? "Get your access token from Instagram Basic Display API or Graph API"
                                    : "Get your access token from Google Cloud Console > YouTube Data API v3"
                                  }
                                </p>
                              </div>
                              <Button
                                onClick={() => manualConnectMutation.mutate({ accessToken, username, platform: manualConnectPlatform })}
                                disabled={!accessToken || !username || manualConnectMutation.isPending}
                                className="w-full bg-electric-cyan hover:bg-electric-cyan/80"
                              >
                                {manualConnectMutation.isPending ? (
                                  <>
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    Connecting...
                                  </>
                                ) : (
                                  `Connect ${manualConnectPlatform === 'instagram' ? 'Instagram' : 'YouTube'}`
                                )}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </>
                  ) : (
                    <>
                      {isExpired && (
                        <Button 
                          onClick={() => refreshTokenMutation.mutate({ 
                            accountId: connectedAccount.id, 
                            platform: connectedAccount.platform 
                          })}
                          disabled={refreshTokenMutation.isPending}
                          variant="outline"
                          className="flex-1"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Refresh
                        </Button>
                      )}
                      <Button 
                        onClick={() => disconnectMutation.mutate(connectedAccount.id)}
                        disabled={disconnectMutation.isPending}
                        variant="destructive"
                        className="flex-1"
                      >
                        <Unlink className="w-4 h-4 mr-2" />
                        Disconnect
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Instagram Token Management */}
      {socialAccounts?.some((account: SocialAccount) => account.platform === 'instagram') && (
        <InstagramTokenManager />
      )}

      {/* Integration Guide */}
      <Card className="border-asteroid-gray/20 bg-space-black/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-electric-cyan" />
            Integration Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-white font-medium">Getting Started</h4>
              <ul className="space-y-2 text-sm text-asteroid-silver">
                <li className="flex items-start gap-2">
                  <span className="text-electric-cyan mt-1">1.</span>
                  Click "Connect" on your preferred social media platform
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-electric-cyan mt-1">2.</span>
                  Authorize VeeFore to access your account
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-electric-cyan mt-1">3.</span>
                  Start creating and scheduling content automatically
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-white font-medium">Security & Privacy</h4>
              <ul className="space-y-2 text-sm text-asteroid-silver">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  All connections use secure OAuth protocols
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  We never store your passwords
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  You can revoke access anytime
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}