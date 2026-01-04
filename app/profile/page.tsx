"use client"

import { useEffect, useState } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

/* ================= TYPES ================= */

type Transaction = {
  id: number
  title: string
  amount: number
  type: "income" | "expense"
  category: string
  createdAt: string
}

/* ================= HELPERS ================= */

function normalize(data: any[]): Transaction[] {
  return Array.isArray(data)
    ? data.map((t) => ({
        ...t,
        amount: Number(t.amount),
      }))
    : []
}

/* ================= COMPONENT ================= */

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const { theme, setTheme } = useTheme()

  const [mounted, setMounted] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  /* ================= EFFECTS ================= */

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    let alive = true

    async function load() {
      if (!session?.user?.email) return

      try {
        const res = await fetch("/api/transactions")
        const raw = await res.json()

        if (alive) {
          setTransactions(normalize(raw))
        }
      } catch {
        if (alive) setTransactions([])
      }
    }

    load()

    return () => {
      alive = false
    }
  }, [session])

  /* ================= GUARD ================= */

  if (!mounted || status === "loading") {
    return null
  }

  if (!session?.user?.email) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <button
          onClick={() =>
            signIn("credentials", {
              email: "test@local.dev",
              callbackUrl: "/profile",
            })
          }
          className="px-6 py-3 rounded-xl bg-blue-600 text-white"
        >
          Sign in
        </button>
      </main>
    )
  }

  /* ================= STATS ================= */

  const income = transactions.filter((t) => t.type === "income")
  const expense = transactions.filter((t) => t.type === "expense")

  /* ================= UI ================= */

  return (
    <main className="min-h-screen bg-background pb-[120px]">
      {/* HEADER */}
      <div className="p-6 text-white bg-gradient-to-br from-blue-600 to-cyan-500">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold">Profile</h1>
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
        <p className="mt-2 text-sm opacity-80">{session.user.email}</p>
      </div>

      {/* STATS */}
      <div className="p-4 grid grid-cols-3 gap-3 -mt-10">
        <div className="card text-center">
          <p className="text-lg font-bold">{transactions.length}</p>
          <p className="text-xs opacity-60">Total</p>
        </div>

        <div className="card text-center">
          <p className="text-lg font-bold">{income.length}</p>
          <p className="text-xs opacity-60">Income</p>
        </div>

        <div className="card text-center">
          <p className="text-lg font-bold">{expense.length}</p>
          <p className="text-xs opacity-60">Expense</p>
        </div>
      </div>

      {/* ACTION */}
      <div className="p-4">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full py-3 rounded-xl bg-red-500 text-white"
        >
          Sign out
        </button>
      </div>
    </main>
  )
}
