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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4">
          <p className="text-xs font-semibold tracking-widest uppercase text-indigo-600 dark:text-indigo-400">Deutsch — Goethe A1</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Flash cards
          </h1>
          <div className="mt-7 h-[3px] w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
            <div className="animate-sweep h-full w-1/3 bg-indigo-600" />
          </div>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Loading the deck…</p>
        </div>
      </div>
    )
  }

  if (view === 'error') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4">
          <p className="text-xs font-semibold tracking-widest uppercase text-red-600 dark:text-red-400">Deck unavailable</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            The deck didn't load.
          </h1>
          <div className="mt-6 rounded-card border-2 border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-transparent">
            <p className="text-xs font-semibold tracking-widest uppercase text-red-600 dark:text-red-400">What happened</p>
            <p className="mt-2 break-words text-sm text-slate-800 dark:text-slate-100">{error}</p>
          </div>
          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            The wordlist is fetched over the network. Check your connection, then reload the page.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-lg px-4 pb-12">
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
