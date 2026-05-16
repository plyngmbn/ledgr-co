"use client";

import { useBudget } from "@/lib/budget-context";
import { MONTHS } from "@/lib/types";

export function MonthlyOverview() {
  const { data } = useBudget();

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const monthlyData = MONTHS.map((month, index) => {
    const spending = data.spending
      .filter((r) => r.month === index && r.year === currentYear)
      .reduce((sum, r) => sum + r.amount, 0);

    const savings = data.monthlySavings.find(
      (s) => s.month === index && s.year === currentYear
    );

    // Average daily spending for that month
    const daysInMonth = new Date(currentYear, index + 1, 0).getDate();
    const avgPerDay = spending > 0 ? spending / daysInMonth : 0;

    return {
      month,
      index,
      spending,
      savings: savings?.amount || 0,
      avgPerDay,
    };
  });

  const hasData = monthlyData.some((m) => m.spending > 0 || m.savings > 0);
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
            if (m.spending === 0 && m.savings === 0) return null;
            const isCurrentMonth = m.index === currentMonth;
            return (
              <div key={m.index} className={`space-y-1 ${isCurrentMonth ? "opacity-70" : ""}`}>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400 w-12">
                    {m.month.slice(0, 3)}
                    {isCurrentMonth && <span className="ml-1 text-emerald-500">•</span>}
                  </span>
                  <div className="flex gap-3">
                    <span className="text-red-500">{formatCurrency(m.spending)}</span>
                    <span className="text-emerald-500">{formatCurrency(m.savings)}</span>
                    {m.avgPerDay > 0 && (
                      <span className="text-orange-400">~{formatCurrency(m.avgPerDay)}/day</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-400 rounded-full transition-all duration-500"
                      style={{ width: `${(m.spending / maxValue) * 100}%` }}
                    />
                  </div>
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