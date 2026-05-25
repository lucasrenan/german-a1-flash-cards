import { describe, expect, it } from 'vitest'
import { verbs, type VerbCategory } from './verbs'

const VALID_CATEGORIES: VerbCategory[] = ['auxiliary', 'modal', 'irregular', 'regular']
const PRONOUNS = ['ich', 'du', 'erSieEs', 'wir', 'ihr', 'Sie'] as const

describe('verbs data', () => {
  it('contains entries', () => {
    expect(verbs.length).toBeGreaterThan(0)
  })

  it('each verb has a non-empty infinitive and English gloss', () => {
    for (const v of verbs) {
      expect(v.infinitive, `infinitive missing on ${JSON.stringify(v)}`).toBeTruthy()
      expect(v.english, `english missing on ${v.infinitive}`).toBeTruthy()
    }
  })

  it('each verb has a valid category', () => {
    for (const v of verbs) {
      expect(VALID_CATEGORIES, `${v.infinitive} has invalid category`).toContain(v.category)
    }
  })

  it('each verb has all six conjugation forms filled', () => {
    for (const v of verbs) {
      for (const p of PRONOUNS) {
        expect(v.conjugation[p], `${v.infinitive} is missing conjugation for ${p}`).toBeTruthy()
      }
    }
  })

  it('each verb has a non-empty German and English example sentence', () => {
    for (const v of verbs) {
      expect(v.example.de, `${v.infinitive} missing German example`).toBeTruthy()
      expect(v.example.en, `${v.infinitive} missing English example`).toBeTruthy()
    }
  })

  it('infinitives are unique', () => {
    const seen = new Set<string>()
    const duplicates: string[] = []
    for (const v of verbs) {
      if (seen.has(v.infinitive)) duplicates.push(v.infinitive)
      seen.add(v.infinitive)
    }
    expect(duplicates).toEqual([])
  })
})
