"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, PlusCircle, Moon, Sun } from "lucide-react";
import { Mascot } from "./mascot";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Mascot className="w-10 h-10" />
            <span className="text-lg font-bold text-[#4A9B7F] font-[family-name:var(--font-pixel)]">Trackr</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-colors ${
                pathname === "/"
                  ? "bg-[#4A9B7F] text-white font-bold"
                  : "text-gray-600 dark:text-gray-300 font-medium hover:bg-[#7DC9A6] hover:text-white hover:font-bold"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link
              href="/records"
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-colors ${
                pathname === "/records"
                  ? "bg-[#4A9B7F] text-white font-bold"
                  : "text-gray-600 dark:text-gray-300 font-medium hover:bg-[#7DC9A6] hover:text-white hover:font-bold"
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Add Record</span>
            </Link>

            {/* Dark mode toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}