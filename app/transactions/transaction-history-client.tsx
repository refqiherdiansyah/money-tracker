"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"

/* ================= TYPES ================= */

type Transaction = {
  id: number
  title: string
  amount: number
  type: "income" | "expense"
  category: string
  createdAt: string
  date?: Date
}

/* ================= SAFE NORMALIZER (PRISMA SAFE) ================= */

function normalize(raw: any): Transaction[] {
  let data: any[] = []

  if (Array.isArray(raw)) data = raw
  else if (Array.isArray(raw?.transactions)) data = raw.transactions
  else if (Array.isArray(raw?.data?.transactions)) data = raw.data.transactions
  else if (Array.isArray(raw?.data)) data = raw.data

  return data.map((t) => {
    const created = t.createdAt instanceof Date ? t.createdAt : new Date(t.createdAt)

    return {
      ...t,
      amount: Number(t.amount),
      createdAt: created.toISOString(),
      date: isNaN(created.getTime()) ? undefined : created,
    }
  })
}

/* ================= CSV EXPORT ================= */

  function exportCSV(
  filtered: Transaction[],
  all: Transaction[]
) {
  const data = filtered.length ? filtered : all
    function exportCSV(data: Transaction[], all: Transaction[]) {
    const source = data.length > 0 ? data : all

    if (!source.length) return // diem aja, no alert

    const header = ["Title", "Amount", "Type", "Category", "Date"]

    const rows = source.map((t) => [
      `"${t.title}"`,
      t.amount,
      t.type,
      t.category,
      new Date(t.createdAt).toLocaleString("id-ID"),
    ])

    const csv = [header, ...rows].map((r) => r.join(",")).join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "transactions.csv"
    a.style.display = "none"
    document.body.appendChild(a)
    a.click()

    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }


  const header = ["Title", "Amount", "Type", "Category", "Date"]
  const rows = data.map((t) => [
    `"${t.title}"`,
    t.amount,
    t.type,
    t.category,
    new Date(t.createdAt).toLocaleString("id-ID"),
  ])

  const csv = [header, ...rows].map((r) => r.join(",")).join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = "transactions.csv"
  a.click()

  URL.revokeObjectURL(url)
}

/* ================= COMPONENT ================= */

export default function TransactionHistoryClient({
  initialTransactions,
}: {
  initialTransactions: any
}) {
  const transactions = useMemo(() => normalize(initialTransactions), [initialTransactions])

  const [search, setSearch] = useState("")
  const [month, setMonth] = useState("all")
  const [category, setCategory] = useState("all")

  /* ================= FILTER ================= */

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase())

      const matchCategory = category === "all" || t.category === category

      const matchMonth = month === "all" || (t.date && String(t.date.getMonth()) === month)

      return matchSearch && matchCategory && matchMonth
    })
  }, [transactions, search, category, month])

  /* ================= GROUP BY DATE ================= */

  const grouped = useMemo(() => {
    return filtered.reduce<Record<string, Transaction[]>>((acc, t) => {
      if (!t.date) return acc

      const key = t.date.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })

      if (!acc[key]) acc[key] = []
      acc[key].push(t)
      return acc
    }, {})
  }, [filtered])

  const dates = Object.keys(grouped)

  /* ================= UI ================= */

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-[120px]">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="mx-auto max-w-md px-5 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Transaction History</h1>

          <button
            onClick={() => exportCSV(filtered, transactions)}
            className="
              rounded-xl px-4 py-2.5 text-sm font-semibold
              bg-gradient-to-r from-blue-600 to-cyan-600
              text-white shadow-lg shadow-blue-500/30
              hover:shadow-blue-500/40
              active:scale-[0.97]
              transition
            "
          >
            Export CSV
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-md px-5 space-y-6 pt-6">
        <input
          className="w-full rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-3.5 text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <select
            className="rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 cursor-pointer"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="all">All Months</option>
            {[...Array(12)].map((_, i) => (
              <option key={i} value={String(i)}>
                {new Date(2024, i).toLocaleString("id-ID", {
                  month: "long",
                })}
              </option>
            ))}
          </select>

          <select
            className="rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 cursor-pointer"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option>Food</option>
            <option>Transport</option>
            <option>Shopping</option>
            <option>Bills</option>
            <option>Other</option>
          </select>
        </div>

        {dates.length === 0 && (
          <div className="py-32 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No transactions found</p>
          </div>
        )}

        {dates.map((date) => (
          <div key={date} className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent" />
              <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
                {date}
              </p>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent" />
            </div>

            <div className="space-y-2">
              {grouped[date].map((t) => (
                <motion.div
                  key={t.id}
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ y: -2 }}
                  className={`relative flex items-center justify-between rounded-2xl bg-white dark:bg-slate-900 p-4 shadow-md hover:shadow-xl border-2 transition-all duration-200 cursor-pointer overflow-hidden
                    ${
                      t.type === "income"
                        ? "border-blue-100 dark:border-blue-900/30 hover:border-blue-200 dark:hover:border-blue-800/50"
                        : "border-red-100 dark:border-red-900/30 hover:border-red-200 dark:hover:border-red-800/50"
                    }`}
                >
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 ${
                      t.type === "income"
                        ? "bg-gradient-to-b from-blue-500 to-cyan-500"
                        : "bg-gradient-to-b from-red-500 to-rose-500"
                    }`}
                  />

                  <div className="min-w-0 flex-1 pl-2">
                    <p className="truncate text-base font-semibold text-slate-900 dark:text-white mb-1">{t.title}</p>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      {t.category}
                    </p>
                  </div>

                  <div className="text-right shrink-0 ml-4">
                    <p
                      className={`text-base font-bold mb-1 ${
                        t.type === "income" ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {t.type === "income" ? "+" : "-"}Rp {t.amount.toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {t.date?.toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}
