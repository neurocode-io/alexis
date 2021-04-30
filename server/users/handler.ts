import bcrypt from 'bcrypt'
import express, { Request, Response, Router } from 'express'
import * as uuid from 'uuid'

import { createError } from '../lib/error'
import { safeRouteHandler } from '../lib/express'
import log from '../lib/log'
import { errors } from './errors'
import * as s from './service'
import { loginSchema, userSchema } from './types'

const saltRounds = 7
const router = Router()

const signup = async (req: Request, res: Response) => {
  const user = await userSchema.parseAsync(req.body).catch((err) => createError(errors.validationError, err))

  log.info('Creating user')
  const password = user.password

  user.password = await bcrypt.hash(password, saltRounds)
  log.info(user.password)
  await s.createUser(uuid.v4(), user)

  log.info('iser created')

  res.status(200).json({ result: 'ok' })
}

const login = async (req: Request, res: Response) => {
  const loginInput = await loginSchema.parseAsync(req.body).catch((err) => createError(errors.validationError, err))

  log.info('checking')
  await s.checkUser(loginInput.email, loginInput.password)

  res.status(200).json({ result: 'ok' })
  //   res.cookie('alexis', 'asd', { maxAge: 900000, httpOnly: true })
  //   res.redirect('/app')
}

router.post('/users', express.json(), safeRouteHandler(signup))
router.post('/login', express.json(), safeRouteHandler(login))

export default router
