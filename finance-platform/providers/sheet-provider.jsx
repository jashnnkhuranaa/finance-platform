// app/sheet-provider.js
'use client';
const { NewAccountSheet } = require("@/app/api/accounts/components/new-account-sheet");
const { useMountedState } = require("react-use");

function SheetProvider() {
  const isMounted = useMountedState();
  if (!isMounted) {
    return null;
  }
  return <NewAccountSheet />;
}

export default SheetProvider;