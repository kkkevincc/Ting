import type { Transcript } from '@/features/keywords/keywordsSlice'

export interface STTService {
  transcribe(audio: Blob): Promise<Transcript>
}

export class MockSTT implements STTService {
  async transcribe(audio: Blob): Promise<Transcript> {
    const text = 'Welcome to the listening practice. This session covers climate change, sustainable energy, and urban development. Pay attention to nouns, verbs, and adjectives as they appear.'
    const tokens = tokenize(text)
    return { text, tokens }
  }
}

export class SiliconFlowSTT implements STTService {
  async transcribe(audio: Blob): Promise<Transcript> {
    const key = import.meta.env.VITE_SILICONFLOW_KEY as string | undefined
    const model = (import.meta.env.VITE_SILICONFLOW_MODEL as string | undefined) || 'FunAudioLLM/SenseVoiceSmall'
    if (!key) throw new Error('未配置SILICONFLOW密钥')
    const fd = new FormData()
    fd.append('model', model)
    fd.append('file', audio, 'audio-file')
    const res = await fetch('https://api.siliconflow.cn/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}` },
      body: fd,
    })
    if (!res.ok) {
      const t = await res.text()
      throw new Error(`STT失败: ${res.status} ${t}`)
    }
    const data = await res.json()
    const text: string = data.text || data.transcription || data.result || (data.data && data.data.text) || ''
    if (!text) throw new Error('未取得转录文本')
    const tokens = tokenize(text)
    return { text, tokens }
  }
}

export class ServerSTT implements STTService {
  async transcribe(audio: Blob): Promise<Transcript> {
    const model = (import.meta.env.VITE_SILICONFLOW_MODEL as string | undefined) || 'FunAudioLLM/SenseVoiceSmall'
    const fd = new FormData()
    fd.append('model', model)
    fd.append('file', audio, 'audio-file')
    const res = await fetch('/api/transcribe', { method: 'POST', body: fd })
    let data: any
    const ct = res.headers.get('content-type') || ''
    if (ct.includes('application/json')) {
      data = await res.json()
    } else {
      const textBody = await res.text()
      try { data = JSON.parse(textBody) } catch { data = { text: textBody } }
    }
    if (!res.ok) {
      const msg = data?.message || data?.error || JSON.stringify(data)
      throw new Error(`STT失败: ${res.status} ${msg}`)
    }
    const text: string = (data && (data.text || data.transcription || data.result)) || (typeof data === 'string' ? data : '')
    if (!text) throw new Error('未取得转录文本')
    const tokens = tokenize(text)
    return { text, tokens }
  }
}

export function chooseSTT(): STTService {
  return new ServerSTT()
}

function tokenize(text: string) {
  const parts = text.match(/\w+|\s+|[^\w\s]+/g) || []
  const tokens: { text: string; trailing?: string }[] = []
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i]
    if (/\w+/.test(p)) {
      let trailing = ''
      if (i + 1 < parts.length && /\s+|[^\w\s]+/.test(parts[i + 1])) trailing = parts[i + 1]
      tokens.push({ text: p, trailing })
    }
  }
  return tokens
}