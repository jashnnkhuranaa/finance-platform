// app/(dashboard)/transactions/page.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useNewAccount } from '@/app/api/accounts/hooks/use-new-account';
import { useImportTransaction } from '@/hooks/useImportTransaction';
import { useAccounts } from '@/hooks/useAccount';
import { useCategories } from '@/hooks/useCategories';
import { NewTransactionSheet } from '@/components/new-transaction-sheet';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';
import { columns } from '@/app/(dashboard)/transactions/columns';
import { DataTable } from '@/components/accounts/data-table';
import { useTransactions } from '@/hooks/useTransactions';
import { deleteTransactions } from '@/app/api/transactions/actions/delete-transactions';
import { toast } from 'react-toastify';
import { Row } from '@tanstack/react-table';

// Debug: Log columns safely
console.log('Imported Columns:', columns.map(col => (col as any).id || (col as any).accessorKey || 'unknown'));

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
  const { isImporting, importReceipt, importedData } = useImportTransaction();
  const { data: accounts = [] } = useAccounts();
  const { data: categories = [] } = useCategories();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const result = await importReceipt(file);
    if (result.error) {
      toast.error(result.error);
    } else {
      if (importedData) {
        onOpen(); // Open sheet
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="border-none px-6">
          <div className="flex w-full items-center justify-between">
            <CardTitle className="text-xl">Transaction History</CardTitle>
            <div className="flex space-x-2">
              <Button size="sm" onClick={onOpen}>
                <Plus className="size-4 mr-2" />
                Add new
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleImportClick}
                disabled={isImporting}
              >
                <Upload className="size-4 mr-2" />
                {isImporting ? 'Importing...' : 'Import'}
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
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
              filterColumn="payee" // Added payee filter
            />
          )}
        </CardContent>
      </Card>
      <NewTransactionSheet
        defaultValues={
          importedData
            ? {
                ...importedData,
                accountId: accounts.length > 0 ? accounts[0].id : '',
                categoryId: categories.length > 0 ? categories[0].id : '',
              }
            : undefined
        }
      />
    </div>
  );
};

export default TransactionsPage;