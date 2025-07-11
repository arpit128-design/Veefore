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
import { Image, Zap } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function PostCreator() {
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [layout, setLayout] = useState("");
  const [platform, setPlatform] = useState("");
  const { currentWorkspace } = useWorkspace();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/content/generate', data),
    onSuccess: () => {
      toast({
        title: "Post Generated Successfully!",
        description: "Your stunning visual post is ready to publish.",
      });
      queryClient.invalidateQueries({ queryKey: ['content'] });
      setPrompt("");
      setTitle("");
      setLayout("");
      setPlatform("");
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate post content",
        variant: "destructive",
      });
    }
  });

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a description for your post",
        variant: "destructive",
      });
      return;
    }

    generateMutation.mutate({
      type: 'post',
      prompt: prompt.trim(),
      title: title.trim() || `Generated Post - ${new Date().toLocaleDateString()}`,
      workspaceId: currentWorkspace?.id,
      platform,
      contentData: { layout }
    });
  };

  return (
    <Card className="content-card holographic">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-nebula-purple to-pink-500 flex items-center justify-center">
            <Image className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-orbitron font-semibold">Post Creator</h3>
            <p className="text-asteroid-silver text-sm">Generate stunning visual posts with custom graphics and layouts</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div>
            <Label htmlFor="post-title">Post Title</Label>
            <Input
              id="post-title"
              placeholder="Enter post title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="glassmorphism"
            />
          </div>

          <div>
            <Label htmlFor="post-platform">Target Platform</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="glassmorphism">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram Feed</SelectItem>
                <SelectItem value="twitter">X (Twitter)</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="post-layout">Layout Style</Label>
            <Select value={layout} onValueChange={setLayout}>
              <SelectTrigger className="glassmorphism">
                <SelectValue placeholder="Select layout style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minimal">Minimal & Clean</SelectItem>
                <SelectItem value="bold">Bold & Colorful</SelectItem>
                <SelectItem value="quote">Quote Card</SelectItem>
                <SelectItem value="infographic">Infographic</SelectItem>
                <SelectItem value="carousel">Carousel Slides</SelectItem>
                <SelectItem value="branded">Branded Template</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="post-prompt">Post Content</Label>
            <Textarea
              id="post-prompt"
              placeholder="Describe the visual post you want to create... (e.g., 'Motivational quote about success with modern gradient background and clean typography')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-32 glassmorphism"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-cosmic-blue border border-nebula-purple/30">
          <div>
            <div className="font-medium text-nebula-purple">Generation Cost</div>
            <div className="text-sm text-asteroid-silver">10 credits per post</div>
          </div>
          <div className="text-right">
            <div className="font-medium text-asteroid-silver">Estimated Time</div>
            <div className="text-sm text-blue-500">30-60 seconds</div>
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={generateMutation.isPending || !prompt.trim()}
          className="w-full bg-gradient-to-r from-nebula-purple to-pink-500 hover:opacity-90 transition-opacity"
        >
          {generateMutation.isPending ? (
            <>
              <LoadingSpinner className="w-4 h-4 mr-2" />
              Creating Post...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Create Post
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
