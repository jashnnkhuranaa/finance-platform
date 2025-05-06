'use client';

import { useNewAccount } from '@/app/api/accounts/hooks/use-new-account';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import AccountForm from '@/components/account-form';
import 'react-toastify/dist/ReactToastify.css';

export const NewAccountSheet = () => {
  const { isOpen, onClose } = useNewAccount();

  const handleCreate = (data) => {
    console.log('✅ AccountForm submitted:', data);
    onClose();
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold">New Account</SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            Create a new account to manage your finances.
          </SheetDescription>
        </SheetHeader>
        <AccountForm type="account" onSuccess={handleCreate} />
      </SheetContent>
    </Sheet>
  );
};

export default NewAccountSheet;