import type { Card, CardState, FilterMode, Settings } from '../types'
import { createInitialState, isDue } from './sm2'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function interleave(reviews: string[], newCards: string[]): string[] {
  const result: string[] = []
  let ri = 0
  let ni = 0
  while (ri < reviews.length || ni < newCards.length) {
    for (let i = 0; i < 5 && ri < reviews.length; i++, ri++) {
      result.push(reviews[ri])
    }
    if (ni < newCards.length) {
      result.push(newCards[ni++])
    }
  }
  return result
}

export function buildQueue(
  cards: Card[],
  cardStates: Record<string, CardState>,
  filter: FilterMode,
  settings: Settings,
): string[] {
  const getState = (id: string) => cardStates[id] ?? createInitialState(id)

  const newCards: string[] = []
  const dueReview: string[] = []
  const dueLearning: string[] = []

  for (const card of cards) {
    const state = getState(card.id)
    if (state.status === 'new') {
      newCards.push(card.id)
    } else if (state.status === 'learning' && isDue(state)) {
      dueLearning.push(card.id)
    } else if (state.status === 'review' && isDue(state)) {
      dueReview.push(card.id)
    }
  }

  switch (filter) {
    case 'new':
      return newCards.slice(0, settings.newCardsPerSession)

    case 'due':
      return shuffle([...dueReview, ...dueLearning]).slice(0, settings.maxReviewsPerSession)

    case 'learning':
      return shuffle(dueLearning)

    case 'all':
    default: {
      const reviews = shuffle([...dueReview, ...dueLearning]).slice(0, settings.maxReviewsPerSession)
      const fresh = newCards.slice(0, settings.newCardsPerSession)
      return interleave(reviews, fresh)
    }
  }
}
