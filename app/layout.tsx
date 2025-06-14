import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/themeprovider'
import '../polyfills'

const inter = Inter({
  subsets: ['latin'],
  // optional: add these if you need weight variants
  // weight: ["400", "500", "600", "700"],
  // variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Dodo',
  description: 'Your Personal Web3 Wallet.',
  icons: {
    icon: 'data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiAgd2lkdGg9IjI0IiAgaGVpZ2h0PSIyNCIgIHZpZXdCb3g9IjAgMCAyNCAyNCIgIGZpbGw9Im5vbmUiICBzdHJva2U9ImN1cnJlbnRDb2xvciIgIHN0cm9rZS13aWR0aD0iMSIgIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgIHN0cm9rZS1saW5lam9pbj0icm91bmQiICBjbGFzcz0iaWNvbiBpY29uLXRhYmxlciBpY29ucy10YWJsZXItb3V0bGluZSBpY29uLXRhYmxlci1mZWF0aGVyIj48cGF0aCBzdHJva2U9Im5vbmUiIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNNCAyMGwxMCAtMTBtMCAtNXY1aDVtLTkgLTF2NWg1bS05IC0xdjVoNW0tNSAtNWw0IC00bDQgLTQiIC8+PHBhdGggZD0iTTE5IDEwYy42MzggLS42MzYgMSAtMS41MTUgMSAtMi40ODZhMy41MTUgMy41MTUgMCAwIDAgLTMuNTE3IC0zLjUxNGMtLjk3IDAgLTEuODQ3IC4zNjcgLTIuNDgzIDFtLTMgMTNsNCAtNGw0IC00IiAvPjwvc3ZnPg==',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
