"use client";

import { useState, useEffect } from "react";
import { Target } from "lucide-react";
import { useBudget } from "@/lib/budget-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface YearlyGoalFormProps {
  selectedYear: number;
}

export function YearlyGoalForm({ selectedYear }: YearlyGoalFormProps) {
  const [amount, setAmount] = useState("");
  const { setYearlyGoal, getYearlyGoal, getTotalSavedForYear } = useBudget();

  const currentGoal = getYearlyGoal(selectedYear);
  const totalSaved = getTotalSavedForYear(selectedYear);

  useEffect(() => {
    if (currentGoal !== null) {
      setAmount(currentGoal.toString());
    } else {
      setAmount("");
    }
  }, [currentGoal, selectedYear]);

  const handleSubmit = () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value < 0) return;

    setYearlyGoal({
      year: selectedYear,
      amount: value,
    });
  };

  const formatCurrency = (value: number) => {
    return `₱${value.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const progress = currentGoal && currentGoal > 0 ? (totalSaved / currentGoal) * 100 : 0;

  return (
    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-amber-600" />
        <h3 className="text-base font-semibold text-gray-800">
          Yearly Savings Goal - {selectedYear}
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1.5">
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
            className="bg-white"
          />
          <p className="text-xs text-gray-500 mt-1.5">
            This is your target savings for the entire year
          </p>
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white"
        >
          Set Goal
        </Button>

        {currentGoal !== null ? (
          <div className="mt-4 pt-4 border-t border-amber-200">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-gray-800">
                {formatCurrency(totalSaved)} / {formatCurrency(currentGoal)}
              </span>
            </div>
            <div className="h-3 bg-amber-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {progress >= 100
                ? "🎉 Congratulations! Goal achieved!"
                : `${progress.toFixed(1)}% of your goal`}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center">
            Set a yearly savings goal to track your progress
          </p>
        )}
      </div>
    </div>
  );
}
