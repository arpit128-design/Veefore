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
        <div className="flex pt-16 md:pt-20 min-h-screen pb-20 md:pb-0">
          <Sidebar />
          <main className="flex-1 ml-0 md:ml-64 p-3 md:p-8 relative z-10 transition-all duration-300 max-w-full overflow-x-hidden">
            <Switch>
              <Route path="/" component={() => <Redirect to="/dashboard" />} />
              <Route path="/onboarding" component={NewOnboarding} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/content-studio" component={ContentStudio} />
              <Route path="/scheduler" component={Scheduler} />
              <Route path="/analyzer" component={Analyzer} />
              <Route path="/ai-suggestions" component={Suggestions} />
              <Route path="/content-recommendations" component={ContentRecommendations} />
              <Route path="/automation" component={Automation} />
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
    // Add a minimum display time for the loading screen
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 3000); // 3 seconds minimum display time

    return () => clearTimeout(timer);
  }, []);

  if (loading || showLoader) {
    return <SpaceLoader message="Connecting to VeeFore Network" />;
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
  console.log('[ROUTER] User state:', { username: user?.username, isOnboarded: user?.isOnboarded });
  
  if (user && !user.isOnboarded) {
    console.log('[ROUTER] User needs onboarding, redirecting to /onboarding');
    return (
      <Switch>
        <Route path="/onboarding" component={NewOnboarding} />
        <Route component={() => <Redirect to="/onboarding" />} />
      </Switch>
    );
  }
  
  console.log('[ROUTER] User is onboarded, showing authenticated app');

  // Check if onboarded user is on onboarding page and redirect them
  if (location === '/onboarding') {
    console.log('[ROUTER] Onboarded user on /onboarding, redirecting to /dashboard');
    return <Redirect to="/dashboard" />;
  }

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
