import express from 'express'
import multer from 'multer'
import cors from 'cors'
import path from 'path'
import { Readable, PassThrough } from 'stream'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from 'ffmpeg-static'

const app = express()
const upload = multer({ storage: multer.memoryStorage() })

app.use(cors())

app.post('/api/transcribe', upload.single('file'), async (req, res) => {
  try {
    const key = process.env.SILICONFLOW_KEY
    if (!key) {
      res.status(400).json({ error: 'missing key' })
      return
    }
    const model = req.body.model || 'FunAudioLLM/SenseVoiceSmall'
    const file = req.file
    if (!file) {
      res.status(400).json({ error: 'missing file' })
      return
    }
    const supported = new Set(['audio/wav','audio/x-wav','audio/mpeg','audio/mp3','audio/webm','audio/ogg','audio/opus','audio/L16'])
    const ext = path.extname(file.originalname || '').toLowerCase()
    const okByExt = ['.wav','.mp3','.webm','.opus','.ogg','.pcm'].includes(ext)
    const mime = file.mimetype || ''
    const okByMime = mime && supported.has(mime)
    // 自动转码：若类型/扩展名不在支持列表或不是 wav，则转码到 wav pcm_s16le/16k/mono
    ffmpeg.setFfmpegPath(ffmpegPath || '')
    async function transcodeToWav(buf) {
      return new Promise((resolve, reject) => {
        const src = new Readable({ read() {} })
        src.push(buf)
        src.push(null)
        const out = new PassThrough()
        const chunks = []
        out.on('data', (c) => chunks.push(c))
        out.on('end', () => resolve(Buffer.concat(chunks)))
        out.on('error', reject)
        ffmpeg(src)
          .format('wav')
          .audioCodec('pcm_s16le')
          .audioChannels(1)
          .audioFrequency(16000)
          .on('error', reject)
          .pipe(out, { end: true })
      })
    }
    let forwardBuffer = file.buffer
    let forwardType = mime
    let forwardName = file.originalname || 'audio-file'
    if (!okByMime && !okByExt) {
      // 明确不支持：尝试转码
      try {
        forwardBuffer = await transcodeToWav(file.buffer)
        forwardType = 'audio/wav'
        forwardName = 'audio.wav'
      } catch (e) {
        res.status(415).json({ code: 20083, message: 'Unsupported format and transcode failed', data: null })
        return
      }
    } else if (ext !== '.wav') {
      // 非 wav 为提升兼容性也尝试转码到 wav
      try {
        forwardBuffer = await transcodeToWav(file.buffer)
        forwardType = 'audio/wav'
        forwardName = 'audio.wav'
      } catch {
        // 若转码失败，回退原始类型并尽量修正 MIME
        if (!supported.has(forwardType)) {
          if (ext === '.mp3') forwardType = 'audio/mpeg'
          else if (ext === '.webm') forwardType = 'audio/webm'
          else if (ext === '.opus' || ext === '.ogg') forwardType = 'audio/ogg'
          else if (ext === '.pcm') forwardType = 'audio/L16'
          else forwardType = 'application/octet-stream'
        }
      }
    }
    const blob = new Blob([forwardBuffer], { type: forwardType })
    const fd = new FormData()
    fd.append('model', model)
    fd.append('file', blob, forwardName)
    const r = await fetch('https://api.siliconflow.cn/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}` },
      body: fd,
    })
    const text = await r.text()
    res.status(r.status).type(r.headers.get('content-type') || 'text/plain').send(text)
  } catch (e) {
    res.status(500).json({ error: 'proxy error' })
  }
})

const port = process.env.PORT ? Number(process.env.PORT) : 3001
app.listen(port, () => {})