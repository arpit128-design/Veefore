import { useEffect } from "react";
import { Switch, Route, Redirect, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OptimizedSpaceBackground } from "@/components/layout/OptimizedSpaceBackground";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { SpaceLoader } from "@/components/ui/space-loader";
import { useAuth } from "@/hooks/useAuth";
import { WorkspaceProvider } from "@/hooks/useWorkspace";
import { GlobalWorkspaceSwitchingOverlay } from "@/components/workspaces/GlobalWorkspaceSwitchingOverlay";
import { AICopilotWidget } from "@/components/ai-copilot/AICopilotWidget";

// Pages
import Dashboard from "@/pages/Dashboard";
import ContentStudio from "@/pages/ContentStudio";
import AdvancedScheduler from "@/pages/AdvancedScheduler";
import Analyzer from "@/pages/Analyzer";
import Suggestions from "@/pages/Suggestions";
import ContentRecommendations from "@/pages/ContentRecommendations";
import AIFeatures from "@/pages/AIFeatures";
import Automation from "@/pages/Automation";
import Conversations from "@/pages/Conversations";
import Workspaces from "@/pages/Workspaces";
import TeamManagement from "@/pages/TeamManagement";
import Integrations from "@/pages/Integrations";
import Referrals from "@/pages/Referrals";
import Settings from "@/pages/Settings";
import Pricing from "@/pages/Pricing";
import Subscription from "@/pages/Subscription";
import SubscriptionNew from "@/pages/SubscriptionNew";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
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
import AdminEarlyAccess from "@/pages/AdminEarlyAccess";

// New landing page related pages
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
  return (
    <WorkspaceProvider>
      <div 
        className="min-h-screen text-white overflow-x-hidden relative"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #0f172a 50%, #000000 100%)',
          minHeight: '100vh'
        }}
      >
        <OptimizedSpaceBackground />
        <Header />
        <div className="flex pt-12 sm:pt-14 md:pt-16 lg:pt-20 min-h-screen pb-16 sm:pb-20 md:pb-0">
          <Sidebar />
          <main className="flex-1 ml-0 md:ml-56 lg:ml-64 p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8 relative z-10 transition-all duration-300 max-w-full overflow-x-hidden">
            <Switch>
              <Route path="/" component={() => <Redirect to="/dashboard" />} />
              {/* Old onboarding route removed - now using integrated signup flow */}
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/content-studio" component={ContentStudio} />
              <Route path="/scheduler" component={AdvancedScheduler} />
              <Route path="/analyzer" component={Analyzer} />
              <Route path="/trends" component={Analyzer} />
              <Route path="/ai-suggestions" component={Suggestions} />
              <Route path="/content-recommendations" component={ContentRecommendations} />
              <Route path="/ai-features" component={AIFeatures} />
              <Route path="/ai-intelligence" component={AIIntelligence} />
              <Route path="/trend-calendar" component={TrendCalendar} />
              <Route path="/ab-testing" component={ABTesting} />
              <Route path="/ab-testing-ai" component={ABTestingAI} />
              <Route path="/competitor-analysis" component={CompetitorAnalysis} />
              <Route path="/roi-calculator" component={ROICalculator} />
              <Route path="/affiliate-engine" component={AffiliateEngine} />
              <Route path="/social-listening" component={SocialListening} />
              <Route path="/legal-assistant" component={SmartLegalAssistant} />
              <Route path="/content-theft-detection" component={ContentTheftDetection} />
              <Route path="/persona-suggestions" component={PersonaSuggestions} />
              <Route path="/gamification" component={Gamification} />
              <Route path="/emotion-analysis" component={EmotionAnalysis} />
              <Route path="/thumbnail-maker" component={ThumbnailAIMaker} />
              <Route path="/ai-thumbnails" component={ThumbnailAIMaker} />
        <Route path="/ai-thumbnails-pro" component={ThumbnailAIMakerProComplete} />
        <Route path="/thumbnail-ai-maker-pro-complete" component={ThumbnailAIMakerProComplete} />
        <Route path="/thumbnail-maker-pro" component={ThumbnailMakerPro} />
              <Route path="/creative-brief" component={CreativeBriefGenerator} />
              <Route path="/content-repurpose" component={ContentRepurpose} />
              <Route path="/automation" component={Automation} />
              <Route path="/conversations" component={Conversations} />
              <Route path="/workspaces" component={Workspaces} />
              <Route path="/team" component={TeamManagement} />
              <Route path="/integrations" component={Integrations} />
              <Route path="/referrals" component={Referrals} />
              <Route path="/settings" component={Settings} />
              <Route path="/subscription" component={Subscription} />
              <Route path="/pricing" component={Pricing} />
              <Route path="/subscribe" component={Subscribe} />
              <Route path="/privacy-policy" component={PrivacyPolicy} />
              <Route path="/terms-of-service" component={TermsOfService} />
              <Route path="/about" component={About} />
              <Route path="/feature-preview" component={FeaturePreview} />
              <Route path="/analytics/instagram" component={InstagramAnalytics} />
              <Route path="/analytics/youtube" component={YouTubeAnalytics} />
              <Route path="/solution/content-creators" component={SolutionContentCreators} />
              <Route path="/solution/small-businesses" component={SolutionSmallBusinesses} />
              <Route path="/solution/agencies" component={SolutionAgencies} />
              <Route path="/solution/enterprises" component={SolutionEnterprises} />
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
        <GlobalWorkspaceSwitchingOverlay />
        <AICopilotWidget />
      </div>
    </WorkspaceProvider>
  );
}

function Router() {
  const { user, loading } = useAuth();
  const [location] = useLocation(); // Move hook to top level

  // Clear completion flag after authentication app loads
  useEffect(() => {
    if (user?.isOnboarded) {
      const justCompleted = localStorage.getItem('onboarding_just_completed');
      if (justCompleted === 'true') {
        localStorage.removeItem('onboarding_just_completed');
      }
    }
  }, [user?.isOnboarded]);

  // Handle admin routes independently of user authentication
  if (location?.startsWith('/admin')) {
    return (
      <div className="min-h-screen bg-space-navy text-white overflow-hidden relative">
        <OptimizedSpaceBackground />
        <Switch>
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin/dashboard" component={AdminDashboard} />
          <Route path="/admin/users" component={AdminUserManagement} />
          <Route path="/admin/waitlist" component={AdminUserManagement} />
          <Route path="/admin/early-access" component={AdminEarlyAccess} />
          <Route component={() => <Redirect to="/admin/login" />} />
        </Switch>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-space-navy text-white overflow-hidden relative">
        <OptimizedSpaceBackground />
        <SpaceLoader message="Initializing VeeFore" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-space-navy text-white overflow-hidden relative">
        <OptimizedSpaceBackground />
        <Switch>
          <Route path="/signin" component={SignIn} />
          <Route path="/signup" component={SignUp} />
          <Route path="/features" component={Features} />
          <Route path="/solutions" component={Solutions} />
          <Route path="/reviews" component={Reviews} />
          <Route path="/blog" component={Blog} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/careers" component={Careers} />
          <Route path="/help" component={HelpCenter} />
          <Route path="/watch-demo" component={WatchDemo} />
          <Route path="/feature/ai-content-creation" component={FeatureAIContent} />
          <Route path="/feature/intelligent-scheduling" component={FeatureScheduling} />
          <Route path="/feature/advanced-analytics" component={FeatureAnalytics} />
          <Route path="/feature/unified-management" component={FeatureUnifiedManagement} />
          <Route path="/solution/content-creators" component={SolutionContentCreators} />
          <Route path="/solution/small-businesses" component={SolutionSmallBusinesses} />
          <Route path="/solution/agencies" component={SolutionAgencies} />
          <Route path="/solution/enterprises" component={SolutionEnterprises} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms-of-service" component={TermsOfService} />
          <Route path="/early-access" component={EarlyAccessPage} />
          {/* Legacy onboarding route redirects to integrated signup */}
          <Route path="/onboarding" component={() => <Redirect to="/signup" />} />
          <Route path="/" component={HootsuiteLanding} />
          <Route component={() => <Redirect to="/" />} />
        </Switch>
      </div>
    );
  }

  // Check if user needs onboarding
  console.log('[ROUTER] User state:', { 
    username: user?.username, 
    isOnboarded: user?.isOnboarded, 
    location,
    userExists: !!user 
  });
  
  // Check if user just completed onboarding
  const justCompleted = localStorage.getItem('onboarding_just_completed') === 'true';
  console.log('[ROUTER] LocalStorage onboarding_just_completed:', localStorage.getItem('onboarding_just_completed'));
  
  // Clear any stale onboarding flags for non-onboarded users
  if (user && !user.isOnboarded && justCompleted) {
    console.log('[ROUTER] Clearing stale onboarding flag for non-onboarded user');
    localStorage.removeItem('onboarding_just_completed');
  }
  
  // If user just completed onboarding, allow dashboard access regardless of cached user state
  if (justCompleted && user?.isOnboarded) {
    console.log('[ROUTER] User just completed onboarding, allowing dashboard access');
    // Clear the flag since we're allowing access
    localStorage.removeItem('onboarding_just_completed');
    return <AuthenticatedApp />;
  }
  
  // SOLUTION: Allow authenticated users to access the full app regardless of onboarding status
  // This bypasses the onboarding check issue for existing users
  if (user && !user.isOnboarded) {
    console.log('[ROUTER] User not onboarded but authenticated - allowing full app access (existing user bypass)');
    // Return the full authenticated app instead of restricting to public pages
    return <AuthenticatedApp />;
  }
  
  console.log('[ROUTER] User is onboarded, showing authenticated app');

  return <AuthenticatedApp />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
