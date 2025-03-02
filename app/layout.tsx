import "./globals.css"
import type { ReactNode } from "react"
import { ThemeProvider } from "../components/theme-provider"

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Inventory Management System</title>
        <meta name="description" content="Advanced inventory analysis and management system" />
      </head>
      <body className="min-h-screen antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

