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
import { Smartphone, Zap } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function ReelBuilder() {
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [style, setStyle] = useState("");
  const { currentWorkspace } = useWorkspace();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/content/generate', data),
    onSuccess: () => {
      toast({
        title: "Reel Generated Successfully!",
        description: "Your viral-ready short-form content is ready.",
      });
      queryClient.invalidateQueries({ queryKey: ['content'] });
      setPrompt("");
      setTitle("");
      setStyle("");
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate reel content",
        variant: "destructive",
      });
    }
  });

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a description for your reel",
        variant: "destructive",
      });
      return;
    }

    generateMutation.mutate({
      type: 'reel',
      prompt: prompt.trim(),
      title: title.trim() || `Generated Reel - ${new Date().toLocaleDateString()}`,
      workspaceId: currentWorkspace?.id,
      platform: 'instagram',
      contentData: { style }
    });
  };

  return (
    <Card className="content-card holographic">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <Smartphone className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-orbitron font-semibold">Reel Builder</h3>
            <p className="text-asteroid-silver text-sm">Craft viral-ready short-form content optimized for engagement</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div>
            <Label htmlFor="reel-title">Reel Title</Label>
            <Input
              id="reel-title"
              placeholder="Enter reel title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="glassmorphism"
            />
          </div>

          <div>
            <Label htmlFor="reel-style">Reel Style</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger className="glassmorphism">
                <SelectValue placeholder="Select reel style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trending">Trending/Viral</SelectItem>
                <SelectItem value="educational">Educational</SelectItem>
                <SelectItem value="behind-scenes">Behind the Scenes</SelectItem>
                <SelectItem value="product-showcase">Product Showcase</SelectItem>
                <SelectItem value="storytelling">Storytelling</SelectItem>
                <SelectItem value="comedy">Comedy/Entertainment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="reel-prompt">Reel Concept</Label>
            <Textarea
              id="reel-prompt"
              placeholder="Describe your reel idea... (e.g., 'Quick morning routine tips with trending audio, showing 5 productivity hacks in 30 seconds')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-32 glassmorphism"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-cosmic-blue border border-blue-500/30">
          <div>
            <div className="font-medium text-blue-500">Generation Cost</div>
            <div className="text-sm text-asteroid-silver">15 credits per reel</div>
          </div>
          <div className="text-right">
            <div className="font-medium text-asteroid-silver">Estimated Time</div>
            <div className="text-sm text-blue-500">1-2 minutes</div>
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={generateMutation.isPending || !prompt.trim()}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 transition-opacity"
        >
          {generateMutation.isPending ? (
            <>
              <LoadingSpinner className="w-4 h-4 mr-2" />
              Building Reel...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Build Reel
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
