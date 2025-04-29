// yahi actual form hai jo website pe dikh rha hai

import { useNewAccount } from "../hooks/use-new-account";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { AccountForm } from "@/components/account-form" // 👈 make sure path sahi ho

export const NewAccountSheet = () => {
  const { isOpen, onClose } = useNewAccount();

  const handleCreate = (data: { name: string }) => {
    console.log("Form submitted:", data);
    // TODO: Yaha actual account create logic lagao
    onClose(); // Close the sheet after submission
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

        {/* 👇 Ye form render karega inside sheet */}
        <AccountForm onSubmit={handleCreate} />
      </SheetContent>
    </Sheet>
  );
};
