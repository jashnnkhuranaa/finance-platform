import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/transaction";

const SavingsGoal = ({ remaining, currency = '₹' }) => {
  const savingsGoal = remaining > 0 ? remaining * 0.2 : 0; // 20% of remaining income

  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader>
        <CardTitle>Savings Goal</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-green-600">
          {currency}{formatCurrency(savingsGoal)}
        </p>
        <p className="text-sm text-gray-500">
          Suggested savings for this month based on your remaining balance.
        </p>
      </CardContent>
    </Card>
  );
};

export default SavingsGoal;