import express, { Request, Response, Router } from 'express'
import * as z from 'zod'

import { safeRouteHandler } from '../lib/express'
import { getAnswer } from './qa'
import { lookUp } from './search'

const router = Router()

const searchSchema = z.object({
  question: z.string()
})

const ask = async (req: Request, res: Response) => {
  const input = await searchSchema.parseAsync(req.body)
  const userId = req.session.userId

  const resp = await lookUp(userId, input.question)
  const { content } = resp
  const result = await Promise.all(
    content
      .split('....')
      .filter((contentOption) => contentOption.length > 0)
      .map((contentOption) => {
        console.log(contentOption)
        console.log('contentOption finihsed')

        return getAnswer(input.question, contentOption)
      })
  )

  res.status(200).json(result)
}

router.post('/ask', express.json(), safeRouteHandler(ask))

export default router
