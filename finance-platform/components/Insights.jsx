import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/transaction";
import { Info, CheckCircle } from "lucide-react";

const Insights = ({ transactions, categories, startDate, endDate, currency = '₹' }) => {
  const insights = (() => {
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

    const topCategories = expensesByCategory
      .sort((a, b) => b.totalExpense - a.totalExpense)
      .slice(0, 3)
      .filter((cat) => cat.totalExpense > 0);

    const insightsList = topCategories.map((cat) => ({
      name: cat.name,
      message: `You're spending a lot on ${cat.name}: ${currency}${formatCurrency(cat.totalExpense)}. Consider reviewing this category.`,
    }));

    console.log("Insights:", insightsList);
    return insightsList;
  })();

  return (
    <Card className="border-none drop-shadow-sm lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">Insights</CardTitle>
      </CardHeader>
      <CardContent>
        {insights.length > 0 ? (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg shadow-sm"
              >
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-blue-700 font-medium">{insight.name}</p>
                  <p className="text-blue-600 text-sm">{insight.message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-500">
            <CheckCircle className="h-5 w-5" />
            <p>No insights available at this time.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Insights;