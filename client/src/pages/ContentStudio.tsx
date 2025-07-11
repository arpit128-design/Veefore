import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { 
  Video, 
  Play, 
  Image as ImageIcon, 
  Film,
  Scissors,
  Sparkles,
  Bot,
  Camera,
  Upload,
  Download,
  Share,
  Eye,
  Palette,
  Type,
  Layout,
  Zap,
  Target,
  TrendingUp,
  Settings,
  Wand2,
  Stars,
  Crown,
  Layers,
  Grid3X3,
  RotateCw,
  Crop,
  Filter,
  Volume2,
  Clock,
  Hash,
  CheckCircle,
  ArrowRight,
  Plus,
  X,
  RefreshCw,
  FileVideo,
  FileImage,
  Monitor,
  Smartphone,
  Tablet,
  Maximize,
  Minimize,
  Square,
  Circle,
  Triangle,
  Mic,
  Music,
  Headphones,
  PlayCircle,
  PauseCircle,
  SkipForward,
  SkipBack,
  Volume,
  VolumeX,
  Shuffle,
  Repeat,
  Edit3,
  Move,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search,
  Save,
  FolderOpen,
  Trash2,
  Copy,
  PaintBucket,
  Brush,
  Eraser,
  Pen,
  MousePointer,
  Hand,
  ZoomIn,
  ZoomOut,
  RotateClockwise,
  FlipHorizontal,
  FlipVertical,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Link,
  Unlock,
  Lock,
  Cpu,
  Database,
  Shield,
  Globe,
  Gauge
} from "lucide-react";

// Helper function for active tab classes
function getActiveTabClasses(color: string) {
  const colorMap = {
    indigo: "bg-indigo-600 hover:bg-indigo-700 border-indigo-600 text-white scale-105 shadow-lg",
    blue: "bg-blue-600 hover:bg-blue-700 border-blue-600 text-white scale-105 shadow-lg",
    purple: "bg-purple-600 hover:bg-purple-700 border-purple-600 text-white scale-105 shadow-lg",
    green: "bg-green-600 hover:bg-green-700 border-green-600 text-white scale-105 shadow-lg",
    orange: "bg-blue-600 hover:bg-blue-700 border-blue-600 text-white scale-105 shadow-lg",
    rose: "bg-rose-600 hover:bg-rose-700 border-rose-600 text-white scale-105 shadow-lg",
    amber: "bg-purple-600 hover:bg-purple-700 border-purple-600 text-white scale-105 shadow-lg"
  };
  return colorMap[color as keyof typeof colorMap] || "bg-slate-600 hover:bg-slate-700 border-slate-600 text-white scale-105 shadow-lg";
}

// Helper function for tool button classes
function getToolButtonClasses(color: string, isSelected: boolean) {
  if (!isSelected) return "bg-white hover:bg-slate-50 border-slate-200 text-slate-700";
  
  const colorMap = {
    rose: "bg-rose-600 hover:bg-rose-700 border-rose-600 text-white scale-105 shadow-lg",
    blue: "bg-blue-600 hover:bg-blue-700 border-blue-600 text-white scale-105 shadow-lg",
    green: "bg-green-600 hover:bg-green-700 border-green-600 text-white scale-105 shadow-lg",
    purple: "bg-purple-600 hover:bg-purple-700 border-purple-600 text-white scale-105 shadow-lg",
    orange: "bg-blue-600 hover:bg-blue-700 border-blue-600 text-white scale-105 shadow-lg",
    amber: "bg-purple-600 hover:bg-purple-700 border-purple-600 text-white scale-105 shadow-lg"
  };
  return colorMap[color as keyof typeof colorMap] || "bg-slate-600 hover:bg-slate-700 border-slate-600 text-white scale-105 shadow-lg";
}

// Helper function for badge classes
function getBadgeClasses(color: string) {
  const colorMap = {
    rose: "bg-rose-100 text-rose-700 border-rose-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    green: "bg-green-100 text-green-700 border-green-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200",
    orange: "bg-blue-100 text-blue-700 border-blue-200",
    amber: "bg-purple-100 text-purple-700 border-purple-200"
  };
  return colorMap[color as keyof typeof colorMap] || "bg-slate-100 text-slate-700 border-slate-200";
}

// Helper function for icon background classes
function getIconBgClasses(color: string) {
  const colorMap = {
    rose: "bg-rose-600",
    blue: "bg-blue-600",
    green: "bg-green-600",
    purple: "bg-purple-600",
    orange: "bg-blue-600",
    amber: "bg-purple-600"
  };
  return colorMap[color as keyof typeof colorMap] || "bg-slate-600";
}

// Professional Enterprise Header
function ProfessionalStudioHeader() {
  const [realTimeStats, setRealTimeStats] = useState({
    activeProjects: 127,
    todayGenerations: 2847,
    creditsUsed: 18934,
    renderTime: "1.2s",
    success: "99.8%",
    models: 8
  });

  return (
    <div className="relative bg-white border border-slate-200 rounded-xl p-8 mb-8 shadow-sm">
      {/* Professional Header Content */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Cpu className="h-8 w-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">VeeFore Studio Enterprise</h1>
            <p className="text-slate-600 text-lg">Professional AI Content Creation Platform</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">All Systems Operational</span>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Professional Status Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-slate-900">{realTimeStats.activeProjects}</div>
          <div className="text-sm text-slate-600">Active Projects</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{realTimeStats.todayGenerations}</div>
          <div className="text-sm text-slate-600">Today's Generations</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{realTimeStats.creditsUsed}</div>
          <div className="text-sm text-slate-600">Credits Consumed</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{realTimeStats.renderTime}</div>
          <div className="text-sm text-slate-600">Avg Response</div>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600">{realTimeStats.success}</div>
          <div className="text-sm text-slate-600">Success Rate</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{realTimeStats.models}</div>
          <div className="text-sm text-slate-600">AI Models</div>
        </div>
      </div>

      {/* Enterprise Feature Badges */}
      <div className="flex flex-wrap items-center gap-3">
        <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 px-3 py-1">
          <Shield className="h-3 w-3 mr-1" />
          Enterprise Security
        </Badge>
        <Badge className="bg-purple-100 text-purple-700 border-purple-200 px-3 py-1">
          <Database className="h-3 w-3 mr-1" />
          Cloud Infrastructure
        </Badge>
        <Badge className="bg-green-100 text-green-700 border-green-200 px-3 py-1">
          <Gauge className="h-3 w-3 mr-1" />
          99.9% Uptime SLA
        </Badge>
        <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1">
          <Globe className="h-3 w-3 mr-1" />
          Global CDN
        </Badge>
        <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1">
          <Bot className="h-3 w-3 mr-1" />
          GPT-4 Turbo
        </Badge>
        <Badge className="bg-pink-100 text-pink-700 border-pink-200 px-3 py-1">
          <Stars className="h-3 w-3 mr-1" />
          DALL-E 3
        </Badge>
      </div>
    </div>
  );
}

function ProfessionalTabNavigation({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  const tabs = [
    { 
      id: "ai-creator", 
      label: "AI Creator", 
      icon: Wand2, 
      color: "indigo",
      description: "Advanced AI Generation"
    },
    { 
      id: "video-studio", 
      label: "Video Studio", 
      icon: Video, 
      color: "blue",
      description: "Professional Video Editing"
    },
    { 
      id: "design-lab", 
      label: "Design Lab", 
      icon: Palette, 
      color: "purple",
      description: "Creative Design Tools"
    },
    { 
      id: "automation-hub", 
      label: "Automation Hub", 
      icon: Bot, 
      color: "green",
      description: "Workflow Automation"
    },
    { 
      id: "analytics-center", 
      label: "Analytics Center", 
      icon: TrendingUp, 
      color: "orange",
      description: "Performance Intelligence"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "default" : "outline"}
          onClick={() => setActiveTab(tab.id)}
          className={`h-20 p-4 border-2 transition-all duration-200 ${
            activeTab === tab.id 
              ? getActiveTabClasses(tab.color)
              : `bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300`
          }`}
        >
          <div className="flex flex-col items-center space-y-2">
            <tab.icon className="h-6 w-6" />
            <div className="text-center">
              <div className="text-sm font-semibold">{tab.label}</div>
              <div className="text-xs opacity-75">{tab.description}</div>
            </div>
          </div>
        </Button>
      ))}
    </div>
  );
}

function ProfessionalAICreator() {
  const [selectedTool, setSelectedTool] = useState("image-generation");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [results, setResults] = useState<any[]>([]);

  const aiTools = [
    { 
      id: "image-generation", 
      name: "Image Generation",
      icon: ImageIcon,
      description: "DALL-E 3 Powered",
      model: "DALL-E 3",
      credits: 4,
      color: "rose"
    },
    { 
      id: "video-synthesis", 
      name: "Video Synthesis",
      icon: Video,
      description: "Runway ML",
      model: "Gen-2",
      credits: 15,
      color: "blue"
    },
    { 
      id: "voice-cloning", 
      name: "Voice Cloning",
      icon: Mic,
      description: "ElevenLabs",
      model: "Prime Voice AI",
      credits: 3,
      color: "green"
    },
    { 
      id: "music-composition", 
      name: "Music Composition",
      icon: Music,
      description: "Suno AI",
      model: "Bark v2",
      credits: 8,
      color: "purple"
    },
    { 
      id: "script-writing", 
      name: "Script Writing",
      icon: Edit3,
      description: "GPT-4 Turbo",
      model: "GPT-4-turbo",
      credits: 2,
      color: "orange"
    },
    { 
      id: "thumbnail-design", 
      name: "Thumbnail Design",
      icon: Layout,
      description: "AI Designer",
      model: "Stable Diffusion",
      credits: 6,
      color: "amber"
    }
  ];

  const generateContent = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setGenerationProgress(0);
    
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsGenerating(false);
          setResults([
            { id: 1, type: selectedTool, url: "https://images.unsplash.com/photo-1707343848552-893e05dba6ac?w=400" },
            { id: 2, type: selectedTool, url: "https://images.unsplash.com/photo-1707343848723-4f23abae9040?w=400" }
          ]);
          return 100;
        }
        return prev + 3;
      });
    }, 100);
  };

  const selectedToolData = aiTools.find(tool => tool.id === selectedTool);

  return (
    <div className="space-y-8 bg-gray-50 min-h-screen p-6">
      {/* Professional Tool Grid */}
      <Card className="border-2 border-slate-200 shadow-sm bg-white">
        <CardHeader className="pb-4 bg-white">
          <CardTitle className="text-xl text-slate-900">AI Generation Tools</CardTitle>
        </CardHeader>
        <CardContent className="bg-white">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {aiTools.map((tool) => (
              <Button
                key={tool.id}
                variant={selectedTool === tool.id ? "default" : "outline"}
                onClick={() => setSelectedTool(tool.id)}
                className={`h-24 p-3 flex flex-col border-2 transition-all duration-200 ${
                  getToolButtonClasses(tool.color, selectedTool === tool.id)
                }`}
              >
                <tool.icon className="h-6 w-6 mb-2" />
                <span className="text-xs font-medium text-center leading-tight">{tool.name}</span>
                <span className="text-xs opacity-75">{tool.model}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Professional Generation Interface */}
      <Card className="border-2 border-slate-200 shadow-sm bg-white">
        <CardHeader className="pb-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 ${getIconBgClasses(selectedToolData?.color || 'slate')} rounded-xl flex items-center justify-center`}>
                {selectedToolData && <selectedToolData.icon className="h-6 w-6 text-white" />}
              </div>
              <div>
                <CardTitle className="text-xl text-slate-900">{selectedToolData?.name}</CardTitle>
                <p className="text-slate-600">{selectedToolData?.description} • {selectedToolData?.model}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className={getBadgeClasses(selectedToolData?.color || 'slate')}>
                {selectedToolData?.credits} Credits
              </Badge>
              <Badge className="bg-green-100 text-green-700 border-green-200">
                Enterprise Tier
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 bg-white">
          {/* Professional Prompt Interface */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold text-slate-900">Generation Prompt</Label>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="border-slate-300 bg-white">
                  <Wand2 className="h-4 w-4 mr-2" />
                  AI Enhance
                </Button>
                <Button variant="outline" size="sm" className="border-slate-300 bg-white">
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Templates
                </Button>
              </div>
            </div>
            
            <Textarea
              placeholder={`Describe your ${selectedTool.replace('-', ' ')} requirements. Be specific about style, mood, format, and key elements.`}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="border-2 border-slate-200 focus:border-indigo-500 rounded-lg text-base resize-none bg-white"
            />
          </div>

          {/* Professional Parameters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-3">
              <Label className="font-semibold text-slate-900">Output Quality</Label>
              <Select defaultValue="ultra">
                <SelectTrigger className="border-2 border-slate-200 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard (2K)</SelectItem>
                  <SelectItem value="high">High Quality (4K)</SelectItem>
                  <SelectItem value="ultra">Ultra HD (8K)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="font-semibold text-slate-900">Style Preset</Label>
              <Select defaultValue="professional">
                <SelectTrigger className="border-2 border-slate-200 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="creative">Creative & Artistic</SelectItem>
                  <SelectItem value="minimal">Minimal & Clean</SelectItem>
                  <SelectItem value="cinematic">Cinematic</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="font-semibold text-slate-900">Format</Label>
              <Select defaultValue="1920x1080">
                <SelectTrigger className="border-2 border-slate-200 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1920x1080">Full HD (16:9)</SelectItem>
                  <SelectItem value="1080x1080">Square (1:1)</SelectItem>
                  <SelectItem value="1080x1920">Vertical (9:16)</SelectItem>
                  <SelectItem value="3840x2160">4K Ultra HD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="font-semibold text-slate-900">Priority</Label>
              <Select defaultValue="normal">
                <SelectTrigger className="border-2 border-slate-200 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High Priority (+50% credits)</SelectItem>
                  <SelectItem value="urgent">Urgent (+100% credits)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Professional Generation Controls */}
          <Card className="bg-slate-50 border-2 border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                  <div>
                    <span className="font-semibold text-slate-700">Estimated Time:</span>
                    <div className="text-indigo-600 font-medium">15-30 seconds</div>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Credit Cost:</span>
                    <div className="text-purple-600 font-medium">{selectedToolData?.credits} credits</div>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Success Rate:</span>
                    <div className="text-green-600 font-medium">99.8%</div>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Queue Position:</span>
                    <div className="text-blue-600 font-medium">#3</div>
                  </div>
                </div>
                
                <Button 
                  onClick={generateContent}
                  disabled={isGenerating || !prompt.trim()}
                  size="lg"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 font-semibold"
                >
                  {isGenerating ? (
                    <>
                      <LoadingSpinner className="mr-3 h-5 w-5" />
                      Generating... {generationProgress}%
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-3 h-5 w-5" />
                      Start Generation
                    </>
                  )}
                </Button>
              </div>

              {/* Professional Progress Display */}
              {isGenerating && (
                <div className="mt-6 space-y-4">
                  <Progress value={generationProgress} className="h-3">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300 rounded-full" 
                         style={{ width: `${generationProgress}%` }} />
                  </Progress>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Processing with {selectedToolData?.model}...</span>
                    <span>{generationProgress}% Complete</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Professional Results Gallery */}
      {results.length > 0 && (
        <Card className="border-2 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-slate-900">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <span>Generated Content</span>
              <Badge className="bg-green-100 text-green-700 border-green-200">{results.length} items</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result) => (
                <div key={result.id} className="relative group">
                  <div className="aspect-square bg-slate-100 border-2 border-slate-200 rounded-lg overflow-hidden">
                    <img 
                      src={result.url} 
                      alt="Generated content" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 rounded-lg flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                      <Button size="sm" className="bg-white text-black hover:bg-slate-100">
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                      <Button size="sm" className="bg-white text-black hover:bg-slate-100">
                        <Share className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                      <Button size="sm" className="bg-white text-black hover:bg-slate-100">
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ProfessionalVideoStudio() {
  const [selectedProject, setSelectedProject] = useState<File | null>(null);
  const [timelinePosition, setTimelinePosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTool, setSelectedTool] = useState("trim");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editingTools = [
    { id: "trim", name: "Trim & Cut", icon: Scissors, color: "blue" },
    { id: "effects", name: "Visual Effects", icon: Wand2, color: "purple" },
    { id: "transitions", name: "Transitions", icon: RotateCw, color: "green" },
    { id: "audio", name: "Audio Mixing", icon: Volume2, color: "orange" },
    { id: "text", name: "Text & Titles", icon: Type, color: "pink" },
    { id: "filters", name: "Color Grading", icon: Filter, color: "indigo" }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedProject(file);
    }
  };

  return (
    <div className="space-y-6">
      {!selectedProject ? (
        <Card className="border-2 border-slate-200 shadow-sm bg-white">
          <CardContent className="p-12 text-center">
            <div className="max-w-lg mx-auto space-y-8">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Video className="h-12 w-12 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-slate-900 mb-3">Professional Video Studio</h3>
                <p className="text-slate-600 text-lg">Upload your video file to begin editing with enterprise-grade tools and AI assistance</p>
              </div>
              <div className="space-y-4">
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  size="lg"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 text-lg font-semibold"
                >
                  <Upload className="mr-3 h-6 w-6" />
                  Upload Video File
                </Button>
                <p className="text-sm text-slate-500">Supports MP4, MOV, AVI, MKV up to 10GB</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-12 gap-6 h-[900px]">
          {/* Professional Tools Panel */}
          <div className="col-span-3 space-y-6">
            <Card className="border-2 border-slate-200 shadow-sm h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-slate-900">Editing Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {editingTools.map((tool) => (
                  <Button
                    key={tool.id}
                    variant={selectedTool === tool.id ? "default" : "outline"}
                    onClick={() => setSelectedTool(tool.id)}
                    className={`w-full justify-start h-12 border-2 ${
                      selectedTool === tool.id 
                        ? 'bg-indigo-600 hover:bg-indigo-700 border-indigo-600 text-white' 
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <tool.icon className="h-5 w-5 mr-3" />
                    {tool.name}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-slate-900">Export Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-slate-700">Resolution</Label>
                  <Select defaultValue="1080p">
                    <SelectTrigger className="mt-2 border-2 border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="720p">720p HD</SelectItem>
                      <SelectItem value="1080p">1080p Full HD</SelectItem>
                      <SelectItem value="4k">4K Ultra HD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700">Format</Label>
                  <Select defaultValue="mp4">
                    <SelectTrigger className="mt-2 border-2 border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mp4">MP4 (H.264)</SelectItem>
                      <SelectItem value="mov">MOV (ProRes)</SelectItem>
                      <SelectItem value="webm">WebM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white mt-4">
                  <Download className="h-4 w-4 mr-2" />
                  Export Video
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Professional Video Preview */}
          <div className="col-span-6 space-y-6">
            <Card className="border-2 border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="aspect-video bg-black rounded-lg flex items-center justify-center mb-6 border-2 border-slate-300">
                  <div className="text-center text-white">
                    <Play className="h-20 w-20 mx-auto mb-4 opacity-75" />
                    <p className="text-xl font-medium">{selectedProject.name}</p>
                    <p className="text-sm opacity-75 mt-2">Click to preview</p>
                  </div>
                </div>
                
                {/* Professional Video Controls */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Button size="sm" variant="outline" className="border-slate-300">
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      {isPlaying ? <PauseCircle className="h-5 w-5" /> : <PlayCircle className="h-5 w-5" />}
                    </Button>
                    <Button size="sm" variant="outline" className="border-slate-300">
                      <SkipForward className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 px-3">
                      <Slider
                        value={[timelinePosition]}
                        onValueChange={(value) => setTimelinePosition(value[0])}
                        max={100}
                        className="flex-1"
                      />
                    </div>
                    <Button size="sm" variant="outline" className="border-slate-300">
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-center text-sm text-slate-600">
                    00:01:23 / 00:05:47
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Timeline */}
            <Card className="border-2 border-slate-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-slate-900">Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-40 bg-slate-50 border-2 border-slate-200 rounded-lg p-4 space-y-3">
                  <div className="h-10 bg-indigo-500 rounded-lg flex items-center px-4 text-white text-sm font-medium">
                    Video Track 1
                  </div>
                  <div className="h-8 bg-green-500 rounded-lg flex items-center px-4 text-white text-sm font-medium">
                    Audio Track 1
                  </div>
                  <div className="h-8 bg-purple-500 rounded-lg flex items-center px-4 text-white text-sm font-medium">
                    Effects Track
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Professional Properties Panel */}
          <div className="col-span-3 space-y-6">
            <Card className="border-2 border-slate-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-slate-900">Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedTool === "effects" && (
                  <>
                    <div>
                      <Label className="text-sm font-medium text-slate-700">Brightness</Label>
                      <Slider defaultValue={[50]} max={100} className="mt-3" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-700">Contrast</Label>
                      <Slider defaultValue={[50]} max={100} className="mt-3" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-700">Saturation</Label>
                      <Slider defaultValue={[50]} max={100} className="mt-3" />
                    </div>
                  </>
                )}
                
                {selectedTool === "trim" && (
                  <>
                    <div>
                      <Label className="text-sm font-medium text-slate-700">Start Time</Label>
                      <Input defaultValue="00:00:00" className="mt-2 border-2 border-slate-200" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-700">End Time</Label>
                      <Input defaultValue="00:01:30" className="mt-2 border-2 border-slate-200" />
                    </div>
                  </>
                )}

                {selectedTool === "text" && (
                  <>
                    <div>
                      <Label className="text-sm font-medium text-slate-700">Text Content</Label>
                      <Input placeholder="Enter text..." className="mt-2 border-2 border-slate-200" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-700">Font Size</Label>
                      <Slider defaultValue={[24]} min={12} max={72} className="mt-3" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-700">Position</Label>
                      <Select defaultValue="center">
                        <SelectTrigger className="mt-2 border-2 border-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top">Top</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="bottom">Bottom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

// Main Professional Content Studio Component
export default function ContentStudio() {
  const [activeTab, setActiveTab] = useState("ai-creator");
  const { currentWorkspace } = useWorkspace();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <ProfessionalStudioHeader />
        <ProfessionalTabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="space-y-8">
          {activeTab === "ai-creator" && <ProfessionalAICreator />}
          {activeTab === "video-studio" && <ProfessionalVideoStudio />}
          {activeTab === "design-lab" && (
            <Card className="border-2 border-slate-200 shadow-sm bg-white">
              <CardContent className="p-20 text-center">
                <Palette className="h-16 w-16 mx-auto text-slate-400 mb-6" />
                <h3 className="text-2xl font-bold text-slate-700 mb-4">Design Lab</h3>
                <p className="text-slate-600 text-lg">Advanced design tools and creative workflows coming soon</p>
              </CardContent>
            </Card>
          )}
          {activeTab === "automation-hub" && (
            <Card className="border-2 border-slate-200 shadow-sm bg-white">
              <CardContent className="p-20 text-center">
                <Bot className="h-16 w-16 mx-auto text-slate-400 mb-6" />
                <h3 className="text-2xl font-bold text-slate-700 mb-4">Automation Hub</h3>
                <p className="text-slate-600 text-lg">Intelligent workflow automation and AI assistants coming soon</p>
              </CardContent>
            </Card>
          )}
          {activeTab === "analytics-center" && (
            <Card className="border-2 border-slate-200 shadow-sm bg-white">
              <CardContent className="p-20 text-center">
                <TrendingUp className="h-16 w-16 mx-auto text-slate-400 mb-6" />
                <h3 className="text-2xl font-bold text-slate-700 mb-4">Analytics Center</h3>
                <p className="text-slate-600 text-lg">Advanced performance analytics and intelligence reports coming soon</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}