import { addDays } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import CustomTooltip from "@/components/CustomTooltip";
import { formatDate, formatCurrency } from "@/lib/utils/transaction";

const ForecastData = ({ transactions = [], currency = '₹' }) => {
  console.log("ForecastData Transactions:", transactions);

  if (!Array.isArray(transactions) || transactions.length === 0) {
    console.error("transactions is not an array or is empty:", transactions);
    return <p className="text-gray-500">No forecast data available.</p>;
  }

  // Sort transactions by date
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Calculate date range (total days between first and last transaction)
  const firstDate = new Date(sortedTransactions[0].date);
  const lastDate = new Date(sortedTransactions[sortedTransactions.length - 1].date);
  const dateRangeDays = Math.ceil(
    (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
  ) || 1;

  // Separate income and expenses
  const incomeTransactions = sortedTransactions.filter((t) => t.amount >= 0);
  const expenseTransactions = sortedTransactions.filter((t) => t.amount < 0);

  const totalIncome = incomeTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

  // Calculate average daily income and expenses based on date range
  const avgDailyIncome = dateRangeDays > 0 ? totalIncome / dateRangeDays : 0;
  const avgDailyExpenses = dateRangeDays > 0 ? totalExpenses / dateRangeDays : 0;

  // Calculate trends based on last 7 days of data
  const last7Days = new Date(lastDate);
  last7Days.setDate(last7Days.getDate() - 7);
  const recentTransactions = sortedTransactions.filter(
    (t) => new Date(t.date) >= last7Days
  );

  // Group recent transactions by day
  const dailyData = {};
  recentTransactions.forEach((t) => {
    const date = formatDate(t.date);
    if (!dailyData[date]) {
      dailyData[date] = { income: 0, expenses: 0 };
    }
    if (t.amount >= 0) {
      dailyData[date].income += Number(t.amount);
    } else {
      dailyData[date].expenses += Math.abs(Number(t.amount));
    }
  });

  // Convert daily data to array and sort by date
  const dailyDataArray = Object.entries(dailyData)
    .map(([date, { income, expenses }]) => ({ date, income, expenses }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Calculate daily change (trend) for income and expenses
  let incomeTrend = 0;
  let expensesTrend = 0;
  if (dailyDataArray.length > 1) {
    const firstDay = dailyDataArray[0];
    const lastDay = dailyDataArray[dailyDataArray.length - 1];
    const daysBetween = dailyDataArray.length - 1;
    incomeTrend = (lastDay.income - firstDay.income) / daysBetween || 0;
    expensesTrend = (lastDay.expenses - firstDay.expenses) / daysBetween || 0;
  }

  // Generate 7-day forecast with trends
  const forecastData = [];
  const today = new Date();
  let lastIncome = avgDailyIncome;
  let lastExpenses = avgDailyExpenses;
  for (let i = 1; i <= 7; i++) {
    const forecastDate = addDays(today, i);
    // Apply trend to forecast
    lastIncome += incomeTrend;
    lastExpenses += expensesTrend;
    // Ensure values don't go negative
    forecastData.push({
      date: formatDate(forecastDate.toISOString()),
      income: Math.max(0, lastIncome),
      expenses: Math.max(0, lastExpenses),
    });
  }

  console.log('Forecast Data with Trends:', forecastData);

  return (
    <div className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={forecastData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="date" 
            stroke="#666" 
            label={{ value: 'Date', position: 'insideBottom', offset: -5, fill: '#666' }} 
          />
          <YAxis 
            stroke="#666" 
            label={{ value: `Amount (${currency})`, angle: -90, position: 'insideLeft', offset: 0, fill: '#666' }} 
            tickFormatter={(value) => `${currency}${formatCurrency(value)}`} 
          />
          <Tooltip content={<CustomTooltip currency={currency} />} />
          <Legend verticalAlign="top" height={36} />
          <Area 
            type="monotone" 
            dataKey="income" 
            stackId="1" 
            stroke="#4CAF50" 
            fill="#4CAF50" 
            fillOpacity={0.4} 
            name="Predicted Income" 
          />
          <Area 
            type="monotone" 
            dataKey="expenses" 
            stackId="1" 
            stroke="#FF5722" 
            fill="#FF5722" 
            fillOpacity={0.4} 
            name="Predicted Expenses" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastData;