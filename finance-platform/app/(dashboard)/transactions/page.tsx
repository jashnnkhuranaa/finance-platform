// app/(dashboard)/transactions/page.tsx
'use client';

import { useEffect } from 'react';
import { useNewAccount } from '@/app/api/accounts/hooks/use-new-account';
import { NewTransactionSheet } from '@/components/new-transaction-sheet';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { columns } from '@/app/(dashboard)/transactions/columns';
import { DataTable } from '@/components/accounts/data-table';
import { useTransactions } from '@/hooks/useTransactions';
import { deleteTransactions } from '@/app/api/transactions/actions/delete-transactions';
import { toast } from 'react-toastify';
import { Row } from '@tanstack/react-table';

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

const TransactionsPage = () => {
  const { data = [], isLoading, error, refetch } = useTransactions();
  const { isOpen, onOpen } = useNewAccount();

  useEffect(() => {
    if (!isOpen) {
      console.log('NewTransactionSheet closed, re-fetching transactions');
      refetch();
    }
  }, [isOpen, refetch]);

  const handleDelete = async (rows: Row<Transaction>[]) => {
    if (rows.length === 0) {
      toast.error('No transactions selected');
      return;
    }

    const transactionIds = rows.map((row) => row.original.id);
    console.log('Deleting transactions:', transactionIds);

    const result = await deleteTransactions(transactionIds);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`Successfully deleted ${result.deletedCount} transaction(s)`);
      refetch();
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none">
        <CardHeader className="border-none px-6">
          <div className="flex w-full items-center justify-between">
            <CardTitle className="text-xl">Transaction History</CardTitle>
            <Button size="sm" onClick={onOpen}>
              <Plus className="size-4 mr-2" />
              Add new
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground px-6 py-2">
              Loading transactions...
            </p>
          ) : error ? (
            <p className="text-sm text-red-600 px-6 py-2">
              Error: {error.message}
            </p>
          ) : (
            <DataTable
              columns={columns}
              data={data}
              onDelete={handleDelete}
              disabled={false}
            />
          )}
        </CardContent>
      </Card>
      <NewTransactionSheet />
    </div>
  );
};

export default TransactionsPage;