"use client"
import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, Home, Briefcase, PenSquare, MessageSquare, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home", icon: <Home className="h-4 w-4 mr-2" /> },
    { href: "/interviews", label: "Interviews", icon: <Briefcase className="h-4 w-4 mr-2" /> },
    { href: "/submit", label: "Submit", icon: <PenSquare className="h-4 w-4 mr-2" /> },
    { href: "/chat", label: "AI Chat", icon: <MessageSquare className="h-4 w-4 mr-2" /> },
  ]

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 p-2 rounded-full hover:bg-secondary/80 transition-colors"
            aria-label="Toggle Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[280px] sm:w-[320px] p-0">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b border-border/40 p-4">
              <SheetTitle className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                  <Image src="/logo.png" alt="Interview Experience Logo" width={120} height={30} className="object-contain" />
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  className="rounded-full h-8 w-8 hover:bg-secondary/80"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </SheetTitle>
            </SheetHeader>

            <nav className="flex flex-col gap-2 p-4 flex-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center py-3 px-4 rounded-lg transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-secondary/80 text-foreground/80 hover:text-foreground"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </Link>
                )
              })}
            </nav>

            <div className="mt-auto border-t border-border/40 p-6">
              <div className="flex flex-col space-y-4">
                <div className="text-xs text-muted-foreground">
                  © {new Date().getFullYear()} Interview Experience
                </div>
                <div className="flex space-x-4">
                  <Link href="/login" className="w-full">
                    <Button variant="outline" size="sm" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" className="w-full">
                    <Button size="sm" className="w-full">Sign Up</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
