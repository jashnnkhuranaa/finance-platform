// components/new-account-sheet.tsx
'use client';

import { useNewAccount } from '../hooks/use-new-account';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { AccountForm } from '@/components/account-form';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const NewAccountSheet = () => {
  const { isOpen, onClose } = useNewAccount();

  const handleCreate = (data: { name: string }) => {
    console.log('✅ AccountForm submitted:', data);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold">New Account</SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            Create a new account to manage your finances.
          </SheetDescription>
        </SheetHeader>
        <AccountForm onSubmit={handleCreate} />
      </SheetContent>
    </Sheet>
  );
};