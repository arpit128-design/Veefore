import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { Languages, Globe, Sparkles, ArrowRight, Target, Lightbulb, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ContentRepurpose() {
  const [isLoading, setIsLoading] = useState(false);
  const [sourceContent, setSourceContent] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");
  const [contentType, setContentType] = useState("");
  const [platform, setPlatform] = useState("");
  const [tone, setTone] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [culturalContext, setCulturalContext] = useState("");
  const [result, setResult] = useState<any>(null);

  const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "it", label: "Italian" },
    { value: "pt", label: "Portuguese" },
    { value: "zh", label: "Chinese" },
    { value: "ja", label: "Japanese" },
    { value: "ko", label: "Korean" },
    { value: "ar", label: "Arabic" },
    { value: "hi", label: "Hindi" },
    { value: "ru", label: "Russian" }
  ];

  const platforms = [
    "Instagram", "Facebook", "Twitter", "LinkedIn", 
    "TikTok", "YouTube", "Pinterest", "Snapchat"
  ];

  const contentTypes = [
    "caption", "hashtags", "script", "title", "description"
  ];

  const tones = [
    "Professional", "Casual", "Humorous", "Inspirational", 
    "Educational", "Persuasive", "Friendly", "Formal"
  ];

  const handleSubmit = async () => {
    if (!sourceContent || !sourceLanguage || !targetLanguage || !contentType || !platform) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const repurposeData = {
        sourceContent,
        sourceLanguage,
        targetLanguage,
        contentType,
        platform,
        tone,
        targetAudience,
        culturalContext
      };

      console.log('[CONTENT REPURPOSE] Sending request:', repurposeData);

      const res = await apiRequest('POST', '/api/ai/content-repurpose', repurposeData);
      const response = await res.json();

      console.log('[CONTENT REPURPOSE] Received response:', response);

      setResult(response);

      toast({
        title: "Content Repurposed Successfully!",
        description: `Used ${response.creditsUsed} credits. ${response.remainingCredits} credits remaining.`,
      });

    } catch (error: any) {
      console.error('[CONTENT REPURPOSE] Error:', error);
      toast({
        title: "Repurposing Failed",
        description: error.message || "Failed to repurpose content",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-void via-nebula-purple/20 to-cosmic-void text-white relative overflow-hidden">
      {/* Cosmic Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-electric-cyan/10 to-nebula-purple/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-solar-gold/10 to-electric-cyan/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-60 h-60 bg-gradient-to-r from-nebula-purple/10 to-solar-gold/10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-electric-cyan/20 backdrop-blur-sm border border-electric-cyan/30 mb-4">
            <Languages className="w-8 h-8 text-electric-cyan" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-electric-cyan via-nebula-purple to-solar-gold bg-clip-text text-transparent mb-4">
            AI Content Repurpose Engine
          </h1>
          <p className="text-xl text-asteroid-silver max-w-2xl mx-auto">
            Transform your content across languages, platforms, and audiences with advanced AI localization
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="bg-transparent border border-electric-cyan/30 backdrop-blur-sm shadow-2xl shadow-electric-cyan/10 rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Globe className="w-5 h-5 text-electric-cyan" />
                Content Repurposing Configuration
              </CardTitle>
              <CardDescription className="text-asteroid-silver">
                Configure your content transformation settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Source Content */}
              <div className="space-y-2">
                <Label htmlFor="sourceContent" className="text-white">Source Content *</Label>
                <Textarea
                  id="sourceContent"
                  value={sourceContent}
                  onChange={(e) => setSourceContent(e.target.value)}
                  placeholder="Enter your original content to be repurposed..."
                  className="min-h-[120px] bg-cosmic-void/50 backdrop-blur-sm border border-electric-cyan/30 text-white placeholder:text-asteroid-silver focus:border-electric-cyan focus:ring-2 focus:ring-electric-cyan/20 rounded-lg transition-all"
                />
              </div>

              {/* Language Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Source Language *</Label>
                  <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                    <SelectTrigger className="bg-cosmic-dark/50 border-electric-cyan/30">
                      <SelectValue placeholder="Select source language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Target Language *</Label>
                  <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                    <SelectTrigger className="bg-cosmic-dark/50 border-electric-cyan/30">
                      <SelectValue placeholder="Select target language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Content Type & Platform */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Content Type *</Label>
                  <Select value={contentType} onValueChange={setContentType}>
                    <SelectTrigger className="bg-cosmic-dark/50 border-electric-cyan/30">
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Target Platform *</Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger className="bg-cosmic-dark/50 border-electric-cyan/30">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map((plat) => (
                        <SelectItem key={plat} value={plat}>
                          {plat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Optional Settings */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger className="bg-cosmic-dark/50 border-electric-cyan/30">
                      <SelectValue placeholder="Select tone (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {tones.map((toneOption) => (
                        <SelectItem key={toneOption} value={toneOption}>
                          {toneOption}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetAudience" className="text-white">Target Audience</Label>
                  <Input
                    id="targetAudience"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g., Young professionals, Tech enthusiasts"
                    className="bg-cosmic-dark/50 border-electric-cyan/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="culturalContext" className="text-white">Cultural Context</Label>
                  <Input
                    id="culturalContext"
                    value={culturalContext}
                    onChange={(e) => setCulturalContext(e.target.value)}
                    placeholder="e.g., Urban millennials, Conservative audience"
                    className="bg-cosmic-dark/50 border-electric-cyan/30"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSubmit} 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-electric-cyan to-nebula-purple hover:from-electric-cyan/80 hover:to-nebula-purple/80 text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-electric-cyan/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Repurposing Content...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Repurpose Content (2 Credits)
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Results */}
          <Card className="glassmorphism border-electric-cyan/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Target className="w-5 h-5 text-teal-400" />
                Repurposed Content Results
              </CardTitle>
              <CardDescription className="text-nebula-gray">
                AI-generated localized content variations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-6">
                    {/* Main Repurposed Content */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-teal-400" />
                        <h3 className="text-lg font-semibold text-white">Repurposed Content</h3>
                      </div>
                      <div className="bg-cosmic-dark/50 border border-electric-cyan/30 rounded-lg p-4">
                        <p className="text-white whitespace-pre-wrap">{result.repurposed.repurposedContent}</p>
                      </div>
                    </div>

                    {/* Quality Score */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-400" />
                        Quality Score
                      </h3>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-cosmic-dark/50 rounded-full h-3">
                          <div 
                            className="h-3 rounded-full holographic-gradient" 
                            style={{ width: `${result.repurposed.qualityScore}%` }}
                          ></div>
                        </div>
                        <Badge variant="outline" className="border-electric-cyan text-electric-cyan">
                          {result.repurposed.qualityScore}%
                        </Badge>
                      </div>
                    </div>

                    {/* Cultural Adaptations */}
                    {result.repurposed.culturalAdaptations.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white">Cultural Adaptations</h3>
                        <div className="space-y-2">
                          {result.repurposed.culturalAdaptations.map((adaptation: string, index: number) => (
                            <div key={index} className="bg-cosmic-dark/30 border border-nebula-purple/30 rounded-lg p-3">
                              <p className="text-nebula-gray text-sm">{adaptation}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Alternative Versions */}
                    {result.repurposed.alternativeVersions.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white">Alternative Versions</h3>
                        <div className="space-y-3">
                          {result.repurposed.alternativeVersions.map((version: string, index: number) => (
                            <div key={index} className="bg-cosmic-dark/30 border border-blue-500/30 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary" className="text-xs">
                                  Version {index + 1}
                                </Badge>
                              </div>
                              <p className="text-white text-sm whitespace-pre-wrap">{version}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Localization Notes */}
                    {result.repurposed.localizationNotes && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white">Localization Notes</h3>
                        <div className="bg-cosmic-dark/30 border border-electric-cyan/30 rounded-lg p-4">
                          <p className="text-nebula-gray text-sm">{result.repurposed.localizationNotes}</p>
                        </div>
                      </div>
                    )}

                    {/* Credits Used */}
                    <div className="mt-6 pt-4 border-t border-electric-cyan/20">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-nebula-gray">Credits Used:</span>
                        <Badge variant="outline" className="border-blue-500 text-blue-500">
                          {result.creditsUsed} credits
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center text-sm mt-2">
                        <span className="text-nebula-gray">Remaining Credits:</span>
                        <Badge variant="outline" className="border-electric-cyan text-electric-cyan">
                          {result.remainingCredits} credits
                        </Badge>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-12">
                  <Globe className="w-16 h-16 text-teal-400/30 mx-auto mb-4" />
                  <p className="text-nebula-gray">
                    Configure your content repurposing settings and click "Repurpose Content" to see results
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}