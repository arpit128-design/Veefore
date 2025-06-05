import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';

export function useCredits() {
  const { user } = useAuth();

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
    credits: user?.credits || 0,
    transactions: transactions || []
  };
}
