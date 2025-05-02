
// hooks/useTransactions.ts
import { useQuery } from '@tanstack/react-query';

interface Transaction {
  id: string;
  date: string;
  accountId: string;
  categoryId: string;
  payee: string;
  amount: number;
  notes: string | null;
  created_at: string;
}

export const useTransactions = () => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await fetch('/api/transactions', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data = await response.json();
      console.log('Fetched transactions:', data);

      return data.transactions as Transaction[];
    },
  });
};