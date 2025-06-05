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
import { Edit, Zap, Copy } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function CaptionAI() {
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("");
  const [platform, setPlatform] = useState("");
  const [generatedCaption, setGeneratedCaption] = useState("");
  const { currentWorkspace } = useWorkspace();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/content/generate', data),
    onSuccess: (response: any) => {
      const caption = response.generatedContent || "Generated caption content";
      setGeneratedCaption(caption);
      toast({
        title: "Caption Generated Successfully!",
        description: "Your engaging caption is ready to use.",
      });
      queryClient.invalidateQueries({ queryKey: ['content'] });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate caption",
        variant: "destructive",
      });
    }
  });

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a description for your caption",
        variant: "destructive",
      });
      return;
    }

    generateMutation.mutate({
      type: 'caption',
      prompt: `Write a ${tone} caption for ${platform}: ${prompt.trim()}`,
      title: `Generated Caption - ${new Date().toLocaleDateString()}`,
      workspaceId: currentWorkspace?.id,
      platform,
      contentData: { tone, originalPrompt: prompt }
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCaption);
      toast({
        title: "Copied!",
        description: "Caption copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy caption to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="content-card holographic">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
            <Edit className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-orbitron font-semibold">Caption AI</h3>
            <p className="text-asteroid-silver text-sm">Generate compelling captions that drive engagement and conversions</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div>
            <Label htmlFor="caption-platform">Target Platform</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="glassmorphism">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="twitter">X (Twitter)</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="caption-tone">Caption Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger className="glassmorphism">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual & Friendly</SelectItem>
                <SelectItem value="funny">Funny & Humorous</SelectItem>
                <SelectItem value="inspirational">Inspirational</SelectItem>
                <SelectItem value="educational">Educational</SelectItem>
                <SelectItem value="promotional">Promotional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="caption-prompt">Content Description</Label>
            <Textarea
              id="caption-prompt"
              placeholder="Describe what your post is about... (e.g., 'Sharing my morning workout routine and healthy breakfast tips')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-24 glassmorphism"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-cosmic-blue border border-green-400/30">
          <div>
            <div className="font-medium text-green-400">Generation Cost</div>
            <div className="text-sm text-asteroid-silver">5 credits per caption</div>
          </div>
          <div className="text-right">
            <div className="font-medium text-asteroid-silver">Estimated Time</div>
            <div className="text-sm text-solar-gold">10-20 seconds</div>
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={generateMutation.isPending || !prompt.trim()}
          className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:opacity-90 transition-opacity"
        >
          {generateMutation.isPending ? (
            <>
              <LoadingSpinner className="w-4 h-4 mr-2" />
              Generating Caption...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Generate Caption
            </>
          )}
        </Button>

        {generatedCaption && (
          <div className="space-y-4">
            <div className="border-t border-asteroid-silver/20 pt-4">
              <div className="flex items-center justify-between mb-2">
                <Label>Generated Caption</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="glassmorphism"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
              <div className="p-4 rounded-lg bg-cosmic-blue border border-green-400/30">
                <p className="text-sm whitespace-pre-wrap">{generatedCaption}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
