import { useState, useEffect, createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { Workspace } from '@shared/schema';

interface WorkspaceContextType {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  setCurrentWorkspace: (workspace: Workspace) => void;
  loading: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextType>({
  workspaces: [],
  currentWorkspace: null,
  setCurrentWorkspace: () => {},
  loading: true
});

export function useWorkspace() {
  const { user, token } = useAuth();
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);

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

  return {
    workspaces,
    currentWorkspace,
    setCurrentWorkspace,
    loading: isLoading
  };
}

export const WorkspaceProvider = WorkspaceContext.Provider;
export default WorkspaceContext;
