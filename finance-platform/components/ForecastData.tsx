import { addDays } from 'date-fns';

// Helper function to format dates to "MMM D"
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Helper function to generate forecast data
const ForecastData = (transactions: any[]) => {
  // Calculate average daily income and expenses
  const incomeTransactions = transactions.filter((t) => t.amount >= 0);
  const expenseTransactions = transactions.filter((t) => t.amount < 0);

  const totalIncome = incomeTransactions.reduce((sum: number, t: any) => sum + Number(t.amount), 0);
  const totalExpenses = expenseTransactions.reduce((sum: number, t: any) => sum + Math.abs(Number(t.amount)), 0);

  const daysWithTransactions = new Set(transactions.map((t) => formatDate(t.date))).size;
  const avgDailyIncome = daysWithTransactions > 0 ? totalIncome / daysWithTransactions : 0;
  const avgDailyExpenses = daysWithTransactions > 0 ? totalExpenses / daysWithTransactions : 0;

  // Generate forecast for the next 7 days
  const forecastData = [];
  const today = new Date();
  for (let i = 1; i <= 7; i++) {
    const forecastDate = addDays(today, i);
    forecastData.push({
      date: formatDate(forecastDate.toISOString()),
      income: avgDailyIncome,
      expenses: avgDailyExpenses,
    });
  }

  console.log('Forecast Data:', forecastData);
  return forecastData;
};

export default ForecastData;