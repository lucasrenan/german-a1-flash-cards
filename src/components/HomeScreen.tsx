import type { DeckSummary, FilterMode, Settings } from '../types'
import { ConjugationIcon, ListIcon, SlidersIcon } from './icons'

interface Props {
  summary: DeckSummary
  filter: FilterMode
  settings: Settings
  onFilterChange: (f: FilterMode) => void
  onStart: () => void
  onOpenSettings: () => void
  onBrowseWords: () => void
  onBrowseVerbs: () => void
}

const FILTERS: { mode: FilterMode; label: string; key: keyof DeckSummary | null }[] = [
  { mode: 'all', label: 'All', key: 'total' },
  { mode: 'new', label: 'New', key: 'newCount' },
  { mode: 'due', label: 'Due', key: 'dueCount' },
  { mode: 'learning', label: 'Learning', key: 'learningCount' },
]

export function HomeScreen({
  summary,
  filter,
  settings,
  onFilterChange,
  onStart,
  onOpenSettings,
  onBrowseWords,
  onBrowseVerbs,
}: Props) {
  const sessionSize =
    filter === 'new'
      ? Math.min(summary.newCount, settings.newCardsPerSession)
      : filter === 'due'
        ? Math.min(summary.dueCount, settings.maxReviewsPerSession)
        : filter === 'learning'
          ? summary.learningCount
          : Math.min(summary.dueCount + summary.learningCount, settings.maxReviewsPerSession) +
            Math.min(summary.newCount, settings.newCardsPerSession)

  const canStart = sessionSize > 0

  const stats = [
    { label: 'New', value: summary.newCount, color: 'text-indigo-600 dark:text-indigo-400' },
    { label: 'Due', value: summary.dueCount, color: 'text-orange-500 dark:text-orange-400' },
    { label: 'Learning', value: summary.learningCount, color: 'text-green-600 dark:text-green-400' },
  ]

  return (
    <div className="flex flex-col gap-7 py-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-indigo-600 dark:text-indigo-400">Deutsch — Goethe A1</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Flash cards
          </h1>
        </div>
        <button
          onClick={onOpenSettings}
          aria-label="Settings"
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-card border-2 border-slate-200 text-slate-800 transition-colors hover:border-indigo-600 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-100 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
        >
          <SlidersIcon />
        </button>
      </div>

      {/* Deck at a glance */}
      <div className="grid grid-cols-3 gap-2">
        {stats.map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-card border-2 border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
          >
            <p className={`text-3xl font-bold tracking-tight ${color}`}>{value}</p>
            <p className="mt-1.5 text-xs font-semibold tracking-widest uppercase text-slate-500 dark:text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div>
        <p className="mb-3 text-xs font-semibold tracking-widest uppercase text-slate-500 dark:text-slate-400">What to study</p>
        <div className="grid grid-cols-4 gap-2">
          {FILTERS.map(({ mode, label, key }) => {
            const count = key ? summary[key] : null
            const isActive = filter === mode
            return (
              <button
                key={mode}
                onClick={() => onFilterChange(mode)}
                aria-pressed={isActive}
                className={`flex flex-col items-center rounded-card border-2 px-1 py-2.5 transition-colors ${
                  isActive
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-600'
                }`}
              >
                <span className="text-sm font-semibold tracking-tight">{label}</span>
                {count !== null && (
                  <span className={`mt-0.5 text-xs ${isActive ? 'opacity-60' : 'opacity-50'}`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Start */}
      <button
        onClick={onStart}
        disabled={!canStart}
        className={`w-full rounded-card border-2 py-4 text-base font-bold tracking-tight transition-colors ${
          canStart
            ? 'border-indigo-600 bg-indigo-600 text-white hover:border-indigo-700 hover:bg-indigo-700'
            : 'cursor-not-allowed border-slate-200 bg-transparent text-slate-400 dark:border-slate-700 dark:text-slate-500'
        }`}
      >
        {canStart ? `Start session · ${sessionSize} cards` : 'Nothing to study'}
      </button>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onBrowseWords}
          className="flex items-center justify-center gap-2 rounded-card border-2 border-slate-200 bg-white py-3 text-sm font-medium text-slate-800 transition-colors hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-600"
        >
          <ListIcon className="h-4 w-4" />
          Browse words
        </button>

        <button
          onClick={onBrowseVerbs}
          className="flex items-center justify-center gap-2 rounded-card border-2 border-slate-200 bg-white py-3 text-sm font-medium text-slate-800 transition-colors hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-600"
        >
          <ConjugationIcon className="h-4 w-4" />
          Verb tables
        </button>
      </div>

      <p className="text-center text-xs text-slate-400 dark:text-slate-500">
        {summary.total} cards in the deck
      </p>
    </div>
  )
}
