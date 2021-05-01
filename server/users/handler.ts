import express, { Request, Response, Router } from 'express'

import { createError } from '../lib/error'
import { safeRouteHandler } from '../lib/express'
import { errors } from './errors'
import * as s from './service'
import { loginSchema, userSchema } from './types'

const router = Router()

const signup = async (req: Request, res: Response) => {
  const user = await userSchema.parseAsync(req.body).catch((err) => createError(errors.validationError, err))

  await s.createUser(user)

  res.status(200).json({ result: 'ok' })
}

const login = async (req: Request, res: Response) => {
  const loginInput = await loginSchema.parseAsync(req.body).catch((err) => createError(errors.validationError, err))

  await s.checkUser(loginInput.email, loginInput.password)

  res.status(200).json({ result: 'ok' })
}

router.post('/users', express.json(), safeRouteHandler(signup))
router.post('/login', express.json(), safeRouteHandler(login))

export default router
