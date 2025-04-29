import { useNewAccount } from "../app/api/accounts/hooks/use-new-account";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AccountForm } from "@/components/account-form";

export const NewAccountSheet = () => {
  const { isOpen, onClose } = useNewAccount();

  if (!isOpen) return null;

  const handleSubmit = (data: { name: string }) => {
    console.log("Submitted data:", data);
    // You can add your DB logic here later
    onClose(); // close the sheet after submission
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New Account</SheetTitle>
          <SheetDescription>Enter details to create a new account.</SheetDescription>
        </SheetHeader>

        <AccountForm onSubmit={handleSubmit} />
      </SheetContent>
    </Sheet>
  );
};
