import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Define TypeScript interfaces for transactions and categories
interface Transaction {
  id: string | number;
  date: string;
  amount: number;
  categoryId: string | number;
}

interface Category {
  id: string | number;
  name: string;
}

interface SpendingAlertsProps {
  transactions: Transaction[];
  categories: Category[];
  startDate: Date; // Added startDate
  endDate: Date;   // Added endDate
}

const SpendingAlerts = ({ transactions, categories, startDate, endDate }: SpendingAlertsProps) => {
  const spendingAlerts = (() => {
    const expensesByCategory = categories.map((category) => {
      const categoryTransactions = transactions.filter(
        (t) => t.categoryId === category.id && t.amount < 0
      );
      const totalExpense = categoryTransactions.reduce(
        (sum, t) => sum + Math.abs(t.amount),
        0
      );
      return { name: category.name, totalExpense };
    });

    // Calculate days between startDate and endDate
    const daysInRange = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) || 1;

    const alerts = expensesByCategory
      .map((cat) => {
        const monthlyExpense = cat.totalExpense;
        const avgMonthlyExpense = daysInRange > 0 ? (monthlyExpense * 30) / daysInRange : 0;
        const threshold = avgMonthlyExpense * 0.8; // 80% threshold
        return monthlyExpense > threshold 
          ? { name: cat.name, expense: monthlyExpense, threshold } 
          : null;
      })
      .filter((alert): alert is { name: string; expense: number; threshold: number } => alert !== null);

    console.log('Spending Alerts:', alerts);
    return alerts;
  })();

  return (
    <Card className="border-none drop-shadow-sm lg:col-span-2">
      <CardHeader>
        <CardTitle>Spending Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        {spendingAlerts.length > 0 ? (
          <ul className="list-disc pl-5">
            {spendingAlerts.map((alert, index) => (
              <li key={index} className="text-red-600">
                High spending in {alert.name}: ${alert.expense.toFixed(2)} (Threshold: ${alert.threshold.toFixed(2)})
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No spending alerts at this time.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SpendingAlerts;