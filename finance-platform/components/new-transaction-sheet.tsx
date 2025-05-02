
// // components/new-transaction-sheet.tsx
// 'use client';

// import { useNewAccount } from '@/app/api/accounts/hooks/use-new-account';
// import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
// import { TransactionForm } from './transaction-form';

// export function NewTransactionSheet() {
//   const { isOpen, onClose } = useNewAccount();

//   return (
//     <Sheet open={isOpen} onOpenChange={onClose}>
//       <SheetContent className="space-y-4">
//         <SheetHeader>
//           <SheetTitle>Add a new transaction</SheetTitle>
//         </SheetHeader>
//         <TransactionForm onSuccess={onClose} />
//       </SheetContent>
//     </Sheet>
//   );
// }