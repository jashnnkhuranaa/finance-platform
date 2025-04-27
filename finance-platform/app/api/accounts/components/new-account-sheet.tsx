import { useNewAccount } from "../hooks/use-new-account"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"

export const NewAccountSheet = () => {
  const { isOpen, onClose } = useNewAccount();
  
  return (
    <Sheet open={isOpen} onOpenChange={(open) => { 
      if (!open) onClose(); 
    }}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New Account</SheetTitle>
          <SheetDescription>
            Create a new account to manage your finances.
          </SheetDescription>
        </SheetHeader>
        {/* Yaha form ya aur content aa sakta hai */}
      </SheetContent>
    </Sheet>
  )
}
