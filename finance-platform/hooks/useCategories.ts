
// hooks/useCategories.ts
import { useQuery } from '@tanstack/react-query';

interface Category {
  id: string;
  name: string;
  plaidId: string | null;
  created_at: string;
}

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      console.log('Fetched categories:', data);

      return data.categories as Category[];
    },
  });
};
