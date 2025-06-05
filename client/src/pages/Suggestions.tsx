import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Flame, Music, Hash, Clock, RefreshCw, Zap } from "lucide-react";

export default function Suggestions() {
  const { currentWorkspace } = useWorkspace();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: suggestions, refetch, isLoading } = useQuery({
    queryKey: ['suggestions', currentWorkspace?.id],
    queryFn: () => fetch(`/api/suggestions?workspaceId=${currentWorkspace?.id}`).then(res => res.json()),
    enabled: !!currentWorkspace?.id
  });

  const generateSuggestionsMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/suggestions/generate', {
      workspaceId: currentWorkspace?.id
    }),
    onSuccess: () => {
      toast({
        title: "AI Suggestions Generated!",
        description: "Fresh content ideas are now available.",
      });
      refetch();
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate suggestions",
        variant: "destructive",
      });
    }
  });

  const getSuggestionsByType = (type: string) => {
    return suggestions?.filter((s: any) => s.type === type) || [];
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'trending': return <Flame className="h-5 w-5 text-orange-500" />;
      case 'audio': return <Music className="h-5 w-5 text-nebula-purple" />;
      case 'hashtag': return <Hash className="h-5 w-5 text-solar-gold" />;
      default: return <Sparkles className="h-5 w-5 text-electric-cyan" />;
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'trending': return 'border-orange-500/30 bg-orange-500/10';
      case 'audio': return 'border-nebula-purple/30 bg-nebula-purple/10';
      case 'hashtag': return 'border-solar-gold/30 bg-solar-gold/10';
      default: return 'border-electric-cyan/30 bg-electric-cyan/10';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-orbitron font-bold neon-text text-nebula-purple">
          AI Suggestions
        </h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-asteroid-silver">
            <Clock className="h-4 w-4" />
            <span>Updated 2 hours ago</span>
          </div>
          <Button
            onClick={() => generateSuggestionsMutation.mutate()}
            disabled={generateSuggestionsMutation.isPending}
            className="bg-gradient-to-r from-nebula-purple to-purple-600 hover:opacity-90"
          >
            {generateSuggestionsMutation.isPending ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 mr-2" />
            )}
            Generate New Suggestions
          </Button>
        </div>
      </div>

      {/* Today's Briefing */}
      <Card className="content-card holographic">
        <CardHeader>
          <CardTitle className="text-2xl font-orbitron font-semibold neon-text text-electric-cyan">
            Today's AI Briefing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {['trending', 'audio', 'hashtag'].map((type) => {
              const typeSuggestions = getSuggestionsByType(type);
              const latestSuggestion = typeSuggestions[0];
              
              return (
                <div
                  key={type}
                  className={`p-4 rounded-lg border ${getSuggestionColor(type)}`}
                >
                  <div className="flex items-center space-x-2 mb-3">
                    {getSuggestionIcon(type)}
                    <span className="font-medium capitalize">
                      {type === 'hashtag' ? 'Hashtag Strategy' : 
                       type === 'audio' ? 'Audio Trending' : 
                       'Trending Content'}
                    </span>
                  </div>
                  
                  {latestSuggestion ? (
                    <div className="space-y-3">
                      <div className="text-sm text-asteroid-silver">AI Recommendation:</div>
                      <div className="text-sm font-medium">
                        {latestSuggestion.data?.suggestion?.substring(0, 120)}...
                      </div>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="text-xs">
                          {latestSuggestion.confidence}% confidence
                        </Badge>
                        <span className="text-xs text-asteroid-silver">
                          {new Date(latestSuggestion.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        Use This Suggestion
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-asteroid-silver text-sm mb-2">No suggestions available</div>
                      <Button size="sm" variant="ghost" className="text-xs">
                        Generate Ideas
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* All Suggestions */}
      <Card className="content-card holographic">
        <CardHeader>
          <CardTitle className="text-xl font-orbitron font-semibold neon-text text-solar-gold">
            All AI Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {suggestions && suggestions.length > 0 ? (
            <div className="space-y-4">
              {suggestions.map((suggestion: any) => (
                <div
                  key={suggestion.id}
                  className="p-4 rounded-lg bg-cosmic-blue border border-electric-cyan/20 hover:border-electric-cyan/40 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getSuggestionIcon(suggestion.type)}
                      <div>
                        <div className="font-medium capitalize">{suggestion.type} Suggestion</div>
                        <div className="text-xs text-asteroid-silver">
                          Generated {new Date(suggestion.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={`${getSuggestionColor(suggestion.type)} border-0`}>
                        {suggestion.confidence}% match
                      </Badge>
                      {suggestion.isUsed && (
                        <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                          Used
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-sm mb-4">
                    {suggestion.data?.suggestion || 'No description available'}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-asteroid-silver">
                      {suggestion.validUntil && (
                        <>Valid until {new Date(suggestion.validUntil).toLocaleDateString()}</>
                      )}
                    </div>
                    {!suggestion.isUsed && (
                      <Button size="sm" className="bg-electric-cyan/20 text-electric-cyan hover:bg-electric-cyan/30">
                        Apply Suggestion
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Sparkles className="h-16 w-16 text-nebula-purple mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Suggestions Available</h3>
              <p className="text-asteroid-silver mb-4">
                Generate AI-powered content suggestions to boost your social media performance.
              </p>
              <Button
                onClick={() => generateSuggestionsMutation.mutate()}
                disabled={generateSuggestionsMutation.isPending}
                className="bg-gradient-to-r from-nebula-purple to-purple-600"
              >
                {generateSuggestionsMutation.isPending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Suggestions
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
