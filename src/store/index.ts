import { configureStore } from '@reduxjs/toolkit'
import { enableMapSet } from 'immer'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import audioReducer from '@/features/audio/audioSlice'
import keywordsReducer from '@/features/keywords/keywordsSlice'

enableMapSet()

export const store = configureStore({
  reducer: {
    audio: audioReducer,
    keywords: keywordsReducer,
  },
  middleware: (getDefault) => getDefault({ serializableCheck: false }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector