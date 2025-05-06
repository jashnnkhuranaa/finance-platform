const React = require("react");
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {TransactionForm} from "@/components/transaction-form";
import {useNewAccount} from "@/app/api/accounts/hooks/use-new-account";
import { useImportTransaction } from "@/hooks/useImportTransaction";

function NewTransactionSheet({ defaultValues }) {
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

export default NewTransactionSheet;