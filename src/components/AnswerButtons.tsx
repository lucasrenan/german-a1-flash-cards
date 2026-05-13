import type { Rating } from '../types'

interface Props {
  onRate: (rating: Rating) => void
}

const BUTTONS: { rating: Rating; label: string; sublabel: string; className: string }[] = [
  {
    rating: 'again',
    label: 'Again',
    sublabel: '<1d',
    className:
      'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/50 active:bg-red-200 dark:active:bg-red-900/70',
  },
  {
    rating: 'hard',
    label: 'Hard',
    sublabel: '~1d',
    className:
      'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/50 active:bg-orange-200 dark:active:bg-orange-900/70',
  },
  {
    rating: 'good',
    label: 'Good',
    sublabel: '~3d',
    className:
      'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/50 active:bg-green-200 dark:active:bg-green-900/70',
  },
  {
    rating: 'easy',
    label: 'Easy',
    sublabel: '~7d',
    className:
      'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 active:bg-blue-200 dark:active:bg-blue-900/70',
  },
]

export function AnswerButtons({ onRate }: Props) {
  return (
    <div className="grid grid-cols-4 gap-2 w-full">
      {BUTTONS.map(({ rating, label, sublabel, className }) => (
        <button
          key={rating}
          onClick={() => onRate(rating)}
          className={`flex flex-col items-center py-3 px-1 rounded-xl border font-medium transition-colors ${className}`}
        >
          <span className="text-sm font-semibold">{label}</span>
          <span className="text-xs opacity-70 mt-0.5">{sublabel}</span>
        </button>
      ))}
    </div>
  )
}
