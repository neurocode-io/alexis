import express, { Request, Response, Router } from 'express'
import * as z from 'zod'

import { auth, safeRouteHandler } from '../lib/express'
import { answerService } from './service'

const router = Router()

const searchSchema = z.object({
  query: z.string()
})

const ask = async (req: Request, res: Response) => {
  const input = await searchSchema.parseAsync(req.body)
  const userId = req.session.userId

  const result = await answerService(userId, input.query)

  res.json(result)
}

router.post('/query', auth, express.json(), safeRouteHandler(ask))

export default router
