"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Payment, columns } from "@/app/(dashboard)/accounts/columns";
import { DataTable } from "@/components/accounts/data-table"

const data: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@gmail.com",
  },
]

const AccountsPage = () => {
  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none">
  <CardHeader className="border-none px-6">
    <div className="border-none flex w-full items-center justify-between">
      <CardTitle className="text-xl line-clamp-1">Accounts</CardTitle>
      <Button size="sm">
        <Plus className="size-4 mr-2" />
        Add Account
      </Button>
    </div>
  </CardHeader>

  <CardContent>
    <DataTable 
    columns={columns} 
    data={data} 
    onDelete={()=> {}}
    disabled={false} />
  </CardContent>
</Card>

    </div>
  );
};

export default AccountsPage;
