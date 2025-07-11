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
  recommendations?: {
    immediateActions?: string[];
    preventionStrategies?: string[];
  };
}

export default function ContentTheftDetection() {
  const [contentUrl, setContentUrl] = useState("");
  const [contentText, setContentText] = useState("");
  const [monitoringKeywords, setMonitoringKeywords] = useState("");
  const [scanType, setScanType] = useState<'url' | 'text'>('url');
  const { toast } = useToast();

  const [theftResult, setTheftResult] = useState<ContentTheftResult | null>(null);

  // Content Theft Detection Mutation
  const theftDetectionMutation = useMutation({
    mutationFn: async (data: { url?: string; text?: string; scanType: string }) => {
      const response = await apiRequest('POST', '/api/ai/content-theft', {
        originalContent: data.url || data.text || '',
        contentType: data.scanType === 'url' ? 'mixed' : 'text',
        platforms: ['instagram', 'youtube', 'tiktok', 'twitter'],
        monitoringEnabled: true
      });
      return response as ContentTheftResult;
    },
    onSuccess: (data) => {
      setTheftResult(data);
      toast({
        title: "Content Theft Analysis Complete",
        description: `Found ${data.duplicateCount} potential duplicates with ${data.originalityScore}% originality score.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze content for theft detection",
        variant: "destructive",
      });
    },
  });

  // Protection Audit Mutation
  const protectionAuditMutation = useMutation({
    mutationFn: async (data: { content: string; contentType: string }) => {
      const response = await apiRequest('POST', '/api/ai/content-theft-audit', {
        content: data.content,
        contentType: data.contentType,
        auditLevel: 'comprehensive'
      });
      return response;
    },
    onSuccess: (data) => {
      toast({
        title: "Protection Audit Complete",
        description: "Your content protection analysis is ready.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Audit Failed",
        description: error.message || "Failed to perform protection audit",
        variant: "destructive",
      });
    },
  });

  const handleDetectTheft = () => {
    if (!contentUrl && !contentText) {
      toast({
        title: "Content Required",
        description: "Please provide content URL or text to analyze",
        variant: "destructive",
      });
      return;
    }

    theftDetectionMutation.mutate({
      url: scanType === 'url' ? contentUrl : undefined,
      text: scanType === 'text' ? contentText : undefined,
      scanType
    });
  };

  const handleProtectionAudit = () => {
    const content = scanType === 'url' ? contentUrl : contentText;
    if (!content) {
      toast({
        title: "Content Required",
        description: "Please provide content to audit",
        variant: "destructive",
      });
      return;
    }

    protectionAuditMutation.mutate({
      content,
      contentType: scanType
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Content Theft Detection
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Protect your digital content with AI-powered theft detection, legal guidance, and comprehensive monitoring solutions
          </p>
        </div>

        <Tabs defaultValue="detection" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border-gray-600">
            <TabsTrigger value="detection" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Detection
            </TabsTrigger>
            <TabsTrigger value="protection" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Protection
            </TabsTrigger>
            <TabsTrigger value="legal" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Legal Actions
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Monitoring
            </TabsTrigger>
          </TabsList>

          {/* Content Theft Detection Tab */}
          <TabsContent value="detection" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-blue-400" />
                  Content Theft Scanner
                </CardTitle>
                <CardDescription>
                  Analyze your content for potential theft across social media platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Scan Type Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={scanType === 'url' ? 'default' : 'outline'}
                    onClick={() => setScanType('url')}
                    className="flex items-center gap-2"
                  >
                    <Globe className="h-4 w-4" />
                    Scan URL
                  </Button>
                  <Button
                    variant={scanType === 'text' ? 'default' : 'outline'}
                    onClick={() => setScanType('text')}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Scan Text
                  </Button>
                </div>

                {/* Input Fields */}
                {scanType === 'url' ? (
                  <div className="space-y-2">
                    <Label htmlFor="contentUrl">Content URL</Label>
                    <Input
                      id="contentUrl"
                      placeholder="https://example.com/your-content"
                      value={contentUrl}
                      onChange={(e) => setContentUrl(e.target.value)}
                      className="bg-gray-800/50 border-gray-600"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="contentText">Content Text</Label>
                    <Textarea
                      id="contentText"
                      placeholder="Paste your content text here..."
                      value={contentText}
                      onChange={(e) => setContentText(e.target.value)}
                      className="bg-gray-800/50 border-gray-600 min-h-[120px]"
                    />
                  </div>
                )}

                {/* Scan Button */}
                <Button 
                  onClick={handleDetectTheft}
                  disabled={theftDetectionMutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  size="lg"
                >
                  {theftDetectionMutation.isPending ? (
                    <>
                      <Search className="mr-2 h-4 w-4 animate-spin" />
                      Scanning Content...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Detect Theft (7 Credits)
                    </>
                  )}
                </Button>

                {/* Results Display */}
                {theftResult && (
                  <div className="space-y-6">
                    {/* Originality Score */}
                    <Card className="bg-gray-800/50 border-gray-600">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-blue-400">Originality Score</h4>
                          <Badge 
                            variant={theftResult.originalityScore > 80 ? 'secondary' : 'destructive'}
                            className="text-lg px-3 py-1"
                          >
                            {theftResult.originalityScore}%
                          </Badge>
                        </div>
                        <Progress value={theftResult.originalityScore} className="h-3" />
                        <p className="text-sm text-gray-400 mt-2">
                          Found {theftResult.duplicateCount} potential duplicates across platforms
                        </p>
                      </CardContent>
                    </Card>

                    {/* Potential Thefts */}
                    {theftResult.potentialThefts && theftResult.potentialThefts.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-red-400 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Potential Content Theft Detected
                        </h4>
                        <div className="grid gap-4">
                          {theftResult.potentialThefts.map((theft, index) => (
                            <Card key={index} className="bg-gray-800/50 border-gray-600">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-2">
                                      <Badge 
                                        variant={theft.status === 'confirmed' ? 'destructive' : 'secondary'}
                                        className="text-xs"
                                      >
                                        {theft.status.replace('_', ' ')}
                                      </Badge>
                                      <span className="text-sm text-gray-400">{theft.platform}</span>
                                      <span className="text-sm text-blue-400">{theft.similarity}% similar</span>
                                    </div>
                                    <p className="text-sm text-gray-300">{theft.excerpt}</p>
                                    <p className="text-xs text-blue-400">{theft.recommendedAction}</p>
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
                              </CardContent>
                            </Card>
                          ))}
                        </div>

                        {/* Recommendations */}
                        {theftResult.recommendations && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            <Card className="bg-gray-800/50 border-gray-600">
                              <CardContent className="p-4">
                                <h5 className="font-medium text-blue-400 mb-2">Immediate Actions</h5>
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

                    {/* No Theft Found */}
                    {theftResult.potentialThefts && theftResult.potentialThefts.length === 0 && (
                      <Card className="bg-green-900/20 border-green-600">
                        <CardContent className="p-6 text-center">
                          <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                          <h4 className="font-semibold text-green-400 mb-2">No Content Theft Detected</h4>
                          <p className="text-gray-300">Your content appears to be original and unique across monitored platforms.</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {/* Empty State */}
                {!theftResult && !theftDetectionMutation.isPending && (
                  <div className="text-center py-8 text-gray-400">
                    <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Run content theft detection to see results here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Protection Audit Tab */}
          <TabsContent value="protection" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-400" />
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
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  size="lg"
                >
                  {protectionAuditMutation.isPending ? (
                    <>
                      <Shield className="mr-2 h-4 w-4 animate-spin" />
                      Running Protection Audit...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Run Protection Audit (4 Credits)
                    </>
                  )}
                </Button>

                {/* Protection audit results would be shown here */}
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
                                  <span className="text-emerald-400">{option.successRate}%</span>
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

          {/* Monitoring Setup Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-400" />
                  Content Monitoring Setup
                </CardTitle>
                <CardDescription>
                  Set up automated monitoring for your content across platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="keywords">Monitoring Keywords</Label>
                  <Textarea
                    id="keywords"
                    placeholder="Enter keywords to monitor (one per line)"
                    value={monitoringKeywords}
                    onChange={(e) => setMonitoringKeywords(e.target.value)}
                    className="bg-gray-800/50 border-gray-600 min-h-[100px]"
                  />
                </div>

                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Eye className="mr-2 h-4 w-4" />
                  Setup Monitoring (5 Credits/month)
                </Button>

                {theftResult?.monitoringSetup && (
                  <Card className="bg-gray-800/50 border-gray-600">
                    <CardContent className="p-4">
                      <h5 className="font-medium text-blue-400 mb-2">Current Monitoring Setup</h5>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-gray-400">Platforms:</span> {theftResult.monitoringSetup.platforms.join(', ')}</p>
                        <p><span className="text-gray-400">Keywords:</span> {theftResult.monitoringSetup.keywords.join(', ')}</p>
                        <p><span className="text-gray-400">Frequency:</span> {theftResult.monitoringSetup.frequency}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}