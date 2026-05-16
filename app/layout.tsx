import type { Metadata } from 'next'
import { Geist, Geist_Mono, Press_Start_2P } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from "@vercel/speed-insights/next" 
import { BudgetProvider } from '@/lib/budget-context'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import Script from 'next/script' // 1. Import the Script component

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
  // 2. Add the AdSense verification meta tag here
  other: {
    "google-adsense-account": "ca-pub-8311594301846007",
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
        {/* 3. Add the AdSense script tag here */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8311594301846007"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body className="font-sans antialiased">
        <BudgetProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </BudgetProvider>

        {/* 4. Cleaned up duplicate analytics tags */}
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