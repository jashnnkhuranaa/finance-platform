// app/(dashboard)/transactions/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { CheckedState } from '@radix-ui/react-checkbox';

export interface Transaction {
  id: string;
  date: string;
  accountId: string;
  categoryId: string;
  payee: string;
  amount: number;
  notes: string | null;
  created_at: string;
}

export const columns: ColumnDef<Transaction>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value: CheckedState) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: CheckedState) =>
          row.toggleSelected(!!value)
        }
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Date
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => new Date(row.original.date).toLocaleDateString(),
  },
  {
    accessorKey: 'categoryId',
    header: 'Category',
    cell: ({ row }) => row.original.categoryId || 'N/A',
  },
  {
    accessorKey: 'payee',
    header: 'Payee',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => (
      <span
        className={
          row.original.amount < 0 ? 'text-red-600' : 'text-green-600'
        }
      >
        ${Math.abs(row.original.amount).toFixed(2)}
      </span>
    ),
  },
  {
    accessorKey: 'accountId',
    header: 'Account',
    cell: ({ row }) => row.original.accountId || 'N/A',
  },
];