"use client"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"

export function AnimatedWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex-1"
      >
        {children}
      </motion.main>
    </AnimatePresence>
  )
}
