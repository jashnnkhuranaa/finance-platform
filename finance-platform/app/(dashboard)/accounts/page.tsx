"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { columns } from "@/app/(dashboard)/accounts/columns";
import { DataTable } from "@/components/accounts/data-table";
import { useAccounts } from "@/hooks/useAccount";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AccountForm } from "@/components/account-form";

const AccountsPage = () => {
  const { data: accounts = [], isLoading, refetch } = useAccounts();

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none">
        <CardHeader className="border-none px-6">
          <div className="flex w-full items-center justify-between">
            <CardTitle className="text-xl">Accounts</CardTitle>

            {/* Dialog for Add Account */}
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="size-4 mr-2" />
                  Add Account
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Account</DialogTitle>
                </DialogHeader>

                <AccountForm
                  onSubmit={() => {
                    refetch(); // ⬅️ Refresh table after submit
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground px-6 py-2">
              Loading accounts...
            </p>
          ) : (
            <DataTable
              columns={columns}
              data={accounts}
              onDelete={() => {}}
              disabled={false}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountsPage;
