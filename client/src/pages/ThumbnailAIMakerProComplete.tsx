/**
 * Complete 7-Stage Thumbnail AI Maker Pro
 * Implements the exact system specified in the documentation
 */

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Upload, Wand2, Sparkles, Target, Palette, Download, Edit3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// STAGE 1: Input & UX Setup Types
interface ThumbnailInput {
  title: string;
  description: string;
  category: string;
  imageFile?: File;
  advancedMode: boolean;
}

interface ThumbnailVariant {
  id: string;
  imageUrl: string;
  metadata: {
    title: string;
    layout: string;
    ctrScore: number;
    colors: any;
    fonts: string[];
  };
  previewUrl: string;
}

interface GenerationResult {
  success: boolean;
  variants: ThumbnailVariant[];
  metadata: {
    gptResponse: any;
    trendingMatch: any;
    generationTime: number;
    creditsUsed: number;
  };
  creditsUsed: number;
  remainingCredits: number;
}

const categories = [
  'Gaming',
  'Finance', 
  'Education',
  'Technology',
  'Lifestyle',
  'Business',
  'Entertainment',
  'Health & Fitness',
  'Travel',
  'Food & Cooking'
];

export default function ThumbnailAIMakerProComplete() {
  // STAGE 1: Input State Management
  const [input, setInput] = useState<ThumbnailInput>({
    title: '',
    description: '',
    category: '',
    advancedMode: false
  });

  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [result, setResult] = useState<GenerationResult | null>(null);
  
  // File Upload
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();

  // STAGE 1: File Upload Handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setUploadedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        toast({
          title: "Image uploaded successfully",
          description: "Your image will be used to enhance the thumbnail generation."
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPG or PNG image.",
          variant: "destructive"
        });
      }
    }
  };

  // STAGE 4-7: Complete Generation Pipeline
  const handleGenerateComplete = async () => {
    // STAGE 1: Input validation
    if (!input.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a video title (required for thumbnail generation).",
        variant: "destructive"
      });
      return;
    }

    if (input.title.length > 120) {
      toast({
        title: "Title too long",
        description: "Title must be under 120 characters.",
        variant: "destructive"
      });
      return;
    }

    if (!input.category) {
      toast({
        title: "Category required", 
        description: "Please select a category/niche for your content.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setCurrentStage('Initializing 7-stage pipeline...');

    try {
      // Simulate stage progression
      const stages = [
        'STAGE 1: Processing input & validation...',
        'STAGE 2: GPT-4 strategy generation...',
        'STAGE 2.5: Vision-to-design matching...',
        'STAGE 3: Layout & variant generation...',
        'STAGE 4-7: Complete thumbnail pipeline...'
      ];

      for (let i = 0; i < stages.length; i++) {
        setCurrentStage(stages[i]);
        setGenerationProgress((i + 1) * 20);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Prepare form data
      const formData = new FormData();
      formData.append('title', input.title);
      formData.append('description', input.description);
      formData.append('category', input.category);
      formData.append('advancedMode', input.advancedMode.toString());
      
      if (uploadedFile) {
        formData.append('image', uploadedFile);
      }

      setCurrentStage('Executing complete generation...');
      setGenerationProgress(90);

      // Call the complete 7-stage API
      const response = await apiRequest('/api/thumbnails/generate-complete', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
        setGenerationProgress(100);
        setCurrentStage('Generation complete!');
        
        toast({
          title: "✨ Thumbnails generated successfully!",
          description: `Generated ${data.variants?.length || 0} professional variants using ${data.creditsUsed} credits.`
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Generation failed');
      }

    } catch (error: any) {
      console.error('Generation failed:', error);
      toast({
        title: "Generation failed",
        description: error.message || 'Failed to generate thumbnails. Please try again.',
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Reset function
  const handleReset = () => {
    setInput({
      title: '',
      description: '',
      category: '',
      advancedMode: false
    });
    setUploadedFile(null);
    setPreviewUrl('');
    setResult(null);
    setGenerationProgress(0);
    setCurrentStage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <Wand2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Thumbnail AI Maker Pro
            </h1>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
              7-Stage System
            </Badge>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Professional viral thumbnail generation using our complete 7-stage AI pipeline: 
            Input Processing → GPT-4 Strategy → Vision Matching → Layout Generation → Advanced Features
          </p>
        </div>

        {!result ? (
          // STAGE 1: Input & UX Setup
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <Target className="h-6 w-6" />
                STAGE 1: Input & UX Setup
              </CardTitle>
              <CardDescription className="text-gray-400">
                Configure your video details for AI thumbnail generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Video Title Input */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white flex items-center gap-2">
                  ✏️ Video Title <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Enter your video title (max 120 characters)"
                  value={input.title}
                  onChange={(e) => setInput(prev => ({ ...prev, title: e.target.value }))}
                  maxLength={120}
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <div className="text-sm text-gray-400">
                  {input.title.length}/120 characters
                </div>
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white flex items-center gap-2">
                  📄 Description <span className="text-gray-400">(Optional)</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Optional description to extract additional hooks and context..."
                  value={input.description}
                  onChange={(e) => setInput(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white min-h-[80px]"
                />
              </div>

              {/* Category/Niche Selector */}
              <div className="space-y-2">
                <Label className="text-white flex items-center gap-2">
                  🧠 Category/Niche <span className="text-red-400">*</span>
                </Label>
                <Select value={input.category} onValueChange={(value) => setInput(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select your content category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {categories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()} className="text-white hover:bg-slate-600">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label className="text-white flex items-center gap-2">
                  📂 Image Upload <span className="text-gray-400">(Optional)</span>
                </Label>
                <div 
                  className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {previewUrl ? (
                    <div className="space-y-2">
                      <img src={previewUrl} alt="Preview" className="max-w-xs max-h-32 mx-auto rounded" />
                      <p className="text-green-400">Image uploaded successfully</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                      <p className="text-gray-400">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500">JPG, PNG up to 10MB</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Advanced Toggle */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="advanced"
                  checked={input.advancedMode}
                  onCheckedChange={(checked) => setInput(prev => ({ ...prev, advancedMode: checked }))}
                />
                <Label htmlFor="advanced" className="text-white flex items-center gap-2">
                  ⚙️ Advanced Mode
                  <Badge variant="outline" className="border-purple-500 text-purple-400">
                    Manual Control
                  </Badge>
                </Label>
              </div>

              {/* Generation Progress */}
              {isGenerating && (
                <div className="space-y-3 p-4 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-400 animate-spin" />
                    <span className="text-white font-medium">{currentStage}</span>
                  </div>
                  <Progress value={generationProgress} className="w-full" />
                  <p className="text-sm text-gray-400">
                    Processing through our 7-stage AI pipeline...
                  </p>
                </div>
              )}

              {/* CTA Button */}
              <Button
                onClick={handleGenerateComplete}
                disabled={isGenerating || !input.title.trim() || !input.category}
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 animate-spin" />
                    Generating Viral Thumbnails...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    🚀 Generate Viral Thumbnails with AI
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      8 Credits
                    </Badge>
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          // STAGE 4: Variant Selector & Preview Gallery
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  <Palette className="h-6 w-6" />
                  STAGE 4: Variant Selector & Preview Gallery
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Generated {result.variants.length} professional thumbnail variants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {result.variants.map((variant, index) => (
                    <Card key={variant.id} className="bg-slate-700 border-slate-600">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <img 
                            src={variant.imageUrl} 
                            alt={variant.metadata.title}
                            className="w-full h-32 object-cover rounded"
                          />
                          <div>
                            <h3 className="font-semibold text-white">{variant.metadata.title}</h3>
                            <p className="text-sm text-gray-400">{variant.metadata.layout}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="border-green-500 text-green-400">
                              CTR: {variant.metadata.ctrScore}/10
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              <Edit3 className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button size="sm" className="flex-1">
                              <Download className="h-4 w-4 mr-1" />
                              Use
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-6 flex justify-center">
                  <Button onClick={handleReset} variant="outline">
                    Generate New Thumbnails
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}