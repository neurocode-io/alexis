import express, { NextFunction, Request, Response } from 'express'
import multer from 'multer'

import { serverConfig } from './config'
import { APIerror } from './lib/error'
import log from './lib/log'
import { storePdf } from './pdf-processing/store'
import userRouter from './users/handler'
import { createIdx } from './users/redis'

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, callback) => callback(null, file.originalname)
})

const upload = multer({
  storage,
  limits: {
    fileSize: 30 * 1e6 // 30MB
  }
})

function catchAll(_: APIerror, __: Request, res: Response, ___: NextFunction) {
  log.error('bad')
  res.status(500)

  return res.json({ error: 'Something failed' })
}

const errorHandler = (err: APIerror, _: Request, res: Response, __: NextFunction) => {
  log.warn('errorHandler')
  if (typeof err.serialize === 'function') {
    log.warn(err)

    return res.status(err.getCode()).json(err.serialize())
  }

  log.error('err')

  return res.status(500).json({ error: 'Something failed' })
}

const app = express()

app.disable('x-powered-by')
app.set('port', serverConfig.port)
app.use(errorHandler)
app.use(catchAll)

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.use('/v1', userRouter)

app.get('/', (_req: Request, res: Response) => {
  res.sendFile(`${__dirname}/index.html`)
})

app.post('/', upload.single('file-to-upload'), async (req: Request, res: Response) => {
  console.log(req.file)
  const pdfId = await storePdf(req.file.filename)

  await createIdx(pdfId)

  res.redirect('/')
})

export { app }
