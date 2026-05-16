import type { Metadata } from 'next'
import { Geist, Geist_Mono, Press_Start_2P } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
// 1. ADD THIS IMPORT
import { SpeedInsights } from "@vercel/speed-insights/next" 
import { BudgetProvider } from '@/lib/budget-context'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const pressStart2P = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-pixel" });

export const metadata: Metadata = {
  title: 'Ledgr',
  description: 'Your friendly budget buddy to track spending and savings',
  generator: 'v0.app',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`bg-[#f8faf9] ${pressStart2P.variable}`}>
      <body className="font-sans antialiased">
        <BudgetProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </BudgetProvider>
        {/* 2. ADD THE COMPONENT HERE */}
        <Analytics />
        <SpeedInsights /> 
      </body>
    </html>
  )
}
