import { Fragment, useMemo, useState } from 'react'
import { verbs, type Verb, type VerbCategory } from '../data/verbs'

interface Props {
  onBack: () => void
}

type CategoryFilter = 'all' | VerbCategory

const FILTERS: { mode: CategoryFilter; label: string }[] = [
  { mode: 'all', label: 'All' },
  { mode: 'auxiliary', label: 'Auxiliary' },
  { mode: 'modal', label: 'Modal' },
  { mode: 'irregular', label: 'Irregular' },
  { mode: 'regular', label: 'Regular' },
]

const CATEGORY_STYLES: Record<VerbCategory, string> = {
  auxiliary: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
  modal: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300',
  irregular: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300',
  regular: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
}

const CATEGORY_LABELS: Record<VerbCategory, string> = {
  auxiliary: 'Auxiliary',
  modal: 'Modal',
  irregular: 'Irregular',
  regular: 'Regular',
}

const PRONOUN_LABELS: { key: keyof Verb['conjugation']; label: string }[] = [
  { key: 'ich', label: 'ich' },
  { key: 'du', label: 'du' },
  { key: 'erSieEs', label: 'er/sie/es' },
  { key: 'wir', label: 'wir' },
  { key: 'ihr', label: 'ihr' },
  { key: 'Sie', label: 'sie/Sie' },
]

export function VerbsScreen({ onBack }: Props) {
  const [filter, setFilter] = useState<CategoryFilter>('all')

  const filtered = useMemo(
    () => (filter === 'all' ? verbs : verbs.filter((v) => v.category === filter)),
    [filter],
  )

  return (
    <div className="flex flex-col gap-4 py-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          aria-label="Back"
          className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Verbs</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {filtered.length} of {verbs.length} verbs
          </p>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1">
        {FILTERS.map(({ mode, label }) => {
          const isActive = filter === mode
          return (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Verb cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">
          No verbs in this category
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((verb) => (
            <VerbCard key={verb.infinitive} verb={verb} />
          ))}
        </div>
      )}
    </div>
  )
}

function VerbCard({ verb }: { verb: Verb }) {
  return (
    <article className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 flex flex-col gap-3">
      {/* Title row */}
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight">
            {verb.infinitive}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{verb.english}</p>
        </div>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${CATEGORY_STYLES[verb.category]}`}
        >
          {CATEGORY_LABELS[verb.category]}
        </span>
      </header>

      {/* Conjugation table — subtle divider after er/sie/es separates singular from plural */}
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
        {PRONOUN_LABELS.map(({ key, label }, idx) => {
          const divider =
            idx === 3 ? 'pt-2 mt-1 border-t border-slate-100 dark:border-slate-700' : ''
          return (
            <Fragment key={key}>
              <dt className={`text-slate-500 dark:text-slate-400 font-medium ${divider}`}>
                {label}
              </dt>
              <dd className={`text-slate-800 dark:text-slate-100 font-mono ${divider}`}>
                {verb.conjugation[key]}
              </dd>
            </Fragment>
          )
        })}
      </dl>

      {/* Example */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
        <p className="text-sm text-slate-800 dark:text-slate-100 italic">
          “{verb.example.de}”
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {verb.example.en}
        </p>
      </div>
    </article>
  )
}
