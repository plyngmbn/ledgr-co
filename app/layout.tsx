import type { Metadata } from 'next'
import { Geist, Geist_Mono, Press_Start_2P } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
<<<<<<< HEAD
// 1. ADD THIS IMPORT
import { SpeedInsights } from "@vercel/speed-insights/next" 
=======
import { SpeedInsights } from '@vercel/speed-insights/next'
>>>>>>> c64149a5b29cb95d333e23e2cdc3d4a3a24259f2
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
<<<<<<< HEAD
        {/* 2. ADD THE COMPONENT HERE */}
        <Analytics />
        <SpeedInsights /> 
=======
        {process.env.NODE_ENV === 'production' && <Analytics />}
        <SpeedInsights />
>>>>>>> c64149a5b29cb95d333e23e2cdc3d4a3a24259f2
      </body>
    </html>
  )
}
