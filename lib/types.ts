export interface SpendingRecord {
  id: string;
  date: number;
  category: string;
  description: string;
  amount: number;
  month: number;
  year: number;
}

export interface MonthlySavings {
  month: number;
  year: number;
  amount: number;
}

export interface YearlyGoal {
  year: number;
  amount: number;
}

export interface BudgetData {
  spending: SpendingRecord[];
  monthlySavings: MonthlySavings[];
  yearlyGoals: YearlyGoal[];
}

export const CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Other",
] as const;

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;
