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

interface BudgetSuggestionsProps {
  transactions: Transaction[];
  categories: Category[];
  startDate: Date; // Added startDate
  endDate: Date;   // Added endDate
}

const BudgetSuggestions = ({ transactions, categories, startDate, endDate }: BudgetSuggestionsProps) => {
  const budgetSuggestions = (() => {
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
    ) || 1; // Ensure daysInRange is at least 1

    const suggestions = expensesByCategory.map((cat) => {
      const monthlyExpense = cat.totalExpense;
      const avgMonthlyExpense = daysInRange > 0 ? (monthlyExpense * 30) / daysInRange : 0;
      const suggestedBudget = avgMonthlyExpense * 1.1; // Add 10% buffer
      return { name: cat.name, suggestedBudget };
    }).filter((cat) => cat.suggestedBudget > 0);

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
                {budgetSuggestions.map((budget: { name: string; suggestedBudget: number }, index: number) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{budget.name}</td>
                    <td className="px-4 py-2">${budget.suggestedBudget.toFixed(2)}</td>
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