import type { Card } from '../types'

// Vendored from codeberg.org/patrizia/anki_german_a1_vocab by scripts/sync-deck.sh
const DECK_URL = '/deck/wordlist.tsv'
const AUDIO_BASE = '/deck/audio'
const CACHE_KEY = 'a1fc_deck_cache_v2'
// v1 cached absolute jsDelivr audio URLs that no longer resolve
const LEGACY_CACHE_KEY = 'a1fc_deck_cache'

function audioUrlFor(id: string): string {
  return `${AUDIO_BASE}/tts-${id}.mp3`
}

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
        audioUrl: audioUrlFor(id),
      }
    })
    .filter((card) => card.id && card.deWord)
}

export async function loadDeck(): Promise<Card[]> {
  localStorage.removeItem(LEGACY_CACHE_KEY)

  const cached = localStorage.getItem(CACHE_KEY)
  if (cached) {
    try {
      // Re-derive audioUrl so a future change of AUDIO_BASE doesn't strand cached decks
      return (JSON.parse(cached) as Card[]).map((card) => ({
        ...card,
        audioUrl: audioUrlFor(card.id),
      }))
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
