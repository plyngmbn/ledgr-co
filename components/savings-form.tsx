"use client";

import { useState, useEffect } from "react";
import { PiggyBank } from "lucide-react";
import { useBudget } from "@/lib/budget-context";
import { MONTHS } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SavingsFormProps {
  selectedMonth: number;
  selectedYear: number;
}

export function SavingsForm({ selectedMonth, selectedYear }: SavingsFormProps) {
  const [amount, setAmount] = useState("");
  const { setMonthlySavings, getMonthlySavingsAmount } = useBudget();

  const currentSavings = getMonthlySavingsAmount(selectedMonth, selectedYear);

  useEffect(() => {
    if (currentSavings > 0) {
      setAmount(currentSavings.toString());
    } else {
      setAmount("");
    }
  }, [currentSavings, selectedMonth, selectedYear]);

  const handleSubmit = () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value < 0) return;

    setMonthlySavings({
      month: selectedMonth,
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

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100">
      <div className="flex items-center gap-2 mb-4">
        <PiggyBank className="w-5 h-5 text-emerald-500" />
        <h3 className="text-base font-semibold text-gray-800">
          Monthly Savings - {MONTHS[selectedMonth]} {selectedYear}
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1.5">
            How much did you save this month?
          </label>
          <Input
            type="number"
            placeholder="0.00"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-white"
          />
          <p className="text-xs text-gray-500 mt-1.5">
            Enter the amount you saved in {MONTHS[selectedMonth]} {selectedYear}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Current saved amount:</p>
            <p className="text-lg font-bold text-emerald-600">
              {formatCurrency(currentSavings)}
            </p>
          </div>
          <Button
            onClick={handleSubmit}
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
