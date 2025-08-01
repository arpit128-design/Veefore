import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Target, Calendar, DollarSign, Lightbulb, Hash, FileText, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const creativeBriefSchema = z.object({
  title: z.string().min(1, "Title is required"),
  targetAudience: z.string().min(1, "Target audience is required"),
  platforms: z.array(z.string()).min(1, "At least one platform is required"),
  campaignGoals: z.array(z.string()).min(1, "At least one campaign goal is required"),
  tone: z.string().min(1, "Tone is required"),
  style: z.string().min(1, "Style is required"),
  industry: z.string().min(1, "Industry is required"),
  deadline: z.string().optional(),
  budget: z.number().optional(),
  additionalRequirements: z.string().optional()
});

type CreativeBriefFormData = z.infer<typeof creativeBriefSchema>;

const platforms = [
  { id: "instagram", label: "Instagram" },
  { id: "youtube", label: "YouTube" },
  { id: "tiktok", label: "TikTok" },
  { id: "twitter", label: "Twitter/X" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "facebook", label: "Facebook" }
];

const campaignGoals = [
  { id: "brand_awareness", label: "Brand Awareness" },
  { id: "engagement", label: "Engagement" },
  { id: "lead_generation", label: "Lead Generation" },
  { id: "sales", label: "Sales/Conversions" },
  { id: "community_building", label: "Community Building" },
  { id: "thought_leadership", label: "Thought Leadership" }
];

const tones = [
  "Professional", "Casual", "Friendly", "Authoritative", "Playful", "Inspirational", "Educational", "Conversational"
];

const styles = [
  "Minimalist", "Bold", "Corporate", "Creative", "Modern", "Classic", "Trendy", "Artistic"
];

const industries = [
  "Technology", "Healthcare", "Finance", "E-commerce", "Education", "Entertainment", "Fashion", "Food & Beverage", "Travel", "Real Estate", "Fitness", "Other"
];

export default function CreativeBriefGenerator() {
  const { toast } = useToast();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [generatedBrief, setGeneratedBrief] = useState<any>(null);

  const form = useForm<CreativeBriefFormData>({
    resolver: zodResolver(creativeBriefSchema),
    defaultValues: {
      title: "",
      targetAudience: "",
      platforms: [],
      campaignGoals: [],
      tone: "",
      style: "",
      industry: "",
      deadline: "",
      budget: undefined,
      additionalRequirements: ""
    }
  });

  const generateBriefMutation = useMutation({
    mutationFn: async (data: CreativeBriefFormData) => {
      const res = await apiRequest('POST', '/api/ai/creative-brief', data);
      return await res.json();
    },
    onSuccess: (data) => {
      setGeneratedBrief(data);
      toast({
        title: "Creative Brief Generated!",
        description: `Used ${data.creditsUsed} credits. ${data.remainingCredits} credits remaining.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { data: userCredits } = useQuery({
    queryKey: ['/api/user'],
    select: (data: any) => data.credits
  });

  const onSubmit = (data: CreativeBriefFormData) => {
    const formData = {
      ...data,
      platforms: selectedPlatforms,
      campaignGoals: selectedGoals,
      budget: data.budget ? Number(data.budget) : undefined
    };
    generateBriefMutation.mutate(formData);
  };

  const handlePlatformChange = (platformId: string, checked: boolean) => {
    if (checked) {
      setSelectedPlatforms([...selectedPlatforms, platformId]);
    } else {
      setSelectedPlatforms(selectedPlatforms.filter(id => id !== platformId));
    }
    form.setValue('platforms', checked ? [...selectedPlatforms, platformId] : selectedPlatforms.filter(id => id !== platformId));
  };

  const handleGoalChange = (goalId: string, checked: boolean) => {
    if (checked) {
      setSelectedGoals([...selectedGoals, goalId]);
    } else {
      setSelectedGoals(selectedGoals.filter(id => id !== goalId));
    }
    form.setValue('campaignGoals', checked ? [...selectedGoals, goalId] : selectedGoals.filter(id => id !== goalId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-void via-nebula-purple/20 to-cosmic-void text-white relative overflow-hidden">
      {/* Cosmic Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-electric-cyan/10 to-nebula-purple/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-solar-gold/10 to-electric-cyan/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-60 h-60 bg-gradient-to-r from-nebula-purple/10 to-solar-gold/10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 container mx-auto p-6 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-electric-cyan via-nebula-purple to-solar-gold bg-clip-text text-transparent mb-2">
            AI Creative Brief Generator
          </h1>
          <p className="text-lg text-asteroid-silver">
            Generate comprehensive campaign strategies with AI-powered insights
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Badge className="bg-electric-cyan/20 text-electric-cyan border-electric-cyan/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Credits: {userCredits || 0}
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30">3 credits per generation</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Generation Form */}
          <Card className="bg-transparent border border-electric-cyan/30 backdrop-blur-sm shadow-2xl shadow-electric-cyan/10 rounded-xl overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Campaign Details
            </CardTitle>
            <CardDescription>
              Define your campaign parameters for AI brief generation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Summer Product Launch 2024" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="e.g., Tech-savvy millennials aged 25-35 who are early adopters and value sustainability"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel>Platforms</FormLabel>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {platforms.map((platform) => (
                      <div key={platform.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={platform.id}
                          checked={selectedPlatforms.includes(platform.id)}
                          onCheckedChange={(checked) => handlePlatformChange(platform.id, checked as boolean)}
                        />
                        <label htmlFor={platform.id} className="text-sm font-medium">
                          {platform.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <FormLabel>Campaign Goals</FormLabel>
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    {campaignGoals.map((goal) => (
                      <div key={goal.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={goal.id}
                          checked={selectedGoals.includes(goal.id)}
                          onCheckedChange={(checked) => handleGoalChange(goal.id, checked as boolean)}
                        />
                        <label htmlFor={goal.id} className="text-sm font-medium">
                          {goal.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tone</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select tone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tones.map((tone) => (
                              <SelectItem key={tone} value={tone.toLowerCase()}>
                                {tone}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="style"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Style</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {styles.map((style) => (
                              <SelectItem key={style} value={style.toLowerCase()}>
                                {style}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {industries.map((industry) => (
                            <SelectItem key={industry} value={industry.toLowerCase()}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deadline (Optional)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="e.g., 10000"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="additionalRequirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Requirements (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any specific requirements, constraints, or preferences"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-electric-cyan to-nebula-purple hover:from-electric-cyan/80 hover:to-nebula-purple/80 text-white font-semibold py-3 px-6 rounded-lg shadow-lg shadow-electric-cyan/25 transition-all duration-300 hover:shadow-xl hover:shadow-electric-cyan/40"
                  disabled={generateBriefMutation.isPending || (userCredits && userCredits < 3)}
                >
                  {generateBriefMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Brief...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Creative Brief (3 Credits)
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

          {/* Generated Brief */}
          {generatedBrief && (
            <Card className="bg-transparent border border-nebula-purple/30 backdrop-blur-sm shadow-2xl shadow-nebula-purple/10 rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Generated Creative Brief
              </CardTitle>
              <CardDescription>
                AI-powered campaign strategy and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Brief Content */}
              <div>
                <h3 className="font-semibold mb-2">Campaign Brief</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {generatedBrief.generated.briefContent}
                </p>
              </div>

              {/* Key Messages */}
              <div>
                <h3 className="font-semibold mb-2">Key Messages</h3>
                <div className="space-y-2">
                  {generatedBrief.generated.keyMessages.map((message: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <Badge variant="outline" className="text-xs">{index + 1}</Badge>
                      <span className="text-sm">{message}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Formats */}
              <div>
                <h3 className="font-semibold mb-2">Recommended Content Formats</h3>
                <div className="flex flex-wrap gap-2">
                  {generatedBrief.generated.contentFormats.map((format: string, index: number) => (
                    <Badge key={index} variant="secondary">{format}</Badge>
                  ))}
                </div>
              </div>

              {/* Hashtags */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-1">
                  <Hash className="w-4 h-4" />
                  Suggested Hashtags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {generatedBrief.generated.hashtags.map((hashtag: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-blue-600">
                      {hashtag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              {generatedBrief.generated.timeline && generatedBrief.generated.timeline.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Project Timeline
                  </h3>
                  <div className="space-y-3">
                    {generatedBrief.generated.timeline.map((phase: any, index: number) => (
                      <div key={index} className="border-l-2 border-purple-500/20 pl-4">
                        <h4 className="font-medium">{phase.phase}</h4>
                        <p className="text-sm text-muted-foreground mb-1">{phase.duration}</p>
                        <ul className="text-xs space-y-1">
                          {phase.deliverables.map((deliverable: string, idx: number) => (
                            <li key={idx} className="flex items-center gap-1">
                              <div className="w-1 h-1 bg-purple-500 rounded-full" />
                              {deliverable}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Strategic Insights */}
              {generatedBrief.generated.insights && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-1">
                    <Lightbulb className="w-4 h-4" />
                    Strategic Insights
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {generatedBrief.generated.insights}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

          {/* Empty state when no brief generated */}
          {!generatedBrief && (
            <Card className="bg-transparent border border-dashed border-asteroid-silver/30 backdrop-blur-sm shadow-2xl shadow-asteroid-silver/10 rounded-xl overflow-hidden">
            <CardContent className="flex flex-col items-center justify-center h-96 text-center">
              <Sparkles className="w-12 h-12 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-semibold mb-2">AI-Powered Brief Generation</h3>
              <p className="text-muted-foreground max-w-md">
                Fill out the campaign details to generate a comprehensive creative brief with AI-powered insights, 
                strategic recommendations, and actionable timelines.
              </p>
            </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}