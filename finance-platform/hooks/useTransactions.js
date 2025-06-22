import { useQuery } from '@tanstack/react-query';

const useTransactions = () => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/transactions', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          },
        });

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('Non-JSON response:', text.slice(0, 100));
          throw new Error('Server returned an invalid response');
        }

        const data = await response.json();
        if (!response.ok) {
          console.error('Fetch transactions error:', data);
          throw new Error(data.error || 'Failed to fetch transactions');
        }

        console.log('Fetched transactions:', data);
        return data.transactions || [];
      } catch (error) {
        console.error('useTransactions error:', error.message);
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export { useTransactions };