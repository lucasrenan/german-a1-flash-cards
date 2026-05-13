import type { SessionStats } from '../types'

interface Props {
  stats: SessionStats
  onHome: () => void
  onStudyAgain: () => void
}

export function SessionComplete({ stats, onHome, onStudyAgain }: Props) {
  const passed = stats.good + stats.easy
  const pct = stats.total > 0 ? Math.round((passed / stats.total) * 100) : 0

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-12 px-4 text-center">
      <div className="text-5xl">
        {pct >= 80 ? '🎉' : pct >= 50 ? '💪' : '📖'}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Session complete!</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{stats.total} cards reviewed</p>
      </div>

      <div className="w-full max-w-xs bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 grid grid-cols-2 gap-3">
        {[
          { label: 'Again', value: stats.again, color: 'text-red-500 dark:text-red-400' },
          { label: 'Hard', value: stats.hard, color: 'text-orange-500 dark:text-orange-400' },
          { label: 'Good', value: stats.good, color: 'text-green-600 dark:text-green-400' },
          { label: 'Easy', value: stats.easy, color: 'text-blue-500 dark:text-blue-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex flex-col items-center py-2">
            <span className={`text-2xl font-bold ${color}`}>{value}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={onStudyAgain}
          className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
        >
          Study Again
        </button>
        <button
          onClick={onHome}
          className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-100 font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 active:bg-slate-300 dark:active:bg-slate-500 transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}
