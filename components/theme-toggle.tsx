// "use client"
// import { Moon, Sun } from "lucide-react"
// import { useTheme } from "next-themes"

// import { Button } from "@/components/ui/button"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// export function ThemeToggle() {
//   const { setTheme } = useTheme()

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" size="icon">
//           <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
//           <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
//           <span className="sr-only">Toggle theme</span>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
//         <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
//         <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }


"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // ✅ Prevents Hydration Mismatch in Next.js
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Ensures client-side rendering

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-md border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
        >
          {resolvedTheme === "dark" ? (
            <Moon className="h-5 w-5 text-gray-400" /> // ✅ Softer icon color in dark mode
          ) : (
            <Sun className="h-5 w-5 text-gray-600" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-white dark:bg-gray-850 dark:border-gray-700 shadow-md rounded-md"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="hover:bg-gray-100 dark:hover:bg-gray-750 dark:text-gray-300"
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="hover:bg-gray-100 dark:hover:bg-gray-750 dark:text-gray-300"
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="hover:bg-gray-100 dark:hover:bg-gray-750 dark:text-gray-300"
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
