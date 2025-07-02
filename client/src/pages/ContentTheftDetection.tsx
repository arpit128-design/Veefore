import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Shield, Search, AlertTriangle, Eye, Copy, ExternalLink, FileText, Clock, Globe, Zap, CheckCircle, XCircle } from "lucide-react";

interface ContentTheftResult {
  originalityScore: number;
  duplicateCount: number;
  potentialThefts: Array<{
    url: string;
    similarity: number;
    platform: string;
    dateFound: string;
    status: 'confirmed' | 'potential' | 'false_positive';
    excerpt: string;
    recommendedAction: string;
  }>;
  protectionStrategies: string[];
  legalOptions: Array<{
    action: string;
    complexity: 'low' | 'medium' | 'high';
    cost: string;
    timeline: string;
    successRate: number;
  }>;
  monitoringSetup: {
    keywords: string[];
    platforms: string[];
    frequency: string;
  };
}

interface ProtectionAudit {
  contentType: string;
  vulnerabilityScore: number;
  weaknesses: string[];
  recommendations: string[];
  copyrightStatus: 'protected' | 'partial' | 'vulnerable';
  watermarkSuggestions: string[];
}

export default function ContentTheftDetection() {
  const [contentUrl, setContentUrl] = useState("");
  const [contentText, setContentText] = useState("");
  const [monitoringKeywords, setMonitoringKeywords] = useState("");
  const [scanType, setScanType] = useState<'url' | 'text'>('url');
  const { toast } = useToast();

  const [theftResult, setTheftResult] = useState<any>(null);

  const detectTheftMutation = useMutation({
    mutationFn: async (data: { url?: string; text?: string; scanType: string }) => {
      const response = await apiRequest('POST', '/api/ai/content-theft', {
        originalContent: data.url || data.text || '',
        contentType: data.scanType === 'url' ? 'mixed' : 'text',
        platforms: ['instagram', 'youtube', 'twitter', 'tiktok'],
        searchDepth: 'comprehensive',
        includePartialMatches: true,
        timeframe: '30d'
      });
      return response.json();
    },
    onSuccess: (data) => {
      setTheftResult(data);
      toast({
        title: "Content Theft Analysis Complete",
        description: "Your content has been scanned for potential theft and plagiarism.",
      });
    },
    onError: (error: any) => {
      console.error('Content theft analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Unable to complete theft detection analysis. Please try again.",
        variant: "destructive",
      });
    },
  });

  const protectionAuditMutation = useMutation({
    mutationFn: (data: { contentType: string; keywords: string[] }) =>
      apiRequest('POST', '/api/ai/content-protection-audit', data),
    onSuccess: () => {
      toast({
        title: "Protection Audit Complete",
        description: "Your content protection strategy has been analyzed.",
      });
    },
  });

  const setupMonitoringMutation = useMutation({
    mutationFn: (data: { keywords: string[]; platforms: string[]; frequency: string }) =>
      apiRequest('POST', '/api/ai/setup-monitoring', data),
    onSuccess: () => {
      toast({
        title: "Monitoring Setup Complete",
        description: "Automated content theft monitoring is now active.",
      });
    },
  });

  const handleDetectTheft = () => {
    if (scanType === 'url' && !contentUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a content URL to scan.",
        variant: "destructive",
      });
      return;
    }

    if (scanType === 'text' && !contentText.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter content text to analyze.",
        variant: "destructive",
      });
      return;
    }

    detectTheftMutation.mutate({
      url: scanType === 'url' ? contentUrl : undefined,
      text: scanType === 'text' ? contentText : undefined,
      scanType
    });
  };

  const handleProtectionAudit = () => {
    const keywords = monitoringKeywords.split(',').map(k => k.trim()).filter(Boolean);
    protectionAuditMutation.mutate({
      contentType: 'mixed',
      keywords
    });
  };

  const handleSetupMonitoring = () => {
    const keywords = monitoringKeywords.split(',').map(k => k.trim()).filter(Boolean);
    if (keywords.length === 0) {
      toast({
        title: "Keywords Required",
        description: "Please enter keywords for monitoring setup.",
        variant: "destructive",
      });
      return;
    }

    setupMonitoringMutation.mutate({
      keywords,
      platforms: ['instagram', 'youtube', 'tiktok', 'twitter', 'web'],
      frequency: 'daily'
    });
  };

  // Real API data will be stored in theftResult state

  return (
    <div className="min-h-screen bg-transparent">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
            Content Theft Detection
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Protect your intellectual property with AI-powered content theft detection and automated monitoring
          </p>
        </div>

        <Tabs defaultValue="detection" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900/50">
            <TabsTrigger value="detection" className="data-[state=active]:bg-red-600">
              <Shield className="h-4 w-4 mr-2" />
              Detection
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-orange-600">
              <Eye className="h-4 w-4 mr-2" />
              Monitoring
            </TabsTrigger>
            <TabsTrigger value="protection" className="data-[state=active]:bg-yellow-600">
              <FileText className="h-4 w-4 mr-2" />
              Protection
            </TabsTrigger>
            <TabsTrigger value="legal" className="data-[state=active]:bg-purple-600">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Legal Actions
            </TabsTrigger>
          </TabsList>

          {/* Content Detection Tab */}
          <TabsContent value="detection" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-red-400" />
                  Content Theft Scanner
                </CardTitle>
                <CardDescription>
                  Scan your content for unauthorized copies and plagiarism across the web
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={scanType === 'url' ? 'default' : 'outline'}
                    onClick={() => setScanType('url')}
                    className="w-full"
                  >
                    Scan by URL
                  </Button>
                  <Button
                    variant={scanType === 'text' ? 'default' : 'outline'}
                    onClick={() => setScanType('text')}
                    className="w-full"
                  >
                    Scan by Text
                  </Button>
                </div>

                {scanType === 'url' ? (
                  <div className="space-y-2">
                    <Label>Content URL</Label>
                    <Input
                      placeholder="https://your-content-url.com"
                      value={contentUrl}
                      onChange={(e) => setContentUrl(e.target.value)}
                      className="bg-gray-800 border-gray-600"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Content Text</Label>
                    <Textarea
                      placeholder="Paste your content text here..."
                      rows={4}
                      value={contentText}
                      onChange={(e) => setContentText(e.target.value)}
                      className="bg-gray-800 border-gray-600"
                    />
                  </div>
                )}

                <Button 
                  onClick={handleDetectTheft} 
                  disabled={detectTheftMutation.isPending}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                >
                  {detectTheftMutation.isPending ? (
                    <>
                      <Search className="mr-2 h-4 w-4 animate-spin" />
                      Scanning for Theft...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Scan for Content Theft (7 Credits)
                    </>
                  )}
                </Button>

                {/* Real API Results Display */}
                {theftResult && (
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-red-400">Scan Results</h4>
                      <Badge variant="secondary" className="bg-red-900/50 text-red-300">
                        {theftResult.summary?.totalMatches || 0} matches found
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Protection Score</span>
                        <span className="text-green-400">{theftResult.analysis?.protectionScore || 0}%</span>
                      </div>
                      <Progress value={theftResult.analysis?.protectionScore || 0} className="h-2" />
                    </div>

                    <div className="space-y-3">
                      {theftResult.detectedTheft?.map((theft: any, index: number) => (
                        <Card key={index} className="bg-gray-800/50 border-gray-600">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2">
                                  <Badge 
                                    variant={theft.matchType === 'exact' ? 'destructive' : 'secondary'}
                                    className="text-xs"
                                  >
                                    {theft.similarity}% match
                                  </Badge>
                                  <span className="text-sm text-gray-400">{theft.platform}</span>
                                  <span className="text-xs text-gray-500">{theft.timestamp}</span>
                                </div>
                                <p className="text-sm text-gray-300">{theft.content}</p>
                                <p className="text-xs text-blue-400">Author: {theft.author}</p>
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="ml-4"
                                onClick={() => window.open(theft.url, '_blank')}
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Display Recommendations */}
                  {theftResult.recommendations && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <Card className="bg-gray-800/50 border-gray-600">
                          <CardContent className="p-4">
                            <h5 className="font-medium text-yellow-400 mb-2">Immediate Actions</h5>
                            <ul className="space-y-1 text-sm">
                              {theftResult.recommendations.immediateActions?.map((action: string, index: number) => (
                                <li key={index} className="text-gray-300">• {action}</li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>

                        <Card className="bg-gray-800/50 border-gray-600">
                          <CardContent className="p-4">
                            <h5 className="font-medium text-green-400 mb-2">Prevention Strategies</h5>
                            <ul className="space-y-1 text-sm">
                              {theftResult.recommendations.preventionStrategies?.map((strategy: string, index: number) => (
                                <li key={index} className="text-gray-300">• {strategy}</li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                )}

                {!theftResult && !detectTheftMutation.isPending && (
                  <div className="text-center py-8 text-gray-400">
                    <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Run a content theft scan to see results here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monitoring Setup Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-orange-400" />
                  Automated Monitoring Setup
                </CardTitle>
                <CardDescription>
                  Set up continuous monitoring for your content across platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Monitoring Keywords</Label>
                  <Textarea
                    placeholder="Enter keywords and phrases to monitor (comma-separated)"
                    rows={3}
                    value={monitoringKeywords}
                    onChange={(e) => setMonitoringKeywords(e.target.value)}
                    className="bg-gray-800 border-gray-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Scan Frequency</Label>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">Daily</Button>
                      <Button size="sm" variant="secondary" className="flex-1">Weekly</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Alert Method</Label>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">Email</Button>
                      <Button size="sm" variant="secondary" className="flex-1">Dashboard</Button>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleSetupMonitoring} 
                  disabled={setupMonitoringMutation.isPending}
                  className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700"
                >
                  {setupMonitoringMutation.isPending ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Setting Up Monitoring...
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Setup Automated Monitoring (5 Credits)
                    </>
                  )}
                </Button>

                {/* Current Monitoring Status */}
                <Card className="bg-gray-800/50 border-gray-600">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-orange-400 mb-3">Current Monitoring Status</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Active Keywords:</span>
                        <span className="text-orange-400">12</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Platforms Monitored:</span>
                        <span className="text-orange-400">5</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Last Scan:</span>
                        <span className="text-orange-400">2 hours ago</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Next Scan:</span>
                        <span className="text-orange-400">In 22 hours</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Protection Audit Tab */}
          <TabsContent value="protection" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-yellow-400" />
                  Content Protection Audit
                </CardTitle>
                <CardDescription>
                  Analyze your content's vulnerability and get protection recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleProtectionAudit} 
                  disabled={protectionAuditMutation.isPending}
                  className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700"
                >
                  {protectionAuditMutation.isPending ? (
                    <>
                      <Zap className="mr-2 h-4 w-4 animate-spin" />
                      Running Protection Audit...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Run Protection Audit (4 Credits)
                    </>
                  )}
                </Button>

                {/* Protection Audit Results - Real API data will be shown here */}
                {!protectionAuditMutation.isPending && (
                  <div className="text-center py-8 text-gray-400">
                    <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Run a protection audit to see vulnerability analysis and recommendations</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Legal Actions Tab */}
          <TabsContent value="legal" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-purple-400" />
                  Legal Action Guidance
                </CardTitle>
                <CardDescription>
                  Get guidance on legal options for protecting your content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Legal options will be shown here after content theft analysis */}
                {!theftDetectionMutation.isPending && !theftResult && (
                  <div className="text-center py-8 text-gray-400">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Run content theft detection to see legal action recommendations</p>
                  </div>
                )}

                {theftResult?.legalOptions && (
                  <div className="space-y-4">
                    {theftResult.legalOptions.map((option, index) => (
                      <Card key={index} className="bg-gray-800/50 border-gray-600">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <h5 className="font-medium text-purple-400">{option.action}</h5>
                                <Badge 
                                  variant={option.complexity === 'low' ? 'secondary' : 'destructive'}
                                  className="text-xs"
                                >
                                  {option.complexity} complexity
                                </Badge>
                              </div>
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-400">Cost: </span>
                                  <span className="text-green-400">{option.cost}</span>
                                </div>
                                <div>
                                  <span className="text-gray-400">Timeline: </span>
                                  <span className="text-blue-400">{option.timeline}</span>
                                </div>
                                <div>
                                  <span className="text-gray-400">Success Rate: </span>
                                  <span className="text-yellow-400">{option.successRate}%</span>
                                </div>
                              </div>
                            </div>
                            <Button size="sm" variant="outline" className="ml-4">
                              Learn More
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                <Card className="bg-gray-800/50 border-gray-600">
                  <CardContent className="p-4">
                    <h5 className="font-medium text-purple-400 mb-2">Quick Legal Resources</h5>
                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm" variant="outline" className="justify-start">
                        <FileText className="h-3 w-3 mr-2" />
                        DMCA Template
                      </Button>
                      <Button size="sm" variant="outline" className="justify-start">
                        <Globe className="h-3 w-3 mr-2" />
                        Copyright Guide
                      </Button>
                      <Button size="sm" variant="outline" className="justify-start">
                        <Copy className="h-3 w-3 mr-2" />
                        Evidence Collection
                      </Button>
                      <Button size="sm" variant="outline" className="justify-start">
                        <AlertTriangle className="h-3 w-3 mr-2" />
                        Legal Consultation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}