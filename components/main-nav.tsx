"use client"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { onAuthStateChanged, getAuth, User } from "firebase/auth"
import { Search, Home, Briefcase, PenSquare, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserButton } from "@/components/user-button"
import { MobileNav } from "@/components/mobile-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function MainNav() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      return setUser(user)
    })
    return () => unsubscribe()
  }, [])

  const navItems = [
    { href: "/", label: "Home", icon: <Home className="h-4 w-4" /> },
    { href: "/interviews", label: "Interviews", icon: <Briefcase className="h-4 w-4" /> },
    { href: "/submit", label: "Submit", icon: <PenSquare className="h-4 w-4" /> },
    { href: "/chat", label: "AI Chat", icon: <MessageSquare className="h-4 w-4" /> },
  ]

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-xl shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Interview Experience Logo"
              width={140}
              height={36}
              className="object-contain"
              priority
            />
          </Link>

          <div className="hidden lg:flex relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search interviews..."
              className="w-64 pl-9 rounded-full bg-secondary/50 border-secondary focus-visible:ring-primary"
            />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = item.href === "/"
              ? pathname === item.href
              : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-2 py-1 rounded-md relative transition-colors",
                  isActive
                    ? "text-primary after:absolute after:-bottom-[18px] after:left-0 after:h-0.5 after:w-full after:bg-primary"
                    : "text-muted-foreground hover:text-primary hover:bg-secondary/50"
                )}
              >
                <span className="hidden lg:inline">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <ThemeToggle />
          {user ? (
            <UserButton />
          ) : (
            <div className="hidden sm:flex">
              <Link href="/login">
                <Button size="sm" variant="outline" className="rounded-full mr-2">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="rounded-full">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
          <MobileNav />
        </div>
      </div>
    </div>
  )
}
