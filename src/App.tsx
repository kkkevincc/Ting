import React from 'react'
import UploadPanel from '@/components/UploadPanel'
import PlayerControls from '@/components/PlayerControls'
import KeywordMatrix from '@/components/KeywordMatrix'
import AnswerReview from '@/components/AnswerReview'
import { useAppDispatch, useAppSelector } from '@/store'
import { preparePractice } from '@/features/keywords/keywordsSlice'
import { useEffect } from 'react'
import { loadLexicon } from '@/services/lexicon/provider'

export default function App() {
  const dispatch = useAppDispatch()
  const { transcript, selected, review, practice } = useAppSelector((s) => s.keywords)
  const { duration } = useAppSelector((s) => s.audio)

  useEffect(() => {
    if (transcript && duration > 0 && practice.length === 0) {
      dispatch(preparePractice(duration))
    }
  }, [dispatch, transcript, duration, practice.length])

  useEffect(() => {
    // 尝试预加载词库（若存在）
    loadLexicon().catch(() => {})
  }, [])
  return (
    <div className="container">
      <div className="header">
        <h1>听听 · 英语听力练习</h1>
        <div className="header-actions"></div>
      </div>
      <div className="main">
        <div className="panel">
          <UploadPanel />
          <PlayerControls />
        </div>
        <div className="panel">
          {review ? <AnswerReview /> : <KeywordMatrix />}
          <div className="transcript">
            {transcript?.tokens?.map((t, i) => {
              const hit = selected.has(t.text.toLowerCase())
              return (
                <span key={i} className={hit ? 'token-hit' : 'token'}>
                  {t.text}
                  {t.trailing || ''}
                </span>
              )
            })}
            {!transcript && <p className="muted">请上传音频以生成转录</p>}
          </div>
        </div>
      </div>
    </div>
  )
}