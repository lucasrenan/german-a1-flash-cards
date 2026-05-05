import type { Card } from '../types'

const DECK_URL =
  'https://cdn.jsdelivr.net/gh/patsytau/anki_german_a1_vocab@main/Goethe%20Institute%20A1%20Wordlist.txt'
const AUDIO_BASE =
  'https://cdn.jsdelivr.net/gh/patsytau/anki_german_a1_vocab@main/audio'
const CACHE_KEY = 'a1fc_deck_cache'

function parseTSV(text: string): Card[] {
  return text
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => {
      const cols = line.split('\t')
      const id = cols[0]?.trim() ?? ''
      return {
        id,
        deWord: cols[1]?.trim() ?? '',
        deSentence: cols[2]?.trim() ?? '',
        enWord: cols[3]?.trim() ?? '',
        enSentence: cols[4]?.trim() ?? '',
        enNote: cols[5]?.trim() ?? '',
        audioUrl: `${AUDIO_BASE}/tts-${id}.mp3`,
      }
    })
    .filter((card) => card.id && card.deWord)
}

export async function loadDeck(): Promise<Card[]> {
  const cached = localStorage.getItem(CACHE_KEY)
  if (cached) {
    try {
      return JSON.parse(cached) as Card[]
    } catch {
      // fall through to re-fetch
    }
  }

  const res = await fetch(DECK_URL)
  if (!res.ok) throw new Error(`Failed to fetch deck: ${res.status}`)
  const text = await res.text()
  const cards = parseTSV(text)
  localStorage.setItem(CACHE_KEY, JSON.stringify(cards))
  return cards
}

export function clearDeckCache(): void {
  localStorage.removeItem(CACHE_KEY)
}
