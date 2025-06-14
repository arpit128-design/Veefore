import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { useWorkspaceContext } from "./useWorkspace";
import { useEffect } from "react";

// Instant data loading hook with aggressive prefetching
export function useInstantData() {
  const { user, token } = useAuth();
  const { currentWorkspace } = useWorkspaceContext();
  const queryClient = useQueryClient();

  // Prefetch all critical data immediately when workspace changes
  useEffect(() => {
    if (!user || !currentWorkspace || !token) return;

    const prefetchData = async () => {
      const workspaceId = currentWorkspace.id;
      const headers = { 'Authorization': `Bearer ${token}` };

      // Prefetch all dashboard data in parallel
      const prefetchPromises = [
        queryClient.prefetchQuery({
          queryKey: ['/api/dashboard/analytics', workspaceId],
          queryFn: () => fetch(`/api/dashboard/analytics?workspaceId=${workspaceId}`, { headers }).then(res => res.json()),
          staleTime: 300000, // 5 minutes
        }),
        queryClient.prefetchQuery({
          queryKey: ['/api/chat-performance', workspaceId],
          queryFn: () => fetch(`/api/chat-performance?workspaceId=${workspaceId}`, { headers }).then(res => res.json()),
          staleTime: 300000,
        }),
        queryClient.prefetchQuery({
          queryKey: ['/api/hashtags/trending', workspaceId],
          queryFn: () => fetch(`/api/hashtags/trending?category=all&workspaceId=${workspaceId}`, { headers }).then(res => res.json()),
          staleTime: 300000,
        }),
        queryClient.prefetchQuery({
          queryKey: ['/api/social-accounts', workspaceId],
          queryFn: () => fetch(`/api/social-accounts?workspaceId=${workspaceId}`, { headers }).then(res => res.json()),
          staleTime: 300000,
        }),
        queryClient.prefetchQuery({
          queryKey: ['/api/scheduled-content', workspaceId],
          queryFn: () => fetch(`/api/scheduled-content?workspaceId=${workspaceId}`, { headers }).then(res => res.json()),
          staleTime: 300000,
        }),
        queryClient.prefetchQuery({
          queryKey: ['/api/automation/rules', workspaceId],
          queryFn: () => fetch(`/api/automation/rules/${workspaceId}`, { headers }).then(res => res.json()),
          staleTime: 300000,
        }),
      ];

      try {
        await Promise.all(prefetchPromises);
        console.log('[INSTANT DATA] All critical data prefetched successfully');
      } catch (error) {
        console.log('[INSTANT DATA] Prefetch error (non-blocking):', error);
      }
    };

    // Immediate prefetch with debouncing
    const timer = setTimeout(prefetchData, 100);
    return () => clearTimeout(timer);
  }, [user, currentWorkspace, token, queryClient]);

  return {
    prefetchComplete: true
  };
}

// Instant analytics hook - serves cached data immediately
export function useInstantAnalytics() {
  const { token } = useAuth();
  const { currentWorkspace } = useWorkspaceContext();

  return useQuery({
    queryKey: ['/api/dashboard/analytics', currentWorkspace?.id],
    queryFn: () => fetch(`/api/dashboard/analytics?workspaceId=${currentWorkspace?.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()),
    enabled: !!currentWorkspace && !!token,
    staleTime: 300000, // 5 minutes
    gcTime: 1800000, // 30 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    // Return immediately with cached data if available
    placeholderData: (previousData) => previousData,
  });
}

// Instant social accounts hook
export function useInstantSocialAccounts() {
  const { token } = useAuth();
  const { currentWorkspace } = useWorkspaceContext();

  return useQuery({
    queryKey: ['/api/social-accounts', currentWorkspace?.id],
    queryFn: () => fetch(`/api/social-accounts?workspaceId=${currentWorkspace?.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()),
    enabled: !!currentWorkspace && !!token,
    staleTime: 300000,
    gcTime: 1800000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });
}

// Instant hashtags hook with category filtering
export function useInstantHashtags(category: string = 'all') {
  const { token } = useAuth();
  const { currentWorkspace } = useWorkspaceContext();

  return useQuery({
    queryKey: ['/api/hashtags/trending', currentWorkspace?.id, category],
    queryFn: () => fetch(`/api/hashtags/trending?category=${category}&workspaceId=${currentWorkspace?.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()),
    enabled: !!currentWorkspace && !!token,
    staleTime: 60000, // 1 minute for category changes
    gcTime: 300000, // 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });
}

// Instant chat performance hook
export function useInstantChatPerformance() {
  const { token } = useAuth();
  const { currentWorkspace } = useWorkspaceContext();

  return useQuery({
    queryKey: ['/api/chat-performance', currentWorkspace?.id],
    queryFn: () => fetch(`/api/chat-performance?workspaceId=${currentWorkspace?.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()),
    enabled: !!currentWorkspace && !!token,
    staleTime: 300000,
    gcTime: 1800000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });
}