import { beforeEach, describe, expect, it } from 'vitest'
import type { CardState } from '../types'
import {
  DEFAULT_SETTINGS,
  loadCardStates,
  loadSettings,
  saveCardStates,
  saveSettings,
} from './storage'

beforeEach(() => {
  localStorage.clear()
})

describe('card states', () => {
  it('returns an empty object when nothing is stored', () => {
    expect(loadCardStates()).toEqual({})
  })

  it('round-trips through save and load', () => {
    const state: Record<string, CardState> = {
      a: {
        id: 'a',
        repetitions: 3,
        easeFactor: 2.5,
        interval: 6,
        dueDate: new Date('2026-06-01').toISOString(),
        status: 'review',
        lapses: 0,
        lastRating: 'good',
      },
    }
    saveCardStates(state)
    expect(loadCardStates()).toEqual(state)
  })

  it('returns an empty object when the stored value is malformed', () => {
    localStorage.setItem('a1fc_card_states', '{not json')
    expect(loadCardStates()).toEqual({})
  })
})

describe('settings', () => {
  it('returns defaults when nothing is stored', () => {
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS)
  })

  it('merges stored partial settings on top of defaults', () => {
    localStorage.setItem('a1fc_settings', JSON.stringify({ newCardsPerSession: 25, theme: 'dark' }))
    const loaded = loadSettings()
    expect(loaded.newCardsPerSession).toBe(25)
    expect(loaded.theme).toBe('dark')
    // Untouched fields fall back to defaults.
    expect(loaded.maxReviewsPerSession).toBe(DEFAULT_SETTINGS.maxReviewsPerSession)
    expect(loaded.audioPlaybackRate).toBe(DEFAULT_SETTINGS.audioPlaybackRate)
  })

  it('falls back to defaults on malformed JSON', () => {
    localStorage.setItem('a1fc_settings', 'not json at all')
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS)
  })

  it('round-trips through saveSettings', () => {
    const next = { ...DEFAULT_SETTINGS, theme: 'light' as const, audioPlaybackRate: 1.25 }
    saveSettings(next)
    expect(loadSettings()).toEqual(next)
  })
})
