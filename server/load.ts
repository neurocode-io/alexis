import fs from 'fs'
import Redis from 'ioredis'

import { keyFinder } from './keyFinder'
import logger from './lib/log'
import { getText } from './lib/pdf'

const redis = new Redis()

export const loadPdf = async (data: Buffer) => {
  await redis.flushall()
  for await (const page of getText(data)) {
    const pageNumber = page.page.toString()
    const content = page.content

    if (keyFinder.get(pageNumber)) {
      logger.error(`key ${pageNumber} already exists. Duplicate keys are not allowed`)
    }
    keyFinder.set(pageNumber, await redis.xadd("pdfStream", "*", "pageNumber", pageNumber, "content", content))
  }

  void redis.quit()
}

export const loadPdfFromUrl = async (url: string) => {
  const data = fs.readFileSync(url)

  return loadPdf(data)
}
