import { useState, type ReactNode } from 'react'
import type { Settings, ThemePreference } from '../types'

interface Props {
  settings: Settings
  onSave: (settings: Settings) => void
  onThemeChange: (theme: ThemePreference) => void
  onClose: () => void
}

const THEME_OPTIONS: { value: ThemePreference; label: string; icon: ReactNode }[] = [
  {
    value: 'system',
    label: 'System',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    value: 'light',
    label: 'Light',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    ),
  },
]

export function SettingsModal({ settings, onSave, onThemeChange, onClose }: Props) {
  const [form, setForm] = useState<Settings>(settings)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave(form)
    onClose()
  }

  function handleThemeChange(theme: ThemePreference) {
    setForm((f) => ({ ...f, theme }))
    onThemeChange(theme)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 dark:bg-black/60">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Settings</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Theme</span>
            <div
              role="radiogroup"
              aria-label="Theme"
              className="grid grid-cols-3 gap-2"
            >
              {THEME_OPTIONS.map(({ value, label, icon }) => {
                const isActive = form.theme === value
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => handleThemeChange(value)}
                    className={`flex flex-col items-center justify-center gap-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
                    }`}
                  >
                    {icon}
                    <span>{label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">New cards per session</span>
            <input
              type="number"
              min={1}
              max={200}
              value={form.newCardsPerSession}
              onChange={(e) => setForm((f) => ({ ...f, newCardsPerSession: Number(e.target.value) }))}
              className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Max review cards per session</span>
            <input
              type="number"
              min={1}
              max={500}
              value={form.maxReviewsPerSession}
              onChange={(e) => setForm((f) => ({ ...f, maxReviewsPerSession: Number(e.target.value) }))}
              className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Audio playback speed</span>
            <select
              value={form.audioPlaybackRate}
              onChange={(e) => setForm((f) => ({ ...f, audioPlaybackRate: Number(e.target.value) }))}
              className="border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value={0.5}>0.5× (very slow)</option>
              <option value={0.75}>0.75× (slow)</option>
              <option value={0.85}>0.85× (slightly slow)</option>
              <option value={1}>1× (normal)</option>
              <option value={1.25}>1.25× (fast)</option>
            </select>
          </label>

          <label className="flex items-center justify-between py-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Autoplay audio</span>
            <button
              type="button"
              role="switch"
              aria-checked={form.autoplayAudio}
              onClick={() => setForm((f) => ({ ...f, autoplayAudio: !f.autoplayAudio }))}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                form.autoplayAudio ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  form.autoplayAudio ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </label>

          <label className="flex items-center justify-between py-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Show examples by default</span>
            <button
              type="button"
              role="switch"
              aria-checked={form.showExamplesByDefault}
              onClick={() => setForm((f) => ({ ...f, showExamplesByDefault: !f.showExamplesByDefault }))}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                form.showExamplesByDefault ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  form.showExamplesByDefault ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </label>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  )
}
