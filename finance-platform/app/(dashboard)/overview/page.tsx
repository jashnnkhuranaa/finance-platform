'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { OverviewResponse, OverviewData } from '@/types/auth';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ChevronDown } from 'lucide-react';
import { DateRange } from 'react-date-range';
import { addDays, format } from 'date-fns';

const getOverviewData = async (startDate: string, endDate: string): Promise<OverviewResponse> => {
  const res = await fetch(`/api/overview?startDate=${startDate}&endDate=${endDate}`, {
    credentials: 'include',
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
  console.log('API Response Status:', res.status);
  if (!res.ok) {
    const errorData = await res.json();
    console.log('API Error Response:', errorData);
    throw new Error(errorData.error || 'Failed to fetch overview data');
  }
  const data = await res.json();
  console.log('API Response Data:', data);
  return data;
};

// Helper function to format dates to "MMM D"
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Helper function to aggregate transactions by date
const aggregateTransactionsByDate = (transactions: any[], startDate: Date, endDate: Date) => {
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

// Helper function to generate forecast data
const generateForecastData = (transactions: any[]) => {
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

// Custom Tooltip for Area Chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-300 rounded shadow">
        <p className="font-bold">{`Date: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.stroke }}>
            {`${entry.name}: $${entry.value.toFixed(2)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const OverviewPage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  const [showDatePicker, setShowDatePicker] = useState({ remaining: false, income: false, expenses: false });
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date('2025-04-10'),
      endDate: new Date('2025-05-10'),
      key: 'selection',
    },
  ]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6F61', '#6A5ACD'];

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check', {
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        const data: { isAuthenticated: boolean } = await res.json();
        console.log('Auth Check Response:', data);
        setIsAuthenticated(data.isAuthenticated);
        if (!data.isAuthenticated) {
          router.push('/login');
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setIsAuthenticated(false);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  // Fetch overview data based on date range
  useEffect(() => {
    if (isAuthenticated === false || !isAuthenticated) return;

    const fetchData = async () => {
      try {
        const startDate = format(dateRange[0].startDate, 'yyyy-MM-dd');
        const endDate = format(dateRange[0].endDate, 'yyyy-MM-dd');
        const result = await getOverviewData(startDate, endDate);
        if ('error' in result) {
          setError(result.error ?? 'Failed to load overview data');
        } else {
          setOverviewData(result);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Error fetching data. Please try again.');
      }
    };
    fetchData();
  }, [isAuthenticated, dateRange]);

  if (loading || isAuthenticated === null) {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // Redirect handled in useEffect
  }

  if (error) {
    return <div className="min-h-screen flex justify-center items-center text-red-600">{error}</div>;
  }

  if (!overviewData) {
    return <div className="min-h-screen flex justify-center items-center">No data available</div>;
  }

  const { remaining, income, expenses, transactions, categories } = overviewData;

  const chartData = aggregateTransactionsByDate(transactions, dateRange[0].startDate, dateRange[0].endDate);
  const forecastData = generateForecastData(transactions);

  const expensesByCategory = categories.map((category: any) => {
    const categoryTransactions = transactions.filter(
      (t: any) => t.categoryId === category.id && t.amount < 0
    );
    const totalExpense = categoryTransactions.reduce(
      (sum: number, t: any) => sum + Math.abs(Number(t.amount)),
      0
    );
    return { name: category.name, value: totalExpense };
  }).filter((cat: any) => cat.value > 0);

  console.log('Chart Data:', chartData);
  console.log('Expenses by Category:', expensesByCategory);

  const remainingChange = -35;
  const incomeChange = 135;
  const expensesChange = -3;

  const dateRangeText = `${format(dateRange[0].startDate, 'MMM d')} - ${format(dateRange[0].endDate, 'MMM d, yyyy')}`;

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-none drop-shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Remaining</CardTitle>
            <div
              className="flex items-center text-sm text-gray-500 cursor-pointer"
              onClick={() => setShowDatePicker({ ...showDatePicker, remaining: !showDatePicker.remaining })}
            >
              {dateRangeText} <ChevronDown className="ml-1 h-4 w-4" />
            </div>
          </CardHeader>
          {showDatePicker.remaining && (
            <div className="absolute z-10">
              <DateRange
                editableDateInputs={true}
                onChange={(item: any) => {
                  setDateRange([item.selection]);
                  setShowDatePicker({ ...showDatePicker, remaining: false });
                }}
                moveRangeOnFirstSelection={false}
                ranges={dateRange}
                maxDate={new Date()}
              />
            </div>
          )}
          <CardContent>
            <p className={`text-2xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${Math.abs(remaining).toFixed(2)}
            </p>
            <p className={`text-sm ${remainingChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {remainingChange >= 0 ? '+' : ''}{remainingChange}% from last period
            </p>
          </CardContent>
        </Card>

        <Card className="border-none drop-shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Income</CardTitle>
            <div
              className="flex items-center text-sm text-gray-500 cursor-pointer"
              onClick={() => setShowDatePicker({ ...showDatePicker, income: !showDatePicker.income })}
            >
              {dateRangeText} <ChevronDown className="ml-1 h-4 w-4" />
            </div>
          </CardHeader>
          {showDatePicker.income && (
            <div className="absolute z-10">
              <DateRange
                editableDateInputs={true}
                onChange={(item: any) => {
                  setDateRange([item.selection]);
                  setShowDatePicker({ ...showDatePicker, income: false });
                }}
                moveRangeOnFirstSelection={false}
                ranges={dateRange}
                maxDate={new Date()}
              />
            </div>
          )}
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              ${income.toFixed(2)}
            </p>
            <p className={`text-sm ${incomeChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {incomeChange >= 0 ? '+' : ''}{incomeChange}% from last period
            </p>
          </CardContent>
        </Card>

        <Card className="border-none drop-shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Expenses</CardTitle>
            <div
              className="flex items-center text-sm text-gray-500 cursor-pointer"
              onClick={() => setShowDatePicker({ ...showDatePicker, expenses: !showDatePicker.expenses })}
            >
              {dateRangeText} <ChevronDown className="ml-1 h-4 w-4" />
            </div>
          </CardHeader>
          {showDatePicker.expenses && (
            <div className="absolute z-10">
              <DateRange
                editableDateInputs={true}
                onChange={(item: any) => {
                  setDateRange([item.selection]);
                  setShowDatePicker({ ...showDatePicker, expenses: false });
                }}
                moveRangeOnFirstSelection={false}
                ranges={dateRange}
                maxDate={new Date()}
              />
            </div>
          )}
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              -${expenses.toFixed(2)}
            </p>
            <p className={`text-sm ${expensesChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {expensesChange >= 0 ? '+' : ''}{expensesChange}% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area Chart: Transactions Over Time */}
        <Card className="border-none drop-shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Transactions</CardTitle>
            <div className="flex items-center text-sm text-gray-500">
              Area Chart <ChevronDown className="ml-1 h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#666" 
                      label={{ value: 'Date', position: 'insideBottom', offset: -5, fill: '#666' }} 
                    />
                    <YAxis 
                      stroke="#666" 
                      label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft', offset: 0, fill: '#666' }} 
                      tickFormatter={(value) => `$${value}`} 
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" height={36} />
                    <Area 
                      type="monotone" 
                      dataKey="income" 
                      stackId="1" 
                      stroke="#4CAF50" 
                      fill="#4CAF50" 
                      fillOpacity={0.4} 
                      name="Income" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="expenses" 
                      stackId="1" 
                      stroke="#FF5722" 
                      fill="#FF5722" 
                      fillOpacity={0.4} 
                      name="Expenses" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-gray-500">No transaction data to display.</p>
            )}
          </CardContent>
        </Card>

        {/* Pie Chart: Category-wise Expenses */}
        <Card className="border-none drop-shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Category</CardTitle>
            <div className="flex items-center text-sm text-gray-500">
              Pie Chart <ChevronDown className="ml-1 h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {expensesByCategory.length > 0 ? (
              <div className="h-[300px] flex items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensesByCategory}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={true}
                    >
                      {expensesByCategory.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: string | number) => `$${Number(value).toFixed(2)}`} />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-gray-500">No expenses to display.</p>
            )}
          </CardContent>
        </Card>

        {/* Forecast Section */}
        <Card className="border-none drop-shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle>Forecast (Next 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            {forecastData.length > 0 ? (
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
                      label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft', offset: 0, fill: '#666' }} 
                      tickFormatter={(value) => `$${value}`} 
                    />
                    <Tooltip content={<CustomTooltip />} />
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
            ) : (
              <p className="text-gray-500">No forecast data available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewPage;