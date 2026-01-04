"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { createPortal } from "react-dom"
import { useEffect, useState } from "react"

/* ================= ICONS ================= */

function HomeIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 10v10h14V10" />
    </svg>
  )
}

function HistoryIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

function ProfileIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="4" />
      <path d="M6 21c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    </svg>
  )
}

const tabs = [
  { href: "/", icon: HomeIcon },
  { href: "/transactions", icon: HistoryIcon },
  { href: "/profile", icon: ProfileIcon },
]

/* ================= COMPONENT ================= */

export default function BottomNav() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return createPortal(
    <nav className="fixed bottom-0 left-0 right-0 z-[99999] flex justify-center pb-6">
      <div
        className="
          flex items-center justify-center gap-15
          h-[72px] w-[300px]
          rounded-full
          bg-zinc-200 dark:bg-zinc-900
          shadow-xl
        "
      >
        {tabs.map((tab) => {
          const active = pathname === tab.href
          const Icon = tab.icon

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="
                flex h-14 w-14
                items-center justify-center
                rounded-full
              "
            >
              <span
                className={
                  active
                    ? "bg-blue-500 text-white h-12 w-12 rounded-full flex items-center justify-center"
                    : "text-zinc-500 dark:text-zinc-400"
                }
              >
                <Icon />
              </span>
            </Link>
          )
        })}
      </div>
    </nav>,
    document.body
  )
}
