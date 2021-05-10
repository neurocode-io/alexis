import express, { Request, Response, Router } from 'express'
import * as z from 'zod'

import { safeRouteHandler } from '../lib/express'
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
      log.debug('content finihsed')

      return getAnswer(input.query, content)
    })
  )

  res.status(200).json({ result })
}

router.post('/ask', express.json(), safeRouteHandler(ask))

export default router
