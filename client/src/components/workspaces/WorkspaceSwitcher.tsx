import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, Plus } from "lucide-react";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useLocation } from "wouter";

export function WorkspaceSwitcher() {
  const { workspaces, currentWorkspace, setCurrentWorkspace } = useWorkspace();
  const [, setLocation] = useLocation();

  if (!currentWorkspace) {
    return (
      <div className="glassmorphism px-4 py-2 rounded-lg animate-pulse">
        <div className="w-32 h-4 bg-cosmic-blue rounded"></div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="glassmorphism px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all particle-trail">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 workspace-planet rounded-full animate-glow"></div>
            <span>{currentWorkspace.name}</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 glassmorphism border-electric-cyan/30">
        {workspaces.map((workspace) => (
          <DropdownMenuItem
            key={workspace.id}
            onClick={() => setCurrentWorkspace(workspace)}
            className={`flex items-center space-x-3 cursor-pointer ${
              currentWorkspace.id === workspace.id ? 'bg-electric-cyan/20' : ''
            }`}
          >
            <div className="w-4 h-4 workspace-planet rounded-full"></div>
            <div className="flex-1">
              <div className="font-medium">{workspace.name}</div>
              {workspace.description && (
                <div className="text-xs text-asteroid-silver">{workspace.description}</div>
              )}
            </div>
            {workspace.isDefault && (
              <div className="text-xs text-solar-gold">Default</div>
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          onClick={() => setLocation('/workspaces')}
          className="flex items-center space-x-3 cursor-pointer border-t border-electric-cyan/30 mt-2 pt-2"
        >
          <Plus className="h-4 w-4 text-electric-cyan" />
          <span>Manage Workspaces</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
