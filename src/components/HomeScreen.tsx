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
    { label: 'New', value: summary.newCount, color: 'text-vermilion' },
    { label: 'Due', value: summary.dueCount, color: 'text-brick dark:text-brick-light' },
    { label: 'Learning', value: summary.learningCount, color: 'text-moss dark:text-moss-light' },
  ]

  return (
    <div className="flex flex-col gap-7 py-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-eyebrow uppercase text-vermilion">Deutsch — Goethe A1</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-ink dark:text-cream">
            Flash cards
          </h1>
        </div>
        <button
          onClick={onOpenSettings}
          aria-label="Settings"
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-card border-2 border-ink/10 text-ink transition-colors hover:border-vermilion hover:text-vermilion dark:border-cream/15 dark:text-cream dark:hover:border-vermilion dark:hover:text-vermilion"
        >
          <SlidersIcon />
        </button>
      </div>

      {/* Deck at a glance */}
      <div className="grid grid-cols-3 gap-2">
        {stats.map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-card border-2 border-ink/10 bg-cream-paper p-4 dark:border-cream/15 dark:bg-ink-soft"
          >
            <p className={`font-display text-3xl font-bold tracking-tight ${color}`}>{value}</p>
            <p className="mt-1.5 text-eyebrow uppercase text-ink/50 dark:text-cream/50">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div>
        <p className="mb-3 text-eyebrow uppercase text-ink/50 dark:text-cream/50">What to study</p>
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
                    ? 'border-ink bg-ink text-cream dark:border-cream dark:bg-cream dark:text-ink'
                    : 'border-ink/10 bg-cream-paper text-ink hover:border-ink/30 dark:border-cream/15 dark:bg-ink-soft dark:text-cream dark:hover:border-cream/35'
                }`}
              >
                <span className="font-display text-sm font-semibold tracking-tight">{label}</span>
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
        className={`w-full rounded-card border-2 py-4 font-display text-base font-bold tracking-tight transition-colors ${
          canStart
            ? 'border-vermilion bg-vermilion text-cream-paper hover:border-vermilion-dark hover:bg-vermilion-dark'
            : 'cursor-not-allowed border-ink/10 bg-transparent text-ink/35 dark:border-cream/15 dark:text-cream/35'
        }`}
      >
        {canStart ? `Start session · ${sessionSize} cards` : 'Nothing to study'}
      </button>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onBrowseWords}
          className="flex items-center justify-center gap-2 rounded-card border-2 border-ink/10 bg-cream-paper py-3 text-sm font-medium text-ink transition-colors hover:border-ink/30 dark:border-cream/15 dark:bg-ink-soft dark:text-cream dark:hover:border-cream/35"
        >
          <ListIcon className="h-4 w-4" />
          Browse words
        </button>

        <button
          onClick={onBrowseVerbs}
          className="flex items-center justify-center gap-2 rounded-card border-2 border-ink/10 bg-cream-paper py-3 text-sm font-medium text-ink transition-colors hover:border-ink/30 dark:border-cream/15 dark:bg-ink-soft dark:text-cream dark:hover:border-cream/35"
        >
          <ConjugationIcon className="h-4 w-4" />
          Verb tables
        </button>
      </div>

      <p className="text-center text-xs text-ink/40 dark:text-cream/40">
        {summary.total} cards in the deck
      </p>
    </div>
  )
}
