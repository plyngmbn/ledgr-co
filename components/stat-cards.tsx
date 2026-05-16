"use client";

import { useState, useMemo } from "react";
import { TrendingDown, TrendingUp, Target, Sparkles, RefreshCw } from "lucide-react";
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
  const currentDay = new Date().getDate();
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const totalSpent = getTotalSpentForYear(currentYear);
  const totalSaved = getTotalSavedForYear(currentYear);
  const avgMonthly = getAvgMonthlySavings();
  const yearlyGoal = getYearlyGoal(currentYear);

  // Current month stats
  const currentMonthSpending = getSpendingForMonth(currentMonth, currentYear);
  const currentMonthSpent = currentMonthSpending.reduce((sum, r) => sum + r.amount, 0);
  const currentMonthSaved = getMonthlySavingsAmount(currentMonth, currentYear);

  /**
   * FIX: Calculate unique days actually logged in the current month
   * This prevents the average from being diluted by future days or days with no activity.
   */
  const uniqueDaysLogged = useMemo(() => {
    const uniqueDays = new Set(currentMonthSpending.map((r) => r.date));
    return uniqueDays.size;
  }, [currentMonthSpending]);

  // Avg daily spent based on actual activity
  const avgDailySpentThisMonth = uniqueDaysLogged > 0 ? currentMonthSpent / uniqueDaysLogged : 0;

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
      if (currentMonthSpending.length === 0) {
        if (yearlyGoal) {
          const monthlyBudget = yearlyGoal / 12;
          setRecommendedBudget(Math.round(monthlyBudget / daysInCurrentMonth));
        } else {
          setRecommendedBudget(500);
        }
      } else {
        // Use actual daily average for recommendation
        const dailyAvg = currentMonthSpent / uniqueDaysLogged;
        let recommended = dailyAvg * 0.8; // Aim for 20% reduction

        if (yearlyGoal && totalSaved < yearlyGoal) {
          const monthsRemaining = 12 - currentMonth;
          const neededSavingsPerMonth = (yearlyGoal - totalSaved) / monthsRemaining;
          const avgIncome = avgMonthly + (totalSpent / (currentMonth + 1));
          const maxSpendPerDay = (avgIncome - neededSavingsPerMonth) / daysInCurrentMonth;
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

      {/* Current Month Stats - 3 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

        {/* Avg Daily Spent this month */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-2xl p-5 border border-orange-100 dark:border-orange-900/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Avg Daily Spent</span>
            <TrendingDown className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-orange-500">{formatCurrency(avgDailySpentThisMonth)}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
            {currentMonthSpent > 0
              ? `₱${currentMonthSpent.toLocaleString("en-PH")} ÷ ${uniqueDaysLogged} ${uniqueDaysLogged === 1 ? 'day' : 'days'} logged`
              : `Per day this ${MONTHS[currentMonth]}`}
          </p>
        </div>
      </div>
    </div>
  );
}