import express, { Request, Response } from 'express'
import Redis from 'ioredis'

import { redisConfig, serverConfig } from './config'
import { errorHandler, sessionStore } from './lib/express'
import logger from './lib/log'
import pdfRouter from './pdf-processing/handler'
import userRouter from './users/handler'

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
app.get('/', (_req: Request, res: Response) => {
  res.sendFile(`${__dirname}/index.html`)
})

app.use('/v1', userRouter)
app.use('/knowledge-source', pdfRouter)

app.use(errorHandler(logger))

export { app }
