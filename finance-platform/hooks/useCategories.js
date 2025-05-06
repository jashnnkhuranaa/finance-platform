"use client";

import { useQuery } from "@tanstack/react-query";

const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/categories", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
        });
        if (!response.ok) {
          let errorMessage = "Failed to fetch categories";
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch (parseError) {
            console.error("Error parsing error response:", parseError);
          }
          console.error(
            "Fetch categories failed with status:",
            response.status
          );
          throw new Error(errorMessage);
        }
        const data = await response.json();
        console.log("Fetched categories:", data);
        return data.categories || [];
      } catch (error) {
        console.error("useCategories error:", error.message);
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export { useCategories };
