"use client"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"
import BottomNav from "@/app/components/BottomNav"
import { useState, useEffect, type ReactNode } from "react"

type ProvidersProps = {
  children: ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        {mounted && <BottomNav />}
      </ThemeProvider>
    </SessionProvider>
  )
}
