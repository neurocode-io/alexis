import express, { Request, Response, Router } from 'express'
import * as z from 'zod'

import { safeRouteHandler } from '../lib/express'
import { getAnswer } from './qa'
// import { getAnswer } from './qa'
import { lookUp } from './search'

const router = Router()

const searchSchema = z.object({
  question: z.string()
})

const ask = async (req: Request, res: Response) => {
  const input = await searchSchema.parseAsync(req.body)
  const userId = req.session.userId

  const resp = await lookUp(userId, input.question)

  console.log(resp)

  const result = await Promise.all(
    resp.map(({ content }) => {
      return getAnswer(input.question, content)
    })
  )

  res.status(200).json(result)
}

router.post('/ask', express.json(), safeRouteHandler(ask))

export default router
