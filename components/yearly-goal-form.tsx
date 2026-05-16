"use client";

import { useState, useEffect } from "react";
import { Target } from "lucide-react";
import { supabase } from "@/lib/supabase-client"; // Import the cloud client
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface YearlyGoalFormProps {
  selectedYear: number;
}

export function YearlyGoalForm({ selectedYear }: YearlyGoalFormProps) {
  const [amount, setAmount] = useState("");
  const [currentGoal, setCurrentGoal] = useState<number | null>(null);
  const [totalSaved, setTotalSaved] = useState(0);
  const [loading, setLoading] = useState(false);

  // 1. Fetch the goal and total savings from the cloud
  const fetchGoalData = async () => {
    // Fetch the goal
    const { data: goalData } = await supabase
      .from("goals")
      .select("target_amount")
      .eq("year", selectedYear)
      .single();

    // Fetch all savings for the year to calculate progress
    const { data: savingsData } = await supabase
      .from("savings")
      .select("amount")
      .eq("year", selectedYear);

    if (goalData) {
      setCurrentGoal(goalData.target_amount);
      setAmount(goalData.target_amount.toString());
    } else {
      setCurrentGoal(null);
      setAmount("");
    }

    if (savingsData) {
      const total = savingsData.reduce((sum, item) => sum + item.amount, 0);
      setTotalSaved(total);
    }
  };

  useEffect(() => {
    fetchGoalData();
  }, [selectedYear]);

  // 2. The UPSERT: Save or Update the goal in Supabase
  const handleSubmit = async () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value < 0) return;

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Please log in to sync your yearly goal!");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("goals").upsert(
      {
        year: selectedYear,
        target_amount: value,
        user_id: user.id,
      },
      { onConflict: "user_id,year" }
    );

    if (error) {
      console.error("Error syncing goal:", error.message);
      alert("Failed to sync goal.");
    } else {
      setCurrentGoal(value);
      alert("Goal synced! 🚀");
    }
    setLoading(false);
  };

  const formatCurrency = (value: number) => {
    return `₱${value.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const progress = currentGoal && currentGoal > 0 ? (totalSaved / currentGoal) * 100 : 0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-emerald-500" />
        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
          Yearly Savings Goal - {selectedYear}
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">
            Set your savings goal for {selectedYear}
          </label>
          <Input
            type="number"
            placeholder="e.g., 100000"
            min="0"
            step="1000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-emerald-500"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading || !amount}
          className="w-full bg-[#6ee7b7] hover:bg-[#52d3a2] text-[#065f46] font-semibold"
        >
          {loading ? "Syncing..." : "Set Goal"}
        </Button>

        {currentGoal !== null ? (
          <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Progress</span>
              <span className="font-bold text-gray-800 dark:text-gray-100">
                {formatCurrency(totalSaved)} / {formatCurrency(currentGoal)}
              </span>
            </div>
            
            <div className="h-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center font-medium">
              {progress >= 100
                ? "🎉 Goal achieved!"
                : `${progress.toFixed(1)}% of your goal`}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center">
            Set a yearly goal to start tracking progress.
          </p>
        )}
      </div>
    </div>
  );
}