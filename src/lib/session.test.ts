import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Card, CardState, Settings } from '../types'
import { DEFAULT_SETTINGS } from './storage'
import { buildQueue } from './session'

const NOW = new Date('2026-05-25T12:00:00Z')

function midnightPlusDays(days: number): string {
  const d = new Date(NOW)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

function card(id: string): Card {
  return {
    id,
    deWord: `de-${id}`,
    deSentence: '',
    enWord: `en-${id}`,
    enSentence: '',
    enNote: '',
    audioUrl: '',
  }
}

function state(id: string, overrides: Partial<CardState>): CardState {
  return {
    id,
    repetitions: 0,
    easeFactor: 2.5,
    interval: 0,
    dueDate: midnightPlusDays(0),
    status: 'new',
    lapses: 0,
    ...overrides,
  }
}

function settingsWith(overrides: Partial<Settings>): Settings {
  return { ...DEFAULT_SETTINGS, ...overrides }
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(NOW)
  // Disable shuffle randomness so output is deterministic.
  vi.spyOn(Math, 'random').mockReturnValue(0)
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('buildQueue', () => {
  it('returns empty queue when there are no cards', () => {
    expect(buildQueue([], {}, 'all', DEFAULT_SETTINGS)).toEqual([])
  })

  it('treats cards with no saved state as new', () => {
    const cards = [card('a'), card('b'), card('c')]
    const queue = buildQueue(cards, {}, 'new', settingsWith({ newCardsPerSession: 10 }))
    expect(queue).toEqual(['a', 'b', 'c'])
  })

  it('filter=new caps at newCardsPerSession', () => {
    const cards = [card('a'), card('b'), card('c'), card('d')]
    const queue = buildQueue(cards, {}, 'new', settingsWith({ newCardsPerSession: 2 }))
    expect(queue).toEqual(['a', 'b'])
  })

  it('filter=new keeps deck order when shuffleNewCards is off', () => {
    const cards = [card('a'), card('b'), card('c')]
    const queue = buildQueue(cards, {}, 'new', settingsWith({ shuffleNewCards: false }))
    expect(queue).toEqual(['a', 'b', 'c'])
  })

  it('filter=new shuffles new cards when shuffleNewCards is on', () => {
    const cards = [card('a'), card('b'), card('c')]
    const queue = buildQueue(cards, {}, 'new', settingsWith({ shuffleNewCards: true }))
    // Same cards, but no longer in deck order (Math.random mocked to 0).
    expect([...queue].sort()).toEqual(['a', 'b', 'c'])
    expect(queue).not.toEqual(['a', 'b', 'c'])
  })

  it('filter=new ignores review/learning cards', () => {
    const cards = [card('a'), card('b')]
    const states = {
      a: state('a', { status: 'review', dueDate: midnightPlusDays(0) }),
      b: state('b', { status: 'learning', dueDate: midnightPlusDays(0) }),
    }
    expect(buildQueue(cards, states, 'new', DEFAULT_SETTINGS)).toEqual([])
  })

  it('filter=due returns due review + due learning, capped by maxReviewsPerSession', () => {
    const cards = [card('a'), card('b'), card('c'), card('d')]
    const states = {
      a: state('a', { status: 'review', dueDate: midnightPlusDays(0) }),
      b: state('b', { status: 'learning', dueDate: midnightPlusDays(-1) }),
      c: state('c', { status: 'review', dueDate: midnightPlusDays(2) }), // not due
      d: state('d', { status: 'review', dueDate: midnightPlusDays(0) }),
    }
    const queue = buildQueue(cards, states, 'due', settingsWith({ maxReviewsPerSession: 10 }))
    expect(queue.sort()).toEqual(['a', 'b', 'd'])
    expect(queue).not.toContain('c')
  })

  it('filter=learning returns only due learning cards', () => {
    const cards = [card('a'), card('b'), card('c')]
    const states = {
      a: state('a', { status: 'learning', dueDate: midnightPlusDays(0) }),
      b: state('b', { status: 'review', dueDate: midnightPlusDays(0) }),
      c: state('c', { status: 'learning', dueDate: midnightPlusDays(2) }), // not due
    }
    expect(buildQueue(cards, states, 'learning', DEFAULT_SETTINGS)).toEqual(['a'])
  })

  it('filter=all interleaves a new card every 5 reviews', () => {
    const cards = [
      ...Array.from({ length: 10 }, (_, i) => card(`r${i}`)),
      card('n0'),
      card('n1'),
    ]
    const states: Record<string, CardState> = {}
    for (let i = 0; i < 10; i++) {
      states[`r${i}`] = state(`r${i}`, { status: 'review', dueDate: midnightPlusDays(0) })
    }
    const queue = buildQueue(
      cards,
      states,
      'all',
      settingsWith({ newCardsPerSession: 2, maxReviewsPerSession: 10 }),
    )

    // Expect pattern: 5 reviews, 1 new, 5 reviews, 1 new
    expect(queue).toHaveLength(12)
    expect(queue.slice(0, 5).every((id) => id.startsWith('r'))).toBe(true)
    expect(queue[5]).toBe('n0')
    expect(queue.slice(6, 11).every((id) => id.startsWith('r'))).toBe(true)
    expect(queue[11]).toBe('n1')
  })

  it('filter=all caps reviews by maxReviewsPerSession and still emits new cards', () => {
    const cards = [
      ...Array.from({ length: 10 }, (_, i) => card(`r${i}`)),
      card('n0'),
    ]
    const states: Record<string, CardState> = {}
    for (let i = 0; i < 10; i++) {
      states[`r${i}`] = state(`r${i}`, { status: 'review', dueDate: midnightPlusDays(0) })
    }
    const queue = buildQueue(
      cards,
      states,
      'all',
      settingsWith({ newCardsPerSession: 1, maxReviewsPerSession: 3 }),
    )
    expect(queue.filter((id) => id.startsWith('r'))).toHaveLength(3)
    expect(queue.filter((id) => id === 'n0')).toHaveLength(1)
  })
})
