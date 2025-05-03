// hooks/useAccounts.ts
import { useQuery } from '@tanstack/react-query';

interface Account {
  id: string;
  name: string;
  plaidId: string | null;
  created_at: string;
}

export const useAccounts = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await fetch('/api/accounts', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch accounts');
      }

      const data = await response.json();
      console.log('Fetched accounts:', data);

      return data.accounts as Account[];
    },
  });
};