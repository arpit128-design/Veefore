import { Button } from "@/components/ui/button";
import { Moon, Sun, Settings, Bell, Search, User, Menu, X } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProfessionalHeaderProps {
  onMobileMenuToggle?: () => void;
}

export function ProfessionalHeader({ onMobileMenuToggle }: ProfessionalHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 h-14 sm:h-16 px-3 sm:px-6 flex items-center justify-between">
      {/* Left side - Mobile menu, Logo and search */}
      <div className="flex items-center gap-2 sm:gap-6">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onMobileMenuToggle}
          className="lg:hidden hover:bg-slate-100 text-slate-600 bg-white p-2"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-base sm:text-lg">V</span>
          </div>
          <span className="text-lg sm:text-xl font-semibold text-slate-800">VeeFore</span>
        </div>
        
        {/* Desktop Search */}
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input 
            placeholder="Search..." 
            className="pl-10 w-60 xl:w-80 bg-white border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />
        </div>
      </div>

      {/* Right side - Actions and user menu */}
      <div className="flex items-center gap-1 sm:gap-2 lg:gap-4">
        {/* Mobile Search Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="lg:hidden hover:bg-slate-100 text-slate-600 bg-white p-2"
        >
          <Search className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>

        {/* Dark mode toggle - Hidden on mobile */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="hidden sm:flex hover:bg-slate-100 text-slate-600 bg-white p-2"
        >
          {theme === 'light' ? <Moon className="h-4 w-4 sm:h-5 sm:w-5" /> : <Sun className="h-4 w-4 sm:h-5 sm:w-5" />}
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative hover:bg-slate-100 text-slate-600 bg-white p-2">
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="absolute -top-1 -right-1 h-2 w-2 sm:h-3 sm:w-3 bg-red-500 rounded-full"></span>
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-1 sm:gap-2 hover:bg-slate-100 bg-white p-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-100 rounded-full flex items-center justify-center">
                <User className="h-3 w-3 sm:h-4 sm:w-4 text-slate-600" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-800 hidden sm:block">
                {user?.username || user?.email || 'User'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-600">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="absolute top-14 sm:top-16 left-0 right-0 bg-white border-b border-slate-200 p-4 lg:hidden z-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input 
              placeholder="Search..." 
              className="pl-10 w-full bg-white border-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              autoFocus
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(false)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-slate-100 text-slate-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}