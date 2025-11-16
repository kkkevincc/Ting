import { useAppDispatch, useAppSelector } from '@/store'
import { toggleSelect, finish } from '@/features/keywords/keywordsSlice'

export default function KeywordMatrix() {
  const dispatch = useAppDispatch()
  const { practice, selected, review } = useAppSelector((s) => s.keywords)

  const shown = practice

  return (
    <div>
      <div className="row">
        <span className="muted">选项：{practice.length}；正确：{practice.filter(p=>p.answer).length}；干扰：{practice.filter(p=>!p.answer).length}</span>
      </div>
      {!review && <div className="grid">
        {shown.map((k) => {
          const active = selected.has(k.word)
          return (
            <button
              key={k.word + '-' + k.index}
              className={active ? 'kw active' : 'kw'}
              onClick={() => {
                dispatch(toggleSelect(k.word))
                if (!k.answer && navigator.vibrate) navigator.vibrate(40)
              }}
            >
              <span className="word">{k.word}</span>
            </button>
          )
        })}
      </div>}
      {!review && (
        <div className="footer">
          <button onClick={() => dispatch(finish())}>结束练习，查看答案</button>
        </div>
      )}
    </div>
  )
}