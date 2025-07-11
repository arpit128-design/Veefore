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
import { FileImage, Zap } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function ThumbnailEditor() {
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [style, setStyle] = useState("");
  const [platform, setPlatform] = useState("");
  const { currentWorkspace } = useWorkspace();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/content/generate', data),
    onSuccess: () => {
      toast({
        title: "Thumbnail Generated Successfully!",
        description: "Your eye-catching thumbnail is ready to boost clicks.",
      });
      queryClient.invalidateQueries({ queryKey: ['content'] });
      setPrompt("");
      setTitle("");
      setStyle("");
      setPlatform("");
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate thumbnail",
        variant: "destructive",
      });
    }
  });

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a description for your thumbnail",
        variant: "destructive",
      });
      return;
    }

    generateMutation.mutate({
      type: 'thumbnail',
      prompt: prompt.trim(),
      title: title.trim() || `Generated Thumbnail - ${new Date().toLocaleDateString()}`,
      workspaceId: currentWorkspace?.id,
      platform,
      contentData: { style }
    });
  };

  return (
    <Card className="content-card holographic">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <FileImage className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-orbitron font-semibold">Thumbnail Editor</h3>
            <p className="text-asteroid-silver text-sm">Design eye-catching thumbnails that maximize click-through rates</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div>
            <Label htmlFor="thumbnail-title">Video Title</Label>
            <Input
              id="thumbnail-title"
              placeholder="Enter video title for context..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="glassmorphism"
            />
          </div>

          <div>
            <Label htmlFor="thumbnail-platform">Target Platform</Label>
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
            <Label htmlFor="thumbnail-style">Thumbnail Style</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger className="glassmorphism">
                <SelectValue placeholder="Select thumbnail style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bold-text">Bold Text Overlay</SelectItem>
                <SelectItem value="minimalist">Clean & Minimalist</SelectItem>
                <SelectItem value="emotional">Emotional Expression</SelectItem>
                <SelectItem value="before-after">Before & After</SelectItem>
                <SelectItem value="numbered">Numbered List</SelectItem>
                <SelectItem value="clickbait">High-CTR Design</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="thumbnail-prompt">Thumbnail Description</Label>
            <Textarea
              id="thumbnail-prompt"
              placeholder="Describe the thumbnail design... (e.g., 'Fitness transformation thumbnail with person exercising, bright colors, and big text saying AMAZING RESULTS')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-32 glassmorphism"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-cosmic-blue border border-blue-400/30">
          <div>
            <div className="font-medium text-blue-400">Generation Cost</div>
            <div className="text-sm text-asteroid-silver">8 credits per thumbnail</div>
          </div>
          <div className="text-right">
            <div className="font-medium text-asteroid-silver">Estimated Time</div>
            <div className="text-sm text-blue-500">1 minute</div>
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={generateMutation.isPending || !prompt.trim()}
          className="w-full bg-gradient-to-r from-blue-400 to-purple-500 hover:opacity-90 transition-opacity"
        >
          {generateMutation.isPending ? (
            <>
              <LoadingSpinner className="w-4 h-4 mr-2" />
              Creating Thumbnail...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Generate Thumbnail
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
