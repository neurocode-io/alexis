import express, { Request, Response } from 'express'

import { serverConfig } from './config'
import { errorHandler, uploadHandler } from './lib/express'
import logger from './lib/log'
import { storePdf } from './pdf-processing/store'
import userRouter from './users/handler'
import { createIdx } from './users/redis'

const app = express()

app.disable('x-powered-by')
app.set('port', serverConfig.port)

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
