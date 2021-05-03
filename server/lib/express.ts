import connect from 'connect-redis'
import { NextFunction, Request, Response } from 'express'
import session from 'express-session'
import multer from 'multer'
import { BaseLogger } from 'pino'

const uploadHandler = (destination: string, maxSize?: number) => {
  const storage = multer.diskStorage({
    destination,
    filename: (_, file, callback) => callback(null, file.originalname)
  })

  const upload = multer({
    storage,
    limits: {
      fileSize: maxSize ?? 30 * 1e6 // 30MB
    }
  })

  return upload
}

const errorHandler = (logger: BaseLogger) => (
  err: Error & { serialize: () => string; getCode: () => number; type?: string },
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (typeof err.serialize === 'function') {
    logger.warn(err)

    return res.status(err.getCode()).json(err.serialize())
  }

  if (err.type?.includes('entity.parse.failed')) {
    logger.warn(err)

    return res.status(400).json({
      error: {
        name: 'ValidationError',
        code: 400,
        msg: 'Invalid body',
        retryable: false
      }
    })
  }

  logger.error(err)

  return res.status(500).json({ error: 'Something failed' })
}

const safeRouteHandler = (func: (req: Request, res: Response) => Promise<void>) =>
  function asyncWrap(req: Request, res: Response, next: NextFunction) {
    Promise.resolve(func(req, res)).catch(next)
  }

type SessionInput = {
  appName: string
  sessionSecret: string
  redisClient: connect.Client
  secure: boolean
}

const sessionStore = (opts: SessionInput) => {
  const RedisStore = connect(session)

  return session({
    secret: opts.sessionSecret,
    store: new RedisStore({
      client: opts.redisClient,
      prefix: 'session:'
    }),
    name: opts.appName,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: opts.secure
    }
  })
}

const auth = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.session

  if (!userId) {
    return res.status(401).json({
      error: {
        name: 'AuthenticationError',
        code: 401,
        msg: 'User is unauthenitcated',
        retryable: false
      }
    })
  }

  return next()
}

export { auth, errorHandler, safeRouteHandler, sessionStore, uploadHandler }
