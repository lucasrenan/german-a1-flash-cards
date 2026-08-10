import type { SessionStats } from '../types'

interface Props {
  stats: SessionStats
  onHome: () => void
  onStudyAgain: () => void
}

/** The verdict is the hero — a German line the learner can actually read at A1. */
function verdict(pct: number): { de: string; en: string } {
  if (pct >= 80) return { de: 'Sehr gut.', en: 'Most of these stuck. Recall is strong.' }
  if (pct >= 50) return { de: 'Gut gemacht.', en: 'Solid session. A few need another pass.' }
  return { de: 'Weiter so.', en: 'These need more repetitions. That is how it works.' }
}

const BREAKDOWN: { key: keyof Omit<SessionStats, 'total'>; label: string; bar: string }[] = [
  { key: 'again', label: 'Again', bar: 'bg-brick dark:bg-brick-light' },
  { key: 'hard', label: 'Hard', bar: 'bg-vermilion' },
  { key: 'good', label: 'Good', bar: 'bg-moss dark:bg-moss-light' },
  { key: 'easy', label: 'Easy', bar: 'bg-dandelion' },
]

export function SessionComplete({ stats, onHome, onStudyAgain }: Props) {
  const passed = stats.good + stats.easy
  const pct = stats.total > 0 ? Math.round((passed / stats.total) * 100) : 0
  const { de, en } = verdict(pct)

  return (
    <div className="flex flex-col gap-8 py-10">
      <div>
        <p className="text-eyebrow uppercase text-vermilion">Session complete</p>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink dark:text-cream">
          {de}
        </h2>
        <p className="mt-3 text-ink/60 dark:text-cream/60">{en}</p>
        <p className="mt-5 text-sm text-ink/50 dark:text-cream/50">
          {stats.total} cards reviewed · {pct}% recalled
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {BREAKDOWN.map(({ key, label, bar }) => (
          <div
            key={key}
            className="overflow-hidden rounded-card border-2 border-ink/10 bg-cream-paper dark:border-cream/15 dark:bg-ink-soft"
          >
            <div className={`h-1.5 ${bar}`} />
            <div className="p-4">
              <p className="font-display text-2xl font-bold tracking-tight text-ink dark:text-cream">
                {stats[key]}
              </p>
              <p className="mt-1.5 text-eyebrow uppercase text-ink/50 dark:text-cream/50">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={onStudyAgain}
          className="w-full rounded-card border-2 border-vermilion bg-vermilion py-4 font-display text-base font-bold tracking-tight text-cream-paper transition-colors hover:border-vermilion-dark hover:bg-vermilion-dark"
        >
          Study again
        </button>
        <button
          onClick={onHome}
          className="w-full rounded-card border-2 border-ink/10 bg-cream-paper py-4 font-display text-base font-semibold tracking-tight text-ink transition-colors hover:border-ink/30 dark:border-cream/15 dark:bg-ink-soft dark:text-cream dark:hover:border-cream/35"
        >
          Back to home
        </button>
      </div>
    </div>
  )
}
