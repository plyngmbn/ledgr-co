"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { Flame } from "lucide-react";

export function StreakCard() {
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateStreak = async () => {
      setLoading(true);
      
      // 1. Fetch all spending records for the user
      const { data: records, error } = await supabase
        .from("records")
        .select("date, month, year");

      if (error || !records || records.length === 0) {
        setStreak(0);
        setLoading(false);
        return;
      }

      /**
       * 2. NORMALIZE DATABASE DATA
       * Note: Your database stores month as 0-indexed (0 = Jan).
       * We normalize to "YYYY-MM-DD" for O(1) Set lookups.
       */
      const loggedDates = new Set(
        records.map((r) => {
          const mm = String(r.month + 1).padStart(2, "0"); // Correct for display/logic
          const dd = String(r.date).padStart(2, "0");
          return `${r.year}-${mm}-${dd}`;
        })
      );

      const formatDate = (dateObj: Date) => {
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
        const dd = String(dateObj.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
      };

      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      const todayStr = formatDate(today);
      const yesterdayStr = formatDate(yesterday);

      // If no log today AND no log yesterday, the streak is broken
      if (!loggedDates.has(todayStr) && !loggedDates.has(yesterdayStr)) {
        setStreak(0);
        setLoading(false);
        return;
      }

      /**
       * 3. WALK BACKWARDS
       * Start checking from today if logged, otherwise start from yesterday
       */
      let count = 0;
      const currentCheckDate = new Date(today);
      
      if (!loggedDates.has(todayStr)) {
        currentCheckDate.setDate(currentCheckDate.getDate() - 1);
      }

      while (true) {
        const checkStr = formatDate(currentCheckDate);
        if (loggedDates.has(checkStr)) {
          count++;
          currentCheckDate.setDate(currentCheckDate.getDate() - 1);
        } else {
          break;
        }
      }

      setStreak(count);
      setLoading(false);
    };

    calculateStreak();
  }, []);

  if (loading) return <div className="h-28 bg-gray-50 dark:bg-gray-900/50 animate-pulse rounded-2xl border border-gray-100 dark:border-gray-800" />;

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded-2xl p-5 border border-orange-100 dark:border-orange-900/50 flex items-center gap-4 transition-colors">
      <div className="bg-orange-100 dark:bg-orange-900/50 p-3 rounded-xl">
        <Flame className={`w-6 h-6 ${streak > 0 ? "text-orange-500 animate-pulse" : "text-gray-400"}`} />
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