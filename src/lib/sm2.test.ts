import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { CardState } from '../types'
import { createInitialState, isDue, reviewCard } from './sm2'

const NOW = new Date('2026-05-25T12:00:00Z')

function midnightPlusDays(days: number): string {
  const d = new Date(NOW)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

function makeState(overrides: Partial<CardState> = {}): CardState {
  return { ...createInitialState('card-1'), ...overrides }
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(NOW)
})

afterEach(() => {
  vi.useRealTimers()
})

describe('createInitialState', () => {
  it('returns a fresh new-card state', () => {
    const s = createInitialState('xyz')
    expect(s).toEqual({
      id: 'xyz',
      repetitions: 0,
      easeFactor: 2.5,
      interval: 0,
      dueDate: new Date(0).toISOString(),
      status: 'new',
      lapses: 0,
    })
  })
})

describe('isDue', () => {
  it('is true when dueDate is today', () => {
    expect(isDue(makeState({ dueDate: midnightPlusDays(0) }))).toBe(true)
  })

  it('is true when dueDate is in the past', () => {
    expect(isDue(makeState({ dueDate: midnightPlusDays(-3) }))).toBe(true)
  })

  it('is false when dueDate is in the future', () => {
    expect(isDue(makeState({ dueDate: midnightPlusDays(5) }))).toBe(false)
  })

  it('treats new-card sentinel epoch date as due', () => {
    expect(isDue(createInitialState('a'))).toBe(true)
  })
})

describe('reviewCard - again', () => {
  it('resets repetitions, schedules tomorrow, increments lapses, drops ease', () => {
    const initial = makeState({ repetitions: 4, interval: 30, easeFactor: 2.5, lapses: 1, status: 'review' })
    const next = reviewCard(initial, 'again')

    expect(next.repetitions).toBe(0)
    expect(next.interval).toBe(1)
    expect(next.easeFactor).toBeCloseTo(2.3)
    expect(next.dueDate).toBe(midnightPlusDays(1))
    expect(next.status).toBe('learning')
    expect(next.lapses).toBe(2)
    expect(next.lastRating).toBe('again')
  })

  it('clamps easeFactor to a 1.3 floor', () => {
    const initial = makeState({ easeFactor: 1.35 })
    expect(reviewCard(initial, 'again').easeFactor).toBe(1.3)
  })
})

describe('reviewCard - hard', () => {
  it('scales interval by 1.2 with a 1-day floor', () => {
    expect(reviewCard(makeState({ interval: 0 }), 'hard').interval).toBe(1)
    expect(reviewCard(makeState({ interval: 10 }), 'hard').interval).toBe(12)
  })

  it('drops ease by 0.15 and clamps at 1.3', () => {
    expect(reviewCard(makeState({ easeFactor: 2.5 }), 'hard').easeFactor).toBeCloseTo(2.35)
    expect(reviewCard(makeState({ easeFactor: 1.4 }), 'hard').easeFactor).toBe(1.3)
  })

  it('stays in learning until two successful repetitions, then becomes review', () => {
    expect(reviewCard(makeState({ repetitions: 1, status: 'learning' }), 'hard').status).toBe('learning')
    expect(reviewCard(makeState({ repetitions: 2, status: 'learning' }), 'hard').status).toBe('review')
  })
})

describe('reviewCard - good', () => {
  it('uses 1-day interval on first pass', () => {
    const next = reviewCard(makeState({ repetitions: 0 }), 'good')
    expect(next.interval).toBe(1)
    expect(next.repetitions).toBe(1)
    expect(next.dueDate).toBe(midnightPlusDays(1))
    expect(next.status).toBe('review')
  })

  it('uses 6-day interval on second pass', () => {
    const next = reviewCard(makeState({ repetitions: 1 }), 'good')
    expect(next.interval).toBe(6)
    expect(next.dueDate).toBe(midnightPlusDays(6))
  })

  it('multiplies interval by easeFactor after second pass', () => {
    const next = reviewCard(makeState({ repetitions: 2, interval: 6, easeFactor: 2.5 }), 'good')
    expect(next.interval).toBe(15)
    expect(next.dueDate).toBe(midnightPlusDays(15))
  })

  it('does not change easeFactor', () => {
    expect(reviewCard(makeState({ easeFactor: 2.5 }), 'good').easeFactor).toBe(2.5)
  })
})

describe('reviewCard - easy', () => {
  it('uses 4-day interval on first pass', () => {
    const next = reviewCard(makeState({ repetitions: 0 }), 'easy')
    expect(next.interval).toBe(4)
    expect(next.dueDate).toBe(midnightPlusDays(4))
    expect(next.status).toBe('review')
  })

  it('uses 6-day interval on second pass', () => {
    expect(reviewCard(makeState({ repetitions: 1 }), 'easy').interval).toBe(6)
  })

  it('multiplies interval by easeFactor * 1.3 after second pass', () => {
    const next = reviewCard(makeState({ repetitions: 2, interval: 6, easeFactor: 2.5 }), 'easy')
    expect(next.interval).toBe(Math.round(6 * 2.5 * 1.3))
  })

  it('bumps easeFactor by 0.15 with a 3.5 ceiling', () => {
    expect(reviewCard(makeState({ easeFactor: 2.5 }), 'easy').easeFactor).toBeCloseTo(2.65)
    expect(reviewCard(makeState({ easeFactor: 3.45 }), 'easy').easeFactor).toBe(3.5)
  })
})
