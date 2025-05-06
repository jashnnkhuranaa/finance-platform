'use client';

import React, { useEffect } from "react";
import { useNewAccount } from "@/app/api/accounts/hooks/use-new-account";
import NewAccountSheet from "@/components/NewAccountSheet";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import  Button  from "@/components/ui/button";
import { Plus } from "lucide-react";
import columns from "@/app/(dashboard)/accounts/columns";
import DataTable from "@/components/accounts/data-table";
import { useAccounts } from "@/hooks/useAccount";
import { deleteAccounts } from "@/app/api/accounts/actions/delete-account";
import { toast } from "react-toastify";

const AccountsPage = () => {
  const { data = [], isLoading, error, refetch } = useAccounts();
  const { isOpen, onOpen } = useNewAccount();

  useEffect(() => {
    if (!isOpen) {
      console.log("NewAccountSheet closed, re-fetching accounts");
      refetch();
    }
  }, [isOpen, refetch]);

  const handleDelete = async (rows) => {
    if (rows.length === 0) {
      toast.error("No accounts selected");
      return;
    }
    const accountIds = rows.map((row) => row.original.id);
    console.log("Deleting accounts:", accountIds);
    const result = await deleteAccounts(accountIds);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`Successfully deleted ${result.deletedCount} account(s)`);
      refetch();
    }
  };

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
              onDelete={handleDelete}
              disabled={false}
            />
          )}
        </CardContent>
      </Card>
      <NewAccountSheet type="account" />
    </div>
  );
};

export default AccountsPage;