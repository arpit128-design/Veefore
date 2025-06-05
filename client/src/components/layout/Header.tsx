import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { WorkspaceSwitcher } from "@/components/workspaces/WorkspaceSwitcher";
import { useAuth } from "@/hooks/useAuth";
import { useCredits } from "@/hooks/useCredits";
import { Bell, Satellite } from "lucide-react";

export function Header() {
  const { user } = useAuth();
  const { credits } = useCredits();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glassmorphism">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-electric-cyan to-nebula-purple animate-pulse-glow"></div>
            <h1 className="text-2xl font-orbitron font-bold neon-text text-electric-cyan">VeeFore</h1>
          </div>
          
          {/* Workspace Switcher and Controls */}
          <div className="flex items-center space-x-6">
            <WorkspaceSwitcher />
            
            {/* Credit Display */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-2 bg-space-gray rounded-full overflow-hidden">
                <div className="h-full energy-bar w-3/4"></div>
              </div>
              <span className="text-solar-gold font-mono">{credits.toLocaleString()}</span>
              <span className="text-xs text-asteroid-silver">credits</span>
            </div>
            
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative glassmorphism hover:bg-opacity-80">
              <Satellite className="h-5 w-5 text-electric-cyan" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-solar-gold text-xs p-0 flex items-center justify-center">
                3
              </Badge>
            </Button>
            
            {/* User Avatar */}
            <Avatar className="w-10 h-10 border-2 border-electric-cyan animate-float">
              <AvatarImage src={user?.avatar || ""} alt={user?.username || ""} />
              <AvatarFallback className="bg-gradient-to-r from-electric-cyan to-nebula-purple">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
