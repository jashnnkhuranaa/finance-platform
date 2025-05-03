// components/new-transaction-sheet.tsx
'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { TransactionForm } from './transaction-form';
import { useNewAccount } from '@/app/api/accounts/hooks/use-new-account';
import { useImportTransaction } from '@/hooks/useImportTransaction';
import { z } from 'zod';
import { formSchema } from './transaction-form';

// Define TransactionFormValues type
type TransactionFormValues = z.infer<typeof formSchema>;

interface NewTransactionSheetProps {
  defaultValues?: Partial<TransactionFormValues>;
}

export function NewTransactionSheet({ defaultValues }: NewTransactionSheetProps) {
  const { isOpen, onClose } = useNewAccount();
  const { clearImportedData } = useImportTransaction();

  const handleClose = () => {
    clearImportedData();
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Add a new transaction</SheetTitle>
        </SheetHeader>
        <TransactionForm onSuccess={handleClose} defaultValues={defaultValues} />
      </SheetContent>
    </Sheet>
  );
}