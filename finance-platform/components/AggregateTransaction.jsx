import { formatDate } from "@/lib/utils/transaction";

const AggregateTransactions = (transactions = [], startDate, endDate) => {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return [];
  }

  const aggregated = {};

  transactions
    .filter((t) => {
      const transactionDate = new Date(t.date);
      transactionDate.setHours(0, 0, 0, 0);
      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      return transactionDate >= start && transactionDate <= end;
    })
    .forEach((t) => {
      const date = formatDate(t.date);
      if (!aggregated[date]) {
        aggregated[date] = { date, income: 0, expenses: 0 };
      }
      if (t.amount >= 0) {
        aggregated[date].income += Number(t.amount);
      } else {
        aggregated[date].expenses += Math.abs(Number(t.amount));
      }
    });

  const result = Object.values(aggregated).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return result;
};

export default AggregateTransactions;