export interface AuthResponse {
  error?: string | null;
  message?: string;
  user?: { id: string; email: string; role: string };
}

export interface OverviewData {
  remaining: number;
  income: number;
  expenses: number;
  transactions: Array<{
    id: string;
    date: string;
    accountId: string;
    categoryId: string;
    payee: string;
    amount: number;
    notes: string | null;
    created_at: string;
  }>;
  categories: Array<{
    id: string;
    name: string;
    created_at: string;
  }>;
}

export type OverviewResponse = 
  | { error: string | null }
  | OverviewData;