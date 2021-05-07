import { promises as fs } from 'fs'
import { split, Syntax } from 'sentence-splitter'

import { getText } from '../lib/pdf'
import r, { idx, key } from '../lib/redis'
import { cleanText, isSentence } from '../lib/text'

const storePdf = async (fileName: string, userId: string) => {
  const pdfContent = await fs.readFile(`${fileName}`)
  const pdfIdx = idx(`pdfs:${userId}`)

  //optimistic locking in case we have two running processes for the user
  //very unlikely because of the consumer working on 1 pdf at a time
  await r.watch(pdfIdx)
  const lastCount = (await r.get(pdfIdx)) as string
  let count = parseInt(lastCount ?? 0)
  let remainder: string = ''

  const transaction = r.multi()

  for await (const obj of getText(pdfContent)) {
    const contentArray = split(cleanText(obj.content))
      .filter((node) => node.type === Syntax.Sentence)
      .filter((sentence) => isSentence(sentence.raw))
      .map((sentence) => sentence.raw)
      
    contentArray.unshift(remainder)

    remainder = contentArray.pop() ?? ''
    console.log('lastSentence: ' + remainder)

    const content = contentArray.join(' ')
    console.log('page: ' + content)

    count += 1
    const keyId = key(`pdfs:${userId}.${count}`)

    transaction.hset(keyId, { content, fileName })
  }

  await transaction.set(pdfIdx, count).exec()
}

export { storePdf }
