import { Fragment, useMemo, useState } from 'react'
import { verbs, type Verb, type VerbCategory } from '../data/verbs'
import { ArrowLeftIcon, ChevronDownIcon, CloseIcon, SearchIcon } from './icons'

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

/** One accent per category, so a verb's class is readable at a glance. */
const CATEGORY_STYLES: Record<VerbCategory, string> = {
  auxiliary: 'border-purple-200 bg-purple-50 text-purple-600 dark:border-purple-800 dark:bg-transparent dark:text-purple-300',
  modal: 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:bg-transparent dark:text-indigo-400',
  irregular: 'border-orange-200 bg-orange-50 text-orange-600 dark:border-orange-800 dark:bg-transparent dark:text-orange-300',
  regular: 'border-green-200 bg-green-50 text-green-600 dark:border-green-800 dark:bg-transparent dark:text-green-400',
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
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const byCategory = filter === 'all' ? verbs : verbs.filter((v) => v.category === filter)
    const q = query.trim().toLowerCase()
    if (!q) return byCategory
    return byCategory.filter((v) => {
      if (v.infinitive.toLowerCase().includes(q)) return true
      if (v.english.toLowerCase().includes(q)) return true
      return Object.values(v.conjugation).some((form) => form.toLowerCase().includes(q))
    })
  }, [filter, query])

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
          <p className="text-xs font-semibold tracking-widest uppercase text-indigo-600 dark:text-indigo-400">Präsens</p>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Verbs
          </h1>
        </div>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {filtered.length}/{verbs.length}
        </span>
      </div>

      {/* Search */}
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search verbs…"
          aria-label="Search verbs"
          className="w-full rounded-card border-2 border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-800 transition-colors placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-indigo-500"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {FILTERS.map(({ mode, label }) => {
          const isActive = filter === mode
          return (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
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

      {/* Verb cards */}
      {filtered.length === 0 ? (
        <div className="rounded-card border-2 border-dashed border-slate-200 py-14 text-center dark:border-slate-700">
          <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 dark:text-slate-500">No match</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Try a different spelling, or clear the filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {filtered.map((verb) => (
            <VerbCard key={verb.infinitive} verb={verb} />
          ))}
        </div>
      )}
    </div>
  )
}

function VerbCard({ verb }: { verb: Verb }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <article className="flex flex-col overflow-hidden rounded-card border-2 border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        className="flex items-start justify-between gap-3 p-4 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold leading-tight tracking-tight text-slate-800 dark:text-slate-100">
            {verb.infinitive}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{verb.english}</p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          <span
            className={`whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${CATEGORY_STYLES[verb.category]}`}
          >
            {CATEGORY_LABELS[verb.category]}
          </span>
          <ChevronDownIcon
            className={`h-4 w-4 text-slate-400 transition-transform dark:text-slate-500 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="flex flex-col gap-3 px-4 pb-4">
          {/* Conjugation table — the rule after er/sie/es splits singular from plural. */}
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
            {PRONOUN_LABELS.map(({ key, label }, idx) => {
              const divider = idx === 3 ? 'mt-1.5 border-t-2 border-slate-200 pt-3 dark:border-slate-800' : ''
              return (
                <Fragment key={key}>
                  <dt className={`text-slate-500 dark:text-slate-400 ${divider}`}>{label}</dt>
                  <dd
                    className={`font-semibold tracking-tight text-slate-800 dark:text-slate-100 ${divider}`}
                  >
                    {verb.conjugation[key]}
                  </dd>
                </Fragment>
              )
            })}
          </dl>

          {/* Example */}
          <div className="border-t-2 border-slate-200 pt-3 dark:border-slate-800">
            <p className="text-sm text-slate-800 dark:text-slate-100">“{verb.example.de}”</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{verb.example.en}</p>
          </div>
        </div>
      )}
    </article>
  )
}
