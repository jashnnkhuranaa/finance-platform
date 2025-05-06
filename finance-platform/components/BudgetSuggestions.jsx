import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatCurrency } from "@/lib/utils/transaction";

const BudgetSuggestions = ({ transactions = [], categories = [], startDate, endDate, currency = '₹' }) => {
  console.log("BudgetSuggestions Props:", { transactions, categories, startDate, endDate });

  const safeStartDate = startDate ? new Date(startDate) : new Date();
  const safeEndDate = endDate ? new Date(endDate) : new Date();

  const budgetSuggestions = (() => {
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

    const daysInRange = Math.ceil(
      (safeEndDate.getTime() - safeStartDate.getTime()) / (1000 * 60 * 60 * 24)
    ) || 1;

    const suggestions = expensesByCategory
      .map((cat) => {
        const avgDailyExpense = cat.totalExpense / daysInRange;
        const suggestedBudget = avgDailyExpense * 30 * 1.2; // Suggest 20% more than average monthly spending
        return { name: cat.name, suggestedBudget };
      })
      .filter((cat) => cat.suggestedBudget > 0);

    console.log('Budget Suggestions:', suggestions);
    return suggestions;
  })();

  return (
    <Card className="border-none drop-shadow-sm lg:col-span-2">
      <CardHeader>
        <CardTitle>Suggested Budgets (Next Month)</CardTitle>
      </CardHeader>
      <CardContent>
        {budgetSuggestions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Suggested Budget</th>
                </tr>
              </thead>
              <tbody>
                {budgetSuggestions.map((budget, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{budget.name}</td>
                    <td className="px-4 py-2">{currency}{formatCurrency(budget.suggestedBudget)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No budget suggestions available.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetSuggestions;