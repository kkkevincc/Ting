import { useAppSelector } from '@/store'
import { useEffect, useRef } from 'react'
import { saveSession } from '@/services/db/indexedDb'

export default function AnswerReview() {
  const { practice, selected, transcript } = useAppSelector((s) => s.keywords)
  const answers = practice.filter((p) => p.answer)
  const hits = answers.filter((a) => selected.has(a.word))
  const misses = answers.filter((a) => !selected.has(a.word))
  const falsePositives = practice.filter((p) => !p.answer && selected.has(p.word))
  const accuracy = answers.length ? Math.round((hits.length / answers.length) * 100) : 0
  const saved = useRef(false)
  useEffect(() => {
    if (!saved.current && transcript) {
      saved.current = true
      saveSession({
        createdAt: Date.now(),
        transcriptText: transcript.text,
        selectedKeywords: Array.from(selected),
      })
    }
  }, [transcript, selected])
  return (
    <div>
      <h2>答案核对</h2>
      <div className="panel">
        <p>正确词汇：{answers.length}，命中：{hits.length}，漏选：{misses.length}，误选：{falsePositives.length}，准确率：{accuracy}%</p>
      </div>
      <div className="panel">
        <h3>正确答案</h3>
        <div className="grid">
          {answers.map((p, i) => (
            <div key={'a-'+i} className={selected.has(p.word) ? 'kw active' : 'kw'}>
              <span className="word">{p.word}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="panel">
        <h3>误选词</h3>
        <div className="grid">
          {falsePositives.map((p, i) => (
            <div key={'fp-'+i} className={'kw active'}>
              <span className="word">{p.word}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="panel">
        <h3>漏选词</h3>
        <div className="grid">
          {misses.map((p, i) => (
            <div key={'m-'+i} className={'kw'}>
              <span className="word">{p.word}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="panel">
        <h3>本次选项全览</h3>
        <div className="grid">
          {practice.map((p, i) => {
            const isHit = selected.has(p.word)
            const cls = p.answer ? (isHit ? 'kw active' : 'kw') : (isHit ? 'kw active' : 'kw')
            return (
              <div key={i} className={cls}>
                <span className="word">{p.word}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}