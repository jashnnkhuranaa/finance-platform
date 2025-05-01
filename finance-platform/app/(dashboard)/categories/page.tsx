// app/(dashboard)/categories/page.tsx
'use client';

import { useEffect } from 'react';
import { useNewAccount } from '@/app/api/accounts/hooks/use-new-account';
import { NewAccountSheet } from '@/components/NewAccountSheet';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { columns } from '@/app/(dashboard)/categories/columns';
import { DataTable } from '@/components/accounts/data-table';
import { useCategories } from '@/hooks/useCategories';
import { deleteCategories } from '@/app/api/categories/actions/delete-category';
import { toast } from 'react-toastify';
import { Row } from '@tanstack/react-table';

interface Category {
  id: string;
  name: string;
  plaidId: string | null;
  created_at: string;
}

const CategoriesPage = () => {
  const { data = [], isLoading, error, refetch } = useCategories();
  const { isOpen, onOpen } = useNewAccount();

  useEffect(() => {
    if (!isOpen) {
      console.log('NewAccountSheet closed, re-fetching categories');
      refetch();
    }
  }, [isOpen, refetch]);

  const handleDelete = async (rows: Row<Category>[]) => {
    if (rows.length === 0) {
      toast.error('No categories selected');
      return;
    }

    const categoryIds = rows.map((row) => row.original.id);
    console.log('Deleting categories:', categoryIds);

    const result = await deleteCategories(categoryIds);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`Successfully deleted ${result.deletedCount} category(s)`);
      refetch();
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none">
        <CardHeader className="border-none px-6">
          <div className="flex w-full items-center justify-between">
            <CardTitle className="text-xl">Categories</CardTitle>
            <Button size="sm" onClick={onOpen}>
              <Plus className="size-4 mr-2" />
              Add new
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground px-6 py-2">
              Loading categories...
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
      <NewAccountSheet type="category" />
    </div>
  );
};

export default CategoriesPage;