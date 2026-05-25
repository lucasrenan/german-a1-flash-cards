import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { clearDeckCache, loadDeck } from './deck'

const CACHE_KEY = 'a1fc_deck_cache'

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

function mockFetchText(text: string, ok = true, status = 200) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok,
    status,
    text: () => Promise.resolve(text),
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('loadDeck', () => {
  it('parses a TSV row into a Card with audioUrl built from id', async () => {
    mockFetchText('001\tHaus\tDas Haus ist groß.\thouse\tThe house is big.\tneuter noun\n')
    const cards = await loadDeck()
    expect(cards).toEqual([
      {
        id: '001',
        deWord: 'Haus',
        deSentence: 'Das Haus ist groß.',
        enWord: 'house',
        enSentence: 'The house is big.',
        enNote: 'neuter noun',
        audioUrl: 'https://cdn.jsdelivr.net/gh/patsytau/anki_german_a1_vocab@main/audio/tts-001.mp3',
      },
    ])
  })

  it('skips blank lines and rows missing id or word', async () => {
    const tsv = [
      '001\tHaus\t\t\t\t',
      '', // blank
      '\tNoId\t\t\t\t', // missing id
      '003\t\t\t\t\t', // missing word
      '004\tBuch\t\t\t\t',
    ].join('\n')
    mockFetchText(tsv)
    const cards = await loadDeck()
    expect(cards.map((c) => c.id)).toEqual(['001', '004'])
  })

  it('writes parsed deck to localStorage', async () => {
    mockFetchText('001\tHaus\t\t\t\t\n')
    await loadDeck()
    const cached = localStorage.getItem(CACHE_KEY)
    expect(cached).not.toBeNull()
    expect(JSON.parse(cached!)).toHaveLength(1)
  })

  it('returns cached deck without re-fetching', async () => {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify([{ id: 'cached', deWord: 'x', deSentence: '', enWord: '', enSentence: '', enNote: '', audioUrl: '' }]),
    )
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const cards = await loadDeck()
    expect(fetchMock).not.toHaveBeenCalled()
    expect(cards).toEqual([{ id: 'cached', deWord: 'x', deSentence: '', enWord: '', enSentence: '', enNote: '', audioUrl: '' }])
  })

  it('falls through to fetch when cache is corrupt JSON', async () => {
    localStorage.setItem(CACHE_KEY, '{not json')
    const fetchMock = mockFetchText('001\tHaus\t\t\t\t\n')
    const cards = await loadDeck()
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(cards).toHaveLength(1)
  })

  it('throws when fetch returns a non-ok response', async () => {
    mockFetchText('', false, 503)
    await expect(loadDeck()).rejects.toThrow('Failed to fetch deck: 503')
  })
})

describe('clearDeckCache', () => {
  it('removes the cache key', () => {
    localStorage.setItem(CACHE_KEY, '[]')
    clearDeckCache()
    expect(localStorage.getItem(CACHE_KEY)).toBeNull()
  })
})
