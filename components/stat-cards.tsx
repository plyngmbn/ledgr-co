"use client";

import { useState } from "react";
import { TrendingDown, TrendingUp, PiggyBank, Target, Sparkles, RefreshCw } from "lucide-react";
import { useBudget } from "@/lib/budget-context";
import { MONTHS } from "@/lib/types";

export function StatCards() {
  const {
    data,
    getTotalSpentForYear,
    getTotalSavedForYear,
    getAvgMonthlySavings,
    getYearlyGoal,
    getSpendingForMonth,
    getMonthlySavingsAmount,
  } = useBudget();

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const totalSpent = getTotalSpentForYear(currentYear);
  const totalSaved = getTotalSavedForYear(currentYear);
  const avgMonthly = getAvgMonthlySavings();
  const yearlyGoal = getYearlyGoal(currentYear);

  // Current month stats
  const currentMonthSpending = getSpendingForMonth(currentMonth, currentYear);
  const currentMonthSpent = currentMonthSpending.reduce((sum, r) => sum + r.amount, 0);
  const currentMonthSaved = getMonthlySavingsAmount(currentMonth, currentYear);

  // Avg daily spent from previous months
  const pastMonthsData = Array.from({ length: currentMonth }, (_, i) => {
    const monthSpent = data.spending
      .filter((r) => r.month === i && r.year === currentYear)
      .reduce((sum, r) => sum + r.amount, 0);
    const daysInMonth = new Date(currentYear, i + 1, 0).getDate();
    return { monthSpent, daysInMonth };
  }).filter((m) => m.monthSpent > 0);

  const avgDailySpent = pastMonthsData.length > 0
    ? pastMonthsData.reduce((sum, m) => sum + m.monthSpent / m.daysInMonth, 0) / pastMonthsData.length
    : 0;

  const avgMonthlySpent = pastMonthsData.length > 0
    ? pastMonthsData.reduce((sum, m) => sum + m.monthSpent, 0) / pastMonthsData.length
    : 0;

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
    <div className="space-y-4">
      {/* Yearly Stats - 4 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Spent */}
        <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 rounded-2xl p-5 border border-red-100 dark:border-red-900/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total Spent ({currentYear})</span>
            <TrendingDown className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-500">{formatCurrency(totalSpent)}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This year so far</p>
        </div>

        {/* Total Saved */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl p-5 border border-green-100 dark:border-green-900/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total Saved ({currentYear})</span>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-500">{formatCurrency(totalSaved)}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This year so far</p>
        </div>

        {/* Yearly Goal */}
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900 dark:to-slate-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{currentYear} Savings Goal</span>
            <Target className="w-5 h-5 text-gray-400" />
          </div>
          {yearlyGoal !== null ? (
            <>
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-200">{formatCurrency(yearlyGoal)}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {totalSaved >= yearlyGoal ? "🎉 Goal reached!" : `${formatCurrency(yearlyGoal - totalSaved)} to go`}
              </p>
            </>
          ) : (
            <>
              <div className="text-xl font-semibold text-gray-500">No goal set</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Set in Records</p>
            </>
          )}
        </div>

        {/* AI Recommended Budget */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 rounded-2xl p-5 border border-amber-100 dark:border-amber-900/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">AI Daily Budget</span>
            <button
              onClick={analyzeAndRecommend}
              disabled={isAnalyzing}
              className="p-1 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded-full transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-amber-500 ${isAnalyzing ? "animate-spin" : ""}`} />
            </button>
          </div>
          {recommendedBudget !== null ? (
            <>
              <div className="text-2xl font-bold text-amber-600">{formatCurrency(recommendedBudget)}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Recommended per day</p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-medium text-amber-600">Get AI advice</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Click refresh to analyze</p>
            </>
          )}
        </div>
      </div>

      {/* Current Month Stats - 4 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Spent this month */}
        <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 rounded-2xl p-5 border border-red-100 dark:border-red-900/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Spent this {MONTHS[currentMonth]}</span>
            <TrendingDown className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-500">{formatCurrency(currentMonthSpent)}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This month so far</p>
        </div>

        {/* Saved this month */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl p-5 border border-green-100 dark:border-green-900/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Saved this {MONTHS[currentMonth]}</span>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-500">{formatCurrency(currentMonthSaved)}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This month</p>
        </div>

        {/* Avg Monthly Spent */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-2xl p-5 border border-orange-100 dark:border-orange-900/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Avg Monthly Spent</span>
            <TrendingDown className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-orange-500">{formatCurrency(avgMonthlySpent)}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            ~{formatCurrency(avgDailySpent)}/day avg
          </p>
        </div>

        {/* Avg Monthly Savings */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-2xl p-5 border border-purple-100 dark:border-purple-900/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Avg Monthly Savings</span>
            <PiggyBank className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-500">{formatCurrency(avgMonthly)}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Across all months</p>
        </div>
      </div>
    </div>
  );
}