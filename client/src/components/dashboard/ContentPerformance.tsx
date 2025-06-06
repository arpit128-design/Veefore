import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Play, Image, Video, Camera } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useWorkspaceContext } from "@/hooks/useWorkspace";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export function ContentPerformance() {
  const { currentWorkspace } = useWorkspaceContext();
  const { token } = useAuth();
  const [timeRange, setTimeRange] = useState("7");

  const { data: content } = useQuery({
    queryKey: ['content', currentWorkspace?.id],
    queryFn: () => fetch(`/api/content?workspaceId=${currentWorkspace?.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => res.json()),
    enabled: !!currentWorkspace?.id && !!token
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case 'video':
      case 'youtube_short':
        return Video;
      case 'reel':
        return Play;
      case 'post':
        return Image;
      case 'story':
        return Camera;
      default:
        return Image;
    }
  };

  const getGradientForType = (type: string) => {
    switch (type) {
      case 'video':
      case 'youtube_short':
        return 'from-electric-cyan/20 to-nebula-purple/20';
      case 'reel':
        return 'from-solar-gold/20 to-red-500/20';
      case 'post':
        return 'from-nebula-purple/20 to-pink-500/20';
      default:
        return 'from-green-400/20 to-blue-500/20';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="content-card holographic">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-orbitron font-semibold neon-text text-green-400">
          Content Performance
        </CardTitle>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32 glassmorphism">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 3 months</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.isArray(content) ? content.slice(0, 8).map((item: any) => {
            const IconComponent = getIconForType(item.type);
            const gradient = getGradientForType(item.type);
            
            return (
              <div
                key={item.id}
                className="p-4 rounded-lg bg-cosmic-blue hover:bg-space-gray transition-all group cursor-pointer"
              >
                <div className={`aspect-video bg-gradient-to-br ${gradient} rounded-lg mb-3 relative overflow-hidden`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <IconComponent className="h-8 w-8 text-white opacity-70" />
                  </div>
                  <Badge className="absolute top-2 right-2 bg-black/50 text-white">
                    {item.type}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="font-medium text-sm truncate">{item.title}</div>
                  <div className="flex justify-between text-xs text-asteroid-silver">
                    <span>{item.platform || 'Multi-platform'}</span>
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-green-400">
                      {item.contentData?.views ? `${item.contentData.views} views` : 'Ready'}
                    </span>
                    <span className="text-electric-cyan">
                      {item.status === 'published' ? 'Live' : item.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="col-span-full text-center text-cosmic-gray py-8">
              No content available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
