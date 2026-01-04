"use client";

import { useEffect, useState } from "react";

/* ================= TYPES ================= */

type Settings = {
  dailyEnabled: boolean;
  dailyHour: number; // 0–23
  weeklyEnabled: boolean;
  weeklyDay: number; // 0=Sun … 6=Sat
  soundEnabled?: boolean;
  reminderTone?: "soft" | "normal" | "loud";
};

/* ================= CONSTANTS ================= */

const DEFAULT_SETTINGS: Settings = {
  dailyEnabled: true,
  dailyHour: 20,
  weeklyEnabled: true,
  weeklyDay: 0,
  soundEnabled: true,
  reminderTone: "normal",
};

/* ================= COMPONENT ================= */

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  /* ================= FETCH SETTINGS ================= */

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (!data) return;

        // merge biar ga ada undefined
        setSettings({
          ...DEFAULT_SETTINGS,
          ...data,
        });

        // sync ke localStorage biar home kebaca
        localStorage.setItem(
          "reminder-settings",
          JSON.stringify({
            ...DEFAULT_SETTINGS,
            ...data,
          })
        );
      })
      .finally(() => setLoading(false));
  }, []);

  /* ================= SAVE ================= */

  async function save() {
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    // sync ke localStorage (ini kunci reminder jalan)
    localStorage.setItem(
      "reminder-settings",
      JSON.stringify(settings)
    );

    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  }

  /* ================= UI ================= */

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-zinc-400">Loading settings…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-6 bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-200 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800">
      <div className="max-w-5xl mx-auto space-y-6">

        <h1 className="text-xl font-bold">Settings</h1>

        {/* DAILY REMINDER */}
        <div className="glass-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Daily reminder</p>
              <p className="text-sm text-zinc-400">
                Remind me to log expenses
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.dailyEnabled}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  dailyEnabled: e.target.checked,
                })
              }
            />
          </div>

          {settings.dailyEnabled && (
            <div className="flex items-center gap-3">
              <label className="text-sm text-zinc-400">Time</label>
              <input
                type="time"
                value={`${String(settings.dailyHour).padStart(2, "0")}:00`}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    dailyHour: Number(e.target.value.split(":")[0]),
                  })
                }
                className="border rounded px-2 py-1"
              />
            </div>
          )}
        </div>

        {/* WEEKLY REMINDER */}
        <div className="glass-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Weekly reminder</p>
              <p className="text-sm text-zinc-400">
                Reminder if no transactions this week
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.weeklyEnabled}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  weeklyEnabled: e.target.checked,
                })
              }
            />
          </div>

          {settings.weeklyEnabled && (
            <div className="flex items-center gap-3">
              <label className="text-sm text-zinc-400">Day</label>
              <select
                value={settings.weeklyDay}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    weeklyDay: Number(e.target.value),
                  })
                }
                className="border rounded px-2 py-1"
              >
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (d, i) => (
                    <option key={i} value={i}>
                      {d}
                    </option>
                  )
                )}
              </select>
            </div>
          )}
        </div>

        <div className="glass-card p-4 space-y-3">
          <p className="font-medium">Reminder sound</p>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  soundEnabled: e.target.checked,
                })
              }
            />
            Enable sound
          </label>

          {settings.soundEnabled && (
            <select
              value={settings.reminderTone}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  reminderTone: e.target.value as any,
                })
              }
              className="border rounded px-2 py-1"
            >
              <option value="soft">Soft</option>
              <option value="normal">Normal</option>
              <option value="loud">Loud</option>
            </select>
          )}
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={save}
          className="w-full bg-black text-white py-2 rounded-lg"
        >
          Save settings
        </button>

        {saved && (
          <div className="text-sm text-green-500">
            Saved ✔
          </div>
        )}
      </div>
    </main>
  );
}
