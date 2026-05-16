"use client";

import { useState, useEffect } from "react";
import { Sparkles, RefreshCw, Target, TrendingDown, Lightbulb } from "lucide-react";
import { supabase } from "@/lib/supabase-client"; // Import Supabase

export function AIAnalysis() {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Local state to store fetched cloud data
  const [cloudData, setCloudData] = useState<{
    totalSpent: number;
    totalSaved: number;
    yearlyGoal: number | null;
    topCategory: [string, number] | null;
  } | null>(null);

  const currentYear = new Date().getFullYear();
  const today = new Date();
  
  // Calculate day of the year logic
  const start = new Date(currentYear, 0, 0);
  const diff = today.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const daysRemainingInYear = 365 - dayOfYear;

  // 1. Fetch data from Supabase when component mounts
  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch Records, Savings, and Goals in parallel
      const [recordsRes, savingsRes, goalRes] = await Promise.all([
        supabase.from("records").select("amount, category").eq("year", currentYear),
        supabase.from("savings").select("amount").eq("year", currentYear),
        supabase.from("goals").select("target_amount").eq("year", currentYear).single()
      ]);

      const records = recordsRes.data || [];
      const totalSpent = records.reduce((sum, r) => sum + r.amount, 0);
      const totalSaved = savingsRes.data?.reduce((sum, s) => sum + s.amount, 0) || 0;

      // Find top category
      const categoryMap: Record<string, number> = {};
      records.forEach(r => categoryMap[r.category] = (categoryMap[r.category] || 0) + r.amount);
      const topCat = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0] || null;

      setCloudData({
        totalSpent,
        totalSaved,
        yearlyGoal: goalRes.data?.target_amount || null,
        topCategory: topCat as [string, number] | null
      });
    };

    fetchStats();
  }, [currentYear]);

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
    if (!cloudData) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      const { totalSpent, totalSaved, yearlyGoal, topCategory } = cloudData;

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
            <p className="text-xs text-gray-500">Cloud-synced insights</p>
          </div>
        </div>
        <button
          onClick={analyzeSpending}
          disabled={isAnalyzing || !cloudData}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isAnalyzing ? "animate-spin" : ""}`} />
          {isAnalyzing ? "Syncing..." : "Analyze"}
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