import { format } from 'date-fns';

// Helper function to format dates to "MMM d"
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Helper function to aggregate transactions by date
const AggregateTransactions = (transactions: any[], startDate: Date, endDate: Date) => {
  const aggregated: { [key: string]: { date: string; income: number; expenses: number } } = {};

  console.log('Transactions before filtering:', transactions);
  console.log('Start Date:', startDate.toISOString());
  console.log('End Date:', endDate.toISOString());

  transactions
    .filter((t) => {
      const transactionDate = new Date(t.date);
      // Normalize dates to ignore time part
      transactionDate.setHours(0, 0, 0, 0);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      const isWithinRange = transactionDate >= startDate && transactionDate <= endDate;
      console.log(`Transaction Date: ${t.date}, Normalized: ${transactionDate.toISOString()}, Start: ${startDate.toISOString()}, End: ${endDate.toISOString()}, Within Range: ${isWithinRange}`);
      return isWithinRange;
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

  const result = Object.values(aggregated).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  console.log('Aggregated Chart Data:', result);
  return result;
};

export default AggregateTransactions;