"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { Mascot } from "./mascot";

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
    // Pick a tip based on the day so it changes daily
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    setTip(TIPS[dayOfYear % TIPS.length]);
  }, []);

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100 flex items-center gap-4">
      <Mascot className="w-12 h-12 shrink-0" />
      <div>
        <p className="text-xs font-semibold text-emerald-600 mb-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Daily Tip
        </p>
        <p className="text-sm text-gray-700 font-medium">{tip}</p>
      </div>
    </div>
  );
}