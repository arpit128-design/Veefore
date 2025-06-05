import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, Music, Hash, Clock } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWorkspace } from "@/hooks/useWorkspace";

export function DailySuggestions() {
  const { currentWorkspace } = useWorkspace();

  const { data: suggestions, refetch } = useQuery({
    queryKey: ['suggestions', currentWorkspace?.id],
    queryFn: () => fetch(`/api/suggestions?workspaceId=${currentWorkspace?.id}`).then(res => res.json()),
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

  const suggestionTypes = [
    {
      type: 'trending',
      title: 'Trending Content',
      icon: Flame,
      color: 'text-orange-500',
      borderColor: 'border-electric-cyan/30',
      bgColor: 'bg-cosmic-blue'
    },
    {
      type: 'audio',
      title: 'Audio Trending',
      icon: Music,
      color: 'text-nebula-purple',
      borderColor: 'border-nebula-purple/30',
      bgColor: 'bg-cosmic-blue'
    },
    {
      type: 'hashtag',
      title: 'Hashtag Strategy',
      icon: Hash,
      color: 'text-solar-gold',
      borderColor: 'border-solar-gold/30',
      bgColor: 'bg-cosmic-blue'
    }
  ];

  const getSuggestionByType = (type: string) => {
    return Array.isArray(suggestions) ? suggestions.find((s: any) => s.type === type) : null;
  };

  return (
    <Card className="content-card holographic">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-orbitron font-semibold neon-text text-nebula-purple">
          Today's AI Briefing
        </CardTitle>
        <div className="flex items-center space-x-2 text-sm text-asteroid-silver">
          <Clock className="h-4 w-4" />
          <span>Updated 2 hours ago</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {suggestionTypes.map((suggestionType) => {
            const suggestion = getSuggestionByType(suggestionType.type);
            
            return (
              <div
                key={suggestionType.type}
                className={`p-4 rounded-lg ${suggestionType.bgColor} border ${suggestionType.borderColor}`}
              >
                <div className="flex items-center space-x-2 mb-3">
                  <suggestionType.icon className={`h-5 w-5 ${suggestionType.color}`} />
                  <span className="font-medium">{suggestionType.title}</span>
                </div>
                
                {suggestion ? (
                  <div className="space-y-2 text-sm">
                    <div className="text-asteroid-silver">AI Suggestion:</div>
                    <div className={`${suggestionType.color} font-medium`}>
                      {suggestion.data?.suggestion?.substring(0, 100)}...
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="text-xs">
                        {suggestion.confidence}% confidence
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      className={`w-full bg-${suggestionType.type === 'trending' ? 'electric-cyan' : suggestionType.type === 'audio' ? 'nebula-purple' : 'solar-gold'}/20 hover:bg-opacity-30`}
                    >
                      Use Suggestion
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-asteroid-silver text-sm">No suggestions available</div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => generateSuggestionsMutation.mutate()}
                      disabled={generateSuggestionsMutation.isPending}
                      className="w-full"
                    >
                      {generateSuggestionsMutation.isPending ? 'Generating...' : 'Generate Suggestions'}
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
