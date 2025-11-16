import { extractKeywords } from '@/services/keywords/extract'
import { getDistractors } from '@/services/lexicon/ielts'
import { getDistractorsFromLexicon, loadLexicon } from '@/services/lexicon/provider'

export function generatePractice(text: string, durationSec: number) {
  const keywords = extractKeywords(text)
  const orderMap = new Map<string, number>()
  const tokens = (text.match(/[A-Za-z]+/g) || []).map((w) => w.toLowerCase())
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]
    if (!orderMap.has(t)) orderMap.set(t, i)
  }
  const filtered = keywords
    .filter((k) => k.pos === 'noun' || k.pos === 'verb' || k.pos === 'adj')
    .filter((k) => k.word.length > 2)
    .filter((k) => !/^(welcome|today|one|there|here|very|really|just)$/.test(k.word))
  const withOrder = filtered
    .map((k) => ({ word: k.word, index: orderMap.get(k.word) ?? Number.MAX_SAFE_INTEGER }))
    .sort((a, b) => a.index - b.index)

  const minutes = Math.max(1, durationSec / 60)
  const targetAnswers = Math.max(10, Math.round(minutes * 20))
  const totalOptions = Math.max(targetAnswers, Math.round(minutes * 60))
  const answers = withOrder.slice(0, targetAnswers)
  const exclude = new Set<string>(answers.map((a) => a.word))
  const distractorCount = Math.max(0, totalOptions - answers.length)
  let list: string[] = []
  if (distractorCount > 0) {
    list = getDistractorsFromLexicon(distractorCount, exclude)
    if (!list || list.length < distractorCount) {
      if (!list) list = []
      const more = getDistractorsFromLexicon(distractorCount - list.length, exclude)
      list = list.concat(more)
    }
    if (list.length < distractorCount) {
      const fallback = getDistractors(distractorCount - list.length, exclude)
      list = list.concat(fallback)
    }
  }
  const distractors = list.map((w) => ({ word: w, index: -1 }))

  const result: { word: string; answer: boolean; index: number }[] = []
  let dIdx = 0
  for (let i = 0; i < answers.length; i++) {
    result.push({ word: answers[i].word, answer: true, index: answers[i].index })
    const gapDistractors = Math.floor(Math.random() * 3)
    for (let g = 0; g < gapDistractors && dIdx < distractors.length; g++) {
      result.push({ word: distractors[dIdx].word, answer: false, index: -1 })
      dIdx++
    }
  }
  while (dIdx < distractors.length) {
    result.push({ word: distractors[dIdx].word, answer: false, index: -1 })
    dIdx++
  }
  return result
}