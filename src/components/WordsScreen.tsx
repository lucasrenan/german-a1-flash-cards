import { useMemo, useState } from 'react'
import type { Card, CardState, Rating } from '../types'
import { createInitialState } from '../lib/sm2'

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

const STATUS_STYLES: Record<CardState['status'], string> = {
  new: 'bg-slate-100 text-slate-600',
  learning: 'bg-orange-100 text-orange-700',
  review: 'bg-green-100 text-green-700',
}

const RATING_STYLES: Record<Rating, string> = {
  again: 'bg-red-100 text-red-700',
  hard: 'bg-orange-100 text-orange-700',
  good: 'bg-green-100 text-green-700',
  easy: 'bg-blue-100 text-blue-700',
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
    <div className="flex flex-col gap-4 py-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          aria-label="Back"
          className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 active:bg-slate-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-800">Words</h1>
          <p className="text-xs text-slate-500">{filtered.length} cards</p>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1">
        {FILTERS.map(({ mode, label }) => {
          const isActive = filter === mode
          return (
            <button
              key={mode}
              onClick={() => changeFilter(mode)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* List */}
      {pageItems.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">No cards in this filter</div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {pageItems.map(({ card, state }) => (
            <div key={card.id} className="flex items-center gap-3 p-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 truncate">{card.deWord}</p>
                <p className="text-sm text-slate-500 truncate">{card.enWord}</p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[state.status]}`}
                >
                  {state.status === 'new' ? 'New' : state.status === 'learning' ? 'Learning' : 'Review'}
                </span>
                {state.lastRating && (
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${RATING_STYLES[state.lastRating]}`}
                  >
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
        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          <span className="text-sm text-slate-500">
            Page {safePage} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
