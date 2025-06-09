import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
  const [isRestored, setIsRestored] = useState(false);

  const { data: workspaces = [], isLoading } = useQuery({
    queryKey: ['workspaces', user?.id],
    queryFn: () => fetch('/api/workspaces', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => res.json()),
    enabled: !!user?.id && !!token
  });

  // Set default workspace when workspaces load - prioritize cvfbf workspace
  useEffect(() => {
    if (workspaces.length > 0 && !currentWorkspace) {
      // Always prioritize cvfbf workspace if it exists and has credits
      const cvfbfWorkspace = workspaces.find((w: Workspace) => w.name === 'cvfbf');
      if (cvfbfWorkspace && cvfbfWorkspace.credits && cvfbfWorkspace.credits > 0) {
        console.log('[WORKSPACE] Selecting cvfbf workspace with', cvfbfWorkspace.credits, 'credits');
        setCurrentWorkspace(cvfbfWorkspace);
        return;
      }
      
      // Fallback to default workspace logic
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
  const queryClient = useQueryClient();
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

  // Save current workspace to localStorage when it changes
  useEffect(() => {
    if (currentWorkspace && user?.id) {
      const storageKey = `veefore_current_workspace_${user.id}`;
      localStorage.setItem(storageKey, JSON.stringify(currentWorkspace));
    }
  }, [currentWorkspace, user?.id]);

  // Restore workspace from localStorage or set default when workspaces load
  useEffect(() => {
    if (workspaces.length > 0 && !currentWorkspace && user?.id) {
      const storageKey = `veefore_current_workspace_${user.id}`;
      const savedWorkspace = localStorage.getItem(storageKey);
      
      let workspaceToSet: Workspace | null = null;
      
      if (savedWorkspace) {
        try {
          const parsedWorkspace = JSON.parse(savedWorkspace);
          console.log('[WORKSPACE PROVIDER] Attempting to restore workspace:', parsedWorkspace);
          
          // Try to find by ID first
          let foundWorkspace = workspaces.find((w: Workspace) => w.id === parsedWorkspace.id);
          
          // If not found by ID, try to find by name (for backup compatibility)
          if (!foundWorkspace && parsedWorkspace.name) {
            foundWorkspace = workspaces.find((w: Workspace) => w.name === parsedWorkspace.name);
            console.log('[WORKSPACE PROVIDER] Found workspace by name fallback:', foundWorkspace?.name, foundWorkspace?.id);
          }
          
          if (foundWorkspace) {
            workspaceToSet = foundWorkspace;
            console.log('[WORKSPACE PROVIDER] Restored workspace from localStorage:', foundWorkspace.name, 'ID:', foundWorkspace.id);
          } else {
            console.log('[WORKSPACE PROVIDER] Saved workspace not found in current workspaces');
          }
        } catch (error) {
          console.log('[WORKSPACE PROVIDER] Error parsing saved workspace:', error);
        }
      }
      
      // Fall back to default workspace if no saved workspace or it doesn't exist
      if (!workspaceToSet) {
        workspaceToSet = workspaces.find((w: Workspace) => w.isDefault) || workspaces[0];
        console.log('[WORKSPACE PROVIDER] Using default workspace:', workspaceToSet?.name);
      }
      
      if (workspaceToSet) {
        console.log('[WORKSPACE PROVIDER] Setting current workspace to:', workspaceToSet.name, 'ID:', workspaceToSet.id);
        setCurrentWorkspace(workspaceToSet);
        
        // Clear all cached data to ensure fresh queries with correct workspace
        queryClient.clear();
        console.log('[WORKSPACE PROVIDER] Cleared all cache after workspace restoration');
      }
    }
  }, [workspaces, currentWorkspace, user?.id, queryClient]);

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
    try {
      queryClient.invalidateQueries({ queryKey: ['social-accounts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-analytics'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['analytics-realtime'] });
      queryClient.invalidateQueries({ queryKey: ['content'] });
      queryClient.invalidateQueries({ queryKey: ['automation-rules'] });
      console.log('[WORKSPACE PROVIDER] Query cache invalidated successfully');
    } catch (error) {
      console.error('[WORKSPACE PROVIDER] Error invalidating queries:', error);
    }
    
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
