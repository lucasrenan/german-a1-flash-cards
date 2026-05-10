export interface Card {
  id: string
  deWord: string
  deSentence: string
  enWord: string
  enSentence: string
  enNote: string
  audioUrl: string
}

export interface CardState {
  id: string
  repetitions: number
  easeFactor: number
  interval: number
  dueDate: string
  status: 'new' | 'learning' | 'review'
  lapses: number
  lastRating?: Rating
}

export type Rating = 'again' | 'hard' | 'good' | 'easy'

export type FilterMode = 'all' | 'new' | 'due' | 'learning'

export interface Settings {
  newCardsPerSession: number
  maxReviewsPerSession: number
  autoplayAudio: boolean
}

export interface SessionStats {
  total: number
  again: number
  hard: number
  good: number
  easy: number
}

export interface DeckSummary {
  total: number
  newCount: number
  dueCount: number
  learningCount: number
}
