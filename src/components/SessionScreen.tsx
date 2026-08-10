import { useState } from 'react'
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

export function SessionScreen({ queue, cardMap, settings, onRate, onExit, stats }: Props) {
  const [isRevealed, setIsRevealed] = useState(false)

  const total = stats.total + queue.length
  const done = stats.total
  const progress = total > 0 ? (done / total) * 100 : 0

  const currentId = queue[0]
  const card = currentId ? cardMap.get(currentId) : undefined

  if (!card) return null

  function handleRate(rating: Rating) {
    setIsRevealed(false)
    onRate(card!.id, rating)
  }

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
