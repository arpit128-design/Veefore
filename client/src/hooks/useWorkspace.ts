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
    if (workspace.id === currentWorkspace?.id) return;
    
    setIsSwitching(true);
    
    // Create switching animation delay - slower for readability
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    setCurrentWorkspace(workspace);
    setIsSwitching(false);
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
    if (workspace.id === currentWorkspace?.id) return;
    
    setIsSwitching(true);
    
    // Create switching animation delay - slower for readability
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    setCurrentWorkspace(workspace);
    setIsSwitching(false);
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
