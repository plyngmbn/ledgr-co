"use client";

import { useState, useEffect, useMemo } from "react";
import { TrendingDown, TrendingUp, Target, Sparkles, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase-client"; // Import Supabase
import { MONTHS } from "@/lib/types";

export function StatCards() {
  // State for our synced data
  const [totalSpentYear, setTotalSpentYear] = useState(0);
  const [totalSavedYear, setTotalSavedYear] = useState(0);
  const [currentMonthSpent, setCurrentMonthSpent] = useState(0);
  const [currentMonthSaved, setCurrentMonthSaved] = useState(0);
  const [yearlyGoal, setYearlyGoal] = useState<number | null>(null);
  const [uniqueDaysLogged, setUniqueDaysLogged] = useState(0);
  const [loading, setLoading] = useState(true);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const fetchCloudStats = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Fetch all records for the year
    const { data: records } = await supabase
      .from("records")
      .select("amount, month, date")
      .eq("year", currentYear);

    // 2. Fetch all savings for the year
    const { data: savings } = await supabase
      .from("savings")
      .select("amount, month")
      .eq("year", currentYear);

    // 3. Fetch yearly goal
    const { data: goalData } = await supabase
      .from("goals")
      .select("target_amount")
      .eq("year", currentYear)
      .single();

    // CALCULATIONS
    if (records) {
      setTotalSpentYear(records.reduce((sum, r) => sum + r.amount, 0));
      
      const monthRecords = records.filter(r => r.month === currentMonth);
      setCurrentMonthSpent(monthRecords.reduce((sum, r) => sum + r.amount, 0));
      
      const uniqueDays = new Set(monthRecords.map(r => r.date));
      setUniqueDaysLogged(uniqueDays.size);
    }

    if (savings) {
      setTotalSavedYear(savings.reduce((sum, s) => sum + s.amount, 0));
      const monthSaved = savings.find(s => s.month === currentMonth);
      setCurrentMonthSaved(monthSaved?.amount || 0);
    }

    if (goalData) setYearlyGoal(goalData.target_amount);
    
    setLoading(false);
  };

  useEffect(() => {
    fetchCloudStats();
  }, []);

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

  if (loading) return <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl" />)}
  </div>;

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
          <div className="text-2xl font-bold text-red-500">{formatCurrency(totalSpentYear)}</div>
        </div>

        {/* Total Saved - Green */}
        <div className="bg-green-50/50 dark:bg-green-950/20 rounded-2xl p-5 border border-green-100 dark:border-green-900/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-green-600 dark:text-green-400">Total Saved ({currentYear})</span>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-500">{formatCurrency(totalSavedYear)}</div>
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
        </div>

        {/* Saved this month - CYAN */}
        <div className="bg-cyan-50/50 dark:bg-cyan-950/10 rounded-2xl p-5 border border-cyan-100 dark:border-cyan-900/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">Saved this {MONTHS[currentMonth]}</span>
            <TrendingUp className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-500">{formatCurrency(currentMonthSaved)}</div>
        </div>

        {/* Avg Daily Spent - INDIGO */}
        <div className="bg-indigo-50/50 dark:bg-indigo-950/10 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-900/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Avg Daily Spent</span>
            <TrendingDown className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-indigo-500">{formatCurrency(avgDailySpentThisMonth)}</div>
        </div>

      </div>
    </div>
  );
}