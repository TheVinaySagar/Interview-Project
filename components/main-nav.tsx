// "use client"
// import Image from "next/image"
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { cn } from "@/lib/utils"
// import { ThemeToggle } from "@/components/theme-toggle"
// import { UserButton } from "@/components/user-button"

// export function MainNav() {
//   const pathname = usePathname()

//   return (
//     <div className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
//       <div className="container flex h-16 items-center justify-between px-4 md:px-6">
//         <Link href="/" className="flex items-center gap-2">
//           <Image
//             src="/logo.png"
//             alt="Interview Experience Logo"
//             width={140}
//             height={36}
//             className="object-contain"
//           />
//         </Link>

//         <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
//           <Link
//             href="/"
//             className={cn(
//               "relative transition-colors hover:text-primary",
//               pathname === "/"
//                 ? "text-primary after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-primary"
//                 : "text-muted-foreground"
//             )}
//           >
//             Home
//           </Link>
//           <Link
//             href="/interviews"
//             className={cn(
//               "relative transition-colors hover:text-primary",
//               pathname?.startsWith("/interviews")
//                 ? "text-primary after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-primary"
//                 : "text-muted-foreground"
//             )}
//           >
//             Interviews
//           </Link>
//           <Link
//             href="/submit"
//             className={cn(
//               "relative transition-colors hover:text-primary",
//               pathname?.startsWith("/submit")
//                 ? "text-primary after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-primary"
//                 : "text-muted-foreground"
//             )}
//           >
//             Submit
//           </Link>
//           <Link
//             href="/chat"
//             className={cn(
//               "relative transition-colors hover:text-primary",
//               pathname?.startsWith("/chat")
//                 ? "text-primary after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-primary"
//                 : "text-muted-foreground"
//             )}
//           >
//             AI Chat
//           </Link>
//         </nav>

//         {/* Mobile Navigation Trigger */}
//         <button className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:hidden">
//           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
//             <line x1="4" x2="20" y1="12" y2="12" />
//             <line x1="4" x2="20" y1="6" y2="6" />
//             <line x1="4" x2="20" y1="18" y2="18" />
//           </svg>
//           <span className="sr-only">Toggle menu</span>
//         </button>

//         <div className="flex items-center gap-4">
//           <ThemeToggle />
//           <UserButton />
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserButton } from "@/components/user-button"
import { MobileNav } from "@/components/mobile-nav"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Interview Experience Logo"
            width={140}
            height={36}
            className="object-contain"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className={cn(
              "relative transition-colors hover:text-primary",
              pathname === "/"
                ? "text-primary after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-primary"
                : "text-muted-foreground"
            )}
          >
            Home
          </Link>
          <Link
            href="/interviews"
            className={cn(
              "relative transition-colors hover:text-primary",
              pathname?.startsWith("/interviews")
                ? "text-primary after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-primary"
                : "text-muted-foreground"
            )}
          >
            Interviews
          </Link>
          <Link
            href="/submit"
            className={cn(
              "relative transition-colors hover:text-primary",
              pathname?.startsWith("/submit")
                ? "text-primary after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-primary"
                : "text-muted-foreground"
            )}
          >
            Submit
          </Link>
          <Link
            href="/chat"
            className={cn(
              "relative transition-colors hover:text-primary",
              pathname?.startsWith("/chat")
                ? "text-primary after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-primary"
                : "text-muted-foreground"
            )}
          >
            AI Chat
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {/* Theme toggle and user button only visible on desktop */}
          <div className="hidden md:flex md:items-center md:gap-2">
            <ThemeToggle />
            <UserButton />
          </div>

          {/* Mobile nav with hamburger only visible on mobile */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <UserButton />
            <MobileNav />
          </div>
        </div>
      </div>
    </div>
  )
}
