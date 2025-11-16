import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'

const cdnWorker = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs'
pdfjsLib.GlobalWorkerOptions.workerSrc = cdnWorker

export async function parseTxt(file: File): Promise<string> {
  const text = await file.text()
  return text
}

export async function parsePdf(file: File): Promise<string> {
  const buf = new Uint8Array(await file.arrayBuffer())
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise
  let text = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    text += content.items.map((it: any) => it.str).join(' ') + '\n'
  }
  return text
}

export async function parseDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const { value } = await mammoth.extractRawText({ arrayBuffer })
  return value
}