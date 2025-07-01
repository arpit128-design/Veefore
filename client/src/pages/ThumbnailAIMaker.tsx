import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
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
  Terminal
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

interface DesignData {
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

const categories = [
  'Gaming', 'Tech', 'Education', 'Entertainment', 'Business', 'Health',
  'Lifestyle', 'Travel', 'Food', 'Fashion', 'Sports', 'Music', 'Comedy'
];

export default function ThumbnailAIMaker() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [variants, setVariants] = useState<ThumbnailVariant[]>([]);
  const [designData, setDesignData] = useState<DesignData | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please choose an image under 10MB",
          variant: "destructive"
        });
        return;
      }
      setImageFile(file);
    }
  };

  const testDebugGeneration = async () => {
    console.log('[THUMBNAIL] Testing debug generation endpoint...');
    try {
      const response = await fetch('/api/thumbnails/debug-strategy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          category,
          style: 'auto'
        })
      });
      
      const result = await response.json();
      console.log('[THUMBNAIL] Debug test result:', result);
      
      if (result.success) {
        setDesignData(result.strategy);
        toast({
          title: "Debug Test Successful!",
          description: "Strategy generated successfully without authentication"
        });
      }
    } catch (error) {
      console.error('[THUMBNAIL] Debug test failed:', error);
      toast({
        title: "Debug Test Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    }
  };

  const generateThumbnails = async () => {
    if (!title.trim() || !category) {
      toast({
        title: "Missing Information",
        description: "Please provide a title and select a category",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setGenerationStep(0);

    try {
      // Step 1: Generate AI strategy
      setGenerationStep(1);
      console.log('[THUMBNAIL] Starting AI strategy generation...');
      console.log('[THUMBNAIL] Request payload:', { title, description, category, style: 'auto' });
      
      const strategyResponse = await apiRequest('POST', '/api/thumbnails/generate-strategy', {
        title,
        description,
        category,
        style: 'auto'
      });

      console.log('[THUMBNAIL] Strategy response received, status:', strategyResponse.status);
      console.log('[THUMBNAIL] Strategy response headers:', strategyResponse.headers);
      
      const strategy = await strategyResponse.json();
      setDesignData(strategy);

      // Step 2: Analyze trending thumbnails
      setGenerationStep(2);
      console.log('[THUMBNAIL] Analyzing trending thumbnails...');

      // Step 3: Generate variants
      setGenerationStep(3);
      console.log('[THUMBNAIL] Generating thumbnail variants...');

      const variantsResponse = await apiRequest('POST', '/api/thumbnails/generate-variants', {
        title,
        description,
        category,
        designData: strategy
      });

      const generatedVariants = await variantsResponse.json();
      setVariants(generatedVariants);
      setGenerationStep(4);

      toast({
        title: "Thumbnails Generated!",
        description: `Generated ${generatedVariants.length} viral thumbnail variants`,
      });

    } catch (error) {
      console.error('[THUMBNAIL] Generation failed:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate thumbnails. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadThumbnail = async (variant: ThumbnailVariant) => {
    try {
      const response = await fetch(variant.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `thumbnail-${variant.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Download Started",
        description: "Your thumbnail is being downloaded",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download thumbnail",
        variant: "destructive"
      });
    }
  };

  const generationSteps = [
    "Preparing...",
    "Analyzing Content with AI",
    "Matching Trending Styles", 
    "Creating 5 AI Images (2-3 minutes)",
    "Complete!"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">AI Thumbnail Maker</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Create scroll-stopping, viral-worthy thumbnails that outperform manual designs
          </p>
        </motion.div>

        {/* Input Section */}
        {!variants.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-purple-400" />
                  Create Your Viral Thumbnail
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Video Title <span className="text-red-400">*</span>
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your video title (max 120 characters)"
                    maxLength={120}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                  />
                  <p className="text-xs text-gray-400 mt-1">{title.length}/120 characters</p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your video content for better AI suggestions"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category <span className="text-red-400">*</span>
                    </label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
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

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Image Upload (Optional)
                    </label>
                    <div 
                      className="border-2 border-dashed border-slate-600 rounded-lg p-4 hover:border-purple-400 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="flex items-center justify-center gap-2 text-gray-400">
                        <Upload className="h-5 w-5" />
                        <span>{imageFile ? imageFile.name : 'Drop image or click to upload'}</span>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Generate Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={generateThumbnails}
                    disabled={isGenerating || !title.trim() || !category}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 text-lg"
                  >
                    {isGenerating ? (
                      <div className="flex items-center gap-3">
                        <Zap className="h-5 w-5 animate-pulse" />
                        {generationSteps[generationStep]}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Generate Viral Thumbnails with AI
                      </div>
                    )}
                  </Button>
                  
                  <Button
                    onClick={testDebugGeneration}
                    disabled={!title.trim() || !category}
                    variant="outline"
                    className="w-full"
                  >
                    <div className="flex items-center gap-2">
                      <Terminal className="h-4 w-4" />
                      Test Debug Generation
                    </div>
                  </Button>
                </div>

                {/* Progress Bar */}
                {isGenerating && (
                  <div className="space-y-3">
                    <Progress value={(generationStep / 4) * 100} className="h-2" />
                    <p className="text-sm text-gray-400 text-center">
                      {generationSteps[generationStep]}
                    </p>
                    {generationStep === 3 && (
                      <div className="text-xs text-amber-400 text-center bg-amber-900/20 px-3 py-2 rounded-lg">
                        ⏱️ AI image generation takes time - please be patient while we create 5 unique thumbnails
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Results Section */}
        {variants.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* AI Insights */}
            {designData && (
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Eye className="h-5 w-5 text-green-400" />
                    AI Strategy Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Emotion Style</h4>
                      <Badge variant="secondary" className="bg-purple-600">
                        {designData.emotion}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Hook Keywords</h4>
                      <div className="flex flex-wrap gap-1">
                        {designData.hooks.map((hook, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {hook}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Color Palette</h4>
                      <div className="flex gap-2">
                        <div 
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: designData.colors.background }}
                        />
                        <div 
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: designData.colors.title }}
                        />
                        <div 
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: designData.colors.cta }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Thumbnail Variants */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-green-400" />
                Generated Variants
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {variants.map((variant) => (
                  <motion.div
                    key={variant.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden backdrop-blur-xl"
                  >
                    <div className="relative">
                      <img 
                        src={variant.imageUrl}
                        alt={variant.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-green-600 text-white">
                          {variant.ctrScore}% CTR
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-2">{variant.title}</h3>
                      <p className="text-sm text-gray-400 mb-4">Layout: {variant.layout}</p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadThumbnail(variant)}
                          className="flex-1"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setSelectedVariant(variant.id)}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Edit3 className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* New Project Button */}
            <div className="text-center">
              <Button
                onClick={() => {
                  setVariants([]);
                  setDesignData(null);
                  setTitle('');
                  setDescription('');
                  setCategory('');
                  setImageFile(null);
                }}
                variant="outline"
                className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Create New Thumbnail
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}