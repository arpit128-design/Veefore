import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useWorkspace } from "@/hooks/useWorkspace";
import { 
  Play, Pause, Heart, Share2, Bookmark, MapPin, Clock, Eye, ThumbsUp, 
  TrendingUp, Sparkles, Globe, Video, Camera, ImageIcon, Zap,
  ArrowRight, Star, Users, MessageCircle, ExternalLink, Settings, Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

interface ContentRecommendation {
  id: number;
  type: 'youtube-video' | 'youtube-shorts' | 'instagram-post' | 'instagram-video' | 'instagram-reel';
  title: string;
  description: string;
  thumbnailUrl?: string;
  mediaUrl?: string;
  duration: number;
  category: string;
  country: string;
  tags: string[];
  engagement: {
    expectedViews: number;
    expectedLikes: number;
    expectedShares: number;
  };
  sourceUrl?: string;
  isActive: boolean;
  createdAt: string;
}

interface RecommendationsResponse {
  recommendations: ContentRecommendation[];
  location: {
    country: string;
    countryCode: string;
    city: string;
    region: string;
  };
  totalCount: number;
}

const ContentRecommendations = () => {
  const [activeTab, setActiveTab] = useState<'youtube-video' | 'youtube-shorts' | 'instagram-post' | 'instagram-video' | 'instagram-reel'>('youtube-video');
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());
  const [bookmarkedItems, setBookmarkedItems] = useState<Set<number>>(new Set());
  const { currentWorkspace } = useWorkspace();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [userInterests, setUserInterests] = useState('');
  const [userNiche, setUserNiche] = useState('');
  const [showPreferences, setShowPreferences] = useState(false);
  const [userPreferencesLoaded, setUserPreferencesLoaded] = useState(false);

  // Fetch user data to get onboarding preferences
  const { data: userData } = useQuery({
    queryKey: ['/api/user'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/user');
      return response.json();
    }
  });

  // Load user's existing preferences from onboarding
  useEffect(() => {
    if (userData?.preferences && !userPreferencesLoaded) {
      console.log('[PREFERENCES DEBUG] User data preferences:', userData.preferences);
      const prefs = userData.preferences as any;
      if (prefs.interests && Array.isArray(prefs.interests)) {
        setUserInterests(prefs.interests.join(', '));
      }
      if (prefs.niche) {
        setUserNiche(prefs.niche);
      }
      setUserPreferencesLoaded(true);
    }
  }, [userData, userPreferencesLoaded]);

  const { data: recommendationsData, isLoading } = useQuery({
    queryKey: ['/api/content-recommendations', currentWorkspace?.id, activeTab, userInterests, userNiche],
    queryFn: async () => {
      const params = new URLSearchParams({
        workspaceId: currentWorkspace?.id?.toString() || '',
        type: activeTab,
        limit: '12'
      });
      
      if (userInterests.trim()) {
        params.set('interests', userInterests);
      }
      if (userNiche.trim()) {
        params.set('niche', userNiche);
      }
      
      const response = await apiRequest('GET', `/api/content-recommendations?${params.toString()}`);
      return response.json();
    },
    enabled: !!currentWorkspace?.id,
  });

  const trackInteractionMutation = useMutation({
    mutationFn: ({ id, action, metadata }: { id: number; action: string; metadata?: any }) =>
      apiRequest('POST', `/api/content-recommendations/${id}/track?workspaceId=${currentWorkspace?.id}`, {
        action,
        metadata
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content-recommendations'] });
    }
  });

  const recommendations = recommendationsData?.recommendations || [];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleLike = (id: number) => {
    const newLikedItems = new Set(likedItems);
    if (newLikedItems.has(id)) {
      newLikedItems.delete(id);
    } else {
      newLikedItems.add(id);
    }
    setLikedItems(newLikedItems);
    trackInteractionMutation.mutate({ id, action: 'liked' });
  };

  const handleBookmark = (id: number) => {
    const newBookmarkedItems = new Set(bookmarkedItems);
    if (newBookmarkedItems.has(id)) {
      newBookmarkedItems.delete(id);
    } else {
      newBookmarkedItems.add(id);
    }
    setBookmarkedItems(newBookmarkedItems);
    trackInteractionMutation.mutate({ id, action: 'bookmarked' });
  };

  const getPlatformIcon = (type: string) => {
    switch (type) {
      case 'youtube-video': return <Video className="h-5 w-5" />;
      case 'youtube-shorts': return <Play className="h-5 w-5" />;
      case 'instagram-post': return <ImageIcon className="h-5 w-5" />;
      case 'instagram-video': return <Camera className="h-5 w-5" />;
      case 'instagram-reel': return <Video className="h-5 w-5" />;
      default: return <Sparkles className="h-5 w-5" />;
    }
  };

  const getPlatformColor = (type: string) => {
    switch (type) {
      case 'youtube-video': return 'from-red-500 to-red-600';
      case 'youtube-shorts': return 'from-red-400 to-pink-500';
      case 'instagram-post': return 'from-purple-500 to-pink-500';
      case 'instagram-video': return 'from-purple-400 to-blue-500';
      case 'instagram-reel': return 'from-pink-500 to-purple-600';
      default: return 'from-blue-500 to-purple-600';
    }
  };

  const ContentCard = ({ recommendation }: { recommendation: ContentRecommendation }) => {
    const isLiked = likedItems.has(recommendation.id);
    const isBookmarked = bookmarkedItems.has(recommendation.id);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const isVideoContent = recommendation.type.includes('video') || recommendation.type.includes('reel');

    const handleCardClick = () => {
      // Track interaction
      trackInteractionMutation.mutate({ id: recommendation.id, action: 'viewed' });
      
      // Open source URL in new tab if available
      if (recommendation.sourceUrl) {
        window.open(recommendation.sourceUrl, '_blank', 'noopener,noreferrer');
      }
    };

    const handleVideoToggle = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
      if (isVideoContent && videoRef.current) {
        if (recommendation.mediaUrl?.includes('youtube.com/embed')) {
          // YouTube iframe - already has autoplay enabled in URL
          setIsPlaying(true);
        } else if (recommendation.mediaUrl?.startsWith('http')) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(() => {
            console.log('Video autoplay failed for:', recommendation.title);
          });
          setIsPlaying(true);
        }
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      if (isVideoContent && videoRef.current) {
        if (!recommendation.mediaUrl?.includes('youtube.com/embed')) {
          videoRef.current.pause();
        }
        setIsPlaying(false);
      }
    };

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="group cursor-pointer"
        onClick={handleCardClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 h-full">
          {/* Thumbnail/Video Section */}
          <div className="relative aspect-video overflow-hidden">
            {isVideoContent && recommendation.mediaUrl && recommendation.mediaUrl.includes('youtube.com/embed') ? (
              <iframe
                ref={videoRef as any}
                src={`${recommendation.mediaUrl}&autoplay=0&mute=1`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : isVideoContent && recommendation.mediaUrl && recommendation.mediaUrl.startsWith('http') ? (
              <video
                ref={videoRef}
                src={recommendation.mediaUrl}
                poster={recommendation.thumbnailUrl || '/api/placeholder/320/180'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loop
                muted
                playsInline
                onError={() => console.log('Video failed to load:', recommendation.mediaUrl)}
              />
            ) : (
              <>
                {recommendation.thumbnailUrl ? (
                  <img 
                    src={recommendation.thumbnailUrl} 
                    alt={recommendation.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${getPlatformColor(recommendation.type)} flex items-center justify-center`}>
                    <div className="text-white/80">
                      {getPlatformIcon(recommendation.type)}
                    </div>
                  </div>
                )}
              </>
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Platform Badge */}
            <div className="absolute top-3 left-3">
              <Badge className={`bg-gradient-to-r ${getPlatformColor(recommendation.type)} text-white border-0 shadow-lg`}>
                <div className="flex items-center gap-1">
                  {getPlatformIcon(recommendation.type)}
                  <span className="text-xs font-medium">
                    {recommendation.type.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </span>
                </div>
              </Badge>
            </div>

            {/* Duration Badge */}
            {recommendation.duration > 0 && (
              <div className="absolute top-3 right-3">
                <Badge variant="secondary" className="bg-black/60 text-white border-0 backdrop-blur-sm">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDuration(recommendation.duration)}
                </Badge>
              </div>
            )}

            {/* External Link Indicator */}
            {recommendation.sourceUrl && (
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Badge variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-sm">
                  <ExternalLink className="h-3 w-3" />
                </Badge>
              </div>
            )}

            {/* Play/Pause Button Overlay for Videos */}
            {isVideoContent && (
              <div 
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                onClick={handleVideoToggle}
              >
                <Button 
                  size="lg" 
                  className="rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6 ml-1" />
                  )}
                </Button>
              </div>
            )}

            {/* Click to View Indicator for Non-Videos */}
            {!isVideoContent && recommendation.sourceUrl && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button 
                  size="lg" 
                  className="rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white"
                >
                  <ExternalLink className="h-6 w-6" />
                </Button>
              </div>
            )}
          </div>

          <CardContent className="p-4 space-y-3">
            {/* Title and Description */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                {recommendation.title}
              </h3>
              {recommendation.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {recommendation.description}
                </p>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {recommendation.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs px-2 py-0">
                  #{tag}
                </Badge>
              ))}
            </div>

            {/* Engagement Metrics */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{formatNumber(recommendation.engagement.expectedViews)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3" />
                  <span>{formatNumber(recommendation.engagement.expectedLikes)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Share2 className="h-3 w-3" />
                  <span>{formatNumber(recommendation.engagement.expectedShares)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className={`h-8 w-8 p-0 ${isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => handleLike(recommendation.id)}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className={`h-8 w-8 p-0 ${isBookmarked ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => handleBookmark(recommendation.id)}
                >
                  <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                  onClick={() => trackInteractionMutation.mutate({ id: recommendation.id, action: 'shared' })}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              <Button
                size="sm"
                className="h-8 px-3 text-xs bg-gradient-to-r from-primary to-primary/80"
                onClick={() => trackInteractionMutation.mutate({ id: recommendation.id, action: 'use_template' })}
              >
                Use Template
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Content Recommendations
            </h1>
            <div className="flex items-center gap-2 mt-2 text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span>AI-powered content ideas tailored for your audience</span>
            </div>
          </div>
          {recommendationsData?.location && (
            <div className="flex items-center gap-2 px-3 py-2 bg-card/50 rounded-lg border">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {recommendationsData.location.city}, {recommendationsData.location.country}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* User Preferences Display */}
      <Card className="mb-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Your Personalized Content</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreferences(!showPreferences)}
              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showPreferences ? 'Hide Details' : 'View Preferences'}
            </Button>
          </div>

          {/* Display Current Preferences */}
          {userData?.preferences && (
            <div className="mb-4 space-y-3">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-400 min-w-fit">Your Interests:</span>
                {(() => {
                  const prefs = userData.preferences as any;
                  
                  // Handle the actual onboarding structure - create fresh array each time
                  const baseInterests = prefs.selectedNiches && Array.isArray(prefs.selectedNiches) 
                    ? [...prefs.selectedNiches] 
                    : [];
                  
                  // Add additional interests based on business description if available
                  const additionalInterests = [];
                  if (prefs.description && typeof prefs.description === 'string') {
                    const desc = prefs.description.toLowerCase();
                    if (desc.includes('social media')) additionalInterests.push('social media');
                    if (desc.includes('management')) additionalInterests.push('management');
                    if (desc.includes('app')) additionalInterests.push('app development');
                  }
                  
                  // Merge and deduplicate properly
                  const allInterests = [...new Set([...baseInterests, ...additionalInterests])];
                  
                  // Fallback to manual interests if no interests found
                  const finalInterests = allInterests.length > 0 
                    ? allInterests 
                    : (prefs.interests && Array.isArray(prefs.interests) ? prefs.interests : []);
                  
                  return finalInterests.map((interest: string, index: number) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="bg-purple-500/20 text-purple-300 border-purple-500/30"
                    >
                      {interest}
                    </Badge>
                  ));
                })()}
              </div>
              {(() => {
                const prefs = userData.preferences as any;
                
                // Build comprehensive display of user info
                const displayItems = [];
                
                // Business name
                if (prefs.businessName) {
                  displayItems.push({
                    label: 'Business',
                    value: prefs.businessName,
                    className: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                  });
                }
                
                // Description/Purpose
                if (prefs.description) {
                  displayItems.push({
                    label: 'Focus',
                    value: prefs.description,
                    className: 'bg-green-500/20 text-green-300 border-green-500/30'
                  });
                }
                
                // Tone
                if (prefs.tone) {
                  displayItems.push({
                    label: 'Tone',
                    value: prefs.tone,
                    className: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                  });
                }
                
                return displayItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-400 min-w-fit">{item.label}:</span>
                    <Badge 
                      variant="secondary" 
                      className={item.className}
                    >
                      {item.value}
                    </Badge>
                  </div>
                ));
              })()}
            </div>
          )}
          
          <AnimatePresence>
            {showPreferences && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                    <h4 className="text-sm font-medium text-gray-300 mb-3">Customize Preferences (Optional)</h4>
                    <p className="text-xs text-gray-400 mb-4">
                      Content is automatically personalized using your onboarding preferences. You can temporarily override them below.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="interests" className="text-purple-300 mb-2 block text-sm">
                          Override Interests
                        </Label>
                        <Input
                          id="interests"
                          placeholder="e.g., AI, machine learning, startups"
                          value={userInterests}
                          onChange={(e) => setUserInterests(e.target.value)}
                          className="bg-gray-800/50 border-purple-500/30 text-white placeholder-gray-400 text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="niche" className="text-purple-300 mb-2 block text-sm">
                          Override Niche
                        </Label>
                        <Input
                          id="niche"
                          placeholder="e.g., AI tutorials, tech reviews"
                          value={userNiche}
                          onChange={(e) => setUserNiche(e.target.value)}
                          className="bg-gray-800/50 border-purple-500/30 text-white placeholder-gray-400 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => {
                      queryClient.invalidateQueries({ queryKey: ['/api/content-recommendations'] });
                      toast({
                        title: "Getting Fresh Content",
                        description: userInterests || userNiche ? "Using your custom preferences..." : "Using your onboarding preferences..."
                      });
                    }}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    size="sm"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Refresh Content
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      setUserInterests('');
                      setUserNiche('');
                      queryClient.invalidateQueries({ queryKey: ['/api/content-recommendations'] });
                      toast({
                        title: "Reset Complete",
                        description: "Using your original onboarding preferences"
                      });
                    }}
                    className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                    size="sm"
                  >
                    Use Original Preferences
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Platform Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-5 bg-card/50 backdrop-blur-sm">
          <TabsTrigger value="youtube-video" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <span className="hidden sm:inline">YouTube Videos</span>
            <span className="sm:hidden">Videos</span>
          </TabsTrigger>
          <TabsTrigger value="youtube-shorts" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            <span className="hidden sm:inline">YouTube Shorts</span>
            <span className="sm:hidden">Shorts</span>
          </TabsTrigger>
          <TabsTrigger value="instagram-post" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Instagram Posts</span>
            <span className="sm:hidden">Posts</span>
          </TabsTrigger>
          <TabsTrigger value="instagram-video" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            <span className="hidden sm:inline">Instagram Videos</span>
            <span className="sm:hidden">Videos</span>
          </TabsTrigger>
          <TabsTrigger value="instagram-reel" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <span className="hidden sm:inline">Instagram Reels</span>
            <span className="sm:hidden">Reels</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="h-80 animate-pulse">
                    <div className="aspect-video bg-muted rounded-t-lg" />
                    <CardContent className="p-4 space-y-3">
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-3 bg-muted rounded w-3/4" />
                      <div className="flex gap-2">
                        <div className="h-6 bg-muted rounded w-16" />
                        <div className="h-6 bg-muted rounded w-16" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            ) : recommendations.length > 0 ? (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {recommendations.map((recommendation: ContentRecommendation, index: number) => (
                  <motion.div
                    key={recommendation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ContentCard recommendation={recommendation} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-16"
              >
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Loading Fresh Trending Content</h3>
                  <p className="text-muted-foreground">
                    Getting the latest trending {activeTab.replace('-', ' ')} content from multiple sources including Reddit, HackerNews, Dev.to, and Medium. 
                    This real data helps you create content that resonates with your audience!
                  </p>
                  <Button 
                    onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/content-recommendations'] })}
                    className="mt-4"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Load Fresh Trending Content
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentRecommendations;