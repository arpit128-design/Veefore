import { Bell, Search, Command, Zap, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useWorkspaceContext } from "@/hooks/useWorkspace";

export function NovaHeader() {
  const { user, signOut } = useAuth();
  const { currentWorkspace } = useWorkspaceContext();

  return (
    <header className="nova-header fixed top-0 left-72 right-0 h-16 z-30 flex items-center justify-between px-6">
      {/* Left Section - Search & Commands */}
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search across the cosmos..."
              className="w-80 pl-10 nova-glass border-electric-cyan/20 focus:border-electric-cyan/50 focus:ring-electric-cyan/30"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="nova-glass border-electric-cyan/20 hover:border-electric-cyan/50 gap-2"
          >
            <Command className="w-4 h-4" />
            <span className="hidden md:inline">Quick Actions</span>
          </Button>
        </div>
      </div>

      {/* Center Section - Workspace Info */}
      <div className="flex items-center gap-3">
        <div className="nova-glass px-4 py-2 rounded-lg border border-electric-cyan/20">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-electric-cyan animate-nova-glow" />
            <span className="text-sm font-medium text-foreground">
              {currentWorkspace?.name || "Loading Workspace..."}
            </span>
            <Badge className="bg-quantum-green/20 text-quantum-green border-quantum-green/30 text-xs">
              Active
            </Badge>
          </div>
        </div>
      </div>

      {/* Right Section - Notifications & Profile */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="relative nova-glass border border-electric-cyan/20 hover:border-electric-cyan/50 w-10 h-10 p-0"
        >
          <Bell className="w-4 h-4" />
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-nebula-pink border-nebula-pink text-white text-xs flex items-center justify-center">
            3
          </Badge>
        </Button>

        {/* User Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="nova-glass border border-electric-cyan/20 hover:border-electric-cyan/50 gap-2 px-3"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cosmic-purple to-nebula-pink flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-foreground">
                  {user?.username || "User"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.plan || "Free"} Plan
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-56 nova-glass border-electric-cyan/20"
          >
            <DropdownMenuLabel className="text-foreground">
              Mission Control
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-electric-cyan/20" />
            <DropdownMenuItem className="gap-2 text-foreground hover:bg-electric-cyan/10">
              <User className="w-4 h-4" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-foreground hover:bg-electric-cyan/10">
              <Settings className="w-4 h-4" />
              System Config
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-electric-cyan/20" />
            <DropdownMenuItem 
              className="gap-2 text-destructive hover:bg-destructive/10"
              onClick={signOut}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Credits Display */}
        <div className="nova-glass px-3 py-2 rounded-lg border border-solar-gold/20">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-solar-gold animate-nova-pulse" />
            <span className="text-sm font-bold text-solar-gold">
              {user?.credits || 0}
            </span>
            <span className="text-xs text-muted-foreground">Credits</span>
          </div>
        </div>
      </div>
    </header>
  );
}