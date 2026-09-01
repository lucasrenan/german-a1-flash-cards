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
          className="absolute inset-0 translate-y-[14px] scale-[0.94] rounded-card border-2 border-slate-200 bg-white opacity-50 dark:border-slate-800 dark:bg-slate-800"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 translate-y-[7px] scale-[0.97] rounded-card border-2 border-slate-200 bg-white opacity-80 dark:border-slate-800 dark:bg-slate-800"
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
              className="card-face [grid-area:1/1] flex flex-col rounded-card border-2 border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold tracking-widest uppercase text-indigo-600 dark:text-indigo-400">Deutsch</p>
                  <p className="mt-3 break-words text-4xl tracking-tight font-bold text-slate-800 dark:text-slate-100">
                    {card.deWord}
                  </p>
                </div>
                <SpeakerButton
                  onClick={playAudio}
                  stopPropagation={stopPropagation}
                  isPlaying={isPlaying}
                  tabIndex={isRevealed ? -1 : undefined}
                />
              </div>

              {card.deSentence && (
                <div className="mt-auto pt-6">
                  <Disclosure
                    isOpen={showFrontExample}
                    onToggle={() => setShowFrontExample((v) => !v)}
                    stopPropagation={stopPropagation}
                    tabIndex={isRevealed ? -1 : undefined}
                  />
                  {showFrontExample && (
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {card.deSentence}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Back — English. The German stays in view above it: the pairing
                is what gets memorized. */}
            <div
              aria-hidden={!isRevealed}
              className="card-face card-face-back [grid-area:1/1] flex flex-col rounded-card border-2 border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 dark:text-slate-500">Deutsch</p>
                  <p className="mt-1.5 break-words text-xl font-bold text-slate-500 dark:text-slate-400">
                    {card.deWord}
                  </p>
                </div>
                <SpeakerButton
                  onClick={playAudio}
                  stopPropagation={stopPropagation}
                  isPlaying={isPlaying}
                  tabIndex={isRevealed ? undefined : -1}
                />
              </div>

              <div aria-hidden="true" className="my-5 h-px bg-slate-200 dark:bg-slate-700" />

              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-indigo-600 dark:text-indigo-400">English</p>
                <p className="mt-2 break-words text-4xl tracking-tight font-bold text-slate-800 dark:text-slate-100">
                  {card.enWord}
                </p>

                {card.enNote && (
                  <span className="mt-3 inline-block rounded-card border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-700/50 dark:text-slate-300">
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
                  />
                  {showBackExample && (
                    <div className="mt-2 space-y-1">
                      {card.deSentence && (
                        <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{card.deSentence}</p>
                      )}
                      {card.enSentence && (
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{card.enSentence}</p>
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
          className="mx-auto flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-slate-500 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
        >
          <FlipIcon className="h-3.5 w-3.5" />
          Flip back
          <span aria-hidden="true" className="hidden opacity-60 [@media(pointer:fine)]:inline">
            · Space
          </span>
        </button>
      ) : (
        <button
          onClick={onToggleReveal}
          className="mt-2 w-full rounded-card border-2 border-indigo-600 bg-indigo-600 py-4 text-base font-bold tracking-tight text-white transition-colors hover:border-indigo-700 hover:bg-indigo-700"
        >
          Flip the card
          <span aria-hidden="true" className="hidden opacity-70 [@media(pointer:fine)]:inline">
            {' · Space'}
          </span>
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
}: {
  onClick: () => void
  stopPropagation: (e: React.MouseEvent) => void
  isPlaying: boolean
  tabIndex?: number
}) {
  const idle =
    'border-slate-200 text-slate-800 hover:border-indigo-600 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-100 dark:hover:border-indigo-500 dark:hover:text-indigo-400'
  const playing = 'border-indigo-600 bg-indigo-600 text-white'

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
}: {
  isOpen: boolean
  onToggle: () => void
  stopPropagation: (e: React.MouseEvent) => void
  tabIndex?: number
}) {
  return (
    <button
      onClick={(e) => {
        stopPropagation(e)
        onToggle()
      }}
      tabIndex={tabIndex}
      aria-expanded={isOpen}
      className="flex items-center gap-1 text-xs font-semibold tracking-widest uppercase text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
    >
      <ChevronRightIcon
        className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-90' : ''}`}
      />
      {isOpen ? 'Hide example' : 'Show example'}
    </button>
  )
}
