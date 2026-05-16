"use client";

import { supabase } from "@/lib/supabase-client";
import { Mascot } from "@/components/mascot";
import { Button } from "@/components/ui/button";
import { Chrome, ShieldCheck, Zap, Globe } from "lucide-react";

export default function LoginPage() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] dark:bg-gray-950 flex flex-col items-center justify-center p-4">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-200/30 dark:bg-emerald-900/10 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-[400px] space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
              <Mascot className="w-16 h-16" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-[#4A9B7F] font-[family-name:var(--font-pixel)] tracking-tighter">
            Ledgr
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Your finance bestie, synced to the cloud.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-emerald-900/5">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Welcome Back</h2>
              <p className="text-sm text-gray-500">Sign in to access your dashboard and records.</p>
            </div>

            <Button
              onClick={handleLogin}
              className="w-full h-14 bg-[#4A9B7F] hover:bg-[#3d8069] text-white rounded-2xl flex items-center justify-center gap-3 transition-all font-bold text-lg shadow-lg shadow-emerald-900/10"
            >
              <Chrome className="w-5 h-5" />
              Continue with Google
            </Button>

            {/* Feature List */}
            <div className="pt-6 space-y-4 border-t border-gray-50 dark:border-gray-800">
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Secure Cloud Storage via Supabase</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <Zap className="w-4 h-4 text-emerald-500" />
                <span>Instant Sync across all devices</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <Globe className="w-4 h-4 text-emerald-500" />
                <span>Accessible anywhere, anytime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400">
          By signing in, you agree to our Terms of Service <br /> and Privacy Policy.
        </p>
      </div>
    </div>
  );
}