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
  { key: 'again', label: 'Again', bar: 'bg-red-600 dark:bg-red-500' },
  { key: 'hard', label: 'Hard', bar: 'bg-orange-500 dark:bg-orange-400' },
  { key: 'good', label: 'Good', bar: 'bg-green-600 dark:bg-green-500' },
  { key: 'easy', label: 'Easy', bar: 'bg-blue-600 dark:bg-blue-500' },
]

export function SessionComplete({ stats, onHome, onStudyAgain }: Props) {
  const passed = stats.good + stats.easy
  const pct = stats.total > 0 ? Math.round((passed / stats.total) * 100) : 0
  const { de, en } = verdict(pct)

  return (
    <div className="flex flex-col gap-8 py-10">
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-indigo-600 dark:text-indigo-400">Session complete</p>
        <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          {de}
        </h2>
        <p className="mt-3 text-slate-500 dark:text-slate-400">{en}</p>
        <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
          {stats.total} cards reviewed · {pct}% recalled
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {BREAKDOWN.map(({ key, label, bar }) => (
          <div
            key={key}
            className="overflow-hidden rounded-card border-2 border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
          >
            <div className={`h-1.5 ${bar}`} />
            <div className="p-4">
              <p className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                {stats[key]}
              </p>
              <p className="mt-1.5 text-xs font-semibold tracking-widest uppercase text-slate-500 dark:text-slate-400">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={onStudyAgain}
          className="w-full rounded-card border-2 border-indigo-600 bg-indigo-600 py-4 text-base font-bold tracking-tight text-white transition-colors hover:border-indigo-700 hover:bg-indigo-700"
        >
          Study again
        </button>
        <button
          onClick={onHome}
          className="w-full rounded-card border-2 border-slate-200 bg-white py-4 text-base font-semibold tracking-tight text-slate-800 transition-colors hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-600"
        >
          Back to home
        </button>
      </div>
    </div>
  )
}
