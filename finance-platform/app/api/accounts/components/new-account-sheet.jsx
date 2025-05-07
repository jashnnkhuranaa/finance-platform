// components/NewAccountSheet.js
'use client';

import { useNewAccount } from '@/app/api/accounts/hooks/use-new-account';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import AccountForm from '@/components/account-form';
import 'react-toastify/dist/ReactToastify.css';

export const NewAccountSheet = ({ type = 'account' }) => {
  const { isOpen, onClose, type: sheetType } = useNewAccount();

  const handleCreate = () => {
    console.log(`✅ ${sheetType} submitted`);
    onClose();
  };

  return (
    <Sheet
      open={isOpen && type === sheetType}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold">
            New {sheetType === 'account' ? 'Account' : 'Category'}
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            Create a new {sheetType === 'account' ? 'account' : 'category'} to manage your finances.
          </SheetDescription>
        </SheetHeader>
        <AccountForm type={sheetType} onSuccess={handleCreate} />
      </SheetContent>
    </Sheet>
  );
};

export default NewAccountSheet;