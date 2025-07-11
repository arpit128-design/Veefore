import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Scale, 
  FileText, 
  Shield, 
  Download, 
  AlertTriangle,
  CheckCircle,
  Users,
  Building,
  Globe,
  Calendar,
  DollarSign,
  Zap,
  Star,
  ArrowRight,
  HelpCircle,
  BookOpen
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface LegalGuidanceResult {
  guidance: string;
  risks: string[];
  recommendations: string[];
  resources: string[];
  disclaimer: string;
  templates: string[];
  nextSteps: string[];
}

interface GeneratedContract {
  contractText: string;
  keyTerms: string[];
  warningFlags: string[];
  reviewChecklist: string[];
  jurisdiction: string;
  disclaimer: string;
}

interface LegalTemplate {
  name: string;
  description: string;
  category: string;
  sections: string[];
}

interface Jurisdiction {
  name: string;
  key_laws: string[];
  disclosure_requirements: string;
  copyright_notice: string;
}

function SmartLegalAssistant() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Form states
  const [activeTab, setActiveTab] = useState<string>('guidance');
  const [guidanceForm, setGuidanceForm] = useState({
    query: '',
    businessType: '',
    industry: '',
    location: '',
    scenario: ''
  });
  
  const [contractForm, setContractForm] = useState({
    contractType: '',
    creatorName: '',
    brandName: '',
    brandType: '',
    duration: '',
    compensation: '',
    deliverables: '',
    exclusivity: false,
    territory: '',
    industry: '',
    jurisdiction: ''
  });

  // Get user data for credits
  const { data: user } = useQuery({
    queryKey: ["/api/user"],
    refetchInterval: 30000
  });

  // Fetch legal templates and jurisdictions
  const { data: legalData } = useQuery({
    queryKey: ['/api/legal/templates'],
    queryFn: () => apiRequest('GET', '/api/legal/templates')
  });

  // Legal guidance mutation
  const guidanceMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/ai/legal-guidance', data),
    onSuccess: (data) => {
      toast({
        title: "Legal Guidance Generated!",
        description: "AI has analyzed your legal query and provided comprehensive guidance.",
      });
    },
    onError: (error: any) => {
      if (error.upgradeModal) {
        toast({
          title: "Insufficient Credits",
          description: `You need ${error.required} credits to use Smart Legal Assistant.`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Analysis Failed",
          description: error.message || "Failed to provide legal guidance. Please try again.",
          variant: "destructive"
        });
      }
    }
  });

  // Contract generation mutation
  const contractMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/ai/contract-generation', data),
    onSuccess: (data) => {
      toast({
        title: "Contract Generated!",
        description: "AI has generated your custom contract template.",
      });
    },
    onError: (error: any) => {
      if (error.upgradeModal) {
        toast({
          title: "Insufficient Credits",
          description: `You need ${error.required} credits to generate contracts.`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Generation Failed",
          description: error.message || "Failed to generate contract. Please try again.",
          variant: "destructive"
        });
      }
    }
  });

  const handleGuidanceSubmit = () => {
    if (!guidanceForm.query || !guidanceForm.businessType || !guidanceForm.industry || !guidanceForm.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    guidanceMutation.mutate(guidanceForm);
  };

  const handleContractSubmit = () => {
    if (!contractForm.contractType || !contractForm.creatorName || !contractForm.brandName || !contractForm.industry || !contractForm.jurisdiction) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const contractData = {
      contractType: contractForm.contractType,
      parties: {
        creator: contractForm.creatorName,
        brand: contractForm.brandName,
        brandType: contractForm.brandType
      },
      terms: {
        duration: contractForm.duration,
        compensation: contractForm.compensation,
        deliverables: contractForm.deliverables.split(',').map(d => d.trim()),
        exclusivity: contractForm.exclusivity,
        territory: contractForm.territory
      },
      industry: contractForm.industry,
      jurisdiction: contractForm.jurisdiction
    };

    contractMutation.mutate(contractData);
  };

  const downloadContract = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const guidanceResult = guidanceMutation.data as LegalGuidanceResult;
  const contractResult = contractMutation.data as GeneratedContract;

  return (
    <div className="min-h-screen bg-transparent text-white p-4 md:p-6">
      {/* Cosmic Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-1 h-1 bg-electric-cyan/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-blue-500/20 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-1 h-1 bg-nebula-purple/30 rounded-full animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-electric-cyan to-nebula-purple bg-clip-text text-transparent">
              Smart Legal Assistant
            </h1>
          </div>
          <p className="text-asteroid-silver text-lg max-w-2xl mx-auto">
            Get AI-powered legal guidance, generate custom contracts, and access professional templates for creators and brands
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge className="bg-electric-cyan/20 text-electric-cyan border-electric-cyan/30">
              5 Credits for Guidance
            </Badge>
            <Badge className="bg-nebula-purple/20 text-nebula-purple border-nebula-purple/30">
              6 Credits for Contracts
            </Badge>
          </div>
        </motion.div>

        {/* Main Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-cosmic-void/50 border border-asteroid-silver/30">
            <TabsTrigger value="guidance" className="data-[state=active]:bg-electric-cyan data-[state=active]:text-space-navy">
              <HelpCircle className="w-4 h-4 mr-2" />
              Legal Guidance
            </TabsTrigger>
            <TabsTrigger value="contracts" className="data-[state=active]:bg-electric-cyan data-[state=active]:text-space-navy">
              <FileText className="w-4 h-4 mr-2" />
              Contract Generator
            </TabsTrigger>
            <TabsTrigger value="templates" className="data-[state=active]:bg-electric-cyan data-[state=active]:text-space-navy">
              <BookOpen className="w-4 h-4 mr-2" />
              Legal Templates
            </TabsTrigger>
          </TabsList>

          {/* Legal Guidance Tab */}
          <TabsContent value="guidance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-cosmic-void/40 border-asteroid-silver/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-electric-cyan" />
                      Ask Legal Question
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="query">Legal Question*</Label>
                      <Textarea
                        id="query"
                        placeholder="Can I use copyrighted music in my videos? What are the legal requirements for affiliate disclosures?"
                        value={guidanceForm.query}
                        onChange={(e) => setGuidanceForm({...guidanceForm, query: e.target.value})}
                        className="bg-cosmic-void/50 border-asteroid-silver/30 text-white min-h-[100px]"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="businessType">Business Type*</Label>
                        <Select value={guidanceForm.businessType} onValueChange={(value) => setGuidanceForm({...guidanceForm, businessType: value})}>
                          <SelectTrigger className="bg-cosmic-void/50 border-asteroid-silver/30 text-white">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent className="bg-cosmic-void border-asteroid-silver/30">
                            <SelectItem value="individual_creator">Individual Creator</SelectItem>
                            <SelectItem value="influencer">Influencer</SelectItem>
                            <SelectItem value="agency">Agency</SelectItem>
                            <SelectItem value="brand">Brand</SelectItem>
                            <SelectItem value="startup">Startup</SelectItem>
                            <SelectItem value="corporation">Corporation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry*</Label>
                        <Select value={guidanceForm.industry} onValueChange={(value) => setGuidanceForm({...guidanceForm, industry: value})}>
                          <SelectTrigger className="bg-cosmic-void/50 border-asteroid-silver/30 text-white">
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent className="bg-cosmic-void border-asteroid-silver/30">
                            <SelectItem value="fitness">Fitness & Health</SelectItem>
                            <SelectItem value="beauty">Beauty & Fashion</SelectItem>
                            <SelectItem value="tech">Technology</SelectItem>
                            <SelectItem value="gaming">Gaming</SelectItem>
                            <SelectItem value="food">Food & Beverage</SelectItem>
                            <SelectItem value="travel">Travel</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="entertainment">Entertainment</SelectItem>
                            <SelectItem value="lifestyle">Lifestyle</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location">Jurisdiction*</Label>
                        <Select value={guidanceForm.location} onValueChange={(value) => setGuidanceForm({...guidanceForm, location: value})}>
                          <SelectTrigger className="bg-cosmic-void/50 border-asteroid-silver/30 text-white">
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent className="bg-cosmic-void border-asteroid-silver/30">
                            <SelectItem value="united_states">United States</SelectItem>
                            <SelectItem value="european_union">European Union</SelectItem>
                            <SelectItem value="united_kingdom">United Kingdom</SelectItem>
                            <SelectItem value="canada">Canada</SelectItem>
                            <SelectItem value="australia">Australia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="scenario">Scenario</Label>
                        <Input
                          id="scenario"
                          placeholder="Brand collaboration, content licensing..."
                          value={guidanceForm.scenario}
                          onChange={(e) => setGuidanceForm({...guidanceForm, scenario: e.target.value})}
                          className="bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleGuidanceSubmit}
                      disabled={guidanceMutation.isPending}
                      className="w-full bg-gradient-to-r from-electric-cyan to-nebula-purple hover:opacity-90 text-white"
                    >
                      {guidanceMutation.isPending ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Analyzing...
                        </div>
                      ) : (
                        <>
                          <Scale className="w-4 h-4 mr-2" />
                          Get Legal Guidance (5 Credits)
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Results */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {guidanceResult ? (
                  <Card className="bg-cosmic-void/40 border-asteroid-silver/30 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        Legal Guidance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Main Guidance */}
                      <div className="space-y-3">
                        <h4 className="text-lg font-semibold text-electric-cyan">Legal Analysis</h4>
                        <p className="text-asteroid-silver text-sm leading-relaxed">
                          {guidanceResult.guidance}
                        </p>
                      </div>

                      {/* Risks */}
                      {guidanceResult.risks && guidanceResult.risks.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-lg font-semibold text-red-400 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Potential Risks
                          </h4>
                          <ul className="space-y-2">
                            {guidanceResult.risks.map((risk, index) => (
                              <li key={index} className="text-asteroid-silver text-sm flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                                {risk}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Recommendations */}
                      {guidanceResult.recommendations && guidanceResult.recommendations.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-lg font-semibold text-green-400 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Recommendations
                          </h4>
                          <ul className="space-y-2">
                            {guidanceResult.recommendations.map((rec, index) => (
                              <li key={index} className="text-asteroid-silver text-sm flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Next Steps */}
                      {guidanceResult.nextSteps && guidanceResult.nextSteps.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-lg font-semibold text-solar-gold flex items-center gap-2">
                            <ArrowRight className="w-4 h-4" />
                            Next Steps
                          </h4>
                          <ul className="space-y-2">
                            {guidanceResult.nextSteps.map((step, index) => (
                              <li key={index} className="text-asteroid-silver text-sm flex items-start gap-2">
                                <div className="w-4 h-4 bg-blue-500/20 text-blue-500 rounded text-xs flex items-center justify-center mt-0.5 flex-shrink-0">
                                  {index + 1}
                                </div>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Disclaimer */}
                      <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                        <p className="text-orange-400 text-xs">
                          {guidanceResult.disclaimer}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-cosmic-void/40 border-asteroid-silver/30 backdrop-blur-sm">
                    <CardContent className="flex items-center justify-center h-64 text-center">
                      <div className="space-y-4">
                        <Scale className="w-12 h-12 text-asteroid-silver/50 mx-auto" />
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">Ready for Legal Guidance</h3>
                          <p className="text-asteroid-silver text-sm">
                            Ask any legal question related to content creation, brand partnerships, or intellectual property
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </div>
          </TabsContent>

          {/* Contract Generator Tab */}
          <TabsContent value="contracts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contract Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-cosmic-void/40 border-asteroid-silver/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-electric-cyan" />
                      Generate Contract
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contractType">Contract Type*</Label>
                        <Select value={contractForm.contractType} onValueChange={(value) => setContractForm({...contractForm, contractType: value})}>
                          <SelectTrigger className="bg-cosmic-void/50 border-asteroid-silver/30 text-white">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent className="bg-cosmic-void border-asteroid-silver/30">
                            <SelectItem value="influencer_agreement">Influencer Agreement</SelectItem>
                            <SelectItem value="brand_partnership">Brand Partnership</SelectItem>
                            <SelectItem value="content_licensing">Content Licensing</SelectItem>
                            <SelectItem value="nda">Non-Disclosure Agreement</SelectItem>
                            <SelectItem value="ambassador_agreement">Brand Ambassador Agreement</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="jurisdiction">Jurisdiction*</Label>
                        <Select value={contractForm.jurisdiction} onValueChange={(value) => setContractForm({...contractForm, jurisdiction: value})}>
                          <SelectTrigger className="bg-cosmic-void/50 border-asteroid-silver/30 text-white">
                            <SelectValue placeholder="Select jurisdiction" />
                          </SelectTrigger>
                          <SelectContent className="bg-cosmic-void border-asteroid-silver/30">
                            <SelectItem value="united_states">United States</SelectItem>
                            <SelectItem value="european_union">European Union</SelectItem>
                            <SelectItem value="united_kingdom">United Kingdom</SelectItem>
                            <SelectItem value="canada">Canada</SelectItem>
                            <SelectItem value="australia">Australia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="creatorName">Creator Name*</Label>
                        <Input
                          id="creatorName"
                          placeholder="Your full name or business name"
                          value={contractForm.creatorName}
                          onChange={(e) => setContractForm({...contractForm, creatorName: e.target.value})}
                          className="bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="brandName">Brand/Company Name*</Label>
                        <Input
                          id="brandName"
                          placeholder="Brand or company name"
                          value={contractForm.brandName}
                          onChange={(e) => setContractForm({...contractForm, brandName: e.target.value})}
                          className="bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry*</Label>
                        <Select value={contractForm.industry} onValueChange={(value) => setContractForm({...contractForm, industry: value})}>
                          <SelectTrigger className="bg-cosmic-void/50 border-asteroid-silver/30 text-white">
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent className="bg-cosmic-void border-asteroid-silver/30">
                            <SelectItem value="fitness">Fitness & Health</SelectItem>
                            <SelectItem value="beauty">Beauty & Fashion</SelectItem>
                            <SelectItem value="tech">Technology</SelectItem>
                            <SelectItem value="gaming">Gaming</SelectItem>
                            <SelectItem value="food">Food & Beverage</SelectItem>
                            <SelectItem value="travel">Travel</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="entertainment">Entertainment</SelectItem>
                            <SelectItem value="lifestyle">Lifestyle</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="duration">Contract Duration</Label>
                        <Input
                          id="duration"
                          placeholder="6 months, 1 year, ongoing..."
                          value={contractForm.duration}
                          onChange={(e) => setContractForm({...contractForm, duration: e.target.value})}
                          className="bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="compensation">Compensation</Label>
                        <Input
                          id="compensation"
                          placeholder="$500 per post, 10% commission..."
                          value={contractForm.compensation}
                          onChange={(e) => setContractForm({...contractForm, compensation: e.target.value})}
                          className="bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="territory">Territory</Label>
                        <Input
                          id="territory"
                          placeholder="Worldwide, US only, EU..."
                          value={contractForm.territory}
                          onChange={(e) => setContractForm({...contractForm, territory: e.target.value})}
                          className="bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deliverables">Deliverables</Label>
                      <Textarea
                        id="deliverables"
                        placeholder="2 Instagram posts, 1 YouTube video, 5 stories..."
                        value={contractForm.deliverables}
                        onChange={(e) => setContractForm({...contractForm, deliverables: e.target.value})}
                        className="bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                      />
                    </div>

                    <Button
                      onClick={handleContractSubmit}
                      disabled={contractMutation.isPending}
                      className="w-full bg-gradient-to-r from-electric-cyan to-nebula-purple hover:opacity-90 text-white"
                    >
                      {contractMutation.isPending ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Generating...
                        </div>
                      ) : (
                        <>
                          <FileText className="w-4 h-4 mr-2" />
                          Generate Contract (6 Credits)
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contract Results */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {contractResult ? (
                  <Card className="bg-cosmic-void/40 border-asteroid-silver/30 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          Generated Contract
                        </div>
                        <Button
                          onClick={() => downloadContract(contractResult.contractText, 'contract.txt')}
                          variant="outline"
                          size="sm"
                          className="border-electric-cyan/30 text-electric-cyan hover:bg-electric-cyan hover:text-space-navy"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Contract Text Preview */}
                      <div className="space-y-3">
                        <h4 className="text-lg font-semibold text-electric-cyan">Contract Preview</h4>
                        <div className="bg-cosmic-void/50 border border-asteroid-silver/30 rounded-lg p-4 max-h-64 overflow-y-auto">
                          <pre className="text-asteroid-silver text-xs whitespace-pre-wrap font-mono">
                            {contractResult.contractText.substring(0, 1000)}...
                          </pre>
                        </div>
                      </div>

                      {/* Key Terms */}
                      {contractResult.keyTerms && contractResult.keyTerms.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-lg font-semibold text-green-400">Key Terms</h4>
                          <ul className="space-y-2">
                            {contractResult.keyTerms.map((term, index) => (
                              <li key={index} className="text-asteroid-silver text-sm flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                {term}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Warning Flags */}
                      {contractResult.warningFlags && contractResult.warningFlags.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-lg font-semibold text-orange-400 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Review Required
                          </h4>
                          <ul className="space-y-2">
                            {contractResult.warningFlags.map((flag, index) => (
                              <li key={index} className="text-asteroid-silver text-sm flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                                {flag}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Disclaimer */}
                      <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                        <p className="text-orange-400 text-xs">
                          {contractResult.disclaimer}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-cosmic-void/40 border-asteroid-silver/30 backdrop-blur-sm">
                    <CardContent className="flex items-center justify-center h-64 text-center">
                      <div className="space-y-4">
                        <FileText className="w-12 h-12 text-asteroid-silver/50 mx-auto" />
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">Ready to Generate</h3>
                          <p className="text-asteroid-silver text-sm">
                            Fill out the form to generate a custom legal contract template
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {legalData?.templates && Object.entries(legalData.templates).map(([key, template]: [string, LegalTemplate]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="bg-cosmic-void/40 border-asteroid-silver/30 hover:border-electric-cyan/50 transition-all duration-300 backdrop-blur-sm h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-electric-cyan/20 text-electric-cyan border-electric-cyan/30">
                          {template.category}
                        </Badge>
                        <FileText className="w-5 h-5 text-electric-cyan" />
                      </div>
                      <CardTitle className="text-white text-lg">{template.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-asteroid-silver text-sm">{template.description}</p>
                      
                      <div className="space-y-2">
                        <h5 className="text-white font-medium text-sm">Includes:</h5>
                        <ul className="space-y-1">
                          {template.sections.map((section, index) => (
                            <li key={index} className="text-asteroid-silver text-xs flex items-center gap-2">
                              <div className="w-1 h-1 bg-electric-cyan rounded-full"></div>
                              {section}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button 
                        variant="outline" 
                        className="w-full border-electric-cyan/30 text-electric-cyan hover:bg-electric-cyan hover:text-space-navy"
                        onClick={() => {
                          setContractForm({...contractForm, contractType: key});
                          setActiveTab('contracts');
                        }}
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Jurisdictions Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <Card className="bg-cosmic-void/40 border-asteroid-silver/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-electric-cyan" />
                    Supported Jurisdictions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {legalData?.jurisdictions && Object.entries(legalData.jurisdictions).map(([key, jurisdiction]: [string, Jurisdiction]) => (
                      <div key={key} className="space-y-2">
                        <h4 className="font-semibold text-electric-cyan">{jurisdiction.name}</h4>
                        <p className="text-asteroid-silver text-xs">{jurisdiction.disclosure_requirements}</p>
                        <div className="flex flex-wrap gap-1">
                          {jurisdiction.key_laws.map((law, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-asteroid-silver/30 text-asteroid-silver">
                              {law}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center bg-gradient-to-r from-electric-cyan/10 to-solar-gold/10 rounded-lg p-6 border border-electric-cyan/20"
        >
          <Shield className="w-12 h-12 text-electric-cyan mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Protect Your Creative Business
          </h3>
          <p className="text-asteroid-silver mb-4">
            Get professional legal guidance and custom contracts tailored to the creator economy
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-asteroid-silver">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              AI-Powered Analysis
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Creator-Focused Templates
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Multi-Jurisdiction Support
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default SmartLegalAssistant;