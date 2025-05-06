const { useQuery } = require("@tanstack/react-query");

function useGetAccounts() {
  const query = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const res = await fetch("/api/accounts");
      if (!res.ok) throw new Error("Failed to fetch accounts");
      const { data } = await res.json();
      return data;
    },
  });

  return query;
}

export { useGetAccounts };
