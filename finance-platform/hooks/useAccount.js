"use client";

import { useQuery } from "@tanstack/react-query";

const useAccounts = () => {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const response = await fetch("/api/accounts", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch accounts");
      }
      const data = await response.json();
      console.log("Fetched accounts:", data);
      return data.accounts;
    },
  });
};

export { useAccounts };
