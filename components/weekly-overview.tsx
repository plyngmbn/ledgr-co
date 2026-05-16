"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";

export function WeeklyOverview() {
  const [weeks, setWeeks] = useState<{ start: number; end: number; total: number }[]>([]);
  const [hasData, setHasData] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  useEffect(() => {
    const fetchWeeklyData = async () => {
      const { data: records, error } = await supabase
        .from("records")
        .select("amount, date")
        .eq("month", currentMonth)
        .eq("year", currentYear);

      if (records && records.length > 0) {
        setHasData(true);
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const calculatedWeeks: { start: number; end: number; total: number }[] = [];

        for (let i = 1; i <= daysInMonth; i += 7) {
          const weekEnd = Math.min(i + 6, daysInMonth);
          const weekSpending = records
            .filter((r) => r.date >= i && r.date <= weekEnd)
            .reduce((sum, r) => sum + r.amount, 0);
          
          calculatedWeeks.push({ start: i, end: weekEnd, total: weekSpending });
        }
        setWeeks(calculatedWeeks);
      } else {
        setHasData(false);
      }
      setLoading(false);
    };

    fetchWeeklyData();
  }, [currentMonth, currentYear]);

  const maxWeekSpending = Math.max(...weeks.map((w) => w.total), 1);

  const formatCurrency = (amount: number) => {
    return `₱${amount.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  if (loading) return <div className="p-6 text-center text-gray-400">Loading weekly breakdown...</div>;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Weekly Overview</h2>

      {!hasData ? (
        <p className="text-gray-400 text-sm">No data for this month yet.</p>
      ) : (
        <div className="space-y-3">
          {weeks.map((week, index) => (
            <div key={index} className="flex items-center gap-4">
              <span className="text-xs text-gray-500 dark:text-gray-400 w-20">
                Day {week.start}-{week.end}
              </span>
              <div className="flex-1 h-6 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${(week.total / maxWeekSpending) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-24 text-right">
                {formatCurrency(week.total)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
