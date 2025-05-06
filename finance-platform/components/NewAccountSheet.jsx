'use client';

import React from 'react';
import { useNewAccount } from '@/app/api/accounts/hooks/use-new-account';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import AccountForm from '@/components/account-form';

function NewAccountSheet({ type = 'account' }) {
  const { isOpen, onClose, type: hookType } = useNewAccount();
  const effectiveType = hookType || type; // Prioritize hook type

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>{effectiveType === 'account' ? 'New Account' : 'New Category'}</SheetTitle>
        </SheetHeader>
        <AccountForm type={effectiveType} onSuccess={onClose} />
      </SheetContent>
    </Sheet>
  );
}

export default NewAccountSheet;