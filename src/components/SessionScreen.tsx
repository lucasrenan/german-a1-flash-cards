import { useState } from 'react'
import type { Card, Rating, SessionStats, Settings } from '../types'
import { AnswerButtons } from './AnswerButtons'
import { FlashCard } from './FlashCard'

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
    <div className="flex flex-col gap-4 py-4 min-h-0">
      {/* Top bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={onExit}
          className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 flex-shrink-0"
          aria-label="End session"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex-1">
          <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mb-1">
            <span>{done} done</span>
            <span>{queue.length} left</span>
          </div>
          <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card */}
      <FlashCard
        card={card}
        isRevealed={isRevealed}
        autoplayAudio={settings.autoplayAudio}
        showExamplesByDefault={settings.showExamplesByDefault}
        audioPlaybackRate={settings.audioPlaybackRate}
        onReveal={() => setIsRevealed(true)}
      />

      {/* Answer buttons */}
      {isRevealed && <AnswerButtons onRate={handleRate} />}
    </div>
  )
}
