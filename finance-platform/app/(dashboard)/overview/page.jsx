'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ChevronDown } from 'lucide-react';
import { DateRange } from 'react-date-range';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

import AggregateTransactions from '@/components/AggregateTransaction';
import ForecastData from '@/components/ForecastData';
import BudgetSuggestions from '@/components/BudgetSuggestions';
import SpendingAlerts from '@/components/SpendingAlerts';
import Insights from '@/components/Insights';
import SavingsGoal from '@/components/SavingsGoal';
import CustomTooltip from '@/components/CustomTooltip';
import { useTransactions } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';
import { formatCurrency } from '@/lib/utils/transaction';
import BudgetTracker from '@/components/BudgetTracker';

const OverviewPage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState({ remaining: false, income: false, expenses: false });
  const [dateRange, setDateRange] = useState([
    {
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
      key: 'selection',
    },
  ]);

  const { data: transactions = [], isLoading: transactionsLoading, error: transactionsError } = useTransactions();
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useCategories();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6F61', '#6A5ACD'];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check', {
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        console.log('Overview Page Auth Check Response:', data);

        if (data.isAuthenticated === false || typeof data.isAuthenticated === 'undefined') {
          console.log('Overview: Not authenticated, redirecting to /login');
          setIsAuthenticated(false);
          router.replace('/login'); // Use replace instead of push to prevent back navigation
        } else {
          console.log('Overview: User is authenticated');
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Auth check error:', err.message);
        setIsAuthenticated(false);
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  // If loading, show loading screen
  if (loading || isAuthenticated === null) {
    console.log('Overview: Loading state, showing loading screen');
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  }

  // If not authenticated, redirect to login (this should already be handled by useEffect, but adding as a safeguard)
  if (!isAuthenticated) {
    console.log('Overview: Not authenticated, should redirect (safeguard)');
    router.replace('/login');
    return null;
  }

  if (transactionsError || categoriesError) {
    console.log('Overview: Data loading error', { transactionsError, categoriesError });
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600">
        {transactionsError?.message || categoriesError?.message || 'Error loading data'}
      </div>
    );
  }

  if (transactionsLoading || categoriesLoading) {
    console.log('Overview: Transactions or categories loading');
    return <div className="min-h-screen flex justify-center items-center">Loading data...</div>;
  }

  // Filter transactions based on selected date range
  const filteredTransactions = transactions.filter((t) => {
    const txDate = new Date(t.date);
    return txDate >= dateRange[0].startDate && txDate <= dateRange[0].endDate;
  });

  // Calculate remaining, income, expenses for current period
  const income = filteredTransactions
    .filter((t) => t.amount >= 0)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expenses = filteredTransactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

  const remaining = income - expenses;

  // Calculate changes from previous period
  const currentStartDate = new Date(dateRange[0].startDate);
  const currentEndDate = new Date(dateRange[0].endDate);
  const prevStartDate = subMonths(currentStartDate, 1);
  const prevEndDate = subMonths(currentEndDate, 1);

  const prevTransactions = transactions.filter((t) => {
    const txDate = new Date(t.date);
    return txDate >= prevStartDate && txDate <= prevEndDate;
  });

  const prevIncome = prevTransactions
    .filter((t) => t.amount >= 0)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const prevExpenses = prevTransactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

  const prevRemaining = prevIncome - prevExpenses;

  const hasPreviousData = prevTransactions.length > 0;
  const remainingChange = hasPreviousData && prevRemaining !== 0 ? ((remaining - prevRemaining) / prevRemaining) * 100 : 0;
  const incomeChange = hasPreviousData && prevIncome !== 0 ? ((income - prevIncome) / prevIncome) * 100 : 0;
  const expensesChange = hasPreviousData && prevExpenses !== 0 ? ((expenses - prevExpenses) / prevExpenses) * 100 : 0;

  // Prepare data for charts
  const chartData = AggregateTransactions(filteredTransactions, dateRange[0].startDate, dateRange[0].endDate);

  const expensesByCategory = categories.map((category) => {
    const categoryTransactions = filteredTransactions.filter(
      (t) => t.categoryId === category.id && t.amount < 0
    );
    const totalExpense = categoryTransactions.reduce(
      (sum, t) => sum + Math.abs(Number(t.amount)),
      0
    );
    return { name: category.name, value: totalExpense };
  }).filter((cat) => cat.value > 0);

  console.log('Chart Data:', chartData);
  console.log('Expenses by Category:', expensesByCategory);
  console.log('Previous Period Transactions:', prevTransactions);
  console.log('Previous Period Values:', { prevRemaining, prevIncome, prevExpenses });

  const dateRangeText = `${format(dateRange[0].startDate, 'MMM d')} - ${format(dateRange[0].endDate, 'MMM d, yyyy')}`;

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                onChange={(item) => {
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
              ₹{formatCurrency(Math.abs(remaining))}
            </p>
            {hasPreviousData ? (
              <p className={`text-sm ${remainingChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {remainingChange >= 0 ? '+' : ''}{remainingChange.toFixed(1)}% from last period
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                Not enough data to calculate change
              </p>
            )}
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
                onChange={(item) => {
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
              ₹{formatCurrency(income)}
            </p>
            {hasPreviousData ? (
              <p className={`text-sm ${incomeChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {incomeChange >= 0 ? '+' : ''}{incomeChange.toFixed(1)}% from last period
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                Not enough data to calculate change
              </p>
            )}
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
                onChange={(item) => {
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
              ₹{formatCurrency(expenses)}
            </p>
            {hasPreviousData ? (
              <p className={`text-sm ${expensesChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {expensesChange >= 0 ? '+' : ''}{expensesChange.toFixed(1)}% from last period
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                Not enough data to calculate change
              </p>
            )}
          </CardContent>
        </Card>

        <SavingsGoal remaining={remaining} currency="₹" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft', offset: 0, fill: '#666' }} 
                      tickFormatter={(value) => `₹${formatCurrency(value)}`} 
                    />
                    <Tooltip content={<CustomTooltip currency="₹" />} />
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
              <p className="text-gray-500">No transaction data to display for this period.</p>
            )}
          </CardContent>
        </Card>

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
                      {expensesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip currency="₹" />} />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-gray-500">No expenses to display for this period.</p>
            )}
          </CardContent>
        </Card>
        <BudgetTracker/>

        <Card className="border-none drop-shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle>Forecast (Next 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ForecastData transactions={transactions} currency="₹" />
          </CardContent>
        </Card>

        <BudgetSuggestions 
          transactions={filteredTransactions} 
          categories={categories} 
          startDate={dateRange[0].startDate} 
          endDate={dateRange[0].endDate} 
          currency="₹" 
        />
        <SpendingAlerts 
          transactions={filteredTransactions} 
          categories={categories} 
          startDate={dateRange[0].startDate} 
          endDate={dateRange[0].endDate} 
          currency="₹" 
        />
        <Insights 
          transactions={filteredTransactions} 
          categories={categories} 
          startDate={dateRange[0].startDate} 
          endDate={dateRange[0].endDate} 
          currency="₹" 
        />
      </div>
    </div>
  );
};

export default OverviewPage;