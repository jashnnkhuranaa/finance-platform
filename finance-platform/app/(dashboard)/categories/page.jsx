// app/(dashboard)/categories/page.js
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCategories } from '@/hooks/useCategories';
import { useNewAccount } from '@/app/api/accounts/hooks/use-new-account';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/accounts/data-table';
import { toast } from 'react-toastify';
import { deleteCategories } from '@/app/api/categories/actions/delete-category';
import columns from '@/app/(dashboard)/categories/columns';
import NewAccountSheet from '@/components/NewAccountSheet';

const CategoriesPage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data = [], isLoading, error, refetch } = useCategories();
  const { isOpen, onOpen, type } = useNewAccount();

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
        console.log('Categories Page Auth Check Response:', data);
        setIsAuthenticated(data.isAuthenticated);
        if (!data.isAuthenticated) {
          console.log('Categories: Not authenticated, redirecting to /login');
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
      console.log('NewCategorySheet closed, re-fetching categories');
      refetch();
    }
  }, [isOpen, refetch]);

  const handleDelete = async (rows) => {
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

  if (loading || isAuthenticated === null) {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="border-none px-6">
          <div className="flex w-full items-center justify-between">
            <CardTitle className="text-xl">Categories</CardTitle>
            <Button size="sm" onClick={() => onOpen('category')}>
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
              filterColumn="name"
            />
          )}
        </CardContent>
      </Card>
      {type === 'category' && <NewAccountSheet type="category" />}
    </div>
  );
};

export default CategoriesPage;