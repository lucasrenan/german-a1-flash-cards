import type { CardState, Rating } from '../types'

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function today(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export function createInitialState(id: string): CardState {
  return {
    id,
    repetitions: 0,
    easeFactor: 2.5,
    interval: 0,
    dueDate: new Date(0).toISOString(),
    status: 'new',
    lapses: 0,
  }
}

export function isDue(state: CardState): boolean {
  return new Date(state.dueDate) <= today()
}

export function reviewCard(state: CardState, rating: Rating): CardState {
  const t = today()

  switch (rating) {
    case 'again':
      return {
        ...state,
        repetitions: 0,
        interval: 1,
        easeFactor: Math.max(1.3, state.easeFactor - 0.2),
        dueDate: addDays(t, 1).toISOString(),
        status: 'learning',
        lapses: state.lapses + 1,
      }

    case 'hard': {
      const interval = Math.max(1, Math.round(state.interval * 1.2))
      return {
        ...state,
        interval,
        easeFactor: Math.max(1.3, state.easeFactor - 0.15),
        dueDate: addDays(t, interval).toISOString(),
        status: state.repetitions >= 2 ? 'review' : 'learning',
      }
    }

    case 'good': {
      let interval: number
      if (state.repetitions === 0) interval = 1
      else if (state.repetitions === 1) interval = 6
      else interval = Math.round(state.interval * state.easeFactor)

      return {
        ...state,
        repetitions: state.repetitions + 1,
        interval,
        dueDate: addDays(t, interval).toISOString(),
        status: 'review',
      }
    }

    case 'easy': {
      let interval: number
      if (state.repetitions === 0) interval = 4
      else if (state.repetitions === 1) interval = 6
      else interval = Math.round(state.interval * state.easeFactor * 1.3)

      return {
        ...state,
        repetitions: state.repetitions + 1,
        interval,
        easeFactor: Math.min(3.5, state.easeFactor + 0.15),
        dueDate: addDays(t, interval).toISOString(),
        status: 'review',
      }
    }
  }
}
