import { useEffect, useRef, useState } from 'react'
import type { Card } from '../types'
import { ChevronRightIcon, FlipIcon, SpeakerIcon } from './icons'

interface Props {
  card: Card
  isRevealed: boolean
  autoplayAudio: boolean
  showExamplesByDefault: boolean
  audioPlaybackRate: number
  onToggleReveal: () => void
}

export function FlashCard({
  card,
  isRevealed,
  autoplayAudio,
  showExamplesByDefault,
  audioPlaybackRate,
  onToggleReveal,
}: Props) {
  const [showFrontExample, setShowFrontExample] = useState(showExamplesByDefault)
  const [showBackExample, setShowBackExample] = useState(showExamplesByDefault)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    setShowFrontExample(showExamplesByDefault)
    setShowBackExample(showExamplesByDefault)
    setIsPlaying(false)
    audioRef.current = null
  }, [card.id, showExamplesByDefault])

  useEffect(() => {
    if (autoplayAudio) {
      playAudio()
    }
  }, [card.id, autoplayAudio])

  function playAudio() {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    const audio = new Audio(card.audioUrl)
    audio.playbackRate = audioPlaybackRate
    audioRef.current = audio
    audio.onplay = () => setIsPlaying(true)
    audio.onended = () => setIsPlaying(false)
    audio.onerror = () => setIsPlaying(false)
    audio.play().catch(() => setIsPlaying(false))
  }

  /** The card itself is the flip target, so inner controls must not bubble into it. */
  function stopPropagation(e: React.MouseEvent) {
    e.stopPropagation()
  }

  function handleCardKeyDown(e: React.KeyboardEvent) {
    if (e.target !== e.currentTarget) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onToggleReveal()
    }
  }

  const hasBackExample = Boolean(card.deSentence || card.enSentence)

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="relative">
        {/* Deck underneath: two layers peeking out below the active card. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 translate-y-[14px] scale-[0.94] rounded-card border-2 border-ink/10 bg-cream-paper opacity-50 dark:border-cream/10 dark:bg-ink-soft"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 translate-y-[7px] scale-[0.97] rounded-card border-2 border-ink/10 bg-cream-paper opacity-80 dark:border-cream/10 dark:bg-ink-soft"
        />

        <div
          role="button"
          tabIndex={0}
          aria-label={isRevealed ? 'Flip back to the German side' : 'Flip the card'}
          onClick={onToggleReveal}
          onKeyDown={handleCardKeyDown}
          className="card-perspective relative cursor-pointer rounded-card"
        >
          <div className={`card-3d grid min-h-[17rem] ${isRevealed ? 'card-flipped' : ''}`}>
            {/* Front — German, on paper */}
            <div
              aria-hidden={isRevealed}
              className="card-face [grid-area:1/1] flex flex-col rounded-card border-2 border-ink/10 bg-cream-paper p-6 dark:border-cream/15 dark:bg-ink-soft"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-eyebrow uppercase text-vermilion">Deutsch</p>
                  <p className="mt-3 break-words font-display text-word font-bold text-ink dark:text-cream">
                    {card.deWord}
                  </p>
                </div>
                <SpeakerButton
                  onClick={playAudio}
                  stopPropagation={stopPropagation}
                  isPlaying={isPlaying}
                  tabIndex={isRevealed ? -1 : undefined}
                  tone="front"
                />
              </div>

              {card.deSentence && (
                <div className="mt-auto pt-6">
                  <Disclosure
                    isOpen={showFrontExample}
                    onToggle={() => setShowFrontExample((v) => !v)}
                    stopPropagation={stopPropagation}
                    tabIndex={isRevealed ? -1 : undefined}
                    tone="front"
                  />
                  {showFrontExample && (
                    <p className="mt-2 text-sm leading-relaxed text-ink/70 dark:text-cream/70">
                      {card.deSentence}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Back — English, on ink. Crossing to the answer flips the color scheme.
                The German stays in view above it: the pairing is what gets memorized. */}
            <div
              aria-hidden={!isRevealed}
              className="card-face card-face-back [grid-area:1/1] flex flex-col rounded-card border-2 border-ink bg-ink p-6 dark:border-dandelion/35"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-eyebrow uppercase text-dandelion/60">Deutsch</p>
                  <p className="mt-1.5 break-words font-display text-xl font-bold text-cream/80">
                    {card.deWord}
                  </p>
                </div>
                <SpeakerButton
                  onClick={playAudio}
                  stopPropagation={stopPropagation}
                  isPlaying={isPlaying}
                  tabIndex={isRevealed ? undefined : -1}
                  tone="back"
                />
              </div>

              <div aria-hidden="true" className="my-5 h-px bg-cream/15" />

              <div>
                <p className="text-eyebrow uppercase text-dandelion">English</p>
                <p className="mt-2 break-words font-display text-word font-bold text-cream">
                  {card.enWord}
                </p>

                {card.enNote && (
                  <span className="mt-3 inline-block rounded-card border border-dandelion/40 bg-dandelion/15 px-2.5 py-1 text-xs font-medium text-dandelion">
                    {card.enNote}
                  </span>
                )}
              </div>

              {hasBackExample && (
                <div className="mt-auto pt-6">
                  <Disclosure
                    isOpen={showBackExample}
                    onToggle={() => setShowBackExample((v) => !v)}
                    stopPropagation={stopPropagation}
                    tabIndex={isRevealed ? undefined : -1}
                    tone="back"
                  />
                  {showBackExample && (
                    <div className="mt-2 space-y-1">
                      {card.deSentence && (
                        <p className="text-sm leading-relaxed text-cream/60">{card.deSentence}</p>
                      )}
                      {card.enSentence && (
                        <p className="text-sm leading-relaxed text-cream/80">{card.enSentence}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isRevealed ? (
        <button
          onClick={onToggleReveal}
          className="mx-auto flex items-center gap-1.5 text-eyebrow uppercase text-ink/50 transition-colors hover:text-vermilion dark:text-cream/50 dark:hover:text-vermilion"
        >
          <FlipIcon className="h-3.5 w-3.5" />
          Flip back
        </button>
      ) : (
        <button
          onClick={onToggleReveal}
          className="mt-2 w-full rounded-card border-2 border-vermilion bg-vermilion py-4 font-display text-base font-bold tracking-tight text-cream-paper transition-colors hover:border-vermilion-dark hover:bg-vermilion-dark"
        >
          Flip the card
        </button>
      )}
    </div>
  )
}

function SpeakerButton({
  onClick,
  stopPropagation,
  isPlaying,
  tabIndex,
  tone,
}: {
  onClick: () => void
  stopPropagation: (e: React.MouseEvent) => void
  isPlaying: boolean
  tabIndex?: number
  tone: 'front' | 'back'
}) {
  const idle =
    tone === 'front'
      ? 'border-ink/10 text-ink hover:border-vermilion hover:text-vermilion dark:border-cream/15 dark:text-cream dark:hover:border-vermilion dark:hover:text-vermilion'
      : 'border-cream/20 text-cream/70 hover:border-dandelion hover:text-dandelion'
  const playing =
    tone === 'front'
      ? 'border-vermilion bg-vermilion text-cream-paper'
      : 'border-dandelion bg-dandelion text-ink'

  return (
    <button
      onClick={(e) => {
        stopPropagation(e)
        onClick()
      }}
      tabIndex={tabIndex}
      aria-label="Play pronunciation"
      className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-card border-2 transition-colors ${
        isPlaying ? playing : idle
      }`}
    >
      <SpeakerIcon />
    </button>
  )
}

function Disclosure({
  isOpen,
  onToggle,
  stopPropagation,
  tabIndex,
  tone,
}: {
  isOpen: boolean
  onToggle: () => void
  stopPropagation: (e: React.MouseEvent) => void
  tabIndex?: number
  tone: 'front' | 'back'
}) {
  return (
    <button
      onClick={(e) => {
        stopPropagation(e)
        onToggle()
      }}
      tabIndex={tabIndex}
      aria-expanded={isOpen}
      className={`flex items-center gap-1 text-eyebrow uppercase transition-colors ${
        tone === 'front'
          ? 'text-vermilion hover:text-vermilion-dark'
          : 'text-dandelion hover:text-dandelion/80'
      }`}
    >
      <ChevronRightIcon
        className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-90' : ''}`}
      />
      {isOpen ? 'Hide example' : 'Show example'}
    </button>
  )
}
