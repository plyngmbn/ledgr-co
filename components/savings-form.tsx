"use client";

import { useState, useEffect } from "react";
import { PiggyBank } from "lucide-react";
import { supabase } from "@/lib/supabase-client"; // Direct Supabase connection
import { MONTHS } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SavingsFormProps {
  selectedMonth: number;
  selectedYear: number;
}

export function SavingsForm({ selectedMonth, selectedYear }: SavingsFormProps) {
  const [amount, setAmount] = useState("");
  const [currentSavings, setCurrentSavings] = useState(0);
  const [loading, setLoading] = useState(false);

  // 1. Fetch from Cloud instead of Context
  useEffect(() => {
    const fetchCurrentSavings = async () => {
      const { data, error } = await supabase
        .from("savings")
        .select("amount")
        .eq("month", selectedMonth)
        .eq("year", selectedYear)
        .maybeSingle();

      if (data) {
        setCurrentSavings(data.amount);
        setAmount(data.amount.toString());
      } else {
        setCurrentSavings(0);
        setAmount("");
      }
    };

    fetchCurrentSavings();
  }, [selectedMonth, selectedYear]);

  // 2. Silent Cloud Save
  const handleSubmit = async () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value < 0) return;

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error("User not logged in");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("savings").upsert(
      {
        user_id: user.id,
        month: selectedMonth,
        year: selectedYear,
        amount: value,
      },
      { onConflict: "user_id,month,year" }
    );

    if (!error) {
      setCurrentSavings(value); // Update UI instantly
    } else {
      console.error("Sync failed:", error.message);
    }
    setLoading(false);
  };

  const formatCurrency = (value: number) => {
    return `₱${value.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-2xl p-6 border border-emerald-100 dark:border-emerald-900/50">
      <div className="flex items-center gap-2 mb-4">
        <PiggyBank className="w-5 h-5 text-emerald-500" />
        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
          Monthly Savings - {MONTHS[selectedMonth]} {selectedYear}
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">
            How much did you save this month?
          </label>
          <Input
            type="number"
            placeholder="0.00"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()} // Silent Enter key save
            className="bg-white dark:bg-gray-900"
          />
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
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 rounded-xl font-bold transition-all"
          >
            {loading ? "Syncing..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}