import { NextFunction, Request, Response } from 'express'
import multer from 'multer'
import { BaseLogger } from 'pino'

const uploadHandler = (maxSize?: number, destination?: string) => {
  const storage = multer.diskStorage({
    destination: destination ?? 'uploads/',
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
  err: Error & { serialize: () => string; getCode: () => number },
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (typeof err.serialize === 'function') {
    logger.warn(err)

    return res.status(err.getCode()).json(err.serialize())
  }

  logger.error(err)

  return res.status(500).json({ error: 'Something failed' })
}

const safeRouteHandler = (func: (req: Request, res: Response) => Promise<void>) =>
  function asyncWrap(req: Request, res: Response, next: NextFunction) {
    Promise.resolve(func(req, res)).catch(next)
  }

export { errorHandler, safeRouteHandler, uploadHandler }
