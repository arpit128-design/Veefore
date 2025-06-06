import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { Workspace } from '@shared/schema';

interface WorkspaceContextType {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  setCurrentWorkspace: (workspace: Workspace) => void;
  loading: boolean;
  isSwitching: boolean;
  switchWorkspace: (workspace: Workspace) => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType>({
  workspaces: [],
  currentWorkspace: null,
  setCurrentWorkspace: () => {},
  loading: true,
  isSwitching: false,
  switchWorkspace: async () => {}
});

export function useWorkspace() {
  const { user, token } = useAuth();
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);

  const { data: workspaces = [], isLoading } = useQuery({
    queryKey: ['workspaces', user?.id],
    queryFn: () => fetch('/api/workspaces', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => res.json()),
    enabled: !!user?.id && !!token
  });

  // Set default workspace when workspaces load
  useEffect(() => {
    if (workspaces.length > 0 && !currentWorkspace) {
      const defaultWorkspace = workspaces.find((w: Workspace) => w.isDefault) || workspaces[0];
      setCurrentWorkspace(defaultWorkspace);
    }
  }, [workspaces, currentWorkspace]);

  const switchWorkspace = async (workspace: Workspace) => {
    console.log('[WORKSPACE] Switching from', currentWorkspace?.name, 'to', workspace.name);
    if (workspace.id === currentWorkspace?.id) {
      console.log('[WORKSPACE] Same workspace, skipping switch');
      return;
    }
    
    console.log('[WORKSPACE] Starting workspace switch animation');
    setIsSwitching(true);
    
    // Create switching animation delay - slower for readability
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('[WORKSPACE] Completing workspace switch to', workspace.name);
    setCurrentWorkspace(workspace);
    setIsSwitching(false);
    console.log('[WORKSPACE] Workspace switch completed');
  };

  return {
    workspaces,
    currentWorkspace,
    setCurrentWorkspace,
    loading: isLoading,
    isSwitching,
    switchWorkspace
  };
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { user, token } = useAuth();
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);

  const { data: workspaces = [], isLoading } = useQuery({
    queryKey: ['workspaces', user?.id],
    queryFn: () => fetch('/api/workspaces', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => res.json()),
    enabled: !!user?.id && !!token
  });

  // Set default workspace when workspaces load
  useEffect(() => {
    if (workspaces.length > 0 && !currentWorkspace) {
      const defaultWorkspace = workspaces.find((w: Workspace) => w.isDefault) || workspaces[0];
      setCurrentWorkspace(defaultWorkspace);
    }
  }, [workspaces, currentWorkspace]);

  const switchWorkspace = async (workspace: Workspace) => {
    console.log('[WORKSPACE PROVIDER] Switching from', currentWorkspace?.name, 'to', workspace.name);
    if (workspace.id === currentWorkspace?.id) {
      console.log('[WORKSPACE PROVIDER] Same workspace, skipping switch');
      return;
    }
    
    console.log('[WORKSPACE PROVIDER] Starting workspace switch animation');
    setIsSwitching(true);
    
    // Create switching animation delay - slower for readability
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('[WORKSPACE PROVIDER] Completing workspace switch to', workspace.name);
    setCurrentWorkspace(workspace);
    
    // Invalidate all workspace-dependent queries to force refresh
    console.log('[WORKSPACE PROVIDER] Invalidating all workspace-dependent queries');
    queryClient.invalidateQueries({ queryKey: ['social-accounts'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-analytics'] });
    queryClient.invalidateQueries({ queryKey: ['analytics'] });
    queryClient.invalidateQueries({ queryKey: ['analytics-realtime'] });
    queryClient.invalidateQueries({ queryKey: ['content'] });
    queryClient.invalidateQueries({ queryKey: ['automation-rules'] });
    
    setIsSwitching(false);
    console.log('[WORKSPACE PROVIDER] Workspace switch completed');
  };

  const contextValue = {
    workspaces,
    currentWorkspace,
    setCurrentWorkspace,
    loading: isLoading,
    isSwitching,
    switchWorkspace
  };
  
  return React.createElement(WorkspaceContext.Provider, { value: contextValue }, children);
}

export function useWorkspaceContext() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspaceContext must be used within a WorkspaceProvider');
  }
  return context;
}

export default WorkspaceContext;
