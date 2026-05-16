import type { Metadata } from 'next'
import { Geist, Geist_Mono, Press_Start_2P } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from "@vercel/speed-insights/next" 
import { BudgetProvider } from '@/lib/budget-context'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import Script from 'next/script' 

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
      <head>
        {/* FIXED: Removed async={true} (shorthand is cleaner) and fixed crossOrigin casing */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8311594301846007"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="font-sans antialiased">
        <BudgetProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </BudgetProvider>

        {/* Cleaned up duplicates: only runs in production */}
        {process.env.NODE_ENV === 'production' && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  )
}