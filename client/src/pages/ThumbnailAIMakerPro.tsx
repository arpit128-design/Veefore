import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  ImageIcon, 
  Upload, 
  Wand2, 
  Download, 
  Edit3, 
  Star, 
  TrendingUp,
  Eye,
  Zap,
  Settings,
  Palette,
  Type,
  Sparkles,
  X,
  Check,
  Timer
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface ThumbnailVariant {
  id: string;
  title: string;
  imageUrl: string;
  ctrScore: number;
  layout: string;
  metadata: any;
}

interface DesignStrategy {
  titles: string[];
  ctas: string[];
  fonts: string[];
  colors: {
    background: string;
    title: string;
    cta: string;
  };
  style: string;
  emotion: string;
  hooks: string[];
  placement: string;
}

interface TrendingMatch {
  matched_trend_thumbnail: string;
  layout_style: string;
  visual_motif: string;
  emoji: string[];
  filters: string[];
}

export default function ThumbnailAIMakerPro() {
  // STAGE 1: Input & UX Setup
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [advancedMode, setAdvancedMode] = useState(false);
  
  // Generation Pipeline States
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [designStrategy, setDesignStrategy] = useState<DesignStrategy | null>(null);
  const [trendingMatch, setTrendingMatch] = useState<TrendingMatch | null>(null);
  const [variants, setVariants] = useState<ThumbnailVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ThumbnailVariant | null>(null);
  
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stages = [
    "Analyzing Input",
    "GPT-4 Strategy Generation", 
    "Trending Vision Matching",
    "Layout Generation",
    "AI Composition",
    "Variant Creation",
    "Final Processing"
  ];

  const categories = [
    'Gaming', 'Finance', 'Education', 'Tech', 'Lifestyle', 
    'Business', 'Health', 'Entertainment', 'News', 'Sports'
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please select an image under 10MB",
          variant: "destructive"
        });
        return;
      }
      
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generateThumbnails = async () => {
    if (!title.trim() || !category) {
      toast({
        title: "Missing Information",
        description: "Please provide a video title and select a category",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setCurrentStage(0);
    setVariants([]);

    try {
      // STAGE 1: Input Processing
      setCurrentStage(1);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // STAGE 2: GPT-4 Strategy Generation
      setCurrentStage(2);
      console.log('[THUMBNAIL PRO] Starting GPT-4 strategy generation');
      
      const strategyResponse = await apiRequest('POST', '/api/thumbnails/generate-strategy-pro', {
        title,
        description,
        category,
        hasImage: !!uploadedImage
      });
      
      const strategy = await strategyResponse.json();
      setDesignStrategy(strategy);
      console.log('[THUMBNAIL PRO] Strategy generated:', strategy);

      // STAGE 3: Trending Vision Matching
      setCurrentStage(3);
      console.log('[THUMBNAIL PRO] Starting trending vision matching');
      
      const trendingResponse = await apiRequest('POST', '/api/thumbnails/match-trending', {
        title,
        category,
        strategy
      });
      
      const trending = await trendingResponse.json();
      setTrendingMatch(trending);
      console.log('[THUMBNAIL PRO] Trending match:', trending);

      // STAGE 4-7: Complete Generation Pipeline
      setCurrentStage(4);
      console.log('[THUMBNAIL PRO] Starting complete generation pipeline');

      // Prepare form data for image upload
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description || '');
      formData.append('category', category);
      formData.append('strategy', JSON.stringify(strategy));
      formData.append('trending', JSON.stringify(trending));
      
      if (uploadedImage) {
        formData.append('image', uploadedImage);
      }

      // Generate variants with all stages
      for (let stage = 4; stage <= 7; stage++) {
        setCurrentStage(stage);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      const variantsResponse = await apiRequest('POST', '/api/thumbnails/generate-complete', formData);
      const generatedVariants = await variantsResponse.json();
      setVariants(generatedVariants);
      
      console.log('[THUMBNAIL PRO] Generated variants:', generatedVariants);
      
      toast({
        title: "Thumbnails Generated!",
        description: `Created ${generatedVariants.length} high-CTR variants`,
      });

    } catch (error) {
      console.error('[THUMBNAIL PRO] Generation failed:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
      setCurrentStage(0);
    }
  };

  const downloadThumbnail = async (variant: ThumbnailVariant) => {
    try {
      const response = await fetch(variant.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `thumbnail-${variant.id}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download Started",
        description: `Downloading ${variant.title}`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download the thumbnail",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            AI Thumbnail Maker Pro
          </h1>
          <p className="text-purple-200">
            Create scroll-stopping, viral thumbnails with 7-stage AI pipeline
          </p>
        </div>

        {!isGenerating && variants.length === 0 && (
          <Card className="bg-black/20 backdrop-blur-lg border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Stage 1: Input & Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Video Title Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-200">
                  Video Title (Required) *
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your video title (max 120 characters)"
                  maxLength={120}
                  className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300"
                />
                <div className="text-xs text-purple-300">
                  {title.length}/120 characters
                </div>
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-200">
                  Description (Optional)
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description to extract additional hooks..."
                  className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300"
                  rows={3}
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-200">
                  Image Upload (Optional)
                </label>
                <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-6 text-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="max-h-40 mx-auto rounded-lg"
                      />
                      <Button
                        onClick={removeImage}
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div 
                      className="cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                      <p className="text-purple-200">
                        Drag & drop or click to upload JPG/PNG
                      </p>
                      <p className="text-xs text-purple-400 mt-1">
                        Max 10MB - Face images work best
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Category Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-200">
                  Category/Niche (Required) *
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-white/10 border-purple-500/30 text-white">
                    <SelectValue placeholder="Select your content category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat.toLowerCase()}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Advanced Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-purple-200">
                    Advanced Mode
                  </label>
                  <p className="text-xs text-purple-400">
                    Manual style control and tweaking options
                  </p>
                </div>
                <Switch
                  checked={advancedMode}
                  onCheckedChange={setAdvancedMode}
                />
              </div>

              {/* Generate Button */}
              <Button
                onClick={generateThumbnails}
                disabled={!title.trim() || !category}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 text-lg"
              >
                <Wand2 className="h-5 w-5 mr-2" />
                Generate Viral Thumbnails with AI
              </Button>

              {/* Test Optimized System Button */}
              <Button
                onClick={async () => {
                  if (!title.trim()) {
                    toast({
                      title: "Title Required",
                      description: "Please enter a video title to test the system",
                      variant: "destructive"
                    });
                    return;
                  }
                  
                  try {
                    setIsGenerating(true);
                    console.log('[THUMBNAIL TEST] Testing optimized generation system');
                    
                    const response = await fetch('/api/thumbnails/test-optimized-generation', {
                      method: 'POST',
                      body: JSON.stringify({ title }),
                      headers: { 'Content-Type': 'application/json' }
                    });
                    
                    if (!response.ok) {
                      throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    
                    setVariants(data.variants);
                    
                    toast({
                      title: "✅ Optimized System Demo",
                      description: data.optimization.message,
                    });
                    
                    console.log('[THUMBNAIL TEST] Optimization Results:', data.optimization);
                    
                  } catch (error) {
                    console.error('[THUMBNAIL TEST] Failed:', error);
                    toast({
                      title: "Test Failed",
                      description: "Could not test the optimized system",
                      variant: "destructive"
                    });
                  } finally {
                    setIsGenerating(false);
                  }
                }}
                disabled={!title.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 text-lg"
              >
                {isGenerating ? (
                  <>
                    <Timer className="h-5 w-5 mr-2 animate-spin" />
                    Testing System...
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5 mr-2" />
                    🔥 Test Optimized System (1 AI call + 4 variations)
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Generation Progress */}
        {isGenerating && (
          <Card className="bg-black/20 backdrop-blur-lg border-purple-500/30 mb-8">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    AI Generation Pipeline
                  </h3>
                  <Badge variant="secondary" className="bg-purple-600">
                    Stage {currentStage}/7
                  </Badge>
                </div>
                
                <Progress value={(currentStage / 7) * 100} className="h-3" />
                
                <div className="space-y-2">
                  {stages.map((stage, index) => (
                    <div 
                      key={index}
                      className={`flex items-center gap-2 text-sm ${
                        index < currentStage ? 'text-green-400' :
                        index === currentStage ? 'text-purple-300' :
                        'text-gray-500'
                      }`}
                    >
                      {index < currentStage ? (
                        <Check className="h-4 w-4" />
                      ) : index === currentStage ? (
                        <Timer className="h-4 w-4 animate-spin" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-gray-500" />
                      )}
                      {stage}
                    </div>
                  ))}
                </div>

                {currentStage >= 2 && (
                  <div className="text-xs text-amber-400 bg-amber-900/20 px-3 py-2 rounded-lg">
                    ⏱️ AI processing takes 2-3 minutes for high-quality results. Please wait...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generated Variants Gallery */}
        {variants.length > 0 && (
          <Card className="bg-black/20 backdrop-blur-lg border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Generated Variants ({variants.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {variants.map((variant) => (
                  <motion.div
                    key={variant.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 rounded-lg p-4 border border-purple-500/20"
                  >
                    <div className="relative mb-3">
                      <img 
                        src={variant.imageUrl} 
                        alt={variant.title}
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          console.error('[IMAGE ERROR] Failed to load:', variant.imageUrl);
                          console.error('[IMAGE ERROR] Error:', e);
                          // Set fallback placeholder
                          e.currentTarget.src = `https://via.placeholder.com/320x180/6366f1/ffffff?text=Error+Loading+${encodeURIComponent(variant.layout)}`;
                        }}
                        onLoad={() => {
                          console.log('[IMAGE SUCCESS] Loaded:', variant.imageUrl);
                        }}
                      />
                      <Badge 
                        className="absolute top-2 right-2 bg-green-600"
                      >
                        {(variant.ctrScore * 100).toFixed(2)}% CTR
                      </Badge>
                    </div>
                    
                    <h3 className="text-white font-medium mb-2">
                      {variant.title}
                    </h3>
                    
                    <p className="text-purple-200 text-sm mb-3">
                      Layout: {variant.layout}
                    </p>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => downloadThumbnail(variant)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button
                        onClick={() => setSelectedVariant(variant)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}