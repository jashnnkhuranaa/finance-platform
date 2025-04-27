"use client";

import ButtonLogout from '@/components/ButtonLogout';
import { useNewAccount } from '../api/accounts/hooks/use-new-account';
import { Button } from '@/components/ui/button';
import { NewAccountSheet } from '../api/accounts/components/new-account-sheet';

export default function DashboardPage() {
  const { onOpen } = useNewAccount();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-10">

      <Button onClick = {onOpen}>
        Add an account
      </Button>
      <ButtonLogout />
      <NewAccountSheet />
    </div>
  );
}