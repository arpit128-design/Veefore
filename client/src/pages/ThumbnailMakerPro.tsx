import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  Upload, 
  Wand2, 
  TrendingUp, 
  Zap, 
  Eye, 
  Download,
  Settings,
  Copy,
  Save,
  RefreshCw,
  Brain,
  Target,
  BarChart3,
  Palette,
  Type,
  Image as ImageIcon,
  Play,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface ThumbnailProject {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'processing' | 'completed' | 'failed';
  stage: number;
  uploadedImageUrl?: string;
  createdAt: string;
}

interface ThumbnailVariant {
  id: string;
  variantNumber: number;
  layoutType: string;
  previewUrl: string;
  predictedCtr: number;
  layoutClassification: string;
  layerMetadata: any;
  composition: any;
}

interface ProjectData {
  project: ThumbnailProject;
  strategy: any;
  variants: ThumbnailVariant[];
}

const CATEGORIES = [
  "Gaming", "Finance", "Education", "Technology", "Entertainment",
  "Health", "Business", "Lifestyle", "News", "Sports"
];

const ThumbnailMakerPro: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(1);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ThumbnailVariant | null>(null);
  const [canvasSession, setCanvasSession] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    uploadedImageUrl: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Stage 1: Input Collection
  const handleStartGeneration = async () => {
    if (!formData.title || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please provide at least a title and category",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setCurrentStep(2);
    setGenerationProgress(10);
    setCurrentStage(1);

    try {
      // Start the thumbnail generation process
      const response = await fetch('/api/thumbnails/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const project = await response.json();
      
      // Poll for project completion
      pollProjectProgress(project.id);
      
    } catch (error) {
      console.error('Generation failed:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to start thumbnail generation",
        variant: "destructive"
      });
      setIsGenerating(false);
    }
  };

  // Poll project progress through the 7 stages
  const pollProjectProgress = async (projectId: string) => {
    const maxAttempts = 30; // 30 seconds maximum
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch(`/api/thumbnails/project/${projectId}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: ProjectData = await response.json();
        
        setProjectData(data);
        setCurrentStage(data.project.stage);
        
        // Update progress based on stage
        const progressMap = {
          1: 20,  // Input processed
          2: 40,  // AI strategy generated
          3: 60,  // Trending analysis completed
          4: 80,  // Variants generated
          5: 100  // Ready for selection
        };
        
        setGenerationProgress(progressMap[data.project.stage as keyof typeof progressMap] || 20);
        
        if (data.project.status === 'completed' && data.project.stage >= 5) {
          setIsGenerating(false);
          setCurrentStep(3); // Move to variant selection
          toast({
            title: "Generation Complete!",
            description: "Your AI thumbnail variants are ready",
          });
          return;
        }
        
        if (data.project.status === 'failed') {
          throw new Error('Generation failed');
        }
        
        // Continue polling if still processing
        if (attempts < maxAttempts) {
          attempts++;
          setTimeout(poll, 1000);
        } else {
          throw new Error('Generation timeout');
        }
        
      } catch (error) {
        console.error('Polling error:', error);
        setIsGenerating(false);
        toast({
          title: "Generation Error",
          description: "Something went wrong during generation",
          variant: "destructive"
        });
      }
    };

    poll();
  };

  // Handle variant selection and create canvas session
  const handleVariantSelect = async (variant: ThumbnailVariant) => {
    setSelectedVariant(variant);
    
    try {
      const response = await fetch(`/api/thumbnails/canvas/${variant.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const session = await response.json();
      setCanvasSession(session);
      setCurrentStep(4); // Move to canvas editor
      
      toast({
        title: "Canvas Ready",
        description: "You can now edit your thumbnail",
      });
      
    } catch (error) {
      console.error('Canvas creation failed:', error);
      toast({
        title: "Canvas Error",
        description: "Failed to create canvas session",
        variant: "destructive"
      });
    }
  };

  // Export thumbnail
  const handleExport = async (format: string) => {
    if (!canvasSession) return;
    
    try {
      const response = await fetch(`/api/thumbnails/export/${canvasSession.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ format })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const exportData = await response.json();
      
      toast({
        title: "Export Complete",
        description: `Thumbnail exported as ${format}`,
      });
      
      // In a real app, this would trigger download
      console.log('Export URL:', exportData.exportUrl);
      
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export thumbnail",
        variant: "destructive"
      });
    }
  };

  // Stage labels for progress indicator
  const getStageLabel = (stage: number) => {
    const labels = {
      1: "Processing Input",
      2: "AI Strategy Generation",
      3: "Trending Analysis",
      4: "Creating Variants",
      5: "Finalizing"
    };
    return labels[stage as keyof typeof labels] || "Processing";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-yellow-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              VeeFore AI Thumbnail Maker Pro
            </h1>
            <Wand2 className="h-8 w-8 text-purple-400" />
          </div>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto">
            Create viral thumbnails with our 7-stage AI system. Get trending analysis, 
            multiple variants, and professional canvas editing tools.
          </p>
        </motion.div>

        {/* Step Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[
              { num: 1, label: "Input", icon: Type },
              { num: 2, label: "AI Generation", icon: Brain },
              { num: 3, label: "Select Variant", icon: Target },
              { num: 4, label: "Edit & Export", icon: Palette }
            ].map(({ num, label, icon: Icon }) => (
              <div key={num} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= num 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                    : 'bg-gray-700 text-gray-400'
                } transition-all duration-300`}>
                  {currentStep > num ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span className={`ml-2 text-sm ${
                  currentStep >= num ? 'text-white' : 'text-gray-400'
                }`}>
                  {label}
                </span>
                {num < 4 && (
                  <div className={`ml-4 w-8 h-0.5 ${
                    currentStep > num ? 'bg-purple-500' : 'bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Input Form */}
          {currentStep === 1 && (
            <motion.div
              key="input"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="bg-black/20 backdrop-blur-lg border-purple-500/20">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Type className="h-6 w-6 text-purple-400" />
                    Project Details
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <Label className="text-white mb-2 block">Video Title *</Label>
                      <Input
                        placeholder="Enter your video title..."
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="bg-white/10 border-purple-500/30 text-white placeholder:text-gray-400"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-white mb-2 block">Description</Label>
                      <Textarea
                        placeholder="Describe your video content (optional)..."
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="bg-white/10 border-purple-500/30 text-white placeholder:text-gray-400"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label className="text-white mb-2 block">Category *</Label>
                      <Select 
                        value={formData.category}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger className="bg-white/10 border-purple-500/30 text-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-purple-500/30">
                          {CATEGORIES.map(category => (
                            <SelectItem key={category} value={category} className="text-white">
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-white mb-2 block">Upload Face Image (Optional)</Label>
                      <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-6 text-center hover:border-purple-500/50 transition-colors cursor-pointer"
                           onClick={() => fileInputRef.current?.click()}>
                        <Upload className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                        <p className="text-gray-400">Click to upload or drag & drop</p>
                        <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          // Handle file upload
                          const file = e.target.files?.[0];
                          if (file) {
                            // In a real app, upload to cloud storage
                            setFormData(prev => ({ ...prev, uploadedImageUrl: URL.createObjectURL(file) }));
                          }
                        }}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleStartGeneration}
                    className="w-full mt-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3"
                    disabled={!formData.title || !formData.category}
                  >
                    <Wand2 className="h-5 w-5 mr-2" />
                    Generate AI Thumbnails
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: AI Generation Progress */}
          {currentStep === 2 && (
            <motion.div
              key="generation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="bg-black/20 backdrop-blur-lg border-purple-500/20">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 mx-auto mb-4"
                    >
                      <Brain className="h-16 w-16 text-purple-400" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      AI is Creating Your Thumbnails
                    </h2>
                    <p className="text-blue-200">
                      Stage {currentStage}/5: {getStageLabel(currentStage)}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <Progress value={generationProgress} className="h-3 bg-gray-700" />
                    <p className="text-sm text-gray-400 mt-2">{generationProgress}% Complete</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className={`p-3 rounded-lg ${currentStage >= 2 ? 'bg-green-500/20 text-green-400' : 'bg-gray-700/20 text-gray-400'}`}>
                      <Zap className="h-5 w-5 mx-auto mb-1" />
                      GPT-4 Strategy
                    </div>
                    <div className={`p-3 rounded-lg ${currentStage >= 3 ? 'bg-green-500/20 text-green-400' : 'bg-gray-700/20 text-gray-400'}`}>
                      <TrendingUp className="h-5 w-5 mx-auto mb-1" />
                      Trending Analysis
                    </div>
                    <div className={`p-3 rounded-lg ${currentStage >= 4 ? 'bg-green-500/20 text-green-400' : 'bg-gray-700/20 text-gray-400'}`}>
                      <Palette className="h-5 w-5 mx-auto mb-1" />
                      Layout Generation
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Variant Selection */}
          {currentStep === 3 && projectData && (
            <motion.div
              key="variants"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto"
            >
              <Card className="bg-black/20 backdrop-blur-lg border-purple-500/20">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Target className="h-6 w-6 text-purple-400" />
                    Choose Your Best Variant
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projectData.variants?.map((variant) => (
                      <motion.div
                        key={variant.id}
                        whileHover={{ scale: 1.02 }}
                        className="relative group cursor-pointer"
                        onClick={() => handleVariantSelect(variant)}
                      >
                        <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden relative border-2 border-transparent group-hover:border-purple-500 transition-colors">
                          {variant.previewUrl ? (
                            <img 
                              src={variant.previewUrl} 
                              alt={variant.layoutType}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <ImageIcon className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                          
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                            <Button className="opacity-0 group-hover:opacity-100 transition-opacity bg-purple-600 hover:bg-purple-700">
                              <Play className="h-4 w-4 mr-2" />
                              Edit This
                            </Button>
                          </div>
                          
                          {/* CTR Badge */}
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-green-500/90 text-white">
                              <BarChart3 className="h-3 w-3 mr-1" />
                              {variant.predictedCtr}% CTR
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <h3 className="font-semibold text-white">{variant.layoutType}</h3>
                          <p className="text-sm text-gray-400">{variant.layoutClassification}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Canvas Editor & Export */}
          {currentStep === 4 && selectedVariant && canvasSession && (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto"
            >
              <Card className="bg-black/20 backdrop-blur-lg border-purple-500/20">
                <CardContent className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Palette className="h-6 w-6 text-purple-400" />
                      Canvas Editor
                    </h2>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" className="border-purple-500/30 text-white">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" className="border-purple-500/30 text-white">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Canvas Area */}
                    <div className="lg:col-span-3">
                      <div className="aspect-video bg-gray-900 rounded-lg border border-purple-500/30 flex items-center justify-center">
                        {selectedVariant.previewUrl ? (
                          <img 
                            src={selectedVariant.previewUrl} 
                            alt="Canvas"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-center">
                            <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-400">Canvas will load here</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Tools Panel */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          Tools
                        </h3>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full justify-start border-purple-500/30 text-white">
                            <Type className="h-4 w-4 mr-2" />
                            Text
                          </Button>
                          <Button variant="outline" className="w-full justify-start border-purple-500/30 text-white">
                            <ImageIcon className="h-4 w-4 mr-2" />
                            Image
                          </Button>
                          <Button variant="outline" className="w-full justify-start border-purple-500/30 text-white">
                            <Palette className="h-4 w-4 mr-2" />
                            Background
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          Export
                        </h3>
                        <div className="space-y-2">
                          <Button 
                            onClick={() => handleExport('PNG 1280x720')}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                          >
                            PNG 1280x720
                          </Button>
                          <Button 
                            onClick={() => handleExport('PNG transparent')}
                            variant="outline" 
                            className="w-full border-purple-500/30 text-white"
                          >
                            PNG Transparent
                          </Button>
                          <Button 
                            onClick={() => handleExport('Instagram 1080x1080')}
                            variant="outline" 
                            className="w-full border-purple-500/30 text-white"
                          >
                            Instagram 1080x1080
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ThumbnailMakerPro;