"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { Header } from "@/components/header";
import { Mascot } from "@/components/mascot";
import { StatCards } from "@/components/stat-cards";
import { AIAnalysis } from "@/components/ai-analysis";
import { ExpensesByCategory } from "@/components/expenses-by-category";
import { WeeklyOverview } from "@/components/weekly-overview";
import { MonthlyOverview } from "@/components/monthly-overview";
import { DailyTip } from "@/components/daily-tip";
import { StreakCard } from "@/components/streak-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getUser();
  }, []);

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || "Bestie";

  return (
    <div className="min-h-screen bg-[#f8faf9] dark:bg-gray-950">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* --- CENTERED WELCOME CARD START --- */}
        <div className="flex justify-center mb-10">
          <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-emerald-900/5 p-10 flex flex-col items-center text-center">
            
            {/* Mascot in the center */}
            <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl">
              <Mascot className="w-20 h-20" />
            </div>

            {/* Personalized Welcome */}
            <h1 className="text-3xl font-bold text-[#4A9B7F] font-[family-name:var(--font-pixel)] mb-2">
              Welcome to Ledgr, {firstName}!
            </h1>
            <p className="text-gray-500 mb-8 font-medium italic">
              Bestie for your broke moments ✨
            </p>

            {/* Centered Add Record Button (The Big Square) */}
            <Link href="/records">
              <Button className="w-64 h-64 rounded-3xl bg-[#7DC9A6]/10 hover:bg-[#7DC9A6]/20 border-2 border-dashed border-[#4A9B7F] flex flex-col gap-4 transition-all group shadow-none">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm group-hover:scale-110 transition-transform border border-emerald-50">
                  <Plus className="w-8 h-8 text-[#4A9B7F]" />
                </div>
                <span className="text-[#4A9B7F] font-bold text-lg leading-tight">
                  Add Your <br/> First Record!
                </span>
              </Button>
            </Link>
          </div>
        </div>
        {/* --- CENTERED WELCOME CARD END --- */}

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