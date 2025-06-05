import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useToast } from "@/hooks/use-toast";
import { Video, Zap } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function VideoGenerator() {
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("");
  const { currentWorkspace } = useWorkspace();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/content/generate', data),
    onSuccess: (response) => {
      toast({
        title: "Video Generated Successfully!",
        description: "Your AI-powered video is ready for review.",
      });
      queryClient.invalidateQueries({ queryKey: ['content'] });
      // Reset form
      setPrompt("");
      setTitle("");
      setPlatform("");
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate video content",
        variant: "destructive",
      });
    }
  });

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a description for your video",
        variant: "destructive",
      });
      return;
    }

    generateMutation.mutate({
      type: 'video',
      prompt: prompt.trim(),
      title: title.trim() || `Generated Video - ${new Date().toLocaleDateString()}`,
      workspaceId: currentWorkspace?.id,
      platform
    });
  };

  return (
    <Card className="content-card holographic">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-electric-cyan to-nebula-purple flex items-center justify-center">
            <Video className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-orbitron font-semibold">Video Generator</h3>
            <p className="text-asteroid-silver text-sm">Create engaging videos with AI-powered scenes and effects</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div>
            <Label htmlFor="video-title">Video Title</Label>
            <Input
              id="video-title"
              placeholder="Enter video title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="glassmorphism"
            />
          </div>

          <div>
            <Label htmlFor="platform-select">Target Platform</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="glassmorphism">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="twitter">X (Twitter)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="video-prompt">Video Description</Label>
            <Textarea
              id="video-prompt"
              placeholder="Describe the video you want to create... (e.g., 'A motivational fitness video showing morning workout routine with upbeat music')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-32 glassmorphism"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-cosmic-blue border border-electric-cyan/30">
          <div>
            <div className="font-medium text-electric-cyan">Generation Cost</div>
            <div className="text-sm text-asteroid-silver">25 credits per video</div>
          </div>
          <div className="text-right">
            <div className="font-medium text-asteroid-silver">Estimated Time</div>
            <div className="text-sm text-solar-gold">2-3 minutes</div>
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={generateMutation.isPending || !prompt.trim()}
          className="w-full bg-gradient-to-r from-electric-cyan to-nebula-purple hover:opacity-90 transition-opacity"
        >
          {generateMutation.isPending ? (
            <>
              <LoadingSpinner className="w-4 h-4 mr-2" />
              Generating Video...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Generate Video
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
