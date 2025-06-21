import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useToast } from "@/hooks/use-toast";
import { getValidFirebaseToken } from "@/lib/firebase";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { UpgradeModal } from "@/components/modals/UpgradeModal";
import { 
  Video, 
  Play, 
  Image as ImageIcon, 
  Edit, 
  FileImage, 
  Youtube, 
  Clock,
  FileText,
  Download,
  CheckCircle,
  ArrowLeft,
  Zap,
  Sparkles,
  Upload,
  Scissors,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Hash,
  Type,
  Eye,
  Share,
  Wand2,
  Film,
  Camera,
  Palette,
  TrendingUp,
  Target,
  Bot,
  Link as LinkIcon,
  RotateCcw
} from "lucide-react";

// Platform dimensions configuration
const PLATFORM_DIMENSIONS = {
  instagram: {
    reel: { width: 1080, height: 1920, ratio: "9:16" },
    post: { width: 1080, height: 1080, ratio: "1:1" },
    story: { width: 1080, height: 1920, ratio: "9:16" }
  },
  youtube: {
    short: { width: 1080, height: 1920, ratio: "9:16" },
    video: { width: 1920, height: 1080, ratio: "16:9" },
    thumbnail: { width: 1280, height: 720, ratio: "16:9" }
  },
  tiktok: {
    video: { width: 1080, height: 1920, ratio: "9:16" }
  },
  facebook: {
    post: { width: 1200, height: 630, ratio: "1.91:1" },
    story: { width: 1080, height: 1920, ratio: "9:16" }
  },
  twitter: {
    post: { width: 1200, height: 675, ratio: "16:9" }
  },
  linkedin: {
    post: { width: 1200, height: 627, ratio: "1.91:1" }
  }
};

// AI Video Generator Component
function AIVideoGenerator() {
  const [prompt, setPrompt] = useState("");
  const [platform, setPlatform] = useState("youtube");
  const [contentType, setContentType] = useState("video");
  const [style, setStyle] = useState("modern");
  const [duration, setDuration] = useState("30");
  const [script, setScript] = useState("");
  const [generatedScript, setGeneratedScript] = useState<any>(null);
  const [generatedVideo, setGeneratedVideo] = useState<any>(null);
  const [step, setStep] = useState('input');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const { currentWorkspace } = useWorkspace();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["/api/user"],
    refetchInterval: 30000
  }) as { data?: { credits?: number } };

  const scriptMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/ai/generate-script', data);
      return await response.json();
    },
    onSuccess: (response: any) => {
      console.log('[SCRIPT DEBUG] API Response:', response);
      setGeneratedScript(response);
      
      // Ensure script is properly extracted as string
      const scriptText = typeof response.script === 'string' 
        ? response.script 
        : (response.script?.text || response.script?.content || "AI-generated script content");
      
      setScript(scriptText);
      setStep('script-review');
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "AI Script Generated!",
        description: `Professional script created. Used ${response.creditsUsed || 2} credits.`,
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
    mutationFn: async (data: any) => {
      setIsGenerating(true);
      setProgress(0);
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 2000);

      try {
        const response = await apiRequest('POST', '/api/ai/generate-video', data);
        clearInterval(progressInterval);
        setProgress(100);
        return await response.json();
      } catch (error) {
        clearInterval(progressInterval);
        throw error;
      } finally {
        setIsGenerating(false);
      }
    },
    onSuccess: (response: any) => {
      setGeneratedVideo(response);
      setStep('video-preview');
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "AI Video Generated Successfully!",
        description: `High-quality video created. Used ${response.creditsUsed || 10} credits.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Video Generation Failed",
        description: error.message || "Failed to generate video",
        variant: "destructive",
      });
    }
  });

  const publishMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/content/publish', data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Video Published Successfully!",
        description: "Your AI-generated video is now live on your selected platform.",
      });
      resetGenerator();
    }
  });

  const instagramPublishMutation = useMutation({
    mutationFn: async (publishType: 'video' | 'reel' | 'story') => {
      if (!generatedVideo) return;
      const response = await apiRequest('POST', '/api/instagram/publish', {
        mediaType: publishType,
        mediaUrl: generatedVideo.videoUrl,
        caption: generatedVideo.caption || '',
        workspaceId: currentWorkspace?.id
      });
      return await response.json();
    },
    onSuccess: (response: any) => {
      toast({
        title: "Posted to Instagram!",
        description: `Your video has been published to Instagram successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
    },
    onError: (error: any) => {
      toast({
        title: "Instagram Publishing Failed",
        description: "Failed to publish to Instagram. Please check your Instagram connection.",
        variant: "destructive",
      });
    }
  });

  const generateScript = () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a description for your video",
        variant: "destructive",
      });
      return;
    }

    const dimensions = PLATFORM_DIMENSIONS[platform]?.[contentType] || PLATFORM_DIMENSIONS.youtube.video;
    
    scriptMutation.mutate({
      prompt: prompt.trim(),
      platform,
      contentType,
      style,
      duration: parseInt(duration),
      workspaceId: currentWorkspace?.id,
      dimensions
    });
  };

  const generateVideo = () => {
    if (!script || typeof script !== 'string' || !script.trim()) {
      toast({
        title: "Script Required", 
        description: "Please review and confirm the script before generating video",
        variant: "destructive",
      });
      return;
    }

    const dimensions = PLATFORM_DIMENSIONS[platform]?.[contentType] || PLATFORM_DIMENSIONS.youtube.video;

    videoMutation.mutate({
      script: script.trim(),
      platform,
      contentType,
      style,
      duration: parseInt(duration),
      workspaceId: currentWorkspace?.id,
      dimensions,
      caption: generatedScript?.caption || "",
      hashtags: generatedScript?.hashtags || []
    });
  };

  const publishVideo = () => {
    publishMutation.mutate({
      type: 'video',
      platform,
      contentType,
      videoUrl: generatedVideo.videoUrl,
      thumbnailUrl: generatedVideo.thumbnailUrl,
      caption: generatedVideo.caption,
      hashtags: generatedVideo.hashtags,
      workspaceId: currentWorkspace?.id
    });
  };

  const publishToInstagram = (publishType: 'video' | 'reel' | 'story') => {
    console.log('[AI REEL GENERATOR] Publishing to Instagram with workspace:', currentWorkspace?.id);
    
    if (!currentWorkspace?.id) {
      toast({
        title: "Workspace Error",
        description: "Please select a workspace before publishing",
        variant: "destructive",
      });
      return;
    }

    instagramPublishMutation.mutate({
      mediaType: publishType,
      mediaUrl: generatedReel.videoUrl,
      caption: generatedReel.caption,
      workspaceId: currentWorkspace.id
    });
  };

  const resetGenerator = () => {
    setPrompt("");
    setScript("");
    setGeneratedScript(null);
    setGeneratedVideo(null);
    setStep('input');
    setProgress(0);
  };

  const getDimensionsText = () => {
    const dimensions = PLATFORM_DIMENSIONS[platform]?.[contentType];
    return dimensions ? `${dimensions.width}x${dimensions.height} (${dimensions.ratio})` : "Auto";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Bot className="h-5 w-5 text-purple-500" />
        <h3 className="text-lg font-semibold">AI Video Generator</h3>
        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
          Advanced AI
        </Badge>
      </div>

      {step === 'input' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Video className="h-5 w-5" />
              <span>Create AI Video</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="platform">Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youtube">
                      <div className="flex items-center space-x-2">
                        <Youtube className="h-4 w-4" />
                        <span>YouTube</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="instagram">
                      <div className="flex items-center space-x-2">
                        <Instagram className="h-4 w-4" />
                        <span>Instagram</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="tiktok">
                      <div className="flex items-center space-x-2">
                        <Video className="h-4 w-4" />
                        <span>TikTok</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="contentType">Content Type</Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {platform === 'youtube' && (
                      <>
                        <SelectItem value="video">Long Video (16:9)</SelectItem>
                        <SelectItem value="short">YouTube Shorts (9:16)</SelectItem>
                      </>
                    )}
                    {platform === 'instagram' && (
                      <>
                        <SelectItem value="reel">Instagram Reel (9:16)</SelectItem>
                        <SelectItem value="post">Instagram Post (1:1)</SelectItem>
                        <SelectItem value="story">Instagram Story (9:16)</SelectItem>
                      </>
                    )}
                    {platform === 'tiktok' && (
                      <SelectItem value="video">TikTok Video (9:16)</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="style">Video Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern & Clean</SelectItem>
                    <SelectItem value="cinematic">Cinematic</SelectItem>
                    <SelectItem value="energetic">Energetic & Dynamic</SelectItem>
                    <SelectItem value="minimalist">Minimalist</SelectItem>
                    <SelectItem value="vibrant">Vibrant & Colorful</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="duration">Duration (seconds)</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 seconds</SelectItem>
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="60">1 minute</SelectItem>
                    <SelectItem value="120">2 minutes</SelectItem>
                    <SelectItem value="300">5 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="prompt">Video Description</Label>
              <Textarea
                id="prompt"
                placeholder="Describe your video content (e.g., 'A product demo showing the benefits of our new fitness app with testimonials')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Output Dimensions</p>
                <p className="text-xs text-gray-600">{getDimensionsText()}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Credits Required</p>
                <p className="text-xs text-gray-600">Script: 2 | Video: 10</p>
              </div>
            </div>

            <Button 
              onClick={generateScript} 
              disabled={scriptMutation.isPending || !prompt.trim()}
              className="w-full"
            >
              {scriptMutation.isPending ? (
                <>
                  <LoadingSpinner className="mr-2 h-4 w-4" />
                  Generating Script...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate AI Script
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 'script-review' && generatedScript && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Review Generated Script</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setStep('input')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="script">Script Content</Label>
              <Textarea
                id="script"
                value={script}
                onChange={(e) => setScript(e.target.value)}
                rows={8}
                className="mt-2"
              />
            </div>

            {generatedScript.caption && (
              <div>
                <Label>Generated Caption</Label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm">{generatedScript.caption}</p>
                </div>
              </div>
            )}

            {generatedScript.hashtags && generatedScript.hashtags.length > 0 && (
              <div>
                <Label>Trending Hashtags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {generatedScript.hashtags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <Button onClick={generateScript} variant="outline" className="flex-1">
                <Wand2 className="mr-2 h-4 w-4" />
                Regenerate Script
              </Button>
              <Button onClick={generateVideo} disabled={videoMutation.isPending} className="flex-1">
                {videoMutation.isPending ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4" />
                    Generating Video...
                  </>
                ) : (
                  <>
                    <Video className="mr-2 h-4 w-4" />
                    Generate AI Video
                  </>
                )}
              </Button>
            </div>

            {isGenerating && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Generating video...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
                <p className="text-xs text-gray-600 text-center">
                  This may take 2-3 minutes for high-quality results
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {step === 'video-preview' && generatedVideo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Play className="h-5 w-5" />
                <span>Video Preview</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setStep('script-review')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Script
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
              {generatedVideo.videoUrl ? (
                <video
                  src={generatedVideo.videoUrl}
                  controls
                  className="w-full h-full rounded-lg"
                  poster={generatedVideo.thumbnailUrl}
                />
              ) : (
                <div className="text-white text-center">
                  <Video className="h-12 w-12 mx-auto mb-2" />
                  <p>Video Preview</p>
                </div>
              )}
            </div>

            {generatedVideo.caption && (
              <div>
                <Label>Caption</Label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm">{generatedVideo.caption}</p>
                </div>
              </div>
            )}

            {generatedVideo.hashtags && generatedVideo.hashtags.length > 0 && (
              <div>
                <Label>Hashtags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {generatedVideo.hashtags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex space-x-3">
                <Button onClick={() => setStep('script-review')} variant="outline" className="flex-1">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Script
                </Button>
                <Button onClick={publishVideo} disabled={publishMutation.isPending} className="flex-1">
                  {publishMutation.isPending ? (
                    <>
                      <LoadingSpinner className="mr-2 h-4 w-4" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Share className="mr-2 h-4 w-4" />
                      Publish Video
                    </>
                  )}
                </Button>
              </div>
              
              {/* Instagram Publishing Options */}
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={() => publishToInstagram('video')} 
                  disabled={instagramPublishMutation.isPending}
                  variant="outline"
                  className="flex items-center justify-center"
                >
                  {instagramPublishMutation.isPending ? (
                    <LoadingSpinner className="mr-2 h-4 w-4" />
                  ) : (
                    <Instagram className="mr-2 h-4 w-4" />
                  )}
                  Post to Instagram
                </Button>
                <Button 
                  onClick={() => publishToInstagram('reel')} 
                  disabled={instagramPublishMutation.isPending}
                  variant="outline"
                  className="flex items-center justify-center"
                >
                  {instagramPublishMutation.isPending ? (
                    <LoadingSpinner className="mr-2 h-4 w-4" />
                  ) : (
                    <Video className="mr-2 h-4 w-4" />
                  )}
                  Post as Reel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// AI Reel Generator Component
function AIReelGenerator() {
  const [prompt, setPrompt] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [style, setStyle] = useState("trendy");
  const [generatedReel, setGeneratedReel] = useState<any>(null);
  const [step, setStep] = useState('input');
  
  const { currentWorkspace } = useWorkspace();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const reelMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/ai/generate-reel', data);
      return await response.json();
    },
    onSuccess: (response: any) => {
      setGeneratedReel(response);
      setStep('preview');
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "AI Reel Generated!",
        description: `Viral-ready reel created. Used ${response.creditsUsed || 8} credits.`,
      });
    }
  });

  const publishMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/instagram/publish', data);
      return await response.json();
    },
    onSuccess: (response: any) => {
      toast({
        title: "Reel Published!",
        description: `Successfully published to Instagram as ${response.mediaType}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Publishing Failed",
        description: error.message || "Failed to publish to Instagram",
        variant: "destructive",
      });
    }
  });

  const publishToInstagram = (mediaUrl: string, mediaType: string, caption?: string) => {
    publishMutation.mutate({
      mediaUrl,
      mediaType,
      caption,
      workspaceId: currentWorkspace?.id
    });
  };

  const generateReel = () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please describe your reel content",
        variant: "destructive",
      });
      return;
    }

    const dimensions = PLATFORM_DIMENSIONS[platform]?.reel || PLATFORM_DIMENSIONS.instagram.reel;

    reelMutation.mutate({
      prompt: prompt.trim(),
      platform,
      style,
      workspaceId: currentWorkspace?.id,
      dimensions
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Film className="h-5 w-5 text-pink-500" />
        <h3 className="text-lg font-semibold">AI Reel Generator</h3>
        <Badge variant="secondary" className="bg-pink-100 text-pink-700">
          Viral Content
        </Badge>
      </div>

      {step === 'input' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Film className="h-5 w-5" />
              <span>Create Viral Reel</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="platform">Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram Reels</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="youtube">YouTube Shorts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="style">Reel Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trendy">Trendy & Viral</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="entertaining">Entertaining</SelectItem>
                    <SelectItem value="inspirational">Inspirational</SelectItem>
                    <SelectItem value="behind-scenes">Behind the Scenes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="prompt">Reel Concept</Label>
              <Textarea
                id="prompt"
                placeholder="Describe your reel idea (e.g., 'Quick cooking tips for busy professionals')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
              />
            </div>

            <Button 
              onClick={generateReel} 
              disabled={reelMutation.isPending || !prompt.trim()}
              className="w-full"
            >
              {reelMutation.isPending ? (
                <>
                  <LoadingSpinner className="mr-2 h-4 w-4" />
                  Generating Reel...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Generate AI Reel
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 'preview' && generatedReel && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Play className="h-5 w-5" />
                <span>Reel Preview</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setStep('input')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-[9/16] bg-black rounded-lg flex items-center justify-center max-w-sm mx-auto">
              {generatedReel.videoUrl ? (
                <video
                  src={generatedReel.videoUrl}
                  controls
                  className="w-full h-full rounded-lg"
                />
              ) : (
                <div className="text-white text-center">
                  <Film className="h-12 w-12 mx-auto mb-2" />
                  <p>Reel Preview</p>
                </div>
              )}
            </div>

            {generatedReel.caption && (
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Generated Caption</Label>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                  <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">{generatedReel.caption}</p>
                </div>
              </div>
            )}

            {generatedReel.hashtags && generatedReel.hashtags.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Trending Hashtags</Label>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                  <div className="flex flex-wrap gap-2">
                    {generatedReel.hashtags.map((tag: string, index: number) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="bg-purple-100 text-purple-800 hover:bg-purple-200 text-xs px-2 py-1"
                      >
                        #{tag.replace(/^#+/, '')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  toast({
                    title: "Coming Soon",
                    description: "Direct publishing will be available soon",
                  });
                }}
              >
                <Share className="mr-2 h-4 w-4" />
                Share to Platform
              </Button>
              
              {platform === 'instagram' && generatedReel.videoUrl && (
                <Button 
                  className="flex-1"
                  onClick={() => publishToInstagram(generatedReel.videoUrl, 'reel', generatedReel.caption)}
                  disabled={publishMutation.isPending}
                >
                  {publishMutation.isPending ? (
                    <>
                      <LoadingSpinner className="mr-2 h-4 w-4" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Instagram className="mr-2 h-4 w-4" />
                      Publish to Instagram
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// AI Image Generator Component
function AIImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [contentType, setContentType] = useState("post");
  const [style, setStyle] = useState("photorealistic");
  const [generatedImage, setGeneratedImage] = useState<any>(null);
  const [step, setStep] = useState('input');
  
  const { currentWorkspace } = useWorkspace();
  const { toast } = useToast();

  const imageMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/ai/generate-image', data);
      return await response.json();
    },
    onSuccess: (response: any) => {
      setGeneratedImage(response);
      setStep('preview');
      toast({
        title: "AI Image Generated!",
        description: `High-quality image created. Used ${response.creditsUsed || 3} credits.`,
      });
    }
  });

  const publishMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/instagram/publish', data);
      return await response.json();
    },
    onSuccess: (response: any) => {
      toast({
        title: "Image Published!",
        description: `Successfully published to Instagram as ${response.mediaType}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Publishing Failed",
        description: error.message || "Failed to publish to Instagram",
        variant: "destructive",
      });
    }
  });

  const publishToInstagram = (mediaUrl: string, mediaType: string, caption?: string) => {
    publishMutation.mutate({
      mediaUrl,
      mediaType,
      caption,
      workspaceId: currentWorkspace?.id
    });
  };

  const generateImage = () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please describe your image",
        variant: "destructive",
      });
      return;
    }

    const dimensions = PLATFORM_DIMENSIONS[platform]?.[contentType] || PLATFORM_DIMENSIONS.instagram.post;

    imageMutation.mutate({
      prompt: prompt.trim(),
      platform,
      contentType,
      style,
      workspaceId: currentWorkspace?.id,
      dimensions
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <ImageIcon className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold">AI Image Generator</h3>
        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
          Creative AI
        </Badge>
      </div>

      {step === 'input' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ImageIcon className="h-5 w-5" />
              <span>Create AI Image</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="platform">Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="contentType">Image Type</Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {platform === 'instagram' && (
                      <>
                        <SelectItem value="post">Post (1:1)</SelectItem>
                        <SelectItem value="story">Story (9:16)</SelectItem>
                      </>
                    )}
                    {platform === 'facebook' && (
                      <>
                        <SelectItem value="post">Post (1.91:1)</SelectItem>
                        <SelectItem value="story">Story (9:16)</SelectItem>
                      </>
                    )}
                    {platform === 'twitter' && (
                      <SelectItem value="post">Tweet Image (16:9)</SelectItem>
                    )}
                    {platform === 'linkedin' && (
                      <SelectItem value="post">LinkedIn Post (1.91:1)</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="style">Image Style</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="photorealistic">Photorealistic</SelectItem>
                  <SelectItem value="illustration">Digital Illustration</SelectItem>
                  <SelectItem value="minimalist">Minimalist</SelectItem>
                  <SelectItem value="vintage">Vintage</SelectItem>
                  <SelectItem value="modern">Modern & Clean</SelectItem>
                  <SelectItem value="artistic">Artistic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="prompt">Image Description</Label>
              <Textarea
                id="prompt"
                placeholder="Describe your image (e.g., 'A professional workspace with laptop, coffee, and plants in natural lighting')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
              />
            </div>

            <Button 
              onClick={generateImage} 
              disabled={imageMutation.isPending || !prompt.trim()}
              className="w-full"
            >
              {imageMutation.isPending ? (
                <>
                  <LoadingSpinner className="mr-2 h-4 w-4" />
                  Generating Image...
                </>
              ) : (
                <>
                  <Palette className="mr-2 h-4 w-4" />
                  Generate AI Image
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 'preview' && generatedImage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Image Preview</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setStep('input')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-100 rounded-lg p-4">
              {generatedImage.imageUrl ? (
                <img
                  src={generatedImage.imageUrl}
                  alt="Generated content"
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>

            {generatedImage.caption && (
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Generated Caption</Label>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                  <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">{generatedImage.caption}</p>
                </div>
              </div>
            )}

            {generatedImage.hashtags && generatedImage.hashtags.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Relevant Hashtags</Label>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                  <div className="flex flex-wrap gap-2">
                    {generatedImage.hashtags.map((tag: string, index: number) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-xs px-2 py-1"
                      >
                        #{tag.replace(/^#+/, '')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              
              {platform === 'instagram' && generatedImage.imageUrl && (
                <Button 
                  className="flex-1"
                  onClick={() => publishToInstagram(generatedImage.imageUrl, 'image', generatedImage.caption)}
                  disabled={publishMutation.isPending}
                >
                  {publishMutation.isPending ? (
                    <>
                      <LoadingSpinner className="mr-2 h-4 w-4" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Instagram className="mr-2 h-4 w-4" />
                      Publish to Instagram
                    </>
                  )}
                </Button>
              )}
              
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  toast({
                    title: "Coming Soon",
                    description: "Direct publishing will be available soon",
                  });
                }}
              >
                <Share className="mr-2 h-4 w-4" />
                Share to Platform
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// AI Video Shortener with URL Analysis Component
function VideoShortener() {
  const [inputType, setInputType] = useState<'url' | 'upload'>('url');
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [platform, setPlatform] = useState("youtube");
  const [duration, setDuration] = useState("30");
  const [style, setStyle] = useState("viral");
  const [shortenedVideo, setShortenedVideo] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [step, setStep] = useState('input');
  const [userPreferences, setUserPreferences] = useState({
    focusOnAction: true,
    includeDialogue: true,
    preferBeginning: false,
    preferEnding: false,
    avoidSilence: true
  });
  
  const { currentWorkspace } = useWorkspace();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: user } = useQuery({
    queryKey: ["/api/user"],
    refetchInterval: 30000
  }) as { data?: { credits?: number } };

  const analyzeMutation = useMutation({
    mutationFn: async (data: any) => {
      if (data.videoFile) {
        // Handle file upload with FormData
        const formData = new FormData();
        formData.append('videoFile', data.videoFile);
        formData.append('workspaceId', data.workspaceId);
        
        const response = await fetch('/api/ai/analyze-video', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
          body: formData
        });
        return await response.json();
      } else {
        // Handle URL with JSON
        const response = await apiRequest('POST', '/api/ai/analyze-video', data);
        return await response.json();
      }
    },
    onSuccess: (response: any) => {
      console.log('[VIDEO SHORTENER] Analysis response:', response);
      console.log('[VIDEO SHORTENER] Analysis data:', response.analysis);
      
      if (response.success && response.analysis) {
        // Force a state update by setting analysis first, then step
        setTimeout(() => {
          setAnalysis(response.analysis);
          setTimeout(() => {
            setStep('analyze');
            console.log('[VIDEO SHORTENER] State updated - step: analyze, analysis set');
          }, 100);
        }, 50);
        
        toast({
          title: "Video Analysis Complete!",
          description: `AI analyzed the video content. Used ${response.creditsUsed || 2} credits.`,
        });
      } else {
        console.error('[VIDEO SHORTENER] Invalid response or no analysis data:', response);
        toast({
          title: "Analysis Failed",
          description: response.error || "Video analysis could not be completed",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      console.error('[VIDEO SHORTENER] Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze video",
        variant: "destructive",
      });
    }
  });

  const shortenMutation = useMutation({
    mutationFn: async (data: any) => {
      if (data.videoFile) {
        // Handle file upload with FormData using proper authentication
        const formData = new FormData();
        formData.append('videoFile', data.videoFile);
        formData.append('targetDuration', data.targetDuration.toString());
        formData.append('platform', data.platform);
        formData.append('style', data.style);
        formData.append('userPreferences', JSON.stringify(data.userPreferences));
        formData.append('workspaceId', data.workspaceId);
        
        // Get valid Firebase JWT token using utility function
        const token = await getValidFirebaseToken();
        
        if (!token) {
          throw new Error('Authentication failed. Please log in again.');
        }
        
        const response = await fetch('/api/ai/shorten-video', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to process video');
        }
        
        return await response.json();
      } else {
        // Handle URL with JSON
        const response = await apiRequest('POST', '/api/ai/shorten-video', data);
        return await response.json();
      }
    },
    onSuccess: (response: any) => {
      setShortenedVideo(response);
      setStep('preview');
      toast({
        title: "Video Shortened Successfully!",
        description: `AI extracted the best moments. Used ${response.creditsUsed} credits.`,
      });
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'Failed to process video';
      
      if (errorMessage.includes('YouTube access restricted') || errorMessage.includes('403: Forbidden')) {
        toast({
          title: "YouTube Access Restricted",
          description: "This video is restricted by YouTube. Please try uploading the video file directly.",
          variant: "destructive",
        });
        // Switch to upload mode automatically
        setInputType('upload');
      } else if (errorMessage.includes('Private video') || errorMessage.includes('members-only')) {
        toast({
          title: "Video Not Accessible",
          description: "This video is private or restricted. Please use a public video or upload directly.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Processing Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  });

  const publishMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/instagram/publish', data);
      return await response.json();
    },
    onSuccess: (response: any) => {
      toast({
        title: "Video Published!",
        description: `Successfully published to Instagram as ${response.mediaType}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Publishing Failed",
        description: error.message || "Failed to publish to Instagram",
        variant: "destructive",
      });
    }
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
        toast({
          title: "Video Uploaded",
          description: `Selected: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`,
        });
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a video file",
          variant: "destructive",
        });
      }
    }
  };

  const analyzeVideo = () => {
    if (inputType === 'url' && !videoUrl.trim()) {
      toast({
        title: "Video URL Required",
        description: "Please enter a valid video URL",
        variant: "destructive",
      });
      return;
    }

    if (inputType === 'upload' && !videoFile) {
      toast({
        title: "Video File Required",
        description: "Please upload a video file",
        variant: "destructive",
      });
      return;
    }

    const data = inputType === 'url' 
      ? { videoUrl: videoUrl.trim(), workspaceId: currentWorkspace?.id }
      : { videoFile, workspaceId: currentWorkspace?.id };

    analyzeMutation.mutate(data);
  };

  const shortenVideo = () => {
    if (inputType === 'url' && !videoUrl.trim()) {
      toast({
        title: "Video URL Required",
        description: "Please enter a valid video URL",
        variant: "destructive",
      });
      return;
    }

    if (inputType === 'upload' && !videoFile) {
      toast({
        title: "Video File Required",
        description: "Please upload a video file",
        variant: "destructive",
      });
      return;
    }

    const data = inputType === 'url' 
      ? {
          videoUrl: videoUrl.trim(),
          targetDuration: parseInt(duration),
          platform,
          style,
          userPreferences,
          workspaceId: currentWorkspace?.id
        }
      : {
          videoFile,
          targetDuration: parseInt(duration),
          platform,
          style,
          userPreferences,
          workspaceId: currentWorkspace?.id
        };

    shortenMutation.mutate(data);
  };

  const publishToInstagram = (mediaUrl: string, mediaType: string) => {
    console.log('[AI VIDEO GENERATOR] Publishing to Instagram with workspace:', currentWorkspace?.id);
    
    if (!currentWorkspace?.id) {
      toast({
        title: "Workspace Error", 
        description: "Please select a workspace before publishing",
        variant: "destructive",
      });
      return;
    }

    publishMutation.mutate({
      mediaUrl,
      mediaType,
      workspaceId: currentWorkspace.id
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Scissors className="h-5 w-5 text-red-500" />
        <h3 className="text-lg font-semibold">AI Video Shortener</h3>
        <Badge variant="secondary" className="bg-red-100 text-red-700">
          URL Analysis
        </Badge>
      </div>
      
      {/* Debug Info */}
      <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
        Step: {step} | Analysis: {analysis ? 'Present' : 'None'} | Analysis Keys: {analysis ? Object.keys(analysis).join(', ') : 'N/A'}
      </div>

      {step === 'input' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Youtube className="h-5 w-5" />
              <span>Video URL Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Input Type Selection */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Video Input Method</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={inputType === 'url' ? 'default' : 'outline'}
                  onClick={() => setInputType('url')}
                  className="flex-1"
                >
                  <LinkIcon className="w-4 h-4 mr-2" />
                  URL Input
                </Button>
                <Button
                  type="button"
                  variant={inputType === 'upload' ? 'default' : 'outline'}
                  onClick={() => setInputType('upload')}
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  File Upload
                </Button>
              </div>
            </div>

            {/* Conditional Input Fields */}
            {inputType === 'url' ? (
              <div>
                <Label htmlFor="videoUrl">Video URL</Label>
                <Input
                  id="videoUrl"
                  placeholder="Paste YouTube, Vimeo, or other video URL..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
                <div className="mt-1 space-y-1">
                  <p className="text-xs text-gray-500">
                    Supports YouTube, Vimeo, and most video platforms
                  </p>
                  <div className="flex items-center gap-1 text-xs text-amber-600">
                    <span>⚠️</span>
                    <span>Some YouTube videos may be restricted. Use file upload if URL fails.</span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <Label htmlFor="videoFile" className="text-sm font-medium mb-2 block">
                  Upload Video File
                </Label>
                <div 
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {videoFile ? (
                      <span className="text-foreground font-medium">
                        {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                      </span>
                    ) : (
                      "Click to upload or drag and drop your video file"
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports MP4, MOV, AVI, MKV and other video formats
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="platform">Target Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youtube">YouTube Shorts</SelectItem>
                    <SelectItem value="instagram">Instagram Reels</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="duration">Duration (seconds)</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 seconds</SelectItem>
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="60">60 seconds</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="style">Content Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viral">Viral Potential</SelectItem>
                    <SelectItem value="highlights">Best Highlights</SelectItem>
                    <SelectItem value="tutorial">Tutorial Focus</SelectItem>
                    <SelectItem value="story">Story Mode</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>User Preferences</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={userPreferences.focusOnAction}
                    onChange={(e) => setUserPreferences(prev => ({
                      ...prev,
                      focusOnAction: e.target.checked
                    }))}
                    className="rounded"
                  />
                  <span className="text-sm">Focus on Action</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={userPreferences.includeDialogue}
                    onChange={(e) => setUserPreferences(prev => ({
                      ...prev,
                      includeDialogue: e.target.checked
                    }))}
                    className="rounded"
                  />
                  <span className="text-sm">Include Dialogue</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={userPreferences.preferBeginning}
                    onChange={(e) => setUserPreferences(prev => ({
                      ...prev,
                      preferBeginning: e.target.checked
                    }))}
                    className="rounded"
                  />
                  <span className="text-sm">Prefer Beginning</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={userPreferences.avoidSilence}
                    onChange={(e) => setUserPreferences(prev => ({
                      ...prev,
                      avoidSilence: e.target.checked
                    }))}
                    className="rounded"
                  />
                  <span className="text-sm">Avoid Silence</span>
                </label>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={analyzeVideo} 
                disabled={analyzeMutation.isPending || (inputType === 'url' ? !videoUrl.trim() : !videoFile)}
                variant="outline"
                className="flex-1"
              >
                {analyzeMutation.isPending ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Bot className="mr-2 h-4 w-4" />
                    Analyze Video (2 credits)
                  </>
                )}
              </Button>

              <Button 
                onClick={shortenVideo} 
                disabled={shortenMutation.isPending || (inputType === 'url' ? !videoUrl.trim() : !videoFile)}
                className="flex-1"
              >
                {shortenMutation.isPending ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4" />
                    Creating Short...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Create Short (5 credits)
                  </>
                )}
              </Button>
            </div>

            {user?.credits !== undefined && (
              <p className="text-xs text-gray-500 text-center">
                Available credits: {user.credits}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {step === 'analyze' && analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5" />
                <span>Video Analysis Results</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setStep('input')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Video Title</Label>
                <p className="text-sm font-medium">{analysis.title}</p>
              </div>
              <div>
                <Label>Duration</Label>
                <p className="text-sm">{Math.floor(analysis.totalDuration / 60)}:{(analysis.totalDuration % 60).toString().padStart(2, '0')}</p>
              </div>
              <div>
                <Label>Mood</Label>
                <Badge variant="secondary">{analysis.mood}</Badge>
              </div>
              <div>
                <Label>Pacing</Label>
                <Badge variant="outline">{analysis.pacing}</Badge>
              </div>
            </div>

            {analysis.themes && (
              <div>
                <Label>Key Themes</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {analysis.themes.map((theme: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {analysis.bestSegments && (
              <div>
                <Label>Best Segments for Shorts</Label>
                <div className="space-y-2 mt-2">
                  {analysis.bestSegments.slice(0, 3).map((segment: any, index: number) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium">
                          {Math.floor(segment.startTime / 60)}:{(segment.startTime % 60).toString().padStart(2, '0')} - 
                          {Math.floor(segment.endTime / 60)}:{(segment.endTime % 60).toString().padStart(2, '0')}
                        </span>
                        <Badge variant="outline">Score: {segment.score}/10</Badge>
                      </div>
                      <p className="text-xs text-gray-600">{segment.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button 
              onClick={shortenVideo} 
              disabled={shortenMutation.isPending}
              className="w-full"
            >
              {shortenMutation.isPending ? (
                <>
                  <LoadingSpinner className="mr-2 h-4 w-4" />
                  Creating Short...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Create Short Video (5 credits)
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 'preview' && shortenedVideo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Short Video Created</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setStep('input')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {shortenedVideo.analysis && (
              <div className="p-3 bg-blue-50 rounded-lg mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800">Selected Segment</span>
                  <Badge variant="outline">
                    Viral Score: {shortenedVideo.selectedSegment?.viralPotential || 'N/A'}/10
                  </Badge>
                </div>
                <p className="text-xs text-blue-600">
                  {shortenedVideo.analysis.selectedSegment?.content || 'AI-optimized segment selected'}
                </p>
                {shortenedVideo.selectedSegment && (
                  <p className="text-xs text-blue-500 mt-1">
                    Duration: {shortenedVideo.selectedSegment.startTime}s - {shortenedVideo.selectedSegment.endTime}s
                  </p>
                )}
              </div>
            )}

            <div className="aspect-[9/16] bg-black rounded-lg flex items-center justify-center max-w-sm mx-auto">
              {(shortenedVideo.downloadUrl || shortenedVideo.shortenedVideoUrl) ? (
                <video
                  src={shortenedVideo.downloadUrl || shortenedVideo.shortenedVideoUrl}
                  controls
                  className="w-full h-full rounded-lg"
                />
              ) : (
                <div className="text-white text-center">
                  <Video className="h-12 w-12 mx-auto mb-2" />
                  <p>AI Short Video</p>
                  <p className="text-xs opacity-75">Ready for {platform}</p>
                </div>
              )}
            </div>

            {shortenedVideo.script && (
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Optimized Script</Label>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                  <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">{shortenedVideo.script}</p>
                </div>
              </div>
            )}

            {shortenedVideo.editingInstructions && (
              <div>
                <Label>AI Editing Guidelines</Label>
                <div className="space-y-1">
                  {shortenedVideo.editingInstructions.slice(0, 3).map((instruction: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-xs text-gray-600">{instruction}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {shortenedVideo.platformOptimizations && shortenedVideo.platformOptimizations.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Platform Optimizations</Label>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                  <div className="flex flex-wrap gap-2">
                    {shortenedVideo.platformOptimizations.slice(0, 4).map((opt: string, index: number) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="bg-green-100 text-green-800 hover:bg-green-200 text-xs px-2 py-1"
                      >
                        {opt}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              
              {platform === 'instagram' && (shortenedVideo.downloadUrl || shortenedVideo.shortenedVideoUrl) && (
                <Button 
                  className="flex-1"
                  onClick={() => publishToInstagram(shortenedVideo.downloadUrl || shortenedVideo.shortenedVideoUrl, 'reel')}
                  disabled={publishMutation.isPending}
                >
                  {publishMutation.isPending ? (
                    <>
                      <LoadingSpinner className="mr-2 h-4 w-4" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Instagram className="mr-2 h-4 w-4" />
                      Publish Reel
                    </>
                  )}
                </Button>
              )}
              
              <Button 
                variant="outline" 
                onClick={() => setStep('input')}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Create Another
              </Button>
            </div>

            {shortenedVideo.expectedViews && (
              <div className="text-center pt-2">
                <p className="text-xs text-gray-500">
                  Expected engagement: ~{shortenedVideo.expectedViews} views
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Main Content Studio Component
export default function ContentStudio() {
  const [activeTab, setActiveTab] = useState("video-generator");
  const { currentWorkspace } = useWorkspace();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            AI Content Studio
          </h1>
          <p className="text-muted-foreground">
            Create professional content with advanced AI technology
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="video-generator" className="flex items-center space-x-2">
              <Video className="h-4 w-4" />
              <span className="hidden sm:inline">AI Video</span>
            </TabsTrigger>
            <TabsTrigger value="reel-generator" className="flex items-center space-x-2">
              <Film className="h-4 w-4" />
              <span className="hidden sm:inline">AI Reels</span>
            </TabsTrigger>
            <TabsTrigger value="image-generator" className="flex items-center space-x-2">
              <ImageIcon className="h-4 w-4" />
              <span className="hidden sm:inline">AI Images</span>
            </TabsTrigger>
            <TabsTrigger value="video-shortener" className="flex items-center space-x-2">
              <Scissors className="h-4 w-4" />
              <span className="hidden sm:inline">Video Shortener</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="video-generator">
            <AIVideoGenerator />
          </TabsContent>

          <TabsContent value="reel-generator">
            <AIReelGenerator />
          </TabsContent>

          <TabsContent value="image-generator">
            <AIImageGenerator />
          </TabsContent>

          <TabsContent value="video-shortener">
            <VideoShortener />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}