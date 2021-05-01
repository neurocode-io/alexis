import fs from 'fs'
import Redis from 'ioredis'

import { redisConfig } from './config'
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
    keyFinder.set(pageNumber, await redis.xadd(redisConfig.streamName, '*', 'pageNumber', pageNumber, 'content', content))
  }
}

export const loadPdfFromUrl = (url: string) => {
  fs.readFile(url, (_err, data) => {
    void loadPdf(data)
  })
}
