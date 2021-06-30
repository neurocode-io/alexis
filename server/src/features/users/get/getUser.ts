import { Request, Response } from 'express'
import { getUser } from './data'
import * as z from 'zod'
import { createError } from '../../../lib/error'

const response = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  pdfs: z.array(z.object({ id: z.string(), fileName: z.string() })).min(1)
})

const errors = {
  validationError: {
    name: 'InteralServerError',
    code: 500,
    msg: 'Invalid data',
    retryable: false
  }
}

const getCurrentUser = async (req: Request, res: Response) => {
  const user = await getUser(req.session.userId)

  const result = await response.parseAsync(user).catch((err) => createError(errors.validationError, err))

  res.json({ result })
}

export { getCurrentUser }
