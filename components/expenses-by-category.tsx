"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { CATEGORIES } from "@/lib/types";
import { 
  Utensils, 
  Car, 
  ShoppingBag, 
  Film, 
  Receipt, 
  Heart, 
  GraduationCap, 
  MoreHorizontal 
} from "lucide-react";

const CATEGORY_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string; hex: string }> = {
  "Food & Dining": { icon: Utensils, color: "text-orange-500", bg: "bg-orange-100", hex: "#f97316" },
  "Transportation": { icon: Car, color: "text-blue-500", bg: "bg-blue-100", hex: "#3b82f6" },
  "Shopping": { icon: ShoppingBag, color: "text-pink-500", bg: "bg-pink-100", hex: "#ec4899" },
  "Entertainment": { icon: Film, color: "text-purple-500", bg: "bg-purple-100", hex: "#a855f7" },
  "Bills & Utilities": { icon: Receipt, color: "text-yellow-600", bg: "bg-yellow-100", hex: "#ca8a04" },
  "Healthcare": { icon: Heart, color: "text-red-500", bg: "bg-red-100", hex: "#ef4444" },
  "Education": { icon: GraduationCap, color: "text-indigo-500", bg: "bg-indigo-100", hex: "#6366f1" },
  "Other": { icon: MoreHorizontal, color: "text-gray-500", bg: "bg-gray-100", hex: "#6b7280" },
};

export function ExpensesByCategory() {
  const [categoryTotals, setCategoryTotals] = useState<{ category: string; total: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchCategoryStats = async () => {
      const { data: records, error } = await supabase
        .from("records")
        .select("category, amount")
        .eq("year", currentYear);

      if (records) {
        // Map through defined CATEGORIES to calculate totals from fetched records
        const totals = CATEGORIES.map((category) => {
          const total = records
            .filter((r) => r.category === category)
            .reduce((sum, r) => sum + r.amount, 0);
          return { category, total };
        }).filter((c) => c.total > 0);

        setCategoryTotals(totals.sort((a, b) => b.total - a.total));
      }
      setLoading(false);
    };

    fetchCategoryStats();
  }, [currentYear]);

  const grandTotal = categoryTotals.reduce((sum, c) => sum + c.total, 0);

  const formatCurrency = (amount: number) => {
    return `₱${amount.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  if (loading) return <div className="p-6 text-center text-gray-500">Calculating your habits...</div>;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Expenses by Category</h3>
      
      {categoryTotals.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>No expenses recorded this year</p>
          <p className="text-sm mt-1">Add spending records to see breakdown</p>
        </div>
      ) : (
        <div className="space-y-3">
          {categoryTotals.map(({ category, total }) => {
            const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG["Other"];
            const Icon = config.icon;
            const percentage = grandTotal > 0 ? (total / grandTotal) * 100 : 0;
            
            return (
              <div key={category} className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${config.bg}`}>
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                      {category}
                    </span>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                      {formatCurrency(total)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: config.hex
                      }}
                    />
                  </div>
                </div>
                <span className="text-xs text-gray-400 w-10 text-right">
                  {percentage.toFixed(0)}%
                </span>
              </div>
            );
          })}
          
          <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total This Year</span>
            <span className="text-lg font-bold text-gray-800 dark:text-gray-100">{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      )}
    </div>
  );
}