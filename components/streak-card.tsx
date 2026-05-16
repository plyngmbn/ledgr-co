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

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);

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
    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-5 border border-orange-100 flex items-center gap-4">
      <div className="bg-orange-100 p-3 rounded-xl">
        <Flame className="w-6 h-6 text-orange-500" />
      </div>
      <div>
        <p className="text-xs font-semibold text-orange-500 mb-1">Logging Streak</p>
        <p className="text-2xl font-bold text-orange-600">{streak} {streak === 1 ? "day" : "days"} 🔥</p>
        <p className="text-xs text-gray-500 mt-0.5">
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