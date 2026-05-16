"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // To redirect if not logged in
import { supabase } from "@/lib/supabase-client"; 
import { Header } from "@/components/header";
import { Mascot } from "@/components/mascot";
import { MonthSelector } from "@/components/month-selector";
import { SpendingForm } from "@/components/spending-form";
import { SavingsForm } from "@/components/savings-form";
import { YearlyGoalForm } from "@/components/yearly-goal-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RecordsPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in when the page loads
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // If no user, send them to login or home
        router.push("/"); 
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  if (loading) return <div className="p-8 text-center">Loading your vault...</div>;

  return (
    <div className="min-h-screen bg-[#f8faf9] dark:bg-gray-950">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center gap-4 mb-8 text-center">
          <Mascot className="w-24 h-24" />
          <div>
            <h1 className="text-3xl font-bold text-[#4A9B7F] font-[family-name:var(--font-pixel)]">Add Records</h1>
            <p className="text-gray-500 font-light text-base">Your future self said thank you, btw.</p>
          </div>
        </div>

        <MonthSelector
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
        />

        <Tabs defaultValue="spending" className="mt-6">
          <TabsList className="w-full bg-emerald-50 p-1 rounded-full dark:bg-gray-900">
            <TabsTrigger
              value="spending"
              className="flex-1 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Spending
            </TabsTrigger>
            <TabsTrigger
              value="savings"
              className="flex-1 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Monthly Savings
            </TabsTrigger>
            <TabsTrigger
              value="goal"
              className="flex-1 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Yearly Goal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="spending" className="mt-6">
            <SpendingForm selectedMonth={selectedMonth} selectedYear={selectedYear} />
          </TabsContent>

          <TabsContent value="savings" className="mt-6">
            <SavingsForm selectedMonth={selectedMonth} selectedYear={selectedYear} />
          </TabsContent>

          <TabsContent value="goal" className="mt-6">
            <YearlyGoalForm selectedYear={selectedYear} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}