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
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const totalSpent = getTotalSpentForYear(currentYear);
  const totalSaved = getTotalSavedForYear(currentYear);
  const avgMonthly = getAvgMonthlySavings();
  const yearlyGoal = getYearlyGoal(currentYear);

  const currentMonthSpending = getSpendingForMonth(currentMonth, currentYear);
  const currentMonthSpent = currentMonthSpending.reduce((sum, r) => sum + r.amount, 0);
  const currentMonthSaved = getMonthlySavingsAmount(currentMonth, currentYear);

  const uniqueDaysLogged = useMemo(() => {
    const uniqueDays = new Set(currentMonthSpending.map((r) => r.date));
    return uniqueDays.size;
  }, [currentMonthSpending]);

  const avgDailySpentThisMonth = uniqueDaysLogged > 0 ? currentMonthSpent / uniqueDaysLogged : 0;

  const [recommendedBudget, setRecommendedBudget] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const formatCurrency = (amount: number) => {
    return `₱${amount.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  /**
   * UPDATED: Added Randomized Logic
   */
  const analyzeAndRecommend = () => {
    setIsAnalyzing(true);
    
    // Simulate "AI thinking" time
    setTimeout(() => {
      let finalRecommendation = 0;

      if (currentMonthSpending.length === 0) {
        // No logs? Base it on goal or default 500
        const base = yearlyGoal ? (yearlyGoal / 12 / 30) : 500;
        finalRecommendation = base;
      } else {
        // 1. Start with actual daily average
        const dailyAvg = currentMonthSpent / uniqueDaysLogged;
        
        // 2. Add Randomized Variance (+/- 15%)
        // This makes the number wiggle every time you hit refresh
        const variance = 0.85 + Math.random() * 0.3; 
        finalRecommendation = dailyAvg * variance;

        // 3. Goal Adjustment: If behind on goals, pull the budget down
        if (yearlyGoal && totalSaved < yearlyGoal) {
          const monthsRemaining = 12 - currentMonth;
          const neededSavingsPerMonth = (yearlyGoal - totalSaved) / monthsRemaining;
          const avgIncome = avgMonthly + (totalSpent / (currentMonth + 1));
          const maxPossibleDaily = (avgIncome - neededSavingsPerMonth) / 30;
          
          finalRecommendation = Math.min(finalRecommendation, maxPossibleDaily);
        }
      }

      // 4. Randomized Floor
      // Instead of exactly 100, we pick a random "minimum" between 100 and 150
      const dynamicFloor = 50 + Math.floor(Math.random() * 300);
      
      setRecommendedBudget(Math.max(Math.round(finalRecommendation), dynamicFloor));
      setIsAnalyzing(false);
    }, 800);
  };

  return (
    <div className="space-y-4">
      {/* Yearly Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 rounded-2xl p-5 border border-red-100 dark:border-red-900/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total Spent ({currentYear})</span>
            <TrendingDown className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-500">{formatCurrency(totalSpent)}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This year so far</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl p-5 border border-green-100 dark:border-green-900/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total Saved ({currentYear})</span>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-500">{formatCurrency(totalSaved)}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This year so far</p>
        </div>

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
            <><div className="text-xl font-semibold text-gray-500">No goal set</div></>
          )}
        </div>

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
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-medium text-amber-600">Get AI advice</span>
            </div>
          )}
        </div>
      </div>

{/* Current Month Stats - 3 cards below the main 4 */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
  
  {/* 1. Spent this month - ROSE (Unique from Yearly Red) */}
  <div className="bg-rose-50/50 dark:bg-rose-950/10 rounded-2xl p-5 border border-rose-100 dark:border-rose-900/30">
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm font-semibold text-rose-700 dark:text-rose-300">Spent this {MONTHS[currentMonth]}</span>
      <TrendingDown className="w-5 h-5 text-rose-400" />
    </div>
    <div className="text-2xl font-bold text-rose-600">{formatCurrency(currentMonthSpent)}</div>
    <p className="text-xs text-rose-500/70 mt-1 font-medium">Monthly total</p>
  </div>

  {/* 2. Saved this month - CYAN (Unique from Yearly Green) */}
  <div className="bg-cyan-50/50 dark:bg-cyan-950/10 rounded-2xl p-5 border border-cyan-100 dark:border-cyan-900/30">
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">Saved this {MONTHS[currentMonth]}</span>
      <TrendingUp className="w-5 h-5 text-cyan-400" />
    </div>
    <div className="text-2xl font-bold text-cyan-600">{formatCurrency(currentMonthSaved)}</div>
    <p className="text-xs text-cyan-500/70 mt-1 font-medium">Monthly progress</p>
  </div>

  {/* 3. Avg Daily Spent - INDIGO (Unique from AI Orange) */}
  <div className="bg-indigo-50/50 dark:bg-indigo-950/10 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-900/30">
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">Avg Daily Spent</span>
      <div className="bg-indigo-100 dark:bg-indigo-900/50 p-1 rounded-md">
        <TrendingDown className="w-4 h-4 text-indigo-500" />
      </div>
    </div>
    <div className="text-2xl font-bold text-indigo-600">{formatCurrency(avgDailySpentThisMonth)}</div>
    <p className="text-xs text-indigo-500/70 mt-1 leading-relaxed font-medium">
      {currentMonthSpent > 0
        ? `₱${currentMonthSpent.toLocaleString("en-PH")} ÷ ${uniqueDaysLogged} days`
        : `Tracked daily`}
    </p>
  </div>
</div>
    </div>
  );
}