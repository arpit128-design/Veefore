import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Hash, TrendingUp, Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useInstantHashtags } from '@/hooks/useInstantData';
import { useWorkspaceContext } from '@/hooks/useWorkspace';

interface Hashtag {
  tag: string;
  category: string;
  popularity: number;
  growthPotential: number;
  engagement: string;
  platforms: string[];
  uses: number;
}

export function TrendingHashtags() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { currentWorkspace } = useWorkspaceContext();

  const { data: hashtags, isLoading } = useInstantHashtags(selectedCategory);

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'business', label: 'Business' },
    { value: 'technology', label: 'Technology' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'food', label: 'Food' },
    { value: 'travel', label: 'Travel' },
    { value: 'fashion', label: 'Fashion' },
  ];

  const copyHashtags = (selectedTags: string[]) => {
    const hashtagText = selectedTags.map(tag => `#${tag}`).join(' ');
    navigator.clipboard.writeText(hashtagText);
    toast({
      title: "Hashtags Copied",
      description: `${selectedTags.length} hashtags copied to clipboard`,
    });
  };

  const copyAllHashtags = () => {
    if (hashtags && hashtags.length > 0) {
      const allTags = hashtags.map((h: Hashtag) => h.tag);
      copyHashtags(allTags);
    }
  };

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 80) return 'bg-red-500';
    if (popularity >= 60) return 'bg-purple-500';
    if (popularity >= 40) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return '📸';
      case 'twitter': return '𝕏';
      case 'youtube': return '📺';
      case 'reddit': return '🗨️';
      case 'news': return '📰';
      case 'google-trends': return '📈';
      case 'trending': return '🔥';
      case 'viral-now': return '🚀';
      case 'multi-platform': return '🌐';
      default: return '⭐';
    }
  };

  const getGrowthColor = (growth: number) => {
    if (growth >= 90) return 'text-green-400';
    if (growth >= 70) return 'text-blue-400';
    if (growth >= 50) return 'text-purple-400';
    return 'text-red-400';
  };

  if (isLoading) {
    return (
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Hash className="h-5 w-5" />
            Trending Hashtags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-6 bg-white/10 rounded-md"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10">
      <CardHeader className="pb-3 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <CardTitle className="flex items-center gap-2 text-white text-sm sm:text-base">
              <Hash className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="truncate">Viral Hashtags Analysis</span>
            </CardTitle>
            <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400 border-green-500/30 w-fit">
              Live Data
            </Badge>
          </div>
          <div className="flex gap-1 sm:gap-2 flex-shrink-0">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => window.location.reload()}
              className="text-white hover:bg-white/10 p-1 sm:p-2"
            >
              <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={copyAllHashtags}
              className="text-white hover:bg-white/10 p-1 sm:p-2"
            >
              <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
        
        <p className="text-xs sm:text-sm text-white/70 mt-2 leading-relaxed">
          Real-time analysis across Instagram, Twitter/X, YouTube, Reddit, and trending news
        </p>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mt-3 sm:mt-4">
          {categories.map((category) => (
            <Button
              key={category.value}
              size="sm"
              variant={selectedCategory === category.value ? "default" : "ghost"}
              onClick={() => setSelectedCategory(category.value)}
              className={`text-xs px-2 py-1 sm:px-3 sm:py-1.5 ${
                selectedCategory === category.value
                  ? 'bg-cyan-500 text-white'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="px-3 sm:px-6">
        {hashtags && hashtags.length > 0 ? (
          <div className="space-y-2 sm:space-y-3">
            {hashtags.map((hashtag: Hashtag, index: number) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group gap-2 sm:gap-3"
                onClick={() => copyHashtags([hashtag.tag])}
              >
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
                    <span className="text-cyan-400 font-mono text-sm sm:text-base truncate">#{hashtag.tag}</span>
                    <Badge variant="secondary" className="text-xs bg-white/10 text-white border-white/20 flex-shrink-0">
                      {hashtag.category}
                    </Badge>
                  </div>
                  
                  {/* Platform indicators */}
                  <div className="flex gap-1 flex-shrink-0">
                    {hashtag.platforms?.slice(0, 3).map((platform, idx) => (
                      <span key={idx} className="text-xs" title={platform}>
                        {getPlatformIcon(platform)}
                      </span>
                    ))}
                    {hashtag.platforms?.length > 3 && (
                      <span className="text-xs text-white/50" title={`+${hashtag.platforms.length - 3} more platforms`}>
                        +{hashtag.platforms.length - 3}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-white/70">
                    <TrendingUp className="h-3 w-3" />
                    <span>{hashtag.engagement}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${getGrowthColor(hashtag.growthPotential)}`}>
                      {hashtag.growthPotential}%
                    </span>
                    <div className="w-8 sm:w-12 h-2 rounded-full bg-white/20 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${getPopularityColor(hashtag.popularity)}`}
                        style={{ width: `${hashtag.popularity}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <Copy className="h-3 w-3 sm:h-4 sm:w-4 text-white/50 group-hover:text-white transition-colors flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-white/50">
            <Hash className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No trending hashtags available</p>
            <p className="text-sm mt-1">Try selecting a different category</p>
          </div>
        )}
        
        {hashtags && hashtags.length > 0 && (
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10">
            <Button
              onClick={copyAllHashtags}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white text-xs sm:text-sm"
              size="sm"
            >
              <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Copy All Hashtags ({hashtags.length})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}