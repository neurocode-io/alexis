import express, { Request, Response, Router } from 'express'
import { split, Syntax } from 'sentence-splitter'
import * as z from 'zod'

import { safeRouteHandler } from '../lib/express'
import log from '../lib/log'
import { isSentence } from '../lib/text'
import { getAnswer } from './qa'
import { lookUp } from './search'

const MAX_BUFFER_SIZE = 256
const MAX_QUESTION_SIZE = 50
const MAX_PARAGRAPH_SIZE = MAX_BUFFER_SIZE - MAX_QUESTION_SIZE

const router = Router()

const getParagraphs = (page: string) => {
  const paragraphs: string[] = []
  let paragraph: string[] = []

  const sentences = split(page)
  .filter((node) => node.type === Syntax.Sentence)
  .filter((sentence) => isSentence(sentence.raw))
  .map((sentence) => sentence.raw)

  for (const sentence of sentences) {
    const words = sentence.split(' ')

    if (words.length + paragraph.length > MAX_PARAGRAPH_SIZE) {
      paragraphs.push(paragraph.join(' ').slice(0))
      paragraph = []
    }

    paragraph = paragraph.concat(words)
  }

  if (paragraph.length) {
    paragraphs.push(paragraph.join(' '))
  }

  return paragraphs
}

const searchSchema = z.object({
  question: z.string()
})

const ask = async (req: Request, res: Response) => {
  const input = await searchSchema.parseAsync(req.body)
  const userId = req.session.userId
  const resp = await lookUp(userId, input.question)

  log.debug(resp)

  const result = await Promise.all(
    resp.map(async ({ content }) => {
      if(!content) return {answer: '', score: 100}

      return await Promise.all(
        getParagraphs(content).map( (paragraph) => { 
        log.debug(paragraph)
 
        return getAnswer(input.question, paragraph)
      })
      )
    })
  )

  res.status(200).json(result)
}

router.post('/ask', express.json(), safeRouteHandler(ask))

export default router