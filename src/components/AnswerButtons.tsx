import type { Rating } from '../types'

interface Props {
  onRate: (rating: Rating) => void
}

/**
 * Ratings run cold to warm across the semantic palette:
 * brick (again) · vermilion (hard) · moss (good) · dandelion (easy).
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
      'bg-brick-soft border-brick text-brick hover:bg-brick hover:text-cream-paper dark:bg-transparent dark:border-brick-light dark:text-brick-light dark:hover:bg-brick-light dark:hover:text-ink',
  },
  {
    rating: 'hard',
    label: 'Hard',
    sublabel: '~1d',
    key: '2',
    className:
      'bg-vermilion-soft border-vermilion text-vermilion-dark hover:bg-vermilion hover:text-cream-paper dark:bg-transparent dark:border-vermilion dark:text-vermilion dark:hover:bg-vermilion dark:hover:text-ink',
  },
  {
    rating: 'good',
    label: 'Good',
    sublabel: '~3d',
    key: '3',
    className:
      'bg-moss-soft border-moss text-moss hover:bg-moss hover:text-cream-paper dark:bg-transparent dark:border-moss-light dark:text-moss-light dark:hover:bg-moss-light dark:hover:text-ink',
  },
  {
    rating: 'easy',
    label: 'Easy',
    sublabel: '~7d',
    key: '4',
    className:
      'bg-dandelion-soft border-dandelion text-ink hover:bg-dandelion hover:text-ink dark:bg-transparent dark:border-dandelion dark:text-dandelion dark:hover:bg-dandelion dark:hover:text-ink',
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
          <span className="font-display text-sm font-bold tracking-tight">{label}</span>
          <span className="mt-0.5 text-xs opacity-70">{sublabel}</span>
        </button>
      ))}
    </div>
  )
}
