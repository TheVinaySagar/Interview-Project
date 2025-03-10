"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserButton } from "@/components/user-button"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <span className="hidden font-bold sm:inline-block">Interview Experience</span>
      </Link>
      <nav className="flex items-center gap-6 text-sm">
        <Link
          href="/"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/" ? "text-foreground" : "text-foreground/60",
          )}
        >
          Home
        </Link>
        <Link
          href="/interviews"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/interviews") ? "text-foreground" : "text-foreground/60",
          )}
        >
          Interviews
        </Link>
        <Link
          href="/submit"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/submit") ? "text-foreground" : "text-foreground/60",
          )}
        >
          Submit
        </Link>
        <Link
          href="/chat"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/chat") ? "text-foreground" : "text-foreground/60",
          )}
        >
          AI Chat
        </Link>
        <div className="hidden md:flex md:items-center md:gap-2">
          <ThemeToggle />
          <UserButton />
        </div>
      </nav>
    </div>
  )
}

