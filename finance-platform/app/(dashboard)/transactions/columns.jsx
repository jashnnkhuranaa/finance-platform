'use client';

import { ArrowUpDown } from "lucide-react";
import Button from "@/components/ui/button";
import Checkbox from "@/components/ui/checkbox";

export const columns = (categories = [], accounts = [], currency = '₹', formatCurrency) => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => new Date(row.original.date).toLocaleDateString(),
  },
  {
    accessorKey: 'categoryId',
    header: 'Category',
    cell: ({ row }) => {
      const category = categories.find((cat) => cat.id === row.original.categoryId);
      return category ? category.name : 'N/A';
    },
  },
  {
    id: 'payee',
    accessorKey: 'payee',
    header: 'Payee',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = `${currency}${formatCurrency(Math.abs(amount))}`;
      return (
        <span className={amount < 0 ? 'text-red-600' : 'text-green-600'}>
          {formatted}
        </span>
      );
    },
  },
  {
    accessorKey: 'accountId',
    header: 'Account',
    cell: ({ row }) => {
      const account = accounts.find((acc) => acc.id === row.original.accountId);
      return account ? account.name : 'N/A';
    },
  },
];