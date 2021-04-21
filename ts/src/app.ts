import express, { Request, Response } from 'express'
import Redis from 'ioredis'
import multer from 'multer'

import { serverConfig } from './config'
import { loadPdfFromUrl } from './load'

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

const app = express()

app.use(express.json())
const redis = new Redis()

void loadPdfFromUrl(`${__dirname}/../test-files/book.pdf`).then(() => {
  app.get('/', (_req: Request, res: Response) => {
    res.sendFile(`${__dirname}/index.html`)
  })
})

app.set('port', serverConfig.port)

app.get('/pdf/:page', async (req: Request, res: Response) => {
  res.send((await redis.hgetall(req.params.page ? req.params.page  : '0')).values)
})

app.post('/', upload.single('file-to-upload'), (_req: Request, res: Response) => {
  res.redirect('/')
})

export { app }
