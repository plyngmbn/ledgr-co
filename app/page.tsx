"use client";

import { Header } from "@/components/header";
import { Mascot } from "@/components/mascot";
import { StatCards } from "@/components/stat-cards";
import { AIAnalysis } from "@/components/ai-analysis";
import { ExpensesByCategory } from "@/components/expenses-by-category";
import { WeeklyOverview } from "@/components/weekly-overview";
import { MonthlyOverview } from "@/components/monthly-overview";
import { DailyTip } from "@/components/daily-tip";
import { StreakCard } from "@/components/streak-card";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#f8faf9] dark:bg-gray-950">
      <Header />

      {/* FIXED: Added missing <main> tag and centered content structure */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Section - Centered */}
        <div className="flex flex-col items-center justify-center gap-4 mb-12 text-center pt-4">
          <Mascot className="w-24 h-24" /> 
          <div>
            <h1 className="text-3xl font-bold text-[#4A9B7F] font-[family-name:var(--font-pixel)]">
              Welcome to Ledgr!
            </h1>
            <p className="text-gray-500 font-light text-lg">
              Bestie for your broke moments.
            </p>
          </div>
        </div>

        {/* Daily Tip */}
        <div className="mt-6">
          <DailyTip />
        </div>

        {/* Stats */}
        <div className="mt-6">
          <StatCards />
        </div>

        {/* Streak */}
        <div className="mt-4">
          <StreakCard />
        </div>

        {/* AI Analysis */}
        <div className="mt-6">
          <AIAnalysis />
        </div>

        {/* Overviews */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <WeeklyOverview />
          <MonthlyOverview />
        </div>

        {/* Expenses by Category */}
        <div className="mt-6">
          <ExpensesByCategory />
        </div>
      </main>
    </div>
  );
}
