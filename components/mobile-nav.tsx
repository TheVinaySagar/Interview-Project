"use client"

import * as React from "react"
import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserButton } from "@/components/user-button"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex md:hidden">
      <ThemeToggle />
      <UserButton />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="pr-0">
          <div className="px-7">
            <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
              <span className="font-bold">Interview Experience</span>
            </Link>
          </div>
          <nav className="mt-4 flex flex-col gap-3 px-2">
            <Link
              href="/"
              className="flex w-full items-center rounded-md px-5 py-2 text-sm font-medium hover:bg-accent"
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/interviews"
              className="flex w-full items-center rounded-md px-5 py-2 text-sm font-medium hover:bg-accent"
              onClick={() => setOpen(false)}
            >
              Interviews
            </Link>
            <Link
              href="/submit"
              className="flex w-full items-center rounded-md px-5 py-2 text-sm font-medium hover:bg-accent"
              onClick={() => setOpen(false)}
            >
              Submit
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}

