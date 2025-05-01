// components/new-account-sheet.tsx
'use client';

import { useNewAccount } from '@/app/api/accounts/hooks/use-new-account';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { AccountForm } from './account-form';

interface NewAccountSheetProps {
  type?: 'account' | 'category'; // Add type prop to distinguish
}

export function NewAccountSheet({ type = 'account' }: NewAccountSheetProps) {
  const { isOpen, onClose } = useNewAccount();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>{type === 'account' ? 'New Account' : 'New Category'}</SheetTitle>
        </SheetHeader>
        <AccountForm type={type} onSuccess={onClose} />
      </SheetContent>
    </Sheet>
  );
}