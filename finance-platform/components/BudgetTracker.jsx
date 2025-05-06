"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatCurrency } from "@/lib/utils/transaction";
import  Input  from '@/components/ui/input';
import  Button  from '@/components/ui/button';
import { useTransactions } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";

const BudgetTracker = ({ currency = '₹' }) => {
  // Fetch transactions and categories
  const { data: transactions = [], isLoading: transactionsLoading, error: transactionsError } = useTransactions();
  const { data: categoriesData = [], isLoading: categoriesLoading, error: categoriesError } = useCategories();

  // State for total budget and category budgets
  const [totalBudget, setTotalBudget] = useState(() => {
    return localStorage.getItem('totalBudget') ? Number(localStorage.getItem('totalBudget')) : 0;
  });
  const [categoryBudgets, setCategoryBudgets] = useState(() => {
    return localStorage.getItem('categoryBudgets') 
      ? JSON.parse(localStorage.getItem('categoryBudgets')) 
      : {};
  });
  const [selectedBudgetType, setSelectedBudgetType] = useState('Total Budget');
  const [selectedOverviewType, setSelectedOverviewType] = useState('Total Budget');

  // Initialize category budgets for new categories
  useEffect(() => {
    const updatedCategoryBudgets = { ...categoryBudgets };
    let hasChanges = false;
    categoriesData.forEach(cat => {
      if (!(cat.name in updatedCategoryBudgets)) {
        updatedCategoryBudgets[cat.name] = 0;
        hasChanges = true;
      }
    });
    if (hasChanges) {
      setCategoryBudgets(updatedCategoryBudgets);
    }
  }, [categoriesData]);

  // Save to local storage whenever state changes
  useEffect(() => {
    localStorage.setItem('totalBudget', totalBudget);
    localStorage.setItem('categoryBudgets', JSON.stringify(categoryBudgets));
  }, [totalBudget, categoryBudgets]);

  // Calculate total spent (from transactions with negative amounts)
  const totalSpent = transactions
    .filter(txn => txn.amount < 0)
    .reduce((sum, txn) => sum + Math.abs(Number(txn.amount)), 0);
  const remainingBudget = totalBudget - totalSpent;

  // Calculate category-wise spent
  const getCategorySpent = (categoryName) => {
    return transactions
      .filter(txn => {
        const category = categoriesData.find(cat => cat.id === txn.categoryId);
        return category && category.name === categoryName && txn.amount < 0;
      })
      .reduce((sum, txn) => sum + Math.abs(Number(txn.amount)), 0);
  };

  // Handle budget setting (total or category-wise)
  const handleSetBudget = (e) => {
    e.preventDefault();
    const budget = Number(e.target.budget.value);
    if (budget < 0) return;

    if (selectedBudgetType === 'Total Budget') {
      setTotalBudget(budget);
    } else {
      setCategoryBudgets({
        ...categoryBudgets,
        [selectedBudgetType]: budget,
      });
    }
    e.target.reset();
  };

  // Get overview data based on selection
  const getOverviewData = () => {
    if (selectedOverviewType === 'Total Budget') {
      return {
        budget: totalBudget,
        spent: totalSpent,
        remaining: remainingBudget,
        percentage: Math.min((totalSpent / (totalBudget || 1)) * 100, 100),
      };
    } else {
      const spent = getCategorySpent(selectedOverviewType);
      const budget = categoryBudgets[selectedOverviewType] || 0;
      const remaining = budget - spent;
      return {
        budget,
        spent,
        remaining,
        percentage: Math.min((spent / (budget || 1)) * 100, 100),
      };
    }
  };

  // Loading and Error Handling
  if (transactionsLoading || categoriesLoading) {
    return <div className="text-gray-500">Loading budget tracker...</div>;
  }

  if (transactionsError || categoriesError) {
    return (
      <div className="text-red-600">
        Error: {transactionsError?.message || categoriesError?.message}
      </div>
    );
  }

  const overviewData = getOverviewData();

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Set Budget with Dropdown */}
      <Card className="border-none drop-shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Set Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSetBudget} className="space-y-3">
            <div className="flex gap-3 items-center">
              <select
                value={selectedBudgetType}
                onChange={(e) => setSelectedBudgetType(e.target.value)}
                className="w-full max-w-xs p-2 border rounded-md"
              >
                <option value="Total Budget">Total Budget</option>
                {categoriesData.map((cat, index) => (
                  <option key={index} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              <Input
                type="number"
                name="budget"
                placeholder={`Enter budget for ${selectedBudgetType}`}
                className="w-full max-w-xs"
                min="0"
              />
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Set Budget
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Budget Overview with Dropdown */}
      <Card className="border-none drop-shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Budget Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <select
              value={selectedOverviewType}
              onChange={(e) => setSelectedOverviewType(e.target.value)}
              className="w-full max-w-xs p-2 border rounded-md"
            >
              <option value="Total Budget">Total Budget</option>
              {categoriesData.map((cat, index) => (
                <option key={index} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Budget:</span>
                <span>{currency}{formatCurrency(overviewData.budget)}</span>
              </div>
              <div className="flex justify-between">
                <span>Spent:</span>
                <span className="text-red-600">{currency}{formatCurrency(overviewData.spent)}</span>
              </div>
              <div className="flex justify-between">
                <span>Remaining:</span>
                <span className={overviewData.remaining >= 0 ? "text-green-600" : "text-red-600"}>
                  {currency}{formatCurrency(overviewData.remaining)}
                </span>
              </div>
              <div className="pt-2">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full ${overviewData.spent <= overviewData.budget ? 'bg-green-600' : 'bg-red-600'}`}
                    style={{ width: `${overviewData.percentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {Math.round(overviewData.percentage)}% Used
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetTracker;