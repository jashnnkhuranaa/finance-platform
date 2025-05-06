'use client';

import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { X as XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetTitle = SheetPrimitive.Title;
SheetTitle.displayName = 'SheetTitle';

const SheetDescription = SheetPrimitive.Description;
SheetDescription.displayName = 'SheetDescription';

const SheetContent = React.forwardRef(({ className, children, side = 'right', ...props }, ref) => {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out" />
      <SheetPrimitive.Content
        ref={ref}
        className={cn(
          'fixed inset-0 z-50 flex flex-col bg-background p-6 shadow-lg transition-all',
          side === 'right' && 'right-0',
          side === 'left' && 'left-0',
          side === 'top' && 'top-0',
          side === 'bottom' && 'bottom-0',
          'w-full h-full',
          className
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="absolute top-4 right-4 opacity-70 transition hover:opacity-100">
          <XIcon className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
});
SheetContent.displayName = 'SheetContent';

const SheetHeader = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-2 text-center sm:text-left', className)}
      {...props}
    />
  );
});
SheetHeader.displayName = 'SheetHeader';

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription };