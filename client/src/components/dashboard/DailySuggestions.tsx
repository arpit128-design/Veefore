import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, Music, Hash, Clock } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useLocation } from "wouter";

export function DailySuggestions() {
  const { currentWorkspace } = useWorkspace();
  const [, setLocation] = useLocation();

  const { data: suggestions, refetch } = useQuery({
    queryKey: ['suggestions', currentWorkspace?.id],
    queryFn: async () => {
      const token = localStorage.getItem('veefore_auth_token');
      const response = await fetch(`/api/suggestions?workspaceId=${currentWorkspace?.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }
      return response.json();
    },
    enabled: !!currentWorkspace?.id
  });

  const generateSuggestionsMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/suggestions/generate', {
      workspaceId: currentWorkspace?.id
    }),
    onSuccess: () => {
      refetch();
    }
  });

  // Display actual suggestions instead of predefined categories
  const displaySuggestions = suggestions && Array.isArray(suggestions) ? suggestions.slice(0, 3) : [];

  const getIconForType = (type: string) => {
    switch (type) {
      case 'growth': return Flame;
      case 'hashtag': return Hash;
      case 'trending': return Music;
      case 'engagement': return Clock;
      default: return Flame;
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'growth': return 'text-electric-cyan';
      case 'hashtag': return 'text-blue-500';
      case 'trending': return 'text-purple-500';
      case 'engagement': return 'text-nebula-purple';
      default: return 'text-electric-cyan';
    }
  };

  const getBorderForType = (type: string) => {
    switch (type) {
      case 'growth': return 'border-electric-cyan/30';
      case 'hashtag': return 'border-blue-500/30';
      case 'trending': return 'border-purple-500/30';
      case 'engagement': return 'border-nebula-purple/30';
      default: return 'border-electric-cyan/30';
    }
  };

  const getSuggestionByType = (type: string) => {
    return Array.isArray(suggestions) ? suggestions.find((s: any) => s.type === type) : null;
  };

  return (
    <Card className="content-card holographic">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-orbitron font-semibold text-nebula-purple">
          Today's AI Briefing
        </CardTitle>
        <div className="flex items-center space-x-2 text-sm text-asteroid-silver">
          <Clock className="h-4 w-4" />
          <span>Updated 2 hours ago</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {displaySuggestions.length > 0 ? (
            displaySuggestions.map((suggestion: any) => {
              const Icon = getIconForType(suggestion.type);
              const color = getColorForType(suggestion.type);
              const borderColor = getBorderForType(suggestion.type);
              
              return (
                <div
                  key={suggestion.id}
                  className={`p-4 rounded-lg bg-cosmic-blue border ${borderColor}`}
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <Icon className={`h-5 w-5 ${color}`} />
                    <span className="font-medium capitalize">{suggestion.type} Strategy</span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className={`${color} font-medium leading-relaxed`}>
                      {suggestion.data?.suggestion?.substring(0, 120)}...
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <Badge variant="outline" className="text-xs">
                        {suggestion.confidence}% confidence
                      </Badge>
                      <div className="text-xs text-asteroid-silver">
                        {suggestion.data?.difficulty || 'Medium'} difficulty
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="w-full mt-3 bg-electric-cyan/10 border-electric-cyan/30 hover:bg-electric-cyan/20 transition-colors"
                      onClick={() => setLocation('/ai-suggestions')}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-8">
              <div className="text-asteroid-silver mb-4">No AI suggestions available yet</div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => generateSuggestionsMutation.mutate()}
                disabled={generateSuggestionsMutation.isPending}
                className="bg-electric-cyan/10 border-electric-cyan/30 hover:bg-electric-cyan/20"
              >
                {generateSuggestionsMutation.isPending ? 'Generating AI Strategies...' : 'Generate AI Briefing'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
