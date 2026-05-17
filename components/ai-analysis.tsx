"use client";

import { useState, useEffect } from "react";
import { RefreshCw, BrainCircuit, Rocket, Target, ShoppingBag, Lightbulb } from "lucide-react";
import { supabase } from "@/lib/supabase-client";

export function AIAnalysis() {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [cloudData, setCloudData] = useState<{
    totalSpent: number;
    totalSaved: number;
    yearlyGoal: number | null;
    topCategory: [string, number] | null;
    topDescriptions: [string, number][];
  } | null>(null);

  const currentYear = new Date().getFullYear();
  const today = new Date();
  const daysRemainingInYear = 365 - Math.floor((today.getTime() - new Date(currentYear, 0, 0).getTime()) / 86400000);

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [recordsRes, savingsRes, goalRes] = await Promise.all([
        supabase.from("records").select("amount, category, description").eq("year", currentYear),
        supabase.from("savings").select("amount").eq("year", currentYear),
        supabase.from("goals").select("target_amount").eq("year", currentYear).single()
      ]);

      const records = recordsRes.data || [];
      const totalSpent = records.reduce((sum, r) => sum + r.amount, 0);
      const totalSaved = savingsRes.data?.reduce((sum, s) => sum + s.amount, 0) || 0;

      const categoryMap: Record<string, number> = {};
      const descriptionMap: Record<string, number> = {};

      records.forEach(r => {
        categoryMap[r.category] = (categoryMap[r.category] || 0) + r.amount;
        if (r.description) {
          const cleanDesc = r.description.toLowerCase().trim();
          descriptionMap[cleanDesc] = (descriptionMap[cleanDesc] || 0) + 1;
        }
      });

      const topCat = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0] || null;
      const topDescs = Object.entries(descriptionMap)
        .filter(([_, count]) => count > 1)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      setCloudData({
        totalSpent,
        totalSaved,
        yearlyGoal: goalRes.data?.target_amount || null,
        topCategory: topCat as [string, number] | null,
        topDescriptions: topDescs
      });
    };
    fetchStats();
  }, [currentYear]);

  const analyzeSpending = () => {
    if (!cloudData) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      const { totalSpent, totalSaved, yearlyGoal, topCategory, topDescriptions } = cloudData;

      let text = `### 🧠 Neural Intelligence Report\n\n`;
      
      // 1. HABIT DETECTION (NOW AT THE TOP)
      if (topDescriptions.length > 0) {
        const [desc, count] = topDescriptions[0];
        text += `🕵️ **Habit Detected**: You've logged "**${desc}**" **${count} times** this year.\n`;
        
        if (desc.includes("coffee") || desc.includes("starbucks") || desc.includes("cafe")) {
          text += `💡 **Smart Saving**: If you swap just half of these coffee runs for home-brewed, you could potentially save **₱${(count * 75).toLocaleString()}** annually.\n\n`;
        } else if (desc.includes("grab") || desc.includes("taxi") || desc.includes("angkas")) {
          text += `💡 **Smart Saving**: Transport costs are stacking up. Consider a "Walk Zone" for short trips to lower the fee per trip.\n\n`;
        } else if (desc.includes("food") || desc.includes("delivery") || desc.includes("panda") || desc.includes("grabfood")) {
          text += `💡 **Smart Saving**: Delivery fees are a silent leak. Using "Pickup" instead of "Delivery" would significantly boost your balance.\n\n`;
        } else {
          text += `💡 **Smart Saving**: Since "**${desc}**" is a frequent recurring expense, look into bulk-buying to reduce the cost per use.\n\n`;
        }
      }

      // 2. ANNUAL OVERVIEW
      text += `📊 **Annual Overview**: You've spent a total of **₱${totalSpent.toLocaleString()}** this year. `;
      if (topCategory) {
        text += `Your #1 expense category is **${topCategory[0]}**, making up **₱${topCategory[1].toLocaleString()}** of your total spending.\n\n`;
      }

      // 3. GOAL PROGRESS
      if (yearlyGoal) {
        const progress = Math.min(Math.round((totalSaved / yearlyGoal) * 100), 100);
        text += `🎯 **Goal Progress**: You are **${progress}%** of the way to your **₱${yearlyGoal.toLocaleString()}** goal. `;
        
        if (totalSaved < yearlyGoal) {
          const dailyRequired = (yearlyGoal - totalSaved) / daysRemainingInYear;
          text += `To hit your target, save an average of **₱${Math.round(dailyRequired).toLocaleString()}** every day.\n\n`;
        } else {
          text += `🎊 **Legendary!** You've already hit your yearly goal. Anything saved now is pure bonus!\n\n`;
        }
      } else {
        text += `📌 **Tip**: Set a **Yearly Goal** in the Records tab so I can give you more accurate tracking!\n\n`;
      }

      text += `✨ **AI Verdict**: Your spending is driven by recurring habits. Tightening these small loops will have the biggest impact on your wealth build.`;

      setAnalysis(text);
      setIsAnalyzing(false);
    }, 1800);
  };

  const renderRichText = (text: string) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("### ")) return <h3 key={i} className="text-emerald-500 font-bold text-lg mb-4">{line.replace("### ", "")}</h3>;
      
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <div key={i} className={line === "" ? "h-2" : "flex items-start gap-2 mb-2 text-gray-600 dark:text-gray-400 text-sm leading-relaxed"}>
          <span>
            {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-gray-900 dark:text-gray-100 font-bold">{part}</strong> : part)}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl transition-all">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl">
            <BrainCircuit className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">AI Intelligence</h2>
            <p className="text-xs text-gray-500 font-medium tracking-tight">Pattern recognition active</p>
          </div>
        </div>
        <button
          onClick={analyzeSpending}
          disabled={isAnalyzing || !cloudData}
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-emerald-500 text-white dark:text-black rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-lg shadow-emerald-500/10"
        >
          <RefreshCw className={`w-4 h-4 ${isAnalyzing ? "animate-spin" : ""}`} />
          {isAnalyzing ? "Scanning..." : "Analyze Patterns"}
        </button>
      </div>

      <div className="min-h-[160px] bg-gray-50/50 dark:bg-gray-950/50 rounded-2xl p-6 border border-dashed border-gray-200 dark:border-gray-800">
        {analysis ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {renderRichText(analysis)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
             <div className="flex gap-4 mb-4 opacity-20">
               <ShoppingBag className="w-8 h-8" />
               <Target className="w-8 h-8" />
               <Lightbulb className="w-8 h-8" />
            </div>
            <p className="text-gray-500 text-sm max-w-xs mx-auto italic">
              Ready to find the "leaks"? Tap analyze to scan your descriptions for recurring habits.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}