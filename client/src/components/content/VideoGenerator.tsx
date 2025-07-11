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
import { Video, Zap, FileText, Play, ArrowLeft, Download, CheckCircle } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function VideoGenerator() {
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("");
  const { currentWorkspace } = useWorkspace();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [generatedScript, setGeneratedScript] = useState<any>(null);
  const [generatedVideo, setGeneratedVideo] = useState<any>(null);
  const [step, setStep] = useState('input'); // 'input', 'script', 'video'

  const scriptMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/content/generate-script', data),
    onSuccess: (response: any) => {
      setGeneratedScript(response.script);
      setStep('script');
      toast({
        title: "Script Generated!",
        description: "Your AI-generated video script is ready for review.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Script Generation Failed",
        description: error.message || "Failed to generate video script",
        variant: "destructive",
      });
    }
  });

  const videoMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/content/generate-video', data),
    onSuccess: (response: any) => {
      setGeneratedVideo(response.video);
      setStep('video');
      toast({
        title: "Video Generated Successfully!",
        description: "Your AI-powered video is ready for review.",
      });
      queryClient.invalidateQueries({ queryKey: ['content'] });
    },
    onError: (error: any) => {
      toast({
        title: "Video Generation Failed", 
        description: error.message || "Failed to generate video content",
        variant: "destructive",
      });
    }
  });

  const handleGenerateScript = () => {
    if (!prompt.trim()) {
      toast({
        title: "Description Required",
        description: "Please enter a description for your video",
        variant: "destructive",
      });
      return;
    }

    scriptMutation.mutate({
      description: prompt.trim(),
      platform: platform || 'youtube',
      title: title.trim()
    });
  };

  const handleGenerateVideo = () => {
    if (!generatedScript) {
      toast({
        title: "Script Required",
        description: "Please generate a script first",
        variant: "destructive",
      });
      return;
    }

    videoMutation.mutate({
      description: prompt.trim(),
      platform: platform || 'youtube',
      title: title.trim() || generatedScript.title,
      workspaceId: currentWorkspace?.id
    });
  };

  const handleReset = () => {
    setStep('input');
    setGeneratedScript(null);
    setGeneratedVideo(null);
    setPrompt("");
    setTitle("");
    setPlatform("");
  };

  return (
    <Card className="content-card holographic">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-stellar-gold">
          <Video className="w-5 h-5" />
          <div>
            <div>AI Video Generator</div>
            <p className="text-asteroid-silver text-sm">Create engaging videos with AI-powered scenes and effects</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Step 1: Input */}
        {step === 'input' && (
          <div className="grid gap-4">
            <div>
              <label htmlFor="video-title" className="text-white mb-2 block">Video Title (Optional)</label>
              <input
                type="text"
                id="video-title"
                placeholder="Enter video title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <Label htmlFor="platform-select">Target Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="glassmorphism bg-space-navy/50 text-white border-electric-cyan/30 focus:border-electric-cyan focus:ring-electric-cyan focus:ring-1">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent className="bg-cosmic-blue border-electric-cyan/30">
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="twitter">X (Twitter)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="video-prompt" className="text-white mb-2 block">Video Description</label>
              <textarea
                id="video-prompt"
                placeholder="Describe the video you want to create..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-24 p-3 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none"
                rows={4}
              />
            </div>

            <div className="text-center">
              <Button 
                onClick={handleGenerateScript}
                disabled={scriptMutation.isPending || !prompt.trim()}
                className="cosmic-btn w-full"
              >
                {scriptMutation.isPending ? (
                  <>
                    <LoadingSpinner className="w-4 h-4 mr-2" />
                    Generating Script...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Script
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Script Review */}
        {step === 'script' && generatedScript && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-stellar-gold flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Generated Script
              </h3>
              <Button variant="outline" onClick={handleReset} size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Edit Description
              </Button>
            </div>
            
            <div className="glassmorphism p-4 rounded-lg space-y-3">
              <h4 className="font-medium text-stellar-gold">{generatedScript.title}</h4>
              <div className="text-sm text-asteroid-silver">
                <p><strong>Platform:</strong> {generatedScript.target_platform}</p>
                <p><strong>Duration:</strong> {generatedScript.total_duration} seconds</p>
                <p><strong>Theme:</strong> {generatedScript.theme}</p>
              </div>
              
              <div className="space-y-2">
                <h5 className="font-medium text-white">Scenes:</h5>
                {generatedScript.scenes?.map((scene: any, index: number) => (
                  <div key={scene.id} className="border-l-2 border-cosmic-purple pl-3 text-sm">
                    <p className="text-stellar-gold">Scene {index + 1} ({scene.duration}s)</p>
                    <p className="text-white">{scene.description}</p>
                    <p className="text-asteroid-silver text-xs">{scene.visuals}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleGenerateVideo}
                disabled={videoMutation.isPending}
                className="cosmic-btn flex-1"
              >
                {videoMutation.isPending ? (
                  <>
                    <LoadingSpinner className="w-4 h-4 mr-2" />
                    Creating Video...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Create Video
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Video Result */}
        {step === 'video' && generatedVideo && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-stellar-gold flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Video Generated Successfully!
              </h3>
              <Button variant="outline" onClick={handleReset} size="sm">
                Create New Video
              </Button>
            </div>
            
            <div className="glassmorphism p-4 rounded-lg space-y-3">
              <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-asteroid-silver">
                  <Video className="w-16 h-16 mx-auto mb-2" />
                  <p>Video Preview</p>
                  <p className="text-sm">{generatedVideo.duration}s • {generatedVideo.format}</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button className="cosmic-btn flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download Video
                </Button>
                <Button variant="outline" className="flex-1">
                  <Play className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between p-4 rounded-lg bg-cosmic-blue border border-electric-cyan/30">
          <div>
            <div className="font-medium text-electric-cyan">Generation Cost</div>
            <div className="text-sm text-asteroid-silver">25 credits per video</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-stellar-gold">
              {step === 'input' ? '25' : step === 'script' ? '15' : '0'} Credits
            </div>
            <div className="text-xs text-asteroid-silver">remaining for video</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}