import express, { Request, Response, Router } from 'express'

import { createError } from '../lib/error'
import { safeRouteHandler } from '../lib/express'
import { errors } from './errors'
import { userSchema } from './types'

const r = Router()

const createUser = async (req: Request, res: Response) => {
  await userSchema.parseAsync(req.body).catch((err) => createError(errors.validationError, err))

  res.status(200).json({ msg: 'ok' })
}

r.post('/users', express.json(), safeRouteHandler(createUser))

export default r
