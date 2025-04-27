"use client";

import { NewAccountSheet } from "@/app/api/accounts/components/new-account-sheet";
import { useMountedState } from "react-use";

export const SheetProvider = () => {
  const isMounted = useMountedState();

  if(!isMounted) {
    return null;
  }
  return (
    <NewAccountSheet />
  )
}