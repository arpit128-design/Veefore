import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWorkspaceContext } from "@/hooks/useWorkspace";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Flame, Music, Hash, Clock, RefreshCw, Zap } from "lucide-react";
import { auth } from "@/lib/firebase";
import { UpgradeModal } from "@/components/modals/UpgradeModal";
import { useState } from "react";

export default function Suggestions() {
  const { currentWorkspace } = useWorkspaceContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [upgradeModal, setUpgradeModal] = useState({
    isOpen: false,
    featureType: "",
    creditsRequired: 0,
    currentCredits: 0
  });

  // Fetch user data to get current credits
  const { data: user } = useQuery({
    queryKey: ["/api/user"],
    refetchInterval: 30000
  });

  const { data: suggestionsResponse, refetch, isLoading } = useQuery({
    queryKey: ['suggestions', currentWorkspace?.id],
    queryFn: async () => {
      console.log(`[SUGGESTIONS] Fetching suggestions for workspace: ${currentWorkspace?.id}`);
      console.log(`[SUGGESTIONS] Current workspace name: ${currentWorkspace?.name}`);
      
      const response = await fetch(`/api/suggestions?workspaceId=${currentWorkspace?.id}`, {
        headers: {
          'Authorization': `Bearer ${await auth.currentUser?.getIdToken()}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }
      const data = await response.json();
      console.log(`[SUGGESTIONS] Received ${data.length} suggestions for workspace ${currentWorkspace?.id}`);
      return data;
    },
    enabled: !!currentWorkspace?.id
  });

  // Ensure suggestions is always an array
  const suggestions = Array.isArray(suggestionsResponse) ? suggestionsResponse : [];

  const generateSuggestionsMutation = useMutation({
    mutationFn: async () => {
      if (!currentWorkspace?.id) {
        throw new Error('No workspace selected');
      }
      
      console.log(`[SUGGESTIONS] Generating new suggestions for workspace: ${currentWorkspace.id} (${currentWorkspace.name})`);
      
      const response = await apiRequest('POST', '/api/suggestions/generate', {
        workspaceId: currentWorkspace.id
      });
      return await response.json();
    },
    onSuccess: (data) => {
      console.log(`[SUGGESTIONS] Generation successful, invalidating cache for workspace: ${currentWorkspace?.id}`);
      // Clear and invalidate all suggestion-related queries for this workspace
      queryClient.removeQueries({ queryKey: ['suggestions'] });
      queryClient.invalidateQueries({ queryKey: ['suggestions', currentWorkspace?.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      toast({
        title: "AI Suggestions Generated!",
        description: `Used ${data.creditsUsed} credit. ${data.remainingCredits} credits remaining.`,
      });
      
      // Force immediate refetch
      setTimeout(() => {
        refetch();
      }, 100);
    },
    onError: (error: any) => {
      if (error.status === 402 && error.upgradeModal) {
        setUpgradeModal({
          isOpen: true,
          featureType: "AI Suggestions",
          creditsRequired: 1,
          currentCredits: user?.credits || 0
        });
      } else {
        toast({
          title: "Generation Failed",
          description: error.message || "Failed to generate suggestions",
          variant: "destructive",
        });
      }
    }
  });

  const getSuggestionsByType = (type: string) => {
    return suggestions.filter((s: any) => s.type === type);
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl lg:text-4xl font-orbitron font-bold text-nebula-purple">
            AI Suggestions
          </h2>
          <p className="text-gray-400 mt-2">
            Generate personalized content ideas using AI (1 credit per generation)
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:space-x-4 sm:gap-0">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              {user?.credits || 0} Credits
            </Badge>
          </div>
          <div className="flex items-center space-x-2 text-xs md:text-sm text-asteroid-silver">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Updated 2 hours ago</span>
            <span className="sm:hidden">Updated 2h ago</span>
          </div>
          <Button
            onClick={() => generateSuggestionsMutation.mutate()}
            disabled={generateSuggestionsMutation.isPending || !currentWorkspace?.id}
            className="bg-gradient-to-r from-nebula-purple to-purple-600 hover:opacity-90 w-full sm:w-auto"
          >
            {generateSuggestionsMutation.isPending ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 mr-2" />
            )}
            <span className="hidden sm:inline">Generate New Suggestions</span>
            <span className="sm:hidden">Generate</span>
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
                  
                  <div className="space-y-4">
                    <div className="font-medium text-sm mb-2">
                      {suggestion.data?.suggestion || 'No description available'}
                    </div>
                    
                    {suggestion.data?.reasoning && (
                      <div className="text-xs text-asteroid-silver bg-cosmic-blue/50 p-3 rounded border-l-2 border-electric-cyan/40">
                        <strong className="text-white">Why this works:</strong> {suggestion.data.reasoning}
                      </div>
                    )}
                    
                    {suggestion.data?.actionItems && suggestion.data.actionItems.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-white">Action Steps:</h4>
                        <ul className="space-y-1 text-xs">
                          {suggestion.data.actionItems.map((item: string, index: number) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-electric-cyan font-bold">•</span>
                              <span className="text-asteroid-silver">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {(suggestion.data?.expectedImpact || suggestion.data?.timeframe) && (
                      <div className="flex flex-wrap gap-2 text-xs">
                        {suggestion.data?.expectedImpact && (
                          <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded">
                            Impact: {suggestion.data.expectedImpact}
                          </div>
                        )}
                        {suggestion.data?.timeframe && (
                          <div className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded">
                            Timeline: {suggestion.data.timeframe}
                          </div>
                        )}
                        {suggestion.data?.difficulty && (
                          <div className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                            Difficulty: {suggestion.data.difficulty}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-electric-cyan/20">
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

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={upgradeModal.isOpen}
        onClose={() => setUpgradeModal(prev => ({ ...prev, isOpen: false }))}
        featureType={upgradeModal.featureType}
        creditsRequired={upgradeModal.creditsRequired}
        currentCredits={upgradeModal.currentCredits}
      />
    </div>
  );
}
