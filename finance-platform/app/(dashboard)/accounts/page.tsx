// app/accounts/page.tsx
'use client';

import { useEffect } from 'react';
import { useNewAccount } from '@/app/api/accounts/hooks/use-new-account';
import { NewAccountSheet } from '@/app/api/accounts/components/new-account-sheet';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { columns } from '@/app/(dashboard)/accounts/columns';
import { DataTable } from '@/components/accounts/data-table';
import { useAccounts } from '@/hooks/useAccount';

const AccountsPage = () => {
  const { data = [], isLoading, error, refetch } = useAccounts();
  const { isOpen, onOpen } = useNewAccount();

  // Re-fetch accounts when NewAccountSheet closes
  useEffect(() => {
    if (!isOpen) {
      console.log('NewAccountSheet closed, re-fetching accounts');
      refetch();
    }
  }, [isOpen, refetch]);

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none">
        <CardHeader className="border-none px-6">
          <div className="flex w-full items-center justify-between">
            <CardTitle className="text-xl">Accounts</CardTitle>
            <Button size="sm" onClick={onOpen}>
              <Plus className="size-4 mr-2" />
              Add Account
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground px-6 py-2">
              Loading accounts...
            </p>
          ) : error ? (
            <p className="text-sm text-red-600 px-6 py-2">
              Error: {error.message}
            </p>
          ) : (
            <DataTable
              columns={columns}
              data={data}
              onDelete={() => refetch()}
              disabled={false}
            />
          )}
        </CardContent>
      </Card>
      <NewAccountSheet />
    </div>
  );
};

export default AccountsPage;