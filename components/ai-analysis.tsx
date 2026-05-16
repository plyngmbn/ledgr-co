"use client";

import { useState, useEffect } from "react";
import { Sparkles, RefreshCw, Target, TrendingDown, Lightbulb, BrainCircuit, Rocket, AlertCircle, BarChart3 } from "lucide-react";
import { supabase } from "@/lib/supabase-client";

export function AIAnalysis() {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cloudData, setCloudData] = useState<{
    totalSpent: number;
    totalSaved: number;
    yearlyGoal: number | null;
    topCategory: [string, number] | null;
    avgMonthlySpend: number;
  } | null>(null);

  const currentYear = new Date().getFullYear();
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(currentYear, 0, 0).getTime()) / 86400000);
  const daysRemaining = 365 - dayOfYear;

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [recordsRes, savingsRes, goalRes] = await Promise.all([
        supabase.from("records").select("amount, category").eq("year", currentYear),
        supabase.from("savings").select("amount").eq("year", currentYear),
        supabase.from("goals").select("target_amount").eq("year", currentYear).single()
      ]);

      const records = recordsRes.data || [];
      const totalSpent = records.reduce((sum, r) => sum + r.amount, 0);
      const totalSaved = savingsRes.data?.reduce((sum, s) => sum + s.amount, 0) || 0;
      const currentMonth = today.getMonth() + 1;
      const avgMonthlySpend = totalSpent / currentMonth;

      const categoryMap: Record<string, number> = {};
      records.forEach(r => categoryMap[r.category] = (categoryMap[r.category] || 0) + r.amount);
      const topCat = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0] || null;

      setCloudData({
        totalSpent,
        totalSaved,
        yearlyGoal: goalRes.data?.target_amount || null,
        topCategory: topCat as [string, number] | null,
        avgMonthlySpend
      });
    };
    fetchStats();
  }, [currentYear]);

  const analyzeSpending = () => {
    if (!cloudData) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      const { totalSpent, totalSaved, yearlyGoal, topCategory, avgMonthlySpend } = cloudData;
      const projectedYearly = avgMonthlySpend * 12;
      const percentOfYearElapsed = (dayOfYear / 365) * 100;

      let text = `### 🧠 AI Intelligence Report: ${currentYear}\n\n`;
      
      // Section: The Financial Breakdown
      text += `#### 📊 The Breakdown\n`;
      text += `Your total outflow is **₱${totalSpent.toLocaleString()}**. At your current "burn rate" of **₱${Math.round(avgMonthlySpend).toLocaleString()}/month**, you are projected to end the year at **₱${Math.round(projectedYearly).toLocaleString()}**.\n\n`;

      if (topCategory) {
        const catPercentage = Math.round((topCategory[1] / totalSpent) * 100);
        text += `⚠️ **Concentration Risk**: **${topCategory[0]}** accounts for **${catPercentage}%** of all spending. Reducing this by just 10% would save you **₱${Math.round(topCategory[1] * 0.1).toLocaleString()}** by December.\n\n`;
      }

      // Section: Goal Trajectory
      text += `#### 🎯 Goal Trajectory\n`;
      if (yearlyGoal) {
        const progress = Math.min(Math.round((totalSaved / yearlyGoal) * 100), 100);
        const status = progress < percentOfYearElapsed ? "🔴 Behind Schedule" : "🟢 On Track";
        
        text += `${status}: You've secured **${progress}%** of your **₱${yearlyGoal.toLocaleString()}** target. \n`;
        
        if (totalSaved < yearlyGoal) {
          const dailyRequired = (yearlyGoal - totalSaved) / daysRemaining;
          text += `🚀 **Action Required**: Allocate **₱${Math.round(dailyRequired).toLocaleString()}** per day to bridge the gap.\n\n`;
        }
      } else {
        text += `💡 **Optimization Tip**: I noticed you haven't set a yearly savings goal. Data-driven users are 42% more likely to save when they have a defined target.\n\n`;
      }

      // Section: Smart Recommendation
      const tips = [
        "**Strategic Wait**: Use a 48-hour cool-down for any item over ₱1,000.",
        "**Micro-Savings**: Round up every purchase to the nearest ₱100 and sweep the difference into savings.",
        "**Fixed Cost Audit**: Your 'ghost' subscriptions may be costing you more than you think."
      ];
      text += `#### ✨ Smart Action\n${tips[Math.floor(Math.random() * tips.length)]}`;

      setAnalysis(text);
      setIsAnalyzing(false);
    }, 2000);
  };

  const renderRichText = (text: string) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("### ")) return <h3 key={i} className="text-emerald-500 font-bold text-lg mb-2 mt-4">{line.replace("### ", "")}</h3>;
      if (line.startsWith("#### ")) return <h4 key={i} className="text-gray-900 dark:text-gray-100 font-bold mb-2 flex items-center gap-2">{line.replace("#### ", "")}</h4>;
      
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={i} className="mb-2 text-gray-600 dark:text-gray-400">
          {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-gray-800 dark:text-gray-200">{part}</strong> : part)}
        </p>
      );
    });
  };

  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl transition-all">
      {/* Decorative AI Background Element */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl" />
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl shadow-lg shadow-emerald-500/20">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">Financial Intelligence</h2>
            <p className="text-xs font-medium text-emerald-500 uppercase tracking-widest">v2.0 Neural Engine</p>
          </div>
        </div>

        <button
          onClick={analyzeSpending}
          disabled={isAnalyzing || !cloudData}
          className="group relative flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-emerald-500 text-white dark:text-black rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 overflow-hidden"
        >
          <RefreshCw className={`w-4 h-4 ${isAnalyzing ? "animate-spin" : ""}`} />
          {isAnalyzing ? "Processing..." : "Generate Insights"}
        </button>
      </div>

      <div className="relative min-h-[200px] bg-gray-50/50 dark:bg-gray-950/50 rounded-2xl p-6 border border-dashed border-gray-200 dark:border-gray-800">
        {analysis ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {renderRichText(analysis)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="flex gap-6 mb-6">
               <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 animate-bounce transition-all delay-0">
                 <Rocket className="w-8 h-8 text-gray-300" />
               </div>
               <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 animate-bounce transition-all delay-150">
                 <BarChart3 className="w-8 h-8 text-gray-300" />
               </div>
               <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 animate-bounce transition-all delay-300">
                 <AlertCircle className="w-8 h-8 text-gray-300" />
               </div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
              My engine is fueled and ready. Tap the button to decode your {currentYear} spending patterns and unlock predictive savings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}