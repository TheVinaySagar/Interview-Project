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

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-base hover:bg-accent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="border-l border-border/40 p-0">
          <SheetHeader className="border-b border-border/40 p-4">
            <SheetTitle className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                <Image src="/logo.png" alt="Interview Experience Logo" width={120} height={30} className="object-contain" />
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="rounded-full h-8 w-8">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </SheetTitle>
          </SheetHeader>

          <nav className="flex flex-col py-4">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors",
                pathname === "/"
                  ? "bg-accent/50 text-primary"
                  : "hover:bg-accent/50"
              )}
              onClick={() => setOpen(false)}
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="/interviews"
              className={cn(
                "flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors",
                pathname?.startsWith("/interviews")
                  ? "bg-accent/50 text-primary"
                  : "hover:bg-accent/50"
              )}
              onClick={() => setOpen(false)}
            >
              <Briefcase className="h-4 w-4" />
              Interviews
            </Link>
            <Link
              href="/submit"
              className={cn(
                "flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors",
                pathname?.startsWith("/submit")
                  ? "bg-accent/50 text-primary"
                  : "hover:bg-accent/50"
              )}
              onClick={() => setOpen(false)}
            >
              <PenSquare className="h-4 w-4" />
              Submit
            </Link>
            <Link
              href="/chat"
              className={cn(
                "flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors",
                pathname?.startsWith("/chat")
                  ? "bg-accent/50 text-primary"
                  : "hover:bg-accent/50"
              )}
              onClick={() => setOpen(false)}
            >
              <MessageSquare className="h-4 w-4" />
              AI Chat
            </Link>
          </nav>

          <div className="mt-auto border-t border-border/40 p-4">
            <div className="flex flex-col space-y-4">
              <div className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} Interview Experience
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
