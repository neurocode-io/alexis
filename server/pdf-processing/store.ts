import { promises as fs } from 'fs'
import { split, Syntax } from 'sentence-splitter'

import { getText } from '../lib/pdf'
import r, { idx, key } from '../lib/redis'
import { cleanText, isSentence } from '../lib/text'

const PAGE_SPLIT_FACTOR = 10

const storePdf = async (fileName: string, userId: string) => {
  const pdfContent = await fs.readFile(`${fileName}`)
  const pdfIdx = idx(`pdfs:${userId}`)

  //optimistic locking in case we have two running processes for the user
  //very unlikely because of the consumer working on 1 pdf at a time
  await r.watch(pdfIdx)
  const lastCount = (await r.get(pdfIdx)) as string
  let count = parseInt(lastCount ?? 0)

  const transaction = r.multi()

  for await (const obj of getText(pdfContent)) {
    const sentences = split(cleanText(obj.content))
      .filter((node: any) => node.type === Syntax.Sentence)
      .filter((sentence: any) => isSentence(sentence.raw))
      .map((sentence: any) => sentence.raw)
    const perParagraph = Math.ceil(sentences.length / PAGE_SPLIT_FACTOR)
    const paragraphs: any = sentences.reduce((resultArray: any[], item: any, index: number) => {
      const paragraphIndex = Math.floor(index / perParagraph)

      if (!resultArray[paragraphIndex]) {
        resultArray[paragraphIndex] = []
      }

      resultArray[paragraphIndex].push(item)

      return resultArray
    }, [])

    for (const paragraph of paragraphs) {
      const content = paragraph.join(' ')

      const keyId = key(`pdfs:${userId}.${++count}`)

      transaction.hset(keyId, { content, fileName })
    }
  }

  await transaction.set(pdfIdx, count).exec()
}

export { storePdf }
