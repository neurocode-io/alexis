import { promises as fs } from 'fs'
import { split, Syntax } from 'sentence-splitter'

import { getText } from '../lib/pdf'
import r, { key } from '../lib/redis'
import { cleanText, isSentence } from '../lib/text'

const storePdf = async (fileName: string) => {
  const pdfContent = await fs.readFile(`./uploads/${fileName}`)

  let pdfId = ''

  for await (const obj of getText(pdfContent)) {
    const content = split(cleanText(obj.content))
      .filter((node) => node.type === Syntax.Sentence)
      .filter((sentence) => isSentence(sentence.raw))
      .map((sentence) => sentence.raw)
      .join(' ')

    pdfId = obj.id

    const keyId = key(`pdfs:${pdfId}.${obj.page}`)

    await r.hset(keyId, { content, fileName })
  }

  return pdfId
}

export { storePdf }
