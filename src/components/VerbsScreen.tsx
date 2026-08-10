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
  auxiliary: 'border-dandelion bg-dandelion-soft text-ink dark:bg-transparent dark:text-dandelion',
  modal: 'border-vermilion/40 bg-vermilion-soft text-vermilion-dark dark:bg-transparent dark:text-vermilion',
  irregular: 'border-brick/40 bg-brick-soft text-brick dark:border-brick-light/50 dark:bg-transparent dark:text-brick-light',
  regular: 'border-moss/40 bg-moss-soft text-moss dark:border-moss-light/50 dark:bg-transparent dark:text-moss-light',
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
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-card border-2 border-ink/10 text-ink transition-colors hover:border-vermilion hover:text-vermilion dark:border-cream/15 dark:text-cream dark:hover:border-vermilion dark:hover:text-vermilion"
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <p className="text-eyebrow uppercase text-vermilion">Präsens</p>
          <h1 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-ink dark:text-cream">
            Verbs
          </h1>
        </div>
        <span className="text-sm text-ink/50 dark:text-cream/50">
          {filtered.length}/{verbs.length}
        </span>
      </div>

      {/* Search */}
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40 dark:text-cream/40" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search verbs…"
          aria-label="Search verbs"
          className="w-full rounded-card border-2 border-ink/10 bg-cream-paper py-2.5 pl-10 pr-10 text-sm text-ink transition-colors placeholder:text-ink/40 hover:border-ink/30 focus:border-vermilion focus:outline-none dark:border-cream/15 dark:bg-ink-soft dark:text-cream dark:placeholder:text-cream/40 dark:hover:border-cream/35 dark:focus:border-vermilion"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-ink/50 transition-colors hover:text-vermilion dark:text-cream/50 dark:hover:text-vermilion"
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
                  ? 'border-ink bg-ink text-cream dark:border-cream dark:bg-cream dark:text-ink'
                  : 'border-ink/10 bg-cream-paper text-ink hover:border-ink/30 dark:border-cream/15 dark:bg-ink-soft dark:text-cream dark:hover:border-cream/35'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Verb cards */}
      {filtered.length === 0 ? (
        <div className="rounded-card border-2 border-dashed border-ink/15 py-14 text-center dark:border-cream/20">
          <p className="text-eyebrow uppercase text-ink/40 dark:text-cream/40">No match</p>
          <p className="mt-2 text-sm text-ink/60 dark:text-cream/60">
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
    <article className="flex flex-col overflow-hidden rounded-card border-2 border-ink/10 bg-cream-paper dark:border-cream/15 dark:bg-ink-soft">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        className="flex items-start justify-between gap-3 p-4 text-left transition-colors hover:bg-ink/5 dark:hover:bg-cream/5"
      >
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-lg font-bold leading-tight tracking-tight text-ink dark:text-cream">
            {verb.infinitive}
          </h2>
          <p className="mt-1 text-sm text-ink/55 dark:text-cream/55">{verb.english}</p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          <span
            className={`whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${CATEGORY_STYLES[verb.category]}`}
          >
            {CATEGORY_LABELS[verb.category]}
          </span>
          <ChevronDownIcon
            className={`h-4 w-4 text-ink/40 transition-transform dark:text-cream/40 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="flex flex-col gap-3 px-4 pb-4">
          {/* Conjugation table — the rule after er/sie/es splits singular from plural. */}
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
            {PRONOUN_LABELS.map(({ key, label }, idx) => {
              const divider = idx === 3 ? 'mt-1.5 border-t-2 border-ink/10 pt-3 dark:border-cream/10' : ''
              return (
                <Fragment key={key}>
                  <dt className={`text-ink/50 dark:text-cream/50 ${divider}`}>{label}</dt>
                  <dd
                    className={`font-display font-semibold tracking-tight text-ink dark:text-cream ${divider}`}
                  >
                    {verb.conjugation[key]}
                  </dd>
                </Fragment>
              )
            })}
          </dl>

          {/* Example */}
          <div className="border-t-2 border-ink/10 pt-3 dark:border-cream/10">
            <p className="text-sm text-ink dark:text-cream">“{verb.example.de}”</p>
            <p className="mt-1 text-xs text-ink/50 dark:text-cream/50">{verb.example.en}</p>
          </div>
        </div>
      )}
    </article>
  )
}
