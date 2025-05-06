'use client';

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useNewAccount } from "@/app/api/accounts/hooks/use-new-account";
import { useImportTransaction } from "@/hooks/useImportTransaction";
import { useAccounts } from "@/hooks/useAccount";
import { useCategories } from "@/hooks/useCategories";
import NewTransactionSheet from "@/components/new-transaction-sheet";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Button from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { columns } from "@/app/(dashboard)/transactions/columns";
import DataTable from "@/components/accounts/data-table";
import { useTransactions } from "@/hooks/useTransactions";
import { deleteTransactions } from "@/app/api/transactions/actions/delete-transactions";
import { toast } from "react-toastify";
import { formatCurrency } from "@/lib/utils/transaction";

const TransactionsPage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data = [], isLoading, error, refetch } = useTransactions();
  const { isOpen, onOpen } = useNewAccount();
  const { isImporting, importReceipt, importedData } = useImportTransaction();
  const { data: accounts = [] } = useAccounts();
  const { data: categories = [] } = useCategories();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check', {
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        const data = await res.json();
        console.log('Transactions Page Auth Check Response:', data);
        setIsAuthenticated(data.isAuthenticated);
        if (!data.isAuthenticated) {
          console.log('Transactions: Not authenticated, redirecting to /login');
          router.push('/login');
        }
      } catch (err) {
        console.error('Auth check error:', err.message);
        setIsAuthenticated(false);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!isOpen) {
      console.log('NewTransactionSheet closed, re-fetching transactions');
      refetch();
    }
  }, [isOpen, refetch]);

  const handleDelete = async (rows) => {
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

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const result = await importReceipt(file);
    if (result.error) {
      toast.error(result.error);
    } else {
      if (importedData) {
        onOpen();
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (loading || isAuthenticated === null) {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  // Pass categories, accounts, and currency to columns
  const transactionColumns = columns(categories, accounts, '₹', formatCurrency);

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
              columns={transactionColumns}
              data={data}
              onDelete={handleDelete}
              disabled={false}
              filterColumn="payee"
              currency="₹"
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
        currency="₹"
      />
    </div>
  );
};

export default TransactionsPage;