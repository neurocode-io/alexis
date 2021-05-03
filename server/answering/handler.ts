import { Request, Response, Router } from 'express'
import * as z from 'zod'

import { safeRouteHandler } from '../lib/express'
// import { getAnswer } from './qa'
import { lookUp } from './search'

const router = Router()

const searchSchema = z.object({
  question: z.string()
})

const ask = async (req: Request, res: Response) => {
  console.log(req.body)
  const input = await searchSchema.parseAsync(req.body)
  const userId = req.session.userId

  const content = await lookUp(userId, input.question)

  console.log(content)

  // const answer = await getAnswer(input.question, content)

  res.status(200).json(content)
}

router.post('/ask', safeRouteHandler(ask))

export default router
