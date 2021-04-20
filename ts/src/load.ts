import fs from 'fs'
import Redis from 'ioredis'

import { getText } from './lib/pdf'

const r = new Redis()
const p = r.pipeline()

export const loadPdf = async (data: Buffer) => {
  for await (const page of getText(data)) {
    const key = page.page.toString()
    const data = page.content;

    p.hset(key, data);
  }

  void p.exec()
  void r.quit()
}

export const loadPdfFromUrl = async (url: string) => {
  const data = fs.readFileSync(url)

  return loadPdf(data)
}
