import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatCurrency } from "@/lib/utils/transaction";
import { AlertTriangle, CheckCircle } from "lucide-react";

const SpendingAlerts = ({ transactions = [], categories = [], startDate, endDate, currency = '₹' }) => {
  console.log("SpendingAlerts Props:", { transactions, categories, startDate, endDate });

  const safeStartDate = startDate ? new Date(startDate) : new Date();
  const safeEndDate = endDate ? new Date(endDate) : new Date();

  const spendingAlerts = (() => {
    const expensesByCategory = categories.map((category) => {
      const categoryTransactions = transactions.filter(
        (t) => t.categoryId === category.id && t.amount < 0
      );
      const totalExpense = categoryTransactions.reduce(
        (sum, t) => sum + Math.abs(Number(t.amount)),
        0
      );
      return { name: category.name, totalExpense };
    });

    const totalExpenses = expensesByCategory.reduce((sum, cat) => sum + cat.totalExpense, 0);
    const avgCategoryExpense = totalExpenses / (categories.length || 1);

    const alerts = expensesByCategory
      .map((cat) => {
        const threshold = avgCategoryExpense * 1.5;
        return cat.totalExpense > threshold
          ? { name: cat.name, expense: cat.totalExpense, threshold }
          : null;
      })
      .filter((alert) => alert !== null);

    console.log("Spending Alerts:", alerts);
    return alerts;
  })();

  return (
    <Card className="border-none drop-shadow-sm lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">Spending Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        {spendingAlerts.length > 0 ? (
          <div className="space-y-4">
            {spendingAlerts.map((alert, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-red-50 rounded-lg shadow-sm"
              >
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-red-700 font-medium">{alert.name}</p>
                  <p className="text-red-600 text-sm">
                    High spending in {alert.name}: {currency}{formatCurrency(alert.expense)} (Threshold: {currency}{formatCurrency(alert.threshold)})
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-500">
            <CheckCircle className="h-5 w-5" />
            <p>No spending alerts at this time.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpendingAlerts;