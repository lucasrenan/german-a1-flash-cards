import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { HomeScreen } from './components/HomeScreen'
import { SessionComplete } from './components/SessionComplete'
import { SessionScreen } from './components/SessionScreen'
import { SettingsModal } from './components/SettingsModal'
import { WordsScreen } from './components/WordsScreen'
import { loadDeck } from './lib/deck'
import { buildQueue } from './lib/session'
import { createInitialState, isDue, reviewCard } from './lib/sm2'
import {
  DEFAULT_SETTINGS,
  loadCardStates,
  loadSettings,
  saveCardStates,
  saveSettings,
} from './lib/storage'
import type {
  Card,
  CardState,
  DeckSummary,
  FilterMode,
  Rating,
  SessionStats,
  Settings,
} from './types'

type View = 'loading' | 'error' | 'home' | 'session' | 'complete' | 'words'

const EMPTY_STATS: SessionStats = { total: 0, again: 0, hard: 0, good: 0, easy: 0 }

export default function App() {
  const [view, setView] = useState<View>('loading')
  const [error, setError] = useState<string | null>(null)
  const [cards, setCards] = useState<Card[]>([])
  const [cardStates, setCardStates] = useState<Record<string, CardState>>({})
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [filter, setFilter] = useState<FilterMode>('all')
  const [showSettings, setShowSettings] = useState(false)
  const [queue, setQueue] = useState<string[]>([])
  const [stats, setStats] = useState<SessionStats>(EMPTY_STATS)

  // Keep a ref to cardStates for saving without stale closure issues
  const cardStatesRef = useRef(cardStates)
  cardStatesRef.current = cardStates

  useEffect(() => {
    setSettings(loadSettings())
    setCardStates(loadCardStates())

    loadDeck()
      .then((deck) => {
        setCards(deck)
        setView('home')
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load deck')
        setView('error')
      })
  }, [])

  const cardMap = useMemo(() => new Map(cards.map((c) => [c.id, c])), [cards])

  const summary = useMemo<DeckSummary>(() => {
    let newCount = 0
    let dueCount = 0
    let learningCount = 0

    for (const card of cards) {
      const state = cardStates[card.id] ?? createInitialState(card.id)
      if (state.status === 'new') {
        newCount++
      } else if (state.status === 'learning' && isDue(state)) {
        learningCount++
      } else if (state.status === 'review' && isDue(state)) {
        dueCount++
      }
    }

    return { total: cards.length, newCount, dueCount, learningCount }
  }, [cards, cardStates])

  function handleStart() {
    const q = buildQueue(cards, cardStates, filter, settings)
    if (q.length === 0) return
    setQueue(q)
    setStats(EMPTY_STATS)
    setView('session')
  }

  const handleRate = useCallback(
    (cardId: string, rating: Rating) => {
      const current = cardStatesRef.current[cardId] ?? createInitialState(cardId)
      const next = reviewCard(current, rating)

      const updated = { ...cardStatesRef.current, [cardId]: next }
      setCardStates(updated)
      saveCardStates(updated)

      setStats((s) => ({ ...s, total: s.total + 1, [rating]: s[rating] + 1 }))

      setQueue((q) => {
        const rest = q.slice(1)
        if (rating === 'again') {
          // re-insert near end (but not after 5+ cards)
          const insertAt = Math.min(rest.length, 4)
          return [...rest.slice(0, insertAt), cardId, ...rest.slice(insertAt)]
        }
        return rest
      })
    },
    [],
  )

  function handleExit() {
    setView(stats.total > 0 ? 'complete' : 'home')
  }

  useEffect(() => {
    if (view === 'session' && queue.length === 0 && stats.total > 0) {
      setView('complete')
    }
  }, [queue, view, stats.total])

  function handleSaveSettings(s: Settings) {
    setSettings(s)
    saveSettings(s)
  }

  if (view === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-500">
          <div className="w-8 h-8 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-sm">Loading deck…</p>
        </div>
      </div>
    )
  }

  if (view === 'error') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-red-200 p-6 max-w-sm w-full text-center shadow-sm">
          <p className="text-4xl mb-3">⚠️</p>
          <h2 className="text-lg font-semibold text-slate-800 mb-1">Couldn't load deck</h2>
          <p className="text-sm text-slate-500 mb-4">{error}</p>
          <p className="text-xs text-slate-400">Make sure you have an internet connection, then reload the page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-lg mx-auto px-4 pb-8">
        {view === 'home' && (
          <HomeScreen
            summary={summary}
            filter={filter}
            settings={settings}
            onFilterChange={setFilter}
            onStart={handleStart}
            onOpenSettings={() => setShowSettings(true)}
            onBrowseWords={() => setView('words')}
          />
        )}

        {view === 'words' && (
          <WordsScreen
            cards={cards}
            cardStates={cardStates}
            onBack={() => setView('home')}
          />
        )}

        {view === 'session' && (
          <SessionScreen
            queue={queue}
            cardMap={cardMap}
            settings={settings}
            onRate={handleRate}
            onExit={handleExit}
            stats={stats}
          />
        )}

        {view === 'complete' && (
          <SessionComplete
            stats={stats}
            onHome={() => setView('home')}
            onStudyAgain={handleStart}
          />
        )}
      </div>

      {showSettings && (
        <SettingsModal
          settings={settings}
          onSave={handleSaveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
