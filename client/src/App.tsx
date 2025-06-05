import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SpaceBackground } from "@/components/layout/SpaceBackground";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/hooks/useAuth";

// Pages
import Dashboard from "@/pages/Dashboard";
import ContentStudio from "@/pages/ContentStudio";
import Scheduler from "@/pages/Scheduler";
import Analyzer from "@/pages/Analyzer";
import Suggestions from "@/pages/Suggestions";
import Workspaces from "@/pages/Workspaces";
import Referrals from "@/pages/Referrals";
import Settings from "@/pages/Settings";
import Auth from "@/pages/Auth";
import Subscribe from "@/pages/Subscribe";
import NotFound from "@/pages/not-found";

function AuthenticatedApp() {
  return (
    <div className="min-h-screen bg-space-navy text-white overflow-x-hidden">
      <SpaceBackground />
      <Header />
      <div className="flex pt-20 min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-64 p-8 relative z-10">
          <Switch>
            <Route path="/" component={() => <Redirect to="/dashboard" />} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/content-studio" component={ContentStudio} />
            <Route path="/scheduler" component={Scheduler} />
            <Route path="/analyzer" component={Analyzer} />
            <Route path="/suggestions" component={Suggestions} />
            <Route path="/workspaces" component={Workspaces} />
            <Route path="/referrals" component={Referrals} />
            <Route path="/settings" component={Settings} />
            <Route path="/subscribe" component={Subscribe} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function Router() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-space-navy flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-electric-cyan/30 border-t-electric-cyan rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-electric-cyan font-orbitron">Initializing Systems...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-space-navy text-white overflow-hidden relative">
        <SpaceBackground />
        <Switch>
          <Route path="/auth" component={Auth} />
          <Route component={() => <Redirect to="/auth" />} />
        </Switch>
      </div>
    );
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
