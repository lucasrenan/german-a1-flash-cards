import { useState, type ReactNode } from 'react'
import type { Settings, ThemePreference } from '../types'
import { CloseIcon, MonitorIcon, MoonIcon, SunIcon } from './icons'

interface Props {
  settings: Settings
  onSave: (settings: Settings) => void
  onThemeChange: (theme: ThemePreference) => void
  onClose: () => void
}

const THEME_OPTIONS: { value: ThemePreference; label: string; icon: ReactNode }[] = [
  { value: 'system', label: 'System', icon: <MonitorIcon className="h-4 w-4" /> },
  { value: 'light', label: 'Light', icon: <SunIcon className="h-4 w-4" /> },
  { value: 'dark', label: 'Dark', icon: <MoonIcon className="h-4 w-4" /> },
]

const FIELD_CLASS =
  'rounded-card border-2 border-slate-200 bg-white px-3 py-2.5 text-slate-800 transition-colors hover:border-slate-300 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-slate-600 dark:focus:border-indigo-500'

const LABEL_CLASS =
  'text-xs font-semibold tracking-widest uppercase text-slate-500 dark:text-slate-400'

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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 sm:items-center dark:bg-slate-950/70">
      <div className="max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-card border-2 border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-7 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-indigo-600 dark:text-indigo-400">
              Preferences
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
              Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-card border-2 border-slate-200 text-slate-800 transition-colors hover:border-indigo-600 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-100 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className={LABEL_CLASS}>Theme</span>
            <div role="radiogroup" aria-label="Theme" className="grid grid-cols-3 gap-2">
              {THEME_OPTIONS.map(({ value, label, icon }) => {
                const isActive = form.theme === value
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => handleThemeChange(value)}
                    className={`flex flex-col items-center justify-center gap-1.5 rounded-card border-2 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-slate-600'
                    }`}
                  >
                    {icon}
                    <span>{label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <label className="flex flex-col gap-2">
            <span className={LABEL_CLASS}>New cards per session</span>
            <input
              type="number"
              min={1}
              max={200}
              value={form.newCardsPerSession}
              onChange={(e) =>
                setForm((f) => ({ ...f, newCardsPerSession: Number(e.target.value) }))
              }
              className={FIELD_CLASS}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className={LABEL_CLASS}>Max review cards per session</span>
            <input
              type="number"
              min={1}
              max={500}
              value={form.maxReviewsPerSession}
              onChange={(e) =>
                setForm((f) => ({ ...f, maxReviewsPerSession: Number(e.target.value) }))
              }
              className={FIELD_CLASS}
            />
          </label>

          <Toggle
            label="Randomize new card order"
            checked={form.shuffleNewCards}
            onChange={() => setForm((f) => ({ ...f, shuffleNewCards: !f.shuffleNewCards }))}
          />

          <label className="flex flex-col gap-2">
            <span className={LABEL_CLASS}>Audio playback speed</span>
            <select
              value={form.audioPlaybackRate}
              onChange={(e) =>
                setForm((f) => ({ ...f, audioPlaybackRate: Number(e.target.value) }))
              }
              className={FIELD_CLASS}
            >
              <option value={0.5}>0.5× (very slow)</option>
              <option value={0.75}>0.75× (slow)</option>
              <option value={0.85}>0.85× (slightly slow)</option>
              <option value={1}>1× (normal)</option>
              <option value={1.25}>1.25× (fast)</option>
            </select>
          </label>

          <Toggle
            label="Autoplay audio"
            checked={form.autoplayAudio}
            onChange={() => setForm((f) => ({ ...f, autoplayAudio: !f.autoplayAudio }))}
          />

          <Toggle
            label="Show examples by default"
            checked={form.showExamplesByDefault}
            onChange={() =>
              setForm((f) => ({ ...f, showExamplesByDefault: !f.showExamplesByDefault }))
            }
          />

          <button
            type="submit"
            className="mt-1 w-full rounded-card border-2 border-indigo-600 bg-indigo-600 py-3.5 text-base font-bold tracking-tight text-white transition-colors hover:border-indigo-700 hover:bg-indigo-700"
          >
            Save changes
          </button>
        </form>
      </div>
    </div>
  )
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className="flex items-center justify-between gap-4 py-0.5">
      <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative h-7 w-12 flex-shrink-0 rounded-full border-2 transition-colors ${
          checked
            ? 'border-indigo-600 bg-indigo-600'
            : 'border-slate-200 bg-transparent dark:border-slate-700'
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full transition-transform ${
            checked ? 'translate-x-5 bg-white' : 'bg-slate-300 dark:bg-slate-500'
          }`}
        />
      </button>
    </label>
  )
}
