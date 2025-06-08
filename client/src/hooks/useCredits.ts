import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';

export function useCredits() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get latest user data with automatic refetch for real-time credit updates
  const { data: latestUser } = useQuery({
    queryKey: ["/api/user"],
    refetchInterval: 2000, // Check for updates every 2 seconds
    staleTime: 0, // Always refetch to get latest credits
    enabled: !!user?.id,
  });

  const { data: transactions } = useQuery({
    queryKey: ['credit-transactions', user?.id],
    queryFn: () => fetch(`/api/credit-transactions?userId=${user?.id}`, {
      headers: {
        'Authorization': `Bearer ${user?.firebaseUid}`
      }
    }).then(res => res.json()),
    enabled: !!user?.id
  });

  return {
    credits: latestUser?.credits ?? user?.credits ?? 0,
    transactions: transactions || [],
    refreshCredits: () => queryClient.invalidateQueries({ queryKey: ["/api/user"] })
  };
}
