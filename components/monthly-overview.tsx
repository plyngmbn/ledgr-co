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

    return {
      month,
      index,
      spending,
      savings: savings?.amount || 0,
    };
  });

  // Only past months (excluding current)
  const pastMonths = monthlyData.filter(
    (m) => m.index < currentMonth && (m.spending > 0 || m.savings > 0)
  );

  const avgSpending = pastMonths.length > 0
    ? pastMonths.reduce((sum, m) => sum + m.spending, 0) / pastMonths.length
    : 0;

  const avgSavings = pastMonths.length > 0
    ? pastMonths.reduce((sum, m) => sum + m.savings, 0) / pastMonths.length
    : 0;

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
        <div className="space-y-2">
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-400 rounded" />
              <span>Spending</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-emerald-400 rounded" />
              <span>Savings</span>
            </div>
          </div>

          {monthlyData.map((m) => {
            if (m.spending === 0 && m.savings === 0) return null;
            const isCurrentMonth = m.index === currentMonth;
            return (
              <div key={m.index} className={`space-y-1 ${isCurrentMonth ? "opacity-60" : ""}`}>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400 w-12">
                    {m.month.slice(0, 3)}
                    {isCurrentMonth && <span className="ml-1 text-emerald-500">•</span>}
                  </span>
                  <div className="flex gap-4">
                    <span className="text-red-500">{formatCurrency(m.spending)}</span>
                    <span className="text-emerald-500">{formatCurrency(m.savings)}</span>
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

          {/* Average of previous months */}
          {pastMonths.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                Avg of previous months
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Average</span>
                <div className="flex gap-4">
                  <span className="text-red-400 font-medium">{formatCurrency(avgSpending)}</span>
                  <span className="text-emerald-400 font-medium">{formatCurrency(avgSavings)}</span>
                </div>
              </div>
              <div className="flex gap-1 mt-1">
                <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-300 rounded-full transition-all duration-500"
                    style={{ width: `${(avgSpending / maxValue) * 100}%` }}
                  />
                </div>
                <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-300 rounded-full transition-all duration-500"
                    style={{ width: `${(avgSavings / maxValue) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
