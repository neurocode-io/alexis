import express, { Request, Response, Router } from 'express'

import { createError } from '../lib/error'
import { safeRouteHandler } from '../lib/express'
import log from '../lib/log'
import { errors } from './errors'
import * as s from './service'
import { loginSchema, userSchema } from './types'

const router = Router()

const signup = async (req: Request, res: Response) => {
  const user = await userSchema.parseAsync(req.body).catch((err) => createError(errors.validationError, err))

  await s.createUser(user)

  res.json({ result: 'ok' })
}

const login = async (req: Request, res: Response) => {
  const loginInput = await loginSchema.parseAsync(req.body).catch((err) => createError(errors.validationError, err))

  const userId = await s.checkUser(loginInput.email, loginInput.password)

  req.session.userId = userId
  res.json({ result: 'ok' })
}

const logout = (req: Request, res: Response) => {
  const { userId } = req.session

  if (userId)
    req.session.destroy((err) => {
      log.warn(err)
      log.warn(`Could not logout user ${userId}`)
    })

  res.json({ result: 'ok' })
}

router.post('/users', express.json(), safeRouteHandler(signup))
router.post('/login', express.json(), safeRouteHandler(login))
router.get('/logout', logout)

export default router
