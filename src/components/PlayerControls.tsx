import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { play, pause, setRate, seek, tick } from '@/features/audio/audioSlice'

export default function PlayerControls() {
  const dispatch = useAppDispatch()
  const { playing, rate, position, duration, src, error } = useAppSelector((s) => s.audio)

  useEffect(() => {
    const id = setInterval(() => dispatch(tick()), 200)
    return () => clearInterval(id)
  }, [dispatch])

  function vibrate(ms: number) {
    if (navigator.vibrate) navigator.vibrate(ms)
  }

  return (
    <div className="player">
      <div className="controls">
        <button
          disabled={!src}
          onClick={() => {
            if (playing) dispatch(pause())
            else dispatch(play())
          }}
        >
          {playing ? '暂停' : '播放'}
        </button>
        <label>
          倍速
          <select value={rate} onChange={(e) => dispatch(setRate(Number(e.target.value)))}>
            {[0.75, 1, 1.25, 1.5, 2].map((r) => (
              <option key={r} value={r}>
                {r}x
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="seek">
        <input
          type="range"
          min={0}
          max={Math.max(duration, 0)}
          step={0.1}
          value={position}
          onChange={(e) => {
            const v = Number(e.target.value)
            dispatch(seek(v))
          }}
        />
        <span className="time">{format(position)} / {format(duration)}</span>
        {error && <span className="muted">{error}</span>}
      </div>
    </div>
  )
}

function format(s: number) {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}