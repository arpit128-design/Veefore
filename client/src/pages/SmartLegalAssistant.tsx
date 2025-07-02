import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { FileText, Download, Scale, MessageSquare, Shield, AlertTriangle, Users, Handshake, Eye, Zap, Sparkles, Bot, Gavel, HelpCircle } from "lucide-react";

interface LegalTemplate {
  id: string;
  title: string;
  category: 'influencer' | 'brand_deal' | 'music_usage' | 'nda' | 'collaboration' | 'general';
  description: string;
  downloadUrl: string;
  lastUpdated: string;
  popularity: number;
  jurisdiction: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  requiredFields: string[];
}

interface LegalQuery {
  question: string;
  category: string;
  urgency: 'low' | 'medium' | 'high';
  jurisdiction: string;
}

interface LegalAdvice {
  answer: string;
  confidence: number;
  disclaimer: string;
  relatedTemplates: string[];
  suggestedActions: string[];
  riskLevel: 'low' | 'medium' | 'high';
  legalComplexity: number;
}

interface ContractGenerator {
  contractType: string;
  parties: {
    party1: { name: string; type: 'individual' | 'company'; jurisdiction: string };
    party2: { name: string; type: 'individual' | 'company'; jurisdiction: string };
  };
  terms: {
    duration: string;
    compensation: string;
    deliverables: string[];
    exclusivityClause: boolean;
    terminationClause: boolean;
  };
  customClauses: string[];
}

export default function SmartLegalAssistant() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [legalQuery, setLegalQuery] = useState("");
  const [contractType, setContractType] = useState("");
  const [jurisdiction, setJurisdiction] = useState("us");
  const { toast } = useToast();

  const askLegalBotMutation = useMutation({
    mutationFn: (data: LegalQuery) => apiRequest('POST', '/api/ai/legal-assistant', data),
    onSuccess: (data: LegalAdvice) => {
      toast({
        title: "Legal Analysis Complete",
        description: `Confidence level: ${data.confidence}% • Risk level: ${data.riskLevel}`
      });
    },
    onError: () => {
      toast({
        title: "Legal Query Failed",
        description: "Unable to process legal question. Please try again.",
        variant: "destructive"
      });
    }
  });

  const generateContractMutation = useMutation({
    mutationFn: (data: ContractGenerator) => apiRequest('POST', '/api/ai/contract-generator', data),
    onSuccess: () => {
      toast({
        title: "Contract Generated",
        description: "Your custom legal document is ready for download"
      });
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Unable to generate contract. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Mock legal templates
  const mockTemplates: LegalTemplate[] = [
    {
      id: "1",
      title: "Influencer Collaboration Agreement",
      category: "influencer",
      description: "Comprehensive agreement for brand collaborations and sponsored content",
      downloadUrl: "/templates/influencer-agreement.pdf",
      lastUpdated: "2024-12-15",
      popularity: 95,
      jurisdiction: "US",
      difficulty: "beginner",
      requiredFields: ["Influencer Name", "Brand Name", "Content Requirements", "Compensation"]
    },
    {
      id: "2",
      title: "Music Usage Rights Agreement",
      category: "music_usage",
      description: "License agreement for using copyrighted music in content",
      downloadUrl: "/templates/music-usage.pdf",
      lastUpdated: "2024-12-10",
      popularity: 87,
      jurisdiction: "International",
      difficulty: "intermediate",
      requiredFields: ["Track Name", "Artist", "Usage Type", "Duration"]
    },
    {
      id: "3",
      title: "Brand Deal Contract",
      category: "brand_deal",
      description: "Standard brand partnership agreement with performance metrics",
      downloadUrl: "/templates/brand-deal.pdf",
      lastUpdated: "2024-12-20",
      popularity: 92,
      jurisdiction: "US/EU",
      difficulty: "intermediate",
      requiredFields: ["Brand Name", "Campaign Details", "KPIs", "Payment Terms"]
    },
    {
      id: "4",
      title: "Non-Disclosure Agreement (NDA)",
      category: "nda",
      description: "Mutual NDA for protecting confidential information in partnerships",
      downloadUrl: "/templates/nda.pdf",
      lastUpdated: "2024-12-18",
      popularity: 78,
      jurisdiction: "US",
      difficulty: "beginner",
      requiredFields: ["Party Names", "Confidential Information", "Duration"]
    },
    {
      id: "5",
      title: "Content Collaboration Agreement",
      category: "collaboration",
      description: "Agreement for collaborative content creation and revenue sharing",
      downloadUrl: "/templates/collaboration.pdf",
      lastUpdated: "2024-12-12",
      popularity: 84,
      jurisdiction: "US",
      difficulty: "advanced",
      requiredFields: ["Collaborator Names", "Content Type", "Revenue Split", "Ownership Rights"]
    }
  ];

  const filteredTemplates = selectedCategory === "all" 
    ? mockTemplates 
    : mockTemplates.filter(template => template.category === selectedCategory);

  const handleAskLegalBot = () => {
    if (!legalQuery.trim()) {
      toast({
        title: "Please Enter a Question",
        description: "Type your legal question to get AI-powered guidance",
        variant: "destructive"
      });
      return;
    }

    askLegalBotMutation.mutate({
      question: legalQuery,
      category: selectedCategory === "all" ? "general" : selectedCategory,
      urgency: "medium",
      jurisdiction: jurisdiction
    });
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      influencer: <Users className="h-4 w-4" />,
      brand_deal: <Handshake className="h-4 w-4" />,
      music_usage: <Download className="h-4 w-4" />,
      nda: <Shield className="h-4 w-4" />,
      collaboration: <Users className="h-4 w-4" />,
      general: <FileText className="h-4 w-4" />
    };
    return icons[category as keyof typeof icons] || <FileText className="h-4 w-4" />;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-900/20 border-green-800';
      case 'intermediate': return 'text-yellow-400 bg-yellow-900/20 border-yellow-800';
      case 'advanced': return 'text-red-400 bg-red-900/20 border-red-800';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-800';
    }
  };

  return (
    <div 
      className="space-y-6 p-6 max-w-7xl mx-auto"
      style={{ 
        background: 'transparent',
        minHeight: '100vh'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Smart Legal Assistant
          </h1>
          <p className="text-gray-400 mt-2">
            AI-powered legal guidance, templates, and contract generation for creators
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-blue-400" />
          <span className="text-sm text-gray-400">AI Legal Guidance</span>
        </div>
      </div>

      {/* Legal Disclaimer */}
      <Card className="bg-gradient-to-r from-amber-900/20 to-red-900/20 border-amber-700/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-400 mb-2">Important Legal Disclaimer</h3>
              <p className="text-sm text-amber-100">
                This AI assistant provides general legal information and templates for educational purposes only. 
                It is not a substitute for professional legal advice. Always consult with a qualified attorney 
                for specific legal matters and before signing any contracts.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-900/50">
          <TabsTrigger value="templates" className="data-[state=active]:bg-blue-600">
            <FileText className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="legal-bot" className="data-[state=active]:bg-purple-600">
            <Bot className="h-4 w-4 mr-2" />
            Legal Bot
          </TabsTrigger>
          <TabsTrigger value="generator" className="data-[state=active]:bg-green-600">
            <Contract className="h-4 w-4 mr-2" />
            Generator
          </TabsTrigger>
          <TabsTrigger value="guidance" className="data-[state=active]:bg-orange-600">
            <Gavel className="h-4 w-4 mr-2" />
            Guidance
          </TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-400" />
                Legal Document Templates
              </CardTitle>
              <CardDescription>
                Ready-to-use legal templates for common creator scenarios
              </CardDescription>
              <div className="flex gap-2 mt-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48 bg-gray-800 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="influencer">Influencer Agreements</SelectItem>
                    <SelectItem value="brand_deal">Brand Deals</SelectItem>
                    <SelectItem value="music_usage">Music Usage</SelectItem>
                    <SelectItem value="nda">NDAs</SelectItem>
                    <SelectItem value="collaboration">Collaborations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => (
                  <Card key={template.id} className="bg-gray-800/50 border-gray-600 hover:border-blue-500/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(template.category)}
                          <h3 className="font-semibold text-sm">{template.title}</h3>
                        </div>
                        <Badge className={getDifficultyColor(template.difficulty)}>
                          {template.difficulty}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-gray-400 mb-3">{template.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">Popularity</span>
                          <span className="text-green-400">{template.popularity}%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">Jurisdiction</span>
                          <span className="text-blue-400">{template.jurisdiction}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          Updated: {new Date(template.lastUpdated).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700" size="sm">
                          <Download className="h-3 w-3 mr-2" />
                          Download Template
                        </Button>
                        <Button variant="outline" className="w-full" size="sm">
                          <Eye className="h-3 w-3 mr-2" />
                          Preview
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Legal Bot Tab */}
        <TabsContent value="legal-bot" className="space-y-6">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-purple-400" />
                Ask Legal Bot
              </CardTitle>
              <CardDescription>
                Get AI-powered answers to your legal questions about content creation, contracts, and rights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Your Legal Question</Label>
                <Textarea
                  placeholder="e.g., Can I use this music in my YouTube video? What should I include in a brand deal contract? Do I need permission to mention another brand?"
                  value={legalQuery}
                  onChange={(e) => setLegalQuery(e.target.value)}
                  rows={4}
                  className="bg-gray-800 border-gray-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Question Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="bg-gray-800 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Legal</SelectItem>
                      <SelectItem value="influencer">Influencer Rights</SelectItem>
                      <SelectItem value="brand_deal">Brand Partnerships</SelectItem>
                      <SelectItem value="music_usage">Music & Copyright</SelectItem>
                      <SelectItem value="collaboration">Content Collaboration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Jurisdiction</Label>
                  <Select value={jurisdiction} onValueChange={setJurisdiction}>
                    <SelectTrigger className="bg-gray-800 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="eu">European Union</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                      <SelectItem value="international">International</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleAskLegalBot} 
                disabled={askLegalBotMutation.isPending}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {askLegalBotMutation.isPending ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Legal Question...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Get Legal Guidance (3 Credits)
                  </>
                )}
              </Button>

              {/* Mock Response Display */}
              <Card className="bg-gray-800/50 border-gray-600">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Bot className="h-5 w-5 text-purple-400 mt-0.5" />
                    <div className="space-y-3">
                      <h4 className="font-semibold text-purple-400">Legal Bot Response</h4>
                      <p className="text-sm text-gray-300">
                        Based on your question about music usage, here's what you need to know: Most music is protected by copyright, 
                        and you typically need permission (a license) to use it in your content. There are several types of licenses 
                        available, including sync licenses for videos and mechanical licenses for covers.
                      </p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-green-400">Confidence: 87%</span>
                        <span className="text-yellow-400">Risk Level: Medium</span>
                        <span className="text-blue-400">Complexity: 6/10</span>
                      </div>
                      <div className="pt-2 border-t border-gray-700">
                        <p className="text-xs text-gray-400">
                          <strong>Recommended Actions:</strong> Contact the rights holder, use royalty-free music, 
                          or consider platforms like ASCAP/BMI for licensing.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contract Generator Tab */}
        <TabsContent value="generator" className="space-y-6">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-400" />
                AI Contract Generator
              </CardTitle>
              <CardDescription>
                Generate custom legal documents based on your specific requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Contract Type</Label>
                <Select value={contractType} onValueChange={setContractType}>
                  <SelectTrigger className="bg-gray-800 border-gray-600">
                    <SelectValue placeholder="Select contract type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="influencer-agreement">Influencer Agreement</SelectItem>
                    <SelectItem value="brand-partnership">Brand Partnership</SelectItem>
                    <SelectItem value="collaboration">Content Collaboration</SelectItem>
                    <SelectItem value="nda">Non-Disclosure Agreement</SelectItem>
                    <SelectItem value="licensing">Music Licensing</SelectItem>
                    <SelectItem value="service-agreement">Service Agreement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Party 1 (You)</Label>
                  <Input placeholder="Your name or company" className="bg-gray-800 border-gray-600" />
                </div>
                <div className="space-y-2">
                  <Label>Party 2 (Other Party)</Label>
                  <Input placeholder="Brand or collaborator name" className="bg-gray-800 border-gray-600" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Contract Details</Label>
                <Textarea 
                  placeholder="Describe the work, deliverables, timeline, compensation, and any special terms..."
                  rows={4}
                  className="bg-gray-800 border-gray-600"
                />
              </div>

              <Button 
                disabled={generateContractMutation.isPending || !contractType}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                {generateContractMutation.isPending ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Generating Contract...
                  </>
                ) : (
                  <>
                    <Contract className="mr-2 h-4 w-4" />
                    Generate Custom Contract (5 Credits)
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Legal Guidance Tab */}
        <TabsContent value="guidance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-orange-400" />
                  Common Legal Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Do I need a contract for every brand collaboration?",
                  "What rights do I retain when creating sponsored content?",
                  "How do I protect my content from being stolen?",
                  "What should I include in my influencer media kit?",
                  "Can I use copyrighted music in my videos?"
                ].map((question, index) => (
                  <div key={index} className="p-3 bg-gray-800/50 rounded border border-gray-600 cursor-pointer hover:border-orange-500/50 transition-colors">
                    <p className="text-sm">{question}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-400" />
                  Legal Protection Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-400">✓ Always Use Written Agreements</h4>
                  <p className="text-sm text-gray-400">Verbal agreements are hard to enforce. Get everything in writing.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-green-400">✓ Understand Your Rights</h4>
                  <p className="text-sm text-gray-400">Know what rights you're granting and what you're retaining.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-purple-400">✓ Protect Your IP</h4>
                  <p className="text-sm text-gray-400">Watermark content and consider trademark protection for your brand.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-orange-400">✓ Review Before Signing</h4>
                  <p className="text-sm text-gray-400">Never sign contracts without understanding all terms and implications.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}