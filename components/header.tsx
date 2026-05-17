"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, PlusCircle, LogOut, User as UserIcon } from "lucide-react";
import { Mascot } from "./mascot";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/"; 
  };

  // We are keeping this function here just in case, 
  // but the button below will now use a Link instead.
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  if (!mounted) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Mascot className="w-10 h-10" />
            <span className="text-lg font-bold text-[#4A9B7F] font-[family-name:var(--font-pixel)]">Ledgr</span>
          </Link>

          <div className="flex items-center gap-4">
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
                <span className="hidden sm:inline">Records</span>
              </Link>
            </div>

            <div className="flex items-center pl-4 border-l border-gray-100 dark:border-gray-800 gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 border border-emerald-100">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-emerald-100 text-emerald-700">
                      <UserIcon className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <button 
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                /* FIX: Wrapped Button in Link to navigate to your custom login page */
                <Link href="/login">
                  <Button 
                    className="bg-[#4A9B7F] hover:bg-[#3d8069] text-white text-sm font-bold h-9 px-6 rounded-full transition-colors"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}