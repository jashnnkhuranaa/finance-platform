import { useQuery } from "@tanstack/react-query";

const useTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/transactions", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Fetch transactions error:", errorData);
          throw new Error(errorData.error || "Failed to fetch transactions");
        }
        const data = await response.json();
        console.log("Fetched transactions:", data);
        return data.transactions || [];
      } catch (error) {
        console.error("useTransactions error:", error.message);
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export { useTransactions };
