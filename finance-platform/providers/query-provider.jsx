'use client';

import { QueryClient, QueryClientProvider, isServer } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

function QueryProviders({ children }) {
  const queryClient = getQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export default QueryProviders;