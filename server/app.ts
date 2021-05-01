import express, { Request, Response } from 'express'
import Redis from 'ioredis'

import { redisConfig, serverConfig } from './config'
import { errorHandler, sessionStore, uploadHandler } from './lib/express'
import logger from './lib/log'
import { storePdf } from './pdf-processing/store'
import userRouter from './users/handler'
import { createIdx } from './users/service'

const app = express()

app.disable('x-powered-by')
app.set('port', serverConfig.port)
app.use(
  sessionStore({
    redisClient: new Redis(redisConfig),
    appName: serverConfig.appName,
    sessionSecret: serverConfig.sessionSecret,
    secure: process.env.NODE_ENV === 'production'
  })
)
app.use('/v1', userRouter)

app.get('/', (_req: Request, res: Response) => {
  res.sendFile(`${__dirname}/index.html`)
})

app.post(
  '/',
  uploadHandler(serverConfig.maxPDFSize, serverConfig.uploadDestionation).single('file-to-upload'),
  async (req: Request, res: Response) => {
    const pdfId = await storePdf(req.file.filename)

    await createIdx(pdfId)

    res.redirect('/')
  }
)

app.use(errorHandler(logger))

export { app }
