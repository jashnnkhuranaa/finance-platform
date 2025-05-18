'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatCurrency } from "@/lib/utils/transaction";
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import { useTransactions } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";

const BudgetTracker = ({ currency = '₹' }) => {
  const { data: transactions = [], isLoading: transactionsLoading, error: transactionsError } = useTransactions();
  const { data: categoriesData = [], isLoading: categoriesLoading, error: categoriesError } = useCategories();

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
  const [userEmail, setUserEmail] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [alertsSent, setAlertsSent] = useState(() => {
    return localStorage.getItem('alertsSent') ? JSON.parse(localStorage.getItem('alertsSent')) : {};
  });

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (!res.ok) {
          const errorText = await res.text();
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = { error: res.statusText };
          }
          console.error('Failed to fetch user email:', errorData.error || res.statusText);
          if (errorData.error === "Token expired" || errorData.error === "No access token found") {
            window.location.href = '/login';
            return;
          }
          setEmailError("Unable to fetch user email.");
          setUserEmail(null);
          return;
        }
        const data = await res.json();
        setUserEmail(data.email || null);
        setEmailError(null);
      } catch (error) {
        console.error('Error fetching user email:', error.message);
        setEmailError("Error fetching user email. Please try again.");
        setUserEmail(null);
      }
    };
    fetchUserEmail();
  }, []);

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
  }, [categoriesData, categoryBudgets]);

  useEffect(() => {
    localStorage.setItem('totalBudget', totalBudget);
    localStorage.setItem('categoryBudgets', JSON.stringify(categoryBudgets));
    localStorage.setItem('alertsSent', JSON.stringify(alertsSent));
  }, [totalBudget, categoryBudgets, alertsSent]);

  const totalSpent = transactions
    .filter(txn => txn.amount < 0)
    .reduce((sum, txn) => sum + Math.abs(Number(txn.amount)), 0);
  const remainingBudget = totalBudget - totalSpent;

  const getCategorySpent = (categoryName) => {
    return transactions
      .filter(txn => {
        const category = categoriesData.find(cat => cat.id === txn.categoryId);
        return category && category.name === categoryName && txn.amount < 0;
      })
      .reduce((sum, txn) => sum + Math.abs(Number(txn.amount)), 0);
  };

  const sendBudgetAlert = async (type, category, percentage, budget, spent, remaining) => {
    if (!userEmail) {
      console.log("BudgetTracker: No user email, skipping budget alert");
      return;
    }

    const alertKey = type === 'total' ? 'totalBudget' : category;
    if (alertsSent[alertKey]) {
      console.log(`BudgetTracker: Alert already sent for ${alertKey}`);
      return;
    }

    try {
      console.log(`BudgetTracker: Attempting to send budget alert for ${alertKey}`);
      const res = await fetch('/api/sendBudgetAlert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail,
          type,
          category,
          percentage: Math.round(percentage),
          budget: formatCurrency(budget),
          spent: formatCurrency(spent),
          remaining: formatCurrency(remaining),
          currency,
        }),
      });

      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : { message: "No response body" };
      } catch {
        data = { message: "Invalid response", raw: text };
      }

      if (res.ok) {
        setAlertsSent(prev => ({ ...prev, [alertKey]: true }));
        console.log(`BudgetTracker: Budget alert sent successfully for ${alertKey}`, data);
      } else {
        console.error('BudgetTracker: Failed to send budget alert:', {
          status: res.status,
          statusText: res.statusText,
          body: data,
        });
      }
    } catch (error) {
      console.error('BudgetTracker: Error sending budget alert:', error.message);
    }
  };

  useEffect(() => {
    if (transactionsLoading || categoriesLoading || !userEmail) {
      if (!userEmail) console.log("BudgetTracker: Skipping budget alert check: userEmail is null");
      return;
    }

    const totalPercentage = totalBudget ? (totalSpent / totalBudget) * 100 : 0;
    if (totalPercentage >= 90) {
      sendBudgetAlert('total', null, totalPercentage, totalBudget, totalSpent, remainingBudget);
    }

    categoriesData.forEach(cat => {
      const spent = getCategorySpent(cat.name);
      const budget = categoryBudgets[cat.name] || 0;
      const percentage = budget ? (spent / budget) * 100 : 0;
      if (percentage >= 90) {
        const remaining = budget - spent;
        sendBudgetAlert('category', cat.name, percentage, budget, spent, remaining);
      }
    });
  }, [totalBudget, categoryBudgets, transactions, categoriesData, userEmail, categoriesLoading, transactionsLoading, sendBudgetAlert, getCategorySpent, remainingBudget, totalSpent]);
  
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

  const handleSetBudget = (e) => {
    e.preventDefault();
    const budget = Number(e.target.budget.value);
    if (budget < 0) return;

    if (selectedBudgetType === 'Total Budget') {
      setTotalBudget(budget);
      setAlertsSent(prev => ({ ...prev, totalBudget: false }));
    } else {
      setCategoryBudgets({
        ...categoryBudgets,
        [selectedBudgetType]: budget,
      });
      setAlertsSent(prev => ({ ...prev, [selectedBudgetType]: false }));
    }
    e.target.reset();
  };

  const overviewData = getOverviewData();

  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">Budget Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        {emailError && (
          <div className="text-red-600 mb-4">
            {emailError}
            {emailError.includes("Session expired") && (
              <button
                onClick={() => window.location.href = '/login'}
                className="ml-2 text-blue-600 underline"
              >
                Log in
              </button>
            )}
          </div>
        )}
        <div className="flex flex-row gap-4">
          <div className="flex-1">
            <h3 className="text-md font-semibold text-gray-800 mb-3">Set Budget</h3>
            <form onSubmit={handleSetBudget} className="space-y-3">
              <div className="flex flex-col gap-3">
                <select
                  value={selectedBudgetType}
                  onChange={(e) => setSelectedBudgetType(e.target.value)}
                  className="w-full p-2 border rounded-md"
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
                  className="w-full"
                  min="0"
                />
              </div>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full">
                Set Budget
              </Button>
            </form>
          </div>

          <div className="flex-1">
            <h3 className="text-md font-semibold text-gray-800 mb-3">Budget Overview</h3>
            <div className="space-y-3">
              <select
                value={selectedOverviewType}
                onChange={(e) => setSelectedOverviewType(e.target.value)}
                className="w-full p-2 border rounded-md"
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetTracker;