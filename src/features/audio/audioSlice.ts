import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Howl } from 'howler'

let howl: Howl | null = null
let howlError: string | undefined = undefined

interface AudioState {
  src?: string
  playing: boolean
  rate: number
  duration: number
  position: number
  error?: string
}

const initialState: AudioState = {
  playing: false,
  rate: 1.0,
  duration: 0,
  position: 0,
}

const audioSlice = createSlice({
  name: 'audio',
  initialState,
  reducers: {
    setSource(state, action: PayloadAction<string>) {
      state.src = action.payload
      if (howl) {
        howl.unload()
      }
      howl = new Howl({
        src: [action.payload],
        html5: true,
        onplayerror: () => {
          howlError = '无法播放音频'
        },
        onloaderror: () => {
          howlError = '音频加载失败'
        },
      })
      state.playing = false
      state.duration = 0
      state.position = 0
      state.error = undefined
      howlError = undefined
    },
    play(state) {
      if (!howl) return
      howl.play()
      howl.rate(state.rate)
      state.playing = true
    },
    pause(state) {
      if (!howl) return
      howl.pause()
      state.playing = false
    },
    setRate(state, action: PayloadAction<number>) {
      state.rate = action.payload
      if (howl) howl.rate(action.payload)
    },
    seek(state, action: PayloadAction<number>) {
      if (!howl) return
      howl.seek(action.payload)
      state.position = action.payload
    },
    tick(state) {
      if (!howl) return
      const pos = typeof howl.seek() === 'number' ? (howl.seek() as number) : state.position
      state.position = pos
      state.duration = howl.duration() || state.duration
      state.playing = howl.playing()
      state.error = howlError
    },
  },
})

export const { setSource, play, pause, setRate, seek, tick } = audioSlice.actions
export default audioSlice.reducer

export function getHowl() {
  return howl
}