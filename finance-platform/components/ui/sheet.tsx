"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

function Sheet(props: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root {...props} />
}

function SheetTrigger({ asChild = false, children }: { asChild?: boolean; children: React.ReactNode }) {
  return (
    <SheetPrimitive.Trigger asChild={asChild}>
      {children}
    </SheetPrimitive.Trigger>
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left"
}) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out" />
      <SheetPrimitive.Content
        className={cn(
          "bg-background fixed z-50 flex flex-col gap-4 shadow-lg transition",
          side === "right" && "right-0 inset-y-0 w-3/4 border-l sm:max-w-sm",
          side === "left" && "left-0 inset-y-0 w-3/4 border-r sm:max-w-sm",
          side === "top" && "top-0 inset-x-0 h-auto border-b",
          side === "bottom" && "bottom-0 inset-x-0 h-auto border-t",
          className
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="absolute top-4 right-4 opacity-70 transition hover:opacity-100">
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  )
}

const SheetTitle = SheetPrimitive.Title

export {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle
}
