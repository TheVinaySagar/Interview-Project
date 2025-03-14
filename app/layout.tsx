// "use client"
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "sonner"
import AuthChecker from "@/components/AuthChecker";

import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Interview Experience Platform",
  description: "Share and explore interview experiences across companies and roles",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <AuthChecker />
            <div className="flex min-h-screen flex-col">
              <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center">
                  <MainNav />
                  <div className="flex flex-1 items-center justify-end space-x-4">
                    <nav className="flex items-center space-x-2">
                      <MobileNav />
                    </nav>
                  </div>
                </div>
              </header>
              <main className="flex-1">{children}</main>
              {/* <footer className="border-t py-6 md:py-0">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                  <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    Built with ❤️ for the tech community. © {new Date().getFullYear()} Interview Experience Platform.
                  </p>
                </div>
              </footer> */}
              <Footer />
            </div>
            <Toaster
              position="bottom-right"
              toastOptions={{
                classNames: {
                  toast: "bg-gray-900 text-white shadow-lg rounded-lg px-4 py-2",
                  title: "font-bold text-lg",
                  description: "text-sm opacity-80",
                  actionButton: "bg-blue-500 text-white px-3 py-1 rounded",
                  cancelButton: "bg-gray-600 text-white px-3 py-1 rounded",
                  closeButton: "text-white opacity-60 hover:opacity-100",
                },
                style: {
                  borderRadius: "10px",
                  background: "#1e293b",
                  color: "#f8fafc",
                  padding: "12px",
                  border: "1px solid #334155",
                },
              }}
            />
          </ThemeProvider>
        </AuthProvider>

      </body>
    </html>
  )
}

import './globals.css'
