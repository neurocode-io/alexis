import { Request, Response } from 'express'

import * as z from 'zod'
import { createError } from '../../../lib/error'
import { createUser } from './data'

const userRequest = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string().min(5)
})

const errors = {
  validationError: {
    name: 'ValidationError',
    code: 400,
    msg: 'Invalid input',
    retryable: false
  }
}

const create = async (req: Request, res: Response) => {
  const request = await userRequest.parseAsync(req.body).catch((err) => createError(errors.validationError, err))

  await createUser(request)

  res.json({ result: 'ok' })
}

export { create }
