"use client";

import { useEffect, useState } from "react";
import { useBudget } from "@/lib/budget-context";
import { Flame } from "lucide-react";

export function StreakCard() {
  const { data } = useBudget();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const today = new Date();
    let count = 0;

    // Check if the user has logged anything at all
    if (data.spending.length === 0) {
      setStreak(0);
      return;
    }

    // Step 1: Check if streak is still active (logged today or yesterday)
    const hasLoggedToday = data.spending.some(
      (r) => r.year === today.getFullYear() && r.month === today.getMonth() && r.date === today.getDate()
    );

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const hasLoggedYesterday = data.spending.some(
      (r) => r.year === yesterday.getFullYear() && r.month === yesterday.getMonth() && r.date === yesterday.getDate()
    );

    // If they haven't logged today AND haven't logged yesterday, streak is dead.
    if (!hasLoggedToday && !hasLoggedYesterday) {
      setStreak(0);
      return;
    }

    // Step 2: Calculate the streak length
    // We start counting from the most recent day a log existed (today or yesterday)
    const startDay = hasLoggedToday ? today : yesterday;

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(startDay);
      checkDate.setDate(startDay.getDate() - i);

      const hasRecord = data.spending.some(
        (r) =>
          r.year === checkDate.getFullYear() &&
          r.month === checkDate.getMonth() &&
          r.date === checkDate.getDate()
      );

      if (hasRecord) {
        count++;
      } else {
        break;
      }
    }

    setStreak(count);
  }, [data]);

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded-2xl p-5 border border-orange-100 dark:border-orange-900/50 flex items-center gap-4 transition-colors">
      <div className="bg-orange-100 dark:bg-orange-900/50 p-3 rounded-xl">
        <Flame className="w-6 h-6 text-orange-500 dark:text-orange-400" />
      </div>
      <div>
        <p className="text-xs font-semibold text-orange-500 dark:text-orange-400 mb-1">Logging Streak</p>
        <p className="text-2xl font-bold text-orange-600 dark:text-orange-300">{streak} {streak === 1 ? "day" : "days"} 🔥</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {streak === 0
            ? "Log a record today to start your streak!"
            : streak < 3
            ? "Keep it going!"
            : streak < 7
            ? "You're on fire! 🔥"
            : "Unstoppable! Legend behavior 👑"}
        </p>
      </div>
    </div>
  );
}