// components/ForecastData.jsx
import { addDays, isWeekend } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import CustomTooltip from "@/components/CustomTooltip";
import { formatDate, formatCurrency } from "@/lib/utils/transaction";

// Helper function to calculate weighted moving average
const calculateWMA = (data, key, windowSize) => {
    const weights = Array.from({ length: windowSize }, (_, i) => i + 1);
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const result = [];
    for (let i = 0; i < data.length; i++) {
        const start = Math.max(0, i - windowSize + 1);
        const slice = data.slice(start, i + 1);
        const weightedSum = slice.reduce((sum, item, idx) => {
            const weightIndex = idx + (windowSize - slice.length);
            return sum + item[key] * weights[weightIndex];
        }, 0);
        result.push(weightedSum / totalWeight);
    }
    return result;
};

// Helper function to detect outliers using IQR (Interquartile Range)
const removeOutliers = (data, key) => {
    const values = data.map(item => item[key]).sort((a, b) => a - b);
    const q1 = values[Math.floor(values.length / 4)];
    const q3 = values[Math.floor((3 * values.length) / 4)];
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    return data.filter(item => item[key] >= lowerBound && item[key] <= upperBound);
};

const ForecastData = ({ transactions = [], currency = '₹', categories = [] }) => {
    console.log("ForecastData Transactions:", transactions);

    if (!Array.isArray(transactions) || transactions.length === 0) {
        console.error("transactions is not an array or is empty:", transactions);
        return <p className="text-gray-500">No forecast data available.</p>;
    }

    // Step 1: Sort transactions by date
    const sortedTransactions = [...transactions].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Step 2: Separate income and expenses by category
    const incomeCategoryIds = categories
        .filter(cat => cat.name.toLowerCase().includes('income'))
        .map(cat => cat.id);
    const incomeTransactions = sortedTransactions.filter(t => incomeCategoryIds.includes(t.categoryId));
    const expenseTransactions = sortedTransactions.filter(t => !incomeCategoryIds.includes(t.categoryId));

    // Step 3: Remove outliers
    const cleanIncomeTransactions = removeOutliers(incomeTransactions, 'amount');
    const cleanExpenseTransactions = removeOutliers(expenseTransactions, 'amount');

    // Step 4: Calculate base averages (weighted by recency)
    const dailyData = {};
    sortedTransactions.forEach(t => {
        const date = formatDate(t.date);
        if (!dailyData[date]) {
            dailyData[date] = { income: 0, expenses: 0, isWeekend: isWeekend(new Date(t.date)) };
        }
        if (incomeCategoryIds.includes(t.categoryId)) {
            dailyData[date].income += Number(t.amount);
        } else {
            dailyData[date].expenses += Math.abs(Number(t.amount));
        }
    });

    const dailyDataArray = Object.entries(dailyData)
        .map(([date, { income, expenses, isWeekend }]) => ({ date, income, expenses, isWeekend }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Step 5: Apply Weighted Moving Average for smoothing
    const windowSize = 7; // 7-day moving average
    const incomeWMA = calculateWMA(dailyDataArray, 'income', windowSize);
    const expensesWMA = calculateWMA(dailyDataArray, 'expenses', windowSize);

    // Step 6: Calculate seasonality factors (weekday vs weekend)
    const weekdayData = dailyDataArray.filter(d => !d.isWeekend);
    const weekendData = dailyDataArray.filter(d => d.isWeekend);
    const avgWeekdayIncome = weekdayData.length > 0
        ? weekdayData.reduce((sum, d) => sum + d.income, 0) / weekdayData.length
        : 0;
    const avgWeekendIncome = weekendData.length > 0
        ? weekendData.reduce((sum, d) => sum + d.income, 0) / weekendData.length
        : 0;
    const avgWeekdayExpenses = weekdayData.length > 0
        ? weekdayData.reduce((sum, d) => sum + d.expenses, 0) / weekdayData.length
        : 0;
    const avgWeekendExpenses = weekendData.length > 0
        ? weekendData.reduce((sum, d) => sum + d.expenses, 0) / weekendData.length
        : 0;

    // Step 7: Exponential smoothing for forecasting
    const alpha = 0.3; // Smoothing factor (0 to 1, closer to 1 means more weight to recent data)
    let lastIncome = incomeWMA[incomeWMA.length - 1] || 0;
    let lastExpenses = expensesWMA[expensesWMA.length - 1] || 0;

    // Step 8: Generate 7-day forecast with seasonality and smoothing
    const forecastData = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
        const forecastDate = addDays(today, i);
        const isForecastWeekend = isWeekend(forecastDate);
        const seasonalityFactorIncome = isForecastWeekend
            ? avgWeekendIncome / (avgWeekdayIncome || 1)
            : 1;
        const seasonalityFactorExpenses = isForecastWeekend
            ? avgWeekendExpenses / (avgWeekdayExpenses || 1)
            : 1;

        // Exponential smoothing: newValue = alpha * current + (1 - alpha) * previous
        const rawIncome = incomeWMA[incomeWMA.length - 1] || 0;
        const rawExpenses = expensesWMA[expensesWMA.length - 1] || 0;
        lastIncome = alpha * rawIncome + (1 - alpha) * lastIncome;
        lastExpenses = alpha * rawExpenses + (1 - alpha) * lastExpenses;

        forecastData.push({
            date: formatDate(forecastDate.toISOString()),
            income: Math.max(0, lastIncome * seasonalityFactorIncome),
            expenses: Math.max(0, lastExpenses * seasonalityFactorExpenses),
        });
    }

    console.log('Optimized Forecast Data:', forecastData);

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