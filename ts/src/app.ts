import express, { Request, Response } from 'express'
import multer from 'multer'

const upload = multer({
  dest: 'uploads/',
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
