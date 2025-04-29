import { useNewAccount } from "../app/api/accounts/hooks/use-new-account";
import { createAccount } from "../app/api/accounts/actions/create-account"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AccountForm } from "@/components/account-form";

export const NewAccountSheet = () => {
  const { isOpen, onClose } = useNewAccount();

  if (!isOpen) return null;

  const handleSubmit = async (data: { name: string }) => {
    try {
      await createAccount(data); // 👈 server action call
      onClose(); // close the drawer after successful submission
    } catch (error) {
      console.error("Failed to create account:", error);
    }
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
