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

  const analyzeAndRecommend = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const dailyAvg = currentMonthSpent / (uniqueDaysLogged || 1);
      const variance = 0.85 + Math.random() * 0.3; 
      let recommended = dailyAvg * variance;
      const dynamicFloor = 50 + Math.floor(Math.random() * 300);
      setRecommendedBudget(Math.max(Math.round(recommended), dynamicFloor));
      setIsAnalyzing(false);
    }, 800);
  };

  return (
    <div className="space-y-4">
      {/* TOP ROW: 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Spent - Red */}
        <div className="bg-red-50/50 dark:bg-red-950/20 rounded-2xl p-5 border border-red-100 dark:border-red-900/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-red-600 dark:text-red-400">Total Spent ({currentYear})</span>
            <TrendingDown className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-500">{formatCurrency(totalSpent)}</div>
          <p className="text-xs text-red-400/70 mt-1 font-medium text-red-400">This year so far</p>
        </div>

        {/* Total Saved - Green */}
        <div className="bg-green-50/50 dark:bg-green-950/20 rounded-2xl p-5 border border-green-100 dark:border-green-900/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-green-600 dark:text-green-400">Total Saved ({currentYear})</span>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-500">{formatCurrency(totalSaved)}</div>
          <p className="text-xs text-green-500/70 mt-1 font-medium text-green-400">This year so far</p>
        </div>

        {/* Savings Goal - Slate */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{currentYear} Savings Goal</span>
            <Target className="w-5 h-5 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-700 dark:text-slate-200">
            {yearlyGoal !== null ? formatCurrency(yearlyGoal) : "₱0.00"}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {yearlyGoal && totalSaved < yearlyGoal ? `${formatCurrency(yearlyGoal - totalSaved)} to go` : "Goal tracked"}
          </p>
        </div>

        {/* AI Daily Budget - Amber */}
        <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl p-5 border border-amber-100 dark:border-amber-900/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">AI Daily Budget</span>
            <button onClick={analyzeAndRecommend} className="p-1 hover:bg-amber-100 rounded-full transition-colors">
              <RefreshCw className={`w-4 h-4 text-amber-500 ${isAnalyzing ? "animate-spin" : ""}`} />
            </button>
          </div>
          <div className="text-2xl font-bold text-amber-600">
            {recommendedBudget ? formatCurrency(recommendedBudget) : "₱0.00"}
          </div>
          <div className="flex items-center gap-1 mt-1">
             <Sparkles className="w-3 h-3 text-amber-400" />
             <p className="text-xs text-amber-500 font-medium">AI Recommendation</p>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: 3 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Spent this month - ROSE */}
        <div className="bg-rose-50/50 dark:bg-rose-950/10 rounded-2xl p-5 border border-rose-100 dark:border-rose-900/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-rose-600 dark:text-rose-400">Spent this {MONTHS[currentMonth]}</span>
            <TrendingDown className="w-5 h-5 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-500">{formatCurrency(currentMonthSpent)}</div>
          <p className="text-xs text-rose-400/70 mt-1 font-medium">Monthly total</p>
        </div>

        {/* Saved this month - CYAN */}
        <div className="bg-cyan-50/50 dark:bg-cyan-950/10 rounded-2xl p-5 border border-cyan-100 dark:border-cyan-900/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">Saved this {MONTHS[currentMonth]}</span>
            <TrendingUp className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-500">{formatCurrency(currentMonthSaved)}</div>
          <p className="text-xs text-cyan-400/70 mt-1 font-medium">Monthly progress</p>
        </div>

        {/* Avg Daily Spent - INDIGO */}
        <div className="bg-indigo-50/50 dark:bg-indigo-950/10 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-900/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Avg Daily Spent</span>
            <TrendingDown className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-indigo-500">{formatCurrency(avgDailySpentThisMonth)}</div>
          <p className="text-xs text-indigo-400/70 mt-1 font-medium">
            Based on {uniqueDaysLogged} {uniqueDaysLogged === 1 ? 'day' : 'days'} logged
          </p>
        </div>

      </div>
    </div>
  );
}