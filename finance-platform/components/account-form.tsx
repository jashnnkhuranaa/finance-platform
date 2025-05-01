
// components/account-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createAccount } from '@/app/api/accounts/actions/create-account';
import { createCategory } from '@/app/api/categories/actions/create-category';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

interface AccountFormProps {
  type: 'account' | 'category';
  onSuccess: () => void;
}

export function AccountForm({ type, onSuccess }: AccountFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Convert values to FormData
    const formData = new FormData();
    formData.append('name', values.name);

    const action = type === 'account' ? createAccount : createCategory;
    const result = await action(formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`${type === 'account' ? 'Account' : 'Category'} created successfully`);
      form.reset();
      onSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}