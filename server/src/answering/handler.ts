import express, { Request, Response, Router } from 'express'
import * as z from 'zod'

import { auth, safeRouteHandler } from '../lib/express'
import log from '../lib/log'
import { getAnswer } from './qa'
import { lookUp } from './search'

const router = Router()

const searchSchema = z.object({
  query: z.string()
})

const ask = async (req: Request, res: Response) => {
  const input = await searchSchema.parseAsync(req.body)
  const userId = req.session.userId
  const resp = await lookUp(userId, input.query)

  if (resp.length === 0) {
    res.json({ result: [{ score: 100, answer: '' }] })
    return
  }

  log.debug(resp)

  const result = await Promise.all(
    resp.map(({ content }) => {
      log.debug(content)
      log.debug('content finished')

      return getAnswer(input.query, content)
    })
  )

  const cleaned = result
    .sort((a, b) => {
      if (!a.answer) return 1
      if (!b.answer) return -1

      return b.score - a.score
    })
    .filter((r) => r.answer.length > 0)

  if (cleaned.length === 0) {
    res.json({ result: [{ score: 100, answer: '' }] })
    return
  }

  res.status(200).json({ result: cleaned })
}

router.post('/ask', auth, express.json(), safeRouteHandler(ask))

export default router
