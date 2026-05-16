"use client";

import { useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { useBudget } from "@/lib/budget-context";
import { CATEGORIES } from "@/lib/types";

export function AIAnalysis() {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { data, getTotalSpentForYear, getTotalSavedForYear, getYearlyGoal } = useBudget();

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const currentDay = new Date().getDate();
  const daysRemaining = daysInMonth - currentDay;

  const analyzeSpending = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      const totalSpent = getTotalSpentForYear(currentYear);
      const totalSaved = getTotalSavedForYear(currentYear);
      const yearlyGoal = getYearlyGoal(currentYear);
      const monthlySpending = data.spending.filter(
        (r) => r.month === currentMonth && r.year === currentYear
      );

      const monthlyTotal = monthlySpending.reduce((sum, r) => sum + r.amount, 0);

      // Calculate category breakdown
      const categoryTotals: Record<string, number> = {};
      monthlySpending.forEach((record) => {
        categoryTotals[record.category] = (categoryTotals[record.category] || 0) + record.amount;
      });

      const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

      let analysisText = "";

      if (monthlySpending.length === 0) {
        analysisText = `You haven't recorded any spending this month yet. Start tracking your expenses to get personalized insights!`;
      } else {
        const dailyAvg = monthlyTotal / currentDay;
        const projectedMonthly = dailyAvg * daysInMonth;
        const recommendedDaily = yearlyGoal
          ? (yearlyGoal - totalSaved) / (365 - Math.floor((Date.now() - new Date(currentYear, 0, 1).getTime()) / (1000 * 60 * 60 * 24)))
          : dailyAvg * 0.8;

        analysisText = `📊 **Monthly Analysis**\n\n`;
        analysisText += `You've spent **₱${monthlyTotal.toLocaleString("en-PH", { minimumFractionDigits: 2 })}** this month so far.\n\n`;

        if (topCategory) {
          analysisText += `Your biggest spending category is **${topCategory[0]}** at ₱${topCategory[1].toLocaleString("en-PH", { minimumFractionDigits: 2 })}.\n\n`;
        }

        analysisText += `💡 **Recommendation**: Try to keep daily spending under **₱${Math.round(recommendedDaily).toLocaleString()}** for the remaining ${daysRemaining} days this month.`;

        if (yearlyGoal && totalSaved < yearlyGoal) {
          const monthsRemaining = 12 - currentMonth;
          const neededPerMonth = (yearlyGoal - totalSaved) / monthsRemaining;
          analysisText += `\n\n🎯 To reach your yearly goal, save at least **₱${Math.round(neededPerMonth).toLocaleString()}** per month.`;
        }
      }

      setAnalysis(analysisText);
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-500" />
          <h2 className="text-lg font-semibold text-gray-800">AI Budget Analysis</h2>
        </div>
        <button
          onClick={analyzeSpending}
          disabled={isAnalyzing}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isAnalyzing ? "animate-spin" : ""}`} />
          Analyze
        </button>
      </div>

      <div className="min-h-[100px] flex items-center justify-center">
        {analysis ? (
          <div className="w-full text-gray-600 text-sm whitespace-pre-line">
            {analysis}
          </div>
        ) : (
          <div className="text-center text-gray-400">
            <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">
              Click &quot;Analyze&quot; to get personalized insights about your spending habits and a
              recommended daily budget.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
