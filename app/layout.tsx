import type { Metadata } from 'next'
import { Geist, Geist_Mono, Press_Start_2P } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { BudgetProvider } from '@/lib/budget-context'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"

const pressStart2P = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-pixel" });

export const metadata: Metadata = {
  title: 'Trackr',
  description: 'Your friendly budget buddy to track spending and savings',
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
    // suppressHydrationWarning is required for next-themes
    <html lang="en" className={pressStart2P.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <BudgetProvider>
          {/* attribute="class" matches darkMode: 'class' in tailwind.config */}
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </BudgetProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
