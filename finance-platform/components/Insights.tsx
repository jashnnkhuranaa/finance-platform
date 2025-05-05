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

interface InsightsProps {
  transactions: Transaction[];
  categories: Category[];
  startDate: Date; // Added startDate
  endDate: Date;   // Added endDate
}

const Insights = ({ transactions, categories, startDate, endDate }: InsightsProps) => {
  const insights = (() => {
    // Calculate days between startDate and endDate
    const daysInRange = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) || 1;

    const insightsList = categories
      .map((category) => {
        const categoryTransactions = transactions.filter(
          (t) => t.categoryId === category.id && t.amount < 0
        );
        const totalExpense = categoryTransactions.reduce(
          (sum, t) => sum + Math.abs(t.amount),
          0
        );
        const avgDailyExpense = totalExpense / daysInRange;
        return avgDailyExpense > 10 // Lowered threshold to generate insights
          ? { name: category.name, message: `You're spending an average of $${avgDailyExpense.toFixed(2)} per day on ${category.name}. Consider reducing.` }
          : null;
      })
      .filter((insight): insight is { name: string; message: string } => insight !== null);

    console.log('Insights:', insightsList);
    return insightsList;
  })();

  return (
    <Card className="border-none drop-shadow-sm lg:col-span-2">
      <CardHeader>
        <CardTitle>Insights</CardTitle>
      </CardHeader>
      <CardContent>
        {insights.length > 0 ? (
          <ul className="list-disc pl-5">
            {insights.map((insight, index) => (
              <li key={index} className="text-blue-600">
                {insight.message}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No insights available at this time.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default Insights;