import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { generatePractice } from '@/services/practice/generate'

export interface Token {
  text: string
  trailing?: string
}

export interface Transcript {
  text: string
  tokens: Token[]
}

export interface KeywordItem {
  word: string
  pos: 'noun' | 'verb' | 'adj' | 'other'
  count: number
}

interface KeywordsState {
  transcript?: Transcript
  items: KeywordItem[]
  practice: { word: string; answer: boolean; index: number }[]
  selected: Set<string>
  review: boolean
}

const initialState: KeywordsState = {
  items: [],
  practice: [],
  selected: new Set(),
  review: false,
}

const slice = createSlice({
  name: 'keywords',
  initialState,
  reducers: {
    setTranscript(state, action: PayloadAction<Transcript | undefined>) {
      state.transcript = action.payload
      state.selected.clear()
      state.review = false
      state.items = []
      state.practice = []
    },
    toggleSelect(state, action: PayloadAction<string>) {
      const w = action.payload.toLowerCase()
      if (state.selected.has(w)) state.selected.delete(w)
      else state.selected.add(w)
    },
    preparePractice(state, action: PayloadAction<number>) {
      const durationSec = action.payload
      if (state.transcript) {
        state.practice = generatePractice(state.transcript.text, durationSec)
        state.selected.clear()
        state.review = false
      }
    },
    reset(state) {
      state.selected.clear()
    },
    finish(state) {
      state.review = true
    },
  },
})

export const { setTranscript, toggleSelect, preparePractice, reset, finish } = slice.actions
export default slice.reducer