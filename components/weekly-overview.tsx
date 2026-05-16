"use client";

import { useBudget } from "@/lib/budget-context";

export function WeeklyOverview() {
  const { getSpendingForMonth } = useBudget();

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const monthlySpending = getSpendingForMonth(currentMonth, currentYear);

  // Group by week
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const weeks: { start: number; end: number; total: number }[] = [];

  for (let i = 1; i <= daysInMonth; i += 7) {
    const weekEnd = Math.min(i + 6, daysInMonth);
    const weekSpending = monthlySpending
      .filter((r) => r.date >= i && r.date <= weekEnd)
      .reduce((sum, r) => sum + r.amount, 0);
    weeks.push({ start: i, end: weekEnd, total: weekSpending });
  }

  const maxWeekSpending = Math.max(...weeks.map((w) => w.total), 1);

  const formatCurrency = (amount: number) => {
    return `₱${amount.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Weekly Overview</h2>

      {monthlySpending.length === 0 ? (
        <p className="text-gray-400 text-sm">No data for this month yet.</p>
      ) : (
        <div className="space-y-3">
          {weeks.map((week, index) => (
            <div key={index} className="flex items-center gap-4">
              <span className="text-xs text-gray-500 w-20">
                Day {week.start}-{week.end}
              </span>
              <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${(week.total / maxWeekSpending) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700 w-24 text-right">
                {formatCurrency(week.total)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
