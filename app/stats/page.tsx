"use client"

import { ArrowRight, TrendingUp, PieChart, BarChart3, Calendar, Target } from "lucide-react"

export default function StatsPage() {
  return (
    <main className="min-h-screen px-4 py-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Insights</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Analytics and trends coming soon</p>
      </div>

      {/* Featured Insight Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 p-6 mb-6 shadow-lg shadow-blue-500/20">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-blue-100">Spending Overview</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Your Financial Trends</h2>
          <p className="text-blue-100 text-sm mb-4">Weekly and monthly insights into your spending habits</p>
          <div className="inline-flex items-center gap-2 text-white text-sm font-medium">
            <span>View detailed analytics</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
        {/* Decorative gradient orbs */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-400/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-blue-400/30 rounded-full blur-2xl"></div>
      </div>

      {/* Insight Cards Grid */}
      <div className="grid gap-4 mb-6">
        {/* Top Categories Card */}
        <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
                <PieChart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Top Categories</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Where your money goes</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700/50 rounded-lg animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-3 bg-slate-100 dark:bg-slate-700/50 rounded w-24 mb-2 animate-pulse"></div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700/50 rounded w-full animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Comparison Card */}
        <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyan-50 dark:bg-cyan-500/10 rounded-xl">
                <BarChart3 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Monthly Comparison</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Track your progress</p>
              </div>
            </div>
          </div>
          <div className="h-32 bg-slate-50 dark:bg-slate-700/30 rounded-xl flex items-end justify-around p-4 gap-2">
            {[60, 80, 45, 90, 70].map((height, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-blue-500/20 to-cyan-500/20 rounded-t animate-pulse"
                style={{ height: `${height}%` }}
              ></div>
            ))}
          </div>
        </div>

        {/* Spending Habits Card */}
        <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 dark:bg-purple-500/10 rounded-xl">
                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Spending Habits</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Daily patterns</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 28 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-slate-100 dark:bg-slate-700/50 rounded animate-pulse"
                style={{ animationDelay: `${i * 50}ms` }}
              ></div>
            ))}
          </div>
        </div>

        {/* Budget Goals Card */}
        <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl">
                <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Budget Goals</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Track your targets</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {[75, 45, 90].map((progress, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <div className="h-3 bg-slate-100 dark:bg-slate-700/50 rounded w-20 animate-pulse"></div>
                  <div className="h-3 bg-slate-100 dark:bg-slate-700/50 rounded w-12 animate-pulse"></div>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Coming Soon Footer */}
      <div className="text-center py-8">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Advanced analytics coming soon</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Get insights into trends, biggest expenses, and spending habits
        </p>
      </div>
    </main>
  )
}
