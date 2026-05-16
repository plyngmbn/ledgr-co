"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { BudgetData, SpendingRecord, MonthlySavings, YearlyGoal } from "./types";

interface BudgetContextType {
  data: BudgetData;
  addSpendingRecord: (record: Omit<SpendingRecord, "id">) => void;
  deleteSpendingRecord: (id: string) => void;
  setMonthlySavings: (savings: MonthlySavings) => void;
  setYearlyGoal: (goal: YearlyGoal) => void;
  getSpendingForMonth: (month: number, year: number) => SpendingRecord[];
  getTotalSpentForYear: (year: number) => number;
  getTotalSavedForYear: (year: number) => number;
  getAvgMonthlySavings: () => number;
  getYearlyGoal: (year: number) => number | null;
  getMonthlySavingsAmount: (month: number, year: number) => number;
}

const BudgetContext = createContext<BudgetContextType | null>(null);

const STORAGE_KEY = "trackr-budget-data";

const getInitialData = (): BudgetData => {
  if (typeof window === "undefined") {
    return { spending: [], monthlySavings: [], yearlyGoals: [] };
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return { spending: [], monthlySavings: [], yearlyGoals: [] };
    }
  }
  return { spending: [], monthlySavings: [], yearlyGoals: [] };
};

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<BudgetData>({ spending: [], monthlySavings: [], yearlyGoals: [] });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setData(getInitialData());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, isLoaded]);

  const addSpendingRecord = (record: Omit<SpendingRecord, "id">) => {
    const newRecord: SpendingRecord = {
      ...record,
      id: crypto.randomUUID(),
    };
    setData((prev) => ({
      ...prev,
      spending: [...prev.spending, newRecord],
    }));
  };

  const deleteSpendingRecord = (id: string) => {
    setData((prev) => ({
      ...prev,
      spending: prev.spending.filter((r) => r.id !== id),
    }));
  };

  const setMonthlySavings = (savings: MonthlySavings) => {
    setData((prev) => {
      const existing = prev.monthlySavings.findIndex(
        (s) => s.month === savings.month && s.year === savings.year
      );
      if (existing >= 0) {
        const updated = [...prev.monthlySavings];
        updated[existing] = savings;
        return { ...prev, monthlySavings: updated };
      }
      return { ...prev, monthlySavings: [...prev.monthlySavings, savings] };
    });
  };

  const setYearlyGoal = (goal: YearlyGoal) => {
    setData((prev) => {
      const existing = prev.yearlyGoals.findIndex((g) => g.year === goal.year);
      if (existing >= 0) {
        const updated = [...prev.yearlyGoals];
        updated[existing] = goal;
        return { ...prev, yearlyGoals: updated };
      }
      return { ...prev, yearlyGoals: [...prev.yearlyGoals, goal] };
    });
  };

  const getSpendingForMonth = (month: number, year: number) => {
    return data.spending.filter((r) => r.month === month && r.year === year);
  };

  const getTotalSpentForYear = (year: number) => {
    return data.spending
      .filter((r) => r.year === year)
      .reduce((sum, r) => sum + r.amount, 0);
  };

  const getTotalSavedForYear = (year: number) => {
    return data.monthlySavings
      .filter((s) => s.year === year)
      .reduce((sum, s) => sum + s.amount, 0);
  };

  const getAvgMonthlySavings = () => {
    if (data.monthlySavings.length === 0) return 0;
    const total = data.monthlySavings.reduce((sum, s) => sum + s.amount, 0);
    return total / data.monthlySavings.length;
  };

  const getYearlyGoal = (year: number) => {
    const goal = data.yearlyGoals.find((g) => g.year === year);
    return goal ? goal.amount : null;
  };

  const getMonthlySavingsAmount = (month: number, year: number) => {
    const savings = data.monthlySavings.find(
      (s) => s.month === month && s.year === year
    );
    return savings ? savings.amount : 0;
  };

  return (
    <BudgetContext.Provider
      value={{
        data,
        addSpendingRecord,
        deleteSpendingRecord,
        setMonthlySavings,
        setYearlyGoal,
        getSpendingForMonth,
        getTotalSpentForYear,
        getTotalSavedForYear,
        getAvgMonthlySavings,
        getYearlyGoal,
        getMonthlySavingsAmount,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error("useBudget must be used within a BudgetProvider");
  }
  return context;
}
