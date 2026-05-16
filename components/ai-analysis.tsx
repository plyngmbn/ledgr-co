"use client";

import { useState } from "react";
import { Sparkles, RefreshCw, Target, TrendingDown, Lightbulb } from "lucide-react";
import { useBudget } from "@/lib/budget-context";

export function AIAnalysis() {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { data, getTotalSpentForYear, getTotalSavedForYear, getYearlyGoal } = useBudget();

  const currentYear = new Date().getFullYear();
  const today = new Date();
  
  // Calculate day of the year (1-365)
  const start = new Date(currentYear, 0, 0);
  const diff = today.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const daysRemainingInYear = 365 - dayOfYear;

  const renderMarkdown = (text: string) => {
    return text.split("\n").map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={i} className={line === "" ? "h-2" : "flex items-start gap-2 mb-1"}>
          <span>
          {parts.map((part, j) =>
            j % 2 === 1 ? (
              <strong key={j} className="text-gray-900 dark:text-gray-100 font-bold">
                {part}
              </strong>
            ) : (
              part
            )
          )}
          </span>
        </p>
      );
    });
  };

  const analyzeSpending = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      const totalSpent = getTotalSpentForYear(currentYear);
      const totalSaved = getTotalSavedForYear(currentYear);
      const yearlyGoal = getYearlyGoal(currentYear);
      
      // Annual Category Totals
      const categoryTotals: Record<string, number> = {};
      data.spending
        .filter((r) => r.year === currentYear)
        .forEach((record) => {
          categoryTotals[record.category] = (categoryTotals[record.category] || 0) + record.amount;
        });

      const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

      // Random Tips Pool
      const tips = [
        "Consider the **50/30/20 rule**: 50% for needs, 30% for wants, and 20% for savings.",
        "Review your **subscriptions**. Small monthly fees add up to thousands annually.",
        "Try a **'No-Spend Weekend'** once a month to boost your annual savings rate.",
        "Before an impulse buy, wait **48 hours**. If you still want it, then consider it.",
        "Automate your savings. If the money is gone before you see it, you won't spend it."
      ];
      const randomTip = tips[Math.floor(Math.random() * tips.length)];

      let analysisText = `🗓️ **Annual Overview (${currentYear})**\n\n`;
      
      analysisText += `You've spent a total of **₱${totalSpent.toLocaleString()}** this year. `;
      
      if (topCategory) {
        analysisText += `Your #1 expense is **${topCategory[0]}**, making up **₱${topCategory[1].toLocaleString()}** of your total spending.\n\n`;
      }

      if (yearlyGoal) {
        const percentReached = Math.min(Math.round((totalSaved / yearlyGoal) * 100), 100);
        analysisText += `🎯 **Goal Progress**: You are **${percentReached}%** of the way to your **₱${yearlyGoal.toLocaleString()}** goal.\n\n`;

        if (totalSaved < yearlyGoal) {
          const remainingToSave = yearlyGoal - totalSaved;
          const dailyRequired = remainingToSave / daysRemainingInYear;
          analysisText += `💡 **Recommendation**: To hit your target, you need to save an average of **₱${Math.round(dailyRequired).toLocaleString()}** every day for the remaining ${daysRemainingInYear} days of the year.\n\n`;
        } else {
          analysisText += `🎊 **Legendary!** You've already hit your yearly goal. Anything saved now is pure bonus! \n\n`;
        }
      } else {
        analysisText += `📌 **Tip**: Set a **Yearly Goal** in the Records tab so I can give you more accurate tracking!\n\n`;
      }

      analysisText += `✨ **Pro Tip**: ${randomTip}`;

      setAnalysis(analysisText);
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm transition-all">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
            <Sparkles className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 leading-tight">AI Annual Analysis</h2>
            <p className="text-xs text-gray-500">Year-to-date insights</p>
          </div>
        </div>
        <button
          onClick={analyzeSpending}
          disabled={isAnalyzing}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isAnalyzing ? "animate-spin" : ""}`} />
          Analyze
        </button>
      </div>

      <div className="min-h-[120px]">
        {analysis ? (
          <div className="w-full text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            {renderMarkdown(analysis)}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-400 dark:text-gray-600">
            <div className="flex justify-center gap-4 mb-4">
               <Target className="w-8 h-8 opacity-20" />
               <TrendingDown className="w-8 h-8 opacity-20" />
               <Lightbulb className="w-8 h-8 opacity-20" />
            </div>
            <p className="text-sm max-w-xs mx-auto">
              Ready for the big picture? Let&apos;s see how your {currentYear} spending compares to your goals.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}