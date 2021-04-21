import fs from 'fs'
import Redis from 'ioredis'

import { getText } from './lib/pdf'

const redis = new Redis()
const pipeline = redis.pipeline()

export const loadPdf = async (data: Buffer) => {
  for await (const page of getText(data)) {
    const key = page.page.toString()
    const values = page.content
    
    pipeline.hset(key, {values})
  }

  void pipeline.exec()
  void redis.quit()
}

export const loadPdfFromUrl = async (url: string) => {
  const data = fs.readFileSync(url)

  return loadPdf(data)
}
