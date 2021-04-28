import express, { NextFunction, Request, Response, Router } from 'express'

import { createError } from '../lib/error'
import { errors } from './errors'
import { userSchema } from './types'

const r = Router()

// eslint-disable-next-line @typescript-eslint/ban-types
const safeRoute = (func: Function) =>
  function asyncWrap(req: Request, res: Response, next: NextFunction, ...args: string[]) {
    const fnReturn = func(req, res, next, ...args)

    return Promise.resolve(fnReturn).catch(next)
  }

const createUser = async (req: Request, res: Response) => {
  try {
    await userSchema.parseAsync(req.body)
  } catch (err) {
    createError(errors.validationError, err)
  }

  return res.json({ msg: 'ok' })
}

r.post('/users', express.json(), safeRoute(createUser))

export default safeRoute(r)
