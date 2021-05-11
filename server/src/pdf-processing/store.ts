import { promises as fs } from 'fs'
import { split, Syntax } from 'sentence-splitter'

import log from '../lib/log'
import { getText } from '../lib/pdf'
import r, { idx, key } from '../lib/redis'
import { cleanText, isSentence } from '../lib/text'

const MAX_PARAGRAPH_SIZE = 384
let paragraph: string[] = []

const getParagraphs = (sentences: string[]) => {
  const paragraphs: string[] = []

  for (const sentence of sentences) {
    const words = sentence.split(' ')

    if (words.length + paragraph.length > MAX_PARAGRAPH_SIZE) {
      paragraphs.push(paragraph.join(' ').slice(0))
      console.log(paragraph.length)
      paragraph = []
    }

    paragraph = paragraph.concat(words)
  }

  return paragraphs
}

const storePdf = async (fileName: string, userId: string) => {
  const pdfContent = await fs.readFile(`${fileName}`)
  const pdfIdx = idx(`pdfs:${userId}`)

  //optimistic locking in case we have two running processes for the user
  //very unlikely because of the consumer working on 1 pdf at a time
  await r.watch(pdfIdx)
  const lastCount = (await r.get(pdfIdx)) as string
  let count = 0
  let pdfCount = parseInt(lastCount ?? 0)
  let remainder = ''

  const transaction = r.multi()

  for await (const obj of getText(pdfContent)) {
    const contentArray = split(cleanText(obj.content))
      .filter((node) => node.type === Syntax.Sentence)
      .filter((sentence) => isSentence(sentence.raw))
      .map((sentence) => sentence.raw)

    contentArray.unshift(remainder)
    remainder = contentArray.pop() ?? ''

    getParagraphs(contentArray).map(content => {
      log.debug('content: ' + content)
      const keyId = key(`pdfs:${userId}.${++count}`)

      transaction.hset(keyId, { content, fileName })
    })
  }

  const lastParagraph = paragraph.join(' ') + remainder

  log.debug('lastParagraph: ' + lastParagraph)

  const keyId = key(`pdfs:${userId}.${++count}`)

  transaction.hset(keyId, { content: lastParagraph, fileName })
  
  await transaction.set(pdfIdx, ++pdfCount).exec()
}

export { storePdf }
