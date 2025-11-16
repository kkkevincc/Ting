export interface LexiconEntry {
  word: string
  pos?: string
  phonetic?: string
  zh?: string
}

let cache: LexiconEntry[] | null = null

export async function loadLexicon(url?: string): Promise<number> {
  const target = url || import.meta.env.VITE_IELTS_LEXICON_URL || '/lexicon/ielts-5000.json'
  try {
    const res = await fetch(target, { cache: 'no-store' })
    if (!res.ok) throw new Error('lexicon fetch failed')
    const data = await res.json()
    if (Array.isArray(data)) {
      cache = data
      return cache.length
    }
    if (Array.isArray(data?.words)) {
      cache = data.words
      return cache.length
    }
    throw new Error('invalid lexicon format')
  } catch {
    cache = null
    return 0
  }
}

export function getDistractorsFromLexicon(count: number, exclude: Set<string>): string[] {
  if (!cache || cache.length === 0) return []
  const pool = cache.filter((e) => !exclude.has(e.word.toLowerCase()))
  const out: string[] = []
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length)
    out.push(pool[idx].word)
    pool.splice(idx, 1)
  }
  return out
}