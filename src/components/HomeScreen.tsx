import type { DeckSummary, FilterMode, Settings } from '../types'

interface Props {
  summary: DeckSummary
  filter: FilterMode
  settings: Settings
  onFilterChange: (f: FilterMode) => void
  onStart: () => void
  onOpenSettings: () => void
  onBrowseWords: () => void
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

  return (
    <div className="flex flex-col gap-6 py-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">A1 Flash Cards</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">German vocabulary 🇩🇪</p>
        </div>
        <button
          onClick={onOpenSettings}
          aria-label="Settings"
          className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'New', value: summary.newCount, color: 'text-indigo-600 dark:text-indigo-400' },
          { label: 'Due', value: summary.dueCount, color: 'text-orange-500 dark:text-orange-400' },
          { label: 'Learning', value: summary.learningCount, color: 'text-green-600 dark:text-green-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 text-center shadow-sm">
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div>
        <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Study</p>
        <div className="grid grid-cols-4 gap-2">
          {FILTERS.map(({ mode, label, key }) => {
            const count = key ? summary[key] : null
            const isActive = filter === mode
            return (
              <button
                key={mode}
                onClick={() => onFilterChange(mode)}
                className={`flex flex-col items-center py-2.5 px-1 rounded-xl border text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <span>{label}</span>
                {count !== null && (
                  <span className={`text-xs mt-0.5 ${isActive ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-500'}`}>{count}</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Start button */}
      <button
        onClick={onStart}
        disabled={!canStart}
        className={`w-full py-4 rounded-2xl font-semibold text-base shadow-sm transition-colors ${
          canStart
            ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
        }`}
      >
        {canStart ? `Start Session · ${sessionSize} cards` : 'Nothing to study'}
      </button>

      <button
        onClick={onBrowseWords}
        className="w-full py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700 active:bg-slate-100 dark:active:bg-slate-600 transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
        Browse all words
      </button>

      <p className="text-center text-xs text-slate-400 dark:text-slate-500">{summary.total} cards total in deck</p>
    </div>
  )
}
