"use client";

import { useBudget } from "@/lib/budget-context";
import { useMemo } from "react";

const ALL_BADGES = [
  {
    id: "first_record",
    emoji: "📝",
    title: "First Step",
    desc: "Logged your first record",
    check: (data: any) => (data.spending ?? []).length >= 1,
  },
  {
    id: "first_save",
    emoji: "🐷",
    title: "Saver Baby",
    desc: "Logged your first savings",
    check: (data: any) => (data.monthlySavings ?? []).length >= 1,
  },
  {
    id: "goal_setter",
    emoji: "🎯",
    title: "Goal Setter",
    desc: "Set a yearly savings goal",
    check: (data: any) => (data.yearlyGoals ?? []).length >= 1,
  },
  {
    id: "ten_records",
    emoji: "🔥",
    title: "On a Roll",
    desc: "Logged 10 spending records",
    check: (data: any) => (data.spending ?? []).length >= 10,
  },
  {
    id: "fifty_records",
    emoji: "💪",
    title: "Consistent King",
    desc: "Logged 50 spending records",
    check: (data: any) => (data.spending ?? []).length >= 50,
  },
  {
    id: "goal_reached",
    emoji: "👑",
    title: "Goal Crusher",
    desc: "Reached your yearly savings goal",
    check: (data: any) => {
      const currentYear = new Date().getFullYear();
      const goal = (data.yearlyGoals ?? []).find((g: any) => g.year === currentYear);
      if (!goal) return false;
      const saved = (data.monthlySavings ?? [])
        .filter((s: any) => s.year === currentYear)
        .reduce((sum: number, s: any) => sum + s.amount, 0);
      return saved >= goal.amount;
    },
  },
  {
    id: "five_categories",
    emoji: "🌈",
    title: "Variety Spender",
    desc: "Spent in 5 different categories",
    check: (data: any) => {
      const cats = new Set((data.spending ?? []).map((r: any) => r.category));
      return cats.size >= 5;
    },
  },
  {
    id: "saved_10k",
    emoji: "💰",
    title: "10K Club",
    desc: "Saved ₱10,000 in a year",
    check: (data: any) => {
      const currentYear = new Date().getFullYear();
      const saved = (data.monthlySavings ?? [])
        .filter((s: any) => s.year === currentYear)
        .reduce((sum: number, s: any) => sum + s.amount, 0);
      return saved >= 10000;
    },
  },
];

export function BadgeCard() {
  const { data } = useBudget();

  const earned = useMemo(
    () => ALL_BADGES.filter((b) => b.check(data)),
    [data]
  );

  const locked = ALL_BADGES.filter((b) => !b.check(data));

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Badges</h3>
        <span className="text-xs font-semibold bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full">
          {earned.length}/{ALL_BADGES.length} earned
        </span>
      </div>

      {earned.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 mb-2">EARNED</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {earned.map((badge) => (
              <div
                key={badge.id}
                className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center"
              >
                <div className="text-2xl mb-1">{badge.emoji}</div>
                <p className="text-xs font-bold text-gray-700">{badge.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-xs font-semibold text-gray-400 mb-2">LOCKED</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {locked.map((badge) => (
            <div
              key={badge.id}
              className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center opacity-50"
            >
              <div className="text-2xl mb-1">🔒</div>
              <p className="text-xs font-bold text-gray-500">{badge.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}