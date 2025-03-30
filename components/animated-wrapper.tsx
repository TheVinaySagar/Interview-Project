"use client"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"

export function AnimatedWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isFirstRender, setIsFirstRender] = useState(true)

  useEffect(() => {
    // After first render, set isFirstRender to false
    setIsFirstRender(false)
  }, [])

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={pathname}
        // Skip animation on first render to avoid hydration issues
        initial={isFirstRender ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="flex-1"
      >
        {children}
      </motion.main>
    </AnimatePresence>
  )
}
