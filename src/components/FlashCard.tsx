import { useEffect, useRef, useState } from 'react'
import type { Card } from '../types'

interface Props {
  card: Card
  isRevealed: boolean
  autoplayAudio: boolean
  showExamplesByDefault: boolean
  audioPlaybackRate: number
  onReveal: () => void
}

export function FlashCard({
  card,
  isRevealed,
  autoplayAudio,
  showExamplesByDefault,
  audioPlaybackRate,
  onReveal,
}: Props) {
  const [showDeSentence, setShowDeSentence] = useState(showExamplesByDefault)
  const [showEnSentence, setShowEnSentence] = useState(showExamplesByDefault)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    setShowDeSentence(showExamplesByDefault)
    setShowEnSentence(showExamplesByDefault)
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

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Front: German */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">German</p>
            <p className="text-2xl font-semibold text-slate-800 dark:text-slate-100 leading-tight break-words">{card.deWord}</p>
          </div>
          <button
            onClick={playAudio}
            aria-label="Play pronunciation"
            className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
              isPlaying
                ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 active:bg-slate-300 dark:active:bg-slate-500'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.784L4.438 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.438l3.945-3.784a1 1 0 011 .076zM14.657 5.343a1 1 0 011.414 0A9.972 9.972 0 0118 10a9.972 9.972 0 01-1.929 4.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0016 10c0-1.571-.453-3.036-1.234-4.272a1 1 0 010-1.385z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {card.deSentence && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={() => setShowDeSentence((v) => !v)}
              className="text-sm text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              <svg
                className={`w-4 h-4 transition-transform ${showDeSentence ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {showDeSentence ? 'Hide example' : 'Show example'}
            </button>
            {showDeSentence && (
              <p className="mt-2 text-slate-600 dark:text-slate-300 italic text-sm leading-relaxed">{card.deSentence}</p>
            )}
          </div>
        )}
      </div>

      {/* Reveal button or Answer */}
      {!isRevealed ? (
        <button
          onClick={onReveal}
          className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-semibold text-base shadow-sm hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
        >
          Show Answer
        </button>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 animate-fade-in">
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">English</p>
          <p className="text-2xl font-semibold text-slate-800 dark:text-slate-100 leading-tight break-words">{card.enWord}</p>

          {card.enNote && (
            <span className="mt-2 inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
              {card.enNote}
            </span>
          )}

          {card.enSentence && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              <button
                onClick={() => setShowEnSentence((v) => !v)}
                className="text-sm text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                <svg
                  className={`w-4 h-4 transition-transform ${showEnSentence ? 'rotate-90' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {showEnSentence ? 'Hide example' : 'Show example'}
              </button>
              {showEnSentence && (
                <p className="mt-2 text-slate-600 dark:text-slate-300 italic text-sm leading-relaxed">{card.enSentence}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
