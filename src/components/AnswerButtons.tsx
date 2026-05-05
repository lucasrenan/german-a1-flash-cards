import type { Rating } from '../types'

interface Props {
  onRate: (rating: Rating) => void
}

const BUTTONS: { rating: Rating; label: string; sublabel: string; className: string }[] = [
  {
    rating: 'again',
    label: 'Again',
    sublabel: '<1d',
    className: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100 active:bg-red-200',
  },
  {
    rating: 'hard',
    label: 'Hard',
    sublabel: '~1d',
    className: 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100 active:bg-orange-200',
  },
  {
    rating: 'good',
    label: 'Good',
    sublabel: '~3d',
    className: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 active:bg-green-200',
  },
  {
    rating: 'easy',
    label: 'Easy',
    sublabel: '~7d',
    className: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 active:bg-blue-200',
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
