import { useEffect, useState } from "react";
import { Switch, Route, Redirect, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ProfessionalHeader } from "@/components/layout/ProfessionalHeader";
import { ProfessionalSidebar } from "@/components/layout/ProfessionalSidebar";
import { useAuth } from "@/hooks/useAuth";
import { WorkspaceProvider } from "@/hooks/useWorkspace";
import { GlobalWorkspaceSwitchingOverlay } from "@/components/workspaces/GlobalWorkspaceSwitchingOverlay";
import { AICopilotWidget } from "@/components/ai-copilot/AICopilotWidget";

// Pages
import Dashboard from "@/pages/Dashboard";
import ProfessionalDashboard from "@/pages/ProfessionalDashboard";
import VeeForeHomeDashboard from "@/pages/VeeForeHomeDashboard";
import ContentStudio from "@/pages/ContentStudio";
import AdvancedScheduler from "@/pages/AdvancedScheduler";
import ProfessionalScheduler from "@/pages/ProfessionalScheduler";
import Analyzer from "@/pages/Analyzer";
import Suggestions from "@/pages/Suggestions";
import ContentRecommendations from "@/pages/ContentRecommendations";
import AIFeatures from "@/pages/AIFeatures";
import Automation from "@/pages/Automation";
import PostAutomation from "@/pages/PostAutomation";
import CommentToDMAutomation from "@/pages/CommentToDMAutomation";
import DMAutomationList from "@/pages/DMAutomationList";
import Messages from "@/pages/Messages";
import Workspaces from "@/pages/Workspaces";
import TeamManagement from "@/pages/TeamManagement";
import Integrations from "@/pages/Integrations";
import Referrals from "@/pages/Referrals";
import Settings from "@/pages/Settings";
import EnterpriseSettings from "@/pages/EnterpriseSettings";
import Pricing from "@/pages/Pricing";
import Subscription from "@/pages/Subscription";
import SubscriptionNew from "@/pages/SubscriptionNew";
import SignIn from "@/pages/SignIn";
import SignUpWithOnboarding from "@/pages/SignUpWithOnboarding";
import OnboardingPremium from "@/pages/OnboardingPremium";

import HootsuiteLanding from "@/pages/HootsuiteLanding";
import Subscribe from "@/pages/Subscribe";
import { PrivacyPolicy } from "@/pages/PrivacyPolicy";
import { TermsOfService } from "@/pages/TermsOfService";
import FeaturePreview from "@/pages/FeaturePreview";
import NotFound from "@/pages/not-found";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminUserManagement from "@/pages/AdminUserManagement";
import AdminEarlyAccess from "@/pages/AdminEarlyAccess";
import InstagramAnalytics from "@/pages/InstagramAnalytics";
import YouTubeAnalytics from "@/pages/YouTubeAnalytics";
import ThumbnailAIMaker from "@/pages/ThumbnailAIMaker";
import ThumbnailAIMakerProComplete from "@/pages/ThumbnailAIMakerProComplete";
import ThumbnailMakerPro from "@/pages/ThumbnailMakerPro";
import CreativeBriefGenerator from "@/pages/CreativeBriefGenerator";
import ContentRepurpose from "@/pages/ContentRepurpose";
import AIIntelligence from "@/pages/AIIntelligence";
import TrendCalendar from "@/pages/TrendCalendar";
import ABTesting from "@/pages/ABTesting";
import ABTestingAI from "@/pages/ABTestingAI";
import CompetitorAnalysis from "@/pages/CompetitorAnalysis";
import ROICalculator from "@/pages/ROICalculator";
import AffiliateEngine from "@/pages/AffiliateEngine";
import SocialListening from "@/pages/SocialListening";
import SmartLegalAssistant from "@/pages/SmartLegalAssistant";
import ContentTheftDetection from "@/pages/ContentTheftDetection";
import PersonaSuggestions from "@/pages/PersonaSuggestions";
import Gamification from "@/pages/Gamification";
import EmotionAnalysis from "@/pages/EmotionAnalysis";
import EarlyAccessPage from "@/pages/EarlyAccessPage";
import Analytics from "@/pages/Analytics";
import SocialInsights from "@/pages/SocialInsights";
import PerformanceAnalytics from "@/pages/PerformanceAnalytics";
import AdvancedAnalytics from "@/pages/AdvancedAnalytics";
import ContentPerformanceAnalytics from "@/pages/ContentPerformanceAnalytics";
import AnalyticsLayout from "@/components/layout/AnalyticsLayout";
import CreatePost from "@/pages/CreatePost";

// Landing page related pages
import Features from "@/pages/Features";
import Solutions from "@/pages/Solutions";
import Reviews from "@/pages/Reviews";
import Blog from "@/pages/Blog";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Careers from "@/pages/Careers";
import HelpCenter from "@/pages/HelpCenter";
import WatchDemo from "@/pages/WatchDemo";

// Individual feature detail pages
import FeatureAIContent from "@/pages/FeatureAIContent";
import FeatureScheduling from "@/pages/FeatureScheduling";
import FeatureAnalytics from "@/pages/FeatureAnalytics";
import FeatureUnifiedManagement from "@/pages/FeatureUnifiedManagement";
import SolutionContentCreators from "@/pages/SolutionContentCreators";
import SolutionSmallBusinesses from "@/pages/SolutionSmallBusinesses";
import SolutionAgencies from "@/pages/SolutionAgencies";
import SolutionEnterprises from "@/pages/SolutionEnterprises";

function AuthenticatedApp() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isAnalyticsRoute = location.startsWith('/analytics') || 
                          location === '/social-insights' || 
                          location === '/performance-analytics' || 
                          location === '/advanced-analytics' ||
                          location === '/content-performance-analytics';
  
  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <WorkspaceProvider>
      <div className="min-h-screen bg-background text-foreground">
        {isAnalyticsRoute ? (
          <AnalyticsLayout>
            <Switch>
              <Route path="/analytics" component={Analytics} />
              <Route path="/analytics/:tab" component={Analytics} />
              <Route path="/social-insights" component={SocialInsights} />
              <Route path="/performance-analytics" component={PerformanceAnalytics} />
              <Route path="/advanced-analytics" component={AdvancedAnalytics} />
              <Route path="/content-performance-analytics" component={ContentPerformanceAnalytics} />
            </Switch>
          </AnalyticsLayout>
        ) : (
          <>
            <ProfessionalHeader onMobileMenuToggle={handleMobileMenuToggle} />
            <div className="flex h-[calc(100vh-64px)] overflow-hidden">
              <ProfessionalSidebar 
                isMobileMenuOpen={isMobileMenuOpen} 
                setIsMobileMenuOpen={setIsMobileMenuOpen}
              />
              <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-6 space-y-4 sm:space-y-6" style={{ backgroundColor: '#F9FAFB' }}>
                <Switch>
                  <Route path="/dashboard" component={ProfessionalDashboard} />
                  <Route path="/create-post" component={CreatePost} />
                  <Route path="/content-studio" component={ContentStudio} />
                  <Route path="/scheduler" component={ProfessionalScheduler} />
                  <Route path="/advanced-scheduler" component={AdvancedScheduler} />
                  <Route path="/professional-scheduler" component={ProfessionalScheduler} />
                  <Route path="/analyzer" component={Analyzer} />
                  <Route path="/suggestions" component={Suggestions} />
                  <Route path="/content-recommendations" component={ContentRecommendations} />
                  <Route path="/ai-features" component={AIFeatures} />
                  <Route path="/automation" component={Automation} />
                  <Route path="/post-automation" component={PostAutomation} />
                  <Route path="/comment-to-dm-automation" component={CommentToDMAutomation} />
          <Route path="/dm-automation-list" component={DMAutomationList} />
                  <Route path="/conversations" component={Messages} />
                  <Route path="/messages" component={Messages} />
                  <Route path="/workspaces" component={Workspaces} />
                  <Route path="/team" component={TeamManagement} />
                  <Route path="/integrations" component={Integrations} />
                  <Route path="/referrals" component={Referrals} />
                  <Route path="/settings" component={EnterpriseSettings} />
                  <Route path="/legacy-settings" component={Settings} />
                  <Route path="/pricing" component={Pricing} />
                  <Route path="/subscription" component={Subscription} />
                  <Route path="/subscription-new" component={SubscriptionNew} />
                  <Route path="/instagram-analytics" component={InstagramAnalytics} />
                  <Route path="/youtube-analytics" component={YouTubeAnalytics} />
                  <Route path="/thumbnail-ai-maker" component={ThumbnailAIMaker} />
                  <Route path="/thumbnail-ai-maker-pro" component={ThumbnailAIMakerProComplete} />
                  <Route path="/thumbnail-maker-pro" component={ThumbnailMakerPro} />
                  <Route path="/creative-brief-generator" component={CreativeBriefGenerator} />
                  <Route path="/content-repurpose" component={ContentRepurpose} />
                  <Route path="/ai-intelligence" component={AIIntelligence} />
                  <Route path="/trend-calendar" component={TrendCalendar} />
                  <Route path="/ab-testing" component={ABTesting} />
                  <Route path="/ab-testing-ai" component={ABTestingAI} />
                  <Route path="/competitor-analysis" component={CompetitorAnalysis} />
                  <Route path="/roi-calculator" component={ROICalculator} />
                  <Route path="/affiliate-engine" component={AffiliateEngine} />
                  <Route path="/social-listening" component={SocialListening} />
                  <Route path="/smart-legal-assistant" component={SmartLegalAssistant} />
                  <Route path="/content-theft-detection" component={ContentTheftDetection} />
                  <Route path="/persona-suggestions" component={PersonaSuggestions} />
                  <Route path="/gamification" component={Gamification} />
                  <Route path="/emotion-analysis" component={EmotionAnalysis} />
                  <Route path="/admin" component={AdminDashboard} />
                  <Route path="/admin/users" component={AdminUserManagement} />
                  <Route path="/admin/early-access" component={AdminEarlyAccess} />
                  <Route path="/feature-preview" component={FeaturePreview} />
                  <Route path="/onboarding" component={OnboardingPremium} />
                  <Route path="/" component={ProfessionalDashboard} />
                  <Route component={NotFound} />
                </Switch>
              </main>
            </div>
          </>
        )}
        <GlobalWorkspaceSwitchingOverlay />
        <AICopilotWidget />
      </div>
    </WorkspaceProvider>
  );
}

function Router() {
  const { user, loading } = useAuth();
  const [location] = useLocation();

  // Show loading spinner while authentication is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/landing',
    '/hootsuite-landing',
    '/features',
    '/solutions',
    '/pricing',
    '/reviews',
    '/blog',
    '/about',
    '/contact',
    '/careers',
    '/help',
    '/watch-demo',
    '/feature/ai-content',
    '/feature/scheduling',
    '/feature/analytics',
    '/feature/unified-management',
    '/solution/content-creators',
    '/solution/small-businesses',
    '/solution/agencies',
    '/solution/enterprises',
    '/signin',
    '/signup',
    '/auth',
    '/privacy',
    '/terms',
    '/subscribe',
    '/admin/login',
    '/early-access'
  ];

  const isPublicRoute = publicRoutes.includes(location);

  // If user is authenticated, check if they need onboarding
  if (isAuthenticated) {
    // Debug log to track the user's onboarding status
    console.log('[APP.TSX] User authentication check:', {
      isAuthenticated,
      userEmail: user?.email,
      isOnboarded: user?.isOnboarded,
      isOnboardedType: typeof user?.isOnboarded,
      userId: user?.id,
      location
    });
    
    // If user hasn't completed onboarding
    if (!user.isOnboarded) {
      // Allow access to home page (landing page) if they want to go back
      if (location === "/" || location === "/landing" || location === "/hootsuite-landing") {
        return (
          <div className="min-h-screen bg-background text-foreground">
            <Switch>
              <Route path="/" component={HootsuiteLanding} />
              <Route path="/landing" component={HootsuiteLanding} />
              <Route path="/hootsuite-landing" component={HootsuiteLanding} />
              <Route component={() => <Redirect to="/" />} />
            </Switch>
          </div>
        );
      }
      // If they're on signup page, show signup
      if (location === "/signup") {
        return (
          <div className="min-h-screen bg-background text-foreground">
            <Switch>
              <Route path="/signup" component={SignUpWithOnboarding} />
              <Route component={() => <Redirect to="/signup" />} />
            </Switch>
          </div>
        );
      }
      // For any other route, redirect to signup
      return <Redirect to="/signup" />;
    }
    return <AuthenticatedApp />;
  }

  // If not authenticated but trying to access a protected route, redirect to signin
  if (!isAuthenticated && !isPublicRoute) {
    return <Redirect to="/signin" />;
  }

  // Render public routes
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Switch>
        <Route path="/" component={HootsuiteLanding} />
        <Route path="/landing" component={HootsuiteLanding} />
        <Route path="/hootsuite-landing" component={HootsuiteLanding} />
        <Route path="/features" component={Features} />
        <Route path="/solutions" component={Solutions} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/reviews" component={Reviews} />
        <Route path="/blog" component={Blog} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/careers" component={Careers} />
        <Route path="/help" component={HelpCenter} />
        <Route path="/watch-demo" component={WatchDemo} />
        <Route path="/feature/ai-content" component={FeatureAIContent} />
        <Route path="/feature/scheduling" component={FeatureScheduling} />
        <Route path="/feature/analytics" component={FeatureAnalytics} />
        <Route path="/feature/unified-management" component={FeatureUnifiedManagement} />
        <Route path="/solution/content-creators" component={SolutionContentCreators} />
        <Route path="/solution/small-businesses" component={SolutionSmallBusinesses} />
        <Route path="/solution/agencies" component={SolutionAgencies} />
        <Route path="/solution/enterprises" component={SolutionEnterprises} />
        <Route path="/signin" component={SignIn} />
        <Route path="/signup" component={SignUpWithOnboarding} />
        <Route path="/auth" component={SignIn} />
        <Route path="/privacy" component={PrivacyPolicy} />
        <Route path="/terms" component={TermsOfService} />
        <Route path="/subscribe" component={Subscribe} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/early-access" component={EarlyAccessPage} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}