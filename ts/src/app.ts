import express, { Request, Response } from 'express'
import multer from 'multer'

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (_, file, callback) {
    callback(null, file.originalname)
  },
})

const upload = multer({
  storage,
  limits: {
    fileSize: 30 * 1e6, // 30MB
  },
})

const app = express()

app.set('port', process.env.PORT || 3000)

app.get('/', (_req: Request, res: Response) => {
  res.sendFile(`${__dirname}/index.html`)
})

app.post('/', upload.single('file-to-upload'), (_req: Request, res: Response) => {
  res.redirect('/')
})

export { app }
