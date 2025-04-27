// features/accounts/api/use-get-accounts.ts

import { useQuery } from '@tanstack/react-query';

export function useGetAccounts() {
  const query = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const res = await fetch('/api/accounts');
      if (!res.ok) throw new Error('Failed to fetch accounts');
      
      const { data } = await res.json();
      return data;
    },
  });
  return query
}
