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
  'rounded-card border-2 border-ink/10 bg-cream-paper px-3 py-2.5 text-ink transition-colors hover:border-ink/30 focus:border-vermilion focus:outline-none dark:border-cream/15 dark:bg-ink dark:text-cream dark:hover:border-cream/35 dark:focus:border-vermilion'

const LABEL_CLASS = 'text-eyebrow uppercase text-ink/50 dark:text-cream/50'

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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-4 sm:items-center dark:bg-ink/70">
      <div className="max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-card border-2 border-ink bg-cream p-6 dark:border-cream/20 dark:bg-ink-soft">
        <div className="mb-7 flex items-start justify-between gap-4">
          <div>
            <p className="text-eyebrow uppercase text-vermilion">Preferences</p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink dark:text-cream">
              Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-card border-2 border-ink/10 text-ink transition-colors hover:border-vermilion hover:text-vermilion dark:border-cream/15 dark:text-cream dark:hover:border-vermilion dark:hover:text-vermilion"
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
                        ? 'border-ink bg-ink text-cream dark:border-cream dark:bg-cream dark:text-ink'
                        : 'border-ink/10 bg-cream-paper text-ink hover:border-ink/30 dark:border-cream/15 dark:bg-ink dark:text-cream dark:hover:border-cream/35'
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
              onChange={(e) => setForm((f) => ({ ...f, newCardsPerSession: Number(e.target.value) }))}
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
              onChange={(e) => setForm((f) => ({ ...f, maxReviewsPerSession: Number(e.target.value) }))}
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
              onChange={(e) => setForm((f) => ({ ...f, audioPlaybackRate: Number(e.target.value) }))}
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
            onChange={() => setForm((f) => ({ ...f, showExamplesByDefault: !f.showExamplesByDefault }))}
          />

          <button
            type="submit"
            className="mt-1 w-full rounded-card border-2 border-vermilion bg-vermilion py-3.5 font-display text-base font-bold tracking-tight text-cream-paper transition-colors hover:border-vermilion-dark hover:bg-vermilion-dark"
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
      <span className="text-sm font-medium text-ink dark:text-cream">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative h-7 w-12 flex-shrink-0 rounded-full border-2 transition-colors ${
          checked
            ? 'border-vermilion bg-vermilion'
            : 'border-ink/15 bg-transparent dark:border-cream/20'
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full transition-transform ${
            checked
              ? 'translate-x-5 bg-cream-paper'
              : 'bg-ink/30 dark:bg-cream/40'
          }`}
        />
      </button>
    </label>
  )
}
