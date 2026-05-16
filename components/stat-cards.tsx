"use client";

import { useState, useEffect } from "react";
import { TrendingDown, TrendingUp, PiggyBank, Target, Sparkles, RefreshCw } from "lucide-react";
import { useBudget } from "@/lib/budget-context";

export function StatCards() {
  const {
    data,
    getTotalSpentForYear,
    getTotalSavedForYear,
    getAvgMonthlySavings,
    getYearlyGoal,
  } = useBudget();

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const totalSpent = getTotalSpentForYear(currentYear);
  const totalSaved = getTotalSavedForYear(currentYear);
  const avgMonthly = getAvgMonthlySavings();
  const yearlyGoal = getYearlyGoal(currentYear);

  const [recommendedBudget, setRecommendedBudget] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const formatCurrency = (amount: number) => {
    return `₱${amount.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const analyzeAndRecommend = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const monthlySpending = data.spending.filter(
        (r) => r.month === currentMonth && r.year === currentYear
      );
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const currentDay = new Date().getDate();
      const daysRemaining = daysInMonth - currentDay;

      if (monthlySpending.length === 0) {
        if (yearlyGoal) {
          const monthlyBudget = yearlyGoal / 12;
          setRecommendedBudget(Math.round(monthlyBudget / daysInMonth));
        } else {
          setRecommendedBudget(500);
        }
      } else {
        const monthlyTotal = monthlySpending.reduce((sum, r) => sum + r.amount, 0);
        const dailyAvg = monthlyTotal / currentDay;
        let recommended = dailyAvg * 0.8;
        if (yearlyGoal && totalSaved < yearlyGoal) {
          const monthsRemaining = 12 - currentMonth;
          const neededSavingsPerMonth = (yearlyGoal - totalSaved) / monthsRemaining;
          const avgIncome = avgMonthly + (totalSpent / (currentMonth + 1));
          const maxSpendPerDay = (avgIncome - neededSavingsPerMonth) / daysInMonth;
          recommended = Math.min(recommended, maxSpendPerDay);
        }
        setRecommendedBudget(Math.max(Math.round(recommended), 100));
      }
      setIsAnalyzing(false);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Total Spent */}
      <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-5 border border-red-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">Total Spent ({currentYear})</span>
          <TrendingDown className="w-5 h-5 text-red-400" />
        </div>
        <div className="text-2xl font-bold text-red-500">{formatCurrency(totalSpent)}</div>
        <p className="text-xs text-gray-500 mt-1">This year so far</p>
      </div>

      {/* Total Saved */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">Total Saved ({currentYear})</span>
          <TrendingUp className="w-5 h-5 text-green-400" />
        </div>
        <div className="text-2xl font-bold text-green-500">{formatCurrency(totalSaved)}</div>
        <p className="text-xs text-gray-500 mt-1">This year so far</p>
      </div>

      {/* Avg Monthly Savings */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">Avg Monthly Savings</span>
          <PiggyBank className="w-5 h-5 text-purple-400" />
        </div>
        <div className="text-2xl font-bold text-purple-500">{formatCurrency(avgMonthly)}</div>
        <p className="text-xs text-gray-500 mt-1">Across all months</p>
      </div>

      {/* Yearly Goal */}
      <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-5 border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">{currentYear} Savings Goal</span>
          <Target className="w-5 h-5 text-gray-400" />
        </div>
        {yearlyGoal !== null ? (
          <>
            <div className="text-2xl font-bold text-gray-700">{formatCurrency(yearlyGoal)}</div>
            <p className="text-xs text-gray-500 mt-1">
              {totalSaved >= yearlyGoal
                ? "Goal reached!"
                : `${formatCurrency(yearlyGoal - totalSaved)} to go`}
            </p>
          </>
        ) : (
          <>
            <div className="text-xl font-semibold text-gray-500">No goal set</div>
            <p className="text-xs text-gray-500 mt-1">Set a yearly savings goal in Records</p>
          </>
        )}
      </div>

      {/* AI Recommended Budget */}
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-5 border border-amber-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">AI Daily Budget</span>
          <button
            onClick={analyzeAndRecommend}
            disabled={isAnalyzing}
            className="p-1 hover:bg-amber-100 rounded-full transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-amber-500 ${isAnalyzing ? "animate-spin" : ""}`} />
          </button>
        </div>
        {recommendedBudget !== null ? (
          <>
            <div className="text-2xl font-bold text-amber-600">{formatCurrency(recommendedBudget)}</div>
            <p className="text-xs text-gray-500 mt-1">Recommended per day</p>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-medium text-amber-600">Get AI advice</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Click refresh to analyze</p>
          </>
        )}
      </div>
    </div>
  );
}
