import { useMemo, useState } from 'react'
import type { Card, CardState, Rating } from '../types'
import { createInitialState } from '../lib/sm2'
import { ArrowLeftIcon, ArrowRightIcon } from './icons'

interface Props {
  cards: Card[]
  cardStates: Record<string, CardState>
  onBack: () => void
}

type StatusFilter = 'all' | 'new' | 'learning' | 'review'

const PAGE_SIZE = 25

const FILTERS: { mode: StatusFilter; label: string }[] = [
  { mode: 'all', label: 'All' },
  { mode: 'new', label: 'New' },
  { mode: 'learning', label: 'Learning' },
  { mode: 'review', label: 'Review' },
]

const BADGE_BASE =
  'rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap'

const STATUS_STYLES: Record<CardState['status'], string> = {
  new: 'border-ink/20 text-ink/55 dark:border-cream/25 dark:text-cream/55',
  learning: 'border-vermilion/40 bg-vermilion-soft text-vermilion-dark dark:bg-transparent dark:text-vermilion',
  review: 'border-moss/40 bg-moss-soft text-moss dark:border-moss-light/50 dark:bg-transparent dark:text-moss-light',
}

const STATUS_LABELS: Record<CardState['status'], string> = {
  new: 'New',
  learning: 'Learning',
  review: 'Review',
}

const RATING_STYLES: Record<Rating, string> = {
  again: 'border-brick/40 bg-brick-soft text-brick dark:border-brick-light/50 dark:bg-transparent dark:text-brick-light',
  hard: 'border-vermilion/40 bg-vermilion-soft text-vermilion-dark dark:bg-transparent dark:text-vermilion',
  good: 'border-moss/40 bg-moss-soft text-moss dark:border-moss-light/50 dark:bg-transparent dark:text-moss-light',
  easy: 'border-dandelion bg-dandelion-soft text-ink dark:bg-transparent dark:text-dandelion',
}

const RATING_LABELS: Record<Rating, string> = {
  again: 'Again',
  hard: 'Hard',
  good: 'Good',
  easy: 'Easy',
}

export function WordsScreen({ cards, cardStates, onBack }: Props) {
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return cards
      .map((card) => ({
        card,
        state: cardStates[card.id] ?? createInitialState(card.id),
      }))
      .filter(({ state }) => filter === 'all' || state.status === filter)
  }, [cards, cardStates, filter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const startIdx = (safePage - 1) * PAGE_SIZE
  const pageItems = filtered.slice(startIdx, startIdx + PAGE_SIZE)

  function changeFilter(f: StatusFilter) {
    setFilter(f)
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-5 py-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          aria-label="Back"
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-card border-2 border-ink/10 text-ink transition-colors hover:border-vermilion hover:text-vermilion dark:border-cream/15 dark:text-cream dark:hover:border-vermilion dark:hover:text-vermilion"
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <p className="text-eyebrow uppercase text-vermilion">Deck</p>
          <h1 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-ink dark:text-cream">
            Words
          </h1>
        </div>
        <span className="text-sm text-ink/50 dark:text-cream/50">{filtered.length}</span>
      </div>

      {/* Filters */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {FILTERS.map(({ mode, label }) => {
          const isActive = filter === mode
          return (
            <button
              key={mode}
              onClick={() => changeFilter(mode)}
              aria-pressed={isActive}
              className={`whitespace-nowrap rounded-card border-2 px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-ink bg-ink text-cream dark:border-cream dark:bg-cream dark:text-ink'
                  : 'border-ink/10 bg-cream-paper text-ink hover:border-ink/30 dark:border-cream/15 dark:bg-ink-soft dark:text-cream dark:hover:border-cream/35'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* List */}
      {pageItems.length === 0 ? (
        <div className="rounded-card border-2 border-dashed border-ink/15 py-14 text-center dark:border-cream/20">
          <p className="text-eyebrow uppercase text-ink/40 dark:text-cream/40">Nothing here</p>
          <p className="mt-2 text-sm text-ink/60 dark:text-cream/60">
            No cards carry this status yet.
          </p>
        </div>
      ) : (
        <div className="divide-y-2 divide-ink/10 overflow-hidden rounded-card border-2 border-ink/10 bg-cream-paper dark:divide-cream/10 dark:border-cream/15 dark:bg-ink-soft">
          {pageItems.map(({ card, state }) => (
            <div key={card.id} className="flex items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-display font-semibold tracking-tight text-ink dark:text-cream">
                  {card.deWord}
                </p>
                <p className="truncate text-sm text-ink/55 dark:text-cream/55">{card.enWord}</p>
              </div>
              <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
                <span className={`${BADGE_BASE} ${STATUS_STYLES[state.status]}`}>
                  {STATUS_LABELS[state.status]}
                </span>
                {state.lastRating && (
                  <span className={`${BADGE_BASE} ${RATING_STYLES[state.lastRating]}`}>
                    {RATING_LABELS[state.lastRating]}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            className="flex items-center gap-2 rounded-card border-2 border-ink/10 bg-cream-paper px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink/30 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-ink/10 dark:border-cream/15 dark:bg-ink-soft dark:text-cream dark:hover:border-cream/35 dark:disabled:hover:border-cream/15"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Prev
          </button>
          <span className="text-eyebrow uppercase text-ink/50 dark:text-cream/50">
            {safePage} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            className="flex items-center gap-2 rounded-card border-2 border-ink/10 bg-cream-paper px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink/30 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-ink/10 dark:border-cream/15 dark:bg-ink-soft dark:text-cream dark:hover:border-cream/35 dark:disabled:hover:border-cream/15"
          >
            Next
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
