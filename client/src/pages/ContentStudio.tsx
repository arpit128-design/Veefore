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
  Zap
} from "lucide-react";

// AI Video Generator Component
function VideoGenerator() {
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("youtube");
  const [generatedScript, setGeneratedScript] = useState<any>(null);
  const [generatedVideo, setGeneratedVideo] = useState<any>(null);
  const [step, setStep] = useState('input');
  
  const { currentWorkspace } = useWorkspace();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
            <div className="text-sm text-gray-400">25 credits per video</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-yellow-400">
              {step === 'input' ? '25' : step === 'script' ? '15' : '0'} Credits
            </div>
            <div className="text-xs text-gray-400">remaining for video</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Post Creator Component
function PostCreator() {
  const [postText, setPostText] = useState("");
  const [postPlatform, setPostPlatform] = useState("instagram");
  const [imageUrl, setImageUrl] = useState("");
  
  const { currentWorkspace } = useWorkspace();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/content', data),
    onSuccess: () => {
      toast({
        title: "Post Created!",
        description: "Your social media post has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['content'] });
      setPostText("");
      setImageUrl("");
    },
    onError: (error: any) => {
      toast({
        title: "Post Creation Failed",
        description: error.message || "Failed to create post",
        variant: "destructive",
      });
    }
  });

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
        imageUrl: imageUrl
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
          <label htmlFor="post-image" className="text-white mb-2 block text-sm font-medium">
            Image URL (Optional)
          </label>
          <input
            type="url"
            id="post-image"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-3 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            style={{ pointerEvents: 'auto', userSelect: 'text' }}
          />
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
      </CardContent>
    </Card>
  );
}

// Caption AI Component
function CaptionAI() {
  const [captionPrompt, setCaptionPrompt] = useState("");
  const [captionStyle, setCaptionStyle] = useState("engaging");
  const [generatedCaption, setGeneratedCaption] = useState("");
  
  const { toast } = useToast();

  const captionMutation = useMutation({
    mutationFn: async (data: any) => {
      // Simple caption generation logic
      const styles = {
        engaging: "🌟 ",
        professional: "",
        casual: "😊 ",
        funny: "😂 "
      };
      
      const prefix = styles[data.style as keyof typeof styles] || "";
      return { caption: `${prefix}${data.prompt} #content #socialmedia` };
    },
    onSuccess: (response: any) => {
      setGeneratedCaption(response.caption);
      toast({
        title: "Caption Generated!",
        description: "Your AI-generated caption is ready.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Caption Generation Failed",
        description: "Failed to generate caption",
        variant: "destructive",
      });
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
      </CardContent>
    </Card>
  );
}

// Main Content Studio Component
export default function ContentStudio() {
  const { currentWorkspace } = useWorkspace();
  const [activeTab, setActiveTab] = useState("video");

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Content Studio</h1>
          <p className="text-gray-400">Create, generate, and manage your content</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Active Workspace</div>
          <div className="text-white font-medium">{currentWorkspace?.name}</div>
        </div>
      </div>

      {/* Content Creation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800 border border-gray-600">
          <TabsTrigger value="video" className="text-white data-[state=active]:bg-blue-600">
            <Video className="w-4 h-4 mr-2" />
            Video Generator
          </TabsTrigger>
          <TabsTrigger value="post" className="text-white data-[state=active]:bg-blue-600">
            <ImageIcon className="w-4 h-4 mr-2" />
            Post Creator
          </TabsTrigger>
          <TabsTrigger value="caption" className="text-white data-[state=active]:bg-blue-600">
            <Edit className="w-4 h-4 mr-2" />
            Caption AI
          </TabsTrigger>
        </TabsList>

        <TabsContent value="video" className="mt-6">
          <VideoGenerator />
        </TabsContent>

        <TabsContent value="post" className="mt-6">
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recentCreations.slice(0, 6).map((item: any) => (
                <div key={item.id} className="p-4 bg-gray-700 rounded-lg border border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-white">
                      {getIconForType(item.type)}
                      <span className="font-medium">{item.title}</span>
                    </div>
                    <Badge className={`${getStatusColor(item.status)} text-white`}>
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{item.platform}</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
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