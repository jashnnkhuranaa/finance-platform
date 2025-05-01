// hooks/useAccount.ts
'use client';

import { useQuery } from '@tanstack/react-query';

interface Account {
  id: string;
  name: string;
  plaidId: string | null;
  created_at: string;
}

const fetchAccounts = async (): Promise<Account[]> => {
  const res = await fetch('/api/accounts', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch accounts: ${res.status}`);
  }

  const data = await res.json();
  console.log('Fetched accounts:', data); // Debug log
  return data.accounts || [];
};

export const useAccounts = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: fetchAccounts,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};