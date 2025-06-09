import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
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
  Sparkles
} from "lucide-react";

// AI Video Generator Component
function VideoGenerator() {
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("youtube");
  const [generatedScript, setGeneratedScript] = useState<any>(null);
  const [generatedVideo, setGeneratedVideo] = useState<any>(null);
  const [step, setStep] = useState('input');
  const [upgradeModal, setUpgradeModal] = useState({
    isOpen: false,
    featureType: "",
    creditsRequired: 0,
    currentCredits: 0
  });
  
  const { currentWorkspace } = useWorkspace();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user data for credits
  const { data: user } = useQuery({
    queryKey: ["/api/user"],
    refetchInterval: 30000
  }) as { data?: { credits?: number } };

  const scriptMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/content/generate-script', data);
      return await response.json();
    },
    onSuccess: (response: any) => {
      console.log('[SCRIPT] Response received:', response);
      setGeneratedScript(response.script);
      setStep('script');
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Script Generated!",
        description: `Used ${response.creditsUsed || 2} credits. ${response.remainingCredits || 'Unknown'} credits remaining.`,
      });
    },
    onError: (error: any) => {
      console.error('[SCRIPT] Error:', error);
      if (error.status === 402 && error.upgradeModal) {
        setUpgradeModal({
          isOpen: true,
          featureType: "reels-script",
          creditsRequired: 2,
          currentCredits: user?.credits || 0
        });
      } else {
        toast({
          title: "Script Generation Failed",
          description: error.message || "Failed to generate video script",
          variant: "destructive",
        });
      }
    }
  });

  const videoMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/content/generate-video', data);
      return await response.json();
    },
    onSuccess: (response: any) => {
      console.log('[VIDEO] Response received:', response);
      setGeneratedVideo(response.video);
      setStep('video');
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Video Generated Successfully!",
        description: `Used ${response.creditsUsed || 8} credits. ${response.remainingCredits || 'Unknown'} credits remaining.`,
      });
      queryClient.invalidateQueries({ queryKey: ['content'] });
    },
    onError: (error: any) => {
      console.error('[VIDEO] Error:', error);
      if (error.status === 402 && error.upgradeModal) {
        setUpgradeModal({
          isOpen: true,
          featureType: "AI Video Generation",
          creditsRequired: 8,
          currentCredits: user?.credits || 0
        });
      } else {
        toast({
          title: "Video Generation Failed", 
          description: error.message || "Failed to generate video content",
          variant: "destructive",
        });
      }
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

    // Check credits before generating (2 credits for caption generation)
    if (!user?.credits || user.credits < 2) {
      setUpgradeModal({
        isOpen: true,
        featureType: "AI Caption Generation",
        creditsRequired: 2,
        currentCredits: user?.credits || 0
      });
      return;
    }

    scriptMutation.mutate({
      description: prompt.trim(),
      platform: platform,
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

    // Check credits before generating (15 credits for video generation)
    if (!user?.credits || user.credits < 15) {
      setUpgradeModal({
        isOpen: true,
        featureType: "AI Video Generation",
        creditsRequired: 15,
        currentCredits: user?.credits || 0
      });
      return;
    }

    videoMutation.mutate({
      description: prompt.trim(),
      platform: platform,
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
    setPlatform("youtube");
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
          <div className="space-y-4">
            <div>
              <label htmlFor="video-title" className="text-white mb-2 block text-sm font-medium">
                Video Title (Optional)
              </label>
              <input
                type="text"
                id="video-title"
                placeholder="Enter video title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                style={{ pointerEvents: 'auto', userSelect: 'text' }}
              />
            </div>

            <div>
              <label htmlFor="platform-select" className="text-white mb-2 block text-sm font-medium">
                Target Platform
              </label>
              <select
                id="platform-select"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-600 bg-gray-800 text-white focus:border-blue-500 focus:outline-none"
                style={{ pointerEvents: 'auto' }}
              >
                <option value="youtube">YouTube</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="twitter">X (Twitter)</option>
              </select>
            </div>

            <div>
              <label htmlFor="video-prompt" className="text-white mb-2 block text-sm font-medium">
                Video Description
              </label>
              <textarea
                id="video-prompt"
                placeholder="Describe the video you want to create..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-24 p-3 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none"
                rows={4}
                style={{ pointerEvents: 'auto', userSelect: 'text' }}
              />
            </div>

            <div className="text-center">
              <Button 
                onClick={handleGenerateScript}
                disabled={scriptMutation.isPending || !prompt.trim()}
                className="cosmic-btn w-full bg-blue-600 hover:bg-blue-700 text-white"
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
            
            <div className="bg-gray-800 p-4 rounded-lg space-y-3 border border-gray-600">
              <h4 className="font-medium text-stellar-gold">{generatedScript.title}</h4>
              <div className="text-sm text-asteroid-silver">
                <p><strong>Platform:</strong> {generatedScript.target_platform}</p>
                <p><strong>Duration:</strong> {generatedScript.total_duration} seconds</p>
                <p><strong>Theme:</strong> {generatedScript.theme}</p>
              </div>
              
              <div className="space-y-2">
                <h5 className="font-medium text-white">Scenes:</h5>
                {generatedScript.scenes?.map((scene: any, index: number) => (
                  <div key={scene.id} className="border-l-2 border-blue-500 pl-3 text-sm">
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
                className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
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
            
            <div className="bg-gray-800 p-4 rounded-lg space-y-3 border border-gray-600">
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                <div className="text-center text-asteroid-silver">
                  <Video className="w-16 h-16 mx-auto mb-2" />
                  <p>Video Preview</p>
                  <p className="text-sm">{generatedVideo.duration}s • {generatedVideo.format}</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
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

        <div className="flex items-center justify-between p-4 rounded-lg bg-blue-900 border border-blue-600">
          <div>
            <div className="font-medium text-blue-300">Generation Cost</div>
            <div className="text-sm text-gray-400">15 credits per video</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-yellow-400">
              15 Credits
            </div>
            <div className="text-xs text-gray-400">required for video</div>
          </div>
        </div>

        {/* Upgrade Modal */}
        <UpgradeModal
          isOpen={upgradeModal.isOpen}
          onClose={() => setUpgradeModal(prev => ({ ...prev, isOpen: false }))}
          featureType={upgradeModal.featureType}
          creditsRequired={upgradeModal.creditsRequired}
          currentCredits={upgradeModal.currentCredits}
        />
      </CardContent>
    </Card>
  );
}

// Post Creator Component
function PostCreator() {
  const [postText, setPostText] = useState("");
  const [postPlatform, setPostPlatform] = useState("instagram");
  const [imagePrompt, setImagePrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [upgradeModal, setUpgradeModal] = useState({
    isOpen: false,
    featureType: "",
    creditsRequired: 0,
    currentCredits: 0
  });
  
  const { currentWorkspace } = useWorkspace();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user data for credits
  const { data: user } = useQuery({
    queryKey: ["/api/user"],
    refetchInterval: 30000
  }) as { data?: { credits?: number } };

  const createPostMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/content', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Post Created!",
        description: "Your social media post has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['content'] });
      setPostText("");
      setImagePrompt("");
      setGeneratedImage(null);
    },
    onError: (error: any) => {
      toast({
        title: "Post Creation Failed",
        description: error.message || "Failed to create post",
        variant: "destructive",
      });
    }
  });

  const generateImageMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const response = await apiRequest('POST', '/api/generate-image', { prompt });
      return await response.json();
    },
    onSuccess: (response: any) => {
      setGeneratedImage(response.imageUrl);
      setIsGeneratingImage(false);
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Image Generated!",
        description: `Used ${response.creditsUsed || 4} credits. ${response.remainingCredits || 'Unknown'} credits remaining.`,
      });
    },
    onError: (error: any) => {
      setIsGeneratingImage(false);
      if (error.status === 402 && error.upgradeModal) {
        setUpgradeModal({
          isOpen: true,
          featureType: "AI Image Generation",
          creditsRequired: 4,
          currentCredits: user?.credits || 0
        });
      } else {
        toast({
          title: "Image Generation Failed",
          description: error.message || "Failed to generate image",
          variant: "destructive",
        });
      }
    }
  });

  const handleGenerateImage = () => {
    if (!imagePrompt.trim()) {
      toast({
        title: "Missing Prompt",
        description: "Please enter an image description",
        variant: "destructive",
      });
      return;
    }

    // Check credits before generating (8 credits for image generation)
    if (!user?.credits || user.credits < 8) {
      setUpgradeModal({
        isOpen: true,
        featureType: "AI Image Generation",
        creditsRequired: 8,
        currentCredits: user?.credits || 0
      });
      return;
    }

    setIsGeneratingImage(true);
    generateImageMutation.mutate(imagePrompt);
  };

  const handleCreatePost = () => {
    if (!postText.trim()) {
      toast({
        title: "Post Text Required",
        description: "Please enter text for your post",
        variant: "destructive",
      });
      return;
    }

    createPostMutation.mutate({
      workspaceId: currentWorkspace?.id,
      type: 'post',
      title: `${postPlatform} Post`,
      description: postText,
      platform: postPlatform,
      contentData: {
        text: postText,
        imageUrl: generatedImage,
        imagePrompt: imagePrompt
      }
    });
  };

  return (
    <Card className="content-card holographic">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-stellar-gold">
          <ImageIcon className="w-5 h-5" />
          <div>
            <div>Post Creator</div>
            <p className="text-asteroid-silver text-sm">Create engaging social media posts</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="post-platform" className="text-white mb-2 block text-sm font-medium">
            Platform
          </label>
          <select
            id="post-platform"
            value={postPlatform}
            onChange={(e) => setPostPlatform(e.target.value)}
            className="w-full p-3 rounded-md border border-gray-600 bg-gray-800 text-white focus:border-blue-500 focus:outline-none"
            style={{ pointerEvents: 'auto' }}
          >
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="twitter">X (Twitter)</option>
            <option value="linkedin">LinkedIn</option>
          </select>
        </div>

        <div>
          <label htmlFor="post-text" className="text-white mb-2 block text-sm font-medium">
            Post Text
          </label>
          <textarea
            id="post-text"
            placeholder="What's on your mind?"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            className="w-full h-32 p-3 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none"
            rows={6}
            style={{ pointerEvents: 'auto', userSelect: 'text' }}
          />
        </div>

        <div>
          <label htmlFor="image-prompt" className="text-white mb-2 block text-sm font-medium">
            AI Image Generation (Optional)
          </label>
          <div className="space-y-3">
            <input
              id="image-prompt"
              type="text"
              placeholder="Describe the image you want to generate..."
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              style={{ pointerEvents: 'auto', userSelect: 'text' }}
            />
            <Button 
              onClick={handleGenerateImage}
              disabled={generateImageMutation.isPending || !imagePrompt.trim()}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {generateImageMutation.isPending ? (
                <>
                  <LoadingSpinner className="w-4 h-4 mr-2" />
                  Generating Image...
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Generate Image with AI
                </>
              )}
            </Button>
          </div>
          
          {generatedImage && (
            <div className="mt-3 p-3 border border-gray-600 rounded-md bg-gray-800">
              <img 
                src={generatedImage} 
                alt="AI Generated content" 
                className="w-full h-48 object-cover rounded-md"
              />
              <p className="text-sm text-gray-400 mt-2">AI-generated image ready for your post</p>
            </div>
          )}
        </div>

        <Button 
          onClick={handleCreatePost}
          disabled={createPostMutation.isPending || !postText.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {createPostMutation.isPending ? (
            <>
              <LoadingSpinner className="w-4 h-4 mr-2" />
              Creating Post...
            </>
          ) : (
            <>
              <ImageIcon className="w-4 h-4 mr-2" />
              Create Post
            </>
          )}
        </Button>

        {/* Upgrade Modal */}
        <UpgradeModal
          isOpen={upgradeModal.isOpen}
          onClose={() => setUpgradeModal(prev => ({ ...prev, isOpen: false }))}
          featureType={upgradeModal.featureType}
          creditsRequired={upgradeModal.creditsRequired}
          currentCredits={upgradeModal.currentCredits}
        />
      </CardContent>
    </Card>
  );
}

// Caption AI Component
function CaptionAI() {
  const [captionPrompt, setCaptionPrompt] = useState("");
  const [captionStyle, setCaptionStyle] = useState("engaging");
  const [generatedCaption, setGeneratedCaption] = useState("");
  const [upgradeModal, setUpgradeModal] = useState({
    isOpen: false,
    featureType: "",
    creditsRequired: 0,
    currentCredits: 0
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user data for credits
  const { data: user } = useQuery({
    queryKey: ["/api/user"],
    refetchInterval: 30000
  }) as { data?: { credits?: number } };

  const captionMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/generate-caption', data);
      return await response.json();
    },
    onSuccess: (response: any) => {
      setGeneratedCaption(response.caption);
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Caption Generated!",
        description: `Used ${response.creditsUsed || 2} credits. ${response.remainingCredits || 'Unknown'} credits remaining.`,
      });
    },
    onError: (error: any) => {
      if (error.status === 402 && error.upgradeModal) {
        setUpgradeModal({
          isOpen: true,
          featureType: "AI Caption Generation",
          creditsRequired: 2,
          currentCredits: user?.credits || 0
        });
      } else {
        toast({
          title: "Caption Generation Failed",
          description: error.message || "Failed to generate caption",
          variant: "destructive",
        });
      }
    }
  });

  const handleGenerateCaption = () => {
    if (!captionPrompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a prompt for your caption",
        variant: "destructive",
      });
      return;
    }

    // Check credits before generating (2 credits for caption generation)
    if (!user?.credits || user.credits < 2) {
      setUpgradeModal({
        isOpen: true,
        featureType: "AI Caption Generation",
        creditsRequired: 2,
        currentCredits: user?.credits || 0
      });
      return;
    }

    captionMutation.mutate({
      prompt: captionPrompt,
      style: captionStyle
    });
  };

  return (
    <Card className="content-card holographic">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-stellar-gold">
          <Edit className="w-5 h-5" />
          <div>
            <div>Caption AI</div>
            <p className="text-asteroid-silver text-sm">Generate engaging captions with AI</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="caption-style" className="text-white mb-2 block text-sm font-medium">
            Caption Style
          </label>
          <select
            id="caption-style"
            value={captionStyle}
            onChange={(e) => setCaptionStyle(e.target.value)}
            className="w-full p-3 rounded-md border border-gray-600 bg-gray-800 text-white focus:border-blue-500 focus:outline-none"
            style={{ pointerEvents: 'auto' }}
          >
            <option value="engaging">Engaging</option>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="funny">Funny</option>
          </select>
        </div>

        <div>
          <label htmlFor="caption-prompt" className="text-white mb-2 block text-sm font-medium">
            Caption Prompt
          </label>
          <textarea
            id="caption-prompt"
            placeholder="Describe what you want the caption to be about..."
            value={captionPrompt}
            onChange={(e) => setCaptionPrompt(e.target.value)}
            className="w-full h-24 p-3 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none"
            rows={4}
            style={{ pointerEvents: 'auto', userSelect: 'text' }}
          />
        </div>

        <Button 
          onClick={handleGenerateCaption}
          disabled={captionMutation.isPending || !captionPrompt.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {captionMutation.isPending ? (
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
          <div className="mt-4">
            <label className="text-white mb-2 block text-sm font-medium">
              Generated Caption
            </label>
            <div className="p-3 rounded-md border border-gray-600 bg-gray-800 text-white">
              {generatedCaption}
            </div>
          </div>
        )}

        {/* Upgrade Modal */}
        <UpgradeModal
          isOpen={upgradeModal.isOpen}
          onClose={() => setUpgradeModal(prev => ({ ...prev, isOpen: false }))}
          featureType={upgradeModal.featureType}
          creditsRequired={upgradeModal.creditsRequired}
          currentCredits={upgradeModal.currentCredits}
        />
      </CardContent>
    </Card>
  );
}

// Main Content Studio Component
export default function ContentStudio() {
  const { currentWorkspace } = useWorkspace();
  const [activeTab, setActiveTab] = useState("video");

  // Fetch user data for credits display
  const { data: user } = useQuery({
    queryKey: ["/api/user"],
    refetchInterval: 30000
  }) as { data?: { credits?: number } };

  const { data: recentCreations, isLoading } = useQuery({
    queryKey: ['content', currentWorkspace?.id],
    queryFn: () => fetch(`/api/content?workspaceId=${currentWorkspace?.id}`).then(res => res.json()),
    enabled: !!currentWorkspace?.id
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'reel': return <Play className="h-4 w-4" />;
      case 'post': return <ImageIcon className="h-4 w-4" />;
      case 'caption': return <Edit className="h-4 w-4" />;
      default: return <ImageIcon className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500';
      case 'scheduled': return 'bg-yellow-500';
      case 'ready': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">Content Studio</h1>
          <p className="text-gray-400 text-sm md:text-base">Create, generate, and manage your content</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 text-left md:text-right">
          <div className="text-center sm:text-right">
            <div className="text-xs md:text-sm text-gray-400">Available Credits</div>
            <div className="text-stellar-gold font-bold text-lg md:text-xl">
              {user?.credits || 0}
            </div>
          </div>
          <div className="text-center sm:text-right">
            <div className="text-xs md:text-sm text-gray-400">Active Workspace</div>
            <div className="text-white font-medium text-sm md:text-base">{currentWorkspace?.name}</div>
          </div>
        </div>
      </div>

      {/* Content Creation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800 border border-gray-600 gap-1 p-1">
          <TabsTrigger value="video" className="text-white data-[state=active]:bg-blue-600 text-xs sm:text-sm p-2 sm:p-3">
            <Video className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Video Generator</span>
            <span className="sm:hidden">Video</span>
          </TabsTrigger>
          <TabsTrigger value="post" className="text-white data-[state=active]:bg-blue-600 text-xs sm:text-sm p-2 sm:p-3">
            <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Post Creator</span>
            <span className="sm:hidden">Post</span>
          </TabsTrigger>
          <TabsTrigger value="caption" className="text-white data-[state=active]:bg-blue-600 text-xs sm:text-sm p-2 sm:p-3">
            <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Caption AI</span>
            <span className="sm:hidden">Caption</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="video" className="mt-4 sm:mt-6">
          <VideoGenerator />
        </TabsContent>

        <TabsContent value="post" className="mt-4 sm:mt-6">
          <PostCreator />
        </TabsContent>

        <TabsContent value="caption" className="mt-6">
          <CaptionAI />
        </TabsContent>
      </Tabs>

      {/* Recent Creations */}
      <Card className="bg-gray-800 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Creations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner className="w-6 h-6" />
              <span className="ml-2 text-gray-400">Loading content...</span>
            </div>
          ) : recentCreations && recentCreations.length > 0 ? (
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {recentCreations.slice(0, 6).map((item: any) => (
                <div key={item.id} className="p-3 md:p-4 bg-gray-700 rounded-lg border border-gray-600">
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <div className="flex items-center gap-2 text-white min-w-0 flex-1">
                      {getIconForType(item.type)}
                      <span className="font-medium text-sm md:text-base truncate">{item.title}</span>
                    </div>
                    <Badge className={`${getStatusColor(item.status)} text-white text-xs flex-shrink-0`}>
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-xs md:text-sm mb-2 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="truncate">{item.platform}</span>
                    <span className="text-xs">{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No content created yet. Start by creating your first piece of content!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}