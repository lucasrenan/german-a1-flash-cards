import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { HomeScreen } from './components/HomeScreen'
import { SessionComplete } from './components/SessionComplete'
import { SessionScreen } from './components/SessionScreen'
import { SettingsModal } from './components/SettingsModal'
import { VerbsScreen } from './components/VerbsScreen'
import { WordsScreen } from './components/WordsScreen'
import { loadDeck } from './lib/deck'
import { buildQueue } from './lib/session'
import { createInitialState, isDue, reviewCard } from './lib/sm2'
import {
  loadCardStates,
  loadSettings,
  saveCardStates,
  saveSettings,
} from './lib/storage'
import { applyTheme, watchSystemTheme } from './lib/theme'
import type {
  Card,
  CardState,
  DeckSummary,
  FilterMode,
  Rating,
  SessionStats,
  Settings,
  ThemePreference,
} from './types'

type View = 'loading' | 'error' | 'home' | 'session' | 'complete' | 'words' | 'verbs'

const EMPTY_STATS: SessionStats = { total: 0, again: 0, hard: 0, good: 0, easy: 0 }

// Only `/verbs` has a dedicated URL; every other in-app view shares `/`.
function pathToInitialView(path: string): 'home' | 'verbs' {
  return path.replace(/\/$/, '') === '/verbs' ? 'verbs' : 'home'
}

function viewToPath(v: View): string {
  return v === 'verbs' ? '/verbs' : '/'
}

export default function App() {
  const [view, setView] = useState<View>('loading')
  const [error, setError] = useState<string | null>(null)
  const [cards, setCards] = useState<Card[]>([])
  const [cardStates, setCardStates] = useState<Record<string, CardState>>(() => loadCardStates())
  const [settings, setSettings] = useState<Settings>(() => loadSettings())
  const [filter, setFilter] = useState<FilterMode>('all')
  const [showSettings, setShowSettings] = useState(false)
  const [queue, setQueue] = useState<string[]>([])
  const [stats, setStats] = useState<SessionStats>(EMPTY_STATS)

  // Keep a ref to cardStates for saving without stale closure issues
  const cardStatesRef = useRef(cardStates)
  cardStatesRef.current = cardStates

  const settingsRef = useRef(settings)
  settingsRef.current = settings

  useEffect(() => {
    applyTheme(settings.theme)
  }, [settings.theme])

  useEffect(() => {
    return watchSystemTheme(
      () => settingsRef.current.theme,
      () => applyTheme(settingsRef.current.theme),
    )
  }, [])

  useEffect(() => {
    loadDeck()
      .then((deck) => {
        setCards(deck)
        setView(pathToInitialView(window.location.pathname))
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load deck')
        setView('error')
      })
  }, [])

  useEffect(() => {
    function onPop() {
      const target = pathToInitialView(window.location.pathname)
      setView((current) => {
        // Only swap between home/verbs on back/forward; leave mid-session views alone.
        if (current === 'verbs' && target === 'home') return 'home'
        if (current === 'home' && target === 'verbs') return 'verbs'
        return current
      })
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  function navigate(target: View) {
    const nextPath = viewToPath(target)
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath)
    }
    setView(target)
  }

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

  function handleThemeChange(theme: ThemePreference) {
    const next = { ...settingsRef.current, theme }
    setSettings(next)
    saveSettings(next)
  }

  if (view === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-500 dark:text-slate-400">
          <div className="w-8 h-8 border-2 border-indigo-300 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin" />
          <p className="text-sm">Loading deck…</p>
        </div>
      </div>
    )
  }

  if (view === 'error') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-red-200 dark:border-red-900 p-6 max-w-sm w-full text-center shadow-sm">
          <p className="text-4xl mb-3">⚠️</p>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">Couldn't load deck</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{error}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">Make sure you have an internet connection, then reload the page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
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
            onBrowseVerbs={() => navigate('verbs')}
          />
        )}

        {view === 'words' && (
          <WordsScreen
            cards={cards}
            cardStates={cardStates}
            onBack={() => setView('home')}
          />
        )}

        {view === 'verbs' && <VerbsScreen onBack={() => navigate('home')} />}

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
          onThemeChange={handleThemeChange}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
