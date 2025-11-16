import { useRef, useState } from 'react'
import { useAppDispatch } from '@/store'
import { setSource } from '@/features/audio/audioSlice'
import { setTranscript } from '@/features/keywords/keywordsSlice'
import { chooseSTT, MockSTT } from '@/services/stt'

const stt = chooseSTT()

export default function UploadPanel() {
  const dispatch = useAppDispatch()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const [docBusy, setDocBusy] = useState(false)
  const [docError, setDocError] = useState<string | undefined>(undefined)
  const docRunId = useRef(0)

  async function onAudio(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const supported = new Set([
      'audio/wav', 'audio/x-wav', 'audio/mpeg', 'audio/mp3', 'audio/webm', 'audio/ogg', 'audio/opus'
    ])
    if (file.type && !supported.has(file.type)) {
      setError('仅支持 wav/mp3/opus/webm，请转换后再上传')
      // 提供演示体验：使用本地 Mock 继续流程
      try {
        const fallback = new MockSTT()
        const transcript = await fallback.transcribe(file)
        dispatch(setTranscript(transcript))
      } catch {}
      return
    }
    const url = URL.createObjectURL(file)
    dispatch(setSource(url))
    setBusy(true)
    setError(undefined)
    try {
      const transcript = await stt.transcribe(file)
      dispatch(setTranscript(transcript))
    } catch (e: any) {
      const msg = String(e?.message || e)
      setError(msg)
      if (/401|invalid/i.test(msg)) {
        try {
          const fallback = new MockSTT()
          const transcript = await fallback.transcribe(file)
          dispatch(setTranscript(transcript))
          setError('STT密钥无效，已使用本地Mock转录')
        } catch {}
      }
    } finally {
      setBusy(false)
    }
  }

  async function onDoc(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setDocError(undefined)
    setDocBusy(true)
    const runId = ++docRunId.current
    try {
      const parser = await import('@/services/parser')
      let text = ''
      if (file.name.endsWith('.pdf')) text = await parser.parsePdf(file)
      else if (file.name.endsWith('.docx')) text = await parser.parseDocx(file)
      else text = await parser.parseTxt(file)
      if (docRunId.current !== runId) return
      // TODO: 对题目文本进行时间轴对齐（后续接入）
      console.debug('parsed doc length', text.length)
    } catch (err: any) {
      if (docRunId.current !== runId) return
      setDocError(err?.message || '解析失败，请重试')
    } finally {
      if (docRunId.current === runId) setDocBusy(false)
    }
  }

  return (
    <div className="upload-panel">
      <div className="row">
        <label className="btn">
          上传音频(WAV/MP3/OPUS/WEBM)
          <input
            type="file"
            accept="audio/wav,audio/x-wav,audio/mpeg,audio/mp3,audio/webm,audio/ogg,audio/opus"
            onChange={onAudio}
            hidden
          />
        </label>
        {busy && <span className="spinner">生成转录中…</span>}
        {error && <span className="spinner" role="alert">{error}</span>}
      </div>
      <div className="row">
        <label className="btn">
          上传题目(TXT/Word/PDF)
          <input type="file" accept=".txt,.pdf,.docx" onChange={onDoc} hidden />
        </label>
        {docBusy && <span className="spinner">解析中…</span>}
        {docError && <span className="spinner" role="alert">{docError}</span>}
      </div>
    </div>
  )
}