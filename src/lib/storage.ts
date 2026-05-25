import type { CardState, Settings } from '../types'

const CARD_STATES_KEY = 'a1fc_card_states'
const SETTINGS_KEY = 'a1fc_settings'

export const DEFAULT_SETTINGS: Settings = {
  newCardsPerSession: 10,
  maxReviewsPerSession: 1,
  autoplayAudio: false,
  showExamplesByDefault: true,
  audioPlaybackRate: 0.85,
  theme: 'system',
}

export function loadCardStates(): Record<string, CardState> {
  try {
    const raw = localStorage.getItem(CARD_STATES_KEY)
    return raw ? (JSON.parse(raw) as Record<string, CardState>) : {}
  } catch {
    return {}
  }
}

export function saveCardStates(states: Record<string, CardState>): void {
  localStorage.setItem(CARD_STATES_KEY, JSON.stringify(states))
}

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<Settings>) } : DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}
