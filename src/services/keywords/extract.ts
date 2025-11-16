import nlp from 'compromise'
import type { KeywordItem } from '@/features/keywords/keywordsSlice'

const STOPWORDS = new Set([
  'the','a','an','and','or','but','in','on','at','to','of','for','with','is','are','was','were','be','been','being','as','by','from','that','this','it','they','them','we','you','i'
])

export function extractKeywords(text: string): KeywordItem[] {
  const s = typeof text === 'string' ? text : String(text || '')
  let doc: any
  try {
    doc = nlp(s)
  } catch {
    doc = null
  }
  let words: string[] = []
  if (doc && typeof doc.terms === 'function') {
    words = (doc.terms().out('array') as string[]) || []
  } else if (doc && typeof doc.words === 'function') {
    words = (doc.words().out('array') as string[]) || []
  } else {
    words = (s.match(/[A-Za-z]+/g) || []).map((w) => w.toLowerCase())
  }
  const freq = new Map<string, number>()
  const posMap = new Map<string, 'noun' | 'verb' | 'adj' | 'other'>()
  for (const wRaw of words) {
    const w = wRaw.toLowerCase()
    if (STOPWORDS.has(w) || !/^[a-z]+$/.test(w)) continue
    freq.set(w, (freq.get(w) || 0) + 1)
  }
  if (doc) {
    try { (doc.nouns().out('array') as string[]).forEach((w) => posMap.set(w.toLowerCase(), 'noun')) } catch {}
    try { (doc.verbs().out('array') as string[]).forEach((w) => posMap.set(w.toLowerCase(), 'verb')) } catch {}
    try { (doc.adjectives().out('array') as string[]).forEach((w) => posMap.set(w.toLowerCase(), 'adj')) } catch {}
  }
  const items: KeywordItem[] = Array.from(freq.entries()).map(([word, count]) => ({
    word,
    count,
    pos: posMap.get(word) || 'other',
  }))
  items.sort((a, b) => b.count - a.count || a.word.localeCompare(b.word))
  return items
}