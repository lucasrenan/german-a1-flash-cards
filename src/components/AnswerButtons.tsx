import type { Rating } from '../types'

interface Props {
  onRate: (rating: Rating) => void
}

/**
 * Ratings run cold to warm across the semantic palette:
 * red (again) · orange (hard) · green (good) · blue (easy).
 */
const BUTTONS: {
  rating: Rating
  label: string
  sublabel: string
  key: string
  className: string
}[] = [
  {
    rating: 'again',
    label: 'Again',
    sublabel: '<1d',
    key: '1',
    className:
      'bg-red-50 border-red-600 text-red-600 hover:bg-red-700 hover:text-white dark:bg-transparent dark:border-red-500 dark:text-red-400 dark:hover:bg-red-400 dark:hover:text-slate-900',
  },
  {
    rating: 'hard',
    label: 'Hard',
    sublabel: '~1d',
    key: '2',
    className:
      'bg-orange-50 border-orange-500 text-orange-600 hover:bg-orange-600 hover:text-white dark:bg-transparent dark:border-orange-500 dark:text-orange-300 dark:hover:bg-orange-400 dark:hover:text-slate-900',
  },
  {
    rating: 'good',
    label: 'Good',
    sublabel: '~3d',
    key: '3',
    className:
      'bg-green-50 border-green-600 text-green-600 hover:bg-green-700 hover:text-white dark:bg-transparent dark:border-green-500 dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-slate-900',
  },
  {
    rating: 'easy',
    label: 'Easy',
    sublabel: '~7d',
    key: '4',
    className:
      'bg-blue-50 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white dark:bg-transparent dark:border-blue-500 dark:text-blue-300 dark:hover:bg-blue-400 dark:hover:text-slate-900',
  },
]

export function AnswerButtons({ onRate }: Props) {
  return (
    <div className="grid w-full grid-cols-4 gap-2 animate-fade-in">
      {BUTTONS.map(({ rating, label, sublabel, key, className }) => (
        <button
          key={rating}
          onClick={() => onRate(rating)}
          className={`relative flex flex-col items-center rounded-card border-2 px-1 py-3 transition-colors ${className}`}
        >
          {/* Shortcut hint only where a keyboard exists. */}
          <span
            aria-hidden="true"
            className="absolute right-1.5 top-1 hidden text-[10px] font-medium opacity-45 [@media(pointer:fine)]:block"
          >
            {key}
          </span>
          <span className="text-sm font-bold tracking-tight">{label}</span>
          <span className="mt-0.5 text-xs opacity-70">{sublabel}</span>
        </button>
      ))}
    </div>
  )
}
