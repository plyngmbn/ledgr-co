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
  const totalSpent = getTotalSpentForYear(currentYear);
  const totalSaved = getTotalSavedForYear(currentYear);
  const avgMonthly = getAvgMonthlySavings();
  const yearlyGoal = getYearlyGoal(currentYear);

  const currentMonthSpending = getSpendingForMonth(currentMonth, currentYear);
  const currentMonthSpent = currentMonthSpending.reduce((sum, r) => sum + r.amount, 0);

  const uniqueDaysLogged = useMemo(() => {
    const uniqueDays = new Set(currentMonthSpending.map((r) => r.date));
    return uniqueDays.size;
  }, [currentMonthSpending]);

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
      let finalRecommendation = 0;
      if (currentMonthSpending.length === 0) {
        const base = yearlyGoal ? (yearlyGoal / 12 / 30) : 500;
        finalRecommendation = base;
      } else {
        const dailyAvg = currentMonthSpent / uniqueDaysLogged;
        const variance = 0.85 + Math.random() * 0.3; 
        finalRecommendation = dailyAvg * variance;
        if (yearlyGoal && totalSaved < yearlyGoal) {
          const monthsRemaining = 12 - currentMonth;
          const neededSavingsPerMonth = (yearlyGoal - totalSaved) / monthsRemaining;
          const avgIncome = avgMonthly + (totalSpent / (currentMonth + 1));
          const maxPossibleDaily = (avgIncome - neededSavingsPerMonth) / 30;
          finalRecommendation = Math.min(finalRecommendation, maxPossibleDaily);
        }
      }
      const dynamicFloor = 50 + Math.floor(Math.random() * 300);
      setRecommendedBudget(Math.max(Math.round(finalRecommendation), dynamicFloor));
      setIsAnalyzing(false);
    }, 800);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Spent - Red Header */}
        <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 rounded-2xl p-5 border border-red-100 dark:border-red-900/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-red-500/80 dark:text-red-400">Total Spent ({currentYear})</span>
            <TrendingDown className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-500">{formatCurrency(totalSpent)}</div>
          <p className="text-xs text-red-400/60 dark:text-gray-400 mt-1">This year so far</p>
        </div>

        {/* Total Saved - Green Header */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl p-5 border border-green-100 dark:border-green-900/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-green-600/80 dark:text-green-400">Total Saved ({currentYear})</span>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-500">{formatCurrency(totalSaved)}</div>
          <p className="text-xs text-green-400/60 dark:text-gray-400 mt-1">This year so far</p>
        </div>

        {/* Savings Goal - Slate/Gray Header */}
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900 dark:to-slate-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{currentYear} Savings Goal</span>
            <Target className="w-5 h-5 text-slate-400" />
          </div>
          {yearlyGoal !== null ? (
            <>
              <div className="text-2xl font-bold text-slate-700 dark:text-gray-200">{formatCurrency(yearlyGoal)}</div>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                {totalSaved >= yearlyGoal ? "🎉 Goal reached!" : `${formatCurrency(yearlyGoal - totalSaved)} to go`}
              </p>
            </>
          ) : (
            <div className="text-xl font-semibold text-slate-500">No goal set</div>
          )}
        </div>

        {/* AI Daily Budget - Amber Header */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 rounded-2xl p-5 border border-amber-100 dark:border-amber-900/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-amber-600/80 dark:text-amber-400">AI Daily Budget</span>
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
              <p className="text-xs text-amber-500/70 dark:text-gray-400 mt-1">Recommended per day</p>
            </>
          ) : (
            <button 
              onClick={analyzeAndRecommend}
              className="flex items-center gap-2 group"
            >
              <Sparkles className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold text-amber-600/80">Get AI advice</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}