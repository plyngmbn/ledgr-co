"use client";

import { useEffect, useState } from "react";
import { useBudget } from "@/lib/budget-context";
import { Flame } from "lucide-react";

export function StreakCard() {
  const { data } = useBudget();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Safety check if data or spending is undefined
    if (!data?.spending || data.spending.length === 0) {
      setStreak(0);
      return;
    }

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    /**
     * 1. NORMALIZE USER DATA TO STRINGS
     * Convert data.spending array into a Set of uniform "YYYY-MM-DD" strings.
     * We pad numbers to ensure dates like 2026-5-3 look like "2026-05-03".
     */
    const loggedDates = new Set(
      data.spending.map((r) => {
        const mm = String(r.month).padStart(2, "0");
        const dd = String(r.date).padStart(2, "0");
        return `${r.year}-${mm}-${dd}`;
      })
    );

    /**
     * HELPER FUNCTION
     * Formats standard JavaScript Date objects to match your context schema.
     * Note: Context models typically store January as 1, while JS stores it as 0. 
     * We add (+ 1) here to correct for that mismatch.
     */
    const formatDateToSchemaString = (dateObj: Date) => {
      const yyyy = dateObj.getFullYear();
      const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
      const dd = String(dateObj.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    };

    const todayStr = formatDateToSchemaString(today);
    const yesterdayStr = formatDateToSchemaString(yesterday);

    const hasLoggedToday = loggedDates.has(todayStr);
    const hasLoggedYesterday = loggedDates.has(yesterdayStr);

    // If they haven't logged today AND haven't logged yesterday, streak is dead.
    if (!hasLoggedToday && !hasLoggedYesterday) {
      setStreak(0);
      return;
    }

    /**
     * 2. CALCULATE STREAK BY WALKING BACKWARDS
     * Determine our starting evaluation node (today or yesterday)
     */
    let count = 0;
    const currentCheckDate = new Date(today);

    if (!hasLoggedToday && hasLoggedYesterday) {
      currentCheckDate.setDate(currentCheckDate.getDate() - 1);
    }

    // Step backward day-by-day until a gap is found
    while (true) {
      const checkStr = formatDateToSchemaString(currentCheckDate);

      if (loggedDates.has(checkStr)) {
        count++;
        // Move our checker 1 day into the past
        currentCheckDate.setDate(currentCheckDate.getDate() - 1);
      } else {
        // Gap detected! Break out of loop.
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
        <p className="text-2xl font-bold text-orange-600 dark:text-orange-300">
          {streak} {streak === 1 ? "day" : "days"} 🔥
        </p>
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