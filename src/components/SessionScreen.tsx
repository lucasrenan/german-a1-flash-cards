import { useEffect, useRef, useState } from 'react'
import type { Card, Rating, SessionStats, Settings } from '../types'
import { AnswerButtons } from './AnswerButtons'
import { FlashCard } from './FlashCard'
import { CloseIcon } from './icons'

interface Props {
  queue: string[]
  cardMap: Map<string, Card>
  settings: Settings
  onRate: (cardId: string, rating: Rating) => void
  onExit: () => void
  stats: SessionStats
}

const RATING_KEYS: Record<string, Rating> = {
  '1': 'again',
  '2': 'hard',
  '3': 'good',
  '4': 'easy',
}

export function SessionScreen({ queue, cardMap, settings, onRate, onExit, stats }: Props) {
  const [isRevealed, setIsRevealed] = useState(false)

  const total = stats.total + queue.length
  const done = stats.total
  const progress = total > 0 ? (done / total) * 100 : 0

  const currentId = queue[0]
  const card = currentId ? cardMap.get(currentId) : undefined

  function handleRate(rating: Rating) {
    if (!card) return
    setIsRevealed(false)
    onRate(card.id, rating)
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.metaKey || e.ctrlKey || e.altKey) return

    if (e.key === ' ' || e.key === 'Enter') {
      // Space and Enter belong to whatever control has focus — the card and the
      // answer buttons already handle their own activation.
      const target = e.target as HTMLElement | null
      if (target?.closest('button, [role="button"], input, textarea, select')) return
      e.preventDefault()
      setIsRevealed((v) => !v)
      return
    }

    const rating = RATING_KEYS[e.key]
    if (rating && isRevealed) {
      e.preventDefault()
      handleRate(rating)
    }
  }

  // Held in a ref so the listener subscribes once yet never rates a stale card.
  const handlerRef = useRef(handleKeyDown)
  useEffect(() => {
    handlerRef.current = handleKeyDown
  })

  useEffect(() => {
    const listener = (e: KeyboardEvent) => handlerRef.current(e)
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [])

  if (!card) return null

  return (
    <div className="flex min-h-0 flex-col gap-5 py-6">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <button
          onClick={onExit}
          aria-label="End session"
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-card border-2 border-ink/10 text-ink transition-colors hover:border-vermilion hover:text-vermilion dark:border-cream/15 dark:text-cream dark:hover:border-vermilion dark:hover:text-vermilion"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

        <div className="flex-1">
          <div className="mb-2 flex justify-between text-eyebrow uppercase text-ink/50 dark:text-cream/50">
            <span>{done} done</span>
            <span>{queue.length} left</span>
          </div>
          <div className="h-[6px] w-full bg-ink/10 dark:bg-cream/15">
            <div
              className="h-full bg-vermilion transition-all duration-300 ease-card"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <FlashCard
        card={card}
        isRevealed={isRevealed}
        autoplayAudio={settings.autoplayAudio}
        showExamplesByDefault={settings.showExamplesByDefault}
        audioPlaybackRate={settings.audioPlaybackRate}
        onToggleReveal={() => setIsRevealed((v) => !v)}
      />

      {isRevealed && <AnswerButtons onRate={handleRate} />}
    </div>
  )
}
