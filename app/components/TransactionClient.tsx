"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

/* ================= TYPES ================= */

type Transaction = {
  id: number
  title: string
  amount: number
  type: "income" | "expense"
  category: string
  createdAt: string
}

/* ================= CONSTANTS ================= */

const COLORS = ["#22c55e", "#3b82f6", "#f97316", "#ef4444", "#a855f7"]

/* ================= HELPERS ================= */
function normalizeArray<T>(raw: any): T[] {
  if (Array.isArray(raw)) return raw
  if (Array.isArray(raw?.data)) return raw.data
  if (Array.isArray(raw?.transactions)) return raw.transactions
  return []
}

function normalizeTransactions(data: Transaction[]) {
  return data.map((t) => ({
    ...t,
    amount: Number(t.amount),
  }))
}

function haptic(ms = 10) {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(ms)
  }
}

/* ================= COMPONENT ================= */

export default function TransactionClient({
  initialTransactions,
}: {
  initialTransactions: Transaction[]
}) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const [mounted, setMounted] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>(normalizeTransactions(initialTransactions))

  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [type, setType] = useState<"income" | "expense">("expense")
  const [category, setCategory] = useState("Food")
  const [loading, setLoading] = useState(false)

  const balanceRef = useRef(0)
  const [animatedBalance, setAnimatedBalance] = useState(0)
  const [headerBlur, setHeaderBlur] = useState(false)

  /* ================= EFFECTS ================= */

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const onScroll = () => setHeaderBlur(window.scrollY > 8)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  /* ================= DERIVED ================= */

  const totalBalance = transactions.reduce((acc, t) => (t.type === "income" ? acc + t.amount : acc - t.amount), 0)

  useEffect(() => {
    const start = balanceRef.current
    const end = totalBalance
    const startTime = performance.now()
    const duration = 480

    function animate(now: number) {
      const p = Math.min((now - startTime) / duration, 1)
      const val = Math.floor(start + (end - start) * p)
      setAnimatedBalance(val)
      if (p < 1) requestAnimationFrame(animate)
      else balanceRef.current = end
    }

    requestAnimationFrame(animate)
  }, [totalBalance])

  const expenseByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc: Record<string, number>, t) => {
      const amount = Number(t.amount)
      if (isNaN(amount)) return acc

      acc[t.category] = (acc[t.category] || 0) + amount
      return acc
  }, {})


  const chartData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }))

  /* ================= API ================= */

  async function refresh() {
    const res = await fetch("/api/transactions")
    const raw = await res.json()

    const safeArray = normalizeArray<Transaction>(raw)
    setTransactions(normalizeTransactions(safeArray))
  }


  async function submit(e: React.FormEvent) {
    e.preventDefault()
    haptic(15)
    setLoading(true)

    await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        amount: Number(amount),
        type,
        category,
      }),
    })

    setTitle("")
    setAmount("")
    setCategory("Food")

    await refresh()
    setLoading(false)
  }

  async function remove(id: number) {
    haptic(20)
    await fetch("/api/transactions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    setTransactions((t) => t.filter((x) => x.id !== id))
  }

  /* ================= GUARD ================= */

  if (!mounted) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <p className="text-xs text-slate-400">Loading…</p>
      </main>
    )
  }

  /* ================= UI ================= */

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-[120px]">
      <header
        className={`sticky top-0 z-30 transition-all duration-300 ${
          headerBlur
            ? "backdrop-blur-xl bg-slate-50/80 dark:bg-slate-950/80 border-b border-slate-200/60 dark:border-slate-800/60 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-md px-5 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Wallet</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors text-sm flex items-center justify-center"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-md px-5 space-y-6 pt-6">
        <motion.div
          whileTap={{ scale: 0.98 }}
          className="rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 p-8 text-white shadow-2xl shadow-blue-500/30"
        >
          <p className="text-xs font-medium opacity-80 uppercase tracking-wide mb-2">Total Balance</p>
          <p className="text-5xl font-bold tracking-tight balance-number">
            Rp {animatedBalance.toLocaleString("id-ID")}
          </p>
        </motion.div>

        <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-lg shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800">
          <p className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Expense Breakdown</p>
          {chartData.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-10">No expenses yet — you are doing great.</p>
          ) : (
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    outerRadius={70}
                    stroke="none"
                  >
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-900 dark:text-white px-1">Recent Transactions</p>

          {transactions.length === 0 && <p className="text-xs text-slate-400 py-8 text-center">No transactions yet</p>}

          <div className="space-y-2">
            {transactions.map((t) => (
              <div
                key={t.id}
                className="flex justify-between items-start rounded-2xl bg-white dark:bg-slate-900 p-4 shadow-md shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{t.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{new Date(t.createdAt).toLocaleDateString("id-ID")}</p>
                </div>

                <div className="text-right shrink-0 ml-4">
                  <p
                    className={`text-base font-bold ${
                      t.type === "income" ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"
                    }`}
                  >
                    Rp {t.amount.toLocaleString("id-ID")}
                  </p>
                  <button
                    onClick={() => remove(t.id)}
                    className="text-xs text-slate-400 hover:text-red-500 transition-colors mt-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={submit}
          className="rounded-2xl bg-white dark:bg-slate-900 p-6 space-y-4 shadow-lg shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800"
        >
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Add Transaction</p>

          <input
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Transaction title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <select
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={type}
              onChange={(e) => setType(e.target.value as "income" | "expense")}
              title="Transaction type"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <select
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              title="Transaction category"
            >
              <option>Food</option>
              <option>Transport</option>
              <option>Shopping</option>
              <option>Bills</option>
              <option>Other</option>
            </select>
          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Saving…" : "Add Transaction"}
          </button>
        </form>
      </section>
    </main>
  )
}
