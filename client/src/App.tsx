import { useEffect, useState } from "react";
import { Switch, Route, Redirect, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SpaceBackground } from "@/components/layout/SpaceBackground";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { SpaceLoader } from "@/components/ui/space-loader";
import { useAuth } from "@/hooks/useAuth";
import { WorkspaceProvider } from "@/hooks/useWorkspace";
import { GlobalWorkspaceSwitchingOverlay } from "@/components/workspaces/GlobalWorkspaceSwitchingOverlay";

// Pages
import Dashboard from "@/pages/Dashboard";
import ContentStudio from "@/pages/ContentStudio";
import Scheduler from "@/pages/Scheduler";
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
import SubscriptionEnhanced from "@/pages/SubscriptionEnhanced";
import Auth from "@/pages/Auth";
import OnboardingPremium from "@/pages/OnboardingPremium";

import Landing from "@/pages/Landing";
import Subscribe from "@/pages/Subscribe";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import NotFound from "@/pages/not-found";

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
        <SpaceBackground />
        <Header />
        <div className="flex pt-12 sm:pt-14 md:pt-16 lg:pt-20 min-h-screen pb-16 sm:pb-20 md:pb-0">
          <Sidebar />
          <main className="flex-1 ml-0 md:ml-56 lg:ml-64 p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8 relative z-10 transition-all duration-300 max-w-full overflow-x-hidden">
            <Switch>
              <Route path="/" component={() => <Redirect to="/dashboard" />} />
              <Route path="/auth" component={() => <Redirect to="/dashboard" />} />
              <Route path="/onboarding" component={OnboardingPremium} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/content-studio" component={ContentStudio} />
              <Route path="/scheduler" component={Scheduler} />
              <Route path="/analyzer" component={Analyzer} />
              <Route path="/ai-suggestions" component={Suggestions} />
              <Route path="/content-recommendations" component={ContentRecommendations} />
              <Route path="/automation" component={Automation} />
              <Route path="/conversations" component={Conversations} />
              <Route path="/workspaces" component={Workspaces} />
              <Route path="/team" component={TeamManagement} />
              <Route path="/integrations" component={Integrations} />
              <Route path="/referrals" component={Referrals} />
              <Route path="/settings" component={Settings} />
              <Route path="/subscription" component={SubscriptionEnhanced} />
              <Route path="/pricing" component={Pricing} />
              <Route path="/subscribe" component={Subscribe} />
              <Route path="/privacy-policy" component={PrivacyPolicy} />
              <Route path="/terms-of-service" component={TermsOfService} />
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
        <GlobalWorkspaceSwitchingOverlay />
      </div>
    </WorkspaceProvider>
  );
}

function Router() {
  const { user, loading } = useAuth();
  const [showLoader, setShowLoader] = useState(true);
  const [location] = useLocation(); // Move hook to top level

  useEffect(() => {
    // Fast loading screen - reduced to 800ms
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 800); // Fast loading time

    return () => clearTimeout(timer);
  }, []);

  // Clear completion flag after authentication app loads
  useEffect(() => {
    if (user?.isOnboarded) {
      const justCompleted = localStorage.getItem('onboarding_just_completed');
      if (justCompleted === 'true') {
        localStorage.removeItem('onboarding_just_completed');
      }
    }
  }, [user?.isOnboarded]);

  if (loading || showLoader) {
    return <SpaceLoader message="Initializing VeeFore" />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-space-navy text-white overflow-hidden relative">
        <SpaceBackground />
        <Switch>
          <Route path="/auth" component={Auth} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms-of-service" component={TermsOfService} />
          <Route path="/" component={Landing} />
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
  
  // Allow onboarding page access for non-onboarded users
  if (user && !user.isOnboarded && location === '/onboarding') {
    console.log('[ROUTER] User on onboarding page, allowing access');
    return (
      <Switch>
        <Route path="/onboarding" component={OnboardingPremium} />
        <Route component={() => <Redirect to="/onboarding" />} />
      </Switch>
    );
  }
  
  // Redirect non-onboarded users to onboarding
  if (user && !user.isOnboarded) {
    console.log('[ROUTER] User needs onboarding, redirecting to /onboarding');
    return <Redirect to="/onboarding" />;
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
