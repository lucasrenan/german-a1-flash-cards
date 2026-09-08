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
  new: 'border-slate-300 text-slate-500 dark:border-slate-600 dark:text-slate-400',
  learning:
    'border-orange-200 bg-orange-50 text-orange-600 dark:border-orange-800 dark:bg-transparent dark:text-orange-300',
  review:
    'border-green-200 bg-green-50 text-green-600 dark:border-green-800 dark:bg-transparent dark:text-green-400',
}

const STATUS_LABELS: Record<CardState['status'], string> = {
  new: 'New',
  learning: 'Learning',
  review: 'Review',
}

const RATING_STYLES: Record<Rating, string> = {
  again:
    'border-red-200 bg-red-50 text-red-600 dark:border-red-800 dark:bg-transparent dark:text-red-400',
  hard: 'border-orange-200 bg-orange-50 text-orange-600 dark:border-orange-800 dark:bg-transparent dark:text-orange-300',
  good: 'border-green-200 bg-green-50 text-green-600 dark:border-green-800 dark:bg-transparent dark:text-green-400',
  easy: 'border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-transparent dark:text-blue-300',
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
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-card border-2 border-slate-200 text-slate-800 transition-colors hover:border-indigo-600 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-100 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <p className="text-xs font-semibold tracking-widest uppercase text-indigo-600 dark:text-indigo-400">
            Deck
          </p>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Words
          </h1>
        </div>
        <span className="text-sm text-slate-500 dark:text-slate-400">{filtered.length}</span>
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
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-600'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* List */}
      {pageItems.length === 0 ? (
        <div className="rounded-card border-2 border-dashed border-slate-200 py-14 text-center dark:border-slate-700">
          <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 dark:text-slate-500">
            Nothing here
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            No cards carry this status yet.
          </p>
        </div>
      ) : (
        <div className="divide-y-2 divide-slate-200 overflow-hidden rounded-card border-2 border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-700 dark:bg-slate-800">
          {pageItems.map(({ card, state }) => (
            <div key={card.id} className="flex items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold tracking-tight text-slate-800 dark:text-slate-100">
                  {card.deWord}
                </p>
                <p className="truncate text-sm text-slate-500 dark:text-slate-400">{card.enWord}</p>
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
            className="flex items-center gap-2 rounded-card border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition-colors hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-600 dark:disabled:hover:border-slate-700"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Prev
          </button>
          <span className="text-xs font-semibold tracking-widest uppercase text-slate-500 dark:text-slate-400">
            {safePage} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            className="flex items-center gap-2 rounded-card border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition-colors hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-600 dark:disabled:hover:border-slate-700"
          >
            Next
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
