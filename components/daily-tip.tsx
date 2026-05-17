"use client";

import { useState, useEffect } from "react";
import { Sparkles, Lightbulb } from "lucide-react"; // Added Lightbulb

const TIPS = [
  "Small savings today = big wins later. You got this! 💪",
  "Track every peso. Awareness is the first step to wealth! 👀",
  "Skipping one milk tea = ₱100 saved. Just saying. 🧋",
  "Your future self is watching your spending rn. Make them proud! 🫡",
  "No spend day challenge: can you do it today? 😤",
  "Saving isn't boring. Being broke is. 💅",
  "Every entry you log is a step toward your goal. Keep going! 🚀",
  "Rich people budget too. It's giving financial main character. ✨",
  "You don't need to earn more, just spend smarter. 🧠",
  "One less impulse buy = one step closer to your goal! 🎯",
  "Budgeting is just telling your money where to go. Boss behavior. 👑",
  "Check your yearly goal today. How close are you? 📊",
];

export function DailyTip() {
  const [tip, setTip] = useState("");

  useEffect(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    setTip(TIPS[dayOfYear % TIPS.length]);
  }, []);

  return (
    /**
     * UNIQUE THEME: Violet/Indigo
     */
    <div className="bg-violet-50/50 dark:bg-violet-950/10 rounded-2xl p-5 border border-violet-100 dark:border-violet-900/30 flex items-center gap-4 shadow-sm mb-6">
      
      {/* Bouncing Lightbulb Logo */}
      <div className="bg-violet-100 dark:bg-violet-900/50 p-2.5 rounded-xl">
        <Lightbulb className="w-7 h-7 text-violet-600 dark:text-violet-400 fill-violet-200 dark:fill-violet-800" />
      </div>
      
      <div>
        <p className="text-xs font-bold text-violet-600 dark:text-violet-400 mb-1 flex items-center gap-1">Daily Tip!
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-200 font-medium leading-tight">
          {tip}
        </p>
      </div>
    </div>
  );
}