import express from 'express'
import Redis from 'ioredis'

import qaRouter from './answering/handler'
import { redisConfig, serverConfig } from './config'
import { errorHandler, sessionStore } from './lib/express'
import logger from './lib/log'
import pdfRouter from './pdf-processing/handler'
import userRouter from './features/users/router'

const app = express()

app.disable('x-powered-by')
app.set('port', serverConfig.port)
app.use(
  sessionStore({
    redisClient: new Redis({ ...redisConfig, db: 1 }),
    appName: serverConfig.appName,
    sessionSecret: serverConfig.sessionSecret,
    secure: process.env.NODE_ENV === 'production'
  })
)

app.use('/v1', userRouter)
app.use('/v1', qaRouter)
app.use(pdfRouter)

app.use(errorHandler(logger))

export { app }
