// components/account-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Trash } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { createAccount } from '@/app/api/accounts/actions/create-account';

const formSchema = z.object({
  name: z.string().min(1, 'Account name is required'),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit?: (data: FormValues) => void;
  onDelete?: (id: string) => void;
  disabled?: boolean;
};

export const AccountForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || { name: '' },
  });

  const handleSubmit = async (data: FormValues) => {
    const result = await createAccount(data);
    if (result?.error) {
      console.error(result.error);
      toast.error(result.error);
    } else {
      console.log('✅ Account created');
      toast.success('Account created successfully');
      onSubmit?.(data);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 mt-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Account Name
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g. Personal Savings"
                  disabled={disabled}
                  className="focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between items-center gap-4 pt-2">
          {id && onDelete && (
            <Button
              type="button"
              onClick={() => onDelete(id)}
              disabled={disabled}
              variant="outline"
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}

          <div className="ml-auto">
            <Button
              type="submit"
              disabled={disabled}
              className="bg-black text-white hover:bg-gray-900"
            >
              {id ? 'Update Account' : 'Create Account'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};