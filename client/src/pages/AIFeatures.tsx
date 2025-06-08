import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Wand2, Image, Video, Hash, Sparkles } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { UpgradeModal } from "@/components/modals/UpgradeModal";

export default function AIFeatures() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [upgradeModal, setUpgradeModal] = useState<{
    isOpen: boolean;
    featureType: string;
    creditsRequired: number;
    currentCredits: number;
  }>({
    isOpen: false,
    featureType: "",
    creditsRequired: 0,
    currentCredits: 0
  });

  // Form states
  const [captionForm, setCaptionForm] = useState({
    title: "",
    description: "",
    type: "post",
    platform: "instagram"
  });
  const [imageForm, setImageForm] = useState({ prompt: "" });
  const [videoForm, setVideoForm] = useState({ prompt: "", duration: 15 });
  const [hashtagForm, setHashtagForm] = useState({
    content: "",
    platform: "instagram",
    niche: ""
  });

  // Get user data to show current credits
  const { data: user } = useQuery({
    queryKey: ["/api/user"],
    refetchInterval: 30000
  });

  // AI Caption Generation Mutation
  const captionMutation = useMutation({
    mutationFn: async (data: typeof captionForm) => {
      const response = await apiRequest("POST", "/api/generate-caption", data);
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Caption Generated Successfully!",
        description: `Used ${data.creditsUsed} credit. ${data.remainingCredits} credits remaining.`
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error: any) => {
      if (error.status === 402 && error.upgradeModal) {
        setUpgradeModal({
          isOpen: true,
          featureType: error.featureType,
          creditsRequired: error.required,
          currentCredits: error.current
        });
      } else {
        toast({
          title: "Caption Generation Failed",
          description: error.message || "Please try again",
          variant: "destructive"
        });
      }
    }
  });

  // AI Image Generation Mutation
  const imageMutation = useMutation({
    mutationFn: async (data: typeof imageForm) => {
      const response = await apiRequest("POST", "/api/generate-image", data);
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Image Generated Successfully!",
        description: `Used ${data.creditsUsed} credits. ${data.remainingCredits} credits remaining.`
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error: any) => {
      if (error.status === 402 && error.upgradeModal) {
        setUpgradeModal({
          isOpen: true,
          featureType: error.featureType,
          creditsRequired: error.required,
          currentCredits: error.current
        });
      } else {
        toast({
          title: "Image Generation Failed",
          description: error.message || "Please try again",
          variant: "destructive"
        });
      }
    }
  });

  // AI Video Generation Mutation
  const videoMutation = useMutation({
    mutationFn: async (data: typeof videoForm) => {
      const response = await apiRequest("POST", "/api/generate-video", data);
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Video Generated Successfully!",
        description: `Used ${data.creditsUsed} credits. ${data.remainingCredits} credits remaining.`
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error: any) => {
      if (error.status === 402 && error.upgradeModal) {
        setUpgradeModal({
          isOpen: true,
          featureType: error.featureType,
          creditsRequired: error.required,
          currentCredits: error.current
        });
      } else {
        toast({
          title: "Video Generation Failed",
          description: error.message || "Please try again",
          variant: "destructive"
        });
      }
    }
  });

  // AI Hashtag Generation Mutation
  const hashtagMutation = useMutation({
    mutationFn: async (data: typeof hashtagForm) => {
      const response = await apiRequest("POST", "/api/generate-hashtags", data);
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Hashtags Generated Successfully!",
        description: `Used ${data.creditsUsed} credit. ${data.remainingCredits} credits remaining.`
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error: any) => {
      if (error.status === 402 && error.upgradeModal) {
        setUpgradeModal({
          isOpen: true,
          featureType: error.featureType,
          creditsRequired: error.required,
          currentCredits: error.current
        });
      } else {
        toast({
          title: "Hashtag Generation Failed",
          description: error.message || "Please try again",
          variant: "destructive"
        });
      }
    }
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            AI Content Studio
          </h1>
          <p className="text-gray-400 mt-2">
            Generate AI-powered content for your social media
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            {user?.credits || 0} Credits
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Caption Generation */}
        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-purple-500" />
              <CardTitle>AI Caption Generator</CardTitle>
              <Badge variant="outline">1 Credit</Badge>
            </div>
            <CardDescription>
              Generate engaging captions for your posts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={captionForm.title}
                onChange={(e) => setCaptionForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter post title..."
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={captionForm.description}
                onChange={(e) => setCaptionForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your content..."
                rows={3}
              />
            </div>
            <Button
              onClick={() => captionMutation.mutate(captionForm)}
              disabled={captionMutation.isPending || !captionForm.title}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {captionMutation.isPending ? "Generating..." : "Generate Caption"}
            </Button>
            {captionMutation.data && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="font-medium mb-2">Generated Caption:</p>
                <p className="text-sm mb-2">{captionMutation.data.caption}</p>
                <p className="text-sm text-gray-600">{captionMutation.data.hashtags}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Image Generation */}
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Image className="w-5 h-5 text-blue-500" />
              <CardTitle>AI Image Generator</CardTitle>
              <Badge variant="outline">4 Credits</Badge>
            </div>
            <CardDescription>
              Create stunning images from text descriptions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Image Prompt</label>
              <Textarea
                value={imageForm.prompt}
                onChange={(e) => setImageForm(prev => ({ ...prev, prompt: e.target.value }))}
                placeholder="Describe the image you want to create..."
                rows={3}
              />
            </div>
            <Button
              onClick={() => imageMutation.mutate(imageForm)}
              disabled={imageMutation.isPending || !imageForm.prompt}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {imageMutation.isPending ? "Generating..." : "Generate Image"}
            </Button>
            {imageMutation.data && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="font-medium mb-2">Generated Image:</p>
                <img
                  src={imageMutation.data.imageUrl}
                  alt="Generated content"
                  className="w-full rounded-lg"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Video Generation */}
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-green-500" />
              <CardTitle>AI Video Generator</CardTitle>
              <Badge variant="outline">8 Credits</Badge>
            </div>
            <CardDescription>
              Generate videos and reels with AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Video Prompt</label>
              <Textarea
                value={videoForm.prompt}
                onChange={(e) => setVideoForm(prev => ({ ...prev, prompt: e.target.value }))}
                placeholder="Describe the video content..."
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Duration (seconds)</label>
              <Input
                type="number"
                value={videoForm.duration}
                onChange={(e) => setVideoForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 15 }))}
                min={5}
                max={60}
              />
            </div>
            <Button
              onClick={() => videoMutation.mutate(videoForm)}
              disabled={videoMutation.isPending || !videoForm.prompt}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {videoMutation.isPending ? "Generating..." : "Generate Video"}
            </Button>
            {videoMutation.data && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="font-medium mb-2">Generated Video:</p>
                <video
                  src={videoMutation.data.videoUrl}
                  controls
                  className="w-full rounded-lg"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Hashtag Generation */}
        <Card className="border-orange-200 dark:border-orange-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-orange-500" />
              <CardTitle>AI Hashtag Generator</CardTitle>
              <Badge variant="outline">1 Credit</Badge>
            </div>
            <CardDescription>
              Generate trending hashtags for better reach
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Content Description</label>
              <Textarea
                value={hashtagForm.content}
                onChange={(e) => setHashtagForm(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Describe your content or niche..."
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Niche (Optional)</label>
              <Input
                value={hashtagForm.niche}
                onChange={(e) => setHashtagForm(prev => ({ ...prev, niche: e.target.value }))}
                placeholder="e.g., fitness, travel, food"
              />
            </div>
            <Button
              onClick={() => hashtagMutation.mutate(hashtagForm)}
              disabled={hashtagMutation.isPending || !hashtagForm.content}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              {hashtagMutation.isPending ? "Generating..." : "Generate Hashtags"}
            </Button>
            {hashtagMutation.data && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="font-medium mb-2">Generated Hashtags:</p>
                <div className="flex flex-wrap gap-2">
                  {hashtagMutation.data.hashtags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <UpgradeModal
        isOpen={upgradeModal.isOpen}
        onClose={() => setUpgradeModal(prev => ({ ...prev, isOpen: false }))}
        featureType={upgradeModal.featureType}
        creditsRequired={upgradeModal.creditsRequired}
        currentCredits={upgradeModal.currentCredits}
      />
    </div>
  );
}