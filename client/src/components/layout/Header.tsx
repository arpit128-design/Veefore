import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { WorkspaceSwitcher } from "@/components/workspaces/WorkspaceSwitcher";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useAuth } from "@/hooks/useAuth";
import { useCredits } from "@/hooks/useCredits";
import { Bell, Satellite, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { user } = useAuth();
  const { credits } = useCredits();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glassmorphism">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
            <img 
              src="/veefore-logo.png" 
              alt="VeeFore Logo" 
              className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 object-contain"
            />
            <h1 className="text-base sm:text-lg md:text-2xl font-orbitron font-bold neon-text text-electric-cyan">VeeFore</h1>
          </div>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden glassmorphism"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 text-electric-cyan" />
            ) : (
              <Menu className="h-5 w-5 text-electric-cyan" />
            )}
          </Button>
          
          {/* Desktop Controls */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <WorkspaceSwitcher />
            
            {/* Credit Display */}
            <div className="flex items-center space-x-2 glassmorphism px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg border border-electric-cyan/20 hover:border-electric-cyan/40 transition-all duration-300">
              <div className="w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-gradient-to-r from-solar-gold to-electric-cyan animate-pulse-glow flex items-center justify-center">
                <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-white"></div>
              </div>
              <span className="text-solar-gold font-mono text-lg font-bold">{credits.toLocaleString()}</span>
              <span className="text-xs text-electric-cyan font-medium">Credits</span>
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

          {/* Mobile User Avatar */}
          <Avatar className="w-8 h-8 md:hidden border-2 border-electric-cyan">
            <AvatarImage src={user?.avatar || ""} alt={user?.username || ""} />
            <AvatarFallback className="bg-gradient-to-r from-electric-cyan to-nebula-purple text-xs">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-electric-cyan/20">
            <div className="space-y-4 pt-4">
              <WorkspaceSwitcher />
              
              {/* Credit Display */}
              <div className="flex items-center justify-center space-x-2 glassmorphism px-3 py-2 rounded-lg border border-electric-cyan/20">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-solar-gold to-electric-cyan animate-pulse-glow flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                </div>
                <span className="text-solar-gold font-mono font-bold">{credits.toLocaleString()}</span>
                <span className="text-xs text-electric-cyan font-medium">Credits</span>
              </div>
              
              {/* Notifications */}
              <div className="flex justify-center">
                <Button variant="ghost" size="icon" className="relative glassmorphism hover:bg-opacity-80">
                  <Satellite className="h-5 w-5 text-electric-cyan" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-solar-gold text-xs p-0 flex items-center justify-center">
                    3
                  </Badge>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
