"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, PlusCircle } from "lucide-react";
import { Mascot } from "./mascot";

export function Header() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Mascot className="w-10 h-10" />
            <span className="text-lg font-bold text-[#4A9B7F] font-[family-name:var(--font-pixel)]">Trackr</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "bg-[#4A9B7F] text-white"
                  : "text-gray-600 hover:bg-[#7DC9A6] hover:text-white"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              href="/records"
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                pathname === "/records"
                  ? "bg-[#4A9B7F] text-white"
                  : "text-gray-600 hover:bg-[#7DC9A6] hover:text-white"
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              Add Record
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
