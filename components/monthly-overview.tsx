"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import { MONTHS } from "@/lib/types";

interface MonthlyStats {
  month: string;
  index: number;
  spending: number;
  savings: number;
  average: number;
}

export function MonthlyOverview() {
  const [monthlyData, setMonthlyData] = useState<MonthlyStats[]>([]);
  const [loading, setLoading] = useState(true);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  useEffect(() => {
    const fetchMonthlyStats = async () => {
      // 1. Fetch both records and savings for the whole year
      const [recordsRes, savingsRes] = await Promise.all([
        supabase.from("records").select("amount, month, date").eq("year", currentYear),
        supabase.from("savings").select("amount, month").eq("year", currentYear),
      ]);

      const records = recordsRes.data || [];
      const savingsList = savingsRes.data || [];

      // 2. Map across all months to build the statistics
      const stats = MONTHS.map((month, index) => {
        const monthRecords = records.filter((r) => r.month === index);
        const spending = monthRecords.reduce((sum, r) => sum + r.amount, 0);
        
        const savingsRecord = savingsList.find((s) => s.month === index);
        const savings = savingsRecord?.amount || 0;

        // Calculate unique days logged for this specific month
        const uniqueDaysLogged = new Set(monthRecords.map((r) => r.date)).size;
        const average = uniqueDaysLogged > 0 ? spending / uniqueDaysLogged : 0;

        return {
          month,
          index,
          spending,
          savings,
          average,
        };
      });

      setMonthlyData(stats);
      setLoading(false);
    };

    fetchMonthlyStats();
  }, [currentYear]);

  const hasData = monthlyData.some((m) => m.spending > 0 || m.savings > 0);
  
  // Calculate max value for the progress bars
  const maxValue = Math.max(
    ...monthlyData.map((m) => Math.max(m.spending, m.savings)),
    1
  );

  const formatCurrency = (amount: number) => {
    return `₱${amount.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  if (loading) return <div className="p-6 text-center text-gray-400">Syncing monthly trends...</div>;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Monthly Overview</h2>

      {!hasData ? (
        <p className="text-gray-400 text-sm">No data yet. Start by adding records!</p>
      ) : (
        <div className="space-y-3">
          {/* Legend */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-400 rounded" />
              <span>Spending</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-emerald-400 rounded" />
              <span>Savings</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-orange-300 rounded" />
              <span>Avg/day</span>
            </div>
          </div>

          {monthlyData.map((m) => {
            // Hide months with absolutely no activity
            if (m.spending === 0 && m.savings === 0) return null;
            
            const isCurrentMonth = m.index === currentMonth;
            
            return (
              <div key={m.index} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400 w-12 font-medium">
                    {m.month.slice(0, 3)}
                    {isCurrentMonth && <span className="ml-1 text-emerald-500 animate-pulse">•</span>}
                  </span>
                  
                  <div className="flex gap-3 font-medium">
                    <span className="text-red-500">{formatCurrency(m.spending)}</span>
                    <span className="text-emerald-500">{formatCurrency(m.savings)}</span>
                    {m.average > 0 && (
                      <span className="text-orange-400">
                        ~{formatCurrency(m.average)}/day
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-1">
                  {/* Spending Bar */}
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-400 rounded-full transition-all duration-500"
                      style={{ width: `${(m.spending / maxValue) * 100}%` }}
                    />
                  </div>
                  {/* Savings Bar */}
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${(m.savings / maxValue) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}