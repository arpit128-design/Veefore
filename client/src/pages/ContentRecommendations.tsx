import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useWorkspace } from "@/hooks/useWorkspace";
import { Play, Pause, Heart, Share2, Bookmark, MapPin, Clock, Eye, ThumbsUp, Image, Smartphone } from "lucide-react";
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
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());
  const [bookmarkedItems, setBookmarkedItems] = useState<Set<number>>(new Set());
  const { currentWorkspace } = useWorkspace();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());

  const { data: recommendationsData, isLoading } = useQuery({
    queryKey: ['/api/content-recommendations', currentWorkspace?.id, activeTab],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/content-recommendations?workspaceId=${currentWorkspace?.id}&type=${activeTab}&limit=12`);
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

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const handlePlay = async (id: number, videoElement?: HTMLVideoElement) => {
    // Pause all other videos
    videoRefs.current.forEach((video, videoId) => {
      if (videoId !== id && !video.paused) {
        video.pause();
      }
    });

    if (videoElement) {
      try {
        await videoElement.play();
        setPlayingId(id);
        trackInteractionMutation.mutate({ id, action: 'viewed' });
      } catch (error) {
        console.error('Error playing video:', error);
      }
    } else {
      setPlayingId(id);
      trackInteractionMutation.mutate({ id, action: 'viewed' });
    }
  };

  const handlePause = (id: number, videoElement?: HTMLVideoElement) => {
    if (videoElement) {
      videoElement.pause();
    }
    setPlayingId(null);
  };

  const handleLike = (id: number) => {
    const newLikedItems = new Set(likedItems);
    if (likedItems.has(id)) {
      newLikedItems.delete(id);
    } else {
      newLikedItems.add(id);
      trackInteractionMutation.mutate({ 
        id, 
        action: 'liked',
        metadata: { timestamp: new Date().toISOString() }
      });
    }
    setLikedItems(newLikedItems);
  };

  const handleBookmark = (id: number) => {
    const newBookmarkedItems = new Set(bookmarkedItems);
    if (bookmarkedItems.has(id)) {
      newBookmarkedItems.delete(id);
    } else {
      newBookmarkedItems.add(id);
      trackInteractionMutation.mutate({ 
        id, 
        action: 'created_similar',
        metadata: { timestamp: new Date().toISOString() }
      });
    }
    setBookmarkedItems(newBookmarkedItems);
  };

  const ContentCard = ({ recommendation }: { recommendation: ContentRecommendation }) => {
    const isPlaying = playingId === recommendation.id;
    const isLiked = likedItems.has(recommendation.id);
    const isBookmarked = bookmarkedItems.has(recommendation.id);

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="h-full border-2 hover:border-primary/20 transition-all duration-300 bg-gradient-to-br from-card to-card/80">
          <div className="relative">
            {recommendation.type.includes('video') || recommendation.type.includes('reel') ? (
              <div className="relative aspect-video bg-muted rounded-t-lg overflow-hidden">
                {recommendation.thumbnailUrl ? (
                  <img 
                    src={recommendation.thumbnailUrl} 
                    alt={recommendation.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Play className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                
                {/* Auto-play overlay for videos and reels */}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="rounded-full bg-white/20 backdrop-blur-sm border-white/30"
                    onClick={() => handlePlay(recommendation.id)}
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6 text-white" />
                    ) : (
                      <Play className="h-6 w-6 text-white" />
                    )}
                  </Button>
                </div>

                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="bg-black/60 text-white border-none">
                    {recommendation.type.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
                
                <div className="absolute bottom-3 right-3">
                  <Badge variant="outline" className="bg-black/60 text-white border-white/30">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDuration(recommendation.duration)}
                  </Badge>
                </div>
              </div>
            ) : (
              // Audio content
              <div className="relative aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-t-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                      <Play className="h-10 w-10 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">Audio Content</p>
                  </div>
                </div>
                
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="bg-purple-600 text-white">
                    AUDIO
                  </Badge>
                </div>
                
                <div className="absolute bottom-3 right-3">
                  <Badge variant="outline" className="bg-black/60 text-white border-white/30">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDuration(recommendation.duration)}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-sm font-semibold line-clamp-2 leading-tight">
                  {recommendation.title}
                </CardTitle>
                <CardDescription className="text-xs mt-1 line-clamp-2">
                  {recommendation.description}
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{recommendationsData?.location.country}</span>
              <span>•</span>
              <span className="capitalize">{recommendation.category}</span>
            </div>
          </CardHeader>

          <CardContent className="pt-0 space-y-3">
            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {recommendation.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs py-0">
                  #{tag}
                </Badge>
              ))}
              {recommendation.tags.length > 3 && (
                <Badge variant="outline" className="text-xs py-0">
                  +{recommendation.tags.length - 3}
                </Badge>
              )}
            </div>

            {/* Engagement stats */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
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

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={isLiked ? "default" : "outline"}
                  onClick={() => handleLike(recommendation.id)}
                  className="h-8 px-3"
                >
                  <Heart className={`h-3 w-3 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                  Like
                </Button>
                
                <Button
                  size="sm"
                  variant={isBookmarked ? "default" : "outline"}
                  onClick={() => handleBookmark(recommendation.id)}
                  className="h-8 px-3"
                >
                  <Bookmark className={`h-3 w-3 mr-1 ${isBookmarked ? 'fill-current' : ''}`} />
                  Save
                </Button>
              </div>

              <Button size="sm" variant="ghost" className="h-8 px-3">
                <Share2 className="h-3 w-3 mr-1" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const recommendations = recommendationsData?.recommendations || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Content Recommendations</h1>
          {recommendationsData?.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{recommendationsData.location.city}, {recommendationsData.location.country}</span>
            </div>
          )}
        </div>
        <p className="text-muted-foreground">
          Personalized content ideas based on your niche, interests, and location trends
        </p>
      </div>

      {/* Content Type Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'video' | 'reel' | 'audio')}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="video" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="reel" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Reels
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Audio
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <AnimatePresence mode="wait">
            {recommendations.length > 0 ? (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {recommendations.map((recommendation) => (
                  <ContentCard key={recommendation.id} recommendation={recommendation} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 space-y-4"
              >
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <Play className="h-10 w-10 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No recommendations yet</h3>
                  <p className="text-muted-foreground">
                    We're generating personalized {activeTab} content for you based on your preferences.
                  </p>
                </div>
                <Button 
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  Refresh Recommendations
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentRecommendations;