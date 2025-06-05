import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoGenerator } from "@/components/content/VideoGenerator";
import { ReelBuilder } from "@/components/content/ReelBuilder";
import { PostCreator } from "@/components/content/PostCreator";
import { CaptionAI } from "@/components/content/CaptionAI";
import { ThumbnailEditor } from "@/components/content/ThumbnailEditor";
import { useCredits } from "@/hooks/useCredits";
import { useQuery } from "@tanstack/react-query";
import { useWorkspace } from "@/hooks/useWorkspace";
import { Badge } from "@/components/ui/badge";
import { Calendar, Play, Image as ImageIcon, Edit, FileImage, Youtube, Clock } from "lucide-react";

export default function ContentStudio() {
  const { credits } = useCredits();
  const { currentWorkspace } = useWorkspace();
  const [activeTab, setActiveTab] = useState("video");

  const { data: recentCreations } = useQuery({
    queryKey: ['content', currentWorkspace?.id],
    queryFn: () => fetch(`/api/content?workspaceId=${currentWorkspace?.id}`).then(res => res.json()),
    enabled: !!currentWorkspace?.id
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case 'video': return <Calendar className="h-4 w-4" />;
      case 'reel': return <Play className="h-4 w-4" />;
      case 'post': return <ImageIcon className="h-4 w-4" />;
      case 'caption': return <Edit className="h-4 w-4" />;
      case 'thumbnail': return <FileImage className="h-4 w-4" />;
      case 'youtube_short': return <Youtube className="h-4 w-4" />;
      default: return <ImageIcon className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500';
      case 'scheduled': return 'bg-solar-gold';
      case 'ready': return 'bg-electric-cyan';
      default: return 'bg-space-gray';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-orbitron font-bold neon-text text-electric-cyan">
          AI Content Studio
        </h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-asteroid-silver">Credits remaining:</div>
          <div className="text-xl font-mono text-solar-gold">{credits.toLocaleString()}</div>
        </div>
      </div>

      {/* Content Generation Tools */}
      <Card className="content-card holographic">
        <CardHeader>
          <CardTitle className="text-2xl font-orbitron font-semibold neon-text text-nebula-purple">
            Content Generation Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 glassmorphism">
              <TabsTrigger value="video" className="text-xs">Video</TabsTrigger>
              <TabsTrigger value="reel" className="text-xs">Reel</TabsTrigger>
              <TabsTrigger value="post" className="text-xs">Post</TabsTrigger>
              <TabsTrigger value="caption" className="text-xs">Caption</TabsTrigger>
              <TabsTrigger value="thumbnail" className="text-xs">Thumbnail</TabsTrigger>
            </TabsList>

            <TabsContent value="video">
              <VideoGenerator />
            </TabsContent>

            <TabsContent value="reel">
              <ReelBuilder />
            </TabsContent>

            <TabsContent value="post">
              <PostCreator />
            </TabsContent>

            <TabsContent value="caption">
              <CaptionAI />
            </TabsContent>

            <TabsContent value="thumbnail">
              <ThumbnailEditor />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Recent Creations */}
      <Card className="content-card holographic">
        <CardHeader>
          <CardTitle className="text-2xl font-orbitron font-semibold neon-text text-electric-cyan">
            Recent Creations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentCreations && recentCreations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {recentCreations.slice(0, 8).map((creation: any) => (
                <div key={creation.id} className="p-4 rounded-lg bg-cosmic-blue hover:bg-space-gray transition-all group cursor-pointer">
                  <div className="aspect-video bg-gradient-to-br from-electric-cyan/20 to-nebula-purple/20 rounded-lg mb-3 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {getIconForType(creation.type)}
                    </div>
                    <Badge className="absolute top-2 right-2 bg-black/50 text-white text-xs">
                      {creation.type}
                    </Badge>
                    {creation.contentData?.duration && (
                      <Badge className="absolute bottom-2 left-2 bg-black/50 text-white text-xs">
                        {creation.contentData.duration}
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium text-sm truncate">{creation.title}</div>
                    <div className="flex justify-between text-xs text-asteroid-silver">
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(creation.createdAt).toLocaleDateString()}</span>
                      </span>
                      <span className="text-solar-gold">{creation.creditsUsed} credits</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <Badge className={`${getStatusColor(creation.status)} text-white`}>
                        {creation.status}
                      </Badge>
                      <span className="text-electric-cyan">{creation.platform || 'Multi-platform'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-electric-cyan to-nebula-purple flex items-center justify-center mx-auto mb-4">
                <Edit className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Content Created Yet</h3>
              <p className="text-asteroid-silver mb-4">Start creating amazing content with our AI-powered tools above.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
